# packages/ui

ChefNext向けの共通UIコンポーネントやデザインシステムをここに配置します。

## クロスプラットフォーム設計指針

### 現状とゴール

`packages/ui` は Web / モバイル共通で利用できる UI を提供することを目的にしています。Milestone 3 では React Native の API 形状を先取りしたプリミティブ (`View`, `Text`, `Pressable`, `ScrollView`, `Image`, `TextInput`) を `src/primitives.tsx` に実装し、`JobCard` などのコンポーネントをそれらのプリミティブ上で構築しました。現時点では DOM に直接レンダリングしていますが、API は React Native と互換性のある形にしており、`react-native-web` を導入すればそのまま差し替え可能です。

### 段階的移行戦略

- **Phase 1（完了）**: DOM 上で React Native 互換のプリミティブを提供。`JobCard` などの UI が Web / モバイル両対応の API で書かれている状態を作る。
- **Phase 2**: `react-native` + `react-native-web` を導入し、現在のプリミティブ実装を薄いラッパーに置き換える。`nativewind` などのスタイリングレイヤーの検証もこの段階で行う。
- **Phase 3**: Expo / React Native プロジェクトから同じ UI を直接インポートして利用。Web 固有の依存を順次削減し、最終的には同一コードでモバイルアプリを動かす。

#### 2. コンポーネント設計原則

**基本コンポーネント**
- `primitives.tsx` で提供する `View`, `Text`, `ScrollView`, `Pressable`, `Image`, `TextInput`
- `JobCard` などのフィーチャー寄り UI もこれらのプリミティブのみで構築
- 現段階は CSS in JS を直接指定していますが、`react-native` に差し替えやすいよう `StyleProp` の仕組みを用意

**スタイリング**
- 当面：Tailwind CSSを使用
- 検討中：`nativewind`（Tailwind for React Native）
- 代替案：`styled-components`や`emotion`でのクロスプラットフォーム対応

**依存関係の管理**
- Web専用ライブラリ（lucide-react、framer-motion等）の使用を最小限に
- 共通ロジックは`@features`パッケージに集約
- プラットフォーム固有のコードは条件分岐で対応

#### 3. React Native対応のベストプラクティス

**使用するプリミティブ**
```tsx
// Web (現在)
<div>, <button>, <input>, <img>

// React Native (移行後)
<View>, <TouchableOpacity>, <TextInput>, <Image>
```

**react-native-webの活用**
- Phase 2 で `react-native` を peerDependency に追加し、`primitives.tsx` 内で `react-native` から直接プリミティブを re-export する構成に変更予定
- Vite 側では `alias: { 'react-native': 'react-native-web' }` を追加し、Web でも同じコードを動かす
- Expo / Metro では `tsconfig.base.json` のパスエイリアスと同じ設定を適用する

**条件分岐の例**
```tsx
import { Platform } from 'react-native';

const Component = () => {
  if (Platform.OS === 'web') {
    // Web専用の処理
  } else {
    // モバイル専用の処理
  }
};
```

#### 4. パッケージ構成

```
packages/
├── ui/                    # 基本UIコンポーネント（Button, Card, Badge等）
├── features/             # 機能横断コンポーネント（Job, Profile等）
│   └── job/              # 求人関連のフィーチャー
│       ├── JobCard.tsx
│       ├── JobSearchPage.tsx
│       ├── ApplicationFlow.tsx
│       └── types.ts
└── api-client/           # API通信ロジック
```

### コンポーネント一覧

#### 基本コンポーネント（`packages/ui`）

- **View / Text / ScrollView / Pressable / Image / TextInput**: React Native と同じ API を提供するプリミティブ。現在は DOM へのフォールバック実装、将来的には `react-native` からの re-export に置き換え。
- **JobCard**: 求人カード UI。`@chefnext/features` の JobListScreen や JobDetailScreen から利用。

#### フィーチャーコンポーネント（`packages/features/job`）

- **JobCard**: 求人カード表示
- **JobSearchPage**: 求人検索画面
- **JobDetailPage**: 求人詳細画面
- **ApplicationFlow**: 応募フロー
- **JobHighlightGrid**: 求人ハイライト一覧

### 今後の開発計画

1. **Milestone 3**: 求人・応募UIの共通化
   - ✅ `packages/features/job`への移行
   - ✅ パスエイリアスの整備
   - 🔄 Web UIの安定化

2. **Milestone 5**: React Native基盤構築
   - `apps/mobile`の作成
   - Metro/Babelでのパスエイリアス設定
   - `packages/ui`のReact Native化

3. **Post-MVP**: 完全なクロスプラットフォーム統一
   - すべてのUIコンポーネントをReact Nativeプリミティブに移行
   - `react-native-web`での統一実装
   - パフォーマンス最適化

### 参考資料

- [React Native Web](https://necolas.github.io/react-native-web/)
- [NativeWind](https://www.nativewind.dev/)
- [Expo Documentation](https://docs.expo.dev/)

### 更新履歴

- 2025-12-04: 初版作成、基本コンポーネント追加（Text, Heading, Input）
- 2025-12-04: クロスプラットフォーム設計指針を追記
