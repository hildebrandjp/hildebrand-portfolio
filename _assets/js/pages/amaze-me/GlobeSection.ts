import {
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Group,
    MathUtils,
    TextureLoader,
    BufferGeometry,
    LineBasicMaterial,
    Line,
    Vector3,
    BackSide,
    AdditiveBlending,
} from 'three';
import type { IDisposable, IAnimatable } from '@/interface/AmazeMe';
import {
    GLOBE_RADIUS, GLOBE_ARC_LIFT, GLOBE_ARC_SEGMENTS, GLOBE_SCALE_MAX,
    GLOBE_ZOOM_Y_OFFSET_PX, GLOBE_PHASE_ARCS,
    GLOBE_INITIAL_Y_ROT, GLOBE_CEBU_Y_ROT,
    GLOBE_ARC_COLOR, GLOBE_CEBU_DOT_COLOR, GLOBE_LERP_BASE,
    CAM_FOV, CAM_Z,
    GLOBE_TEXTURE_URL, GLOBE_PROFILE_ID, GLOBE_PROFILE_IMAGE_URL,
    GLOBE_PROFILE_IMAGE_ALT, GLOBE_PROFILE_NAME, GLOBE_PROFILE_TITLE,
    GLOBE_PROFILE_LOCATION, GLOBE_PROFILE_OPACITY_INITIAL,
    GLOBE_PROFILE_OPACITY_PRECISION, GLOBE_SPHERE_WIDTH_SEGMENTS,
    GLOBE_SPHERE_HEIGHT_SEGMENTS, GLOBE_ATMOS_WIDTH_SEGMENTS,
    GLOBE_ATMOS_HEIGHT_SEGMENTS, GLOBE_DOT_WIDTH_SEGMENTS,
    GLOBE_DOT_HEIGHT_SEGMENTS, GLOBE_ATMOS_SCALE, GLOBE_DOT_SCALE,
    GLOBE_DOT_SURFACE_SCALE, GLOBE_ATMOS_COLOR, GLOBE_ATMOS_OPACITY_SCALE,
    GLOBE_ARC_STAGGER_SCALE, GLOBE_ARC_FADE_SCALE, GLOBE_ARC_OPACITY_MAX,
    GLOBE_DOT_FADE_IN_SCALE, GLOBE_DOT_FADE_IN_OFFSET,
    GLOBE_DOT_FADE_OUT_START, GLOBE_DOT_FADE_OUT_SCALE,
    GLOBE_PROFILE_FADE_START, GLOBE_PROFILE_FADE_SCALE,
    GLOBE_CONNECTIONS, GLOBE_CEBU, DEG_TO_RAD,
} from '../../constants/amaze-me';
import type { GeoPoint } from '../../constants/amaze-me';

// Matches Three.js SphereGeometry UV convention for equirectangular textures
function latLonToVec3(lat: number, lon: number, r: number): Vector3 {
    const phi   = (90 - lat) * DEG_TO_RAD;
    const theta = (lon + 180) * DEG_TO_RAD;
    return new Vector3(
        -r * Math.cos(theta) * Math.sin(phi),
         r * Math.cos(phi),
         r * Math.sin(theta) * Math.sin(phi),
    );
}

function buildArc(
    from: GeoPoint,
    to:   GeoPoint,
): Line {
    const fromV = latLonToVec3(from.lat, from.lon, 1);
    const toV   = latLonToVec3(to.lat,   to.lon,   1);
    const pts: Vector3[] = [];
    for (let i = 0; i <= GLOBE_ARC_SEGMENTS; i++) {
        const t = i / GLOBE_ARC_SEGMENTS;
        const v = fromV.clone().lerp(toV, t).normalize();
        pts.push(v.multiplyScalar(GLOBE_RADIUS * (1 + GLOBE_ARC_LIFT * Math.sin(t * Math.PI))));
    }
    const mat = new LineBasicMaterial({ color: GLOBE_ARC_COLOR, transparent: true, opacity: 0 });
    return new Line(new BufferGeometry().setFromPoints(pts), mat);
}

