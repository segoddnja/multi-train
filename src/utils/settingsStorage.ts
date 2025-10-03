import type { DifficultyLevel, GameMode, GameSettings } from "../types/game";

const STORAGE_KEY = "multiplication-trainer-settings";

// Default settings that match the current application defaults
const DEFAULT_SETTINGS: Pick<GameSettings, "mode" | "difficulty"> = {
  mode: "input",
  difficulty: "easy",
};

/**
 * Save game settings to localStorage
 */
export const saveGameSettings = (
  settings: Pick<GameSettings, "mode" | "difficulty">
): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // Console statement needed for debugging localStorage issues
    // eslint-disable-next-line no-console
    console.warn("Failed to save game settings to localStorage:", error);
  }
};

/**
 * Load game settings from localStorage
 * Returns default settings if none exist or if loading fails
 */
export const loadGameSettings = (): Pick<
  GameSettings,
  "mode" | "difficulty"
> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored);

    // Validate the loaded data to ensure it has the expected structure
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      isValidGameMode(parsed.mode) &&
      isValidDifficultyLevel(parsed.difficulty)
    ) {
      return {
        mode: parsed.mode,
        difficulty: parsed.difficulty,
      };
    }

    // If validation fails, return defaults
    return DEFAULT_SETTINGS;
  } catch (error) {
    // Console statement needed for debugging localStorage issues
    // eslint-disable-next-line no-console
    console.warn("Failed to load game settings from localStorage:", error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Clear stored game settings
 */
export const clearGameSettings = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Console statement needed for debugging localStorage issues
    // eslint-disable-next-line no-console
    console.warn("Failed to clear game settings from localStorage:", error);
  }
};

/**
 * Type guard to validate GameMode
 */
function isValidGameMode(value: unknown): value is GameMode {
  return value === "input" || value === "multiple-choice";
}

/**
 * Type guard to validate DifficultyLevel
 */
function isValidDifficultyLevel(value: unknown): value is DifficultyLevel {
  return (
    value === "easy" ||
    value === "medium" ||
    value === "hard" ||
    value === "expert"
  );
}
