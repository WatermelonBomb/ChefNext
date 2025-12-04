# ChefNext 開発環境セットアップガイド

最終更新: 2025-12-03

## 目次
1. [必要な環境](#必要な環境)
2. [初回セットアップ](#初回セットアップ)
3. [開発サーバーの起動](#開発サーバーの起動)
4. [よくあるトラブルシューティング](#よくあるトラブルシューティング)
5. [開発ワークフロー](#開発ワークフロー)

---

## 必要な環境

### 必須ツール
- **Go** 1.25+ ([インストール](https://golang.org/doc/install))
- **Node.js** 20+ ([インストール](https://nodejs.org/))
- **pnpm** 9.12.3+ ([インストール](https://pnpm.io/installation))
- **Docker Desktop** ([インストール](https://www.docker.com/products/docker-desktop))
- **Make** (macOS/Linuxには通常プリインストール済み)

### 推奨ツール
- **Air** (Go ホットリロード): `go install github.com/air-verse/air@latest`
- **goose** (DBマイグレーション): `go install github.com/pressly/goose/v3/cmd/goose@latest`
- **sqlc** (SQLコード生成): `go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest`
- **buf** (Protobufコード生成): `brew install bufbuild/buf/buf` (macOS)

---

## 初回セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-org/ChefNext-1.git
cd ChefNext-1
```

### 2. pnpm ワークスペースの依存関係をインストール
```bash
pnpm install
```

### 3. Go モジュールのダウンロード
```bash
cd apps/api
go mod download
cd ../..
```

### 4. 環境変数の設定
`apps/api/.env` ファイルを作成します：

```bash
# apps/api/.env
DATABASE_URL=postgres://chefnext:password@localhost:5432/chefnext_dev?sslmode=disable
REDIS_URL=localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8080
```

> **注意**: 本番環境では必ず強力な `JWT_SECRET` を設定してください。

### 5. Docker Desktop を起動
macOS の場合、アプリケーションから Docker Desktop を起動してください。
起動を確認するには：
```bash
docker ps
```

### 6. 依存サービスの起動
PostgreSQL, Redis, MinIO, MailPit を起動します：
```bash
make infra-up
```

または直接 Docker Compose を実行：
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

起動確認：
```bash
docker compose -f infra/docker/docker-compose.yml ps
```

すべてのサービスが `Up` 状態になっていることを確認してください。

### 7. データベースマイグレーション
```bash
make db-migrate
```

または直接実行：
```bash
cd apps/api
export DATABASE_URL="postgres://chefnext:password@localhost:5432/chefnext_dev?sslmode=disable"
goose -dir db/migrations postgres "$DATABASE_URL" up
```

### 8. Protocol Buffers のコード生成（必要に応じて）
```bash
cd apps/api
buf generate
```

### 9. SQL コード生成（必要に応じて）
```bash
cd apps/api
sqlc generate
```

---

## 開発サーバーの起動

### 方法1: すべてのサービスを並行起動（推奨）
```bash
# ルートディレクトリから
make dev
```

このコマンドは以下を実行します：
1. Docker Compose で依存サービスを起動（PostgreSQL, Redis, MinIO, MailPit）
2. Go API サーバーを Air でホットリロード起動（`apps/api`）

**注意**: `make dev` は API のみを起動します。Web サーバーは別ターミナルで起動してください。

### 方法2: 個別に起動

#### ステップ1: 依存サービスを起動
```bash
make infra-up
```

#### ステップ2: API サーバーを起動
```bash
# ターミナル1
pnpm dev:api
```

または：
```bash
cd apps/api
air
```

API サーバーは `http://localhost:8080` で起動します。
ヘルスチェック: `curl http://localhost:8080/health`

#### ステップ3: Web サーバーを起動
```bash
# ターミナル2
pnpm dev:web
```

Web サーバーは `http://localhost:3001` で起動します（ポート3000からの変更）。

---

## アクセス可能なURL

起動後、以下のサービスにアクセスできます：

| サービス | URL | 説明 |
|---------|-----|------|
| **Web UI** | http://localhost:3001 | React フロントエンド |
| **API** | http://localhost:8080 | Go バックエンド |
| **PostgreSQL** | localhost:5432 | データベース（接続情報は `.env` 参照） |
| **Redis** | localhost:6379 | キャッシュ |
| **MinIO Console** | http://localhost:9001 | S3互換ストレージ管理画面<br>（user: minioadmin, pass: minioadmin） |
| **MinIO API** | http://localhost:9000 | S3 API エンドポイント |
| **MailPit** | http://localhost:8025 | メール送信テスト画面 |

---

## よくあるトラブルシューティング

### 1. Docker が起動していない
**エラー**: `Cannot connect to the Docker daemon at unix:///.../.docker/run/docker.sock`

**解決方法**:
- macOS: Docker Desktop を起動してください
- Linux: `sudo systemctl start docker`

### 2. Redis 接続エラー
**エラー**: `connect to redis: dial tcp ... operation not permitted`

**原因**: Docker Compose が起動していない、または Redis コンテナが起動していない

**解決方法**:
```bash
# Docker Compose の状態を確認
docker compose -f infra/docker/docker-compose.yml ps

# すべてのサービスを再起動
docker compose -f infra/docker/docker-compose.yml restart

# Redis のログを確認
docker compose -f infra/docker/docker-compose.yml logs redis
```

### 3. Vite がポート3000を開けない
**エラー**: `listen EPERM ... ::1:3000`

**原因**: macOS のパーミッションまたは既に使用中のポート

**解決方法**:
- ✅ **既に対応済み**: `apps/web/vite.config.ts` でポートを3001に変更しています
- 別のポートを使いたい場合: `vite.config.ts` の `server.port` を変更してください

### 4. データベースマイグレーションが実行されていない
**エラー**: `relation "users" does not exist`

**解決方法**:
```bash
make db-migrate
```

### 5. Go モジュールが見つからない
**エラー**: `package ... is not in GOROOT`

**解決方法**:
```bash
cd apps/api
go mod tidy
go mod download
```

### 6. pnpm の依存関係エラー
**エラー**: `Cannot find module '@chefnext/api-client'`

**解決方法**:
```bash
# ルートディレクトリで実行
pnpm install

# または特定のワークスペースのみ
pnpm install --filter @chefnext/web
```

### 7. Protocol Buffers の生成コードが古い
**症状**: API の型が一致しない、フィールドが見つからない

**解決方法**:
```bash
cd apps/api
buf generate
```

### 8. すべてをクリーンアップして再起動したい
```bash
# Docker コンテナとボリュームを削除
make infra-clean

# 依存関係を再インストール
pnpm install

# 再起動
make infra-up
make db-migrate
pnpm dev:api  # ターミナル1
pnpm dev:web  # ターミナル2
```

---

## 開発ワークフロー

### データベーススキーマの変更
1. 新しいマイグレーションファイルを作成：
   ```bash
   cd apps/api
   goose -dir db/migrations create add_new_table sql
   ```

2. マイグレーションを編集：
   ```bash
   # db/migrations/YYYYMMDDHHMMSS_add_new_table.sql
   -- +goose Up
   CREATE TABLE new_table (...);

   -- +goose Down
   DROP TABLE new_table;
   ```

3. マイグレーションを実行：
   ```bash
   make db-migrate
   ```

4. SQL クエリを追加：
   ```bash
   # apps/api/db/queries/new_table.sql に追加
   ```

5. sqlc でコード生成：
   ```bash
   cd apps/api
   sqlc generate
   ```

### API の変更
1. Protocol Buffers を編集：
   ```bash
   # apps/api/proto/service/v1/service.proto
   ```

2. コード生成：
   ```bash
   cd apps/api
   buf generate
   ```

3. ハンドラーを実装：
   ```bash
   # apps/api/internal/handler/service/handler.go
   ```

4. ホットリロードで自動再起動（Air が起動中の場合）

### フロントエンドの変更
1. コンポーネントを編集：
   ```bash
   # apps/web/src/components/...
   ```

2. Vite が自動的に Hot Module Replacement で更新

### ログの確認
```bash
# すべてのコンテナのログ
make logs

# 特定のサービスのログ
docker compose -f infra/docker/docker-compose.yml logs -f postgres
docker compose -f infra/docker/docker-compose.yml logs -f redis

# API のログ（Air 起動中）
tail -f /tmp/chefnext_api.log
```

---

## Makefile コマンド一覧

| コマンド | 説明 |
|---------|------|
| `make dev` | 依存サービス起動 + API 起動（Air） |
| `make infra-up` | 依存サービスのみ起動（PostgreSQL, Redis, MinIO, MailPit） |
| `make infra-stop` | コンテナを停止（ボリュームは保持） |
| `make infra-clean` | コンテナとボリュームを削除 |
| `make logs` | すべてのコンテナログを表示 |
| `make db-migrate` | データベースマイグレーション実行 |

---

## pnpm スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | すべてのワークスペースを並行起動 |
| `pnpm dev:web` | Web サーバーのみ起動（Vite） |
| `pnpm dev:api` | API サーバーのみ起動（Turbo経由） |
| `pnpm build` | すべてのワークスペースをビルド |
| `pnpm lint` | すべてのワークスペースで lint 実行（予定） |
| `pnpm test` | すべてのワークスペースでテスト実行（予定） |

---

## 次のステップ

セットアップが完了したら、以下のドキュメントを参照してください：

- [技術スタック全体像](./tech-stack.md)
- [機能別技術スタック](./tech-stack-by-feature.md)
- [マイルストーン 1.1](./milestones1.1.md)

---

## サポート

問題が解決しない場合は、以下をチェックしてください：
1. Docker Desktop が起動しているか
2. `.env` ファイルが正しく設定されているか
3. すべての依存サービスが `Up` 状態か（`docker compose ps`）
4. ポートが他のプロセスに使用されていないか（`lsof -i :8080`, `lsof -i :3001`）

それでも解決しない場合は、開発チームに連絡してください。
