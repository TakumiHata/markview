import { useCallback, useMemo, useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import Toc from "./components/Toc";
import Toolbar from "./components/Toolbar";
import { useMarp } from "./hooks/useMarp";
import { useMarkdown } from "./hooks/useMarkdown";
import { useToc } from "./hooks/useToc";
import { detectMode } from "./utils/detectMode";
import "./App.css";

export type RenderMode = "marp" | "markdown";
export type ViewTab = "edit" | "preview";

function App() {
  const [viewTab, setViewTab] = useState<ViewTab>("edit");
  const [markdown, setMarkdown] = useState("");

  const [tocOpen, setTocOpen] = useState(true);
  const [targetSlide, setTargetSlide] = useState<number | null>(null);

  // Auto-detect mode from content
  const mode: RenderMode = useMemo(() => detectMode(markdown), [markdown]);

  const marpResult = useMarp(markdown);
  const mdResult = useMarkdown(markdown);
  const { html, css } = mode === "marp" ? marpResult : mdResult;
  const tocEntries = useToc(markdown);

  const handleSlideScrolled = useCallback(() => {
    setTargetSlide(null);
  }, []);

  const handleFileImport = useCallback((content: string) => {
    setMarkdown(content);
    setViewTab("preview");
  }, []);

  return (
    <div className="app">
      <Toolbar
        mode={mode}
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        markdown={markdown}
        html={html}
        css={css}
        onFileImport={handleFileImport}
      />
      <div className="main-content">
        {viewTab === "edit" ? (
          <Editor value={markdown} onChange={setMarkdown} />
        ) : (
          <div className="preview-layout">
            <Toc
              entries={tocEntries}
              onEntryClick={setTargetSlide}
              isOpen={tocOpen}
              onToggle={() => setTocOpen(!tocOpen)}
            />
            <Preview
              mode={mode}
              html={html}
              css={css}
              targetSlide={targetSlide}
              onSlideScrolled={handleSlideScrolled}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
