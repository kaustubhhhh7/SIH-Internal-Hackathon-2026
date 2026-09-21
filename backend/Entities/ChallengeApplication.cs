using System;

namespace GovPortal.API.Entities
{
    public class ChallengeApplication
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;
        
        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;
        
        public string Status { get; set; } = "DRAFT";
        
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
