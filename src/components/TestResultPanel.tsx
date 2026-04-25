import type { JudgeResult, RunResult } from "../types/problem";

type TestResultPanelProps = {
  input: string;
  onInputChange: (value: string) => void;
  runResult?: RunResult;
  judgeResult?: JudgeResult;
};

export const TestResultPanel = ({ input, onInputChange, runResult, judgeResult }: TestResultPanelProps) => (
  <div className="grid gap-3 lg:grid-cols-2">
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">입력값</span>
      <textarea
        className="h-36 w-full resize-none rounded-lg border border-line bg-white p-3 font-mono text-sm outline-none focus:border-sky-400"
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
      />
    </label>
    <div>
      <p className="mb-2 text-sm font-bold text-ink">실행 결과</p>
      <pre className="h-36 overflow-auto rounded-lg bg-slate-950 p-3 text-sm text-slate-100 scrollbar-thin">
        {runResult?.error ? runResult.error : runResult?.output || "아직 실행 결과가 없습니다."}
      </pre>
    </div>
    {judgeResult ? (
      <div className="lg:col-span-2 rounded-lg border border-line bg-white p-4">
        <p className={`font-bold ${judgeResult.passed ? "text-emerald-600" : "text-rose-600"}`}>{judgeResult.message}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {judgeResult.results.map((result) => (
            <div key={result.index} className="rounded-lg bg-panel p-3 text-sm">
              <strong className={result.passed ? "text-emerald-600" : "text-rose-600"}>
                #{result.index} {result.passed ? "통과" : "실패"}
              </strong>
              <p className="mt-1 text-muted">기대: {result.expected || "(빈 출력)"}</p>
              <p className="text-muted">실제: {result.actual || result.error || "(빈 출력)"}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);
