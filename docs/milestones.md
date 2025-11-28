# ChefNext マイルストーン

このドキュメントでは、MVP達成までの各マイルストーンを定義します。各マイルストーンは**デモ可能な機能**を提供し、段階的に価値を積み上げていきます。

---

## Milestone 0: 開発環境構築 🛠️

**期間**: 1-2週間
**目標**: ローカルで開発できる環境を整備し、最初のAPIが動作する状態にする

### 完了条件 (Definition of Done)
- [ ] `docker-compose up` で全依存サービス（PostgreSQL, Redis, MinIO, MailPit）が起動する
- [ ] Goサーバーが起動し、`http://localhost:8080/health` でヘルスチェックが応答する
- [ ] データベースマイグレーションが実行できる
- [ ] 構造化ログが出力される
- [ ] ホットリロード（`air`）が動作する

### デモ可能な機能
- ✅ ヘルスチェックエンドポイント
- ✅ データベース接続確認
- ✅ ログ出力確認

### タスクチェックリスト

#### Task 0.1: Docker Compose設定
- [ ] `infra/docker/docker-compose.yml` 作成
  ```yaml
  services:
    postgres:
      image: postgres:15
      environment:
        POSTGRES_DB: chefnext_dev
        POSTGRES_USER: chefnext
        POSTGRES_PASSWORD: password
      ports:
        - "5432:5432"

    redis:
      image: redis:7-alpine
      ports:
        - "6379:6379"

    minio:
      image: minio/minio
      command: server /data --console-address ":9001"
      environment:
        MINIO_ROOT_USER: minioadmin
        MINIO_ROOT_PASSWORD: minioadmin
      ports:
        - "9000:9000"
        - "9001:9001"

    mailpit:
      image: axllent/mailpit
      ports:
        - "1025:1025"
        - "8025:8025"
  ```
- [ ] `.env.example` 作成
- [ ] `Makefile` 作成（`make dev`, `make stop`, `make clean` 等）

#### Task 0.2: Goプロジェクト初期化
- [ ] `cd apps/api && go mod init`
- [ ] 基本ディレクトリ構造作成
  ```bash
  mkdir -p cmd/api
  mkdir -p internal/pkg/{config,logger}
  mkdir -p db/{migrations,queries}
  ```
- [ ] `cmd/api/main.go` 作成（最小限のHTTPサーバー）
- [ ] 設定読み込み実装（`internal/pkg/config/config.go`）
- [ ] 構造化ログ実装（`internal/pkg/logger/logger.go` with `slog`）
- [ ] `/health` エンドポイント実装

#### Task 0.3: データベース基盤
- [ ] goose インストール: `go install github.com/pressly/goose/v3/cmd/goose@latest`
- [ ] 初期マイグレーション作成
  ```bash
  goose -dir db/migrations create init_users sql
  ```
- [ ] `users` テーブル定義
  ```sql
  CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] sqlc インストール: `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`
- [ ] `sqlc.yaml` 作成
- [ ] 基本クエリ定義（`db/queries/users.sql`）
- [ ] `sqlc generate` 実行確認

#### Task 0.4: ホットリロード設定
- [ ] air インストール: `go install github.com/cosmtrek/air@latest`
- [ ] `.air.toml` 作成
- [ ] `make dev` で air 起動確認

### 完了の証明
```bash
# ターミナル1
make dev  # docker-compose up + air

# ターミナル2
curl http://localhost:8080/health
# → {"status":"ok","database":"connected"}

