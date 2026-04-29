// ── SectionPanel ──────────────────────────────────────────────────────────────

export const PANEL_CANVAS_W = 1280;
export const PANEL_CANVAS_H = 740;

export const PANEL_WORLD_W = 46;
export const PANEL_WORLD_H = (PANEL_CANVAS_H / PANEL_CANVAS_W) * PANEL_WORLD_W;

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

export const SNAP_FORWARD_THRESHOLD = 0.5;
export const SNAP_DEBOUNCE_MS       = 100;
export const SNAP_FALLBACK_MS       = 800;
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

// ── PostProcessor ─────────────────────────────────────────────────────────────

export const BLOOM_STRENGTH    = 0.55;
export const BLOOM_RADIUS      = 0.4;
export const BLOOM_THRESHOLD   = 0.28;
export const VIGNETTE_OFFSET   = 0.88;
export const VIGNETTE_DARKNESS = 1.3;
