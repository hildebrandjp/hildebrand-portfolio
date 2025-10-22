export default class NoMouseWorldError extends Error {
    constructor() {
        super("Mouse world is not defined");
        this.name = "NoMouseWorldError";
    }
}   