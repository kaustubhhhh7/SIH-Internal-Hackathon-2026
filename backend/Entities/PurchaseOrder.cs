using System;

namespace GovPortal.API.Entities
{
    public class PurchaseOrder : BaseEntity
    {
        public string OrderNumber { get; set; } = string.Empty; // e.g. GEM-GOM-2026-PO-849201

        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;

        public Guid DepartmentId { get; set; }
        public Department Department { get; set; } = null!;

        public Guid? SandboxTrialId { get; set; }
        public SandboxTrial? SandboxTrial { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
        public decimal GstAmount { get; set; }
        public decimal TotalAmount { get; set; }

        public string Rule149ExemptionRef { get; set; } = string.Empty;
        public string DeliveryConsigneeAddress { get; set; } = string.Empty;
        public string ProcurementOfficerName { get; set; } = string.Empty;

        // Escrow Status: ESCROW_LOCKED, ADVANCE_DISBURSED_40, ACCEPTANCE_DISBURSED_40, FULL_DISBURSED_100
        public string EscrowStatus { get; set; } = "ESCROW_LOCKED";

        // Lifecycle: ORDER_PLACED, HARDWARE_DISPATCHED, INSPECTED_DELIVERED, COMMISSIONED_OPERATIONAL, COMPLETED
        public string Status { get; set; } = "ORDER_PLACED";

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string? MilestoneNotes { get; set; }
    }
}
