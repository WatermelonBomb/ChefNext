# ChefNext 技術スタック

最終更新: 2025-12-03

## 目次
1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [バックエンド](#バックエンド)
3. [フロントエンド](#フロントエンド)
4. [インフラストラクチャ](#インフラストラクチャ)
5. [開発ツール](#開発ツール)
6. [モノレポ構成](#モノレポ構成)

---

## アーキテクチャ概要

ChefNextは、シェフとレストランをマッチングするプラットフォームで、Web版とモバイル版（今後実装予定）の両方を提供します。

### システム構成
```
┌─────────────────────────────────────────────────────┐
│                   クライアント層                       │
│  ┌──────────────┐         ┌──────────────┐          │
│  │  Web (React) │         │ Mobile (Expo)│          │
│  │    + Vite    │         │  (予定)      │          │
│  └──────┬───────┘         └──────┬───────┘          │
│         └─────────┬──────────────┘                   │
└───────────────────┼──────────────────────────────────┘
                    │
┌───────────────────┼──────────────────────────────────┐
│                   │   API層 (Connect-RPC)            │
│  ┌────────────────▼────────────────┐                 │
│  │   Go Backend (Connect-RPC)      │                 │
│  │   - Authentication (JWT)        │                 │
│  │   - Chef Profile Service        │                 │
│  │   - Restaurant Profile Service  │                 │
│  └────────────┬────────────────────┘                 │
└───────────────┼──────────────────────────────────────┘
                │
┌───────────────┼──────────────────────────────────────┐
│               │      データ層                         │
│  ┌────────────▼─────┐  ┌─────────┐  ┌─────────┐     │
│  │   PostgreSQL     │  │  Redis  │  │  MinIO  │     │
│  │   (Primary DB)   │  │ (Cache) │  │ (S3互換)│     │
│  └──────────────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────────────┘
```

---

## バックエンド

### 言語・フレームワーク
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Go** | 1.25 | メイン言語 |
| **Connect-RPC** | 1.19.1 | RPC フレームワーク（Protocol Buffers ベース） |
| **Protocol Buffers** | 1.36.9 | API スキーマ定義・コード生成 |

### データベース・永続化
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **PostgreSQL** | 15 | メインデータベース |
| **pgx/v5** | 5.7.5 | PostgreSQL ドライバー |
| **sqlc** | 1.30.0 | 型安全な SQL クエリコード生成 |
| **goose** | 3.26.0 | データベースマイグレーションツール |

### 認証・セキュリティ
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **golang-jwt/jwt** | 5.2.3 | JWT トークン生成・検証 |
| **golang.org/x/crypto** | 0.44.0 | パスワードハッシュ化（bcrypt） |

### キャッシュ・セッション管理
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Redis** | 7 (via go-redis/v9 9.17.1) | キャッシュ、Refresh Token 保存 |

### ユーティリティ
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **google/uuid** | 1.6.0 | UUID 生成 |
| **godotenv** | 1.5.1 | 環境変数管理 |
| **golang.org/x/time** | 0.14.0 | レートリミット |

### 開発ツール（Backend）
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Air** | 1.63.4 | ホットリロード |

---

## フロントエンド

### Web アプリケーション

#### コア技術
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **React** | 18.3.1 | UI フレームワーク |
| **TypeScript** | 最新 | 型安全性 |
| **Vite** | 6.3.5 | ビルドツール・開発サーバー |
| **@vitejs/plugin-react-swc** | 3.10.2 | React Fast Refresh（SWC ベース） |

#### UI コンポーネント・スタイリング
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Tailwind CSS** | 最新 | ユーティリティファーストCSS |
| **Radix UI** | 各種 1.x-2.x | アクセシブルなヘッドレスコンポーネント |
| **Lucide React** | 0.487.0 | アイコン |
| **class-variance-authority** | 0.7.1 | バリアント管理 |
| **clsx** / **tailwind-merge** | 最新 | クラス名結合・マージ |

#### フォーム・バリデーション
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **react-hook-form** | 7.55.0 | フォーム管理 |

#### その他 UI ライブラリ
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **next-themes** | 0.4.6 | ダークモード対応 |
| **cmdk** | 1.1.1 | コマンドパレット |
| **sonner** | 2.0.3 | トースト通知 |
| **vaul** | 1.1.2 | ドロワー |
| **embla-carousel-react** | 8.6.0 | カルーセル |
| **recharts** | 2.15.2 | チャート・グラフ |
| **react-day-picker** | 8.10.1 | 日付ピッカー |
| **input-otp** | 1.4.2 | OTP 入力 |

### モバイルアプリケーション（予定）
| 技術 | 用途 |
|-----|------|
| **React Native** | モバイル UI フレームワーク |
| **Expo** | React Native 開発プラットフォーム |
| **react-native-web** | Web/モバイルコード共有 |

### 共通パッケージ
| パッケージ名 | 用途 |
|------------|------|
| **@chefnext/api-client** | Connect-RPC クライアントコード |
| **@chefnext/ui** | 共通UIコンポーネント（React Native ベース予定） |
| **@chefnext/features** | 機能単位のコンポーネント（予定） |
| **@chefnext/lint-config** | ESLint 共通設定（予定） |

---

## インフラストラクチャ

### コンテナ・オーケストレーション
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Docker** | - | コンテナ化 |
| **Docker Compose** | 3.9 | ローカル開発環境 |

### データベース・ストレージ
| サービス | バージョン | 用途 |
|---------|-----------|------|
| **PostgreSQL** | 15-alpine | リレーショナルデータベース |
| **Redis** | 7-alpine | キャッシュ・セッション管理 |
| **MinIO** | latest | S3 互換オブジェクトストレージ（画像保存用） |

### 開発支援サービス
| サービス | バージョン | 用途 |
|---------|-----------|------|
| **MailPit** | latest | ローカルメール送信テスト |

### 本番環境（予定 - Milestone 7）
| 技術 | 用途 |
|-----|------|
| **AWS** | クラウドインフラ |
| **Terraform** | IaC（Infrastructure as Code） |
| **ECS Fargate** | コンテナオーケストレーション |
| **RDS** | マネージドPostgreSQL |
| **ElastiCache** | マネージドRedis |
| **S3** | オブジェクトストレージ |
| **CloudFront** | CDN |
| **Lambda** | 画像処理（Milestone 4） |

---

## 開発ツール

### モノレポ管理
| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **pnpm** | 9.12.3 | パッケージマネージャー |
| **Turbo** | 2.0.14 | モノレポビルドシステム |

### コード品質
| 技術 | 用途 |
|-----|------|
| **ESLint** | コードリンター（予定） |
| **Prettier** | コードフォーマッター（予定） |

### テスト（予定）
| 技術 | 用途 |
|-----|------|
| **Playwright** | E2E テスト（Milestone 7） |
| **k6** | 負荷試験（Milestone 7） |

### CI/CD（予定）
| 技術 | 用途 |
|-----|------|
| **GitHub Actions** | CI/CDパイプライン |
| **Docker Registry** | ECR（コンテナイメージ保存） |
| **Expo EAS** | モバイルアプリビルド・配信 |

### その他
| 技術 | 用途 |
|-----|------|
| **Make** | タスクランナー（ローカル開発） |
| **Air** | Go ホットリロード |

---

## モノレポ構成

### ディレクトリ構造
```
ChefNext-1/
├── apps/
│   ├── api/                 # Go バックエンド
│   │   ├── cmd/api/        # エントリーポイント
│   │   ├── internal/       # 内部パッケージ
│   │   │   ├── gen/        # protobuf 生成コード
│   │   │   ├── handler/    # RPC ハンドラー
│   │   │   ├── middleware/ # ミドルウェア
│   │   │   ├── repository/ # データアクセス層
│   │   │   └── usecase/    # ビジネスロジック
│   │   ├── proto/          # Protocol Buffers 定義
│   │   └── db/             # マイグレーション・クエリ
│   ├── web/                # Web フロントエンド
│   └── mobile/             # モバイルアプリ（予定）
├── packages/
│   ├── api-client/         # RPC クライアント
│   ├── ui/                 # 共通UIコンポーネント
│   ├── features/           # 機能単位のコンポーネント（予定）
│   └── lint-config/        # ESLint 設定（予定）
├── infra/
│   └── docker/             # Docker Compose 設定
└── docs/                   # ドキュメント
```

### Workspace 設定
- **pnpm-workspace.yaml**: `apps/*`, `packages/*` をワークスペースに含める
- **turbo.json**: `dev`, `build`, `lint`, `test` パイプライン定義

### パッケージ間依存
```
apps/web
  └─> @chefnext/api-client
  └─> @chefnext/ui (予定)

apps/mobile (予定)
  └─> @chefnext/api-client
  └─> @chefnext/features
  └─> @chefnext/ui
```

---

## API 設計

### Connect-RPC over HTTP/2
- **Protocol Buffers**: スキーマ駆動開発
- **型安全性**: Go とTypeScript の両方でコード自動生成
- **HTTP/1.1 互換**: 標準的なHTTPクライアントで利用可能

### 実装済みサービス
1. **AuthService** (`identity.v1`)
   - Register, Login, RefreshToken, Logout, GetMe
2. **ChefProfileService** (`chef.v1`)
   - CreateProfile, GetProfile, GetMyProfile, UpdateProfile, SearchProfiles
3. **RestaurantProfileService** (`restaurant.v1`)
   - CreateProfile, GetProfile, GetMyProfile, UpdateProfile, SearchProfiles

---

## セキュリティ

### 認証・認可
- **JWT**: Access Token（短期）+ Refresh Token（長期）
- **bcrypt**: パスワードハッシュ化
- **Redis**: Refresh Token のブラックリスト管理
- **RBAC**: Role-Based Access Control（Chef / Restaurant）

### データ保護
- **HTTPS**: 本番環境では必須（Milestone 7）
- **環境変数**: 機密情報の管理（.env）
- **入力検証**: Protocol Buffers スキーマによる型チェック

---

## パフォーマンス目標（Milestone 7）
- **P95 レスポンス時間**: < 1.5秒
- **負荷試験**: k6 による検証
- **キャッシュ戦略**: Redis を利用した多層キャッシュ

---

## 将来の技術スタック（検討中）

### Milestone 3 以降
- **WebSocket**: リアルタイムチャット（Milestone 6）
- **asynq**: 非同期ジョブキュー・通知（Milestone 6）
- **nativewind**: React Native 向け Tailwind CSS（Milestone 3-5）
- **S3 Presigned URL**: 直接アップロード（Milestone 4）
- **Lambda/Worker**: 画像処理（EXIF除去、リサイズ、WebP変換）（Milestone 4）
- **Blurhash**: 画像プレースホルダー（Milestone 4, Nice-to-have）

---

## 参考資料
- [マイルストーン 1.1](./milestones1.1.md)
- [Go モジュール](../apps/api/go.mod)
- [Web パッケージ設定](../apps/web/package.json)
