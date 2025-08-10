# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a level editor for 2D platformer games written in vanilla JavaScript. The application runs entirely in the browser and allows users to create, edit, and export game levels with various block types including solid blocks, coins, enemies, moving platforms, player spawn points, and exit doors.

## Development Commands

This project is a client-side web application with no build process:

- **Run locally**: Open `index.html` in a web browser
- **No build/test/lint commands**: Pure HTML/CSS/JavaScript project with no dependencies

## Architecture

The codebase follows a modular JavaScript pattern with global objects managing different aspects of the editor:

### Core Modules

- **Config** (`js/config.js`): Central configuration object containing all constants, block types, colors, grid limits, and default values. All configuration is frozen to prevent modification.

- **Grid** (`js/grid.js`): Manages the level data structure as a 2D array. Handles grid operations like resizing, cell manipulation, clearing, and special object management (player start positions, borders, floors).

- **Drawing** (`js/drawing.js`): Canvas rendering engine that visualizes the grid, handles special block drawing, and renders platform movement ranges. Coordinates with PlatformManager for dynamic visualizations.

- **Tools** (`js/tools.js`): Manages user interaction including tool selection, mouse events on canvas, drawing operations, and grid modification actions.

- **PlatformManager** (`js/platform.js`): Specialized system for managing moving platforms. Finds connected platform blocks, calculates movement ranges based on collision detection, and provides platform data for export.

- **ImportExport** (`js/import-export.js`): Handles level serialization to/from JavaScript code format. Supports importing existing levels and exporting created levels as structured JavaScript objects.

- **UI** (`js/ui.js`): User interface management for panels, modals, and grid information display.

### Key Architectural Patterns

- **Module Pattern**: Each JavaScript file exposes a single global object with related functionality
- **Event-Driven**: Canvas mouse events drive the drawing/editing workflow
- **Separation of Concerns**: Clear boundaries between data (Grid), rendering (Drawing), interaction (Tools), and specialized features (PlatformManager)
- **Configuration-Driven**: All constants centralized in Config object for easy modification

### Block Type System

The editor uses a numeric block type system defined in `Config.BLOCK_TYPES`:
- 0: Empty space
- 1: Solid blocks
- 2: Coins  
- 3: Enemies
- 4: Moving platforms
- 5: Exit doors
- 6: Player start position

### Platform System

Moving platforms are handled specially:
- Horizontally connected platform blocks are grouped into single platform objects
- Movement range calculated based on collision detection with solid blocks
- Visual indicators show potential movement areas when enabled
- Export system treats platforms as separate objects from grid data

### Import/Export Format

Levels export as JavaScript objects containing:
- `name`: Level identifier
- `data`: 2D array of block types (with platforms/exits/player start removed)
- `platforms`: Array of platform objects with position and width
- `exitDoor`: Single exit door position object

## File Organization

- `index.html`: Main application entry point with UI structure
- `css/`: Stylesheets for layout, panels, and modals
- `js/main.js`: Application initialization and module coordination
- Individual JS modules handle specific responsibilities as described above