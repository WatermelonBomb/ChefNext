# ChefNext マイルストーン（Web/ネイティブ対応版）

このドキュメントでは、**Web + ネイティブアプリ両対応の MVP** 達成までの各マイルストーンを定義します。
各マイルストーンは **「デモ可能な機能」＋「アーキテクチャの前進」** を必ず含みます。

---

## Milestone 0: 開発環境構築 🛠️

**期間**: 1–2週間
**目標**: ローカルでバックエンドを起動し、開発の土台を固める

### 完了条件 (Definition of Done)

* [ ] `docker-compose up` で全依存サービス（PostgreSQL, Redis, MinIO, MailPit）が起動する
* [ ] Go サーバーが起動し、`http://localhost:8080/health` にヘルスチェックが応答する
* [ ] データベースマイグレーションが実行できる
* [ ] 構造化ログが出力される
* [ ] ホットリロード（`air`）が動作する

### デモ可能な機能

* ✅ ヘルスチェックエンドポイント
* ✅ データベース接続確認
* ✅ ログ出力確認

---

## Milestone 1: 認証基盤 🔐

**期間**: 2–3週間
**目標**: Email/Password 認証と JWT ベースの認可を実装し、最小のログイン体験を提供する

### 完了条件

* [ ] ユーザー登録 API（Email/Password）が動作する
* [ ] ログイン API が JWT + Refresh Token を返す
* [ ] JWT による認証ミドルウェアで保護された API がある
* [ ] Refresh Token によるアクセストークン更新が可能
* [ ] `packages/api-client` から Auth API を叩ける
* [ ] Web フロント（`apps/web`）から登録・ログイン・ログアウトができる

### デモ可能な機能

* ✅ 新規ユーザー登録
* ✅ ログイン・ログアウト
* ✅ 認証が必要な API の呼び出し（例: `/me`）

---

## Milestone 2: プロフィール管理 👤

**期間**: 2–3週間
**目標**: Chef / Restaurant のプロフィールを作成・編集・閲覧できる
（この時点では Web ページ実装メイン。後続で共通化する）

### 完了条件

* [ ] Chef プロフィール作成・編集 API が動作する
* [ ] Restaurant プロフィール作成・編集 API が動作する
* [ ] プロフィール取得 API が動作する
* [ ] スキルツリー JSON を保存・取得できる
* [ ] `apps/web` でプロフィール作成フォーム・表示ページが動作する
* [ ] 自分のプロフィールのみ編集可能（RBAC）

### デモ可能な機能

* ✅ シェフプロフィール作成・編集
* ✅ レストランプロフィール作成・編集
* ✅ プロフィール閲覧
* ✅ スキルツリー編集（Web）

---

## Milestone 3: 求人機能 ＋ フロント共通化 基盤 💼🧱

**期間**: 3–4週間
**目標**

1. Restaurant が求人を投稿し、Chef が Web から検索・閲覧できる
2. 同時に **フロントエンド再設計の「土台」** を作り、将来のネイティブアプリ対応に備える

### 完了条件

**バックエンド / 機能面**

* [ ] 求人作成・編集・削除 API が動作する
* [ ] 求人検索 API（キーワード、スキル、エリアフィルタ）が動作する
* [ ] 求人一覧（ページネーション）が動作する

**フロントアーキテクチャ面**

* [ ] リポジトリ直下に `tsconfig.base.json` を作成し、以下のパスエイリアスが定義されている

  * `@features/*` → `packages/features/*`
  * `@ui/*` → `packages/ui/src/*`
  * `@api-client/*` → `packages/api-client/src/*`
* [ ] `packages/features/job/` 配下に以下の Screen が存在する

  * `JobListingScreen.tsx`
  * `JobDetailScreen.tsx`
  * `JobPostScreen.tsx`
* [ ] `packages/ui/src/JobCard.tsx` が存在し、Job の一覧/詳細で利用されている
* [ ] `apps/web` の求人関連ルートは **必ず `@features/job/*Screen`** を使っている

### デモ可能な機能

* ✅ Restaurant が Web から求人投稿
* ✅ Chef が Web から求人一覧を閲覧・フィルタ
* ✅ 求人詳細を閲覧
* ✅ 「この画面は `packages/features/job` の Screen を Web から利用している」と説明できる

---

## Milestone 4: 全主要機能の Screen 化 & 共通 UI 拡充 🎨

**期間**: 3–4週間
**目標**: Web 専用ページとして実装されている主要機能を **すべて `packages/features` の Screen に移行**し、
共通 UI（`packages/ui`）を整備する。

対象機能例:

* Auth
* ChefProfile / RestaurantDashboard
* Chat
* レビュー・スケジューリング（MVP範囲に応じて）

### 完了条件

* [ ] 以下の Screen が `packages/features` に存在し、`apps/web` から利用されている

  * `features/auth/AuthScreen.tsx`
  * `features/chef/ChefProfileScreen.tsx`
  * `features/chat/ChatScreen.tsx`
  * 必要に応じて `features/restaurant/RestaurantDashboardScreen.tsx` など
