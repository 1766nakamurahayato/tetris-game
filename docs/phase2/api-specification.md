# Phase 2: API/関数仕様書

**作成日**: 2025-12-27
**対象フェーズ**: Phase 2
**ファイル**: `public/js/game.js`

## 1. 概要

Phase 2で実装する全関数の詳細仕様を定義します。各関数の入力、出力、副作用、エラー処理を明確にします。

## 2. 関数カテゴリ

```
├── ボード管理関数
│   ├── createEmptyBoard()
│   ├── drawBoard()
│   └── drawCell()
│
├── テトリミノ関数
│   ├── getRandomTetrominoType()
│   ├── spawnTetromino()
│   ├── drawTetromino()
│   └── lockTetromino()
│
├── 移動・回転関数
│   ├── moveLeft()
│   ├── moveRight()
│   ├── moveDown()
│   ├── rotate()
│   └── hardDrop()
│
├── 衝突判定関数
│   ├── checkCollision()
│   ├── isValidPosition()
│   └── canRotate()
│
├── ゲームループ関数
│   ├── gameLoop()
│   ├── update()
│   └── draw()
│
└── 入力処理関数
    ├── handleKeyPress()
    └── initInputHandlers()
```

## 3. ボード管理関数

### 3.1 createEmptyBoard()

**説明**: 空の10×20ボード配列を生成します。

**シグネチャ**:
```javascript
function createEmptyBoard(): number[][]
```

**パラメータ**: なし

**戻り値**:
- `number[][]`: 10列×20行の2次元配列（全要素が0）

**実装例**:
```javascript
function createEmptyBoard() {
  const board = [];
  for (let row = 0; row < CONFIG.ROWS; row++) {
    board[row] = new Array(CONFIG.COLS).fill(0);
  }
  return board;
}
```

**テストケース**:
```javascript
const board = createEmptyBoard();
console.assert(board.length === 20, 'Board height should be 20');
console.assert(board[0].length === 10, 'Board width should be 10');
console.assert(board.every(row => row.every(cell => cell === 0)), 'All cells should be 0');
```

---

### 3.2 drawBoard()

**説明**: ゲームボード全体をCanvasに描画します。

**シグネチャ**:
```javascript
function drawBoard(): void
```

**パラメータ**: なし

**戻り値**: なし（副作用のみ）

**副作用**:
- Canvasコンテキストに描画

**実装例**:
```javascript
function drawBoard() {
  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      drawCell(col, row, gameState.board[row][col]);
    }
  }
}
```

---

### 3.3 drawCell()

**説明**: 単一のセルを指定された色で描画します。

**シグネチャ**:
```javascript
function drawCell(x: number, y: number, colorId: number): void
```

**パラメータ**:
- `x`: X座標（0-9）
- `y`: Y座標（0-19）
- `colorId`: 色ID（0=空, 1-7=テトリミノ色）

**戻り値**: なし（副作用のみ）

**副作用**:
- Canvasコンテキストに矩形を描画

**実装例**:
```javascript
function drawCell(x, y, colorId) {
  if (colorId === 0) {
    // 空セル - 黒背景にグリッド線
    ctx.fillStyle = '#000';
    ctx.fillRect(
      x * CONFIG.BLOCK_SIZE,
      y * CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE
    );
    ctx.strokeStyle = '#333';
    ctx.strokeRect(
      x * CONFIG.BLOCK_SIZE,
      y * CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE
    );
  } else {
    // ブロック - 指定色で塗りつぶし
    ctx.fillStyle = COLOR_MAP[colorId];
    ctx.fillRect(
      x * CONFIG.BLOCK_SIZE,
      y * CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE
    );
    // 境界線
    ctx.strokeStyle = '#000';
    ctx.strokeRect(
      x * CONFIG.BLOCK_SIZE,
      y * CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE,
      CONFIG.BLOCK_SIZE
    );
  }
}
```

## 4. テトリミノ関数

### 4.1 getRandomTetrominoType()

**説明**: ランダムなテトリミノタイプを返します。

**シグネチャ**:
```javascript
function getRandomTetrominoType(): string
```

**パラメータ**: なし

**戻り値**:
- `string`: テトリミノタイプ（'I', 'O', 'T', 'S', 'Z', 'J', 'L'のいずれか）

**実装例**:
```javascript
function getRandomTetrominoType() {
  const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
}
```

**テストケース**:
```javascript
const type = getRandomTetrominoType();
console.assert(['I', 'O', 'T', 'S', 'Z', 'J', 'L'].includes(type), 'Should return valid type');
```

---

### 4.2 spawnTetromino()

**説明**: 新しいテトリミノを生成してゲームに追加します。

**シグネチャ**:
```javascript
function spawnTetromino(type?: string): Tetromino
```

**パラメータ**:
- `type` (オプション): テトリミノタイプ。省略時はランダム

**戻り値**:
- `Tetromino`: 新しいテトリミノオブジェクト

