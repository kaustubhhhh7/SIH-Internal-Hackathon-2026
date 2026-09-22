# Project Overview: Government Innovation Procurement Portal (IPP)

> **Document Purpose:** Complete end-to-end architectural, functional, database, and status breakdown of the current codebase. Use this document to evaluate the system with ChatGPT / AI advisors to plan enhancements, fixes, and next steps for the Smart India Hackathon (SIH) solution.

---

## 1. Executive Summary & Problem Solved

### The Problem
In standard government procurement (General Financial Rules / state tender rules), startups cannot participate in public sector projects because legacy tenders demand:
- 3+ years of audited turnover,
- Prior commercial execution track records,
- Substantial Earnest Money Deposits (EMD) and tender fees.

As a result, deep-tech startups with cutting-edge solutions (AI, drones, IoT, clean robotics) cannot deliver their products to government municipal corporations, departments, or state bodies.

### The Solution (This Platform)
Built on the **Maharashtra Innovation Framework & GFR 149 Exemptions**, this portal acts as a **Direct Startup-to-Government Procurement Gateway**:
1. **DPIIT & MSME Fast-Track**: Verifies recognized startups automatically; eliminates EMD and prior-turnover hurdles.
2. **Reverse Challenge Problem Statements**: Government departments publish operational hurdles (e.g., traffic congestion, rural healthcare telemedicine, sewer inspection). Startups submit technical solutions.
3. **Paid Field Trial / Sandbox Phase**: Rather than awarding a blind multi-crore contract, the state funds a 90-day sandbox pilot (up to ₹25 Lakhs milestone-linked grant) in an actual district/municipal environment.
4. **Third-Party Independent Validation**: An unbiased technical jury (IIT Bombay, COEP, etc.) evaluates real field telemetry against agreed KPIs.
5. **Direct Commercial GeM Work Orders**: Innovations that pass validation are awarded direct purchase orders under Rule 149 without a legacy open tender.

---

## 2. System Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------------+
|                                    FRONTEND CLIENT                                      |
|  React 19 (TypeScript) + Vite 8 + Tailwind CSS v4 + React Router v7 + TanStack Query    |
+-----------------------------------------------------------------------------------------+
                                        │  ▲
                        REST Endpoints  │  │  JWT Bearer Tokens (HttpOnly Refresh)
                                        ▼  │
