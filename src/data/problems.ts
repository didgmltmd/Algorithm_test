import type { Concept, Difficulty, Problem, TestCase } from "../types/problem";

const chapterTitles: Record<number, string> = {
  1: "알고리즘의 첫걸음",
  2: "알고리즘을 배우기 위한 준비",
  3: "분할 정복 알고리즘",
  4: "그리디 알고리즘",
};

const pdfFiles: Record<number, string> = {
  1: "1. 알고리즘의 첫걸음.pdf",
  2: "2. 알고리즘을 배우기 위한 준비.pdf",
  3: "3. 분할 정복 알고리즘.pdf",
  4: "4. 그리디 알고리즘.pdf",
};

const starter = (body: string) => `import sys

def solve():
${body
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}

if __name__ == "__main__":
    solve()
`;

const blankStarter = (guide: string): string =>
  starter(`# ${guide}
# 아래에 풀이를 작성하세요.
pass`);

const tc = (input: string, output: string): TestCase => ({ input, output });

const concept = (
  summary: string,
  timeComplexity: string,
  spaceComplexity: string,
  examPoint: string,
  commonMistakes: string[] = ["입력 형식을 다르게 해석함", "출력 공백 또는 줄바꿈 형식을 맞추지 못함"],
  steps: string[] = ["입력을 파싱한다.", "PDF 예제 알고리즘의 핵심 연산을 구현한다.", "요구한 형식으로 결과를 출력한다."],
): Concept => ({
  summary,
  steps,
  timeComplexity,
  spaceComplexity,
  pdfPoint: "PDF의 의사코드와 Python 구현 예제에서 입력, 반복 조건, 반환값을 함께 확인한다.",
  examPoint,
  commonMistakes,
});

const problem = (
  id: string,
  chapter: number,
  title: string,
  difficulty: Difficulty,
  algorithm: string,
  pageNumber: number,
  description: string,
  inputDescription: string,
  outputDescription: string,
  sampleInput: string,
  sampleOutput: string,
  solutionCode: string,
  conceptData: Concept,
  testCases: TestCase[],
  hint = "PDF의 예제 코드에서 입력 부분만 문제 형식에 맞게 바꾸고, 핵심 함수는 그대로 구현해보세요.",
): Problem => ({
  id,
  chapter,
  chapterTitle: `Chapter ${chapter}. ${chapterTitles[chapter]}`,
  title,
  difficulty,
  algorithm,
  pdfFile: pdfFiles[chapter],
  pageNumber,
  description,
  inputDescription,
  outputDescription,
  sampleInput,
  sampleOutput,
  starterCode: blankStarter(`${algorithm} 예제 알고리즘을 구현하세요.`),
  solutionCode,
  concept: conceptData,
  testCases,
  hint,
});

const printList = "print(' '.join(map(str, arr)))";

