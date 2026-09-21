using System;
using System.Linq;
using System.Threading.Tasks;
using GovPortal.API.Data;
using GovPortal.API.DTOs;
using GovPortal.API.Entities;
using GovPortal.API.Entities.Enums;
using GovPortal.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChallengesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IChallengeReferenceGenerator _referenceGenerator;

        public ChallengesController(ApplicationDbContext context, IChallengeReferenceGenerator referenceGenerator)
        {
            _context = context;
            _referenceGenerator = referenceGenerator;
        }

        private Guid GetUserId() => Guid.Parse(User.FindFirst("UserId")?.Value ?? Guid.Empty.ToString());

        [HttpGet("department")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
        public async Task<ActionResult<PaginatedResponse<ChallengeListDto>>> GetDepartmentChallenges(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var userId = GetUserId();
            var department = await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
            if (department == null) return Forbid();

            var query = _context.Challenges
                .Where(c => c.DepartmentId == department.Id)
                .OrderByDescending(c => c.UpdatedAt);

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new ChallengeListDto
                {
                    Id = c.Id,
                    ChallengeReferenceNumber = c.ChallengeReferenceNumber,
                    TitleEnglish = c.TitleEnglish,
                    TitleMarathi = c.TitleMarathi,
                    Status = c.Status,
                    SubmissionClosingDate = c.SubmissionClosingDate,
                    ApplicationCount = c.Applications.Count()
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

        [HttpPost]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
        public async Task<ActionResult<ChallengeDetailsDto>> CreateChallenge(CreateChallengeDto dto)
        {
            var userId = GetUserId();
            var department = await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
            if (department == null) return Forbid();

            var challenge = new Challenge
            {
                DepartmentId = department.Id,
                ChallengeReferenceNumber = await _referenceGenerator.GenerateReferenceNumberAsync(),
                TitleEnglish = dto.TitleEnglish,
                TitleMarathi = dto.TitleMarathi,
                Sector = dto.Sector,
                GeographicScope = dto.GeographicScope,
                TargetBeneficiaries = dto.TargetBeneficiaries,
                ProblemStatementEnglish = dto.ProblemStatementEnglish,
                ProblemStatementMarathi = dto.ProblemStatementMarathi,
                BackgroundEnglish = dto.BackgroundEnglish,
                BackgroundMarathi = dto.BackgroundMarathi,
                CurrentSituation = dto.CurrentSituation,
                DesiredOutcomeEnglish = dto.DesiredOutcomeEnglish,
                DesiredOutcomeMarathi = dto.DesiredOutcomeMarathi,
                ExpectedDeliverables = dto.ExpectedDeliverables,
                FunctionalRequirements = dto.FunctionalRequirements,
                TechnicalRequirements = dto.TechnicalRequirements,
                EligibilityRequirements = dto.EligibilityRequirements,
                PilotRequirement = dto.PilotRequirement,
                PilotDuration = dto.PilotDuration,
                DataRequirements = dto.DataRequirements,
                CybersecurityRequirements = dto.CybersecurityRequirements,
                IntellectualPropertyRequirements = dto.IntellectualPropertyRequirements,
                ProcurementExpectation = dto.ProcurementExpectation,
                EstimatedBudget = dto.EstimatedBudget,
                FundingType = dto.FundingType,
                PublicationDate = dto.PublicationDate,
                SubmissionOpeningDate = dto.SubmissionOpeningDate,
                SubmissionClosingDate = dto.SubmissionClosingDate,
                Status = ChallengeStatus.Draft,
                CreatedBy = userId.ToString(),
                UpdatedBy = userId.ToString()
            };

            foreach(var techId in dto.TechnologyCategoryIds)
            {
                challenge.TechnologyCategories.Add(new ChallengeTechnologyCategory { TechnologyCategoryId = techId });
            }

            _context.Challenges.Add(challenge);
            
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = "CHALLENGE_CREATED",
                EntityType = "Challenge",
                EntityId = challenge.Id.ToString()
            });

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChallenge), new { id = challenge.Id }, new { Id = challenge.Id });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChallengeDetailsDto>> GetChallenge(Guid id)
        {
            var userId = GetUserId();
            var userRoles = User.FindAll("http://schemas.microsoft.com/ws/2008/06/identity/claims/role").Select(c => c.Value).ToList();
            var isGov = userRoles.Contains("GOVERNMENT_DEPARTMENT");

            var challenge = await _context.Challenges
                .Include(c => c.Department)
                .Include(c => c.TechnologyCategories)
                .Include(c => c.Applications)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null) return NotFound();

            // Authorization: if not published, only the owning department can see it
            if (challenge.Status != ChallengeStatus.Published && challenge.Status != ChallengeStatus.ApplicationsOpen && challenge.Status != ChallengeStatus.ApplicationsClosed)
            {
                if (isGov)
                {
                    var department = await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
                    if (department == null || challenge.DepartmentId != department.Id) return Forbid();
                }
                else
                {
                    return Forbid();
                }
            }

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
                ApplicationCount = challenge.Applications.Count,
                PublishedAt = challenge.PublishedAt,
                CreatedAt = challenge.CreatedAt,
                UpdatedAt = challenge.UpdatedAt,
                TechnologyCategoryIds = challenge.TechnologyCategories.Select(tc => tc.TechnologyCategoryId).ToList()
            };

            return Ok(dto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
        public async Task<ActionResult> UpdateChallenge(Guid id, UpdateChallengeDto dto)
        {
            var userId = GetUserId();
            var department = await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
            
            var challenge = await _context.Challenges
                .Include(c => c.TechnologyCategories)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null) return NotFound();
            if (department == null || challenge.DepartmentId != department.Id) return Forbid();

            if (challenge.Status == ChallengeStatus.Published || challenge.Status == ChallengeStatus.ApplicationsOpen)
            {
                return BadRequest("Cannot directly edit a published challenge.");
            }

            challenge.TitleEnglish = dto.TitleEnglish;
            challenge.TitleMarathi = dto.TitleMarathi;
            challenge.Sector = dto.Sector;
            challenge.GeographicScope = dto.GeographicScope;
            challenge.TargetBeneficiaries = dto.TargetBeneficiaries;
            challenge.ProblemStatementEnglish = dto.ProblemStatementEnglish;
            challenge.ProblemStatementMarathi = dto.ProblemStatementMarathi;
            challenge.BackgroundEnglish = dto.BackgroundEnglish;
            challenge.BackgroundMarathi = dto.BackgroundMarathi;
            challenge.CurrentSituation = dto.CurrentSituation;
            challenge.DesiredOutcomeEnglish = dto.DesiredOutcomeEnglish;
            challenge.DesiredOutcomeMarathi = dto.DesiredOutcomeMarathi;
            challenge.ExpectedDeliverables = dto.ExpectedDeliverables;
            challenge.FunctionalRequirements = dto.FunctionalRequirements;
            challenge.TechnicalRequirements = dto.TechnicalRequirements;
            challenge.EligibilityRequirements = dto.EligibilityRequirements;
            challenge.PilotRequirement = dto.PilotRequirement;
            challenge.PilotDuration = dto.PilotDuration;
            challenge.DataRequirements = dto.DataRequirements;
            challenge.CybersecurityRequirements = dto.CybersecurityRequirements;
            challenge.IntellectualPropertyRequirements = dto.IntellectualPropertyRequirements;
            challenge.ProcurementExpectation = dto.ProcurementExpectation;
            challenge.EstimatedBudget = dto.EstimatedBudget;
            challenge.FundingType = dto.FundingType;
            challenge.PublicationDate = dto.PublicationDate;
            challenge.SubmissionOpeningDate = dto.SubmissionOpeningDate;
            challenge.SubmissionClosingDate = dto.SubmissionClosingDate;
            challenge.UpdatedBy = userId.ToString();
            challenge.UpdatedAt = DateTime.UtcNow;

            challenge.TechnologyCategories.Clear();
            foreach (var techId in dto.TechnologyCategoryIds)
            {
                challenge.TechnologyCategories.Add(new ChallengeTechnologyCategory { TechnologyCategoryId = techId });
            }

            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = "CHALLENGE_UPDATED",
                EntityType = "Challenge",
                EntityId = challenge.Id.ToString()
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/status")]
        [Authorize(Roles = "GOVERNMENT_DEPARTMENT")]
        public async Task<ActionResult> UpdateChallengeStatus(Guid id, [FromQuery] string action)
        {
            var userId = GetUserId();
            var department = await _context.Departments.FirstOrDefaultAsync(d => d.Users.Any(u => u.Id == userId));
            
            var challenge = await _context.Challenges.FirstOrDefaultAsync(c => c.Id == id);
            if (challenge == null) return NotFound();
            if (department == null || challenge.DepartmentId != department.Id) return Forbid();

            string auditEvent = string.Empty;

            switch (action.ToUpper())
            {
                case "SUBMIT_REVIEW":
                    if (challenge.Status != ChallengeStatus.Draft) return BadRequest("Only Drafts can be submitted for review.");
                    challenge.Status = ChallengeStatus.InternalReview;
                    auditEvent = "CHALLENGE_SUBMITTED_FOR_REVIEW";
                    break;
                case "APPROVE":
                    if (challenge.Status != ChallengeStatus.InternalReview) return BadRequest("Challenge must be under Internal Review.");
                    challenge.Status = ChallengeStatus.Published; // Simplified for now, jumping straight to Published/Approved
                    challenge.PublishedAt = DateTime.UtcNow;
                    auditEvent = "CHALLENGE_PUBLISHED";
                    break;
                case "REQUEST_CHANGES":
                    if (challenge.Status != ChallengeStatus.InternalReview) return BadRequest("Challenge must be under Internal Review.");
                    challenge.Status = ChallengeStatus.Draft;
                    auditEvent = "CHALLENGE_CHANGES_REQUESTED";
                    break;
                case "PUBLISH":
                    if (challenge.Status != ChallengeStatus.Draft && challenge.Status != ChallengeStatus.InternalReview) return BadRequest("Invalid state for publishing.");
                    challenge.Status = ChallengeStatus.Published;
                    challenge.PublishedAt = DateTime.UtcNow;
                    auditEvent = "CHALLENGE_PUBLISHED";
                    break;
                case "CLOSE":
                    challenge.Status = ChallengeStatus.ApplicationsClosed;
                    challenge.ClosedAt = DateTime.UtcNow;
                    auditEvent = "CHALLENGE_CLOSED";
                    break;
                case "ARCHIVE":
                    challenge.Status = ChallengeStatus.Cancelled;
                    auditEvent = "CHALLENGE_ARCHIVED";
                    break;
                default:
                    return BadRequest("Invalid action.");
            }

            challenge.UpdatedAt = DateTime.UtcNow;
            challenge.UpdatedBy = userId.ToString();

            _context.AuditLogs.Add(new AuditLog
            {
                UserId = userId,
                Action = auditEvent,
                EntityType = "Challenge",
                EntityId = challenge.Id.ToString()
            });

            await _context.SaveChangesAsync();

            return Ok(new { status = challenge.Status.ToString() });
        }
    }
}
