import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Clock,
    AmbientLight,
    MathUtils,
} from 'three';
import { MatrixRain } from './MatrixRain';
import { GlobeSection } from './GlobeSection';
import { SectionPanel } from './SectionPanel';
import { CameraAnimator } from './CameraAnimator';
import { PostProcessor } from './PostProcessor';
import type { IDisposable } from '@/interface/AmazeMe';
import {
    CAM_FOV, CAM_NEAR, CAM_FAR, CAM_Z,
    MAX_PIXEL_RATIO,
    SCENE_BG_COLOR, SCENE_AMBIENT_COLOR,
    RAIN_MESH_Z, PANEL_FADE_DISTANCE,
    GLOBE_WHEEL_TOTAL_PX, GLOBE_WHEEL_UNLOCK_RATIO,
    ZOOM_WHEEL_TOTAL_PX,
    RESUME_SECTIONS,
    SECTION_LABELS,
    SECTION_GLOBE_INDEX,
    SECTION_PANEL_INDEX_OFFSET,
    SECTION_INITIAL_INDEX,
    SECTION_SPACING,
    SCROLL_PROGRESS_MIN,
    SCROLL_PROGRESS_MAX,
    RENDERER_CLEAR_ALPHA,
    ESCAPE_REDIRECT_URL,
    PANEL_WORLD_W,
    PANEL_VIEWPORT_FILL,
} from '../../constants/amaze-me';

export class AmazeMeApp implements IDisposable {
    private readonly renderer: WebGLRenderer;
    private readonly camera: PerspectiveCamera;
    private readonly scene: Scene;
    private readonly clock: Clock;
    private readonly matrixRain: MatrixRain;
    private readonly globeSection: GlobeSection;
    private readonly panels: SectionPanel[];
    private readonly cameraAnimator: CameraAnimator;
    private readonly postProcessor: PostProcessor;

    // HUD element refs — queried once, never re-queried in hot path
    private readonly hudLabel: HTMLElement | null;
    private readonly dots: NodeListOf<Element>;
    private readonly scrollHint: HTMLElement | null;
    private readonly continueCard: HTMLElement | null;

    private animationId = 0;
    private lastSectionIndex = SECTION_INITIAL_INDEX;
    private globeWheelAccum  = 0;   // accumulated wheel-delta while globe is locked
    private globeUnlocked    = false; // true once globe has rotated to Philippines
    private zoomWheelAccum   = 0;   // accumulated wheel-delta during zoom lock phase
    private zoomUnlocked     = false; // true once intro zoom has completed

    constructor(wrapper: HTMLElement) {
        this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(SCENE_BG_COLOR, RENDERER_CLEAR_ALPHA);
        this.renderer.domElement.style.pointerEvents = 'none';
        wrapper.appendChild(this.renderer.domElement);

        this.camera = new PerspectiveCamera(
            CAM_FOV,
            window.innerWidth / window.innerHeight,
            CAM_NEAR,
            CAM_FAR,
        );
        // Camera is at z=CAM_Z, panels are at z=0 — camera looks at panels from in front
        this.camera.position.set(0, 0, CAM_Z);

        this.scene = new Scene();
        // Subtle indigo ambient so panels aren't pitch black at low opacity
        this.scene.add(new AmbientLight(SCENE_AMBIENT_COLOR, 1));

        this.clock = new Clock();

        this.matrixRain = new MatrixRain();
        // Place the rain plane behind the panels, following camera X each frame
        this.matrixRain.getMesh().position.set(0, 0, RAIN_MESH_Z);
        this.scene.add(this.matrixRain.getMesh());

        this.globeSection = new GlobeSection(0);
        this.scene.add(this.globeSection.getGroup());

        this.panels = RESUME_SECTIONS.map(data => {
            const panel = new SectionPanel(data);
            this.scene.add(panel.getGroup());
            return panel;
        });
        const initScale = this._panelScale(window.innerWidth, window.innerHeight);
        this.panels.forEach(p => p.resize(initScale));
        const numSections = this.panels.length + SECTION_PANEL_INDEX_OFFSET;

        this.cameraAnimator = new CameraAnimator(
            this.camera,
            numSections,
            SECTION_SPACING,
        );

        this.postProcessor = new PostProcessor(this.renderer, this.scene, this.camera);

        // HUD references
        this.hudLabel  = document.getElementById('am-section-label');
        this.dots      = document.querySelectorAll('.am-progress-dot');
        this.scrollHint = document.getElementById('am-scroll-hint');
        this.continueCard = document.getElementById('am-section-continue-card');

        this._updateHud(SECTION_GLOBE_INDEX);
        this._setupEvents();
        this._animate();
    }

    private _setupEvents(): void {
        window.addEventListener('scroll', this._onScroll, { passive: true });
        window.addEventListener('resize', this._onResize);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('wheel', this._onWheel, { passive: false });
    }

