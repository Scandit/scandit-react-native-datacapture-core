import { Size, Orientation, BaseDataCaptureView, MarginsWithUnit, PointWithUnit, LogoStyle, Anchor, FocusGesture, ZoomGesture, Point, Quadrilateral, Control, Serializeable, DataCaptureContext, DataCaptureContextSettings, DataCaptureContextCreationOptions, FrameSourceState, TorchState, CameraPosition, CameraSettings, DataCaptureOverlay as DataCaptureOverlay$1, NativeCaller } from './core';
export { AimerViewfinder, Anchor, Brush, Camera, CameraPosition, CameraSettings, CameraSwitchControl, ClusteringMode, Color, ColorFillOverlay, ContextStatus, Control, DataCaptureComponent, DataCaptureContext, DataCaptureContextCreationOptions, DataCaptureContextListener, DataCaptureContextSettings, DataCaptureMode, DataCaptureOverlay, Direction, Expiration, Feedback, FocusGesture, FocusGestureListener, FocusGestureStrategy, FocusRange, FontFamily, FrameData, FrameDataSettings, FrameDataSettingsBuilder, FrameSource, FrameSourceListener, FrameSourceState, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LocationSelection, LogCategory, LogLevel, LogRecord, LogRecordError, LogoStyle, MacroMode, MacroModeListener, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, ScanditLogger, SelectionMode, SequenceFrameSource, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchListener, TorchState, TorchSwitchControl, Vibration, VibrationType, VideoResolution, Viewfinder, WaveFormVibration, ZoomGesture, ZoomGestureListener, ZoomListener, ZoomSwitchControl, ZoomSwitchOrientation } from './core';
import React$1, { DependencyList, MutableRefObject } from 'react';
import { StyleProp, ViewStyle, LayoutChangeEvent, NativeModule } from 'react-native';

declare function initCoreProxy(): void;

declare function initCoreDefaults(): void;

/**
 * This class contains the DataCapture version getter.
 *
 * @since 6.5.0
 */
declare class DataCaptureVersion {
    /**
     * Returns the version of the Scandit Data Capture Plugin.
     *
     * @since 6.5.0
     */
    static get pluginVersion(): string;
    /**
     * Version of the native SDK the plugin is running against.
     *
     * Read from the Core defaults singleton, which `initCoreDefaults()` populates from the native
     * `DynamicDefaults` payload at import time. This used to read a flat `NativeModule.Version`
     * constant, which native stopped exposing when the residual moved under `DynamicDefaults`
     * (SDC-32175 / SDC-32178) — so it had been returning undefined.
     *
     * Returns the version of the Scandit Data Capture SDK.
     *
     * @since 6.5.0
     */
    static get sdkVersion(): string;
}

/**
 * A capture mode overlay is the UI counterpart of capture modes and visualizes the recognition process in the graphical user interface. Overlays highlight objects such as identified barcodes on top of the preview. Overlays may add UI elements to guide the user, such as view finders.
 *
 * Capture mode overlays are added to a {@link DataCaptureView} through {@link DataCaptureView.addOverlay} and removed again through {@link DataCaptureView.removeOverlay}. Overlays are associated to the data capture modes they require when they are constructed.
 *
 * Overlays are restricted to the set of overlays provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom overlays. This interface does not expose any methods or properties, it just serves as a tag for different overlays.
 *
 * @since 6.5.0
 */
interface DataCaptureOverlay extends Serializeable {
}
/**
 * Listener for observing the data capture view. This listener is typically used when you want to react to orientation and size changes, e.g. to adjust view finder and scan area parameters.
 *
 * @since 6.5.0
 */
interface DataCaptureViewListener {
    /**
     * Invoked when the data capture view changes size or orientation.
     *
     * @since 6.5.0
     */
    didChangeSize?(view: DataCaptureView, size: Size, orientation: Orientation): void;
}
interface DataCaptureViewProps {
    context: DataCaptureContext;
    style: StyleProp<ViewStyle>;
    parentId?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
    /**
     * Internal (AIO wrappers): receives the native teardown promise on unmount so
     * the camera coordinator can park it as a barrier — a sibling screen's fresh
     * view must not be created until this view's native dispose has fully
     * completed, or iOS rendering never re-binds to it (SDC-32484).
     */
    onNativeDispose?: (teardown: Promise<unknown>) => void;
}
/**
 * A React Native component that is the main UI view to be used together with the data capture context for applications that wish to display a video preview together with additional augmentations such as barcode locations.
 *
 * This class should generally not be subclassed, instead you can wrap it in another React Native component if necessary.
 *
 * The data capture view itself only displays the preview and shows UI elements to control the camera, such as buttons to switch torch on and off, or a button to switch between front and back facing cameras. Augmentations, such as the locations of identified barcodes are provided by individual overlays. This view will also display errors in case something goes wrong with its context, see the {@link ContextStatus} for a list of possible errors.
 *
 * Unless otherwise specified, methods and properties of this class should only be accessed from the main thread.
 *
 * DataCaptureView class component example:
 *
 * ```jsx
 * class DataCaptureViewComponent extends React.Component {
 *   state = { context: DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --') }
 *
 *   ...
 *
 *   render() {
 *     return (
 *      <DataCaptureView style={{ flex: 1 }} context={this.state.context}/>
 *     );
 *   }
 * }
 * ```
 *
 * **Related topics**: [Get Started](https://docs.scandit.com/sdks/react-native/barcode-capture/get-started), [MatrixScan Get Started](https://docs.scandit.com/sdks/react-native/matrixscan/get-started), Core Concepts <https://docs.scandit.com/core-concepts>.
 *
 * @since 6.5.0
 */