# ターミナル3
goose -dir db/migrations postgres "postgresql://..." up
# → マイグレーション成功
```

---

## Milestone 1: 認証機能 🔐

**期間**: 2-3週間
**目標**: ユーザー登録・ログインができ、JWTで認証されたAPIリクエストが可能になる

### 完了条件
- [ ] ユーザー登録API（Email/Password）が動作する
- [ ] ログインAPI（Email/Password）が動作し、JWT + Refresh Tokenが返却される
- [ ] 認証が必要なAPIエンドポイントがJWTで保護されている
- [ ] Refresh Tokenでアクセストークンを更新できる
- [ ] フロントエンドから登録・ログインができる
- [ ] フロントエンドで認証状態を管理できる（ログイン/ログアウト）

### デモ可能な機能
- ✅ ユーザー登録
- ✅ ログイン
- ✅ ログアウト
- ✅ 保護されたエンドポイントへのアクセス

### タスクチェックリスト

#### Task 1.1: Protocol Buffers定義
- [ ] Buf CLI インストール: `brew install bufbuild/buf/buf`
- [ ] `buf.yaml` 作成（`apps/api/`）
- [ ] `buf.gen.yaml` 作成（Go + TypeScript生成設定）
- [ ] `proto/identity/v1/auth.proto` 作成
  ```protobuf
  syntax = "proto3";
  package identity.v1;

  service AuthService {
    rpc Register(RegisterRequest) returns (RegisterResponse);
    rpc Login(LoginRequest) returns (LoginResponse);
    rpc RefreshToken(RefreshTokenRequest) returns (RefreshTokenResponse);
    rpc Logout(LogoutRequest) returns (LogoutResponse);
  }

  message RegisterRequest {
    string email = 1;
    string password = 2;
    string role = 3; // "CHEF" or "RESTAURANT"
  }

  message RegisterResponse {
    string user_id = 1;
    string access_token = 2;
    string refresh_token = 3;
  }
  // ... 他のメッセージ定義
  ```
- [ ] `buf generate` 実行
- [ ] 生成コード確認（`internal/gen/` と `packages/api-client/gen/`）

#### Task 1.2: 認証ロジック実装
- [ ] Argon2id ハッシュ実装（`internal/pkg/auth/password.go`）
- [ ] JWT生成・検証実装（`internal/pkg/auth/jwt.go`）
  - `github.com/golang-jwt/jwt/v5` 使用
  - Access Token: 15分
  - Refresh Token: 30日（Redisに保存）
- [ ] Redis クライアント実装（`internal/pkg/redis/client.go`）
- [ ] Refresh Token管理実装

#### Task 1.3: データベース層
- [ ] マイグレーション作成（`users` テーブル拡張）
  ```sql
  ALTER TABLE users ADD COLUMN kyc_status VARCHAR(20) DEFAULT 'PENDING';
  ALTER TABLE users ADD COLUMN kyc_flags JSONB DEFAULT '{}';
  ```
- [ ] sqlc クエリ定義
  ```sql
  -- name: CreateUser :one
  INSERT INTO users (email, password_hash, role)
  VALUES ($1, $2, $3)
  RETURNING *;

  -- name: GetUserByEmail :one
  SELECT * FROM users WHERE email = $1;

  -- name: GetUserByID :one
  SELECT * FROM users WHERE id = $1;
  ```
- [ ] `sqlc generate` 実行

#### Task 1.4: UseCase実装
- [ ] `internal/usecase/identity/register.go`
  - メール重複チェック
  - パスワードハッシュ
  - ユーザー作成
  - JWT生成
- [ ] `internal/usecase/identity/login.go`
  - ユーザー検索
  - パスワード検証
  - JWT生成
- [ ] `internal/usecase/identity/refresh_token.go`
- [ ] `internal/usecase/identity/logout.go`

#### Task 1.5: Connect ハンドラー実装
- [ ] Connect-Go セットアップ
  - `go get connectrpc.com/connect`
- [ ] `internal/handler/identity/auth_handler.go`
  - RegisterHandler
  - LoginHandler
  - RefreshTokenHandler
  - LogoutHandler
- [ ] エラーハンドリング統一（Connect Error Codes）
- [ ] バリデーション実装

#### Task 1.6: ミドルウェア実装
- [ ] 認証ミドルウェア（`internal/middleware/auth.go`）
  - JWT検証
  - ユーザー情報をContextに格納
- [ ] Roleチェックミドルウェア
- [ ] Rate Limiting（`golang.org/x/time/rate`）

#### Task 1.7: フロントエンド統合
- [ ] Connect-Web セットアップ（`packages/api-client/`）
  ```bash
  npm install @connectrpc/connect @connectrpc/connect-web
  ```
- [ ] 生成されたクライアントを`packages/api-client/`に配置
- [ ] `apps/web/src/lib/api.ts` 作成（Connect Transport設定）
- [ ] `apps/web/src/hooks/useAuth.ts` 実装
  - ログイン状態管理
  - トークン自動更新
- [ ] `apps/web/src/hooks/useRegister.ts`
- [ ] `apps/web/src/hooks/useLogin.ts`
- [ ] ログイン/登録ページ実装
- [ ] 認証済みルート保護

### 完了の証明
```bash
# バックエンドテスト
curl -X POST http://localhost:8080/identity.v1.AuthService/Register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"CHEF"}'
# → {"user_id":"...","access_token":"...","refresh_token":"..."}

