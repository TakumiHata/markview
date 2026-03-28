import { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";
import { useMarp } from "./hooks/useMarp";
import "./App.css";

const DEFAULT_MARKDOWN = `---
marp: true
---

# Hello Markview

Marp スライドプレビューアプリへようこそ!

---

## スライド 2

- リアルタイムプレビュー
- PDF / HTML エクスポート
- テーマ切り替え

---

## スライド 3

\`\`\`typescript
console.log("Hello, Markview!");
\`\`\`
`;

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState("default");
  const { html, css } = useMarp(markdown, theme);

  return (
    <div className="app">
      <Toolbar theme={theme} onThemeChange={setTheme} markdown={markdown} />
      <div className="split-pane">
        <Editor value={markdown} onChange={setMarkdown} />
        <Preview html={html} css={css} />
      </div>
    </div>
  );
}

export default App;
