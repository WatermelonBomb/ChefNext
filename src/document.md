了解！エンジニア（人/AIどちらでも可）にそのまま渡せる**マスタープロンプト**を用意しました。これ1本で、MVPの設計〜実装まで一気通貫で動けます。必要に応じて後半の**サブプロンプト群**も使ってください。

---

# ✅ マスタープロンプト（コピー用）

あなたはリードエンジニアです。
以下の要件に基づき、**将来独立を目指すシェフのスキルアップ支援を主軸としたマッチング/成長プラットフォーム「ChefNext」** のMVPを、設計→実装→テスト→簡易ドキュメントまで完了してください。優先度は①学びの可視化（スキルツリー）②作品（料理写真）ポートフォリオ③「学べること」で探せる求人/修行枠④マッチ→面談予約の最短動線です。

## 1. プロダクト目標

* ミッション：「**学びながら働く**」を実現。将来のオーナーシェフ候補が**スキルを獲得しやすい環境**を選べる。
* 主なユーザー

  * シェフ（見習い〜スーシェフ〜独立準備）
  * 店舗（育成環境を提供するレストラン/パティスリー/ホテル等）
* 成功指標（MVP）

  * 修行枠/育成枠のマッチング成立数
  * ポートフォリオ閲覧→問い合わせ率
  * スキルツリー更新（成長ログ）の月次アクティブ率

## 2. 主要ユースケース（MVP）

* シェフ：プロフィール作成 → **作品（料理写真）**登録 → スキルツリー設定 → 「学べること」で求人を探索 → 応募/スカウト受領 → チャット → 面談予約
* 店舗：育成方針/学べるスキルを明示した求人（**修行枠/独立支援枠**）を作成 → シェフ検索/スカウト → 面談/トライアル日程調整 → 双方向レビュー
* 共通：通知（応募/スカウト/面談）、レビュー、違反報告

## 3. スコープ（MVPに含める）

* 認証：Email/Password（後続でSNS追加可）、KYCフラグのみ
* シェフプロフィール＋**スキルツリー**（JSON構造）
* **料理写真ポートフォリオ**（複数画像/EXIF除去/自動サムネ/コレクション）
* 店舗プロフィール＋求人（type: fulltime/contract/spot/**apprentice**/independence_support）
* 検索/フィルタ（学べるスキル、業態、報酬、エリア、稼働時間）
* マッチ・応募・チャット（テキスト＋画像添付）
* 面談予約（アプリ内カレンダー）
* レビュー（学びの質/働きやすさ）
* 運営向け：基本モデレーション（通報/凍結）

## 4. 非機能要件

* パフォーマンス：検索P95 < 1.5s、画像はCDN配信、WebP/AVIF最適化
* セキュリティ：OWASP ASVS準拠、CSRF/Rate Limit、画像EXIF除去
* プライバシー：顔出し非必須、エリアは市区町村粒度
* アクセシビリティ：WCAG 2.2 AA目標

## 5. 技術スタック（推奨）

* フロント：Next.js (App Router) + TypeScript、Tailwind、React Hook Form、Zustand
* サーバ：NestJS（Express）+ TypeScript
* DB：PostgreSQL（Prisma ORM）
* 検索：OpenSearch/Elasticsearch（後続でも可。MVPはDB＋GIN索引でも可）
* ストレージ：S3互換（署名URLアップロード）＋CloudFront
* 画像処理：アップロード時にLambda/Sharpでリサイズ＆EXIF除去
* 認証：NextAuth（Email/Password）
* 通知：メール（SendGrid等）
* インフラ：Docker + Terraform（任意、ローカルはdocker-compose）

## 6. データモデル（Prisma例）

