import { DefaultSerializeable } from './private/Serializeable';
export declare enum TorchState {
    On = "on",
    Off = "off",
    Auto = "auto"
}
export declare enum CameraPosition {
    WorldFacing = "worldFacing",
    UserFacing = "userFacing",
    Unspecified = "unspecified"
}
export declare enum VideoResolution {
    Auto = "auto",
    HD = "hd",
    FullHD = "fullHd",
    UHD4K = "uhd4k"
}
export declare enum FocusRange {
    Full = "full",
    Near = "near",
    Far = "far"
}
export declare enum FocusGestureStrategy {
    None = "none",
    Manual = "manual",
    ManualUntilCapture = "manualUntilCapture",
    AutoOnLocation = "autoOnLocation"
}
export declare class CameraSettings extends DefaultSerializeable {
    preferredResolution: VideoResolution;
    zoomFactor: number;
    zoomGestureZoomFactor: number;
    private api;
    private focus;
    get focusRange(): FocusRange;
    set focusRange(newRange: FocusRange);
    get focusGestureStrategy(): FocusGestureStrategy;
    set focusGestureStrategy(newStrategy: FocusGestureStrategy);
    get shouldPreferSmoothAutoFocus(): boolean;
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus: boolean);
    get maxFrameRate(): number;
    set maxFrameRate(newValue: number);
    private static fromJSON;
    constructor();
    constructor(settings: CameraSettings);
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
export interface FrameData {
    readonly imageBuffers: ImageBuffer[];
    readonly orientation: number;
}
export declare class ImageBuffer {
    private _width;
    private _height;
    private _data;
    get width(): number;
    get height(): number;
    get data(): string;
}
