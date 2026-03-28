import "./Editor.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

function Editor({ value, onChange }: EditorProps) {
  return (
    <textarea
      className="editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      placeholder="Markdown を入力..."
    />
  );
}

export default Editor;
