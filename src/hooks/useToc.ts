import { useMemo } from "react";

export interface TocEntry {
  level: 1 | 2 | 3;
  text: string;
  slideIndex: number;
}

export function useToc(markdown: string): TocEntry[] {
  return useMemo(() => {
    // Strip frontmatter (first ---...--- block)
    let body = markdown;
    const frontmatterMatch = body.match(/^---\n[\s\S]*?\n---\n?/);
    if (frontmatterMatch) {
      body = body.slice(frontmatterMatch[0].length);
    }

    // Split into slides by ---
    const slides = body.split(/^---$/m);

    const entries: TocEntry[] = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      // Remove fenced code blocks to avoid false heading matches
      const cleaned = slide.replace(/```[\s\S]*?```/g, "");

      // Extract h1-h3 headings
      const headingRegex = /^(#{1,3})\s+(.+)$/gm;
      let match;
      while ((match = headingRegex.exec(cleaned)) !== null) {
        const level = match[1].length as 1 | 2 | 3;
        const text = match[2].trim();
        entries.push({ level, text, slideIndex: i });
      }
    }

    return entries;
  }, [markdown]);
}