**実装例**:
```javascript
function spawnTetromino(type) {
  const tetrominoType = type || getRandomTetrominoType();
  const tetrominoData = TETROMINOS[tetrominoType];

  return {
    type: tetrominoType,
    rotation: 0,
    x: 3,  // ボード中央
    y: 0,  // 上部
    shape: tetrominoData.shape[0],
    color: tetrominoData.color,
    colorId: TYPE_TO_COLOR_ID[tetrominoType]
  };
}
```

**エラー処理**:
- 無効なタイプが指定された場合、ランダムタイプにフォールバック

---

### 4.3 drawTetromino()

**説明**: 現在のテトリミノをCanvasに描画します。

**シグネチャ**:
```javascript
function drawTetromino(tetromino: Tetromino): void
```

**パラメータ**:
- `tetromino`: 描画するテトリミノオブジェクト

**戻り値**: なし（副作用のみ）

**副作用**:
- Canvasコンテキストに描画

**実装例**:
```javascript
function drawTetromino(tetromino) {
  const { shape, x, y, color } = tetromino;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardX = x + col;
        const boardY = y + row;

        // 画面内のみ描画
        if (boardY >= 0) {
          ctx.fillStyle = color;
          ctx.fillRect(
            boardX * CONFIG.BLOCK_SIZE,
            boardY * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
          );
          ctx.strokeStyle = '#000';
          ctx.strokeRect(
            boardX * CONFIG.BLOCK_SIZE,
            boardY * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
          );
        }
      }
    }
  }
}
```

---

### 4.4 lockTetromino()

**説明**: 現在のテトリミノをボードに固定します。

**シグネチャ**:
```javascript
function lockTetromino(): void
```

**パラメータ**: なし

**戻り値**: なし（副作用のみ）

**副作用**:
- `gameState.board`を更新
- 新しいテトリミノを生成

**実装例**:
```javascript
function lockTetromino() {
  const { currentTetromino, board } = gameState;
  const { shape, x, y, colorId } = currentTetromino;

  // ボードに書き込む
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0 && boardY < CONFIG.ROWS &&
            boardX >= 0 && boardX < CONFIG.COLS) {
          board[boardY][boardX] = colorId;
        }
      }
    }
  }

  // 新しいテトリミノを生成
  gameState.currentTetromino = spawnTetromino();

  // ゲームオーバー判定
  if (checkCollision(gameState.currentTetromino, 0, 0)) {
    gameOver();
  }
}
```

## 5. 移動・回転関数

### 5.1 moveLeft()

**説明**: テトリミノを左に1マス移動します。

**シグネチャ**:
```javascript
function moveLeft(): boolean
```

**パラメータ**: なし

**戻り値**:
- `boolean`: 移動成功時true、失敗時false

**実装例**:
```javascript
function moveLeft() {
  if (checkCollision(gameState.currentTetromino, -1, 0)) {
    return false;  // 移動不可
  }
  gameState.currentTetromino.x--;
  return true;
}
```

---

### 5.2 moveRight()

**説明**: テトリミノを右に1マス移動します。

**シグネチャ**:
```javascript
function moveRight(): boolean
```

**パラメータ**: なし

**戻り値**:
- `boolean`: 移動成功時true、失敗時false

**実装例**:
```javascript
function moveRight() {
  if (checkCollision(gameState.currentTetromino, 1, 0)) {
    return false;
  }
  gameState.currentTetromino.x++;
  return true;
}
```

---

### 5.3 moveDown()

**説明**: テトリミノを下に1マス移動します。

**シグネチャ**:
```javascript
function moveDown(): boolean
```

**パラメータ**: なし

**戻り値**:
- `boolean`: 移動成功時true、失敗時false（固定が必要）

**副作用**:
- 移動不可の場合、`lockTetromino()`を呼び出す

**実装例**:
```javascript
function moveDown() {
  if (checkCollision(gameState.currentTetromino, 0, 1)) {
    lockTetromino();
    return false;
  }
  gameState.currentTetromino.y++;
  return true;
}
```

---

### 5.4 rotate()

**説明**: テトリミノを時計回りに90度回転します。

**シグネチャ**:
```javascript
function rotate(): boolean
```

**パラメータ**: なし

**戻り値**:
- `boolean`: 回転成功時true、失敗時false

**実装例**:
```javascript
function rotate() {
  const { currentTetromino } = gameState;
  const newRotation = (currentTetromino.rotation + 1) % 4;
  const newShape = TETROMINOS[currentTetromino.type].shape[newRotation];

  // 仮の状態で衝突判定
  const tempTetromino = {
    ...currentTetromino,
    rotation: newRotation,
    shape: newShape
  };

  if (checkCollision(tempTetromino, 0, 0)) {
    return false;  // 回転不可
  }

  // 回転実行
  currentTetromino.rotation = newRotation;
  currentTetromino.shape = newShape;
  return true;
}
```

---

### 5.5 hardDrop()

**説明**: テトリミノを一気に底まで落とします。

**シグネチャ**:
```javascript
function hardDrop(): void
```

**パラメータ**: なし

**戻り値**: なし（副作用のみ）

