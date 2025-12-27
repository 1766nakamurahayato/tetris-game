// ============================================================================
// Tetris Game - Phase 2: Core Features Implementation
// ============================================================================
// Author: Claude Code
// Date: 2025-12-27
// Docs: docs/phase2/
// ============================================================================

'use strict';

// ============================================================================
// 1. CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
    COLS: 10,
    ROWS: 20,
    BLOCK_SIZE: 30,
};

// Color mapping: 0=empty, 1-7=tetromino colors
const COLOR_MAP = {
    0: null,
    1: '#00F0F0',  // I - Cyan
    2: '#F0F000',  // O - Yellow
    3: '#A000F0',  // T - Purple
    4: '#00F000',  // S - Green
    5: '#F00000',  // Z - Red
    6: '#0000F0',  // J - Blue
    7: '#F0A000',  // L - Orange
};

const TYPE_TO_COLOR_ID = {
    'I': 1,
    'O': 2,
    'T': 3,
    'S': 4,
    'Z': 5,
    'J': 6,
    'L': 7,
};

// ============================================================================
// 2. TETROMINO DATA DEFINITIONS
// ============================================================================

const TETROMINOS = {
    'I': {
        shape: [
            // Rotation 0 (horizontal)
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1 (vertical)
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            // Rotation 2 (horizontal)
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            // Rotation 3 (vertical)
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        color: '#00F0F0'
    },
    'O': {
        shape: [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: '#F0F000'
    },
    'T': {
        shape: [
            // Rotation 0
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // Rotation 1
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            // Rotation 2
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            // Rotation 3
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        color: '#A000F0'
    },
    'S': {
        shape: [
            [
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0]
            ]
        ],
        color: '#00F000'
    },
    'Z': {
        shape: [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 1]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ]
        ],
        color: '#F00000'
    },
    'J': {
        shape: [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 1]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        color: '#0000F0'
    },
    'L': {
        shape: [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 1],
                [0, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0]
            ]
        ],
        color: '#F0A000'
    }
};

// ============================================================================
// 3. GAME STATE
// ============================================================================

let gameState = {
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    lines: 0,
    level: 1,
    board: [],
    currentTetromino: null,
    dropCounter: 0,
    dropInterval: 1000,  // 1 second
    lastTime: 0
};

// ============================================================================
// 4. CANVAS ELEMENTS
// ============================================================================

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

// ============================================================================
// 5. BOARD MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create an empty 10x20 board
 * @returns {number[][]} Empty board array
 */
function createEmptyBoard() {
    const board = [];
    for (let row = 0; row < CONFIG.ROWS; row++) {
        board[row] = new Array(CONFIG.COLS).fill(0);
    }
    return board;
}

/**
 * Draw a single cell on the canvas
 * @param {number} x - X coordinate (0-9)
 * @param {number} y - Y coordinate (0-19)
 * @param {number} colorId - Color ID (0=empty, 1-7=tetromino)
 */
function drawCell(x, y, colorId) {
    if (colorId === 0) {
        // Empty cell - black background with grid lines
        ctx.fillStyle = '#000';
        ctx.fillRect(
            x * CONFIG.BLOCK_SIZE,
            y * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
        );
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
            x * CONFIG.BLOCK_SIZE,
            y * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
        );
    } else {
        // Block - filled with color
        ctx.fillStyle = COLOR_MAP[colorId];
        ctx.fillRect(
            x * CONFIG.BLOCK_SIZE,
            y * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
        );
        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            x * CONFIG.BLOCK_SIZE,
            y * CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE,
            CONFIG.BLOCK_SIZE
        );
    }
}

/**
 * Draw the entire game board
 */
function drawBoard() {
    for (let row = 0; row < CONFIG.ROWS; row++) {
        for (let col = 0; col < CONFIG.COLS; col++) {
            drawCell(col, row, gameState.board[row][col]);
        }
    }
}

// ============================================================================
// 6. TETROMINO FUNCTIONS
// ============================================================================

