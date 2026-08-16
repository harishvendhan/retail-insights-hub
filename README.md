# Retail Insights Hub

MASTER PROMPT — Supermarket AI Intelligence Platform (FRONTEND ONLY, for Lovable)

0. Role & Scope Lock

You are building ONLY the frontend of a production-grade Supermarket Sales, Inventory & AI Intelligence Platform. A separate backend team (Antigravity + Node/Express + Supabase/PostgreSQL) owns all business logic, calculations, and data storage.

Hard rule: You must NEVER perform business calculations, stock-status logic, analytics aggregation, or AI reasoning in the frontend. The frontend's only job is to:

Collect input (auth, file uploads, filters, chat/voice input)

Call backend REST APIs

Render whatever the backend returns

Handle loading / empty / error / success states cleanly

If backend endpoints are not ready yet, use a typed mock API layer (see Section 9) that mimics the real contract exactly, so swapping in the real backend later requires zero component changes.

1. Tech Stack (fixed)

React + TypeScript + Vite

Tailwind CSS + shadcn/ui

Recharts for all charts

React Router for routing

React Query (TanStack Query) for all server-state/data fetching, caching, and loading/error states

Zustand (or React Context, keep it minimal) only for lightweight client state (e.g., active chat session, voice UI state, sidebar collapse) — NOT for business data

i18next (or equivalent) for Tamil/English internationalization

2. Design Direction

Build this to feel like: a professional, trustworthy business tool a supermarket owner would pay for — not a generic admin template and not a toy chatbot demo.

Clean, data-dense but not cluttered dashboards (cards, tables, charts)

Calm, confident color palette (avoid default purple/indigo SaaS look — pick a distinctive accent, e.g., a deep teal or amber tied to "retail/grocery")

Clear status colors used consistently everywhere: Healthy (green), Low Stock (amber), Out of Stock (red), Expiring (orange)

Every page: loading skeleton state, empty state (with helpful CTA), error state (with retry), and success/toast feedback

Tamil text must render properly (pick a font stack that supports Tamil glyphs cleanly, e.g., Noto Sans Tamil alongside Inter/Geist for Latin)

Mobile-usable for the dashboard and AI chat/voice screens at minimum (manager may check on phone)

3. Information Architecture / Routes

/login
/signup (if required)
/dashboard
/inventory
/inventory/:productId
/sales
/suppliers
/suppliers/:supplierId
/import                (Excel/CSV upload flow)
/import/history
/reports
/ai-chat
/voice
/settings/profile


Use protected routes — unauthenticated users are redirected to /login. Session state comes from the auth API/token, never hardcoded.

4. Page-by-Page Requirements

4.1 Auth

Login form (email/password), signup if in scope, logout action, session persistence

Form validation with clear inline errors

Redirect to /dashboard on success

4.2 Dashboard (/dashboard)

Cards: today's sales, weekly sales, monthly sales, total revenue, total products, total units sold, current inventory value, low-stock count, out-of-stock count, expiring products count, best-selling product, slow-moving product.

Also render an "Actionable Insights" panel — a list of natural-language insight strings the backend returns (e.g. "12 products are below reorder level"), each clickable to drill into the underlying filtered list (deep-link into /inventory?filter=low-stock etc.). The frontend does NOT generate these insight strings — it only renders what the API returns.

4.3 Inventory (/inventory)

Product table: search, filters (category, brand, supplier, stock-status, expiry), sort, pagination (server-side — never paginate/filter a full dataset client-side)

Status badges (Healthy/Low/Out of Stock/Expiring) driven entirely by the stock_status field from the API — do not recompute it in the frontend

Product detail page: product info, current stock, reorder level, unit cost, selling price, stock value, sales history chart, purchase history, inventory movement log, expiry info, and an "AI Insights" panel for that product

4.4 Sales (/sales)

Overview cards + trend chart (daily/weekly/monthly toggle)

Product-wise / category-wise / brand-wise breakdown tables

Top sellers / slow movers lists

Date-range picker driving all of the above via API params

4.5 Suppliers (/suppliers)

List + detail view: products supplied, purchase history, total purchase value

4.6 Excel/CSV Import (/import)

Multi-step wizard UI:

File select (drag/drop) + size/type validation client-side (just format/size, not business rules)

Upload progress

Column detection + mapping UI (if backend flags ambiguous columns)

Validation results screen: show total rows, valid rows, invalid rows, and a table of invalid rows with the backend-supplied reason per row

Data preview before confirming

Confirm → import → result summary

/import/history — list of past imports with status/counts

4.7 AI Chat (/ai-chat)

Tamil-first chat UI, but fully bilingual (auto-detect or a language toggle)

Suggested/example questions (pull the example Tamil/English questions from Section 40 of the spec as starter chips)

