using System;
using System.Linq;
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
    [Route("api/startup/challenges")]
    [ApiController]
    [Authorize(Roles = "STARTUP")]
    public class StartupChallengesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StartupChallengesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirst("UserId")?.Value ?? Guid.Empty.ToString());

        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<ChallengeListDto>>> GetPublishedChallenges(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null,
            [FromQuery] string? sector = null,
            [FromQuery] bool? pilotRequired = null)
        {
            var query = _context.Challenges
                .Include(c => c.Department)
                .Where(c => c.Status == ChallengeStatus.Published || c.Status == ChallengeStatus.ApplicationsOpen);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => 
                    c.TitleEnglish.Contains(search) || 
                    c.TitleMarathi.Contains(search) || 
                    c.ChallengeReferenceNumber.Contains(search));
            }

            if (!string.IsNullOrEmpty(sector))
            {
                query = query.Where(c => c.Sector == sector);
            }

            if (pilotRequired.HasValue)
            {
                query = query.Where(c => c.PilotRequirement == pilotRequired.Value);
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ChallengeListDto
                {
                    Id = c.Id,
                    ChallengeReferenceNumber = c.ChallengeReferenceNumber,
                    TitleEnglish = c.TitleEnglish,
                    TitleMarathi = c.TitleMarathi,
                    DepartmentName = c.Department.Name,
                    Sector = c.Sector,
                    Status = c.Status,
                    SubmissionClosingDate = c.SubmissionClosingDate,
                    PilotRequirement = c.PilotRequirement
                })
                .ToListAsync();

            return Ok(new PaginatedResponse<ChallengeListDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeDetailsDto>> GetChallengeDetails(Guid id)
        {
            var userId = GetUserId();
            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
            if (startup == null) return Forbid();

            var challenge = await _context.Challenges
                .Include(c => c.Department)
                .Include(c => c.TechnologyCategories)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null || (challenge.Status != ChallengeStatus.Published && challenge.Status != ChallengeStatus.ApplicationsOpen && challenge.Status != ChallengeStatus.ApplicationsClosed))
            {
                return NotFound();
            }

            var isSaved = await _context.SavedChallenges
                .AnyAsync(s => s.StartupProfileId == startup.Id && s.ChallengeId == id);
                
            var hasApplied = await _context.ChallengeApplications
                .AnyAsync(a => a.StartupProfileId == startup.Id && a.ChallengeId == id);

            var dto = new ChallengeDetailsDto
            {
                Id = challenge.Id,
                ChallengeReferenceNumber = challenge.ChallengeReferenceNumber,
                DepartmentName = challenge.Department?.Name ?? "",
                TitleEnglish = challenge.TitleEnglish,
                TitleMarathi = challenge.TitleMarathi,
                Sector = challenge.Sector,
                GeographicScope = challenge.GeographicScope,
                TargetBeneficiaries = challenge.TargetBeneficiaries,
                ProblemStatementEnglish = challenge.ProblemStatementEnglish,
                ProblemStatementMarathi = challenge.ProblemStatementMarathi,
                BackgroundEnglish = challenge.BackgroundEnglish,
                BackgroundMarathi = challenge.BackgroundMarathi,
                CurrentSituation = challenge.CurrentSituation,
                DesiredOutcomeEnglish = challenge.DesiredOutcomeEnglish,
                DesiredOutcomeMarathi = challenge.DesiredOutcomeMarathi,
                ExpectedDeliverables = challenge.ExpectedDeliverables,
                FunctionalRequirements = challenge.FunctionalRequirements,
                TechnicalRequirements = challenge.TechnicalRequirements,
                EligibilityRequirements = challenge.EligibilityRequirements,
                PilotRequirement = challenge.PilotRequirement,
                PilotDuration = challenge.PilotDuration,
                DataRequirements = challenge.DataRequirements,
                CybersecurityRequirements = challenge.CybersecurityRequirements,
                IntellectualPropertyRequirements = challenge.IntellectualPropertyRequirements,
                ProcurementExpectation = challenge.ProcurementExpectation,
                EstimatedBudget = challenge.EstimatedBudget,
                FundingType = challenge.FundingType,
                PublicationDate = challenge.PublicationDate,
                SubmissionOpeningDate = challenge.SubmissionOpeningDate,
                SubmissionClosingDate = challenge.SubmissionClosingDate,
                Status = challenge.Status,
                PublishedAt = challenge.PublishedAt,
                TechnologyCategoryIds = challenge.TechnologyCategories.Select(tc => tc.TechnologyCategoryId).ToList(),
                IsSaved = isSaved,
                HasApplied = hasApplied
            };

            return Ok(dto);
        }

        [HttpPost("{id}/save")]
        public async Task<ActionResult> SaveChallenge(Guid id)
        {
            var userId = GetUserId();
            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
            if (startup == null) return Forbid();

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null) return NotFound();

            var existing = await _context.SavedChallenges
                .FirstOrDefaultAsync(s => s.StartupProfileId == startup.Id && s.ChallengeId == id);

            if (existing == null)
            {
                _context.SavedChallenges.Add(new SavedChallenge
                {
                    StartupProfileId = startup.Id,
                    ChallengeId = id
                });
                
                _context.AuditLogs.Add(new AuditLog
                {
                    UserId = userId,
                    Action = "CHALLENGE_SAVED",
                    EntityType = "SavedChallenge",
                    EntityId = id.ToString()
                });
                
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpDelete("{id}/save")]
        public async Task<ActionResult> UnsaveChallenge(Guid id)
        {
            var userId = GetUserId();
            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
            if (startup == null) return Forbid();

            var existing = await _context.SavedChallenges
                .FirstOrDefaultAsync(s => s.StartupProfileId == startup.Id && s.ChallengeId == id);

            if (existing != null)
            {
                _context.SavedChallenges.Remove(existing);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpPost("{id}/apply")]
        public async Task<ActionResult> StartApplication(Guid id)
        {
            var userId = GetUserId();
            var startup = await _context.StartupProfiles.FirstOrDefaultAsync(s => s.UserId == userId);
            if (startup == null) return Forbid();

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null) return NotFound();

            if (challenge.Status != ChallengeStatus.ApplicationsOpen && challenge.Status != ChallengeStatus.Published)
            {
                return BadRequest("Applications are not open for this challenge.");
            }

            var existingApp = await _context.ChallengeApplications
                .FirstOrDefaultAsync(a => a.StartupProfileId == startup.Id && a.ChallengeId == id);

            if (existingApp != null)
            {
                return Ok(new { ApplicationId = existingApp.Id });
            }

            var application = new ChallengeApplication
            {
                StartupProfileId = startup.Id,
                ChallengeId = id,
                Status = "DRAFT"
            };

            _context.ChallengeApplications.Add(application);
            
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = "APPLICATION_STARTED",
                EntityType = "ChallengeApplication",
                EntityId = application.Id.ToString()
            });
            
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChallengeDetails), new { id = challenge.Id }, new { ApplicationId = application.Id });
        }
    }
}