/**
 * Get a random tetromino type
 * @returns {string} Tetromino type ('I', 'O', 'T', 'S', 'Z', 'J', 'L')
 */
function getRandomTetrominoType() {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
}

/**
 * Spawn a new tetromino
 * @param {string} [type] - Tetromino type (random if not specified)
 * @returns {object} New tetromino object
 */
function spawnTetromino(type) {
    const tetrominoType = type || getRandomTetrominoType();
    const tetrominoData = TETROMINOS[tetrominoType];

    return {
        type: tetrominoType,
        rotation: 0,
        x: 3,  // Center of board
        y: 0,  // Top
        shape: tetrominoData.shape[0],
        color: tetrominoData.color,
        colorId: TYPE_TO_COLOR_ID[tetrominoType]
    };
}

/**
 * Draw a tetromino on the canvas
 * @param {object} tetromino - Tetromino to draw
 */
function drawTetromino(tetromino) {
    const { shape, x, y, color } = tetromino;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (shape[row][col]) {
                const boardX = x + col;
                const boardY = y + row;

                // Only draw if within visible area
                if (boardY >= 0) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        boardX * CONFIG.BLOCK_SIZE,
                        boardY * CONFIG.BLOCK_SIZE,
                        CONFIG.BLOCK_SIZE,
                        CONFIG.BLOCK_SIZE
                    );
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
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

/**
 * Lock the current tetromino to the board
 */
function lockTetromino() {
    const { currentTetromino, board } = gameState;
    const { shape, x, y, colorId } = currentTetromino;

    // Write tetromino to board
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

    // Spawn new tetromino
    gameState.currentTetromino = spawnTetromino();

    // Check for game over
    if (checkCollision(gameState.currentTetromino, 0, 0)) {
        gameOver();
    }
}

// ============================================================================
// 7. COLLISION DETECTION
// ============================================================================

/**
 * Check collision with walls, floor, and blocks
 * @param {object} tetromino - Tetromino to check
 * @param {number} offsetX - X offset
 * @param {number} offsetY - Y offset
 * @returns {boolean} True if collision detected
 */
function checkCollision(tetromino, offsetX, offsetY) {
    const { shape, x, y } = tetromino;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (shape[row][col]) {
                const newX = x + col + offsetX;
                const newY = y + row + offsetY;

                // Wall check
                if (newX < 0 || newX >= CONFIG.COLS) {
                    return true;
                }

                // Floor check
                if (newY >= CONFIG.ROWS) {
                    return true;
                }

                // Block check
                if (newY >= 0 && gameState.board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }

    return false;  // No collision
}

// ============================================================================
// 8. MOVEMENT & ROTATION FUNCTIONS
// ============================================================================

/**
 * Move tetromino left
 * @returns {boolean} True if moved successfully
 */
function moveLeft() {
    if (checkCollision(gameState.currentTetromino, -1, 0)) {
        return false;
    }
    gameState.currentTetromino.x--;
    return true;
}

/**
 * Move tetromino right
 * @returns {boolean} True if moved successfully
 */
function moveRight() {
    if (checkCollision(gameState.currentTetromino, 1, 0)) {
        return false;
    }
    gameState.currentTetromino.x++;
    return true;
}

/**
 * Move tetromino down
 * @returns {boolean} True if moved successfully
 */
function moveDown() {
    if (checkCollision(gameState.currentTetromino, 0, 1)) {
        lockTetromino();
        return false;
    }
    gameState.currentTetromino.y++;
    return true;
}

/**
 * Rotate tetromino clockwise
 * @returns {boolean} True if rotated successfully
 */
function rotate() {
    const { currentTetromino } = gameState;
    const newRotation = (currentTetromino.rotation + 1) % 4;
    const newShape = TETROMINOS[currentTetromino.type].shape[newRotation];

    // Temporary tetromino for collision check
    const tempTetromino = {
        ...currentTetromino,
        rotation: newRotation,
        shape: newShape
    };

    if (checkCollision(tempTetromino, 0, 0)) {
        return false;  // Cannot rotate
    }

    // Apply rotation
    currentTetromino.rotation = newRotation;
    currentTetromino.shape = newShape;
    return true;
}

/**
 * Hard drop - drop tetromino to bottom instantly
 */
function hardDrop() {
    while (!checkCollision(gameState.currentTetromino, 0, 1)) {
        gameState.currentTetromino.y++;
    }
    lockTetromino();
}

// ============================================================================
// 9. GAME LOOP
// ============================================================================

/**
 * Update game state (auto-drop)
 * @param {number} deltaTime - Time since last update (ms)
 */
function update(deltaTime) {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) {
        return;
    }

    gameState.dropCounter += deltaTime;

    if (gameState.dropCounter > gameState.dropInterval) {
        moveDown();
        gameState.dropCounter = 0;
    }
}

/**
 * Draw everything
 */
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    drawBoard();

    // Draw current tetromino
    if (gameState.currentTetromino && !gameState.isGameOver) {
        drawTetromino(gameState.currentTetromino);
    }

    // Draw game over message
    if (gameState.isGameOver) {
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 20);
    }

    // Draw pause message
    if (gameState.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

/**
 * Main game loop
 * @param {number} time - Timestamp from requestAnimationFrame
 */
function gameLoop(time = 0) {
    const deltaTime = time - gameState.lastTime;
    gameState.lastTime = time;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// ============================================================================
// 10. INPUT HANDLING
// ============================================================================

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyPress(event) {
    if (gameState.isGameOver) {
        if (event.key === 'r' || event.key === 'R') {
            restartGame();
        }
        return;
    }

    if (gameState.isPaused) {
        if (event.key === 'p' || event.key === 'P') {
            resumeGame();
        }
        return;
    }

    if (!gameState.isPlaying) {
        return;
    }

    switch (event.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            gameState.dropCounter = 0;  // Reset drop timer
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
    }
}

/**
 * Initialize input handlers
 */
function initInputHandlers() {
    document.addEventListener('keydown', handleKeyPress);
}

// ============================================================================
// 11. GAME STATE MANAGEMENT
// ============================================================================

/**
 * Start the game
 */
function startGame() {
    console.log('Starting game...');

    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.isGameOver = false;
    gameState.score = 0;
    gameState.lines = 0;
    gameState.level = 1;
    gameState.board = createEmptyBoard();
    gameState.currentTetromino = spawnTetromino();
    gameState.dropCounter = 0;
    gameState.dropInterval = 1000;
    gameState.lastTime = 0;

    updateUI();
    console.log('Game started!');
}

/**
 * Pause the game
 */
function pauseGame() {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    gameState.isPaused = true;
    console.log('Game paused');
}

/**
 * Resume the game
 */
function resumeGame() {
    if (!gameState.isPaused) return;
    gameState.isPaused = false;
    console.log('Game resumed');
}

/**
 * Game over
 */
function gameOver() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;
    console.log('Game Over! Final Score:', gameState.score);
}

/**
 * Restart the game
 */
function restartGame() {
    console.log('Restarting game...');
    startGame();
}

/**
 * Update UI display
 */
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('lines').textContent = gameState.lines;
}

// ============================================================================
// 12. INITIALIZATION
// ============================================================================

/**
 * Initialize the game
 */
function init() {
    console.log('='.repeat(60));
    console.log('Tetris Game - Phase 2: Core Features');
    console.log('Project ID: tetris-game-2025');
    console.log('Firebase Hosting Ready');
    console.log('='.repeat(60));

    // Initialize input
    initInputHandlers();

    // Start the game
    startGame();

    // Start game loop
    requestAnimationFrame(gameLoop);

    console.log('Phase 2 Implementation Complete!');
    console.log('Controls:');
    console.log('  ← → : Move left/right');
    console.log('  ↓   : Soft drop');
    console.log('  ↑/X : Rotate');
    console.log('  Space: Hard drop');
    console.log('  P   : Pause');
    console.log('  R   : Restart');
}

// ============================================================================
// 13. START THE GAME
// ============================================================================

window.addEventListener('DOMContentLoaded', init);
