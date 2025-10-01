import { Page } from "@playwright/test";
import { StartScreenPage } from "../pages/StartScreenPage.js";
import { GameScreenPage } from "../pages/GameScreenPage.js";
import { ResultsScreenPage } from "../pages/ResultsScreenPage.js";

export class TestUtils {
  static async playCompleteGame(
    page: Page,
    options: {
      difficulty?: "easy" | "medium" | "hard" | "expert";
      gameMode?: "input" | "multiple-choice";
      answerCorrectly?: boolean;
      answerSpeed?: "fast" | "slow" | "normal";
    } = {}
  ) {
    const {
      difficulty = "easy",
      gameMode = "input",
      answerCorrectly = true,
      answerSpeed = "normal",
    } = options;

    const startScreen = new StartScreenPage(page);
    const gameScreen = new GameScreenPage(page);
    const resultsScreen = new ResultsScreenPage(page);

    // Start the game
    await startScreen.goto();
    await startScreen.selectDifficulty(difficulty);
    await startScreen.selectGameMode(gameMode);
    await startScreen.startGame();

    // Play through all problems
    for (let i = 0; i < 10; i++) {
      await gameScreen.isVisible();

      if (gameMode === "input") {
        const problem = await gameScreen.getProblemText();
        if (!problem) continue;
        const answer = TestUtils.calculateAnswer(problem, answerCorrectly);

        if (answerSpeed === "slow") {
          await page.waitForTimeout(2000);
        } else if (answerSpeed === "fast") {
          await page.waitForTimeout(100);
        } else {
          await page.waitForTimeout(500);
        }

        await gameScreen.typeAnswer(answer.toString());
        await gameScreen.submitAnswer();
      } else {
        // Multiple choice mode
        const options = await gameScreen.getMultipleChoiceOptions();
        const problem = await gameScreen.getProblemText();
        if (!problem) continue;
        const correctAnswer = TestUtils.calculateAnswer(problem, true);

        if (answerSpeed === "slow") {
          await page.waitForTimeout(2000);
        } else if (answerSpeed === "fast") {
          await page.waitForTimeout(100);
        } else {
          await page.waitForTimeout(500);
        }

        if (answerCorrectly) {
          await gameScreen.clickMultipleChoiceAnswer(correctAnswer);
        } else {
          // Pick a wrong answer
          const wrongAnswer = options.find((opt) => opt !== correctAnswer);
          if (wrongAnswer) {
            await gameScreen.clickMultipleChoiceAnswer(wrongAnswer);
          }
        }
      }

      // Wait for next problem or results
      await page.waitForTimeout(1000);
    }

    // Wait for results screen
    await resultsScreen.isVisible();
    return resultsScreen;
  }

  static calculateAnswer(problemText: string, correct: boolean = true): number {
    const match = problemText.match(/(\d+) × (\d+)/);
    if (!match) return 0;

    const factor1 = parseInt(match[1]);
    const factor2 = parseInt(match[2]);
    const correctAnswer = factor1 * factor2;

    if (correct) {
      return correctAnswer;
    } else {
      // Return a wrong answer that's close but not correct
      const wrongAnswers = [
        correctAnswer + 1,
        correctAnswer - 1,
        correctAnswer + factor1,
        correctAnswer - factor1,
      ];
      return wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
    }
  }

  static async waitForProblemToChange(
    gameScreen: GameScreenPage,
    currentProblem: string
  ) {
    let attempts = 0;
    while (attempts < 50) {
      // 5 second timeout
      const newProblem = await gameScreen.getProblemText();
      if (newProblem !== currentProblem) {
        return newProblem;
      }
      await gameScreen.page.waitForTimeout(100);
      attempts++;
    }
    throw new Error("Problem did not change within timeout");
  }

  static async measureResponseTime(
    callback: () => Promise<void>
  ): Promise<number> {
    const startTime = Date.now();
    await callback();
    return Date.now() - startTime;
  }

  static parseTimeString(timeString: string): number {
    // Parse time strings like "1m 23s" or "45s" to seconds
    const minuteMatch = timeString.match(/(\d+)m/);
    const secondMatch = timeString.match(/(\d+)s/);

    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;

    return minutes * 60 + seconds;
  }

  static getDifficultyTimeLimit(difficulty: string): number {
    switch (difficulty) {
      case "easy":
        return 0; // Unlimited
      case "medium":
        return 20;
      case "hard":
        return 15;
      case "expert":
        return 10;
      default:
        return 0;
    }
  }
}
