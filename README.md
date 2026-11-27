# Semiconductor & Electronics Supply-Chain Intelligence Platform (VIASET)

VIASET is a production-oriented, specialized B2B software-as-a-service (SaaS) platform built for the semiconductor and electronics ecosystem. It connects semiconductor foundries, fabless IC design houses, OSAT packaging and testing houses, PCB fabricators, EMS assembly providers, electronic component makers, and distributors to discover business partners, evaluate technical capabilities, and manage supply-chain relationships.

---

## 🌟 Central Value Proposition
> **Discover the right companies, identify relevant capabilities, and uncover business opportunities across the semiconductor and electronics ecosystem.**

---

## 🚀 Key Features & Architectural Modules

1. **Structured Company Intelligence**
   - Detailed specifications: manufacturing capabilities, packaging types, SMT lines, cleanroom grades, process nodes, certifications (IATF 16949, AS9100, ISO 9001, ISO 13485), products, and services.
   - Rigorous verification status: `UNVERIFIED`, `CLAIMED`, and `VERIFIED`.

2. **Transparent Weighted Matching Engine**
   - Configurable relevance scoring based on capability compatibility (35%), product alignment (25%), industry match (20%), location (10%), and certifications (10%).
   - Comprehensive match breakdown with explanation cards showing why a company was recommended and highlighting missing technical capabilities.

3. **Multi-Facet Discovery & Search**
   - Search across 15+ specialized semiconductor & electronics industry categories.
   - Filters for process nodes, certifications, geographical regions, business types, and services.

4. **Business Opportunities & Lead Workspace**
   - Save companies to pipeline stages (`Evaluating`, `Contacted`, `Partner`, `Supplier`, `Archived`).
   - Private organization notes, custom tags, and saved search queries with 1-click re-run.

5. **Enterprise Multi-Tenancy & Subscriptions**
   - Role-Based Access Control (`ADMIN`, `COMPANY_ADMIN`, `COMPANY_USER`).
   - Tiered plans (`BASIC`, `PRO`, `ENTERPRISE`) with tracked monthly quotas for searches, exports, and saved companies.

6. **Administrative Data Ingestion & Audit Logs**
   - CSV data import with strict validation, duplicate detection, dry-run preview, and atomic commit.
   - Audit trail tracking administrative verification actions and data updates.

7. **Data Export Engine**
   - Export filtered company discoveries or saved pipelines to structured CSV or styled Excel (`.xlsx`) workbooks.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, TanStack React Query, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, Zod, JWT, bcryptjs, ExcelJS, PapaParse.
- **Database**: SQLite (local development), migration-ready for PostgreSQL.
- **Testing**: Vitest (16 passing unit and service tests).

---

## 📁 Repository Structure

```
VIASET/
├── client/                     # Vite + React 18 + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (buttons, badges, cards, modals)
│   │   │   ├── common/         # Navbar, Footer, Badge
│   │   │   └── company/        # CompanyCard, CompanyDetailModal
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Landing, Login, Register, Discovery, Matching, Workspace, Searches, Analytics, Admin, Subscription
│   │   ├── services/           # Axios API client
│   │   └── types/              # TypeScript interfaces
├── server/                     # Express + TypeScript backend
│   ├── prisma/
│   │   ├── schema.prisma       # Relational database schema
│   │   └── seed.ts             # 28 authentic semiconductor & electronics companies
│   ├── src/
│   │   ├── __tests__/          # Vitest automated test suite (16 tests)
│   │   ├── config/             # Environment & subscription plan definitions
│   │   ├── controllers/        # Request handling & HTTP response shaping
│   │   ├── middleware/         # Auth, RBAC, quota tracking, error handler
│   │   ├── routes/             # REST API routing
│   │   ├── services/           # Business logic & matching engine
│   │   └── validators/         # Zod schemas
├── PROJECT_PROGRESS.md         # Active development roadmap and phase tracker
├── ARCHITECTURE.md             # System architecture and data flow documentation
├── DATABASE_DESIGN.md          # Entity-Relationship diagram and schema specifications
├── API_DOCUMENTATION.md        # Complete REST API endpoint reference
└── CHANGELOG.md                # Release versioning and change history
```

---

## ⚡ Quickstart

### Prerequisites
- Node.js (v18 or higher recommended, v22 tested)
- pnpm or npm

### Installation & Execution

1. **Install dependencies**:
   ```bash
   pnpm install
   pnpm install --dir server
   pnpm install --dir client
   ```

2. **Initialize Database & Seed Demonstration Data**:
   ```bash
   cd server
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Run Automated Tests**:
   ```bash
   cd server
   npx vitest run
   ```

4. **Start Development Servers Concurrently**:
   ```bash
   npm run dev
   ```
   Or separately:
   ```bash
   # Terminal 1 (Backend API on http://localhost:5000):
   cd server && npm run dev

   # Terminal 2 (Frontend Client on http://localhost:5173):
   cd client && npm run dev
   ```

---

## 👤 Demonstration Accounts

| Role | Email | Password | Organization | Capabilities |
|---|---|---|---|---|
| **Platform Admin** | `admin@viaset.io` | `Admin123!` | VIASET Operations | Company verification review, user & org management, CSV dataset ingestion, audit logs |
| **Company Admin** | `lead@kaynes-semi.com` | `Company123!` | Kaynes Semicon (PRO) | Sourcing workspace, CSV/Excel export, custom heuristic weight adjustments |
| **Engineering User** | `engineer@mindgrove.in` | `User123!` | Mindgrove Technologies (BASIC) | Advanced multi-filter search, saved company list, explainable matching |

*(Note: The login page includes 1-click demo buttons to automatically populate these credentials).*
