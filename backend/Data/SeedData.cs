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
        }
    }
}
