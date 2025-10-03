import { expect, test } from "@playwright/test";
import { GameScreenPage } from "./pages/GameScreenPage.js";
import { StartScreenPage } from "./pages/StartScreenPage.js";

test.describe("Feedback System", () => {
  test("should show correct answer feedback with encouraging message", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy"); // Unlimited time for predictable testing
    await startScreen.startGame();

    // Wait for first problem to load
    await expect(gameScreen.problemDisplay).toBeVisible();
    const problem = await gameScreen.getProblemText();
    expect(problem).toMatch(/\d+ × \d+ = \?/);

    // Calculate correct answer
    const match = problem?.match(/(\d+) × (\d+)/);
    expect(match).toBeTruthy();
    const factor1 = parseInt(match![1]);
    const factor2 = parseInt(match![2]);
    const correctAnswer = factor1 * factor2;

    // Submit correct answer
    await gameScreen.typeAnswer(correctAnswer.toString());
    await gameScreen.submitAnswer();

    // Check for correct feedback - should show briefly
    const correctFeedback = page.locator('text="✅ Correct!"');
    const encouragementFeedback = page.locator('text="Nice work—keep it up!"');

    // Feedback should appear briefly
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });
    await expect(encouragementFeedback).toBeVisible({ timeout: 1000 });

    // Feedback should disappear after short duration
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });
    await expect(encouragementFeedback).not.toBeVisible({ timeout: 2000 });
  });

  test("should show incorrect answer feedback with correct answer", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    const problem = await gameScreen.getProblemText();
    expect(problem).toMatch(/\d+ × \d+ = \?/);

    // Calculate correct answer but submit wrong one
    const match = problem?.match(/(\d+) × (\d+)/);
    expect(match).toBeTruthy();
    const factor1 = parseInt(match![1]);
    const factor2 = parseInt(match![2]);
    const correctAnswer = factor1 * factor2;
    const wrongAnswer = correctAnswer + 1; // Intentionally wrong

    // Submit wrong answer
    await gameScreen.typeAnswer(wrongAnswer.toString());
    await gameScreen.submitAnswer();

    // Check for incorrect feedback
    const incorrectFeedback = page.locator('text="❌ Not quite"');
    const correctAnswerDisplay = page.locator(
      `text="Correct answer: ${correctAnswer}"`
    );

    // Feedback should appear briefly
    await expect(incorrectFeedback).toBeVisible({ timeout: 1000 });
    await expect(correctAnswerDisplay).toBeVisible({ timeout: 1000 });

    // Feedback should disappear after short duration
    await expect(incorrectFeedback).not.toBeVisible({ timeout: 2000 });
    await expect(correctAnswerDisplay).not.toBeVisible({ timeout: 2000 });
  });

  test("should show feedback for multiple choice correct answers", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    const problem = await gameScreen.getProblemText();
    const options = await gameScreen.getMultipleChoiceOptions();

    // Calculate correct answer
    const match = problem?.match(/(\d+) × (\d+)/);
    expect(match).toBeTruthy();
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);
    expect(options).toContain(correctAnswer);

    // Click correct answer
    await gameScreen.clickMultipleChoiceAnswer(correctAnswer);

    // Check for correct feedback
    const correctFeedback = page.locator('text="✅ Correct!"');
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });
  });

  test("should show feedback for multiple choice incorrect answers", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.selectGameMode("multiple-choice");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    const problem = await gameScreen.getProblemText();
    const options = await gameScreen.getMultipleChoiceOptions();

    // Calculate correct answer and find a wrong one
    const match = problem?.match(/(\d+) × (\d+)/);
    expect(match).toBeTruthy();
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);
    const wrongAnswer = options.find((opt) => opt !== correctAnswer);
    expect(wrongAnswer).toBeDefined();

    // Click wrong answer
    await gameScreen.clickMultipleChoiceAnswer(wrongAnswer!);

    // Check for incorrect feedback
    const incorrectFeedback = page.locator('text="❌ Not quite"');
    const correctAnswerDisplay = page.locator(
      `text="Correct answer: ${correctAnswer}"`
    );

    await expect(incorrectFeedback).toBeVisible({ timeout: 1000 });
    await expect(correctAnswerDisplay).toBeVisible({ timeout: 1000 });
  });

  test("should pause timer during feedback animations", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy"); // Use easy to focus on timer pausing
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Record initial time
    const initialTime = await gameScreen.getTimeElapsed();
    const initialTimeSeconds = parseTimeString(initialTime);

    // Answer a question to trigger feedback
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\d+) × (\d+)/);
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

    await gameScreen.typeAnswer(correctAnswer.toString());
    await gameScreen.submitAnswer();

    // Wait for feedback to appear and disappear
    const correctFeedback = page.locator('text="✅ Correct!"');
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });

    // Check that timer didn't advance significantly during feedback
    const timeAfterFeedback = await gameScreen.getTimeElapsed();
    const timeAfterSeconds = parseTimeString(timeAfterFeedback);

    // Time should not have advanced more than 1 second during feedback
    expect(timeAfterSeconds - initialTimeSeconds).toBeLessThanOrEqual(1);
  });

  test("should not cause layout jumps during feedback", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Get initial layout measurements
    const gameCard = page.locator(".card").first();
    const initialBox = await gameCard.boundingBox();
    expect(initialBox).not.toBeNull();

    // Answer a question to trigger feedback
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\d+) × (\d+)/);
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

    await gameScreen.typeAnswer(correctAnswer.toString());
    await gameScreen.submitAnswer();

    // Wait for feedback to appear
    const correctFeedback = page.locator('text="✅ Correct!"');
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });

    // Check layout hasn't changed during feedback
    const feedbackBox = await gameCard.boundingBox();
    expect(feedbackBox).not.toBeNull();
    expect(feedbackBox!.height).toBe(initialBox!.height);
    expect(feedbackBox!.width).toBe(initialBox!.width);

    // Wait for feedback to disappear and check again
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });
    const finalBox = await gameCard.boundingBox();
    expect(finalBox).not.toBeNull();
    expect(finalBox!.height).toBe(initialBox!.height);
  });

  test("should disable input during feedback to prevent double submission", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Answer a question
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\d+) × (\d+)/);
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

    await gameScreen.typeAnswer(correctAnswer.toString());
    await gameScreen.submitAnswer();

    // During feedback, input should be disabled
    const correctFeedback = page.locator('text="✅ Correct!"');
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });

    // Try to type in the input - it should be disabled
    const inputField = page.locator(".answer-input");
    await expect(inputField).toBeDisabled();

    // Submit button should also be disabled
    const submitButton = page.getByRole("button", { name: "Submit Answer" });
    await expect(submitButton).toBeDisabled();

    // After feedback disappears, input should be enabled again
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });
    await expect(inputField).toBeEnabled();
  });

  test("should auto-focus input after feedback ends", async ({ page }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("easy");
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();

    // Answer first question
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\d+) × (\d+)/);
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

    await gameScreen.typeAnswer(correctAnswer.toString());
    await gameScreen.submitAnswer();

    // Wait for feedback to complete
    const correctFeedback = page.locator('text="✅ Correct!"');
    await expect(correctFeedback).toBeVisible({ timeout: 1000 });
    await expect(correctFeedback).not.toBeVisible({ timeout: 2000 });

    // Input should be auto-focused after feedback
    const inputField = page.locator(".answer-input");
    const isFocused = await inputField.evaluate(
      (el) => document.activeElement === el
    );
    expect(isFocused).toBe(true);
  });

  test("should show time-up feedback with correct answer when timer expires", async ({
    page,
  }) => {
    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);

    await startScreen.goto();
    await startScreen.selectDifficulty("expert"); // 10 second limit
    await startScreen.startGame();

    await expect(gameScreen.problemDisplay).toBeVisible();
    const problem = await gameScreen.getProblemText();
    const match = problem?.match(/(\d+) × (\d+)/);
    const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

    // Wait for timer to expire (up to 15 seconds)
    let timeoutOccurred = false;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      const timeUpMessage = page.locator('text="⏰ Time\'s up!"');
      if (await timeUpMessage.isVisible()) {
        timeoutOccurred = true;
        break;
      }
    }

    expect(timeoutOccurred).toBe(true);

    // Check that correct answer is shown
    const correctAnswerDisplay = page.locator(
      `text="Correct answer: ${correctAnswer}"`
    );
    await expect(correctAnswerDisplay).toBeVisible();

    // Time-up feedback should last longer than regular feedback (2 seconds)
    await page.waitForTimeout(1000);
    await expect(correctAnswerDisplay).toBeVisible(); // Should still be visible after 1 second
  });

  test("should maintain feedback functionality across different difficulty levels", async ({
    page,
  }) => {
    const difficulties = ["easy", "medium", "hard"] as const;

    for (const difficulty of difficulties) {
      const startScreen = new StartScreenPage(page);
      const gameScreen = new GameScreenPage(page);

      await startScreen.goto();
      await startScreen.selectDifficulty(difficulty);
      await startScreen.startGame();

      await expect(gameScreen.problemDisplay).toBeVisible();

      // Test correct answer feedback
      const problem = await gameScreen.getProblemText();
      const match = problem?.match(/(\d+) × (\d+)/);
      const correctAnswer = parseInt(match![1]) * parseInt(match![2]);

      await gameScreen.typeAnswer(correctAnswer.toString());
      await gameScreen.submitAnswer();

      const correctFeedback = page.locator('text="✅ Correct!"');
      await expect(correctFeedback).toBeVisible({ timeout: 1000 });

      // Clean up for next iteration
      await page.goto("/");
    }
  });
});

// Helper function to parse time strings like "0:05" to seconds
function parseTimeString(timeString: string): number {
  const parts = timeString.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(timeString);
}
