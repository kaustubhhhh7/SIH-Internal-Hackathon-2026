using System;
using System.Collections.Generic;

namespace GovPortal.API.DTOs
{
    public class SandboxTrialSummaryDto
    {
        public Guid Id { get; set; }
        public string TrialReferenceNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string StartupName { get; set; } = string.Empty;
        public string ProductSolutionName { get; set; } = string.Empty;
        public string? ChallengeTitle { get; set; }
        public string TestingEnvironment { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int DurationDays { get; set; }
        public decimal MaximumBudget { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal OverallKPIProgress { get; set; }
        public string? ValidatorName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SandboxTrialDetailsDto : SandboxTrialSummaryDto
    {
        public string Objective { get; set; } = string.Empty;
        public string ExpectedOutcomes { get; set; } = string.Empty;
        public string RiskMitigationPlan { get; set; } = string.Empty;
        public Guid StartupProfileId { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid? ChallengeId { get; set; }
        public Guid? ChallengeApplicationId { get; set; }
        public Guid? ValidatorUserId { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime? ApprovedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        public List<SandboxTrialKPIDto> KPIs { get; set; } = new List<SandboxTrialKPIDto>();
        public List<TrialMilestoneDto> Milestones { get; set; } = new List<TrialMilestoneDto>();
        public List<TrialDocumentDto> Documents { get; set; } = new List<TrialDocumentDto>();
        public List<TrialStatusHistoryDto> StatusHistory { get; set; } = new List<TrialStatusHistoryDto>();
    }

    public class SandboxTrialKPIDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal BaselineValue { get; set; }
        public decimal TargetValue { get; set; }
        public decimal LatestValue { get; set; }
        public decimal AchievementPercentage { get; set; }
        public string MeasurementMethod { get; set; } = string.Empty;
        public List<KPIMeasurementDto> Measurements { get; set; } = new List<KPIMeasurementDto>();
    }

    public class KPIMeasurementDto
    {
        public Guid Id { get; set; }
        public decimal Value { get; set; }
        public DateTime MeasuredAt { get; set; }
        public string MeasuredByName { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string? EvidenceDocumentUrl { get; set; }
    }

    public class TrialMilestoneDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
        public decimal AllocatedAmount { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string EvidenceSummary { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public DateTime? ApprovedAt { get; set; }
    }

    public class TrialDocumentDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class TrialStatusHistoryDto
    {
        public Guid Id { get; set; }
        public string PreviousStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public string ChangedByName { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class CreateSandboxTrialDto
    {
        public Guid StartupProfileId { get; set; }
        public Guid? ChallengeId { get; set; }
        public Guid? ChallengeApplicationId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string TestingEnvironment { get; set; } = "Municipal Field Sandbox";
        public string Location { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public int DurationDays { get; set; } = 90;
        public decimal MaximumBudget { get; set; }
        public string ExpectedOutcomes { get; set; } = string.Empty;
        public string RiskMitigationPlan { get; set; } = string.Empty;
        public Guid? ValidatorUserId { get; set; }

        public List<CreateKPIDto> KPIs { get; set; } = new List<CreateKPIDto>();
        public List<CreateMilestoneDto> Milestones { get; set; } = new List<CreateMilestoneDto>();
    }

    public class CreateKPIDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal BaselineValue { get; set; }
        public decimal TargetValue { get; set; }
        public string MeasurementMethod { get; set; } = string.Empty;
    }

    public class CreateMilestoneDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
        public DateTime? DueDate { get; set; }
    }

    public class AddMeasurementDto
    {
        public decimal Value { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string? EvidenceDocumentUrl { get; set; }
    }

    public class TrialStatusChangeDto
    {
        public string Action { get; set; } = string.Empty; // SUBMIT, APPROVE, REJECT, START, REQUEST_VALIDATION, CANCEL
        public string Reason { get; set; } = string.Empty;
    }

    public class AssignValidatorDto
    {
        public Guid ValidatorUserId { get; set; }
    }

    public class SubmitMilestoneEvidenceDto
    {
        public string EvidenceSummary { get; set; } = string.Empty;
    }

    public class ApproveMilestoneDto
    {
        public string Remarks { get; set; } = string.Empty;
    }
}
