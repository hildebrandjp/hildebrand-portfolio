declare global {
    const $: any;

    interface Window {
        pages: {
            StarIcon?: import("@/pages/home/StarIcon").default;
            CardMenuProfile?: import("@/pages/home/CardMenuProfile").default;   
        },
        modules: {
            ListBulletStyleHtml?: import("@/modules/ListBulletStyleHtml").default;
            CardAnimationEffect?: import("@/modules/CardAnimationEffect").default;
            Modal?: import("@/modules/Modal").default;
            State?: import("@/modules/State").default;
            HamburgerMenu?: import("@/modules/HamburgerMenu").default;
            PortfolioShow?: import("@/pages/portfolio/PortfolioShow").default;
            EdgeIconPositioner?: import("@/modules/EdgeIconPositioner").default;
        }
        const: any;
    }
}

export { };
