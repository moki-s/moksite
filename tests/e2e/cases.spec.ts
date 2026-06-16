import { test, expect } from "@playwright/test";

// Reduced motion → deterministic native navigation (no speed-line delay).
test("case index → detail, NEXT CASE loops, RETURN TO ISSUE", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#cases").scrollIntoViewIfNeeded();

  await page.locator(".case-folder").first().click();
  await expect(page).toHaveURL(/\/case\/case-one$/);
  await expect(page.locator("h1.case-title-lg")).toBeVisible();

  // NEXT CASE loops through all three and back to the first
  for (const slug of ["case-two", "case-three", "case-one"]) {
    await page.getByRole("link", { name: "NEXT CASE →" }).click();
    await expect(page).toHaveURL(new RegExp(`/case/${slug}$`));
  }

  await page.getByRole("link", { name: "RETURN TO ISSUE" }).click();
  await expect(page).toHaveURL(/#cases/);
  await expect(page.locator("#cases")).toBeVisible();
});

test("case detail OG meta + image render (1200x630 PNG)", async ({ page, request }) => {
  await page.goto("/case/case-one");

  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage, "og:image meta present").toBeTruthy();

  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  expect(
    await page.locator('meta[property="og:image:width"]').getAttribute("content"),
  ).toBe("1200");
  expect(
    await page.locator('meta[property="og:image:height"]').getAttribute("content"),
  ).toBe("630");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  const res = await request.get(ogImage as string);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
  expect((await res.body()).length).toBeGreaterThan(2000);
});

test("no console errors on a case page", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/case/case-two");
  await page.waitForTimeout(600);
  expect(errors, errors.join("\n")).toEqual([]);
});
