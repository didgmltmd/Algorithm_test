import { CheckCircle2, FileText } from "lucide-react";
import type { Problem } from "../types/problem";

type ProblemCardProps = {
  problem: Problem;
  completed: boolean;
  onSelect: (problem: Problem) => void;
};

const difficultyClass = {
  하: "bg-emerald-50 text-emerald-700",
  중: "bg-sky-50 text-sky-700",
  상: "bg-rose-50 text-rose-700",
};

export const ProblemCard = ({ problem, completed, onSelect }: ProblemCardProps) => (
  <button
    className="w-full rounded-xl border border-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    onClick={() => onSelect(problem)}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-ink">{problem.title}</h3>
        <p className="mt-2 text-sm text-muted">{problem.algorithm}</p>
      </div>
      {completed ? <CheckCircle2 className="shrink-0 text-emerald-500" size={20} /> : null}
    </div>
    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
      <span className={`rounded-full px-2.5 py-1 ${difficultyClass[problem.difficulty]}`}>{problem.difficulty}</span>
      <span className="inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-muted">
        <FileText size={13} />
        p.{problem.pageNumber}
      </span>
      <span className="rounded-full bg-panel px-2.5 py-1 text-muted">{problem.pdfFile}</span>
    </div>
  </button>
);
