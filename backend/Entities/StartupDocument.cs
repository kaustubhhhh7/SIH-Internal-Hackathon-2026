using System;

namespace GovPortal.API.Entities
{
    public class StartupDocument : BaseEntity
    {
        public Guid StartupProfileId { get; set; }
        public StartupProfile StartupProfile { get; set; } = null!;
        
        public string DocumentName { get; set; } = string.Empty;
        public string DocumentType { get; set; } = string.Empty; // e.g. Certification, PreviousDeployment
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
    }
}
