import { DefaultSerializeable } from './private/Serializeable';
import { FrameSource, FrameSourceListener, FrameSourceState } from './FrameSource';
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
    private focusHiddenProperties;
    preferredResolution: VideoResolution;
    zoomFactor: number;
    zoomGestureZoomFactor: number;
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
export declare class ImageFrameSource extends DefaultSerializeable implements FrameSource {
    private set context(value);
    private get context();
    get desiredState(): FrameSourceState;
    private position;
    private type;
    private image;
    private _id;
    private _desiredState;
    private listeners;
    private _context;
    private proxy;
    static create(image: string): ImageFrameSource;
    private static fromJSON;
    private constructor();
    private didChange;
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    addListener(listener: FrameSourceListener | null): void;
    removeListener(listener: FrameSourceListener | null): void;
    getCurrentState(): Promise<FrameSourceState>;
}
