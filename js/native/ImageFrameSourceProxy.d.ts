import { ImageFrameSource } from '../Camera+Related';
import { FrameSourceState } from '../FrameSource';
export declare class ImageFrameSourceProxy {
    private imageFrameSource;
    private nativeListeners;
    static forImage(imageFrameSource: ImageFrameSource): ImageFrameSourceProxy;
    getCurrentState(): Promise<FrameSourceState>;
    dispose(): void;
    subscribeListener(): void;
    unsubscribeListener(): void;
}
