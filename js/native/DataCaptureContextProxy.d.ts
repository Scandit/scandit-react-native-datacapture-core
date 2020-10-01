import { DataCaptureContext } from '../DataCaptureContext';
export declare class DataCaptureContextProxy {
    private context;
    private nativeListeners;
    private get privateContext();
    static forDataCaptureContext(context: DataCaptureContext): DataCaptureContextProxy;
    updateContextFromJSON(): Promise<void>;
    dispose(): void;
    private unsubscribeListener;
    private initialize;
    private initializeContextFromJSON;
    private subscribeListener;
    private notifyListenersOfDeserializationError;
    private notifyListenersOfDidChangeStatus;
}
