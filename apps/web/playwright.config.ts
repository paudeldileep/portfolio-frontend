import { defineConfig, devices } from "@playwright/test";

const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const localBaseUrl = "http://localhost:3100";
const localBlogOrigin = "http://localhost:3101";
const localApiOrigin = "http://127.0.0.1:3200";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    baseURL: configuredBaseUrl ?? localBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
  ],

  webServer: configuredBaseUrl
    ? undefined
    : [
        {
          command: "node tests/e2e/mock-api.mjs",
          url: `${localApiOrigin}/health`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
        {
          command:
            "pnpm --dir ../blog build && pnpm --dir ../blog exec next start --port 3101",
          url: `${localBlogOrigin}/blog`,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          env: {
            BLOG_API_URL: localApiOrigin,
            NEXT_DIST_DIR: '.next-e2e',
            NEXT_PUBLIC_PORTFOLIO_URL: localBaseUrl,
            NEXT_PUBLIC_SITE_URL: localBaseUrl,
          },
        },
        {
          command: "pnpm build && pnpm exec next start --port 3100",
          url: localBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
          env: {
            BLOG_ORIGIN: localBlogOrigin,
            NEXT_PUBLIC_API_URL: localApiOrigin,
            NEXT_PUBLIC_BLOG_URL: `${localBaseUrl}/blog`,
            NEXT_PUBLIC_SITE_URL: localBaseUrl,
          },
        },
      ],
});