# フロントエンド
# ブラウザでログイン → ダッシュボード表示 → ログアウト
```

---

## Milestone 2: プロフィール管理 👤

**期間**: 2-3週間
**目標**: Chef/Restaurantのプロフィールを作成・編集・表示できる

### 完了条件
- [ ] Chefプロフィール作成・編集APIが動作する
- [ ] Restaurantプロフィール作成・編集APIが動作する
- [ ] プロフィール取得APIが動作する
- [ ] スキルツリーをJSON形式で保存・取得できる
- [ ] フロントエンドでプロフィール作成フォームが動作する
- [ ] フロントエンドでプロフィール表示ページが動作する
- [ ] 自分のプロフィールのみ編集可能（RBAC）

### デモ可能な機能
- ✅ シェフプロフィール作成・編集
- ✅ レストランプロフィール作成・編集
- ✅ プロフィール表示
- ✅ スキルツリー編集

### タスクチェックリスト

#### Task 2.1: データベース設計
- [ ] マイグレーション作成
  ```sql
  CREATE TABLE chef_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      skill_tree_json JSONB,
      specialties TEXT[],
      work_areas TEXT[],
      years_exp INTEGER,
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_chef_specialties ON chef_profiles USING GIN (specialties);
  CREATE INDEX idx_chef_work_areas ON chef_profiles USING GIN (work_areas);

  CREATE TABLE restaurants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      address TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] sqlc クエリ定義

#### Task 2.2: Protocol Buffers定義
- [ ] `proto/chef/v1/profile.proto` 作成
- [ ] `proto/restaurant/v1/profile.proto` 作成
- [ ] `buf generate`

#### Task 2.3: バックエンド実装
- [ ] UseCase実装（CreateProfile, UpdateProfile, GetProfile）
- [ ] Connect ハンドラー実装
- [ ] RBAC検証（自分のプロフィールのみ編集可）
- [ ] JSON検証（スキルツリー構造）

#### Task 2.4: フロントエンド実装
- [ ] プロフィール作成フォーム（Chef）
- [ ] プロフィール作成フォーム（Restaurant）
- [ ] プロフィール表示ページ
- [ ] スキルツリー入力UI

### 完了の証明
```bash
# Chef登録 → プロフィール作成 → 表示確認
# Restaurant登録 → プロフィール作成 → 表示確認
```

---

## Milestone 3: 求人機能 💼

**期間**: 3-4週間
**目標**: レストランが求人を投稿し、シェフが検索・応募できる

### 完了条件
- [ ] 求人作成・編集・削除APIが動作する
- [ ] 求人検索API（キーワード、スキル、エリアフィルタ）が動作する
- [ ] 求人一覧取得（ページネーション）が動作する
- [ ] 応募APIが動作する
- [ ] 応募一覧取得（Chef/Restaurant別）が動作する
- [ ] フロントエンドで求人検索・一覧表示ができる
- [ ] フロントエンドで求人詳細表示・応募ができる
- [ ] フロントエンドで求人投稿・編集ができる（Restaurant）

### デモ可能な機能
- ✅ 求人投稿（Restaurant）
- ✅ 求人検索（Chef）
- ✅ 求人詳細表示
- ✅ 求人への応募（Chef）
- ✅ 応募管理（両者）

### タスクチェックリスト

