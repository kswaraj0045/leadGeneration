# Changelog — VIASET

All notable changes to the Semiconductor & Electronics Supply-Chain Intelligence Platform (VIASET) are documented here.

## [1.0.0] - 2026-11-27 — Production Release

### Architecture & Foundation
- Established modular client/server structure with React 18, Vite, TypeScript, Tailwind CSS, Express.js, and Prisma ORM.
- Implemented root execution scripts for concurrent execution, building, seeding, and testing.

### Database & Seed Dataset
- Created normalized relational schema covering User, Organization, Company, Category, Industry, Capability, Product, Service, Certification, SavedCompany, SavedSearch, MonthlyUsage, DataImport, and AuditLog.
- Seeded 28 authentic semiconductor and electronics companies with verified process nodes, cleanrooms, certifications, and capabilities across 6 supply chain verticals.

### Authentication, Security & Multi-Tenancy
- Implemented JWT session authentication via HTTP-only cookies and Bearer tokens.
- Salting and hashing with `bcryptjs`.
- Role-based access control (`ADMIN`, `COMPANY_ADMIN`, `COMPANY_USER`) with organization data isolation.

### Core Intelligence & Advanced Search Engine
- Built multi-facet search endpoints supporting full-text query, category, country, verification status, and certifications.
- Implemented live typeahead search suggestions.
- Built comprehensive company detail endpoints with relations and organization save status.

### Explainable Weighted Matching Engine
- Designed and implemented deterministic 5-dimension heuristic scoring algorithm (Capabilities 35%, Products 25%, Sector 20%, Location 10%, Certifications 10%).
- Generates score percentages, dimensional breakdowns, match reasons, and gap identification.

### Sourcing Pipeline Workspace & Data Export
- Implemented organization supplier pipeline stages (`EVALUATING`, `CONTACTED`, `PARTNER`, `SUPPLIER`, `ARCHIVED`) with private notes and tags.
- Built CSV export via PapaParse and formatted XLSX workbook export via ExcelJS with plan limit enforcement.

### Administrative Control & CSV Dataset Ingestion
- Created admin dashboard with company verification status workflow (`UNVERIFIED` <-> `VERIFIED`) and review notes.
- Built CSV ingestion engine with PapaParse parsing, schema validation, duplicate detection, preview, and atomic commit.
- Added platform administrative audit trail.

### User Interface & Visuals
- Complete redesign of the public landing page to a high-end enterprise B2B SaaS standard (removing consumer e-commerce style search bar and replacing it with a live interactive Intelligence Terminal Console with live wafer node metrics, cleanroom specs, and facility tables).
- Added multi-view capability to Discovery: toggle between Technical Spec Cards and a high-density SaaS Data Matrix Table.
- Refined typography, status indicators, and enterprise navigation with SaaS tiers and algorithmic workbench highlights.

### Quality Assurance & Testing
- 16 unit and service integration tests passing with 100% success rate in Vitest.
- Both client Vite bundle and server TypeScript compile cleanly with zero errors.
