# Innovation Procurement Portal (IPP) - Project Overview

## What We Built
A full-stack web platform that acts as a **Direct Startup-to-Government Procurement Gateway** under **GFR Rule 149 and Maharashtra Innovation Framework**, eliminating legacy tender barriers (3-year turnover, EMD, prior track record) for DPIIT-recognized deep-tech startups.

---

## The Problem
Standard government tenders require:
- 3+ years audited turnover
- Prior execution track records
- Earnest Money Deposits (EMD)
- ISO/BIS certifications

Deep-tech startups with AI, drones, IoT, robotics solutions **cannot participate** — India loses innovation.

---

## Our Solution: 5-Stage Procurement Lifecycle

```
[1] GOV DEPT publishes Reverse Challenge
        ↓
[2] STARTUP submits Bid/Proposal (GFR 149 EMD exempt)
        ↓
[3] EXPERT evaluates bids (TRL, financial, Swadeshi score)
        ↓
[4] 90-Day Paid Field Sandbox Trial (up to Rs.25L milestone grant)
        ↓
[5] VALIDATOR issues Pass/Fail cert → PROCUREMENT OFFICER issues GeM Work Order
        ↓
[ESCROW DBT] 40% dispatch → 40% acceptance → 20% commissioning
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| State | TanStack React Query, Axios |
| Forms | React Hook Form + Zod |
| i18n | i18next (English + Marathi) |
| Charts | Recharts |
| Backend | ASP.NET Core (.NET 9.0 / C# 13) Web API |
| ORM | Entity Framework Core 9 + Npgsql |
| Database | PostgreSQL 15+ |
| Auth | JWT Bearer + BCrypt password hashing |
| AI Chat | Local RAG Chat Service (Knowledge Base) |
| Hosting | Netlify (frontend), Any .NET 9 runtime (backend) |

---

## 6 Roles (RBAC)

| Role | Dashboard | Key Capabilities |
|---|---|---|
| STARTUP | /startup/dashboard | Browse challenges, submit bids, track pilot KPIs, DBT disbursements |
| GOVERNMENT_DEPARTMENT | /gov/dashboard | Publish challenges (7-step wizard), manage sandbox trials, view applications |
| EXPERT_EVALUATOR | /expert/dashboard | Double-blind scoring (TRL, financial, Swadeshi), shortlist bids |
| INDEPENDENT_VALIDATOR | /validator/dashboard | Audit sandbox KPIs, issue Pass/Fail + scale-up certification |
| PROCUREMENT_OFFICER | /procurement/dashboard | Issue GeM work orders (GFR 149), manage PO lifecycle + escrow |
| ADMINISTRATOR | /admin/dashboard | User/role management, dept onboarding, startup verification, system settings |

---

## Demo Credentials (Universal Password: Password123!)

| Role | Email |
|---|---|
| Startup | startup@maharashtra.gov.in |
| Government Dept | gov@maharashtra.gov.in |
| Expert Evaluator | expert@maharashtra.gov.in |
| Independent Validator | validator@maharashtra.gov.in |
| Procurement Officer | procurement@maharashtra.gov.in |
| Administrator | admin@maharashtra.gov.in |

> Use 1-click role cards on the /login page to auto-fill credentials.

---

## Database: 28 PostgreSQL Tables

### Identity & Auth
Users, Roles, UserRoles, Permissions, RolePermissions, RefreshTokens, AuditLogs

### Organization
Departments, StartupProfiles, StartupDocuments, TechnologyCategories, StartupTechnologyCategories

### Challenge Ecosystem
Challenges, ChallengeDocuments, ChallengeTechnologyCategories, ChallengeApplications, SavedChallenges

### Sandbox Pilot System
SandboxTrials, SandboxTrialKPIs, KPIMeasurements, TrialMilestones, TrialDocuments, TrialStatusHistories

### Procurement
PurchaseOrders

### Knowledge & Chatbot
KnowledgeBase, UnansweredQuestions, ChatSessions, ChatMessages, SystemSettings

---

## Backend Controllers (10 total)

| Controller | Key Endpoints |
|---|---|
| AuthController | POST /api/auth/login, /register, /refresh, /logout |
| UsersController | GET /api/users/me, PATCH activate |
| AdminController | GET /api/admin/dashboard, users, departments, startups, settings |
| GovDashboardController | GET /api/gov/dashboard (live KPIs) |
| ChallengesController | GET/POST /api/challenges, status updates |
| GovSandboxTrialsController | Full trial lifecycle, KPI logging, milestones, validation |
| ProcurementController | GET/POST/PATCH /api/procurement/orders, dashboard, GFR-149 cert |
| StartupChallengesController | Startup bid submission and tracking |
| KnowledgeController | GET/POST /api/knowledge |
| ChatController | POST /api/chat/message (RAG chatbot) |

---

## Frontend Pages (20+ pages across 8 portals)

### Public (no auth)
/ - Home | /challenges - Challenge List | /showcase - Product Marketplace
/runway - Startup Sectors | /process - SOP | /raise-ticket - Grievance | /login | /register/startup

### Startup (/startup/*)
dashboard, products/add, challenges, challenges/:id

### Government (/gov/*)
dashboard, challenges/create (7-step wizard), sandbox-trials, sandbox-trials/:id, request-sandbox

### Procurement (/procurement/*)
dashboard (KPIs + validated pilots), issue-po (GeM work order form)

### Admin (/admin/*)
dashboard (5 tabs: Overview, Users, Departments, Startups, Settings), knowledge

### Expert, Validator
/expert/dashboard, /validator/dashboard

---

## Module Status

| Module | Status |
|---|---|
| Auth (JWT, BCrypt, refresh tokens) | LIVE |
| Government Dashboard (live PostgreSQL KPIs) | LIVE |
| Challenge Creation (7-step wizard → DB) | LIVE |
| Public Pages (Home, Showcase, Challenges, etc.) | LIVE |
| Admin Dashboard (5-tab, full user/dept/startup mgmt) | LIVE |
| Sandbox Trial System (full lifecycle + KPI tracking) | LIVE |
| Procurement Controller (orders, GFR 149, dashboard) | LIVE |
| Knowledge Base + RAG Chatbot | LIVE |
| Procurement Dashboard frontend integration | PARTIAL |
| Expert Evaluator scoring → DB | PARTIAL |
| File upload to cloud storage | PLANNED |
| Email notifications | PLANNED |
| GeM API integration | FUTURE |

---

## Running Locally

```bash
# Backend (http://localhost:5015)
cd backend
dotnet ef database update
dotnet run

# Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Backend .env required:
```
DATABASE_URL=Host=localhost;Port=5432;Database=govportal;Username=postgres;Password=...
JWT_SECRET=your-secret-min-32-chars
JWT_ISSUER=GovPortal
JWT_AUDIENCE=GovPortalUsers
```

---

## Legal & Policy Framework

| Policy | Role in IPP |
|---|---|
| GFR Rule 149 | Exempts DPIIT startups from turnover/experience criteria |
| GFR Rule 173(i) | Allows direct procurement without public tender |
| Maharashtra IT & Innovation Policy 2026 | 25% procurement mandate from startups |
| GeM Integration | PO format: GEM-GOM-YYYY-PO-NNNNNN |
| Milestone Escrow DBT | 40% dispatch + 40% acceptance + 20% commissioning |

---

## File Structure

```
project-root/
├── OVERVIEW.md              <- This file
├── CREDENTIALS.md           <- Demo login credentials
├── TECH_STACK.md            <- Full dependency docs
├── backend/
│   ├── Controllers/         (10 controllers)
│   ├── Data/ApplicationDbContext.cs  (28-table context)
│   ├── DTOs/                (AdminDTOs, ProcurementDTOs, etc.)
│   ├── Entities/            (26 entity files)
│   ├── Services/LocalRagChatService.cs
│   ├── Migrations/
│   └── Program.cs
└── frontend/src/
    ├── App.tsx              (all routes)
    ├── layouts/             (MainLayout, PublicLayout)
    ├── pages/               (admin, auth, expert, gov, procurement, public, startup, validator)
    ├── services/api/        (axios, admin, procurement, ...)
    └── index.css            (Tailwind v4 + design tokens)
```

---
*SIH Internal Hackathon 2026 | Last Updated: September 2026*
