import { type Dimension } from '@/interface/Dimension';

export default class DomEventService {
    constructor() {}

    resize(getDimensionFromScreenResizeFn: (dimension: Dimension) => void) {
        $(window).on("resize", () => {
            getDimensionFromScreenResizeFn({
                height: window.innerHeight,
                width: window.innerWidth 
            })
        });
    }
}

export const domEventServiceInstance = new DomEventService();