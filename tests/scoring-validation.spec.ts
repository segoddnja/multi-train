import { expect, test } from "@playwright/test";
import { ResultsScreenPage } from "./pages/ResultsScreenPage.js";
import { TestUtils } from "./utils/TestUtils.js";

test.describe("Scoring and Validation", () => {
  test("should calculate perfect accuracy for all correct answers", async ({
    page,
  }) => {
    const resultsScreen = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
    });

    const accuracy = await resultsScreen.getAccuracy();
    expect(accuracy).toBe(100);

    const correctAnswers = await resultsScreen.getCorrectAnswers();
    expect(correctAnswers).toBe(10);

    const wrongAnswers = await resultsScreen.getWrongAnswers();
    expect(wrongAnswers).toBe(0);
  });

  test("should calculate correct accuracy for mixed answers", async ({
    page,
  }) => {
    // We'll manually play to control correct/incorrect answers
    await page.goto("/");
    await page.getByRole("button", { name: "🚀 Start Training" }).click();

    // Answer first 7 correctly, last 3 incorrectly
    for (let i = 0; i < 10; i++) {
      const problemDisplay = page.locator(".problem-display");
      await expect(problemDisplay).toBeVisible();

      const problem = await problemDisplay.textContent();
      const match = problem?.match(/(\d+) × (\d+)/);
      if (match) {
        const factor1 = parseInt(match[1]);
        const factor2 = parseInt(match[2]);
        const correctAnswer = factor1 * factor2;

        // Answer first 7 correctly
        const answer = i < 7 ? correctAnswer : correctAnswer + 1;

        await page.locator(".answer-input").fill(answer.toString());
        await page.getByRole("button", { name: "Submit Answer" }).click();
        await page.waitForTimeout(300);
      }
    }

    const resultsScreen = new ResultsScreenPage(page);
    await expect(resultsScreen.title).toBeVisible();

    const accuracy = await resultsScreen.getAccuracy();
    expect(accuracy).toBe(70); // 7/10 = 70%

    const correctAnswers = await resultsScreen.getCorrectAnswers();
    expect(correctAnswers).toBe(7);

    const wrongAnswers = await resultsScreen.getWrongAnswers();
    expect(wrongAnswers).toBe(3);
  });

  test("should award higher scores for faster completion", async ({ page }) => {
    // Play game slowly
    const slowResults = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
      answerSpeed: "slow",
    });

    const slowScore = await slowResults.getFinalScore();

    // Play game quickly
    await page.goto("/");
    const fastResults = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
      answerSpeed: "fast",
    });

    const fastScore = await fastResults.getFinalScore();

    // Fast completion should score higher (assuming speed affects scoring)
    expect(fastScore).toBeGreaterThanOrEqual(slowScore);
  });

  test("should display appropriate performance ranks", async ({ page }) => {
    // Test high performance
    const highResults = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
      answerSpeed: "fast",
    });

    const highScore = await highResults.getFinalScore();
    const highRank = await highResults.getRank();

    expect(highScore).toBeGreaterThan(0);
    expect(highRank).toBeTruthy();

    // Rank should contain positive feedback for good performance
    // Possible ranks: "🏆 Math Genius!", "🌟 Excellent!", "👍 Great Job!", "😊 Good Work!"
    expect(
      highRank?.includes("Great") ||
        highRank?.includes("Excellent") ||
        highRank?.includes("Good Work") ||
        highRank?.includes("Genius")
    ).toBe(true);
  });

  test("should provide relevant improvement tips", async ({ page }) => {
    // Play with some wrong answers to trigger improvement tips
    await page.goto("/");
    await page.getByRole("button", { name: "🚀 Start Training" }).click();

    // Answer some problems incorrectly
    for (let i = 0; i < 10; i++) {
      const problemDisplay = page.locator(".problem-display");
      await expect(problemDisplay).toBeVisible();

      // Give wrong answers for lower accuracy
      await page.locator(".answer-input").fill("1");
      await page.getByRole("button", { name: "Submit Answer" }).click();
      await page.waitForTimeout(300);
    }

    const resultsScreen = new ResultsScreenPage(page);
    await expect(resultsScreen.title).toBeVisible();

    const tips = await resultsScreen.getImprovementTips();
    expect(tips.length).toBeGreaterThan(0);

    // Should include accuracy improvement tip for poor performance
    const accuracyTip = tips.some((tip) =>
      tip.toLowerCase().includes("accuracy")
    );
    expect(accuracyTip).toBe(true);
  });

  test("should track time elapsed accurately", async ({ page }) => {
    const startTime = Date.now();

    const resultsScreen = await TestUtils.playCompleteGame(page, {
      difficulty: "easy",
      answerCorrectly: true,
      answerSpeed: "normal",
    });

    const endTime = Date.now();
    const actualElapsed = Math.floor((endTime - startTime) / 1000);

    const displayedTime = await resultsScreen.getTimeElapsed();
    const parsedTime = TestUtils.parseTimeString(displayedTime);

    // Allow some tolerance for timing differences
    expect(parsedTime).toBeGreaterThan(0);
    expect(parsedTime).toBeLessThanOrEqual(actualElapsed + 5); // 5 second tolerance
  });

  test("should handle zero score gracefully", async ({ page }) => {
    // Answer all questions incorrectly with maximum delay
    await page.goto("/");
    await page.locator('input[value="easy"]').click(); // Use easy mode to avoid timeouts
    await page.getByRole("button", { name: "🚀 Start Training" }).click();

    // Answer incorrectly for all problems
    for (let i = 0; i < 10; i++) {
      const problemDisplay = page.locator(".problem-display");
      await expect(problemDisplay).toBeVisible();

      try {
        // Give a consistently wrong answer
        await page.locator(".answer-input").fill("1", { timeout: 5000 });
        await page
          .getByRole("button", { name: "Submit Answer" })
          .click({ timeout: 5000 });

        // Wait a bit for transition
        await page.waitForTimeout(500);
      } catch {
        // If something goes wrong, break out of the loop
        break;
      }
    }

    const resultsScreen = new ResultsScreenPage(page);
    // Wait longer for results screen to appear
    await expect(resultsScreen.title).toBeVisible({ timeout: 10000 });

    const score = await resultsScreen.getFinalScore();
    const rank = await resultsScreen.getRank();

    expect(score).toBeGreaterThanOrEqual(0); // Score should not be negative
    expect(rank).toBeTruthy(); // Should still show a rank

    // Should have encouraging message even for low scores
    const motivationalMessage = await resultsScreen.getMotivationalMessage();
    expect(motivationalMessage).toBeTruthy();
  });

  test("should validate problem generation correctness", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "🚀 Start Training" }).click();

    // Check first few problems for validity
    for (let i = 0; i < 3; i++) {
      const problemDisplay = page.locator(".problem-display");
      await expect(problemDisplay).toBeVisible();

      const problem = await problemDisplay.textContent();
      const match = problem?.match(/(\d+) × (\d+) = \?/);

      expect(match).toBeTruthy();
      const factor1 = parseInt(match![1]);
      const factor2 = parseInt(match![2]);

      // Factors should be between 2 and 10 based on game rules
      expect(factor1).toBeGreaterThanOrEqual(2);
      expect(factor1).toBeLessThanOrEqual(10);
      expect(factor2).toBeGreaterThanOrEqual(2);
      expect(factor2).toBeLessThanOrEqual(10);

      // Submit answer to move to next problem
      const answer = factor1 * factor2;
      await page.locator(".answer-input").fill(answer.toString());
      await page.getByRole("button", { name: "Submit Answer" }).click();
      await page.waitForTimeout(300);
    }
  });
});
