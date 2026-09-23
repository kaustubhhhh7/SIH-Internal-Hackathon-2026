using GovPortal.API.Data;
using GovPortal.API.DTOs;
using GovPortal.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GovPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register/startup")]
        public async Task<IActionResult> RegisterStartup([FromBody] RegisterStartupDto dto)
        {
            // Note: In a production scenario, we'd verify the OTP here.

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email || u.Username == dto.Username))
            {
                return BadRequest(new { success = false, message = "User with this email or username already exists." });
            }

            // Create user
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                MobileNumber = dto.MobileNumber,
                PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(dto.Password)
            };

            // Assign STARTUP role
            var startupRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "STARTUP");
            if (startupRole != null)
            {
                user.UserRoles.Add(new UserRole { Role = startupRole });
            }

            // Create StartupProfile
            var startupProfile = new StartupProfile
            {
                CompanyName = dto.CompanyName,
                DpiitRecognitionNumber = dto.DpiitRecognitionNumber,
                Pan = dto.Pan,
                ProductSolutionName = dto.ProductSolutionName ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                ProblemSolved = dto.ProblemSolved ?? string.Empty,
                User = user
            };

            _context.Users.Add(user);
            _context.StartupProfiles.Add(startupProfile);

            // Audit
            _context.AuditLogs.Add(new AuditLog
            {
                Action = "Register Startup",
                EntityType = "User",
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Startup registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == dto.EmailOrUsername || u.Username == dto.EmailOrUsername);

            if (user == null || !BCrypt.Net.BCrypt.EnhancedVerify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Invalid credentials." });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new { success = false, message = "Account is deactivated. Please contact the system administrator." });
            }

            var token = GenerateJwtToken(user);
            
            // Generate refresh token
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                Expires = DateTime.UtcNow.AddDays(double.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"] ?? "7")),
                UserId = user.Id
            };
            
            _context.RefreshTokens.Add(refreshToken);
            
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = user.Id,
                Action = "Login",
                EntityType = "User",
                EntityId = user.Id.ToString()
            });
            
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(refreshToken.Token);

            return Ok(new AuthResponseDto
            {
                Success = true,
                Message = "Login successful.",
                AccessToken = token
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var tokenEntity = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
                if (tokenEntity != null)
                {
                    tokenEntity.Revoked = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }
            
            Response.Cookies.Delete("refreshToken");
            return Ok(new { success = true, message = "Logged out successfully." });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSecret = _configuration["JwtSettings:Secret"];
            if (string.IsNullOrEmpty(jwtSecret)) throw new Exception("JWT Secret is not configured.");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            if (user.DepartmentId.HasValue)
            {
                claims.Add(new Claim("DepartmentId", user.DepartmentId.Value.ToString()));
            }

            foreach (var userRole in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"] ?? "60")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetRefreshTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(double.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"] ?? "7")),
                Secure = true,
                SameSite = SameSiteMode.Strict
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }
    }
}
