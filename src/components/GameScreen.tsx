import React, { useEffect, useRef } from 'react';
import type { Problem } from '../types/game';

interface GameScreenProps {
  problem: Problem;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  progress: { current: number; total: number; percentage: number };
  timeElapsed: number;
  correctAnswers: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  problem,
  currentAnswer,
  onAnswerChange,
  onSubmitAnswer,
  progress,
  timeElapsed,
  correctAnswers
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when a new problem loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmitAnswer();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      onAnswerChange(value);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="progress-bar"
              style={{ width: `${progress.percentage}%` }}
            ></div>
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
            />
          </div>
          
          <button 
            onClick={onSubmitAnswer}
            disabled={currentAnswer.trim() === ''}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>

        {/* Hint */}
        <div className="text-center text-sm text-gray-500">
          💡 Tip: Press Enter to quickly submit your answer
        </div>
      </div>
    </div>
  );
};