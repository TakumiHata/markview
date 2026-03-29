import { useEffect, useRef } from "react";
import { RenderMode } from "../App";
import "./Preview.css";

interface PreviewProps {
  mode: RenderMode;
  html: string;
  css: string;
  targetSlide: number | null;
  onSlideScrolled: () => void;
}

function Preview({ mode, html, css, targetSlide, onSlideScrolled }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const marpSrcdoc = `<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
  <style>
    body {
      margin: 0;
      padding: 24px;
      overflow-y: auto;
      overflow-x: hidden;
      background: #1c1c1c;
    }
    section {
      transform-origin: top left;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
      border-radius: 4px;
    }
    .mermaid {
      text-align: center;
      padding: 16px;
    }
    .mermaid svg {
      max-width: 100%;
      height: auto;
    }
  </style>
  <script>
    function rescale() {
      var sections = document.querySelectorAll('section');
      var containerWidth = document.body.clientWidth - 48;
      sections.forEach(function(s) {
        var slideWidth = s.scrollWidth || 1280;
        var scale = Math.min(containerWidth / slideWidth, 1);
        s.style.transform = 'scale(' + scale + ')';
        s.style.width = slideWidth + 'px';
        s.style.height = (s.scrollHeight || 720) + 'px';
        s.style.marginBottom = (-(s.scrollHeight || 720) * (1 - scale) + 24) + 'px';
      });
    }
    window.addEventListener('load', rescale);
    window.addEventListener('resize', rescale);
    new MutationObserver(rescale).observe(document.body, { childList: true, subtree: true });
  </script>
</head>
<body>${html}</body>
</html>`;

  const markdownSrcdoc = `<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
  <style>
    .mermaid {
      text-align: center;
      padding: 16px;
    }
    .mermaid svg {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>${html}</body>
</html>`;

  const srcdoc = mode === "marp" ? marpSrcdoc : markdownSrcdoc;

  useEffect(() => {
    if (targetSlide === null || mode !== "marp") return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    requestAnimationFrame(() => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const sections = doc.querySelectorAll("section");
      if (sections[targetSlide]) {
        sections[targetSlide].scrollIntoView({ behavior: "smooth" });
      }
      onSlideScrolled();
    });
  }, [targetSlide, onSlideScrolled, mode]);

  return (
    <div className="preview">
      <iframe
        ref={iframeRef}
        className="preview-iframe"
        srcDoc={srcdoc}
        title="Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
}

export default Preview;
