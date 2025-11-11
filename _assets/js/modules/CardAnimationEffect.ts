import type { NullishHTMLElement } from "@/types/NullishHTMLElement";

export default class CardAnimationEffect {
    public HIDE_CLASS = "hide";
    public CARD_PREVIEW_SELECTOR = ".card-preview";
    public CARD_SELECTOR = ".card";
    public ICON_BTN_SELECTOR = ".icon-btn";
    public ITEM_CONTAINER_SELECTOR = ".portfolio-item";

    constructor() {}

    enableAnimationCardHover() {
        const cards = document.querySelectorAll(this.ITEM_CONTAINER_SELECTOR);
        cards.forEach(card => {
            // Mouse enters the card
            card.addEventListener('mouseenter', (e) => {
                const target = e.currentTarget as HTMLElement;
                const preview = target.querySelector(this.CARD_PREVIEW_SELECTOR) as NullishHTMLElement;
                const cardInner = target.querySelector(this.CARD_SELECTOR)  as NullishHTMLElement;
                if (!preview || !cardInner) return;
                preview.style.transform = 'translateY(-7px)';
                preview.style.transition = 'transform 0.3s ease';
                cardInner.style.transform = preview.style.transform;
                cardInner.style.transition = preview.style.transition
            });

            // Mouse leaves the card
            card.addEventListener('mouseleave', (e) => {
                const target = e.currentTarget as HTMLElement;
                const preview = target.querySelector(this.CARD_PREVIEW_SELECTOR) as NullishHTMLElement;
                const cardInner = target.querySelector(this.CARD_SELECTOR) as NullishHTMLElement;
                if (!preview || !cardInner) return;
                preview.style.transform = 'translateY(0)';
                cardInner.style.transform = preview.style.transform;
            });
        });
    }

    enableHoverShowButtonsCardPreview() {
        const cardPreviews = document.querySelectorAll(this.CARD_PREVIEW_SELECTOR) as NodeListOf<HTMLElement>;
        cardPreviews.forEach((cardPreview) => {
            if (!cardPreview?.parentElement) return;
            const iconBtns = cardPreview.parentElement.querySelectorAll(this.ICON_BTN_SELECTOR);
            
            cardPreview.addEventListener('mouseenter', () => {
                iconBtns.forEach(iconBtn => $(iconBtn).removeClass(this.HIDE_CLASS));
            });

            cardPreview.addEventListener('mouseleave', () => {
                iconBtns.forEach(iconBtn => $(iconBtn).addClass(this.HIDE_CLASS));
            });
        });
    }
}