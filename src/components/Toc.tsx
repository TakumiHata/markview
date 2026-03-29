import { TocEntry } from "../hooks/useToc";
import "./Toc.css";

interface TocProps {
  entries: TocEntry[];
  onEntryClick: (slideIndex: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function Toc({ entries, onEntryClick, isOpen, onToggle }: TocProps) {
  return (
    <div className={`toc ${isOpen ? "" : "toc--collapsed"}`}>
      <button className="toc-toggle" onClick={onToggle} title="目次">
        {isOpen ? "\u25C0" : "\u25B6"}
      </button>
      {isOpen && (
        <div className="toc-content">
          <div className="toc-header">目次</div>
          {entries.length === 0 ? (
            <div className="toc-empty">見出しがありません</div>
          ) : (
            <ul className="toc-list">
              {entries.map((entry, i) => (
                <li
                  key={i}
                  className={`toc-entry toc-entry--h${entry.level}`}
                  onClick={() => onEntryClick(entry.slideIndex)}
                >
                  <span className="toc-slide-badge">#{entry.slideIndex + 1}</span>
                  <span className="toc-entry-text">{entry.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Toc;
