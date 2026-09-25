using System;
using System.Collections.Generic;

namespace GovPortal.API.Entities
{
    using GovPortal.API.Entities.Enums;

    public class StartupProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        
        public string CompanyName { get; set; } = string.Empty;
        public string DpiitRecognitionNumber { get; set; } = string.Empty;
        public string Pan { get; set; } = string.Empty;
        public string CinOrLlpin { get; set; } = string.Empty;
        public DateTime? DateOfIncorporation { get; set; }
        public string RegisteredAddress { get; set; } = string.Empty;
        
        public string ProductSolutionName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ProblemSolved { get; set; } = string.Empty;
        public string TechnologyUsed { get; set; } = string.Empty;
        public string CurrentProductStage { get; set; } = string.Empty;
        
        public ICollection<StartupDocument> Documents { get; set; } = new List<StartupDocument>();
        public ICollection<StartupTechnologyCategory> TechnologyCategories { get; set; } = new List<StartupTechnologyCategory>();
        public ICollection<SavedChallenge> SavedChallenges { get; set; } = new List<SavedChallenge>();
        public ICollection<ChallengeApplication> ChallengeApplications { get; set; } = new List<ChallengeApplication>();
        
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Draft;
        public ICollection<AIVerificationReport> AIVerificationReports { get; set; } = new List<AIVerificationReport>();
    }
}
