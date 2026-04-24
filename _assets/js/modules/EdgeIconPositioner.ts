export default class EdgeIconPositioner {
    private static readonly ICON_SELECTOR = '.edge-icon';
    private static readonly INFO_SELECTOR = '.profile-additional-info';
    private static readonly WRAPPER_SELECTOR = '.profile-additional-wrapper';

    init(): void {
        this.position();
        window.addEventListener('resize', () => this.position());
    }

    private position(): void {
        const icon = document.querySelector(EdgeIconPositioner.ICON_SELECTOR) as HTMLElement | null;
        const info = document.querySelector(EdgeIconPositioner.INFO_SELECTOR) as HTMLElement | null;
        const wrapper = document.querySelector(EdgeIconPositioner.WRAPPER_SELECTOR) as HTMLElement | null;
        if (!icon || !info || !wrapper) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const infoRect = info.getBoundingClientRect();
        const iconHeight = icon.getBoundingClientRect().height;

        const topRelativeToWrapper = infoRect.top - wrapperRect.top;
        icon.style.top = `${(topRelativeToWrapper - iconHeight / 2) - 15}px`;
        icon.style.left = "-48px";
    }
}
