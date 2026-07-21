import { CORE_PROXY_TYPE_NAMES, registerCoreProxies, loadCoreDefaults, setCoreDefaultsLoader, BaseDataCaptureView, DataCaptureContext, TorchState, CameraPosition, FrameSourceState, Camera } from './core.js';
export { AimerViewfinder, Anchor, Brush, CameraSettings, ClusteringMode, Color, ContextStatus, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameDataSettings, FrameDataSettingsBuilder, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogoStyle, MacroMode, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, SelectionMode, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchSwitchControl, Vibration, VideoResolution, WaveFormVibration, ZoomSwitchControl, ZoomSwitchOrientation } from './core.js';
import { NativeEventEmitter, Platform, NativeModules, TurboModuleRegistry, findNodeHandle, requireNativeComponent, AppState, PermissionsAndroid } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react';

class RNNativeCaller {
    nativeModule;
    _nativeEventEmitter = null;
    constructor(nativeModule) {
        this.nativeModule = nativeModule;
    }
    /**
     * Lazily creates the NativeEventEmitter only when needed (old architecture fallback).
     * Avoids the "NativeEventEmitter was called with a non-null argument without the
     * required addListener method" warning that fires when eagerly constructing the
     * emitter for TurboModule-based native modules.
     */
    get nativeEventEmitter() {
        if (!this._nativeEventEmitter) {
            this._nativeEventEmitter = new NativeEventEmitter(this.nativeModule);
        }
        return this._nativeEventEmitter;
    }
    get framework() {
        return 'react-native';
    }
    get frameworkVersion() {
        const { major, minor, patch } = Platform.constants.reactNativeVersion;
        return `${major}.${minor}.${patch}`;
    }
    callFn(fnName, args, _meta) {
        // meta parameter ignored - React Native handles events automatically through NativeEventEmitter
        const fn = this.nativeModule[fnName];
        // Some frameworks pass array-like objects with length property
        const hasLength = args && typeof args === 'object' && 'length' in args;
        if (args === null || args === undefined || (hasLength && args.length > 0)) {
            return fn();
        }
        return fn(args);
    }
    registerEvent(evName, handler) {
        const newArchModule = this.nativeModule;
        // New architecture: use CodegenTypes.EventEmitter (onScanditEvent)
        // Each subscription filters by event name
        if (newArchModule.onScanditEvent) {
            const subscription = newArchModule.onScanditEvent((event) => {
                if (event.name === evName) {
                    void handler(event);
                }
            });
            return Promise.resolve(subscription);
        }
        // Old architecture fallback: one listener per event name via NativeEventEmitter
        return Promise.resolve(this.nativeEventEmitter.addListener(evName, (event) => {
            // Fire-and-forget: intentionally not awaiting to match NativeEventEmitter's sync signature
            void handler(event);
        }));
    }
    async unregisterEvent(evName, subscription) {
        try {
            await subscription.remove();
        }
        catch (error) {
            console.warn(`Failed to unregister event '${evName}':`, error);
        }
    }
    eventHook(args) {
        return args;
    }
}
function createRNNativeCaller(nativeModule) {
    return new RNNativeCaller(nativeModule);
}

class RNCoreNativeCallerProvider {
    getNativeCaller(proxyType) {
        if (!CORE_PROXY_TYPE_NAMES.includes(proxyType)) {
            throw new Error(`No native module mapped for proxy type: ${proxyType}`);
        }
        return createRNNativeCaller(NativeModules.ScanditDataCaptureCore);
    }
}

function initCoreProxy() {
    registerCoreProxies(new RNCoreNativeCallerProvider());
}

