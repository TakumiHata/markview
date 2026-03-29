import MarkdownIt from "markdown-it";
import { useMemo } from "react";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    return `<pre class="code-block"><code class="language-${lang}">${escapeHtml(str)}</code></pre>`;
  },
});

const MARKDOWN_CSS = `
  body {
    margin: 0;
    padding: 32px 40px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans CJK JP", sans-serif;
    font-size: 16px;
    line-height: 1.8;
    color: #e8e8e8;
    background: #1c1c1c;
    max-width: 800px;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.3;
    color: #f0f0f0;
  }
  h1 { font-size: 2em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  p { margin: 0.8em 0; }
  a { color: #6c9eff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul, ol { padding-left: 2em; margin: 0.5em 0; }
  li { margin: 0.3em 0; }
  blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 3px solid #6c9eff;
    background: rgba(255,255,255,0.03);
    color: #a0a0a0;
  }
  code {
    padding: 0.2em 0.4em;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    font-size: 0.9em;
    font-family: "JetBrains Mono", "Fira Code", monospace;
  }
  .code-block {
    margin: 1em 0;
    padding: 16px;
    background: #0f0f0f;
    border-radius: 8px;
    overflow-x: auto;
  }
  .code-block code {
    padding: 0;
    background: none;
    font-size: 14px;
    line-height: 1.6;
  }
  table {
    border-collapse: collapse;
    margin: 1em 0;
    width: 100%;
  }
  th, td {
    padding: 8px 12px;
    border: 1px solid rgba(255,255,255,0.1);
    text-align: left;
  }
  th { background: rgba(255,255,255,0.05); font-weight: 600; }
  hr {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 2em 0;
  }
  img { max-width: 100%; border-radius: 4px; }
`;

export function useMarkdown(markdown: string) {
  return useMemo(() => {
    const html = md.render(markdown);
    return { html, css: MARKDOWN_CSS };
  }, [markdown]);
}
