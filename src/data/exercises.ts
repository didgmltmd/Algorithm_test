import type { ExerciseProblem } from "../types/exercise";
import { chapter2Exercises } from "./chapter2Exercises";
import { exerciseOcrTexts } from "./exerciseOcrTexts";

const chapterTitle = (chapter: number, title: string) => `Chapter ${chapter}. ${title}`;

const c1 = chapterTitle(1, "알고리즘의 첫걸음");
const c2 = chapterTitle(2, "알고리즘을 배우기 위한 준비");
const c3 = chapterTitle(3, "분할 정복 알고리즘");
const c4 = chapterTitle(4, "그리디 알고리즘");

const mc = (
  id: string,
  title: string,
  conceptSummary: string,
  prompt: string,
  labels: string[],
  answer: string,
  explanation: string,
  pageNumber: number,
  chapter = 1,
  currentChapterTitle = c1,
  pdfFile = "1. 알고리즘의 첫걸음.pdf",
): ExerciseProblem => ({
  id,
  chapter,
  chapterTitle: currentChapterTitle,
  title,
  kind: "multiple-choice",
  conceptSummary,
  prompt,
  pdfFile,
  pageNumber,
  options: labels.map((label, index) => ({ id: String(index + 1), label })),
  answers: [answer],
  answerText: `${answerLabel(answer)} ${labels[Number(answer) - 1]}`,
  hint: "문제에서 묻는 알고리즘의 동작 원리를 먼저 떠올린 뒤 선택지를 계산해 보세요.",
  explanation,
});

const essay = (
  id: string,
  title: string,
  conceptSummary: string,
  prompt: string,
  hint: string,
  answerText: string,
  pageNumber: number,
): ExerciseProblem => ({
  id,
  chapter: 1,
  chapterTitle: c1,
  title,
  kind: "essay",
  conceptSummary,
  prompt,
  pdfFile: "1. 알고리즘의 첫걸음.pdf",
  pageNumber,
  answerText,
  hint,
  explanation: "서술형 문제입니다. 정답 예시의 핵심 조건이 본인 답안에 포함되어 있는지 확인하세요.",
});

const answerLabel = (id: string) => ["①", "②", "③", "④", "⑤"][Number(id) - 1] ?? id;

const ocrFiles = [
  "KakaoTalk_20260426_152349870.jpg",
  "KakaoTalk_20260426_152349870_01.jpg",
  "KakaoTalk_20260426_152349870_02.jpg",
  "KakaoTalk_20260426_152349870_03.jpg",
  "KakaoTalk_20260426_152349870_04.jpg",
  "KakaoTalk_20260426_152349870_05.jpg",
  "KakaoTalk_20260426_152349870_06.jpg",
  "KakaoTalk_20260426_152349870_07.jpg",
  "KakaoTalk_20260426_152349870_08.jpg",
  "KakaoTalk_20260426_152349870_09.jpg",
  "KakaoTalk_20260426_152349870_10.jpg",
  "KakaoTalk_20260426_152349870_11.jpg",
  "KakaoTalk_20260426_152349870_12.jpg",
  "KakaoTalk_20260426_152349870_13.jpg",
  "KakaoTalk_20260426_152349870_14.jpg",
  "KakaoTalk_20260426_152349870_15.jpg",
  "KakaoTalk_20260426_152349870_16.jpg",
  "KakaoTalk_20260426_152349870_17.jpg",
  "KakaoTalk_20260426_152349870_18.jpg",
  "KakaoTalk_20260426_152349870_19.jpg",
  "KakaoTalk_20260426_152349870_20.jpg",
  "KakaoTalk_20260426_152349870_21.jpg",
  "KakaoTalk_20260426_152349870_22.jpg",
  "KakaoTalk_20260426_152349870_23.jpg",
  "KakaoTalk_20260426_152349870_24.jpg",
  "KakaoTalk_20260426_152349870_25.jpg",
  "KakaoTalk_20260426_152349870_26.jpg",
  "KakaoTalk_20260426_152349870_27.jpg",
  "KakaoTalk_20260426_152349870_28.jpg",
  "KakaoTalk_20260426_152349870_29.jpg",
  "KakaoTalk_20260426_152353678.jpg",
  "KakaoTalk_20260426_152353678_01.jpg",
  "KakaoTalk_20260426_152353678_02.jpg",
  "KakaoTalk_20260426_152353678_03.jpg",
  "KakaoTalk_20260426_152353678_04.jpg",
  "KakaoTalk_20260426_152353678_05.jpg",
];

const chapterForOcrFile = (index: number) => {
  if (index <= 2) return 1;
  if (index <= 13) return 2;
  if (index <= 21) return 3;
  return 4;
};

