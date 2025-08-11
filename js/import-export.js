// Import a export levelů
// Tento modul zpracovává načítání a ukládání levelů ve formě JavaScriptového kódu.
// Po importu levelu se resetuje viewport na levý horní roh.

const ImportExport = {
    // Inicializace
    init() {
        const importBtn = document.getElementById('importLevelBtn');
        const exportBtn = document.getElementById('exportLevelBtn');
        const processBtn = document.getElementById('processImportBtn');
        const copyBtn = document.getElementById('copyToClipboardBtn');
        if (importBtn) importBtn.addEventListener('click', () => this.showImportModal());
        if (exportBtn) exportBtn.addEventListener('click', () => this.showExportModal());
        if (processBtn) processBtn.addEventListener('click', () => this.processImport());
        if (copyBtn) copyBtn.addEventListener('click', () => this.copyToClipboard());
    },

    // Zobrazení import modalu
    showImportModal() {
        UI.showModal('importModal');
    },

    // Zobrazení export modalu
    showExportModal() {
        const code = this.generateExportCode();
        const exportTextarea = document.getElementById('exportCode');
        if (exportTextarea) exportTextarea.value = code;
        UI.showModal('exportModal');
    },

    // Zpracování importu
    processImport() {
        const codeArea = document.getElementById('importCode');
        const code = codeArea ? codeArea.value : '';
        try {
            // Extrahujeme data z kódu
            const nameMatch = code.match(/name:\s*["']([^"']+)["']/);
            const dataMatch = code.match(/data:\s*\[([\s\S]*?)\]/);
            const exitDoorMatch = code.match(/exitDoor:\s*{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*}/);
            const platformsMatch = code.match(/platforms:\s*\[([\s\S]*?)\]/);
            if (nameMatch) {
                const nameInput = document.getElementById('levelName');
                if (nameInput) nameInput.value = nameMatch[1];
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
                // Aktualizujeme vstupní pole v UI
                const widthInput = document.getElementById('gridWidth');
                const heightInput = document.getElementById('gridHeight');
                if (widthInput) widthInput.value = Grid.width;
                if (heightInput) heightInput.value = Grid.height;
                // Resetujeme viewport na začátek a přenastavíme canvas
                Drawing.offsetX = 0;
                Drawing.offsetY = 0;
                Drawing.resizeCanvas();
            }
        }
    },

    // Import speciálních objektů (hráč, exit dveře, platformy)
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
            const platformMatches = platformsStr.match(/\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+)\s*}/g);
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
        const levelNameInput = document.getElementById('levelName');
        const levelName = levelNameInput && levelNameInput.value ? levelNameInput.value : 'level';
        const levelVarName = levelName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        // Najdeme speciální objekty
        const exitDoors = Grid.findAllOfType(Config.BLOCK_TYPES.EXIT);
        const platforms = PlatformManager.getExportData();
        let code = `// ${levelName}\n`;
        code += `const ${levelVarName} = {\n`;
        code += `    name: \"${levelName}\",\n`;
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
        // Export exit dveří (pouze jeden je povolen)
        if (exitDoors.length > 0) {
            const door = exitDoors[0];
            code += `    exitDoor: { x: ${door.x}, y: ${door.y} },\n`;
        }
        // Export platforem
        if (platforms.length > 0) {
            code += '    platforms: [\n';
            platforms.forEach((p, idx) => {
                code += `        { x: ${p.x}, y: ${p.y}, width: ${p.width} }`;
                if (idx < platforms.length - 1) code += ',';
                code += '\n';
            });
            code += '    ]\n';
        }
        code += '};\n';
        return code;
    },

    // Zkopíruje exportovaný kód do schránky
    copyToClipboard() {
        const exportTextarea = document.getElementById('exportCode');
        if (exportTextarea) {
            exportTextarea.select();
            document.execCommand('copy');
            alert('Kód byl zkopírován do schránky');
        }
    }
};