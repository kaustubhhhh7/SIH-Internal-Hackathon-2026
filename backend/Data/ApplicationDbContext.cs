using GovPortal.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace GovPortal.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<UserRole> UserRoles { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<RolePermission> RolePermissions { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<StartupProfile> StartupProfiles { get; set; } = null!;
        public DbSet<StartupDocument> StartupDocuments { get; set; } = null!;
        public DbSet<TechnologyCategory> TechnologyCategories { get; set; } = null!;
        public DbSet<StartupTechnologyCategory> StartupTechnologyCategories { get; set; } = null!;
        public DbSet<Challenge> Challenges { get; set; } = null!;
        public DbSet<ChallengeDocument> ChallengeDocuments { get; set; } = null!;
        public DbSet<Notification> Notifications { get; set; } = null!;
        public DbSet<SystemSetting> SystemSettings { get; set; } = null!;
        public DbSet<SavedChallenge> SavedChallenges { get; set; } = null!;
        public DbSet<ChallengeApplication> ChallengeApplications { get; set; } = null!;
        public DbSet<ChallengeTechnologyCategory> ChallengeTechnologyCategories { get; set; } = null!;
        public DbSet<KnowledgeItem> KnowledgeBase { get; set; } = null!;
        public DbSet<UnansweredQuestion> UnansweredQuestions { get; set; } = null!;
        public DbSet<ChatSession> ChatSessions { get; set; } = null!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Users
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.MobileNumber);

            // Configure StartupProfile
            modelBuilder.Entity<StartupProfile>()
                .HasIndex(s => s.DpiitRecognitionNumber);
            modelBuilder.Entity<StartupProfile>()
                .HasIndex(s => s.Pan);
            modelBuilder.Entity<StartupProfile>()
                .HasIndex(s => s.CinOrLlpin);

            // Configure Challenge
            modelBuilder.Entity<Challenge>()
                .HasIndex(c => c.ChallengeReferenceNumber)
                .IsUnique();
            modelBuilder.Entity<Challenge>()
                .HasIndex(c => c.Status);

            // Foreign Keys for Many-to-Many
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });
            
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);
                
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });
                
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            modelBuilder.Entity<StartupTechnologyCategory>()
                .HasKey(stc => new { stc.StartupProfileId, stc.TechnologyCategoryId });

            modelBuilder.Entity<StartupTechnologyCategory>()
                .HasOne(stc => stc.StartupProfile)
                .WithMany(sp => sp.TechnologyCategories)
                .HasForeignKey(stc => stc.StartupProfileId);

            modelBuilder.Entity<StartupTechnologyCategory>()
                .HasOne(stc => stc.TechnologyCategory)
                .WithMany(tc => tc.StartupTechnologyCategories)
                .HasForeignKey(stc => stc.TechnologyCategoryId);

            modelBuilder.Entity<ChallengeTechnologyCategory>()
                .HasKey(ctc => new { ctc.ChallengeId, ctc.TechnologyCategoryId });

            modelBuilder.Entity<ChallengeTechnologyCategory>()
                .HasOne(ctc => ctc.Challenge)
                .WithMany(c => c.TechnologyCategories)
                .HasForeignKey(ctc => ctc.ChallengeId);

            modelBuilder.Entity<ChallengeTechnologyCategory>()
                .HasOne(ctc => ctc.TechnologyCategory)
                .WithMany(tc => tc.ChallengeTechnologyCategories)
                .HasForeignKey(ctc => ctc.TechnologyCategoryId);

            // Configure SavedChallenges
            modelBuilder.Entity<SavedChallenge>()
                .HasIndex(sc => new { sc.StartupProfileId, sc.ChallengeId })
                .IsUnique();

            modelBuilder.Entity<SavedChallenge>()
                .HasOne(sc => sc.StartupProfile)
                .WithMany(sp => sp.SavedChallenges)
                .HasForeignKey(sc => sc.StartupProfileId);
                
            modelBuilder.Entity<SavedChallenge>()
                .HasOne(sc => sc.Challenge)
                .WithMany(c => c.SavedByStartups)
                .HasForeignKey(sc => sc.ChallengeId);

            // Configure ChallengeApplication
            modelBuilder.Entity<ChallengeApplication>()
                .HasOne(ca => ca.StartupProfile)
                .WithMany(sp => sp.ChallengeApplications)
                .HasForeignKey(ca => ca.StartupProfileId);

            modelBuilder.Entity<ChallengeApplication>()
                .HasOne(ca => ca.Challenge)
                .WithMany(c => c.Applications)
                .HasForeignKey(ca => ca.ChallengeId);

            // 1-to-1 mappings
            modelBuilder.Entity<User>()
                .HasOne(u => u.StartupProfile)
                .WithOne(sp => sp.User)
                .HasForeignKey<StartupProfile>(sp => sp.UserId);

            // Audit Logs
            modelBuilder.Entity<AuditLog>()
                .HasIndex(a => a.UserId);
            modelBuilder.Entity<AuditLog>()
                .HasIndex(a => a.Timestamp);

            // Chatbot
            modelBuilder.Entity<ChatMessage>()
                .HasOne(m => m.ChatSession)
                .WithMany(s => s.Messages)
                .HasForeignKey(m => m.ChatSessionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
