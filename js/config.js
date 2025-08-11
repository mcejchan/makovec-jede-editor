// Globální konfigurace
// Zde definujeme výchozí a maximální velikosti mřížky, velikost buněk a další konstanty.
// Do původního editoru byla přidána podpora pro větší levely a viewport,
// proto jsou zde i konstanty určující velikost viditelné oblasti.

const Config = {
    // Výchozí velikost gridu
    DEFAULT_GRID_WIDTH: 20,
    DEFAULT_GRID_HEIGHT: 8,

    // Limity velikosti – zvětšeno pro podporu rozsáhlejších levelů
    MIN_GRID_WIDTH: 10,
    MAX_GRID_WIDTH: 100,
    MIN_GRID_HEIGHT: 8,
    MAX_GRID_HEIGHT: 50,

    // Velikost buňky v pixelech
    CELL_SIZE: 40,

    // Výchozí pozice hráče
    DEFAULT_PLAYER_X: 2,
    DEFAULT_PLAYER_Y: 3,

    // Rozsah pohybu platforem
    PLATFORM_MOVE_RANGE: 3,

    // Počet sloupců a řádků viditelných ve viewportu
    // Tyto hodnoty určují šířku a výšku canvasu, bez ohledu na skutečnou velikost gridu.
    VISIBLE_COLS: 20,
    VISIBLE_ROWS: 8,

    // Typy bloků
    BLOCK_TYPES: {
        EMPTY: 0,
        SOLID: 1,
        COIN: 2,
        ENEMY: 3,
        PLATFORM: 4,
        EXIT: 5,
        PLAYER_START: 6
    },

    // Barvy pro různé typy bloků
    COLORS: {
        0: '#87CEEB', // Prázdno - světle modrá (nebe)
        1: '#8B4513', // Pevný blok - hnědá
        2: '#FFD700', // Mince - zlatá
        3: '#FF0000', // Nepřítel - červená
        4: '#00CED1', // Pohyblivá platforma - tmavě tyrkysová
        5: '#FF00FF', // Exit dveře - fialová
        6: '#00FF00'  // Start hráče - zelená
    }
};

// Zmrazení konfigurace
Object.freeze(Config);
Object.freeze(Config.BLOCK_TYPES);
Object.freeze(Config.COLORS);