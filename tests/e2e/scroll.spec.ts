import { test, expect, type Page } from "@playwright/test";

const ANCHORS = ["#origin", "#cases", "#arsenal", "#signal"] as const;

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

test.describe("motion on (default)", () => {
  test("full scroll story renders with zero console errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");

    await expect(page.locator("#hero h1")).toHaveText("Mokshith Sanga");
    for (const a of ANCHORS) {
      await expect(page.locator(a)).toHaveCount(1);
    }

    // scroll the whole story to trigger reveals + transitions
    await page.mouse.wheel(0, 6000);
    await page.waitForTimeout(1200);
    await page.mouse.wheel(0, 6000);
    await page.waitForTimeout(1200);

    expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([]);
  });

  for (const a of ANCHORS) {
    test(`direct deep-link ${a} lands on its panel`, async ({ page }) => {
      await page.goto(`/${a}`);
      await page.waitForTimeout(1000); // smooth/instant scroll settle
      await expect(page.locator(a)).toBeInViewport({ ratio: 0.25 });
    });
  }
});

test("reduced motion: identical content & order, native scroll, anchors land", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = trackErrors(page);
  await page.goto("/");

  // content present and in DOM order (§9 — identical content/order)
  for (const a of ANCHORS) {
    await expect(page.locator(a)).toBeVisible();
  }
  const titles = await page.locator(".section-title").allTextContents();
  expect(titles).toEqual(["Case Files", "The Arsenal", "Send a Signal"]);

  // nav reveals after leaving the hero, and a nav anchor lands
  await page.locator("#cases").scrollIntoViewIfNeeded();
  await expect(page.locator("nav.navbar")).toHaveAttribute("data-visible", "true");
  await page.getByRole("link", { name: "ARSENAL", exact: true }).click();
  await page.waitForTimeout(600);
  await expect(page.locator("#arsenal")).toBeInViewport({ ratio: 0.25 });

  expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([]);
});
