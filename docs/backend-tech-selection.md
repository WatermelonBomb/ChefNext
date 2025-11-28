# ChefNext Backend Technical Selection

このドキュメントは、ChefNext (シェフの学びと成長を支援するマッチング/ポートフォリオプラットフォーム) のMVPバックエンドを実装するための具体的な技術選定と設計方針をまとめたものです。フロントは既に存在するUIモック (React/Vite) をNext.jsへ移行予定であり、バックエンドはこの仕様を起点に新規構築します。

## 1. プロダクトゴール & 制約
- **価値提供**：スキルツリーで学びを可視化し、作品ポートフォリオと「学べること」タグ付き求人で最短マッチング→面談を実現。
- **主要ユーザー**：成長志向のシェフ / 育成型レストラン。双方がプロフィールとレビューを更新することを通じて信頼が蓄積される。
- **MVP機能範囲**：Email/Password認証、Chef/Restaurantプロフィール、求人(修行枠/独立支援枠含む)、応募/チャット/面談、スキルツリー、料理写真ポートフォリオ、レビュー、通報。
- **非機能要件**：検索レスポンスP95 < 1.5s、画像は3サイズ生成＋CDN、OWASP ASVS L1、WCAG 2.2 AA準拠UI、PII暗号化、可観測性 (ログ/メトリクス/トレース) の初期整備。
- **開発体制**：当面は1チーム (FE/BE共通)。モジュール化されたモノリスで開発速度を優先、将来のチーム分割を見据え責務境界を明文化。

## 2. アーキテクチャ概要

| 項目 | 採用 | 理由 | 将来の拡張 |
| --- | --- | --- | --- |
| 実行基盤 | **Go 1.22 モジュラーモノリス** | チャット/通知・画像署名・マッチング計算など CPU/IO を跨ぐ処理が多く、軽量ランタイムと並行処理 (goroutine) が効果的。ビルド速度・配布の容易さでも優位。 | チャット/検索を独立サービスに切り出し可。
| API形態 | **gRPC (Connect) + WebSocket** | gRPC/Connectで型安全な内部API、フロントへはConnect-WebでJSON/HTTP。チャット/通知はWebSocket。Bufで契約管理。 | GraphQLは要件固まった後に検討。
| DB | **PostgreSQL 15 + sqlc** | JSONBや全文検索 (pg_trgm, tsvector) でMVP要件を満たしつつ、sqlcで型安全なクエリ生成。マイグレーションはgoose。 | 需要増でOLAP/CDCや検索専用DBへ拡張。
| キュー/ジョブ | **Redis + asynq** | Goとの親和性、遅延/優先制御、最小構成で導入可。WebUIで監視。 | 需要拡大で専用ワーカー群やSQSへ移行。
| 検索 | **Postgres GIN + pg_trgm** | 求人/シェフ検索はDB内インデックスで十分。 | 求人数>50kでOpenSearchへ切替。
| ファイル | **AWS S3 + presigned URL + CloudFront** | 画像処理要件 (EXIF除去/3サイズ) と署名付きアップロードをシンプルに実装。 | 大規模化で専用Mediaサービスや別リージョン複製。

### Go 選定の詳細理由

#### ChefNext要件との適合性
1. **チャット/通知**: goroutineで並行WebSocket接続を効率的に処理
2. **画像署名**: S3 presigned URL生成などIO処理が軽量
3. **マッチング計算**: CPU集約的なスコア計算をgoroutineで並列実行

#### スケール時の優位性
- **リソース消費**: メモリフットプリント小（Node.js比 1/3〜1/5）
- **ビルド速度**: 単一バイナリ生成、依存解決が高速
- **配布の容易さ**: ランタイム不要、Dockerイメージ小（10MB程度）

#### 開発体制への適合
- **型安全性**: 静的型付け + sqlcでDB操作も型安全
- **保守性**: フォーマッター (gofmt)・リンター (golangci-lint) が標準的
- **将来の採用**: Go人材の市場は成熟、アーキテクチャ判断が明確

#### 比較検討（NestJSを不採用とした理由）
| 観点 | Go | NestJS | 判断 |
|------|----|----|------|
| **開発速度（初期）** | 中 | 高（DI/デコレーター） | △ |
| **開発速度（スケール時）** | 高（ビルド高速） | 低（ビルド遅延） | ✅ Go |
| **並行処理** | goroutine（軽量） | async/await（重い） | ✅ Go |
| **リソース消費** | 小 | 大 | ✅ Go |
| **型安全性** | 強い | 強い | △ |
| **フロントとの知見共有** | 別言語 | TypeScript共通 | ❌ Go |

**結論**: 初期の学習コストは NestJS が低いが、ChefNext の要件（並行処理多用）と将来のスケールを考慮し、**Go を採用**。

## 3. モジュール境界 (Go)

