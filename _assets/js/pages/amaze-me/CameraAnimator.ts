import { PerspectiveCamera, MathUtils } from 'three';
import type { IAnimatable } from './interfaces';
import {
    CAM_LERP_BASE,
    CAM_BREATHE_SPEED, CAM_BREATHE_AMPLITUDE,
    CAM_SWAY_SPEED, CAM_SWAY_AMPLITUDE, CAM_LOOK_SWAY_SPEED,
    SNAP_FORWARD_THRESHOLD, SNAP_DEBOUNCE_MS, SNAP_FALLBACK_MS,
    SNAP_ARRIVAL_PX, SNAP_INTERRUPT_PX,
} from '../../constants/amaze-me';

export class CameraAnimator implements IAnimatable {
    private readonly camera: PerspectiveCamera;
    private readonly numSections: number;
    private readonly sectionSpacing: number;
    private scrollProgress = 0;
    private currentX = 0;
    private targetX = 0;

    private snapTimer: ReturnType<typeof setTimeout> | null = null;
    private snapFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    private isSnapping = false;
    private snapTargetY = 0;
    private snapStartY = 0;

    constructor(camera: PerspectiveCamera, numSections: number, sectionSpacing: number) {
        this.camera = camera;
        this.numSections = numSections;
        this.sectionSpacing = sectionSpacing;
    }

    onScroll(): void {
        const scrollTop = window.scrollY;
        const scrollMax = document.body.scrollHeight - window.innerHeight;
        this.scrollProgress = scrollMax > 0 ? MathUtils.clamp(scrollTop / scrollMax, 0, 1) : 0;
        this.targetX = this.scrollProgress * (this.numSections - 1) * this.sectionSpacing;

        if (this.isSnapping) {
            const deviation = Math.abs(scrollTop - this.snapTargetY);
            const initialDeviation = Math.abs(this.snapStartY - this.snapTargetY);

            if (deviation < SNAP_ARRIVAL_PX) {
                // Arrived — position-based completion
                this._clearSnap();
            } else if (deviation > initialDeviation + SNAP_INTERRUPT_PX) {
                // User scrolled past the starting point away from target — cancel snap
                this._clearSnap();
            }
            return;
        }

        if (this.snapTimer !== null) clearTimeout(this.snapTimer);
        this.snapTimer = setTimeout(() => this._snap(), SNAP_DEBOUNCE_MS);
    }

    private _clearSnap(): void {
        this.isSnapping = false;
        if (this.snapFallbackTimer !== null) {
            clearTimeout(this.snapFallbackTimer);
            this.snapFallbackTimer = null;
        }
    }

    private _snap(): void {
        const scrollMax = document.body.scrollHeight - window.innerHeight;
        if (scrollMax <= 0) return;

        const sectionFloat = this.scrollProgress * (this.numSections - 1);
        const base = Math.floor(sectionFloat);
        const frac = sectionFloat - base;
        const snapIndex = MathUtils.clamp(
            frac > SNAP_FORWARD_THRESHOLD ? base + 1 : base,
            0,
            this.numSections - 1,
        );

        this.snapTargetY = (snapIndex / (this.numSections - 1)) * scrollMax;
        this.snapStartY = window.scrollY;
        this.isSnapping = true;
        window.scrollTo({ top: this.snapTargetY, behavior: 'smooth' });

        // Fallback: release lock if scroll events stop arriving (e.g. snap already at target)
        if (this.snapFallbackTimer !== null) clearTimeout(this.snapFallbackTimer);
        this.snapFallbackTimer = setTimeout(() => { this.isSnapping = false; }, SNAP_FALLBACK_MS);
    }

    getScrollProgress(): number { return this.scrollProgress; }

    getSectionIndex(): number {
        return Math.round(this.scrollProgress * (this.numSections - 1));
    }

    update(delta: number, elapsed: number): void {
        const t = 1 - Math.pow(CAM_LERP_BASE, delta);
        this.currentX = MathUtils.lerp(this.currentX, this.targetX, t);

        this.camera.position.x = this.currentX;
        // Subtle vertical breathe so the scene feels alive
        this.camera.position.y = Math.sin(elapsed * CAM_BREATHE_SPEED) * CAM_BREATHE_AMPLITUDE;
        this.camera.lookAt(
            this.currentX + Math.sin(elapsed * CAM_SWAY_SPEED) * CAM_SWAY_AMPLITUDE,
            Math.sin(elapsed * CAM_LOOK_SWAY_SPEED) * CAM_SWAY_AMPLITUDE,
            0,
        );
    }

    dispose(): void {
        if (this.snapTimer !== null) clearTimeout(this.snapTimer);
        if (this.snapFallbackTimer !== null) clearTimeout(this.snapFallbackTimer);
    }
}
