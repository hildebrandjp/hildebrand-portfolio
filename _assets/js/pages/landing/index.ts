import {
    LANDING_PAGE_ORB_FLOAT,
    LANDING_PAGE_ORB_PARALLAX,
    LANDING_PAGE_ORB_PATTERNS,
    LANDING_PAGE_ORB_PATTERN_INTERVAL_MS,
    LANDING_PAGE_REVEAL,
    LANDING_PAGE_SELECTORS
} from '@/pages/landing/constants';

export default class LandingPage {
    private root: HTMLElement | null;

    constructor() {
        this.root = document.querySelector(LANDING_PAGE_SELECTORS.root);
    }

    init() {
        if (!this.root) return;
        this.enableReveal();
        this.enableActiveAnchorOnScroll();
        this.enableOrbPatternLoop();
        this.enableOrbFloatLoop();
        this.enableOrbParallax();
    }

    private enableReveal() {
        const revealElements = Array.from(document.querySelectorAll<HTMLElement>(LANDING_PAGE_SELECTORS.reveal));
        if (!revealElements.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            revealElements.forEach((element) => element.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: LANDING_PAGE_REVEAL.threshold,
            rootMargin: LANDING_PAGE_REVEAL.rootMargin,
        });

        revealElements.forEach((element, index) => {
            element.style.setProperty('--lp-reveal-delay', `${ index * LANDING_PAGE_REVEAL.delayStepSeconds }s`);
            observer.observe(element);
        });
    }

    private enableActiveAnchorOnScroll() {
        const sections = Array.from(document.querySelectorAll<HTMLElement>(LANDING_PAGE_SELECTORS.sections));
        const anchorLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(LANDING_PAGE_SELECTORS.anchors));
        if (!sections.length || !anchorLinks.length) return;

        const anchorMap = new Map<string, HTMLAnchorElement>();
        anchorLinks.forEach((anchor) => {
            const key = anchor.dataset.lpAnchor;
            if (!key) return;
            anchorMap.set(key, anchor);
        });

        const syncActive = () => {
            const activeSection = sections.find((section) => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 180 && rect.bottom > 220;
            }) || sections[0];

            anchorLinks.forEach((anchor) => anchor.classList.remove('is-active'));
            const activeAnchor = activeSection ? anchorMap.get(activeSection.id) : null;
            activeAnchor?.classList.add('is-active');
        };

        syncActive();
        window.addEventListener('scroll', syncActive, { passive: true });
        window.addEventListener('resize', syncActive);
    }

    private enableOrbParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const orbs = Array.from(document.querySelectorAll<HTMLElement>(LANDING_PAGE_SELECTORS.orbs));
        if (!orbs.length) return;

        const updateParallax = () => {
            const maxOffset = LANDING_PAGE_ORB_PARALLAX.maxOffset;
            const viewportHeight = Math.max(window.innerHeight, 1);
            const ratio = Math.min(1, Math.max(0, window.scrollY / viewportHeight));

            orbs.forEach((orb, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                const offset = ratio * maxOffset * direction;
                orb.style.setProperty('--lp-orb-parallax', `${ offset }px`);
            });
        };

        updateParallax();
        window.addEventListener('scroll', updateParallax, { passive: true });
        window.addEventListener('resize', updateParallax);
    }

    private enableOrbPatternLoop() {
        const orbs = Array.from(document.querySelectorAll<HTMLElement>(LANDING_PAGE_SELECTORS.orbs));
        if (orbs.length !== 3) return;

        let index = 0;
        const applyPattern = (patternIndex: number) => {
            const pattern = LANDING_PAGE_ORB_PATTERNS[patternIndex];
            if (!pattern) return;

            orbs.forEach((orb, orbIndex) => {
                const item = pattern[orbIndex];
                if (!item) return;
                orb.style.left = item.left;
                orb.style.top = item.top;
                orb.style.width = item.size;
                orb.style.height = item.size;
                orb.style.opacity = item.opacity;
            });
        };

        applyPattern(index);
        window.setInterval(() => {
            index = (index + 1) % LANDING_PAGE_ORB_PATTERNS.length;
            applyPattern(index);
        }, LANDING_PAGE_ORB_PATTERN_INTERVAL_MS);
    }

    private enableOrbFloatLoop() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const orbs = Array.from(document.querySelectorAll<HTMLElement>(LANDING_PAGE_SELECTORS.orbs));
        if (!orbs.length) return;

        const tick = (now: number) => {
            orbs.forEach((orb, index) => {
                const amplitude = LANDING_PAGE_ORB_FLOAT.amplitudes[index] ?? 10;
                const speed = LANDING_PAGE_ORB_FLOAT.speeds[index] ?? 0.0006;
                const floatY = Math.sin(now * speed) * amplitude;
                orb.style.setProperty('--lp-orb-y', `${ floatY }px`);
            });
            window.requestAnimationFrame(tick);
        };

        window.requestAnimationFrame(tick);
    }
}
