import { useCallback, useEffect, useState } from "react";
import type {
  GameScore,
  GameSession,
  GameSettings,
  GameState,
  Problem,
} from "../types/game";
import { GameLogic } from "../utils/gameLogic";
import { loadGameSettings, saveGameSettings } from "../utils/settingsStorage";

const DEFAULT_SETTINGS: GameSettings = {
  numberOfProblems: 10,
  minFactor: 2,
  maxFactor: 10,
  mode: "input",
  difficulty: "easy",
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [problemTimeLeft, setProblemTimeLeft] = useState<number>(10);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);

  // Load saved settings or use defaults
  const [savedSettings, setSavedSettings] = useState(() => loadGameSettings());

  // Feedback & timing pause state
  const [isFeedbackActive, setIsFeedbackActive] = useState<boolean>(false);
  const [wasLastAnswerCorrect, setWasLastAnswerCorrect] = useState<
    boolean | null
  >(null);
  const [feedbackCorrectAnswer, setFeedbackCorrectAnswer] = useState<
    number | null
  >(null);
  const [totalPausedMs, setTotalPausedMs] = useState<number>(0);
  const [pauseStartAt, setPauseStartAt] = useState<number | null>(null);

  // Feedback duration - long enough for tests but not too distracting for users
  const FEEDBACK_DURATION_MS = 500;

  const beginPause = useCallback(() => {
    if (pauseStartAt === null) {
      setPauseStartAt(Date.now());
    }
  }, [pauseStartAt]);

  const endPause = useCallback(() => {
    setPauseStartAt((start) => {
      if (start == null) return null;
      const delta = Date.now() - start;
      setTotalPausedMs((prev) => prev + delta);
      return null;
    });
  }, []);

  const handleTimeExpired = useCallback(() => {
    if (!gameSession) return;
    const currentProblem =
      gameSession.problems[gameSession.currentProblemIndex];
    setShowCorrectAnswer(true);
    beginPause();

    setTimeout(() => {
      const updatedSession: GameSession = {
        ...gameSession,
        userAnswers: {
          ...gameSession.userAnswers,
          [currentProblem.id]: -1,
        },
        currentProblemIndex: gameSession.currentProblemIndex + 1,
        currentProblemStartTime: Date.now(),
      };

      if (
        updatedSession.currentProblemIndex >= updatedSession.problems.length
      ) {
        updatedSession.endTime = Date.now();
        const ongoingPauseMs = pauseStartAt ? Date.now() - pauseStartAt : 0;
        const effectiveTotalMs =
          updatedSession.endTime -
          updatedSession.startTime -
          totalPausedMs -
          ongoingPauseMs;
        const finalTimeElapsed = Math.floor(effectiveTotalMs / 1000);

        const score = GameLogic.calculateScore(
          updatedSession.correctAnswers,
          updatedSession.totalProblems,
          finalTimeElapsed
        );

        setGameScore(score);
        setGameState("finished");
      } else {
        setGameSession(updatedSession);
      }

      setCurrentAnswer("");
      setShowCorrectAnswer(false);
      endPause();
      setProblemTimeLeft(gameSession.timePerProblem);
    }, 2000);
  }, [gameSession, beginPause, endPause, pauseStartAt, totalPausedMs]);

  // Timer effects
  useEffect(() => {
    let interval: number | undefined;
    if (gameState === "playing" && gameSession) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const pausedOngoingMs = pauseStartAt ? now - pauseStartAt : 0;
        const effectiveElapsedMs =
          now - gameSession.startTime - totalPausedMs - pausedOngoingMs;
        const totalElapsedSeconds = Math.floor(effectiveElapsedMs / 1000);
        setTimeElapsed(Math.max(0, totalElapsedSeconds));

        if (gameSession.timePerProblem > 0) {
          if (isFeedbackActive || showCorrectAnswer) return;
          const problemElapsed = Math.floor(
            (now - gameSession.currentProblemStartTime) / 1000
          );
          const timeLeft = gameSession.timePerProblem - problemElapsed;
          setProblemTimeLeft(Math.max(0, timeLeft));
          if (timeLeft <= 0 && !showCorrectAnswer) {
            handleTimeExpired();
          }
        } else {
          setProblemTimeLeft(0);
        }
      }, 100);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [
    gameState,
    gameSession,
    showCorrectAnswer,
    isFeedbackActive,
    totalPausedMs,
    pauseStartAt,
    handleTimeExpired,
  ]);

  const startGame = useCallback(
    (
      settings: GameSettings = {
        ...DEFAULT_SETTINGS,
        ...savedSettings,
      }
    ) => {
      // Save the selected mode and difficulty to localStorage
      saveGameSettings({
        mode: settings.mode,
        difficulty: settings.difficulty,
      });

      // Update our local saved settings state
      setSavedSettings({
        mode: settings.mode,
        difficulty: settings.difficulty,
      });

      const problems = GameLogic.generateProblems(settings);
      const timePerProblem = GameLogic.getTimePerProblem(settings.difficulty);

      const newSession: GameSession = {
        problems,
        currentProblemIndex: 0,
        startTime: Date.now(),
        currentProblemStartTime: Date.now(),
        timePerProblem,
        userAnswers: {},
        correctAnswers: 0,
        totalProblems: problems.length,
        mode: settings.mode,
        difficulty: settings.difficulty,
      };

      setCurrentAnswer("");
      setTimeElapsed(0);
      setGameScore(null);
      setGameSession(newSession);
      setGameState("playing");
      setProblemTimeLeft(timePerProblem);
    },
    [savedSettings, setSavedSettings]
  );

  const submitAnswer = useCallback(() => {
    if (
      !gameSession ||
      currentAnswer.trim() === "" ||
      showCorrectAnswer ||
      isFeedbackActive
    )
      return;

    const currentProblem =
      gameSession.problems[gameSession.currentProblemIndex];
    const userAnswer = parseInt(currentAnswer);
    const isCorrect = GameLogic.isAnswerCorrect(currentProblem, userAnswer);

    setWasLastAnswerCorrect(isCorrect);
    setFeedbackCorrectAnswer(currentProblem.answer);
    setIsFeedbackActive(true);
    beginPause();

    const advancedSession: GameSession = {
      ...gameSession,
      userAnswers: {
        ...gameSession.userAnswers,
        [currentProblem.id]: userAnswer,
      },
      correctAnswers: gameSession.correctAnswers + (isCorrect ? 1 : 0),
      currentProblemIndex: gameSession.currentProblemIndex + 1,
      currentProblemStartTime: Date.now(),
    };

    const finished =
      advancedSession.currentProblemIndex >= advancedSession.problems.length;
    if (finished) {
      advancedSession.endTime = Date.now();
      const ongoingPauseMs = pauseStartAt ? Date.now() - pauseStartAt : 0;
      const effectiveTotalMs =
        advancedSession.endTime -
        advancedSession.startTime -
        totalPausedMs -
        ongoingPauseMs;
      const finalTimeElapsed = Math.floor(effectiveTotalMs / 1000);

      const score = GameLogic.calculateScore(
        advancedSession.correctAnswers,
        advancedSession.totalProblems,
        finalTimeElapsed
      );

      setGameScore(score);
      setGameState("finished");
    } else {
      setGameSession(advancedSession);
    }

    setCurrentAnswer("");
    setProblemTimeLeft(gameSession.timePerProblem);

    setTimeout(() => {
      setIsFeedbackActive(false);
      setWasLastAnswerCorrect(null);
      setFeedbackCorrectAnswer(null);
      endPause();
    }, FEEDBACK_DURATION_MS);
  }, [
    gameSession,
    currentAnswer,
    showCorrectAnswer,
    isFeedbackActive,
    beginPause,
    endPause,
    pauseStartAt,
    totalPausedMs,
    FEEDBACK_DURATION_MS,
  ]);

  const submitMultipleChoiceAnswer = useCallback(
    (selectedAnswer: number) => {
      if (!gameSession || showCorrectAnswer || isFeedbackActive) return;

      const currentProblem =
        gameSession.problems[gameSession.currentProblemIndex];
      const isCorrect = GameLogic.isAnswerCorrect(
        currentProblem,
        selectedAnswer
      );

      setWasLastAnswerCorrect(isCorrect);
      setFeedbackCorrectAnswer(currentProblem.answer);
      setIsFeedbackActive(true);
      beginPause();

      const advancedSession: GameSession = {
        ...gameSession,
        userAnswers: {
          ...gameSession.userAnswers,
          [currentProblem.id]: selectedAnswer,
        },
        correctAnswers: gameSession.correctAnswers + (isCorrect ? 1 : 0),
        currentProblemIndex: gameSession.currentProblemIndex + 1,
        currentProblemStartTime: Date.now(),
      };

      const finished =
        advancedSession.currentProblemIndex >= advancedSession.problems.length;
      if (finished) {
        advancedSession.endTime = Date.now();
        const ongoingPauseMs = pauseStartAt ? Date.now() - pauseStartAt : 0;
        const effectiveTotalMs =
          advancedSession.endTime -
          advancedSession.startTime -
          totalPausedMs -
          ongoingPauseMs;
        const finalTimeElapsed = Math.floor(effectiveTotalMs / 1000);

        const score = GameLogic.calculateScore(
          advancedSession.correctAnswers,
          advancedSession.totalProblems,
          finalTimeElapsed
        );

        setGameScore(score);
        setGameState("finished");
      } else {
        setGameSession(advancedSession);
      }

      setProblemTimeLeft(gameSession.timePerProblem);

      setTimeout(() => {
        setIsFeedbackActive(false);
        setWasLastAnswerCorrect(null);
        setFeedbackCorrectAnswer(null);
        endPause();
      }, FEEDBACK_DURATION_MS);
    },
    [
      gameSession,
      showCorrectAnswer,
      isFeedbackActive,
      beginPause,
      endPause,
      pauseStartAt,
      totalPausedMs,
      FEEDBACK_DURATION_MS,
    ]
  );

  const resetGame = useCallback(() => {
    setGameState("start");
    setGameSession(null);
    setCurrentAnswer("");
    setGameScore(null);
    setTimeElapsed(0);
    setProblemTimeLeft(0);
    setShowCorrectAnswer(false);
    setIsFeedbackActive(false);
    setWasLastAnswerCorrect(null);
    setFeedbackCorrectAnswer(null);
    setTotalPausedMs(0);
    setPauseStartAt(null);
  }, []);

  const getCurrentProblem = useCallback((): Problem | null => {
    if (
      !gameSession ||
      gameSession.currentProblemIndex >= gameSession.problems.length
    ) {
      return null;
    }
    return gameSession.problems[gameSession.currentProblemIndex];
  }, [gameSession]);

  const getProgress = useCallback((): {
    current: number;
    total: number;
    percentage: number;
  } => {
    if (!gameSession) return { current: 0, total: 0, percentage: 0 };
    const current = gameSession.currentProblemIndex;
    const total = gameSession.problems.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return { current, total, percentage };
  }, [gameSession]);

  const getDefaultSettings = useCallback((): GameSettings => {
    return {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
    };
  }, [savedSettings]);

  return {
    gameState,
    gameSession,
    currentAnswer,
    gameScore,
    timeElapsed,
    problemTimeLeft,
    showCorrectAnswer,
    isFeedbackActive,
    wasLastAnswerCorrect,
    feedbackCorrectAnswer,
    savedSettings,
    getDefaultSettings,
    startGame,
    submitAnswer,
    submitMultipleChoiceAnswer,
    resetGame,
    getCurrentProblem,
    getProgress,
    setCurrentAnswer,
  };
};
