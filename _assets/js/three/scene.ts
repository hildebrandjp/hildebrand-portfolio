import { 
    Scene as SceneFromThree, 
    Object3D, ColorRepresentation, 
    DirectionalLight, 
    AmbientLight,
    Color
} from 'three';
import { DirectionalPosition } from './model/DirectionalPosition';

/* The Scene class in TypeScript manages a 3D scene by adding and removing objects, setting ambient and
directional lights, and handling the background color. */
class Scene {
    scene: SceneFromThree;

    constructor() {
        this.scene = new SceneFromThree();
    }

    /**
     * The `getScene` function returns the scene associated with the current object.
     * @returns The `scene` property is being returned.
     */
    getScene() {
        return this.scene;
    }

    /**
     * The addObject function adds a 3D object to the scene.
     * @param {Object3D} object - An instance of the Object3D class, representing a 3D object in a
     * scene.
     */
    addObject(object: Object3D) {
        this.scene.add(object);
    }

    /**
     * The function removeObject removes an object from a scene in TypeScript.
     * @param {Object3D} object - Object3D
     */
    removeObject(object: Object3D) {
        this.scene.remove(object);
    }

    /**
     * The ambientLight function adds an ambient light to the scene with the specified color and
     * intensity.
     * @param {number | ColorRepresentation} [color=0xffffff] - The `color` parameter in the
     * `ambientLight` function represents the color of the ambient light. It can be specified either as
     * a number (in hexadecimal format) or as a `ColorRepresentation` object. If no color is provided,
     * the default value is `0xffffff`, which corresponds to white
     * @param {number} [intensity=0.5] - The intensity parameter in the ambientLight function
     * determines how strong the ambient light will be in the scene. A value of 0 would mean no ambient
     * light, while a value of 1 would be full intensity ambient light. You can adjust this parameter
     * to control the overall brightness of the ambient light in your
     */
    ambientLight(color: number | ColorRepresentation = 0xffffff, intensity: number = 0.5) {
        const ambientLight = new AmbientLight(color, intensity);
        this.scene.add(ambientLight);
    }

    /**
     * The function creates and adds a directional light to a scene with customizable color, intensity,
     * and position.
     * @param {number | ColorRepresentation} [color=0xffffff] - The `color` parameter in the
     * `directionalLight` function represents the color of the directional light. It can be specified
     * either as a number (in hexadecimal format) or as a `ColorRepresentation` object. If no color is
     * provided, the default color is set to white (0xffffff).
     * @param {number} [intensity=1] - The `intensity` parameter in the `directionalLight` function
     * specifies the brightness of the light. A higher intensity value will result in a brighter light,
     * while a lower intensity value will result in a dimmer light. The default value for intensity is
     * 1, but you can adjust it as
     * @param {DirectionalPosition} position - The `position` parameter in the `directionalLight`
     * function represents the position of the directional light in 3D space. It is an object with
     * three properties: `x`, `y`, and `z`, which specify the coordinates of the light's position along
     * the x-axis, y-axis
     */
    directionalLight(color: number | ColorRepresentation = 0xffffff, intensity: number = 1, position: DirectionalPosition  = { x: 10, y: 10, z: 10 }) {
        const { x, y, z } = position;
        const directionalLight = new DirectionalLight(color, intensity);
        directionalLight.position.set(x, y, z);
        this.scene.add(directionalLight);
    }

    /**
     * The function sets the background color of a scene in TypeScript, allowing for a transparent
     * background if the color is null.
     * @param {ColorRepresentation | null} color - The `color` parameter in the `setBackground`
     * function is a variable that represents the color to set as the background of a scene. It can be
     * either a `ColorRepresentation` or `null`. If `null` is passed, it indicates a transparent
     * background. If a valid color representation is provided
     * @returns the value of `this.scene.background` which is set to `color` if `color` is `null`,
     * indicating a transparent background.
     */
    setBackground(color: ColorRepresentation | null) {
        if (color === null) {
            return this.scene.background = color; // Transparent background
        }
        this.scene.background = new Color(color);
    }
}

export default Scene;