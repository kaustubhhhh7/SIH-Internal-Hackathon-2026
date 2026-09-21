using System;

namespace GovPortal.API.Entities
{
    public class ChallengeDocument : BaseEntity
    {
        public Guid ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;
        
        public string DocumentName { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
    }
}