#### Task 3.1: データベース設計
- [ ] マイグレーション作成
  ```sql
  CREATE TABLE jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      teachable_skills JSONB,
      shifts_json JSONB,
      salary_min INTEGER,
      salary_max INTEGER,
      location TEXT,
      status VARCHAR(20) DEFAULT 'OPEN',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_jobs_restaurant ON jobs(restaurant_id);
  CREATE INDEX idx_jobs_status ON jobs(status);
  CREATE INDEX idx_jobs_teachable_skills ON jobs USING GIN (teachable_skills);

  -- 全文検索用
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  ALTER TABLE jobs ADD COLUMN search_vector tsvector;
  CREATE INDEX idx_jobs_search ON jobs USING GIN (search_vector);

  CREATE TABLE applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
      chef_id UUID REFERENCES chef_profiles(id) ON DELETE CASCADE,
      status VARCHAR(20) DEFAULT 'PENDING',
      cover_letter TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(job_id, chef_id)
  );
  ```
- [ ] sqlc クエリ定義（検索クエリ含む）

#### Task 3.2: Protocol Buffers定義
- [ ] `proto/restaurant/v1/job.proto`
- [ ] `proto/matchmaking/v1/application.proto`
- [ ] `buf generate`

#### Task 3.3: バックエンド実装
- [ ] 求人CRUD UseCase
- [ ] 求人検索UseCase（PostgreSQL全文検索）
- [ ] 応募UseCase
- [ ] Connect ハンドラー
- [ ] RBAC（求人はRestaurantのみ作成可、応募はChefのみ）

#### Task 3.4: フロントエンド実装
- [ ] 求人一覧ページ（検索・フィルタリング）
- [ ] 求人詳細ページ
- [ ] 求人投稿フォーム（Restaurant）
- [ ] 応募フォーム（Chef）
- [ ] 応募管理ページ

### 完了の証明
```bash
# Restaurant: 求人投稿
# Chef: 求人検索 → 詳細表示 → 応募
# Restaurant: 応募一覧確認
```

---

## Milestone 4: 画像アップロード 📸

**期間**: 1-2週間
**目標**: シェフがポートフォリオに料理写真をアップロードできる

### 完了条件
- [ ] S3 Presigned URL発行APIが動作する
- [ ] クライアントから直接S3にアップロードできる
- [ ] Lambda画像処理パイプラインが動作する（EXIF除去、リサイズ、WebP変換）
- [ ] フロントエンドで画像アップロードUIが動作する
- [ ] ポートフォリオ一覧表示が動作する

### デモ可能な機能
- ✅ 料理写真アップロード
- ✅ ポートフォリオ表示
- ✅ 画像自動処理（3サイズ生成）

### タスクチェックリスト

#### Task 4.1: データベース設計
- [ ] マイグレーション作成
  ```sql
  CREATE TABLE portfolio_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chef_profile_id UUID REFERENCES chef_profiles(id) ON DELETE CASCADE,
      title VARCHAR(255),
      description TEXT,
      created_date DATE,
      created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE portfolio_photos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
      s3_key VARCHAR(500) NOT NULL,
      size VARCHAR(20), -- '256', '1024', '1920', 'original'
      blurhash VARCHAR(100),
      is_cover BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
  );
  ```

#### Task 4.2: S3署名URL発行
- [ ] AWS SDK v2セットアップ
- [ ] Presigned URL生成実装
- [ ] Protocol Buffers定義（`proto/chef/v1/upload.proto`）
- [ ] Connect ハンドラー

#### Task 4.3: Lambda画像処理
- [ ] Go Lambda関数作成
- [ ] imaging ライブラリで処理（EXIF除去、リサイズ、WebP変換）
- [ ] S3イベントトリガー設定
- [ ] DLQ設定

#### Task 4.4: フロントエンド実装
- [ ] 画像アップロードコンポーネント
- [ ] プレースホルダー表示
- [ ] ポートフォリオ管理画面

### 完了の証明
```bash
# Chef: ポートフォリオ作成 → 画像アップロード → 自動処理確認 → 表示確認
```

---

## Milestone 5: チャット・通知 💬

**期間**: 3-4週間
**目標**: 応募したシェフとレストラン間でリアルタイムチャットができる

### 完了条件
- [ ] WebSocketサーバーが動作する
- [ ] チャットメッセージ送受信ができる
- [ ] メッセージ履歴が保存・取得できる
- [ ] オンラインステータス管理ができる
- [ ] 通知システム（asynq）が動作する
- [ ] メール通知が送信される
- [ ] WebSocket通知が配信される
- [ ] フロントエンドでリアルタイムチャットができる

