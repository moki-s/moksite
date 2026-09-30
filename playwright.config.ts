import { defineConfig, devices } from "@playwright/test";

// Phase 2 verification (§12). Builds are run separately; this serves the
// production build via `pnpm start` and reuses an already-running server.
//
// Mobile projects (§12, docs/DECISIONS.md 30 Sep 2026): real phone descriptors
// (touch, mobile viewport, coarse pointer) scoped to the focused mobile spec
// via testMatch, so CI time stays bounded and the desktop suites run untouched.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "line",
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
