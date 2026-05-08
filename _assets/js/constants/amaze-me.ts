// ── SectionPanel ──────────────────────────────────────────────────────────────

export const PANEL_CANVAS_W = 1280;
export const PANEL_CANVAS_H = 740;

export const PANEL_WORLD_W = 46;
export const PANEL_WORLD_H = (PANEL_CANVAS_H / PANEL_CANVAS_W) * PANEL_WORLD_W;
export const PANEL_VIEWPORT_FILL = 0.88; // fraction of visible viewport width the panel targets

export const PANEL_TB_H = 46;
export const PANEL_PB_H = 34;
export const PANEL_SB_H = 30;
export const PANEL_PAD  = 32;

export const PANEL_FONT_SIZE       = 18;
export const PANEL_CHAR_W          = 10.85;
export const PANEL_LINE_H          = 68;
export const PANEL_CONTENT_OFFSET  = 54;
export const PANEL_FIRST_LINE_Y    = PANEL_TB_H + PANEL_PB_H + PANEL_CONTENT_OFFSET;

export const PANEL_FONT_SIZE_BRAND  = 14;
export const PANEL_FONT_SIZE_PROMPT = 13;
export const PANEL_FONT_SIZE_STATUS = 11;
export const PANEL_TRAFFIC_LIGHT_R  = 7;
export const PANEL_CORNER_RADIUS     = 10;
export const PANEL_TITLE_CENTER_Y_OFFSET = 5;
export const PANEL_PROMPT_Y_OFFSET       = 23;
export const PANEL_PROMPT_GAP            = 4;
export const PANEL_DIVIDER_H             = 1;
export const PANEL_BORDER_INSET          = 0.75;
export const PANEL_BORDER_W              = 1.5;
export const PANEL_CURSOR_X_OFFSET       = 2;
export const PANEL_CURSOR_Y_OFFSET       = 2;
export const PANEL_CURSOR_W              = 10;
export const PANEL_CURSOR_H_OFFSET       = 3;
export const PANEL_STATUS_Y_OFFSET       = 20;
export const PANEL_PERCENT_BASE          = 100;

export const PANEL_LERP_BASE             = 0.004;
export const PANEL_STAGGER_MAX           = 0.38;
export const PANEL_SCATTER_X             = 560;
export const PANEL_SCATTER_Y             = 420;
export const PANEL_OPACITY_SCALE         = 3;
export const PANEL_OPACITY_OFFSET        = 0.2;
export const PANEL_SCATTER_FADE_DIST     = 400;
export const PANEL_SCATTER_ALPHA_MIN     = 0.22;
export const PANEL_DECODE_START          = 0.70;
export const PANEL_DECODE_SETTLE         = 0.75;
export const PANEL_DECODE_LOCK           = 0.96;
export const PANEL_DRAW_EPSILON          = 0.0015;
export const PANEL_CURSOR_SHOW_AT        = 0.82;
export const PANEL_CURSOR_BLINK_AT       = 0.88;
export const PANEL_CURSOR_BLINK_INTERVAL = 0.5;

export const PANEL_COLOR_CARD_BG         = '#07050f';
export const PANEL_COLOR_TITLEBAR        = '#100e20';
export const PANEL_COLOR_PROMPTBAR       = '#0b0918';
export const PANEL_COLOR_TRAFFIC_RED     = '#ff5f57';
export const PANEL_COLOR_TRAFFIC_YELLOW  = '#febc2e';
export const PANEL_COLOR_TRAFFIC_GREEN   = '#28c840';
export const PANEL_COLOR_TITLE_TEXT      = 'rgba(255,255,255,0.82)';
export const PANEL_COLOR_DIVIDER         = 'rgba(99,102,241,0.3)';
export const PANEL_COLOR_STATUS_DIVIDER  = 'rgba(99,102,241,0.28)';
export const PANEL_COLOR_PROMPT_USER     = '#4ade80';
export const PANEL_COLOR_PROMPT_CMD      = 'rgba(165,180,252,0.75)';
export const PANEL_COLOR_CHAR_INFLIGHT   = '#6366f1';
export const PANEL_COLOR_CHAR_LABEL      = '#a5b4fc';
export const PANEL_COLOR_CHAR_BODY       = 'rgba(228,232,255,0.92)';
export const PANEL_COLOR_CURSOR          = '#818cf8';
export const PANEL_COLOR_STATUS_TEXT     = 'rgba(129,140,248,0.45)';
export const PANEL_COLOR_BORDER          = 'rgba(99,102,241,0.5)';

export const PANEL_TRAFFIC_LIGHTS: Array<[number, string]> = [
    [22, PANEL_COLOR_TRAFFIC_RED],
    [46, PANEL_COLOR_TRAFFIC_YELLOW],
    [70, PANEL_COLOR_TRAFFIC_GREEN],
];

