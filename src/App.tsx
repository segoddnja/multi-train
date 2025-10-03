import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { StartScreen } from "./components/StartScreen";
import { useGame } from "./hooks/useGame";

function App() {
  const {
    gameState,
    currentAnswer,
    gameScore,
    timeElapsed,
    problemTimeLeft,
    showCorrectAnswer,
    isFeedbackActive,
    wasLastAnswerCorrect,
    feedbackCorrectAnswer,
    startGame,
    submitAnswer,
    submitMultipleChoiceAnswer,
    resetGame,
    getProgress,
    setCurrentAnswer,
    gameSession,
  } = useGame();

  const renderCurrentScreen = () => {
    if (gameState === "start") {
      return <StartScreen onStartGame={startGame} />;
    }

    if (gameState === "playing") {
      if (
        !gameSession ||
        !gameSession.problems ||
        gameSession.problems.length === 0
      ) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="card max-w-md w-full text-center">
              <div className="text-xl">Loading problem...</div>
            </div>
          </div>
        );
      }

      const currentProblemIndex = gameSession.currentProblemIndex;
      const problem = gameSession.problems[currentProblemIndex];

      if (!problem) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="card max-w-md w-full text-center">
              <div className="text-xl">Error loading problem...</div>
            </div>
          </div>
        );
      }

      return (
        <GameScreen
          problem={problem}
          currentAnswer={currentAnswer}
          onAnswerChange={setCurrentAnswer}
          onSubmitAnswer={submitAnswer}
          onSubmitMultipleChoice={submitMultipleChoiceAnswer}
          progress={getProgress()}
          timeElapsed={timeElapsed}
          correctAnswers={gameSession.correctAnswers}
          problemTimeLeft={problemTimeLeft}
          showCorrectAnswer={showCorrectAnswer}
          isFeedbackActive={isFeedbackActive}
          wasLastAnswerCorrect={wasLastAnswerCorrect}
          feedbackCorrectAnswer={feedbackCorrectAnswer}
          gameMode={gameSession.mode}
          difficulty={gameSession.difficulty}
          maxTimePerProblem={gameSession.timePerProblem}
        />
      );
    }

    if (gameState === "finished") {
      if (!gameScore) {
        return <StartScreen onStartGame={startGame} />;
      }

      return <ResultsScreen score={gameScore} onPlayAgain={resetGame} />;
    }

    // Default case
    return <StartScreen onStartGame={startGame} />;
  };

  return <div className="App">{renderCurrentScreen()}</div>;
}

export default App;