declare class DataCaptureView extends React$1.Component<DataCaptureViewProps> {
    protected view: BaseDataCaptureView;
    private _isMounted;
    private _viewCreated;
    private _createViewRafHandle;
    constructor(props: DataCaptureViewProps);
    /**
     * The margins to use for the scan area. The margins are measured from the border of the data capture view and allow to specify a region around the border that is excluded from scanning.
     *
     * By default, the margins are zero and the scanning happens in the visible part of the preview.
     *
     * On iOS, the scan area also excludes the left and right safe area insets of the view: on each side, the larger of the margin and the inset applies. This property keeps returning the margins that were set.
     *
     * @since 6.5.0
     */
    get scanAreaMargins(): MarginsWithUnit;
    set scanAreaMargins(newValue: MarginsWithUnit);
    /**
     * The point of interest of this data capture view. By default, the point of interest is centered in the data capture view. The point of interest is used to control the *center of attention* for the following subsystems:
     *
     * - Auto focus and exposure metering of the camera.
     * - {@link LocationSelection|Location selections} for capture modes that support them. When no location selection is set, the point of interest defines the location at which the recognition optimizes for reading codes/text/etc.
     * - Rendered {@link Viewfinder|viewfinders}.
     *
     * The point of interest can be overwritten by individual capture modes such as {@link BarcodeCapture}. The overwriting point of interest only affects the center of the location selection and viewfinder of said mode, it does not affect the auto focus or exposure metering of the camera.
     *
     * @since 6.5.0
     */
    get pointOfInterest(): PointWithUnit;
    set pointOfInterest(newValue: PointWithUnit);
    /**
     * The style of the logo which can be either the default extended “Scanning By Scandit” or a minimal “Scandit”.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.8.0
     */
    get logoStyle(): LogoStyle;
    set logoStyle(style: LogoStyle);
    /**
     * The anchor point to use for positioning the “Scanning By Scandit” logo. By default the logo is placed in the lower-right corner of the scan area ({@link Anchor.BottomRight}).
     *
     * To shift the logo relative to the anchor position, use the {@link DataCaptureView.logoOffset} property.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.5.0
     */
    get logoAnchor(): Anchor;
    set logoAnchor(newValue: Anchor);
    /**
     * The offset applied to the “Scanning By Scandit” logo relative to the {@link DataCaptureView.logoAnchor|logo anchor}. When specified in pixels ({@link MeasureUnit.Pixel}) or device-independent pixels ({@link MeasureUnit.DIP}), the offset is used as-is. When specified as a fraction ({@link MeasureUnit.Fraction}), the offset is computed relative to the view size minus the scan area margins. For example, a value of 0.1 for the x-coordinate will set the offset to be 10% of the view width minus the left and right margins.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.5.0
     */
    get logoOffset(): PointWithUnit;
    set logoOffset(newValue: PointWithUnit);
    /**
     * The gesture used to focus. Defaults to {@link TapToFocus}. Set to *null* if no focus gesture is desired.
     *
     * @since 6.7.0
     */
    get focusGesture(): FocusGesture | null;
    set focusGesture(newValue: FocusGesture | null);
    /**
     * The gestures used to zoom. Defaults to [{@link SwipeToZoom}, {@link PinchToZoom}]. Set to empty array if no zoom gesture is desired.
     *
     * @since 8.4.0
     */
    get zoomGestures(): ZoomGesture[];
    set zoomGestures(newValue: ZoomGesture[]);
    /**
     * The gesture used to zoom. Defaults to {@link SwipeToZoom}. Set to *null* if no zoom gesture is desired.
     *
     * @since 6.7.0
     * @deprecated Use zoomGestures instead. Will be removed in a future version.
     */
    get zoomGesture(): ZoomGesture | null;
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue: ZoomGesture | null);
    /**
     * When enabled, the data capture view may display notifications to inform users about update in zoom level. Defaults to *true*.
     *
     * @since 8.3.0
     */
    get shouldShowZoomNotification(): boolean;
    set shouldShowZoomNotification(newValue: boolean);
    /**
     * Sets a custom property on this data capture view. This function is for internal use. Any features and functionality offered through this method can and will vanish without public notice from one version to the next.
     *
     * @since 8.3.0
     */
    setProperty<T>(name: string, value: T): void;
    /**
     * Adds the overlay to this data capture view. If the overlay is already part of this view, the call has no effect.
     *
     * @since 6.5.0
     */
    addOverlay(overlay: DataCaptureOverlay): Promise<void>;
    /**
     * Removes overlay from this data capture view. If the overlay is not part of this view, the call has no effect.
     *
     * @since 6.5.0
     */
    removeOverlay(overlay: DataCaptureOverlay): Promise<void>;
    /**
     * Adds the listener to this data capture view.
     *
     * In case the same listener is already observing this instance, calling this method will not add the listener again.
     *
     * @since 6.5.0
     */
    addListener(listener: DataCaptureViewListener): void;
    /**
     * Removes a previously added listener from this data capture view.
     *
     * In case the listener is not currently observing this instance, calling this method has no effect.
     *
     * @since 6.5.0
     */
    removeListener(listener: DataCaptureViewListener): void;
    /**
     * Converts a point in the coordinate system of the last visible frame and maps it to a coordinate in the view.
     *
     * This method is thread-safe and can be called from any thread.
     *
     * @since 6.5.0
     */
    viewPointForFramePoint(point: Point): Promise<Point>;
    /**
     * Converts a quadrilateral in the coordinate system of the last visible frame and maps it to a coordinate in the view.
     *
     * @since 6.5.0
     */
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    /**
     * Adds the control to the data capture view. In case multiple controls get added, the order in which {@link DataCaptureView.addControl} gets called determines how the controls are going to be laid out. If the control is already part of this view, the call has no effect.
     *
     * @since 6.8.0
     */
    addControl(control: Control): Promise<void>;
    /**
     * Adds the control to the data capture view at the specified anchor and with the given offset. Only one control per type can be added at any point in time, trying to add a second instance of the same control type will result in the first one being removed. Adding a control at an anchor already taken will replace the previous control there. The offset x will move the control away from the border of the data capture view horizontally, which means that controls anchored on the left will move to the right and vice-versa. Controls anchored in the center horizontally will also move to the right. The offset y will move the control away from the border of the data capture view vertically, which means that controls anchored on the top will move downward and controls anchored to the bottom will move upward. Controls anchored in the center vertically will also move upward.
     *
     * @since 6.22.0
     */
    addControlWithAnchorAndOffset(control: Control, anchor: Anchor, offset: PointWithUnit): void;
    /**
     * Removes the previously added control from data capture view. If the control is not part of this view, the call has no effect.
     *
     * @since 6.8.0
     */
    removeControl(control: Control): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React$1.JSX.Element;
    protected removeAllOverlays(): void;
    private onNativeViewLayout;
    private tryCreateDataCaptureView;
    private scheduleCreateDataCaptureView;
}