+-----------------------------------------------------------------------------------------+
|                                    BACKEND API                                          |
|  ASP.NET Core 9.0 (.NET 9 / C# 13) Web API                                              |
|  - Controllers: Auth, GovDashboard, Challenges, StartupChallenges, Users, Knowledge, Chat|
|  - Services: Local RAG Chatbot Service, Email / Notifications, Audit Logger             |
|  - ORM: Entity Framework Core 9 (Npgsql Provider)                                       |
+-----------------------------------------------------------------------------------------+
                                        │  ▲
                                        ▼  │
+-----------------------------------------------------------------------------------------+
|                                DATABASE (PostgreSQL)                                    |
|  22 Relational Database Tables + Code-First EF Core Migrations                          |
+-----------------------------------------------------------------------------------------+
```

### Frontend Dependencies:
- **Framework:** React `19.2.8`, TypeScript `~6.0.2`, Vite `8.3.0`
- **Styling:** Tailwind CSS `4.3.3`, `@tailwindcss/vite`, Lucide Icons
- **State & Networking:** TanStack React Query `^5.103.1`, Axios `^1.20.0`
- **Forms & Validation:** React Hook Form `^7.88.0`, Zod `^3.25.76`
- **Localization:** `i18next` & `react-i18next` (English & Marathi support)
- **Charts:** Recharts `^3.10.1`

### Backend Dependencies:
- **Framework:** .NET 9.0 Web API, C# 13
- **ORM:** Entity Framework Core `9.0.0`, `Npgsql.EntityFrameworkCore.PostgreSQL`
- **Security:** `Microsoft.AspNetCore.Authentication.JwtBearer`, `BCrypt.Net-Next`
- **AI Assist:** Local RAG Retrieval-Augmented Generation chatbot service (`LocalRagChatService.cs`)

---

## 3. Database Schema (PostgreSQL / EF Core)

The backend has **22 Tables** mapped in `ApplicationDbContext.cs`:

| # | Table Name | Purpose | Key Fields |
|---|------------|---------|------------|
| 1 | `Users` | Master accounts table across all 6 stakeholder roles | `Id`, `Username`, `Email`, `PasswordHash`, `MobileNumber`, `DepartmentId`, `IsActive` |
| 2 | `Roles` | System RBAC roles | `Id`, `Name`, `Description` |
| 3 | `UserRoles` | Join table for Many-to-Many users and roles | `UserId`, `RoleId` |
| 4 | `Permissions` | Granular action permissions | `Id`, `Name`, `Module` |
| 5 | `RolePermissions`| Join table for roles and permissions | `RoleId`, `PermissionId` |
| 6 | `RefreshTokens` | Long-lived secure refresh tokens | `Id`, `Token`, `ExpiresAt`, `RevokedAt`, `UserId` |
| 7 | `Departments` | Official state departments & municipal bodies | `Id`, `Name`, `Description`, `IsActive` |
| 8 | `StartupProfiles`| Startup company registry & credentials | `Id`, `UserId`, `CompanyName`, `DpiitRecognitionNumber`, `Pan`, `CinOrLlpin`, `Stage`, `IncorporationDate`, `WebsiteUrl` |
| 9 | `StartupDocuments`| Uploaded proof (DPIIT certificates, GST, CIN, pitch decks) | `Id`, `StartupProfileId`, `DocumentType`, `FileUrl`, `Verified` |
| 10 | `TechnologyCategories` | Industry classifications (AI, Robotics, MedTech, AgriTech, CleanTech) | `Id`, `Name`, `Description` |
| 11 | `StartupTechnologyCategories` | Many-to-many linking startups with categories | `StartupProfileId`, `TechnologyCategoryId` |
| 12 | `Challenges` | Reverse problem statements published by government | `Id`, `DepartmentId`, `ChallengeReferenceNumber`, `TitleEnglish`, `TitleMarathi`, `Sector`, `ProblemStatementEnglish`, `Status`, `EstimatedBudget`, `SubmissionClosingDate` |
| 13 | `ChallengeDocuments` | Technical RFP docs, guideline PDFs attached to challenges | `Id`, `ChallengeId`, `Title`, `FileUrl` |
| 14 | `ChallengeTechnologyCategories` | Categories linked to specific challenges | `ChallengeId`, `TechnologyCategoryId` |
| 15 | `ChallengeApplications` | Bids / proposals submitted by startups for challenges | `Id`, `ChallengeId`, `StartupProfileId`, `Status`, `StartedAt`, `LastUpdatedAt` |
| 16 | `SavedChallenges` | Startup bookmarks / watchlist | `Id`, `StartupProfileId`, `ChallengeId` |
| 17 | `KnowledgeBase` | Portal circulars, procurement manuals, and FAQs | `Id`, `Question`, `Answer`, `Category`, `Keywords`, `IsVerified` |
| 18 | `UnansweredQuestions` | Questions asked in AI chatbot that lacked a verified answer | `Id`, `Question`, `AskedAt`, `Answered` |
| 19 | `ChatSessions` | Chatbot session tracking | `Id`, `UserId`, `CreatedAt` |
| 20 | `ChatMessages` | Individual prompt & AI response records | `Id`, `ChatSessionId`, `Role`, `Content`, `Timestamp` |
| 21 | `AuditLogs` | Immutable regulatory trail of administrative actions | `Id`, `UserId`, `Action`, `EntityType`, `EntityId`, `Timestamp` |
| 22 | `SystemSettings` | Dynamic portal configurations | `Id`, `Key`, `Value` |

---

## 4. What Was Done Recently (Recent Work & Fixes)

### 1. Government Department Dashboard Connected to Live PostgreSQL Backend (100% Real)
- **Previous Problem:** 
  - KPI cards showed `0`.
  - Recent Challenges showed `"Error loading challenges. Please try again later."`.
  - The dashboard was disconnected from ASP.NET Core and PostgreSQL.
- **Root Cause Discovered:**
  - `AuthController.cs` issued JWT with `sub`, but `ChallengesController.cs` was looking for `User.FindFirst("UserId")`. This caused user ID to evaluate to `Guid.Empty`.
  - Department lookup failed with `403 Forbidden` because `department` was null for `Guid.Empty`.
  - `Login.tsx` caught the error and saved a dummy token (`demo-token-...`), which caused all subsequent Axios calls to fail with `401 Unauthorized`.
- **Backend Fixes Made:**
  - `AuthController.cs`: Included `UserId`, `ClaimTypes.NameIdentifier`, `ClaimTypes.Role`, and `DepartmentId` claims in JWT generation.
  - `GovDashboardController.cs`: Created new `GET /api/gov/dashboard` endpoint returning real counts from PostgreSQL:
    - `activeChallenges`: Count of department challenges where status != Cancelled.
    - `totalApplications`: Total applications submitted for this department's challenges.
    - `underEvaluation`: Applications in `UNDER_EVALUATION` or `SUBMITTED` state.
    - `activePilots`: 0 (since sandbox pilot database integration is scheduled next).
    - `recentChallenges`: Top 10 newest challenges for the department sorted by `CreatedAt DESC`.
    - `departmentName`: Department name from database.
  - `ChallengesController.cs`: Fixed `GetUserId()` and added `GetUserDepartmentAsync()` to resolve the user's department accurately from `user.DepartmentId` and navigation relations.
  - `UsersController.cs`: Updated `/api/users/me` to return authenticated department details.
  - `SeedData.cs`: Linked `gov@maharashtra.gov.in` to `Department of Transport` and seeded initial realistic challenge `CH-MH-TRANS-2026-001`.
- **Frontend Fixes Made:**
  - `Dashboard.tsx`: Replaced mock list query with `govChallengeApi.getGovDashboard()`. Connected KPI cards to live database values. Added **Deadline** column. Added refresh button and clear error handling.
  - `CreateChallenge.tsx`: Sanitized date and budget payload, submit directly to `POST /api/challenges`, and redirect to `/gov/dashboard`.
  - `Login.tsx`: Removed fake demo token fallback. Saves real JWT token and department profile from `/api/users/me`.
  - `axios.ts`: Added response interceptor for clean 401 token invalidation.
  - `App.tsx`: Registered `/gov/challenges` and `/gov/challenges/:id` routes.

### 2. Challenge Creation Form Stepper UI Fix
- **Previous Problem:** 
  - Step progress bar on `/gov/challenges/create` had an ugly horizontal scrollbar and used fixed `vw` widths that broke layout.
- **Fix Made:**
  - Replaced `overflow-x-auto` with clean flex layout (`relative z-10 flex-1`).
  - Added dynamic background connecting progress bar that smoothly fills up as steps advance.
  - Removed horizontal scrollbar completely.

### 3. Public Pages & Indian Government Design System
- Built full GIGW-compliant government layout with national emblem, bilingual switcher (EN/MR), high-contrast toggle, font scalers.
- Developed interactive Government Procurement Helpdesk & Public FAQ section with question submission, local persistence, and category filters.
- Replaced temporary/mock UI boxes on home page with clear, production-grade Maharashtra Government portal sections.

---

## 5. Detailed Status: What Is Working vs What Is Not Working

### ✅ WHAT IS WORKING FULLY (Production-Ready / Database-Connected)

1. **Government Authentication & Department Identification:**
   - Real login via `POST /api/auth/login`.
   - Real JWT with user ID, roles, and `DepartmentId`.
   - Profile retrieval via `GET /api/users/me` returning department name.
2. **Government Department Dashboard (`/gov/dashboard`):**
   - Live endpoint `GET /api/gov/dashboard` returning real PostgreSQL counts for Active Challenges, Total Applications, Under Evaluation, and Recent Challenges.
   - Refreshes automatically and displays department name ("Department of Transport").
3. **Challenge Creation Workflow (`/gov/challenges/create`):**
   - 7-step interactive challenge creation form (Basic Info, Problem Definition, Outcomes, Eligibility & Pilot, Data & IP, Timeline, Review).
   - Clean stepper without scrollbar.
   - Saves directly to PostgreSQL via `POST /api/challenges`.
   - Auto-generates reference numbers (e.g. `MH-CH-2026-00001`).
   - Immediately increases Active Challenges count and appears at top of Recent Challenges table upon redirect.
4. **Public Portal Pages:**
   - `/` (Home): Hero, procurement stages, SOP, live FAQ helpdesk.
   - `/challenges`: Public challenges list with search and filter.
   - `/showcase`: Product showcase catalogue with category filters and product details modal.
   - `/runway`: Startup runway category breakdown.
   - `/process`: SOP process explanation.
5. **Multi-Role Login Demo Switcher (`/login`):**
   - 1-click test personas for all 6 roles with real seeded database credentials (`Password123!`).
6. **Code Health & Compilation:**
   - Frontend: `tsc -b && vite build` succeeds with 0 errors.
   - Backend: `dotnet build` succeeds with 0 warnings, 0 errors.

---

### ❌ WHAT IS NOT WORKING YET / CURRENT LIMITATIONS (Needs Work)

1. **Field Sandbox Trials Workflow (`/gov/sandbox-trials`):**
   - Currently uses client-side store (`productStore.ts`).
   - There are no dedicated PostgreSQL tables yet for Sandbox Trials (e.g. `SandboxTrials`, `TrialMilestones`, `TelemetryLogs`).
   - The "Active Pilots" KPI on the Gov Dashboard currently returns `0` by design until this table is created.
2. **Startup Challenge Application Flow (`/startup/challenges/:id`):**
   - Startups can view challenges, but submitting a multi-step bid/application proposal is not yet wired to a dedicated multi-step form saving into `ChallengeApplications`.
3. **Startup Product Listing (`/startup/products/add`):**
   - Startups can add products, but it currently saves to `localStorage` / `productStore.ts` rather than a PostgreSQL `Products` table.
4. **Expert Evaluator Dashboard (`/expert/dashboard`):**
   - Visually present, but uses simulated data. Scoring rubrics (Technical Feasibility, Financial Viability, Swadeshi/IP score) need to connect to backend.
5. **Independent Pilot Validator Dashboard (`/validator/dashboard`):**
   - Visually present, but uses simulated telemetry. Needs milestone validation submission.
6. **Procurement Officer Dashboard & Work Orders (`/procurement/dashboard`, `/procurement/issue-po`):**
   - Generates GeM work order format client-side; needs backend persistence and contract generation.
7. **Document Uploads:**
   - File input controls exist, but files are not uploaded to cloud storage or local disk; they only store filename metadata.

---

## 6. Prompt to Give to ChatGPT / LLM for Next Steps

*Copy and paste the exact prompt below into ChatGPT:*

```markdown
We are building the **Innovation Procurement Portal (IPP)** for the Smart India Hackathon (SIH 2026).
The portal allows deep-tech startups to bypass legacy tender hurdles (3 years turnover, EMD, past track record) through GFR 149 & Maharashtra Innovation Framework by providing:
Reverse Challenges -> 90-Day Paid Sandbox Field Trials -> Independent Validation -> Direct GeM Work Orders.

Our Tech Stack:
- Frontend: React 19, TypeScript, Vite 8, Tailwind CSS v4, TanStack React Query, Axios
- Backend: ASP.NET Core 9.0 (.NET 9 / C# 13) Web API
- Database: PostgreSQL with EF Core 9 (22 existing tables)

CURRENT STATUS:
We just finished connecting the Government Department Dashboard (/gov/dashboard) and Challenge Creation (/gov/challenges/create) 100% end-to-end to ASP.NET Core 9 and PostgreSQL. It creates real database challenges and derives live KPIs.

Read the full PROJECT_OVERVIEW.md above to see:
1. Exactly what is working properly.
2. Exactly what is NOT working properly yet (e.g., Sandbox Trials DB integration, Startup Application form, Evaluator scoring, Procurement PO generation).

Based on this:
1. What should be our NEXT immediate priority task to make our SIH solution most impressive to the government jury?
2. Provide a detailed, step-by-step implementation prompt that I can feed back to my coding agent to implement that next feature end-to-end without creating mock data.
```
