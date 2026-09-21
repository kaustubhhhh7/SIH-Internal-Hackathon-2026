using System;
using System.Collections.Generic;
using GovPortal.API.Entities.Enums;

namespace GovPortal.API.Entities
{
    public class Challenge : BaseEntity
    {
        public string ChallengeReferenceNumber { get; set; } = string.Empty;
        
        public Guid DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        
        // Basic Info
        public string TitleEnglish { get; set; } = string.Empty;
        public string TitleMarathi { get; set; } = string.Empty;
        public string Sector { get; set; } = string.Empty;
        public string GeographicScope { get; set; } = string.Empty;
        public string TargetBeneficiaries { get; set; } = string.Empty;

        // Problem Definition
        public string ProblemStatementEnglish { get; set; } = string.Empty;
        public string ProblemStatementMarathi { get; set; } = string.Empty;
        public string BackgroundEnglish { get; set; } = string.Empty;
        public string BackgroundMarathi { get; set; } = string.Empty;
        public string CurrentSituation { get; set; } = string.Empty;

        // Outcomes & Requirements
        public string DesiredOutcomeEnglish { get; set; } = string.Empty;
        public string DesiredOutcomeMarathi { get; set; } = string.Empty;
        public string ExpectedDeliverables { get; set; } = string.Empty;
        public string FunctionalRequirements { get; set; } = string.Empty;
        public string TechnicalRequirements { get; set; } = string.Empty;

        // Eligibility
        public string EligibilityRequirements { get; set; } = string.Empty;

        // Pilot & Data
        public bool PilotRequirement { get; set; }
        public string PilotDuration { get; set; } = string.Empty; // e.g., "3 Months"
        public string DataRequirements { get; set; } = string.Empty;
        public string CybersecurityRequirements { get; set; } = string.Empty;

        // IP / Procurement
        public string IntellectualPropertyRequirements { get; set; } = string.Empty;
        public string ProcurementExpectation { get; set; } = string.Empty;
        public decimal? EstimatedBudget { get; set; }
        public string FundingType { get; set; } = string.Empty;

        // Operational Status
        public ChallengeStatus Status { get; set; } = ChallengeStatus.Draft;
        public int Version { get; set; } = 1;
        public bool IsFeatured { get; set; } = false;

        // Timeline
        public DateTime? PublicationDate { get; set; }
        public DateTime? SubmissionOpeningDate { get; set; }
        public DateTime? SubmissionClosingDate { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? ClosedAt { get; set; }

        // Relationships
        public ICollection<ChallengeDocument> Documents { get; set; } = new List<ChallengeDocument>();
        public ICollection<ChallengeTechnologyCategory> TechnologyCategories { get; set; } = new List<ChallengeTechnologyCategory>();
        public ICollection<SavedChallenge> SavedByStartups { get; set; } = new List<SavedChallenge>();
        public ICollection<ChallengeApplication> Applications { get; set; } = new List<ChallengeApplication>();
    }
}
