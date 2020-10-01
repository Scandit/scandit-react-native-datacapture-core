import { Camera } from '../Camera';
import { FrameSourceState } from '../FrameSource';
export declare class CameraProxy {
    private camera;
    private nativeListeners;
    static forCamera(camera: Camera): CameraProxy;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    dispose(): void;
    subscribeListener(): void;
    unsubscribeListener(): void;
}
