import EventEmitter from 'eventemitter3';
export { default as EventEmitter } from 'eventemitter3';

declare enum FontFamily {
    SystemDefault = "systemDefault",
    ModernMono = "modernMono",
    SystemSans = "systemSans"
}

declare enum TextAlignment {
    Left = "left",
    Right = "right",
    Center = "center",
    Start = "start",
    End = "end"
}

interface Serializeable {
    toJSON: () => object;
}

interface StringSerializeable {
    toJSON: () => string;
}

declare function ignoreFromSerialization(target: any, propertyName: string): void;

declare function nameForSerialization(customName: string): (target: any, propertyName: string) => void;

declare function ignoreFromSerializationIfNull(target: any, propertyName: string): void;

declare function serializationDefault(defaultValue: any): (target: any, propertyName: string) => void;

declare class DefaultSerializeable implements Serializeable {
    toJSON(): object;
}

interface PointJSON {
    x: number;
    y: number;
}
interface PrivatePoint {
    fromJSON(json: PointJSON): Point;
}
declare class Point extends DefaultSerializeable {
    private _x;
    private _y;
    get x(): number;
    get y(): number;
    private static fromJSON;
    constructor(x: number, y: number);
}

interface QuadrilateralJSON {
    topLeft: PointJSON;
    topRight: PointJSON;
    bottomRight: PointJSON;
    bottomLeft: PointJSON;
}
interface PrivateQuadrilateral {
    fromJSON(json: QuadrilateralJSON): Quadrilateral;
}
declare class Quadrilateral extends DefaultSerializeable {
    private _topLeft;
    private _topRight;
    private _bottomRight;
    private _bottomLeft;
    get topLeft(): Point;
    get topRight(): Point;
    get bottomRight(): Point;
    get bottomLeft(): Point;
    private static fromJSON;
    constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point);
}

declare enum MeasureUnit {
    DIP = "dip",
    Pixel = "pixel",
    Fraction = "fraction"
}

interface NumberWithUnitJSON {
    value: number;
    unit: string;
}
interface PrivateNumberWithUnit {
    fromJSON(json: NumberWithUnitJSON): NumberWithUnit;
}
declare class NumberWithUnit extends DefaultSerializeable {
    private _value;
    private _unit;
    get value(): number;
    get unit(): MeasureUnit;
    private static fromJSON;
    constructor(value: number, unit: MeasureUnit);
}

