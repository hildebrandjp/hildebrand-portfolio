import { ModalPage } from "@/interface/ModalPage";

export default class Modal {
    constructor() {}

    init() {
        this.enableClickButtonCls();
    }

    close() {
        document.getElementById('modal-block')!.classList.add('hidden');
        document.getElementById('modalOverlay1')!.classList.add('hidden');
        const dataAttributes = this.getAllDataAttrbFromWrapper() as NodeListOf<HTMLElement>;
        
        dataAttributes.forEach((element) => {
            element.classList.remove('show');
            element.classList.add('hidden');
        });
    }

    open(name : ModalPage) {
        const dataAttributes = this.getAllDataAttrbFromWrapper() as NodeListOf<HTMLElement>;
        
        dataAttributes.forEach((element) => {
            const pageName = element.dataset.modalPage;
            if (pageName !== name) return;

            document.getElementById('modalOverlay1')!.classList.remove('hidden');
            document.getElementById('modal-block')!.classList.remove('hidden');
            element.classList.remove('hidden');
            element.classList.add('show');
        });
    }

    protected enableClickButtonCls() {
        $('.card-route-name-cls').on('click', (e: Event) => {
            const target = e.currentTarget as HTMLElement;
            const pageName = target.dataset.routeModal;

            if (!pageName) return;
            this.open(pageName as ModalPage);
        });
    }

    protected getAllDataAttrbFromWrapper(id = "modalControllerWrapper") {
        const elementWrapper = document.getElementById(id);
        if (!elementWrapper) return [];
        return elementWrapper.querySelectorAll(".modal-ext-container");
    }
}