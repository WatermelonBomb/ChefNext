# ChefNext 実装ロードマップ

## 現在の状況

### ✅ 完了
- モノレポ構造の構築
- フロントエンド基盤（Vite + React + TypeScript + shadcn/ui）
- ドキュメント整備（Go基準で統一）

### 🚧 未着手
- バックエンド実装（Go）
- データベース設計・構築
- インフラ構築
- フロントエンドのNext.js移行

---

## Phase 0: 開発環境セットアップ（1-2週間）

### Task 0.1: ローカル開発環境構築
- [ ] `docker-compose.yml` 作成
  - PostgreSQL 15
  - Redis
  - MinIO (S3互換ストレージ)
  - MailPit (メール確認)
- [ ] 環境変数テンプレート作成（`.env.example`）
- [ ] `Makefile` 作成（よく使うコマンドの短縮）

**成果物**: `docker-compose up` で全依存サービスが起動

### Task 0.2: Goプロジェクト初期化
- [ ] `apps/api/go.mod` 初期化
- [ ] 基本的なディレクトリ構造作成
  ```
  apps/api/
  ├─ cmd/api/main.go
  ├─ internal/pkg/config/
  ├─ internal/pkg/logger/
  └─ Makefile
  ```
- [ ] 設定ファイル読み込み実装（`godotenv`）
- [ ] 構造化ログ実装（`slog`）
- [ ] ヘルスチェックエンドポイント実装

**成果物**: `go run cmd/api/main.go` でサーバー起動、`/health` で応答

### Task 0.3: データベース基盤構築
- [ ] goose インストール・セットアップ
- [ ] 初期マイグレーション作成（`users` テーブル）
- [ ] sqlc セットアップ（`sqlc.yaml`）
- [ ] 基本的なクエリ定義・生成確認

**成果物**: マイグレーション実行可能、sqlcで型安全なクエリ生成確認

---

## Phase 1: 認証基盤（2-3週間）

### Task 1.1: ユーザー認証スキーマ設計
- [ ] `users` テーブル設計
  - id, email, password_hash, role, kyc_status, created_at, updated_at
- [ ] マイグレーション作成
- [ ] sqlc クエリ定義（CreateUser, GetUserByEmail等）

**成果物**: ユーザーテーブル作成完了、CRUD操作可能

### Task 1.2: Protocol Buffers 定義（認証）
- [ ] Buf セットアップ（`buf.yaml`, `buf.gen.yaml`）
- [ ] `proto/identity/v1/auth.proto` 作成
  - RegisterRequest/Response
  - LoginRequest/Response
  - RefreshTokenRequest/Response
- [ ] Connect-Go コード生成
- [ ] Connect-Web (TypeScript) コード生成

**成果物**: Protocol Buffers から型安全なコード生成完了

### Task 1.3: 認証ロジック実装
- [ ] パスワードハッシュ（Argon2id）
- [ ] JWT生成・検証
- [ ] Refresh Token（Redis保存）
- [ ] ミドルウェア（認証チェック、Role検証）

**成果物**: 認証APIの実装完了

### Task 1.4: 認証APIハンドラー実装
- [ ] `internal/handler/identity/` 実装
  - Register
  - Login
  - RefreshToken
  - Logout
- [ ] バリデーション実装
- [ ] エラーハンドリング統一

**成果物**: `/api/identity/v1/register` 等が動作

### Task 1.5: フロントエンド認証統合
- [ ] `packages/api-client` にConnect-Web生成コード配置
- [ ] `apps/web` に認証フック実装
  - `useAuth()` - ログイン状態管理
  - `useRegister()` - 登録
  - `useLogin()` - ログイン
- [ ] ログイン/登録ページ実装
- [ ] 認証済みルート保護

**成果物**: フロントエンドからログイン/登録が可能

---

## Phase 2: プロフィール管理（2-3週間）

### Task 2.1: Chef/Restaurantプロフィールスキーマ
- [ ] `chef_profiles` テーブル設計
  - user_id, skill_tree_json, specialties, work_areas, years_exp等
- [ ] `restaurants` テーブル設計
  - user_id, name, address, description等
