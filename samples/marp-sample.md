---
marp: true
paginate: true
---

# Markview デモ

Marp スライド + Mermaid ダイアグラムのサンプル

---

## アプリ構成

```mermaid
flowchart LR
    A[Markdown 入力] --> B{marp: true?}
    B -->|Yes| C[Marp Core]
    B -->|No| D[markdown-it]
    C --> E[スライドプレビュー]
    D --> F[ドキュメントプレビュー]
    E --> G[エクスポート]
    F --> G
```

---

## 処理フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as React
    participant M as Marp / markdown-it
    participant R as Rust

    U->>F: ファイルを開く
    F->>R: read_file()
    R-->>F: ファイル内容
    F->>F: モード自動判定
    F->>M: render()
    M-->>F: HTML + CSS
    F-->>U: プレビュー表示
```

---

## コンポーネント構成

```mermaid
classDiagram
    class App {
        +markdown: string
        +mode: RenderMode
        +viewTab: ViewTab
    }
    class Toolbar {
        +handleOpenFile()
        +handleExport()
    }
    class Preview {
        +html: string
        +css: string
    }
    class Toc {
        +entries: TocEntry[]
    }

    App --> Toolbar
    App --> Preview
    App --> Toc
```

---

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| デスクトップ | Tauri v2 |
| フロントエンド | React + TypeScript |
| スライド | Marp Core |
| Markdown | markdown-it |
| ダイアグラム | Mermaid |

---

## 対応エクスポート形式

```mermaid
pie title エクスポート形式
    "PDF" : 30
    "HTML" : 30
    "PPTX" : 25
    "PNG" : 15
```

---

<!-- _class: lead -->

# Thank you!

Markview をお試しください
