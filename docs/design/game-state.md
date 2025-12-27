# ゲーム状態管理設計書

**作成日**: 2025-12-27
**対象**: Phase 2-6
**設計パターン**: State Management Pattern

## 1. 概要

テトリスゲームの全体的な状態を管理するデータ構造と、状態遷移の仕様を定義します。イミュータブル（不変）な状態更新パターンを採用し、バグの少ない実装を目指します。

## 2. グローバル状態構造

### 2.1 gameState オブジェクト

```javascript
const gameState = {
  // ゲーム進行状態
  isPlaying: false,      // ゲーム中かどうか
  isPaused: false,       // 一時停止中か
  isGameOver: false,     // ゲームオーバーか

  // スコア関連（Phase 3で実装）
  score: 0,              // 現在のスコア
  lines: 0,              // 消去したライン数
  level: 1,              // 現在のレベル

  // ハイスコア（Phase 3で実装）
  highScore: 0,          // ハイスコア

  // ゲームボード
  board: [],             // 10×20の2次元配列

  // 現在のテトリミノ
  currentTetromino: null,

  // 次のテトリミノ（Phase 3で実装）
  nextTetromino: null,

  // ホールド機能（Phase 4で実装）
  heldTetromino: null,
  canHold: true,

  // ゲームループ関連
  dropCounter: 0,        // 自動落下タイマー
  dropInterval: 1000,    // 落下間隔（ミリ秒）
  lastTime: 0            // 前回のフレーム時刻
};
```

## 3. ボード状態管理

### 3.1 ボード配列構造

```javascript
// 10列 × 20行の2次元配列
const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 行0（上部）
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 行1
  // ...
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 行19（下部）
];

// セルの値:
// 0 = 空
// 1-7 = テトリミノの色ID
```

### 3.2 色IDマッピング

```javascript
const COLOR_MAP = {
  0: null,        // 空
  1: '#00F0F0',   // I - シアン
  2: '#F0F000',   // O - 黄色
  3: '#A000F0',   // T - 紫
  4: '#00F000',   // S - 緑
  5: '#F00000',   // Z - 赤
  6: '#0000F0',   // J - 青
  7: '#F0A000'    // L - オレンジ
};

const TYPE_TO_COLOR_ID = {
  'I': 1,
  'O': 2,
  'T': 3,
  'S': 4,
  'Z': 5,
  'J': 6,
  'L': 7
};
```

### 3.3 ボード初期化

```javascript
function createEmptyBoard() {
  const board = [];
  for (let row = 0; row < 20; row++) {
    board[row] = new Array(10).fill(0);
  }
  return board;
}
```

## 4. テトリミノ状態

### 4.1 currentTetromino 構造

```javascript
const currentTetromino = {
  type: 'I',              // テトリミノタイプ ('I', 'O', 'T', 'S', 'Z', 'J', 'L')
  rotation: 0,            // 回転状態 (0-3)
  x: 3,                   // ボード上のX座標（左上基準）
  y: 0,                   // ボード上のY座標（左上基準）
  shape: [[]],            // 現在の形状配列（4×4）
  color: '#00F0F0',       // 色
  colorId: 1              // 色ID（ボードに固定時に使用）
};
```

### 4.2 座標系の説明

```
ボード座標系:
  0 1 2 3 4 5 6 7 8 9  ← X座標
0 □ □ □ □ □ □ □ □ □ □
1 □ □ □ □ □ □ □ □ □ □
2 □ □ □ [I][I][I][I]□ □  ← Y=2, X=3に配置されたI型
3 □ □ □ □ □ □ □ □ □ □
...
↑
Y座標

テトリミノの座標(x, y)は、
4×4形状配列の左上隅がボード上のどこにあるかを示す
```

## 5. 状態遷移図

### 5.1 ゲームフロー