```
apps/api/
├─ cmd/
│  ├─ api/          # HTTPサーバー（gRPC/Connect + WebSocket）
│  └─ worker/       # asynqワーカー
├─ internal/
│  ├─ domain/       # ドメインモデル（entity, value object）
│  │  ├─ identity/
│  │  ├─ chef/
│  │  ├─ restaurant/
│  │  ├─ matchmaking/
│  │  ├─ communication/
│  │  └─ review/
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

### ドメインモジュール
1. **identity**: 認証/認可、KYC、2FA将来対応。JWT + Argon2id。
2. **chef**: Chefプロフィール、スキルツリーJSON検証、ポートフォリオ、画像署名発行。
3. **restaurant**: レストラン情報、求人CRUD、育成できるスキル定義、シフトテンプレ保存。
4. **matchmaking**: 応募/スカウト、適合度計算、ランキングキャッシュ。
5. **communication**: チャット、面談予約、メール通知、WebSocket通知。
6. **review**: レビュー、評価集計、通報、凍結フロー。
7. **admin**: 内部オペレーション、Feature Flag、監査ログビューア。

依存方向: `handler -> usecase -> repository`

## 4. 認証・認可
- **方式**: Email/Password (Magic Linkは後続)。Argon2idハッシュ + pepper。
- **セッション**: 短期JWT (15分) + Redisに格納したRefreshトークン。
- **RBAC**: Role(CHEF/RESTAURANT/ADMIN) をJWT Claimに格納。リソースレベルの認可はミドルウェアで実装。
- **KYC**: `kycStatus`と`kycFlags`フィールドで判定。レビューや求人公開にはVerified必須。
- **Rate Limit/Bot対策**: `golang.org/x/time/rate` + Redis。応募/チャットにはhCaptcha検証エンドポイントを挟む。

### JWT実装例
```go
type Claims struct {
    UserID string `json:"user_id"`
    Role   string `json:"role"`
    jwt.RegisteredClaims
}

func GenerateToken(userID, role string) (string, error) {
    claims := &Claims{
        UserID: userID,
        Role:   role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
```

## 5. データ / ストレージ
- **ORM/マイグレーション**: sqlcで型安全なクエリ生成。マイグレーションはgooseで管理。
- **主要テーブル**: `users`, `chef_profiles`, `restaurants`, `jobs`, `applications`, `messages`, `interviews`, `reviews`, `skill_tree_snapshots`, `portfolio_items`, `portfolio_photos`, `reports`。
- **JSONB利用**: スキルツリー (`skill_tree_json`)、求人の`teachable_skills`/`shifts_json`、面談可用スロット (`availability_json`) に利用。GINインデックス + partial indexで高速化。
- **全文検索**: `jobs`にtsvector列 (title/description/teachable_skills) を追加し`gin`index。Chef検索は`specialties`,`work_areas`へのpg_trgm index。
- **監査/履歴**: 重要イベントは`domain_events`(JSONB)に格納し、将来のストリーム処理に備える。
- **ファイルメタ情報**: 画像はS3キーのみ保持し、`portfolio_photos`でサイズ/blurhash/カバーフラグを管理。

### sqlc例
```yaml
# sqlc.yaml
version: "2"
sql:
  - schema: "db/migrations"
    queries: "db/queries"
    engine: "postgresql"
    gen:
      go:
        package: "repository"
        out: "internal/repository"
```

```sql
-- db/queries/jobs.sql
-- name: GetJob :one
SELECT * FROM jobs WHERE id = $1;

-- name: ListJobs :many
SELECT * FROM jobs
WHERE status = 'OPEN'
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
```

## 6. ジョブ / メッセージング
- **asynqキュー**: `image-processing`, `notifications`, `matching-refresh`, `reports-review`。
- **ワーカー**: `cmd/worker/main.go` で別プロセス運用。WebUIで監視 (asynqmon)。
- **通知**: SendGridでメール、goroutineでWebSocket通知。ドメインイベント→ジョブ→送信者の順に処理し再送戦略 (指数バックオフ) を適用。
- **マッチング更新**: 求人/プロフィール更新時にRedis Sorted Setを再計算し、検索APIはキャッシュ結果＋リアルタイム補正を組み合わせる。

### asynq実装例
```go
// エンキュー
client := asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})
task := asynq.NewTask("image:process", payload)
client.Enqueue(task, asynq.MaxRetry(3))

// ワーカー
srv := asynq.NewServer(
    asynq.RedisClientOpt{Addr: redisAddr},
    asynq.Config{Concurrency: 10},
)
mux := asynq.NewServeMux()
mux.HandleFunc("image:process", handleImageProcess)
srv.Run(mux)
```

## 7. 画像/ファイル処理
1. Backendの`POST /uploads/sign`がS3 presigned URLを発行 (Content-Type検証、10MB制限、Key `chef/{id}/{uuid}.webp`)。
2. クライアントPUT完了後、S3イベント→Lambda(Go + imaging)でEXIF除去・256/1024/1920px生成・WebP変換。
3. Lambdaは`portfolio_photos`へメタ情報を書き込み、CloudFrontにキャッシュ指示ヘッダを設定。
4. ローカル開発はMinIO + docker-compose、MailPitでメール確認。

### S3 presigned URL生成 (Go)
```go
import "github.com/aws/aws-sdk-go-v2/service/s3"

