# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/blog/package.json ./apps/blog/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/tokens/package.json ./packages/tokens/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN pnpm install --frozen-lockfile

FROM base AS source
COPY --from=dependencies /app/ /app/
COPY . .

FROM source AS web-builder
ARG BLOG_ORIGIN=http://blog:3001
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_BLOG_URL=http://localhost:3000/blog
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV BLOG_ORIGIN=$BLOG_ORIGIN
ENV NEXT_OUTPUT_MODE=standalone
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BLOG_URL=$NEXT_PUBLIC_BLOG_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN pnpm --filter @portfolio/web build

FROM node:24-alpine AS web-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

FROM source AS blog-builder
ARG NEXT_PUBLIC_PORTFOLIO_URL=http://localhost:3000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_PORTFOLIO_URL=$NEXT_PUBLIC_PORTFOLIO_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_OUTPUT_MODE=standalone
RUN pnpm --filter @portfolio/blog build

FROM node:24-alpine AS blog-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
COPY --from=blog-builder --chown=nextjs:nodejs /app/apps/blog/.next/standalone ./
COPY --from=blog-builder --chown=nextjs:nodejs /app/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=blog-builder --chown=nextjs:nodejs /app/apps/blog/public ./apps/blog/public
USER nextjs
EXPOSE 3001
CMD ["node", "apps/blog/server.js"]
