import React, { useState } from "react";
import type { DifficultyLevel, GameMode, GameSettings } from "../types/game";
import { GameLogic } from "../utils/gameLogic";

interface StartScreenProps {
  // eslint-disable-next-line no-unused-vars
  onStartGame: (settings?: GameSettings) => void;
  savedSettings: Pick<GameSettings, "mode" | "difficulty">;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  savedSettings,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(
    savedSettings.mode
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    savedSettings.difficulty
  );

  const handleStartGame = () => {
    const settings: GameSettings = {
      numberOfProblems: 10,
      minFactor: 2,
      maxFactor: 10,
      mode: selectedMode,
      difficulty: selectedDifficulty,
    };
    onStartGame(settings);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="card max-w-4xl w-full text-center">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            🧮 Multiplication Trainer
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Test your multiplication skills and improve your speed!
          </p>
        </div>

        <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-left">
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 mr-2 sm:mr-3 flex-shrink-0">
              1
            </span>
            Solve 10 multiplication problems (2-10 tables)
          </div>
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 mr-2 sm:mr-3 flex-shrink-0">
              2
            </span>
            Choose your difficulty level and game mode
          </div>
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 mr-2 sm:mr-3 flex-shrink-0">
              3
            </span>
            Answer as quickly and accurately as possible
          </div>
          <div className="flex items-center text-gray-700 text-sm sm:text-base">
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-600 mr-2 sm:mr-3 flex-shrink-0">
              4
            </span>
            Get scored on accuracy and speed
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
            Choose Difficulty Level:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {(["easy", "medium", "hard", "expert"] as DifficultyLevel[]).map(
              (difficulty) => {
                const info = GameLogic.getDifficultyInfo(difficulty);
                return (
                  <label
                    key={difficulty}
                    className={`flex items-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedDifficulty === difficulty
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty}
                      checked={selectedDifficulty === difficulty}
                      onChange={(e) =>
                        setSelectedDifficulty(e.target.value as DifficultyLevel)
                      }
                      className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 flex-shrink-0"
                    />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                        {info.icon} {info.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                        {info.description}
                      </div>
                    </div>
                  </label>
                );
              }
            )}
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
            Choose Game Mode:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <label
              className={`flex items-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMode === "input"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="gameMode"
                value="input"
                checked={selectedMode === "input"}
                onChange={(e) => setSelectedMode(e.target.value as GameMode)}
                className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 flex-shrink-0"
              />
              <div className="text-left min-w-0 flex-1">
                <div className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                  ✏️ Type Answer
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Type the correct answer using the keyboard
                </div>
              </div>
            </label>

            <label
              className={`flex items-center p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMode === "multiple-choice"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="gameMode"
                value="multiple-choice"
                checked={selectedMode === "multiple-choice"}
                onChange={(e) => setSelectedMode(e.target.value as GameMode)}
                className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 flex-shrink-0"
              />
              <div className="text-left min-w-0 flex-1">
                <div className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                  🎯 Multiple Choice
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  Click the correct answer from 3 options
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleStartGame}
            className="btn-primary text-lg sm:text-xl px-6 sm:px-12 py-3 sm:py-4 mb-3 sm:mb-4"
          >
            🚀 Start Training
          </button>

          <div className="text-xs sm:text-sm text-gray-500 max-w-sm text-center px-2">
            {selectedMode === "input" ? (
              <>
                Press Enter to submit answers •{" "}
                {selectedDifficulty === "easy"
                  ? "Take your time!"
                  : "Be quick and accurate for higher scores!"}
              </>
            ) : (
              <>
                Click the correct answer •{" "}
                {selectedDifficulty === "easy"
                  ? "Take your time!"
                  : "Be quick and accurate for higher scores!"}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
