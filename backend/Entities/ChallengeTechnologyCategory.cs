using System;

namespace GovPortal.API.Entities
{
    public class ChallengeTechnologyCategory
    {
        public Guid ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;

        public Guid TechnologyCategoryId { get; set; }
        public TechnologyCategory TechnologyCategory { get; set; } = null!;
    }
}
