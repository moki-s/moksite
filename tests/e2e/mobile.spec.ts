import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// §12 / docs/DECISIONS.md (30 Sep 2026) — mobile & touch coverage. Runs only on
// the mobile-chromium / mobile-webkit projects (see playwright.config.ts).
// Motion is deliberately NOT force-reduced here: the touch UI (torch, terminal
// tap-row, deferred 3D) only exists on the motion-enabled path.
//
// Engine note: Playwright's device descriptors give both engines touch + the
// mobile viewport, but only Chromium reliably emulates the `pointer: coarse`
// media feature. Tests that depend on coarse-only UI probe the page and skip
// (with the reason recorded) where the engine can't emulate it — the behavior
// itself is engine-independent CSS/JS, verified on mobile-chromium.

const DIALOG = '[role="dialog"][aria-label="Command Center"]';

async function isCoarse(page: Page) {
  return page.evaluate(() => window.matchMedia("(pointer: coarse)").matches);
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .flatMap((v) => v.nodes.map((n) => `${v.impact}: ${v.id} @ ${n.target.join(" ")}`));
}

async function noHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    return d.scrollWidth <= d.clientWidth + 1;
  });
}

test("no horizontal page overflow at 320/375/390 on the key routes", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const url of ["/", "/case/the-red-pen", "/dossier"]) {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(await noHorizontalOverflow(page), `${url} @ ${width}px`).toBe(true);
    }
    // bottom of the scroll story too (metrics, signal, footer)
    await page.goto("/");
    await page.locator("#signal").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    expect(await noHorizontalOverflow(page), `/#signal @ ${width}px`).toBe(true);
  }
});

test("hero overlay is fully visible in the small viewport (svh fix)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeInViewport();
  await expect(page.getByRole("button", { name: "SKIP THE INTRO →" })).toBeInViewport();
  await expect(page.locator(".hero-caption")).toBeInViewport();
});

test("portrait poster source is selected on portrait phones", async ({ page }) => {
  await page.goto("/");
  const src = await page
    .locator(".hero-poster-img")
    .evaluate((img) => (img as HTMLImageElement).currentSrc);
  expect(src, "portrait art-directed poster").toContain("hero-portrait");
});

test("3D city arms on first interaction, not on load (Lighthouse-invisible)", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const webgl2 = await page.evaluate(
    () => !!document.createElement("canvas").getContext("webgl2"),
  );
  test.skip(!webgl2, "no WebGL2 in this headless engine — poster tier is the designed fallback");

  // pre-interaction: no canvas (the three chunk must stay out of the trace)
  await expect(page.locator("#hero canvas")).toHaveCount(0);

  // first touch arms the scene
  await page.touchscreen.tap(200, 400);
  await expect(page.locator("#hero canvas")).toHaveCount(1, { timeout: 15_000 });

  // CSS rain fallback yields to the 3D scene
  await expect(page.locator(".hero-css-rain")).toHaveCount(0);
});

test("panel reveals fire on native touch scroll (motion on)", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("#origin").scrollIntoViewIfNeeded();
  const content = page.locator("#origin .panel-content");
  await expect(content).toBeVisible();
  // GSAP reveal completes (autoAlpha → 1)
  await expect
    .poll(async () => content.evaluate((el) => getComputedStyle(el).opacity), {
      timeout: 8_000,
    })
    .toBe("1");
});

