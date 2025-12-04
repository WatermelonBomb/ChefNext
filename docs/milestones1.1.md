# ChefNext マイルストーン（Web/ネイティブ対応版 1.1 草案）

このドキュメントは、Web + ネイティブ対応の MVP に向けた最新ロードマップです。
旧版 (docs/milestones1.0.md) からの差分を **追加 / 修正 / 削除** で明示します。

## 更新サマリー

### 追加
- `Milestone 0` に **pnpm workspace + TurboRepo** によるモノレポ基盤構築を追加。
- `Milestone 3` に **応募データモデル／API／UI** をフル復元し、React Native ベース UI 方針とパスエイリアス統合設定を追加。
- `Milestone 4` に **料理写真アップロード (S3 + Lambda) とサイズ仕様 (256/1024/1920, EXIF除去, WebP+Original)** を追加。
- `Milestone 6` に **応募→チャット連携＋簡易レビュー機能** を追加。
- `Milestone 7` に **性能 (P95 < 1.5s) / セキュリティチェック / QA** を追加。

### 修正
- `Milestone 3` のフロント共通化方針を **React Native ベース UI + react-native-web で段階的統一** に修正。
- `Milestone 5` の Expo PoC に **Metro/Babel の alias 設定と packages/ui (React Native) の採用前提** を明記。
- `Milestone 7` のスコープを **本番デプロイ + ストア申請 + 品質保証** に再定義し、面談予約/通報は Post-MVP と表記。

### 削除 / 後ろ倒し
- `Milestone 6` から **高度な応募管理UI**、`Milestone 7` から **面談予約・通報の実装** を Post-MVP に移動（設計メモのみ残す）。

---

## Milestone 0: モノレポ開発環境構築 🛠️ (修正)

**期間**: 1–2 週間
**目標**: ローカルでバックエンドを起動し、モノレポ構成での開発土台を整える。

### 完了条件 (Definition of Done)
* [ ] `docker-compose up` で全依存サービス（PostgreSQL, Redis, MinIO, MailPit）が起動する
* [ ] Go サーバーが起動し、`http://localhost:8080/health` が応答する
* [ ] データベースマイグレーションが実行できる
* [ ] 構造化ログが出力される
* [ ] ホットリロード（`air`）が動作する
* [ ] **pnpm workspace + TurboRepo** によるルートモノレポ構成が確立している (追加)

### デモ可能な機能
* ✅ ヘルスチェックエンドポイント
* ✅ DB 接続・マイグレーション確認
* ✅ Turbo を経由した `apps/api` / `apps/web` のビルド or `dev` 実行

### タスクチェックリスト（抜粋）
* Go / Docker / Makefile セットアップ（前回同様）
* **モノレポ基盤 (追加)**
  * [ ] ルート `package.json` + `pnpm-workspace.yaml`
  * [ ] `apps/*`, `packages/*` を workspace に含める
  * [ ] `turbo.json` 作成（`build`, `lint`, `test`, `dev` パイプライン）
  * [ ] GitHub Actions で Turbo の Remote Cache を利用する準備（任意）

---

## Milestone 1: 認証基盤 🔐

**期間**: 2–3 週間
**目標**: Email/Password 認証と JWT ベース認可を実装し、最小のログイン体験を提供する。

（完了条件・タスクは 1.0 と同様。`packages/api-client` から呼べること、`apps/web` でログイン/ログアウトができることを維持。）

---

## Milestone 2: プロフィール管理 👤

**期間**: 2–3 週間
**目標**: Chef / Restaurant のプロフィールを作成・編集・閲覧できる。（Web 実装を先行）

（完了条件は 1.0 と同様。スキルツリー JSON、RBAC、Web UI を維持。）

---

## Milestone 3: 求人 + 応募 ＆ フロント共通化基盤 💼🧱 (追加/修正)

**期間**: 3–4 週間
**目標**
1. Restaurant が求人を投稿し、Chef が検索・閲覧・応募できる。
2. React Native ベースの `packages/ui` / `packages/features` を Web でも扱えるよう、共通化の土台を整える。

### 完了条件（修正）
**バックエンド / 機能**
* [ ] 求人 CRUD API
* [ ] 求人検索 API（キーワード、スキル、エリア）
* [ ] **応募 API** (追加)
  * `CreateApplication`
  * `GetApplicationsForChef`
  * `GetApplicationsForRestaurant`
* [ ] 応募ステータス: `PENDING / ACCEPTED / REJECTED`
* [ ] `applications` テーブル（`job_id`, `chef_id`, `status`, `cover_letter`, timestamps, `UNIQUE(job_id, chef_id)`) (追加)

**フロント / アーキテクチャ**
* [ ] `packages/features/job/*.tsx` (Listing / Detail / Post)
* [ ] **応募 UI** (追加)
  * 求人詳細から応募フォーム
  * Chef 用応募一覧
  * Restaurant 用応募一覧
* [ ] `packages/ui/src/JobCard.tsx`
* [ ] `apps/web` の求人関連ルートが `@features/job/*` を利用
* [ ] `tsconfig.base.json` で `@features`, `@ui`, `@api-client` を定義 (修正)
* [ ] **Vite / Babel / Jest 設定でも同じ alias を解決** (追加)
* [ ] **React Native ベース UI 方針をドキュメント化** (追加)
  * `packages/ui` は View/Text/Image など RN プリミティブで実装
  * Web では当面 shadcn/Radix を併用し、段階的に `react-native-web` へ移行
  * `nativewind` 採用可否を検討し、方針を README に追記

