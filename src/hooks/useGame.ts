import { useState, useCallback, useEffect } from 'react';
import type { GameState, GameSession, Problem, GameScore, GameSettings } from '../types/game';
import { GameLogic } from '../utils/gameLogic';

const DEFAULT_SETTINGS: GameSettings = {
  numberOfProblems: 10,
  minFactor: 2,
  maxFactor: 10
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: number;
    
    if (gameState === 'playing' && gameSession) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameSession.startTime) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, gameSession]);

  const startGame = useCallback((settings: GameSettings = DEFAULT_SETTINGS) => {
    // Generate problems directly here to avoid any import issues
    const problems: Problem[] = [];
    for (let i = 0; i < settings.numberOfProblems; i++) {
      const factor1 = Math.floor(Math.random() * (settings.maxFactor - settings.minFactor + 1)) + settings.minFactor;
      const factor2 = Math.floor(Math.random() * (settings.maxFactor - settings.minFactor + 1)) + settings.minFactor;
      const problem = {
        id: i,
        factor1,
        factor2,
        answer: factor1 * factor2
      };
      problems.push(problem);
    }
    
    const newSession: GameSession = {
      problems,
      currentProblemIndex: 0,
      startTime: Date.now(),
      userAnswers: {},
      correctAnswers: 0,
      totalProblems: problems.length
    };
    
    // Update state in the correct order
    setCurrentAnswer('');
    setTimeElapsed(0);
    setGameScore(null);
    setGameSession(newSession);
    setGameState('playing');
  }, []);

  const submitAnswer = useCallback(() => {
    if (!gameSession || currentAnswer.trim() === '') return;

    const currentProblem = gameSession.problems[gameSession.currentProblemIndex];
    const userAnswer = parseInt(currentAnswer);
    const isCorrect = GameLogic.isAnswerCorrect(currentProblem, userAnswer);

    const updatedSession: GameSession = {
      ...gameSession,
      userAnswers: {
        ...gameSession.userAnswers,
        [currentProblem.id]: userAnswer
      },
      correctAnswers: gameSession.correctAnswers + (isCorrect ? 1 : 0),
      currentProblemIndex: gameSession.currentProblemIndex + 1
    };

    // Check if game is finished
    if (updatedSession.currentProblemIndex >= updatedSession.problems.length) {
      updatedSession.endTime = Date.now();
      const finalTimeElapsed = Math.floor((updatedSession.endTime - updatedSession.startTime) / 1000);
      
      const score = GameLogic.calculateScore(
        updatedSession.correctAnswers,
        updatedSession.totalProblems,
        finalTimeElapsed
      );
      
      setGameScore(score);
      setGameState('finished');
    }

    setGameSession(updatedSession);
    setCurrentAnswer('');
  }, [gameSession, currentAnswer]);

  const resetGame = useCallback(() => {
    setGameState('start');
    setGameSession(null);
    setCurrentAnswer('');
    setGameScore(null);
    setTimeElapsed(0);
  }, []);

  const getCurrentProblem = useCallback((): Problem | null => {
    if (!gameSession || gameSession.currentProblemIndex >= gameSession.problems.length) {
      return null;
    }
    return gameSession.problems[gameSession.currentProblemIndex];
  }, [gameSession]);

  const getProgress = useCallback((): { current: number; total: number; percentage: number } => {
    if (!gameSession) return { current: 0, total: 0, percentage: 0 };
    
    const current = gameSession.currentProblemIndex;
    const total = gameSession.problems.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return { current, total, percentage };
  }, [gameSession]);

  return {
    gameState,
    gameSession,
    currentAnswer,
    gameScore,
    timeElapsed,
    startGame,
    submitAnswer,
    resetGame,
    getCurrentProblem,
    getProgress,
    setCurrentAnswer
  };
};