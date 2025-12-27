# Tetris Game

ブラウザで動作する本格的なテトリスゲームです。HTML5 Canvas APIを使用し、純粋なJavaScript/TypeScriptで実装されています。

## 概要

このプロジェクトは、クラシックなテトリスゲームをモダンなWeb技術で再現することを目的としています。バックエンドサーバーを必要とせず、ブラウザだけで完結するクライアントサイドアプリケーションです。

## 主な機能

- **7種類のテトリミノ**: 標準的な I, O, T, S, Z, J, L ブロック
- **SRS回転システム**: Super Rotation System準拠の回転と壁蹴り機能
- **スコアリング**: ライン消去数に応じたスコア計算（1-4行同時消去対応）
- **レベルシステム**: 10ライン消去ごとにレベルアップ、落下速度が増加
- **Nextプレビュー**: 次のブロックの表示
- **ハイスコア保存**: LocalStorageを使用した記録保持
- **レスポンシブデザイン**: デスクトップ、タブレット、スマートフォン対応
- **マルチ入力対応**: キーボードとタッチ操作の両方をサポート

## 技術スタック

- **HTML5**: アプリケーション構造
- **CSS3**: スタイリングとアニメーション
- **JavaScript (ES6+) / TypeScript**: ゲームロジック
- **Canvas API**: ゲームボードのレンダリング
- **LocalStorage**: データ永続化

## ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Microsoft Edge (最新版)

## ゲームの操作方法

### キーボード操作
- **←/→**: ブロックを左右に移動
- **↓**: ソフトドロップ（速く落とす）
- **↑ / X / スペース**: ブロックを回転
- **スペース**: ハードドロップ（瞬時に落とす）
- **P**: 一時停止
- **R**: ゲームを再スタート

### タッチ操作（モバイル）
- **左右スワイプ**: ブロックを移動
- **タップ**: ブロックを回転
- **下スワイプ**: ソフトドロップ
- **画面ボタン**: 各種操作

## スコアリング

- **シングル** (1行): 100点
- **ダブル** (2行): 300点
- **トリプル** (3行): 500点
- **テトリス** (4行): 800点

スコアはレベルに応じて倍率がかかります。

## GCP/Firebase プロジェクト情報

- **プロジェクト名**: Tetris Game
- **プロジェクトID**: `tetris-game-2025`
- **プロジェクト番号**: `647781994270`
- **ホスティング**: Firebase Hosting
- **Firebase Console**: https://console.firebase.google.com/project/tetris-game-2025

## プロジェクト構成

```
.
├── CLAUDE.md           # Claude Code向けプロジェクトガイド
├── README.md           # このファイル
├── firebase.json       # Firebase Hosting設定
├── .firebaserc         # Firebaseプロジェクト設定
├── docs/               # ドキュメント
│   ├── README.md       # ドキュメント索引
│   ├── tetris-sow.md   # プロジェクト仕様書（Statement of Work）
│   ├── design/         # 設計ドキュメント
│   │   ├── tetromino-data.md   # テトリミノデータ構造設計
│   │   └── game-state.md       # ゲーム状態管理設計
│   └── phase2/         # Phase 2 ドキュメント
│       ├── technical-spec.md          # 技術仕様書
│       ├── api-specification.md       # API/関数仕様書
│       └── implementation-checklist.md # 実装チェックリスト
├── public/             # 公開ディレクトリ（Firebase Hostingデプロイ対象）
│   ├── index.html      # メインHTMLファイル
│   ├── 404.html        # 404エラーページ
│   ├── css/
│   │   └── style.css   # スタイルシート
│   └── js/
│       └── game.js     # ゲームロジック
├── src/                # ソースコード（開発用）
├── css/                # CSS開発用ディレクトリ
└── js/                 # JavaScript開発用ディレクトリ
```

## 開発予定

このプロジェクトは以下のフェーズで開発を進めます：

