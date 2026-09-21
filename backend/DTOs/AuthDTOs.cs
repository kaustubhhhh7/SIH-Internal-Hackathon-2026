using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.DTOs
{
    public class LoginDto
    {
        [Required]
        public string EmailOrUsername { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterStartupDto
    {
        [Required]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string DpiitRecognitionNumber { get; set; } = string.Empty;
        
        [Required]
        public string Pan { get; set; } = string.Empty;
        
        [Required]
        public string AuthorisedPersonName { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string MobileNumber { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
        
        public string Otp { get; set; } = string.Empty; // Optional for now
        
        // Extended startup profile fields
        public string? Category { get; set; }
        public string? ProductSolutionName { get; set; }
        public string? Description { get; set; }
        public string? ProblemSolved { get; set; }
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
    
    public class RefreshTokenDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
