import type { RunResult } from "../types/problem";

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideInstance>;
  }
}

type PyodideInstance = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideInstance> | null = null;

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Pyodide 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

const getPyodide = async (): Promise<PyodideInstance> => {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const indexURL = `${window.location.origin}/pyodide/`;
      await loadScript(`${indexURL}pyodide.js`);
      if (!window.loadPyodide) {
        throw new Error("loadPyodide를 찾을 수 없습니다.");
      }
      return window.loadPyodide({ indexURL });
    })();
  }
  return pyodidePromise;
};

const buildPythonHarness = (code: string, input: string): string => `
import sys, io
sys.stdin = io.StringIO(${JSON.stringify(input)})
${code}
`;

export const runCode = async (code: string, input: string): Promise<RunResult> => {
  try {
    const pyodide = await getPyodide();
    let output = "";
    let errorOutput = "";

    pyodide.setStdout({ batched: (text) => (output += text) });
    pyodide.setStderr({ batched: (text) => (errorOutput += text) });
    await pyodide.runPythonAsync(buildPythonHarness(code, input));

    return { output: output.trimEnd(), error: errorOutput.trim() || undefined };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "알 수 없는 실행 오류가 발생했습니다.",
    };
  }
};
