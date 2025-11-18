import { ModalPage } from "@/interface/ModalPage";

export default class ModalNavigation {
    constructor() {}

    init() {}

    getAllDataAttrbFromWrapper(id = "modalControllerWrapper") {
        const elementWrapper = document.getElementById(id);
        if (!elementWrapper) return [];
        return elementWrapper.querySelectorAll(".modal-ext-container");
    }

    open(name : ModalPage) {
        const dataAttributes = this.getAllDataAttrbFromWrapper() as NodeListOf<HTMLElement>;
        
        dataAttributes.forEach((element) => {
            const page = element.dataset.modalPage;
            const pageName = page?.split('-').shift(); // Remove the 'modal' prefix
            if (pageName === name) {
                element.classList.remove('hidden'); 
                element.classList.add('show');
            }
        });
    }
}