function getNativeModule(name) {
    let mod = null;
    // Try TurboModuleRegistry first (new architecture)
    // Available in RN 0.70+
    if (typeof TurboModuleRegistry !== 'undefined' && TurboModuleRegistry.get) {
        // Try the module name directly first
        mod = TurboModuleRegistry.get(name);
        if (mod) {
            return mod;
        }
        // Try with "Native" prefix (TurboModules naming convention)
        const nativeName = `Native${name}`;
        mod = TurboModuleRegistry.get(nativeName);
        if (mod) {
            return mod;
        }
    }
    // Fallback to NativeModules (legacy architecture)
    mod = NativeModules[name];
    if (mod) {
        return mod;
    }
    throw new Error(`Module ${name} not found. Ensure the native module is properly linked.`);
}
function getModuleDefaults(name) {
    const mod = getNativeModule(name);
    // Constants are automatically merged by React Native
    const defaults = mod.Defaults;
    if (defaults) {
        // Our modules will always be returned by Defaults property, the legacy
        // code is there just to ensure compatibility with older versions of React Native.
        return defaults;
    }
    // Fallback: Try getConstants() directly
    if (typeof mod.getConstants === 'function') {
        const constants = mod.getConstants();
        if (constants?.Defaults) {
            return constants.Defaults;
        }
    }
    throw new Error(`Could not load Defaults from module ${name}`);
}

function initCoreDefaults() {
    // Use helper to get defaults with fallback logic
    const defaults = getModuleDefaults('ScanditDataCaptureCore');
    loadCoreDefaults(defaults);
}
setCoreDefaultsLoader(initCoreDefaults);

const NativeModule = getNativeModule('ScanditDataCaptureCore');
class DataCaptureVersion {
    static get pluginVersion() {
        return '8.5.1';
    }
    static get sdkVersion() {
        return NativeModule.Version;
    }
}

class DataCaptureView extends React.Component {
    view;
    _isMounted = false;
    _viewCreated = false;
    _createViewRafHandle = null;
    constructor(props) {
        super(props);
        // Do not create the view automatically. Do that only when componentDidMount is called.
        this.view = new BaseDataCaptureView(props.context);
        this.view.viewComponent = this;
        this.view.parentId = props.parentId ?? null;
    }
    get scanAreaMargins() {
        return this.view.scanAreaMargins;
    }
    set scanAreaMargins(newValue) {
        this.view.scanAreaMargins = newValue;
    }
    get pointOfInterest() {
        return this.view.pointOfInterest;
    }
    set pointOfInterest(newValue) {
        this.view.pointOfInterest = newValue;
    }
    get logoStyle() {
        return this.view.logoStyle;
    }
    set logoStyle(style) {
        this.view.logoStyle = style;
    }
    get logoAnchor() {
        return this.view.logoAnchor;
    }
    set logoAnchor(newValue) {
        this.view.logoAnchor = newValue;
    }
    get logoOffset() {
        return this.view.logoOffset;
    }
    set logoOffset(newValue) {
        this.view.logoOffset = newValue;
    }
    get focusGesture() {
        return this.view.focusGesture;
    }
    set focusGesture(newValue) {
        this.view.focusGesture = newValue;
    }
    get zoomGestures() {
        return this.view.zoomGestures;
    }
    set zoomGestures(newValue) {
        this.view.zoomGestures = newValue;
    }
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    get zoomGesture() {
        return this.view.zoomGesture;
    }
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue) {
        this.view.zoomGesture = newValue;
    }
    get shouldShowZoomNotification() {
        return this.view.shouldShowZoomNotification;
    }
    set shouldShowZoomNotification(newValue) {
        this.view.shouldShowZoomNotification = newValue;
    }
    setProperty(name, value) {
        this.view.setProperty(name, value);
    }
    addOverlay(overlay) {
        return this.view.addOverlay(overlay);
    }
    removeOverlay(overlay) {
        return this.view.removeOverlay(overlay);
    }
    addListener(listener) {
        this.view.addListener(listener);
    }
    removeListener(listener) {
        this.view.removeListener(listener);
    }
    viewPointForFramePoint(point) {
        return this.view.viewPointForFramePoint(point);
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
        return this.view.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
    }
    addControl(control) {
        return this.view.addControl(control);
    }
    addControlWithAnchorAndOffset(control, anchor, offset) {
        return this.view.addControlWithAnchorAndOffset(control, anchor, offset);
    }
    removeControl(control) {
        return this.view.removeControl(control);
    }
    componentWillUnmount() {
        this._isMounted = false;
        this._viewCreated = false;
        if (this._createViewRafHandle !== null) {
            cancelAnimationFrame(this._createViewRafHandle);
            this._createViewRafHandle = null;
        }
        this.view.dispose();
    }
    componentDidMount() {
        this._isMounted = true;
        // Dual trigger (SDC-32583): `onLayout` is the primary trigger, but on some
        // setups (RN 0.78 New Architecture, Android release builds) `onLayout` is
        // not reliably emitted on the Fabric view, so relying on it alone can leave
        // the native view uncreated. Also attempt creation from a
        // `requestAnimationFrame` loop, which is frame-aligned (fires once the view
        // is committed so `findNodeHandle` is valid) and, unlike `InteractionManager`,
        // cannot be starved. `_viewCreated` is set synchronously, so whichever
        // trigger fires first wins exactly once.
        this.scheduleCreateDataCaptureView();
    }
    render() {
        return React.createElement(RNTDataCaptureView, { ...this.props, onLayout: this.onNativeViewLayout });
    }
    removeAllOverlays() {
        this.view.removeAllOverlays();
    }
    // Create the native view on layout rather than via
    // `InteractionManager.runAfterInteractions`: layout fires when the view is
    // committed to the native tree (so `findNodeHandle` is valid) and is not
    // starvable by a blocked JS interaction queue (e.g. a looping animation with
    // `useNativeDriver: false`), which previously left the preview never created.
    // See SDC-32208. `onLayout` can fire repeatedly, so create exactly once.
    onNativeViewLayout = (event) => {
        // Forward to a caller-supplied onLayout so our internal handler doesn't
        // swallow it (render() overrides the spread `onLayout` with this one).
        this.props.onLayout?.(event);
        this.tryCreateDataCaptureView();
    };
    // Attempt to create the native view exactly once. Returns true once creation
    // has been kicked off, false if the native tag is not available yet (so a
    // caller can retry). Callable from both `onLayout` and the rAF loop; the
    // `_viewCreated` flag is flipped synchronously to keep it single-shot.
    tryCreateDataCaptureView() {
        if (this._viewCreated || !this._isMounted) {
            return true;
        }
        const viewId = findNodeHandle(this);
        if (viewId === null) {
            return false;
        }
        this._viewCreated = true;
        // Whichever trigger wins tears down a pending rAF retry so the loop does
        // not fire a redundant (no-op) frame afterwards.
        if (this._createViewRafHandle !== null) {
            cancelAnimationFrame(this._createViewRafHandle);
            this._createViewRafHandle = null;
        }
        void this.view.createNativeView(viewId);
        return true;
    }
    // rAF fallback loop (see componentDidMount): retry until the native tag is
    // available, then create. Stops as soon as creation succeeds by either trigger.
    scheduleCreateDataCaptureView = () => {
        if (this._viewCreated || !this._isMounted) {
            return;
        }
        if (this.tryCreateDataCaptureView()) {
            return;
        }
        this._createViewRafHandle = requestAnimationFrame(this.scheduleCreateDataCaptureView);
    };
}
const RNTDataCaptureView = requireNativeComponent('RNTDataCaptureView');

