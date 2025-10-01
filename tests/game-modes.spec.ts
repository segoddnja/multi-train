import { test, expect } from "@playwright/test";
import { StartScreenPage } from "./pages/StartScreenPage.js";
import { GameScreenPage } from "./pages/GameScreenPage.js";
import { ResultsScreenPage } from "./pages/ResultsScreenPage.js";

test.describe("Game Modes", () => {
  test("should support input mode with keyboard submission", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    await expect(gameScreen.answerInput).toBeVisible();
    await expect(gameScreen.submitButton).toBeVisible();

    // Test keyboard submission
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\\d+) × (\\d+)/);
    if (match) {
      const answer = parseInt(match[1]) * parseInt(match[2]);
      await gameScreen.typeAnswer(answer.toString());
      await gameScreen.submitAnswerWithKeyboard(); // Press Enter
    }

    // Verify next problem loads
    await page.waitForTimeout(500);
    const newProblem = await gameScreen.getProblemText();
    expect(newProblem).not.toBe(problem);
  });

  test("should support multiple choice mode with 3 options", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    await expect(gameScreen.multipleChoiceButtons.first()).toBeVisible();

    // Should not show input field in multiple choice mode
    await expect(gameScreen.answerInput).not.toBeVisible();
    await expect(gameScreen.submitButton).not.toBeVisible();

    // Verify 3 options are provided
    const options = await gameScreen.getMultipleChoiceOptions();
    expect(options).toHaveLength(3);

    // Verify options are distinct
    const uniqueOptions = [...new Set(options)];
    expect(uniqueOptions).toHaveLength(3);

    // Verify correct answer is among options
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\\d+) × (\\d+)/);
    if (match) {
      const correctAnswer = parseInt(match[1]) * parseInt(match[2]);
      expect(options).toContain(correctAnswer);
    }
  });

  test("should validate input mode only accepts numbers", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    await expect(gameScreen.answerInput).toBeVisible();

    // Try to type letters
    await gameScreen.answerInput.fill("abc");
    const letterValue = await gameScreen.answerInput.inputValue();
    expect(letterValue).toBe(""); // Should be empty

    // Try to type numbers
    await gameScreen.answerInput.fill("123");
    const numberValue = await gameScreen.answerInput.inputValue();
    expect(numberValue).toBe("123"); // Should accept numbers

    // Try mixed input
    await gameScreen.answerInput.fill("12a3b");
    const mixedValue = await gameScreen.answerInput.inputValue();
    expect(mixedValue).toBe("123"); // Should only keep numbers
  });

  test("should disable submit button when input is empty", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    // Submit button should be disabled when empty
    const isDisabledEmpty = await gameScreen.submitButton.isDisabled();
    expect(isDisabledEmpty).toBe(true);

    // Type answer and verify button becomes enabled
    await gameScreen.typeAnswer("12");
    const isDisabledWithAnswer = await gameScreen.submitButton.isDisabled();
    expect(isDisabledWithAnswer).toBe(false);

    // Clear input and verify button becomes disabled again
    await gameScreen.answerInput.fill("");
    const isDisabledAfterClear = await gameScreen.submitButton.isDisabled();
    expect(isDisabledAfterClear).toBe(true);
  });

  test("should auto-focus input field for new problems", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    // Input should be focused on first problem
    const isFocused = await gameScreen.answerInput.evaluate(
      (el) => document.activeElement === el
    );
    expect(isFocused).toBe(true);

    // Answer and move to next problem
    await gameScreen.typeAnswer("12");
    await gameScreen.submitAnswer();
    await page.waitForTimeout(500);

    // Input should be focused on next problem
    const isFocusedNext = await gameScreen.answerInput.evaluate(
      (el) => document.activeElement === el
    );
    expect(isFocusedNext).toBe(true);
  });

  test("should show appropriate hints for each mode", async ({ page }) => {
    const startScreen = new StartScreenPage(page);

    // Test input mode hint
    await startScreen.goto();
    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    const inputHint = await page
      .locator("text=Press Enter to quickly submit")
      .isVisible();
    expect(inputHint).toBe(true);

    // Test multiple choice mode hint
    await page.goto("/");
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    const choiceHint = await page
      .locator("text=Click the correct answer as quickly as possible")
      .isVisible();
    expect(choiceHint).toBe(true);
  });

  test("should complete game successfully in both modes", async ({ page }) => {
    const resultsScreen = new ResultsScreenPage(page);

    // Test input mode completion
    await page.goto("/");
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.selectGameMode("input");
    await startScreen.startGame();

    // Complete game with correct answers
    for (let i = 0; i < 10; i++) {
      await expect(gameScreen.problemDisplay).toBeVisible();
      const problem = await gameScreen.getProblemText();
      const match = problem?.match(/(\d+) × (\d+)/);
      if (match) {
        const answer = parseInt(match[1]) * parseInt(match[2]);
        await gameScreen.typeAnswer(answer.toString());
        await gameScreen.submitAnswer();
        await page.waitForTimeout(300);
      }
    }

    await expect(resultsScreen.title).toBeVisible();
    const inputAccuracy = await resultsScreen.getAccuracy();
    expect(inputAccuracy).toBe(100);

    // Test multiple choice mode completion
    await resultsScreen.playAgain();
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    for (let i = 0; i < 10; i++) {
      await expect(gameScreen.problemDisplay).toBeVisible();
      const problem = await gameScreen.getProblemText();
      const match = problem?.match(/(\d+) × (\d+)/);
      if (match) {
        const answer = parseInt(match[1]) * parseInt(match[2]);
        await gameScreen.clickMultipleChoiceAnswer(answer);
        await page.waitForTimeout(300);
      }
    }

    await expect(resultsScreen.title).toBeVisible();
    const choiceAccuracy = await resultsScreen.getAccuracy();
    expect(choiceAccuracy).toBe(100);
  });
});