test("navbar: all five links fit and work at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.locator("#origin").scrollIntoViewIfNeeded(); // navbar appears post-hero
  const nav = page.locator(".navbar");
  await expect(nav).toBeVisible();
  for (const label of ["ORIGIN", "CASES", "ARSENAL", "SIGNAL", "DOSSIER"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test("case summaries are revealed without hover; tap navigates", async ({ page }) => {
  await page.goto("/");
  test.skip(!(await isCoarse(page)), "engine does not emulate pointer: coarse");
  await page.locator("#cases").scrollIntoViewIfNeeded();
  const firstFolder = page.locator(".case-folder").first();
  await expect(firstFolder).toBeVisible();
  const summary = firstFolder.locator(".case-summary");
  await expect(summary).toBeVisible(); // §5.4 — no hover needed on touch
  await firstFolder.tap();
  await expect(page).toHaveURL(/\/case\//);
  await expect(page.locator("h1.case-title-lg")).toBeVisible();
});

test("terminal: touch open via navbar trigger, tap-row, typing, ASCII containment", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  test.skip(!(await isCoarse(page)), "engine does not emulate pointer: coarse");

  // coarse-only navbar trigger (§5.7)
  await page.locator("#origin").scrollIntoViewIfNeeded();
  const trigger = page.getByRole("button", { name: "Open the Command Center" });
  await expect(trigger).toBeVisible();
  await trigger.tap();
  await expect(page.locator(DIALOG)).toBeVisible();

  // a tap skips the boot line (touch parity with "press any key")
  await page.locator(DIALOG).tap({ position: { x: 100, y: 100 } });
  await expect(page.locator("#terminal-input")).toBeVisible();

  // no autofocus on touch — the keyboard must not auto-cover the screen
  await expect(page.locator("#terminal-input")).not.toBeFocused();

  // tap-row runs commands (§5.7)
  const tapRow = page.locator(".terminal-taprow");
  await expect(tapRow).toBeVisible();
  await tapRow.getByRole("button", { name: "help", exact: true }).tap();
  await expect(page.locator(".terminal-log")).toContainText("available commands");

  // typing still works after tapping the input; ≥16px kills iOS zoom-on-focus
  const input = page.locator("#terminal-input");
  await input.tap();
  const fontSize = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize, "input ≥16px (iOS zoom)").toBeGreaterThanOrEqual(16);
  await input.fill("cases");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("open <id|slug>");

  // wide ASCII art scrolls inside the log, never the page
  await input.fill("coffee");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("fuel acquired");
  expect(await noHorizontalOverflow(page)).toBe(true);
  const asciiOverflow = await page
    .locator(".terminal-ascii")
    .first()
    .evaluate((el) => getComputedStyle(el).overflowX);
  expect(asciiOverflow).toBe("auto");

  // ✕ closes without a keyboard
  await page.getByRole("button", { name: "Close terminal" }).tap();
  await expect(page.locator(DIALOG)).toHaveCount(0);
});

test("hunt: props are inert until the torch reveals them; sweep → lit → bag", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  test.skip(!(await isCoarse(page)), "engine does not emulate pointer: coarse");

  const prop = page.locator('#hero .evidence-prop[aria-label*="lit window"]');
  await expect(prop).toHaveCount(1);

  // unarmed: hidden and inert — it can never intercept a tap meant for content
  expect(await prop.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  expect(await prop.evaluate((el) => parseFloat(getComputedStyle(el).opacity))).toBe(0);

  // arm the torch
  const torch = page.getByRole("button", {
    name: "Light the detective's torch to search this panel",
  });
  await expect(torch).toBeVisible();
  await torch.tap();
  await expect(torch).toHaveAttribute("aria-pressed", "true");

  // sweep the finger across the prop's position → it lights up
  const layer = page.locator("#hero .evidence-layer");
  await expect(layer).toHaveAttribute("data-torch", "");
  const box = (await prop.boundingBox())!;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const opts = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true };
  await layer.dispatchEvent("pointerdown", { ...opts, clientX: cx - 60, clientY: cy });
  await layer.dispatchEvent("pointermove", { ...opts, clientX: cx - 20, clientY: cy });
  await layer.dispatchEvent("pointermove", { ...opts, clientX: cx, clientY: cy });
  await expect(prop).toHaveAttribute("data-lit", "");
  await layer.dispatchEvent("pointerup", { ...opts, clientX: cx, clientY: cy });

  // afterglow window: tap the revealed prop to bag it. Raw touchscreen tap —
  // the browser's own hit test targets the prop (verified); locator.tap()'s
  // hit-target pre-check false-positives on the pointer-events-enabled layer
  // wrapper the prop lives in.
  await page.touchscreen.tap(cx, cy);
  await expect(prop).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".evidence-tally")).toContainText("1 / 7");

  // disarm restores scroll (the layer stops capturing)
  await torch.tap();
  await expect(torch).toHaveAttribute("aria-pressed", "false");
  await expect(layer).not.toHaveAttribute("data-torch", "");
});

test("hunt: keyboard/AT fallback still collects without the torch", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const prop = page.locator('#hero .evidence-prop[aria-label*="detective"]');
  await prop.focus(); // onFocus find — the non-visual completion path (§9)
  await expect(prop).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".evidence-tally")).toContainText("/ 7");
});

test("contact: spotlight rests on the form; form renders sanely", async ({ page }) => {
  await page.goto("/");
  await page.locator("#signal").scrollIntoViewIfNeeded();
  await expect(page.locator(".signal-spotlight")).toHaveCount(1);
  await expect(page.locator(".signal-form")).toBeVisible();
  await expect(page.locator("#signal-name")).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(true);
});

test("axe: mobile home + terminal open + torch armed — zero critical/serious", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  let v = await seriousViolations(page);
  expect(v, v.join("\n")).toEqual([]);

  if (await isCoarse(page)) {
    // torch armed
    const torch = page.getByRole("button", {
      name: "Light the detective's torch to search this panel",
    });
    if (await torch.isVisible()) {
      await torch.tap();
      v = await seriousViolations(page);
      expect(v, `torch armed:\n${v.join("\n")}`).toEqual([]);
      await torch.tap(); // disarm again
    }
  }

  // terminal open (footer hint works on every engine)
  await page.locator("#signal").scrollIntoViewIfNeeded();
  await page.locator(".footer-psst").tap();
  await expect(page.locator(DIALOG)).toBeVisible();
  await page.locator(DIALOG).tap({ position: { x: 100, y: 100 } }); // skip boot
  await expect(page.locator("#terminal-input")).toBeVisible();
  v = await seriousViolations(page);
  expect(v, `terminal:\n${v.join("\n")}`).toEqual([]);
});