/**
 * Returns whether the app is currently in the foreground.
 * Useful for composing the `isActive` prop on scanning views:
 *
 * ```tsx
 * const isForeground = useIsForeground();
 * const isFocused = useIsFocused(); // from @react-navigation/native
 * <BarcodeCaptureAioView isActive={isFocused && isForeground} ... />
 * ```
 */
declare function useIsForeground(): boolean;

type PermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted';
/**
 * The value returned by {@link core.UseCameraPermission}.
 *
 * @since 8.7.0
 */
interface CameraPermissionResult {
    /**
     * Whether camera access is currently granted. True exactly when {@link CameraPermissionResult.permissionStatus} is `granted`.
     *
     * @since 8.7.0
     */
    hasPermission: boolean;
    /**
     * The current permission status, typed as `PermissionStatus` — a union of four string values:
     *
     * `granted`Camera access has been granted.`denied`Camera access has been refused. Android only; iOS cannot report a denial to JavaScript.`not-determined`Camera access has not been decided yet. Also the initial value on iOS.`restricted`Camera access has been refused and the system will not prompt again. Android only, corresponding to `NEVER_ASK_AGAIN`.
     *
     * @since 8.7.0
     */
    permissionStatus: PermissionStatus;
    /**
     * Requests camera access and resolves to whether it was granted. On Android this shows the system prompt. On iOS it cannot drive the prompt and resolves to `true` optimistically — see {@link core.UseCameraPermission}.
     *
     * @since 8.7.0
     */
    requestPermission: () => Promise<boolean>;
}
/**
 * Manages camera permission status.
 *
 * **Android**: real status via `PermissionsAndroid`; `requestPermission()` shows the native
 * prompt; status re-checked when the app returns to the foreground (e.g. user flipped it
 * in Settings).
 *
 * **iOS**: limited. Without a platform-specific native module we can't query
 * `AVCaptureDevice.authorizationStatus` or drive the system prompt directly — iOS
 * handles the permission dialog automatically the first time the camera is accessed.
 * On iOS this hook returns `permissionStatus: 'not-determined'` initially and
 * optimistically flips to `'granted'` after `requestPermission()` is called.
 * It cannot detect denials after-the-fact; consumers should treat the iOS camera-start
 * flow as the authoritative signal (surfaced via `<BarcodeCaptureAioView onError={...} />`).
 *
 * ```tsx
 * const { hasPermission, requestPermission } = useCameraPermission();
 * if (!hasPermission) return <Button onPress={requestPermission} title="Grant Camera Access" />;
 * ```
 */
declare function useCameraPermission(): CameraPermissionResult;

/**
 * The options accepted by {@link core.UseScanditContext}.
 *
 * @since 8.7.0
 */
interface UseScanditContextOptions {
    /**
     * Applied on the first call, then re-applied through {@link DataCaptureContext.applySettings} whenever a different instance is passed. Build the instance once, or memoize it — passing a new instance on every render re-applies the settings on every render.
     *
     * @since 8.7.0
     */
    settings?: DataCaptureContextSettings;
    /**
     * Applied once, when the context is created natively. Later changes are ignored.
     *
     * @since 8.7.0
     */
    creationOptions?: DataCaptureContextCreationOptions;
}
/**
 * Initializes (or retrieves) the DataCaptureContext singleton.
 *
 * ```tsx
 * const settings = useMemo(() => new DataCaptureContextSettings(), []);
 * const context = useScanditContext('YOUR_LICENSE_KEY', { settings });
 * ```
 */
declare function useScanditContext(licenseKey: string, options?: UseScanditContextOptions): DataCaptureContext;

type CameraClaimMode = 'shared' | 'exclusive';
/**
 * Identity object registered by a view. Ownership is by object identity: the
 * registered object IS the owner handle. Mutated in place by `updateClaim`.
 */
interface CameraClaim {
    mode: CameraClaimMode;
    active: boolean;
}
/** What the provider last applied to its own camera (native state latch). */
type CameraAppliedState = 'on' | 'standby' | 'off';
/**
 * Read-only snapshot of the ownership state, for diagnostics only.
 *
 * The engine's invariants ("one screen holds the claim", "the camera drops to
 * Standby between screens") are otherwise invisible at runtime: ownership lives
 * in a closure variable and Standby is a native state with no queryable
 * counterpart on the JS side. Without this, verifying them on-device means
 * inferring from the *absence* of a log line (SDC-33115).
 */
interface CameraOwnerSnapshot {
    /** The current owner's claim mode, or null when no screen holds the claim. */
    ownerMode: CameraClaimMode | null;
    /** The last state the provider applied to its own camera. */
    applied: CameraAppliedState;
    /** True only after a fully successful acquire (both native calls confirmed). */
    acquireSucceeded: boolean;
    /** Number of mutation steps not yet drained by an apply pass. */
    pendingSteps: number;
}
/**
 * The ownership surface `useCameraClaim` is built on, plus camera-wide
 * controls (torch/position) and lifecycle.
 */
interface CameraCoordinator {
    setTorch(torch: TorchState): Promise<void>;
    /**
     * Apply capture settings (resolution, focus, zoom) to the singleton camera.
     * The provider owns the camera, so this is the only way a consumer can
     * configure it — an AIO view has no camera of its own to settle them on.
     */
    setCameraSettings(settings: CameraSettings | null): Promise<void>;
    setPosition(position: CameraPosition): Promise<void>;
    /**
     * Resolves when the current op chain has drained (errors swallowed).
     * Test/diagnostic aid — production code awaits `whenGranted` instead.
     */
    idle(): Promise<void>;
    dispose(): Promise<void>;
    /** Register a claim handle. Registration alone takes no ownership. */
    addClaim(claim: CameraClaim): void;
    /**
     * Patch a claim's `mode`/`active`. Setting `active: true` claims ownership
     * (superseding the previous owner); `active: false` releases the camera if
     * the claim is the current owner, and is ignored otherwise.
     */
    updateClaim(claim: CameraClaim, patch: Partial<CameraClaim>): void;
    /**
     * Drop a claim. `teardown`, if given, is awaited (timeout-raced) before any
     * later camera operation, so a dying view's native dispose can never race
     * the next owner's switch-on.
     */
    removeClaim(claim: CameraClaim, teardown?: Promise<unknown>): void;
    /** Resolves once the chain has applied the state this claim implies. */
    whenGranted(claim: CameraClaim): Promise<void>;
    /**
     * Synchronous snapshot of the ownership state. Diagnostic only — never branch
     * production code on it; the chain is the source of truth and a read here can
     * be stale by the next microtask. Exists so the DebugApp can display
     * ownership and Standby, which are otherwise unobservable (SDC-33115).
     */
    inspect(): CameraOwnerSnapshot;
}
type ScanditInternal = {
    context: DataCaptureContext;
    owner: CameraCoordinator;
};
/**
 * The props of {@link ScanditProvider}.
 *
 * @since 8.7.0
 */