export const PANEL_FONT_FAMILY_UI = '-apple-system, "Helvetica Neue", Arial, sans-serif';
export const PANEL_FONT_FAMILY_MONO = '"Courier New", monospace';
export const PANEL_BRAND_NAME = 'Hildebrand';
export const PANEL_CMD_TEXT = 'hildebrand@terminal:~$';
export const PANEL_RUN_CMD_PREFIX = './run';
export const PANEL_STATUS_DOMAIN = 'hildebrand.dev';
export const PANEL_STATUS_EXIT_HINT = 'ESC to exit';
export const PANEL_SECTION_TITLE_PATTERN = /^>\s*/;
export const PANEL_SPACE_PATTERN = /\s+/g;
export const PANEL_LABEL_PREFIX = '#';

export const PANEL_RNG_MULTIPLIER = 127.1;
export const PANEL_RNG_OFFSET = 311.7;
export const PANEL_RNG_SCALE = 43758.5453;
export const PANEL_ROW_SEED = 300;
export const PANEL_SCATTER_SEED_OFFSET = 1000;
export const PANEL_HEX_FLICKER_SPEED = 28;
export const PANEL_HEX_FLICKER_X = 0.09;
export const PANEL_HEX_FLICKER_Y = 0.04;
export const PANEL_HEX_FLICKER_DELAY = 90;
export const PANEL_DECODE_SPEED = 38;
export const PANEL_DECODE_X = 0.12;
export const PANEL_DECODE_DELAY = 50;
export const PANEL_DECODE_ALT_SEED = 3;
export const PANEL_DECODE_SETTLE_SPEED = 55;
export const PANEL_DECODE_SETTLE_DELAY = 44;

export const TEXTURE_PANEL_W = 960;
export const TEXTURE_PANEL_H = 560;
export const TEXTURE_FONT_TITLE = `bold 38px ${PANEL_FONT_FAMILY_MONO}`;
export const TEXTURE_FONT_LABEL = `bold 22px ${PANEL_FONT_FAMILY_MONO}`;
export const TEXTURE_FONT_BODY  = `20px ${PANEL_FONT_FAMILY_MONO}`;
export const TEXTURE_COLOR_BRIGHT = '#ffffff';
export const TEXTURE_COLOR_DIM    = 'rgba(225, 228, 255, 0.92)';
export const TEXTURE_COLOR_BG     = 'rgba(6, 4, 20, 0.97)';
export const TEXTURE_COLOR_EDGE_START = 'rgba(129,140,248,0)';
export const TEXTURE_COLOR_EDGE_MID = 'rgba(129,140,248,0.9)';
export const TEXTURE_COLOR_SEPARATOR = 'rgba(129,140,248,0.28)';
export const TEXTURE_COLOR_LABEL = PANEL_COLOR_CHAR_LABEL;
export const TEXTURE_CORNER_RADIUS = 6;
export const TEXTURE_EDGE_MID_START = 0.4;
export const TEXTURE_EDGE_MID_END = 0.6;
export const TEXTURE_EDGE_LINE_H = 2;
export const TEXTURE_BRACKET_LEN = 24;
export const TEXTURE_STROKE_W = 2;
export const TEXTURE_TEXT_X = 44;
export const TEXTURE_TITLE_Y = 68;
export const TEXTURE_SEPARATOR_Y = 84;
export const TEXTURE_SEPARATOR_INSET = 88;
export const TEXTURE_SEPARATOR_H = 1;
export const TEXTURE_CONTENT_Y = 128;
export const TEXTURE_LINE_H = 48;

// ── MatrixRain ────────────────────────────────────────────────────────────────

export const RAIN_CANVAS_W  = 1024;
export const RAIN_CANVAS_H  = 1024;
export const RAIN_FONT_SIZE = 14;
export const RAIN_UPDATE_FPS = 20;
export const RAIN_PLANE_SIZE = 200;

export const RAIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()=+-*/\\|!@#$%';

export const RAIN_FADE_ALPHA       = 0.14;
export const RAIN_CELL_OFFSET      = 0.85;
export const RAIN_BRIGHT_THRESHOLD = 0.93;
export const RAIN_PRE_ADVANCE      = 0.3;
export const RAIN_SPEED_BASE       = 0.42;
export const RAIN_SPEED_VARIANCE   = 0.28;
export const RAIN_RESET_THRESHOLD  = 0.975;
export const RAIN_RESET_RANGE      = 20;

