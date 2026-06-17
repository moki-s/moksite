import { test, expect } from "@playwright/test";

test("SKIP THE INTRO is usable within 1s and scrolls to #cases", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); // deterministic native scroll
  await page.goto("/", { waitUntil: "commit" });
  const skip = page.getByRole("button", { name: "SKIP THE INTRO →" });
  await expect(skip).toBeVisible({ timeout: 1000 });
  await skip.click();
  await page.waitForTimeout(500);
  await expect(page.locator("#cases")).toBeInViewport({ ratio: 0.2 });
});

test("poster-only path works with WebGL disabled (no canvas, overlay + skip)", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));

  // disable WebGL so HeroGate must take the poster-only path
  await page.addInitScript(() => {
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (type: string, ...args: unknown[]) => unknown;
    };
    const orig = proto.getContext;
    proto.getContext = function (type: string, ...args: unknown[]) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
        return null;
      }
      return orig.call(this, type, ...args);
    };
  });

  await page.goto("/");
  await page.waitForTimeout(800);
  await expect(page.locator("#hero canvas")).toHaveCount(0);
  await expect(page.locator("#hero h1")).toHaveText("Mokshith Sanga");
  await expect(page.getByRole("button", { name: "SKIP THE INTRO →" })).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});