interface ScanditProviderProps {
    /**
     * The Scandit license key. Required on the root provider; a root provider without it throws. Ignored on a nested provider.
     *
     * @since 8.7.0
     */
    licenseKey?: string;
    /**
     * Options applied when the {@link DataCaptureContext} is created. Used by the root provider only, and only at creation — later changes have no effect.
     *
     * @since 8.7.0
     */
    options?: DataCaptureContextCreationOptions;
    /**
     * Settings applied to the {@link DataCaptureContext}. Used by the root provider only.
     *
     * @since 8.7.0
     */
    settings?: DataCaptureContextSettings;
    /**
     * Claims the camera for as long as this is {@link FrameSourceState.On}, without a scanning view being present. Any other value, including leaving it unset, means the provider does not claim the camera and the views below it drive it instead. A view that becomes active while this is {@link FrameSourceState.On} supersedes the provider’s claim.
     *
     * @since 8.7.0
     */
    frameSourceState?: FrameSourceState;
    /**
     * The torch state of the shared camera. On the root provider, leaving it unset applies {@link TorchState.Off}. On a nested provider it is set-only: leaving it unset leaves the torch as the last writer left it. Does not reach `SparkScanAioView` — see Configuring the camera.
     *
     * @since 8.7.0
     */
    torchState?: TorchState;
    /**
     * The position of the shared camera. On the root provider, leaving it unset applies {@link CameraPosition.WorldFacing}. On a nested provider it is set-only: leaving it unset leaves the position as the last writer left it. Changing it recreates the camera. Does not reach `SparkScanAioView` — see Configuring the camera.
     *
     * @since 8.7.0
     */
    cameraPosition?: CameraPosition;
    /**
     * Capture settings — see {@link CameraSettings} — for the shared camera. The provider owns the camera, so this is the only way to configure it: a scanning view has no camera of its own to apply them to.
     *
     * Compared structurally, so an inline `new CameraSettings()` does not need `useMemo`. Set-only on the root provider as well as on nested ones — no default is applied, so leaving it unset or passing `null` leaves the camera as it is rather than restoring device defaults, and a value set by a nested provider outlives that provider’s unmount.
     *
     * @since 8.7.0
     */
    cameraSettings?: CameraSettings | null;
    /**
     * Called when an asynchronous camera operation fails, for example a frame source state transition. Failures are logged regardless; this exists so that they can also be surfaced in the app or sent to telemetry. Honored on the root provider only, since it owns the camera.
     *
     * @since 8.7.0
     */
    onError?: (error: unknown) => void;
    /**
     * The React node tree that has access to this provider’s context and camera.
     *
     * @since 8.7.0
     */
    children: React$1.ReactNode;
}
/**
 * Provides a `DataCaptureContext` and a singleton `Camera` to descendant AIO views.
 *
 * - **Root** (no parent `<ScanditProvider>` above): creates the context + camera,
 *   disposes them on unmount.
 * - **Nested**: applies its own `frameSourceState` / `torchState` / `cameraPosition`
 *   / `cameraSettings` props to the same singleton camera. Last writer wins; values are not reverted
 *   when a nested provider unmounts.
 *
 * The camera is ownership-driven: exactly one view owns it at a time (last
 * claim wins), and it is only on while the owner is a provider-camera view (or
 * `frameSourceState={On}` is set). Torch and position are applied to the
 * coordinator; the camera instance is recreated only when `cameraPosition`
 * flips.
 *
 * ```tsx
 * <ScanditProvider licenseKey={KEY}>
 *   <NavigationContainer> ... </NavigationContainer>
 * </ScanditProvider>
 *
 * // Screen-local control:
 * <ScanditProvider
 *   frameSourceState={isFocused ? FrameSourceState.On : FrameSourceState.Off}
 *   torchState={torch}
 *   cameraPosition={position}>
 *   <BarcodeCaptureAioView navigation={navigation} ... />
 * </ScanditProvider>
 * ```
 *
 * A React component that provides a {@link DataCaptureContext} and a shared {@link Camera} to the scanning views below it. Takes {@link ScanditProviderProps}. See Camera ownership for how the shared camera moves between views.
 *
 * @since 8.7.0
 */
declare function ScanditProvider(props: ScanditProviderProps): React$1.JSX.Element;
/** Internal — exposes the shared context + camera coordinator to AIO views. */
declare function useScanditInternal(): ScanditInternal;
/** Internal — used by AIO views to attach modes to the shared context. */
declare function useDataCaptureContextInternal(): DataCaptureContext;

/**
 * The type of the `navigation` prop on the scanning views. A view uses it to enable itself when its screen is focused and disable itself when the screen is blurred.
 *
 * React Navigation’s `navigation` object satisfies this interface, so it can be passed straight through. Any other source of focus events can implement the same method.
 *
 * ```jsx
 * function ScanScreen({ navigation }) {
 *   return <BarcodeCaptureAioView navigation={navigation} />;
 * }
 * ```
 *
 * @since 8.7.0
 */
