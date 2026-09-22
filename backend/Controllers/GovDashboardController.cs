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
    public class GovDashboardStatsDto
    {
        public int ActiveChallenges { get; set; }
        public int TotalApplications { get; set; }
        public int UnderEvaluation { get; set; }
        public int ActivePilots { get; set; }
        public List<ChallengeListDto> RecentChallenges { get; set; } = new List<ChallengeListDto>();
        public string DepartmentName { get; set; } = string.Empty;
    }

    [Route("api/gov")]
    [ApiController]
    [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
    public class GovDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GovDashboardController(ApplicationDbContext context)
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

        private async Task<Department?> GetUserDepartmentAsync(Guid userId)
        {
            var user = await _context.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Department != null) return user.Department;

            return await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<GovDashboardStatsDto>> GetDashboard()
        {
            var userId = GetUserId();
            var department = await GetUserDepartmentAsync(userId);
            if (department == null) return Forbid();

            // 1. Active Challenges: all non-cancelled challenges belonging to this department
            var challengesQuery = _context.Challenges
                .Where(c => c.DepartmentId == department.Id);

            var activeChallengesCount = await challengesQuery
                .Where(c => c.Status != ChallengeStatus.Cancelled)
                .CountAsync();

            // 2. Total applications submitted for this department's challenges
            var totalApplicationsCount = await _context.ChallengeApplications
                .Where(ca => ca.Challenge.DepartmentId == department.Id)
                .CountAsync();

            // 3. Applications currently under evaluation or submitted
            var underEvaluationCount = await _context.ChallengeApplications
                .Where(ca => ca.Challenge.DepartmentId == department.Id &&
                             (ca.Status == "UNDER_EVALUATION" || ca.Status == "SUBMITTED"))
                .CountAsync();

            // 4. Active Pilots: live database count of sandbox trials in PILOT_ACTIVE state
            var activePilotsCount = await _context.SandboxTrials
                .Where(t => t.DepartmentId == department.Id && t.Status == "PILOT_ACTIVE")
                .CountAsync();

            // 5. Recent challenges (up to 10 newest challenges)
            var recentChallenges = await challengesQuery
                .OrderByDescending(c => c.CreatedAt)
                .Take(10)
                .Select(c => new ChallengeListDto
                {
                    Id = c.Id,
                    ChallengeReferenceNumber = c.ChallengeReferenceNumber,
                    TitleEnglish = c.TitleEnglish,
                    TitleMarathi = c.TitleMarathi,
                    DepartmentName = department.Name,
                    Sector = c.Sector,
                    Status = c.Status,
                    SubmissionClosingDate = c.SubmissionClosingDate,
                    PilotRequirement = c.PilotRequirement,
                    ApplicationCount = c.Applications.Count()
                })
                .ToListAsync();

            return Ok(new GovDashboardStatsDto
            {
                ActiveChallenges = activeChallengesCount,
                TotalApplications = totalApplicationsCount,
                UnderEvaluation = underEvaluationCount,
                ActivePilots = activePilotsCount,
                RecentChallenges = recentChallenges,
                DepartmentName = department.Name
            });
        }
    }
}
