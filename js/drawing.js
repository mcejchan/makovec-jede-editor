// Vykreslování na canvas
const Drawing = {
    canvas: null,
    ctx: null,

    // Inicializace
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
    },

    // Změna velikosti canvasu
    resizeCanvas() {
        this.canvas.width = Grid.width * Config.CELL_SIZE;
        this.canvas.height = Grid.height * Config.CELL_SIZE;
    },

    // Hlavní vykreslovací funkce
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Najdeme spojené platformy
        PlatformManager.findConnectedPlatforms();

        // Vykreslení bloků
        this.drawGrid();

        // Vykreslení pohybového rozsahu platforem
        if (document.getElementById('showPlatformMovement').checked) {
            this.drawPlatformMovement();
        }
    },

    // Vykreslení gridu
    drawGrid() {
        for (let y = 0; y < Grid.height; y++) {
            for (let x = 0; x < Grid.width; x++) {
                const value = Grid.getCell(x, y);
                const cellX = x * Config.CELL_SIZE;
                const cellY = y * Config.CELL_SIZE;

                // Základní barva bloku
                this.ctx.fillStyle = Config.COLORS[value] || Config.COLORS[0];
                this.ctx.fillRect(cellX, cellY, Config.CELL_SIZE, Config.CELL_SIZE);

                // Speciální vykreslení pro různé typy
                this.drawSpecialBlock(value, cellX, cellY);

                // Grid lines
                this.ctx.strokeStyle = '#555';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(cellX, cellY, Config.CELL_SIZE, Config.CELL_SIZE);
            }
        }
    },

    // Vykreslení speciálních bloků
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
        this.ctx.fillStyle = 'rgba(0, 206, 209, 0.2)';
        this.ctx.strokeStyle = 'rgba(0, 206, 209, 0.5)';
        this.ctx.lineWidth = 2;

        PlatformManager.platforms.forEach(platform => {
            const range = PlatformManager.getPlatformMovementRange(platform);
            const size = Config.CELL_SIZE;

            // Vykreslíme rozsah pohybu
            const totalWidth = (range.rightLimit - range.leftLimit + platform.width) * size;
            const x = range.leftLimit * size;
            const y = platform.y * size;

            this.ctx.fillRect(x, y, totalWidth, size);
            this.ctx.strokeRect(x, y, totalWidth, size);

            // Šipky ukazující směr pohybu
            this.drawMovementArrows(platform, range);
        });
    },

    // Vykreslení šipek pohybu
    drawMovementArrows(platform, range) {
        this.ctx.fillStyle = 'rgba(0, 206, 209, 0.8)';
        const size = Config.CELL_SIZE;
        const arrowY = platform.y * size + size / 2;

        // Levá šipka
        if (range.leftLimit < platform.x) {
            const arrowX = range.leftLimit * size;
            this.ctx.beginPath();
            this.ctx.moveTo(arrowX + 10, arrowY);
            this.ctx.lineTo(arrowX + 20, arrowY - 5);
            this.ctx.lineTo(arrowX + 20, arrowY + 5);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Pravá šipka
        if (range.rightLimit > platform.x) {
            const arrowX = (range.rightLimit + platform.width) * size;
            this.ctx.beginPath();
            this.ctx.moveTo(arrowX - 10, arrowY);
            this.ctx.lineTo(arrowX - 20, arrowY - 5);
            this.ctx.lineTo(arrowX - 20, arrowY + 5);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
};