interface ScanditNavigationProp {
    /**
     * Subscribes to a screen event and returns the function that cancels the subscription. It is optional: a view given no `navigation` prop simply does not react to focus changes.
     *
     * ```jsx
     * addListener?(type: 'focus' | 'blur', callback: () => void): () => void
     * ```
     *
     * @since 8.7.0
     */
    addListener?(type: 'focus' | 'blur', callback: () => void): () => void;
}
/**
 * Imperative control over whether a scanning view is scanning. Every scanning view’s `ref` handle carries these two methods, so they are available on any of them.
 *
 * Reach for this only when the declarative path does not fit. Normally a view is driven by its {@link ScanditNavigationProp} and its `disabled` prop, which handle screen focus and app background automatically — see Camera ownership.
 *
 * ```jsx
 * const ref = useRef(null);
 *
 * <BarcodeCaptureAioView ref={ref} navigation={navigation} />
 * <Button title="Pause" onPress={() => ref.current?.disable()} />
 * ```
 *
 * @since 8.7.0
 */
interface EnableDisableHandle {
    /**
     * Starts scanning now: enables the mode and claims the camera. Claiming the camera supersedes whichever view held it — see Camera ownership.
     *
     * @since 8.7.0
     */
    enable(): Promise<void>;
    /**
     * Stops scanning now: disables the mode and releases the camera.
     *
     * @since 8.7.0
     */
    disable(): Promise<void>;
}








/**
 * Returns a referentially-stable copy of `value` as long as the structural
 * content stays the same. Lets consumers pass inline SDK class instances
 * (`new Brush(...)`, `new TorchSwitchControl()`) or plain options objects
 * without memoizing — the effect deps array sees the same reference until
 * the underlying content actually changes.
 *
 * SDK classes that extend `DefaultSerializeable` are compared via their
 * `toJson()` output (which respects `@ignoreFromSerialization`), so private
 * back-refs like `view` don't cause spurious diffs. Plain objects and arrays
 * are compared via direct `JSON.stringify`.
 *
 * ```tsx
 * function MyView({ brush }: { brush?: Brush | null }) {
 *   const stableBrush = useStableProp(brush);
 *   useEffect(() => {
 *     if (stableBrush) overlay.brush = stableBrush;
 *   }, [stableBrush]);
 * }
 * ```
 */
declare function useStableProp<T>(value: T): T;

/**
 * Mirrors a fixed set of prop values onto a live native-view instance via
 * direct property assignment.
 *
 * `keys` is constrained to `keyof Props & keyof Target` and combined with an
 * `as const satisfies ReadonlyArray<...>` at the call site, so a rename on
 * either side — prop interface or native view — is a compile error.
 *
 * `undefined` values are skipped to preserve SDK defaults. The effect is
 * gated on `target` so setter RPCs only fire after the native view is
 * attached.
 *
 * For batched-update layers that expose an `updateWithProps(prev, next)`
 * method, keep their own diff effect rather than using this hook — it would
 * fire one RPC per key instead of one per render.
 *
 * ```ts
 * const KEYS = ['shouldShowTorchControl', 'torchControlPosition'] as const
 *   satisfies ReadonlyArray<keyof MyProps & keyof BaseView>;
 *
 * usePassThroughProps(baseView, props, KEYS);
 * ```
 */
declare function usePassThroughProps<Props extends object, Target extends object, Keys extends ReadonlyArray<keyof Props & keyof Target>>(target: Target | null, props: Props, keys: Keys): void;

type UseModeListenerProps<TMode, TListener extends object> = {
    mode: TMode | null;
    listenerFns: TListener;
    addListener: (mode: TMode, listener: TListener) => void;
    removeListener: (mode: TMode, listener: TListener) => void;
};
/**
 * Registers a listener on a Scandit mode or view and keeps it up to date.
 *
 * Pass `listenerFns` with the callbacks you care about and leave the rest
 * `undefined`. The hook only registers when `mode` is non-null and at least
 * one callback is set; it unregisters automatically on unmount or when those
 * conditions stop being true.
 *
 * The proxy installed on the target contains methods **only for keys whose
 * values are currently defined**. This matters because some shared
 * controllers do `if (listener.foo)` truthy checks (e.g.
 * `BarcodeBatchBasicOverlayController.handleBrushForTrackedBarcode`) and a
 * proxy method that returns `undefined` is interpreted as a real `null`
 * response by the bridge — which wipes the configured default brush. When
 * the set of defined keys changes (a callback flips between defined and
 * undefined across renders), the proxy is rebuilt and the listener is
 * unregistered + re-registered.
 *
 * Inline functions are fine — within the "defined" set, the registered
 * listener is a stable proxy that always dispatches to the latest version of
 * each callback without re-registering.
 *
 * ```tsx
 * useModeListener<BarcodeCapture, BarcodeCaptureListener>({
 *   mode,
 *   listenerFns: {
 *     didScan: onScan ? async (_c, session, getFD) => onScan(session, getFD) : undefined,
 *   },
 *   addListener: (m, l) => m.addListener(l),
 *   removeListener: (m, l) => m.removeListener(l),
 * });
 * ```
 */
declare function useModeListener<TMode, TListener extends object>({ mode, listenerFns, addListener, removeListener, }: UseModeListenerProps<TMode, TListener>): void;

type ViewHandle<T> = {
    /**
     * Ref callback to pass to the view. Updates both the internal mutable ref
     * and the reactive state so effects can depend on the view being mounted.
     */
    ref: (v: T | null) => void;
    /** Latest view instance for use inside effects/deps. */
    current: T | null;
    /** Same value as `current`, exposed as the mutable ref consumers also rely on. */
    mutableRef: React.MutableRefObject<T | null>;
    /** Stable, process-unique id used by views that need a parent-id linkage to native serialization. */
    id: number;
    /**
     * `onLayout` handler to pass to the native component. Fires when the view is
     * laid out (committed to the native tree), at which point `findNodeHandle`
     * returns a valid handle. This is the signal `whenReady` resolves on.
     */
    onLayout: () => void;
    /**
     * Resolves the first time the native view is laid out. Use this to gate
     * native-view creation instead of `InteractionManager.runAfterInteractions`:
     * layout is not starvable by a blocked JS interaction queue (e.g. a looping
     * animation with `useNativeDriver: false`), which would otherwise leave the
     * preview view never created. See SDC-32208.
     *
     * Callers that await `whenReady()` MUST also wire `onLayout` onto the mounted
     * native component — otherwise the promise never resolves.
     */
    whenReady: () => Promise<void>;
};
/**
 * Bundles the `ref + viewState + viewId` pattern that AIO views share.
 *
 * - The returned `ref` is stable across renders.
 * - `current` is a reactive snapshot — effects keyed on it re-run when the
 *   view mounts/unmounts. `mutableRef` exposes the same value for imperative
 *   reads that must not trigger re-renders.
 * - `id` is generated once per hook instance and stays stable for the lifetime
 *   of the component, suitable for `parentId` serialization.
 */
