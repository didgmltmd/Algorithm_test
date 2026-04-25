export type Difficulty = "하" | "중" | "상";

export type Concept = {
  summary: string;
  steps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  pdfPoint: string;
  examPoint: string;
  commonMistakes: string[];
};

export type TestCase = {
  input: string;
  output: string;
};

export type Problem = {
  id: string;
  chapter: number;
  chapterTitle: string;
  title: string;
  difficulty: Difficulty;
  algorithm: string;
  pdfFile: string;
  pageNumber: number;
  description: string;
  inputDescription: string;
  outputDescription: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  solutionCode: string;
  hint: string;
  concept: Concept;
  testCases: TestCase[];
};

export type RunResult = {
  output: string;
  error?: string;
};

export type JudgeCaseResult = {
  index: number;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
};

export type JudgeResult = {
  passed: boolean;
  message: string;
  results: JudgeCaseResult[];
};
