import { RenderMode } from "../App";

/**
 * Markdownの内容からMarpスライドかどうかを判定する。
 *
 * 判定基準:
 * 1. frontmatter に `marp: true` が含まれている
 * 2. frontmatter に Marp固有のディレクティブ (theme, paginate, header, footer, size, class) がある
 * 3. スライド区切り `---` が本文中に存在し、かつ上記のいずれかを満たす
 */
export function detectMode(content: string): RenderMode {
  // frontmatter を抽出
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return "markdown";

  const frontmatter = frontmatterMatch[1];

  // marp: true が明示されている
  if (/^marp:\s*true$/m.test(frontmatter)) return "marp";

  // Marp固有ディレクティブの存在チェック
  const marpDirectives = [
    /^theme:\s/m,
    /^paginate:\s/m,
    /^header:\s/m,
    /^footer:\s/m,
    /^size:\s/m,
    /^backgroundImage:\s/m,
    /^_class:\s/m,
  ];

  const hasMarpDirective = marpDirectives.some((re) => re.test(frontmatter));
  if (hasMarpDirective) return "marp";

  return "markdown";
}
