// Správa UI
const UI = {
    // Inicializace
    init() {
        this.setupModalHandlers();
        this.setupCheckboxHandlers();
        this.updateGridInfo();
    },

    // Nastavení modal handlerů
    setupModalHandlers() {
        // Zavírací tlačítka
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                this.closeModal(modalId);
            });
        });

        // Zavření při kliknutí mimo modal
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    },

    // Nastavení checkbox handlerů
    setupCheckboxHandlers() {
        document.getElementById('showPlatformMovement').addEventListener('change', () => {
            Drawing.draw();
        });
    },

    // Zobrazení modalu
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    },

    // Zavření modalu
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    // Aktualizace informace o gridu
    updateGridInfo() {
        document.getElementById('gridInfo').textContent = `Grid: ${Grid.width}×${Grid.height}`;
    }
};