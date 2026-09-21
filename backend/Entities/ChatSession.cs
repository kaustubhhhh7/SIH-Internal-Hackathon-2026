using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GovPortal.API.Entities
{
    public class ChatSession : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string SessionId { get; set; } = string.Empty;

        public Guid? UserId { get; set; }
        public User? User { get; set; }

        public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }
}
