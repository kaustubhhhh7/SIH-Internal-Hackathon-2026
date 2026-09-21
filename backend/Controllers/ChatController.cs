using System;
using System.Threading.Tasks;
using GovPortal.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace GovPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message) || string.IsNullOrWhiteSpace(request.SessionId))
            {
                return BadRequest(new { message = "SessionId and Message are required." });
            }

            var responseText = await _chatService.ProcessMessageAsync(request.SessionId, request.Message);

            return Ok(new
            {
                id = Guid.NewGuid().ToString(),
                text = responseText,
                sender = "bot",
                timestamp = DateTime.UtcNow
            });
        }
    }

    public class ChatMessageRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
