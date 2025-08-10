// Import a export levelů
const ImportExport = {
    // Inicializace
    init() {
        document.getElementById('importLevelBtn').addEventListener('click', () => this.showImportModal());
        document.getElementById('exportLevelBtn').addEventListener('click', () => this.showExportModal());
        document.getElementById('processImportBtn').addEventListener('click', () => this.processImport());
        document.getElementById('copyToClipboardBtn').addEventListener('click', () => this.copyToClipboard());
    },

    // Zobrazení import modalu
    showImportModal() {
        UI.showModal('importModal');
    },

    // Zobrazení export modalu
    showExportModal() {
        const code = this.generateExportCode();
        document.getElementById('exportCode').value = code;
        UI.showModal('exportModal');
    },

    // Zpracování importu
    processImport() {
        const code = document.getElementById('importCode').value;
        try {
            // Extrahujeme data z kódu
            const nameMatch = code.match(/name:\s*["']([^"']+)["']/);
            const dataMatch = code.match(/data:\s*\[([\s\S]*?)\]/);
            const exitDoorMatch = code.match(/exitDoor:\s*{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*}/);
            const platformsMatch = code.match(/platforms:\s*\[([\s\S]*?)\]/);

            if (nameMatch) {
                document.getElementById('levelName').value = nameMatch[1];
            }

            if (dataMatch) {
                this.importGridData(dataMatch[1]);
            }

            // Importujeme speciální objekty
            this.importSpecialObjects(code, exitDoorMatch, platformsMatch);

            UI.closeModal('importModal');
            Drawing.draw();
            UI.updateGridInfo();

        } catch (e) {
            alert('Chyba při importu levelu: ' + e.message);
        }
    },

    // Import dat gridu
    importGridData(dataStr) {
        const rows = dataStr.match(/\[(.*?)\]/g);

        if (rows) {
            const newGrid = [];
            rows.forEach(row => {
                const values = row.match(/\d+/g);
                if (values) {
                    newGrid.push(values.map(v => parseInt(v)));
                }
            });

            if (newGrid.length > 0 && newGrid[0].length > 0) {
                Grid.height = newGrid.length;
                Grid.width = newGrid[0].length;
                Grid.init();

                // Naplníme grid daty
                for (let y = 0; y < Grid.height; y++) {
                    for (let x = 0; x < Grid.width; x++) {
                        if (y < newGrid.length && x < newGrid[y].length) {
                            Grid.data[y][x] = newGrid[y][x];
                        }
                    }
                }

                // Aktualizujeme UI
                document.getElementById('gridWidth').value = Grid.width;
                document.getElementById('gridHeight').value = Grid.height;
                Drawing.resizeCanvas();
            }
        }
    },

    // Import speciálních objektů
    importSpecialObjects(code, exitDoorMatch, platformsMatch) {
        // Hledáme pozici hráče
        let foundPlayer = false;
        for (let y = 0; y < Grid.height; y++) {
            for (let x = 0; x < Grid.width; x++) {
                if (Grid.data[y][x] === Config.BLOCK_TYPES.PLAYER_START) {
                    Grid.playerStartX = x;
                    Grid.playerStartY = y;
                    foundPlayer = true;
                }
            }
        }

        // Pokud hráč není v datech, použijeme výchozí pozici
        if (!foundPlayer) {
            Grid.playerStartX = Config.DEFAULT_PLAYER_X;
            Grid.playerStartY = Config.DEFAULT_PLAYER_Y;
            if (Grid.playerStartY < Grid.height && Grid.playerStartX < Grid.width) {
                Grid.setCell(Grid.playerStartX, Grid.playerStartY, Config.BLOCK_TYPES.PLAYER_START);
            }
        }

        // Exit dveře
        if (exitDoorMatch) {
            const doorX = parseInt(exitDoorMatch[1]);
            const doorY = parseInt(exitDoorMatch[2]);
            Grid.setCell(doorX, doorY, Config.BLOCK_TYPES.EXIT);
        }

        // Platformy
        if (platformsMatch) {
            const platformsStr = platformsMatch[1];
            const platformMatches = platformsStr.match(/{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+)\s*}/g);
            if (platformMatches) {
                platformMatches.forEach(match => {
                    const coords = match.match(/x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+)/);
                    if (coords) {
                        const x = parseInt(coords[1]);
                        const y = parseInt(coords[2]);
                        const width = parseInt(coords[3]);
                        // Přidáme platformy do gridu
                        for (let i = 0; i < width; i++) {
                            Grid.setCell(x + i, y, Config.BLOCK_TYPES.PLATFORM);
                        }
                    }
                });
            }
        }
    },

    // Generování export kódu
    generateExportCode() {
        const levelName = document.getElementById('levelName').value || 'level';
        const levelVarName = levelName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        // Najdeme speciální objekty
        const exitDoors = Grid.findAllOfType(Config.BLOCK_TYPES.EXIT);
        const platforms = PlatformManager.getExportData();

        let code = `// ${levelName}\n`;
        code += `const ${levelVarName} = {\n`;
        code += `    name: "${levelName}",\n`;
        code += `    data: [\n`;

        // Export dat gridu
        const exportData = Grid.exportData();
        for (let y = 0; y < Grid.height; y++) {
            code += '        [';
            for (let x = 0; x < Grid.width; x++) {
                code += exportData[y][x];
                if (x < Grid.width - 1) code += ',';
            }
            code += ']';
            if (y < Grid.height - 1) code += ',';
            code += '\n';
        }

        code += '    ],\n';

        // Export platforem
        code += '    platforms: [';
        if (platforms.length > 0) {
            code += '\n';
            platforms.forEach((platform, index) => {
                code += `        { x: ${platform.x}, y: ${platform.y}, width: ${platform.width} }`;
                if (index < platforms.length - 1) code += ',';
                code += '\n';
            });
            code += '    ],\n';
        } else {
            code += '],\n';
        }

        // Export exit dveří
        if (exitDoors.length > 0) {
            code += `    exitDoor: { x: ${exitDoors[0].x}, y: ${exitDoors[0].y} }\n`;
        } else {
            code += '    exitDoor: { x: 19, y: 4 } // Výchozí pozice - upravte podle potřeby\n';
        }

        code += '};';

        return code;
    },

    // Kopírování do schránky
    copyToClipboard() {
        const textarea = document.getElementById('exportCode');
        textarea.select();
        document.execCommand('copy');
        alert('Kód byl zkopírován do schránky!');
    }
};