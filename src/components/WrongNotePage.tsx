import { ArrowLeft, CheckCircle2, StickyNote } from "lucide-react";
import type { ExerciseProblem, WrongNote } from "../types/exercise";

type WrongNotePageProps = {
  exercises: ExerciseProblem[];
  wrongNotes: WrongNote[];
  onBack: () => void;
  onSelect: (exercise: ExerciseProblem) => void;
  onRemove: (problemId: string) => void;
};

export const WrongNotePage = ({ exercises, wrongNotes, onBack, onSelect, onRemove }: WrongNotePageProps) => {
  const items = wrongNotes
    .map((note) => ({
      note,
      exercise: exercises.find((exercise) => exercise.id === note.problemId),
    }))
    .filter((item): item is { note: WrongNote; exercise: ExerciseProblem } => Boolean(item.exercise))
    .sort((left, right) => {
      if (left.exercise.chapter !== right.exercise.chapter) return left.exercise.chapter - right.exercise.chapter;
      return left.exercise.title.localeCompare(right.exercise.title, "ko", { numeric: true });
    });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <button className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-muted hover:bg-panel" onClick={onBack}>
        <ArrowLeft size={17} />
        돌아가기
      </button>

      <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-700">
              <StickyNote size={18} />
              오답노트
            </div>
            <h1 className="text-3xl font-bold text-ink">틀렸던 문제 다시보기</h1>
            <p className="mt-2 text-sm text-muted">오답으로 제출했던 연습문제만 모아 보여줍니다.</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">{items.length}문항</span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-line bg-panel p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={34} />
            <p className="font-bold text-ink">현재 오답노트가 비어 있습니다.</p>
            <p className="mt-1 text-sm text-muted">틀린 문제가 생기면 자동으로 여기에 추가됩니다.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map(({ note, exercise }) => (
              <article key={exercise.id} className="rounded-lg border border-line bg-panel p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-white px-2.5 py-1 text-sky-700">{exercise.chapterTitle}</span>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">오답</span>
                </div>
                <h2 className="text-lg font-bold text-ink">{exercise.title}</h2>
                <p className="mt-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold leading-6 text-ink">{exercise.conceptSummary}</p>
                <p className="mt-2 text-xs text-muted">마지막 오답: {new Date(note.updatedAt).toLocaleString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="h-10 rounded-lg bg-sky-500 px-4 text-sm font-bold text-white hover:bg-sky-600" onClick={() => onSelect(exercise)}>
                    다시 풀기
                  </button>
                  <button className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-bold hover:bg-panel" onClick={() => onRemove(exercise.id)}>
                    목록에서 제거
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
