/**
 * Declarative Jenkins Pipeline — Portfolio Frontend Monorepo
 * ───────────────────────────────────────────────────────────
 * Stages:
 *   1. Checkout
 *   2. Install (pnpm workspace deps — cached between runs)
 *   3. Lint & Type Check
 *   4. Unit & Accessibility Tests
 *   5. Build (Turborepo optimized)
 *   6. E2E Playwright Tests (headless, Docker-backed)
 *   7. Deploy (to staging or production via Docker)
 *
 * Jenkins prerequisites:
 *   - NodeJS 20+ installation named "node-20" configured in Global Tools
 *   - pnpm available via corepack (enabled in setup stage)
 *   - Docker available on the agent
 *   - Credentials: NEXT_PUBLIC_API_URL (the live backend URL), NEXT_PUBLIC_SITE_URL
 *
 * Note: Supabase and Qdrant credentials are backend concerns only.
 *   They are consumed by the FastAPI service — never by this frontend app.
 *   Manage them in the backend repo's pipeline or docker-compose env file.
 */

pipeline {
  agent any

  tools {
    nodejs 'node-20'
  }

  environment {
    PNPM_HOME       = "${WORKSPACE}/.pnpm-store"
    NEXT_TELEMETRY_DISABLED = '1'
    CI              = 'true'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'node --version'
        sh 'corepack enable && corepack prepare pnpm@9.15.0 --activate'
        sh 'pnpm --version'
      }
    }

    stage('Install Dependencies') {
      steps {
        // pnpm caches in PNPM_HOME — Jenkins workspace is reused between builds
        // --frozen-lockfile ensures reproducible installs in CI
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Lint & Type Check') {
      parallel {
        stage('ESLint') {
          steps {
            sh 'pnpm lint'
          }
        }
        stage('TypeScript') {
          steps {
            sh 'pnpm typecheck'
          }
        }
      }
    }

    stage('Unit & Accessibility Tests') {
      steps {
        sh 'pnpm test:unit'
      }
      post {
        always {
          // Archive coverage reports
          publishHTML([
            allowMissing: true,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'apps/web/coverage',
            reportFiles: 'index.html',
            reportName: 'Unit Test Coverage'
          ])
        }
      }
    }

    stage('Build') {
      steps {
        sh 'pnpm build'
      }
    }

    stage('E2E Tests (Playwright)') {
      steps {
        // Run Playwright inside the official Playwright Docker image
        // Mounts the workspace and uses the already-built Next.js output
        sh '''
          docker run --rm \
            --ipc=host \
            -v "${WORKSPACE}":/app \
            -w /app/apps/web \
            -e CI=true \
            -e PLAYWRIGHT_BASE_URL=http://localhost:3000 \
            mcr.microsoft.com/playwright:v1.49.1-jammy \
            sh -c "npm i -g pnpm@9.15.0 && pnpm test:e2e"
        '''
      }
      post {
        always {
          publishHTML([
            allowMissing: true,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'apps/web/playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright E2E Report'
          ])
          archiveArtifacts artifacts: 'apps/web/test-results/**/*', allowEmptyArchive: true
        }
      }
    }

    stage('Deploy to Staging') {
      when {
        branch 'main'
      }
      steps {
        // Frontend only needs the backend URL and its own public site URL.
        // Supabase/Qdrant secrets are backend-only — never needed here.
        withCredentials([
          string(credentialsId: 'NEXT_PUBLIC_API_URL',  variable: 'NEXT_PUBLIC_API_URL'),
          string(credentialsId: 'NEXT_PUBLIC_SITE_URL', variable: 'NEXT_PUBLIC_SITE_URL'),
        ]) {
          sh 'docker compose up -d --build web'
          echo "Deployed to staging at ${NEXT_PUBLIC_SITE_URL}"
        }
      }
    }

  }

  post {
    failure {
      echo "Build failed — review console output and artifact reports above."
    }
    success {
      echo "Build succeeded. All lint, type, unit, and E2E checks passed."
    }
    always {
      cleanWs()
    }
  }
}
