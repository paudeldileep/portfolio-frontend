# CI, Deployment, and Rollback

This repository uses a deliberately small, no-cost delivery model:

- GitHub Actions validates pull requests and `main`.
- Vercel builds and deploys the two Next.js projects.
- Docker provides local portability; it is not part of the Vercel deployment.
- Jenkins is optional parity only and does not deploy.

## Delivery flow

1. Create a feature branch.
2. Open a pull request into `main`.
3. Wait for the GitHub Actions `Lint, test, build, and E2E` check.
4. Review the Vercel preview deployment.
5. Merge only after the required check passes.
6. Let Vercel deploy `main`.
7. Run the `Deployment Smoke Test` workflow against the public portfolio URL.

Protecting `main` is what turns CI into a deployment gate. A workflow alone
reports failures but cannot prevent a direct merge or push.

## GitHub repository settings

In GitHub, open **Settings → Branches → Add branch protection rule**:

- Branch name pattern: `main`
- Require a pull request before merging
- Require status checks to pass before merging
- Required check: `Lint, test, build, and E2E`
- Require branches to be up to date before merging
- Do not allow bypassing the rule for routine changes

The workflow has read-only repository permissions and contains no deployment
token. Vercel's Git integration owns deployment authorization.

## Vercel projects

Keep two projects connected to this repository:

| Project   | Root directory | Public role                                           |
| --------- | -------------- | ----------------------------------------------------- |
| Portfolio | `apps/web`     | Owns `https://iamdileep.vercel.app`                   |
| Blog      | `apps/blog`    | Upstream zone; readers use the portfolio `/blog` path |

For both projects, open **Settings → Build and Deployment → Root Directory** and
enable **Skip deployment when there are no changes to the root directory or its
dependencies**. Vercel uses the pnpm workspace dependency graph, so shared
token/UI changes still rebuild affected consumers while unrelated application
changes are skipped.

Do not add a custom Ignored Build Step unless automatic monorepo detection is
proven insufficient. A canceled ignored build still consumes a deployment and
concurrency slot; automatic unaffected-project skipping does not.

## Environment matrix

Configure values in Vercel Project Settings. `NEXT_PUBLIC_*` values are compiled
into browser assets and are never secrets.

### Portfolio project

| Variable               | Production purpose                                           |
| ---------------------- | ------------------------------------------------------------ |
| `BLOG_ORIGIN`          | Server-side upstream origin for the independent blog project |
| `NEXT_PUBLIC_API_URL`  | Public FastAPI origin used by the browser                    |
| `NEXT_PUBLIC_BLOG_URL` | Public portfolio URL ending in `/blog`                       |
| `NEXT_PUBLIC_SITE_URL` | Public portfolio origin                                      |

### Blog project

| Variable                    | Production purpose                          |
| --------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Public portfolio origin                     |
| `NEXT_PUBLIC_SITE_URL`      | Public portfolio origin used for canonicals |
| `BLOG_API_URL`              | Server-side FastAPI origin for published posts |

Never put Supabase service keys, Qdrant API keys, admin tokens, or other backend
credentials in either frontend project.

After changing any build-time environment variable, redeploy the affected
project; changing the dashboard value does not rewrite an already-built bundle.

## Smoke verification

Run locally against production:

```bash
pnpm smoke:production
```

Run against another environment:

```bash
SMOKE_BASE_URL=https://preview.example.com pnpm smoke:production
```

On Windows PowerShell:

```powershell
$env:SMOKE_BASE_URL = 'https://preview.example.com'
pnpm smoke:production
Remove-Item Env:SMOKE_BASE_URL
```

The script checks the portfolio, blog landing, representative article, RSS,
sitemap, canonical URL, a proxied `/blog-static` asset, and accidental upstream
hostname exposure.

## Rollback procedure

Vercel keeps previous immutable deployments. A rollback does not require a new
Git commit:

1. Open the affected Vercel project.
2. Open **Deployments**.
3. Find the last known-good production deployment.
4. Inspect its commit and environment before promotion.
5. Use the deployment menu to promote or roll back to it.
6. Run the deployment smoke test.
7. Roll back the other zone only if the failure crosses the Multi-Zone
   boundary or depends on a shared contract change.
8. Revert or fix the source change in Git so the next deployment does not
   reintroduce the issue.

Dry-run this procedure by locating the promotion control and identifying the
last known-good deployment without confirming the final action.

## Local containers

The Dockerfile has independent `web-runner` and `blog-runner` targets. Docker
sets `NEXT_OUTPUT_MODE=standalone`; normal local and Vercel builds do not need
standalone output. Compose also builds the backend from the sibling
`../portfolio-ai-backend` repository.

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose down
```

Build-time `NEXT_PUBLIC_*` values default to local browser URLs. Backend secrets
must be supplied through the host environment or a local ignored `.env` file;
they must never be committed.
