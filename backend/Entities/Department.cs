using System;
using System.Collections.Generic;

namespace GovPortal.API.Entities
{
    public class Department : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public ICollection<User> Users { get; set; } = new List<User>();
        
        public ICollection<Challenge> Challenges { get; set; } = new List<Challenge>();
    }
}
