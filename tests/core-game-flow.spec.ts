import { test, expect } from "@playwright/test";
import { StartScreenPage } from "./pages/StartScreenPage.js";
import { GameScreenPage } from "./pages/GameScreenPage.js";
import { ResultsScreenPage } from "./pages/ResultsScreenPage.js";

test.describe("Core Game Flow", () => {
  test("should complete a full game session with input mode", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);
    const resultsScreen = new ResultsScreenPage(page);

    // Start screen
    await startScreen.goto();
    await expect(startScreen.title).toBeVisible();
    await expect(startScreen.subtitle).toBeVisible();

    // Select easy difficulty and input mode (defaults)
    await startScreen.selectDifficulty("easy");
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    // Game screen - play through all 10 problems
    for (let i = 0; i < 10; i++) {
      await expect(gameScreen.problemDisplay).toBeVisible();

      const problem = await gameScreen.getProblemText();
      expect(problem).toMatch(/\d+ × \d+ = \?/);

      // Calculate correct answer
      const match = problem?.match(/(\d+) × (\d+)/);
      expect(match).toBeTruthy();
      const factor1 = parseInt(match![1]);
      const factor2 = parseInt(match![2]);
      const answer = factor1 * factor2;

      // Enter answer
      await gameScreen.typeAnswer(answer.toString());
      await gameScreen.submitAnswer();

      // Verify progress updated
      const progress = await gameScreen.getCurrentProgress();
      expect(progress.current).toBeGreaterThan(i);
    }

    // Results screen
    await expect(resultsScreen.title).toBeVisible();
    const finalScore = await resultsScreen.getFinalScore();
    expect(finalScore).toBeGreaterThan(0);

    const accuracy = await resultsScreen.getAccuracy();
    expect(accuracy).toBe(100); // All answers were correct

    const correctAnswers = await resultsScreen.getCorrectAnswers();
    expect(correctAnswers).toBe(10);

    const wrongAnswers = await resultsScreen.getWrongAnswers();
    expect(wrongAnswers).toBe(0);
  });

  test("should complete a full game session with multiple choice mode", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);
    const resultsScreen = new ResultsScreenPage(page);

    // Start screen
    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    // Game screen - play through all 10 problems
    for (let i = 0; i < 10; i++) {
      await expect(gameScreen.problemDisplay).toBeVisible();
      await expect(gameScreen.multipleChoiceButtons.first()).toBeVisible();

      const problem = await gameScreen.getProblemText();
      const options = await gameScreen.getMultipleChoiceOptions();

      expect(options).toHaveLength(3); // Should have 3 multiple choice options

      // Calculate correct answer
      const match = problem?.match(/(\d+) × (\d+)/);
      expect(match).toBeTruthy();
      const factor1 = parseInt(match![1]);
      const factor2 = parseInt(match![2]);
      const correctAnswer = factor1 * factor2;

      // Verify correct answer is in options
      expect(options).toContain(correctAnswer);

      // Click correct answer
      await gameScreen.clickMultipleChoiceAnswer(correctAnswer);

      // Wait for next problem
      await page.waitForTimeout(500);
    }

    // Results screen
    await expect(resultsScreen.title).toBeVisible();
    const accuracy = await resultsScreen.getAccuracy();
    expect(accuracy).toBe(100);
  });

  test("should handle play again functionality", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);
    const resultsScreen = new ResultsScreenPage(page);

    // Complete one game
    await startScreen.goto();
    await startScreen.startGame();

    // Skip through game quickly
    for (let i = 0; i < 10; i++) {
      await expect(gameScreen.problemDisplay).toBeVisible();
      await gameScreen.typeAnswer("1"); // Wrong answers for speed
      await gameScreen.submitAnswer();
      await page.waitForTimeout(200);
    }

    // Results screen
    await expect(resultsScreen.title).toBeVisible();

    // Play again
    await resultsScreen.playAgain();

    // Should be back to start screen
    await expect(startScreen.title).toBeVisible();
  });

  test("should display correct progress and statistics during game", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.startGame();

    let correctCount = 0;

    for (let i = 0; i < 5; i++) {
      // Only test first 5 problems
      await expect(gameScreen.problemDisplay).toBeVisible();

      // Verify progress text
      const progress = await gameScreen.getCurrentProgress();
      expect(progress.current).toBe(i + 1);
      expect(progress.total).toBe(10);

      // Submit a correct answer
      const problem = await gameScreen.getProblemText();
      const match = problem?.match(/(\d+) × (\d+)/);
      if (match) {
        const answer = parseInt(match[1]) * parseInt(match[2]);
        await gameScreen.typeAnswer(answer.toString());
        await gameScreen.submitAnswer();
        correctCount++;
      }

      await page.waitForTimeout(300);

      // Verify stats update
      const displayedCorrect = await gameScreen.getCorrectAnswerCount();
      expect(displayedCorrect).toBe(correctCount);
    }
  });
});
