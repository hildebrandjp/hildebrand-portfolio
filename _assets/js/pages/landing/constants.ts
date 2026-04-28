export const LANDING_PAGE_SELECTORS = {
    root: '#landingPageRoot',
    reveal: '.lp-reveal',
    sections: '.lp-section[id]',
    anchors: '.lp-anchor-link[data-lp-anchor]',
    orbs: '.lp-orb',
};

export const LANDING_PAGE_REVEAL = {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px',
    delayStepSeconds: 0.08,
};

export const LANDING_PAGE_ORB_PARALLAX = {
    maxOffset: 36,
};

type OrbPatternItem = {
    left: string;
    top: string;
    size: string;
    opacity: string;
};

export const LANDING_PAGE_ORB_PATTERNS: OrbPatternItem[][] = [
    [
        { left: '-8vw', top: '6vh', size: '24vw', opacity: '0.22' },
        { left: '70vw', top: '20vh', size: '28vw', opacity: '0.2' },
        { left: '24vw', top: '68vh', size: '20vw', opacity: '0.18' },
    ],
    [
        { left: '8vw', top: '22vh', size: '20vw', opacity: '0.2' },
        { left: '62vw', top: '62vh', size: '30vw', opacity: '0.22' },
        { left: '42vw', top: '-6vh', size: '22vw', opacity: '0.17' },
    ],
    [
        { left: '-4vw', top: '58vh', size: '26vw', opacity: '0.21' },
        { left: '74vw', top: '4vh', size: '24vw', opacity: '0.18' },
        { left: '36vw', top: '36vh', size: '32vw', opacity: '0.16' },
    ],
    [
        { left: '10vw', top: '-8vh', size: '28vw', opacity: '0.17' },
        { left: '58vw', top: '30vh', size: '22vw', opacity: '0.23' },
        { left: '20vw', top: '74vh', size: '24vw', opacity: '0.19' },
    ],
];

export const LANDING_PAGE_ORB_PATTERN_INTERVAL_MS = 6000;

export const LANDING_PAGE_ORB_FLOAT = {
    amplitudes: [10, 14, 12],
    speeds: [0.0007, 0.0005, 0.0006],
};
