using System;
using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.Entities
{
    public class KnowledgeItem : BaseEntity
    {
        [Required]
        [MaxLength(500)]
        public string Question { get; set; } = string.Empty;

        [Required]
        public string Answer { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        public string Keywords { get; set; } = string.Empty; // Comma separated

        [MaxLength(255)]
        public string Source { get; set; } = string.Empty;

        public bool IsVerified { get; set; } = true;
    }
}
