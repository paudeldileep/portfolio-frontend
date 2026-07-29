/*
 * Optional Jenkins parity pipeline.
 *
 * GitHub Actions is the active CI system for this public repository and
 * Vercel owns deployment. This file intentionally runs the same quality gate
 * without deploying, so a future Jenkins agent cannot bypass repository tests.
 *
 * Agent prerequisites:
 * - Node.js 24 installation named "node-24"
 * - Linux agent able to install Playwright system dependencies
 */
pipeline {
  agent any

  tools {
    nodejs 'node-24'
  }

  environment {
    CI = 'true'
    NEXT_TELEMETRY_DISABLED = '1'
  }

  options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }

  stages {
    stage('Install') {
      steps {
        checkout scm
        sh 'corepack enable && corepack prepare pnpm@9.15.0 --activate'
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Static quality') {
      parallel {
        stage('Lint') {
          steps {
            sh 'pnpm lint'
          }
        }
        stage('Typecheck') {
          steps {
            sh 'pnpm typecheck'
          }
        }
        stage('Unit tests') {
          steps {
            sh 'pnpm test:unit'
          }
        }
        stage('Dependency audit') {
          steps {
            sh 'pnpm audit --audit-level=high'
          }
        }
      }
    }

    stage('Production build') {
      environment {
        BLOG_ORIGIN = 'https://blog.example.invalid'
        NEXT_PUBLIC_API_URL = 'https://api.example.invalid'
        NEXT_PUBLIC_BLOG_URL = 'https://portfolio.example.invalid/blog'
        NEXT_PUBLIC_PORTFOLIO_URL = 'https://portfolio.example.invalid'
        NEXT_PUBLIC_SITE_URL = 'https://portfolio.example.invalid'
      }
      steps {
        sh 'pnpm build'
      }
    }

    stage('Cross-zone E2E') {
      steps {
        sh 'pnpm --filter @portfolio/web exec playwright install --with-deps'
        sh 'pnpm test:e2e'
      }
      post {
        failure {
          archiveArtifacts(
            artifacts: 'apps/web/playwright-report/**/*,apps/web/test-results/**/*',
            allowEmptyArchive: true
          )
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
