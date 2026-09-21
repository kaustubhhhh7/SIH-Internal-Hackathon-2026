using System;
using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.Entities
{
    public class ChatMessage : BaseEntity
    {
        public Guid ChatSessionId { get; set; }
        public ChatSession? ChatSession { get; set; }

        [Required]
        [MaxLength(10)]
        public string Sender { get; set; } = "user"; // user or bot

        [Required]
        public string Text { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Feedback on the bot's response
        public bool? IsHelpful { get; set; } 
    }
}
