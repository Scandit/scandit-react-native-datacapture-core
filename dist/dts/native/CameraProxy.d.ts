import { CameraPosition, CameraProxy, NativeCallResult } from 'scandit-datacapture-frameworks-core';
export declare class NativeCameraProxy implements CameraProxy {
    private nativeListeners;
    private eventEmitter;
    constructor();
    getFrame(frameId: string): Promise<NativeCallResult | null>;
    getCurrentCameraState(position: CameraPosition): Promise<NativeCallResult>;
    isTorchAvailable(position: CameraPosition): Promise<NativeCallResult>;
    switchCameraToDesiredState(desiredStateJson: string): Promise<void>;
    registerListenerForCameraEvents(): void;
    unregisterListenerForCameraEvents(): Promise<void>;
    subscribeDidChangeState(): void;
}
