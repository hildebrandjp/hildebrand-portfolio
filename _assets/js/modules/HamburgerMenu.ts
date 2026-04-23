export default class HamburgerMenu {
    init() {
        this.enableOpen();
        this.enableClose();
    }

    private enableOpen() {
        $(document).on('click', '.hamburger-wrapper .hamburger', () => {
            const overlay = document.getElementById('modalOverlay3');
            if (!overlay) return;
            overlay.classList.remove('hidden');
        });
    }

    private enableClose() {
        $(document).on('click', '#modalOverlay3 .hamburger-close-icon, #modalOverlay3 .hamburger-menu-list a', () => {
            this.close();
        });

        const overlay = document.getElementById('modalOverlay3');
        if (overlay) {
            overlay.addEventListener('click', (event: Event) => {
                if (event.target !== overlay) return;
                this.close();
            });
        }

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            this.close();
        });
    }

    private close() {
        const overlay = document.getElementById('modalOverlay3');
        if (!overlay) return;
        overlay.classList.add('hidden');
    }
}
