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
export declare class CameraSettings extends DefaultSerializeable {
    preferredResolution: VideoResolution;
    maxFrameRate: number;
    zoomFactor: number;
    private api;
    private focus;
    get focusRange(): FocusRange;
    set focusRange(newRange: FocusRange);
    private static fromJSON;
    constructor();
    constructor(settings: CameraSettings);
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}
