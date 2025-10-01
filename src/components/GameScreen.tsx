import React, { useEffect, useRef } from "react";
import type { Problem, GameMode } from "../types/game";

interface GameScreenProps {
  problem: Problem;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  onSubmitMultipleChoice: (answer: number) => void;
  progress: { current: number; total: number; percentage: number };
  timeElapsed: number;
  correctAnswers: number;
  problemTimeLeft: number;
  showCorrectAnswer: boolean;
  gameMode: GameMode;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  problem,
  currentAnswer,
  onAnswerChange,
  onSubmitAnswer,
  onSubmitMultipleChoice,
  progress,
  timeElapsed,
  correctAnswers,
  problemTimeLeft,
  showCorrectAnswer,
  gameMode,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when a new problem loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmitAnswer();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      onAnswerChange(value);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = (): string => {
    if (problemTimeLeft <= 3) return "bg-red-500";
    if (problemTimeLeft <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const timePercentage = (problemTimeLeft / 10) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="card max-w-lg w-full">
        {/* Header with progress and stats */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Problem {progress.current + 1} of {progress.total}
            </div>
            <div className="text-sm text-gray-600">
              ⏱️ {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Problem progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>

          {/* Timer progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Time left:
              </span>
              <span
                className={`text-sm font-bold ${
                  problemTimeLeft <= 3
                    ? "text-red-600"
                    : problemTimeLeft <= 6
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {problemTimeLeft}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-100 ease-linear ${getTimerColor()}`}
                style={{ width: `${timePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>✅ Correct: {correctAnswers}</span>
            <span>❌ Wrong: {progress.current - correctAnswers}</span>
          </div>
        </div>

        {/* Problem display */}
        <div className="text-center mb-8">
          <div className="problem-display">
            {problem.factor1} × {problem.factor2} = ?
          </div>

          {showCorrectAnswer ? (
            <div className="mb-6">
              <div className="text-2xl text-red-600 font-bold mb-2">
                ⏰ Time's up!
              </div>
              <div className="text-xl text-green-600 font-semibold">
                Correct answer: {problem.answer}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Moving to next problem...
              </div>
            </div>
          ) : gameMode === "input" ? (
            <>
              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentAnswer}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="?"
                  className="answer-input w-32"
                  autoComplete="off"
                  disabled={showCorrectAnswer}
                />
              </div>

              <button
                onClick={onSubmitAnswer}
                disabled={currentAnswer.trim() === "" || showCorrectAnswer}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </>
          ) : (
            // Multiple choice mode
            <div className="mb-6">
              <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                {problem.choices?.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => onSubmitMultipleChoice(choice)}
                    disabled={showCorrectAnswer}
                    className="btn-secondary text-lg py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 hover:border-blue-400 transition-colors"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="text-center text-sm text-gray-500">
          {gameMode === "input" ? (
            <>💡 Tip: Press Enter to quickly submit your answer</>
          ) : (
            <>💡 Tip: Click the correct answer as quickly as possible</>
          )}
        </div>
      </div>
    </div>
  );
};
