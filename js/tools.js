// Správa nástrojů a kreslení
const Tools = {
    currentTool: Config.BLOCK_TYPES.SOLID,
    isDrawing: false,

    // Inicializace
    init() {
        this.setupToolButtons();
        this.setupCanvasEvents();
        this.setupActionButtons();
    },

    // Nastavení tlačítek nástrojů
    setupToolButtons() {
        document.querySelectorAll('.tool-button[data-tool]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-button[data-tool]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = parseInt(e.target.dataset.tool);
            });
        });
    },

    // Nastavení událostí canvasu
    setupCanvasEvents() {
        const canvas = document.getElementById('levelCanvas');

        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseleave', () => this.stopDrawing());
        canvas.addEventListener('contextmenu', e => e.preventDefault());
    },

    // Nastavení akčních tlačítek
    setupActionButtons() {
        document.getElementById('clearLevelBtn').addEventListener('click', () => this.clearLevel());
        document.getElementById('fillFloorBtn').addEventListener('click', () => this.fillFloor());
        document.getElementById('createBordersBtn').addEventListener('click', () => this.createBorders());
        document.getElementById('resizeGridBtn').addEventListener('click', () => this.resizeGrid());
    },

    // Začátek kreslení
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.setCell(pos.x, pos.y);
    },

    // Pohyb myši
    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        document.getElementById('mousePos').textContent = `Pozice: [${pos.x}, ${pos.y}]`;

        if (this.isDrawing) {
            this.setCell(pos.x, pos.y);
        }
    },

    // Konec kreslení
    stopDrawing() {
        this.isDrawing = false;
    },

    // Získání pozice myši
    getMousePos(e) {
        const canvas = document.getElementById('levelCanvas');
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((e.clientX - rect.left) / Config.CELL_SIZE),
            y: Math.floor((e.clientY - rect.top) / Config.CELL_SIZE)
        };
    },

    // Nastavení buňky
    setCell(x, y) {
        if (Grid.setCell(x, y, this.currentTool)) {
            Drawing.draw();
        }
    },

    // Akce
    clearLevel() {
        if (confirm('Opravdu chcete vymazat celý level?')) {
            Grid.clear();
            Drawing.draw();
        }
    },

    fillFloor() {
        Grid.fillFloor();
        Drawing.draw();
    },

    createBorders() {
        Grid.createBorders();
        Drawing.draw();
    },

    resizeGrid() {
        const newWidth = parseInt(document.getElementById('gridWidth').value);
        const newHeight = parseInt(document.getElementById('gridHeight').value);

        if (Grid.resize(newWidth, newHeight)) {
            Drawing.resizeCanvas();
            Drawing.draw();
            UI.updateGridInfo();
        } else {
            alert('Neplatné rozměry gridu!');
        }
    }
};