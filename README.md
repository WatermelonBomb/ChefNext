# ChefNext

> シェフとレストランをつなぐマッチングプラットフォーム

ChefNextは、シェフとレストランを効果的にマッチングするためのプラットフォームです。Web版とモバイル版（今後実装予定）の両方を提供し、pnpm workspace + TurboRepoによるモノレポ構成で開発されています。

## 🚀 クイックスタート

### 必要な環境
- **Go** 1.25+
- **Node.js** 20+
- **pnpm** 9.12.3+
- **Docker Desktop**
- **Make**

### セットアップ

```bash
# 1. リポジトリのクローン
git clone https://github.com/your-org/ChefNext-1.git
cd ChefNext-1

# 2. 依存関係のインストール
pnpm install

# 3. 環境変数の設定
cp apps/api/.env.example apps/api/.env
# .env ファイルを編集してください

# 4. Docker Desktop を起動してから、依存サービスを起動
make infra-up

# 5. データベースマイグレーション
make db-migrate

# 6. 開発サーバーの起動
# ターミナル1: API サーバー
pnpm dev:api

# ターミナル2: Web サーバー
pnpm dev:web
```

### アクセス
- **Web UI**: http://localhost:3001
- **API**: http://localhost:8080
- **MailPit**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

詳細なセットアップ手順は [開発環境セットアップガイド](docs/development-setup.md) を参照してください。

## 📁 ディレクトリ構成

```
ChefNext-1/
├── apps/
│   ├── api/                 # Go バックエンド (Connect-RPC)
│   │   ├── cmd/            # エントリーポイント
│   │   ├── internal/       # 内部パッケージ
│   │   ├── proto/          # Protocol Buffers 定義
│   │   └── db/             # マイグレーション・クエリ
│   ├── web/                # React フロントエンド (Vite)
│   └── mobile/             # Expo モバイルアプリ（予定）
├── packages/
│   ├── api-client/         # Connect-RPC クライアント
│   ├── ui/                 # 共通UIコンポーネント
│   ├── features/           # 機能単位のコンポーネント（予定）
│   └── lint-config/        # ESLint 設定（予定）
├── infra/
│   ├── docker/             # Docker Compose 設定
│   └── terraform/          # Terraform 定義（予定）
├── ops/
│   ├── ci/                 # GitHub Actions 設定
│   └── scripts/            # 運用スクリプト
└── docs/                   # ドキュメント
```

## 🛠️ 技術スタック

### バックエンド
- **Go** 1.25
- **Connect-RPC** (Protocol Buffers)
- **PostgreSQL** 15
- **Redis** 7
- **JWT** 認証
- **sqlc** (型安全なSQLコード生成)
- **goose** (マイグレーション)

### フロントエンド
- **React** 18.3
- **TypeScript**
- **Vite** 6.3
- **Tailwind CSS** 4.x
- **Radix UI**
- **React Hook Form**

### インフラ
- **Docker Compose** (ローカル開発)
- **MinIO** (S3互換ストレージ)
- **MailPit** (メール送信テスト)

### モノレポ
- **pnpm workspace**
- **TurboRepo**

詳細は [技術スタック全体像](docs/tech-stack.md) を参照してください。

## 📚 ドキュメント

- [開発環境セットアップガイド](docs/development-setup.md) - 開発環境の構築手順
- [技術スタック全体像](docs/tech-stack.md) - 使用技術の体系的なまとめ
- [機能別技術スタック](docs/tech-stack-by-feature.md) - 機能ごとの技術詳細
- [マイルストーン 1.1](docs/milestones1.1.md) - プロジェクトロードマップ

## 🎯 プロジェクトステータス

### 完了
- ✅ **Milestone 0**: モノレポ開発環境構築
- ✅ **Milestone 1**: 認証基盤（JWT, bcrypt, Redis）

### 進行中
- 🔄 **Milestone 2**: プロフィール管理（Chef / Restaurant）

### 予定
- ⬜ **Milestone 3**: 求人・応募 + フロント共通化基盤
- ⬜ **Milestone 4**: ポートフォリオ画像アップロード
- ⬜ **Milestone 5**: Expo モバイルアプリ PoC
- ⬜ **Milestone 6**: チャット・通知 + 簡易レビュー
- ⬜ **Milestone 7**: 本番デプロイ + 品質保証 + ストア申請

## 🧰 主要コマンド

### Make コマンド
```bash
make dev          # 依存サービス起動 + API 起動
make infra-up     # 依存サービスのみ起動
make infra-stop   # コンテナを停止
make infra-clean  # コンテナとボリュームを削除
make db-migrate   # データベースマイグレーション実行
make logs         # コンテナログを表示
```

### pnpm スクリプト
```bash
pnpm dev          # すべてのワークスペースを並行起動
pnpm dev:web      # Web サーバーのみ起動
pnpm dev:api      # API サーバーのみ起動
pnpm build        # すべてのワークスペースをビルド
```

## 🔧 開発ワークフロー

### API の変更
1. Protocol Buffers を編集: `apps/api/proto/**/*.proto`
2. コード生成: `cd apps/api && buf generate`
3. ハンドラーを実装: `apps/api/internal/handler/`
4. Air が自動的に再起動

### データベーススキーマの変更
1. マイグレーション作成: `cd apps/api && goose create add_feature sql`
2. マイグレーション編集: `apps/api/db/migrations/`
3. 実行: `make db-migrate`
4. クエリ追加: `apps/api/db/queries/`
5. sqlc 生成: `cd apps/api && sqlc generate`

### フロントエンドの変更
1. コンポーネント編集: `apps/web/src/components/`
2. Vite が自動的に Hot Module Replacement で更新

## 🐛 トラブルシューティング

### Docker が起動していない
```bash
# Docker Desktop を起動してから
docker ps
```

### Redis 接続エラー
```bash
# Docker Compose を再起動
docker compose -f infra/docker/docker-compose.yml restart

# サービスの状態を確認
docker compose -f infra/docker/docker-compose.yml ps
```

### ポートがすでに使用されている
```bash
# ポート使用状況を確認
lsof -i :8080  # API
lsof -i :3001  # Web
```

詳細は [開発環境セットアップガイド](docs/development-setup.md#よくあるトラブルシューティング) を参照してください。

## 🧪 テスト（予定）

```bash
# ユニットテスト
pnpm test

# E2Eテスト（Milestone 7）
pnpm test:e2e

# 負荷試験（Milestone 7）
cd apps/api && k6 run tests/load/basic.js
```

## 📝 ライセンス

TBD

## 🤝 コントリビューション

開発チームメンバーのみ。貢献ガイドラインは今後追加予定。

## 📧 サポート

問題が発生した場合は、開発チームに連絡してください。

---

**ChefNext** - シェフとレストランをつなぐ未来