declare function useViewHandle<T>(): ViewHandle<T>;

interface ControlHost<C> {
    addControl: (control: C) => Promise<void> | void;
    removeControl: (control: C) => Promise<void> | void;
}
/**
 * Adds `control` to `view` while both are present and the control reference is
 * stable. Removes the control on unmount or when either reference changes.
 *
 * The view is typically a `DataCaptureView` and the control is a Scandit
 * `Control` (e.g. `TorchSwitchControl`, `ZoomSwitchControl`). Pair this with
 * `useStableProp(control)` at the call site so inline `new XControl()`
 * instantiation doesn't churn add/remove.
 */
declare function useNativeControl<V extends ControlHost<C>, C>(view: V | null, control: C | null | undefined): void;

/**
 * Minimal shape of an overlay (or any resource) `useMode` can orchestrate.
 * Matches `UseOverlayApi` — `useOverlay` returns objects assignable to this.
 */
interface ModeAttachable {
    attach: () => void | Promise<void>;
    detach: () => void | Promise<void>;
}
interface UseModeOptions<TMode> {
    /**
     * Initial user veto. When `true`, the mode is attached but the first
     * `setEnabled` is *not* an enable — it honors the veto (the mode comes up
     * disabled). After attach, drive on/off with the returned `enable()` /
     * `disable()`. `false`/unset means the mode auto-enables on attach.
     */
    disabled?: boolean;
    createMode: () => TMode;
    applySettings: (mode: TMode) => void | Promise<void>;
    setEnabled: (mode: TMode, enabled: boolean) => void | Promise<void>;
    attach: (mode: TMode) => void | Promise<void>;
    detach: (mode: TMode) => void | Promise<void>;
    /**
     * Resources attached/detached in lockstep with the mode. Each is `attach()`-ed
     * after the consumer's `attach(mode)` resolves (in declaration order), and
     * `detach()`-ed before the consumer's `detach(mode)` is called (in reverse
     * order). Designed for the `UseOverlayApi` returned by `useOverlay`.
     */
    attachables?: ReadonlyArray<ModeAttachable>;
    /** Gate attach on external readiness (e.g. native view node mounted). Defaults to true. */
    canAttach?: boolean;
    /** Re-apply settings when any of these change (and the mode is attached). */
    settingsDeps: DependencyList;
}
interface UseModeApi<TMode> {
    /** Lazy accessor. Creates the mode on first call; nulled out after detach. */
    getMode: () => TMode;
    /** Read-only view of the underlying ref. Null when no mode currently exists. */
    modeRef: MutableRefObject<TMode | null>;
    /** True while the mode is currently attached. */
    isAttached: () => boolean;
    /** Enable the mode now (applied on attach if called before it completes). */
    enable: () => Promise<void>;
    /** Disable the mode now (applied on attach if called before it completes). */
    disable: () => Promise<void>;
    /**
     * Attach (add to context) the mode now. Idempotent; serialized with `detach()`.
     * Re-attaches the *same* instance, so the listener registered via
     * `useModeListener` survives (it stays on the mode and re-subscribes when the
     * mode is re-added to a context). Drive from screen focus so the focused view
     * always owns the context's single active mode — the native context is
     * single-active-mode and `addMode` of a non-coexisting mode silently evicts
     * the others, so a blurred view must `detach()` and re-`attach()` on focus
     * rather than merely toggling `enabled`.
     */
    attach: () => Promise<void>;
    /** Detach (remove from context) the mode now. Idempotent; serialized with `attach()`. */
    detach: () => Promise<void>;
}
/**
 * Mode-lifetime helper shared by SDK view components.
 *
 * Owns: lazy mode creation, attach-on-mount / detach-on-unmount, settings
 * reapply on dep change, and the mode's `isEnabled` via the returned
 * `enable()` / `disable()`. The first `setEnabled` after attach honors the
 * `disabled` veto, so a view declared `disabled` comes up off.
 *
 * Enable/disable intent is tracked in a ref (not React state) and applied as
 * soon as the mode is attached — calling `enable()`/`disable()` before attach
 * completes is fine; the pending value is flushed on attach.
 *
 * Side-effecting callbacks (`attach`, `detach`, `applySettings`, `setEnabled`,
 * `createMode`) are read through a ref, so callers can pass closures without
 * memoizing — only `canAttach` and `settingsDeps` drive effects.
 */
declare function useMode<TMode>(options: UseModeOptions<TMode>): UseModeApi<TMode>;



interface UseOverlayOptions<O extends DataCaptureOverlay$1> {
    /**
     * Ref to the underlying `DataCaptureView`. The overlay is added the first
     * time `attach()` is called with `view.current` non-null.
     */
    view: MutableRefObject<DataCaptureView | null>;
    /**
     * Whether the overlay should be attached. Defaults to `true`. Toggling at
     * runtime triggers a detach/re-attach while the mode is otherwise attached.
     */
    enabled?: boolean;
    /**
     * Build the overlay. Re-invoked whenever `factoryDeps` change while the
     * overlay is attached — the old overlay is removed and the new one added,
     * preserving order with respect to `useMode`'s lifecycle.
     */
    factory: () => O;
    /**
     * Deps that trigger a recreate (`removeOverlay` → `factory()` → `addOverlay`).
     * Use for constructor-time props (e.g. overlay style). Defaults to `[]`.
     */
    factoryDeps?: DependencyList;
    /**
     * Apply mutable state to the overlay (brushes, viewfinder, scan-area guides).
     * Runs once after attach and whenever `updateDeps` change while attached.
     */
    update?: (overlay: O) => void;
    /** Deps that re-trigger `update`. Defaults to `[]`. */
    updateDeps?: DependencyList;
}
interface UseOverlayApi<O> {
    /**
     * Reactive overlay snapshot. `null` until attached and again after detach
     * (and momentarily during a `factoryDeps`-driven recreate). Pass to
     * `useModeListener` as the `mode` field so listener registration follows
     * the overlay lifecycle.
     */
    overlay: O | null;
    /** Non-reactive accessor for imperative reads. */
    getOverlay: () => O | null;
    /** Add the overlay to the view. Idempotent. Call from `useMode.attachables`. */
    attach: () => Promise<void>;
    /** Remove the overlay from the view. Idempotent. Call from `useMode.attachables`. */
    detach: () => Promise<void>;
}
/**
 * Lifecycle helper for `DataCaptureView` overlays. Pass the returned value into
 * `useMode({ attachables: [...] })` — `useMode` orders `attach()` after the
 * mode is added to the context and `detach()` before it's removed.
 *
 * Listener registration is not handled here; pair with `useModeListener`
 * keyed on the reactive `overlay` snapshot:
 *
 * ```tsx
 * const basicOverlay = useOverlay<BarcodeBatchBasicOverlay>({ ... });
 *
 * useModeListener<BarcodeBatchBasicOverlay, BarcodeBatchBasicOverlayListener>({
 *   mode: basicOverlay.overlay,
 *   listenerFns: { brushForTrackedBarcode, didTapTrackedBarcode },
 *   addListener: (o, l) => { o.listener = l; },
 *   removeListener: o => { o.listener = null; },
 * });
 * ```
 */
