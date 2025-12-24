# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based Tetris game implementation designed to run entirely in the browser using vanilla JavaScript/TypeScript with HTML5 Canvas API. The project is a pure client-side application with no backend dependencies.

## Project Specifications

The complete project requirements are documented in `docs/tetris-sow.md`. Key specifications:

- **Grid**: 10 columns × 20 rows standard Tetris board
- **Tetrominos**: 7 standard pieces (I, O, T, S, Z, J, L) with proper SRS (Super Rotation System) rotation and wall kicks
- **Scoring**: Single (100), Double (300), Triple (500), Tetris (800) with level multipliers
- **Level System**: Level up every 10 lines cleared, increasing fall speed
- **Performance Target**: 60 FPS using `requestAnimationFrame`
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)
- **Responsive**: Desktop (1920×1080+), Tablet (768×1024), Mobile (375×667+)

## Technical Architecture

### Technology Stack
- HTML5 for structure
- CSS3 for styling and animations
- JavaScript ES6+ or TypeScript for game logic
- Canvas API for rendering the game board
- LocalStorage for high scores and settings persistence

### Key Architectural Patterns

**Game Loop**: Implement using `requestAnimationFrame` with fixed timestep logic updates separated from rendering. This ensures consistent game speed across different frame rates.

**State Management**: Use immutable state update patterns. Game state should include:
- Current tetromino position and shape
- Board state (fixed blocks)
- Score, level, lines cleared
- Game status (playing, paused, game over)
- Next piece preview

**Code Organization**: Maintain separation of concerns:
- Game logic (collision detection, rotation, line clearing)
- Rendering (Canvas drawing operations)
- Input handling (keyboard/touch events)
- State management

### Controls Implementation

**Keyboard**:
- Arrow keys: left/right movement, down for soft drop
- Up arrow / X / Space: rotation
- Space: hard drop
- P: pause
- R: restart

**Touch** (mobile):
- Swipe gestures for movement
- Tap for rotation
- Screen buttons for actions

## Development Phases

Follow the phased approach outlined in the SOW:

1. **Phase 1**: Basic HTML/CSS structure, Canvas setup, grid rendering
2. **Phase 2**: Tetromino generation, movement, rotation, collision detection
3. **Phase 3**: Line clearing, scoring, level progression, game over
4. **Phase 4**: UI polish, animations, responsive design, touch controls
5. **Phase 5**: Performance optimization, cross-browser testing
6. **Phase 6**: Build and deployment setup

## Important Implementation Details

### Rotation System
Implement proper wall kicks according to SRS guidelines. When a rotation would result in collision, attempt alternative positions before rejecting the rotation.

### Collision Detection
Check collisions for:
- Wall boundaries (left, right, bottom)
- Fixed blocks on the board
- Before movement, rotation, or automatic falling

### Line Clearing
After locking a piece, scan all rows for completed lines. Handle multiple simultaneous line clears with appropriate scoring and animations.

### Performance Considerations
- Minimize Canvas redraw operations
- Use dirty rectangle rendering if needed
- Avoid memory leaks in game loop
- Test performance during extended play sessions

## Constraints and Requirements

- **No external dependencies**: Minimize or eliminate third-party libraries
- **Offline capable**: Must work without internet connection
- **LocalStorage limits**: Work within 5-10MB browser storage constraints
- **Accessibility**: Keyboard-only operation, ARIA attributes, color-blind friendly palettes
- **Security**: Implement XSS protection, safe LocalStorage usage

## Testing Focus Areas

- All 7 tetrominos behave correctly with accurate shapes and rotation
- Scoring calculations are exact according to specification
- Line clearing works for 1-4 simultaneous lines
- Frame rate maintains 60 FPS during gameplay
- Works across target browsers and devices
- Long gameplay sessions remain stable without memory leaks
