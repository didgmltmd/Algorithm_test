import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChapterSidebar } from "./components/ChapterSidebar";
import { ExerciseChapterSidebar } from "./components/ExerciseChapterSidebar";
import { ExerciseDetail } from "./components/ExerciseDetail";
import { ExerciseList } from "./components/ExerciseList";
import { Layout } from "./components/Layout";
import { ProblemDetail } from "./components/ProblemDetail";
import { ProblemList } from "./components/ProblemList";
import { ProgressCard } from "./components/ProgressCard";
import { WrongNotePage } from "./components/WrongNotePage";
import { exerciseChapters, exerciseProblems } from "./data/exercises";
import { chapters, problems } from "./data/problems";
import type { ExerciseProblem, ExerciseSubmission, WrongNote } from "./types/exercise";
import type { Problem } from "./types/problem";

const completedKey = "algorithm-midterm-completed";
const exerciseCompletedKey = "algorithm-exercise-completed";
const exerciseSubmissionsKey = "algorithm-exercise-submissions-v1";
const wrongNotesKey = "algorithm-exercise-wrong-notes-v1";
const codeKey = (problemId: string) => `algorithm-midterm-code-v3-${problemId}`;

const readCompleted = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(completedKey) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
};

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
};

function App() {
  const [view, setView] = useState<"home" | "list" | "detail" | "exerciseList" | "exerciseDetail" | "wrongNotes">("home");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedExerciseChapter, setSelectedExerciseChapter] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseProblem | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => readCompleted());
  const [exerciseCompletedIds, setExerciseCompletedIds] = useState<Set<string>>(
    () => new Set(readJson<string[]>(exerciseCompletedKey, [])),
  );
  const [exerciseSubmissions, setExerciseSubmissions] = useState<Record<string, ExerciseSubmission>>(
    () => readJson<Record<string, ExerciseSubmission>>(exerciseSubmissionsKey, {}),
  );
  const [wrongNotes, setWrongNotes] = useState<Record<string, WrongNote>>(
    () => readJson<Record<string, WrongNote>>(wrongNotesKey, {}),
  );
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

  const selectedExercises = useMemo(
    () => exerciseProblems.filter((exercise) => exercise.chapter === selectedExerciseChapter),
    [selectedExerciseChapter],
  );

  const activeCode = selectedProblem ? codeByProblem[selectedProblem.id] ?? selectedProblem.starterCode : "";

  useEffect(() => {
    localStorage.setItem(completedKey, JSON.stringify(Array.from(completedIds)));
  }, [completedIds]);

  useEffect(() => {
    localStorage.setItem(exerciseCompletedKey, JSON.stringify(Array.from(exerciseCompletedIds)));
  }, [exerciseCompletedIds]);

  useEffect(() => {
    localStorage.setItem(exerciseSubmissionsKey, JSON.stringify(exerciseSubmissions));
  }, [exerciseSubmissions]);

  useEffect(() => {
    localStorage.setItem(wrongNotesKey, JSON.stringify(wrongNotes));
  }, [wrongNotes]);

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

  const openExercise = (exercise: ExerciseProblem) => {
    setSelectedExercise(exercise);
    setSelectedExerciseChapter(exercise.chapter);
    setView("exerciseDetail");
  };

  const submitExercise = (submission: ExerciseSubmission) => {
    setExerciseSubmissions((current) => ({ ...current, [submission.problemId]: submission }));
    if (submission.passed) {
      setExerciseCompletedIds((current) => new Set([...current, submission.problemId]));
    }
  };

  const clearExerciseSubmission = (problemId: string) => {
    setExerciseSubmissions((current) => {
      const next = { ...current };
      delete next[problemId];
      return next;
    });
    setExerciseCompletedIds((current) => {
      const next = new Set(current);
      next.delete(problemId);
      return next;
    });
  };

  const saveWrongNote = (note: WrongNote) => {
    setWrongNotes((current) => ({ ...current, [note.problemId]: note }));
  };

  const removeWrongNote = (problemId: string) => {
    setWrongNotes((current) => {
      const next = { ...current };
      delete next[problemId];
      return next;
    });
  };

  const goList = () => {
    setView("list");
    setSelectedProblem(null);
  };

  const goExerciseList = () => {
    setView("exerciseList");
    setSelectedExercise(null);
  };

  const openWrongNotes = () => {
    setView("wrongNotes");
    setSelectedProblem(null);
    setSelectedExercise(null);
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
                알고리즘 중간고사 연습
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                PDF 예제 기반 코딩 문제와 텍스트로 전환한 책 연습문제를 장별로 풀어볼 수 있습니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  className="inline-flex h-12 items-center gap-2 rounded-lg bg-sky-500 px-5 text-base font-bold text-white shadow-soft hover:bg-sky-600"
                  onClick={() => setView("list")}
                >
                  코딩 문제 풀기
                  <ArrowRight size={19} />
                </button>
                <button
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-line bg-white px-5 text-base font-bold text-ink shadow-sm hover:bg-panel"
                  onClick={() => setView("exerciseList")}
                >
                  연습문제 풀기
                  <ArrowRight size={19} />
                </button>
                <button
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-5 text-base font-bold text-amber-800 shadow-sm hover:bg-amber-100"
                  onClick={openWrongNotes}
                >
                  오답노트
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-panel p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={18} />
                코딩 진행률 {completedIds.size}/{problems.length}
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${(completedIds.size / problems.length) * 100}%` }}
                />
              </div>
              <div className="mt-5 mb-4 flex items-center gap-2 text-sm font-bold text-sky-700">
                <CheckCircle2 size={18} />
                연습문제 진행률 {exerciseCompletedIds.size}/{exerciseProblems.length}
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${(exerciseCompletedIds.size / exerciseProblems.length) * 100}%` }}
                />
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <ProgressCard label="코딩 문제" value={problems.length} caption="정답 코드 실행 채점" />
            <ProgressCard label="연습문제" value={exerciseProblems.length} caption="객관식, 단답형, 서술형" />
            <ProgressCard label="오답노트" value={Object.keys(wrongNotes).length} caption="localStorage 저장" />
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
                <p className="text-sm font-bold text-sky-600">Coding Chapter {chapter.chapter}</p>
                <h2 className="mt-2 min-h-12 text-lg font-bold text-ink">{chapter.title.replace(`Chapter ${chapter.chapter}. `, "")}</h2>
                <p className="mt-3 text-sm text-muted">{chapter.count}문제</p>
              </button>
            ))}
          </section>

          <section className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {exerciseChapters.map((chapter) => (
              <button
                key={chapter.chapter}
                className="rounded-xl border border-line bg-white p-5 text-left shadow-sm hover:shadow-soft"
                onClick={() => {
                  setSelectedExerciseChapter(chapter.chapter);
                  setView("exerciseList");
                }}
              >
                <p className="text-sm font-bold text-emerald-600">Exercise Chapter {chapter.chapter}</p>
                <h2 className="mt-2 min-h-12 text-lg font-bold text-ink">{chapter.title.replace(`Chapter ${chapter.chapter}. `, "")}</h2>
                <p className="mt-3 text-sm text-muted">
                  {exerciseProblems.filter((exercise) => exercise.chapter === chapter.chapter).length}문항
                </p>
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

      {view === "exerciseList" ? (
        <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
          <ExerciseChapterSidebar selectedChapter={selectedExerciseChapter} onSelect={setSelectedExerciseChapter} />
          <div>
            <div className="mb-4 flex justify-end">
              <button
                className="h-10 rounded-lg border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-800 hover:bg-amber-100"
                onClick={openWrongNotes}
              >
                오답노트 보기 ({Object.keys(wrongNotes).length})
              </button>
            </div>
            <ExerciseList
              exercises={selectedExercises}
              completedIds={exerciseCompletedIds}
              wrongNotes={Object.values(wrongNotes).filter((note) =>
                selectedExercises.some((exercise) => exercise.id === note.problemId),
              )}
              onSelect={openExercise}
            />
          </div>
        </main>
      ) : null}

      {view === "exerciseDetail" && selectedExercise ? (
        <ExerciseDetail
          exercise={selectedExercise}
          chapterExercises={selectedExercises}
          submission={exerciseSubmissions[selectedExercise.id]}
          onBack={goExerciseList}
          onSelect={openExercise}
          onSubmit={submitExercise}
          onClearSubmission={clearExerciseSubmission}
          onSaveWrongNote={saveWrongNote}
          onRemoveWrongNote={removeWrongNote}
        />
      ) : null}

      {view === "wrongNotes" ? (
        <WrongNotePage
          exercises={exerciseProblems}
          wrongNotes={Object.values(wrongNotes)}
          onBack={() => setView("exerciseList")}
          onSelect={openExercise}
          onRemove={removeWrongNote}
        />
      ) : null}
    </Layout>
  );
}

export default App;
