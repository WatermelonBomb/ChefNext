# Milestone 3 実装計画（求人 + 応募 / フロント共通化）

## ブランチ戦略
- ベース: `main` (0c50935f)
- 作業ブランチ: `feature/milestone-3-jobs-applications`
- マイルストーン規模が大きいため、以下の単位で更にトピックブランチを切り、順次 `feature/milestone-3-jobs-applications` にマージする方針。
  1. `m3/db-and-proto` – DBマイグレーション + sqlc + proto/handlerスケルトン
  2. `m3/api-client-and-hooks` – `@chefnext/api-client` 拡張 + `packages/features/job` 基盤
  3. `m3/web-integration` – `apps/web` を `@features/job` / `@ui` 経由に差し替え
  4. `m3-docs-aliases` – React Native 方針ドキュメント + alias/ビルド設定

## バックエンド計画
1. **DBマイグレーション**
   - `20251207xxxx_add_jobs_and_applications.sql` を追加。
   - `jobs` テーブル: `restaurant_id`, `title`, `description`, `required_skills[]`, `location`, `salary_range`, `employment_type`, `status (DRAFT/PUBLISHED/CLOSED)`, `metadata JSONB(今後の拡張用)`, timestamps。
   - `applications` テーブル: `job_id`, `chef_id`, `cover_letter`, `status (PENDING/ACCEPTED/REJECTED)`, timestamps, `UNIQUE(job_id, chef_id)`。
   - 検索用 index: `GIN (required_skills)`, `GIN (to_tsvector(title || ' ' || description))`, `btree (location, status)`。

2. **sqlc クエリ (`apps/api/db/queries`)**
   - `jobs.sql`: CRUD + list/search (keyword, skill array, location, status filter、limit/offset)。
   - `applications.sql`: create/list (by chef, by restaurant) + status更新。

3. **ユースケース / リポジトリ**
   - `internal/usecase/job` と `internal/usecase/application` を作成。
   - バリデーション: レストランユーザーのみ求人作成/更新、シェフユーザーのみ応募等。
   - 検索結果で `total` 返却（ページング用）。

4. **Connect-RPC / Handler**
   - `proto/job/v1/job.proto` を追加（JobService + ApplicationService もしくは単一サービス内メソッド）。
   - Handler レイヤーで `middleware` から user context を取得し role-check。
   - `cmd/api/main.go` にサービス登録 + rate limit/auth interceptor 適用。

5. **テスト/検証**
   - usecase レベルで主要ロジックの unit test を追加（Go）。
   - `make db-migrate` でマイグレーションが通ることを確認。

## フロントエンド / 共有パッケージ計画
1. **Path alias & TypeScript ベース**
   - ルートに `tsconfig.base.json` を追加し、`@features/*`, `@ui/*`, `@api-client` を定義。
   - `apps/web/tsconfig.json`, `packages/api-client/tsconfig.json`, `packages/ui/tsconfig.json` を base 継承で作成。
   - Vite `resolve.alias` に `@features`, `@ui`, `@api-client` を追記。Jest/Babel 設定は現状未導入だが、`README` に alias 連携手順を追記。

2. **packages/ui**
   - `react-native` + `react-native-web` を導入し、`src/JobCard.tsx` を RN プリミティブで実装。
   - `src/index.ts` から `JobCard` をエクスポート。スタイルは `StyleSheet` ベース + Web で shadcn と共存できるよう props でラッパー可能に。

3. **packages/features/job**
   - API呼び出し層: `useJobs`, `useJobDetail`, `useJobApplications` hooks を作成（SWR か React Query 相当、今回は軽量に React `useEffect` + fetch で対応）。
   - 画面コンポーネント: `JobListScreen`, `JobDetailScreen`, `JobPostScreen`, `ApplicationListScreen` などを React Native コンポーネントで記述し、`props` でナビゲーションやイベントを親 (`apps/web`) に委譲。
   - 入力/選択UIは RN ベースが難しい箇所のみ暫定 Web コンポーネント (shadcn) をラップし、README で理由を説明。

4. **apps/web との統合**
   - 既存の `JobListingPage`, `JobDetailPage`, `JobPostPage`, 応募UI などを削除/薄くし、`packages/features/job` の Screen をレンダリングする wrapper を配置。
   - `apps/web/src/lib/apiClient` に `JobClient` を追加し、AuthContext のトークンを渡して各 hook から利用。
   - ルーティング (現状の手動 `useState`) は継続しつつ、`packages/features/job` からハンドラを受け取る構造に変更。

5. **ドキュメント**
   - `packages/ui/README.md` に React Native ベースで進める方針、`react-native-web` / `nativewind` 採用可否のメモを追加。
   - `docs/milestones1.1.md` に関係する ToDo へリンクを追記するか、完了時にチェックを入れる。(このマイルストーン内で更新予定)

## リスクとフォロー
- `react-native-web` 導入に伴い Vite/Bundler 設定が複雑化するため、まず `JobCard` だけで挙動を確認し、問題があれば一時的に Web fallback を設ける。
- `tsconfig` 整備に伴い各パッケージの `tslib` 依存やビルド script が必要になる場合がある。`ts-node` ではなく Vite/tsc での型チェックを CI に追加予定。
- DB 検索要件（全文検索）は PostgreSQL の `tsvector` で最初は実装し、Elasticsearch への移行は将来対応とする。

## 最初の着手順序
1. DBマイグレーション + sqlc + proto 生成まで完了させ、API の土台を固める。
2. `@chefnext/api-client` に Job/API クライアントを追加し、簡単な e2e smoke (curl でも可) で確認。
3. `packages/ui` / `packages/features` を最小構成で作成し、`apps/web` からレンダリングしてエントゥーエンドで動作させる。
4. 最後にドキュメント整備と alias 説明を反映する。
