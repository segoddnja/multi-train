import React, { useState } from "react";
import type { GameMode, GameSettings, DifficultyLevel } from "../types/game";
import { GameLogic } from "../utils/gameLogic";

interface StartScreenProps {
  onStartGame: (settings?: GameSettings) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>("input");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("easy");

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="card max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧮 Multiplication Trainer
          </h1>
          <p className="text-gray-600 text-lg">
            Test your multiplication skills and improve your speed!
          </p>
        </div>

        <div className="mb-6 space-y-3 text-left">
          <div className="flex items-center text-gray-700">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
              1
            </span>
            Solve 10 multiplication problems (2-10 tables)
          </div>
          <div className="flex items-center text-gray-700">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
              2
            </span>
            Choose your difficulty level and game mode
          </div>
          <div className="flex items-center text-gray-700">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
              3
            </span>
            Answer as quickly and accurately as possible
          </div>
          <div className="flex items-center text-gray-700">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
              4
            </span>
            Get scored on accuracy and speed
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Choose Difficulty Level:
          </h2>
          <div className="space-y-3">
            {(["easy", "medium", "hard", "expert"] as DifficultyLevel[]).map(
              (difficulty) => {
                const info = GameLogic.getDifficultyInfo(difficulty);
                return (
                  <label
                    key={difficulty}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty}
                      checked={selectedDifficulty === difficulty}
                      onChange={(e) =>
                        setSelectedDifficulty(e.target.value as DifficultyLevel)
                      }
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {info.icon} {info.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {info.description}
                      </div>
                    </div>
                  </label>
                );
              }
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Choose Game Mode:
          </h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gameMode"
                value="input"
                checked={selectedMode === "input"}
                onChange={(e) => setSelectedMode(e.target.value as GameMode)}
                className="mr-3 w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-800">
                  ✏️ Type Answer Mode
                </div>
                <div className="text-sm text-gray-600">
                  Type the correct answer using the keyboard
                </div>
              </div>
            </label>

            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gameMode"
                value="multiple-choice"
                checked={selectedMode === "multiple-choice"}
                onChange={(e) => setSelectedMode(e.target.value as GameMode)}
                className="mr-3 w-4 h-4 text-blue-600"
              />
              <div>
                <div className="font-medium text-gray-800">
                  🎯 Multiple Choice Mode
                </div>
                <div className="text-sm text-gray-600">
                  Click the correct answer from 3 options
                </div>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="btn-primary w-full text-xl"
        >
          🚀 Start Training
        </button>

        <div className="mt-4 text-sm text-gray-500">
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
  );
};