- [ ] マイグレーション作成
- [ ] sqlc クエリ定義

**成果物**: プロフィールテーブル作成完了

### Task 2.2: プロフィールAPI実装
- [ ] Protocol Buffers 定義（`proto/chef/v1/`, `proto/restaurant/v1/`）
- [ ] UseCase実装
  - CreateChefProfile
  - UpdateChefProfile
  - GetChefProfile
- [ ] Connect ハンドラー実装
- [ ] RBAC実装（自分のプロフィールのみ編集可能）

**成果物**: プロフィールCRUD API完成

### Task 2.3: フロントエンドプロフィール画面
- [ ] シェフプロフィール作成/編集フォーム
- [ ] レストランプロフィール作成/編集フォーム
- [ ] プロフィール表示ページ
- [ ] スキルツリー入力UI（JSON構造）

**成果物**: フロントエンドでプロフィール管理可能

---

## Phase 3: 求人機能（3-4週間）

### Task 3.1: 求人スキーマ設計
- [ ] `jobs` テーブル設計
  - restaurant_id, title, description, teachable_skills (JSONB), salary_min, salary_max, status等
- [ ] 全文検索用インデックス追加（pg_trgm, tsvector）
- [ ] マイグレーション作成

**成果物**: 求人テーブル作成完了

### Task 3.2: 求人CRUD API実装
- [ ] Protocol Buffers 定義（`proto/restaurant/v1/job.proto`）
- [ ] UseCase実装
  - CreateJob
  - UpdateJob
  - ListJobs（検索・フィルタリング）
  - GetJob
- [ ] 全文検索実装（PostgreSQL GIN index）

**成果物**: 求人CRUD API完成

### Task 3.3: 応募機能実装
- [ ] `applications` テーブル設計
- [ ] Protocol Buffers 定義（`proto/matchmaking/v1/`）
- [ ] 応募API実装
  - ApplyToJob
  - ListApplications（Chef/Restaurant別）
  - UpdateApplicationStatus

**成果物**: 応募機能API完成

### Task 3.4: フロントエンド求人画面
- [ ] 求人一覧ページ（検索・フィルタリング）
- [ ] 求人詳細ページ
- [ ] 求人作成/編集フォーム（Restaurant用）
- [ ] 応募ボタン・応募フォーム（Chef用）
- [ ] 応募管理ページ（両者）

**成果物**: フロントエンドで求人管理・応募可能

---

## Phase 4: 画像アップロード（1-2週間）

### Task 4.1: ポートフォリオスキーマ
- [ ] `portfolio_items` テーブル
- [ ] `portfolio_photos` テーブル（s3_key, size, blurhash等）
- [ ] マイグレーション作成

**成果物**: ポートフォリオテーブル作成完了

### Task 4.2: S3署名URL発行API
- [ ] AWS SDK v2セットアップ
- [ ] Presigned URL生成実装
- [ ] Protocol Buffers 定義（`proto/chef/v1/upload.proto`）
- [ ] API実装（GenerateUploadURL）

**成果物**: 署名URL発行API完成

### Task 4.3: 画像処理Lambda
- [ ] Go Lambda関数作成（`imaging` ライブラリ）
- [ ] EXIF除去、リサイズ（256/1024/1920px）、WebP変換
- [ ] S3イベントトリガー設定
- [ ] DLQ設定

**成果物**: 画像アップロード→自動処理パイプライン完成

### Task 4.4: フロントエンド画像アップロード
- [ ] 画像アップロードコンポーネント
- [ ] プレースホルダー表示
- [ ] ポートフォリオ管理画面

**成果物**: フロントエンドから画像アップロード可能

---

## Phase 5: チャット・通知（3-4週間）

### Task 5.1: チャットスキーマ
- [ ] `conversations` テーブル
- [ ] `messages` テーブル
- [ ] マイグレーション作成

**成果物**: チャットテーブル作成完了

### Task 5.2: WebSocket実装
- [ ] gorilla/websocket セットアップ
- [ ] 接続管理（Redis Set）
- [ ] メッセージ送受信
- [ ] オンラインステータス管理

