// Správa pohyblivých platforem
// Modul pro hledání spojených platforem a výpočet rozsahu jejich pohybu.

const PlatformManager = {
    platforms: [],

    // Najde všechny spojené platformy
    findConnectedPlatforms() {
        this.platforms = [];
        const visited = Array(Grid.height).fill(null).map(() => Array(Grid.width).fill(false));
        for (let y = 0; y < Grid.height; y++) {
            for (let x = 0; x < Grid.width; x++) {
                if (Grid.getCell(x, y) === Config.BLOCK_TYPES.PLATFORM && !visited[y][x]) {
                    // Najdeme všechny horizontálně spojené platformy
                    let startX = x;
                    let endX = x;
                    // Hledáme doprava
                    while (endX + 1 < Grid.width && Grid.getCell(endX + 1, y) === Config.BLOCK_TYPES.PLATFORM) {
                        endX++;
                    }
                    // Označíme všechny navštívené
                    for (let i = startX; i <= endX; i++) {
                        visited[y][i] = true;
                    }
                    // Vytvoříme platformu
                    this.platforms.push({
                        x: startX,
                        y: y,
                        width: endX - startX + 1,
                        moveRange: Config.PLATFORM_MOVE_RANGE
                    });
                }
            }
        }
        return this.platforms;
    },

    // Zkontroluje, jestli se platforma může pohnout na danou pozici
    canPlatformMove(platform, newX) {
        // Kontrola hranic
        if (newX < 0 || newX + platform.width > Grid.width) {
            return false;
        }
        // Kontrola kolizí s pevnými bloky
        for (let i = 0; i < platform.width; i++) {
            const checkX = newX + i;
            // Kontrolujeme bloky nad a pod platformou
            if (platform.y > 0 && Grid.getCell(checkX, platform.y - 1) === Config.BLOCK_TYPES.SOLID) {
                return false;
            }
            if (platform.y < Grid.height - 1 && Grid.getCell(checkX, platform.y + 1) === Config.BLOCK_TYPES.SOLID) {
                return false;
            }
            // Kontrolujeme bloky vlevo a vpravo (pouze na krajích platformy)
            if (i === 0 && checkX > 0 && Grid.getCell(checkX - 1, platform.y) === Config.BLOCK_TYPES.SOLID) {
                return false;
            }
            if (i === platform.width - 1 && checkX < Grid.width - 1 && Grid.getCell(checkX + 1, platform.y) === Config.BLOCK_TYPES.SOLID) {
                return false;
            }
        }
        return true;
    },

    // Vypočítá skutečný rozsah pohybu platformy
    getPlatformMovementRange(platform) {
        let leftLimit = platform.x;
        let rightLimit = platform.x;
        // Hledáme levou hranici
        for (let i = 1; i <= platform.moveRange; i++) {
            if (this.canPlatformMove(platform, platform.x - i)) {
                leftLimit = platform.x - i;
            } else {
                break;
            }
        }
        // Hledáme pravou hranici
        for (let i = 1; i <= platform.moveRange; i++) {
            if (this.canPlatformMove(platform, platform.x + i)) {
                rightLimit = platform.x + i;
            } else {
                break;
            }
        }
        return { leftLimit, rightLimit };
    },

    // Získá všechny platformy pro export
    getExportData() {
        this.findConnectedPlatforms();
        return this.platforms.map(p => ({ x: p.x, y: p.y, width: p.width }));
    }
};