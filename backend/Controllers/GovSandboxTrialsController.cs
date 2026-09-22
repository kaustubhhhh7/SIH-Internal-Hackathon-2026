using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GovPortal.API.Data;
using GovPortal.API.DTOs;
using GovPortal.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Controllers
{
    [Route("api/gov/sandbox-trials")]
    [ApiController]
    [Authorize]
    public class GovSandboxTrialsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GovSandboxTrialsController(ApplicationDbContext context)
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

        private string GetUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? "Government Officer";
        }

        private async Task<Department?> GetUserDepartmentAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Department != null) return user.Department;
            return await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
        }

        [HttpGet("helpers")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,ADMINISTRATOR")]
        public async Task<IActionResult> GetFormHelpers()
        {
            var userId = GetUserId();
            var department = await GetUserDepartmentAsync(userId);

            var startups = await _context.StartupProfiles
                .Select(s => new
                {
                    s.Id,
                    s.CompanyName,
                    s.DpiitRecognitionNumber,
                    s.ProductSolutionName,
                    s.CurrentProductStage
                })
                .ToListAsync();

            var departmentId = department?.Id ?? Guid.Empty;
            var challenges = await _context.Challenges
                .Where(c => c.DepartmentId == departmentId)
                .Select(c => new
                {
                    c.Id,
                    c.ChallengeReferenceNumber,
                    c.TitleEnglish,
                    c.Sector,
                    c.EstimatedBudget
                })
                .ToListAsync();

            var validators = await _context.Users
                .Where(u => u.UserRoles.Any(ur => ur.Role.Name == "INDEPENDENT_VALIDATOR"))
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email
                })
                .ToListAsync();

            return Ok(new
            {
                startups,
                challenges,
                validators,
                department = department != null ? new { department.Id, department.Name } : null
            });
        }

        [HttpGet]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,INDEPENDENT_VALIDATOR,PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<ActionResult<List<SandboxTrialSummaryDto>>> GetSandboxTrials(
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            var userId = GetUserId();
            var userRoles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var isGov = userRoles.Contains("GOVERNMENT_DEPARTMENT");
            var isValidator = userRoles.Contains("INDEPENDENT_VALIDATOR");

            IQueryable<SandboxTrial> query = _context.SandboxTrials
                .Include(t => t.Department)
                .Include(t => t.StartupProfile)
                .Include(t => t.Challenge)
                .Include(t => t.ValidatorUser)
                .Include(t => t.KPIs);

            if (isGov)
            {
                var department = await GetUserDepartmentAsync(userId);
                if (department == null) return Forbid();
                query = query.Where(t => t.DepartmentId == department.Id);
            }
            else if (isValidator)
            {
                query = query.Where(t => t.ValidatorUserId == userId || t.Status == "VALIDATION_PENDING");
            }

            if (!string.IsNullOrEmpty(status) && status != "ALL")
            {
                query = query.Where(t => t.Status == status);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(t => 
                    t.Title.Contains(search) || 
                    t.TrialReferenceNumber.Contains(search) ||
                    t.Location.Contains(search) ||
                    t.StartupProfile.CompanyName.Contains(search) ||
                    t.StartupProfile.ProductSolutionName.Contains(search));
            }

            var trials = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

            var result = trials.Select(t =>
            {
                var kpiList = t.KPIs.ToList();
                decimal overallProgress = kpiList.Any()
                    ? Math.Round(kpiList.Average(k => k.AchievementPercentage), 1)
                    : 0;

                return new SandboxTrialSummaryDto
                {
                    Id = t.Id,
                    TrialReferenceNumber = t.TrialReferenceNumber,
                    Title = t.Title,
                    DepartmentName = t.Department?.Name ?? "",
                    StartupName = t.StartupProfile?.CompanyName ?? "",
                    ProductSolutionName = t.StartupProfile?.ProductSolutionName ?? "",
                    ChallengeTitle = t.Challenge?.TitleEnglish,
                    TestingEnvironment = t.TestingEnvironment,
                    Location = t.Location,
                    DurationDays = t.DurationDays,
                    MaximumBudget = t.MaximumBudget,
                    Status = t.Status,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    OverallKPIProgress = overallProgress,
                    ValidatorName = t.ValidatorUser?.Username ?? "Pending Assignment",
                    CreatedAt = t.CreatedAt
                };
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SandboxTrialDetailsDto>> GetTrialDetails(Guid id)
        {
            var userId = GetUserId();
            var userRoles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var isGov = userRoles.Contains("GOVERNMENT_DEPARTMENT");

            var trial = await _context.SandboxTrials
                .Include(t => t.Department)
                .Include(t => t.StartupProfile)
                .Include(t => t.Challenge)
                .Include(t => t.ValidatorUser)
                .Include(t => t.KPIs).ThenInclude(k => k.Measurements)
                .Include(t => t.Milestones)
                .Include(t => t.Documents)
                .Include(t => t.StatusHistory)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trial == null) return NotFound();

            if (isGov)
            {
                var department = await GetUserDepartmentAsync(userId);
                if (department == null || trial.DepartmentId != department.Id) return Forbid();
            }

            var kpis = trial.KPIs.Select(k => new SandboxTrialKPIDto
            {
                Id = k.Id,
                Name = k.Name,
                Description = k.Description,
                Unit = k.Unit,
                BaselineValue = k.BaselineValue,
                TargetValue = k.TargetValue,
                LatestValue = k.LatestValue,
                AchievementPercentage = k.AchievementPercentage,
                MeasurementMethod = k.MeasurementMethod,
                Measurements = k.Measurements.OrderByDescending(m => m.MeasuredAt).Select(m => new KPIMeasurementDto
                {
                    Id = m.Id,
                    Value = m.Value,
                    MeasuredAt = m.MeasuredAt,
                    MeasuredByName = m.MeasuredByName,
                    Notes = m.Notes,
                    EvidenceDocumentUrl = m.EvidenceDocumentUrl
                }).ToList()
            }).ToList();

            var milestones = trial.Milestones.OrderBy(m => m.DueDate).Select(m => new TrialMilestoneDto
            {
                Id = m.Id,
                Name = m.Name,
                Percentage = m.Percentage,
                AllocatedAmount = m.AllocatedAmount,
                DueDate = m.DueDate,
                Status = m.Status,
                EvidenceSummary = m.EvidenceSummary,
                Remarks = m.Remarks,
                ApprovedAt = m.ApprovedAt
            }).ToList();

            var documents = trial.Documents.OrderByDescending(d => d.CreatedAt).Select(d => new TrialDocumentDto
            {
                Id = d.Id,
                Title = d.Title,
                DocumentType = d.DocumentType,
                FileUrl = d.FileUrl,
                Notes = d.Notes,
                CreatedAt = d.CreatedAt
            }).ToList();

            var history = trial.StatusHistory.OrderByDescending(h => h.ChangedAt).Select(h => new TrialStatusHistoryDto
            {
                Id = h.Id,
                PreviousStatus = h.PreviousStatus,
                NewStatus = h.NewStatus,
                ChangedByName = h.ChangedByName,
                ChangedAt = h.ChangedAt,
                Reason = h.Reason
            }).ToList();

            decimal overallProgress = kpis.Any()
                ? Math.Round(kpis.Average(k => k.AchievementPercentage), 1)
                : 0;

            var result = new SandboxTrialDetailsDto
            {
                Id = trial.Id,
                TrialReferenceNumber = trial.TrialReferenceNumber,
                Title = trial.Title,
                DepartmentName = trial.Department?.Name ?? "",
                StartupName = trial.StartupProfile?.CompanyName ?? "",
                ProductSolutionName = trial.StartupProfile?.ProductSolutionName ?? "",
                ChallengeTitle = trial.Challenge?.TitleEnglish,
                TestingEnvironment = trial.TestingEnvironment,
                Location = trial.Location,
                Objective = trial.Objective,
                DurationDays = trial.DurationDays,
                MaximumBudget = trial.MaximumBudget,
                ExpectedOutcomes = trial.ExpectedOutcomes,
                RiskMitigationPlan = trial.RiskMitigationPlan,
                Status = trial.Status,
                StartDate = trial.StartDate,
                EndDate = trial.EndDate,
                ApprovedAt = trial.ApprovedAt,
                CompletedAt = trial.CompletedAt,
                StartupProfileId = trial.StartupProfileId,
                DepartmentId = trial.DepartmentId,
                ChallengeId = trial.ChallengeId,
                ChallengeApplicationId = trial.ChallengeApplicationId,
                ValidatorUserId = trial.ValidatorUserId,
                ValidatorName = trial.ValidatorUser?.Username ?? "Pending Assignment",
                CreatedBy = trial.CreatedBy,
                CreatedAt = trial.CreatedAt,
                OverallKPIProgress = overallProgress,
                KPIs = kpis,
                Milestones = milestones,
                Documents = documents,
                StatusHistory = history
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
        public async Task<ActionResult<SandboxTrialDetailsDto>> CreateSandboxTrial(CreateSandboxTrialDto dto)
        {
            var userId = GetUserId();
            var department = await GetUserDepartmentAsync(userId);
            if (department == null) return Forbid();

            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.Id == dto.StartupProfileId);
            if (startup == null) return BadRequest("Invalid startup selected.");

            // Generate clean reference number e.g. SBX-MH-2026-00001
            var count = await _context.SandboxTrials.CountAsync() + 1;
            var refNumber = $"SBX-MH-{DateTime.UtcNow.Year}-{count:D5}";

            var trial = new SandboxTrial
            {
                TrialReferenceNumber = refNumber,
                DepartmentId = department.Id,
                StartupProfileId = startup.Id,
                ChallengeId = dto.ChallengeId,
                ChallengeApplicationId = dto.ChallengeApplicationId,
                ValidatorUserId = dto.ValidatorUserId,
                Title = string.IsNullOrWhiteSpace(dto.Title) 
                    ? $"{startup.ProductSolutionName} - {dto.Location} Pilot" 
                    : dto.Title,
                TestingEnvironment = dto.TestingEnvironment,
                Location = dto.Location,
                Objective = dto.Objective,
                DurationDays = dto.DurationDays > 0 ? dto.DurationDays : 90,
                MaximumBudget = dto.MaximumBudget,
                ExpectedOutcomes = dto.ExpectedOutcomes,
                RiskMitigationPlan = dto.RiskMitigationPlan,
                Status = "DRAFT",
                CreatedBy = userId.ToString(),
                UpdatedBy = userId.ToString()
            };

            // Add Initial KPIs
            if (dto.KPIs != null && dto.KPIs.Any())
            {
                foreach (var k in dto.KPIs)
                {
                    trial.KPIs.Add(new SandboxTrialKPI
                    {
                        Name = k.Name,
                        Description = k.Description,
                        Unit = k.Unit,
                        BaselineValue = k.BaselineValue,
                        TargetValue = k.TargetValue,
                        LatestValue = k.BaselineValue,
                        AchievementPercentage = 0,
                        MeasurementMethod = k.MeasurementMethod,
                        CreatedBy = userId.ToString()
                    });
                }
            }

            // Add Initial Milestones (or default 30-40-30 split)
            var milestoneList = dto.Milestones != null && dto.Milestones.Any()
                ? dto.Milestones
                : new List<CreateMilestoneDto>
                {
                    new CreateMilestoneDto { Name = "Stage 1: Field Mobilization & Telemetry Hookup", Percentage = 30, DueDate = DateTime.UtcNow.AddDays(15) },
                    new CreateMilestoneDto { Name = "Stage 2: Mid-Trial Performance & Data Verification", Percentage = 40, DueDate = DateTime.UtcNow.AddDays(45) },
                    new CreateMilestoneDto { Name = "Stage 3: Full Operational Evaluation & Final Handover", Percentage = 30, DueDate = DateTime.UtcNow.AddDays(90) }
                };

            foreach (var m in milestoneList)
            {
                var allocated = Math.Round((trial.MaximumBudget * m.Percentage) / 100, 2);
                trial.Milestones.Add(new TrialMilestone
                {
                    Name = m.Name,
                    Percentage = m.Percentage,
                    AllocatedAmount = allocated,
                    DueDate = m.DueDate,
                    Status = "PENDING",
                    CreatedBy = userId.ToString()
                });
            }

            trial.StatusHistory.Add(new TrialStatusHistory
            {
                PreviousStatus = "NONE",
                NewStatus = "DRAFT",
                ChangedByUserId = userId,
                ChangedByName = GetUserName(),
                Reason = "Sandbox trial request drafted."
            });

            _context.SandboxTrials.Add(trial);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTrialDetails), new { id = trial.Id }, new { trial.Id, trial.TrialReferenceNumber });
        }

        [HttpPost("{id}/status")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,ADMINISTRATOR")]
        public async Task<ActionResult> UpdateTrialStatus(Guid id, [FromBody] TrialStatusChangeDto dto)
        {
            var userId = GetUserId();
            var department = await GetUserDepartmentAsync(userId);
            var trial = await _context.SandboxTrials.FirstOrDefaultAsync(t => t.Id == id);

            if (trial == null) return NotFound();
            if (department != null && trial.DepartmentId != department.Id) return Forbid();

            var prevStatus = trial.Status;
            var action = dto.Action.ToUpper();
            var newStatus = prevStatus;

            switch (action)
            {
                case "SUBMIT":
                    if (prevStatus != "DRAFT") return BadRequest("Only DRAFT can be submitted.");
                    newStatus = "SUBMITTED";
                    break;
                case "APPROVE":
                    if (prevStatus != "SUBMITTED" && prevStatus != "UNDER_REVIEW") return BadRequest("Trial must be SUBMITTED to approve.");
                    newStatus = "APPROVED";
                    trial.ApprovedAt = DateTime.UtcNow;
                    break;
                case "REJECT":
                    newStatus = "REJECTED";
                    break;
                case "START":
                    if (prevStatus != "APPROVED") return BadRequest("Trial must be APPROVED to start.");
                    newStatus = "PILOT_ACTIVE";
                    trial.StartDate = DateTime.UtcNow;
                    trial.EndDate = DateTime.UtcNow.AddDays(trial.DurationDays);
                    break;
                case "REQUEST_VALIDATION":
                    if (prevStatus != "PILOT_ACTIVE") return BadRequest("Only active pilots can request validation.");
                    newStatus = "VALIDATION_PENDING";
                    break;
                case "COMPLETE_SUCCESS":
                    newStatus = "COMPLETED_SUCCESS";
                    trial.CompletedAt = DateTime.UtcNow;
                    break;
                case "COMPLETE_FAILED":
                    newStatus = "COMPLETED_FAILED";
                    trial.CompletedAt = DateTime.UtcNow;
                    break;
                case "CANCEL":
                    newStatus = "CANCELLED";
                    break;
                default:
                    return BadRequest("Invalid action.");
            }

            trial.Status = newStatus;
            trial.UpdatedAt = DateTime.UtcNow;
            trial.UpdatedBy = userId.ToString();

            trial.StatusHistory.Add(new TrialStatusHistory
            {
                SandboxTrialId = trial.Id,
                PreviousStatus = prevStatus,
                NewStatus = newStatus,
                ChangedByUserId = userId,
                ChangedByName = GetUserName(),
                Reason = string.IsNullOrWhiteSpace(dto.Reason) ? $"Status transitioned via {action}" : dto.Reason
            });

            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = $"SANDBOX_STATUS_{newStatus}",
                EntityType = "SandboxTrial",
                EntityId = trial.Id.ToString()
            });

            await _context.SaveChangesAsync();
            return Ok(new { success = true, previousStatus = prevStatus, status = newStatus });
        }

        [HttpPost("{id}/assign-validator")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,ADMINISTRATOR")]
        public async Task<ActionResult> AssignValidator(Guid id, [FromBody] AssignValidatorDto dto)
        {
            var trial = await _context.SandboxTrials.FirstOrDefaultAsync(t => t.Id == id);
            if (trial == null) return NotFound();

            var validator = await _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == dto.ValidatorUserId && u.UserRoles.Any(ur => ur.Role.Name == "INDEPENDENT_VALIDATOR"));

            if (validator == null) return BadRequest("Selected user is not an authorized Independent Validator.");

            trial.ValidatorUserId = validator.Id;
            trial.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, validatorName = validator.Username });
        }

        // --- KPI Telemetry Measurement Submission ---
        [HttpPost("{trialId}/kpis/{kpiId}/measurements")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,INDEPENDENT_VALIDATOR,ADMINISTRATOR")]
        public async Task<ActionResult> RecordKPIMeasurement(Guid trialId, Guid kpiId, [FromBody] AddMeasurementDto dto)
        {
            var userId = GetUserId();
            var kpi = await _context.SandboxTrialKPIs
                .Include(k => k.SandboxTrial)
                .FirstOrDefaultAsync(k => k.Id == kpiId && k.SandboxTrialId == trialId);

            if (kpi == null) return NotFound("KPI not found.");

            var measurement = new KPIMeasurement
            {
                SandboxTrialKPIId = kpi.Id,
                Value = dto.Value,
                MeasuredAt = DateTime.UtcNow,
                MeasuredByUserId = userId,
                MeasuredByName = GetUserName(),
                Notes = dto.Notes,
                EvidenceDocumentUrl = dto.EvidenceDocumentUrl,
                CreatedBy = userId.ToString()
            };

            kpi.LatestValue = dto.Value;
            kpi.UpdatedAt = DateTime.UtcNow;

            // Mathematical Achievement Calculation:
            // If Target > Baseline: Progress = (Latest - Baseline) / (Target - Baseline) * 100
            // If Target < Baseline (e.g. latency, defect reduction): Progress = (Baseline - Latest) / (Baseline - Target) * 100
            if (kpi.TargetValue != kpi.BaselineValue)
            {
                decimal progress;
                if (kpi.TargetValue > kpi.BaselineValue)
                {
                    progress = ((kpi.LatestValue - kpi.BaselineValue) / (kpi.TargetValue - kpi.BaselineValue)) * 100;
                }
                else
                {
                    progress = ((kpi.BaselineValue - kpi.LatestValue) / (kpi.BaselineValue - kpi.TargetValue)) * 100;
                }

                kpi.AchievementPercentage = Math.Max(0, Math.Min(150, Math.Round(progress, 1)));
            }
            else
            {
                kpi.AchievementPercentage = kpi.LatestValue >= kpi.TargetValue ? 100 : 0;
            }

            _context.KPIMeasurements.Add(measurement);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                latestValue = kpi.LatestValue,
                achievementPercentage = kpi.AchievementPercentage
            });
        }

        // --- Milestone Submission & Approval ---
        [HttpPost("{trialId}/milestones/{milestoneId}/submit")]
        public async Task<ActionResult> SubmitMilestone(Guid trialId, Guid milestoneId, [FromBody] SubmitMilestoneEvidenceDto dto)
        {
            var milestone = await _context.TrialMilestones.FirstOrDefaultAsync(m => m.Id == milestoneId && m.SandboxTrialId == trialId);
            if (milestone == null) return NotFound();

            milestone.Status = "SUBMITTED";
            milestone.EvidenceSummary = dto.EvidenceSummary;
            milestone.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, status = milestone.Status });
        }

        [HttpPost("{trialId}/milestones/{milestoneId}/approve")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT,ADMINISTRATOR")]
        public async Task<ActionResult> ApproveMilestone(Guid trialId, Guid milestoneId, [FromBody] ApproveMilestoneDto dto)
        {
            var userId = GetUserId();
            var milestone = await _context.TrialMilestones.FirstOrDefaultAsync(m => m.Id == milestoneId && m.SandboxTrialId == trialId);
            if (milestone == null) return NotFound();

            milestone.Status = "APPROVED";
            milestone.Remarks = dto.Remarks;
            milestone.ApprovedByUserId = userId;
            milestone.ApprovedAt = DateTime.UtcNow;
            milestone.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, status = milestone.Status, approvedAt = milestone.ApprovedAt });
        }
    }
}
