import { test, expect } from "@playwright/test";

const DIALOG = '[role="dialog"][aria-label="Command Center"]';

test("terminal chunk is lazy — no dialog or chunk until discovery", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));

  const before = new Set<string>();
  const after: string[] = [];
  let opened = false;
  page.on("request", (r) => {
    if (!r.url().endsWith(".js")) return;
    if (opened) {
      if (!before.has(r.url())) after.push(r.url());
    } else {
      before.add(r.url());
    }
  });

  await page.goto("/");
  await expect(page.locator(DIALOG)).toHaveCount(0);
  await page.waitForLoadState("networkidle"); // initial + prefetch chunks settle

  opened = true;
  await page.keyboard.press("`");
  await expect(page.locator(DIALOG)).toBeVisible();
  expect(after.length, "a new JS chunk loads on discovery").toBeGreaterThan(0);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("keyboard-only: commands, history, tab-complete, clear", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("`");
  await expect(page.locator(DIALOG)).toBeVisible();
  await page.waitForTimeout(1300); // boot ≤ 1.5 s

  const input = page.locator("#terminal-input");
  await expect(input).toBeFocused();

  await input.fill("help");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("available commands");

  await input.fill("socials");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("github.com/moki-s");

  await input.fill("sudo hire-me");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("OFFER LETTER");
  await expect(page.locator(".terminal-log")).toContainText("Mokshith Sanga");

  await input.fill("xyzzy");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("command not found");

  // history recall
  await input.press("ArrowUp");
  await expect(input).toHaveValue("xyzzy");

  // tab completion
  await input.fill("coff");
  await input.press("Tab");
  await expect(input).toHaveValue("coffee ");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).toContainText("fuel acquired");

  // clear
  await input.fill("clear");
  await input.press("Enter");
  await expect(page.locator(".terminal-log")).not.toContainText("fuel acquired");
});

test("Esc always closes and restores focus to the trigger", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hotspot = page.getByRole("button", {
    name: "A lit window. Something hums inside.",
  });
  await hotspot.focus();
  await page.keyboard.press("Enter"); // keyboard-activate → opens terminal
  await expect(page.locator(DIALOG)).toBeVisible();
  await page.waitForTimeout(1300);

  await page.locator("#terminal-input").press("Escape");
  await expect(page.locator(DIALOG)).toHaveCount(0);
  await expect(hotspot).toBeFocused();
});
