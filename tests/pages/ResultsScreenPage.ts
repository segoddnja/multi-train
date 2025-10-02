import { Locator, Page } from "@playwright/test";

export class ResultsScreenPage {
  readonly page: Page;
  readonly title: Locator;
  readonly rank: Locator;
  readonly motivationalMessage: Locator;
  readonly finalScore: Locator;
  readonly accuracy: Locator;
  readonly timeElapsed: Locator;
  readonly correctAnswers: Locator;
  readonly wrongAnswers: Locator;
  readonly playAgainButton: Locator;
  readonly improvementTips: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("🎉 Training Complete!");
    this.rank = page.locator("p.text-xl.text-gray-600.mb-4"); // The rank paragraph
    this.motivationalMessage = page.locator("p.italic");
    this.finalScore = page.locator(".text-5xl");
    this.accuracy = page.locator(".stat-card").first();
    this.timeElapsed = page.locator(".stat-card").nth(1);
    this.correctAnswers = page.locator(".stat-card").nth(2);
    this.wrongAnswers = page.locator(".stat-card").nth(3);
    this.playAgainButton = page.getByRole("button", { name: "🔄 Play Again" });
    this.improvementTips = page.locator(".bg-yellow-50");
  }

  async isVisible() {
    try {
      return await this.title.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async getFinalScore() {
    const text = await this.finalScore.textContent();
    return text ? parseInt(text.trim()) : 0;
  }

  async getRank() {
    return await this.rank.textContent();
  }

  async getMotivationalMessage() {
    return await this.motivationalMessage.textContent();
  }

  async getAccuracy() {
    const text = await this.accuracy.locator(".text-2xl").textContent();
    const match = text?.match(/([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTimeElapsed() {
    const text = await this.timeElapsed.locator(".text-2xl").textContent();
    return text?.trim() || "";
  }

  async getCorrectAnswers() {
    const text = await this.correctAnswers.locator(".text-2xl").textContent();
    return text ? parseInt(text.trim()) : 0;
  }

  async getWrongAnswers() {
    const text = await this.wrongAnswers.locator(".text-2xl").textContent();
    return text ? parseInt(text.trim()) : 0;
  }

  async getImprovementTips() {
    const tips = await this.improvementTips.locator("li").allTextContents();
    return tips.map((tip) => tip.replace("• ", "").trim());
  }

  async playAgain() {
    await this.playAgainButton.click();
  }

  async hasHighScore() {
    const score = await this.getFinalScore();
    return score >= 1000;
  }

  async hasGoodAccuracy() {
    const accuracy = await this.getAccuracy();
    return accuracy >= 90;
  }
}
