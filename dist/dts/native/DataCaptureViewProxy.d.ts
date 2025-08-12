import { DataCaptureViewProxy, BaseNativeProxy, NativeCallResult } from 'scandit-datacapture-frameworks-core';
export declare class NativeDataCaptureViewProxy extends BaseNativeProxy implements DataCaptureViewProxy {
    private nativeListeners;
    constructor();
    addOverlay(overlayJson: string): Promise<void>;
    removeOverlay(overlayJson: string): Promise<void>;
    createView(viewJson: string): Promise<void>;
    updateView(viewJson: string): Promise<void>;
    removeView(viewId: number): Promise<void>;
    viewPointForFramePoint({ viewId, pointJson }: {
        viewId: number;
        pointJson: string;
    }): Promise<NativeCallResult>;
    viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateralJson }: {
        viewId: number;
        quadrilateralJson: string;
    }): Promise<NativeCallResult>;
    registerListenerForViewEvents(viewId: number): void;
    unregisterListenerForViewEvents(viewId: number): void;
    subscribeDidChangeSize(): void;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
}
