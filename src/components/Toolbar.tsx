import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import "./Toolbar.css";

interface ToolbarProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  markdown: string;
}

const THEMES = ["default", "gaia", "uncover"];

function Toolbar({ theme, onThemeChange, markdown }: ToolbarProps) {
  const handleExportPdf = async () => {
    try {
      const outputPath = await save({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath: "slides.pdf",
      });
      if (!outputPath) return;
      await invoke("export_pdf", { markdown, outputPath, theme });
      alert("PDF を保存しました");
    } catch (e) {
      alert(`PDF 出力エラー: ${e}`);
    }
  };

  const handleExportHtml = async () => {
    try {
      const outputPath = await save({
        filters: [{ name: "HTML", extensions: ["html"] }],
        defaultPath: "slides.html",
      });
      if (!outputPath) return;
      await invoke("export_html", { markdown, outputPath, theme });
      alert("HTML を保存しました");
    } catch (e) {
      alert(`HTML 出力エラー: ${e}`);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">Markview</span>
      </div>
      <div className="toolbar-right">
        <label className="toolbar-label">
          テーマ:
          <select
            className="toolbar-select"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button className="toolbar-button" onClick={handleExportPdf}>
          PDF 出力
        </button>
        <button className="toolbar-button" onClick={handleExportHtml}>
          HTML 出力
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
