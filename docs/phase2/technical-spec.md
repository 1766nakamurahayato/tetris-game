# Phase 2: コア機能実装 - 技術仕様書

**作成日**: 2025-12-27
**対象フェーズ**: Phase 2
**依存フェーズ**: Phase 1（完了）

## 1. 概要

Phase 2では、テトリスゲームのコア機能を実装します。このフェーズでは、テトリミノ（ブロック）の生成、表示、操作、衝突判定などの基本的なゲームメカニクスを構築します。

## 2. 実装範囲

### 2.1 含まれる機能

- ✅ テトリミノの7種類（I, O, T, S, Z, J, L）のデータ定義
- ✅ テトリミノのランダム生成システム
- ✅ テトリミノの画面描画
- ✅ キーボード入力による操作
  - 左右移動
  - 回転（時計回り）
  - ソフトドロップ
  - ハードドロップ
- ✅ 衝突判定システム
  - 壁との衝突
  - 床との衝突
  - 固定ブロックとの衝突
- ✅ テトリミノの固定処理
- ✅ ゲームボードの状態管理
- ✅ 自動落下システム

### 2.2 含まれない機能（Phase 3以降）

- ❌ ライン消去
- ❌ スコアリング
- ❌ レベルアップ
- ❌ ゲームオーバー判定
- ❌ 壁蹴り（Wall Kick）
- ❌ Nextプレビュー
- ❌ Hold機能

## 3. 技術要件

### 3.1 パフォーマンス要件

- **フレームレート**: 60 FPS（requestAnimationFrame使用）
- **入力遅延**: 50ms以内
- **落下間隔**: レベル1で1秒に1マス（1000ms）

### 3.2 データ構造要件

- テトリミノの形状は2次元配列で表現
- ゲームボードは10×20の2次元配列
- 各セルの状態は数値で管理（0=空、1-7=各テトリミノの色）

### 3.3 互換性要件

- ES6+の機能を使用可能
- モダンブラウザ（Chrome, Firefox, Safari, Edge）対応
- Canvas API 2D Context使用

## 4. アーキテクチャ設計

### 4.1 主要コンポーネント

```
Game System
├── Board Manager (ゲームボード管理)
│   ├── Board State (10×20配列)
│   ├── Draw Board (描画処理)
│   └── Check Collision (衝突判定)
│
├── Tetromino Manager (テトリミノ管理)
│   ├── Tetromino Definitions (形状定義)
│   ├── Current Tetromino (現在のピース)
│   ├── Generate Random (ランダム生成)
│   ├── Draw Tetromino (描画)
│   └── Lock Tetromino (固定処理)
│
├── Input Handler (入力処理)
│   ├── Keyboard Events (キーボード)
│   └── Action Mapping (アクション対応)
│
└── Game Loop (ゲームループ)
    ├── Update (更新処理)
    ├── Render (描画処理)
    └── Auto Drop (自動落下)
```

### 4.2 データフロー

```
1. ゲーム開始
   ↓
2. テトリミノ生成
   ↓
3. ゲームループ開始
   ↓
4. [入力受付] → [移動/回転処理] → [衝突判定]
   ↓                                    ↓
   OK                                  NG（元の位置に戻す）
   ↓
5. [自動落下タイマー] → [下に移動] → [衝突判定]
   ↓                                  ↓
   OK（継続）                        NG（床/ブロック）
   ↓                                  ↓
   3に戻る                          6. テトリミノ固定
                                     ↓
                                    7. 新しいテトリミノ生成
                                     ↓
                                    3に戻る
```

## 5. テトリミノ仕様

### 5.1 形状定義

各テトリミノは4×4の配列で定義します（SRS - Super Rotation System準拠）。

**I型（シアン）**:
```
回転状態0:
[0, 0, 0, 0]
[1, 1, 1, 1]
[0, 0, 0, 0]
[0, 0, 0, 0]
```

**O型（黄色）**:
```
回転状態0:
[0, 0, 0, 0]
[0, 1, 1, 0]
[0, 1, 1, 0]
[0, 0, 0, 0]
```

その他のテトリミノも同様に定義。詳細は `tetromino-data.md` を参照。

### 5.2 色定義

| テトリミノ | 色名 | HEXコード |
|----------|------|-----------|
| I | シアン | #00F0F0 |
| O | 黄色 | #F0F000 |
| T | 紫 | #A000F0 |
| S | 緑 | #00F000 |
| Z | 赤 | #F00000 |
| J | 青 | #0000F0 |
| L | オレンジ | #F0A000 |

### 5.3 初期位置

- X座標: ボード中央（列3または4）
- Y座標: ボード上部（行0）

## 6. 衝突判定仕様

### 6.1 判定対象

