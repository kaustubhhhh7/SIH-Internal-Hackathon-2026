using System;
using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.Entities
{
    public class DpiitRegistry : BaseEntity
    {
        [Required]
        [MaxLength(20)]
        public string DpiitNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string PanNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; } = string.Empty;

        public bool IsValidRegistration { get; set; } = true;
    }
}
