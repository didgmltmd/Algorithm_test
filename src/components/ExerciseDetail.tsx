import { ArrowLeft, BookOpen, CheckCircle2, Eye, FileText, ImageIcon, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ExerciseProblem, ExerciseSubmission, WrongNote } from "../types/exercise";

type ExerciseDetailProps = {
  exercise: ExerciseProblem;
  chapterExercises: ExerciseProblem[];
  submission?: ExerciseSubmission;
  onBack: () => void;
  onSelect: (exercise: ExerciseProblem) => void;
  onSubmit: (submission: ExerciseSubmission) => void;
  onClearSubmission: (problemId: string) => void;
  onSaveWrongNote: (note: WrongNote) => void;
  onRemoveWrongNote: (problemId: string) => void;
};

const answerKey = (id: string) => `algorithm-exercise-answer-v1-${id}`;

export const ExerciseDetail = ({
  exercise,
  chapterExercises,
  submission,
  onBack,
  onSelect,
  onSubmit,
  onClearSubmission,
  onSaveWrongNote,
  onRemoveWrongNote,
}: ExerciseDetailProps) => {
  const [answer, setAnswer] = useState<string | string[]>("");
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [feedback, setFeedback] = useState(0);
  const [displaySubmission, setDisplaySubmission] = useState<ExerciseSubmission | undefined>(submission);

  const blankCount = exercise.kind === "fill-blank" ? Math.max(1, exercise.answers?.length ?? 1) : 0;

  useEffect(() => {
    const saved = localStorage.getItem(answerKey(exercise.id));
    if (saved) {
      try {
        setAnswer(JSON.parse(saved) as string | string[]);
      } catch {
        setAnswer(saved);
      }
    } else {
      setAnswer(initialAnswer(exercise, blankCount));
    }
    setShowHint(false);
    setShowAnswer(false);
    setShowImage(true);
    setFeedback(0);
    setDisplaySubmission(submission?.problemId === exercise.id ? submission : undefined);
  }, [exercise.id, blankCount, submission]);

  useEffect(() => {
    localStorage.setItem(answerKey(exercise.id), JSON.stringify(answer));
  }, [answer, exercise.id]);

  const result = useMemo(
    () => displaySubmission && displaySubmission.problemId === exercise.id ? displaySubmission : undefined,
    [displaySubmission, exercise.id],
  );

  const handleSubmit = () => {
    if (exercise.kind === "essay") {
      const nextSubmission: ExerciseSubmission = {
        problemId: exercise.id,
        answer,
        passed: false,
        reviewed: false,
        submittedAt: new Date().toISOString(),
      };
      setDisplaySubmission(nextSubmission);
      onSubmit(nextSubmission);
      flashFeedback();
      setShowAnswer(true);
      return;
    }

    const passed = checkAnswer(exercise, answer);
    const nextSubmission: ExerciseSubmission = {
      problemId: exercise.id,
      answer,
      passed,
      submittedAt: new Date().toISOString(),
    };
    setDisplaySubmission(nextSubmission);
    onSubmit(nextSubmission);

    if (!passed) {
      flashFeedback();
      onSaveWrongNote({
        problemId: exercise.id,
        answer,
        updatedAt: new Date().toISOString(),
        resolved: false,
      });
    } else {
      flashFeedback();
      onRemoveWrongNote(exercise.id);
    }
  };

  const handleSelfReview = (passed: boolean) => {
    const nextSubmission: ExerciseSubmission = {
      problemId: exercise.id,
      answer,
      passed,
      reviewed: true,
      submittedAt: new Date().toISOString(),
    };
    setDisplaySubmission(nextSubmission);
    onSubmit(nextSubmission);

    if (passed) {
      flashFeedback();
      onRemoveWrongNote(exercise.id);
    } else {
      flashFeedback();
      onSaveWrongNote({
        problemId: exercise.id,
        answer,
        updatedAt: new Date().toISOString(),
        resolved: false,
      });
    }
  };

  const flashFeedback = () => {
    setFeedback((value) => value + 1);
  };

  const resetAnswer = () => {
    setAnswer(initialAnswer(exercise, blankCount));
    setDisplaySubmission(undefined);
    setFeedback(0);
    onClearSubmission(exercise.id);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <button className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-muted hover:bg-panel" onClick={onBack}>
        <ArrowLeft size={17} />
        연습문제 목록
      </button>

      <div className="mb-5 overflow-x-auto rounded-lg border border-line bg-white p-2">
        <div className="flex min-w-max gap-2">
          {chapterExercises.map((item, index) => (
            <button
              key={item.id}
              className={`h-10 rounded-lg px-3 text-sm font-bold ${
                item.id === exercise.id ? "bg-sky-500 text-white" : "bg-panel text-ink hover:bg-sky-50"
              }`}
              onClick={() => onSelect(item)}
            >
              {index + 1}. {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">{exercise.chapterTitle}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{labelByKind[exercise.kind]}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">{exercise.title}</h1>
          <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3">
            <p className="text-sm font-bold text-sky-800">개념 요약</p>
            <p className="mt-1 leading-6 text-sky-900">{exercise.conceptSummary}</p>
          </div>
          <WorkbookText text={exercise.prompt} />

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-ink hover:bg-panel"
              href={`/pdfs/${encodeURIComponent(exercise.pdfFile)}#page=${exercise.pageNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={17} />
              PDF 개념보기
            </a>
            {exercise.image ? (
              <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-ink hover:bg-panel" onClick={() => setShowImage((value) => !value)}>
                <ImageIcon size={17} />
                원본 사진
              </button>
            ) : null}
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-ink hover:bg-panel" onClick={() => setShowHint((value) => !value)}>
              <Lightbulb size={17} />
              힌트
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm font-bold text-ink hover:bg-panel" onClick={() => setShowAnswer((value) => !value)}>
              <Eye size={17} />
              정답보기
            </button>
          </div>

          {showHint ? <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-amber-50 p-4 text-sm text-amber-800">{exercise.hint}</pre> : null}
          {showAnswer ? (
            <div className="mt-4 rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
              <p className="font-bold">정답</p>
              <p className="mt-2 whitespace-pre-wrap">{exercise.answerText}</p>
              <p className="mt-4 font-bold">해설</p>
              <p className="mt-2 whitespace-pre-wrap leading-6">{exercise.explanation}</p>
            </div>
          ) : null}

          {showImage && exercise.image ? (
            <div className="mt-5 overflow-hidden rounded-lg border border-line bg-panel">
              <img className="max-h-[560px] w-full object-contain" src={exercise.image} alt={`${exercise.title} 원본 사진`} />
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-line bg-panel p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink">답안 작성</h2>
              {result ? (
                <ResultBadge
                  key={`${result.submittedAt}-${result.passed ? "correct" : "wrong"}-${result.reviewed ? "reviewed" : "raw"}-${feedback}`}
                  submission={result}
                  kind={exercise.kind}
                  animated={feedback > 0}
                />
              ) : null}
            </div>

            <AnswerInput exercise={exercise} answer={answer} onChange={setAnswer} />

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-bold text-white hover:bg-emerald-600" onClick={handleSubmit}>
                <CheckCircle2 size={17} />
                제출
              </button>
              {exercise.kind === "essay" ? (
                <>
                  <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold hover:bg-panel" onClick={() => handleSelfReview(true)}>
                    <BookOpen size={17} />
                    맞음 처리
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold hover:bg-panel" onClick={() => handleSelfReview(false)}>
                    <XCircle size={17} />
                    오답 처리
                  </button>
                </>
              ) : null}
              <button
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-bold hover:bg-panel"
                onClick={resetAnswer}
              >
                <RotateCcw size={17} />
                초기화
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const AnswerInput = ({
  exercise,
  answer,
  onChange,
}: {
  exercise: ExerciseProblem;
  answer: string | string[];
  onChange: (value: string | string[]) => void;
}) => {
  if (exercise.kind === "multiple-choice") {
    return (
      <div className="space-y-2">
        {exercise.options?.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white p-3 hover:bg-sky-50">
            <input
              type="radio"
              name={exercise.id}
              value={option.id}
              checked={answer === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className="font-semibold text-ink">{option.id}.</span>
            <span className="text-ink">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (exercise.kind === "multi-select") {
    const values = Array.isArray(answer) ? answer : [];
    return (
      <div className="space-y-2">
        {exercise.options?.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-white p-3 hover:bg-sky-50">
            <input
              type="checkbox"
              value={option.id}
              checked={values.includes(option.id)}
              onChange={(event) => {
                const next = event.target.checked ? [...values, option.id] : values.filter((value) => value !== option.id);
                onChange(next);
              }}
            />
            <span className="font-semibold text-ink">{option.id}.</span>
            <span className="text-ink">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (exercise.kind === "multi-part-choice") {
    const values = Array.isArray(answer) ? answer : [];
    return (
      <div className="space-y-5">
        {exercise.optionGroups?.map((group, groupIndex) => (
          <fieldset key={group.id} className="rounded-lg border border-line bg-white p-3">
            <legend className="px-1 text-sm font-bold text-muted">{group.label}</legend>
            <div className="mt-2 space-y-2">
              {group.options.map((option) => (
                <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-sky-50">
                  <input
                    type="radio"
                    name={`${exercise.id}-${group.id}`}
                    value={option.id}
                    checked={values[groupIndex] === option.id}
                    onChange={() => {
                      const next = [...values];
                      next[groupIndex] = option.id;
                      onChange(next);
                    }}
                  />
                  <span className="font-semibold text-ink">{option.id}.</span>
                  <span className="text-ink">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    );
  }

  if (exercise.kind === "fill-blank") {
    const values = Array.isArray(answer) ? answer : [String(answer ?? "")];
    const count = Math.max(1, exercise.answers?.length ?? values.length);
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: count }).map((_, index) => (
          <label key={index} className="block">
            <span className="mb-2 block text-sm font-bold text-muted">빈칸 {index + 1}</span>
            <input
              className="h-11 w-full rounded-lg border border-line px-3 outline-none focus:border-sky-400"
              value={values[index] ?? ""}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
          </label>
        ))}
      </div>
    );
  }

  if (exercise.kind === "short-answer") {
    return (
      <input
        className="h-12 w-full rounded-lg border border-line bg-white px-3 outline-none focus:border-sky-400"
        value={String(answer ?? "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder="정답을 입력하세요."
      />
    );
  }

  return (
    <textarea
      className="min-h-64 w-full resize-y rounded-lg border border-line bg-white p-3 leading-7 outline-none focus:border-sky-400"
      value={String(answer ?? "")}
      onChange={(event) => onChange(event.target.value)}
      placeholder="풀이 과정을 작성하세요."
    />
  );
};

const initialAnswer = (exercise: ExerciseProblem, blankCount: number) => {
  if (exercise.kind === "fill-blank") return Array.from({ length: blankCount }, () => "");
  if (exercise.kind === "multi-select") return [];
  if (exercise.kind === "multi-part-choice") return Array.from({ length: exercise.optionGroups?.length ?? 0 }, () => "");
  return "";
};

const WorkbookText = ({ text }: { text: string }) => (
  <div className="mt-5 rounded-lg border border-line bg-[#fffdf8] px-6 py-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
      <span className="text-sm font-bold text-sky-700">연습문제</span>
      <span className="text-xs font-semibold text-muted">Algorithm Workbook</span>
    </div>
    <div className="space-y-3 font-serif text-[17px] leading-8 text-ink">
      {(text.includes("\n\n") ? text.split(/\n{2,}/) : text.split(/\n/)).map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;
        const isQuestion = /^\d+\./.test(trimmed);
        const isOption = /^[①②③④⑤]/.test(trimmed);
        const isSequence = /^[\d\s,]+$/.test(trimmed.replace(/[①②③④⑤]/g, ""));
        return (
          <p
            key={`${index}-${trimmed.slice(0, 12)}`}
            className={`${isQuestion ? "mt-5 font-bold" : ""} ${isOption || isSequence ? "font-sans text-base tracking-wide" : ""}`}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  </div>
);

const ResultBadge = ({
  submission,
  kind,
  animated,
}: {
  submission: ExerciseSubmission;
  kind: ExerciseProblem["kind"];
  animated: boolean;
}) => {
  const animationClass = animated ? "result-badge-pop" : "";

  if (kind === "essay" && !submission.reviewed) {
    return <span className={`rounded-full bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700 ${animationClass}`}>정답 확인 필요</span>;
  }

  return submission.passed ? (
    <span className={`rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 ${animationClass}`}>정답</span>
  ) : (
    <span className={`rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700 ${animationClass}`}>오답</span>
  );
};

const checkAnswer = (exercise: ExerciseProblem, answer: string | string[]) => {
  const expected = exercise.answers ?? [];
  if (exercise.kind === "fill-blank") {
    const values = Array.isArray(answer) ? answer : [String(answer)];
    return expected.every((value, index) => normalize(values[index] ?? "") === normalize(value));
  }

  if (exercise.kind === "multi-select") {
    const values = Array.isArray(answer) ? answer : [String(answer)];
    return expected.length === values.length && expected.every((value) => values.includes(value));
  }

  if (exercise.kind === "multi-part-choice") {
    const values = Array.isArray(answer) ? answer : [String(answer)];
    return expected.every((value, index) => values[index] === value);
  }

  const value = Array.isArray(answer) ? answer.join(" ") : answer;
  return expected.some((item) => normalize(value) === normalize(item));
};

const normalize = (value: string) => value.trim().replace(/\s+/g, "").toLowerCase();

const labelByKind = {
  "multiple-choice": "객관식",
  "multi-select": "객관식",
  "multi-part-choice": "객관식",
  "short-answer": "단답형",
  "fill-blank": "빈칸 채우기",
  essay: "서술형",
};
