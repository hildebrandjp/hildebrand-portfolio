import { WebGLRenderer, Scene, PerspectiveCamera, Vector2 } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';
import type { IDisposable, IResizable } from '@/interface/AmazeMe';
import {
    BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD,
    VIGNETTE_OFFSET, VIGNETTE_DARKNESS,
} from '../../constants/amaze-me';

export class PostProcessor implements IDisposable, IResizable {
    private readonly composer: EffectComposer;
    private readonly bloomPass: UnrealBloomPass;

    constructor(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        this.bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            BLOOM_STRENGTH,
            BLOOM_RADIUS,
            BLOOM_THRESHOLD,
        );
        this.composer.addPass(this.bloomPass);

        const vignettePass = new ShaderPass(VignetteShader);
        vignettePass.uniforms['offset'].value   = VIGNETTE_OFFSET;
        vignettePass.uniforms['darkness'].value = VIGNETTE_DARKNESS;
        this.composer.addPass(vignettePass);
    }

    render(): void {
        this.composer.render();
    }

    resize(width: number, height: number): void {
        this.composer.setSize(width, height);
        this.bloomPass.resolution.set(width, height);
    }

    dispose(): void {
        this.composer.dispose();
    }
}