1. **壁判定**: X座標が0未満、または10以上
2. **床判定**: Y座標が20以上
3. **ブロック判定**: 移動先にすでに固定されたブロックが存在

### 6.2 判定タイミング

- 移動操作時（左、右、下）
- 回転操作時
- 自動落下時

### 6.3 判定処理フロー

```javascript
function checkCollision(tetromino, offsetX, offsetY) {
  for (各ブロック in テトリミノ) {
    newX = ブロックX + offsetX
    newY = ブロックY + offsetY

    if (newX < 0 || newX >= 10 || newY >= 20) {
      return true // 壁・床衝突
    }

    if (newY >= 0 && board[newY][newX] !== 0) {
      return true // ブロック衝突
    }
  }
  return false // 衝突なし
}
```

## 7. ゲームループ仕様

### 7.1 基本構造

```javascript
let lastTime = 0;
let dropCounter = 0;
const dropInterval = 1000; // 1秒

function gameLoop(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > dropInterval) {
    dropTetromino(); // 自動落下
    dropCounter = 0;
  }

  draw(); // 描画

  requestAnimationFrame(gameLoop);
}
```

### 7.2 FPS制御

- `requestAnimationFrame`による自動FPS調整
- `deltaTime`による時間ベースの更新

## 8. キーボード操作仕様

### 8.1 キーマッピング

| キー | アクション | 実装関数 |
|-----|----------|---------|
| ArrowLeft (←) | 左移動 | `moveLeft()` |
| ArrowRight (→) | 右移動 | `moveRight()` |
| ArrowDown (↓) | ソフトドロップ | `moveDown()` |
| ArrowUp (↑) | 回転 | `rotate()` |
| Space | ハードドロップ | `hardDrop()` |
| X | 回転（代替） | `rotate()` |

### 8.2 入力処理

```javascript
document.addEventListener('keydown', (event) => {
  if (gameState.isGameOver || gameState.isPaused) return;

  switch(event.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    // ...
  }
});
```

## 9. 実装順序

### 9.1 推奨実装順

1. **ステップ1**: テトリミノデータ定義
   - 7種類の形状配列
   - 色定義
   - 回転状態定義（各4状態）

2. **ステップ2**: ボード管理システム
   - 10×20配列の初期化
   - ボード描画関数
   - セル描画関数

3. **ステップ3**: テトリミノ生成・描画
   - ランダム生成関数
   - テトリミノ描画関数
   - 現在のテトリミノ状態管理

4. **ステップ4**: 衝突判定システム
   - 基本的な衝突判定関数
   - 壁・床判定
   - ブロック判定

5. **ステップ5**: 移動・回転処理
   - 左右移動関数
   - 下移動関数
   - 回転関数

6. **ステップ6**: 固定処理
   - テトリミノをボードに固定
   - 新しいテトリミノ生成

7. **ステップ7**: ゲームループ統合
   - 自動落下タイマー
   - requestAnimationFrame統合

8. **ステップ8**: 入力処理統合
   - キーボードイベント
   - ハードドロップ実装

## 10. テスト項目

### 10.1 機能テスト

- [ ] 全7種類のテトリミノが生成される
- [ ] テトリミノが正しく描画される
- [ ] 左右移動が正常に動作する
- [ ] 回転が正常に動作する
- [ ] 壁で止まる
- [ ] 床で止まる
- [ ] 他のブロックで止まる
- [ ] 自動落下が動作する
- [ ] ハードドロップが動作する
- [ ] 固定処理が正常に動作する

### 10.2 パフォーマンステスト

- [ ] 60 FPS維持
- [ ] 入力遅延50ms以内
- [ ] メモリリークなし

## 11. 既知の制約

### 11.1 Phase 2での制約

- 壁蹴り（Wall Kick）は実装しない → Phase 3以降
- ライン消去は実装しない → Phase 3
- ゲームオーバー判定は簡易版のみ → Phase 3で完成
- スコアは加算しない → Phase 3

### 11.2 技術的制約

- Canvas APIの制約に従う
- ブラウザのキーボードイベント制約
- JavaScriptの数値精度

## 12. 次フェーズへの引き継ぎ事項

Phase 3に引き継ぐデータ・機能：

- ✅ テトリミノデータ構造
- ✅ ボード状態配列
- ✅ 衝突判定システム
- ✅ 固定処理
- ✅ ゲームループ
- → Phase 3でライン消去、スコアリング、レベル管理を追加

## 13. 参考資料

- [Tetris Guideline](https://tetris.wiki/Tetris_Guideline)
- [SRS - Super Rotation System](https://tetris.wiki/Super_Rotation_System)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- プロジェクト仕様書: `docs/tetris-sow.md`

---

**承認**: 実装前に技術レビューを実施すること
**更新履歴**:
- 2025-12-27: 初版作成
