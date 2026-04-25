import { BookOpen, Home } from "lucide-react";

type HeaderProps = {
  onHome: () => void;
};

export const Header = ({ onHome }: HeaderProps) => (
  <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <button className="flex items-center gap-2 text-left" onClick={onHome}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-500 text-white">
          <BookOpen size={19} />
        </span>
        <span>
          <strong className="block text-base">알고리즘 중간고사 실습</strong>
          <span className="hidden text-xs text-muted sm:block">PDF 예제 기반 코딩 연습</span>
        </span>
      </button>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:bg-panel"
        onClick={onHome}
      >
        <Home size={17} />
        홈
      </button>
    </div>
  </header>
);