function buildProfileOverlay(): HTMLElement {
    const el = document.createElement('div');
    el.id = GLOBE_PROFILE_ID;
    el.style.opacity = GLOBE_PROFILE_OPACITY_INITIAL;
    el.innerHTML = `
        <img src="${GLOBE_PROFILE_IMAGE_URL}" class="am-glob-avatar" alt="${GLOBE_PROFILE_IMAGE_ALT}" />
        <div class="am-glob-info">
            <div class="am-glob-name">${GLOBE_PROFILE_NAME}</div>
            <div class="am-glob-title">${GLOBE_PROFILE_TITLE}</div>
            <div class="am-glob-loc">${GLOBE_PROFILE_LOCATION}</div>
        </div>`;
    document.body.appendChild(el);
    return el;
}

export class GlobeSection implements IDisposable, IAnimatable {
    private readonly group:     Group;
    private readonly globeGroup: Group; // scales independently from profile overlay
    private readonly globeMesh: Mesh<SphereGeometry, MeshBasicMaterial>;
    private readonly atmosMesh: Mesh<SphereGeometry, MeshBasicMaterial>;
    private readonly cebuDot:   Mesh<SphereGeometry, MeshBasicMaterial>;
    private readonly arcs:      Line[];
    private readonly profileEl: HTMLElement;

    private anim             = 0;
    private targetAnim       = 0;
    private rotationProgress = 0;                      // 0-1, set by AmazeMeApp via wheel
    private targetRotationY  = GLOBE_INITIAL_Y_ROT;   // lerp target for globe mesh Y
    private zoomProgress     = 0;                      // 0-1, set by AmazeMeApp via wheel (phase 2)