export const RAIN_COLOR_BRIGHT       = 'rgba(200, 210, 255, 0.9)';
export const RAIN_COLOR_BG_RGB       = '7, 5, 18';
export const RAIN_TRAIL_BRIGHT_MIN   = 0.2;
export const RAIN_TRAIL_BRIGHT_RANGE = 0.45;
export const RAIN_TRAIL_R            = 80;
export const RAIN_TRAIL_G            = 85;
export const RAIN_TRAIL_B            = 210;

// ── CameraAnimator ────────────────────────────────────────────────────────────

export const CAM_LERP_BASE         = 0.008;
export const CAM_BREATHE_SPEED     = 0.18;
export const CAM_BREATHE_AMPLITUDE = 0.35;
export const CAM_SWAY_SPEED        = 0.12;
export const CAM_SWAY_AMPLITUDE    = 0.2;
export const CAM_LOOK_SWAY_SPEED   = 0.15;

export const SNAP_FORWARD_THRESHOLD  = 0.1;
export const SNAP_BACKWARD_THRESHOLD = 0.9;
export const SNAP_DEBOUNCE_MS        = 100;
export const SNAP_FALLBACK_MS       = 100;
export const SNAP_ARRIVAL_PX        = 8;
export const SNAP_INTERRUPT_PX      = 40;

// ── AmazeMeApp ────────────────────────────────────────────────────────────────

export const SECTION_SPACING     = 50;
export const CAM_FOV             = 60;
export const CAM_NEAR            = 0.1;
export const CAM_FAR             = 400;
export const CAM_Z               = 30;
export const MAX_PIXEL_RATIO     = 2;
export const SCENE_BG_COLOR      = 0x070512;
export const SCENE_AMBIENT_COLOR = 0x0d0820;
export const RAIN_MESH_Z         = -60;
export const PANEL_FADE_DISTANCE = 0.13;

export interface AmazeMeSectionData {
    title: string;
    lines: string[];
    xPos: number;
}

export const RESUME_SECTIONS: AmazeMeSectionData[] = [
    {
        title: '> HILDEBRAND E. LIGTAS',
        xPos: SECTION_SPACING,
        lines: [
            '  Senior Software Engineer',
            '',
            '  5+ years of software engineering experience',
            '  Full-stack & mobile development specialist',
            '  3+ years delivering Japanese client projects',
            '  Cebu, Philippines',
        ],
    },
    {
        title: '> EXPERIENCE',
        xPos: SECTION_SPACING * 2,
        lines: [
            '#2022 — 2025  ·  Hipe',
            '  Software Engineer → Mid → Senior',
            '  Full-stack web & mobile applications',
            '',
            '#2020 — 2022  ·  Self-employed',
            '  Freelance Software Engineer',
        ],
    },
    {
        title: '> EDUCATION',
        xPos: SECTION_SPACING * 3,
        lines: [
            '#2015 — 2021',
            '  BS Electronics Engineering (BSECE)',
            '  Cebu Institute of Technology — CIT-U',
            '',
            '  Self-taught full-stack developer',
            '  Continuous learner & problem solver',
        ],
    },
    {
        title: '> TECHNICAL SKILLS',
        xPos: SECTION_SPACING * 4,
        lines: [
            '#Languages:   JS  TS  PHP  Ruby  Python  Swift',
            '#Frameworks:  Laravel  Rails  Vue  React  RN',
            '#Databases:   MySQL  PostgreSQL  MongoDB  Redis',
            '#Cloud/DevOps: AWS  GCP  Docker  CI/CD',
            '#Testing:     Jest  Puppeteer  Unit  E2E',
        ],
    },
    {
        title: '> CONTACT',
        xPos: SECTION_SPACING * 5,
        lines: [
            '  hildebrandlig11@gmail.com',
            '  09700551910',
            '  Cebu, Philippines',
            '',
            '#Open to:',
            '  Senior / Lead Engineering Roles',
        ],
    },
];

export const SECTION_LABELS = [
    '// 00 · INTRO',
    '// 01 · PROFILE',
    '// 02 · EXPERIENCE',
    '// 03 · EDUCATION',
    '// 04 · SKILLS',
    '// 05 · CONTACT',
];

export const SECTION_GLOBE_INDEX = 0;
export const SECTION_PANEL_INDEX_OFFSET = 1;
export const SECTION_INITIAL_INDEX = -1;
export const SCROLL_PROGRESS_MIN = 0;
export const SCROLL_PROGRESS_MAX = 1;
export const RENDERER_CLEAR_ALPHA = 1;
export const ESCAPE_REDIRECT_URL = '/';

// ── GlobeSection ─────────────────────────────────────────────────────────────