/**
 * Returns whether the app is currently in the foreground.
 * Useful for composing the `isActive` prop on scanning views:
 *
 * ```tsx
 * const isForeground = useIsForeground();
 * const isFocused = useIsFocused(); // from @react-navigation/native
 * <BarcodeCaptureView isActive={isFocused && isForeground} ... />
 * ```
 */
function useIsForeground() {
    const [isForeground, setIsForeground] = useState(() => AppState.currentState === 'active');
    useEffect(() => {
        const onChange = (state) => {
            setIsForeground(state === 'active');
        };
        const subscription = AppState.addEventListener('change', onChange);
        return () => subscription.remove();
    }, []);
    return isForeground;
}

function mapAndroidResult(result) {
    switch (result) {
        case PermissionsAndroid.RESULTS.GRANTED:
            return 'granted';
        case PermissionsAndroid.RESULTS.DENIED:
            return 'denied';
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
            return 'restricted';
        default:
            return 'not-determined';
    }
}
async function checkAndroidPermission() {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    return granted ? 'granted' : 'not-determined';
}
async function requestAndroidPermission() {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return mapAndroidResult(result);
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
 * flow as the authoritative signal (surfaced via `<BarcodeCaptureView onError={...} />`).
 *
 * ```tsx
 * const { hasPermission, requestPermission } = useCameraPermission();
 * if (!hasPermission) return <Button onPress={requestPermission} title="Grant Camera Access" />;
 * ```
 */
function useCameraPermission() {
    const [status, setStatus] = useState(Platform.OS === 'android' ? 'not-determined' : 'not-determined');
    const refresh = useCallback(async () => {
        if (Platform.OS !== 'android')
            return;
        setStatus(await checkAndroidPermission());
    }, []);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    // Re-check when returning from Settings (Android only — iOS can't be introspected).
    useEffect(() => {
        if (Platform.OS !== 'android')
            return;
        const onChange = (state) => {
            if (state === 'active') {
                void refresh();
            }
        };
        const subscription = AppState.addEventListener('change', onChange);
        return () => subscription.remove();
    }, [refresh]);
    const requestPermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            const result = await requestAndroidPermission();
            setStatus(result);
            return result === 'granted';
        }
        // iOS: we can't drive the prompt from JS. Flip optimistically to 'granted';
        // the native camera access triggers the iOS dialog automatically, and denial
        // surfaces as a camera-start failure (hook into `BarcodeCaptureView.onError`).
        setStatus('granted');
        return true;
    }, []);
    return {
        hasPermission: status === 'granted',
        permissionStatus: status,
        requestPermission,
    };
}