```
┌─────────────┐
│   初期状態   │
│ isPlaying:   │
│   false     │
└──────┬──────┘
       │ start()
       ↓
┌─────────────┐
│  ゲーム中    │
│ isPlaying:   │
│   true      │
└──┬───┬───┬──┘
   │   │   │
   │   │   │ gameOver()
   │   │   ↓
   │   │ ┌─────────────┐
   │   │ │ゲームオーバー │
   │   │ │ isGameOver:  │
   │   │ │   true      │
   │   │ └──────┬──────┘
   │   │        │ restart()
   │   │        └────────┐
   │   │                 │
   │   │ pause()         │
   │   ↓                 │
   │ ┌─────────────┐    │
   │ │  一時停止    │    │
   │ │ isPaused:    │    │
   │ │   true      │    │
   │ └──────┬──────┘    │
   │        │ resume()   │
   │        ↓            │
   └────────┴────────────┘
```

### 5.2 テトリミノライフサイクル

```
┌──────────────┐
│新テトリミノ生成│
└───────┬──────┘
        │
        ↓
┌──────────────┐
│  落下中       │ ←────┐
│ (移動・回転可)│      │
└───────┬──────┘      │
        │             │
        │ 自動落下    │
        │ ユーザー操作│
        ├─────────────┘
        │
        │ 下方向で衝突検出
        ↓
┌──────────────┐
│  固定直前     │
│ (わずかな猶予)│
└───────┬──────┘
        │
        │ 固定タイミング
        ↓
┌──────────────┐
│ボードに固定   │
└───────┬──────┘
        │
        ├─→ ライン消去判定（Phase 3）
        │
        ↓
   新テトリミノ生成へ
```

## 6. 状態更新関数

### 6.1 イミュータブル更新パターン

```javascript
// ❌ 悪い例（ミュータブル）
function updateScore(points) {
  gameState.score += points;  // 直接変更
}

// ✅ 良い例（イミュータブル）
function updateScore(points) {
  gameState = {
    ...gameState,
    score: gameState.score + points
  };
}
```

### 6.2 状態更新関数一覧

```javascript
// ゲーム開始
function startGame() {
  gameState = {
    ...gameState,
    isPlaying: true,
    isPaused: false,
    isGameOver: false,
    score: 0,
    lines: 0,
    level: 1,
    board: createEmptyBoard(),
    currentTetromino: spawnTetromino()
  };
}

// ゲーム一時停止
function pauseGame() {
  if (!gameState.isPlaying || gameState.isGameOver) return;
  gameState = {
    ...gameState,
    isPaused: true
  };
}

// ゲーム再開
function resumeGame() {
  if (!gameState.isPaused) return;
  gameState = {
    ...gameState,
    isPaused: false
  };
}

// ゲームオーバー
function gameOver() {
  gameState = {
    ...gameState,
    isPlaying: false,
    isGameOver: true
  };
  // ハイスコア更新（Phase 3）
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    saveHighScore(gameState.highScore);
  }
}

// リスタート
function restartGame() {
  startGame();
}
```

## 7. ボード操作関数

### 7.1 テトリミノ固定

```javascript
function lockTetromino() {
  const { currentTetromino, board } = gameState;
  const { shape, x, y, colorId } = currentTetromino;

  // テトリミノをボードに書き込む
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
          board[boardY][boardX] = colorId;
        }
      }
    }
  }

  gameState = {
    ...gameState,
    board: [...board]  // 新しい配列を作成
  };
}
```

### 7.2 ボードのクリア（ライン消去 - Phase 3）

```javascript
function clearLines() {
  let linesCleared = 0;
  const newBoard = [];

  for (let row = 19; row >= 0; row--) {
    if (gameState.board[row].every(cell => cell !== 0)) {
      // ライン完成
      linesCleared++;
    } else {
      newBoard.unshift(gameState.board[row]);
    }
  }

  // 消去した分だけ新しい空行を追加
  while (newBoard.length < 20) {
    newBoard.unshift(new Array(10).fill(0));
  }

  gameState = {
    ...gameState,
    board: newBoard,
    lines: gameState.lines + linesCleared
  };

  return linesCleared;
}
```

## 8. レベル・スピード管理（Phase 3）

### 8.1 レベル計算

