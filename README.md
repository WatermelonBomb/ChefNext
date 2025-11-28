# ChefNext Monorepo

このリポジトリはChefNextのフロントエンド/バックエンド/インフラを1つにまとめたモノレポ構成です。

## ディレクトリ構成
- `apps/web`: 既存のVite/ReactベースのUI (Next.jsへの移行予定)。
- `apps/api`: バックエンド(Golang/NestJS)の実装予定地。
- `packages/*`: UIキットやAPIクライアントなどフロント/バック共通モジュール。
- `services/*`: 将来的に切り出す独立サービスの雛形。
- `infra/*`: Terraformやdocker-composeなどのインフラ定義。
- `ops/*`: CI/CD設定、スクリプト類。
- `docs/*`: 技術選定や運用方針のドキュメント。

## 開発の始め方
フロントエンド:
```bash
cd apps/web
npm install
npm run dev
```
バックエンド/その他サービスは順次追加します。



