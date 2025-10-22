import { MOUSE, PerspectiveCamera, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Scene from './scene';
import Particle from './particle';

function sceneInit() {
    const scene = new Scene();
    const sceneThree = scene.getScene();

    scene.setBackground(null);
    scene.ambientLight();
    scene.directionalLight();

    return sceneThree;
}

function cameraInit() {
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    return camera;
}

function rendererInit() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    return renderer;
}

function controlsInit(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;      // Disable mouse wheel zoom
    controls.mouseButtons = {
        LEFT: MOUSE.ROTATE,
        MIDDLE: null,     // Disable middle mouse button
        RIGHT: null       // Disable right mouse button
    };

    return controls;
}

function mouseMoveEventLister(mouse: Vector2, mouseWorld: Vector3, raycaster: Raycaster, camera: PerspectiveCamera) {
    document.addEventListener('mousemove', (event) => {
        // Convert mouse position to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update world position of mouse
        raycaster.setFromCamera(mouse, camera);
        mouseWorld.copy(raycaster.ray.direction).multiplyScalar(20).add(camera.position);
    });
}

function resizeEventListener(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export function initThree() {
    document.addEventListener('DOMContentLoaded', () => {

        const sceneThree = sceneInit();
        const camera = cameraInit();
        const renderer = rendererInit();

        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';

        document.body.appendChild(renderer.domElement);
    
        const controls = controlsInit(camera, renderer);
        
        const mouse = new Vector2();
        const mouseWorld = new Vector3();
        const raycaster = new Raycaster();
        const particleClass = new Particle();
        
        particleClass.createParticles((_particle) => sceneThree.add(_particle));

        mouseMoveEventLister(mouse, mouseWorld, raycaster, camera);

        function animate() {
            const animationId = requestAnimationFrame(animate);
            
            try {
                particleClass.mouseWorld = mouseWorld;
                particleClass.gravityAttraction();
                particleClass.addBoundsParticles();
            } catch (error) {
                cancelAnimationFrame(animationId);
                console.error(error)
            }
    
            controls.update();
            renderer.render(sceneThree, camera);
        }
    
        resizeEventListener(camera, renderer);
        animate();
    });
}
