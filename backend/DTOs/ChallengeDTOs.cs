using System;
using System.Collections.Generic;
using GovPortal.API.Entities.Enums;

namespace GovPortal.API.DTOs
{
    public class CreateChallengeDto
    {
        public string TitleEnglish { get; set; } = string.Empty;
        public string TitleMarathi { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
        public string GeographicScope { get; set; } = string.Empty;
        public string TargetBeneficiaries { get; set; } = string.Empty;
        public string ProblemStatementEnglish { get; set; } = string.Empty;
        public string ProblemStatementMarathi { get; set; } = string.Empty;
        public string BackgroundEnglish { get; set; } = string.Empty;
        public string BackgroundMarathi { get; set; } = string.Empty;
        public string CurrentSituation { get; set; } = string.Empty;
        public string DesiredOutcomeEnglish { get; set; } = string.Empty;
        public string DesiredOutcomeMarathi { get; set; } = string.Empty;
        public string ExpectedDeliverables { get; set; } = string.Empty;
        public string FunctionalRequirements { get; set; } = string.Empty;
        public string TechnicalRequirements { get; set; } = string.Empty;
        public string EligibilityRequirements { get; set; } = string.Empty;
        public bool PilotRequirement { get; set; }
        public string PilotDuration { get; set; } = string.Empty;
        public string DataRequirements { get; set; } = string.Empty;
        public string CybersecurityRequirements { get; set; } = string.Empty;
        public string IntellectualPropertyRequirements { get; set; } = string.Empty;
        public string ProcurementExpectation { get; set; } = string.Empty;
        public decimal? EstimatedBudget { get; set; }
        public string FundingType { get; set; } = string.Empty;
        public DateTime? PublicationDate { get; set; }
        public DateTime? SubmissionOpeningDate { get; set; }
        public DateTime? SubmissionClosingDate { get; set; }
        public List<Guid> TechnologyCategoryIds { get; set; } = new List<Guid>();
    }

    public class UpdateChallengeDto : CreateChallengeDto
    {
    }

    public class ChallengeListDto
    {
        public Guid Id { get; set; }
        public string ChallengeReferenceNumber { get; set; } = string.Empty;
        public string TitleEnglish { get; set; } = string.Empty;
        public string TitleMarathi { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
        public ChallengeStatus Status { get; set; }
        public DateTime? SubmissionClosingDate { get; set; }
        public bool PilotRequirement { get; set; }
        public int ApplicationCount { get; set; }
    }

    public class ChallengeDetailsDto : CreateChallengeDto
    {
        public Guid Id { get; set; }
        public string ChallengeReferenceNumber { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public ChallengeStatus Status { get; set; }
        public bool IsSaved { get; set; }
        public bool HasApplied { get; set; }
        public int ApplicationCount { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    }
}
