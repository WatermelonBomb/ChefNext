# ChefNext API

ここにバックエンドサービス (Go 1.22) を実装します。

## ディレクトリ構造

```
apps/api/
├─ cmd/
│  ├─ api/          # gRPC/Connect + WebSocketサーバー
│  └─ worker/       # asynqワーカー
├─ internal/
│  ├─ domain/       # ドメインモデル（entity, value object）
│  │  ├─ identity/  # 認証/認可、KYC
│  │  ├─ chef/      # シェフプロフィール、スキルツリー
│  │  ├─ restaurant/ # レストラン情報、求人CRUD
│  │  ├─ matchmaking/ # 応募/スカウト、適合度計算
│  │  ├─ communication/ # チャット、面談予約、通知
│  │  └─ review/    # レビュー、評価集計、通報
│  ├─ usecase/      # ビジネスロジック
│  ├─ repository/   # DB操作（sqlcで生成）
│  ├─ handler/      # gRPC/Connect ハンドラ
│  └─ pkg/          # 共通ユーティリティ
│     ├─ auth/
│     ├─ config/
│     ├─ logger/
│     └─ validator/
├─ proto/           # Protocol Buffers定義
│  ├─ identity/
│  ├─ chef/
│  └─ ...
├─ db/
│  ├─ migrations/   # gooseマイグレーション
│  └─ queries/      # sqlcクエリ定義
└─ tests/
```

## 技術スタック

- **言語**: Go 1.22
- **API**: gRPC/Connect (フロントへはConnect-WebでJSON/HTTP)
- **WebSocket**: gorilla/websocket
- **DB**: PostgreSQL 15 + sqlc (型安全なクエリ生成)
- **マイグレーション**: goose
- **ジョブキュー**: asynq (Redis)
- **認証**: JWT + Argon2id

## 開発開始手順

```bash
# Goモジュール初期化
cd apps/api
go mod init github.com/yourusername/chefnext/apps/api

# 依存関係インストール（例）
go get github.com/bufbuild/connect-go
go get github.com/kyleconroy/sqlc/cmd/sqlc@latest
go get github.com/pressly/goose/v3/cmd/goose@latest
go get github.com/hibiken/asynq
```

今後 `sqlc`/`goose` スキーマやProtocol Buffers契約をここに追加します。

詳細な設計は `docs/backend-tech-selection.md` を参照。