```javascript
function calculateLevel() {
  // 10ライン消去ごとにレベルアップ
  return Math.floor(gameState.lines / 10) + 1;
}

function updateLevel() {
  const newLevel = calculateLevel();
  if (newLevel !== gameState.level) {
    gameState = {
      ...gameState,
      level: newLevel,
      dropInterval: calculateDropInterval(newLevel)
    };
  }
}
```

### 8.2 落下速度計算

```javascript
function calculateDropInterval(level) {
  // レベルが上がるほど速く落下
  const baseInterval = 1000;  // 1秒
  const minInterval = 100;    // 最速0.1秒
  const speedIncrease = 50;   // レベルごとに50ms短縮

  const interval = baseInterval - (level - 1) * speedIncrease;
  return Math.max(interval, minInterval);
}
```

## 9. LocalStorage連携（Phase 3-4）

### 9.1 保存データ構造

```javascript
const savedData = {
  highScore: 0,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    colorPalette: 'default'
  },
  statistics: {
    gamesPlayed: 0,
    totalLines: 0,
    totalScore: 0
  }
};
```

### 9.2 保存・読み込み関数

```javascript
function saveToLocalStorage() {
  const data = {
    highScore: gameState.highScore,
    settings: gameState.settings,
    statistics: gameState.statistics
  };
  localStorage.setItem('tetrisGameData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('tetrisGameData');
  if (saved) {
    const data = JSON.parse(saved);
    gameState = {
      ...gameState,
      highScore: data.highScore || 0,
      settings: data.settings || {},
      statistics: data.statistics || {}
    };
  }
}
```

## 10. 状態バリデーション

### 10.1 状態チェック関数

```javascript
function validateGameState() {
  const errors = [];

  // ボードサイズチェック
  if (gameState.board.length !== 20) {
    errors.push('Invalid board height');
  }
  if (gameState.board.some(row => row.length !== 10)) {
    errors.push('Invalid board width');
  }

  // テトリミノチェック
  if (gameState.currentTetromino) {
    const { x, y } = gameState.currentTetromino;
    if (x < -3 || x > 10 || y < -3 || y > 20) {
      errors.push('Tetromino out of bounds');
    }
  }

  // スコア・レベルチェック
  if (gameState.score < 0 || gameState.lines < 0 || gameState.level < 1) {
    errors.push('Invalid score/lines/level');
  }

  return errors;
}
```

## 11. デバッグ用関数

### 11.1 状態ダンプ

```javascript
function dumpGameState() {
  console.log('=== Game State Dump ===');
  console.log('Playing:', gameState.isPlaying);
  console.log('Paused:', gameState.isPaused);
  console.log('Game Over:', gameState.isGameOver);
  console.log('Score:', gameState.score);
  console.log('Lines:', gameState.lines);
  console.log('Level:', gameState.level);
  console.log('Current Tetromino:', gameState.currentTetromino);
  console.log('Board:');
  console.table(gameState.board);
}
```

### 11.2 状態リセット

```javascript
function resetGameState() {
  gameState = {
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    lines: 0,
    level: 1,
    highScore: gameState.highScore,  // ハイスコアは保持
    board: createEmptyBoard(),
    currentTetromino: null,
    nextTetromino: null,
    heldTetromino: null,
    canHold: true,
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0
  };
}
```

## 12. テスト項目

- [ ] ゲーム状態が正しく初期化される
- [ ] 状態遷移が正しく動作する
- [ ] ボード配列が正しいサイズで初期化される
- [ ] テトリミノ固定がボードに正しく反映される
- [ ] LocalStorageの保存・読み込みが動作する
- [ ] バリデーションが正しくエラーを検出する

## 13. パフォーマンス考慮事項

### 13.1 最適化ポイント

- ボード配列のコピーは必要最小限に
- 描画は変更があった場合のみ
- イベントリスナーの適切な管理

### 13.2 メモリ管理

```javascript
// ゲーム終了時のクリーンアップ
function cleanup() {
  // イベントリスナーの削除
  document.removeEventListener('keydown', handleKeyPress);

  // タイマーの停止
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // 状態のリセット
  resetGameState();
}
```

## 14. 参考資料

- [State Management Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- [Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)

---

**更新履歴**:
- 2025-12-27: 初版作成
