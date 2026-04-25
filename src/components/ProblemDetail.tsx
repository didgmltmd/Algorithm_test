import { ArrowLeft, BookOpen, Eye, FileText, Lightbulb, Play, RotateCcw, TestTube2 } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import type { JudgeResult, Problem, RunResult } from "../types/problem";
import { runCode } from "../utils/codeRunner";
import { judgeProblem } from "../utils/judge";
import { CodeEditor } from "./CodeEditor";
import { ConceptPanel } from "./ConceptPanel";
import { PdfReferenceModal } from "./PdfReferenceModal";
import { TestResultPanel } from "./TestResultPanel";

type ProblemDetailProps = {
  problem: Problem;
  code: string;
  onCodeChange: (value: string) => void;
  onBack: () => void;
  onSolved: (problemId: string) => void;
};

export const ProblemDetail = ({ problem, code, onCodeChange, onBack, onSolved }: ProblemDetailProps) => {
  const [input, setInput] = useState(problem.sampleInput);
  const [runResult, setRunResult] = useState<RunResult>();
  const [judgeResult, setJudgeResult] = useState<JudgeResult>();
  const [showConcept, setShowConcept] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);

  const sampleBlock = useMemo(
    () => [
      ["예제 입력", problem.sampleInput],
      ["예제 출력", problem.sampleOutput],
    ],
    [problem],
  );

  useEffect(() => {
    setInput(problem.sampleInput);
    setRunResult(undefined);
    setJudgeResult(undefined);
    setShowHint(false);
    setShowSolution(false);
  }, [problem]);

  const handleRun = async () => {
    setRunning(true);
    setJudgeResult(undefined);
    setRunResult({ output: "Python 실행 환경을 준비하고 있습니다. 첫 실행은 몇 초 걸릴 수 있습니다." });
    const result = await runCode(code, input);
    setRunResult(result);
    setRunning(false);
  };

  const handleJudge = async () => {
    setRunning(true);
    setRunResult({ output: "예제 테스트를 실행하고 있습니다. 첫 실행은 몇 초 걸릴 수 있습니다." });
    const result = await judgeProblem(problem, code);
    setJudgeResult(result);
    if (result.passed) {
      onSolved(problem.id);
    }
    setRunning(false);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <button className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-muted hover:bg-panel" onClick={onBack}>
        <ArrowLeft size={17} />
        문제 목록
      </button>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">{problem.chapterTitle}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{problem.difficulty}</span>
            <span className="rounded-full bg-panel px-2.5 py-1 text-muted">{problem.algorithm}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">{problem.title}</h1>
          <p className="mt-4 leading-7 text-muted">{problem.description}</p>

          <div className="mt-6 space-y-5">
            <Info title="입력 형식" text={problem.inputDescription} />
            <Info title="출력 형식" text={problem.outputDescription} />
            <div className="grid gap-3 md:grid-cols-2">
              {sampleBlock.map(([title, value]) => (
                <div key={title}>
                  <h2 className="mb-2 text-sm font-bold text-ink">{title}</h2>
                  <pre className="min-h-24 overflow-auto rounded-lg bg-panel p-3 font-mono text-sm text-ink">{value}</pre>
                </div>
              ))}
            </div>
            <Info title="관련 개념 요약" text={problem.concept.summary} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ActionButton icon={<FileText size={17} />} label="PDF 참고" onClick={() => setShowPdf(true)} />
            <ActionButton icon={<BookOpen size={17} />} label="개념 보기" onClick={() => setShowConcept(true)} />
            <ActionButton icon={<Lightbulb size={17} />} label="힌트 보기" onClick={() => setShowHint((value) => !value)} />
            <ActionButton icon={<Eye size={17} />} label="정답 코드" onClick={() => setShowSolution((value) => !value)} />
          </div>

          {showHint ? <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-amber-50 p-4 text-sm text-amber-800">{problem.hint}</pre> : null}
          {showSolution ? <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">{problem.solutionCode}</pre> : null}
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-ink">Python 코드</h2>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-sky-500 px-3 text-sm font-bold text-white hover:bg-sky-600 disabled:opacity-60" onClick={handleRun} disabled={running}>
                  <Play size={17} />
                  실행하기
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60" onClick={handleJudge} disabled={running}>
                  <TestTube2 size={17} />
                  예제 테스트
                </button>
                <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold hover:bg-panel" onClick={() => onCodeChange(problem.starterCode)}>
                  <RotateCcw size={17} />
                  초기화
                </button>
              </div>
            </div>
            <CodeEditor code={code} onChange={onCodeChange} />
          </div>
          <TestResultPanel input={input} onInputChange={setInput} runResult={runResult} judgeResult={judgeResult} />
        </section>
      </div>
      {showConcept ? <ConceptPanel problem={problem} onClose={() => setShowConcept(false)} /> : null}
      {showPdf ? <PdfReferenceModal problem={problem} onClose={() => setShowPdf(false)} /> : null}
    </main>
  );
};

const Info = ({ title, text }: { title: string; text: string }) => (
  <section>
    <h2 className="mb-2 text-sm font-bold text-ink">{title}</h2>
    <p className="leading-7 text-muted">{text}</p>
  </section>
);

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-ink hover:bg-panel" onClick={onClick}>
    {icon}
    {label}
  </button>
);
