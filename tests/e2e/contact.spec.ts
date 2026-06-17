import { test, expect } from "@playwright/test";

const fillValid = async (page: import("@playwright/test").Page) => {
  await page.locator("#signal-name").fill("Jane Recruiter");
  await page.locator("#signal-email").fill("jane@example.com");
  await page
    .locator("#signal-message")
    .fill("This is a genuinely long enough message for the contact form.");
};

test("client validation blocks an invalid submit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#signal");
  await page.locator("#signal-name").fill("Jane Recruiter");
  await page.locator("#signal-email").fill("not-an-email");
  await page.locator("#signal-message").fill("too short");
  await page.getByRole("button", { name: "SEND THE SIGNAL" }).click();
  await expect(page.locator("#err-email")).toBeVisible();
  await expect(page.locator("#err-message")).toBeVisible();
});

test("success state on 202 (mocked)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 202, contentType: "application/json", body: '{"ok":true}' }),
  );
  await page.goto("/#signal");
  await fillValid(page);
  await page.getByRole("button", { name: "SEND THE SIGNAL" }).click();
  await expect(page.getByText("SIGNAL RECEIVED")).toBeVisible();
});

test("failure state on 500 (mocked) shows the mailto fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: '{"ok":false}' }),
  );
  await page.goto("/#signal");
  await fillValid(page);
  await page.getByRole("button", { name: "SEND THE SIGNAL" }).click();
  await expect(page.getByText("SIGNAL LOST")).toBeVisible();
});

test("404 hint opens the terminal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/this-page-does-not-exist");
  await expect(page.getByText("PAGE REDACTED.")).toBeVisible();
  await page.getByRole("button", { name: /BACK DOOR/ }).click();
  await expect(
    page.locator('[role="dialog"][aria-label="Command Center"]'),
  ).toBeVisible();
});
