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
| CI/CD | GitHub Actions quality gate + Vercel Git deployments |
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
# Start portfolio and blog at http://localhost:3000 and http://localhost:3001
pnpm dev

# Or target a specific app
pnpm --filter @portfolio/web dev
```

### Environment Variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BLOG_URL=http://localhost:3001
```

Create `apps/blog/.env.local` only when overriding these local defaults:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
BLOG_API_URL=http://localhost:8000
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
| `pnpm smoke:production` | Verify deployed portfolio/blog routes and assets |

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

1. **Blog** (`apps/blog`) — independently deployed at `blog.dileept.com`
2. **Admin** (`apps/admin`) — future authenticated owner/author application

Each zone shares `packages/tokens` and `packages/ui` — guaranteeing visual consistency while being independently deployable.

---

## CI/CD

GitHub Actions is the active CI system. The quality gate in
`.github/workflows/ci.yml` runs lint, typecheck, unit/accessibility tests,
dependency audit, production builds, and the cross-zone Playwright suite.

Vercel remains the deployment system:

1. Pull requests run CI and receive Vercel preview deployments.
2. Protect `main` with the `Lint, test, build, and E2E` required status check.
3. Merging to `main` triggers independent portfolio/blog production projects.
4. Run the manual `Deployment Smoke Test` workflow after production changes.

[`Jenkinsfile`](./Jenkinsfile) is retained only as an optional parity pipeline;
it never deploys. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for environment,
rollback, and Vercel configuration procedures.

---

## Docker

```bash
# Build and start portfolio, blog, and the sibling FastAPI backend
docker compose up -d --build

# Check container state and health
docker compose ps

# Stop the stack without deleting images
docker compose down
```

The portfolio is available at `http://localhost:3000`, including the proxied
direct blog domain. The local blog app is available at `http://localhost:3001`
and the sibling API at `http://localhost:8000`.
