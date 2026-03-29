use std::process::Command;
use tempfile::NamedTempFile;
use std::io::Write;

#[tauri::command]
pub async fn export_marp(markdown: String, output_path: String, format: String) -> Result<(), String> {
    let mut tmp = NamedTempFile::with_suffix(".md")
        .map_err(|e| format!("一時ファイル作成エラー: {}", e))?;

    tmp.write_all(markdown.as_bytes())
        .map_err(|e| format!("一時ファイル書き込みエラー: {}", e))?;

    let tmp_path = tmp.path().to_string_lossy().to_string();

    let format_flag = match format.as_str() {
        "pdf" => "--pdf",
        "html" => "--html",
        "pptx" => "--pptx",
        "png" => "--images=png",
        _ => return Err(format!("未対応の出力形式: {}", format)),
    };

    let output = Command::new("npx")
        .args(["marp", format_flag, "--allow-local-files", "-o", &output_path, &tmp_path])
        .output()
        .map_err(|e| format!("Marp CLI 実行エラー: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("エクスポートエラー: {}", stderr));
    }

    Ok(())
}

#[tauri::command]
pub async fn export_markdown_html(html: String, css: String, output_path: String) -> Result<(), String> {
    let content = format!(
        "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<style>{}</style>\n</head>\n<body>{}</body>\n</html>",
        css, html
    );

    std::fs::write(&output_path, &content)
        .map_err(|e| format!("ファイル書き込みエラー: {}", e))?;

    Ok(())
}
