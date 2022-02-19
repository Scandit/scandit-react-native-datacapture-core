import { Camera } from '../Camera';
import { FrameSourceState } from '../FrameSource';
import { FrameData } from '../private/PrivateCamera+Related';
export declare class CameraProxy {
    private camera;
    private nativeListeners;
    static forCamera(camera: Camera): CameraProxy;
    static getLastFrame(): Promise<FrameData>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    dispose(): void;
    subscribeListener(): void;
    unsubscribeListener(): void;
}