* [ ] それぞれに対応する hooks (`useAuth`, `useChefProfile`, `useChat` 等) が存在する
* [ ] `packages/ui` に最低限の共通 UI が実装済み

  * `Button.tsx`, `Card.tsx`, `Tag.tsx`, `Badge.tsx`, `Avatar.tsx`, `Header.tsx`
* [ ] 主要 Screen 内で `<button>` や `<div class="...">` 直書きが減り、
  基本的な UI は `@ui` コンポーネント経由になっている
* [ ] `apps/web/src/components` 直下に、機能全体を担う `〜Page.tsx` がほぼ残っていない
  （LP と一部 Web 専用ページのみ）

### デモ可能な機能

* ✅ Web で Auth / プロフィール / 求人 / Chat が一通り動く
* ✅ 「この Auth 画面は Web でも Mobile でも同じ `AuthScreen` を使う想定」と説明できる
* ✅ `@ui/Button` や `@ui/JobCard` を使って画面が組まれていることをコード上で確認できる

---

## Milestone 5: Expo モバイルアプリ PoC 📱

**期間**: 2–3週間
**目標**: `apps/mobile` に Expo プロジェクトを作成し、
**実際に iOS/Android で `packages/features` の Screen を動かす**。

### 完了条件

* [ ] `apps/mobile` に Expo プロジェクトが存在する
* [ ] `apps/mobile/tsconfig.json` で `tsconfig.base.json` を継承し、`@features`, `@ui`, `@api-client` を解決できる
* [ ] Expo Router（または React Navigation）を用いたルーティングが設定されている
* [ ] 少なくとも以下の Screen がモバイルで動作する

  * `JobListingScreen`
  * `AuthScreen`
* [ ] 実機 or エミュレータで API 通信が成功（求人一覧取得・ログインなど）

### デモ可能な機能

* ✅ iOS/Android で ChefNext モバイルアプリを起動し、求人一覧が表示される
* ✅ モバイルからログインし、認証済みの画面に遷移できる
* ✅ 「この画面のコードは Web とモバイルで共通」ということを Git 上で確認できる

---

## Milestone 6: チャット・通知 & モバイル体験強化 💬

**期間**: 3–4週間
**目標**

1. Chef ↔ Restaurant 間のリアルタイムチャット＋通知を実装
2. チャット Screen を Web/Mobile 共通で利用できる状態にする

### 完了条件

* [ ] WebSocket ベースのチャット API が動作する
* [ ] 会話・メッセージの履歴が DB に保存される
* [ ] `features/chat/ChatScreen.tsx` が Web / Mobile 両方で動く
* [ ] 新着メッセージ通知（メール or WebSocket push）が届く
* [ ] モバイルでのチャット UI（キーボード開閉・スクロールなど）が実用レベル

### デモ可能な機能

* ✅ Restaurant / Chef が別端末からリアルタイムチャット
* ✅ 新着メッセージ通知受信
* ✅ Web とモバイルで同じ相手とやりとりできる

---

## Milestone 7: 本番デプロイ & ストア申請 / MVP 完成 🚀🎉

**期間**: 3–4週間
**目標**

* AWS 上に本番環境を構築し、GitHub Actions から自動デプロイ
* Web は独自ドメイン＋HTTPS
* モバイルは App Store / Google Play への申請準備が整った状態

### 完了条件

**インフラ / CI**

* [ ] Terraform で VPC / ECS Fargate / RDS / ElastiCache / S3 / CloudFront が構築される
* [ ] GitHub Actions → ECR/ECS デプロイの CI/CD が動作する
* [ ] `https://app.chefnext.com`（仮）が HTTPS でアクセスできる

**モバイル**

* [ ] Expo EAS で iOS/Android の Release ビルドを作成できる
* [ ] アプリ名・アイコン・スプラッシュなどブランド要素が反映されている
* [ ] App Store Connect / Google Play Console にアップロード可能な状態
  （実際の審査提出タイミングは別途調整でも OK）

**品質 / ドキュメント**

* [ ] 主要フローの E2E テスト（Playwright 等）が通る
  （Auth → プロフィール作成 → 求人閲覧 → 応募 → チャット）
* [ ] 基本的な負荷試験（k6）で P95 < 1.5s を確認
* [ ] API / アーキテクチャ / デプロイ手順 / 運用手順のドキュメントが整備されている

### デモ可能な機能

* ✅ 本番 URL で一連のフローをデモできる
* ✅ ストア用ビルドが存在し、実機インストール（TestFlight / Internal Test）で動作する
* ✅ 「Web もモバイルも同じ Screen / API クライアントを使っている」ことを示せる

---

## 進捗トラッキング（テンプレ）

* ✅ Milestone 0: 100% (完了)
* ✅ Milestone 1: 100% (完了)
* 🔄 Milestone 2: xx%（プロフィール UI 実装中 … など）
* ⬜ Milestone 3: 0%
* ⬜ Milestone 4: 0%
* ⬜ Milestone 5: 0%
* ⬜ Milestone 6: 0%
* ⬜ Milestone 7: 0%

---
