export interface Problem {
  id: number;
  factor1: number;
  factor2: number;
  answer: number;
}

export interface GameSession {
  problems: Problem[];
  currentProblemIndex: number;
  startTime: number;
  endTime?: number;
  userAnswers: { [problemId: number]: number };
  correctAnswers: number;
  totalProblems: number;
  currentProblemStartTime: number;
  timePerProblem: number; // seconds allowed per problem
}

export interface GameScore {
  correctAnswers: number;
  totalProblems: number;
  accuracy: number; // percentage
  timeElapsed: number; // in seconds
  score: number; // calculated score
  rank: string; // performance rank
}

export type GameState = "start" | "playing" | "finished";

export interface GameSettings {
  numberOfProblems: number;
  minFactor: number;
  maxFactor: number;
}
