export default class CardMenuProfile {
    constructor() {}

    attachClickEvent() {
        $(".card-menu-profile").on("click", (e: Event) => {
            const currentTarget = e.currentTarget;
        });
    }
}

