# System Architecture — VIASET

## 1. High-Level Architecture Overview

VIASET is designed as a modular, decoupled B2B multi-tenant web application. It follows a multi-tier architectural pattern consisting of a presentation layer (Vite + React 18 SPA), an application service tier (Express.js REST APIs in TypeScript), and an abstraction-driven data persistence tier (Prisma ORM with SQLite for local development and direct compatibility for PostgreSQL).

```mermaid
flowchart TD
    subgraph Client["Client Tier (React 18 + Vite + TS)"]
        UI[Public Landing & App Views]
        State[TanStack Query & AuthContext]
        Axios[API Client with Interceptors]
        UI --> State --> Axios
    end

    subgraph Gateway["Security & Application Gateway"]
        CORS[CORS & Cookie Parser]
        AuthMid[JWT Auth & RBAC Middleware]
        RateMid[Quota & Usage Enforcer]
        ValMid[Zod Schema Validator]
    end

    subgraph Services["Application Services (Node.js / Express / TypeScript)"]
        AuthSvc[Auth & Org Service]
        CompanySvc[Company Intelligence Service]
        SearchSvc[Discovery & Filter Engine]
        MatchSvc[Weighted Matching Engine]
        SavedSvc[Opportunities & Saved Service]
        ExportSvc[Data Export Engine (CSV/Excel)]
        AdminSvc[Admin & CSV Ingestion Engine]
        AnalyticsSvc[Aggregations & Analytics Service]
    end

    subgraph Data["Persistence Tier"]
        Prisma[Prisma ORM Client]
        DB[(SQLite / PostgreSQL Relational DB)]
        Prisma --> DB
    end

    Axios -->|HTTPS/JSON / Cookies| CORS
    CORS --> AuthMid --> RateMid --> ValMid
    ValMid --> Services
    Services --> Prisma
```

---

## 2. Component Design & Layer Responsibilities

### 2.1 Frontend Architecture (Presentation Tier)
- **Component Hierarchy**: Atomic and composite UI components structured by domain (`components/common`, `components/discovery`, `components/matching`, `components/company`, `components/admin`).
- **Data Fetching & Cache Management**: TanStack React Query handles asynchronous state, stale-while-revalidate caching, pagination state, and mutation rollbacks.
- **Client Route Protection**: `ProtectedRoute` wrapper guarding `/app/*` and `AdminRoute` wrapper guarding `/admin/*`, redirecting unauthorized users based on JWT token and claims.

### 2.2 Backend Architecture (Service & Controller Pattern)
- **Controllers**: Handle HTTP serialization, extracting validated query/body parameters, and returning uniform JSON payloads:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
  }
  ```
- **Services**: Pure business logic isolation. Contains matching engine algorithms, CSV parsing, export formatting, and Prisma transaction pipelines.
- **Middleware**:
  - `authenticateToken`: Verifies JWT from HTTP-only cookie or Bearer token; extracts `userId`, `orgId`, and `role`.
  - `requireRole([...roles])`: Restricts endpoints to `ADMIN`, `COMPANY_ADMIN`, or `COMPANY_USER`.
  - `trackUsage(actionType)`: Checks organization monthly plan quota and increments usage record in a database transaction.
  - `validateRequest(zodSchema)`: Validates body, query, and params before passing to controllers.

---

## 3. Explainable Matching Engine Architecture

The matching engine provides a transparent, rule-based compatibility calculation between a user's requirement profile and company profiles:

$$ \text{Total Match Score} = \sum (\text{Dimension Score} \times \text{Dimension Weight}) $$

Default weights:
1. **Capabilities & Manufacturing Services**: 35% weight
2. **Products & Components**: 25% weight
3. **Industry Segment Alignment**: 20% weight
4. **Geographical / Location Fit**: 10% weight
5. **Certifications & Compliance**: 10% weight

Each result produces:
- Overall Compatibility Percentage (0–100%)
- Categorical breakdown scores
- Explanatory reasons (e.g., "Provides specified 4-layer PCB fabrication capability", "Headquartered in requested region: India")
- Gap analysis (e.g., "Missing cleanroom class ISO 5 certification")

---

## 4. Multi-Tenancy & Data Isolation Model

Organizations form the primary boundary of data ownership.
- Company Intelligence records are globally discoverable across the platform.
- Organization-specific assets (Saved Companies, Notes, Pipeline Stages, Custom Tags, Saved Searches, Monthly Usage Quotas) are strictly partitioned by `organizationId`.
- Every mutation on an organization asset verifies ownership against the authenticated user's `organizationId`.

---

## 5. Security Architecture

1. **Authentication**: JWT signed with secret and configured expiration, stored in HTTP-only `SameSite=Lax` cookies with header fallback.
2. **Password Security**: Passwords salted and hashed with `bcryptjs` (work factor 10).
3. **Input Sanitization & Validation**: Zod runtime schema validation on every input payload preventing SQL/code injection.
4. **CORS & Headers**: Strict CORS origin configuration allowing only verified client domains.
