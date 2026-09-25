# Maharashtra StartupSetu (IPP) - Project Overview & System Architecture

## 1. Executive Summary
**StartupSetu (Innovation Procurement Portal - IPP)** is a production-grade, full-stack digital platform engineered for the **Government of Maharashtra** to automate and streamline **Direct Startup-to-Government Procurement** under **GFR Rule 149, GFR Rule 173(i), and the Maharashtra Innovation Framework 2026**.

The platform dismantles traditional legacy public procurement barriers—such as mandatory 3-year turnover, previous execution track records, and Earnest Money Deposits (EMD)—enabling DPIIT-recognized deep-tech startups to deploy field-tested AI, IoT, robotics, drone, and clean-tech solutions across municipal corporations and state departments.

---

## 2. Core Problem & Solution Architecture

### The Problem
Traditional government tendering processes disadvantage early-stage and high-impact deep-tech startups:
- **Financial Barriers:** Requirement of 3+ years of audited balance sheets and multi-crore turnover.
- **Track Record Constraints:** Minimum 3 past government purchase orders of similar magnitude.
- **Capital Lock-in:** 2%–5% Earnest Money Deposit (EMD) and 10% Performance Bank Guarantees (PBG).
- **Time-to-Procure:** Average 6–12 months RFP lifecycles leading to outdated technology adoption.

### The 5-Stage Innovation Procurement Lifecycle
```
[1] GOVERNMENT DEPARTMENT publishes Reverse Problem Statement
        ↓
[2] DPIIT STARTUP submits Solution Proposal (100% EMD & Prior-Turnover Exempt)
        ↓
[3] EXPERT EVALUATION COMMITTEE conducts Double-Blind Scoring (TRL, Financial, Swadeshi Score)
        ↓
[4] 90-DAY PAID FIELD SANDBOX PILOT (Up to ₹25 Lakhs milestone-linked grant)
        ↓
[5] INDEPENDENT VALIDATOR audits KPIs → Issues Pass/Fail & Scale-Up Certificate
        ↓
[6] STATE PROCUREMENT OFFICER generates GeM-Compliant Direct Work Order (GFR 149)
        ↓
[7] ESCROW DBT DISBURSEMENT (40% Dispatch → 40% Delivery & Acceptance → 20% Operational Commissioning)
```

---

## 3. Autonomous 4-Agent AI Engine

