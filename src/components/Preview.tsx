import "./Preview.css";

interface PreviewProps {
  html: string;
  css: string;
}

function Preview({ html, css }: PreviewProps) {
  const srcdoc = `<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
  <style>
    body {
      margin: 0;
      padding: 16px;
      overflow: auto;
    }
  </style>
</head>
<body>${html}</body>
</html>`;

  return (
    <div className="preview">
      <iframe
        className="preview-iframe"
        srcDoc={srcdoc}
        title="Slide Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}

export default Preview;