**成果物**: WebSocketサーバー完成

### Task 5.3: 通知システム
- [ ] asynq セットアップ
- [ ] 通知キュー実装
- [ ] メール送信（SendGrid）
- [ ] WebSocket通知配信

**成果物**: 通知システム完成

### Task 5.4: フロントエンドチャット
- [ ] WebSocket接続実装
- [ ] チャット画面
- [ ] 通知表示

**成果物**: リアルタイムチャット機能完成

---

## Phase 6: インフラ構築（2-3週間）

### Task 6.1: Terraform基盤
- [ ] VPC構築（2AZ、Public/Private Subnet）
- [ ] RDS PostgreSQL構築
- [ ] ElastiCache Redis構築
- [ ] S3バケット作成
- [ ] CloudFront設定

**成果物**: AWSインフラ構築完了

### Task 6.2: ECS Fargate設定
- [ ] ECR リポジトリ作成
- [ ] ECSクラスター・タスク定義
- [ ] ALB設定
- [ ] Auto Scaling設定

**成果物**: ECS環境構築完了

### Task 6.3: CI/CD構築
- [ ] GitHub Actions ワークフロー作成
  - Lint/Test
  - Docker build/push
  - ECS deploy
- [ ] Secrets管理（GitHub Secrets、AWS Secrets Manager）

**成果物**: 自動デプロイパイプライン完成

---

## Phase 7: MVP完成・テスト（2-3週間）

### Task 7.1: 残機能実装
- [ ] レビュー機能
- [ ] 面談予約機能
- [ ] 通報機能
- [ ] 管理画面（基本）

**成果物**: MVP全機能実装完了

### Task 7.2: E2Eテスト
- [ ] Playwright セットアップ
- [ ] 主要フローのテストシナリオ作成
- [ ] CI組み込み

**成果物**: 自動E2Eテスト完成

### Task 7.3: 負荷テスト
- [ ] k6 セットアップ
- [ ] シナリオ作成（検索、チャット、画像署名）
- [ ] パフォーマンス計測
- [ ] ボトルネック特定・改善

**成果物**: P95 < 1.5s 達成

### Task 7.4: セキュリティチェック
- [ ] OWASP ASVS L1チェックリスト消化
- [ ] govulncheck 実行
- [ ] Trivy スキャン
- [ ] OWASP ZAP スキャン

**成果物**: セキュリティ基準クリア

---

## Phase 8: Next.js移行（オプション）

### Task 8.1: Next.js プロジェクト作成
- [ ] `apps/web-next` 作成
- [ ] App Router セットアップ
- [ ] TailwindCSS + shadcn/ui 移行

### Task 8.2: 既存コンポーネント移行
- [ ] ページコンポーネント移行
- [ ] 認証フロー移行
- [ ] API接続移行

### Task 8.3: SSR/SSG実装
- [ ] 求人一覧のSSG
- [ ] 求人詳細のSSR
- [ ] プロフィールページのSSR

**成果物**: Next.js版フロントエンド完成

---

## タスク優先順位

### 🔴 クリティカル（MVP必須）
- Phase 0: 開発環境
- Phase 1: 認証
- Phase 2: プロフィール
- Phase 3: 求人・応募

### 🟡 重要（MVP完成に必要）
- Phase 4: 画像アップロード
- Phase 5: チャット・通知
- Phase 6: インフラ
- Phase 7: テスト・改善

### 🟢 推奨（後回し可）
- Phase 8: Next.js移行

---

## 推奨スケジュール（フルタイム1名想定）

- **Week 1-2**: Phase 0 (開発環境)
- **Week 3-5**: Phase 1 (認証)
- **Week 6-8**: Phase 2 (プロフィール)
- **Week 9-12**: Phase 3 (求人・応募)
- **Week 13-14**: Phase 4 (画像)
- **Week 15-18**: Phase 5 (チャット)
- **Week 19-21**: Phase 6 (インフラ)
- **Week 22-24**: Phase 7 (テスト・改善)

**MVP完成目標**: 約6ヶ月

---

最終更新: 2025-11-27
