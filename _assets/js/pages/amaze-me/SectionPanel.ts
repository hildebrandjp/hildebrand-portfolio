import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Group,
    MathUtils,
    CanvasTexture,
    LinearFilter,
} from 'three';
import type { IDisposable, IAnimatable } from '@/interface/AmazeMe';
import {
    PANEL_CANVAS_W, PANEL_CANVAS_H,
    PANEL_WORLD_W, PANEL_WORLD_H,
    PANEL_TB_H, PANEL_PB_H, PANEL_SB_H, PANEL_PAD,
    PANEL_FONT_SIZE, PANEL_CHAR_W, PANEL_LINE_H, PANEL_FIRST_LINE_Y,
    PANEL_FONT_SIZE_BRAND, PANEL_FONT_SIZE_PROMPT, PANEL_FONT_SIZE_STATUS,
    PANEL_TRAFFIC_LIGHT_R, PANEL_CORNER_RADIUS, PANEL_TITLE_CENTER_Y_OFFSET,
    PANEL_PROMPT_Y_OFFSET, PANEL_PROMPT_GAP, PANEL_DIVIDER_H,
    PANEL_BORDER_INSET, PANEL_BORDER_W, PANEL_CURSOR_X_OFFSET,
    PANEL_CURSOR_Y_OFFSET, PANEL_CURSOR_W, PANEL_CURSOR_H_OFFSET,
    PANEL_STATUS_Y_OFFSET, PANEL_PERCENT_BASE,
    PANEL_TRAFFIC_LIGHTS,
    PANEL_LERP_BASE, PANEL_STAGGER_MAX, PANEL_SCATTER_X, PANEL_SCATTER_Y,
    PANEL_OPACITY_SCALE, PANEL_OPACITY_OFFSET,
    PANEL_SCATTER_FADE_DIST, PANEL_SCATTER_ALPHA_MIN,
    PANEL_DECODE_START, PANEL_DECODE_SETTLE, PANEL_DECODE_LOCK,
    PANEL_DRAW_EPSILON,
    PANEL_CURSOR_SHOW_AT, PANEL_CURSOR_BLINK_AT, PANEL_CURSOR_BLINK_INTERVAL,
    PANEL_COLOR_CARD_BG, PANEL_COLOR_TITLEBAR, PANEL_COLOR_PROMPTBAR,
    PANEL_COLOR_TITLE_TEXT, PANEL_COLOR_DIVIDER, PANEL_COLOR_STATUS_DIVIDER,
    PANEL_COLOR_PROMPT_USER, PANEL_COLOR_PROMPT_CMD,
    PANEL_COLOR_CHAR_INFLIGHT, PANEL_COLOR_CHAR_LABEL, PANEL_COLOR_CHAR_BODY,
    PANEL_COLOR_CURSOR, PANEL_COLOR_STATUS_TEXT, PANEL_COLOR_BORDER,
    PANEL_FONT_FAMILY_UI, PANEL_FONT_FAMILY_MONO, PANEL_BRAND_NAME,
    PANEL_CMD_TEXT, PANEL_RUN_CMD_PREFIX, PANEL_STATUS_DOMAIN,
    PANEL_STATUS_EXIT_HINT, PANEL_SECTION_TITLE_PATTERN, PANEL_SPACE_PATTERN,
    PANEL_LABEL_PREFIX, PANEL_RNG_MULTIPLIER, PANEL_RNG_OFFSET,
    PANEL_RNG_SCALE, PANEL_ROW_SEED, PANEL_SCATTER_SEED_OFFSET,
    PANEL_HEX_FLICKER_SPEED, PANEL_HEX_FLICKER_X, PANEL_HEX_FLICKER_Y,
    PANEL_HEX_FLICKER_DELAY, PANEL_DECODE_SPEED, PANEL_DECODE_X,
    PANEL_DECODE_DELAY, PANEL_DECODE_ALT_SEED, PANEL_DECODE_SETTLE_SPEED,
    PANEL_DECODE_SETTLE_DELAY,
} from '../../constants/amaze-me';
import type { AmazeMeSectionData } from '../../constants/amaze-me';

interface CharEntry {
    realChar: string;
    finalX: number;
    finalY: number;
    sx: number;    // scatter offset X (px)
    sy: number;    // scatter offset Y (px)
    d: number;     // stagger delay [0, PANEL_STAGGER_MAX]
    isLabel: boolean;
}

