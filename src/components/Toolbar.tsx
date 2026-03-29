import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { RenderMode, ViewTab } from "../App";
import { exportHtml, exportPdf, exportPng, exportPptx } from "../utils/exporter";
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

const EXPORT_FORMATS: ExportFormat[] = [
  { value: "html", label: "HTML", ext: "html" },
  { value: "pdf", label: "PDF", ext: "pdf" },
  { value: "png", label: "PNG", ext: "png" },
  { value: "pptx", label: "PPTX", ext: "pptx" },
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
  const [exportFormat, setExportFormat] = useState("html");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const fmt = EXPORT_FORMATS.find((f) => f.value === exportFormat) ?? EXPORT_FORMATS[0];
    const isMarp = mode === "marp";

    try {
      setExporting(true);

      if (fmt.value === "pdf") {
        // PDF: open print dialog (no file save dialog needed)
        await exportPdf(html, css, isMarp);
        return;
      }

      const outputPath = await save({
        filters: [{ name: fmt.label, extensions: [fmt.ext] }],
        defaultPath: `output.${fmt.ext}`,
      });
      if (!outputPath) return;

      if (fmt.value === "html") {
        await exportHtml(html, css, outputPath);
      } else if (fmt.value === "png") {
        await exportPng(html, css, isMarp, outputPath);
      } else if (fmt.value === "pptx") {
        await exportPptx(html, css, isMarp, outputPath);
      }

      alert(`${fmt.label} を保存しました`);
    } catch (e) {
      alert(`エクスポートエラー: ${e}`);
    } finally {
      setExporting(false);
    }
  };

  const disabled = !markdown.trim() || exporting;

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
        <div className={`toolbar-export ${disabled ? "toolbar-export--disabled" : ""}`} ref={dropdownRef}>
          <button
            className="toolbar-dropdown-trigger"
            onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
            disabled={disabled}
          >
            {EXPORT_FORMATS.find((f) => f.value === exportFormat)?.label ?? exportFormat}
            <span className="toolbar-dropdown-arrow">▾</span>
          </button>
          {dropdownOpen && (
            <div className="toolbar-dropdown-menu">
              {EXPORT_FORMATS.map((f) => (
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
          <button className="toolbar-button" onClick={handleExport} disabled={disabled}>
            {exporting ? "処理中..." : "エクスポート"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
