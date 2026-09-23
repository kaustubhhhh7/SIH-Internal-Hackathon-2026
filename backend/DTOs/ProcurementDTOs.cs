using System;
using System.Collections.Generic;

namespace GovPortal.API.DTOs
{
    public class ProcurementDashboardStatsDto
    {
        public int ValidatedPilotsCount { get; set; }
        public int PendingProcurementCount { get; set; }
        public int ActiveContractsCount { get; set; }
        public decimal TotalProcurementValue { get; set; }
        public List<PurchaseOrderListDto> RecentOrders { get; set; } = new();
        public List<ValidatedPilotDto> ValidatedPilots { get; set; } = new();
    }

    public class PurchaseOrderListDto
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public string StartupName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public Guid StartupProfileId { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid? SandboxTrialId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal GstAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Rule149ExemptionRef { get; set; } = string.Empty;
        public string DeliveryConsigneeAddress { get; set; } = string.Empty;
        public string ProcurementOfficerName { get; set; } = string.Empty;
        public string EscrowStatus { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string? MilestoneNotes { get; set; }
    }

    public class CreatePurchaseOrderDto
    {
        public Guid? SandboxTrialId { get; set; }
        public Guid StartupProfileId { get; set; }
        public Guid DepartmentId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ItemDescription { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
        public string DeliveryConsigneeAddress { get; set; } = string.Empty;
        public string? ProcurementOfficerName { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? MilestoneNotes { get; set; }
    }

    public class ValidatedPilotDto
    {
        public Guid TrialId { get; set; }
        public string TrialReferenceNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string StartupName { get; set; } = string.Empty;
        public Guid StartupProfileId { get; set; }
        public Guid DepartmentId { get; set; }
        public decimal ValidationScore { get; set; } = 92.5m;
        public string TestingEnvironment { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal MaximumBudget { get; set; }
        public bool HasExistingPO { get; set; }
    }

    public class ExemptionCertificateDto
    {
        public string CertificateNumber { get; set; } = string.Empty;
        public string OrderNumber { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string DpiitNumber { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string LegalBasis { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public string OfficerName { get; set; } = string.Empty;
    }
}
