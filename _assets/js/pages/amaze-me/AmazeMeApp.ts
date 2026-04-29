import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Clock,
    AmbientLight,
    MathUtils,
} from 'three';
import { MatrixRain } from './MatrixRain';
import { SectionPanel } from './SectionPanel';
import { CameraAnimator } from './CameraAnimator';
import { PostProcessor } from './PostProcessor';
import type { SectionData } from './SectionPanel';
import type { IDisposable } from './interfaces';
import {
    SECTION_SPACING,
    CAM_FOV, CAM_NEAR, CAM_FAR, CAM_Z,
    MAX_PIXEL_RATIO,
    SCENE_BG_COLOR, SCENE_AMBIENT_COLOR,
    RAIN_MESH_Z, PANEL_FADE_DISTANCE,
} from '../../constants/amaze-me';

const RESUME_SECTIONS: SectionData[] = [
    {
        title: '> HILDEBRAND E. LIGTAS',
        xPos: 0,
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
        xPos: SECTION_SPACING,
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
        xPos: SECTION_SPACING * 2,
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
        xPos: SECTION_SPACING * 3,
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
        xPos: SECTION_SPACING * 4,
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

const SECTION_LABELS = [
    '// 01 · PROFILE',
    '// 02 · EXPERIENCE',
    '// 03 · EDUCATION',
    '// 04 · SKILLS',
    '// 05 · CONTACT',
];

export class AmazeMeApp implements IDisposable {
    private readonly renderer: WebGLRenderer;
    private readonly camera: PerspectiveCamera;
    private readonly scene: Scene;
    private readonly clock: Clock;
    private readonly matrixRain: MatrixRain;
    private readonly panels: SectionPanel[];
    private readonly cameraAnimator: CameraAnimator;
    private readonly postProcessor: PostProcessor;

    // HUD element refs — queried once, never re-queried in hot path
    private readonly hudLabel: HTMLElement | null;
    private readonly dots: NodeListOf<Element>;
    private readonly scrollHint: HTMLElement | null;

    private animationId = 0;
    private lastSectionIndex = -1;

    constructor(wrapper: HTMLElement) {
        this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(SCENE_BG_COLOR, 1);
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

        this.panels = RESUME_SECTIONS.map(data => {
            const panel = new SectionPanel(data);
            this.scene.add(panel.getGroup());
            return panel;
        });

        this.cameraAnimator = new CameraAnimator(
            this.camera,
            RESUME_SECTIONS.length,
            SECTION_SPACING,
        );

        this.postProcessor = new PostProcessor(this.renderer, this.scene, this.camera);

        // HUD references
        this.hudLabel  = document.getElementById('am-section-label');
        this.dots      = document.querySelectorAll('.am-progress-dot');
        this.scrollHint = document.getElementById('am-scroll-hint');

        this._updateHud(0);
        this._setupEvents();
        this._animate();
    }

    private _setupEvents(): void {
        window.addEventListener('scroll', this._onScroll, { passive: true });
        window.addEventListener('resize', this._onResize);
    }

    private readonly _onScroll = (): void => {
        this.cameraAnimator.onScroll();
        if (this.scrollHint) this.scrollHint.classList.add('hidden');
    };

    private readonly _onResize = (): void => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.postProcessor.resize(w, h);
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
        const numSections = this.panels.length;

        this.panels.forEach((panel, i) => {
            const sectionProgress = i / (numSections - 1);
            const distance = Math.abs(progress - sectionProgress);
            const opacity = MathUtils.clamp(1 - distance / PANEL_FADE_DISTANCE, 0, 1);
            panel.setTargetOpacity(opacity);
            panel.update(delta, elapsed);
        });

        const currentIndex = this.cameraAnimator.getSectionIndex();
        if (currentIndex !== this.lastSectionIndex) {
            this._updateHud(currentIndex);
            this.lastSectionIndex = currentIndex;
        }

        this.postProcessor.render();
    };

    private _updateHud(index: number): void {
        if (this.hudLabel) {
            this.hudLabel.textContent = SECTION_LABELS[index] ?? '';
        }
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dispose(): void {
        cancelAnimationFrame(this.animationId);
        window.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('resize', this._onResize);
        this.matrixRain.dispose();
        this.panels.forEach(p => p.dispose());
        this.cameraAnimator.dispose();
        this.postProcessor.dispose();
        this.renderer.dispose();
    }
}