interface PointWithUnitJSON {
    x: NumberWithUnitJSON;
    y: NumberWithUnitJSON;
}
interface PrivatePointWithUnit {
    readonly zero: PointWithUnit;
    fromJSON(json: PointWithUnitJSON): PointWithUnit;
}
declare class PointWithUnit extends DefaultSerializeable {
    private _x;
    private _y;
    get x(): NumberWithUnit;
    get y(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(x: NumberWithUnit, y: NumberWithUnit);
}

interface SizeJSON {
    width: number;
    height: number;
}
interface PrivateSize {
    fromJSON(json: SizeJSON): Size;
}
declare class Size extends DefaultSerializeable {
    private _width;
    private _height;
    get width(): number;
    get height(): number;
    private static fromJSON;
    constructor(width: number, height: number);
}

declare class Rect extends DefaultSerializeable {
    private _origin;
    private _size;
    get origin(): Point;
    get size(): Size;
    constructor(origin: Point, size: Size);
}

declare class SizeWithUnit extends DefaultSerializeable {
    private _width;
    private _height;
    get width(): NumberWithUnit;
    get height(): NumberWithUnit;
    constructor(width: NumberWithUnit, height: NumberWithUnit);
}

declare class RectWithUnit extends DefaultSerializeable {
    private _origin;
    private _size;
    get origin(): PointWithUnit;
    get size(): SizeWithUnit;
    constructor(origin: PointWithUnit, size: SizeWithUnit);
}

type ColorJSON = string;
interface PrivateColor {
    fromJSON(json: ColorJSON): Color;
}
declare class Color implements StringSerializeable {
    private hexadecimalString;
    get redComponent(): string;
    get greenComponent(): string;
    get blueComponent(): string;
    get alphaComponent(): string;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    static fromHex(hex: string): Color;
    static fromRGBA(red: number, green: number, blue: number, alpha?: number): Color;
    private static hexToNumber;
    private static fromJSON;
    private static numberToHex;
    private static normalizeHex;
    private static normalizeAlpha;
    private constructor();
    withAlpha(alpha: number): Color;
    toJSON(): string;
}

declare enum ScanditIconShape {
    Circle = "circle",
    Square = "square"
}

declare enum ScanditIconType {
    ArrowRight = "arrowRight",
    ArrowLeft = "arrowLeft",
    ArrowUp = "arrowUp",
    ArrowDown = "arrowDown",
    ToPick = "toPick",
    Checkmark = "checkmark",
    XMark = "xMark",
    QuestionMark = "questionMark",
    ExclamationMark = "exclamationMark",
    LowStock = "lowStock",
    ExpiredItem = "expiredItem",
    WrongItem = "wrongItem",
    FragileItem = "fragileItem",
    StarFilled = "starFilled",
    StarHalfFilled = "starHalfFilled",
    ChevronUp = "chevronUp",
    ChevronDown = "chevronDown",
    ChevronLeft = "chevronLeft",
    ChevronRight = "chevronRight",
    InspectItem = "inspectItem",
    StarOutlined = "starOutlined",
    Print = "print",
    Plus = "plus",
    Minus = "minus",
    Delete = "delete",
    Slash = "slash"
}

type ScanditIconJSON = {
    backgroundColor: Color | null;
    backgroundShape: ScanditIconShape | null;
    icon: ScanditIconType | null;
    iconColor: Color | null;
    backgroundStrokeColor: Color | null;
    backgroundStrokeWidth: number;
};
interface PrivateScanditIcon {
    fromJSON(json: ScanditIconJSON): ScanditIcon;
}
declare class ScanditIcon extends DefaultSerializeable {
    private _backgroundColor;
    private _backgroundShape;
    private _icon;
    private _iconColor;
    private _backgroundStrokeColor;
    private _backgroundStrokeWidth;
    private static fromJSON;
    constructor(iconColor: Color | null, backgroundColor: Color | null, backgroundShape: ScanditIconShape | null, icon: ScanditIconType | null, backgroundStrokeColor: Color | null, backgroundStrokeWidth: number);
    get backgroundColor(): Color | null;
    get backgroundShape(): ScanditIconShape | null;
    get icon(): ScanditIconType | null;
    get iconColor(): Color | null;
    get backgroundStrokeColor(): Color | null;
    get backgroundStrokeWidth(): number;
}

declare class ScanditIconBuilder {
    private _iconColor;
    private _backgroundColor;
    private _backgroundShape;
    private _icon;
    private _backgroundStrokeColor;
    private _backgroundStrokeWidth;
    withIconColor(iconColor: Color | null): ScanditIconBuilder;
    withBackgroundColor(backgroundColor: Color | null): ScanditIconBuilder;
    withBackgroundShape(backgroundShape: ScanditIconShape | null): ScanditIconBuilder;
    withIcon(iconType: ScanditIconType | null): ScanditIconBuilder;
    withBackgroundStrokeColor(backgroundStrokeColor: Color | null): ScanditIconBuilder;
    withBackgroundStrokeWidth(backgroundStrokeWidth: number): ScanditIconBuilder;
    build(): ScanditIcon;
}

declare class SizeWithAspect extends DefaultSerializeable {
    private _size;
    private _aspect;
    get size(): NumberWithUnit;
    get aspect(): number;
    constructor(size: NumberWithUnit, aspect: number);
}

declare enum SizingMode {
    WidthAndHeight = "widthAndHeight",
    WidthAndAspectRatio = "widthAndAspectRatio",
    HeightAndAspectRatio = "heightAndAspectRatio",
    ShorterDimensionAndAspectRatio = "shorterDimensionAndAspectRatio"
}

interface SizeWithUnitAndAspectJSON {
    width?: NumberWithUnitJSON;
    height?: NumberWithUnitJSON;
    shorterDimension?: NumberWithUnitJSON;
    aspect?: number;
}
interface PrivateSizeWithUnitAndAspect {
    fromJSON(json: SizeWithUnitAndAspectJSON): SizeWithUnitAndAspect;
}
declare class SizeWithUnitAndAspect implements Serializeable {
    private _widthAndHeight;
    private _widthAndAspectRatio;
    private _heightAndAspectRatio;
    private _shorterDimensionAndAspectRatio;
    get widthAndHeight(): SizeWithUnit | null;
    get widthAndAspectRatio(): SizeWithAspect | null;
    get heightAndAspectRatio(): SizeWithAspect | null;
    get shorterDimensionAndAspectRatio(): SizeWithAspect | null;
    get sizingMode(): SizingMode;
    private static sizeWithWidthAndHeight;
    private static sizeWithWidthAndAspectRatio;
    private static sizeWithHeightAndAspectRatio;
    private static sizeWithShorterDimensionAndAspectRatio;
    private static fromJSON;
    toJSON(): object;
}

interface MarginsWithUnitJSON {
    left: NumberWithUnitJSON;
    right: NumberWithUnitJSON;
    top: NumberWithUnitJSON;
    bottom: NumberWithUnitJSON;
}
interface PrivateMarginsWithUnit {
    readonly zero: MarginsWithUnit;
    fromJSON(json: MarginsWithUnitJSON): MarginsWithUnit;
}
declare class MarginsWithUnit extends DefaultSerializeable {
    private _left;
    private _right;
    private _top;
    private _bottom;
    get left(): NumberWithUnit;
    get right(): NumberWithUnit;
    get top(): NumberWithUnit;
    get bottom(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(left: NumberWithUnit, right: NumberWithUnit, top: NumberWithUnit, bottom: NumberWithUnit);
}

interface PrivateBrush {
    readonly copy: Brush;
    defaults: unknown;
    fromJSON(json: unknown): Brush;
    toJSON(): BrushJSON;
}
interface BrushJSON {
    fill: {
        color: Color;
    };
    stroke: {
        color: Color;
        width: number;
    };
}
declare class Brush extends DefaultSerializeable {
    private static defaults;
    private fill;
    private stroke;
    static get transparent(): Brush;
    get fillColor(): Color;
    get strokeColor(): Color;
    get strokeWidth(): number;
    private get copy();
    private static fromJSON;
    constructor();
    constructor(fillColor: Color, strokeColor: Color, strokeWidth: number);
}

declare enum Anchor {
    TopLeft = "topLeft",
    TopCenter = "topCenter",
    TopRight = "topRight",
    CenterLeft = "centerLeft",
    Center = "center",
    CenterRight = "centerRight",
    BottomLeft = "bottomLeft",
    BottomCenter = "bottomCenter",
    BottomRight = "bottomRight"
}

declare enum Orientation {
    Unknown = "unknown",
    Portrait = "portrait",
    PortraitUpsideDown = "portraitUpsideDown",
    LandscapeRight = "landscapeRight",
    LandscapeLeft = "landscapeLeft"
}

declare enum Direction {
    None = "none",
    Horizontal = "horizontal",
    LeftToRight = "leftToRight",
    RightToLeft = "rightToLeft",
    Vertical = "vertical",
    TopToBottom = "topToBottom",
    BottomToTop = "bottomToTop"
}

declare enum ScanIntention {
    Manual = "manual",
    Smart = "smart",
    /**
     * @deprecated Use SelectionMode.Auto instead. Will be removed in 9.0.
     */
    SmartSelection = "smartSelection"
}

declare enum SelectionMode {
    Off = "off",
    On = "on",
    Auto = "auto"
}

declare enum CameraPosition {
    WorldFacing = "worldFacing",
    UserFacing = "userFacing",
    Unspecified = "unspecified"
}

declare enum FrameSourceState {
    On = "on",
    Off = "off",
    Starting = "starting",
    Stopping = "stopping",
    Standby = "standby",
    BootingUp = "bootingUp",
    WakingUp = "wakingUp",
    GoingToSleep = "goingToSleep",
    ShuttingDown = "shuttingDown"
}

interface DidChangeSizeEventPayload {
    viewId: number;
    size: SizeJSON;
    orientation: string;
}
interface DidChangeStatusEventPayload {
    status: string;
}
interface DidChangeStateEventPayload {
    state: string;
}
interface EventPayload {
    name: string;
    data: string;
    viewId?: number;
    modeId?: number;
}
/**
 * Symbol returned by parseIfShouldHandle when an event should be skipped
 * (filtered out based on viewId/modeId mismatch).
 */
declare const SKIP: unique symbol;
declare class EventDataParser {
    private static parse;
    /**
     * Check if an event should be handled based on viewId/modeId filtering.
     * Used by React Native new architecture for pre-parse filtering to avoid
     * unnecessary JSON parsing of events not intended for this consumer.
     *
     * @param ev The event payload to check
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns true if the event should be handled, false if it should be skipped
     */
    static shouldHandle(ev: EventPayload, ids: {
        viewId?: number;
        modeId?: number;
    }): boolean;
    /**
     * Parse event data if it should be handled, otherwise return SKIP.
     *
     * Filtering is performed in two stages:
     * 1. Pre-parse: if the event wrapper carries viewId/modeId, skip parsing entirely on mismatch.
     * 2. Post-parse: verify the parsed payload's viewId/modeId matches the expected ids.
     *
     * @param ev The event payload to check and parse
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns SKIP if filtered out, null if parse failed, or parsed data
     */
    static parseIfShouldHandle<T>(ev: EventPayload, ids: {
        viewId?: number;
        modeId?: number;
    }): T | null | typeof SKIP;
}
interface NativeCallResult {
    data: string;
}
interface FrameSourceDidChangeStateEventPayload {
    state: FrameSourceState;
    cameraPosition: CameraPosition;
}

interface PropertyChangeListener {
    (property: string, value: any): void;
}
declare class Observable extends DefaultSerializeable {
    private listeners;
    addListener(listener: PropertyChangeListener): void;
    removeListener(listener: PropertyChangeListener): void;
    protected notifyListeners(property: string, value: any): void;
}

declare class HtmlElementPosition {
    readonly top: number;
    readonly left: number;
    constructor(top: number, left: number);
    didChangeComparedTo(other: HtmlElementPosition | null): boolean;
}
declare class HtmlElementSize {
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number);
    didChangeComparedTo(other: HtmlElementSize | null): boolean;
}
declare class HTMLElementState {
    isShown: boolean;
    position: HtmlElementPosition | null;
    size: HtmlElementSize | null;
    shouldBeUnderContent: boolean;
    get isValid(): boolean;
    didChangeComparedTo(other: HTMLElementState | null): boolean;
}

interface FocusGestureListener {
    didFocusGesture?(focusGesture: FocusGesture, point: PointWithUnit): void;
}

interface FocusGesture {
    showUIIndicator: boolean;
    addListener(listener: FocusGestureListener): void;
    removeListener(listener: FocusGestureListener): void;
    triggerFocus(point: PointWithUnit): Promise<void>;
}

declare enum FocusGestureStrategy {
    None = "none",
    Manual = "manual",
    ManualUntilCapture = "manualUntilCapture",
    AutoOnLocation = "autoOnLocation"
}

declare enum FocusRange {
    Full = "full",
    Near = "near",
    Far = "far"
}

declare enum LogoStyle {
    Minimal = "minimal",
    Extended = "extended"
}

declare enum MacroMode {
    Auto = "auto",
    Off = "off",
    On = "on"
}

declare enum VideoResolution {
    /** @deprecated Auto is deprecated. Please use the capture mode's recommendedCameraSettings for the best results. */
    Auto = "auto",
    HD = "hd",
    FullHD = "fullHd",
    UHD4K = "uhd4k"
}

interface ZoomGestureListener {
    didZoomInGesture?(zoomGesture: ZoomGesture): void;
    didZoomOutGesture?(zoomGesture: ZoomGesture): void;
}

interface ZoomGesture {
    addListener(listener: ZoomGestureListener): void;
    removeListener(listener: ZoomGestureListener): void;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
}
interface ZoomGestureJSON {
    type: string;
}

declare enum ZoomSwitchOrientation {
    Default = "default",
    Horizontal = "horizontal",
    Vertical = "vertical"
}

interface RectangularViewfinderAnimationJSON {
    readonly looping: boolean;
}
interface PrivateRectangularViewfinderAnimation {
    fromJSON(json: RectangularViewfinderAnimationJSON): RectangularViewfinderAnimation;
}
declare class RectangularViewfinderAnimation extends DefaultSerializeable {
    private readonly _isLooping;
    private static fromJSON;
    get isLooping(): boolean;
    constructor(isLooping: boolean);
}

declare enum RectangularViewfinderLineStyle {
    Light = "light",
    Bold = "bold"
}

declare enum RectangularViewfinderStyle {
    Rounded = "rounded",
    Square = "square"
}

interface CameraSettingsDefaults {
    preferredResolution: VideoResolution;
    zoomFactor: number;
    focusRange: FocusRange;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: FocusGestureStrategy;
    shouldPreferSmoothAutoFocus: boolean;
    manualLensPosition: number;
    focusStrategy: string;
    zoomLevels: number[];
    torchLevel: number;
    macroMode: MacroMode;
    adaptiveExposure: boolean;
    properties: {
        [key: string]: unknown;
    };
}
interface ZoomSwitchControlDefaults {
    orientation: ZoomSwitchOrientation;
    isAlwaysExpanded: boolean;
    isExpanded: boolean;
    accessibilityLabel: string;
    accessibilityHint: string;
}
interface CoreDefaults {
    Camera: {
        Settings: CameraSettingsDefaults;
        defaultPosition: CameraPosition | null;
        availablePositions: CameraPosition[];
    };
    ZoomSwitchControl: ZoomSwitchControlDefaults;
    DataCaptureView: {
        scanAreaMargins: MarginsWithUnit;
        pointOfInterest: PointWithUnit;
        logoAnchor: Anchor;
        logoOffset: PointWithUnit;
        focusGesture: FocusGesture | null;
        zoomGesture: ZoomGesture | null;
        zoomGestures: ZoomGesture[];
        logoStyle: LogoStyle;
        shouldShowZoomNotification?: boolean;
    };
    RectangularViewfinder: {
        defaultStyle: string;
        styles: {
            [key: string]: {
                size: SizeWithUnitAndAspect;
                color: Color;
                style: RectangularViewfinderStyle;
                lineStyle: RectangularViewfinderLineStyle;
                dimming: string;
                disabledDimming: string;
                animation: RectangularViewfinderAnimation | null;
                disabledColor: Color;
            };
        };
    };
    AimerViewfinder: {
        frameColor: Color;
        dotColor: Color;
    };
    LaserlineViewfinder: {
        width: NumberWithUnit;
        enabledColor: Color;
        disabledColor: Color;
    };
    Brush: Brush;
    deviceID: string | null;
}

declare function getCoreDefaults(): CoreDefaults;

declare function setCoreDefaultsLoader(loader: () => void): void;
declare function ensureCoreDefaults(): CoreDefaults;
declare function loadCoreDefaults(jsonDefaults: unknown): void;

interface ContextStatusJSON {
    code: number;
    isValid: boolean;
    message: string;
}
interface PrivateContextStatus {
    fromJSON(json: ContextStatusJSON): ContextStatus;
}
declare class ContextStatus {
    private _message;
    private _code;
    private _isValid;
    private static fromJSON;
    get message(): string;
    get code(): number;
    get isValid(): boolean;
}

declare enum FocusGestureListenerEvents {
    onFocusGesture = "FocusGestureListener.onFocusGesture"
}

interface PrivateTapToFocus {
    listeners: FocusGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
declare class TapToFocus extends DefaultSerializeable implements FocusGesture {
    private type;
    showUIIndicator: boolean;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    constructor();
    addListener(listener: FocusGestureListener): void;
    removeListener(listener: FocusGestureListener): void;
    triggerFocus(point: PointWithUnit): Promise<void>;
}

interface FocusGestureJSON {
    type: string;
}
declare class PrivateFocusGestureDeserializer {
    static fromJSON(json: FocusGestureJSON | null): FocusGesture | null;
}

declare class PrivateZoomGestureDeserializer {
    static fromJSON(json: ZoomGestureJSON | null): ZoomGesture | null;
    static fromJSONArray(jsonArray: ZoomGestureJSON[]): ZoomGesture[];
}

declare enum ZoomGestureListenerEvents {
    onZoomInGesture = "ZoomGestureListener.onZoomInGesture",
    onZoomOutGesture = "ZoomGestureListener.onZoomOutGesture"
}

interface FrameSourceListener {
    didChangeState?(frameSource: FrameSource, newState: FrameSourceState): void;
}

interface FrameSource extends Serializeable {
    readonly desiredState: FrameSourceState;
    switchToDesiredState(desiredState: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    addListener(listener: FrameSourceListener): void;
    removeListener(listener: FrameSourceListener): void;
}

declare enum TorchState {
    On = "on",
    Off = "off",
    Auto = "auto"
}

interface TorchListener {
    didChangeTorchToState?(state: TorchState): void;
}

interface MacroModeListener {
    didChangeMacroMode?(macroMode: MacroMode): void;
}

interface ZoomListener {
    didChangeZoomLevel?(oldZoomLevel: number, newZoomLevel: number): void;
}

declare class ImageBuffer {
    private _width;
    private _height;
    private _data;
    get width(): number;
    get height(): number;
    get data(): string;
}
interface PrivateImageBuffer {
    _width: number;
    _height: number;
    _data: string;
}
interface ImageBufferJSON {
    width: number;
    height: number;
    data: string;
}

interface FrameData {
    readonly imageBuffers: ImageBuffer[];
    readonly imageBuffer: ImageBuffer;
    readonly orientation: number;
    readonly timestamp: number;
}
interface FrameDataJSON {
    imageBuffers: ImageBufferJSON[];
    orientation: number;
    timestamp?: number;
}
declare class PrivateFrameData implements FrameData {
    private _imageBuffers;
    private _orientation;
    private _timestamp;
    get imageBuffers(): ImageBuffer[];
    get imageBuffer(): ImageBuffer;
    get orientation(): number;
    get timestamp(): number;
    static fromJSON(json: FrameDataJSON): FrameData;
    static empty(): FrameData;
}

declare class FrameDataSettings extends DefaultSerializeable {
    private _isFileSystemCacheEnabled;
    private _imageQuality;
    private _isAutoRotateEnabled;
    constructor();
    get isFileSystemCacheEnabled(): boolean;
    set isFileSystemCacheEnabled(enabled: boolean);
    get imageQuality(): number;
    set imageQuality(quality: number);
    get isAutoRotateEnabled(): boolean;
    set isAutoRotateEnabled(enabled: boolean);
}

declare class FrameDataSettingsBuilder {
    private settings;
    constructor(settings: FrameDataSettings);
    enableFileSystemCache(enabled: boolean): FrameDataSettingsBuilder;
    setImageQuality(quality: number): FrameDataSettingsBuilder;
    enableAutoRotate(enabled: boolean): FrameDataSettingsBuilder;
}

declare class BaseController<PROXY> {
    private _cachedProxy;
    protected get _proxy(): PROXY;
    constructor(proxyName: string);
}

interface BaseProxy {
    subscribeForEvents(events: string[]): void;
    unsubscribeFromEvents(events: string[]): void;
    dispose(): void;
    eventEmitter: EventEmitter;
}

/**
 * The datacapture core module
 * Generated from schema definition.
 *
 * Single entry point interface - all operations go through $executeCore.
 * The CoreController handles method-specific logic and calls this proxy.
 * The NativeProxy automatically handles the `$` prefix for native method calls.
 */
interface CoreProxy extends BaseProxy {
    /**
     * Single entry point for all Core operations.
     * Routes to appropriate native command based on moduleName and methodName.
     *
     * @param params Object containing:
     *   - moduleName: The name of the module to execute against
     *   - methodName: The name of the method to execute
     *   - ...other parameters specific to the method
     *
     * @returns Promise resolving to the result (type depends on methodName)
     *
     * Note: This method is called with the `$` prefix ($executeCore) which is
     * automatically handled by NativeProxy to route to native implementation.
     */
    $executeCore(params: {
        moduleName: string;
        methodName: string;
        [key: string]: any;
    }): Promise<any>;
}

/**
 * Adapter class for Core operations.
 * Provides typed methods that internally call $executeCore.
 * Generated from schema definition to ensure parameter and method name consistency.
 */
declare class CoreProxyAdapter {
    private proxy;
    constructor(proxy: CoreProxy);
    /**
     * Gets the camera state for a given position
     * @param cameraPosition Camera position as JSON string
     */
    getCameraState({ cameraPosition }: {
        cameraPosition: string;
    }): Promise<FrameSourceState>;
    /**
     * Switches the camera to the desired state
     * @param stateJson Desired camera state as JSON string
     */
    switchCameraToDesiredState({ stateJson }: {
        stateJson: string;
    }): Promise<void>;
    /**
     * Checks if torch is available for the given camera position
     * @param cameraPosition Camera position as JSON string
     */
    isTorchAvailable({ cameraPosition }: {
        cameraPosition: string;
    }): Promise<boolean>;
    /**
     * Checks if macro mode is available for the current device
     */
    isMacroModeAvailable(): Promise<boolean>;
    /**
     * Registers a persistent listener for frame source state change events
     */
    registerFrameSourceListener(): Promise<void>;
    /**
     * Unregisters the frame source event listener
     */
    unregisterFrameSourceListener(): Promise<void>;
    /**
     * Adds an NV21 frame to the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source the frame is added to
     * @param width Frame width in pixels
     * @param height Frame height in pixels
     * @param frameData Base64-encoded NV21 frame bytes
     */
    addFrameToSequenceFrameSource({ frameSourceId, width, height, frameData, }: {
        frameSourceId: string;
        width: number;
        height: number;
        frameData: string;
    }): Promise<void>;
    /**
     * Returns the current state of the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source to get the state of
     */
    getSequenceFrameSourceState({ frameSourceId }: {
        frameSourceId: string;
    }): Promise<FrameSourceState>;
    /**
     * Registers a persistent listener for torch state change events
     */
    registerTorchStateListener(): Promise<void>;
    /**
     * Unregisters the torch state event listener
     */
    unregisterTorchStateListener(): Promise<void>;
    /**
     * Registers a persistent listener for zoom level change events
     */
    registerZoomLevelListener(): Promise<void>;
    /**
     * Unregisters the zoom level event listener
     */
    unregisterZoomLevelListener(): Promise<void>;
    /**
     * Selects the zoom level on the ZoomSwitchControl. Returns the actual zoom level applied.
     * @param viewId View identifier
     * @param zoomLevel Desired zoom level as a zoom factor
     */
    selectZoomLevel({ viewId, zoomLevel }: {
        viewId: number;
        zoomLevel: number;
    }): Promise<number>;
    /**
     * Registers a persistent listener for macro mode change events
     */
    registerMacroModeListener(): Promise<void>;
    /**
     * Unregisters the macro mode event listener
     */
    unregisterMacroModeListener(): Promise<void>;
    /**
     * Gets the last frame data by frame ID as JSON
     * @param frameId Unique frame identifier
     */
    getLastFrameAsJson({ frameId }: {
        frameId: string;
    }): Promise<string>;
    /**
     * Gets the last frame data by frame ID as JSON, or null if not found
     * @param frameId Unique frame identifier
     */
    getLastFrameOrNullAsJson({ frameId }: {
        frameId: string;
    }): Promise<string | null>;
    /**
     * Creates a DataCaptureContext from JSON
     * @param contextJson DataCaptureContext configuration as JSON string
     */
    createContextFromJson({ contextJson }: {
        contextJson: string;
    }): Promise<void>;
    /**
     * Updates a DataCaptureContext from JSON
     * @param contextJson Updated DataCaptureContext configuration as JSON string
     */
    updateContextFromJson({ contextJson }: {
        contextJson: string;
    }): Promise<void>;
    /**
     * Subscribes to context events with persistent listener
     */
    subscribeContextListener(): Promise<void>;
    /**
     * Unsubscribes from context events
     */
    unsubscribeContextListener(): Promise<void>;
    /**
     * Adds a mode to the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    addModeToContext({ modeJson }: {
        modeJson: string;
    }): Promise<void>;
    /**
     * Removes a mode from the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    removeModeFromContext({ modeJson }: {
        modeJson: string;
    }): Promise<void>;
    /**
     * Removes all modes from the DataCaptureContext
     */
    removeAllModes(): Promise<void>;
    /**
     * Gets open source software license information
     */
    getOpenSourceSoftwareLicenseInfo(): Promise<string>;
    /**
     * Disposes the DataCaptureContext and releases resources
     */
    disposeContext(): Promise<void>;
    /**
     * Converts a point from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param pointJson Point in frame coordinates as JSON string
     */
    viewPointForFramePoint({ viewId, pointJson }: {
        viewId: number;
        pointJson: string;
    }): Promise<string>;
    /**
     * Converts a quadrilateral from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param quadrilateralJson Quadrilateral in frame coordinates as JSON string
     */
    viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateralJson, }: {
        viewId: number;
        quadrilateralJson: string;
    }): Promise<string>;
    /**
     * Registers persistent event listener for view events
     * @param viewId View identifier
     */
    registerListenerForViewEvents({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the view event listener
     * @param viewId View identifier
     */
    unregisterListenerForViewEvents({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Registers a persistent listener for focus gesture events
     * @param viewId View identifier
     */
    registerFocusGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the focus gesture event listener
     * @param viewId View identifier
     */
    unregisterFocusGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Triggers a focus as if the focus gesture was performed
     * @param viewId View identifier
     * @param pointJson Point in view coordinates as JSON string
     */
    triggerFocus({ viewId, pointJson }: {
        viewId: number;
        pointJson: string;
    }): Promise<void>;
    /**
     * Triggers a zoom in gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomIn({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Triggers a zoom out gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomOut({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Registers a persistent listener for zoom gesture events
     * @param viewId View identifier
     */
    registerZoomGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the zoom gesture event listener
     * @param viewId View identifier
     */
    unregisterZoomGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Updates the DataCaptureView configuration
     * @param viewJson Updated view configuration as JSON string
     */
    updateDataCaptureView({ viewJson }: {
        viewJson: object | string;
    }): Promise<void>;
    /**
     * Emits haptic/audio feedback
     * @param feedbackJson Feedback configuration as JSON string
     */
    emitFeedback({ feedbackJson }: {
        feedbackJson: string;
    }): Promise<void>;
}

declare class ImageFrameSource extends DefaultSerializeable implements FrameSource {
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
    private controller;
    static create(image: string): ImageFrameSource;
    private static fromJSON;
    private constructor();
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    addListener(listener: FrameSourceListener | null): void;
    removeListener(listener: FrameSourceListener | null): void;
    getCurrentState(): Promise<FrameSourceState>;
    private didChange;
    private setNativeFrameSourceIsBeingCreated;
}

/**
 * A frame source that processes frames fed to it via {@link SequenceFrameSource.addFrame},
 * in the order they are added. Use it when the camera is not handled by the SDK (e.g. when
 * another framework owns the camera).
 */
declare class SequenceFrameSource extends DefaultSerializeable implements FrameSource {
    private set context(value);
    private get context();
    get desiredState(): FrameSourceState;
    private position;
    private type;
    private _lensPosition;
    private static nextInstanceId;
    private _id;
    private _desiredState;
    private listeners;
    private _context;
    private controller;
    /**
     * Creates a sequence frame source for the given camera position. On iOS the lens position
     * (0.0-1.0) sets the capture device lens position; on Android it is ignored.
     */
    static create(position: CameraPosition, lensPosition?: number): SequenceFrameSource;
    private static fromJSON;
    private constructor();
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    /**
     * Adds a frame with the given width and height. The frame data must be the Base64 encoding
     * of the raw NV21 bytes of the frame. If this frame source is on and connected to a
     * data capture context, this is the next frame that will be processed.
     */
    addFrame(width: number, height: number, frameData: string): Promise<void>;
    addListener(listener: FrameSourceListener): void;
    removeListener(listener: FrameSourceListener): void;
    getCurrentState(): Promise<FrameSourceState>;
    private didChange;
    private setNativeFrameSourceIsBeingCreated;
}

interface CameraSettingsJSON {
    preferredResolution: string;
    zoomFactor: number;
    zoomGestureZoomFactor: number;
    zoomLevels?: number[];
    macroMode?: string;
    adaptiveExposure?: boolean;
    torchLevel?: number;
    focusRange?: string;
    focusGestureStrategy?: string;
    shouldPreferSmoothAutoFocus: boolean;
    properties?: {
        [key: string]: any;
    };
}
interface PrivateCameraSettings {
    fromJSON(json: CameraSettingsJSON): CameraSettings;
}
declare class CameraSettings extends DefaultSerializeable {
    preferredResolution: VideoResolution;
    zoomFactor: number;
    /** @deprecated Use zoomLevels instead. */
    zoomGestureZoomFactor: number;
    zoomLevels: number[];
    torchLevel: number;
    macroMode: MacroMode;
    adaptiveExposure: boolean;
    private static get coreDefaults();
    private focusHiddenProperties;
    private focus;
    get focusRange(): FocusRange;
    set focusRange(newRange: FocusRange);
    get focusGestureStrategy(): FocusGestureStrategy;
    set focusGestureStrategy(newStrategy: FocusGestureStrategy);
    get shouldPreferSmoothAutoFocus(): boolean;
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus: boolean);
    private static fromJSON;
    constructor();
    constructor(settings: CameraSettings);
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}

/**
 * Camera lifecycle and operation handling:
 *
 * Phase 1 - Initial State (before native creation starts):
 *   - Camera object exists in TypeScript but not yet being created on native side
 *   - State changes (torch, desired state, settings) only update TypeScript properties
 *   - No native calls are triggered
 *
 * Phase 2 - Native Creation In Progress (after setFrameSource, before context set):
 *   - setFrameSource() called on DataCaptureContext, triggering setNativeFrameSourceIsBeingCreated()
 *   - A promise is created that will resolve when the native camera is ready
 *   - State changes during this phase await the native ready promise before executing
 *   - Native camera is created asynchronously
 *
 * Phase 3 - Active State (after context set):
 *   - Native camera is ready and available
 *   - The native ready promise is resolved
 *   - All state changes execute immediately on native side
 */
declare class Camera extends DefaultSerializeable implements FrameSource {
    private static readonly _cameraInstances;
    private controller;
    private type;
    private settings;
    private _position;
    private _desiredTorchState;
    private _desiredState;
    private _hasTorchStateListeners;
    private _hasMacroModeListeners;
    private currentCameraState;
    private listeners;
    private torchListeners;
    private macroModeListeners;
    private zoomListeners;
    private _hasZoomListeners;
    private _context;
    private nativeReadyResolver;
    private nativeReadyRejecter;
    private nativeReadyPromise;
    private nativeReadyTimeout;
    private static get coreDefaults();
    static create(position?: CameraPosition, settings?: CameraSettings | null, desiredTorchState?: TorchState, desiredState?: FrameSourceState): Camera | null;
    static withSettings(settings: CameraSettings): Camera | null;
    static asPositionWithSettings(cameraPosition: CameraPosition, settings: CameraSettings): Camera | null;
    static atPosition(cameraPosition: CameraPosition): Camera | null;
    private constructor();
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    addListener(listener: FrameSourceListener | null): void;
    removeListener(listener: FrameSourceListener | null): void;
    addTorchListener(listener: TorchListener): void;
    removeTorchListener(listener: TorchListener): void;
    addMacroModeListener(listener: MacroModeListener): void;
    removeMacroModeListener(listener: MacroModeListener): void;
    addZoomListener(listener: ZoomListener): void;
    removeZoomListener(listener: ZoomListener): void;
    applySettings(settings: CameraSettings): Promise<void>;
    private set context(value);
    private get context();
    private setNativeFrameSourceIsBeingCreated;
    private get isActiveCamera();
    static get default(): Camera | null;
    static isMacroModeAvailable(): Promise<boolean>;
    get position(): CameraPosition;
    get isTorchAvailable(): Promise<boolean>;
    get desiredState(): FrameSourceState;
    set desiredTorchState(desiredTorchState: TorchState);
    get desiredTorchState(): TorchState;
    private didChange;
    private resetPhaseState;
}
interface PrivateCamera {
    context: DataCaptureContext | null;
    _position: CameraPosition;
    _desiredState: FrameSourceState;
    currentCameraState: FrameSourceState;
    desiredTorchState: TorchState;
    settings: CameraSettings | null;
    listeners: FrameSourceListener[];
    torchListeners: TorchListener[];
    macroModeListeners: MacroModeListener[];
    zoomListeners: ZoomListener[];
    controller: CameraController;
    get isActiveCamera(): boolean;
    initialize: () => void;
    didChange: () => Promise<void>;
}

declare class CameraController extends BaseController<CoreProxy> {
    private camera;
    private adapter;
    constructor(camera: Camera);
    private get privateCamera();
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    switchCameraToDesiredState(desiredState: FrameSourceState): Promise<void>;
    subscribeListener(): Promise<void>;
    unsubscribeListener(): Promise<void>;
    subscribeTorchListener(): Promise<void>;
    unsubscribeTorchListener(): Promise<void>;
    subscribeMacroModeListener(): Promise<void>;
    unsubscribeMacroModeListener(): Promise<void>;
    subscribeZoomListener(): Promise<void>;
    unsubscribeZoomListener(): Promise<void>;
    dispose(): void;
    private handleDidChangeStateEvent;
    private handleDidChangeStateEventWrapper;
    private handleDidChangeTorchToStateEvent;
    private handleDidChangeTorchToStateEventWrapper;
    private handleDidChangeMacroModeEvent;
    private handleDidChangeMacroModeEventWrapper;
    private handleDidChangeZoomLevelEvent;
    private handleDidChangeZoomLevelEventWrapper;
}

declare class CameraSwitchControl extends DefaultSerializeable implements Control {
    private type;
    private _primaryCamera;
    private _secondaryCamera;
    private icon;
    private _view;
    private controller;
    private get view();
    private set view(value);
    /** @internal Read-only view access for the sync controller. */
    get attachedView(): BaseDataCaptureView | null;
    private anchor;
    private offset;
    accessibilityLabelWhenWorldFacing: string | null;
    accessibilityHintWhenWorldFacing: string | null;
    accessibilityLabelWhenUserFacing: string | null;
    accessibilityHintWhenUserFacing: string | null;
    constructor(primaryCamera: Camera, secondaryCamera: Camera);
    get primaryCamera(): Camera;
    get secondaryCamera(): Camera;
    get primaryCameraImage(): string | null;
    set primaryCameraImage(primaryCameraImage: string | null);
    get primaryCameraPressedImage(): string | null;
    set primaryCameraPressedImage(primaryCameraPressedImage: string | null);
    get secondaryCameraImage(): string | null;
    set secondaryCameraImage(secondaryCameraImage: string | null);
    get secondaryCameraPressedImage(): string | null;
    set secondaryCameraPressedImage(secondaryCameraPressedImage: string | null);
    setPrimaryCameraImage(resource: string): void;
    setPrimaryCameraPressedImage(resource: string): void;
    setSecondaryCameraImage(resource: string): void;
    setSecondaryCameraPressedImage(resource: string): void;
}



/**
 * Keeps the TS-side camera state in sync with the native camera switcher.
 *
 * The native `CameraSwitchControl` swaps the DataCaptureContext's active camera on its own when
 * tapped; the TS layer is never told, so `DataCaptureContext.frameSource` and the two cameras'
 * `_desiredState` drift out of sync (leading to "Unable to switch the camera" rejections when the
 * app later acts on a camera native no longer treats as active). This controller listens to the
 * frame-source state events (which carry the camera position) and repoints the TS state to mirror
 * the native switch — without issuing any native call, since native is already in that state.
 */
declare class CameraSwitchControlController extends BaseController<CoreProxy> {
    private control;
    private adapter;
    private subscribed;
    constructor(control: CameraSwitchControl);
    subscribe(): Promise<void>;
    unsubscribe(): void;
    private handleDidChangeStateWrapper;
    private handleDidChangeState;
}

declare class FrameDataController extends BaseController<CoreProxy> {
    private adapter;
    constructor();
    getFrame(frameId: string): Promise<FrameData>;
    getFrameOrNull(frameId: string): Promise<FrameData | null>;
}

declare class ZoomSwitchControl extends DefaultSerializeable implements Control {
    private type;
    private icon;
    private view;
    private anchor;
    private offset;
    private static get coreDefaults();
    /** @deprecated Use the unified `accessibilityLabel` property instead. */
    contentDescriptionWhenZoomedOut: string | null;
    /** @deprecated Use the unified `accessibilityLabel` property instead. */
    contentDescriptionWhenZoomedIn: string | null;
    /** @deprecated Use the unified `accessibilityLabel` property instead. */
    accessibilityLabelWhenZoomedOut: string | null;
    /** @deprecated Use the unified `accessibilityLabel` property instead. */
    accessibilityLabelWhenZoomedIn: string | null;
    /** @deprecated Use the unified `accessibilityHint` property instead. */
    accessibilityHintWhenZoomedOut: string | null;
    /** @deprecated Use the unified `accessibilityHint` property instead. */
    accessibilityHintWhenZoomedIn: string | null;
    orientation: ZoomSwitchOrientation;
    isAlwaysExpanded: boolean;
    isExpanded: boolean;
    accessibilityLabel: string;
    accessibilityHint: string;
    private _selectedZoomLevel;
    get selectedZoomLevel(): number;
    constructor();
    selectZoomLevel(level: number): Promise<number>;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedOutImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutImage(zoomedOutImage: string | null);
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedInImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInImage(zoomedInImage: string | null);
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedInPressedImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInPressedImage(zoomedInPressedImage: string | null);
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedOutPressedImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutPressedImage(zoomedOutPressedImage: string | null);
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedInImage(resource: string): void;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedInPressedImage(resource: string): void;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedOutImage(resource: string): void;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedOutPressedImage(resource: string): void;
}

declare class TorchSwitchControl extends DefaultSerializeable implements Control {
    private type;
    private icon;
    private view;
    private anchor;
    private offset;
    accessibilityLabelWhenOff: string | null;
    accessibilityHintWhenOff: string | null;
    accessibilityLabelWhenOn: string | null;
    accessibilityHintWhenOn: string | null;
    constructor();
    get torchOffImage(): string | null;
    set torchOffImage(torchOffImage: string | null);
    get torchOffPressedImage(): string | null;
    set torchOffPressedImage(torchOffPressedImage: string | null);
    get torchOnImage(): string | null;
    set torchOnImage(torchOnImage: string | null);
    get torchOnPressedImage(): string | null;
    setTorchOffImage(resource: string): void;
    setTorchOffPressedImage(resource: string): void;
    setTorchOnImage(resource: string): void;
    setTorchOnPressedImage(resource: string): void;
    setImageResource(resource: string): void;
    set torchOnPressedImage(torchOnPressedImage: string | null);
}

interface PrivateSwipeToZoom {
    listeners: ZoomGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
declare class SwipeToZoom extends DefaultSerializeable implements ZoomGesture {
    private type;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    constructor();
    addListener(listener: ZoomGestureListener): void;
    removeListener(listener: ZoomGestureListener): void;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
}

interface PrivatePinchToZoom {
    listeners: ZoomGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
declare class PinchToZoom extends DefaultSerializeable implements ZoomGesture {
    private type;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    constructor();
    addListener(listener: ZoomGestureListener): void;
    removeListener(listener: ZoomGestureListener): void;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
}

interface DataCaptureOverlay extends Serializeable {
}
interface PrivateDataCaptureOverlay {
    view: BaseDataCaptureView | null;
}

interface DataCaptureViewListener {
    didChangeSize?(view: DataCaptureView, size: Size, orientation: Orientation): void;
}

interface DataCaptureView {
    addOverlay(overlay: DataCaptureOverlay): void;
    removeOverlay(overlay: DataCaptureOverlay): void;
}
declare class BaseDataCaptureView extends DefaultSerializeable {
    viewComponent: DataCaptureView;
    parentId: number | null;
    overlays: DataCaptureOverlay[];
    listeners: DataCaptureViewListener[];
    private _context;
    get context(): DataCaptureContext | null;
    set context(context: DataCaptureContext | null);
    private get coreDefaults();
    private _scanAreaMargins;
    get scanAreaMargins(): MarginsWithUnit;
    private _viewId;
    get viewId(): number;
    private set viewId(value);
    set scanAreaMargins(newValue: MarginsWithUnit);
    private _pointOfInterest;
    get pointOfInterest(): PointWithUnit;
    set pointOfInterest(newValue: PointWithUnit);
    private _logoAnchor;
    get logoAnchor(): Anchor;
    set logoAnchor(newValue: Anchor);
    private _logoOffset;
    get logoOffset(): PointWithUnit;
    set logoOffset(newValue: PointWithUnit);
    private _focusGesture;
    get focusGesture(): FocusGesture | null;
    set focusGesture(newValue: FocusGesture | null);
    private _zoomGestures;
    get zoomGestures(): ZoomGesture[];
    set zoomGestures(newValue: ZoomGesture[]);
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    get zoomGesture(): ZoomGesture | null;
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue: ZoomGesture | null);
    private _logoStyle;
    get logoStyle(): LogoStyle;
    set logoStyle(newValue: LogoStyle);
    private _shouldShowZoomNotification;
    get shouldShowZoomNotification(): boolean;
    set shouldShowZoomNotification(newValue: boolean);
    private controls;
    private controller;
    private isViewCreated;
    private get privateContext();
    static forContext(context: DataCaptureContext | null): BaseDataCaptureView;
    constructor(context: DataCaptureContext | null);
    addOverlay(overlay: DataCaptureOverlay): Promise<void>;
    removeOverlay(overlay: DataCaptureOverlay): Promise<void>;
    removeAllOverlays(): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    triggerFocus(point: PointWithUnit): Promise<void>;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
    addControl(control: Control): Promise<void>;
    addControlWithAnchorAndOffset(control: Control, anchor: Anchor, offset: PointWithUnit): void;
    removeControl(control: Control): void;
    controlUpdated(): Promise<void>;
    createNativeView(viewId: number): Promise<void>;
    private notifyOverlaysOfViewIdChange;
    removeNativeView(): Promise<void>;
    dispose(): void;
    setFrame(frame: Rect, isUnderContent?: boolean): Promise<void>;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    setProperty<T>(name: string, value: T): void;
    selectZoomLevel(zoomLevel: number): Promise<number>;
}

interface Control {
}
interface PrivateControl {
    view: BaseDataCaptureView | null;
    anchor: Anchor | null;
    offset: PointWithUnit | null;
}

declare class ControlImage extends DefaultSerializeable {
    private type;
    private _data;
    private _name;
    static fromBase64EncodedImage(data: string | null): ControlImage | null;
    static fromResourceName(resource: string): ControlImage;
    private constructor();
    isBase64EncodedImage(): boolean;
    get data(): string | null;
}

interface DataCaptureViewProxy extends CoreProxy {
    $showDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $hideDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $createDataCaptureView({ viewJson }: {
        viewJson: string;
    }): Promise<void>;
    $removeDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $setDataCaptureViewPositionAndSize({ top, left, width, height, shouldBeUnderWebView, }: {
        top: number;
        left: number;
        width: number;
        height: number;
        shouldBeUnderWebView: boolean;
    }): Promise<void>;
}
declare enum DataCaptureViewEvents {
    didChangeSize = "DataCaptureViewListener.onSizeChanged",
    onFocusGesture = "FocusGestureListener.onFocusGesture"
}
declare class DataCaptureViewController extends BaseController<DataCaptureViewProxy> {
    private view;
    private _listenerRegistered;
    private _focusGestureListenerRegistered;
    private _zoomGestureListenerRegistered;
    private adapter;
    constructor(view: BaseDataCaptureView);
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    triggerFocus(point: PointWithUnit): Promise<void>;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    createNativeView(): Promise<void>;
    removeNativeView(): Promise<void>;
    updateView(): Promise<void>;
    dispose(): void;
    subscribeListener(): Promise<void>;
    unsubscribeListener(): Promise<void>;
    updateFocusGestureListenerSubscription(focusGesture: FocusGesture | null, shouldSubscribe: boolean): Promise<void>;
    private subscribeFocusGestureListener;
    private unsubscribeFocusGestureListener;
    private handleOnFocusGestureEvent;
    private handleOnFocusGestureEventWrapper;
    updateZoomGestureListenerSubscription(zoomGesture: ZoomGesture | null, shouldSubscribe: boolean): Promise<void>;
    selectZoomLevel(zoomLevel: number): Promise<number>;
    private subscribeZoomGestureListener;
    private unsubscribeZoomGestureListener;
    private handleOnZoomInGestureEvent;
    private handleOnZoomInGestureEventWrapper;
    private handleOnZoomOutGestureEvent;
    private handleOnZoomOutGestureEventWrapper;
    private createView;
    private handleDidChangeSizeEvent;
    private handleDidChangeSizeEventWrapper;
    private isViewCreated;
}

interface CameraOwner {
    readonly id: string;
}

interface DataCaptureMode extends Serializeable {
    isEnabled: boolean;
    readonly context: DataCaptureContext | null;
}
interface PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    modeId: number;
}

declare class OpenSourceSoftwareLicenseInfo {
    private _licenseText;
    constructor(licenseText: string);
    get licenseText(): string;
}

interface DataCaptureContextProxy extends CoreProxy {
    get framework(): string;
    get frameworkVersion(): string;
}
declare enum DataCaptureContextEvents {
    didChangeStatus = "DataCaptureContextListener.onStatusChanged",
    didStartObservingContext = "DataCaptureContextListener.onObservationStarted"
}
declare class DataCaptureContextController extends BaseController<DataCaptureContextProxy> {
    private context;
    private _listenerRegistered;
    private adapter;
    get framework(): string;
    get frameworkVersion(): string;
    private get privateContext();
    static forDataCaptureContext(context: DataCaptureContext): DataCaptureContextController;
    static getOpenSourceSoftwareLicenseInfo(): Promise<OpenSourceSoftwareLicenseInfo>;
    private constructor();
    subscribeListener(): Promise<void>;
    updateContextFromJSON(): Promise<void>;
    addModeToContext(mode: DataCaptureMode): Promise<void>;
    removeModeFromContext(mode: DataCaptureMode): Promise<void>;
    removeAllModesFromContext(): Promise<void>;
    dispose(): void;
    unsubscribeListener(): Promise<void>;
    initialize(): Promise<void>;
    private initializeContextFromJSON;
    private handleDidChangeStatusEvent;
    private handleDidStartObservingContextEvent;
    private notifyListenersOfDeserializationError;
    private notifyListenersOfDidChangeStatus;
}

interface DataCaptureContextCreationOptions {
    deviceName?: string | null;
}

interface DataCaptureContextListener {
    didChangeStatus?(context: DataCaptureContext, contextStatus: ContextStatus): void;
    didStartObservingContext?(context: DataCaptureContext): void;
}

declare class DataCaptureContextSettings extends DefaultSerializeable {
    private _frameSettings;
    constructor();
    get frameDataSettings(): FrameDataSettings;
    set frameDataSettings(settings: FrameDataSettings);
    frameDataSettingsBuilder(): FrameDataSettingsBuilder;
    setProperty(name: string, value: any): void;
    getProperty(name: string): any;
}

declare class DataCaptureContext extends DefaultSerializeable {
    private licenseKey;
    private deviceName;
    private static _instance;
    static get sharedInstance(): DataCaptureContext;
    private controller;
    private _framework;
    private _frameworkVersion;
    private settings;
    private _frameSource;
    private view;
    private modes;
    private listeners;
    static getOpenSourceSoftwareLicenseInfo(): Promise<OpenSourceSoftwareLicenseInfo>;
    private static get coreDefaults();
    get frameSource(): FrameSource | null;
    static get deviceID(): string | null;
    static forLicenseKey(licenseKey: string): DataCaptureContext;
    static forLicenseKeyWithSettings(licenseKey: string, settings: DataCaptureContextSettings | null): DataCaptureContext;
    static forLicenseKeyWithOptions(licenseKey: string, options: DataCaptureContextCreationOptions | null): DataCaptureContext;
    static initialize(licenseKey: string, options?: DataCaptureContextCreationOptions | null, settings?: DataCaptureContextSettings | null): DataCaptureContext;
    private static create;
    private constructor();
    setFrameSource(frameSource: FrameSource | null): Promise<void>;
    /**
     * Mirror a frame-source change that already occurred on the native side (e.g. a
     * CameraSwitchControl tap handled by the native camera switcher, which swaps the context's
     * active camera on its own). Repoints the TS-side frame source and active-context pointers
     * WITHOUT re-serializing to native — native is already in this state, so calling
     * setFrameSource() would trigger a redundant, and failing, swap.
     *
     * Private on purpose: framework-internal callers (CameraSwitchControlController) reach it
     * through the PrivateDataCaptureContext cast, keeping it off the public SDK surface.
     */
    private adoptActiveFrameSource;
    addListener(listener: DataCaptureContextListener): Promise<void>;
    removeListener(listener: DataCaptureContextListener): Promise<void>;
    addMode(mode: DataCaptureMode): Promise<void>;
    setMode(mode: DataCaptureMode): Promise<void>;
    removeCurrentMode(): Promise<void>;
    removeMode(mode: DataCaptureMode): Promise<void>;
    removeAllModes(): Promise<void>;
    dispose(): Promise<void>;
    applySettings(settings: DataCaptureContextSettings): Promise<void>;
    private update;
    private addModeInternal;
    private removeModeInternal;
}
interface PrivateDataCaptureContext {
    controller: DataCaptureContextController;
    modes: [DataCaptureMode];
    components: [DataCaptureComponent];
    listeners: DataCaptureContextListener[];
    view: BaseDataCaptureView | null;
    update: () => Promise<void>;
    initialize(): void;
    adoptActiveFrameSource(frameSource: FrameSource): void;
}

interface DataCaptureComponent {
    readonly id: string;
}
interface PrivateDataCaptureComponent {
    _context: DataCaptureContext;
}

declare enum VibrationType {
    default = "default",
    selectionHaptic = "selectionHaptic",
    successHaptic = "successHaptic",
    failureHaptic = "failureHaptic",
    waveForm = "waveForm",
    impactHaptic = "impactHaptic"
}

interface VibrationJSON {
    type: string;
    timings: number[] | null;
    amplitudes: number[] | null;
}
interface PrivateVibration {
    fromJSON(json: VibrationJSON): Vibration;
}
declare class Vibration extends DefaultSerializeable {
    private type;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    static get failureHapticFeedback(): Vibration;
    static get impactHapticFeedback(): Vibration;
    private static fromJSON;
    protected constructor(type: VibrationType);
}
declare class WaveFormVibration extends Vibration {
    private _timings;
    get timings(): number[];
    private _amplitudes;
    get amplitudes(): number[] | null;
    constructor(timings: number[], amplitudes?: number[] | null);
}

interface SoundJSON {
    resource: string | null;
}
interface PrivateSound {
    fromJSON(json: SoundJSON): Sound;
}
declare class Sound extends DefaultSerializeable {
    resource: string | null;
    static get defaultSound(): Sound;
    private static fromJSON;
    constructor(resource: string | null);
}

interface FeedbackJSON {
    vibration: VibrationJSON | null;
    sound: SoundJSON | null;
}
interface PrivateFeedback {
    fromJSON(json: FeedbackJSON): Feedback;
}
declare class Feedback extends DefaultSerializeable {
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private controller;
    get vibration(): Vibration | null;
    get sound(): Sound | null;
    private static fromJSON;
    constructor(vibration: Vibration | null, sound: Sound | null);
    emit(): void;
    toJSON(): object;
}

declare enum FrameSourceListenerEvents {
    didChangeState = "FrameSourceListener.onStateChanged"
}

declare enum TorchListenerEvents {
    didChangeTorchToState = "TorchListener.onTorchStateChanged"
}

declare enum MacroModeListenerEvents {
    didChangeMacroMode = "MacroModeListener.onMacroModeChanged"
}

declare class CameraOwnershipManager {
    private static instance;
    private readonly owners;
    private readonly waitingQueue;
    private readonly protectedCameras;
    static getInstance(): CameraOwnershipManager;
    private constructor();
    requestOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    requestOwnershipAsync(position: CameraPosition, owner: CameraOwner, timeoutMs?: number): Promise<boolean>;
    releaseOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    isOwner(position: CameraPosition, owner: CameraOwner): boolean;
    getCurrentOwner(position: CameraPosition): CameraOwner | null;
    checkOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    getOwnedPosition(owner: CameraOwner): CameraPosition | null;
    getAllOwnedPositions(owner: CameraOwner): CameraPosition[];
    private enableProtectionForOwner;
    private disableProtectionForPosition;
    private processWaitingQueue;
    private removeFromQueue;
    private protectCameraForOwner;
    private unprotectCamera;
}

declare class CameraOwnershipHelper {
    private static ownershipManager;
    /**
     * Get camera instance for the owner (only works if you own it)
     */
    static getCamera(position: CameraPosition, owner: CameraOwner): Camera | null;
    /**
     * Safely execute camera operations (only works if you own the camera)
     */
    static withCamera<T>(position: CameraPosition, owner: CameraOwner, operation: (camera: Camera) => Promise<T> | T): Promise<T | null>;
    /**
     * Execute camera operations, waiting for ownership if necessary
     */
    static withCameraWhenAvailable<T>(position: CameraPosition, owner: CameraOwner, operation: (camera: Camera) => Promise<T> | T, timeoutMs?: number): Promise<T | null>;
    /**
     * Request ownership and wait if necessary
     */
    static requestOwnership(position: CameraPosition, owner: CameraOwner, timeoutMs?: number): Promise<boolean>;
    /**
     * Release ownership
     */
    static releaseOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    /**
     * Check if owner has ownership
     */
    static hasOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    /**
     * Get the camera position currently owned by the owner (if unknown)
     */
    static getOwnedPosition(owner: CameraOwner): CameraPosition | null;
    /**
     * Get all camera positions currently owned by the owner
     */
    static getAllOwnedPositions(owner: CameraOwner): CameraPosition[];
    /**
     * Release ownership of all cameras owned by the owner
     */
    static releaseAllOwnerships(owner: CameraOwner): void;
}

declare enum ZoomListenerEvents {
    didChangeZoomLevel = "ZoomListener.onZoomLevelChanged"
}

interface Viewfinder {
}

declare const NoViewfinder: {
    type: string;
};

declare class RectangularViewfinder extends DefaultSerializeable implements Viewfinder {
    color: Color;
    private type;
    private _onChange?;
    private readonly _style;
    private readonly _lineStyle;
    private _dimming;
    private _disabledDimming;
    private _animation;
    private _sizeWithUnitAndAspect;
    private _disabledColor;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    private set sizeWithUnitAndAspect(value);
    private get coreDefaults();
    constructor();
    constructor(style: RectangularViewfinderStyle);
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
    get style(): RectangularViewfinderStyle;
    get lineStyle(): RectangularViewfinderLineStyle;
    get dimming(): number;
    set dimming(value: number);
    get disabledDimming(): number;
    set disabledDimming(value: number);
    get animation(): RectangularViewfinderAnimation | null;
    set animation(animation: RectangularViewfinderAnimation | null);
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
    setShorterDimensionAndAspectRatio(fraction: number, aspectRatio: number): void;
    get disabledColor(): Color;
    set disabledColor(value: Color);
    private update;
}

declare class AimerViewfinder extends DefaultSerializeable implements Viewfinder {
    frameColor: Color;
    dotColor: Color;
    private type;
    private get coreDefaults();
    constructor();
}

declare class LaserlineViewfinder extends DefaultSerializeable implements Viewfinder {
    width: NumberWithUnit;
    enabledColor: Color;
    disabledColor: Color;
    private type;
    private get coreDefaults();
    constructor();
}

interface LocationSelection {
}

declare const NoneLocationSelection: {
    type: string;
};

interface RadiusLocationSelectionJSON {
    radius: NumberWithUnitJSON;
}
interface PrivateRadiusLocationSelection {
    fromJSON(JSON: RadiusLocationSelectionJSON): RadiusLocationSelection;
}
declare class RadiusLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _radius;
    get radius(): NumberWithUnit;
    static fromJSON(locationSelectionJson: RadiusLocationSelectionJSON): RadiusLocationSelection;
    constructor(radius: NumberWithUnit);
}

interface RectangularLocationSelectionJSON {
    aspect: SizeWithUnitAndAspectJSON;
}
interface PrivateRectangularLocationSelection {
    fromJSON(JSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}
declare class RectangularLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _sizeWithUnitAndAspect;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    static withSize(size: SizeWithUnit): RectangularLocationSelection;
    static withWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): RectangularLocationSelection;
    static withHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): RectangularLocationSelection;
    static fromJSON(rectangularLocationSelectionJSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}

declare enum Expiration {
    Available = "available",
    Perpetual = "perpetual",
    NotAvailable = "notAvailable"
}

declare class LicenseInfo extends DefaultSerializeable {
    private _expiration;
    get expiration(): Expiration;
}

interface ProxyEvent {
    name: string;
    nativeEventName: string;
}

/**
 * Framework specific native calls provider
 */
interface NativeCaller {
    callFn(fnName: string, args: object | undefined | null, meta?: {
        isEventRegistration?: boolean;
    }): Promise<unknown>;
    registerEvent(evName: string, handler: (args: unknown) => Promise<void>): Promise<unknown>;
    unregisterEvent(evName: string, subscription: unknown): Promise<void>;
    eventHook(args: unknown): unknown;
}

declare class NativeProxy {
    eventEmitter: EventEmitter;
    protected nativeCaller: NativeCaller;
    protected eventSubscriptions: Map<string, unknown>;
    private cachedEventHandler;
    [k: string]: unknown;
    constructor(nativeCaller: NativeCaller);
    get framework(): string;
    get frameworkVersion(): string;
    subscribeForEvents(events: string[]): Promise<void>;
    unsubscribeFromEvents(events: string[]): Promise<void>;
    dispose(): Promise<void>;
    _call(fnName: string, args: object | undefined | null): Promise<unknown>;
    _callEventRegistration(fnName: string, args: object | undefined | null): Promise<any>;
    private _registerEvent;
    private _unregisterEvent;
}
declare function createNativeProxy<PROXY>(nativeCaller: NativeCaller): PROXY;

interface NativeCallerProvider<ProxyType extends string = string> {
    getNativeCaller(proxyType: ProxyType): NativeCaller;
}
declare function registerProxies<ProxyType extends string>(proxyTypeNames: readonly ProxyType[], provider: NativeCallerProvider<ProxyType>): void;

interface FactoryMakerItem {
    instance?: unknown;
    builder?: () => unknown;
}
declare class FactoryMaker {
    static instances: Map<string, FactoryMakerItem>;
    static bindInstance(clsName: string, instance: unknown): void;
    static bindLazyInstance<T>(clsName: string, builder: () => T): void;
    static bindInstanceIfNotExists(clsName: string, instance: unknown): void;
    static getInstance<T>(clsName: string): T | undefined;
    static createInstance<T>(clsName: string): T;
}

declare const CORE_PROXY_TYPE_NAMES: readonly ["CoreProxy", "DataCaptureViewProxy", "DataCaptureContextProxy"];
type CoreProxyType = (typeof CORE_PROXY_TYPE_NAMES)[number];
interface CoreNativeCallerProvider extends NativeCallerProvider<CoreProxyType> {
}

declare function registerCoreProxies(provider: CoreNativeCallerProvider): void;

declare function generateIdentifier(): string;

declare enum ClusteringMode {
    Disabled = "disabled",
    Manual = "manual",
    Auto = "auto",
    AutoWithManualCorrection = "autoWithManualCorrection"
}

export { AimerViewfinder, Anchor, BaseController, BaseDataCaptureView, Brush, CORE_PROXY_TYPE_NAMES, Camera, CameraController, CameraOwnershipHelper, CameraOwnershipManager, CameraPosition, CameraSettings, CameraSwitchControlController, ClusteringMode, Color, ContextStatus, ControlImage, CoreProxyAdapter, DataCaptureContext, DataCaptureContextEvents, DataCaptureContextSettings, DataCaptureViewController, DataCaptureViewEvents, DefaultSerializeable, Direction, EventDataParser, Expiration, FactoryMaker, Feedback, FocusGestureListenerEvents, FocusGestureStrategy, FocusRange, FontFamily, FrameDataController, FrameDataSettings, FrameDataSettingsBuilder, FrameSourceListenerEvents, FrameSourceState, HTMLElementState, HtmlElementPosition, HtmlElementSize, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogoStyle, MacroMode, MacroModeListenerEvents, MarginsWithUnit, MeasureUnit, NativeProxy, NoViewfinder, NoneLocationSelection, NumberWithUnit, Observable, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, PrivateFocusGestureDeserializer, PrivateFrameData, PrivateZoomGestureDeserializer, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, SKIP, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, SelectionMode, SequenceFrameSource, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchListenerEvents, TorchState, TorchSwitchControl, Vibration, VibrationType, VideoResolution, WaveFormVibration, ZoomGestureListenerEvents, ZoomListenerEvents, ZoomSwitchControl, ZoomSwitchOrientation, createNativeProxy, ensureCoreDefaults, generateIdentifier, getCoreDefaults, ignoreFromSerialization, ignoreFromSerializationIfNull, loadCoreDefaults, nameForSerialization, registerCoreProxies, registerProxies, serializationDefault, setCoreDefaultsLoader };
export type { BaseProxy, BrushJSON, CameraOwner, CameraSettingsJSON, ColorJSON, Control, CoreDefaults, CoreNativeCallerProvider, CoreProxy, CoreProxyType, DataCaptureComponent, DataCaptureContextCreationOptions, DataCaptureContextListener, DataCaptureContextProxy, DataCaptureMode, DataCaptureOverlay, DataCaptureView, DataCaptureViewListener, DataCaptureViewProxy, DidChangeSizeEventPayload, DidChangeStateEventPayload, DidChangeStatusEventPayload, EventPayload, FeedbackJSON, FocusGesture, FocusGestureJSON, FocusGestureListener, FrameData, FrameDataJSON, FrameSource, FrameSourceDidChangeStateEventPayload, FrameSourceListener, ImageBufferJSON, LocationSelection, MacroModeListener, MarginsWithUnitJSON, NativeCallResult, NativeCaller, NativeCallerProvider, NumberWithUnitJSON, PointJSON, PointWithUnitJSON, PrivateBrush, PrivateCamera, PrivateCameraSettings, PrivateColor, PrivateContextStatus, PrivateControl, PrivateDataCaptureComponent, PrivateDataCaptureContext, PrivateDataCaptureMode, PrivateDataCaptureOverlay, PrivateFeedback, PrivateImageBuffer, PrivateMarginsWithUnit, PrivateNumberWithUnit, PrivatePinchToZoom, PrivatePoint, PrivatePointWithUnit, PrivateQuadrilateral, PrivateRadiusLocationSelection, PrivateRectangularLocationSelection, PrivateRectangularViewfinderAnimation, PrivateScanditIcon, PrivateSize, PrivateSizeWithUnitAndAspect, PrivateSound, PrivateSwipeToZoom, PrivateTapToFocus, PrivateVibration, PropertyChangeListener, ProxyEvent, QuadrilateralJSON, RadiusLocationSelectionJSON, RectangularLocationSelectionJSON, RectangularViewfinderAnimationJSON, ScanditIconJSON, Serializeable, SizeJSON, SizeWithUnitAndAspectJSON, SoundJSON, StringSerializeable, TorchListener, VibrationJSON, Viewfinder, ZoomGesture, ZoomGestureJSON, ZoomGestureListener, ZoomListener };
export { CameraSwitchControl };