1. **Phase 1**: 基盤構築 - HTML/CSS構造、Canvas setup
2. **Phase 2**: コア機能実装 - テトリミノ生成、移動、回転、衝突判定
3. **Phase 3**: ゲームロジック - ライン消去、スコアリング、レベル管理
4. **Phase 4**: UI/UX改善 - アニメーション、レスポンシブ対応
5. **Phase 5**: 最適化とテスト - パフォーマンス最適化、クロスブラウザテスト
6. **Phase 6**: デプロイ - ビルド設定、ホスティング

詳細な仕様は `docs/tetris-sow.md` を参照してください。

## セットアップ

### ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/1766nakamurahayato/tetris-game.git

# ディレクトリに移動
cd tetris-game

# public/index.html をブラウザで直接開く
# または、ローカルサーバーを起動（Python 3の場合）
python3 -m http.server 8000 --directory public

# ブラウザで http://localhost:8000 にアクセス
```

### Firebase Hostingへのデプロイ

```bash
# Firebase CLIがインストールされていない場合
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを確認
firebase projects:list

# デプロイ
firebase deploy --only hosting

# デプロイ後のURL: https://tetris-game-2025.web.app
```

### Firebase ローカルエミュレータ

```bash
# Firebase Hostingをローカルでテスト
firebase serve

# ブラウザで http://localhost:5000 にアクセス
```

## パフォーマンス目標

- **60 FPS**: 滑らかなアニメーション
- **入力遅延**: 50ms以内
- **ページ読み込み**: 3秒以内

## ライセンス

MIT License

## 作成者

[@1766nakamurahayato](https://github.com/1766nakamurahayato)

---

**開発状況**: Phase 2完了（コア機能実装）
**最終更新**: 2025-12-27

## 現在の開発進捗

- ✅ **Phase 1**: 基盤構築（完了）
  - HTML/CSS構造
  - Canvas setup
  - Firebase Hosting設定
  - GCPプロジェクト作成

- ✅ **Phase 2**: コア機能実装（完了）
  - ✅ 技術仕様書作成
  - ✅ テトリミノデータ設計（7種類 × 4回転）
  - ✅ ゲーム状態管理設計
  - ✅ API/関数仕様書作成（30+関数）
  - ✅ 実装チェックリスト作成
  - ✅ テトリミノ生成・描画・固定
  - ✅ 移動・回転機能（←→↓↑ Space）
  - ✅ 衝突判定（壁・床・ブロック）
  - ✅ 自動落下システム（1秒間隔）
  - ✅ ゲームループ（60 FPS）
  - ✅ 一時停止・再開・リスタート
  - ✅ ゲームオーバー判定

- ⏳ **Phase 3**: ゲームロジック（未着手）
- ⏳ **Phase 4**: UI/UX改善（未着手）
- ⏳ **Phase 5**: 最適化とテスト（未着手）
- ⏳ **Phase 6**: デプロイ（未着手）

## ドキュメント駆動開発

このプロジェクトは**ドキュメント駆動開発（Document-Driven Development）**のアプローチを採用しています。

### Phase 2 で作成したドキュメント

1. **[technical-spec.md](docs/phase2/technical-spec.md)** - 技術仕様書
   - 実装範囲、アーキテクチャ、データフロー、テスト要件

2. **[tetromino-data.md](docs/design/tetromino-data.md)** - テトリミノデータ構造設計
   - 7種類のテトリミノ定義、回転状態、色定義

3. **[game-state.md](docs/design/game-state.md)** - ゲーム状態管理設計
   - ゲーム状態構造、状態遷移、ボード管理

4. **[api-specification.md](docs/phase2/api-specification.md)** - API/関数仕様書
   - 全関数の詳細仕様、入力・出力・副作用

5. **[implementation-checklist.md](docs/phase2/implementation-checklist.md)** - 実装チェックリスト
   - ステップバイステップの実装手順、テスト項目

詳細は **[docs/README.md](docs/README.md)** を参照してください。
