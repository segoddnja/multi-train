import { Page, Locator } from "@playwright/test";

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

  constructor(page: Page) {
    this.page = page;
    this.problemDisplay = page.locator(".problem-display");
    this.answerInput = page.locator(".answer-input");
    this.submitButton = page.getByRole("button", { name: "Submit Answer" });
    this.progressText = page.locator("text=/Problem \\d+ of \\d+/");
    this.progressBar = page.locator(".bg-gradient-to-r");
    this.timeElapsed = page.locator("text=/⏱️ \\d+:\\d+/");
    this.timeLeft = page.locator("text=/\\d+s/");
    this.timerBar = page.locator(".bg-gray-200 + div div");
    this.correctCount = page.locator("text=/✅ Correct: \\d+/");
    this.wrongCount = page.locator("text=/❌ Wrong: \\d+/");
    this.multipleChoiceButtons = page.locator(".btn-secondary");
    this.correctAnswerDisplay = page.locator("text=/Correct answer: \\d+/");
    this.timeUpMessage = page.locator("text=⏰ Time's up!");
  }

  async isVisible() {
    return await this.problemDisplay.isVisible();
  }

  async getProblemText() {
    return await this.problemDisplay.textContent();
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

  async clickMultipleChoiceAnswer(answer: number) {
    const buttons = await this.multipleChoiceButtons.all();
    for (const button of buttons) {
      const text = await button.textContent();
      if (text?.trim() === answer.toString()) {
        await button.click();
        break;
      }
    }
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
    const text = await this.progressText.textContent();
    const match = text?.match(/Problem (\d+) of (\d+)/);
    if (match) {
      return {
        current: parseInt(match[1]),
        total: parseInt(match[2]),
      };
    }
    return { current: 0, total: 0 };
  }

  async getTimeElapsed() {
    const text = await this.timeElapsed.textContent();
    const match = text?.match(/⏱️ (\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  }

  async getTimeLeft() {
    try {
      const text = await this.timeLeft.textContent();
      const match = text?.match(/(\d+)s/);
      return match ? parseInt(match[1]) : null;
    } catch {
      return null; // Unlimited time mode
    }
  }

  async getCorrectAnswerCount() {
    const text = await this.correctCount.textContent();
    const match = text?.match(/✅ Correct: (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getWrongAnswerCount() {
    const text = await this.wrongCount.textContent();
    const match = text?.match(/❌ Wrong: (\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async isUnlimitedTimeMode() {
    return await this.page
      .locator("text=🐌 Unlimited Time - Take your time to think!")
      .isVisible();
  }

  async isTimeUp() {
    return await this.timeUpMessage.isVisible();
  }

  async getCorrectAnswer() {
    const text = await this.correctAnswerDisplay.textContent();
    const match = text?.match(/Correct answer: (\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  async waitForNextProblem() {
    // Wait for the problem display to change
    await this.page.waitForTimeout(1000);
  }
}
