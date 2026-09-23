using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GovPortal.API.Data;
using GovPortal.API.DTOs;
using GovPortal.API.Entities;
using GovPortal.API.Entities.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "ADMINISTRATOR")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        private Guid GetUserId()
        {
            var claimVal = User.FindFirst("UserId")?.Value 
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst("sub")?.Value;

            return Guid.TryParse(claimVal, out var id) ? id : Guid.Empty;
        }

        private async Task LogAuditAsync(string action, string entityType, string entityId, string? oldValues = null, string? newValues = null)
        {
            var userId = GetUserId();
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = Request.Headers["User-Agent"].ToString();

            var auditLog = new AuditLog
            {
                UserId = userId != Guid.Empty ? userId : null,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Timestamp = DateTime.UtcNow,
                IpAddress = ip,
                UserAgent = userAgent,
                OldValues = oldValues,
                NewValues = newValues
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<AdminDashboardStatsDto>> GetDashboardStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalStartups = await _context.StartupProfiles.CountAsync();
            var totalDepartments = await _context.Departments.CountAsync();
            var activeChallenges = await _context.Challenges
                .Where(c => c.Status != ChallengeStatus.Cancelled)
                .CountAsync();
            var activePilots = await _context.SandboxTrials
                .Where(t => t.Status == "PILOT_ACTIVE")
                .CountAsync();
            var pendingVerifications = await _context.StartupProfiles
                .Where(s => !s.IsActive)
                .CountAsync();

            var recentAuditLogsEntities = await _context.AuditLogs
                .OrderByDescending(a => a.Timestamp)
                .Take(15)
                .ToListAsync();

            var userIds = recentAuditLogsEntities.Where(a => a.UserId.HasValue).Select(a => a.UserId!.Value).Distinct().ToList();
            var userNames = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Username);

            var recentAuditLogs = recentAuditLogsEntities.Select(a => new AdminAuditLogDto
            {
                Id = a.Id,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                Timestamp = a.Timestamp,
                Username = a.UserId.HasValue && userNames.ContainsKey(a.UserId.Value) ? userNames[a.UserId.Value] : "System / Anonymous",
                IpAddress = a.IpAddress
            }).ToList();

            return Ok(new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalStartups = totalStartups,
                TotalDepartments = totalDepartments,
                ActiveChallenges = activeChallenges,
                ActivePilots = activePilots,
                PendingVerifications = pendingVerifications,
                SystemHealth = "Healthy",
                RecentAuditLogs = recentAuditLogs
            });
        }

        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserDto>>> GetUsers([FromQuery] string? search = null, [FromQuery] string? role = null)
        {
            var query = _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.Department)
                .Include(u => u.StartupProfile)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(u => u.Username.ToLower().Contains(term) || 
                                         u.Email.ToLower().Contains(term) || 
                                         u.MobileNumber.Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(role))
            {
                query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name == role));
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new AdminUserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    MobileNumber = u.MobileNumber,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    DepartmentName = u.Department != null ? u.Department.Name : null,
                    StartupCompanyName = u.StartupProfile != null ? u.StartupProfile.CompanyName : null
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            // Prevent self-lockout
            var currentUserId = GetUserId();
            if (user.Id == currentUserId && user.IsActive)
            {
                return BadRequest(new { success = false, message = "You cannot deactivate your own administrator account." });
            }

            var oldStatus = user.IsActive;
            user.IsActive = !user.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await LogAuditAsync(
                action: user.IsActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
                entityType: "User",
                entityId: user.Id.ToString(),
                oldValues: $"IsActive={oldStatus}",
                newValues: $"IsActive={user.IsActive}"
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = $"User {(user.IsActive ? "activated" : "deactivated")} successfully",
                isActive = user.IsActive
            });
        }

        [HttpGet("departments")]
        public async Task<ActionResult<List<AdminDepartmentDto>>> GetDepartments()
        {
            var depts = await _context.Departments
                .Select(d => new AdminDepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    IsActive = d.IsActive,
                    UserCount = d.Users.Count(),
                    ChallengeCount = d.Challenges.Count(),
                    CreatedAt = d.CreatedAt
                })
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(depts);
        }

        [HttpPost("departments")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest(new { success = false, message = "Department name is required" });
            }

            var exists = await _context.Departments.AnyAsync(d => d.Name.ToLower() == dto.Name.Trim().ToLower());
            if (exists)
            {
                return BadRequest(new { success = false, message = "A department with this name already exists" });
            }

            var dept = new Department
            {
                Name = dto.Name.Trim(),
                Description = dto.Description.Trim(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();

            await LogAuditAsync(
                action: "CREATE_DEPARTMENT",
                entityType: "Department",
                entityId: dept.Id.ToString(),
                newValues: $"Name={dept.Name}"
            );

            return Ok(new
            {
                success = true,
                message = "Department onboarded successfully",
                department = new AdminDepartmentDto
                {
                    Id = dept.Id,
                    Name = dept.Name,
                    Description = dept.Description,
                    IsActive = dept.IsActive,
                    UserCount = 0,
                    ChallengeCount = 0,
                    CreatedAt = dept.CreatedAt
                }
            });
        }

        [HttpPut("departments/{id}/toggle-status")]
        public async Task<IActionResult> ToggleDepartmentStatus(Guid id)
        {
            var dept = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
            if (dept == null)
            {
                return NotFound(new { success = false, message = "Department not found" });
            }

            dept.IsActive = !dept.IsActive;
            dept.UpdatedAt = DateTime.UtcNow;

            await LogAuditAsync(
                action: dept.IsActive ? "ACTIVATE_DEPARTMENT" : "DEACTIVATE_DEPARTMENT",
                entityType: "Department",
                entityId: dept.Id.ToString(),
                newValues: $"IsActive={dept.IsActive}"
            );

            await _context.SaveChangesAsync();

            return Ok(new { success = true, isActive = dept.IsActive });
        }

        [HttpGet("startups")]
        public async Task<ActionResult<List<AdminStartupDto>>> GetStartups()
        {
            var startups = await _context.StartupProfiles
                .Include(s => s.User)
                .Select(s => new AdminStartupDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    CompanyName = s.CompanyName,
                    DpiitRecognitionNumber = s.DpiitRecognitionNumber,
                    Pan = s.Pan,
                    CinOrLlpin = s.CinOrLlpin,
                    ProductSolutionName = s.ProductSolutionName,
                    CurrentProductStage = s.CurrentProductStage,
                    UserEmail = s.User.Email,
                    IsVerified = s.IsActive,
                    ApplicationCount = s.ChallengeApplications.Count(),
                    CreatedAt = s.CreatedAt
                })
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(startups);
        }

        [HttpPut("startups/{id}/verify")]
        public async Task<IActionResult> ToggleStartupVerification(Guid id)
        {
            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.Id == id);
            if (startup == null)
            {
                return NotFound(new { success = false, message = "Startup profile not found" });
            }

            startup.IsActive = !startup.IsActive;
            startup.UpdatedAt = DateTime.UtcNow;

            await LogAuditAsync(
                action: startup.IsActive ? "VERIFY_STARTUP_DPIIT" : "REVOKE_STARTUP_VERIFICATION",
                entityType: "StartupProfile",
                entityId: startup.Id.ToString(),
                newValues: $"IsVerified={startup.IsActive}, CompanyName={startup.CompanyName}"
            );

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = startup.IsActive ? "Startup DPIIT verification approved" : "Startup verification revoked",
                isVerified = startup.IsActive
            });
        }

        [HttpGet("audit-logs")]
        public async Task<ActionResult<List<AdminAuditLogDto>>> GetAuditLogs([FromQuery] int limit = 50)
        {
            var logs = await _context.AuditLogs
                .OrderByDescending(a => a.Timestamp)
                .Take(Math.Min(limit, 200))
                .ToListAsync();

            var userIds = logs.Where(a => a.UserId.HasValue).Select(a => a.UserId!.Value).Distinct().ToList();
            var userNames = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Username);

            var result = logs.Select(a => new AdminAuditLogDto
            {
                Id = a.Id,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                Timestamp = a.Timestamp,
                Username = a.UserId.HasValue && userNames.ContainsKey(a.UserId.Value) ? userNames[a.UserId.Value] : "System / Anonymous",
                IpAddress = a.IpAddress
            }).ToList();

            return Ok(result);
        }

        [HttpGet("settings")]
        public async Task<ActionResult<List<AdminSystemSettingDto>>> GetSettings()
        {
            // Seed defaults if empty
            if (!await _context.SystemSettings.AnyAsync())
            {
                var defaults = new List<SystemSetting>
                {
                    new SystemSetting
                    {
                        SettingKey = "RULE_149_TURNOVER_EXEMPTION",
                        SettingValue = "ENABLED",
                        Description = "Exempt DPIIT recognized startups from 3-year turnover and prior commercial track record requirements under GFR Rule 149."
                    },
                    new SystemSetting
                    {
                        SettingKey = "MAX_SANDBOX_PILOT_GRANT",
                        SettingValue = "2500000",
                        Description = "Maximum milestone-linked grant cap (in INR) allocated per 90-day sandbox pilot testing phase."
                    },
                    new SystemSetting
                    {
                        SettingKey = "EMD_DEPOSIT_EXEMPTION",
                        SettingValue = "ENABLED",
                        Description = "100% waiver of Earnest Money Deposit (EMD) and tender document fees for eligible deep-tech innovators."
                    },
                    new SystemSetting
                    {
                        SettingKey = "DEFAULT_PILOT_DURATION_DAYS",
                        SettingValue = "90",
                        Description = "Standard regulatory sandbox pilot execution timeframe before independent validation review."
                    }
                };

                _context.SystemSettings.AddRange(defaults);
                await _context.SaveChangesAsync();
            }

            var settings = await _context.SystemSettings
                .OrderBy(s => s.SettingKey)
                .Select(s => new AdminSystemSettingDto
                {
                    Id = s.Id,
                    SettingKey = s.SettingKey,
                    SettingValue = s.SettingValue,
                    Description = s.Description,
                    IsActive = s.IsActive,
                    UpdatedAt = s.UpdatedAt
                })
                .ToListAsync();

            return Ok(settings);
        }

        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSetting([FromBody] UpdateSystemSettingDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.SettingKey))
            {
                return BadRequest(new { success = false, message = "Setting key is required" });
            }

            var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.SettingKey == dto.SettingKey);
            if (setting == null)
            {
                setting = new SystemSetting
                {
                    SettingKey = dto.SettingKey,
                    SettingValue = dto.SettingValue,
                    Description = dto.Description ?? string.Empty,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.SystemSettings.Add(setting);
            }
            else
            {
                var oldVal = setting.SettingValue;
                setting.SettingValue = dto.SettingValue;
                if (!string.IsNullOrWhiteSpace(dto.Description))
                {
                    setting.Description = dto.Description;
                }
                setting.UpdatedAt = DateTime.UtcNow;

                await LogAuditAsync(
                    action: "UPDATE_SYSTEM_SETTING",
                    entityType: "SystemSetting",
                    entityId: setting.Id.ToString(),
                    oldValues: oldVal,
                    newValues: setting.SettingValue
                );
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Setting saved successfully" });
        }
    }
}
