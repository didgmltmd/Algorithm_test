import { X } from "lucide-react";
import type { Problem } from "../types/problem";

type ConceptPanelProps = {
  problem: Problem;
  onClose: () => void;
};

export const ConceptPanel = ({ problem, onClose }: ConceptPanelProps) => (
  <div className="fixed inset-0 z-40 bg-ink/30 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="mx-auto max-h-full max-w-3xl overflow-auto rounded-xl bg-white shadow-soft">
      <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-sky-600">{problem.algorithm}</p>
          <h2 className="text-xl font-bold text-ink">개념 보기</h2>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-panel" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-5 p-5">
        <section>
          <h3 className="text-sm font-bold text-ink">알고리즘 개념 설명</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{problem.concept.summary}</p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-ink">동작 과정</h3>
          <ol className="mt-2 space-y-2 text-sm text-muted">
            {problem.concept.steps.map((step, index) => (
              <li key={step} className="rounded-lg bg-panel px-3 py-2">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </section>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-bold text-ink">시간 복잡도</h3>
            <p className="mt-2 text-sm text-muted">{problem.concept.timeComplexity}</p>
          </div>
          <div className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-bold text-ink">공간 복잡도</h3>
            <p className="mt-2 text-sm text-muted">{problem.concept.spaceComplexity}</p>
          </div>
        </div>
        <section>
          <h3 className="text-sm font-bold text-ink">PDF 핵심 포인트</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{problem.concept.pdfPoint}</p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-ink">시험 대비 포인트</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{problem.concept.examPoint}</p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-ink">자주 실수하는 부분</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {problem.concept.commonMistakes.map((mistake) => (
              <li key={mistake} className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">
                {mistake}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  </div>
);