export const problems: Problem[] = [
  problem(
    "c1-max-number",
    1,
    "최대 숫자 찾기",
    "하",
    "기초 반복",
    20,
    "N개의 정수 중 가장 큰 값을 찾는다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "가장 큰 정수를 출력한다.",
    "5\n3 9 1 7 4",
    "9",
    starter(`n = int(sys.stdin.readline())
numbers = list(map(int, sys.stdin.readline().split()))
max_value = numbers[0]
for number in numbers[1:]:
    if number > max_value:
        max_value = number
print(max_value)`),
    concept("처음 원소를 기준으로 잡고 모든 원소를 한 번씩 비교한다.", "O(n)", "O(1)", "초기값을 첫 원소로 두어 음수 입력도 처리한다."),
    [tc("5\n3 9 1 7 4", "9"), tc("4\n-5 -2 -9 -1", "-1")],
  ),
  problem(
    "c1-find-random-number",
    1,
    "임의의 숫자 찾기",
    "하",
    "탐색",
    26,
    "목표 숫자가 배열에 있는지 확인하고 처음 위치를 출력한다.",
    "첫 줄에 N과 target, 둘째 줄에 N개의 정수가 주어진다.",
    "존재하면 0부터 시작하는 인덱스, 없으면 -1을 출력한다.",
    "6 7\n4 1 7 9 7 2",
    "2",
    starter(`n, target = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
answer = -1
for i in range(n):
    if arr[i] == target:
        answer = i
        break
print(answer)`),
    concept("배열의 앞에서부터 목표값과 같은지 하나씩 확인한다.", "O(n)", "O(1)", "찾은 즉시 종료해야 첫 위치가 된다."),
    [tc("6 7\n4 1 7 9 7 2", "2"), tc("3 8\n1 2 3", "-1")],
  ),
  problem(
    "c1-linear-search",
    1,
    "순차 탐색",
    "하",
    "순차 탐색",
    27,
    "PDF의 search(arr, x) 예제처럼 앞에서부터 순서대로 탐색한다.",
    "첫 줄에 N과 x, 둘째 줄에 N개의 정수가 주어진다.",
    "x의 0-based 인덱스를 출력하고 없으면 -1을 출력한다.",
    "5 11\n3 8 11 2 7",
    "2",
    starter(`n, x = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
def search(arr, x):
    for i in range(len(arr)):
        if arr[i] == x:
            return i
    return -1
print(search(arr, x))`),
    concept("정렬 여부와 관계없이 처음부터 끝까지 비교하는 가장 단순한 탐색이다.", "O(n)", "O(1)", "최악의 경우 모든 원소를 비교한다."),
    [tc("5 11\n3 8 11 2 7", "2"), tc("4 6\n1 2 3 4", "-1")],
  ),
  problem(
    "c1-binary-search",
    1,
    "이진 탐색",
    "중",
    "이진 탐색",
    35,
    "정렬된 배열에서 중간값을 기준으로 탐색 범위를 절반씩 줄인다.",
    "첫 줄에 N과 target, 둘째 줄에 오름차순 정렬된 N개의 정수가 주어진다.",
    "target의 0-based 인덱스를 출력하고 없으면 -1을 출력한다.",
    "7 8\n1 3 5 8 13 21 34",
    "3",
    starter(`n, target = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
left, right = 0, n - 1
answer = -1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        answer = mid
        break
    if arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
print(answer)`),
    concept("정렬된 입력에서 중간 원소와 비교하여 탐색 범위를 반으로 줄인다.", "O(log n)", "O(1)", "정렬 조건과 left/right 갱신식을 정확히 써야 한다."),
    [tc("7 8\n1 3 5 8 13 21 34", "3"), tc("5 4\n1 2 3 5 8", "-1")],
  ),
  problem(
    "c1-basic-change",
    1,
    "동전 거스름돈 기초 문제",
    "하",
    "기초 그리디",
    52,
    "큰 단위 동전부터 가능한 만큼 선택해 거스름돈 동전 수를 구한다.",
    "첫 줄에 금액이 주어진다.",
    "필요한 동전 수를 출력한다.",
    "1260",
    "6",
    starter(`change = int(sys.stdin.readline())
coins = [500, 100, 50, 10, 1]
count = 0
for coin in coins:
    count += change // coin
    change %= coin
print(count)`),
    concept("현재 남은 금액에서 가장 큰 동전을 먼저 선택한다.", "O(k)", "O(1)", "그리디가 항상 맞는 동전 체계인지 구분해야 한다."),
    [tc("1260", "6"), tc("780", "6")],
  ),
  problem(
    "c2-euclid-gcd",
    2,
    "유클리드 최대공약수 알고리즘",
    "하",
    "유클리드 호제법",
    7,
    "gcd(a, b) = gcd(b, a mod b)를 이용해 최대공약수를 구한다.",
    "첫 줄에 a와 b가 주어진다.",
    "최대공약수를 출력한다.",
    "48 18",
    "6",
    starter(`a, b = map(int, sys.stdin.readline().split())
while b != 0:
    a, b = b, a % b
print(a)`),
    concept("나머지가 0이 될 때까지 두 수를 b, a % b로 갱신한다.", "O(log min(a,b))", "O(1)", "b가 0일 때의 a가 최대공약수다."),
    [tc("48 18", "6"), tc("1071 462", "21")],
  ),
  problem(
    "c2-recursive-gcd",
    2,
    "재귀 방식 GCD",
    "하",
    "재귀 GCD",
    9,
    "PDF의 get_gcd_recursive 예제처럼 재귀 함수로 최대공약수를 구한다.",
    "첫 줄에 a와 b가 주어진다.",
    "최대공약수를 출력한다.",
    "20 8",
    "4",
    starter(`a, b = map(int, sys.stdin.readline().split())
def get_gcd_recursive(a, b):
    if b == 0:
        return a
    return get_gcd_recursive(b, a % b)
print(get_gcd_recursive(a, b))`),
    concept("종료 조건 b == 0과 재귀 호출 gcd(b, a % b)가 핵심이다.", "O(log min(a,b))", "O(log min(a,b))", "return 누락과 종료 조건 누락을 조심한다."),
    [tc("20 8", "4"), tc("81 27", "27")],
  ),
  problem(
    "c2-iterative-gcd",
    2,
    "반복문 방식 GCD",
    "하",
    "반복 GCD",
    10,
    "PDF의 get_gcd_with_mod 예제처럼 while 반복문으로 최대공약수를 구한다.",
    "첫 줄에 a와 b가 주어진다.",
    "최대공약수를 출력한다.",
    "24 36",
    "12",
    starter(`a, b = map(int, sys.stdin.readline().split())
def get_gcd_with_mod(a, b):
    while b != 0:
        a, b = b, a % b
    return a
print(get_gcd_with_mod(a, b))`),
    concept("재귀 GCD와 같은 상태 전이를 while문으로 표현한다.", "O(log min(a,b))", "O(1)", "재귀와 반복 구현의 공간 복잡도 차이를 비교한다."),
    [tc("24 36", "12"), tc("100 35", "5")],
  ),
  problem(
    "c2-math-gcd",
    2,
    "math.gcd 활용 예제",
    "하",
    "math.gcd",
    12,
    "PDF의 get_gcd_builtin 예제처럼 Python 표준 라이브러리로 최대공약수를 구한다.",
    "첫 줄에 a와 b가 주어진다.",
    "최대공약수를 출력한다.",
    "42 56",
    "14",
    starter(`import math
a, b = map(int, sys.stdin.readline().split())
print(math.gcd(a, b))`),
    concept("표준 라이브러리 math.gcd는 유클리드 호제법을 안전하게 제공한다.", "O(log min(a,b))", "O(1)", "직접 구현 문제인지 라이브러리 사용 가능 문제인지 구분한다."),
    [tc("42 56", "14"), tc("17 13", "1")],
  ),
  problem(
    "c2-max-pseudocode",
    2,
    "최대 숫자 찾기 의사코드 구현",
    "하",
    "의사코드 변환",
    18,
    "PDF의 find_max_with_loop 예제를 입력 기반 프로그램으로 구현한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "최댓값을 출력한다.",
    "3\n10 2 7",
    "10",
    starter(`n = int(sys.stdin.readline())
numbers = list(map(int, sys.stdin.readline().split()))
def find_max_with_loop(numbers):
    if not numbers:
        return "배열이 비어있습니다."
    max_num = numbers[0]
    for current_num in numbers[1:]:
        if current_num > max_num:
            max_num = current_num
    return max_num
print(find_max_with_loop(numbers))`),
    concept("말 또는 의사코드로 표현된 절차를 Python 함수와 반복문으로 옮긴다.", "O(n)", "O(1)", "반복 범위가 numbers[1:]인 이유를 설명할 수 있어야 한다."),
    [tc("3\n10 2 7", "10"), tc("5\n1 2 3 4 5", "5")],
  ),
  problem(
    "c2-complexity-class",
    2,
    "시간 복잡도 구분 문제",
    "중",
    "시간 복잡도",
    96,
    "반복 구조 유형을 Big-O로 분류한다. 1: 단일 반복, 2: 이중 반복, 3: 절반 감소 반복.",
    "첫 줄에 유형 번호가 주어진다.",
    "O(n), O(n^2), O(log n) 중 하나를 출력한다.",
    "3",
    "O(log n)",
    starter(`kind = int(sys.stdin.readline())
if kind == 1:
    print("O(n)")
elif kind == 2:
    print("O(n^2)")
elif kind == 3:
    print("O(log n)")`),
    concept("입력 크기 증가에 따른 기본 연산 횟수의 증가율을 분류한다.", "유형별", "O(1)", "상수 계수보다 증가 차수를 본다."),
    [tc("1", "O(n)"), tc("2", "O(n^2)"), tc("3", "O(log n)")],
  ),
  problem(
    "c2-algorithm-category",
    2,
    "알고리즘 분류 개념 문제",
    "하",
    "알고리즘 분류",
    50,
    "번호에 맞는 알고리즘 분류명을 출력한다. 1 정렬, 2 그래프, 3 기하, 4 그리디.",
    "첫 줄에 번호가 주어진다.",
    "분류명을 한글로 출력한다.",
    "4",
    "그리디",
    starter(`kind = int(sys.stdin.readline())
categories = {1: "정렬", 2: "그래프", 3: "기하", 4: "그리디"}
print(categories[kind])`),
    concept("문제의 목표와 해결 방식에 따라 알고리즘 범주를 구분한다.", "O(1)", "O(1)", "분할 정복, 그리디, 동적 계획의 선택 기준을 구분한다."),
    [tc("1", "정렬"), tc("4", "그리디")],
  ),
  problem(
    "c3-merge-sort",
    3,
    "합병 정렬 구현",
    "중",
    "합병 정렬",
    30,
    "PDF의 merge_sort와 merge 함수 예제처럼 배열을 오름차순 정렬한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "정렬된 배열을 공백으로 출력한다.",
    "5\n5 2 4 1 3",
    "1 2 3 4 5",
    starter(`n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
arr = merge_sort(arr)
${printList}`),
    concept("배열을 반으로 나누고 정렬된 두 부분 배열을 병합한다.", "O(n log n)", "O(n)", "분할 단계와 병합 단계의 역할을 구분한다."),
    [tc("5\n5 2 4 1 3", "1 2 3 4 5"), tc("4\n4 3 2 1", "1 2 3 4")],
  ),
  problem(
    "c3-merge-function",
    3,
    "합병 함수 구현",
    "중",
    "합병",
    32,
    "이미 정렬된 두 배열을 PDF의 merge 함수 방식으로 하나로 합친다.",
    "첫 줄에 n m, 둘째 줄과 셋째 줄에 정렬된 배열이 주어진다.",
    "합쳐진 정렬 배열을 출력한다.",
    "3 3\n1 4 7\n2 3 9",
    "1 2 3 4 7 9",
    starter(`n, m = map(int, sys.stdin.readline().split())
left = list(map(int, sys.stdin.readline().split()))
right = list(map(int, sys.stdin.readline().split()))
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
arr = merge(left, right)
${printList}`),
    concept("두 정렬 리스트의 앞 원소를 비교해 작은 값부터 결과에 추가한다.", "O(n+m)", "O(n+m)", "한쪽 리스트가 먼저 끝난 뒤 남은 원소를 붙여야 한다."),
    [tc("3 3\n1 4 7\n2 3 9", "1 2 3 4 7 9"), tc("2 4\n1 10\n2 3 4 5", "1 2 3 4 5 10")],
  ),
  problem(
    "c3-bottom-up-merge",
    3,
    "반복적 Bottom-Up 합병 정렬",
    "상",
    "Bottom-Up 합병 정렬",
    38,
    "PDF의 iterative_merge_sort 예제처럼 구간 너비를 1, 2, 4로 늘리며 정렬한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "정렬된 배열을 출력한다.",
    "6\n6 1 5 2 4 3",
    "1 2 3 4 5 6",
    starter(`n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
def merge(arr, low, mid, high):
    left = arr[low:mid]
    right = arr[mid:high]
    i = j = 0
    k = low
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]
        i += 1
        k += 1
    while j < len(right):
        arr[k] = right[j]
        j += 1
        k += 1
def iterative_merge_sort(arr):
    width = 1
    n = len(arr)
    while width < n:
        for low in range(0, n, 2 * width):
            mid = min(low + width, n)
            high = min(low + 2 * width, n)
            merge(arr, low, mid, high)
        width *= 2
    return arr
arr = iterative_merge_sort(arr)
${printList}`),
    concept("재귀 호출 없이 작은 정렬 구간을 반복적으로 병합한다.", "O(n log n)", "O(n)", "구간 경계 low, mid, high의 의미가 핵심이다."),
    [tc("6\n6 1 5 2 4 3", "1 2 3 4 5 6")],
  ),
  problem(
    "c3-quick-sort",
    3,
    "퀵 정렬 구현",
    "중",
    "퀵 정렬",
    73,
    "PDF의 quick_sort_simple 예제처럼 피봇 기준으로 작은 값, 같은 값, 큰 값을 나눠 정렬한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "정렬된 배열을 출력한다.",
    "5\n3 1 4 5 2",
    "1 2 3 4 5",
    starter(`n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
def quick_sort_simple(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort_simple(left) + middle + quick_sort_simple(right)
arr = quick_sort_simple(arr)
${printList}`),
    concept("피봇보다 작은 부분과 큰 부분을 재귀적으로 정렬한다.", "평균 O(n log n), 최악 O(n^2)", "O(n)", "피봇 선택에 따라 성능이 달라진다."),
    [tc("5\n3 1 4 5 2", "1 2 3 4 5"), tc("5\n2 2 1 3 2", "1 2 2 2 3")],
  ),
  problem(
    "c3-partition",
    3,
    "피봇 기준 분할 구현",
    "중",
    "분할",
    76,
    "PDF의 partition 예제처럼 마지막 원소를 피봇으로 두고 Lomuto 분할을 수행한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "분할 후 배열을 출력한다.",
    "5\n4 2 5 1 3",
    "2 1 3 4 5",
    starter(`n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
partition(arr, 0, n - 1)
${printList}`),
    concept("피봇 이하 원소를 왼쪽으로 모으고 마지막에 피봇을 제 위치로 보낸다.", "O(n)", "O(1)", "i와 j 포인터의 의미를 정확히 이해한다."),
    [tc("5\n4 2 5 1 3", "2 1 3 4 5")],
  ),
  problem(
    "c3-insertion-sort",
    3,
    "삽입 정렬 구현",
    "하",
    "삽입 정렬",
    64,
    "앞쪽의 정렬된 구간에 현재 원소를 삽입한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "정렬된 배열을 출력한다.",
    "5\n9 1 3 2 8",
    "1 2 3 8 9",
    starter(`n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
for i in range(1, n):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key
${printList}`),
    concept("현재 원소를 이미 정렬된 왼쪽 부분의 알맞은 위치에 끼워 넣는다.", "O(n^2)", "O(1)", "거의 정렬된 입력에서 효율적인 이유를 이해한다."),
    [tc("5\n9 1 3 2 8", "1 2 3 8 9")],
  ),
  problem(
    "c3-selection",
    3,
    "선택 문제",
    "중",
    "선택 알고리즘",
    109,
    "배열에서 k번째로 작은 값을 찾는다.",
    "첫 줄에 N K, 둘째 줄에 N개의 정수가 주어진다.",
    "k번째로 작은 값을 출력한다.",
    "5 2\n8 1 4 2 9",
    "2",
    starter(`n, k = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
def naive_selection(arr, k):
    if k < 1 or k > len(arr):
        return None
    return sorted(arr)[k - 1]
print(naive_selection(arr, k))`),
    concept("정렬 후 k-1 인덱스를 반환하는 기본 선택 문제 예제다.", "O(n log n)", "O(n)", "k가 1부터 시작한다는 점을 놓치지 않는다."),
    [tc("5 2\n8 1 4 2 9", "2"), tc("6 4\n6 5 4 3 2 1", "4")],
  ),
  problem(
    "c3-closest-pair",
    3,
    "최근접 점의 쌍 찾기 기초 문제",
    "상",
    "최근접 점",
    120,
    "2차원 점들 중 가장 가까운 두 점 거리의 제곱을 완전탐색으로 구한다.",
    "첫 줄에 N, 다음 N줄에 x y 좌표가 주어진다.",
    "최소 거리의 제곱을 출력한다.",
    "3\n0 0\n3 4\n1 1",
    "2",
    starter(`n = int(sys.stdin.readline())
points = [tuple(map(int, sys.stdin.readline().split())) for _ in range(n)]
answer = float("inf")
for i in range(n):
    for j in range(i + 1, n):
        dx = points[i][0] - points[j][0]
        dy = points[i][1] - points[j][1]
        answer = min(answer, dx * dx + dy * dy)
print(answer)`),
    concept("분할 정복 최근접 점 알고리즘을 배우기 전, 모든 점 쌍을 비교하는 기초 구현이다.", "O(n^2)", "O(1)", "거리 비교에는 제곱 거리만으로 충분하다."),
    [tc("3\n0 0\n3 4\n1 1", "2")],
  ),
  problem(
    "c4-coin-change",
    4,
    "동전 거스름돈 문제",
    "하",
    "CoinChange",
    10,
    "PDF의 CoinChange 알고리즘처럼 500,100,50,10,1원 동전 개수를 구한다.",
    "첫 줄에 거스름돈 금액이 주어진다.",
    "총 동전 수를 출력한다.",
    "1260",
    "6",
    starter(`change = int(sys.stdin.readline())
coins = [500, 100, 50, 10, 1]
total = 0
for coin in coins:
    total += change // coin
    change %= coin
print(total)`),
    concept("가장 큰 액면 동전을 먼저 선택하는 그리디 알고리즘이다.", "O(k)", "O(1)", "동전 단위가 그리디 최적성을 보장하는지 확인한다."),
    [tc("1260", "6"), tc("200", "2")],
  ),
  problem(
    "c4-greedy-fail-coin",
    4,
    "그리디가 실패하는 동전 예제",
    "중",
    "그리디 한계",
    15,
    "PDF의 160원 동전 예시처럼 그리디가 항상 최적이 아님을 확인한다.",
    "첫 줄에 금액, 둘째 줄에 동전 종류가 큰 순서로 주어진다.",
    "그리디 동전 수와 최적 동전 수를 공백으로 출력한다.",
    "200\n160 100 50 10 1",
    "5 2",
    starter(`amount = int(sys.stdin.readline())
coins = list(map(int, sys.stdin.readline().split()))
remain = amount
greedy_count = 0
for coin in coins:
    greedy_count += remain // coin
    remain %= coin
dp = [10**9] * (amount + 1)
dp[0] = 0
for value in range(1, amount + 1):
    for coin in coins:
        if value >= coin:
            dp[value] = min(dp[value], dp[value - coin] + 1)
print(greedy_count, dp[amount])`),
    concept("그리디 선택이 항상 전체 최적해를 만들지는 않는다.", "O(amount*k)", "O(amount)", "반례를 통해 그리디 적용 조건을 판단한다."),
    [tc("200\n160 100 50 10 1", "5 2"), tc("6\n4 3 1", "3 2")],
  ),
  problem(
    "c4-kruskal",
    4,
    "크루스칼 MST",
    "상",
    "Kruskal",
    69,
    "간선을 가중치 오름차순으로 선택하며 사이클이 생기지 않게 MST 비용을 구한다.",
    "첫 줄에 V E, 다음 E줄에 u v w가 주어진다.",
    "MST 총 비용을 출력한다.",
    "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5",
    "7",
    starter(`v, e = map(int, sys.stdin.readline().split())
edges = [tuple(map(int, sys.stdin.readline().split())) for _ in range(e)]
parent = [i for i in range(v + 1)]
def find_parent(x):
    if parent[x] != x:
        parent[x] = find_parent(parent[x])
    return parent[x]
def union_parent(a, b):
    a = find_parent(a)
    b = find_parent(b)
    if a < b:
        parent[b] = a
    else:
        parent[a] = b
edges.sort(key=lambda x: x[2])
cost = 0
for a, b, weight in edges:
    if find_parent(a) != find_parent(b):
        union_parent(a, b)
        cost += weight
print(cost)`),
    concept("Union-Find로 사이클 여부를 검사하며 가장 가벼운 간선부터 추가한다.", "O(m log m)", "O(n)", "간선 정렬과 사이클 검사가 핵심이다."),
    [tc("4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5", "7")],
  ),
  problem(
    "c4-union-find",
    4,
    "Union-Find 구현",
    "중",
    "Union-Find",
    70,
    "서로소 집합 자료구조로 union 연산과 같은 집합 판정을 처리한다.",
    "첫 줄에 N M, 다음 M줄에 op a b가 주어진다. op=0은 union, op=1은 질의다.",
    "질의마다 YES 또는 NO를 출력한다.",
    "4 3\n0 1 2\n0 3 4\n1 1 4",
    "NO",
    starter(`n, m = map(int, sys.stdin.readline().split())
parent = [i for i in range(n + 1)]
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
def union(a, b):
    a = find(a)
    b = find(b)
    if a != b:
        parent[max(a, b)] = min(a, b)
answers = []
for _ in range(m):
    op, a, b = map(int, sys.stdin.readline().split())
    if op == 0:
        union(a, b)
    else:
        answers.append("YES" if find(a) == find(b) else "NO")
print("\\n".join(answers))`),
    concept("대표 부모를 찾아 집합을 합치고, 경로 압축으로 탐색을 줄인다.", "거의 O(1)", "O(n)", "find의 재귀 반환값을 parent[x]에 저장하는 것이 중요하다."),
    [tc("4 3\n0 1 2\n0 3 4\n1 1 4", "NO"), tc("3 3\n0 1 2\n1 1 2\n1 2 3", "YES\nNO")],
  ),
  problem(
    "c4-prim",
    4,
    "프림 MST",
    "상",
    "Prim",
    75,
    "하나의 정점에서 시작해 현재 트리에 연결되는 가장 작은 간선을 선택한다.",
    "첫 줄에 V E, 다음 E줄에 u v w가 주어진다.",
    "MST 총 비용을 출력한다.",
    "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5",
    "7",
    starter(`import heapq
v, e = map(int, sys.stdin.readline().split())
graph = [[] for _ in range(v + 1)]
for _ in range(e):
    a, b, w = map(int, sys.stdin.readline().split())
    graph[a].append((w, b))
    graph[b].append((w, a))
visited = [False] * (v + 1)
heap = [(0, 1)]
cost = 0
while heap:
    weight, node = heapq.heappop(heap)
    if visited[node]:
        continue
    visited[node] = True
    cost += weight
    for next_weight, next_node in graph[node]:
        if not visited[next_node]:
            heapq.heappush(heap, (next_weight, next_node))
print(cost)`),
    concept("현재 트리에서 바깥 정점으로 나가는 최소 간선을 우선순위 큐로 선택한다.", "O(m log n)", "O(n+m)", "크루스칼은 간선 중심, 프림은 정점 확장 중심이다."),
    [tc("4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5", "7")],
  ),
  problem(
    "c4-dijkstra",
    4,
    "다익스트라 최단 경로",
    "상",
    "Dijkstra",
    107,
    "우선순위 큐로 현재까지 가장 가까운 정점을 선택해 최단 거리를 확정한다.",
    "첫 줄에 V E S, 다음 E줄에 u v w가 주어진다.",
    "S에서 1..V까지의 최단 거리를 공백으로 출력한다. 도달 불가는 INF로 출력한다.",
    "4 4 1\n1 2 2\n1 3 5\n2 3 1\n3 4 2",
    "0 2 3 5",
    starter(`import heapq
v, e, start = map(int, sys.stdin.readline().split())
graph = [[] for _ in range(v + 1)]
for _ in range(e):
    a, b, w = map(int, sys.stdin.readline().split())
    graph[a].append((b, w))
INF = 10**18
dist = [INF] * (v + 1)
dist[start] = 0
queue = [(0, start)]
while queue:
    current_dist, node = heapq.heappop(queue)
    if current_dist > dist[node]:
        continue
    for next_node, weight in graph[node]:
        new_dist = current_dist + weight
        if new_dist < dist[next_node]:
            dist[next_node] = new_dist
            heapq.heappush(queue, (new_dist, next_node))
print(" ".join("INF" if dist[i] == INF else str(dist[i]) for i in range(1, v + 1)))`),
    concept("음수 가중치가 없는 그래프에서 가장 짧은 후보 거리부터 확정한다.", "O(m log n)", "O(n+m)", "방문 처리보다 오래된 거리 후보를 건너뛰는 조건을 이해한다."),
    [tc("4 4 1\n1 2 2\n1 3 5\n2 3 1\n3 4 2", "0 2 3 5")],
  ),
  problem(
    "c4-fractional-knapsack",
    4,
    "부분 배낭 문제",
    "중",
    "Fractional Knapsack",
    134,
    "가치/무게 비율이 큰 물건부터 담아 최대 가치를 구한다.",
    "첫 줄에 N W, 다음 N줄에 weight value가 주어진다.",
    "최대 가치를 소수점 한 자리로 출력한다.",
    "3 50\n10 60\n20 100\n30 120",
    "240.0",
    starter(`n, capacity = map(int, sys.stdin.readline().split())
items = []
for _ in range(n):
    weight, value = map(float, sys.stdin.readline().split())
    items.append((value, weight))
items.sort(key=lambda item: item[0] / item[1], reverse=True)
total_value = 0.0
for value, weight in items:
    if capacity >= weight:
        capacity -= weight
        total_value += value
    else:
        total_value += value * (capacity / weight)
        break
print(f"{total_value:.1f}")`),
    concept("쪼갤 수 있는 물건은 단위 무게당 가치가 가장 큰 것부터 담는 그리디가 최적이다.", "O(n log n)", "O(n)", "0/1 배낭과 부분 배낭의 차이를 구분한다."),
    [tc("3 50\n10 60\n20 100\n30 120", "240.0")],
  ),
  problem(
    "c4-set-cover",
    4,
    "집합 커버 기초",
    "중",
    "Set Cover",
    170,
    "아직 덮지 못한 원소를 가장 많이 포함하는 부분집합을 반복 선택한다.",
    "첫 줄에 전체 원소 수 U와 부분집합 수 S, 다음 S줄에 이름 개수 원소들이 주어진다.",
    "선택한 부분집합 이름을 선택 순서대로 출력한다.",
    "5 3\nA 3 1 2 3\nB 2 3 4\nC 2 4 5",
    "A C",
    starter(`u, s = map(int, sys.stdin.readline().split())
universe = set(range(1, u + 1))
subsets = {}
for _ in range(s):
    parts = sys.stdin.readline().split()
    name = parts[0]
    elements = set(map(int, parts[2:]))
    subsets[name] = elements
covered = set()
selected = []
while covered != universe:
    best_name = None
    best_gain = set()
    for name, elements in subsets.items():
        gain = elements - covered
        if len(gain) > len(best_gain):
            best_name = name
            best_gain = gain
    selected.append(best_name)
    covered |= subsets[best_name]
print(" ".join(selected))`),
    concept("매 단계에서 새로 덮는 원소 수가 가장 큰 집합을 선택하는 근사 그리디다.", "O(U*S^2)", "O(U+S)", "집합 커버는 일반적으로 그리디가 근사해를 만든다."),
    [tc("5 3\nA 3 1 2 3\nB 2 3 4\nC 2 4 5", "A C")],
  ),
  problem(
    "c4-job-scheduling",
    4,
    "작업 스케줄링",
    "중",
    "Job Scheduling",
    204,
    "마감시간과 이익이 있는 작업을 이익이 큰 순서로 배치해 최대 이익을 구한다.",
    "첫 줄에 N, 다음 N줄에 deadline profit이 주어진다.",
    "최대 이익을 출력한다.",
    "4\n2 50\n1 10\n2 20\n1 30",
    "80",
    starter(`n = int(sys.stdin.readline())
jobs = []
for idx in range(n):
    deadline, profit = map(int, sys.stdin.readline().split())
    jobs.append((idx, deadline, profit))
jobs.sort(key=lambda job: job[2], reverse=True)
max_deadline = max(job[1] for job in jobs)
slots = [False] * (max_deadline + 1)
total_profit = 0
for _, deadline, profit in jobs:
    for day in range(deadline, 0, -1):
        if not slots[day]:
            slots[day] = True
            total_profit += profit
            break
print(total_profit)`),
    concept("가장 이익이 큰 작업부터 가능한 가장 늦은 빈 슬롯에 배치한다.", "O(n^2)", "O(n)", "마감일 안에서 가장 늦은 위치를 찾는 이유를 이해한다."),
    [tc("4\n2 50\n1 10\n2 20\n1 30", "80")],
  ),
  problem(
    "c4-huffman",
    4,
    "허프만 압축 기초",
    "중",
    "Huffman",
    242,
    "빈도수가 가장 작은 두 노드를 반복적으로 합쳐 허프만 트리의 총 비용을 구한다.",
    "첫 줄에 N, 둘째 줄에 N개의 빈도가 주어진다.",
    "총 병합 비용을 출력한다.",
    "4\n5 9 12 13",
    "68",
    starter(`import heapq
n = int(sys.stdin.readline())
heap = list(map(int, sys.stdin.readline().split()))
heapq.heapify(heap)
total_cost = 0
while len(heap) > 1:
    left = heapq.heappop(heap)
    right = heapq.heappop(heap)
    merged = left + right
    total_cost += merged
    heapq.heappush(heap, merged)
print(total_cost)`),
    concept("가장 낮은 빈도 두 개를 합치는 선택을 반복해 접두부 코드 트리를 만든다.", "O(n log n)", "O(n)", "최소 힙을 사용해야 매번 가장 작은 두 빈도를 빠르게 찾는다."),
    [tc("4\n5 9 12 13", "68"), tc("6\n45 13 12 16 9 5", "224")],
  ),
  problem(
    "c3-heapq-merge-sort",
    3,
    "heapq.merge 합병 정렬",
    "중",
    "heapq.merge",
    44,
    "PDF의 heapq.merge 예제처럼 정렬된 두 부분 배열을 표준 라이브러리로 병합한다.",
    "첫 줄에 N, 둘째 줄에 N개의 정수가 주어진다.",
    "정렬된 배열을 출력한다.",
    "5\n5 1 4 2 3",
    "1 2 3 4 5",
    starter(`import heapq
n = int(sys.stdin.readline())
arr = list(map(int, sys.stdin.readline().split()))
def merge_sort_with_heapq(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort_with_heapq(arr[:mid])
    right = merge_sort_with_heapq(arr[mid:])
    return list(heapq.merge(left, right))
arr = merge_sort_with_heapq(arr)
${printList}`),
    concept("정렬된 여러 시퀀스를 heapq.merge로 효율적으로 합칠 수 있다.", "O(n log n)", "O(n)", "heapq.merge는 입력 시퀀스가 이미 정렬되어 있다는 전제가 있다."),
    [tc("5\n5 1 4 2 3", "1 2 3 4 5")],
  ),
  problem(
    "c3-heap-selection",
    3,
    "힙 기반 선택 문제",
    "중",
    "Heap Selection",
    111,
    "PDF의 heap_selection 예제처럼 최소 힙에서 k번째 작은 값을 꺼낸다.",
    "첫 줄에 N K, 둘째 줄에 N개의 정수가 주어진다.",
    "k번째 작은 값을 출력한다.",
    "6 3\n9 1 5 2 8 3",
    "3",
    starter(`import heapq
n, k = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
heapq.heapify(arr)
for _ in range(k - 1):
    heapq.heappop(arr)
print(heapq.heappop(arr))`),
    concept("최소 힙은 가장 작은 값을 반복적으로 꺼내는 선택 문제에 사용할 수 있다.", "O(n + k log n)", "O(n)", "k번째를 얻으려면 k-1개를 먼저 제거한다."),
    [tc("6 3\n9 1 5 2 8 3", "3")],
  ),
  problem(
    "c3-median-of-medians",
    3,
    "Median of Medians 선택",
    "상",
    "Median of Medians",
    115,
    "PDF의 median_of_medians 예제처럼 피봇을 중앙값들의 중앙값으로 선택한다.",
    "첫 줄에 N K, 둘째 줄에 N개의 정수가 주어진다.",
    "k번째 작은 값을 출력한다.",
    "7 4\n9 1 8 2 7 3 6",
    "6",
    starter(`n, k = map(int, sys.stdin.readline().split())
arr = list(map(int, sys.stdin.readline().split()))
def median_of_medians(arr, k):
    if len(arr) <= 5:
        return sorted(arr)[k - 1]
    sublists = [arr[i:i + 5] for i in range(0, len(arr), 5)]
    medians = [sorted(sub)[len(sub) // 2] for sub in sublists]
    pivot = median_of_medians(medians, (len(medians) + 1) // 2)
    lows = [x for x in arr if x < pivot]
    highs = [x for x in arr if x > pivot]
    pivots = [x for x in arr if x == pivot]
    if k <= len(lows):
        return median_of_medians(lows, k)
    if k <= len(lows) + len(pivots):
        return pivot
    return median_of_medians(highs, k - len(lows) - len(pivots))
print(median_of_medians(arr, k))`),
    concept("좋은 피봇을 보장해 선택 문제의 최악 시간 복잡도를 개선한다.", "O(n)", "O(n)", "k가 1-based임을 재귀 호출에서도 유지한다."),
    [tc("7 4\n9 1 8 2 7 3 6", "6")],
  ),
  problem(
    "c4-max-spanning-tree",
    4,
    "최대 신장 트리",
    "중",
    "Maximum Spanning Tree",
    78,
    "크루스칼 알고리즘에서 간선을 내림차순으로 정렬해 최대 신장 트리 비용을 구한다.",
    "첫 줄에 V E, 다음 E줄에 u v w가 주어진다.",
    "최대 신장 트리 총 비용을 출력한다.",
    "4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5",
    "12",
    starter(`v, e = map(int, sys.stdin.readline().split())
edges = [tuple(map(int, sys.stdin.readline().split())) for _ in range(e)]
parent = [i for i in range(v + 1)]
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
def union(a, b):
    a, b = find(a), find(b)
    if a != b:
        parent[max(a, b)] = min(a, b)
edges.sort(key=lambda edge: edge[2], reverse=True)
cost = 0
for a, b, w in edges:
    if find(a) != find(b):
        union(a, b)
        cost += w
print(cost)`),
    concept("최소 신장 트리의 선택 기준을 반대로 바꾸면 최대 신장 트리를 만들 수 있다.", "O(m log m)", "O(n)", "사이클 검사는 최소/최대 신장 트리 모두 동일하다."),
    [tc("4 5\n1 2 1\n1 3 3\n2 3 2\n2 4 4\n3 4 5", "12")],
  ),
  problem(
    "c4-grid-dijkstra",
    4,
    "2D 격자 다익스트라",
    "중",
    "Grid Dijkstra",
    111,
    "PDF의 공장 맵 이동 예제처럼 0은 통로, 1은 벽인 격자에서 최단 칸 수를 구한다.",
    "첫 줄에 R C, 다음 R줄에 0/1 격자, 마지막 줄에 sr sc er ec가 주어진다.",
    "시작에서 도착까지 최소 이동 칸 수를 출력하고 불가능하면 -1을 출력한다.",
    "3 3\n0 0 0\n1 1 0\n0 0 0\n0 0 2 2",
    "4",
    starter(`import heapq
r, c = map(int, sys.stdin.readline().split())
grid = [list(map(int, sys.stdin.readline().split())) for _ in range(r)]
sr, sc, er, ec = map(int, sys.stdin.readline().split())
dist = [[10**9] * c for _ in range(r)]
dist[sr][sc] = 0
queue = [(0, sr, sc)]
directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
answer = -1
while queue:
    d, x, y = heapq.heappop(queue)
    if (x, y) == (er, ec):
        answer = d
        break
    if d > dist[x][y]:
        continue
    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == 0:
            nd = d + 1
            if nd < dist[nx][ny]:
                dist[nx][ny] = nd
                heapq.heappush(queue, (nd, nx, ny))
print(answer)`),
    concept("격자의 각 칸을 정점으로 보고 상하좌우 이동을 가중치 1 간선으로 본다.", "O(RC log RC)", "O(RC)", "벽과 범위 조건을 먼저 검사한다."),
    [tc("3 3\n0 0 0\n1 1 0\n0 0 0\n0 0 2 2", "4")],
  ),
  problem(
    "c4-job-scheduling-heap",
    4,
    "힙 최적화 작업 스케줄링",
    "상",
    "Heap Job Scheduling",
    207,
    "마감일 순으로 작업을 보며 최소 힙으로 선택한 작업들의 이익을 관리한다.",
    "첫 줄에 N, 다음 N줄에 deadline profit이 주어진다.",
    "최대 이익을 출력한다.",
    "5\n1 10\n2 50\n2 20\n1 30\n3 40",
    "120",
    starter(`import heapq
n = int(sys.stdin.readline())
jobs = [tuple(map(int, sys.stdin.readline().split())) for _ in range(n)]
jobs.sort()
heap = []
for deadline, profit in jobs:
    heapq.heappush(heap, profit)
    if len(heap) > deadline:
        heapq.heappop(heap)
print(sum(heap))`),
    concept("선택한 작업 수가 현재 마감일을 넘으면 가장 이익이 작은 작업을 제거한다.", "O(n log n)", "O(n)", "정렬 기준은 마감일, 힙 기준은 이익이다."),
    [tc("5\n1 10\n2 50\n2 20\n1 30\n3 40", "120")],
  ),
  problem(
    "c4-maximum-lateness",
    4,
    "최대 납기 지연 최소화",
    "중",
    "Earliest Deadline First",
    210,
    "PDF의 납기 지연 예제처럼 마감일이 빠른 작업부터 처리한다.",
    "첫 줄에 N, 다음 N줄에 duration deadline이 주어진다.",
    "최대 지연 시간을 출력한다.",
    "3\n3 4\n2 5\n4 7",
    "2",
    starter(`n = int(sys.stdin.readline())
jobs = [tuple(map(int, sys.stdin.readline().split())) for _ in range(n)]
jobs.sort(key=lambda job: job[1])
current_time = 0
max_lateness = 0
for duration, deadline in jobs:
    current_time += duration
    max_lateness = max(max_lateness, current_time - deadline)
print(max_lateness)`),
    concept("최대 지연 시간을 줄이는 대표 그리디는 마감일이 빠른 순서로 작업하는 것이다.", "O(n log n)", "O(n)", "지연 시간은 완료 시간 - 마감일이다."),
    [tc("3\n3 4\n2 5\n4 7", "2")],
  ),
];

export const chapters = Object.entries(chapterTitles).map(([chapter, title]) => ({
  chapter: Number(chapter),
  title: `Chapter ${chapter}. ${title}`,
}));
