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
                else if (!acc.IsStartup && existingUser.DepartmentId == null)
                {
                    existingUser.DepartmentId = defaultDept.Id;
                    await context.SaveChangesAsync();
                }
            }

            // --- Seed Initial Department Challenge if table is empty ---
            if (!context.Challenges.Any())
            {
                var govUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "gov@maharashtra.gov.in");
                var aiTech = await context.TechnologyCategories.FirstOrDefaultAsync(tc => tc.Name == "Artificial Intelligence");
                var iotTech = await context.TechnologyCategories.FirstOrDefaultAsync(tc => tc.Name == "IoT");

                var sampleChallenge = new Challenge
                {
                    DepartmentId = defaultDept.Id,
                    ChallengeReferenceNumber = "CH-MH-TRANS-2026-001",
                    TitleEnglish = "AI-Powered Adaptive Traffic Management for Pune-Mumbai Urban Corridor",
                    TitleMarathi = "पुणे-मुंबई शहरी कॉरिडॉरसाठी एआय-आधारित अ‍ॅडॉप्टिव्ह ट्रॅफिक व्यवस्थापन",
                    Sector = "Transport",
                    GeographicScope = "Mumbai & Pune Metropolitan Regions",
                    TargetBeneficiaries = "Daily commuters, public transit buses, emergency vehicles",
                    ProblemStatementEnglish = "Severe peak-hour vehicular congestion along arterial bottlenecks creates average delays exceeding 45 minutes and impedes emergency response vehicles.",
                    ProblemStatementMarathi = "गर्दीच्या वेळी मुख्य रस्त्यांवर होणाऱ्या प्रचंड वाहतूक कोंडीमुळे सरासरी ४५ मिनिटांपेक्षा जास्त विलंब होतो.",
                    BackgroundEnglish = "Current legacy timer-based traffic signaling cannot react dynamically to real-time vehicle queuing, causing gridlocks.",
                    CurrentSituation = "Fixed-time signals operate on pre-programmed cyclic timers regardless of live traffic volume.",
                    DesiredOutcomeEnglish = "Real-time automated signal cycle optimization reducing corridor transit time by at least 25% and giving priority clearance to emergency ambulances.",
                    ExpectedDeliverables = "Edge-computed video analytics feeds, automated signal switching logic, central monitoring dashboard.",
                    FunctionalRequirements = "Must interface with municipal surveillance CCTV cameras; provide fallback in offline network conditions.",
                    TechnicalRequirements = "Edge computing devices, sub-200ms latency, optical vehicle detection with 95%+ accuracy.",
                    EligibilityRequirements = "DPIIT-recognized startups with working prototype (TRL-6 or above).",
                    PilotRequirement = true,
                    PilotDuration = "90 Days",
                    DataRequirements = "Municipal CCTV feeds; sanitized GPS data from municipal transit buses.",
                    CybersecurityRequirements = "CERT-In certified edge firmware; TLS 1.3 encryption for all telemetry.",
                    IntellectualPropertyRequirements = "Government of Maharashtra retains state deployment license; startup retains proprietary algorithms.",
                    ProcurementExpectation = "Direct framework rate contract for 50 intersections post successful sandbox validation.",
                    EstimatedBudget = 2500000,
                    FundingType = "Grant",
                    Status = Entities.Enums.ChallengeStatus.Published,
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    SubmissionOpeningDate = DateTime.UtcNow.AddDays(-5),
                    SubmissionClosingDate = DateTime.UtcNow.AddDays(25),
                    CreatedBy = govUser?.Id.ToString() ?? "SYSTEM",
                    UpdatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                };

                if (aiTech != null)
                {
                    sampleChallenge.TechnologyCategories.Add(new ChallengeTechnologyCategory { TechnologyCategoryId = aiTech.Id });
                }
                if (iotTech != null)
                {
                    sampleChallenge.TechnologyCategories.Add(new ChallengeTechnologyCategory { TechnologyCategoryId = iotTech.Id });
                }

                context.Challenges.Add(sampleChallenge);
                await context.SaveChangesAsync();
            }

            // --- Seed Initial Sandbox Trial with KPIs and Milestones ---
            if (!context.SandboxTrials.Any())
            {
                var govUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "gov@maharashtra.gov.in");
                var startupProfile = await context.StartupProfiles.FirstOrDefaultAsync();
                var challenge = await context.Challenges.FirstOrDefaultAsync();
                var validatorUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "validator@maharashtra.gov.in");

                if (defaultDept != null && startupProfile != null && challenge != null)
                {
                    var trial = new SandboxTrial
                    {
                        TrialReferenceNumber = "SBX-MH-2026-00001",
                        DepartmentId = defaultDept.Id,
                        StartupProfileId = startupProfile.Id,
                        ChallengeId = challenge.Id,
                        ValidatorUserId = validatorUser?.Id,
                        Title = "Pune Smart City 12-Junction Real-time AI Corridor Pilot",
                        TestingEnvironment = "Municipal Field Sandbox",
                        Location = "Pune Mahanagar Parivahan Corridor (Shivajinagar to Swargate)",
                        Objective = "Deploy computer vision edge inference units at 12 arterial intersections to dynamically adapt signal timings, reducing average transit latency and prioritizing emergency response.",
                        DurationDays = 90,
                        MaximumBudget = 1850000,
                        ExpectedOutcomes = "25%+ throughput enhancement, zero manual traffic officer overrides during peak hours, and sub-200ms ambulance green-wave clearance.",
                        RiskMitigationPlan = "Fail-safe hardware relays revert automatically to legacy fixed-time controllers upon any power failure or sensor loss.",
                        Status = "PILOT_ACTIVE",
                        ApprovedAt = DateTime.UtcNow.AddDays(-18),
                        StartDate = DateTime.UtcNow.AddDays(-15),
                        EndDate = DateTime.UtcNow.AddDays(75),
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    };

                    // 1. KPI: Transit Delay Reduction
                    var kpi1 = new SandboxTrialKPI
                    {
                        Name = "Peak-Hour Transit Delay Reduction",
                        Description = "Average commute time reduction across the 6.2 km arterial corridor during morning (9-11 AM) and evening (6-9 PM) peaks.",
                        Unit = "minutes",
                        BaselineValue = 48,
                        TargetValue = 32,
                        LatestValue = 35,
                        AchievementPercentage = 81.3m, // (48 - 35) / (48 - 32) * 100 = 13/16 * 100 = 81.25
                        MeasurementMethod = "Continuous GPS beacon logs from 40 municipal city transit buses",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    };
                    kpi1.Measurements.Add(new KPIMeasurement
                    {
                        Value = 42,
                        MeasuredAt = DateTime.UtcNow.AddDays(-10),
                        MeasuredByName = "Independent Validator Panel (COEP)",
                        Notes = "Initial 5-day baseline comparison showed 6 min savings.",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });
                    kpi1.Measurements.Add(new KPIMeasurement
                    {
                        Value = 35,
                        MeasuredAt = DateTime.UtcNow.AddDays(-2),
                        MeasuredByName = "Independent Validator Panel (COEP)",
                        Notes = "Full algorithm optimization achieved 35 min average delay across 12 signals.",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });
                    trial.KPIs.Add(kpi1);

                    // 2. KPI: Emergency Vehicle Green Corridor Clearance
                    var kpi2 = new SandboxTrialKPI
                    {
                        Name = "Emergency Green-Corridor Response Clearance",
                        Description = "Time required for edge controllers to detect ambulance siren/RF beacon and switch target traffic light to green.",
                        Unit = "seconds",
                        BaselineValue = 95,
                        TargetValue = 15,
                        LatestValue = 18,
                        AchievementPercentage = 96.3m,
                        MeasurementMethod = "Field beacon response tests conducted with 108 Emergency Ambulance service",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    };
                    kpi2.Measurements.Add(new KPIMeasurement
                    {
                        Value = 18,
                        MeasuredAt = DateTime.UtcNow.AddDays(-3),
                        MeasuredByName = "Pune Traffic Branch Inspector",
                        Notes = "Simulated ambulance run from Sassoon Hospital achieved clear green light within 18 seconds.",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });
                    trial.KPIs.Add(kpi2);

                    // 3. KPI: Sensor Uptime & Optical Detection Accuracy
                    var kpi3 = new SandboxTrialKPI
                    {
                        Name = "Vehicle Queue Detection Accuracy",
                        Description = "Accuracy of AI edge vision model detecting queue density under heavy rain and night conditions.",
                        Unit = "%",
                        BaselineValue = 72,
                        TargetValue = 95,
                        LatestValue = 94,
                        AchievementPercentage = 95.7m,
                        MeasurementMethod = "Random sampling comparison of 2,000 camera frames against manual counter audits",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    };
                    trial.KPIs.Add(kpi3);

                    // Milestones (30% - 40% - 30%)
                    trial.Milestones.Add(new TrialMilestone
                    {
                        Name = "Stage 1: Field Mobilization & Edge Device Installation (12 Junctions)",
                        Percentage = 30,
                        AllocatedAmount = 555000,
                        DueDate = DateTime.UtcNow.AddDays(-10),
                        Status = "APPROVED",
                        EvidenceSummary = "All 12 edge inference boxes mounted and optical sensors calibrated. Certified by Pune Smart City SPV.",
                        Remarks = "Tranche 1 (₹5.55 Lakhs) disbursed to startup escrow account.",
                        ApprovedAt = DateTime.UtcNow.AddDays(-8),
                        ApprovedByUserId = govUser?.Id,
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });

                    trial.Milestones.Add(new TrialMilestone
                    {
                        Name = "Stage 2: Mid-Trial Live Telemetry & Field Performance Verification",
                        Percentage = 40,
                        AllocatedAmount = 740000,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        Status = "SUBMITTED",
                        EvidenceSummary = "30-day continuous telemetry dataset submitted with 81% target achievement in transit delay reduction.",
                        Remarks = "Under joint inspection by Independent Validator panel.",
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });

                    trial.Milestones.Add(new TrialMilestone
                    {
                        Name = "Stage 3: Full 90-Day Operational Handover & Independent Evaluation Sign-Off",
                        Percentage = 30,
                        AllocatedAmount = 555000,
                        DueDate = DateTime.UtcNow.AddDays(75),
                        Status = "PENDING",
                        EvidenceSummary = string.Empty,
                        CreatedBy = govUser?.Id.ToString() ?? "SYSTEM"
                    });

                    // History
                    trial.StatusHistory.Add(new TrialStatusHistory
                    {
                        PreviousStatus = "NONE",
                        NewStatus = "DRAFT",
                        ChangedByUserId = govUser?.Id ?? Guid.Empty,
                        ChangedByName = "Executive Engineer, Transport Dept",
                        Reason = "Drafted sandbox proposal following startup showcase shortlisting."
                    });
                    trial.StatusHistory.Add(new TrialStatusHistory
                    {
                        PreviousStatus = "DRAFT",
                        NewStatus = "APPROVED",
                        ChangedByUserId = govUser?.Id ?? Guid.Empty,
                        ChangedByName = "State Innovation Committee",
                        Reason = "Sanctioned ₹18.50 Lakhs pilot budget under Maharashtra Innovation Policy GFR 149 exemption."
                    });
                    trial.StatusHistory.Add(new TrialStatusHistory
                    {
                        PreviousStatus = "APPROVED",
                        NewStatus = "PILOT_ACTIVE",
                        ChangedByUserId = govUser?.Id ?? Guid.Empty,
                        ChangedByName = "Project Director, Transport",
                        Reason = "Edge devices installed and field trial initiated."
                    });

                    context.SandboxTrials.Add(trial);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