StartupSetu incorporates a multi-agent AI engine powered by **Google Gemini 1.5 Flash** (with fallback to Groq LLaMA 3.3 and heuristic logic) to automate mission-critical procurement tasks:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-AGENT AI PROCUREMENT ENGINE                   │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. RFP Agent       │ 2. Bid Agent       │ 3. Fraud / DPIIT Verification│
│ (POST /ai/parse-rfp│ (POST /ai/score-bid│ (POST /ai/verify-startup)    │
│ Translates raw gov │ Blind technical    │ Cross-verifies DPIIT Udyam & │
│ complaints into    │ evaluation, TRL    │ GSTIN, detects circularities │
│ GFR-compliant RFPs │ assessment & scoring│ and fraudulent claims       │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ 4. Executive Briefing Agent (POST /api/ai/generate-brief)               │
│ Synthesizes sandbox telemetry, KPI milestones & financial viability    │
│ into a 1-page statutory procurement briefing for decision-makers.     │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Agent 1: RFP Generation Agent (`POST /api/ai/parse-rfp`)**
   - Ingests raw unstructured problem statements from municipal/state officials.
   - Outputs GFR Rule 149-compliant RFP structured JSON (Title, Sector, Technical Specs, KPI Benchmarks, Budget Cap, EMD Exemption Clauses).
2. **Agent 2: Bid Evaluation Agent (`POST /api/ai/score-bid`)**
   - Automatically assesses startup proposals against department problem criteria.
   - Computes TRL feasibility, architectural soundness, Swadeshi/Make-in-India percentage, and delivers weighted scores (0–100) with justification.
3. **Agent 3: Fraud & DPIIT Verification Agent (`POST /api/ai/verify-startup`)**
   - Interrogates startup incorporation metadata, GSTIN formats, and DPIIT recognition numbers.
   - Assesses shell company risk and issues automated verification status badges.
4. **Agent 4: Executive Briefing Agent (`POST /api/ai/generate-brief`)**
   - Aggregates 90-day sandbox pilot sensor telemetry and milestone logs.
   - Compiles a clean Markdown briefing highlighting cost savings, deployment reliability, and procurement recommendations.

---

## 4. Multi-Role RBAC & Portals (6 Distinct User Roles)

| Role Code | Portal Route | Primary Capabilities |
|---|---|---|
| `STARTUP` | `/startup/dashboard` | List deep-tech products on Startup Runway, browse challenges, submit proposals, monitor sandbox milestone telemetry, and track DBT grant disbursements. |
| `GOVERNMENT_DEPARTMENT` | `/gov/dashboard` | 7-step challenge creation wizard, sandbox trial oversight, milestone approval, and pilot budget tracking. |
| `EXPERT_EVALUATOR` | `/expert/dashboard` | Double-blind technical scoring (TRL, financial viability, Make-in-India score) and bid shortlisting. |
| `INDEPENDENT_VALIDATOR` | `/validator/dashboard` | Real-time sensor & telemetry inspection, third-party benchmark audits, and Pass/Fail scale-up certification. |
| `PROCUREMENT_OFFICER` | `/procurement/dashboard` | Direct GeM Work Order generation (`/procurement/issue-po`), dynamic innovation catalog selector, GFR 149 statutory certificate downloads, and escrow DBT milestone release. |
| `ADMINISTRATOR` | `/admin/dashboard` | Master 5-tab Command Center: real-time user activation toggles, department onboarding, startup DPIIT approvals, knowledge base management, and statutory policy configurations. |

---

## 5. Bilingual Localization (English & Marathi)

The entire application provides complete, seamless **Bilingual Support (English & Marathi - मराठी)**:
- Switching to **MR** dynamically updates navigation headers, dashboards, KPI stat cards, innovation showcase filters, GeM work order interfaces, and system notifications.
- Managed via `react-i18next` with localized dictionaries (`src/locales/en.json` and `src/locales/mr.json`) and instant fallback synchronization.

---

## 6. Technology Stack

### Frontend
- **Framework:** React 19 (TypeScript, Vite 8)
- **Styling:** Tailwind CSS v4, custom glassmorphism design tokens
- **State Management & Data Fetching:** TanStack React Query v5, Axios
- **Form Validation:** React Hook Form, Zod
- **Icons & Visualization:** Lucide React, Recharts
- **Internationalization:** i18next, react-i18next

### Backend Web API
- **Framework:** ASP.NET Core (.NET 9.0 / C# 13) Web API
- **Data Access:** Entity Framework Core 9, Npgsql (PostgreSQL Provider)
- **Database:** PostgreSQL 15+ (28 Relational Tables)
- **Authentication & Security:** JWT Bearer tokens, BCrypt password hashing, RBAC middleware
- **AI Integration:** Google Gemini 1.5 Flash API, Groq LLaMA 3.3, Local RAG Vector Knowledge Base

---

## 7. PostgreSQL Database Architecture (28 Tables)

```
├── Identity & Authentication
│   ├── Users, Roles, UserRoles, Permissions, RolePermissions, RefreshTokens, AuditLogs
├── Departments & Startup Profiles
│   ├── Departments, StartupProfiles, StartupDocuments, TechnologyCategories, StartupTechnologyCategories
├── Challenge & Bid Management
│   ├── Challenges, ChallengeDocuments, ChallengeTechnologyCategories, ChallengeApplications, SavedChallenges
├── Sandbox Trial & Telemetry System
│   ├── SandboxTrials, SandboxTrialKPIs, KPIMeasurements, TrialMilestones, TrialDocuments, TrialStatusHistories
├── Procurement & GeM Orders
│   ├── PurchaseOrders (GeM Work Order ID, GFR 149 statutory affirmations, escrow milestones, status transitions)
└── Knowledge Base & Assistant
    ├── KnowledgeBase, UnansweredQuestions, ChatSessions, ChatMessages, SystemSettings
```

---

## 8. Key API Endpoints

### AI Agents (`/api/ai`)
- `POST /api/ai/parse-rfp` - Convert raw text to structured RFP
- `POST /api/ai/score-bid` - Automatic bid scoring & TRL evaluation
- `POST /api/ai/verify-startup` - Fraud detection & DPIIT validation
- `POST /api/ai/generate-brief` - Executive procurement summary from sandbox trials

### Procurement (`/api/procurement`)
- `GET /api/procurement/dashboard` - Real-time procurement stats & pilot queues
- `GET /api/procurement/orders` - Filter purchase orders by status, department, or search query
- `POST /api/procurement/orders` - Issue new direct purchase order (GFR Rule 149)
- `PATCH /api/procurement/orders/{id}/status` - Advance order lifecycle and release escrow DBT
- `GET /api/procurement/orders/{id}/gfr149-cert` - Generate statutory exemption certificate

### Administration (`/api/admin`)
- `GET /api/admin/dashboard` - Unified platform metrics
- `GET /api/admin/users` & `PATCH /api/admin/users/{id}/toggle-status` - Manage user access
- `GET /api/admin/departments` & `POST /api/admin/departments` - Onboard government entities
- `GET /api/admin/startups` & `PATCH /api/admin/startups/{id}/verify` - Review & approve DPIIT status
- `GET /api/admin/settings` & `PUT /api/admin/settings` - Update policy caps & GFR thresholds

---

## 9. Demo Credentials

> **Universal Password:** `Password123!` (or click any 1-Click Role Card on the `/login` page)

| Role | Demo Email Account |
|---|---|
| **Startup Innovator** | `startup@maharashtra.gov.in` |
| **Government Department** | `gov@maharashtra.gov.in` |
| **State Procurement Officer** | `procurement@maharashtra.gov.in` |
| **Independent Validator** | `validator@maharashtra.gov.in` |
| **Expert Evaluator** | `expert@maharashtra.gov.in` |
| **System Administrator** | `admin@maharashtra.gov.in` |

---

## 10. Local Development Setup

```bash
# 1. Start Backend Web API (Port 5015)
cd backend
dotnet ef database update
dotnet run

# 2. Start Frontend Dev Server (Port 5173)
cd frontend
npm install
npm run dev
```

### Environment Variables (`backend/.env`)
```env
DATABASE_URL=Host=localhost;Port=5432;Database=govportal;Username=postgres;Password=yourpassword
JWT_SECRET=YourSuperSecretKeyWithMinimum32CharactersLength!
JWT_ISSUER=GovPortal
JWT_AUDIENCE=GovPortalUsers
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 11. Statutory & Policy Alignment

| Framework | Implementation in Platform |
|---|---|
| **GFR Rule 149** | Exemption from prior-turnover and prior-experience requirements for DPIIT startups. |
| **GFR Rule 173(i)** | Direct single-source procurement for proprietary innovations tested in sandboxes. |
| **Maharashtra Innovation Policy 2026** | 25% quota allocation and fast-tracked milestone escrow payments. |
| **GeM Integration Specification** | Automated Work Order format: `GEM-GOM-YYYY-PO-XXXXXX`. |
| **Escrow DBT Schedule** | 40% Dispatch → 40% Acceptance → 20% Final Commissioning. |

---
*Developed for the Smart India Hackathon & Maharashtra State Innovation Society (MSInS)*