func GeneratePresignedURL(ctx context.Context, bucket, key string) (string, error) {
    presignClient := s3.NewPresignClient(s3Client)
    req, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
        Bucket:      aws.String(bucket),
        Key:         aws.String(key),
        ContentType: aws.String("image/webp"),
    }, s3.WithPresignExpires(15*time.Minute))
    if err != nil {
        return "", err
    }
    return req.URL, nil
}
```

## 8. インフラ / デプロイ
- **クラウド**: AWS。`app`, `worker`, `migration` をECS Fargateで運用。RDS(PostgreSQL), ElastiCache(Redis), S3, CloudFront。
- **IaC**: Terraform + Terragrunt。VPC(2AZ), Private SubnetにApp/RDS、PublicにALB。App Mesh/ECS Execでデバッグ。
- **CI/CD**: GitHub Actions
  1. `lint-test` (golangci-lint, go test, sqlc diff)
  2. `build-image` (Docker multi-stage: `golang:1.22-alpine`→`scratch` または `distroless/static`)
  3. `deploy` (ECS blue/green + `goose up`)
  4. `terraform plan/apply` (手動承認)
- **Secrets**: AWS Secrets Manager + SSM Parameter Store。ローカルは`.env`を`godotenv`で読み込む。
- **ローカルDX**: `docker-compose up`でPostgres, Redis, MinIO, MailPitを起動。`air`でホットリロード、`make seed`で開発データ投入。

### Dockerfileマルチステージビルド
```dockerfile
# ビルド
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o api cmd/api/main.go

# 実行
FROM gcr.io/distroless/static:nonroot
COPY --from=builder /app/api /api
EXPOSE 8080
CMD ["/api"]
```

## 9. 可観測性・品質
- **ロギング**: `slog` (Go 1.21+)。構造化JSONに`requestID`,`userID`,`handler`を含めECS FireLens→CloudWatch。
- **トレース/APM**: OpenTelemetry SDK、OTLP Exporter→AWS X-Ray。gRPCインターセプターでスパンを生成し、DB/Redis/HTTPのinstrumentationを有効化。
- **メトリクス**: Prometheus互換 (`github.com/prometheus/client_golang`) へ`/metrics`をScrape。SLI: `http_request_duration_seconds{p95}`, `matching_refresh_delay`, `image_pipeline_latency`。
- **アラート**: CloudWatch Alarms→SNS→Slack/PagerDuty。例) P95>1.5s 5分継続、ジョブDLQ>0、RDS CPU>75% 15分。
- **セキュリティ検査**: `govulncheck` (依存)、Trivy (イメージ)、OWASP ZAP (CI DAST)、Terraformはtfsec + Infracost。

## 10. テスト戦略
- **Unit**: Go標準`testing` + `testify/assert`。UseCase/Handlerに対しRepositoryをモック。
- **Integration**: `testcontainers-go`で主要フローを実DBで検証。Redisは`miniredis`。
- **Contract**: Protocol BuffersをBufで管理し、フロントとのスキーマ整合性を保証。
- **E2E**: Playwright APIテストで「シェフ応募→チャット→面談作成」などのシナリオをNightly実行。
- **負荷テスト**: k6で検索/チャット/画像署名を計測。しきい値はP95 1.5s、エラー率<1%。

### テスト例
```go
func TestCreateJob(t *testing.T) {
    repo := &mockJobRepository{}
    uc := NewJobUseCase(repo)

    job, err := uc.CreateJob(ctx, &CreateJobInput{
        Title: "フレンチシェフ募集",
    })

    assert.NoError(t, err)
    assert.Equal(t, "フレンチシェフ募集", job.Title)
}
```

## 11. リリースロードマップ
1. **Phase 0**: Terraform雛形 + docker-composeテンプレ + Goプロジェクト雛形、`identity`/`chef`/`restaurant`基盤実装。
2. **Phase 1**: sqlc schema v0.1、求人/応募/チャットAPI、画像署名エンドポイント、最初のasynqワーカー。
3. **Phase 2**: レビュー/通報、面談予約、通知Fan-out、可観測性基盤。
4. **Phase 3**: 性能計測、Protocol Buffers契約公開、CI/CD本番導線、セキュリティチェックリスト消化。

## 12. 既知リスクと対策
| リスク | 影響 | 対応 |
| --- | --- | --- |
| 画像処理遅延でポートフォリオが空欄になる | 初回体験の低下 | 署名APIでプレースホルダーURLも返却、Lambda失敗はDLQ + リトライ、アップロード完了イベントでUIへ通知。 |
| マッチングスコアがブラックボックス化 | 利用者の不信感 | APIレスポンスでスコアの分解値 (スキル一致/エリア/活動鮮度) を返しUIで説明。 |
| PII混在による運用リスク | 漏えいリスク増 | PIIテーブルを分離しKMS暗号化、アクセスログとデータマスキングを導入。 |
| 多言語展開時の負債 | 翻訳コスト増 | Schema内テキストに`locales`フィールド、コピーは一元管理、早期にi18n-readyなAPIレスポンスを設計。 |

この構成を基準に、各モジュールのIssue/タスクを分解し開発を進めてください。
