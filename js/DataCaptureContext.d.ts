import { DataCaptureContextListener } from './DataCaptureContext+Related';
import { FrameSource } from './FrameSource';
import { DefaultSerializeable, Serializeable } from './private/Serializeable';
export interface DataCaptureMode extends Serializeable {
    isEnabled: boolean;
    readonly context: DataCaptureContext | null;
}
export interface DataCaptureComponent {
    readonly id: string;
}
export interface DataCaptureContextCreationOptions {
    deviceName?: string | null;
}
export declare class DataCaptureContextSettings extends DefaultSerializeable {
    constructor();
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
export declare class DataCaptureContext extends DefaultSerializeable {
    private licenseKey;
    private deviceName;
    private framework;
    private frameworkVersion;
    private settings;
    private _frameSource;
    private view;
    private modes;
    private components;
    private proxy;
    private listeners;
    get frameSource(): FrameSource | null;
    static get deviceID(): string | null;
    static forLicenseKey(licenseKey: string): DataCaptureContext;
    static forLicenseKeyWithSettings(licenseKey: string, settings: DataCaptureContextSettings | null): DataCaptureContext;
    static forLicenseKeyWithOptions(licenseKey: string, options: DataCaptureContextCreationOptions | null): DataCaptureContext;
    private constructor();
    setFrameSource(frameSource: FrameSource | null): Promise<void>;
    addListener(listener: DataCaptureContextListener): void;
    removeListener(listener: DataCaptureContextListener): void;
    addMode(mode: DataCaptureMode): void;
    removeMode(mode: DataCaptureMode): void;
    removeAllModes(): void;
    dispose(): void;
    applySettings(settings: DataCaptureContextSettings): Promise<void>;
    private initialize;
    private update;
    private addComponent;
}
