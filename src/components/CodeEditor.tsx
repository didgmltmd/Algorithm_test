import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  code: string;
  onChange: (value: string) => void;
};

export const CodeEditor = ({ code, onChange }: CodeEditorProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
    <Editor
      height="430px"
      language="python"
      theme="vs-dark"
      value={code}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 4,
        automaticLayout: true,
      }}
      onChange={(value) => onChange(value ?? "")}
    />
  </div>
);
