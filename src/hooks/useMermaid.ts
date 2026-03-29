import { useEffect, useState } from "react";
import { renderMermaidToSvg } from "../utils/mermaidRenderer";

/**
 * HTML内の <div class="mermaid">...</div> を検出し、
 * mermaid.js でSVGにレンダリングして置換する。
 */
export function useMermaid(html: string): string {
  const [rendered, setRendered] = useState(html);

  useEffect(() => {
    let cancelled = false;

    async function process() {
      // Find all mermaid blocks
      const regex = /<div class="mermaid">([\s\S]*?)<\/div>/g;
      const matches: { full: string; code: string }[] = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        matches.push({
          full: match[0],
          code: match[1]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"'),
        });
      }

      if (matches.length === 0) {
        if (!cancelled) setRendered(html);
        return;
      }

      let result = html;
      for (const m of matches) {
        const svg = await renderMermaidToSvg(m.code);
        result = result.replace(
          m.full,
          `<div class="mermaid" style="text-align:center;padding:16px;">${svg}</div>`
        );
      }

      if (!cancelled) setRendered(result);
    }

    process();
    return () => {
      cancelled = true;
    };
  }, [html]);

  return rendered;
}
