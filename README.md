# Markview

Marpスライド & Markdownプレビューデスクトップアプリ。
リアルタイムプレビュー・PDF/HTML/PPTX/PNGエクスポートに対応。

## 機能

- **Marp / Markdown 自動判定** - `marp: true` ディレクティブの有無で自動切替
- **タブ切替** - 編集 / プレビューをフルスクリーンで表示
- **目次パネル** - 見出しから自動生成、クリックでスライドにジャンプ
- **エクスポート** - Marp: PDF / HTML / PPTX / PNG、Markdown: HTML
- **ファイルインポート** - .md ファイルを開いて自動判定

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| デスクトップフレームワーク | Tauri v2（Rust + WebView） |
| フロントエンド | React（TypeScript） |
| Markdownレンダリング | @marp-team/marp-core / markdown-it |
| エクスポート | @marp-team/marp-cli |
| 実行環境 | Docker（開発） / Windows exe（リリース） |

## セットアップ

### Docker（開発）

```bash
docker compose up --build
```

### ローカル（Rustインストール済みの場合）

```bash
npm install
npm run tauri dev
```

### Windows exe（リリース）

GitHub Actions で `v*` タグを push すると自動ビルドされます。

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Releases にドラフトが作成されます。

## ライセンス

MIT