// Deterministic seeded PRNG — no Math.random() in hot path
function rng(n: number): number {
    const v = Math.sin(n * PANEL_RNG_MULTIPLIER + PANEL_RNG_OFFSET) * PANEL_RNG_SCALE;
    return v - Math.floor(v);
}

function hexOf(c: string): string {
    const h = c.charCodeAt(0).toString(16).toUpperCase();
    return h.length === 1 ? '0' + h : h;
}

// Cubic ease-out: fast start, decelerates to destination
function easeOut3(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export class SectionPanel implements IDisposable, IAnimatable {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly texture: CanvasTexture;
    private readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
    private readonly group: Group;

    private readonly chars: CharEntry[];
    private readonly cmdText: string;
    private readonly sectionCmd: string;

    private anim = 0;
    private targetAnim = 0;
    private cursorOn = true;
    private cursorT  = 0;
    private lastAnim = -1;
    private needsDraw = true;

    constructor(data: AmazeMeSectionData) {
        this.canvas = document.createElement('canvas');
        this.canvas.width  = PANEL_CANVAS_W;
        this.canvas.height = PANEL_CANVAS_H;
        this.ctx = this.canvas.getContext('2d')!;

        this.texture = new CanvasTexture(this.canvas);
        this.texture.minFilter = LinearFilter;
        this.texture.magFilter = LinearFilter;

        const geo = new PlaneGeometry(PANEL_WORLD_W, PANEL_WORLD_H);
        const mat = new MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
        });
        this.mesh  = new Mesh(geo, mat);
        this.group = new Group();
        this.group.add(this.mesh);
        this.group.position.set(data.xPos, 0, 0);

        this.sectionCmd = data.title.replace(PANEL_SECTION_TITLE_PATTERN, '').toLowerCase().replace(PANEL_SPACE_PATTERN, '-');
        this.cmdText = PANEL_CMD_TEXT;
        this.chars = this._buildChars(data.lines);
        this._draw();
    }

    private _buildChars(lines: string[]): CharEntry[] {
        const total = lines.reduce(
            (sum, line) => sum + (line.startsWith(PANEL_LABEL_PREFIX) ? line.slice(PANEL_LABEL_PREFIX.length) : line).length,
            0,
        );

        const all: CharEntry[] = [];
        let idx = 0;

        lines.forEach((line, li) => {
            if (line === '') return;
            const isLabel = line.startsWith(PANEL_LABEL_PREFIX);
            const text = isLabel ? line.slice(PANEL_LABEL_PREFIX.length) : line;
            const fy = PANEL_FIRST_LINE_Y + li * PANEL_LINE_H;

            for (let ci = 0; ci < text.length; ci++, idx++) {
                const seed = li * PANEL_ROW_SEED + ci;
                all.push({
                    realChar: text[ci],
                    finalX: PANEL_PAD + ci * PANEL_CHAR_W,
                    finalY: fy,
                    sx: (rng(seed)        - 0.5) * PANEL_SCATTER_X,
                    sy: (rng(seed + PANEL_SCATTER_SEED_OFFSET) - 0.5) * PANEL_SCATTER_Y,
                    d:  (idx / total) * PANEL_STAGGER_MAX,
                    isLabel,
                });
            }
        });
        return all;
    }

    getGroup(): Group { return this.group; }

    resize(scale: number): void {
        this.group.scale.setScalar(scale);
    }

    // Called by AmazeMeApp with proximity 0–1 (1 = section centred on screen)
    setTargetOpacity(proximity: number): void {
        this.targetAnim = MathUtils.clamp(proximity, 0, 1);
    }

    update(delta: number, _elapsed: number): void {
        const t = 1 - Math.pow(PANEL_LERP_BASE, delta);
        this.anim = MathUtils.lerp(this.anim, this.targetAnim, t);

        this.mesh.material.opacity = MathUtils.clamp(
            this.anim * PANEL_OPACITY_SCALE - PANEL_OPACITY_OFFSET, 0, 1,
        );

        if (this.anim > PANEL_CURSOR_BLINK_AT) {
            this.cursorT += delta;
            if (this.cursorT >= PANEL_CURSOR_BLINK_INTERVAL) {
                this.cursorOn  = !this.cursorOn;
                this.cursorT   = 0;
                this.needsDraw = true;
            }
        }

        if (Math.abs(this.anim - this.lastAnim) > PANEL_DRAW_EPSILON || this.needsDraw) {
            this._draw();
            this.texture.needsUpdate = true;
            this.lastAnim  = this.anim;
            this.needsDraw = false;
        }
    }

    private _draw(): void {
        const { ctx } = this;
        const p = this.anim;

        ctx.clearRect(0, 0, PANEL_CANVAS_W, PANEL_CANVAS_H);

        // ── CARD BACKGROUND ─────────────────────────────────────────────
        ctx.fillStyle = PANEL_COLOR_CARD_BG;
        ctx.beginPath();
        ctx.roundRect(0, 0, PANEL_CANVAS_W, PANEL_CANVAS_H, PANEL_CORNER_RADIUS);
        ctx.fill();

        // ── TITLE BAR ───────────────────────────────────────────────────
        ctx.fillStyle = PANEL_COLOR_TITLEBAR;
        ctx.fillRect(0, 0, PANEL_CANVAS_W, PANEL_TB_H);

        // macOS-style traffic lights
        PANEL_TRAFFIC_LIGHTS.forEach(([lx, lcolor]) => {
            ctx.beginPath();
            ctx.arc(lx, PANEL_TB_H / 2, PANEL_TRAFFIC_LIGHT_R, 0, Math.PI * 2);
            ctx.fillStyle = lcolor;
            ctx.fill();
        });

        // Brand name centred in title bar
        ctx.font = `bold ${PANEL_FONT_SIZE_BRAND}px ${PANEL_FONT_FAMILY_UI}`;
        ctx.fillStyle = PANEL_COLOR_TITLE_TEXT;
        ctx.textAlign = 'center';
        ctx.fillText(PANEL_BRAND_NAME, PANEL_CANVAS_W / 2, PANEL_TB_H / 2 + PANEL_TITLE_CENTER_Y_OFFSET);
        ctx.textAlign = 'left';

        ctx.fillStyle = PANEL_COLOR_DIVIDER;
        ctx.fillRect(0, PANEL_TB_H - PANEL_DIVIDER_H, PANEL_CANVAS_W, PANEL_DIVIDER_H);

        // ── PROMPT BAR ──────────────────────────────────────────────────
        ctx.fillStyle = PANEL_COLOR_PROMPTBAR;
        ctx.fillRect(0, PANEL_TB_H, PANEL_CANVAS_W, PANEL_PB_H);

        ctx.font = `bold ${PANEL_FONT_SIZE_PROMPT}px ${PANEL_FONT_FAMILY_MONO}`;
        ctx.fillStyle = PANEL_COLOR_PROMPT_USER;
        ctx.fillText(this.cmdText, PANEL_PAD, PANEL_TB_H + PANEL_PROMPT_Y_OFFSET);
        const pw = ctx.measureText(this.cmdText).width + PANEL_PROMPT_GAP;
        ctx.fillStyle = PANEL_COLOR_PROMPT_CMD;
        ctx.fillText(`${PANEL_RUN_CMD_PREFIX} ${this.sectionCmd}`, PANEL_PAD + pw, PANEL_TB_H + PANEL_PROMPT_Y_OFFSET);

        ctx.fillStyle = PANEL_COLOR_DIVIDER;
        ctx.fillRect(0, PANEL_TB_H + PANEL_PB_H - PANEL_DIVIDER_H, PANEL_CANVAS_W, PANEL_DIVIDER_H);

        // ── ANIMATED CHARACTERS ─────────────────────────────────────────
        ctx.font = `${PANEL_FONT_SIZE}px ${PANEL_FONT_FAMILY_MONO}`;

        for (const ch of this.chars) {
            // Per-character local progress (staggered)
            const lp = MathUtils.clamp((p - ch.d) / (1 - ch.d), 0, 1);

            // Position: scatter → final position with cubic ease-out
            const ease = easeOut3(lp);
            const cx   = ch.finalX + ch.sx * (1 - ease);
            const cy   = ch.finalY + ch.sy * (1 - ease);

            // Glyph: hex scramble while in-flight, hard-lock to real char once settled
            let glyph: string;
            const hx = hexOf(ch.realChar);
            if (lp >= PANEL_DECODE_LOCK) {
                // Fully settled — always show real character, no randomness
                glyph = ch.realChar;
            } else if (lp < PANEL_DECODE_START) {
                // In-flight hex flicker — changes with time so it looks "alive"
                const fi = Math.floor(p * PANEL_HEX_FLICKER_SPEED + ch.finalX * PANEL_HEX_FLICKER_X + ch.finalY * PANEL_HEX_FLICKER_Y);
                glyph = rng(fi + ch.d * PANEL_HEX_FLICKER_DELAY) > 0.5 ? hx[0] : hx[1];
            } else {
                // Decode: probability ramps from 0→1 as lp goes DECODE_START→DECODE_LOCK
                const dt = (lp - PANEL_DECODE_START) / (1 - PANEL_DECODE_START);
                const fi = Math.floor(p * PANEL_DECODE_SPEED + ch.finalX * PANEL_DECODE_X + ch.d * PANEL_DECODE_DELAY);
                glyph    = rng(fi) < dt * dt ? ch.realChar : (rng(fi + PANEL_DECODE_ALT_SEED) > 0.5 ? hx[0] : hx[1]);
            }

            // Color: indigo hex during flight, white/violet once decoded
            const decoded = lp >= PANEL_DECODE_LOCK
                || (lp > PANEL_CURSOR_BLINK_AT
                    && rng(Math.floor(p * PANEL_DECODE_SETTLE_SPEED) + ch.d * PANEL_DECODE_SETTLE_DELAY) < PANEL_DECODE_SETTLE);
            ctx.fillStyle = decoded
                ? (ch.isLabel ? PANEL_COLOR_CHAR_LABEL : PANEL_COLOR_CHAR_BODY)
                : PANEL_COLOR_CHAR_INFLIGHT;

            // Fade scattered chars proportionally to their distance from home
            const dist = Math.hypot(cx - ch.finalX, cy - ch.finalY);
            ctx.globalAlpha = MathUtils.clamp(1 - dist / PANEL_SCATTER_FADE_DIST, PANEL_SCATTER_ALPHA_MIN, 1);
            ctx.fillText(glyph, cx, cy);
        }
        ctx.globalAlpha = 1;

        // ── CURSOR ──────────────────────────────────────────────────────
        if (p > PANEL_CURSOR_SHOW_AT && this.cursorOn) {
            const last = this.chars[this.chars.length - 1];
            if (last) {
                ctx.fillStyle = PANEL_COLOR_CURSOR;
                ctx.fillRect(
                    last.finalX + PANEL_CHAR_W + PANEL_CURSOR_X_OFFSET,
                    last.finalY - PANEL_FONT_SIZE + PANEL_CURSOR_Y_OFFSET,
                    PANEL_CURSOR_W,
                    PANEL_FONT_SIZE + PANEL_CURSOR_H_OFFSET,
                );
            }
        }

        // ── CARD BORDER ─────────────────────────────────────────────────
        ctx.strokeStyle = PANEL_COLOR_BORDER;
        ctx.lineWidth   = PANEL_BORDER_W;
        ctx.beginPath();
        ctx.roundRect(
            PANEL_BORDER_INSET,
            PANEL_BORDER_INSET,
            PANEL_CANVAS_W - PANEL_BORDER_W,
            PANEL_CANVAS_H - PANEL_BORDER_W,
            PANEL_CORNER_RADIUS,
        );
        ctx.stroke();

        // ── STATUS BAR ──────────────────────────────────────────────────
        const sy = PANEL_CANVAS_H - PANEL_SB_H;
        ctx.fillStyle = PANEL_COLOR_TITLEBAR;
        ctx.fillRect(0, sy, PANEL_CANVAS_W, PANEL_SB_H);
        ctx.fillStyle = PANEL_COLOR_STATUS_DIVIDER;
        ctx.fillRect(0, sy, PANEL_CANVAS_W, PANEL_DIVIDER_H);

        ctx.font = `${PANEL_FONT_SIZE_STATUS}px ${PANEL_FONT_FAMILY_MONO}`;
        ctx.fillStyle = PANEL_COLOR_STATUS_TEXT;
        const pctStr = Math.round(p * PANEL_PERCENT_BASE).toString();
        const pct = pctStr.length < 3 ? ('00' + pctStr).slice(-3) : pctStr;
        ctx.fillText(`DECODE ${pct}%  ·  ${PANEL_STATUS_DOMAIN}  ·  ${PANEL_STATUS_EXIT_HINT}`, PANEL_PAD, sy + PANEL_STATUS_Y_OFFSET);
    }

    dispose(): void {
        const mat = this.mesh.material;
        mat.map?.dispose();
        mat.dispose();
        this.mesh.geometry.dispose();
        this.texture.dispose();
    }
}
