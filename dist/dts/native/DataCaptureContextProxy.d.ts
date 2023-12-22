import { DataCaptureContext, DataCaptureContextProxy } from 'scandit-datacapture-frameworks-core';
export declare class NativeDataCaptureContextProxy implements DataCaptureContextProxy {
    private eventEmitter;
    private nativeListeners;
    constructor();
    contextFromJSON(context: DataCaptureContext): Promise<void>;
    updateContextFromJSON(context: DataCaptureContext): Promise<void>;
    dispose(): void;
    registerListenerForEvents(): void;
    unsubscribeListener(): void;
    subscribeDidChangeStatus(): void;
    subscribeDidStartObservingContext(): void;
}
