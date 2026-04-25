import type { JudgeResult, Problem } from "../types/problem";
import { runCode } from "./codeRunner";

const normalize = (value: string): string =>
  value
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join("\n");

export const judgeProblem = async (problem: Problem, code: string): Promise<JudgeResult> => {
  // 클라이언트에 테스트케이스와 정답 코드가 포함되는 학습용 채점입니다.
  // 프론트엔드만으로는 백준 같은 보안 채점이나 숨겨진 테스트 보호를 보장할 수 없습니다.
  const results = [];

  for (let index = 0; index < problem.testCases.length; index += 1) {
    const testCase = problem.testCases[index];
    const runResult = await runCode(code, testCase.input);
    const expected = normalize(testCase.output);
    const actual = normalize(runResult.output);

    results.push({
      index: index + 1,
      passed: !runResult.error && actual === expected,
      expected,
      actual,
      error: runResult.error,
    });
  }

  const failed = results.filter((result) => !result.passed);
  return {
    passed: failed.length === 0,
    message: failed.length === 0 ? "정답입니다" : `실패한 테스트케이스: ${failed.map((item) => item.index).join(", ")}`,
    results,
  };
};
