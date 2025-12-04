# ChefNext 機能別技術スタック

最終更新: 2025-12-03

このドキュメントでは、ChefNextの各機能で使用されている技術スタックを機能単位で整理しています。

## 目次
1. [認証・認可](#認証認可)
2. [プロフィール管理](#プロフィール管理)
3. [求人・応募管理](#求人応募管理-予定)
4. [画像アップロード](#画像アップロード-予定)
5. [チャット・通知](#チャット通知-予定)
6. [検索機能](#検索機能)
7. [開発環境](#開発環境)

---

## 認証・認可

### 実装状況
✅ **完了** (Milestone 1)

### 使用技術

#### バックエンド
| 技術 | 用途 | 実装箇所 |
|-----|------|----------|
| **JWT (golang-jwt/jwt v5)** | Access Token, Refresh Token の生成・検証 | `apps/api/internal/usecase/identity/` |
| **bcrypt (golang.org/x/crypto)** | パスワードハッシュ化 | `apps/api/internal/usecase/identity/register.go` |
| **Redis (go-redis v9)** | Refresh Token の保存・ブラックリスト管理 | `apps/api/internal/usecase/identity/` |
| **PostgreSQL** | ユーザー情報（email, hashed_password, role）の保存 | `apps/api/db/migrations/` |
| **Connect-RPC** | API エンドポイント | `apps/api/proto/identity/v1/auth.proto` |
| **Protocol Buffers** | リクエスト/レスポンスのスキーマ定義 | `apps/api/proto/identity/v1/auth.proto` |

#### フロントエンド
| 技術 | 用途 | 実装箇所 |
|-----|------|----------|
| **React** | UI コンポーネント | `apps/web/src/components/AuthPage.tsx` |
| **@chefnext/api-client** | Connect-RPC クライアント | `packages/api-client/` |
| **LocalStorage** | Access Token, Refresh Token の保存 | `apps/web/src/` |
| **React Context** | 認証状態の管理（予定） | - |

#### データモデル
```sql
users テーブル:
- id (UUID, PK)
- email (UNIQUE)
- hashed_password
- role (ENUM: CHEF, RESTAURANT)
- created_at, updated_at
```

#### API エンドポイント
- `POST /identity.v1.AuthService/Register` - 新規ユーザー登録
- `POST /identity.v1.AuthService/Login` - ログイン
- `POST /identity.v1.AuthService/RefreshToken` - トークンリフレッシュ
- `POST /identity.v1.AuthService/Logout` - ログアウト
- `POST /identity.v1.AuthService/GetMe` - 現在のユーザー情報取得

#### セキュリティ機能
- ✅ パスワードの bcrypt ハッシュ化
- ✅ JWT によるステートレス認証
- ✅ Access Token（短期）と Refresh Token（長期）の分離
- ✅ Refresh Token の Redis 保存とブラックリスト管理
- ✅ Role-Based Access Control (CHEF / RESTAURANT)

---

## プロフィール管理

### 実装状況
🔄 **進行中** (Milestone 2)

### 使用技術

#### バックエンド
| 技術 | 用途 | 実装箇所 |
|-----|------|----------|
| **PostgreSQL** | プロフィールデータの保存 | `apps/api/db/migrations/20251129070535_add_profiles.sql` |
| **sqlc** | 型安全な SQL クエリコード生成 | `apps/api/db/queries/chef_profiles.sql`, `restaurant_profiles.sql` |
| **Connect-RPC** | API エンドポイント | `apps/api/proto/chef/v1/`, `proto/restaurant/v1/` |
| **Protocol Buffers** | プロフィールスキーマ定義 | `profile.proto` |
| **JWT ミドルウェア** | 認証済みユーザーのみアクセス可能 | `apps/api/internal/middleware/` |

#### フロントエンド
| 技術 | 用途 | 実装箇所 |
|-----|------|----------|
| **React** | プロフィール作成・編集 UI | `apps/web/src/components/ChefProfilePage.tsx`, `RestaurantProfilePage.tsx` |
| **react-hook-form** | フォーム管理・バリデーション | プロフィールフォーム |
| **Radix UI** | アクセシブルなフォームコンポーネント | Input, Select, Textarea 等 |
| **@chefnext/api-client** | RPC クライアント | プロフィール CRUD 操作 |
| **Tailwind CSS** | スタイリング | 全コンポーネント |

#### データモデル

**Chef Profile**
```sql
chef_profiles テーブル:
- id (UUID, PK)
- user_id (UUID, FK → users.id, UNIQUE)
- headline (VARCHAR)
- summary (TEXT)
- location (VARCHAR)
- years_experience (INT)
- availability (VARCHAR)
- specialties (TEXT[])
- work_areas (TEXT[])
- languages (TEXT[])
- bio (TEXT)
- learning_focus (TEXT[])
- skill_tree_json (JSONB)
- created_at, updated_at
```

**Restaurant Profile**
```sql
restaurant_profiles テーブル:
- id (UUID, PK)
- user_id (UUID, FK → users.id, UNIQUE)
- display_name (VARCHAR)
- tagline (VARCHAR)
- location (VARCHAR)
- seats (INT)
- cuisine_types (TEXT[])
- mentorship_style (TEXT)
- description (TEXT)
- culture_keywords (TEXT[])
- benefits (TEXT[])
- support_programs (TEXT[])
- learning_highlights (JSONB)
- created_at, updated_at
```

#### API エンドポイント

**Chef Profile**
- `POST /chef.v1.ChefProfileService/CreateProfile`
- `GET /chef.v1.ChefProfileService/GetProfile`
- `GET /chef.v1.ChefProfileService/GetMyProfile`
- `PUT /chef.v1.ChefProfileService/UpdateProfile`
- `GET /chef.v1.ChefProfileService/SearchProfiles`

**Restaurant Profile**
- `POST /restaurant.v1.RestaurantProfileService/CreateProfile`
- `GET /restaurant.v1.RestaurantProfileService/GetProfile`
- `GET /restaurant.v1.RestaurantProfileService/GetMyProfile`
- `PUT /restaurant.v1.RestaurantProfileService/UpdateProfile`
- `GET /restaurant.v1.RestaurantProfileService/SearchProfiles`

#### 特徴的な実装
- **スキルツリー JSON**: Chef のスキルを階層構造で管理（JSONB）
- **配列型フィールド**: specialties, work_areas, languages 等を PostgreSQL の配列型で保存
- **RBAC 統合**: Chef は Chef Profile のみ、Restaurant は Restaurant Profile のみ作成可能

---

## 求人・応募管理（予定）

### 実装状況
⬜ **未実装** (Milestone 3)

### 計画中の技術

#### バックエンド
| 技術 | 用途 | 実装予定箇所 |
|-----|------|-------------|
| **PostgreSQL** | 求人・応募データの保存 | `apps/api/db/migrations/` |
| **sqlc** | 求人・応募クエリのコード生成 | `apps/api/db/queries/jobs.sql`, `applications.sql` |
| **Connect-RPC** | 求人・応募 API | `apps/api/proto/job/v1/` |
| **Full-Text Search** | 求人検索（キーワード、スキル） | PostgreSQL の `tsvector` or Elasticsearch |

#### フロントエンド
| 技術 | 用途 | 実装予定箇所 |
|-----|------|-------------|
| **packages/features/job** | 求人機能の共通コンポーネント | React Native ベース |
| **packages/ui** | JobCard コンポーネント | React Native プリミティブ |
| **react-native-web** | Web/モバイルコード共有 | `apps/web` での利用 |
| **Path Alias** | `@features/job`, `@ui` | `tsconfig.base.json`, Vite, Metro |

#### データモデル（予定）
```sql
jobs テーブル:
- id (UUID, PK)
- restaurant_id (UUID, FK)
- title (VARCHAR)
- description (TEXT)
- required_skills (TEXT[])
- location (VARCHAR)
- salary_range (VARCHAR)
- employment_type (ENUM)
- status (ENUM: DRAFT, PUBLISHED, CLOSED)
- created_at, updated_at

applications テーブル:
- id (UUID, PK)
- job_id (UUID, FK)
- chef_id (UUID, FK)
- status (ENUM: PENDING, ACCEPTED, REJECTED)
- cover_letter (TEXT)
- created_at, updated_at
- UNIQUE(job_id, chef_id)
```

#### API エンドポイント（予定）
- `POST /job.v1.JobService/CreateJob`
- `GET /job.v1.JobService/GetJob`
- `GET /job.v1.JobService/SearchJobs`
- `PUT /job.v1.JobService/UpdateJob`
- `POST /job.v1.JobService/CreateApplication`
- `GET /job.v1.JobService/GetApplicationsForChef`
- `GET /job.v1.JobService/GetApplicationsForRestaurant`

---

## 画像アップロード（予定）

### 実装状況
⬜ **未実装** (Milestone 4)

### 計画中の技術

#### バックエンド
| 技術 | 用途 |
|-----|------|
| **MinIO / S3** | 画像ファイルの保存 |
| **S3 Presigned URL** | クライアントから直接アップロード |
| **AWS Lambda / Go Worker** | 画像処理（リサイズ、EXIF除去、WebP変換） |
| **PostgreSQL** | 画像メタデータ・URL の保存 |

#### 画像処理仕様
| 処理 | 仕様 |
|-----|------|
| **リサイズ** | 256px, 1024px, 1920px の3サイズ生成 |
| **フォーマット** | WebP（優先） + Original（JPEG/PNG） |
| **EXIF除去** | プライバシー保護 |
| **Blurhash** | プレースホルダー生成（Nice-to-have） |

#### フロントエンド
| 技術 | 用途 |
|-----|------|
| **packages/ui/Image** | 画像表示コンポーネント（WebP fallback） |
| **File API** | クライアント側での画像選択 |
| **fetch / axios** | Presigned URL へのアップロード |

#### データモデル（予定）
```sql
portfolio_items テーブル:
- id (UUID, PK)
- chef_profile_id (UUID, FK)
- original_url (VARCHAR)
- webp_256_url (VARCHAR)
- webp_1024_url (VARCHAR)
- webp_1920_url (VARCHAR)
- blurhash (VARCHAR)
- caption (TEXT)
- is_cover (BOOLEAN)
- created_at, updated_at
```

---

## チャット・通知（予定）

### 実装状況
⬜ **未実装** (Milestone 6)

### 計画中の技術

#### バックエンド
| 技術 | 用途 |
|-----|------|
| **WebSocket** | リアルタイムメッセージング |
| **PostgreSQL** | チャット履歴の保存 |
| **asynq** | 非同期ジョブキュー（通知配信） |
| **Redis** | WebSocket 接続管理、Pub/Sub |
| **MailPit / SendGrid** | メール通知 |

#### フロントエンド
| 技術 | 用途 |
|-----|------|
| **WebSocket API** | リアルタイム接続 |
| **React Context / Zustand** | チャット状態管理 |
| **packages/features/chat** | チャット UI コンポーネント |

#### データモデル（予定）
```sql
conversations テーブル:
- id (UUID, PK)
- application_id (UUID, FK, UNIQUE)
- chef_id (UUID, FK)
- restaurant_id (UUID, FK)
- created_at, updated_at

messages テーブル:
- id (UUID, PK)
- conversation_id (UUID, FK)
- sender_id (UUID, FK)
- content (TEXT)
- is_read (BOOLEAN)
- created_at

reviews テーブル:
- id (UUID, PK)
- application_id (UUID, FK)
- reviewer_id (UUID, FK)
- rating (INT)
- comment (TEXT)
- created_at
```

#### 機能
- ✅ 応募起点でチャット開始
- ✅ リアルタイムメッセージング
- ✅ 既読状態管理
- ✅ 応募完了後の簡易レビュー（星 + コメント）
- ✅ 新着メッセージ通知（WebSocket Push / Email）

---

## 検索機能

### 実装状況
✅ **部分実装** (Milestone 2), 🔄 **拡張予定** (Milestone 3)

### 使用技術

#### 現在の実装
| 技術 | 用途 | 実装箇所 |
|-----|------|----------|
| **PostgreSQL** | プロフィール検索 | `SearchProfiles` クエリ |
| **配列型検索** | specialties, work_areas, cuisine_types | `WHERE ANY(specialties) = ANY($1)` |
| **LIKE検索** | 名前・ヘッドラインの部分一致 | - |

#### 将来の拡張（Milestone 3）
| 技術 | 用途 |
|-----|------|
| **PostgreSQL Full-Text Search** | 求人のキーワード検索 |
| **tsvector / tsquery** | 日本語・英語の全文検索 |
| **GIN インデックス** | 配列・全文検索の高速化 |
| **Elasticsearch** | 高度な検索（Optional） |

#### 検索機能一覧
- ✅ Chef プロフィール検索（specialties, work_areas）
- ✅ Restaurant プロフィール検索（cuisine_types, name）
- ⬜ 求人検索（キーワード、スキル、エリア、雇用形態）
- ⬜ ファセット検索（カテゴリ別フィルタ）
- ⬜ ソート（作成日、関連度）
- ⬜ ページネーション

---

## 開発環境

### 実装状況
✅ **完了** (Milestone 0)

### 使用技術

#### モノレポ管理
| 技術 | 用途 | 設定ファイル |
|-----|------|-------------|
| **pnpm workspace** | パッケージ管理 | `pnpm-workspace.yaml` |
| **Turbo** | ビルドパイプライン | `turbo.json` |

#### コンテナ環境
| 技術 | 用途 | 設定ファイル |
|-----|------|-------------|
| **Docker Compose** | ローカル依存サービス起動 | `infra/docker/docker-compose.yml` |
| **PostgreSQL (alpine)** | 開発DB | - |
| **Redis (alpine)** | 開発キャッシュ | - |
| **MinIO** | ローカルS3互換ストレージ | - |
| **MailPit** | メール送信テスト | - |

#### 開発ツール
| 技術 | 用途 | 設定ファイル |
|-----|------|-------------|
| **Air** | Go ホットリロード | `apps/api/.air.toml` |
| **Vite** | Web 開発サーバー | `apps/web/vite.config.ts` |
| **sqlc** | SQL コード生成 | `apps/api/sqlc.yaml` |
| **goose** | DBマイグレーション | `apps/api/db/migrations/` |
| **Make** | タスクランナー | `Makefile` |

#### 主要コマンド
```bash
# 全依存サービス起動 + API起動
make dev

# インフラのみ起動
make infra-up

# DBマイグレーション実行
make db-migrate

# Web開発サーバー起動
pnpm dev:web

# 全アプリ並行起動
pnpm dev
```

---

## モバイルアプリ（予定）

### 実装状況
⬜ **未実装** (Milestone 5)

### 計画中の技術

#### モバイルフレームワーク
| 技術 | 用途 |
|-----|------|
| **React Native** | iOS/Android UI |
| **Expo** | 開発プラットフォーム |
| **Expo Router / React Navigation** | ナビゲーション |
| **Expo EAS** | ビルド・配信 |

#### コード共有戦略
| 技術 | 用途 |
|-----|------|
| **react-native-web** | Web/モバイルコード共有 |
| **packages/features** | 画面単位の共通コンポーネント |
| **packages/ui** | React Native プリミティブベース UI |
| **nativewind** | Tailwind CSS for React Native（検討中） |
| **Metro + Babel** | モジュール解決・alias設定 |

#### モバイル固有機能
- カメラ・ギャラリーアクセス（画像アップロード）
- プッシュ通知（Expo Notifications）
- 位置情報（Expo Location）
- オフラインサポート（検討中）

---

## 品質保証・パフォーマンス（予定）

### 実装状況
⬜ **未実装** (Milestone 7)

### 計画中の技術

#### テスト
| 技術 | 用途 |
|-----|------|
| **Playwright** | E2Eテスト（Web） |
| **Jest** | ユニットテスト |
| **testing-library** | React コンポーネントテスト |
| **Go testing** | バックエンドユニットテスト |

#### パフォーマンス
| 技術 | 用途 |
|-----|------|
| **k6** | 負荷試験 |
| **Lighthouse** | Web パフォーマンス測定 |
| **OpenTelemetry** | 分散トレーシング（検討中） |

#### セキュリティ
| 技術 | 用途 |
|-----|------|
| **Dependabot** | 依存ライブラリの脆弱性スキャン |
| **Trivy** | コンテナイメージスキャン |
| **OWASP ZAP** | セキュリティテスト（検討中） |

#### 目標指標
- **P95 レスポンス時間**: < 1.5秒
- **Lighthouse スコア**: Performance > 90
- **セキュリティ**: CVE High/Critical 0件

---

## まとめ

### 実装済み機能
✅ **Milestone 0**: モノレポ開発環境
✅ **Milestone 1**: 認証・認可（JWT, bcrypt, Redis）
🔄 **Milestone 2**: プロフィール管理（進行中）

### 次のステップ
⬜ **Milestone 3**: 求人・応募 + フロント共通化（React Native ベース）
⬜ **Milestone 4**: 画像アップロード（S3, Lambda, WebP）
⬜ **Milestone 5**: Expo モバイルアプリ PoC
⬜ **Milestone 6**: チャット・通知（WebSocket, asynq）
⬜ **Milestone 7**: 本番デプロイ + QA（AWS, Terraform, k6, Playwright）

---

## 参考資料
- [技術スタック全体像](./tech-stack.md)
- [マイルストーン 1.1](./milestones1.1.md)
