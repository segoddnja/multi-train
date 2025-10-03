import React, { useEffect, useRef } from "react";
import type { DifficultyLevel, GameMode, Problem } from "../types/game";

interface GameScreenProps {
  problem: Problem;
  currentAnswer: string;
  // eslint-disable-next-line no-unused-vars
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmitMultipleChoice: (answer: number) => void;
  progress: { current: number; total: number; percentage: number };
  timeElapsed: number;
  correctAnswers: number;
  problemTimeLeft: number;
  showCorrectAnswer: boolean;
  isFeedbackActive: boolean;
  wasLastAnswerCorrect: boolean | null;
  feedbackCorrectAnswer: number | null;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  maxTimePerProblem: number;
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
  isFeedbackActive,
  wasLastAnswerCorrect,
  feedbackCorrectAnswer,
  gameMode,
  maxTimePerProblem,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when a new problem loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem.id]);

  // Also refocus when feedback ends and input becomes enabled again
  useEffect(() => {
    if (!isFeedbackActive && !showCorrectAnswer && gameMode === "input") {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isFeedbackActive, showCorrectAnswer, gameMode]);

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
    if (maxTimePerProblem === 0) return "bg-blue-500"; // Unlimited time
    const ratio = problemTimeLeft / maxTimePerProblem;
    if (ratio <= 0.3) return "bg-red-500";
    if (ratio <= 0.6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const timePercentage =
    maxTimePerProblem === 0 ? 100 : (problemTimeLeft / maxTimePerProblem) * 100;

  const isUnlimitedTime = maxTimePerProblem === 0;

  const renderFeedback = () => {
    // Time up flow keeps existing content for tests
    if (showCorrectAnswer) {
      return (
        <div className="feedback-pop animate-pulse">
          <div className="text-2xl text-red-600 font-bold mb-1">
            ⏰ Time's up!
          </div>
          <div className="text-lg text-green-600 font-semibold">
            Correct answer: {problem.answer}
          </div>
        </div>
      );
    }

    if (isFeedbackActive && wasLastAnswerCorrect !== null) {
      if (wasLastAnswerCorrect) {
        return (
          <div className="feedback-pop animate-pulse">
            <div className="text-2xl font-extrabold text-green-600">
              ✅ Correct!
            </div>
            <div className="text-sm text-gray-600">Nice work—keep it up!</div>
          </div>
        );
      }
      return (
        <div className="feedback-pop animate-pulse">
          <div className="text-2xl font-extrabold text-red-600">
            ❌ Not quite
          </div>
          <div className="text-lg text-green-600 font-semibold">
            Correct answer: {feedbackCorrectAnswer ?? problem.answer}
          </div>
        </div>
      );
    }

    return null;
  };

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
          {!isUnlimitedTime && (
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
          )}

          {isUnlimitedTime && (
            <div className="mb-4">
              <div className="text-center text-sm text-blue-600 font-medium bg-blue-50 py-2 px-4 rounded-lg">
                🐌 Unlimited Time - Take your time to think!
              </div>
            </div>
          )}

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

          {/* Feedback area with fixed height to avoid layout shift */}
          <div className="mb-6 min-h-[64px] flex items-center justify-center">
            {renderFeedback()}
          </div>

          {gameMode === "input" ? (
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
                  disabled={showCorrectAnswer || isFeedbackActive}
                />
              </div>

              <button
                onClick={onSubmitAnswer}
                disabled={
                  currentAnswer.trim() === "" ||
                  showCorrectAnswer ||
                  isFeedbackActive
                }
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
                    disabled={showCorrectAnswer || isFeedbackActive}
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
