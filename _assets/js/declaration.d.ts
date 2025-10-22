declare global {
    const $: any;

    interface Window {
        pages: {
            StarIcon?: import("@/pages/home/StarIcon").default;
            CardMenuProfile?: import("@/pages/home/CardMenuProfile").default;   
        },
        modules: {
            ListBulletStyleHtml?: import("@/modules/ListBulletStyleHtml").default;
        }
    }
}

export { };