Message bubbles distinguish: user question, AI answer, and a "data reference" sub-block showing what underlying data/tool result the answer was grounded in (e.g. a mini table or the exact numbers used) — this must be visually distinct from the AI's natural-language explanation, per the "AI interpretation must be clearly distinguishable from raw data" rule

Explicit "insufficient data" / "I need clarification" message states (e.g. when backend returns an ambiguous-product clarification request — show it as a quick-reply chip set, not free text)

Conversation history persisted per session via API

4.8 Voice (/voice)

Big mic button with clear states: idle → listening → processing → speaking → error

Live transcript display

Same "data reference" + "insufficient data" patterns as chat (voice is just another surface over the same AI backend — reuse chat components/logic, don't duplicate)

Cancel/interrupt control

Language indicator (Tamil/English detected)

4.9 Reports (/reports)

List of report types (sales, inventory, low-stock, reorder, expiry, product/category/supplier performance)

Generate + preview + export (PDF/Excel/CSV) — export files are generated by the backend; frontend just triggers and downloads

5. Component Architecture Rules

Small, focused, reusable components. No 500-line page components — split into <PageName>/index.tsx + subcomponents.

Shared primitives: <StatCard>, <StatusBadge>, <DataTable> (server-side paginated, sortable, filterable — build once, reuse everywhere), <TrendChart>, <EmptyState>, <ErrorState>, <LoadingSkeleton>, <InsightCard>, <ChatBubble>, <DataReferenceBlock>.

All data fetching goes through typed React Query hooks (useDashboardSummary(), useProducts(filters), useSalesTrend(range), etc.) — components never call fetch directly.

Every list/table view must support: loading, empty, error, and populated states without exception.

6. API Contract Consumption (frontend must NOT guess this)

Consume a single documented contract (OpenAPI/shared types file) covering at minimum:

POST /api/auth/login
POST /api/auth/logout
GET  /api/analytics/dashboard
GET  /api/products
GET  /api/products/:id
GET  /api/sales?range=&groupBy=
GET  /api/inventory/low-stock
GET  /api/inventory/out-of-stock
GET  /api/inventory/expiring
GET  /api/suppliers
GET  /api/suppliers/:id
POST /api/import/upload
POST /api/import/confirm
GET  /api/import/history
POST /api/ai/query        { question, language, conversationId }
POST /api/voice/query     { audio, conversationId }
GET  /api/reports/:type


Generate a single src/types/api.ts with TypeScript interfaces matching this contract exactly (mirroring backend response shapes like the totalSales / productsSold / lowStockCount / outOfStockCount dashboard example). If a field's shape is ambiguous, flag it rather than inventing a structure.

7. Internationalization (Tamil-first)

All static UI copy goes through i18next keys — no hardcoded English strings in components

Ship en.json and ta.json from day one; Tamil is the default locale, English is the fallback/toggle

AI-generated chat/voice text is NOT a static translation key — it's rendered as-is from the API response in whatever language the backend returned

Design the i18n structure so adding a third language later means adding one JSON file, not touching components

8. States, Errors & Trust

Because this is a data-accuracy-critical product, the UI must visually reinforce trustworthiness:

Never show a number without a source/date-range context next to it

Clearly label AI-derived recommendations as recommendations (e.g. a small "estimate" tag on profit/reorder suggestions), matching the backend's non-guaranteed-prediction language

Global error boundary + per-request error states with retry

Toasts for success/failure of mutations (import confirm, login, etc.)

9. Mock API Layer (only until backend is live)

Build a src/mocks/ layer using MSW (Mock Service Worker) or a simple fetch-intercepting mock client that returns realistic fake data matching src/types/api.ts exactly, including Tamil-language AI responses. Gate it behind an env variable (VITE_USE_MOCKS=true). This lets frontend development proceed fully in parallel with the Antigravity backend, and removing it later should require deleting the mock layer only — zero component changes.

10. Explicit Non-Goals for This Prompt

Do NOT implement in the frontend:

Stock-status calculation logic

Sales/profit calculation logic

AI intent detection, tool selection, or LLM calls

Direct database or Supabase queries from the browser

Any secrets/API keys in client code

11. Definition of Done (per phase)

For every page/feature built:

[ ] Typed API hook created (or mock equivalent)

[ ] Loading / empty / error / success states implemented

[ ] Responsive down to mobile width for chat, voice, and dashboard

[ ] Tamil + English copy verified

[ ] No hardcoded business data

[ ] Passes lint + type-check + build

12. Build Order (frontend-only phases)

App shell: routing, auth screens, protected-route wrapper, layout/nav, theme

Shared primitives (StatCard, DataTable, StatusBadge, states)

Dashboard

Inventory list + detail

Sales

Suppliers

Import wizard

Reports

AI Chat UI

Voice UI

Mock layer wiring + polish pass (empty/error states, responsiveness, i18n audit)

Build in this order, and after each phase run lint/type-check/build before moving on.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/81a897b3-2423-4253-8b6b-dec2c51bc8a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