```prisma
model User {
  id           String  @id @default(cuid())
  role         Role
  email        String  @unique
  hashedPw     String
  kycStatus    KycStatus @default(PENDING)
  createdAt    DateTime @default(now())
  chefProfile  ChefProfile?
  restaurant   Restaurant?
}

enum Role { CHEF RESTAURANT ADMIN }
enum KycStatus { PENDING VERIFIED REJECTED }

model ChefProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  headline        String?
  bio             String?
  yearsExperience Int      @default(0)
  specialties     String[] // ["Italian","Patissier"]
  languages       String[]
  workAreas       String[] // 市区町村名
  payMin          Int?
  payMax          Int?
  certifications  String[] // ["FoodSafety","HACCP"]
  skillTreeJson   Json     // { nodes:[{id, label, level(0-5)}], targets:[...] }
  portfolioItems  PortfolioItem[]
  reviews         Review[] @relation("ChefReviews")
  user            User     @relation(fields: [userId], references: [id])
}

model PortfolioItem {
  id          String @id @default(cuid())
  chefId      String
  title       String
  description String?
  techniques  String[] // ["Sous-vide","Fermentation"]
  allergens   String[] // ["Egg","Milk"]
  priceBand   String?  // "casual" | "bistro" | "fine"
  photos      PortfolioPhoto[]
  createdAt   DateTime @default(now())
  chef        ChefProfile @relation(fields:[chefId], references:[id])
}

model PortfolioPhoto {
  id        String @id @default(cuid())
  itemId    String
  url       String
  width     Int?
  height    Int?
  blurhash  String?
  isCover   Boolean @default(false)
  item      PortfolioItem @relation(fields:[itemId], references:[id])
}

model Restaurant {
  id               String   @id @default(cuid())
  userId           String   @unique
  displayName      String
  cuisineTypes     String[]
  addressArea      String
  seats            Int?
  description      String?
  website          String?
  verification     KycStatus @default(PENDING)
  jobs             Job[]
  reviews          Review[]  @relation("RestaurantReviews")
  user             User      @relation(fields:[userId], references:[id])
}

model Job {
  id            String   @id @default(cuid())
  restaurantId  String
  title         String
  description   String
  type          JobType   // FULLTIME | CONTRACT | SPOT | APPRENTICE | INDEPENDENCE_SUPPORT
  requiredSkills String[]
  teachableSkills String[] // 店舗が「学べること」を明示
  cuisineTags   String[]
  payType       PayType   // HOURLY | MONTHLY | PER_SHIFT
  payMin        Int?
  payMax        Int?
  locationArea  String
  shiftsJson    Json?
  urgency       Boolean   @default(false)
  applications  Application[]
  createdAt     DateTime  @default(now())
  restaurant    Restaurant @relation(fields:[restaurantId], references:[id])
}

enum JobType { FULLTIME CONTRACT SPOT APPRENTICE INDEPENDENCE_SUPPORT }
enum PayType  { HOURLY MONTHLY PER_SHIFT }

model Application {
  id        String   @id @default(cuid())
  jobId     String
  chefId    String
  status    AppStatus @default(APPLIED)
  messages  Message[]
  interviews Interview[]
  job       Job        @relation(fields:[jobId], references:[id])
  chef      ChefProfile @relation(fields:[chefId], references:[id])
}

enum AppStatus { APPLIED INTERVIEW TRIAL OFFER HIRED REJECTED }

model Message {
  id          String   @id @default(cuid())
  applicationId String
  fromUserId  String
  body        String?
  imageUrl    String?
  createdAt   DateTime @default(now())
  application Application @relation(fields:[applicationId], references:[id])
}

model Interview {
  id            String   @id @default(cuid())
  applicationId String
  datetime      DateTime
  method        String   // "onsite" | "video"
  notes         String?
  application   Application @relation(fields:[applicationId], references:[id])
}

model Review {
  id           String   @id @default(cuid())
  fromUserId   String
  toUserId     String
  jobId        String?
  rating       Int      // 1-5
  tags         String[] // ["TeachingQuality","KitchenHygiene"]
  comment      String?
  createdAt    DateTime @default(now())
  // 片側はChefReviews、もう片側はRestaurantReviewsで論理区別
}
```

## 7. 主要API（REST例）

* 認証：`POST /auth/signup`, `POST /auth/login`
* シェフ：`GET /chefs/:id`, `PATCH /chefs/:id`, `POST /chefs/:id/skill-tree`
* ポートフォリオ：`POST /portfolio/items`, `POST /portfolio/:id/photos`（署名URL→直PUT）
* 店舗/求人：`POST /jobs`, `GET /jobs?skills=teach:fire,prep&area=...&type=APPRENTICE`
* 応募/チャット：`POST /applications`, `POST /applications/:id/messages`
* 面談：`POST /applications/:id/interviews`
* 検索：`GET /search/chefs?specialties=...&skills=...&area=...`
* レビュー：`POST /reviews`

### 画像アップロード手順

