using GovPortal.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GovPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found" });
            }

            var startup = await _context.StartupProfiles
                .FirstOrDefaultAsync(s => s.UserId == userId);

            return Ok(new
            {
                success = true,
                data = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.MobileNumber,
                    roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    startupProfile = startup != null ? new
                    {
                        startup.Id,
                        startup.CompanyName,
                        startup.DpiitRecognitionNumber,
                        startup.Pan,
                        startup.ProductSolutionName,
                        startup.Description,
                        startup.ProblemSolved,
                        startup.CurrentProductStage
                    } : null
                }
            });
        }

        [HttpGet("me/startup-profile")]
        public async Task<IActionResult> GetMyStartupProfile()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }

            var startup = await _context.StartupProfiles
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (startup == null)
            {
                return NotFound(new { success = false, message = "Startup profile not found for current user." });
            }

            return Ok(new
            {
                success = true,
                data = new
                {
                    startup.Id,
                    startup.CompanyName,
                    startup.DpiitRecognitionNumber,
                    startup.Pan,
                    startup.ProductSolutionName,
                    startup.Description,
                    startup.ProblemSolved,
                    startup.CurrentProductStage,
                    startup.CreatedAt,
                    User = new
                    {
                        startup.User.Email,
                        startup.User.MobileNumber,
                        startup.User.Username
                    }
                }
            });
        }
    }
}
