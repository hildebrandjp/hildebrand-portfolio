import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Group,
    MathUtils,
    CanvasTexture,
    LinearFilter,
} from 'three';
import type { IDisposable, IAnimatable } from './interfaces';
import {
    PANEL_CANVAS_W, PANEL_CANVAS_H,
    PANEL_WORLD_W, PANEL_WORLD_H,
    PANEL_TB_H, PANEL_PB_H, PANEL_SB_H, PANEL_PAD,
    PANEL_FONT_SIZE, PANEL_CHAR_W, PANEL_LINE_H, PANEL_FIRST_LINE_Y,
    PANEL_FONT_SIZE_BRAND, PANEL_FONT_SIZE_PROMPT, PANEL_FONT_SIZE_STATUS,
    PANEL_TRAFFIC_LIGHT_R,
    PANEL_LERP_BASE, PANEL_STAGGER_MAX, PANEL_SCATTER_X, PANEL_SCATTER_Y,
    PANEL_OPACITY_SCALE, PANEL_OPACITY_OFFSET,
    PANEL_SCATTER_FADE_DIST, PANEL_SCATTER_ALPHA_MIN,
    PANEL_DECODE_START, PANEL_DECODE_SETTLE, PANEL_DECODE_LOCK,
    PANEL_DRAW_EPSILON,
    PANEL_CURSOR_SHOW_AT, PANEL_CURSOR_BLINK_AT, PANEL_CURSOR_BLINK_INTERVAL,
    PANEL_COLOR_CARD_BG, PANEL_COLOR_TITLEBAR, PANEL_COLOR_PROMPTBAR,
    PANEL_COLOR_TRAFFIC_RED, PANEL_COLOR_TRAFFIC_YELLOW, PANEL_COLOR_TRAFFIC_GREEN,
    PANEL_COLOR_TITLE_TEXT, PANEL_COLOR_DIVIDER, PANEL_COLOR_STATUS_DIVIDER,
    PANEL_COLOR_PROMPT_USER, PANEL_COLOR_PROMPT_CMD,
    PANEL_COLOR_CHAR_INFLIGHT, PANEL_COLOR_CHAR_LABEL, PANEL_COLOR_CHAR_BODY,
    PANEL_COLOR_CURSOR, PANEL_COLOR_STATUS_TEXT, PANEL_COLOR_BORDER,
} from '../../constants/amaze-me';

