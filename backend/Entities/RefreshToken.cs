using System;

namespace GovPortal.API.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime? Revoked { get; set; }
        public bool IsActiveToken => Revoked == null && !IsExpired;
        
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
