using System;
using System.Collections.Generic;

namespace GovPortal.API.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalStartups { get; set; }
        public int TotalDepartments { get; set; }
        public int ActiveChallenges { get; set; }
        public int ActivePilots { get; set; }
        public int PendingVerifications { get; set; }
        public string SystemHealth { get; set; } = "Healthy";
        public List<AdminAuditLogDto> RecentAuditLogs { get; set; } = new();
    }

    public class AdminUserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
        public string? DepartmentName { get; set; }
        public string? StartupCompanyName { get; set; }
    }

    public class AdminDepartmentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int UserCount { get; set; }
        public int ChallengeCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateDepartmentDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class AdminStartupDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string DpiitRecognitionNumber { get; set; } = string.Empty;
        public string Pan { get; set; } = string.Empty;
        public string CinOrLlpin { get; set; } = string.Empty;
        public string ProductSolutionName { get; set; } = string.Empty;
        public string CurrentProductStage { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public bool IsVerified { get; set; }
        public int ApplicationCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminAuditLogDto
    {
        public Guid Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? Username { get; set; }
        public string? IpAddress { get; set; }
    }

    public class AdminSystemSettingDto
    {
        public Guid Id { get; set; }
        public string SettingKey { get; set; } = string.Empty;
        public string SettingValue { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateSystemSettingDto
    {
        public string SettingKey { get; set; } = string.Empty;
        public string SettingValue { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