### デモ可能な機能
- ✅ リアルタイムチャット
- ✅ メッセージ履歴表示
- ✅ オンラインステータス表示
- ✅ メール通知

### タスクチェックリスト

#### Task 5.1: データベース設計
- [ ] マイグレーション作成
  ```sql
  CREATE TABLE conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
      sender_id UUID REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE INDEX idx_messages_conversation ON messages(conversation_id);
  ```

#### Task 5.2: WebSocket実装
- [ ] gorilla/websocket セットアップ
- [ ] 接続管理（Redis Set）
- [ ] メッセージ送受信
- [ ] オンラインステータス管理

#### Task 5.3: 通知システム
- [ ] asynq セットアップ
- [ ] 通知キュー実装
- [ ] メール送信（SendGrid）
- [ ] WebSocket通知配信

#### Task 5.4: フロントエンド実装
- [ ] WebSocket接続
- [ ] チャット画面
- [ ] 通知表示

### 完了の証明
```bash
# Chef ↔ Restaurant でリアルタイムチャット
# メール通知受信確認（MailPit）
```

---

## Milestone 6: 本番デプロイ 🚀

**期間**: 2-3週間
**目標**: AWSに本番環境を構築し、自動デプロイができる

### 完了条件
- [ ] Terraformで全AWSリソースが構築される
- [ ] ECS Fargateでアプリケーションが稼働する
- [ ] RDS PostgreSQL、ElastiCache Redisが稼働する
- [ ] S3 + CloudFrontで画像配信される
- [ ] GitHub ActionsでCI/CDが動作する
- [ ] ドメイン設定・SSL証明書が設定される
- [ ] 本番環境にアクセスできる

### デモ可能な機能
- ✅ 本番環境での全機能動作
- ✅ 自動デプロイパイプライン

### タスクチェックリスト

#### Task 6.1: Terraform基盤
- [ ] VPC構築
- [ ] RDS PostgreSQL
- [ ] ElastiCache Redis
- [ ] S3バケット
- [ ] CloudFront

#### Task 6.2: ECS Fargate
- [ ] ECRリポジトリ
- [ ] ECSクラスター・タスク定義
- [ ] ALB設定
- [ ] Auto Scaling

#### Task 6.3: CI/CD
- [ ] GitHub Actions ワークフロー
- [ ] Secrets管理

### 完了の証明
```bash
# https://app.chefnext.com にアクセス → 動作確認
# コミット → 自動デプロイ確認
```

---

## Milestone 7: MVP完成 🎉

**期間**: 2-3週間
**目標**: 残機能を実装し、テスト・改善を完了する

### 完了条件
- [ ] レビュー機能が動作する
- [ ] 面談予約機能が動作する
- [ ] 通報機能が動作する
- [ ] E2Eテストが通る
- [ ] 負荷テストでP95 < 1.5s達成
- [ ] セキュリティチェック完了
- [ ] ドキュメント整備完了

### デモ可能な機能
- ✅ 全MVP機能
- ✅ パフォーマンス保証
- ✅ セキュリティ保証

### タスクチェックリスト

#### Task 7.1: 残機能実装
- [ ] レビュー機能
- [ ] 面談予約機能
- [ ] 通報機能

#### Task 7.2: テスト
- [ ] E2Eテスト（Playwright）
- [ ] 負荷テスト（k6）
- [ ] セキュリティテスト

#### Task 7.3: ドキュメント
- [ ] APIドキュメント
- [ ] デプロイ手順
- [ ] 運用手順

### 完了の証明
```bash
# 全機能を通しでデモ
# パフォーマンス計測結果
# セキュリティレポート
```

---

## 進捗トラッキング

### 現在のステータス
- ✅ Milestone 0: 0% (未着手)
- ⬜ Milestone 1: 0%
- ⬜ Milestone 2: 0%
- ⬜ Milestone 3: 0%
- ⬜ Milestone 4: 0%
- ⬜ Milestone 5: 0%
- ⬜ Milestone 6: 0%
- ⬜ Milestone 7: 0%

### 次のアクション
**📍 Milestone 0: 開発環境構築を開始**

---

最終更新: 2025-11-27
