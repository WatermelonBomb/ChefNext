# Milestone 3: テスト計画（求人 + 応募 & フロント共通化）

Milestone 3 着手時にすぐ実行できるよう、テスト観点とタスクを以下に整理します。

## 1. バックエンド（Go / Connect-RPC）

- [ ] `apps/api/internal/usecase/job` にユースケース単体テストを追加し、求人 CRUD の権限とバリデーションを検証する。
- [ ] `apps/api/internal/usecase/application` に応募ステータス遷移テストを追加し、`UNIQUE(job_id, chef_id)` 制約や `PENDING → ACCEPTED/REJECTED` 以外の遷移を禁止する。
- [ ] Connect ハンドラー (`internal/handler/job`, `.../application`) を `httptest.NewServer` + `connect-go` クライアントで結合テストし、求人検索→応募作成の正常系/エラーパスをカバーする。
- [ ] `apps/api` の `Makefile` もしくは `package.json` に `test-api` コマンド（例: `go test ./internal/...`）を追加し、CI で `turbo run test --filter=@chefnext/api` を実行できるようにする。

## 2. パッケージ（packages/api-client, packages/features, packages/ui）

- [ ] `packages/api-client` に求人/応募クライアントのフェッチモックテストを追加（MSW もしくは `node-fetch` のモックでリクエスト/レスポンス整形を確認）。
- [ ] `packages/features/job` の主要コンポーネント（一覧/詳細/応募フォーム）を Jest + Testing Library でレンダリングテストする。
- [ ] `packages/ui` に `JobCard` や共通 UI のスナップショットテストを追加し、React Native ベースの API が Web 環境でも崩れないことを検証する。

## 3. Web アプリ（apps/web）

- [ ] `apps/web` の `package.json` に `test` スクリプト（`vitest` や Jest）を追加し、`pnpm test --filter=@chefnext/web` で実行。Turbo `test` パイプラインにもフックする。
- [ ] `apps/web/src/routes/jobs/*` をターゲットに Playwright ミニシナリオを追加し、求人一覧→詳細→応募作成の UI フローを自動テストする。
- [ ] Auth Context + Profile Context と組み合わせた統合テストを 1 本用意し、求人応募後に応募一覧へ遷移する UI 状態を検証する。

## 4. CI / ターボランナー

- [ ] `turbo.json` に `jobs:test`（求人関連パッケージのテスト）を追加し、`test` タスクから参照する。
- [ ] GitHub Actions に以下のジョブを追加し、main ブランチのゲートに設定する。
  - `go test ./...` (`apps/api`)
  - `pnpm test --filter=@chefnext/api-client`
  - `pnpm test --filter=@chefnext/web`
  - Playwright (`pnpm exec playwright test --project=chromium jobs.spec.ts` など)
- [ ] 必要に応じて Redis/PostgreSQL を `services:` セクションで起動し、応募 API の結合テストを CI 上でも走らせる。

## 5. コマンド例

```bash
# バックエンドユースケーステスト
cd apps/api
go test ./internal/usecase/job ./internal/usecase/application

# パッケージテスト
pnpm --filter @chefnext/api-client test
pnpm --filter @chefnext/features test

# Web UI レンダリング / E2E
pnpm --filter @chefnext/web test
pnpm exec playwright test jobs.spec.ts
```

このドキュメントをベースに、Milestone 3 の issue/Turbo タスクへ順次反映してください。
