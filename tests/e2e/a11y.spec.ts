import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// §9 / §12 — zero critical or serious accessibility violations on the key views.
async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .flatMap((v) => v.nodes.map((n) => `${v.impact}: ${v.id} @ ${n.target.join(" ")}`));
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("home — no critical/serious a11y violations", async ({ page }) => {
  await page.goto("/");
  const v = await seriousViolations(page);
  expect(v, v.join("\n")).toEqual([]);
});

test("case detail — no critical/serious a11y violations", async ({ page }) => {
  await page.goto("/case/the-learning-machine");
  const v = await seriousViolations(page);
  expect(v, v.join("\n")).toEqual([]);
});

test("dossier — no critical/serious a11y violations", async ({ page }) => {
  await page.goto("/dossier");
  const v = await seriousViolations(page);
  expect(v, v.join("\n")).toEqual([]);
});

test("open terminal — no critical/serious a11y violations", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("`");
  await expect(page.getByRole("dialog", { name: /command center/i })).toBeVisible();
  // Drive to a fully-booted, stable state (boot animation done, output rendered)
  // so the scan never catches a transient mid-boot frame.
  const input = page.locator("#terminal-input");
  await expect(input).toBeFocused();
  await input.fill("help");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("available commands");
  const v = await seriousViolations(page);
  expect(v, v.join("\n")).toEqual([]);
});
