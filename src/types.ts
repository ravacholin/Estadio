export type L1 = 'en' | 'pt-br' | 'pt-pt' | 'fr' | 'it' | 'de' | 'other';

export interface SRSItem {
  exerciseId: string;
  phase: number;
  repetition: number;
  interval: number;
  easinessFactor: number;
  nextReviewDate: string; // ISO string
  errorHistory: string[]; // ISO strings of dates when it was answered incorrectly
}

export interface UserProfile {
  l1: L1 | null;
  rioplatense: boolean;
  onboardingCompleted: boolean;
  assignedPhase: number;
  stats?: {
    totalSessions: number;
    totalExercises: number;
    correctExercises: number;
  };
  srs?: Record<string, SRSItem>;
}

export type ExerciseType = 'discrimination' | 'classification' | 'minimal_pairs' | 'fill_in_blanks';

export interface BaseExercise {
  id: string;
  phase: number;
  type: ExerciseType;
  explanation: string;
  rioplatenseOnly?: boolean;
}

export interface DiscriminationExercise extends BaseExercise {
  type: 'discrimination';
  context?: string;
  sentence: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface ClassificationExercise extends BaseExercise {
  type: 'classification';
  sentences: { id: string; text: string; category: 'propiedad' | 'estado' }[];
}

export interface MinimalPairsExercise extends BaseExercise {
  type: 'minimal_pairs';
  context: string;
  blankBefore: string;
  blankAfter: string;
  options: string[];
  correctOption: string;
}

export interface FillInBlanksExercise extends BaseExercise {
  type: 'fill_in_blanks';
  textParts: string[]; // Text split by blanks
  blanks: {
    id: string;
    options: string[];
    correctOption: string;
  }[];
}

export type Exercise = DiscriminationExercise | ClassificationExercise | MinimalPairsExercise | FillInBlanksExercise;

export interface DiagnosticItem {
  id: string;
  block: 'A' | 'B' | 'C';
  context: string;
  blankBefore: string;
  blankAfter: string;
  options: string[];
  correctOption: string;
}