/**
 * Initializes (or retrieves) the DataCaptureContext singleton.
 *
 * ```tsx
 * const settings = useMemo(() => new DataCaptureContextSettings(), []);
 * const context = useScanditContext('YOUR_LICENSE_KEY', { settings });
 * ```
 */
function useScanditContext(licenseKey, options) {
    const context = useMemo(() => DataCaptureContext.initialize(licenseKey, options?.creationOptions ?? null, options?.settings ?? null), 
    // The context is a singleton; init runs once per license key. `settings`
    // and `creationOptions` are intentionally excluded — settings are pushed
    // by the effect below, creationOptions are init-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [licenseKey]);
    // Re-apply settings whenever the consumer hands us a new instance. The
    // first call here is redundant with the init above (same instance) — it's
    // a no-op in native. Subsequent changes propagate to the running context.
    useEffect(() => {
        if (options?.settings)
            void context.applySettings(options.settings);
    }, [context, options?.settings]);
    return context;
}

const DEFAULT_TORCH = TorchState.Off;
const DEFAULT_POSITION = CameraPosition.WorldFacing;
const DEFAULT_FRAME_SOURCE_STATE = FrameSourceState.On;
function createCameraOwner(context) {
    let camera = null;
    let position = null;
    let desiredTorch = DEFAULT_TORCH;
    let desiredState = DEFAULT_FRAME_SOURCE_STATE;
    let queue = Promise.resolve();
    const enqueue = (op) => {
        queue = queue.then(op).catch(err => console.warn('ScanditProvider: camera operation failed', err));
        return queue;
    };
    // `Camera.atPosition` is a process-wide singleton, so any other
    // DataCaptureContext can grab it via `setFrameSource(...)` while we're idle.
    // Rebind only when the camera isn't ours anymore — otherwise a no-op.
    const isOurs = (cam) => cam.context === context;
    // Bind `camera` to our context and push our cached desired state.
    // Used after a fresh `Camera.atPosition(...)` and to reclaim a stolen camera.
    const bind = async () => {
        if (camera === null)
            return;
        camera.desiredTorchState = desiredTorch;
        await context.setFrameSource(camera);
        await camera.switchToDesiredState(desiredState);
    };
    const reclaimIfNeeded = async () => {
        if (camera !== null && !isOurs(camera))
            await bind();
    };
    return {
        setPosition(next) {
            void enqueue(async () => {
                if (camera !== null && position === next) {
                    await reclaimIfNeeded();
                    return;
                }
                if (camera !== null)
                    await camera.switchToDesiredState(FrameSourceState.Off);
                camera = Camera.atPosition(next);
                position = next;
                await bind();
            });
        },
        setTorch(next) {
            void enqueue(async () => {
                desiredTorch = next;
                await reclaimIfNeeded();
                if (camera !== null)
                    camera.desiredTorchState = next;
            });
        },
        setFrameSourceState(next) {
            void enqueue(async () => {
                desiredState = next;
                await reclaimIfNeeded();
                if (camera !== null)
                    await camera.switchToDesiredState(next);
            });
        },
        reclaimIfNeeded() {
            void enqueue(reclaimIfNeeded);
        },
        dispose() {
            return enqueue(async () => {
                const cam = camera;
                camera = null;
                // Skip `setFrameSource(null)` if we don't own the camera — it would
                // yank it away from whichever context holds it now.
                if (cam !== null && isOurs(cam)) {
                    await cam.switchToDesiredState(FrameSourceState.Off);
                    await context.setFrameSource(null);
                }
                await context.dispose();
            });
        },
    };
}
const ScanditInternalContext = createContext(null);
/** Reflects a provider's camera-related props onto the singleton camera. */
function useApplyCameraProps(owner, props) {
    const { frameSourceState, torchState, cameraPosition } = props;
    useEffect(() => {
        if (cameraPosition !== undefined)
            owner.setPosition(cameraPosition);
    }, [owner, cameraPosition]);
    useEffect(() => {
        if (torchState !== undefined)
            owner.setTorch(torchState);
    }, [owner, torchState]);
    useEffect(() => {
        if (frameSourceState !== undefined)
            owner.setFrameSourceState(frameSourceState);
    }, [owner, frameSourceState]);
}
/**
 * Provides a `DataCaptureContext` and a singleton `Camera` to descendant AIO views.
 *
 * - **Root** (no parent `<ScanditProvider>` above): creates the context + camera,
 *   disposes them on unmount.
 * - **Nested**: applies its own `frameSourceState` / `torchState` / `cameraPosition`
 *   props to the same singleton camera. Last writer wins; values are not reverted
 *   when a nested provider unmounts.
 *
 * The camera is recreated only when `cameraPosition` flips; torch and
 * `frameSourceState` are applied directly to the live camera.
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
 *   <BarcodeCaptureView state="enabled" ... />
 * </ScanditProvider>
 * ```
 */
function ScanditProvider(props) {
    const parent = useContext(ScanditInternalContext);
    if (parent !== null) {
        return React.createElement(NestedScanditProvider, { ...props, parent: parent });
    }
    if (!props.licenseKey) {
        throw new Error('<ScanditProvider> requires a `licenseKey` prop when used as the root provider.');
    }
    return React.createElement(RootScanditProvider, { ...props, licenseKey: props.licenseKey });
}
function NestedScanditProvider({ parent, frameSourceState, torchState, cameraPosition, licenseKey, settings, options, children, }) {
    if (licenseKey || settings || options) {
        console.warn('ScanditProvider: licenseKey/settings/options are ignored on nested providers.');
    }
    useApplyCameraProps(parent.owner, { frameSourceState, torchState, cameraPosition });
    return React.createElement(ScanditInternalContext.Provider, { value: parent }, children);
}
function RootScanditProvider({ licenseKey, options, settings, frameSourceState, torchState, cameraPosition, children, }) {
    const context = useMemo(() => DataCaptureContext.initialize(licenseKey, options ?? null, settings ?? null), 
    // The context is a singleton keyed on licenseKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [licenseKey]);
    const owner = useMemo(() => createCameraOwner(context), [context]);
    // Apply our own props to the singleton, falling back to defaults so the
    // camera is always created and in a known state.
    useApplyCameraProps(owner, {
        frameSourceState: frameSourceState ?? DEFAULT_FRAME_SOURCE_STATE,
        torchState: torchState ?? DEFAULT_TORCH,
        cameraPosition: cameraPosition ?? DEFAULT_POSITION,
    });
    // Dispose context + camera on unmount. Chained onto the owner's queue so
    // any in-flight mutation finishes first.
    useEffect(() => {
        return () => {
            void owner.dispose();
        };
    }, [owner]);
    const internal = useMemo(() => ({ context, owner }), [context, owner]);
    return React.createElement(ScanditInternalContext.Provider, { value: internal }, children);
}
// ─── Internal hook consumed by AIO view packages ─────────────────────────────
/** Internal — used by AIO views to attach modes to the shared context. */
function useDataCaptureContextInternal() {
    const internal = useContext(ScanditInternalContext);
    if (!internal) {
        throw new Error('This component must be rendered inside a <ScanditProvider>.');
    }
    // Reclaim the singleton camera on (re)mount: anything else in the app that
    // touched `Camera.atPosition` while we were unmounted may have stolen it.
    useEffect(() => internal.owner.reclaimIfNeeded(), [internal]);
    return internal.context;
}

function isSerializable(v) {
    return typeof v === 'object' && v !== null && typeof v.toJson === 'function';
}
function signature(v) {
    try {
        return JSON.stringify(isSerializable(v) ? v.toJson() : v) ?? '';
    }
    catch {
        // Cyclic / un-serializable values fall through to `''` so the caller sees
        // a "changed" signature and uses the new value. Better safe than wrong.
        return '';
    }
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
function useStableProp(value) {
    const ref = useRef(null);
    const sig = signature(value);
    if (ref.current && ref.current.sig === sig)
        return ref.current.value;
    ref.current = { value, sig };
    return value;
}

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
function useModeListener({ mode, listenerFns, addListener, removeListener, }) {
    const definedKeysSig = currentDefinedKeysSig(listenerFns);
    const isActive = mode != null && definedKeysSig !== '';
    const listenerRef = useRef(listenerFns);
    listenerRef.current = listenerFns;
    const addRef = useRef(addListener);
    addRef.current = addListener;
    const removeRef = useRef(removeListener);
    removeRef.current = removeListener;
    // Rebuild the proxy whenever the set of defined keys changes. Within the
    // same set, callback-identity changes are absorbed via `listenerRef`.
    const stableListenerRef = useRef(null);
    const stableListenerSigRef = useRef('');
    if (definedKeysSig !== stableListenerSigRef.current) {
        stableListenerSigRef.current = definedKeysSig;
        if (definedKeysSig === '') {
            stableListenerRef.current = null;
        }
        else {
            const proxy = {};
            for (const key of definedKeysSig.split(',')) {
                proxy[key] = (...args) => listenerRef.current[key]?.(...args);
            }
            stableListenerRef.current = proxy;
        }
    }
    useEffect(() => {
        if (!isActive)
            return;
        const proxy = stableListenerRef.current;
        if (!proxy)
            return;
        addRef.current(mode, proxy);
        return () => removeRef.current(mode, proxy);
        // The proxy identity changes only when `definedKeysSig` changes, which is
        // already in the deps.
    }, [mode, isActive, definedKeysSig]);
}
function currentDefinedKeysSig(listenerFns) {
    const keys = [];
    for (const k of Object.keys(listenerFns)) {
        if (listenerFns[k] != null)
            keys.push(k);
    }
    keys.sort();
    return keys.join(',');
}

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
function useViewHandle() {
    const mutableRef = useRef(null);
    const [current, setCurrent] = useState(null);
    // Random over the signed-int32 range: `id` feeds native `parentId` (an int),
    // and the wide range keeps collisions negligible across concurrent views.
    const id = useRef(Math.floor(Math.random() * 0x7fffffff)).current;
    // Readiness promise resolved on the first `onLayout`. Created lazily once per
    // hook instance so `whenReady()` returns a stable promise across renders.
    const readyRef = useRef(undefined);
    const resolveReadyRef = useRef(undefined);
    const resolvedRef = useRef(false);
    const rafRef = useRef(null);
    if (!readyRef.current) {
        readyRef.current = new Promise(resolve => {
            resolveReadyRef.current = resolve;
        });
    }
    const resolveReady = useCallback(() => {
        if (resolvedRef.current) {
            return;
        }
        resolvedRef.current = true;
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        resolveReadyRef.current?.();
    }, []);
    const onLayout = useCallback(() => resolveReady(), [resolveReady]);
    const ref = useCallback((v) => {
        mutableRef.current = v;
        setCurrent(v);
        if (v === null) {
            // Unmount: cancel a still-pending fallback frame so it can't fire after
            // the view is gone (mirrors the class components' componentWillUnmount).
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            return;
        }
        // Fallback for setups where `onLayout` is not reliably emitted on the
        // Fabric view (RN 0.78 New Architecture, Android release builds): once the
        // view is mounted, resolve readiness on the next frame. requestAnimationFrame is
        // frame-aligned (the view is committed to the native tree by then, so the
        // node handle is valid) and, unlike InteractionManager, not starvable.
        if (!resolvedRef.current && rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                resolveReady();
            });
        }
    }, [resolveReady]);
    const whenReady = useCallback(() => readyRef.current, []);
    return { ref, current, mutableRef, id, onLayout, whenReady };
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
function useNativeControl(view, control) {
    useEffect(() => {
        if (!view || !control)
            return;
        void view.addControl(control);
        return () => void view.removeControl(control);
    }, [view, control]);
}

/**
 * Mode-lifetime state machine shared by SDK view components.
 *
 * Owns: lazy mode creation, attach/detach transitions driven by `state`,
 * `isEnabled` flips on `enabled`↔`disabled`, settings reapply on dep change,
 * and detach-on-unmount.
 *
 * Side-effecting callbacks (`attach`, `detach`, `applySettings`, `setEnabled`,
 * `createMode`) are read through a ref, so callers can pass closures without
 * memoizing — only `state`, `canAttach`, and `settingsDeps` drive effects.
 */
function useMode(options) {
    const { state, canAttach = true, settingsDeps } = options;
    const optsRef = useRef(options);
    optsRef.current = options;
    const modeRef = useRef(null);
    const attachedRef = useRef(false);
    const prevStateRef = useRef('detached');
    const getMode = useCallback(() => {
        if (modeRef.current)
            return modeRef.current;
        console.debug('[useMode] create mode');
        modeRef.current = optsRef.current.createMode();
        return modeRef.current;
    }, []);
    const isAttached = useCallback(() => attachedRef.current, []);
    // State machine: attach/detach + enabled flip.
    useEffect(() => {
        const prev = prevStateRef.current;
        if (state === 'detached') {
            prevStateRef.current = state;
            if (!attachedRef.current) {
                console.debug(`[useMode] state ${prev} -> detached (no-op, not attached)`);
                return;
            }
            const mode = modeRef.current;
            attachedRef.current = false;
            console.debug(`[useMode] state ${prev} -> detached: detaching`);
            if (mode) {
                void detachAttachablesThen(optsRef.current.attachables, () => optsRef.current.detach(mode)).then(() => {
                    console.debug('[useMode] detach complete');
                    if (modeRef.current === mode)
                        modeRef.current = null;
                });
            }
            return;
        }
        const enabled = state === 'enabled';
        if (attachedRef.current) {
            prevStateRef.current = state;
            console.debug(`[useMode] state ${prev} -> ${state}: flip isEnabled=${enabled}`);
            if (modeRef.current)
                optsRef.current.setEnabled(modeRef.current, enabled);
            return;
        }
        if (!canAttach) {
            console.debug(`[useMode] state ${prev} -> ${state}: parked (canAttach=false)`);
            return;
        }
        prevStateRef.current = state;
        const mode = getMode();
        let cancelled = false;
        console.debug(`[useMode] state ${prev} -> ${state}: attaching`);
        void attachThenAttachables(() => optsRef.current.attach(mode), optsRef.current.attachables).then(() => {
            if (cancelled) {
                console.debug('[useMode] attach resolved but cancelled');
                return;
            }
            attachedRef.current = true;
            console.debug(`[useMode] attach complete, isEnabled=${enabled}`);
            if (modeRef.current)
                optsRef.current.setEnabled(modeRef.current, enabled);
        });
        return () => {
            cancelled = true;
        };
    }, [state, canAttach, getMode]);
    // Settings reapply. Only meaningful when a mode exists.
    useEffect(() => {
        if (state === 'detached')
            return;
        if (!modeRef.current)
            return;
        console.debug('[useMode] reapply settings');
        void Promise.resolve(optsRef.current.applySettings(modeRef.current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, ...settingsDeps]);
    // Detach on unmount.
    useEffect(() => {
        return () => {
            if (!attachedRef.current) {
                console.debug('[useMode] unmount (not attached)');
                modeRef.current = null;
                return;
            }
            const mode = modeRef.current;
            attachedRef.current = false;
            console.debug('[useMode] unmount: detaching');
            if (mode)
                void detachAttachablesThen(optsRef.current.attachables, () => optsRef.current.detach(mode));
            modeRef.current = null;
        };
    }, []);
    return { getMode, modeRef, isAttached };
}
async function attachThenAttachables(attachMode, attachables) {
    await attachMode();
    if (!attachables)
        return;
    for (const a of attachables)
        await a.attach();
}
async function detachAttachablesThen(attachables, detachMode) {
    if (attachables) {
        for (let i = attachables.length - 1; i >= 0; i--)
            await attachables[i].detach();
    }
    await detachMode();
}

/**
 * Wait until the underlying `BaseDataCaptureView` has finished
 * `createNativeView` (which sets `viewId` to a non-negative value). Calling
 * `addOverlay` before this is a silent no-op — the controller's `updateView`
 * bails out when `!isViewCreated()`, so the overlay JSON never reaches native.
 *
 * The native-view creation is itself driven by `DataCaptureView`'s `onLayout`
 * (see SDC-32208), so we just poll `viewId` until it flips to a non-negative
 * value. This avoids the previous dependency on
 * `InteractionManager.runAfterInteractions`, whose queue can be starved
 * indefinitely by a looping JS animation, leaving the overlay never attached.
 */
async function waitForDataCaptureViewReady(view) {
    const baseView = view.view;
    for (let i = 0; baseView && baseView.viewId === -1 && i < 100; i++) {
        await new Promise(r => setTimeout(r, 10));
    }
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
function useOverlay(opts) {
    const { view, enabled = true, factoryDeps = [], updateDeps = [] } = opts;
    const optsRef = useRef(opts);
    optsRef.current = opts;
    const overlayRef = useRef(null);
    const [overlay, setOverlay] = useState(null);
    // Tracks whether `useMode` currently considers us "mode-attached" — set by
    // the `attach`/`detach` callbacks it invokes via `attachables`. Used by the
    // `enabled`-flip effect to gate self-driven attach/detach.
    const modeAttachedRef = useRef(false);
    const doAttach = useCallback(async () => {
        if (overlayRef.current)
            return;
        const v = view.current;
        if (!v)
            return;
        // The native view is created asynchronously when `DataCaptureView` lays out
        // (see SDC-32208). Calling `addOverlay` before it's ready is a silent no-op
        // (the view controller's `updateView` bails out on `!isViewCreated()`), so
        // wait for the view to report a valid `viewId` first.
        await waitForDataCaptureViewReady(v);
        const created = optsRef.current.factory();
        optsRef.current.update?.(created);
        overlayRef.current = created;
        await v.addOverlay(created);
        setOverlay(created);
    }, [view]);
    const doDetach = useCallback(async () => {
        const o = overlayRef.current;
        overlayRef.current = null;
        setOverlay(null);
        if (!o)
            return;
        const v = view.current;
        if (v)
            await v.removeOverlay(o);
    }, [view]);
    const attach = useCallback(async () => {
        modeAttachedRef.current = true;
        if (optsRef.current.enabled === false)
            return;
        await doAttach();
    }, [doAttach]);
    const detach = useCallback(async () => {
        modeAttachedRef.current = false;
        await doDetach();
    }, [doDetach]);
    const getOverlay = useCallback(() => overlayRef.current, []);
    // Enabled toggle handling while the mode is attached.
    useEffect(() => {
        if (!modeAttachedRef.current)
            return;
        if (enabled && !overlayRef.current) {
            void doAttach();
        }
        else if (!enabled && overlayRef.current) {
            void doDetach();
        }
    }, [enabled, doAttach, doDetach]);
    // Recreate on factoryDeps change while attached. Skips the initial render
    // (first attach is driven by useMode's attachables, not this effect).
    const isFirstFactoryEffect = useRef(true);
    useEffect(() => {
        if (isFirstFactoryEffect.current) {
            isFirstFactoryEffect.current = false;
            return;
        }
        if (!overlayRef.current)
            return;
        void (async () => {
            await doDetach();
            await doAttach();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, factoryDeps);
    // Re-run `update` on updateDeps change while attached.
    useEffect(() => {
        if (!overlay)
            return;
        optsRef.current.update?.(overlay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlay, ...updateDeps]);
    return { overlay, getOverlay, attach, detach };
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    useDataCaptureContextInternal: useDataCaptureContextInternal,
    useMode: useMode,
    useModeListener: useModeListener,
    useNativeControl: useNativeControl,
    useOverlay: useOverlay,
    useStableProp: useStableProp,
    useViewHandle: useViewHandle
});

initCoreDefaults();
initCoreProxy();

export { Camera, CameraPosition, DataCaptureContext, DataCaptureVersion, DataCaptureView, FrameSourceState, RNNativeCaller, ScanditProvider, TorchState, index as _internal, createRNNativeCaller, getModuleDefaults, getNativeModule, initCoreDefaults, initCoreProxy, useCameraPermission, useIsForeground, useScanditContext };
//# sourceMappingURL=index.js.map