    private readonly _onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'ArrowRight') {
            // Bypass both intro wheel-locks when navigating via keyboard
            if (this.cameraAnimator.getSectionIndex() === SECTION_GLOBE_INDEX) {
                this._completeGlobeIntro();
            }
            this.cameraAnimator.scrollToSection(this.cameraAnimator.getSectionIndex() + SECTION_PANEL_INDEX_OFFSET);
            this._hideScrollHint();
        } else if (e.key === 'ArrowLeft') {
            this.cameraAnimator.scrollToSection(this.cameraAnimator.getSectionIndex() - SECTION_PANEL_INDEX_OFFSET);
            this._hideScrollHint();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            window.location.href = ESCAPE_REDIRECT_URL;
        }
    };

    private readonly _onWheel = (e: WheelEvent): void => {
        if (this.cameraAnimator.getSectionIndex() === SECTION_GLOBE_INDEX && this.zoomUnlocked) {
            this._prepareGlobeReentry();
        }

        // Both intro locks passed — let native scroll handle things
        if (this.zoomUnlocked) return;

        // If camera has somehow drifted past section 0, release both locks
        if (this.cameraAnimator.getSectionIndex() !== SECTION_GLOBE_INDEX) {
            this.globeUnlocked = true;
            this.zoomUnlocked  = true;
            return;
        }

        e.preventDefault();

        if (!this.globeUnlocked) {
            // Phase 1: globe rotation lock — bidirectional
            this.globeWheelAccum = MathUtils.clamp(this.globeWheelAccum + e.deltaY, SCROLL_PROGRESS_MIN, GLOBE_WHEEL_TOTAL_PX);
            const rotProgress = this.globeWheelAccum / GLOBE_WHEEL_TOTAL_PX;
            this.globeSection.setRotationProgress(rotProgress);
            if (rotProgress >= GLOBE_WHEEL_UNLOCK_RATIO) {
                this.globeUnlocked = true;
            }
            return;
        }

        // Phase 2: zoom lock — bidirectional; backward scroll past zero re-enters phase 1
        this.zoomWheelAccum = MathUtils.clamp(this.zoomWheelAccum + e.deltaY, SCROLL_PROGRESS_MIN, ZOOM_WHEEL_TOTAL_PX);
        const zoomProgress = this.zoomWheelAccum / ZOOM_WHEEL_TOTAL_PX;
        this.globeSection.setZoomProgress(zoomProgress);
        if (this.zoomWheelAccum === SCROLL_PROGRESS_MIN) {
            this.globeUnlocked = false; // slip back into phase 1 on next wheel event
        }
        if (zoomProgress >= SCROLL_PROGRESS_MAX) {
            this.zoomUnlocked = true;
            this.cameraAnimator.scrollToSection(SECTION_PANEL_INDEX_OFFSET);
        }
    };

    private readonly _onScroll = (): void => {
        this.cameraAnimator.onScroll();
        this._hideScrollHint();
    };

    private _panelScale(w: number, h: number): number {
        const visW = 2 * Math.tan(MathUtils.DEG2RAD * CAM_FOV / 2) * CAM_Z * (w / h);
        return (visW * PANEL_VIEWPORT_FILL) / PANEL_WORLD_W;
    }

    private readonly _onResize = (): void => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.postProcessor.resize(w, h);
        const scale = this._panelScale(w, h);
        this.panels.forEach(p => p.resize(scale));
    };

    private readonly _animate = (): void => {
        this.animationId = requestAnimationFrame(this._animate);
        const delta   = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Keep rain plane centered on camera X (covers screen at all scroll positions)
        this.matrixRain.getMesh().position.x = this.camera.position.x;

        this.matrixRain.update(delta, elapsed);
        this.cameraAnimator.update(delta, elapsed);

        const progress = this.cameraAnimator.getScrollProgress();

        const globeDist = Math.abs(progress - SECTION_GLOBE_INDEX);
        this.globeSection.setTargetOpacity(MathUtils.clamp(SCROLL_PROGRESS_MAX - globeDist / PANEL_FADE_DISTANCE, SCROLL_PROGRESS_MIN, SCROLL_PROGRESS_MAX));
        this.globeSection.update(delta, elapsed);

        // Text panels occupy indices 1..N
        this.panels.forEach((panel, i) => {
            const sectionProgress = (i + SECTION_PANEL_INDEX_OFFSET) / this.panels.length;
            const distance = Math.abs(progress - sectionProgress);
            const opacity = MathUtils.clamp(SCROLL_PROGRESS_MAX - distance / PANEL_FADE_DISTANCE, SCROLL_PROGRESS_MIN, SCROLL_PROGRESS_MAX);
            panel.setTargetOpacity(opacity);
            panel.update(delta, elapsed);
        });

        const currentIndex = this.cameraAnimator.getSectionIndex();
        if (currentIndex !== this.lastSectionIndex) {
            if (currentIndex === SECTION_GLOBE_INDEX && this.lastSectionIndex > SECTION_GLOBE_INDEX) {
                this._prepareGlobeReentry();
            }
            this._updateHud(currentIndex);
            this.lastSectionIndex = currentIndex;
        }

        this.postProcessor.render();
    };

    private _prepareGlobeReentry(): void {
        this.globeWheelAccum = GLOBE_WHEEL_TOTAL_PX;
        this.zoomWheelAccum = ZOOM_WHEEL_TOTAL_PX;
        this.globeUnlocked = true;
        this.zoomUnlocked = false;
        this.globeSection.setRotationProgress(SCROLL_PROGRESS_MAX);
        this.globeSection.setZoomProgress(SCROLL_PROGRESS_MAX);
    }

    private _completeGlobeIntro(): void {
        this.globeUnlocked = true;
        this.zoomUnlocked = true;
        this.globeSection.setRotationProgress(SCROLL_PROGRESS_MAX);
        this.globeSection.setZoomProgress(SCROLL_PROGRESS_MAX);
    }

    private _hideScrollHint(): void {
        this.scrollHint?.classList.add('hidden');
    }

    private _updateHud(index: number): void {
        if (this.hudLabel) {
            this.hudLabel.textContent = SECTION_LABELS[index] ?? '';
        }
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        this.continueCard?.classList.toggle('hidden', index !== SECTION_GLOBE_INDEX);
    }

    dispose(): void {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('wheel', this._onWheel);
        this.matrixRain.dispose();
        this.globeSection.dispose();
        this.panels.forEach(p => p.dispose());
        this.cameraAnimator.dispose();
        this.postProcessor.dispose();
        this.renderer.dispose();
    }
}
