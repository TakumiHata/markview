use std::io::Write;

#[tauri::command]
pub async fn export_html(html: String, css: String, output_path: String) -> Result<(), String> {
    let content = format!(
        "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n<style>{}</style>\n</head>\n<body>{}</body>\n</html>",
        css, html
    );

    std::fs::write(&output_path, &content)
        .map_err(|e| format!("ファイル書き込みエラー: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn export_png(data: Vec<u8>, output_path: String) -> Result<(), String> {
    std::fs::write(&output_path, &data)
        .map_err(|e| format!("ファイル書き込みエラー: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn export_png_zip(images: Vec<(String, Vec<u8>)>, output_path: String) -> Result<(), String> {
    let file = std::fs::File::create(&output_path)
        .map_err(|e| format!("ファイル作成エラー: {}", e))?;

    let mut zip = zip::ZipWriter::new(file);
    let options = zip::write::SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Stored);

    for (name, data) in &images {
        zip.start_file(name, options)
            .map_err(|e| format!("ZIP エントリ作成エラー: {}", e))?;
        zip.write_all(data)
            .map_err(|e| format!("ZIP 書き込みエラー: {}", e))?;
    }

    zip.finish()
        .map_err(|e| format!("ZIP 完了エラー: {}", e))?;

    Ok(())
}
