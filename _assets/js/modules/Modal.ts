import { ModalPage } from "@/interface/ModalPage";

export default class Modal {
    constructor() {}

    init() {
        this.enableClickButtonCls();
        this.enableDismissBehavior();
    }

    close() {
        const modalBlock = document.getElementById('modal-block');
        const modalOverlay = document.getElementById('modalOverlay1');
        if (modalBlock) modalBlock.classList.add('hidden');
        if (modalOverlay) modalOverlay.classList.add('hidden');
        const dataAttributes = this.getAllDataAttrbFromWrapper() as NodeListOf<HTMLElement>;
        
        dataAttributes.forEach((element) => {
            element.classList.remove('show');
            element.classList.add('hidden');
        });
    }

    open(name : ModalPage) {
        const modalBlock = document.getElementById('modal-block');
        const modalOverlay = document.getElementById('modalOverlay1');
        if (!modalBlock || !modalOverlay) return;

        const dataAttributes = this.getAllDataAttrbFromWrapper() as NodeListOf<HTMLElement>;
        
        dataAttributes.forEach((element) => {
            const pageName = element.dataset.modalPage;
            if (pageName !== name) return;

            modalOverlay.classList.remove('hidden');
            modalBlock.classList.remove('hidden');
            element.classList.remove('hidden');
            element.classList.add('show');
        });
    }

    protected enableClickButtonCls() {
        $(document).on('click', '.card-route-name-cls', (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            const pageName = target.dataset.routeModal;

            if (!pageName) return;
            this.open(pageName as ModalPage);
        });
    }

    protected enableDismissBehavior() {
        const modalOverlay = document.getElementById('modalOverlay1');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e: Event) => {
                if (e.target !== modalOverlay) return;
                this.close();
            });
        }

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;

            const modalBlock = document.getElementById('modal-block');
            if (!modalBlock || modalBlock.classList.contains('hidden')) return;
            this.close();
        });
    }

    protected getAllDataAttrbFromWrapper(id = "modalControllerWrapper") {
        const elementWrapper = document.getElementById(id);
        if (!elementWrapper) return [];
        return elementWrapper.querySelectorAll(".modal-ext-container");
    }
}
