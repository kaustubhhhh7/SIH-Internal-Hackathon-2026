using GovPortal.API.Data;
using GovPortal.API.DTOs;
using GovPortal.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GovPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProcurementController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProcurementController(ApplicationDbContext db)
        {
            _db = db;
        }

        // ─── GET /api/procurement/dashboard ────────────────────────────────────────
        [HttpGet("dashboard")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> GetDashboard()
        {
            var validatedPilots = await _db.SandboxTrials
                .Where(t => t.Status == "VALIDATED" || t.Status == "COMPLETED")
                .CountAsync();

            var pendingProcurement = await _db.SandboxTrials
                .Where(t => (t.Status == "VALIDATED" || t.Status == "COMPLETED")
                         && !_db.PurchaseOrders.Any(po => po.SandboxTrialId == t.Id))
                .CountAsync();

            var activeContracts = await _db.PurchaseOrders
                .Where(po => po.Status != "COMPLETED" && po.Status != "CANCELLED")
                .CountAsync();

            var totalValue = await _db.PurchaseOrders.SumAsync(po => (decimal?)po.TotalAmount) ?? 0m;

            var recentOrders = await _db.PurchaseOrders
                .Include(po => po.StartupProfile)
                .Include(po => po.Department)
                .OrderByDescending(po => po.OrderDate)
                .Take(8)
                .Select(po => new PurchaseOrderListDto
                {
                    Id = po.Id,
                    OrderNumber = po.OrderNumber,
                    ProductName = po.ProductName,
                    ItemDescription = po.ItemDescription,
                    StartupName = po.StartupProfile.CompanyName,
                    DepartmentName = po.Department.Name,
                    StartupProfileId = po.StartupProfileId,
                    DepartmentId = po.DepartmentId,
                    SandboxTrialId = po.SandboxTrialId,
                    Quantity = po.Quantity,
                    UnitPrice = po.UnitPrice,
                    GstAmount = po.GstAmount,
                    TotalAmount = po.TotalAmount,
                    Rule149ExemptionRef = po.Rule149ExemptionRef,
                    DeliveryConsigneeAddress = po.DeliveryConsigneeAddress,
                    ProcurementOfficerName = po.ProcurementOfficerName,
                    EscrowStatus = po.EscrowStatus,
                    Status = po.Status,
                    OrderDate = po.OrderDate,
                    MilestoneNotes = po.MilestoneNotes
                })
                .ToListAsync();

            var validatedPilotList = await _db.SandboxTrials
                .Include(t => t.StartupProfile)
                .Include(t => t.Department)
                .Where(t => t.Status == "VALIDATED" || t.Status == "COMPLETED")
                .OrderByDescending(t => t.UpdatedAt)
                .Take(10)
                .Select(t => new ValidatedPilotDto
                {
                    TrialId = t.Id,
                    TrialReferenceNumber = t.TrialReferenceNumber,
                    Title = t.Title,
                    DepartmentName = t.Department.Name,
                    StartupName = t.StartupProfile.CompanyName,
                    StartupProfileId = t.StartupProfileId,
                    DepartmentId = t.DepartmentId,
                    ValidationScore = 92.5m,
                    TestingEnvironment = t.TestingEnvironment ?? "Field",
                    Location = t.Location ?? "Maharashtra",
                    MaximumBudget = t.MaximumBudget,
                    HasExistingPO = _db.PurchaseOrders.Any(po => po.SandboxTrialId == t.Id)
                })
                .ToListAsync();

            return Ok(new ProcurementDashboardStatsDto
            {
                ValidatedPilotsCount = validatedPilots,
                PendingProcurementCount = pendingProcurement,
                ActiveContractsCount = activeContracts,
                TotalProcurementValue = totalValue,
                RecentOrders = recentOrders,
                ValidatedPilots = validatedPilotList
            });
        }

        // ─── GET /api/procurement/orders ───────────────────────────────────────────
        [HttpGet("orders")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR,GOVERNMENT_DEPARTMENT")]
        public async Task<IActionResult> GetOrders(
            [FromQuery] string? status,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _db.PurchaseOrders
                .Include(po => po.StartupProfile)
                .Include(po => po.Department)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(po => po.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(po =>
                    po.OrderNumber.Contains(search) ||
                    po.ProductName.Contains(search) ||
                    po.StartupProfile.CompanyName.Contains(search));

            var total = await query.CountAsync();

            var orders = await query
                .OrderByDescending(po => po.OrderDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(po => new PurchaseOrderListDto
                {
                    Id = po.Id,
                    OrderNumber = po.OrderNumber,
                    ProductName = po.ProductName,
                    ItemDescription = po.ItemDescription,
                    StartupName = po.StartupProfile.CompanyName,
                    DepartmentName = po.Department.Name,
                    StartupProfileId = po.StartupProfileId,
                    DepartmentId = po.DepartmentId,
                    SandboxTrialId = po.SandboxTrialId,
                    Quantity = po.Quantity,
                    UnitPrice = po.UnitPrice,
                    GstAmount = po.GstAmount,
                    TotalAmount = po.TotalAmount,
                    Rule149ExemptionRef = po.Rule149ExemptionRef,
                    DeliveryConsigneeAddress = po.DeliveryConsigneeAddress,
                    ProcurementOfficerName = po.ProcurementOfficerName,
                    EscrowStatus = po.EscrowStatus,
                    Status = po.Status,
                    OrderDate = po.OrderDate,
                    MilestoneNotes = po.MilestoneNotes
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, orders });
        }

        // ─── GET /api/procurement/orders/{id} ──────────────────────────────────────
        [HttpGet("orders/{id:guid}")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR,GOVERNMENT_DEPARTMENT")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            var po = await _db.PurchaseOrders
                .Include(p => p.StartupProfile)
                .Include(p => p.Department)
                .Include(p => p.SandboxTrial)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (po == null) return NotFound(new { message = "Purchase order not found." });

            return Ok(new PurchaseOrderListDto
            {
                Id = po.Id,
                OrderNumber = po.OrderNumber,
                ProductName = po.ProductName,
                ItemDescription = po.ItemDescription,
                StartupName = po.StartupProfile.CompanyName,
                DepartmentName = po.Department.Name,
                StartupProfileId = po.StartupProfileId,
                DepartmentId = po.DepartmentId,
                SandboxTrialId = po.SandboxTrialId,
                Quantity = po.Quantity,
                UnitPrice = po.UnitPrice,
                GstAmount = po.GstAmount,
                TotalAmount = po.TotalAmount,
                Rule149ExemptionRef = po.Rule149ExemptionRef,
                DeliveryConsigneeAddress = po.DeliveryConsigneeAddress,
                ProcurementOfficerName = po.ProcurementOfficerName,
                EscrowStatus = po.EscrowStatus,
                Status = po.Status,
                OrderDate = po.OrderDate,
                MilestoneNotes = po.MilestoneNotes
            });
        }

        // ─── POST /api/procurement/orders ──────────────────────────────────────────
        [HttpPost("orders")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> CreateOrder([FromBody] CreatePurchaseOrderDto dto)
        {
            // Validate startup exists
            var startup = await _db.StartupProfiles.FindAsync(dto.StartupProfileId);
            if (startup == null) return BadRequest(new { message = "Startup profile not found." });

            // Validate department exists
            var dept = await _db.Departments.FindAsync(dto.DepartmentId);
            if (dept == null) return BadRequest(new { message = "Department not found." });

            // Validate sandbox trial if provided
            if (dto.SandboxTrialId.HasValue)
            {
                var trial = await _db.SandboxTrials.FindAsync(dto.SandboxTrialId.Value);
                if (trial == null) return BadRequest(new { message = "Sandbox trial not found." });
                if (trial.Status != "VALIDATED" && trial.Status != "COMPLETED")
                    return BadRequest(new { message = "Only validated/completed sandbox trials can be procured." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? "SYSTEM";
            var officerName = dto.ProcurementOfficerName
                              ?? User.FindFirstValue(ClaimTypes.Name)
                              ?? "Procurement Officer";

            var poNumber = $"GEM-GOM-{DateTime.UtcNow.Year}-PO-{Random.Shared.Next(100000, 999999)}";
            var exemptionRef = $"MH-STARTUP-GFR149-EXEMPT-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(10000, 99999)}";

            var gst = dto.UnitPrice * dto.Quantity * 0.18m;
            var total = dto.UnitPrice * dto.Quantity + gst;

            var po = new PurchaseOrder
            {
                OrderNumber = poNumber,
                StartupProfileId = dto.StartupProfileId,
                DepartmentId = dto.DepartmentId,
                SandboxTrialId = dto.SandboxTrialId,
                ProductName = dto.ProductName,
                ItemDescription = dto.ItemDescription ?? dto.ProductName,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                GstAmount = Math.Round(gst, 2),
                TotalAmount = Math.Round(total, 2),
                Rule149ExemptionRef = exemptionRef,
                DeliveryConsigneeAddress = dto.DeliveryConsigneeAddress,
                ProcurementOfficerName = officerName,
                EscrowStatus = "ESCROW_LOCKED",
                Status = "ORDER_PLACED",
                OrderDate = DateTime.UtcNow,
                CreatedBy = userId
            };

            _db.PurchaseOrders.Add(po);
            await _db.SaveChangesAsync();

            // Reload with navigations
            await _db.Entry(po).Reference(p => p.StartupProfile).LoadAsync();
            await _db.Entry(po).Reference(p => p.Department).LoadAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = po.Id }, new PurchaseOrderListDto
            {
                Id = po.Id,
                OrderNumber = po.OrderNumber,
                ProductName = po.ProductName,
                ItemDescription = po.ItemDescription,
                StartupName = po.StartupProfile.CompanyName,
                DepartmentName = po.Department.Name,
                StartupProfileId = po.StartupProfileId,
                DepartmentId = po.DepartmentId,
                SandboxTrialId = po.SandboxTrialId,
                Quantity = po.Quantity,
                UnitPrice = po.UnitPrice,
                GstAmount = po.GstAmount,
                TotalAmount = po.TotalAmount,
                Rule149ExemptionRef = po.Rule149ExemptionRef,
                DeliveryConsigneeAddress = po.DeliveryConsigneeAddress,
                ProcurementOfficerName = po.ProcurementOfficerName,
                EscrowStatus = po.EscrowStatus,
                Status = po.Status,
                OrderDate = po.OrderDate
            });
        }

        // ─── PATCH /api/procurement/orders/{id}/status ─────────────────────────────
        [HttpPatch("orders/{id:guid}/status")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusDto dto)
        {
            var allowedStatuses = new[]
            {
                "ORDER_PLACED", "HARDWARE_DISPATCHED",
                "INSPECTED_DELIVERED", "COMMISSIONED_OPERATIONAL", "COMPLETED", "CANCELLED"
            };

            if (!allowedStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status value." });

            var po = await _db.PurchaseOrders.FindAsync(id);
            if (po == null) return NotFound(new { message = "Purchase order not found." });

            po.Status = dto.Status;
            po.MilestoneNotes = dto.MilestoneNotes ?? po.MilestoneNotes;

            // Auto-update escrow status
            po.EscrowStatus = dto.Status switch
            {
                "HARDWARE_DISPATCHED" => "ADVANCE_DISBURSED_40",
                "INSPECTED_DELIVERED" => "ACCEPTANCE_DISBURSED_40",
                "COMMISSIONED_OPERATIONAL" or "COMPLETED" => "FULL_DISBURSED_100",
                _ => po.EscrowStatus
            };

            po.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Order status updated.", status = po.Status, escrowStatus = po.EscrowStatus });
        }

        // ─── GET /api/procurement/orders/{id}/certificate ──────────────────────────
        [HttpGet("orders/{id:guid}/certificate")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> GetExemptionCertificate(Guid id)
        {
            var po = await _db.PurchaseOrders
                .Include(p => p.StartupProfile)
                .Include(p => p.Department)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (po == null) return NotFound();

            var cert = new ExemptionCertificateDto
            {
                CertificateNumber = $"MH-GFR149-CERT-{po.OrderNumber.Split('-').LastOrDefault()}",
                OrderNumber = po.OrderNumber,
                CompanyName = po.StartupProfile.CompanyName,
                DpiitNumber = po.StartupProfile.DpiitRecognitionNumber ?? "DPIIT-REG-N/A",
                DepartmentName = po.Department.Name,
                ProductName = po.ProductName,
                TotalAmount = po.TotalAmount,
                LegalBasis = "GFR Rule 149, Maharashtra IT & Innovation Policy 2026, Maharashtra Startup Policy",
                IssuedAt = DateTime.UtcNow,
                OfficerName = po.ProcurementOfficerName
            };

            return Ok(cert);
        }

        // ─── GET /api/procurement/validated-pilots ─────────────────────────────────
        [HttpGet("validated-pilots")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> GetValidatedPilots()
        {
            var pilots = await _db.SandboxTrials
                .Include(t => t.StartupProfile)
                .Include(t => t.Department)
                .Where(t => t.Status == "VALIDATED" || t.Status == "COMPLETED")
                .OrderByDescending(t => t.UpdatedAt)
                .Select(t => new ValidatedPilotDto
                {
                    TrialId = t.Id,
                    TrialReferenceNumber = t.TrialReferenceNumber,
                    Title = t.Title,
                    DepartmentName = t.Department.Name,
                    StartupName = t.StartupProfile.CompanyName,
                    StartupProfileId = t.StartupProfileId,
                    DepartmentId = t.DepartmentId,
                    ValidationScore = 92.5m,
                    TestingEnvironment = t.TestingEnvironment ?? "Field",
                    Location = t.Location ?? "Maharashtra",
                    MaximumBudget = t.MaximumBudget,
                    HasExistingPO = _db.PurchaseOrders.Any(po => po.SandboxTrialId == t.Id)
                })
                .ToListAsync();

            return Ok(pilots);
        }

        // ─── GET /api/procurement/startups ─────────────────────────────────────────
        [HttpGet("startups")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> GetStartups([FromQuery] string? search)
        {
            var query = _db.StartupProfiles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(s =>
                    s.CompanyName.Contains(search) ||
                    (s.DpiitRecognitionNumber != null && s.DpiitRecognitionNumber.Contains(search)));

            var startups = await query
                .Where(s => s.IsActive)
                .OrderBy(s => s.CompanyName)
                .Take(50)
                .Select(s => new { s.Id, s.CompanyName, s.DpiitRecognitionNumber, s.ProductSolutionName })
                .ToListAsync();

            return Ok(startups);
        }

        // ─── GET /api/procurement/departments ──────────────────────────────────────
        [HttpGet("departments")]
        [Authorize(Roles = "PROCUREMENT_OFFICER,ADMINISTRATOR")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _db.Departments
                .Where(d => d.IsActive)
                .OrderBy(d => d.Name)
                .Select(d => new { d.Id, d.Name, Code = d.Name })
                .ToListAsync();

            return Ok(departments);
        }
    }
}