    constructor(xPos: number) {
        this.group = new Group();
        this.group.position.set(xPos, 0, 0);

        this.globeGroup = new Group();
        this.group.add(this.globeGroup);

        // Earth sphere
        const globeMat = new MeshBasicMaterial({ transparent: true, opacity: 0 });
        this.globeMesh = new Mesh(
            new SphereGeometry(GLOBE_RADIUS, GLOBE_SPHERE_WIDTH_SEGMENTS, GLOBE_SPHERE_HEIGHT_SEGMENTS),
            globeMat,
        );
        this.globeMesh.rotation.y = GLOBE_INITIAL_Y_ROT;
        this.globeGroup.add(this.globeMesh);

        new TextureLoader().load(GLOBE_TEXTURE_URL, tex => {
            globeMat.map = tex;
            globeMat.needsUpdate = true;
        });

        // Thin atmosphere glow (inner-facing larger sphere with additive blend)
        const atmosMat = new MeshBasicMaterial({
            color: GLOBE_ATMOS_COLOR,
            transparent: true,
            opacity: 0,
            side: BackSide,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        this.atmosMesh = new Mesh(
            new SphereGeometry(GLOBE_RADIUS * GLOBE_ATMOS_SCALE, GLOBE_ATMOS_WIDTH_SEGMENTS, GLOBE_ATMOS_HEIGHT_SEGMENTS),
            atmosMat,
        );
        this.globeGroup.add(this.atmosMesh);

        // Cebu location dot (child of globeMesh so it rotates with globe)
        const dotMat = new MeshBasicMaterial({ color: GLOBE_CEBU_DOT_COLOR, transparent: true, opacity: 0 });
        this.cebuDot = new Mesh(
            new SphereGeometry(GLOBE_RADIUS * GLOBE_DOT_SCALE, GLOBE_DOT_WIDTH_SEGMENTS, GLOBE_DOT_HEIGHT_SEGMENTS),
            dotMat,
        );
        this.cebuDot.position.copy(latLonToVec3(GLOBE_CEBU.lat, GLOBE_CEBU.lon, GLOBE_RADIUS * GLOBE_DOT_SURFACE_SCALE));
        this.globeMesh.add(this.cebuDot);

        // Connection arcs (children of globeMesh, rotate with globe)
        this.arcs = GLOBE_CONNECTIONS.map(city => buildArc(city, GLOBE_CEBU));
        this.arcs.forEach(arc => this.globeMesh.add(arc));

        // HTML profile overlay (lives in DOM, not Three.js scene)
        this.profileEl = buildProfileOverlay();
    }

    getGroup(): Group { return this.group; }

    setTargetOpacity(proximity: number): void {
        this.targetAnim = MathUtils.clamp(proximity, 0, 1);
    }

    // Called by AmazeMeApp with accumulated wheel progress (0-1)
    setRotationProgress(p: number): void {
        this.rotationProgress = p;
        const ease = 1 - Math.pow(1 - p, 3);
        this.targetRotationY = MathUtils.lerp(GLOBE_INITIAL_Y_ROT, GLOBE_CEBU_Y_ROT, ease);
    }

    // Called by AmazeMeApp with zoom wheel progress (0-1) during the intro zoom lock phase
    setZoomProgress(p: number): void {
        this.zoomProgress = p;
    }

    update(delta: number, _elapsed: number): void {
        const lerpT = 1 - Math.pow(GLOBE_LERP_BASE, delta);
        this.anim = MathUtils.lerp(this.anim, this.targetAnim, lerpT);

        // Globe + atmosphere fade in based on section proximity
        const globeAlpha = MathUtils.clamp(this.anim / GLOBE_PHASE_ARCS, 0, 1);
        this.globeMesh.material.opacity = globeAlpha;
        this.atmosMesh.material.opacity = globeAlpha * GLOBE_ATMOS_OPACITY_SCALE;

        // Globe rotation: smoothly lerp toward wheel-driven target (globe stays centred)
        this.globeMesh.rotation.y = MathUtils.lerp(
            this.globeMesh.rotation.y, this.targetRotationY, lerpT,
        );

        // Connection arcs: appear staggered as globe rotates toward Philippines
        this.arcs.forEach((arc, i) => {
            const stagger = i / this.arcs.length;
            (arc.material as LineBasicMaterial).opacity = MathUtils.clamp(
                (this.rotationProgress - stagger * GLOBE_ARC_STAGGER_SCALE) * GLOBE_ARC_FADE_SCALE,
                0,
                GLOBE_ARC_OPACITY_MAX,
            );
        });

        // Zoom: driven by wheel accumulator in AmazeMeApp (phase 2 of intro lock)
        const zp = this.zoomProgress;
        const zoomEase = 1 - Math.pow(1 - zp, 3);
        const worldHeight = 2 * Math.tan(MathUtils.degToRad(CAM_FOV) / 2) * CAM_Z;
        // Scale the globe down as it fades out (anim) so it doesn't physically
        // overlap section 01 while its opacity lerp is still converging.
        const zoomScale = MathUtils.lerp(1, GLOBE_SCALE_MAX, zoomEase);
        this.globeGroup.scale.setScalar(MathUtils.lerp(1, zoomScale, this.anim));
        this.globeGroup.position.y = (GLOBE_ZOOM_Y_OFFSET_PX / window.innerHeight) * worldHeight * zoomEase;

        // Cebu dot: fades in during rotation, then fades out during the final zoom.
        const dotFadeIn = MathUtils.clamp(this.rotationProgress * GLOBE_DOT_FADE_IN_SCALE - GLOBE_DOT_FADE_IN_OFFSET, 0, 1);
        const dotFadeOut = 1 - MathUtils.clamp((zp - GLOBE_DOT_FADE_OUT_START) * GLOBE_DOT_FADE_OUT_SCALE, 0, 1);
        this.cebuDot.material.opacity = dotFadeIn * dotFadeOut;

        // Profile overlay: fades in once zoom is ~80% complete
        this.profileEl.style.opacity = MathUtils.clamp(
            (zp - GLOBE_PROFILE_FADE_START) * GLOBE_PROFILE_FADE_SCALE,
            0,
            1,
        ).toFixed(GLOBE_PROFILE_OPACITY_PRECISION);
    }

    dispose(): void {
        this.profileEl.remove();
        this.globeMesh.material.map?.dispose();
        this.globeMesh.material.dispose();
        this.globeMesh.geometry.dispose();
        this.atmosMesh.material.dispose();
        this.atmosMesh.geometry.dispose();
        this.cebuDot.material.dispose();
        this.cebuDot.geometry.dispose();
        this.arcs.forEach(arc => {
            arc.geometry.dispose();
            (arc.material as LineBasicMaterial).dispose();
        });
    }
}
