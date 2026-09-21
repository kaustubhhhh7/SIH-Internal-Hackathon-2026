using System;
using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.Entities
{
    public class UnansweredQuestion : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Question { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Resolved, Ignored

        public string? AdminAnswer { get; set; }

        public DateTime? ResolvedAt { get; set; }
    }
}
