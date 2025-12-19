# packages/features

ChefNext の機能横断コンポーネントを配置するパッケージです。まずは求人機能を Web / モバイルの両方で使い回せるように整備します。

## 概要

このパッケージは、Webとモバイルの両方で共有される機能レベルのコンポーネントを提供します。基本的なUIコンポーネント（`@ui`）を組み合わせて、ビジネスロジックを含むフィーチャーコンポーネントを構築します。

## ディレクトリ構成

```
packages/features/
├── src/
│   ├── job/                 # 求人関連フィーチャー
│   │   ├── JobCard.tsx (既存Web UI)
│   │   ├── JobHighlightGrid.tsx
│   │   ├── JobSearchPage.tsx
│   │   ├── screens/JobListScreen.tsx  ← React Native プリミティブで再実装
│   │   ├── screens/JobDetailScreen.tsx
│   │   ├── screens/JobPostScreen.tsx
│   │   ├── screens/ApplicationListScreen.tsx
│   │   ├── hooks.ts (JobClient を利用した headless hooks)
│   │   └── types.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 求人フィーチャー（job）

### コンポーネント一覧

#### JobHighlightCard
求人情報を表示するカードコンポーネント。求人一覧や検索結果で使用。

```tsx
import { JobHighlightCard } from '@features/job';

<JobHighlightCard
  job={jobData}
  onSelect={(job) => console.log('Selected:', job)}
/>
```

#### JobSearchPage
求人検索画面。スキルベースまたはキーワード検索に対応。

```tsx
import { JobSearchPage } from '@features/job/JobSearchPage';

<JobSearchPage
  onBack={() => navigate('/')}
  onJobSelect={(job) => navigate(`/jobs/${job.id}`)}
/>
```

#### JobDetailScreen（new）
`packages/ui` のプリミティブと `@chefnext/api-client` の型を利用した React Native 互換の詳細画面。

```tsx
import { JobDetailScreen } from '@features/job';

<JobDetailScreen
  job={job}
  onBack={handleBack}
  onApply={handleApply}
/>;
```

#### JobListScreen（new）
求人一覧画面。`JobCard` を内部で利用し、`useJobSearch` hook の結果をそのまま渡せるインターフェースになっています。

```tsx
import { JobListScreen, useJobSearch } from '@features/job';

const { jobs, loading, error } = useJobSearch({ client: jobClient, params: { keyword } });

<JobListScreen
  jobs={jobs}
  isLoading={loading}
  error={error}
  onJobSelect={onJobClick}
/>;
```

#### JobPostScreen（new）
求人投稿フォーム。`CreateJobParams` を受け取り、`useJobMutations` と組み合わせて保存できます。

```tsx
import { JobPostScreen, useJobMutations } from '@features/job';

const { createJob } = useJobMutations({ client: jobClient, accessToken });

<JobPostScreen onSubmit={createJob} />;
```

#### ApplicationListScreen（new）
応募一覧表示。`mode` を `chef` / `restaurant` で切り替え、`useJobApplications` hook で取得したデータを描画します。

```tsx
import { JobDetailPage } from '@features/job/JobDetailPage';

<JobDetailPage
  onBack={() => navigate('/jobs')}
  onScheduleInterview={() => navigate('/interview')}
  onChat={() => navigate('/chat')}
/>
```

#### ApplicationFlow
応募フロー（4ステップ）。志望動機、ポートフォリオ、希望開始日、連絡手段の入力。

```tsx
import { ApplicationFlow } from '@features/job/ApplicationFlow';

<ApplicationFlow
  job={jobData}
  onComplete={() => navigate('/applications')}
  onBack={() => navigate('/jobs')}
/>
```

### 使用方法（apps/webの例）

```tsx
import { JobListScreen, JobDetailScreen, JobPostScreen, useJobSearch } from '@features/job';
import { jobClient } from '../lib/apiClient';

const { jobs, loading, error } = useJobSearch({ client: jobClient, params: { keyword } });

<JobListScreen jobs={jobs} isLoading={loading} error={error} onJobSelect={handleSelect} />;
```

## 開発ガイドライン

### 1. 依存関係の管理

- `@ui`パッケージから基本コンポーネントをインポート
- Web専用ライブラリ（framer-motion, lucide-react等）の使用を最小限に
- React Nativeでも動作するように段階的にリファクタリング

### 2. プロップス設計

- 明確なインターフェース定義
- オプショナルなコールバックは`?`で指定
- 型安全性を重視

### 3. スタイリング

- 現在は Tailwind CSS を使用
- 将来的に `nativewind` または `react-native-web` へ移行予定
- プラットフォーム固有のスタイルは条件分岐で対応

## 今後の予定

### Milestone 3（現在）
- ✅ 求人関連コンポーネントの移行
- ✅ 応募フローの実装
- 🔄 APIクライアントとの統合

### Milestone 5
- React Native対応の本格化
- `apps/mobile`での動作確認
- スタイリングシステムの統一

### Post-MVP
- すべてのフィーチャーコンポーネントをReact Native化
- パフォーマンス最適化
- E2Eテストの整備

## 更新履歴

- 2025-12-04: 求人関連コンポーネント（JobSearchPage, JobDetailPage, ApplicationFlow）を追加
- 2025-12-04: READMEにクロスプラットフォーム設計指針を追記
