import { test, expect } from "@playwright/test";

// §12 — /dossier renders cleanly and exposes the CV download link. The phone-free
// /cv.pdf itself is user-supplied launch content, so the live "PDF → 200 + CV
// downloads" check is a launch-checklist item, not a CI gate; here we assert the
// page renders error-free and the link is present and points at the PDF.
test("/dossier renders error-free with a CV download link", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/dossier");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const cv = page.locator('a[href="/cv.pdf"]');
  expect(await cv.count(), "at least one CV download link").toBeGreaterThan(0);
  await expect(cv.first()).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});
