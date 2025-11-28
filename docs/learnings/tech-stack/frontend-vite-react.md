# フロントエンド: Vite + React

## 実装状況

**実装済み**: `apps/web/` に Vite + React + TypeScript プロジェクトを構築

## 技術スタック

### ビルドツール
- **Vite**: 高速な開発サーバーとビルド
- **TypeScript**: 型安全な開発

### UIライブラリ
- **React**: UIフレームワーク
- **TailwindCSS**: ユーティリティファーストCSS
- **shadcn/ui**: Radix UIベースのコンポーネントライブラリ

## プロジェクト構造

```
apps/web/
├─ src/
│  ├─ components/
│  │  ├─ ui/              # shadcn/uiコンポーネント
│  │  ├─ AuthPage.tsx
│  │  ├─ ChatPage.tsx
│  │  ├─ JobListingPage.tsx
│  │  └─ ...              # 各種ページコンポーネント
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ package.json
├─ vite.config.ts
└─ README.md
```

## 依存関係（確認済み）

### UIコンポーネント
```json
{
  "@radix-ui/react-accordion": "^1.2.3",
  "@radix-ui/react-alert-dialog": "^1.1.6",
  "@radix-ui/react-avatar": "^1.1.3",
  ...
}
```

### スタイリング
- TailwindCSS
- Radix UI Themes

## 開発コマンド

```bash
cd apps/web
npm install
npm run dev
```

## 学んだこと

### Viteのメリット
1. **高速な開発サーバー**: HMR（Hot Module Replacement）が非常に速い
2. **シンプルな設定**: webpack比較で設定が簡潔
3. **TypeScriptサポート**: 追加設定なしで動作

### shadcn/uiのメリット
1. **カスタマイズ性**: コンポーネントをプロジェクトにコピーして自由に編集
2. **アクセシビリティ**: Radix UIベースでWCAG準拠
3. **TailwindCSSとの統合**: スタイリングが一貫

### 課題

#### 現在の課題
1. **SSR/SEO**: Viteは基本的にSPAのため、検索エンジン最適化が困難
2. **初回ロード**: クライアントサイドレンダリングのため、初回表示が遅い可能性

#### 検討中の対策
- **Next.js への移行**: SSR/SSGで初回表示速度とSEOを改善（計画中）
- ただし、現在のVite環境での開発速度は維持したい

## 今後の展望

### Next.js移行の検討
- App Router採用予定
- 既存コンポーネントの移行戦略を検討中
- SSR/SSGのメリットとViteの開発体験を両立させる方法を模索

### コンポーネント設計
- `packages/ui` への共通コンポーネント抽出（計画中）
- デザインシステムの確立

---

**関連ドキュメント**:
- [モノレポ vs マイクロサービス](../architecture/monorepo-vs-microservices.md)

最終更新: 2025-11-27