export interface SectionData {
    title: string;
    lines: string[];
    xPos: number;
}

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
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
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

    constructor(data: SectionData) {
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

        this.sectionCmd = data.title.replace(/^>\s*/, '').toLowerCase().replace(/\s+/g, '-');
        this.cmdText = 'hildebrand@terminal:~$';
        this.chars = this._buildChars(data.lines);
        this._draw();
    }

    private _buildChars(lines: string[]): CharEntry[] {
        let total = 0;
        lines.forEach(l => { total += (l.startsWith('#') ? l.slice(1) : l).length; });

        const all: CharEntry[] = [];
        let idx = 0;

        lines.forEach((line, li) => {
            if (line === '') return;
            const isLabel = line.startsWith('#');
            const text = isLabel ? line.slice(1) : line;
            const fy = PANEL_FIRST_LINE_Y + li * PANEL_LINE_H;

            for (let ci = 0; ci < text.length; ci++, idx++) {
                const seed = li * 300 + ci;
                all.push({
                    realChar: text[ci],
                    finalX: PANEL_PAD + ci * PANEL_CHAR_W,
                    finalY: fy,
                    sx: (rng(seed)        - 0.5) * PANEL_SCATTER_X,
                    sy: (rng(seed + 1000) - 0.5) * PANEL_SCATTER_Y,
                    d:  (idx / total) * PANEL_STAGGER_MAX,
                    isLabel,
                });
            }
        });
        return all;
    }

    getGroup(): Group { return this.group; }

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
        ctx.roundRect(0, 0, PANEL_CANVAS_W, PANEL_CANVAS_H, 10);
        ctx.fill();

        // ── TITLE BAR ───────────────────────────────────────────────────
        ctx.fillStyle = PANEL_COLOR_TITLEBAR;
        ctx.fillRect(0, 0, PANEL_CANVAS_W, PANEL_TB_H);

        // macOS-style traffic lights
        const lights: [number, string][] = [
            [22, PANEL_COLOR_TRAFFIC_RED],
            [46, PANEL_COLOR_TRAFFIC_YELLOW],
            [70, PANEL_COLOR_TRAFFIC_GREEN],
        ];
        lights.forEach(([lx, lcolor]) => {
            ctx.beginPath();
            ctx.arc(lx, PANEL_TB_H / 2, PANEL_TRAFFIC_LIGHT_R, 0, Math.PI * 2);
            ctx.fillStyle = lcolor;
            ctx.fill();
        });

        // Brand name centred in title bar
        ctx.font = `bold ${PANEL_FONT_SIZE_BRAND}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
        ctx.fillStyle = PANEL_COLOR_TITLE_TEXT;
        ctx.textAlign = 'center';
        ctx.fillText('Hildebrand', PANEL_CANVAS_W / 2, PANEL_TB_H / 2 + 5);
        ctx.textAlign = 'left';

        ctx.fillStyle = PANEL_COLOR_DIVIDER;
        ctx.fillRect(0, PANEL_TB_H - 1, PANEL_CANVAS_W, 1);

        // ── PROMPT BAR ──────────────────────────────────────────────────
        ctx.fillStyle = PANEL_COLOR_PROMPTBAR;
        ctx.fillRect(0, PANEL_TB_H, PANEL_CANVAS_W, PANEL_PB_H);

        ctx.font = `bold ${PANEL_FONT_SIZE_PROMPT}px "Courier New", monospace`;
        ctx.fillStyle = PANEL_COLOR_PROMPT_USER;
        ctx.fillText(this.cmdText, PANEL_PAD, PANEL_TB_H + 23);
        const pw = ctx.measureText(this.cmdText).width + 4;
        ctx.fillStyle = PANEL_COLOR_PROMPT_CMD;
        ctx.fillText(`./run ${this.sectionCmd}`, PANEL_PAD + pw, PANEL_TB_H + 23);

        ctx.fillStyle = PANEL_COLOR_DIVIDER;
        ctx.fillRect(0, PANEL_TB_H + PANEL_PB_H - 1, PANEL_CANVAS_W, 1);

        // ── ANIMATED CHARACTERS ─────────────────────────────────────────
        ctx.font = `${PANEL_FONT_SIZE}px "Courier New", monospace`;

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
                const fi = Math.floor(p * 28 + ch.finalX * 0.09 + ch.finalY * 0.04);
                glyph = rng(fi + ch.d * 90) > 0.5 ? hx[0] : hx[1];
            } else {
                // Decode: probability ramps from 0→1 as lp goes DECODE_START→DECODE_LOCK
                const dt = (lp - PANEL_DECODE_START) / (1 - PANEL_DECODE_START);
                const fi = Math.floor(p * 38 + ch.finalX * 0.12 + ch.d * 50);
                glyph    = rng(fi) < dt * dt ? ch.realChar : (rng(fi + 3) > 0.5 ? hx[0] : hx[1]);
            }

            // Color: indigo hex during flight, white/violet once decoded
            const decoded = lp >= PANEL_DECODE_LOCK || (lp > PANEL_CURSOR_BLINK_AT && rng(Math.floor(p * 55) + ch.d * 44) < PANEL_DECODE_SETTLE);
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
                    last.finalX + PANEL_CHAR_W + 2,
                    last.finalY - PANEL_FONT_SIZE + 2,
                    10,
                    PANEL_FONT_SIZE + 3,
                );
            }
        }

        // ── CARD BORDER ─────────────────────────────────────────────────
        ctx.strokeStyle = PANEL_COLOR_BORDER;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.roundRect(0.75, 0.75, PANEL_CANVAS_W - 1.5, PANEL_CANVAS_H - 1.5, 10);
        ctx.stroke();

        // ── STATUS BAR ──────────────────────────────────────────────────
        const sy = PANEL_CANVAS_H - PANEL_SB_H;
        ctx.fillStyle = PANEL_COLOR_TITLEBAR;
        ctx.fillRect(0, sy, PANEL_CANVAS_W, PANEL_SB_H);
        ctx.fillStyle = PANEL_COLOR_STATUS_DIVIDER;
        ctx.fillRect(0, sy, PANEL_CANVAS_W, 1);

        ctx.font = `${PANEL_FONT_SIZE_STATUS}px "Courier New", monospace`;
        ctx.fillStyle = PANEL_COLOR_STATUS_TEXT;
        const pctStr = Math.round(p * 100).toString();
        const pct = pctStr.length === 1 ? '00' + pctStr : pctStr.length === 2 ? '0' + pctStr : pctStr;
        ctx.fillText(`DECODE ${pct}%  ·  hildebrand.dev  ·  ESC to exit`, PANEL_PAD, sy + 20);
    }

    dispose(): void {
        const mat = this.mesh.material;
        mat.map?.dispose();
        mat.dispose();
        this.mesh.geometry.dispose();
        this.texture.dispose();
    }
}
