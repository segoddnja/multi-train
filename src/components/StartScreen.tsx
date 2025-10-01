import React from "react";

interface StartScreenProps {
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
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
            Answer as quickly and accurately as possible
          </div>
          <div className="flex items-center text-gray-700">
            <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
              3
            </span>
            Get scored on accuracy and speed
          </div>
        </div>

        <button
          onClick={() => {
            onStartGame();
          }}
          className="btn-primary w-full text-xl"
        >
          🚀 Start Training
        </button>

        <div className="mt-4 text-sm text-gray-500">
          Press Enter to submit answers • Be quick and accurate for higher
          scores!
        </div>
      </div>
    </div>
  );
};