### デモ可能な機能
* ✅ 求人投稿・編集（Restaurant）
* ✅ 求人検索・フィルタ（Chef）
* ✅ 求人詳細閲覧
* ✅ **応募作成 & 応募一覧の閲覧** (追加)
* ✅ 「この画面は `packages/features/job` を Web から利用」と説明できる

---

## Milestone 4: ポートフォリオ画像アップロード 📸 (追加)

**期間**: 1–2 週間
**目標**: シェフが料理写真をアップロードし、プロフィール/ポートフォリオで表示できる。

### 完了条件（追加）
* [ ] S3 Presigned URL 発行 API（直アップロード）
* [ ] 画像処理 Lambda or ワーカー
  * EXIF 除去
  * 生成サイズ: **256 / 1024 / 1920 px**
  * 形式: **WebP + Original** を保存、クライアントは WebP 優先
  * Blurhash 生成（Nice-to-have）
* [ ] ポートフォリオ項目/写真テーブル（旧仕様を継承）
* [ ] Web UI: 料理写真一覧、カバー画像指定、プロフィールでの参照
* [ ] packages/ui から Image コンポーネントを利用し、将来のモバイル共通化に備える

### デモ可能な機能
* ✅ 料理写真アップロード → 自動処理 → 表示
* ✅ プロフィールからポートフォリオを閲覧

---

## Milestone 5: Expo モバイルアプリ PoC 📱 (修正)

**期間**: 2–3 週間
**目標**: `apps/mobile` に Expo プロジェクトを作成し、`packages/features` / `packages/ui` (React Native) を iOS/Android で動かす。

### 完了条件（修正）
* [ ] `apps/mobile` の Expo プロジェクト + pnpm workspace 連携
* [ ] `apps/mobile/tsconfig.json` が `tsconfig.base.json` を継承
* [ ] **Metro + Babel の alias 設定で `@features`, `@ui`, `@api-client` を解決**
* [ ] Expo Router or React Navigation 設定
* [ ] `JobListingScreen`, `AuthScreen` がモバイルで動作
* [ ] 実機/エミュレータで API 通信（求人一覧、ログイン）
* [ ] packages/ui が React Native コンポーネントとして実装済み（Milestone 3 で方向性確定、ここで実働）

### デモ可能な機能
* ✅ iOS/Android で求人一覧と認証フロー
* ✅ Web とモバイルで同じ Screen / API クライアントを共有

---

## Milestone 6: チャット・通知 + 応募起点レビュー 💬⭐ (修正/追加)

**期間**: 3–4 週間
**目標**
1. 応募 (`applications`) と紐づくリアルタイムチャットを実装。
2. 応募完了後の簡易レビュー（星 + コメント）を提供。
3. モバイルでのチャット体験を実用レベルにする。

### 完了条件
* [ ] WebSocket ベースのチャット API
* [ ] `conversations` が `application_id` と紐づく
* [ ] メッセージ履歴保存、既読状態 (optional)
* [ ] asynq などで通知キュー、メール or WebSocket Push
* [ ] **応募 → チャット開始の導線**（応募一覧からチャット起動）
* [ ] **簡易レビュー API/UI**（応募ステータス確定後に片方向レビューを作成）
* [ ] モバイル（Expo）でもチャット Screen が動作
* [ ] 応募管理の高度 UI（フィルタ/バルク）は `Post-MVP` として仕様メモのみ
* [ ] 面談候補日メモは Optional として README に残す

### デモ可能な機能
* ✅ Restaurant / Chef 間で応募からチャット開始
* ✅ 新着メッセージ通知受信
* ✅ レビュー投稿・閲覧

---

## Milestone 7: 本番デプロイ + 品質保証 + ストア申請 🚀🔒 (修正)

**期間**: 3–4 週間
**目標**
* AWS 上の本番環境 + GitHub Actions で自動デプロイ
* Web は独自ドメイン + HTTPS
* モバイルは App Store / Google Play 申請準備
* **性能 / セキュリティ / QA** を MVP 観点で締める
* 面談予約・通報は Post-MVP として設計メモを残す

### 完了条件（修正）
**インフラ / CI**
* [ ] Terraform: VPC / ECS Fargate / RDS / ElastiCache / S3 / CloudFront
* [ ] GitHub Actions → ECR/ECS デプロイ
* [ ] `https://app.chefnext.com` (仮) が HTTPS で動作

**モバイル**
* [ ] Expo EAS で iOS/Android Release ビルド
* [ ] ブランド要素反映、ストアメタデータ準備
* [ ] TestFlight / Internal Test で実機検証

**品質**
* [ ] E2E テスト（Playwright）: Auth → プロフィール → 求人 → 応募 → チャット → レビュー
* [ ] 負荷試験（k6）で **P95 < 1.5s** を確認
* [ ] セキュリティチェック（依存ライブラリ CVE、Auth/権限レビュー）
* [ ] レポート共有
* [ ] **Post-MVP**: 面談予約 / 通報のデータモデル設計メモを docs に残す（実装は後続）

### デモ可能な機能
* ✅ 本番 URL で一連のフローをデモ
* ✅ ストア用ビルドを配布（TestFlight / Internal Test）
* ✅ k6 / セキュリティレポートを提示

---

## 進捗トラッキング

* ✅ Milestone 0: 100% (完了)
* ✅ Milestone 1: 100% (完了)
* ✅ Milestone 2: 100% (完了・2025-12-03、プロフィール管理 UI/API 反映済み)
* ⬜ Milestone 3: 0% (求人 + 応募／フロント共通化 未着手)
* ⬜ Milestone 4: 0%
* ⬜ Milestone 5: 0%
* ⬜ Milestone 6: 0%
* ⬜ Milestone 7: 0%

---

最終更新: 2025-12-04
