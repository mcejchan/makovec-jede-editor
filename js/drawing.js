// Vykreslování na canvas
// Tento modul obstarává kreslení gridu a speciálních objektů na plátno.
// Byla přidána podpora viewportu – pouze část levelu se vykresluje na pevně
// velké plátno a uživatel může posouvat zobrazenou oblast pomocí funkce pan().

const Drawing = {
    canvas: null,
    ctx: null,

    // Aktuální offset (sloupec a řádek) levého horního rohu viewportu
    offsetX: 0,
    offsetY: 0,

    // Inicializace
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offsetX = 0;
        this.offsetY = 0;
        this.resizeCanvas();
    },

    // Změna velikosti canvasu dle velikosti viewportu
    resizeCanvas() {
        this.canvas.width = Config.VISIBLE_COLS * Config.CELL_SIZE;
        this.canvas.height = Config.VISIBLE_ROWS * Config.CELL_SIZE;
    },

    // Posun viewportu o daný počet buněk
    // dx a dy udávají posun ve sloupcích a řádcích; mohou být záporné
    pan(dx, dy) {
        // Výpočet nových offsetů
        const newOffsetX = this.offsetX + dx;
        const newOffsetY = this.offsetY + dy;
        // Ořezání do povoleného rozsahu
        this.offsetX = Math.max(0, Math.min(newOffsetX, Math.max(0, Grid.width - Config.VISIBLE_COLS)));
        this.offsetY = Math.max(0, Math.min(newOffsetY, Math.max(0, Grid.height - Config.VISIBLE_ROWS)));
        this.draw();
    },

    // Hlavní vykreslovací funkce
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Najdeme spojené platformy (pro zobrazení rozsahu pohybu)
        PlatformManager.findConnectedPlatforms();

        // Vykreslení gridu
        this.drawGrid();

        // Vykreslení pohybového rozsahu platforem (pokud je zaškrtnuto)
        const checkbox = document.getElementById('showPlatformMovement');
        if (checkbox && checkbox.checked) {
            this.drawPlatformMovement();
        }
    },

    // Vykreslení gridu ve viditelné oblasti
    drawGrid() {
        const cellSize = Config.CELL_SIZE;
        for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
            for (let x = 0; x < Config.VISIBLE_COLS; x++) {
                const gridX = x + this.offsetX;
                const gridY = y + this.offsetY;
                let value = Config.BLOCK_TYPES.EMPTY;
                if (gridX < Grid.width && gridY < Grid.height) {
                    const cellValue = Grid.getCell(gridX, gridY);
                    // Pokud je mimo rozsah, treat as empty
                    value = cellValue !== null ? cellValue : Config.BLOCK_TYPES.EMPTY;
                }
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                // Základní barva bloku
                this.ctx.fillStyle = Config.COLORS[value] || Config.COLORS[0];
                this.ctx.fillRect(cellX, cellY, cellSize, cellSize);
                // Speciální vykreslení pro různé typy
                this.drawSpecialBlock(value, cellX, cellY);
                // Grid lines
                this.ctx.strokeStyle = '#555';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(cellX, cellY, cellSize, cellSize);
            }
        }
    },

    // Vykreslení speciálních bloků (hráč, mince, nepřítel, exit)
    drawSpecialBlock(type, x, y) {
        const size = Config.CELL_SIZE;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        switch(type) {
            case Config.BLOCK_TYPES.COIN:
                // Mince - zlatý kruh
                this.ctx.strokeStyle = '#FFA500';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, size / 3, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            case Config.BLOCK_TYPES.ENEMY:
                // Nepřítel - tmavě červený čtverec
                this.ctx.fillStyle = '#8B0000';
                this.ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
                break;
            case Config.BLOCK_TYPES.PLAYER_START:
                // Start hráče - tmavě zelený čtverec
                this.ctx.fillStyle = '#006400';
                this.ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
                break;
            case Config.BLOCK_TYPES.EXIT:
                // Exit dveře - tmavě fialový čtverec
                this.ctx.fillStyle = '#8B008B';
                this.ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
                break;
        }
    },

    // Vykreslení pohybového rozsahu platforem
    drawPlatformMovement() {
        const cellSize = Config.CELL_SIZE;
        this.ctx.fillStyle = 'rgba(0, 206, 209, 0.2)';
        this.ctx.strokeStyle = 'rgba(0, 206, 209, 0.5)';
        this.ctx.lineWidth = 2;
        PlatformManager.platforms.forEach(platform => {
            const range = PlatformManager.getPlatformMovementRange(platform);
            // Převod do souřadnic canvasu podle offsetů
            const row = platform.y - this.offsetY;
            if (row < 0 || row >= Config.VISIBLE_ROWS) {
                return; // není ve viditelné oblasti vertikálně
            }
            const startCol = range.leftLimit - this.offsetX;
            const endCol = range.rightLimit + platform.width - 1 - this.offsetX;
            // Pokud se celý rozsah nachází mimo viditelný sloupec, nic nekreslíme
            if (endCol < 0 || startCol >= Config.VISIBLE_COLS) {
                return;
            }
            // Ořezání sloupců do viditelné oblasti
            const visibleStart = Math.max(startCol, 0);
            const visibleEnd = Math.min(endCol, Config.VISIBLE_COLS - 1);
            const totalCols = visibleEnd - visibleStart + 1;
            const x = visibleStart * cellSize;
            const y = row * cellSize;
            const totalWidth = totalCols * cellSize;
            this.ctx.fillRect(x, y, totalWidth, cellSize);
            this.ctx.strokeRect(x, y, totalWidth, cellSize);
            // Šipky ukazující směr pohybu
            this.drawMovementArrows(platform, range);
        });
    },

    // Vykreslení šipek pohybu
    drawMovementArrows(platform, range) {
        const size = Config.CELL_SIZE;
        const row = platform.y - this.offsetY;
        if (row < 0 || row >= Config.VISIBLE_ROWS) return;
        // Levá šipka
        if (range.leftLimit < platform.x) {
            const arrowCol = range.leftLimit - this.offsetX;
            if (arrowCol >= 0 && arrowCol < Config.VISIBLE_COLS) {
                const arrowX = arrowCol * size;
                const arrowY = row * size + size / 2;
                this.ctx.fillStyle = 'rgba(0, 206, 209, 0.8)';
                this.ctx.beginPath();
                this.ctx.moveTo(arrowX + 10, arrowY);
                this.ctx.lineTo(arrowX + 20, arrowY - 5);
                this.ctx.lineTo(arrowX + 20, arrowY + 5);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
        // Pravá šipka
        if (range.rightLimit > platform.x) {
            const arrowCol = range.rightLimit + platform.width - this.offsetX;
            if (arrowCol >= 0 && arrowCol < Config.VISIBLE_COLS) {
                const arrowX = arrowCol * size;
                const arrowY = row * size + size / 2;
                this.ctx.fillStyle = 'rgba(0, 206, 209, 0.8)';
                this.ctx.beginPath();
                this.ctx.moveTo(arrowX - 10, arrowY);
                this.ctx.lineTo(arrowX - 20, arrowY - 5);
                this.ctx.lineTo(arrowX - 20, arrowY + 5);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
    }
};