1. `POST /uploads/sign` → 署名URL取得
2. クライアントからS3直PUT（`Content-Type`チェック）
3. Lambdaで**EXIF除去＋サイズ変換（サムネ/標準/拡大）** → CDN配信

## 8. マッチング・ランキング（MVPルール）

* スコア ＝ 条件適合（エリア/時間/報酬）40% + **学べるスキル適合**35% + 活動鮮度10% + 実績/評価15%
* コールドスタート：**作品閲覧→問い合わせ率**が高いシェフを一時的にブースト

## 9. 画面（最低限）

* LP：価値提案「学びながら働く」＋作品ギャラリー
* シェフ登録：基本情報 → **ポートフォリオ** → スキルツリー → 希望稼働/報酬
* 検索：求人カード（teachablesタグ表示）＋フィルタ
* 詳細：

  * シェフ詳細：代表作ヒーロー、アルバム、スキルツリー可視化（レベル0-5）
  * 求人詳細：学べるスキル、育成体制、過去卒業生、面談予約CTA
* チャット＋面談予約

## 10. 受け入れ条件（E2Eの要点）

* [ ] シェフは**料理写真を5枚以上**登録でき、カバー画像を設定できる
* [ ] 画像はEXIF除去され、CDN経由で**3サイズ**（thumb/medium/large）配信される
* [ ] 求人には**teachableSkills**が必須で、検索フィルタ（teachables）が機能する
* [ ] マッチ一覧は**スキル適合度の高い順**で並ぶ
* [ ] 応募→チャット→面談予約が**3クリック以内**で完了
* [ ] スキルツリーのノードを**追加/更新**でき、シェフ詳細に可視化される
* [ ] レビューは**学びの質**タグを含む
* [ ] 基本的な通報/凍結が機能する（運営画面で切替）

## 11. テスト

* ユニット：モデル/サービス/コントローラ（Jest）
* API契約：OpenAPI（/docs）を生成し、**Contract Test**（Pact任意）
* E2E：Cypress（主要ユーザーフロー）
* 画像：アップロード/変換の統合テスト（署名URL→PUT→表示まで）

## 12. ドキュメント

* README：起動手順（docker-composeでDB/S3ローカル）、環境変数、Seedデータ
* API仕様：OpenAPI（Swagger UI）
* アーキ図：1枚（フロント/サーバ/DB/ストレージ/変換Lambda/CDN）

**最終成果物**：動作するMVP、README、OpenAPI仕様、Cypressテスト、サンプルスクリーンショット

---

# 🧩 サブプロンプト（用途別に追加で使える）

### A. フロントUI実装用

「Next.js + Tailwindで、上記スコープのうち**シェフ登録→ポートフォリオ→スキルツリー**の画面を実装。画像アップは署名URL方式。スキルツリーはレベル0-5のドラッグ編集UI（ノード追加/削除/レベル変更）。フォームはReact Hook Form＋zod。アクセシビリティ配慮（キーボード操作、代替テキスト必須）。ダミーデータSeed付きでスタブAPIに接続。」

### B. 画像アップロード基盤

「S3互換＋Lambda(Sharp)でEXIF除去/リサイズ（256, 1024, 1920）→CloudFront配信。`POST /uploads/sign`で署名URL発行、PUT後はLambda@Edgeでメタ挿入。MIME/拡張子バリデ、サイズ上限10MB、危険コンテンツの簡易判定（NSFWスコア閾値のみ）。」

### C. マッチングAPI

「teachables（学べるスキル）× chef.skillTreeJson（現在/希望）でスコアリング。Postgresのtsvector＋GINでタグ/テキスト検索、地理は市区町村の前方一致。`GET /jobs/search`に`teach=fire,menu_dev`等のクエリで対応。」

### D. 面談予約

「`POST /applications/:id/interviews`で面談作成。タイムゾーンはAsia/Tokyo固定でISO文字列。ダブルブッキング防止はDBトランザクション＋ユニーク制約（applicationId+datetime）。」

### E. レビュー/通報

「レビューは1ジョブ1レビュー、from→toでロールに応じて`TeachingQuality`等のタグを必須。通報は`POST /reports`で対象種別（user/job/message）と理由を受け、管理UIで状態遷移（OPEN/INVESTIGATING/CLOSED）。」

---

必要ならこのプロンプトを**Notion/Confluence用PRD**や**GitHub Issueテンプレ**に最適化します。どの形式に落とす？
