# Portfolio Frontend Monorepo

Enterprise-grade, accessible portfolio website with AI RAG Assistant — built as a **pnpm Workspaces + Turborepo** monorepo, ready for Micro-Frontend expansion.

---

## Architecture

```text
portfolio-frontend/
├── packages/
│   ├── tokens/          # Design tokens — CSS variables, Tailwind preset
│   ├── ui/              # Accessible component library (Radix UI + shadcn pattern)
│   └── api-client/      # Type-safe FastAPI SDK
└── apps/
    ├── web/             # Next.js 15 — Single-page parallax portfolio (SSG/ISR)
    ├── admin/           # [Future] Content Admin MFE (SSR + Auth)
    └── blog/            # Next.js blog MFE scaffold (MDX content engine next)
```

Detailed architecture, implementation status, and session handoff notes are
maintained locally outside the public repository.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, ISR) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + CSS Design Tokens |
| Components | Radix UI Primitives + shadcn/ui pattern |
| Animation | Framer Motion + Lenis smooth scroll |
| AI Chat | FastAPI RAG backend (`POST /chat`) |
| Unit Tests | Vitest + React Testing Library + jest-axe |
| E2E Tests | Playwright + @axe-core/playwright |
| CI/CD | Jenkins (Declarative Pipeline) + Docker |
| Monorepo | pnpm Workspaces + Turborepo |
| Accessibility | WCAG 2.1 AA — Radix, focus rings, skip nav, aria-live |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- Backend running: `cd portfolio-ai-backend && uvicorn app:app --port 8000`

### Install

```bash
pnpm install
```

### Development

```bash
# Start the portfolio app at http://localhost:3000
pnpm dev

# Or target a specific app
pnpm --filter @portfolio/web dev
```

### Environment Variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all workspaces via Turborepo |
| `pnpm lint` | ESLint across all packages |
| `pnpm typecheck` | TypeScript `tsc --noEmit` across all packages |
| `pnpm test:unit` | Run Vitest unit + accessibility tests |
| `pnpm test:e2e` | Run Playwright E2E automation tests |

---

## Design Tokens

To change the entire site's color scheme or typography, edit only:

- **Colors** → [`packages/tokens/src/colors.css`](./packages/tokens/src/colors.css)
- **Typography** → [`packages/tokens/src/typography.css`](./packages/tokens/src/typography.css)
- **Spacing** → [`packages/tokens/src/spacing.css`](./packages/tokens/src/spacing.css)

All apps in the monorepo consume these tokens — one edit, instant propagation.

---

## Accessibility

- **WCAG 2.1 AA** compliant throughout
- Skip-to-main navigation link
- Full keyboard navigation (Tab, Enter, Esc, Arrow keys)
- `aria-live` regions for dynamic content (chat messages, loading states)
- Focus trap inside Dialog/Modal (Radix UI)
- `prefers-reduced-motion` respected by all animations
- Automated audit: `jest-axe` in unit tests, `@axe-core/playwright` in E2E

---

## Micro-Frontend Expansion

This monorepo is structured for Next.js **Multi-Zones** MFE expansion:

1. **Blog** (`apps/blog`) — serve at `/blog/*` via `next.config.ts` rewrites
2. **Admin** (`apps/admin`) — serve at `/admin/*` (SSR + JWT-gated, uses `X-Admin-Token`)

Each zone shares `packages/tokens` and `packages/ui` — guaranteeing visual consistency while being independently deployable.

---

## CI/CD (Jenkins)

See [`Jenkinsfile`](./Jenkinsfile) for the full declarative pipeline:

1. Checkout & Install (pnpm cache-aware)
2. Lint + TypeScript check (parallel)
3. Unit & Accessibility tests
4. Turborepo Build
5. Playwright E2E in Docker
6. Deploy to staging (on `main` branch)

---

## Docker

```bash
# Build and start the full stack (frontend + FastAPI backend)
docker compose up -d --build

# Run E2E tests in Docker
docker compose --profile test up e2e
```
