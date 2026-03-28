use std::process::Command;
use tempfile::NamedTempFile;
use std::io::Write;

#[tauri::command]
pub async fn export_pdf(markdown: String, output_path: String, theme: String) -> Result<(), String> {
    let mut tmp = NamedTempFile::with_suffix(".md")
        .map_err(|e| format!("一時ファイル作成エラー: {}", e))?;

    // Inject theme directive
    let content = inject_theme(&markdown, &theme);
    tmp.write_all(content.as_bytes())
        .map_err(|e| format!("一時ファイル書き込みエラー: {}", e))?;

    let tmp_path = tmp.path().to_string_lossy().to_string();

    let output = Command::new("npx")
        .args(["marp", "--pdf", "--allow-local-files", "-o", &output_path, &tmp_path])
        .output()
        .map_err(|e| format!("Marp CLI 実行エラー: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("PDF 生成エラー: {}", stderr));
    }

    Ok(())
}

#[tauri::command]
pub async fn export_html(markdown: String, output_path: String, theme: String) -> Result<(), String> {
    let mut tmp = NamedTempFile::with_suffix(".md")
        .map_err(|e| format!("一時ファイル作成エラー: {}", e))?;

    let content = inject_theme(&markdown, &theme);
    tmp.write_all(content.as_bytes())
        .map_err(|e| format!("一時ファイル書き込みエラー: {}", e))?;

    let tmp_path = tmp.path().to_string_lossy().to_string();

    let output = Command::new("npx")
        .args(["marp", "--html", "--allow-local-files", "-o", &output_path, &tmp_path])
        .output()
        .map_err(|e| format!("Marp CLI 実行エラー: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("HTML 生成エラー: {}", stderr));
    }

    Ok(())
}

fn inject_theme(markdown: &str, theme: &str) -> String {
    if theme == "default" || markdown.contains(&format!("theme: {}", theme)) {
        return markdown.to_string();
    }

    if markdown.contains("marp: true") {
        markdown.replace("marp: true", &format!("marp: true\ntheme: {}", theme))
    } else {
        format!("---\nmarp: true\ntheme: {}\n---\n\n{}", theme, markdown)
    }
}
