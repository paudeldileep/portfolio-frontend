# syntax=docker/dockerfile:1
# ──────────────────────────────────────────────────────────────
# Multi-stage Dockerfile for @portfolio/web (Next.js 15)
# Stage 1 — deps:     Install all workspace dependencies
# Stage 2 — builder:  Build the Next.js application
# Stage 3 — runner:   Minimal production image (~150MB)
# ──────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy workspace manifests only (layer caching for deps)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/tokens/package.json    ./packages/tokens/package.json
COPY packages/ui/package.json        ./packages/ui/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY apps/web/package.json           ./apps/web/package.json

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules      ./node_modules
COPY --from=deps /app/packages/tokens/node_modules ./packages/tokens/node_modules
COPY --from=deps /app/packages/ui/node_modules     ./packages/ui/node_modules
COPY --from=deps /app/apps/web/node_modules        ./apps/web/node_modules

# Copy source
COPY . .

# Build the web app
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @portfolio/web build

# ── Stage 3: Production runner ─────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Only copy the compiled Next.js standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public       ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
