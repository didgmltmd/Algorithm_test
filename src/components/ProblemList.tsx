import type { Problem } from "../types/problem";
import { ProblemCard } from "./ProblemCard";

type ProblemListProps = {
  problems: Problem[];
  completedIds: Set<string>;
  onSelect: (problem: Problem) => void;
};

export const ProblemList = ({ problems, completedIds, onSelect }: ProblemListProps) => (
  <section>
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-ink">{problems[0]?.chapterTitle}</h2>
        <p className="mt-1 text-sm text-muted">PDF 예제 기반 문제를 선택해 직접 실행해보세요.</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
        {problems.length}문제
      </span>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} completed={completedIds.has(problem.id)} onSelect={onSelect} />
      ))}
    </div>
  </section>
);