export const GLOBE_RADIUS        = 9;
export const GLOBE_ARC_LIFT      = 0.38;
export const GLOBE_ARC_SEGMENTS  = 64;
export const GLOBE_SCALE_MAX     = 2.8;
export const GLOBE_ZOOM_Y_OFFSET_PX = -100;
export const GLOBE_TEXTURE_URL = '/assets/img/earth.jpg';
export const GLOBE_PROFILE_ID = 'am-glob-profile';
export const GLOBE_PROFILE_IMAGE_URL = '/assets/img/profile.png';
export const GLOBE_PROFILE_IMAGE_ALT = 'Hildebrand Pic';
export const GLOBE_PROFILE_NAME = 'HILDEBRAND C. LIGTAS';
export const GLOBE_PROFILE_TITLE = 'Senior Software Engineer';
export const GLOBE_PROFILE_LOCATION = 'Cebu, Philippines';
export const GLOBE_PROFILE_OPACITY_INITIAL = '0';
export const GLOBE_PROFILE_OPACITY_PRECISION = 3;
export const GLOBE_SPHERE_WIDTH_SEGMENTS = 64;
export const GLOBE_SPHERE_HEIGHT_SEGMENTS = 32;
export const GLOBE_ATMOS_WIDTH_SEGMENTS = 32;
export const GLOBE_ATMOS_HEIGHT_SEGMENTS = 16;
export const GLOBE_DOT_WIDTH_SEGMENTS = 8;
export const GLOBE_DOT_HEIGHT_SEGMENTS = 8;
export const GLOBE_ATMOS_SCALE = 1.06;
export const GLOBE_DOT_SCALE = 0.028;
export const GLOBE_DOT_SURFACE_SCALE = 1.01;
export const GLOBE_ATMOS_COLOR = 0x3b82f6;
export const GLOBE_ATMOS_OPACITY_SCALE = 0.14;
export const GLOBE_ARC_STAGGER_SCALE = 0.3;
export const GLOBE_ARC_FADE_SCALE = 2.5;
export const GLOBE_ARC_OPACITY_MAX = 0.8;
export const GLOBE_DOT_FADE_IN_SCALE = 3;
export const GLOBE_DOT_FADE_IN_OFFSET = 1.5;
export const GLOBE_DOT_FADE_OUT_START = 0.5;
export const GLOBE_DOT_FADE_OUT_SCALE = 5;
export const GLOBE_PROFILE_FADE_START = 0.8;
export const GLOBE_PROFILE_FADE_SCALE = 5;
export const DEG_TO_RAD = Math.PI / 180;

export const GLOBE_PHASE_ARCS       = 0.25; // proximity at which globe/atmos reach full opacity

export const GLOBE_WHEEL_TOTAL_PX   = 600; // total wheel-delta px to complete globe rotation
export const GLOBE_WHEEL_UNLOCK_RATIO = 0.88; // fraction of rotation at which scroll unlocks
export const ZOOM_WHEEL_TOTAL_PX    = 500; // wheel-delta px to complete intro zoom before unlocking scroll

// Y-rotation of the globe mesh (radians).
// At 0 the camera sees ~90°W (Americas). Tuned to show a nice
// Atlantic/Europe view initially then rotate to Cebu, Philippines.
export const GLOBE_INITIAL_Y_ROT = 1.0;
export const GLOBE_CEBU_Y_ROT    = 2.56;

export const GLOBE_ZOOM_START_PX  = 350; // scrollY where zoom begins
export const GLOBE_ZOOM_END_PX    = 700; // scrollY where zoom completes

export const GLOBE_ARC_COLOR      = 0x6366f1;
export const GLOBE_CEBU_DOT_COLOR = 0x4ade80;
export const GLOBE_LERP_BASE      = 0.004;

export type GeoPoint = { lat: number; lon: number };
export const GLOBE_CONNECTIONS: GeoPoint[] = [
    { lat: 35.68,  lon: 139.69  }, // Tokyo
    { lat: 34.69,  lon: 135.50  }, // Osaka
    { lat: 14.60,  lon: 120.98  }, // Manila, Philippines
    { lat: 28.61,  lon:  77.21  }, // New Delhi, India
    { lat: 35.86,  lon: 139.65  }, // Saitama, Japan
    { lat: 43.65,  lon: -79.38  }, // Toronto, Canada
];
export const GLOBE_CEBU: GeoPoint = { lat: 10.32, lon: 123.89 };

// ── PostProcessor ─────────────────────────────────────────────────────────────

export const BLOOM_STRENGTH    = 0.55;
export const BLOOM_RADIUS      = 0.4;
export const BLOOM_THRESHOLD   = 0.28;
export const VIGNETTE_OFFSET   = 0.88;
export const VIGNETTE_DARKNESS = 1.3;
