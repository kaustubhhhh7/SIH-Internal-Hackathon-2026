using System;

namespace GovPortal.API.Entities
{
    public class AIVerificationReport : BaseEntity
    {
        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;
        
        // Structured JSON payload representing the AI's analysis
        public string RawJsonAnalysis { get; set; } = string.Empty;
        
        // A computed score from the AI (e.g. 0-100)
        public int Score { get; set; }
        
        public bool IsRecommended { get; set; }
    }
}
