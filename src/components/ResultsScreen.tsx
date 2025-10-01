import React from "react";
import type { GameScore } from "../types/game";
import { GameLogic } from "../utils/gameLogic";

interface ResultsScreenProps {
  score: GameScore;
  onPlayAgain: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  onPlayAgain,
}) => {
  const motivationalMessage = GameLogic.getMotivationalMessage(
    score.accuracy,
    score.timeElapsed
  );

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColor = (scoreValue: number): string => {
    if (scoreValue >= 1000) return "text-green-600";
    if (scoreValue >= 800) return "text-blue-600";
    if (scoreValue >= 600) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="card max-w-lg w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎉 Training Complete!
          </h1>
          <p className="text-xl text-gray-600 mb-4">{score.rank}</p>
          <p className="text-gray-600 italic">{motivationalMessage}</p>
        </div>

        {/* Score display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div
            className={`text-5xl font-bold mb-2 ${getScoreColor(score.score)}`}
          >
            {score.score}
          </div>
          <div className="text-gray-600 text-sm">Final Score</div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat-card">
            <div
              className={`text-2xl font-bold ${getAccuracyColor(
                score.accuracy
              )}`}
            >
              {score.accuracy.toFixed(1)}%
            </div>
            <div className="text-gray-600 text-sm">Accuracy</div>
          </div>

          <div className="stat-card">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(score.timeElapsed)}
            </div>
            <div className="text-gray-600 text-sm">Time</div>
          </div>

          <div className="stat-card">
            <div className="text-2xl font-bold text-green-600">
              {score.correctAnswers}
            </div>
            <div className="text-gray-600 text-sm">Correct</div>
          </div>

          <div className="stat-card">
            <div className="text-2xl font-bold text-red-600">
              {score.totalProblems - score.correctAnswers}
            </div>
            <div className="text-gray-600 text-sm">Wrong</div>
          </div>
        </div>

        {/* Performance tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">
            💡 Tips to improve:
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {score.accuracy < 90 && (
              <li>• Practice multiplication tables to improve accuracy</li>
            )}
            {score.timeElapsed > 60 && (
              <li>• Try to answer faster - speed comes with practice!</li>
            )}
            {score.accuracy >= 90 && score.timeElapsed <= 30 && (
              <li>• Excellent work! You're a multiplication master! 🏆</li>
            )}
            <li>• Regular practice helps build muscle memory</li>
          </ul>
        </div>

        <button onClick={onPlayAgain} className="btn-primary w-full text-xl">
          🔄 Play Again
        </button>
      </div>
    </div>
  );
};
