import { defineConfig, devices } from "@playwright/test";

// Full-site e2e verification (§12 + the mobile overhaul, docs/DECISIONS.md).
// Builds are run separately; this serves the production build via `pnpm start`
// and reuses an already-running server.
//
// Mobile projects (§12, docs/DECISIONS.md 30 Sep 2026): real phone descriptors
// (touch, mobile viewport, coarse pointer) scoped to the focused mobile spec
// via testMatch, so CI time stays bounded and the desktop suites run untouched.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // shared-runner engine races (WebKit) — see DECISIONS.md
  workers: 1,
  // `github` on CI surfaces each failing test as a workflow annotation
  // (readable from the run page / checks API without downloading logs)
  reporter: process.env.CI ? [["line"], ["github"]] : "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/mobile.spec.ts",
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }, // Safari engine (§12)
      testIgnore: "**/mobile.spec.ts",
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] }, // Android Chrome (§12)
      testMatch: "**/mobile.spec.ts",
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] }, // iOS Safari engine (§12)
      testMatch: "**/mobile.spec.ts",
    },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
