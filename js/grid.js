// Správa gridu
// Tento modul udržuje dvourozměrné pole buněk, velikost gridu a pozici hráče.
// Větší levely jsou podporovány díky zvětšeným limitům v Config.

const Grid = {
    // Vlastnosti gridu
    width: Config.DEFAULT_GRID_WIDTH,
    height: Config.DEFAULT_GRID_HEIGHT,
    data: [],

    // Pozice hráče
    playerStartX: Config.DEFAULT_PLAYER_X,
    playerStartY: Config.DEFAULT_PLAYER_Y,

    // Inicializace gridu
    init() {
        this.data = [];
        for (let y = 0; y < this.height; y++) {
            this.data[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.data[y][x] = Config.BLOCK_TYPES.EMPTY;
            }
        }
    },

    // Změna velikosti gridu
    resize(newWidth, newHeight) {
        if (newWidth >= Config.MIN_GRID_WIDTH &&
            newWidth <= Config.MAX_GRID_WIDTH &&
            newHeight >= Config.MIN_GRID_HEIGHT &&
            newHeight <= Config.MAX_GRID_HEIGHT) {

            this.width = newWidth;
            this.height = newHeight;
            this.init();
            return true;
        }
        return false;
    },

    // Nastavení buňky
    setCell(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            // Pokud umisťujeme start hráče, odstraníme předchozí
            if (value === Config.BLOCK_TYPES.PLAYER_START) {
                this.clearPlayerStart();
                this.playerStartX = x;
                this.playerStartY = y;
            }

            this.data[y][x] = value;
            return true;
        }
        return false;
    },

    // Získání hodnoty buňky
    getCell(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.data[y][x];
        }
        return null;
    },

    // Vymazání pozice hráče
    clearPlayerStart() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.data[y][x] === Config.BLOCK_TYPES.PLAYER_START) {
                    this.data[y][x] = Config.BLOCK_TYPES.EMPTY;
                }
            }
        }
    },

    // Vyčištění celého levelu
    clear() {
        this.init();
    },

    // Vyplnění podlahy
    fillFloor() {
        for (let x = 0; x < this.width; x++) {
            this.data[this.height - 1][x] = Config.BLOCK_TYPES.SOLID;
        }
    },

    // Vytvoření okrajů
    createBorders() {
        // Levý a pravý okraj
        for (let y = 0; y < this.height; y++) {
            this.data[y][0] = Config.BLOCK_TYPES.SOLID;
            this.data[y][this.width - 1] = Config.BLOCK_TYPES.SOLID;
        }
        // Horní a dolní okraj
        for (let x = 0; x < this.width; x++) {
            this.data[0][x] = Config.BLOCK_TYPES.SOLID;
            this.data[this.height - 1][x] = Config.BLOCK_TYPES.SOLID;
        }
    },

    // Najde všechny objekty daného typu
    findAllOfType(type) {
        const objects = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.data[y][x] === type) {
                    objects.push({ x, y });
                }
            }
        }
        return objects;
    },

    // Export gridu (vytvoří kopii bez speciálních objektů)
    exportData() {
        const exportGrid = [];
        for (let y = 0; y < this.height; y++) {
            exportGrid[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Speciální objekty se v datech ukládají jako prázdno
                if (this.data[y][x] === Config.BLOCK_TYPES.PLAYER_START ||
                    this.data[y][x] === Config.BLOCK_TYPES.EXIT ||
                    this.data[y][x] === Config.BLOCK_TYPES.PLATFORM) {
                    exportGrid[y][x] = Config.BLOCK_TYPES.EMPTY;
                } else {
                    exportGrid[y][x] = this.data[y][x];
                }
            }
        }
        return exportGrid;
    }
};