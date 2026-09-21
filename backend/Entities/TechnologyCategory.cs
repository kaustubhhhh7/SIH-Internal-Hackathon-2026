using System.Collections.Generic;

namespace GovPortal.API.Entities
{
    public class TechnologyCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public ICollection<StartupTechnologyCategory> StartupTechnologyCategories { get; set; } = new List<StartupTechnologyCategory>();
        public ICollection<ChallengeTechnologyCategory> ChallengeTechnologyCategories { get; set; } = new List<ChallengeTechnologyCategory>();
    }
}
