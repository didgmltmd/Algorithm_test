import { BookOpenCheck, CheckCircle2, StickyNote } from "lucide-react";
import type { ExerciseProblem, WrongNote } from "../types/exercise";

type ExerciseListProps = {
  exercises: ExerciseProblem[];
  completedIds: Set<string>;
  wrongNotes: WrongNote[];
  onSelect: (exercise: ExerciseProblem) => void;
};

export const ExerciseList = ({ exercises, completedIds, wrongNotes, onSelect }: ExerciseListProps) => (
  <section>
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-ink">{exercises[0]?.chapterTitle}</h2>
        <p className="mt-1 text-sm text-muted">텍스트로 전환한 연습문제를 문항별 탭에서 풀고 제출 결과를 저장합니다.</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
        {completedIds.size}/{exercises.length} 완료
      </span>
    </div>

    {wrongNotes.length > 0 ? (
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800">
          <StickyNote size={17} />
          오답노트 {wrongNotes.length}개
        </div>
        <div className="flex flex-wrap gap-2">
          {wrongNotes.slice(0, 8).map((note) => {
            const exercise = exercises.find((item) => item.id === note.problemId);
            if (!exercise) return null;
            return (
              <button
                key={note.problemId}
                className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
                onClick={() => onSelect(exercise)}
              >
                {exercise.title}
              </button>
            );
          })}
        </div>
      </div>
    ) : null}

    <div className="grid gap-3 md:grid-cols-2">
      {exercises.map((exercise) => {
        const done = completedIds.has(exercise.id);
        return (
          <button
            key={exercise.id}
            className="rounded-lg border border-line bg-white p-4 text-left shadow-sm transition hover:shadow-soft"
            onClick={() => onSelect(exercise)}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                <BookOpenCheck size={14} />
                {labelByKind[exercise.kind]}
              </span>
              {done ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={15} />
                  완료
                </span>
              ) : null}
            </div>
            <h3 className="text-lg font-bold text-ink">{exercise.title}</h3>
            <p className="mt-2 rounded-lg bg-panel px-3 py-2 text-sm font-semibold leading-6 text-ink">{exercise.conceptSummary}</p>
          </button>
        );
      })}
    </div>
  </section>
);

const labelByKind = {
  "multiple-choice": "객관식",
  "multi-select": "객관식",
  "multi-part-choice": "객관식",
  "short-answer": "단답형",
  "fill-blank": "빈칸",
  essay: "서술형",
};
