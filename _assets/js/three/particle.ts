import { Color, ColorRepresentation, Mesh, Object3DEventMap, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { type ParticleUserData } from './model/ParticleUserData';
import { NoMouseWorldError } from './error';

class Particle {
    particles: Mesh<SphereGeometry, ShaderMaterial, Object3DEventMap>[] = [];
    totalParticles: number = 75;
    radius: number = 2.5;
    width: number = 24;
    height: number = 24;
    gradientTopColor: ColorRepresentation = 0xFF4E50;
    gradientBottomColor: ColorRepresentation = 0xF9D423;

    geometry: SphereGeometry | undefined;
    material: ShaderMaterial | undefined;
    mouseWorld: Vector3 | null = null;

    constructor() {
        this.geometry = new SphereGeometry(this.radius, this.width, this.height);

        this.material = new ShaderMaterial({
                    uniforms: this.getMaterialUniforms(),
                    vertexShader: this.getVertexShader(),
                    fragmentShader: this.getFragmentShader(),
                });
    }

    createParticles(createdParticles = (particle: Mesh<SphereGeometry, ShaderMaterial, Object3DEventMap>): void => undefined) {
        this.particles = [];
        for (let i = 0; i < this.totalParticles; i++) {
            const particle = new Mesh(this.geometry, this.material);
    
            // Scatter particles randomly in a larger space initially
            const radius = 50 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
    
            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
            particle.position.z = radius * Math.cos(phi);
    
            // Store original position and additional properties for animation
            particle.userData = {
                radius: radius,
                speed: 0.01 + Math.random() * 0.02,
                angle: Math.random() * Math.PI * 2,
                velocity: new Vector3(0, 0, 0)
            } as ParticleUserData;

            this.particles.push(particle);

            createdParticles(particle);
        }
    }

    gravityAttraction() {
        // First pass: calculate forces and update velocities
        this.particles.forEach((particle, index) => {

            // Calculate gravity force towards center
            const gravityCenter = new Vector3(0, 0, 0);
            const directionToCenter = gravityCenter.clone().sub(particle.position);

            // Apply gravity force
            const gravityStrength = 0.05;
            const gravity = directionToCenter.normalize().multiplyScalar(gravityStrength);

            // Apply velocity with damping
            const damping = 0.98;
            particle.userData.velocity.add(gravity);
            particle.userData.velocity.multiplyScalar(damping);

            this._collisionDetection(index, particle);

            this._mouseRepulsion(particle);
        });
    }

    addBoundsParticles() {
        // Second pass: update positions
        this.particles.forEach(particle => {
            // Update position
            particle.position.add(particle.userData.velocity);

            // Add some bounds to keep particles from going too far
            const maxDistance = 100;
            if (particle.position.length() > maxDistance) {
                particle.position.normalize().multiplyScalar(maxDistance);
                particle.userData.velocity.multiplyScalar(0.8); // Bounce effect
            }
        });
    }

    _mouseRepulsion(particle: Mesh<SphereGeometry, ShaderMaterial, Object3DEventMap>) {
        if (!this.mouseWorld) {
            throw new NoMouseWorldError();
        }
        // Calculate mouse repulsion
        const distanceToMouse = particle.position.distanceTo(this.mouseWorld);
        const repulsionStrength = Math.max(0, 1 - distanceToMouse / 15) * 2;

        if (distanceToMouse < 30) {
            const repulsionVector = particle.position.clone()
                .sub(this.mouseWorld)
                .normalize()
                .multiplyScalar(repulsionStrength);
            particle.userData.velocity.add(repulsionVector);
        }
    }

    _collisionDetection(_index: number, particle: Mesh<SphereGeometry, ShaderMaterial, Object3DEventMap>) {
        // Check collision with other particles
        for (let j = _index + 1; j < this.particles.length; j++) {
            const otherParticle = this.particles[j];
            const diff = particle.position.clone().sub(otherParticle.position);
            const dist = diff.length();

            // Collision detection (using particle size as threshold)
            const minDist = 5; // Minimum distance between particles
            if (dist < minDist) {
                // Calculate collision response
                const normal = diff.normalize();

                // Bounce particles apart
                const bounceForce = normal.multiplyScalar(0.5 / Math.max(0.1, dist));
                particle.userData.velocity.add(bounceForce);
                otherParticle.userData.velocity.sub(bounceForce);

                // Move particles apart to prevent sticking
                const correction = normal.multiplyScalar((minDist - dist) * 0.5);
                particle.position.add(correction);
                otherParticle.position.sub(correction);
            }
        }
    }

    getParticles() {
        return this.particles;
    }

    getMaterialUniforms() {
        return {
            color1: { value: new Color(this.gradientTopColor) }, // Top color (reddish)
            color2: { value: new Color(this.gradientBottomColor) }, // Bottom color (yellowish)
        }
    }

    getVertexShader() {
        return `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `
    }

    getFragmentShader() {
        return `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec3 vPosition;
            void main() {
                float gradient = (vPosition.y + 2.5) / 5.0; // Normalize y position
                gl_FragColor = vec4(mix(color2, color1, gradient), 1.0);
            }
        `
    }
}

export default Particle;