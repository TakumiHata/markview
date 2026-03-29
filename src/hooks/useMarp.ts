import Marp from "@marp-team/marp-core";
import { useMemo } from "react";

function convertMermaidBlocks(html: string): string {
  // Marp renders ```mermaid as <pre><code class="language-mermaid">...</code></pre>
  // Convert these to <div class="mermaid">...</div> for mermaid.js
  return html.replace(
    /<pre[^>]*>\s*<code[^>]*class="language-mermaid"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (_match, content) => {
      // Decode HTML entities back to plain text for mermaid
      const decoded = content
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');
      return `<div class="mermaid">${decoded}</div>`;
    }
  );
}

export function useMarp(markdown: string) {
  return useMemo(() => {
    const marp = new Marp({ html: true });
    const result = marp.render(markdown);
    const html = convertMermaidBlocks(result.html);
    return { html, css: result.css };
  }, [markdown]);
}
