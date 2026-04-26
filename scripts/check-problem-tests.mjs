import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/data/problems.ts", import.meta.url), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    verbatimModuleSyntax: false,
  },
}).outputText;

const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const { problems } = await import(moduleUrl);

const normalize = (value) =>
  value
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join("\n");

const pythonCommands = process.platform === "win32" ? ["python", "py"] : ["python3", "python"];

const runPython = (code, input) => {
  const harness = `import sys, io\nsys.stdin = io.StringIO(${JSON.stringify(input)})\n${code}`;

  for (const command of pythonCommands) {
    const result = spawnSync(command, ["-c", harness], {
      encoding: "utf8",
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      timeout: 5000,
      windowsHide: true,
    });

    if (result.error?.code === "ENOENT") {
      continue;
    }

    return {
      command,
      output: result.stdout ?? "",
      error: result.error?.message || result.stderr || undefined,
      status: result.status,
    };
  }

  throw new Error(`No Python command found. Tried: ${pythonCommands.join(", ")}`);
};

const failures = [];
let totalCases = 0;

for (const problem of problems) {
  for (let index = 0; index < problem.testCases.length; index += 1) {
    totalCases += 1;
    const testCase = problem.testCases[index];
    const result = runPython(problem.solutionCode, testCase.input);
    const actual = normalize(result.output);
    const expected = normalize(testCase.output);

    if (result.status !== 0 || result.error || actual !== expected) {
      failures.push({
        id: problem.id,
        title: problem.title,
        caseIndex: index + 1,
        input: testCase.input,
        expected,
        actual,
        error: result.error,
      });
    }
  }
}

console.log(`Checked ${problems.length} problems / ${totalCases} test cases.`);

if (failures.length === 0) {
  console.log("All solutionCode outputs match expected test case outputs.");
  process.exit(0);
}

console.log(`${failures.length} mismatches found:`);
for (const failure of failures) {
  console.log(`\n[${failure.id}] case ${failure.caseIndex} ${failure.title}`);
  console.log(`input:\n${failure.input}`);
  console.log(`expected:\n${failure.expected}`);
  console.log(`actual:\n${failure.actual}`);
  if (failure.error) {
    console.log(`error:\n${failure.error}`);
  }
}

process.exit(1);
