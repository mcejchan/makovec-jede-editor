// Správa UI
// Tento modul obsluhuje modální okna, checkboxy a aktualizuje info o gridu.

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
        const checkbox = document.getElementById('showPlatformMovement');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                Drawing.draw();
            });
        }
    },

    // Zobrazení modalu
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    },

    // Zavření modalu
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Aktualizace informace o gridu
    updateGridInfo() {
        const infoLabel = document.getElementById('gridInfo');
        if (infoLabel) {
            infoLabel.textContent = `Grid: ${Grid.width}×${Grid.height}`;
        }
    }
};