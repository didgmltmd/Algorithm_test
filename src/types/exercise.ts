export type ExerciseKind = "multiple-choice" | "multi-select" | "multi-part-choice" | "short-answer" | "fill-blank" | "essay";

export type ExerciseOption = {
  id: string;
  label: string;
};

export type ExerciseOptionGroup = {
  id: string;
  label: string;
  options: ExerciseOption[];
};

export type ExerciseProblem = {
  id: string;
  chapter: number;
  chapterTitle: string;
  title: string;
  kind: ExerciseKind;
  conceptSummary: string;
  prompt: string;
  image?: string;
  pdfFile: string;
  pageNumber: number;
  options?: ExerciseOption[];
  optionGroups?: ExerciseOptionGroup[];
  answers?: string[];
  answerText: string;
  hint: string;
  explanation: string;
};

export type ExerciseSubmission = {
  problemId: string;
  answer: string | string[];
  passed: boolean;
  reviewed?: boolean;
  submittedAt: string;
};

export type WrongNote = {
  problemId: string;
  answer: string | string[];
  updatedAt: string;
  resolved: boolean;
};
