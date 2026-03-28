# Markview

Marpライクなスライド機能を持つMarkdownプレビューデスクトップアプリ。
Docker環境上で動作し、リアルタイムプレビュー・PDF/HTMLエクスポートに対応。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| デスクトップフレームワーク | Tauri v2（Rust + WebView） |
| フロントエンド | React（TypeScript） |
| Markdownレンダリング | @marp-team/marp-core |
| PDF出力 | @marp-team/marp-cli |
| 実行環境 | Docker（Node.js + Chromium + Rust） |

## 機能

- **リアルタイムプレビュー** - 左右分割レイアウト（エディタ + スライドプレビュー）
- **PDF出力** - Marp CLI経由でPDF生成、保存ダイアログ対応
- **HTML出力** - スタンドアロンHTMLとしてエクスポート
- **テーマ切り替え** - default / gaia / uncover をリアルタイムに反映

## セットアップ

### Docker（推奨）

```bash
docker compose up --build
```

> WSL2環境ではWSLgまたはX11サーバー（VcXsrv等）が必要です。

### ローカル（Rustインストール済みの場合）

```bash
npm install
npm run tauri dev
```

## ディレクトリ構成

```
markview/
├── src/                    # React フロントエンド
│   ├── components/
│   │   ├── Editor.tsx      # Markdownエディタ
│   │   ├── Preview.tsx     # スライドプレビュー（iframe）
│   │   └── Toolbar.tsx     # テーマ切替・エクスポートボタン
│   ├── hooks/
│   │   └── useMarp.ts      # marp-coreラッパーフック
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/              # Rust バックエンド
│   ├── src/
│   │   ├── main.rs
│   │   └── commands/
│   │       ├── export.rs   # PDF/HTML出力（Marp CLI呼び出し）
│   │       └── file.rs     # ファイル読み書き
│   └── tauri.conf.json
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## ライセンス

MIT
