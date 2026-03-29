import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "#3a6fd8",
    primaryTextColor: "#e8e8e8",
    primaryBorderColor: "#4a7fe8",
    lineColor: "#6c9eff",
    secondaryColor: "#2a4a8a",
    tertiaryColor: "#1a3060",
    noteBkgColor: "#222",
    noteTextColor: "#e8e8e8",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

let renderCounter = 0;

export async function renderMermaidToSvg(code: string): Promise<string> {
  try {
    const id = `mermaid-${renderCounter++}`;
    const { svg } = await mermaid.render(id, code);
    return svg;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return `<pre style="color:#ff6b6b;font-size:12px;">Mermaid エラー: ${msg}</pre>`;
  }
}