const chapterData = (chapter: number) => {
  if (chapter === 1) return { title: c1, pdfFile: "1. 알고리즘의 첫걸음.pdf" };
  if (chapter === 2) return { title: c2, pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf" };
  if (chapter === 3) return { title: c3, pdfFile: "3. 분할 정복 알고리즘.pdf" };
  return { title: c4, pdfFile: "4. 그리디 알고리즘.pdf" };
};

const cleanupOcrLine = (line: string) =>
  line
    .trim()
    .replace(/[`•]/g, "")
    .replace(/\s+/g, " ");

const splitOcrQuestions = (text: string) => {
  const lines = text.split(/\r?\n/).map(cleanupOcrLine).filter(Boolean);
  const chunks: { number: string; prompt: string }[] = [];
  let currentNumber = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^(\d{1,2})\.\s*(.*)$/);
    if (match) {
      if (currentNumber && currentLines.length > 0) {
        chunks.push({ number: currentNumber, prompt: currentLines.join("\n") });
      }
      currentNumber = match[1];
      currentLines = [line];
      continue;
    }

    if (currentNumber) {
      currentLines.push(line);
    }
  }

  if (currentNumber && currentLines.length > 0) {
    chunks.push({ number: currentNumber, prompt: currentLines.join("\n") });
  }

  return chunks;
};

const inferConceptSummary = (prompt: string, chapter: number) => {
  if (/마스터|T\(n\)|순환|귀납/.test(prompt)) return "순환식과 점근적 시간복잡도를 계산하는 문제";
  if (/O-|시간복잡|복잡도|log|n2|n3/.test(prompt)) return "알고리즘 복잡도 표기와 증가율을 판단하는 문제";
  if (/이진탐색|순차탐색|보간탐색|탐색/.test(prompt)) return "탐색 알고리즘의 동작 조건과 비교 횟수를 확인하는 문제";
  if (/합병|퀵|정렬|피봇|선택 문제|최근접/.test(prompt)) return "분할 정복 알고리즘의 대표 사례와 동작 과정을 확인하는 문제";
  if (/크러스컬|프림|다익스트라|최단|신장|그래프/.test(prompt)) return "그래프 그리디 알고리즘의 선택 기준을 적용하는 문제";
  if (/동전|배낭|스케줄|허프만|커버|주유/.test(prompt)) return "그리디 선택 전략으로 최적해를 구성하는 문제";
  if (chapter === 2) return "알고리즘 분석을 위한 수학적 기초를 확인하는 문제";
  if (chapter === 3) return "분할 정복 알고리즘의 원리와 적용을 확인하는 문제";
  return "그리디 알고리즘의 원리와 적용을 확인하는 문제";
};

const curatedKeys = new Set([
  "1-1", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8", "1-9", "1-10", "1-11", "1-12", "1-13", "1-14", "1-15", "1-16",
  "2-25", "2-26", "2-27", "2-28", "2-31",
  "3-1", "3-2", "3-3",
  "4-1", "4-60", "4-65", "4-66",
]);

const isValidQuestionNumber = (chapter: number, number: string) => {
  const value = Number(number);
  if (!Number.isFinite(value) || value <= 0) return false;
  if (chapter === 1) return value <= 16;
  if (chapter === 2) return value <= 59;
  if (chapter === 3) return value <= 41;
  return value <= 66;
};

const generatedExerciseProblems: ExerciseProblem[] = ocrFiles.flatMap((fileName, fileIndex) => {
  const text = exerciseOcrTexts[fileName];
  if (!text) return [];

  const chapter = chapterForOcrFile(fileIndex);
  if (chapter === 2) return [];

  const { title, pdfFile } = chapterData(chapter);

  return splitOcrQuestions(text)
    .filter((question) => isValidQuestionNumber(chapter, question.number))
    .filter((question) => !curatedKeys.has(`${chapter}-${question.number}`))
    .map((question, questionIndex) => ({
      id: `ocr-c${chapter}-${fileIndex + 1}-${question.number}-${questionIndex}`,
      chapter,
      chapterTitle: title,
      title: `연습문제 ${question.number}`,
      kind: "essay",
      conceptSummary: inferConceptSummary(question.prompt, chapter),
      prompt: question.prompt,
      pdfFile,
      pageNumber: 0,
      answerText: "OCR로 전환한 문항입니다. 교재 해설 또는 수업 풀이를 기준으로 자기채점하세요.",
      hint: "문제의 핵심 개념을 먼저 찾고, 필요한 경우 PDF 개념보기로 해당 장 내용을 확인하세요.",
      explanation: "전체 문제 수록을 위해 OCR 텍스트를 사용한 서술형 문항입니다. 정답이 확정되면 객관식/단답형 자동 채점 문항으로 바꿀 수 있습니다.",
    }));
});

const curatedExerciseProblems: ExerciseProblem[] = [
  {
    id: "c1-ex-001",
    chapter: 1,
    chapterTitle: c1,
    title: "연습문제 1",
    kind: "fill-blank",
    conceptSummary: "순차탐색, 이진탐색, 그리디, 분할 정복 등 1장 핵심 용어를 확인하는 빈칸 문제",
    prompt: `다음의 괄호 안에 알맞은 단어를 채워 넣어라.

(1) 주어진 순서에 따라 차례로 탐색하는 알고리즘을 (        )(이)라고 한다.

(2) 이진탐색은 (        ) 항목들에 대해서 (        )에 있는 항목을 비교하여 그 결과에 따라 (        ) 탐색을 마치고, 다르면 작은 항목들이 있는 부분 또는 큰 항목들이 있는 부분을 같은 방식으로 탐색한다.

(3) 동전 거스름돈 문제에서는 (        ) 동전을 항상 선택한다. 이는 (        ) 알고리즘의 일종이다.

(4) 한붓그리기 문제를 해결하는 알고리즘의 핵심은 현재 점에서 다음으로 이동 가능한 점을 선택할 때에는 반드시 현재 점으로 돌아오는 (        )이 존재하여야 한다는 것이다.

(5) 가짜 동전 찾기에서 동전 더미를 (        )으로 분할하여 저울에 달고, 가짜 동전이 있는 더미를 계속해서 (        )으로 나누어 저울에 단다. 이는 (        ) 알고리즘의 일종이다.`,
    pdfFile: "1. 알고리즘의 첫걸음.pdf",
    pageNumber: 31,
    answers: ["순차탐색", "정렬된", "중간", "같으면", "가장 큰", "그리디", "경로", "3등분", "3등분", "분할 정복"],
    answerText: "순차탐색 / 정렬된 / 중간 / 같으면 / 가장 큰 / 그리디 / 경로 / 3등분 / 3등분 / 분할 정복",
    hint: "각 빈칸이 탐색, 선택 전략, 문제 분할 중 어느 개념을 묻는지 구분하세요.",
    explanation: "1장의 대표 알고리즘 이름과 핵심 동작을 용어로 정리하는 문제입니다.",
  },
  mc(
    "c1-ex-002",
    "연습문제 2",
    "순차탐색에서 찾는 값의 위치와 실패 탐색의 비교 횟수를 계산하는 문제",
    `다음에 주어진 숫자들을 순차적으로 검색하여 85와 30을 찾는 데 각각 몇 번을 비교해야 하는가?

45   60   90   20   75   85   35   10`,
    ["5, 7", "5, 8", "6, 7", "6, 8", "답 없음"],
    "4",
    "85는 6번째에 있으므로 6번 비교한다. 30은 없으므로 8개 원소를 모두 비교한다.",
    31,
  ),
  mc(
    "c1-ex-003",
    "연습문제 3",
    "최댓값과 최솟값을 동시에 찾을 때 필요한 최소 비교 횟수를 묻는 문제",
    `다음에 주어진 숫자들 중에서 가장 큰 수와 가장 작은 수를 동시에 찾으려면 최소 몇 번의 숫자 비교가 필요한가?

45   60   90   20`,
    ["2", "4", "6", "8", "답 없음"],
    "2",
    "두 수씩 비교해 큰 값 후보와 작은 값 후보를 나누고, 후보끼리 다시 비교하면 총 4번이다.",
    31,
  ),
  mc(
    "c1-ex-004",
    "연습문제 4",
    "이진탐색에서 찾는 값이 없을 때 비교 횟수를 계산하는 문제",
    `다음과 같이 숫자들이 정렬되었을 때 이진탐색으로 10을 찾으려면 몇 번의 비교를 해야 10이 숫자들 중에 없는 것을 알 수 있나?

15   20   25   30   40   55   65   80`,
    ["3", "4", "5", "6", "답 없음"],
    "1",
    "중간값을 비교하며 왼쪽 절반으로 범위를 줄인다. 30, 20, 15를 확인한 뒤 더 이상 후보가 없어 3번 비교한다.",
    32,
  ),
  mc(
    "c1-ex-005",
    "연습문제 5",
    "특정 동전 체계에서 거스름돈을 만들 때 필요한 최소 동전 수를 계산하는 문제",
    `다음과 같은 동전 시스템에 대해 19원을 거슬러 받으려 할 때 가장 작은 동전 수는?

1원 동전, 2원 동전, 4원 동전, 8원 동전, 32원 동전`,
    ["7", "6", "5", "4", "답 없음"],
    "4",
    "19원은 8+8+2+1로 만들 수 있어 4개가 최소이다.",
    32,
  ),
  mc(
    "c1-ex-006",
    "연습문제 6",
    "동전 단위가 바뀌었을 때 최소 동전 수를 직접 계산하는 문제",
    `다음과 같은 동전 시스템에 대해 20원을 거슬러 받으려 할 때 가장 작은 동전 수는?

1원 동전, 5원 동전, 10원 동전, 16원 동전, 25원 동전`,
    ["2", "3", "4", "5", "답 없음"],
    "1",
    "20원은 10원 동전 2개로 만들 수 있으므로 최소 2개이다.",
    32,
  ),
  mc(
    "c1-ex-007",
    "연습문제 7",
    "가짜 동전 찾기에서 2등분 방식의 저울 사용 횟수를 계산하는 문제",
    "동전 64개 중에 약간 가벼운 가짜 동전 1개가 섞여 있을 때 양팔 저울로 몇 번을 달아야 가짜 동전을 찾을까? 단, 1.6절에서 설명한 대로 동전들을 이등분하여 저울에 다는 것으로 가정하라.",
    ["5", "6", "7", "8", "답 없음"],
    "2",
    "64개를 절반씩 줄이면 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1이므로 6번이 필요하다.",
    32,
  ),
  mc(
    "c1-ex-008",
    "연습문제 8",
    "가짜 동전 찾기에서 3등분 전략을 사용한 최소 저울 횟수를 계산하는 문제",
    "동전 6개 중에 약간 가벼운 가짜 동전 1개가 섞여 있을 때 양팔 저울로 최소 몇 번을 달아야 가짜 동전을 찾을까? 단, 1.6절에서 설명한 방법보다 빠른 방법을 사용하라.",
    ["2", "3", "4", "5", "답 없음"],
    "1",
    "3등분해 2개씩 비교하면 첫 비교로 후보가 2개 이하가 되고, 두 번째 비교로 가짜 동전을 찾을 수 있다.",
    32,
  ),
  mc(
    "c1-ex-009",
    "연습문제 9",
    "가짜 동전 찾기에서 3등분 전략을 7개 동전에 적용하는 문제",
    "동전 7개 중에 약간 가벼운 가짜 동전 1개가 섞여 있을 때 양팔 저울로 최소 몇 번을 달아야 가짜 동전을 찾을까? 단, 1.6절에서 설명한 방법보다 빠른 방법을 사용하라.",
    ["2", "3", "4", "5", "답 없음"],
    "1",
    "3개와 3개를 비교하고, 남은 후보를 다시 비교하면 2번 안에 찾을 수 있다.",
    32,
  ),
  essay(
    "c1-ex-010",
    "연습문제 10",
    "최대 숫자 찾기 문제를 다른 알고리즘 관점으로 생각해보는 서술형 문제",
    "1.1절에서 설명된 최대 숫자 찾기 문제에 대한 알고리즘과 다른 알고리즘을 생각해 보자. [힌트: 비교 횟수를 고려하지 말자]",
    "정렬, 자료구조 사용, 내장 함수 사용 등 비교 횟수 최적화와 별개인 접근을 떠올려 보세요.",
    "예: 모든 숫자를 정렬한 뒤 마지막 원소를 선택한다. 비교 횟수는 더 많을 수 있지만 최대값을 찾는 다른 절차가 된다.",
    33,
  ),
  essay(
    "c1-ex-011",
    "연습문제 11",
    "최댓값과 최솟값을 동시에 찾는 알고리즘을 설계하는 문제",
    "여러 장의 숫자 카드 중에서 가장 큰 수와 가장 작은 수를 동시에 찾기 위한 알고리즘을 생각해 보자.",
    "두 장씩 묶어 먼저 비교하면 큰 값 후보와 작은 값 후보를 나눌 수 있습니다.",
    "예: 카드를 두 장씩 비교해 큰 값은 최대 후보 집합, 작은 값은 최소 후보 집합에 넣는다. 최대 후보에서 최대값을, 최소 후보에서 최소값을 각각 찾는다.",
    33,
  ),
  essay(
    "c1-ex-012",
    "연습문제 12",
    "보간탐색의 아이디어와 적용 조건을 조사하는 문제",
    "보간탐색(Interpolation Search)이 어떤 방식의 탐색인지를 조사해 보자.",
    "값이 균등하게 분포된 정렬 배열에서 위치를 비례식으로 추정하는 탐색입니다.",
    "보간탐색은 정렬된 데이터에서 찾는 값의 크기를 이용해 예상 위치를 계산한다. 균등 분포에서는 빠르지만, 데이터 분포가 치우치면 성능이 나빠질 수 있다.",
    33,
  ),
  essay(
    "c1-ex-013",
    "연습문제 13",
    "정렬 배열에서 이진탐색의 비교 과정을 단계별로 쓰는 문제",
    `다음의 숫자들에 대해 35를 이진탐색으로 찾는 과정을 보이라.

10, 20, 25, 35, 45, 55, 60, 75, 80, 90, 95`,
    "중간 원소를 기준으로 왼쪽/오른쪽 탐색 범위를 줄이는 과정을 적으세요.",
    "예: 중간값 55와 비교해 왼쪽으로 이동, 25와 비교해 오른쪽으로 이동, 35와 비교해 찾는다.",
    33,
  ),
  {
    id: "c1-ex-014",
    chapter: 1,
    chapterTitle: c1,
    title: "연습문제 14",
    kind: "short-answer",
    conceptSummary: "1,024개 정렬 데이터에서 이진탐색의 최악 비교 횟수를 계산하는 문제",
    prompt: "1,024개의 정렬된 데이터에 대해 특정 숫자를 찾기 위해 이진탐색을 하는 데 필요한 최대 비교 횟수를 구하라.",
    pdfFile: "1. 알고리즘의 첫걸음.pdf",
    pageNumber: 33,
    answers: ["10", "10번"],
    answerText: "10번",
    hint: "1,024 = 2^10 입니다.",
    explanation: "이진탐색은 비교할 때마다 탐색 범위를 절반으로 줄인다. 1,024개는 10번 절반으로 나누면 1개가 된다.",
  },
  essay(
    "c1-ex-015",
    "연습문제 15",
    "순차탐색, 보간탐색, 이진탐색의 적용 조건과 성능 차이를 비교하는 문제",
    "순차탐색, 보간탐색, 이진탐색 중 데이터가 어떻게 주어질 때 각각 가장 빨리 찾고, 어떤 경우에 가장 늦게 찾는지를 알아보자.",
    "데이터의 정렬 여부와 값의 분포가 핵심입니다.",
    "순차탐색은 정렬되지 않은 데이터에도 가능하지만 최악에는 모두 확인한다. 이진탐색은 정렬 데이터에서 빠르다. 보간탐색은 정렬되고 값이 균등 분포일 때 특히 빠르다.",
    33,
  ),
  essay(
    "c1-ex-016",
    "연습문제 16",
    "그래프에서 한붓그리기 가능성을 판단하고 경로를 그리는 문제",
    "다음의 그래프에서 한붓그리기를 위한 궤적을 그리라.",
    "각 정점의 차수가 모두 짝수인지, 또는 홀수 차수 정점이 정확히 2개인지 확인하세요.",
    "한붓그리기는 오일러 경로 조건을 이용한다. 모든 간선을 한 번씩 지나는 경로가 존재하는지 정점 차수를 기준으로 판단한다.",
    33,
  ),
  {
    id: "c2-ex-025",
    chapter: 2,
    chapterTitle: c2,
    title: "연습문제 25",
    kind: "short-answer",
    conceptSummary: "마스터 정리를 이용해 T(n)=6T(n/4)+n^1.5의 점근 표기를 구하는 문제",
    prompt: "T(n) = 6T(n/4) + n^1.5 을 부록의 마스터 정리를 이용하여 O-표기로 나타내라. 단, T(1)=1이다.",
    pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf",
    pageNumber: 61,
    answers: ["O(n^1.5)", "O(n^{1.5})", "O(n^(1.5))", "O(n^3/2)", "O(n^{3/2})"],
    answerText: "O(n^1.5)",
    hint: "a=6, b=4이고 n^(log_b a)와 n^1.5를 비교하세요.",
    explanation: "log_4 6은 약 1.292이고 n^1.5가 더 크므로 T(n)=Theta(n^1.5)입니다.",
  },
  {
    id: "c2-ex-026",
    chapter: 2,
    chapterTitle: c2,
    title: "연습문제 26",
    kind: "short-answer",
    conceptSummary: "마스터 정리를 이용해 T(n)=5T(n/5)+n^2의 점근 표기를 구하는 문제",
    prompt: "T(n) = 5T(n/5) + n^2 을 부록의 마스터 정리를 이용하여 O-표기로 나타내라. 단, T(1)=1이다.",
    pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf",
    pageNumber: 61,
    answers: ["O(n^2)", "O(n²)", "Theta(n^2)", "Θ(n^2)"],
    answerText: "O(n^2)",
    hint: "n^(log_5 5)=n 과 f(n)=n^2를 비교하세요.",
    explanation: "f(n)=n^2가 n보다 다항식만큼 크므로 T(n)=Theta(n^2)입니다.",
  },
  {
    id: "c2-ex-027",
    chapter: 2,
    chapterTitle: c2,
    title: "연습문제 27",
    kind: "short-answer",
    conceptSummary: "마스터 정리에서 a와 b의 관계가 만드는 지배항을 판단하는 문제",
    prompt: "T(n) = 9T(n/3) + n^2 을 부록의 마스터 정리를 이용하여 O-표기로 나타내라. 단, T(1)=1이다.",
    pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf",
    pageNumber: 61,
    answers: ["O(n^2 log n)", "O(n² log n)", "Theta(n^2 log n)", "Θ(n^2 log n)"],
    answerText: "O(n^2 log n)",
    hint: "n^(log_3 9)=n^2 입니다. f(n)과 같은 차수인지 확인하세요.",
    explanation: "f(n)=n^2와 n^(log_3 9)=n^2가 같으므로 T(n)=Theta(n^2 log n)입니다.",
  },
  {
    id: "c2-ex-028",
    chapter: 2,
    chapterTitle: c2,
    title: "연습문제 28",
    kind: "short-answer",
    conceptSummary: "마스터 정리로 T(n)=4T(n/2)+n^2의 로그 항 발생 여부를 판단하는 문제",
    prompt: "T(n) = 4T(n/2) + n^2 을 부록의 마스터 정리를 이용하여 O-표기로 나타내라. 단, T(1)=1이다.",
    pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf",
    pageNumber: 61,
    answers: ["O(n^2 log n)", "O(n² log n)", "Theta(n^2 log n)", "Θ(n^2 log n)"],
    answerText: "O(n^2 log n)",
    hint: "n^(log_2 4)=n^2 입니다.",
    explanation: "분할 항과 결합 비용이 같은 차수라 로그가 곱해집니다.",
  },
  {
    id: "c2-ex-031",
    chapter: 2,
    chapterTitle: c2,
    title: "연습문제 31",
    kind: "essay",
    conceptSummary: "귀납법으로 순환식 T(n)=2T(n/2)+n의 점근적 상한을 보이는 문제",
    prompt: `다음의 순환 관계에 대해 부록의 귀납법을 이용하여 O-표기로 나타내라. 단, T(1)=1이다.

T(n) = 2T(n/2) + n, n > 1`,
    pdfFile: "2. 알고리즘을 배우기 위한 준비.pdf",
    pageNumber: 61,
    answerText: "O(n log n)",
    hint: "마스터 정리로 먼저 답을 예측하고, 귀납 가정 T(n/2) <= c(n/2)log(n/2)를 대입해 보세요.",
    explanation: "각 레벨의 총 비용이 n이고 레벨 수가 log n이므로 T(n)=Theta(n log n)입니다.",
  },
  {
    id: "c3-ex-001",
    chapter: 3,
    chapterTitle: c3,
    title: "연습문제 1",
    kind: "fill-blank",
    conceptSummary: "분할 정복 알고리즘의 분할, 정복, 취합 과정과 대표 문제 용어를 확인하는 빈칸 문제",
    prompt: `다음의 괄호 안에 알맞은 단어를 채워 넣어라.

(1) 분할 정복 알고리즘이란 주어진 문제의 입력을 분할한 (        )들을 해결하여 그 해를 취합하는 방식의 알고리즘이다.

(2) 분할 정복이 부적절한 경우는 입력이 분할될 때마다 부분문제들의 크기의 합이 분할되기 전의 크기보다 (        ) 경우이다.

(3) 합병 정렬에서 2개의 정렬된 부분을 (        )하는 것은 분할 정복 알고리즘의 (        )하는 과정이다.

(4) 퀵 정렬에서는 피봇으로 (        )하여 부분문제가 만들어지며, 별도의 (        ) 과정이 없다.

(5) 선택 문제를 해결하는 분할 정복 알고리즘은 퀵 정렬과 같이 피봇을 사용하여 (        )를 만들며, 이진탐색과 같이 별도의 (        ) 과정이 필요 없다.

(6) 최근접 점의 쌍 문제를 해결하는 분할 정복 알고리즘의 핵심은 좌측, 중간, 우측 부분에서 (        ) 점의 쌍을 찾는 것이다.`,
    pdfFile: "3. 분할 정복 알고리즘.pdf",
    pageNumber: 99,
    answers: ["부분문제", "큰", "합병", "취합", "분할", "취합", "부분문제", "취합", "가장 가까운"],
    answerText: "부분문제 / 큰 / 합병 / 취합 / 분할 / 취합 / 부분문제 / 취합 / 가장 가까운",
    hint: "분할 정복의 세 단계인 분할, 정복, 취합을 기준으로 생각하세요.",
    explanation: "분할 정복은 작은 부분문제로 나누고 해결한 뒤 필요한 경우 해를 합치는 방식입니다.",
  },
  mc(
    "c3-ex-002",
    "연습문제 2",
    "합병 정렬에서 보조 배열과 시간 복잡도의 관계를 묻는 문제",
    "다음 중 합병 정렬에 대해 맞는 것은? 단 입력 크기는 n이다.",
    ["입력과 같은 크기의 보조 배열 없이 구현할 수 없다.", "입력과 같은 크기의 보조 배열 없이 구현하려면 O(n^2) 시간이 소요된다.", "입력과 같은 크기의 보조 배열 없이 O(n log n) 시간에 구현할 수 있다.", "항상 n/2 크기의 배열 2개가 필요하다.", "답 없음"],
    "2",
    "일반적인 합병 정렬은 보조 배열을 사용해 O(n log n)에 정렬한다. 제자리 합병은 가능하지만 단순 구현에서는 시간이 커진다.",
    99,
    3,
    c3,
    "3. 분할 정복 알고리즘.pdf",
  ),
  {
    id: "c3-ex-003",
    chapter: 3,
    chapterTitle: c3,
    title: "연습문제 3",
    kind: "multiple-choice",
    conceptSummary: "퀵 정렬의 피봇 분할 방식과 별도 합병 과정이 없다는 특징을 확인하는 문제",
    prompt: "다음 중 퀵 정렬을 맞게 서술한 것은?",
    pdfFile: "3. 분할 정복 알고리즘.pdf",
    pageNumber: 99,
    options: [
      { id: "1", label: "입력을 비슷한 크기의 두 부분으로 합병하여 정렬한다." },
      { id: "2", label: "입력을 크기가 서로 다를 수 있는 두 부분으로 나누어 보조 배열 없이 정렬한다." },
      { id: "3", label: "중앙값을 찾아 피봇으로 삼아 두 부분으로 나누어 정렬한다." },
      { id: "4", label: "이웃한 원소끼리 비교하여 자리바꿈을 수행하여 정렬한다." },
      { id: "5", label: "답 없음" },
    ],
    answers: ["2"],
    answerText: "② 입력을 크기가 서로 다를 수 있는 두 부분으로 나누어 보조 배열 없이 정렬한다.",
    hint: "퀵 정렬은 피봇을 기준으로 작은 값과 큰 값의 영역을 나눕니다.",
    explanation: "퀵 정렬은 피봇 분할 후 각 부분을 재귀적으로 정렬하며, 합병 정렬처럼 별도의 합병 과정이 필요하지 않습니다.",
  },
  {
    id: "c4-ex-001",
    chapter: 4,
    chapterTitle: c4,
    title: "연습문제 1",
    kind: "fill-blank",
    conceptSummary: "그리디 알고리즘의 선택 기준과 대표 알고리즘의 핵심 용어를 확인하는 빈칸 문제",
    prompt: `다음의 괄호 안에 알맞은 단어를 채워 넣어라.

(1) 그리디 알고리즘은 데이터 간의 관계를 고려하지 않고 수행 과정에서 (        ) 최적값을 가진 데이터를 선택하며, 선택한 값들을 (        ) 문제의 최적해를 찾는다.

(2) 그리디 알고리즘은 문제의 최적해 속에 (        )의 최적해가 포함되어 있고, 부분문제의 해 속에 그보다 작은 (        )의 해가 포함되어 있다. 이를 (        ) 또는 (        )이라고 한다.

(3) 동전 거스름돈 문제를 해결하는 가장 간단한 방법은 (        ) 동전을 취하는 것이다.

(4) 크러스컬 알고리즘은 가중치가 가장 작으면서 (        )을 만들지 않는 간선을 추가시켜 트리를 만든다.

(5) 프림 알고리즘은 현재까지 만들어진 트리에 (        )의 가중치로 연결되는 간선을 트리에 추가시킨다.

(6) 다익스트라 알고리즘은 출발점으로부터 최단 거리가 확정되지 않은 점들 중에서 출발점으로부터 가장 (        ) 점을 추가하고, 그 점의 최단 거리를 확정한다.`,
    pdfFile: "4. 그리디 알고리즘.pdf",
    pageNumber: 135,
    answers: ["현재", "모아", "부분문제", "부분문제", "최적 부분 구조", "최적성의 원리", "가장 큰", "사이클", "최소", "가까운"],
    answerText: "현재 / 모아 / 부분문제 / 부분문제 / 최적 부분 구조 / 최적성의 원리 / 가장 큰 / 사이클 / 최소 / 가까운",
    hint: "그리디는 매 순간의 최선 선택, MST는 사이클 방지와 최소 간선 선택이 핵심입니다.",
    explanation: "그리디 알고리즘은 지역적으로 가장 좋아 보이는 선택을 반복해 해를 구성합니다.",
  },
  {
    id: "c4-ex-060",
    chapter: 4,
    chapterTitle: c4,
    title: "연습문제 60",
    kind: "essay",
    conceptSummary: "허프만 코딩에서 빈도수가 낮은 문자부터 결합해 접두부 코드를 만드는 문제",
    prompt: `입력 파일이 4개의 문자로 되어 있고, 각 문자의 빈도수는 다음과 같을 때 Huffman Coding 알고리즘을 적용하여 각 문자의 코드를 구하라.

A: 60, B: 50, C: 150, D: 70`,
    pdfFile: "4. 그리디 알고리즘.pdf",
    pageNumber: 160,
    answerText: "빈도수 50과 60을 먼저 합치고, 그 결과와 70을 합친 뒤 150과 합친다. 좌우 0/1 배정에 따라 코드는 여러 형태가 가능하다.",
    hint: "가장 작은 빈도 두 개를 반복해서 합칩니다.",
    explanation: "허프만 코딩은 빈도수가 낮은 문자일수록 깊은 쪽에 배치되어 긴 코드를 받습니다.",
  },
  {
    id: "c4-ex-065",
    chapter: 4,
    chapterTitle: c4,
    title: "연습문제 65",
    kind: "essay",
    conceptSummary: "자동차 주유 문제에서 현재 위치에서 갈 수 있는 가장 먼 주유소를 고르는 그리디 전략을 증명하는 문제",
    prompt: "가득 찬 연료 탱크를 가지고 C km를 주행할 수 있는 자동차로 도시 A에서 도시 B로 가는 데 필요한 최소 주유 횟수를 찾기 위한 알고리즘을 제안하고, 제안한 알고리즘이 왜 최소 횟수의 주유만으로 A로부터 B에 도착할 수 있는지를 설명하라.",
    pdfFile: "4. 그리디 알고리즘.pdf",
    pageNumber: 165,
    answerText: "현재 위치에서 도달 가능한 주유소 중 가장 먼 주유소까지 이동해 주유한다. 더 가까운 곳에서 주유하는 해는 가장 먼 곳에서 주유하는 해로 교환해도 주유 횟수가 늘지 않으므로 그리디 선택이 안전하다.",
    hint: "현재 연료로 갈 수 있는 범위 안에서 가장 멀리 가는 선택을 생각하세요.",
    explanation: "가장 멀리 갈 수 있는 지점을 선택하면 남은 거리가 최소화되고, 더 이른 주유 선택보다 불리하지 않습니다.",
  },
  {
    id: "c4-ex-066",
    chapter: 4,
    chapterTitle: c4,
    title: "연습문제 66",
    kind: "essay",
    conceptSummary: "색 간선이 있는 그래프에서 특정 색을 최대한 많이 포함하는 신장트리를 구성하는 문제",
    prompt: "하나의 연결성분으로 되어 있는 그래프에 간선들이 다양한 색으로 칠해져 있다. 그래프의 모든 점들을 n-1개의 간선으로 연결하되, 특정 색 간선을 가장 많이 사용하여 연결하는 알고리즘을 작성하라. 단, 그래프의 정점의 수는 n이다.",
    pdfFile: "4. 그리디 알고리즘.pdf",
    pageNumber: 166,
    answerText: "원하는 색 간선에 더 작은 가중치를 주고 나머지 간선에 큰 가중치를 준 뒤 크러스컬 알고리즘을 적용한다. 또는 원하는 색 간선을 먼저 사이클이 생기지 않는 한 추가하고, 이후 나머지 간선으로 연결을 완성한다.",
    hint: "크러스컬 알고리즘의 간선 선택 순서를 원하는 색 우선으로 바꿔 보세요.",
    explanation: "사이클을 만들지 않는 범위에서 원하는 색 간선을 먼저 선택하면 그 색을 최대한 많이 포함하는 신장트리를 만들 수 있습니다.",
  },
];

const exerciseNumber = (exercise: ExerciseProblem) => Number(exercise.title.match(/\d+/)?.[0] ?? 0);

const compareExercises = (left: ExerciseProblem, right: ExerciseProblem) => {
  if (left.chapter !== right.chapter) return left.chapter - right.chapter;
  const leftNumber = exerciseNumber(left);
  const rightNumber = exerciseNumber(right);
  if (leftNumber !== rightNumber) return leftNumber - rightNumber;
  return left.id.localeCompare(right.id);
};

const sortedGeneratedExerciseProblems = generatedExerciseProblems.sort(compareExercises);

export const exerciseProblems: ExerciseProblem[] = [
  ...curatedExerciseProblems.filter((exercise) => exercise.chapter !== 2),
  ...chapter2Exercises,
  ...sortedGeneratedExerciseProblems,
].sort(compareExercises);

export const exerciseChapters = [
  { chapter: 1, title: c1 },
  { chapter: 2, title: c2 },
  { chapter: 3, title: c3 },
  { chapter: 4, title: c4 },
];
