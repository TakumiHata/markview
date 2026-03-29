import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";
import { invoke } from "@tauri-apps/api/core";

/**
 * レンダリング済み HTML+CSS からスライドの PNG を生成する。
 * 非表示のコンテナを作成し、html2canvas でキャプチャする。
 */
async function renderSlidesToPng(
  html: string,
  css: string,
  isMarp: boolean
): Promise<Uint8Array[]> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "1280px";
  container.style.background = "#fff";
  document.body.appendChild(container);

  const style = document.createElement("style");
  style.textContent = css;
  container.appendChild(style);

  const content = document.createElement("div");
  content.innerHTML = html;
  container.appendChild(content);

  await new Promise((r) => setTimeout(r, 200));

  const pngs: Uint8Array[] = [];

  if (isMarp) {
    const sections = content.querySelectorAll("section");
    for (const section of sections) {
      const el = section as HTMLElement;
      el.style.position = "relative";
      el.style.display = "block";
      el.style.width = el.scrollWidth + "px";
      el.style.height = el.scrollHeight + "px";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: el.scrollWidth,
        height: el.scrollHeight,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      const buffer = await blob.arrayBuffer();
      pngs.push(new Uint8Array(buffer));
    }
  } else {
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#1c1c1c",
    });

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const buffer = await blob.arrayBuffer();
    pngs.push(new Uint8Array(buffer));
  }

  document.body.removeChild(container);
  return pngs;
}

function uint8ArrayToBase64(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

// --- Export functions ---

export async function exportHtml(
  html: string,
  css: string,
  outputPath: string
): Promise<void> {
  await invoke("export_html", { html, css, outputPath });
}

export async function exportPdf(html: string, css: string, isMarp: boolean): Promise<void> {
  const printContent = buildPrintHtml(html, css, isMarp);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("印刷ウィンドウを開けませんでした");
  }

  printWindow.document.write(printContent);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

function buildPrintHtml(html: string, css: string, isMarp: boolean): string {
  const pageStyle = isMarp
    ? `
      @page { size: landscape; margin: 0; }
      @media print {
        section {
          page-break-after: always;
          page-break-inside: avoid;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        section:last-child { page-break-after: auto; }
      }
      body { margin: 0; padding: 0; }
    `
    : `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { color: #000; background: #fff; }
        a { color: #000; }
        pre, code { background: #f5f5f5 !important; color: #333 !important; }
        blockquote { border-left-color: #333; color: #333; }
      }
    `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${css}</style>
  <style>${pageStyle}</style>
</head>
<body>${html}</body>
</html>`;
}

export async function exportPng(
  html: string,
  css: string,
  isMarp: boolean,
  outputPath: string
): Promise<void> {
  const pngs = await renderSlidesToPng(html, css, isMarp);

  if (pngs.length === 1) {
    await invoke("export_png", { data: Array.from(pngs[0]), outputPath });
  } else {
    const zipPath = outputPath.replace(/\.png$/i, ".zip");
    const images: [string, number[]][] = pngs.map((data, i) => [
      `slide-${String(i + 1).padStart(3, "0")}.png`,
      Array.from(data),
    ]);
    await invoke("export_png_zip", { images, outputPath: zipPath });
  }
}

export async function exportPptx(
  html: string,
  css: string,
  isMarp: boolean,
  outputPath: string
): Promise<void> {
  const pngs = await renderSlidesToPng(html, css, isMarp);

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 16:9 (13.33 x 7.5 inches)

  for (const pngData of pngs) {
    const slide = pptx.addSlide();
    const base64 = uint8ArrayToBase64(pngData);

    slide.addImage({
      data: `image/png;base64,${base64}`,
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
      sizing: { type: "contain", w: 13.33, h: 7.5 },
    });
  }

  // Generate as arraybuffer and save via Rust
  const output = await pptx.write({ outputType: "arraybuffer" });
  const data = Array.from(new Uint8Array(output as ArrayBuffer));
  await invoke("export_png", { data, outputPath });
}
