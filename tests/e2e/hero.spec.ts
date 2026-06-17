import { test, expect } from "@playwright/test";

test("SKIP THE INTRO is in the initial HTML (usable ≤1s) and scrolls to #cases", async ({
  page,
  request,
}) => {
  // SKIP is server-rendered → present the moment the HTML arrives (no JS gate),
  // so it is usable well within 1s on any reasonable connection.
  const html = await (await request.get("/")).text();
  expect(html, "SKIP is in the initial server HTML").toContain("SKIP THE INTRO");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "SKIP THE INTRO →" }).click();
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
