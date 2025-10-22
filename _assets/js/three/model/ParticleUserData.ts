import { type Vector3 } from "three"

export type ParticleUserData = {
    radius: number;
    speed: number;
    angle: number;
    velocity: Vector3;
}