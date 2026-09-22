using System;
using System.Collections.Generic;

namespace GovPortal.API.Entities
{
    public class SandboxTrial : BaseEntity
    {
        public string TrialReferenceNumber { get; set; } = string.Empty;
        
        public Guid DepartmentId { get; set; }
        public Department Department { get; set; } = null!;

        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;

        public Guid? ChallengeId { get; set; }
        public Challenge? Challenge { get; set; }

        public Guid? ChallengeApplicationId { get; set; }
        public ChallengeApplication? ChallengeApplication { get; set; }

        public Guid? ValidatorUserId { get; set; }
        public User? ValidatorUser { get; set; }

        // Pilot Parameters
        public string Title { get; set; } = string.Empty;
        public string TestingEnvironment { get; set; } = "Municipal Field Sandbox"; // Municipal Field Sandbox, Laboratory Simulation, Controlled Agency Corridor
        public string Location { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public int DurationDays { get; set; } = 90;
        public decimal MaximumBudget { get; set; } = 0;
        public string ExpectedOutcomes { get; set; } = string.Empty;
        public string RiskMitigationPlan { get; set; } = string.Empty;
        
        // Status Lifecycle: DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PILOT_ACTIVE, VALIDATION_PENDING, COMPLETED_SUCCESS, COMPLETED_FAILED, CANCELLED
        public string Status { get; set; } = "DRAFT";

        public DateTime? ApprovedAt { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CompletedAt { get; set; }

        // Navigation Collections
        public ICollection<SandboxTrialKPI> KPIs { get; set; } = new List<SandboxTrialKPI>();
        public ICollection<TrialMilestone> Milestones { get; set; } = new List<TrialMilestone>();
        public ICollection<TrialDocument> Documents { get; set; } = new List<TrialDocument>();
        public ICollection<TrialStatusHistory> StatusHistory { get; set; } = new List<TrialStatusHistory>();
    }

    public class SandboxTrialKPI : BaseEntity
    {
        public Guid SandboxTrialId { get; set; }
        public SandboxTrial SandboxTrial { get; set; } = null!;

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty; // e.g. minutes, %, ms, kg
        public decimal BaselineValue { get; set; }
        public decimal TargetValue { get; set; }
        public decimal LatestValue { get; set; }
        public decimal AchievementPercentage { get; set; }
        public string MeasurementMethod { get; set; } = string.Empty;

        public ICollection<KPIMeasurement> Measurements { get; set; } = new List<KPIMeasurement>();
    }

    public class KPIMeasurement : BaseEntity
    {
        public Guid SandboxTrialKPIId { get; set; }
        public SandboxTrialKPI SandboxTrialKPI { get; set; } = null!;

        public decimal Value { get; set; }
        public DateTime MeasuredAt { get; set; } = DateTime.UtcNow;
        public Guid MeasuredByUserId { get; set; }
        public string MeasuredByName { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string? EvidenceDocumentUrl { get; set; }
    }

    public class TrialMilestone : BaseEntity
    {
        public Guid SandboxTrialId { get; set; }
        public SandboxTrial SandboxTrial { get; set; } = null!;

        public string Name { get; set; } = string.Empty;
        public decimal Percentage { get; set; } = 30; // e.g. 30%, 40%, 30%
        public decimal AllocatedAmount { get; set; }
        public DateTime? DueDate { get; set; }
        
        // PENDING, SUBMITTED, APPROVED, REJECTED
        public string Status { get; set; } = "PENDING";
        public string EvidenceSummary { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public Guid? ApprovedByUserId { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }

    public class TrialDocument : BaseEntity
    {
        public Guid SandboxTrialId { get; set; }
        public SandboxTrial SandboxTrial { get; set; } = null!;

        public string Title { get; set; } = string.Empty;
        public string DocumentType { get; set; } = "SanctionOrder"; // SanctionOrder, TelemetryReport, SafetyClearance, FinalValidation
        public string FileUrl { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class TrialStatusHistory : BaseEntity
    {
        public Guid SandboxTrialId { get; set; }
        public SandboxTrial SandboxTrial { get; set; } = null!;

        public string PreviousStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public Guid ChangedByUserId { get; set; }
        public string ChangedByName { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string Reason { get; set; } = string.Empty;
    }
}
