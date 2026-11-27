# REST API Documentation — VIASET

All API endpoints are prefixed with `/api/v1`.

Responses follow a standard JSON envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

## 1. Authentication & Organization Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user and organization |
| `POST` | `/auth/login` | Public | Authenticate user, set HTTP-only cookie & return JWT |
| `POST` | `/auth/logout` | Authenticated | Invalidate session / clear auth cookie |
| `GET` | `/auth/me` | Authenticated | Get current authenticated user profile & organization |
| `PUT` | `/auth/profile` | Authenticated | Update user profile information |

---

## 2. Company Intelligence & Discovery (`/api/v1/companies`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/companies` | Public / Auth | Search & list companies with multi-facet filters |
| `GET` | `/companies/:slugOrId` | Public / Auth | Get comprehensive company intelligence profile |
| `GET` | `/companies/suggestions` | Public / Auth | Auto-complete / search suggestions query |
| `GET` | `/companies/categories` | Public / Auth | List all supply-chain categories and industry groups |
| `POST` | `/companies` | Admin | Create a new company record |
| `PUT` | `/companies/:id` | Admin | Update existing company profile |
| `DELETE` | `/companies/:id` | Admin | Delete company record |
| `PATCH` | `/companies/:id/verify` | Admin | Update verification status (`UNVERIFIED`, `CLAIMED`, `VERIFIED`) |

### Query Parameters for `/companies`:
- `q`: Search keyword (matches name, description, products, capabilities)
- `category`: Category slug (e.g., `pcb-assembly`, `ic-design`, `osat`)
- `companyType`: Filter by type (e.g., `Manufacturer`, `Service Provider`, `Distributor`)
- `country`: Filter by country (e.g., `India`, `Taiwan`, `United States`)
- `certification`: Filter by standard (e.g., `IATF 16949`, `ISO 9001`)
- `verificationStatus`: `VERIFIED`, `CLAIMED`, or `UNVERIFIED`
- `page`: Page index (default: 1)
- `limit`: Items per page (default: 12)
- `sortBy`: `name`, `yearEstablished`, `createdAt`
- `sortOrder`: `asc` or `desc`

---

## 3. Explainable Matching Engine (`/api/v1/matching`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/matching/query` | Authenticated | Compute weighted matching scores based on requirements |

### Request Payload:
```json
{
  "targetServices": ["PCB Assembly", "Surface Mount Technology"],
  "targetProducts": ["Automotive ECU", "Power Module"],
  "targetCapabilities": ["01005 SMT Placement", "Cleanroom Class 7"],
  "preferredCountries": ["India", "Vietnam"],
  "preferredIndustries": ["Automotive Electronics", "Aerospace"],
  "requiredCertifications": ["IATF 16949"],
  "customWeights": {
    "capabilities": 0.35,
    "products": 0.25,
    "industry": 0.20,
    "location": 0.10,
    "certifications": 0.10
  }
}
```

---

## 4. Saved Companies & Lead Workspace (`/api/v1/saved`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/saved` | Authenticated | List organization's saved companies with stage and notes |
| `POST` | `/saved` | Authenticated | Save company with initial status, notes, and tags |
| `PATCH` | `/saved/:id` | Authenticated | Update pipeline stage, custom notes, or tags |
| `DELETE` | `/saved/:id` | Authenticated | Remove company from saved pipeline |

---

## 5. Saved Searches (`/api/v1/searches`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/searches/saved` | Authenticated | List saved search queries |
| `POST` | `/searches/saved` | Authenticated | Save current search query with custom name |
| `DELETE` | `/searches/saved/:id` | Authenticated | Delete saved search |
| `GET` | `/searches/history` | Authenticated | Get recent search activity for organization |

---

## 6. Data Export (`/api/v1/export`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/export/companies` | Authenticated (Pro/Enterprise) | Export search results to CSV or Excel |
| `POST` | `/export/saved` | Authenticated (Pro/Enterprise) | Export saved pipeline to CSV or Excel |

---

## 7. Analytics & Insights (`/api/v1/analytics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/analytics/overview` | Authenticated | Ecosystem KPI counters, category breakdown, geo distribution |
| `GET` | `/analytics/usage` | Authenticated | Current organization's plan limits and monthly usage stats |

---

## 8. Admin Control Center & Ingestion (`/api/v1/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | Admin | Comprehensive platform statistics |
| `GET` | `/admin/users` | Admin | List all registered users across organizations |
| `GET` | `/admin/organizations` | Admin | List all registered organizations and active plans |
| `POST` | `/admin/import/preview` | Admin | Upload CSV to preview validated records & detect duplicates |
| `POST` | `/admin/import/commit` | Admin | Commit verified CSV dataset into production database |
| `GET` | `/admin/audit-logs` | Admin | View platform administrative audit logs |
