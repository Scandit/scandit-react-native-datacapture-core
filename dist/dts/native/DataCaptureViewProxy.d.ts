import { DataCaptureViewProxy, BaseNativeProxy } from 'scandit-datacapture-frameworks-core';
export declare class NativeDataCaptureViewProxy extends BaseNativeProxy implements DataCaptureViewProxy {
    private nativeListeners;
    constructor();
    viewPointForFramePoint(pointJson: string): Promise<string>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateralJson: string): Promise<string>;
    registerListenerForViewEvents(): void;
    unregisterListenerForViewEvents(): void;
    subscribeDidChangeSize(): void;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
}
