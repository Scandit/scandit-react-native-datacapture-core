import { DataCaptureContextListener } from './DataCaptureContext+Related';
import { FrameSource } from './FrameSource';
import { DefaultSerializeable, Serializeable } from './private/Serializeable';
export interface DataCaptureMode extends Serializeable {
    isEnabled: boolean;
    readonly context: Optional<DataCaptureContext>;
}
export interface DataCaptureComponent {
    readonly id: string;
}
export interface DataCaptureContextCreationOptions {
    deviceName?: Optional<string>;
}
export declare class DataCaptureContext extends DefaultSerializeable {
    private licenseKey;
    private deviceName;
    private framework;
    private _frameSource;
    private view;
    private modes;
    private components;
    private proxy;
    private listeners;
    get frameSource(): Optional<FrameSource>;
    static get deviceID(): Optional<string>;
    static forLicenseKey(licenseKey: string): DataCaptureContext;
    static forLicenseKeyWithOptions(licenseKey: string, options: Optional<DataCaptureContextCreationOptions>): DataCaptureContext;
    private constructor();
    setFrameSource(frameSource: Optional<FrameSource>): Promise<void>;
    addListener(listener: DataCaptureContextListener): void;
    removeListener(listener: DataCaptureContextListener): void;
    addMode(mode: DataCaptureMode): void;
    removeMode(mode: DataCaptureMode): void;
    removeAllModes(): void;
    dispose(): void;
    private initialize;
    private update;
    private addComponent;
}
