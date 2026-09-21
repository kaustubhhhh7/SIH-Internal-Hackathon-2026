using System;

namespace GovPortal.API.Entities
{
    public class StartupTechnologyCategory : BaseEntity
    {
        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;
        
        public Guid TechnologyCategoryId { get; set; }
        public TechnologyCategory TechnologyCategory { get; set; } = null!;
    }
}
