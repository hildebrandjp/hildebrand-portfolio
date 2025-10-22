
import { domEventServiceInstance } from "@/services/DomService";

export default class StarIcon {
    constructor() {}

    autoRunFnUsingResizeEvent(callback = (): any => undefined) {
        callback();
        domEventServiceInstance.resize(callback.bind(this));
    }

    autoRunPlaceOnEdgesOfSquaresWithResize() {
        this.placeOnEdgesOfSquares();
        this.autoRunFnUsingResizeEvent(this.placeOnEdgesOfSquares.bind(this));
    }

    placeOnEdgesOfSquares() {
        const cardOne = $(".card")?.[0];
        if (!cardOne) return;

        const distanceFromLeft = cardOne.getBoundingClientRect().left;
        const median = cardOne.clientWidth / 2;
        const finalComputedPos = median + distanceFromLeft;

        $(".star-1").css({
            left: `${finalComputedPos - 30}px`
        });
        $(".star-2").css({
            left: `${finalComputedPos + 215}px`
        });
        $(".star-3").css({
            left: `${finalComputedPos + 645}px`
        })
    }
}