# フロント/バックエンドのリポジトリ戦略とディレクトリ構成

## 1. モノレポ vs 分割レポ (マイクロサービス) 比較
- **スケーラビリティ**
  - モノレポ: API契約とUIを同時に更新でき、依存グラフを見ながら段階的に最適化。Nx/Turborepoのキャッシュでビルド負荷を抑制。
  - 分割レポ: サービスごとに独立スケール可能だが、契約やスキーマ変更の同期に別手段が必要。初期の境界設計にコスト。
- **チーム開発・運用体制**
  - モノレポ: 小規模チームでのコラボと知識共有が容易。権限管理が単純。
  - 分割レポ: チームごとに独立運用できる一方、ナレッジが分断しオンボーディングが重くなる。
- **デプロイ/CI/CD**
  - モノレポ: 単一CIで依存グラフに沿ってジョブをトリガー。ENV/Secretsを一元管理できる。
  - 分割レポ: それぞれのCI/CDを整備する必要があり、リリース同期の調整コストが増える。
- **テスト戦略**
  - モノレポ: Contract/E2Eを同リポで走らせ破壊的変更をPRで検知できる。
  - 分割レポ: 各レポのテストは高速だが、システムテストを別環境で統合実行する手間が増える。
- **将来的な拡張性・保守性**
  - モノレポ: ドメインが固まるまで責務を柔軟に再配置できる。依存の可視化もしやすい。
  - 分割レポ: 境界が明確になった後はチームを水平に増やしやすいが、バージョニングや契約管理の運用が不可欠。

**推奨方針**: MVP〜PMF探索の現段階は**モノレポを維持**し、内部でドメイン境界を明文化。チャットや検索など独立要件が固まった時点で段階的にサービス分割する。

## 2. 推奨技術スタック
- **フロント**: React + Next.js (App Router) + TypeScript + TailwindCSS
- **バックエンド**: Go 1.22 + gRPC/Connect + WebSocket
- **DB**: PostgreSQL 15 + sqlc (型安全なクエリ生成) + goose (マイグレーション)
- **ジョブ/リアルタイム**: Redis + asynq、WebSocket Gateway
- **インフラ**: Docker Compose (dev)、Terraform + AWS ECS Fargate (prod)、S3 + Lambda(Go + imaging) で画像処理
- **共通**: Protocol Buffers (Buf) で契約管理、pnpm/go modules でパッケージ共有

### バックエンドに Go を選定した理由
ChefNext の要件 (チャット/通知・画像署名・マッチング計算など CPU/IO を跨ぐ処理) では、Go の軽量ランタイムと並行処理 (goroutine) の強さが効果的。また gRPC/Connect を軸に内部APIを定義すれば、Next.js側の型安全なクライアント生成や将来のサービス分割もしやすい。規模が大きくなるほどGoで統一しておいた方がリソース消費やビルド速度、配布の容易さで優位に立てる。

## 3. 推奨ディレクトリ構成 (モノレポ)
```
chefnext/
├─ apps/
│  ├─ web/                 # Next.js: pages/app、hooks、feature単位のUI
│  └─ api/                 # Go: cmd/api, cmd/worker, internal/<domain>
│     ├─ cmd/
│     │  ├─ api/           # gRPC/Connect + WebSocketサーバー
│     │  └─ worker/        # asynqワーカー
│     ├─ internal/
│     │  ├─ domain/        # ドメインモデル (entity, value object)
│     │  │  ├─ identity/
│     │  │  ├─ chef/
│     │  │  ├─ restaurant/
│     │  │  ├─ matchmaking/
│     │  │  ├─ communication/
│     │  │  └─ review/
│     │  ├─ usecase/       # ビジネスロジック
│     │  ├─ repository/    # DB操作 (sqlcで生成)
│     │  ├─ handler/       # gRPC/Connect ハンドラ
│     │  └─ pkg/           # 共通ユーティリティ (auth, config, logger)
│     ├─ proto/            # Protocol Buffers定義
│     ├─ db/
│     │  ├─ migrations/    # gooseマイグレーション
│     │  └─ queries/       # sqlcクエリ定義
│     └─ tests/
├─ packages/
│  ├─ ui/                  # デザインシステム/共通Reactコンポーネント
│  ├─ api-client/          # Protocol Buffers生成のTSクライアント (Connect-Web)
│  └─ lint-config/         # ESLint/Prettier/tsconfig共有
├─ services/               # 将来切り出す独立サービス (例: chat-gateway)
│  └─ matching-worker/
├─ infra/
│  ├─ terraform/           # AWS IaC (env別モジュール)
│  └─ docker/              # docker-compose、ローカルツール
├─ ops/
│  ├─ ci/                  # GitHub ActionsなどCI設定
│  └─ scripts/             # migrate/seed/releaseスクリプト
└─ docs/
   └─ *.md                 # 設計ドキュメント
```

## 4. 共通モジュール & ドメイン分割
- `apps/api/internal/domain/<domain>` で `identity`, `chef`, `restaurant`, `matchmaking`, `communication`, `review` などを分割。
  - 各ドメインは UseCase層と Repository層を持ち、`internal/pkg` で共通 (auth, config, db, logger)。
- `packages/ui` でUIコンポーネント、`packages/api-client` でProtocol Buffers生成の型安全なクライアントを共有し、フロント/バック双方で同じ契約を参照。
- テスト: ドメインごとにUnit/Integrationを配置し、`apps/web`と`apps/api`の合同E2Eは`apps`直下または`ops/tests`で管理。

## 5. 将来の拡張パターン
- サービス増加時は `services/` 配下に `chat-gateway`, `search`, `media-processor` などを追加し、gRPC/RESTで `apps/api` と通信。
- `apps` 直下に `admin` や `mobile` (Expo) を追加し、共通コードは `packages/*` で再利用。
- インフラは `infra/environments/{dev,stg,prod}` に環境別ディレクトリを作り、サービス追加に合わせてTerraformモジュールを拡張。
- マイクロサービス化が必要になったら対象 `services/*` を独立レポへ切り出し、`git subtree split` 等で履歴を保ちながら移行。

この構成により、モノレポの開発速度と一貫性を維持しつつ、将来的なサービス分割やチーム増加にも対応できる道筋を確保できます。
