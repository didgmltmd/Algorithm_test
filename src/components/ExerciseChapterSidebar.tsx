import { exerciseChapters, exerciseProblems } from "../data/exercises";

type ExerciseChapterSidebarProps = {
  selectedChapter: number;
  onSelect: (chapter: number) => void;
};

export const ExerciseChapterSidebar = ({ selectedChapter, onSelect }: ExerciseChapterSidebarProps) => (
  <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
    <label className="mb-2 block text-sm font-semibold text-muted lg:hidden" htmlFor="exercise-chapter-select">
      장 선택
    </label>
    <select
      id="exercise-chapter-select"
      className="mb-4 w-full rounded-lg border border-line bg-white px-3 py-3 text-sm font-semibold lg:hidden"
      value={selectedChapter}
      onChange={(event) => onSelect(Number(event.target.value))}
    >
      {exerciseChapters.map((chapter) => (
        <option key={chapter.chapter} value={chapter.chapter}>
          {chapter.title}
        </option>
      ))}
    </select>
    <nav className="hidden rounded-xl border border-line bg-white p-2 shadow-soft lg:block">
      {exerciseChapters.map((chapter) => {
        const count = exerciseProblems.filter((exercise) => exercise.chapter === chapter.chapter).length;
        const active = chapter.chapter === selectedChapter;
        return (
          <button
            key={chapter.chapter}
            className={`mb-1 w-full rounded-lg px-4 py-3 text-left transition ${
              active ? "bg-sky-500 text-white" : "text-ink hover:bg-panel"
            }`}
            onClick={() => onSelect(chapter.chapter)}
          >
            <span className="block text-sm font-bold">{chapter.title}</span>
            <span className={`mt-1 block text-xs ${active ? "text-sky-50" : "text-muted"}`}>{count}문항</span>
          </button>
        );
      })}
    </nav>
  </aside>
);
