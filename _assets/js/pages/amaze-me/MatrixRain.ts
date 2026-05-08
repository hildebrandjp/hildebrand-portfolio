import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    CanvasTexture,
    LinearFilter,
    AdditiveBlending,
    DoubleSide,
} from 'three';
import type { IDisposable, IAnimatable } from '@/interface/AmazeMe';
import {
    RAIN_CANVAS_W, RAIN_CANVAS_H,
    RAIN_FONT_SIZE, RAIN_UPDATE_FPS, RAIN_PLANE_SIZE,
    RAIN_CHARS, RAIN_FADE_ALPHA, RAIN_CELL_OFFSET,
    RAIN_BRIGHT_THRESHOLD, RAIN_PRE_ADVANCE,
    RAIN_SPEED_BASE, RAIN_SPEED_VARIANCE,
    RAIN_RESET_THRESHOLD, RAIN_RESET_RANGE,
    RAIN_COLOR_BRIGHT, RAIN_COLOR_BG_RGB,
    RAIN_TRAIL_BRIGHT_MIN, RAIN_TRAIL_BRIGHT_RANGE,
    RAIN_TRAIL_R, RAIN_TRAIL_G, RAIN_TRAIL_B,
} from '../../constants/amaze-me';

export class MatrixRain implements IDisposable, IAnimatable {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    // drops[i] = X column-index of the leading (left-most) character for row i
    // starts beyond left edge, increases each tick (streams right)
    private readonly drops: Float32Array;
    private readonly numRows: number;
    private readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
    private readonly texture: CanvasTexture;
    private timer = 0;
    private readonly frameStep = 1 / RAIN_UPDATE_FPS;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width  = RAIN_CANVAS_W;
        this.canvas.height = RAIN_CANVAS_H;
        this.ctx = this.canvas.getContext('2d')!;

        this.numRows = Math.floor(RAIN_CANVAS_H / RAIN_FONT_SIZE);
        this.drops = new Float32Array(this.numRows);
        const maxCol = RAIN_CANVAS_W / RAIN_FONT_SIZE;
        for (let i = 0; i < this.numRows; i++) {
            // Stagger start positions so streams flow in gradually from the left
            this.drops[i] = -(Math.random() * maxCol);
        }

        this.texture = new CanvasTexture(this.canvas);
        this.texture.minFilter = this.texture.magFilter = LinearFilter;

        const geo = new PlaneGeometry(RAIN_PLANE_SIZE, RAIN_PLANE_SIZE);
        const mat = new MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            side: DoubleSide,
        });
        this.mesh = new Mesh(geo, mat);
    }

    getMesh(): Mesh { return this.mesh; }

    update(delta: number, _elapsed: number): void {
        this.timer += delta;
        if (this.timer < this.frameStep) return;
        this.timer -= this.frameStep;
        this._tick();
    }

    private _tick(): void {
        const { ctx, canvas, drops, numRows } = this;

        // Fade previous frame — higher alpha = shorter tail, less accumulated brightness
        ctx.fillStyle = `rgba(${RAIN_COLOR_BG_RGB}, ${RAIN_FADE_ALPHA})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${RAIN_FONT_SIZE}px "Courier New", monospace`;

        for (let i = 0; i < numRows; i++) {
            const x = drops[i] * RAIN_FONT_SIZE;
            // Skip until the stream enters the canvas from the left
            if (x < 0) {
                drops[i] += RAIN_PRE_ADVANCE;
                continue;
            }

            const y = (i + RAIN_CELL_OFFSET) * RAIN_FONT_SIZE;
            const char = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];

            // Occasional bright head, dimmer trail
            if (Math.random() > RAIN_BRIGHT_THRESHOLD) {
                ctx.fillStyle = RAIN_COLOR_BRIGHT;
            } else {
                const b = RAIN_TRAIL_BRIGHT_MIN + Math.random() * RAIN_TRAIL_BRIGHT_RANGE;
                ctx.fillStyle = `rgb(${Math.floor(RAIN_TRAIL_R * b)},${Math.floor(RAIN_TRAIL_G * b)},${Math.floor(RAIN_TRAIL_B * b)})`;
            }

            ctx.fillText(char, x, y);

            // Advance head right
            drops[i] += RAIN_SPEED_BASE + Math.random() * RAIN_SPEED_VARIANCE;

            // Reset when stream exits right edge
            if (x > canvas.width && Math.random() > RAIN_RESET_THRESHOLD) {
                drops[i] = -(Math.random() * RAIN_RESET_RANGE);
            }
        }

        this.texture.needsUpdate = true;
    }

    dispose(): void {
        this.texture.dispose();
        this.mesh.material.dispose();
        this.mesh.geometry.dispose();
    }
}