declare function useOverlay<O extends DataCaptureOverlay$1>(opts: UseOverlayOptions<O>): UseOverlayApi<O>;





interface UseLifecycleHookProps {
    /** Navigation object (e.g. React Navigation's `navigation`) for screen focus/blur. */
    navigation?: ScanditNavigationProp;
    disabled?: boolean;
    appStateHandlingDisabled?: boolean;
    /** Called when the view should run: focused AND foregrounded AND not `disabled`. */
    onEnable: () => Promise<void>;
    /** Called when the view should be off: blurred, backgrounded, or `disabled`. */
    onDisable: () => Promise<void>;
}
/**
 * Handle modes lifetime by calling `onEnable` / `onDisable` when the navigation focus or blur event happens or AppState changes to not active.
 */
declare function useLifecycleHook({ navigation, disabled, appStateHandlingDisabled, onEnable, onDisable, }: UseLifecycleHookProps): void;

interface UseCameraClaimOptions {
    /**
     * `'shared'`: wants the provider camera on, coexisting with other shared
     * claims. `'exclusive'`: takes camera 0 for itself and forces the provider
     * camera off/released for as long as this claim is active. An active
     * exclusive claim always wins over any number of active shared claims.
     */
    mode: CameraClaimMode;
    /** Declarative desired state — wire straight from the view's enable/disable. */
    active: boolean;
    /**
     * Ref to the wrapper's Scandit view component (its React tag matches the
     * `viewId` carried by the native window events). When given, the claim also
     * follows the native view's window lifecycle: entering a window (re-)claims
     * camera ownership if `active`, leaving it releases — covering reveals, tab
     * switches and covered screens without any navigation-library coupling.
     */
    nativeViewRef?: React.RefObject<unknown>;
}
interface CameraClaimHandle {
    /**
     * Resolves once the coordinator's reconcile loop has applied the state this
     * claim implies (shared → provider camera on; exclusive → provider camera
     * released, this claim's native view owns camera 0). Resolves immediately
     * while `active` is false — there is nothing to grant. Re-arms every call:
     * awaiting it again after `active` flips true→false→true waits for the
     * fresh transition, never a stale resolution.
     */
    granted(): Promise<void>;
    /**
     * Detach-time: drops the claim. `teardown`, when given, is a native-dispose
     * barrier — the coordinator parks it and makes every later camera
     * transition wait for it to settle (resolve OR reject) before running, so a
     * popped view's async dispose can't race the next view's camera. Safe to
     * call more than once; only the first call has an effect.
     */
    release(teardown?: Promise<unknown>): void;
}
/**
 * The entire camera-ownership contract a view wrapper needs to learn. Register
 * a claim and drive it declaratively via `active`; the coordinator in
 * `ScanditProvider.tsx` derives the actual camera state from the full set of
 * currently-registered claims (see its module doc for the derivation rules)
 * and coalesces rapid changes into a single native transition.
 */
declare function useCameraClaim({ mode, active, nativeViewRef }: UseCameraClaimOptions): CameraClaimHandle;

interface AttachNativeViewWhenReadyOptions<T> {
    /**
     * Mode name used in the failure log, e.g. `SparkScan`. Rendered as
     * `[useMode:<tag>] attach failed: …` so a device log names the view that died.
     */
    tag: string;
    /**
     * The mounted native view instance, normally `viewHandle.current` captured at
     * render. `null` means there is nothing to attach and the attach resolves as a
     * no-op.
     */
    node: T | null;
    /** `viewHandle.whenReady` — resolves on first layout. */
    whenReady: () => Promise<void>;
    /**
     * Everything this view must do once it has a native node id: build the base
     * view, await any camera claim, create the native view, publish state. Any
     * throw in here is surfaced rather than swallowed.
     */
    createNativeView: (nodeId: number) => Promise<void>;
}
/**
 * The `attach` body shared by every AIO view that owns its own native view.
 *
 * It exists because getting this wrong is invisible. The natural shape —
 * `new Promise(resolve => { void whenReady().then(async () => { … resolve() }) })`
 * — has no rejection path, so anything thrown past `whenReady()` leaves the
 * returned promise neither resolved nor rejected. `useMode` serializes lifecycle
 * work on a single op chain, so an attach that never settles blocks *every*
 * later op behind it: `setEnabled` never runs, the unmount `detach()` never
 * runs, the camera claim never activates and the provider camera parks in
 * Standby. The user gets a black view with no error, no crash, and no recovery
 * even by navigating away and back.
 *
 * That is not hypothetical: it shipped in `SparkScanAioView`, where a colour
 * default typed `Color` but holding a hex string made `toJSON()` throw inside
 * `createNativeView` (SDC-33115). `BarcodeCountAioView` and `BarcodeArAioView`
 * carried the same shape with the same reachable throw sites and were working
 * only by luck. Routing all three through here means a fourth view cannot
 * reintroduce the bug by writing the obvious thing.
 *
 * Gating on layout rather than `InteractionManager.runAfterInteractions` is
 * deliberate: that queue can be starved by a blocked JS interaction, which
 * leaves the preview never created (SDC-32208).
 */
