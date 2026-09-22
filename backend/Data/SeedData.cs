using System;
using System.Linq;
using System.Threading.Tasks;
using GovPortal.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GovPortal.API.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var context = new ApplicationDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

            // Ensure database is created (we use migrations, so just to be safe if no DB exists)
            // But we don't want to run Migrate() here automatically unless requested.

            if (!context.TechnologyCategories.Any())
            {
                var categories = new[]
                {
                    new TechnologyCategory { Name = "Artificial Intelligence", Description = "AI and Machine Learning" },
                    new TechnologyCategory { Name = "Blockchain", Description = "Distributed Ledger Technology" },
                    new TechnologyCategory { Name = "IoT", Description = "Internet of Things" },
                    new TechnologyCategory { Name = "Drones", Description = "Unmanned Aerial Vehicles" },
                    new TechnologyCategory { Name = "Robotics", Description = "Automation and Robotics" },
                    new TechnologyCategory { Name = "Data Analytics", Description = "Big Data and Analytics" },
                    new TechnologyCategory { Name = "Cybersecurity", Description = "Information Security" },
                    new TechnologyCategory { Name = "AR/VR", Description = "Augmented and Virtual Reality" },
                    new TechnologyCategory { Name = "GovTech", Description = "Government Technology Solutions" },
                    new TechnologyCategory { Name = "EdTech", Description = "Education Technology" },
                    new TechnologyCategory { Name = "HealthTech", Description = "Healthcare Technology" }
                };

                context.TechnologyCategories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            if (!context.KnowledgeBase.Any())
            {
                var faqs = new[]
                {
                    new KnowledgeItem 
                    { 
                        Question = "Who are you?", 
                        Answer = "I am StartupSetu's AI Assistant. I can help you understand startup registration, eligibility, government procurement, pilot opportunities, required documents, and the application process.", 
                        Category = "General", 
                        Keywords = "who, are, you, identity, bot, AI", 
                        Source = "System", 
                        IsVerified = true 
                    },
                    new KnowledgeItem 
                    { 
                        Question = "What is this portal?", 
                        Answer = "StartupSetu is a government initiative that connects operational challenges faced by government departments with verified startup solutions through an evidence-based procurement pipeline.", 
                        Category = "General", 
                        Keywords = "what, is, this, portal, platform, StartupSetu", 
                        Source = "Portal About", 
                        IsVerified = true 
                    },
                    new KnowledgeItem 
                    { 
                        Question = "How do I register as a Startup?", 
                        Answer = "To register, click the 'Register Startup' button on the homepage. You will need your DPIIT Recognition Number, PAN, and company incorporation details.", 
                        Category = "Registration", 
                        Keywords = "how, register, startup, sign up, account", 
                        Source = "Registration Guidelines", 
                        IsVerified = true 
                    },
                    new KnowledgeItem 
                    { 
                        Question = "What is a DPIIT recognition number?", 
                        Answer = "DPIIT recognition is granted by the Department for Promotion of Industry and Internal Trade. Startups must be recognized to be eligible for government pilots through this portal.", 
                        Category = "Eligibility", 
                        Keywords = "DPIIT, recognition, number, eligibility", 
                        Source = "Eligibility Guidelines", 
                        IsVerified = true 
                    },
                    new KnowledgeItem 
                    { 
                        Question = "What documents are required?", 
                        Answer = "You need your DPIIT Recognition Certificate, PAN Card, Certificate of Incorporation/LLP, and an authorized representative's authorization letter.", 
                        Category = "Documents", 
                        Keywords = "documents, required, needed, upload", 
                        Source = "Registration Guidelines", 
                        IsVerified = true 
                    },
                    new KnowledgeItem 
                    { 
                        Question = "What is the evaluation process?", 
                        Answer = "Applications undergo a 3-step evaluation: Technical Evaluation, Independent Validation, and Financial Proposal check before a pilot is awarded.", 
                        Category = "Process", 
                        Keywords = "evaluation, process, selection, pilot", 
                        Source = "Process Guide", 
                        IsVerified = true 
                    }
                };

                context.KnowledgeBase.AddRange(faqs);
                await context.SaveChangesAsync();
            }

            // --- Seed System Roles ---
            var roleNames = new[]
            {
                ("STARTUP", "DPIIT-recognized Startup & Innovator"),
                ("GOVERNMENT_DEPARTMENT", "Government Department & Municipal Officer"),
                ("EXPERT_EVALUATOR", "Technical & Financial Expert Evaluator"),
                ("INDEPENDENT_VALIDATOR", "Independent Third-Party Pilot Validator"),
                ("PROCUREMENT_OFFICER", "State Procurement & GeM Work Order Officer"),
                ("ADMINISTRATOR", "Portal System Administrator")
            };

            foreach (var (rName, rDesc) in roleNames)
            {
                if (!context.Roles.Any(r => r.Name == rName))
                {
                    context.Roles.Add(new Role { Name = rName, Description = rDesc });
                }
            }
            await context.SaveChangesAsync();

            // --- Seed Default Department ---
            var defaultDept = await context.Departments.FirstOrDefaultAsync(d => d.Name == "Department of Transport");
            if (defaultDept == null)
            {
                defaultDept = new Department
                {
                    Name = "Department of Transport",
                    Description = "Government of Maharashtra Transport & Urban Mobility Department"
                };
                context.Departments.Add(defaultDept);
                await context.SaveChangesAsync();
            }

            // --- Seed Dummy Credentials for All Logins ---
            var defaultPasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("Password123!");

            var dummyAccounts = new[]
            {
                new {
                    Username = "startup_demo",
                    Email = "startup@maharashtra.gov.in",
                    Mobile = "9876543210",
                    Role = "STARTUP",
                    IsStartup = true
                },
                new {
                    Username = "gov_officer",
                    Email = "gov@maharashtra.gov.in",
                    Mobile = "9876543211",
                    Role = "GOVERNMENT_DEPARTMENT",
                    IsStartup = false
                },
                new {
                    Username = "expert_evaluator",
                    Email = "expert@maharashtra.gov.in",
                    Mobile = "9876543212",
                    Role = "EXPERT_EVALUATOR",
                    IsStartup = false
                },
                new {
                    Username = "independent_validator",
                    Email = "validator@maharashtra.gov.in",
                    Mobile = "9876543213",
                    Role = "INDEPENDENT_VALIDATOR",
                    IsStartup = false
                },
                new {
                    Username = "procurement_officer",
                    Email = "procurement@maharashtra.gov.in",
                    Mobile = "9876543214",
                    Role = "PROCUREMENT_OFFICER",
                    IsStartup = false
                },
                new {
                    Username = "admin_super",
                    Email = "admin@maharashtra.gov.in",
                    Mobile = "9876543215",
                    Role = "ADMINISTRATOR",
                    IsStartup = false
                }
            };

            foreach (var acc in dummyAccounts)
            {
                var existingUser = await context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email == acc.Email || u.Username == acc.Username);

                if (existingUser == null)
                {
                    var targetRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == acc.Role);
                    var newUser = new User
                    {
                        Username = acc.Username,
                        Email = acc.Email,
                        MobileNumber = acc.Mobile,
                        PasswordHash = defaultPasswordHash,
                        DepartmentId = !acc.IsStartup ? defaultDept.Id : null
                    };

                    if (targetRole != null)
                    {
                        newUser.UserRoles.Add(new UserRole { Role = targetRole });
                    }

                    context.Users.Add(newUser);
                    await context.SaveChangesAsync();

                    if (acc.IsStartup)
                    {
                        var profile = new StartupProfile
                        {
                            UserId = newUser.Id,
                            CompanyName = "Apex AI Mobility Solutions Pvt Ltd",
                            DpiitRecognitionNumber = "DIPP104829",
                            Pan = "AAACA1234F",
                            CinOrLlpin = "U72900MH2023PTC401294",
                            ProductSolutionName = "Adaptive AI Traffic Signal Control System",
                            Description = "AI-powered real-time computer vision system that dynamically adjusts signal cycle timings.",
                            ProblemSolved = "Reduces congestion by 35% at high-density municipal intersections without expensive infrastructure overhaul.",
                            CurrentProductStage = "Validation / TRL-7"
                        };
                        context.StartupProfiles.Add(profile);
                        await context.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
