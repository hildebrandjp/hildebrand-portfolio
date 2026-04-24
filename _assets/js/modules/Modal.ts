import { ModalPage } from "@/interface/ModalPage";
import { MODAL_PAGES } from "@/constants/modal";

export default class Modal {
    private _aboutResizeObserver: ResizeObserver | null = null;

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

        this._aboutResizeObserver?.disconnect();
        this._aboutResizeObserver = null;
        this.scrollToTopOfModal();
        document.getElementById('modalBackToTop')?.classList.remove('show');
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

            this.scrollToTopOfModal();

            if (name === MODAL_PAGES.ABOUT_INDEX) {
                requestAnimationFrame(() => {
                    this.syncAboutRightHeight(element);
                    this.refreshAboutTimeline();
                });
            }
        });
    }

    private scrollToTopOfModal() {
        const wrapper = document.getElementById('modalControllerWrapper');
        const modalContainers = document.querySelectorAll(".modal-ext-container *");
        if (wrapper) wrapper.scrollTop = 0;
        Array.from(modalContainers).forEach((container: Element) => {
            if (container && container instanceof HTMLElement) (container as HTMLElement).scrollTop = 0;
        });
    }

    private syncAboutRightHeight(container: HTMLElement) {
        const modalParent = document.querySelector<HTMLElement>('.modal-about-container');
        const right = container.querySelector<HTMLElement>('.about-me-right-container');
        if (!modalParent || !right) return;

        const applyHeight = () => {
            right.style.maxHeight = `${ modalParent.offsetHeight - 110 }px`;
            this.refreshAboutTimeline();
        };

        applyHeight();

        this._aboutResizeObserver?.disconnect();
        this._aboutResizeObserver = new ResizeObserver(applyHeight);
        this._aboutResizeObserver.observe(modalParent);
    }

    private refreshAboutTimeline() {
        requestAnimationFrame(() => {
            window.modules?.ListBulletStyleHtml?.init();
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