declare function attachNativeViewWhenReady<T>({ tag, node, whenReady, createNativeView, }: AttachNativeViewWhenReadyOptions<T>): Promise<void>;

/**
 * Render an unknown thrown value as a string worth logging.
 *
 * Exists because `console.warn('...', err)` loses the only part that matters.
 * `Error.message` and `Error.stack` are **non-enumerable**, so any log sink that
 * JSON-serializes its arguments — the DebugApp's on-device console tee, among
 * others — writes `{}` for a plain `Error`, or, for a React Native native
 * rejection, just `{"code":"-1","nativeStackIOS":[…]}` with the message gone.
 *
 * That is not hypothetical. During the SDC-33115 B4 rapid-swap run the device
 * showed `Unable to switch the camera to on` on screen while the captured log
 * held only the code and a native stack, because LogBox reads `err.message`
 * directly and the file sink had already dropped it. Interpolating first makes
 * the two agree.
 */
declare function describeError(err: unknown): string;













type index_d_AttachNativeViewWhenReadyOptions<T> = AttachNativeViewWhenReadyOptions<T>;
type index_d_CameraClaimHandle = CameraClaimHandle;
type index_d_EnableDisableHandle = EnableDisableHandle;
type index_d_ScanditNavigationProp = ScanditNavigationProp;
type index_d_UseCameraClaimOptions = UseCameraClaimOptions;
type index_d_UseModeApi<TMode> = UseModeApi<TMode>;
type index_d_UseModeListenerProps<TMode, TListener extends object> = UseModeListenerProps<TMode, TListener>;
type index_d_UseModeOptions<TMode> = UseModeOptions<TMode>;
type index_d_UseOverlayApi<O> = UseOverlayApi<O>;
type index_d_UseOverlayOptions<O extends DataCaptureOverlay$1> = UseOverlayOptions<O>;
type index_d_ViewHandle<T> = ViewHandle<T>;
declare const index_d_attachNativeViewWhenReady: typeof attachNativeViewWhenReady;
declare const index_d_describeError: typeof describeError;
declare const index_d_useCameraClaim: typeof useCameraClaim;
declare const index_d_useDataCaptureContextInternal: typeof useDataCaptureContextInternal;
declare const index_d_useLifecycleHook: typeof useLifecycleHook;
declare const index_d_useMode: typeof useMode;
declare const index_d_useModeListener: typeof useModeListener;
declare const index_d_useNativeControl: typeof useNativeControl;
declare const index_d_useOverlay: typeof useOverlay;
declare const index_d_usePassThroughProps: typeof usePassThroughProps;
declare const index_d_useScanditInternal: typeof useScanditInternal;
declare const index_d_useStableProp: typeof useStableProp;
declare const index_d_useViewHandle: typeof useViewHandle;
declare namespace index_d {
  export { index_d_attachNativeViewWhenReady as attachNativeViewWhenReady, index_d_describeError as describeError, index_d_useCameraClaim as useCameraClaim, index_d_useDataCaptureContextInternal as useDataCaptureContextInternal, index_d_useLifecycleHook as useLifecycleHook, index_d_useMode as useMode, index_d_useModeListener as useModeListener, index_d_useNativeControl as useNativeControl, index_d_useOverlay as useOverlay, index_d_usePassThroughProps as usePassThroughProps, index_d_useScanditInternal as useScanditInternal, index_d_useStableProp as useStableProp, index_d_useViewHandle as useViewHandle };
  export type { index_d_AttachNativeViewWhenReadyOptions as AttachNativeViewWhenReadyOptions, index_d_CameraClaimHandle as CameraClaimHandle, index_d_EnableDisableHandle as EnableDisableHandle, index_d_ScanditNavigationProp as ScanditNavigationProp, index_d_UseCameraClaimOptions as UseCameraClaimOptions, index_d_UseModeApi as UseModeApi, index_d_UseModeListenerProps as UseModeListenerProps, index_d_UseModeOptions as UseModeOptions, index_d_UseOverlayApi as UseOverlayApi, index_d_UseOverlayOptions as UseOverlayOptions, index_d_ViewHandle as ViewHandle };
}

interface ScanditNativeModule extends NativeModule {
    [key: string]: any;
}
declare function getNativeModule(name: string): ScanditNativeModule;
/**
 * Returns the dynamic residual exposed by native as `DynamicDefaults` (device id, SDK version,
 * probed camera positions, localized accessibility labels, ...). Every supported version of the
 * native side exposes it, so there is no legacy full-`Defaults`-blob fallback anymore
 * (SDC-32175/SDC-32178).
 */
declare function getModuleDynamicDefaults(name: string): any;

declare class RNNativeCaller implements NativeCaller {
    private nativeModule;
    private _nativeEventEmitter;
    constructor(nativeModule: ScanditNativeModule);
    /**
     * Lazily creates the NativeEventEmitter only when needed (old architecture fallback).
     * Avoids the "NativeEventEmitter was called with a non-null argument without the
     * required addListener method" warning that fires when eagerly constructing the
     * emitter for TurboModule-based native modules.
     */
    private get nativeEventEmitter();
    get framework(): string;
    get frameworkVersion(): string;
    callFn(fnName: string, args: object | undefined | null, _meta?: {
        isEventRegistration?: boolean;
    }): Promise<any>;
    registerEvent(evName: string, handler: (args: any) => Promise<void>): Promise<any>;
    unregisterEvent(evName: string, subscription: any): Promise<void>;
    eventHook(args: any): any;
}
declare function createRNNativeCaller(nativeModule: ScanditNativeModule): RNNativeCaller;

export { DataCaptureVersion, RNNativeCaller, ScanditProvider, index_d as _internal, createRNNativeCaller, getModuleDynamicDefaults, getNativeModule, initCoreDefaults, initCoreProxy, useCameraPermission, useIsForeground, useScanditContext };
export type { CameraPermissionResult, DataCaptureViewListener, EnableDisableHandle, PermissionStatus, ScanditNativeModule, ScanditNavigationProp, ScanditProviderProps, UseScanditContextOptions };
export { DataCaptureView };
