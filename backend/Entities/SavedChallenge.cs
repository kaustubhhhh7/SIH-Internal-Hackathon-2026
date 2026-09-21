using System;

namespace GovPortal.API.Entities
{
    public class SavedChallenge
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;
        
        public Guid ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
