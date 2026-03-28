import Marp from "@marp-team/marp-core";
import { useMemo } from "react";

export function useMarp(markdown: string, theme: string) {
  return useMemo(() => {
    const marp = new Marp({ html: true });

    // Inject theme directive if not already present
    let md = markdown;
    if (theme !== "default" && !markdown.includes(`theme: ${theme}`)) {
      // Prepend theme directive after marp: true
      if (md.includes("marp: true")) {
        md = md.replace("marp: true", `marp: true\ntheme: ${theme}`);
      } else {
        md = `---\nmarp: true\ntheme: ${theme}\n---\n\n${md}`;
      }
    }

    const { html, css } = marp.render(md);
    return { html, css };
  }, [markdown, theme]);
}
