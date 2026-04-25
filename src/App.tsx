import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChapterSidebar } from "./components/ChapterSidebar";
import { Layout } from "./components/Layout";
import { ProblemDetail } from "./components/ProblemDetail";
import { ProblemList } from "./components/ProblemList";
import { ProgressCard } from "./components/ProgressCard";
import { chapters, problems } from "./data/problems";
import type { Problem } from "./types/problem";

const completedKey = "algorithm-midterm-completed";
const codeKey = (problemId: string) => `algorithm-midterm-code-v3-${problemId}`;

const readCompleted = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(completedKey) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
};

function App() {
  const [view, setView] = useState<"home" | "list" | "detail">("home");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => readCompleted());
  const [codeByProblem, setCodeByProblem] = useState<Record<string, string>>({});

  const chapterCounts = useMemo(
    () =>
      chapters.map((chapter) => ({
        ...chapter,
        count: problems.filter((problem) => problem.chapter === chapter.chapter).length,
      })),
    [],
  );

  const selectedProblems = useMemo(
    () => problems.filter((problem) => problem.chapter === selectedChapter),
    [selectedChapter],
  );

  const activeCode = selectedProblem ? codeByProblem[selectedProblem.id] ?? selectedProblem.starterCode : "";

  useEffect(() => {
    localStorage.setItem(completedKey, JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  const openProblem = (problem: Problem) => {
    const savedCode = localStorage.getItem(codeKey(problem.id));
    const initialCode = savedCode && savedCode !== problem.solutionCode ? savedCode : problem.starterCode;
    setSelectedProblem(problem);
    setCodeByProblem((current) => ({
      ...current,
      [problem.id]: current[problem.id] && current[problem.id] !== problem.solutionCode ? current[problem.id] : initialCode,
    }));
    setView("detail");
  };

  const updateCode = (value: string) => {
    if (!selectedProblem) return;
    localStorage.setItem(codeKey(selectedProblem.id), value);
    setCodeByProblem((current) => ({ ...current, [selectedProblem.id]: value }));
  };

  const markSolved = (problemId: string) => {
    setCompletedIds((current) => new Set([...current, problemId]));
  };

  const goList = () => {
    setView("list");
    setSelectedProblem(null);
  };

  return (
    <Layout onHome={() => setView("home")}>
      {view === "home" ? (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <section className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">
                Algorithm Practice
              </p>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
                알고리즘 중간고사 실습
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                PDF 예제를 기반으로 알고리즘 개념을 확인하고 직접 코드를 작성해보는 학습용 사이트
              </p>
              <button
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-lg bg-sky-500 px-5 text-base font-bold text-white shadow-soft hover:bg-sky-600"
                onClick={() => setView("list")}
              >
                문제 풀러가기
                <ArrowRight size={19} />
              </button>
            </div>
            <div className="rounded-xl border border-line bg-panel p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={18} />
                진행률 {completedIds.size}/{problems.length}
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${(completedIds.size / problems.length) * 100}%` }}
                />
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <ProgressCard label="전체 문제 수" value={problems.length} caption="데이터 기반으로 추가 가능" />
            <ProgressCard label="최근 푼 문제 수" value={completedIds.size} caption="localStorage에 저장" />
            <ProgressCard label="장별 평균 문제 수" value={Math.round(problems.length / chapters.length)} caption="총 4개 챕터" />
          </section>

          <section className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {chapterCounts.map((chapter) => (
              <button
                key={chapter.chapter}
                className="rounded-xl border border-line bg-white p-5 text-left shadow-sm hover:shadow-soft"
                onClick={() => {
                  setSelectedChapter(chapter.chapter);
                  setView("list");
                }}
              >
                <p className="text-sm font-bold text-sky-600">Chapter {chapter.chapter}</p>
                <h2 className="mt-2 min-h-12 text-lg font-bold text-ink">{chapter.title.replace(`Chapter ${chapter.chapter}. `, "")}</h2>
                <p className="mt-3 text-sm text-muted">{chapter.count}문제</p>
              </button>
            ))}
          </section>
        </main>
      ) : null}

      {view === "list" ? (
        <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
          <ChapterSidebar selectedChapter={selectedChapter} onSelect={setSelectedChapter} />
          <ProblemList problems={selectedProblems} completedIds={completedIds} onSelect={openProblem} />
        </main>
      ) : null}

      {view === "detail" && selectedProblem ? (
        <ProblemDetail
          problem={selectedProblem}
          code={activeCode}
          onCodeChange={updateCode}
          onBack={goList}
          onSolved={markSolved}
        />
      ) : null}
    </Layout>
  );
}

export default App;
