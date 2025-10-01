import { test, expect } from "@playwright/test";

test.describe("Basic Setup Test", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("test-ai-agent");
    await expect(page.getByText("🧮 Multiplication Trainer")).toBeVisible();
  });
});
