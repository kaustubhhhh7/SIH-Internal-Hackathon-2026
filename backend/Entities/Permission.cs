using System.Collections.Generic;

namespace GovPortal.API.Entities
{
    public class Permission : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
