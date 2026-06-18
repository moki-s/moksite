import { test, expect } from "@playwright/test";

const DIALOG = '[role="dialog"][aria-label="Command Center"]';

// Run under reduced motion: stable (Lenis off) and it exercises the §9 instant path.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("props are findable by mouse + keyboard; tally increments; skip link stays first", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  const props = page.locator(".evidence-prop");
  await expect(props).toHaveCount(7);

  // tally hidden until the first find
  await expect(page.locator(".evidence-tally")).toHaveCount(0);

  // skip-to-content link is the first focusable element in the DOM (§9) — props
  // are inserted after content, so they never precede it.
  const firstFocusableClass = await page.evaluate(() => {
    const el = document.querySelector(
      'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
    );
    return el ? el.className : "";
  });
  expect(firstFocusableClass).toContain("skip-link");

  // mouse: hovering an unfound prop finds it
  await props.nth(0).hover();
  await expect(props.nth(0)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".evidence-tally-count")).toContainText("1 / 7");

  // keyboard: focusing a prop finds it
  await props.nth(1).focus();
  await expect(props.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".evidence-tally-count")).toContainText("2 / 7");

  expect(errors, errors.join("\n")).toEqual([]);
});

test("vigilante is hidden + unknown until the hunt is complete", async ({ page }) => {
  await page.goto("/");
  await page.locator(".footer-psst").click(); // deterministic terminal open
  await expect(page.locator(DIALOG)).toBeVisible();
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible();

  await input.fill("help");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("available commands");
  await expect(page.locator(".terminal-log")).not.toContainText("vigilante");

  await input.fill("vigilante");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("command not found");
});

test("finding all 7 unlocks the vigilante command", async ({ page }) => {
  await page.goto("/");
  const props = page.locator(".evidence-prop");
  await expect(props).toHaveCount(7); // wait for the lazy layer to mount
  for (let i = 0; i < 7; i++) await props.nth(i).hover();

  await expect(page.locator(".evidence-tally-count")).toContainText("7 / 7");
  await expect(page.locator(".evidence-tally-flash")).toBeVisible();

  await page.locator(".footer-psst").click(); // deterministic terminal open
  await expect(page.locator(DIALOG)).toBeVisible();
  const input = page.locator("#terminal-input");
  await expect(input).toBeVisible();

  await input.fill("help");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("vigilante");

  await input.fill("vigilante");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("case closed");
});
