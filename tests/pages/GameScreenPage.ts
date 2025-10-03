import { Locator, Page } from "@playwright/test";

export class GameScreenPage {
  readonly page: Page;
  readonly problemDisplay: Locator;
  readonly answerInput: Locator;
  readonly submitButton: Locator;
  readonly progressText: Locator;
  readonly progressBar: Locator;
  readonly timeElapsed: Locator;
  readonly timeLeft: Locator;
  readonly timerBar: Locator;
  readonly correctCount: Locator;
  readonly wrongCount: Locator;
  readonly multipleChoiceButtons: Locator;
  readonly correctAnswerDisplay: Locator;
  readonly timeUpMessage: Locator;
  readonly feedbackArea: Locator;
  readonly correctFeedback: Locator;
  readonly incorrectFeedback: Locator;
  readonly encouragementMessage: Locator;
  readonly feedbackElements: {
    correct: Locator;
    incorrect: Locator;
    timeout: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.problemDisplay = page.locator(".problem-display");
    this.answerInput = page.locator(".answer-input");
    this.submitButton = page.getByRole("button", { name: "Submit Answer" });
    this.progressText = page.locator(".text-sm.text-gray-600", {
      hasText: "Problem",
    });
    this.progressBar = page.locator(".bg-gradient-to-r");
    this.timeElapsed = page
      .locator(".text-sm.text-gray-600")
      .filter({ hasText: /⏱️ \d+:\d+/ })
      .first();
    this.timeLeft = page.locator("span").filter({ hasText: /\d+s/ });
    this.timerBar = page.locator(".bg-gray-200 + div div");
    this.correctCount = page
      .locator("span")
      .filter({ hasText: /✅ Correct: \d+/ });
    this.wrongCount = page.locator("span").filter({ hasText: /❌ Wrong: \d+/ });
    this.multipleChoiceButtons = page.locator(".btn-secondary");
    this.correctAnswerDisplay = page.locator("text=/Correct answer: \\d+/");
    this.timeUpMessage = page.locator("text=⏰ Time's up!");
    this.feedbackArea = page.locator(".feedback-pop");
    this.correctFeedback = page.locator("text=✅ Correct!");
    this.incorrectFeedback = page.locator("text=❌ Not quite");
    this.encouragementMessage = page.locator("text=Nice work—keep it up!");

    // More reliable feedback selectors using data-testid
    this.feedbackElements = {
      correct: page.locator('[data-testid="correct-feedback"]'),
      incorrect: page.locator('[data-testid="incorrect-feedback"]'),
      timeout: page.locator('[data-testid="timeout-feedback"]'),
    };
  }

  async isVisible() {
    return await this.problemDisplay.isVisible();
  }

  async getProblemText() {
    try {
      return await this.problemDisplay.textContent({ timeout: 5000 });
    } catch {
      return null;
    }
  }

  async typeAnswer(answer: string) {
    await this.answerInput.fill(answer);
  }

  async submitAnswer() {
    await this.submitButton.click();
  }

  async submitAnswerWithKeyboard() {
    await this.answerInput.press("Enter");
  }

  async clickMultipleChoice(answer: number) {
    await this.page
      .getByRole("button", { name: answer.toString(), exact: true })
      .click();
  }

  async clickMultipleChoiceAnswer(answer: number) {
    return this.clickMultipleChoice(answer);
  }

  async getProgressPercentage() {
    const element = await this.progressBar.first();
    return await element.getAttribute("style");
  }

  async getTimeElapsed() {
    const text = await this.timeElapsed.textContent();
    return text?.replace("⏱️ ", "") || "0:00";
  }

  async getTimeLeft() {
    try {
      const text = await this.timeLeft.textContent({ timeout: 2000 });
      return parseInt(text?.replace("s", "") || "0");
    } catch {
      // If no timer element is found, return null to indicate unlimited time
      return null;
    }
  }

  async getCorrectCount() {
    const text = await this.correctCount.textContent();
    const match = text?.match(/Correct: (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getCorrectAnswerCount() {
    return this.getCorrectCount();
  }

  async getWrongCount() {
    const text = await this.wrongCount.textContent();
    const match = text?.match(/Wrong: (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getMultipleChoiceOptions() {
    const buttons = await this.multipleChoiceButtons.all();
    const options = [];
    for (const button of buttons) {
      const text = await button.textContent();
      if (text) {
        options.push(parseInt(text.trim()));
      }
    }
    return options;
  }

  async getCurrentProgress() {
    await this.progressText.waitFor({ timeout: 5000 });
    const text = await this.progressText.textContent();
    const match = text?.match(/Problem (\d+) of (\d+)/);
    if (match) {
      return {
        current: parseInt(match[1]), // Keep 1-based as displayed
        total: parseInt(match[2]),
      };
    }
    return { current: 1, total: 10 };
  }

  async getCorrectAnswer() {
    try {
      const text = await this.correctAnswerDisplay.textContent({
        timeout: 2000,
      });
      const match = text?.match(/Correct answer: (\d+)/);
      return match ? parseInt(match[1]) : null;
    } catch {
      return null;
    }
  }

  async isTimeUp() {
    try {
      return await this.timeUpMessage.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  async waitForNextProblem() {
    // Wait for the problem display to update with new content
    await this.page.waitForTimeout(1000);
  }

  async isGameComplete() {
    // Check if we're no longer on the game screen
    const problemVisible = await this.problemDisplay.isVisible();
    return !problemVisible;
  }

  async hasMultipleChoiceMode() {
    return await this.multipleChoiceButtons.first().isVisible();
  }

  async hasInputMode() {
    return await this.answerInput.isVisible();
  }

  async isUnlimitedTimeMode() {
    // In unlimited time mode (easy difficulty), there should be no timer countdown
    try {
      const timeLeftVisible = await this.timeLeft.isVisible({ timeout: 1000 });
      return !timeLeftVisible;
    } catch {
      return true; // If we can't find the timer, assume unlimited time
    }
  }

  async isFeedbackActive() {
    // Check if any feedback element is currently visible using the reliable data-testid selectors
    const correctVisible = await this.feedbackElements.correct.isVisible();
    const incorrectVisible = await this.feedbackElements.incorrect.isVisible();
    const timeoutVisible = await this.feedbackElements.timeout.isVisible();

    return correctVisible || incorrectVisible || timeoutVisible;
  }

  async waitForFeedbackToDisappear(timeout = 3000) {
    // Wait for all feedback elements to disappear
    await this.feedbackElements.correct.waitFor({ state: "hidden", timeout });
    await this.feedbackElements.incorrect.waitFor({ state: "hidden", timeout });
    await this.feedbackElements.timeout.waitFor({ state: "hidden", timeout });
  }
}
