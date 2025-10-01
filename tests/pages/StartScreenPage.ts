import { Page, Locator } from "@playwright/test";

export class StartScreenPage {
  readonly page: Page;
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly difficultyEasy: Locator;
  readonly difficultyMedium: Locator;
  readonly difficultyHard: Locator;
  readonly difficultyExpert: Locator;
  readonly gameModeInput: Locator;
  readonly gameModeMultipleChoice: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText("🧮 Multiplication Trainer");
    this.subtitle = page.getByText(
      "Test your multiplication skills and improve your speed!"
    );

    // Difficulty level selectors
    this.difficultyEasy = page.locator(
      'input[name="difficulty"][value="easy"]'
    );
    this.difficultyMedium = page.locator(
      'input[name="difficulty"][value="medium"]'
    );
    this.difficultyHard = page.locator(
      'input[name="difficulty"][value="hard"]'
    );
    this.difficultyExpert = page.locator(
      'input[name="difficulty"][value="expert"]'
    );

    // Game mode selectors
    this.gameModeInput = page.locator('input[name="gameMode"][value="input"]');
    this.gameModeMultipleChoice = page.locator(
      'input[name="gameMode"][value="multiple-choice"]'
    );

    this.startButton = page.getByRole("button", { name: "🚀 Start Training" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async selectDifficulty(difficulty: "easy" | "medium" | "hard" | "expert") {
    switch (difficulty) {
      case "easy":
        await this.difficultyEasy.click();
        break;
      case "medium":
        await this.difficultyMedium.click();
        break;
      case "hard":
        await this.difficultyHard.click();
        break;
      case "expert":
        await this.difficultyExpert.click();
        break;
    }
  }

  async selectGameMode(mode: "input" | "multiple-choice") {
    if (mode === "input") {
      await this.gameModeInput.click();
    } else {
      await this.gameModeMultipleChoice.click();
    }
  }

  async startGame() {
    await this.startButton.click();
  }

  async isVisible() {
    return await this.title.isVisible();
  }

  async getDifficultyDescription(difficulty: string) {
    const difficultyLabel = this.page.locator(
      `label:has(input[value="${difficulty}"])`
    );
    return await difficultyLabel.textContent();
  }

  async getGameModeDescription(mode: string) {
    const modeLabel = this.page.locator(`label:has(input[value="${mode}"])`);
    return await modeLabel.textContent();
  }
}
