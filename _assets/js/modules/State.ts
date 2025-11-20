export default class State {
    object: any = {};
    listeners: any = {};
    STATE_CHANGED = "stateChanged"; 
    constructor() {
        this.listeners = {};
    }

    addObject(key: string, value: any) {
        this.object[key] = value;
        this.listeners[this.STATE_CHANGED]?.(this.object);
    }

    clearObject() {
        this.object = {};
        this.listeners[this.STATE_CHANGED]?.(this.object);
    }

    getObject() {
        this.listeners[this.STATE_CHANGED]?.(this.object);
        return this.object;
    }

    getObjectByKey(key: string) {
        this.listeners[this.STATE_CHANGED]?.(this.object);
        return this.object[key];
    }

    on(event: string, callback: Function) {
        this.listeners[this.STATE_CHANGED]?.(this.object);
        this.listeners[event] = callback;
    }

    removeObject(key: string) {
        delete this.object[key]
        this.listeners[this.STATE_CHANGED]?.(this.object);;
    };

    setObject(newState: object) {
        this.object = { ...this.object, ...newState };
        this.listeners[this.STATE_CHANGED]?.(this.object);
    };
}