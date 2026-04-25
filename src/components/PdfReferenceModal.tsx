import { ExternalLink, X } from "lucide-react";
import type { Problem } from "../types/problem";

type PdfReferenceModalProps = {
  problem: Problem;
  onClose: () => void;
};

const pdfUrl = (fileName: string, pageNumber: number): string =>
  `/pdfs/${encodeURIComponent(fileName)}#page=${pageNumber}`;

export const PdfReferenceModal = ({ problem, onClose }: PdfReferenceModalProps) => {
  const url = pdfUrl(problem.pdfFile, problem.pageNumber);

  return (
    <div className="fixed inset-0 z-40 bg-ink/30 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">{problem.pdfFile}</h2>
            <p className="text-sm text-muted">{problem.title} · p.{problem.pageNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold hover:bg-panel"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={16} />
              새 창
            </a>
            <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-panel" onClick={onClose} aria-label="닫기">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="bg-panel px-5 py-2 text-sm text-muted">
          iframe 기반 PDF 참고 뷰어입니다. 추후 pdf.js로 교체할 수 있도록 컴포넌트를 분리했습니다.
        </div>
        <iframe className="min-h-0 flex-1 bg-white" title={problem.pdfFile} src={url} />
      </div>
    </div>
  );
};
