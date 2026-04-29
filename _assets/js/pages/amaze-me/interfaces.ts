export interface IDisposable {
    dispose(): void;
}

export interface IAnimatable {
    update(delta: number, elapsed: number): void;
}

export interface IResizable {
    resize(width: number, height: number): void;
}
