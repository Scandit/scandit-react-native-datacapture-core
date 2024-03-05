import { CameraPosition, ImageFrameSourceProxy, FrameSourceState } from 'scandit-datacapture-frameworks-core';
export declare class NativeImageFrameSourceProxy implements ImageFrameSourceProxy {
    private eventEmitter;
    private nativeListeners;
    constructor();
    getCurrentCameraState(position: CameraPosition): Promise<FrameSourceState>;
    dispose(): void;
    registerListenerForEvents(): void;
    unregisterListenerForEvents(): void;
    unsubscribeDidChangeState(): void;
    subscribeDidChangeState(): void;
}