**副作用**:
- テトリミノを最下点まで移動
- `lockTetromino()`を呼び出す

**実装例**:
```javascript
function hardDrop() {
  while (!checkCollision(gameState.currentTetromino, 0, 1)) {
    gameState.currentTetromino.y++;
  }
  lockTetromino();
}
```

## 6. 衝突判定関数

### 6.1 checkCollision()

**説明**: テトリミノと壁・床・ブロックの衝突を判定します。

**シグネチャ**:
```javascript
function checkCollision(tetromino: Tetromino, offsetX: number, offsetY: number): boolean
```

**パラメータ**:
- `tetromino`: 判定対象のテトリミノ
- `offsetX`: X方向のオフセット
- `offsetY`: Y方向のオフセット

**戻り値**:
- `boolean`: 衝突する場合true、しない場合false

**実装例**:
```javascript
function checkCollision(tetromino, offsetX, offsetY) {
  const { shape, x, y } = tetromino;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const newX = x + col + offsetX;
        const newY = y + row + offsetY;

        // 壁判定
        if (newX < 0 || newX >= CONFIG.COLS) {
          return true;
        }

        // 床判定
        if (newY >= CONFIG.ROWS) {
          return true;
        }

        // ブロック判定
        if (newY >= 0 && gameState.board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }

  return false;  // 衝突なし
}
```

## 7. ゲームループ関数

### 7.1 gameLoop()

**説明**: メインゲームループ。requestAnimationFrameで呼び出されます。

**シグネチャ**:
```javascript
function gameLoop(time: number): void
```

**パラメータ**:
- `time`: タイムスタンプ（ミリ秒）

**戻り値**: なし

**実装例**:
```javascript
function gameLoop(time = 0) {
  if (gameState.isGameOver || gameState.isPaused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = time - gameState.lastTime;
  gameState.lastTime = time;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}
```

---

### 7.2 update()

**説明**: ゲーム状態を更新します（自動落下処理）。

**シグネチャ**:
```javascript
function update(deltaTime: number): void
```

**パラメータ**:
- `deltaTime`: 前回からの経過時間（ミリ秒）

**戻り値**: なし

**実装例**:
```javascript
function update(deltaTime) {
  gameState.dropCounter += deltaTime;

  if (gameState.dropCounter > gameState.dropInterval) {
    moveDown();
    gameState.dropCounter = 0;
  }
}
```

---

### 7.3 draw()

**説明**: ゲーム全体を描画します。

**シグネチャ**:
```javascript
function draw(): void
```

**パラメータ**: なし

**戻り値**: なし

**実装例**:
```javascript
function draw() {
  // キャンバスクリア
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ボード描画
  drawBoard();

  // 現在のテトリミノ描画
  if (gameState.currentTetromino) {
    drawTetromino(gameState.currentTetromino);
  }
}
```

## 8. 入力処理関数

### 8.1 handleKeyPress()

**説明**: キーボード入力を処理します。

**シグネチャ**:
```javascript
function handleKeyPress(event: KeyboardEvent): void
```

**パラメータ**:
- `event`: キーボードイベント

**戻り値**: なし

**実装例**:
```javascript
function handleKeyPress(event) {
  if (gameState.isGameOver || gameState.isPaused) return;

  switch (event.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      gameState.dropCounter = 0;  // タイマーリセット
      break;
    case 'ArrowUp':
    case 'x':
    case 'X':
      rotate();
      break;
    case ' ':  // Space
      event.preventDefault();
      hardDrop();
      break;
    case 'p':
    case 'P':
      pauseGame();
      break;
    case 'r':
    case 'R':
      restartGame();
      break;
  }
}
```

---

### 8.2 initInputHandlers()

**説明**: 入力ハンドラーを初期化します。

**シグネチャ**:
```javascript
function initInputHandlers(): void
```

**パラメータ**: なし

**戻り値**: なし

**実装例**:
```javascript
function initInputHandlers() {
  document.addEventListener('keydown', handleKeyPress);
}
```

## 9. ユーティリティ関数

### 9.1 updateUI()

**説明**: スコア・レベル・ライン表示を更新します。

**シグネチャ**:
```javascript
function updateUI(): void
```

**実装例**:
```javascript
function updateUI() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('level').textContent = gameState.level;
  document.getElementById('lines').textContent = gameState.lines;
}
```

## 10. エラー処理ガイドライン

### 10.1 エラー処理方針

- 致命的エラー: `console.error()`で記録し、ゲームオーバー
- 警告: `console.warn()`で記録し、処理続行
- デバッグ情報: `console.log()`（本番環境では無効化）

### 10.2 例外処理

```javascript
try {
  gameLoop();
} catch (error) {
  console.error('Game loop error:', error);
  gameOver();
}
```

## 11. テストカバレッジ

各関数に対して以下のテストを実施：

- [ ] 正常系テスト
- [ ] 境界値テスト
- [ ] エラーケーステスト
- [ ] パフォーマンステスト

---

**更新履歴**:
- 2025-12-27: 初版作成
