import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { RenderMode, ViewTab } from "../App";
import "./Toolbar.css";

interface ToolbarProps {
  mode: RenderMode;
  viewTab: ViewTab;
  onViewTabChange: (tab: ViewTab) => void;
  markdown: string;
  html: string;
  css: string;
  onFileImport: (content: string) => void;
}

interface ExportFormat {
  value: string;
  label: string;
  ext: string;
}

const MARP_FORMATS: ExportFormat[] = [
  { value: "pdf", label: "PDF", ext: "pdf" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "pptx", label: "PPTX", ext: "pptx" },
  { value: "png", label: "PNG", ext: "png" },
];

const MARKDOWN_FORMATS: ExportFormat[] = [
  { value: "html", label: "HTML", ext: "html" },
];

function Toolbar({
  mode,
  viewTab,
  onViewTabChange,
  markdown,
  html,
  css,
  onFileImport,
}: ToolbarProps) {
  const currentFormats = mode === "marp" ? MARP_FORMATS : MARKDOWN_FORMATS;
  const [exportFormat, setExportFormat] = useState(currentFormats[0].value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset format when mode changes
  useEffect(() => {
    const valid = currentFormats.find((f) => f.value === exportFormat);
    if (!valid) {
      setExportFormat(currentFormats[0].value);
    }
  }, [mode, currentFormats, exportFormat]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenFile = async () => {
    try {
      const filePath = await open({
        filters: [{ name: "Markdown", extensions: ["md", "markdown", "marp"] }],
        multiple: false,
      });
      if (!filePath) return;
      const content = await invoke<string>("read_file", { path: filePath });
      onFileImport(content);
    } catch (e) {
      alert(`ファイル読み込みエラー: ${e}`);
    }
  };

  const handleExport = async () => {
    const fmt = currentFormats.find((f) => f.value === exportFormat) ?? currentFormats[0];

    try {
      const outputPath = await save({
        filters: [{ name: fmt.label, extensions: [fmt.ext] }],
        defaultPath: `output.${fmt.ext}`,
      });
      if (!outputPath) return;

      if (mode === "marp") {
        await invoke("export_marp", {
          markdown,
          outputPath,
          format: fmt.value,
        });
      } else {
        await invoke("export_markdown_html", {
          html,
          css,
          outputPath,
        });
      }
      alert(`${fmt.label} を保存しました`);
    } catch (e) {
      alert(`エクスポートエラー: ${e}`);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-title">Markview</span>
        <div className="toolbar-tab-toggle">
          <button
            className={`toolbar-tab-btn ${viewTab === "edit" ? "toolbar-tab-btn--active" : ""}`}
            onClick={() => onViewTabChange("edit")}
          >
            編集
          </button>
          <button
            className={`toolbar-tab-btn ${viewTab === "preview" ? "toolbar-tab-btn--active" : ""}`}
            onClick={() => onViewTabChange("preview")}
          >
            プレビュー
          </button>
        </div>
        <div className="toolbar-separator" />
        <span className="toolbar-mode-badge">
          {mode === "marp" ? "Marp" : "Markdown"}
        </span>
        <button className="toolbar-button toolbar-button--secondary" onClick={handleOpenFile}>
          ファイルを開く
        </button>
      </div>
      <div className="toolbar-right">
        <div className={`toolbar-export ${!markdown.trim() ? "toolbar-export--disabled" : ""}`} ref={dropdownRef}>
          <button
            className="toolbar-dropdown-trigger"
            onClick={() => markdown.trim() && setDropdownOpen(!dropdownOpen)}
            disabled={!markdown.trim()}
          >
            {currentFormats.find((f) => f.value === exportFormat)?.label ?? exportFormat}
            <span className="toolbar-dropdown-arrow">▾</span>
          </button>
          {dropdownOpen && (
            <div className="toolbar-dropdown-menu">
              {currentFormats.map((f) => (
                <button
                  key={f.value}
                  className={`toolbar-dropdown-item ${f.value === exportFormat ? "toolbar-dropdown-item--active" : ""}`}
                  onClick={() => {
                    setExportFormat(f.value);
                    setDropdownOpen(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
          <button className="toolbar-button" onClick={handleExport} disabled={!markdown.trim()}>
            エクスポート
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
