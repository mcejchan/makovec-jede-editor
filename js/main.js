// Hlavní inicializační soubor
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace gridu
    Grid.init();

    // Inicializace kreslení
    const canvas = document.getElementById('levelCanvas');
    Drawing.init(canvas);

    // Inicializace nástrojů
    Tools.init();

    // Inicializace UI
    UI.init();

    // Inicializace import/export
    ImportExport.init();

    // První vykreslení
    Drawing.draw();
});