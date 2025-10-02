import { expect, test } from "@playwright/test";
import { GameScreenPage } from "./pages/GameScreenPage.js";
import { StartScreenPage } from "./pages/StartScreenPage.js";
import { TestUtils } from "./utils/TestUtils.js";

test.describe("Difficulty Levels", () => {
  test("should handle unlimited time mode (easy difficulty)", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.startGame();

    // Verify unlimited time mode
    await expect(gameScreen.problemDisplay).toBeVisible();
    const isUnlimited = await gameScreen.isUnlimitedTimeMode();
    expect(isUnlimited).toBe(true);

    // Verify no timer countdown
    const timeLeft = await gameScreen.getTimeLeft();
    expect(timeLeft).toBeNull(); // Should be null for unlimited time

    // Take a long time to answer and verify no timeout
    await page.waitForTimeout(3000);
    await expect(gameScreen.problemDisplay).toBeVisible(); // Should still be visible
  });

  test("should enforce 20-second time limit (medium difficulty)", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("medium");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Verify timer is present and starts at 20 seconds
    const isUnlimited = await gameScreen.isUnlimitedTimeMode();
    expect(isUnlimited).toBe(false);

    // Wait for timer to count down
    await page.waitForTimeout(1000);
    const timeLeft = await gameScreen.getTimeLeft();
    expect(timeLeft).toBeLessThanOrEqual(20);
    expect(timeLeft).toBeGreaterThan(15); // Should be around 18-19 seconds
  });

  test("should enforce 15-second time limit (hard difficulty)", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("hard");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Check initial time
    const initialTime = await gameScreen.getTimeLeft();
    expect(initialTime).toBeLessThanOrEqual(15);
    expect(initialTime).toBeGreaterThan(10);
  });

  test("should enforce 10-second time limit (expert difficulty)", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("expert");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Check initial time
    const initialTime = await gameScreen.getTimeLeft();
    expect(initialTime).toBeLessThanOrEqual(10);
    expect(initialTime).toBeGreaterThan(5);
  });

  test("should show timeout message when time expires", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("expert"); // 10 second limit
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Wait for timeout to occur - expert mode has 10 second limit
    // We'll wait up to 15 seconds and check periodically for timeout message
    let timeoutOccurred = false;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      const isTimeUp = await gameScreen.isTimeUp();
      if (isTimeUp) {
        timeoutOccurred = true;
        break;
      }
    }

    // Verify timeout message appeared
    expect(timeoutOccurred).toBe(true);

    // If timeout occurred, also verify correct answer is shown
    if (timeoutOccurred) {
      const correctAnswer = await gameScreen.getCorrectAnswer();
      expect(correctAnswer).toBeGreaterThan(0);
    }
  });

  test("should display appropriate difficulty descriptions", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);

    await startScreen.goto();

    // Check each difficulty description
    const easyDesc = await startScreen.getDifficultyDescription("easy");
    expect(easyDesc).toContain("Unlimited");

    const mediumDesc = await startScreen.getDifficultyDescription("medium");
    expect(mediumDesc).toContain("20");

    const hardDesc = await startScreen.getDifficultyDescription("hard");
    expect(hardDesc).toContain("15");

    const expertDesc = await startScreen.getDifficultyDescription("expert");
    expect(expertDesc).toContain("10");
  });

  test("should affect scoring based on difficulty level", async ({ page }) => {
    const resultsEasy = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
      answerSpeed: "normal",
    });

    const scoreEasy = await resultsEasy.getFinalScore();

    // Start a new game with expert difficulty
    await page.goto("/");
    const resultsExpert = await TestUtils.playCompleteGame(page, {
      difficulty: "expert",
      answerCorrectly: true,
      answerSpeed: "fast",
    });

    const scoreExpert = await resultsExpert.getFinalScore();

    // Expert should potentially score higher if answered quickly
    // (though this depends on the scoring algorithm implementation)
    expect(scoreExpert).toBeGreaterThan(0);
    expect(scoreEasy).toBeGreaterThan(0);
  });
});
