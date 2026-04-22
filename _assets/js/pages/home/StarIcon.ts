import { domEventServiceInstance } from "@/services/DomService";

export default class StarIcon {
    constructor() {}

    autoRunFnUsingResizeEvent(callback = (): any => undefined) {
        domEventServiceInstance.resize(callback.bind(this));
    }

    autoRunPlaceOnEdgesOfSquaresWithResize() {
        const placeOnEdges = this.placeOnEdgesOfSquares.bind(this);

        placeOnEdges();
        window.requestAnimationFrame(placeOnEdges);
        window.addEventListener("load", placeOnEdges, { once: true });
        window.setTimeout(placeOnEdges, 450);

        this.autoRunFnUsingResizeEvent(placeOnEdges);
    }

    placeOnEdgesOfSquares() {
        const home = document.getElementById("home");
        const starOne = document.querySelector(".star-1") as HTMLElement | null;
        const starTwo = document.querySelector(".star-2") as HTMLElement | null;
        const starThree = document.querySelector(".star-3") as HTMLElement | null;
        if (!home || !starOne || !starTwo || !starThree) return;

        const staleClones = home.querySelectorAll("[data-star-two-clone='true']");
        staleClones.forEach((node) => node.remove());

        const cardWrappers = document.querySelectorAll(".home-container > div");
        if (cardWrappers.length < 6) return;
        const homeRect = home.getBoundingClientRect();
        const placeStar = (star: HTMLElement, centerX: number, centerY: number) => {
            star.style.left = `${centerX - homeRect.left - (star.offsetWidth / 2)}px`;
            star.style.top = `${centerY - homeRect.top - (star.offsetHeight / 2)}px`;
        };

        const isMobile = window.matchMedia("(max-width: 992px)").matches;
        if (isMobile) return;

        const isDesktop = window.matchMedia("(min-width: 1400px)").matches;
        if (isDesktop) {
            const col1TopRect = cardWrappers[0].getBoundingClientRect();
            const col1BottomRect = cardWrappers[1].getBoundingClientRect();
            const col2TopRect = cardWrappers[2].getBoundingClientRect();
            const col2BottomRect = cardWrappers[3].getBoundingClientRect();
            const col3TopRect = cardWrappers[4].getBoundingClientRect();
            const col3BottomRect = cardWrappers[5].getBoundingClientRect();

            const rowSplitY = (
                ((col1TopRect.bottom + col1BottomRect.top) / 2) +
                ((col2TopRect.bottom + col2BottomRect.top) / 2) +
                ((col3TopRect.bottom + col3BottomRect.top) / 2)
            ) / 3;
            const col1CenterX = (
                ((col1TopRect.left + col1TopRect.right) / 2) +
                ((col1BottomRect.left + col1BottomRect.right) / 2)
            ) / 2;
            const seam12X = (
                ((col1TopRect.right + col2TopRect.left) / 2) +
                ((col1BottomRect.right + col2BottomRect.left) / 2)
            ) / 2;
            const seam23X = (
                ((col2TopRect.right + col3TopRect.left) / 2) +
                ((col2BottomRect.right + col3BottomRect.left) / 2)
            ) / 2;

            // star-1 between card 1 (top-left) and card 2 (bottom-left)
            placeStar(starOne, col1CenterX, rowSplitY);

            // star-2 single star between first and second columns
            placeStar(starTwo, seam12X, rowSplitY);

            // star-3 between second and third columns
            placeStar(starThree, seam23X, rowSplitY);
            return;
        }

        // md layout (993px-1399px): place star-1 on the edge between columns.
        const row1LeftRect = cardWrappers[0].getBoundingClientRect();
        const row1RightRect = cardWrappers[1].getBoundingClientRect();
        const row2LeftRect = cardWrappers[2].getBoundingClientRect();
        const row2RightRect = cardWrappers[3].getBoundingClientRect();

        const seamX = (
            ((row1LeftRect.right + row1RightRect.left) / 2) +
            ((row2LeftRect.right + row2RightRect.left) / 2)
        ) / 2;
        const seamY = (
            ((row1LeftRect.bottom + row2LeftRect.top) / 2) +
            ((row1RightRect.bottom + row2RightRect.top) / 2)
        ) / 2;

        placeStar(starOne, seamX, seamY);
    }
}
