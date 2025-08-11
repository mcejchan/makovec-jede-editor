// Hlavní inicializační soubor
// Nastaví jednotlivé moduly a přidá obsluhu kláves pro posun viewportu.

document.addEventListener('DOMContentLoaded', function() {
    // Inicializace gridu
    Grid.init();
    // Inicializace kreslení
    const canvas = document.getElementById('levelCanvas');
    Drawing.init(canvas);
    // Inicializace nástrojů
    Tools.init();
    // Inicializace UI
    if (typeof UI !== 'undefined' && UI.init) {
        UI.init();
    }
    // Inicializace import/export
    if (typeof ImportExport !== 'undefined' && ImportExport.init) {
        ImportExport.init();
    }
    // První vykreslení
    Drawing.draw();
    // Ovládání klávesami pro posun viewportu
    document.addEventListener('keydown', function(e) {
        // Nechceme zasahovat do vstupu v textových polích
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') {
            return;
        }
        const halfWidth = Math.floor(Config.VISIBLE_COLS / 2);
        const halfHeight = Math.floor(Config.VISIBLE_ROWS / 2);
        switch (e.key) {
            case 'ArrowRight':
                Drawing.pan(halfWidth, 0);
                break;
            case 'ArrowLeft':
                Drawing.pan(-halfWidth, 0);
                break;
            case 'ArrowDown':
                Drawing.pan(0, halfHeight);
                break;
            case 'ArrowUp':
                Drawing.pan(0, -halfHeight);
                break;
        }
    });
});