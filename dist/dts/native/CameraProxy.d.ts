import { CameraPosition, CameraProxy, FrameSourceState } from 'scandit-datacapture-frameworks-core';
export declare class NativeCameraProxy implements CameraProxy {
    private nativeListeners;
    private eventEmitter;
    constructor();
    getLastFrame(): Promise<string>;
    getLastFrameOrNull(): Promise<string | null>;
    getCurrentCameraState(position: CameraPosition): Promise<FrameSourceState>;
    isTorchAvailable(position: CameraPosition): Promise<boolean>;
    registerListenerForCameraEvents(): void;
    unregisterListenerForCameraEvents(): void;
    unsubscribeDidChangeState(): void;
    subscribeDidChangeState(): void;
}
