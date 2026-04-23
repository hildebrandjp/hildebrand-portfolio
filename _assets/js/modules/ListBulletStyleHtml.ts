export default class ListBulletStyleHtml {
    constructor() {}

    init() {
      this.formVertLineWithBulletTitle();
    }

    private formVertLineWithBulletTitle() {
        const containers = document.querySelectorAll('.vert-line');
  
        // Adjust vertical line height with respect to container element
        containers.forEach(container => {
            const items = container.querySelectorAll('.amru-item');
            const line = container.querySelector('.line');
        
            // extend vertical line throughout the end of container
            if (items.length > 0 && line) {
                const first = items[0];
                const firstOccurText = first.querySelector('.amru-year') ?? first;
                const last = items[items.length - 1];
        
                // compute relative positions
                const containerRect = container.getBoundingClientRect();
                const lastRect = last.getBoundingClientRect();
                const top = this.getTopPaddingFromParent(firstOccurText, container);
                const bottom = lastRect.bottom - containerRect.top;
        
                (line as HTMLElement).style.top = `${top}px`;
                (line as HTMLElement).style.height = `${bottom - top}px`;
        
                this.bulletCircle(items);
            }
        });
    }

    private bulletCircle(items: NodeListOf<Element>) {
      const BULLET = "bullet"
      items.forEach(item => {
        const amruYearElement = item.querySelector(".amru-year");
        if (amruYearElement) {
          let div = item.querySelector(`.${BULLET}`) as HTMLElement | null;
          if (!div) {
            div = document.createElement('div');
            div.className = BULLET;
            item.appendChild(div);
          }
          // The bullet is positioned absolutely inside `.amru-item`, so
          // compute `top` relative to the same item for correct offsets.
          const topPadding = this.getTopPaddingFromParent(amruYearElement, item);
          div.style.top = `${topPadding}px`;
          div.style.left = "-16px";
        }
      });
    }

    private getTopPaddingFromParent(element: Element, parentElement: Element) {
      const mainElementRect = element.getBoundingClientRect();
      const parentElementRect = parentElement.getBoundingClientRect();
      const mainElementPaddingTop = parseFloat(window.getComputedStyle(element).paddingTop) || 0;
      const mainElementMedian = mainElementRect.height - mainElementPaddingTop / 2;
      return (mainElementRect.top - parentElementRect.top) + mainElementMedian;
    }
}
