import { CORE_PROXY_TYPE_NAMES, registerCoreProxies, FactoryMaker, loadCoreDefaults, setCoreDefaultsLoader, buildStaticCoreDefaultsJson, getCoreDefaults, BaseDataCaptureView, DataCaptureContext, TorchState, CameraPosition, Camera, FrameSourceState } from './core.js';
export { AimerViewfinder, Anchor, Brush, CameraSettings, CameraSwitchControl, ClusteringMode, Color, ColorFillOverlay, ContextStatus, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameDataSettings, FrameDataSettingsBuilder, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogCategory, LogLevel, LogoStyle, MacroMode, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, ScanditLogger, SelectionMode, SequenceFrameSource, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchSwitchControl, Vibration, VibrationType, VideoResolution, WaveFormVibration, ZoomSwitchControl, ZoomSwitchOrientation } from './core.js';
import { NativeEventEmitter, Platform, NativeModules, TurboModuleRegistry, findNodeHandle, requireNativeComponent, AppState, PermissionsAndroid } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo, useRef, createContext, useContext, useLayoutEffect } from 'react';

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
/**
 * Returns the dynamic residual exposed by native as `DynamicDefaults` (device id, SDK version,
 * probed camera positions, localized accessibility labels, ...). Every supported version of the
 * native side exposes it, so there is no legacy full-`Defaults`-blob fallback anymore
 * (SDC-32175/SDC-32178).
 */
function getModuleDynamicDefaults(name) {
    const mod = getNativeModule(name);
    const dynamicDefaults = mod.DynamicDefaults;
    if (dynamicDefaults) {
        return dynamicDefaults;
    }
    if (typeof mod.getConstants === 'function') {
        const constants = mod.getConstants();
        if (constants?.DynamicDefaults) {
            return constants.DynamicDefaults;
        }
    }
    throw new Error(`Could not load DynamicDefaults from module ${name}`);
}

// RN has no plugin-init gate: user code constructs Camera.default (etc.) immediately at import
// time, so the dynamic residual (device id, SDK version, probed camera positions, localized
// accessibility label) must be read synchronously here, not via an async round-trip.
function initCoreDefaults() {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    // Merge raw JSON into raw JSON, then let loadCoreDefaults produce the typed object — never
    // merge into the already-parsed one. Merging into parsed values happens to work while the
    // residual is strings/arrays, but the first dynamic key that parsing converts (a Color, Brush
    // or PointWithUnit) would land as raw JSON inside a typed object and fail silently at the
    // consumer, far from here.
    const merged = buildStaticCoreDefaultsJson(platform);
    deepMerge(merged, getModuleDynamicDefaults('ScanditDataCaptureCore'));
    // bindInstanceIfNotExists would no-op on a second load, so drop the binding first.
    FactoryMaker.instances.delete('CoreDefaults');
    loadCoreDefaults(merged);
}
// Keys whose assignment would mutate the prototype chain instead of setting a data property.
// The payload comes from our own native code, but JSON.parse can produce an own "__proto__" key
// and Object.keys lists it, so the bracket assignment below is guarded.
const UNSAFE_MERGE_KEYS = ['__proto__', 'constructor', 'prototype'];
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (UNSAFE_MERGE_KEYS.includes(key)) {
            continue;
        }
        const sourceValue = source[key];
        const targetValue = target[key];
        // Both sides must be plain objects to recurse: an array on either side is replaced wholesale,
        // never merged key-by-key (which would leave numeric-index pollution behind).
        if (sourceValue &&
            targetValue &&
            typeof sourceValue === 'object' &&
            typeof targetValue === 'object' &&
            !Array.isArray(sourceValue) &&
            !Array.isArray(targetValue)) {
            // Copy-on-write: buildStatic*DefaultsJson hands out REFERENCES to module-level generated
            // constants, so recursing straight into targetValue would write the dynamic value into the
            // generated constant and corrupt it process-wide for every later caller. Descend into a
            // shallow copy instead.
            const branch = { ...targetValue };
            target[key] = branch;
            deepMerge(branch, sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    }
}
setCoreDefaultsLoader(initCoreDefaults);

class DataCaptureVersion {
    static get pluginVersion() {
        return '8.7.1';
    }
    /**
     * Version of the native SDK the plugin is running against.
     *
     * Read from the Core defaults singleton, which `initCoreDefaults()` populates from the native
     * `DynamicDefaults` payload at import time. This used to read a flat `NativeModule.Version`
     * constant, which native stopped exposing when the residual moved under `DynamicDefaults`
     * (SDC-32175 / SDC-32178) — so it had been returning undefined.
     */
    static get sdkVersion() {
        return getCoreDefaults().Version ?? '';
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
        const teardown = Promise.resolve(this.view.dispose());
        this.props.onNativeDispose?.(teardown);
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
    // SDC-33139: kick off creation BEFORE forwarding onLayout, since a caller
    // may call a view method (e.g. show()) from its own onLayout. Base-view
    // methods already gate on creation completing, so only the kickoff order
    // matters here.
    onNativeViewLayout = (event) => {
        this.tryCreateDataCaptureView();
        // Forward to a caller-supplied onLayout so our internal handler doesn't
        // swallow it (render() overrides the spread `onLayout` with this one).
        this.props.onLayout?.(event);
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
 * <BarcodeCaptureAioView isActive={isFocused && isForeground} ... />
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
 * flow as the authoritative signal (surfaced via `<BarcodeCaptureAioView onError={...} />`).
 *
 * ```tsx
 * const { hasPermission, requestPermission } = useCameraPermission();
 * if (!hasPermission) return <Button onPress={requestPermission} title="Grant Camera Access" />;
 * ```
 */
function useCameraPermission() {
    const [status, setStatus] = useState('not-determined');
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
        // surfaces as a camera-start failure (hook into `BarcodeCaptureAioView.onError`).
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
function describeError(err) {
    if (err instanceof Error) {
        // The stack normally already opens with `Error: <message>`, so prefixing the
        // message again would just duplicate it.
        const head = err.stack?.includes(err.message) ? err.stack : `${err.message}\n${err.stack ?? ''}`;
        // Anything the thrower hung off the Error stays. React Native's native
        // rejections arrive as real `Error`s carrying enumerable `code` and
        // `nativeStackIOS`, and that native stack is often the only thing that
        // identifies the failing native call — dropping it to keep the message
        // would just move the erasure rather than end it. (It did, briefly: the
        // first cut of this function returned message + stack only, and threw away
        // the `AbstractCamera::resetContext` frames that diagnosed SDC-33115's F14.)
        const extras = ownEnumerableProps(err);
        return extras === undefined ? head : `${head}\n${extras}`;
    }
    // React Native rejects native promises with a plain object carrying `code` /
    // `message` rather than a real Error, so pull those out before falling back
    // to `String(err)` (which would render `[object Object]`).
    if (err !== null && typeof err === 'object') {
        const bag = err;
        const message = typeof bag.message === 'string' ? bag.message : undefined;
        // Only stringify a primitive `code`. Coercing an object here would print
        // `[object Object]` — the same uselessness this function exists to prevent.
        const code = typeof bag.code === 'string' || typeof bag.code === 'number' || typeof bag.code === 'boolean'
            ? String(bag.code)
            : undefined;
        if (message !== undefined || code !== undefined) {
            const parts = [message, code === undefined ? undefined : `(code ${code})`].filter(Boolean);
            return `${parts.join(' ')}\n${safeJson(err)}`;
        }
        return safeJson(err);
    }
    return String(err);
}
/**
 * Serialize an Error's own enumerable properties — the payload a thrower
 * attached, which `message`/`stack` alone do not cover. Returns `undefined` when
 * there is nothing extra, so the caller can skip a trailing empty line.
 */
function ownEnumerableProps(err) {
    const extras = {};
    for (const key of Object.keys(err)) {
        if (key === 'message' || key === 'stack')
            continue;
        extras[key] = err[key];
    }
    return Object.keys(extras).length === 0 ? undefined : safeJson(extras);
}
function safeJson(value) {
    try {
        return JSON.stringify(value) ?? String(value);
    }
    catch {
        return String(value);
    }
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

const DEFAULT_TORCH = TorchState.Off;
const DEFAULT_POSITION = CameraPosition.WorldFacing;
function createCameraOwner(context, cameraFactory = position => Camera.atPosition(position), onError) {
    let camera = null;
    // The position the live `camera` was created for; recreate only when it flips.
    let createdPosition = null;
    let position = DEFAULT_POSITION;
    let desiredTorch = DEFAULT_TORCH;
    let desiredSettings = null;
    // What the provider last applied to its OWN camera (native state latch).
    // Transitions must be idempotent: while an exclusive owner drives camera 0,
    // a redundant Off+setFrameSource(null) on the *released* provider camera
    // races the exclusive view's On and can win, leaving a black preview
    // (SDC-32484 iOS). Only transition on actual native state changes.
    let applied = 'off';
    // True only after a FULLY successful acquire (both native calls confirmed).
    // Lets the apply pass skip re-issuing setFrameSource/switchOn when nothing
    // changed - every claim burst re-applies, and redundant re-acquires showed
    // up on device as 2-3 pointless native calls per navigation.
    let acquireSucceeded = false;
    let disposed = false;
    // The single owner slot. Last claim wins; superseded owners' operations
    // no-op because every queued op re-checks this slot when it runs.
    let owner = null;
    let chain = Promise.resolve();
    const enqueue = (op) => {
        chain = chain.then(op).catch(err => {
            console.warn(`ScanditProvider: camera operation failed: ${describeError(err)}`);
            onError?.(err);
        });
        return chain;
    };
    /** Turn the provider camera on for a shared owner. Retries once: switching
     * on can fail transiently when it races an exclusive owner's async native
     * teardown (iOS nulls/steals the context frame source after our resume —
     * SDC-32484). The chain is serialized, so the retry only buys the native
     * side time to settle. */
    const acquireSharedCamera = async (retriesLeft = 1) => {
        if (acquireSucceeded && applied === 'on' && camera !== null && createdPosition === position) {
            // Already on for this camera/position - just keep the torch in sync.
            camera.desiredTorchState = desiredTorch;
            return;
        }
        // Probe before releasing. The factory opens no native session, so asking
        // first costs nothing and a position the device lacks leaves the running
        // camera untouched instead of stranding the caller with a dead preview.
        let nextCamera = camera;
        if (camera === null || createdPosition !== position) {
            nextCamera = cameraFactory(position);
            if (nextCamera === null) {
                console.warn('ScanditProvider: no camera available at position', position);
                // Never latch a position the device does not have: every later acquire
                // would take this same early return, so a standby-resume would find no
                // camera to reopen and the preview would stay dead (SDC-33131).
                if (createdPosition !== null)
                    position = createdPosition;
                return;
            }
        }
        // Non-null by construction: a null `camera` forces the branch above, which
        // either returns or assigns.
        const target = nextCamera;
        try {
            if (target !== camera) {
                // Android refuses to configure the new camera while the old one still
                // holds its capture session ("Unsupported set of inputs/outputs
                // provided" — SDC-33131), and that constraint applies to setFrameSource
                // and switchToDesiredState, both of which are still ahead of us here.
                // Inside the try so a rejected teardown costs one retry rather than
                // aborting with the frame source already detached.
                await releaseSharedCamera();
                camera = target;
                createdPosition = position;
            }
            target.desiredTorchState = desiredTorch;
            // Mark before the awaits: a partial failure leaves applied='on' so a
            // later release fully unwinds the half-attached camera.
            applied = 'on';
            acquireSucceeded = false;
            if (desiredSettings !== null)
                await target.applySettings(desiredSettings);
            await context.setFrameSource(target);
            await target.switchToDesiredState(FrameSourceState.On);
            acquireSucceeded = true;
            console.debug(`[cameraOwner] camera -> On (position=${position})`);
        }
        catch (err) {
            // Report every failure. A superseded switch-on looks like a candidate for
            // silencing — it recovers, and under rapid swapping it is common — but the
            // native call really did fail, and a layer that decides on the caller's
            // behalf which failures are worth mentioning is how a system ends up
            // looking healthier than it is. SDC-33115 F14 is a real native race
            // (`AbstractCamera::resetContext` cancelling an in-flight ~700ms switch);
            // it is characterised and ticketed, not hidden here.
            if (retriesLeft > 0) {
                console.warn(`ScanditProvider: switching the camera on failed, retrying once: ${describeError(err)}`);
                await acquireSharedCamera(retriesLeft - 1);
                return;
            }
            throw err;
        }
    };
    /** Between-screens release: put the camera in native Standby. Capture input
     * is disabled immediately (sensor released, no frames) and the NATIVE staged
     * standby completes the full shutdown after ~30s if no screen resumes -
     * we never run a JS timer. Resuming from standby is near-instant, so
     * navigation hand-offs don't blink. The frame source stays attached; only a
     * hard release (exclusive hand-over / dispose) detaches it. */
    const standbySharedCamera = async () => {
        if (camera === null || applied !== 'on')
            return;
        applied = 'standby';
        acquireSucceeded = false;
        await camera.switchToDesiredState(FrameSourceState.Standby);
        console.debug('[cameraOwner] camera -> Standby (no owner)');
    };
    /** Hard release: full Off + frame source detached. Required when the device
     * must be free immediately - an exclusive (own-camera) owner taking camera 0,
     * or provider dispose. Standby is not enough there: it keeps the capture
     * session (and the context's frame source) alive. */
    const releaseSharedCamera = async () => {
        if (camera === null || applied === 'off')
            return;
        const before = applied;
        applied = 'off';
        acquireSucceeded = false;
        try {
            await camera.switchToDesiredState(FrameSourceState.Off);
            await context.setFrameSource(null);
        }
        catch (err) {
            // Put the latch back, or the retry's release returns on its first line
            // and the next camera is attached while this one still holds its session
            // — the Android failure the release exists to prevent (SDC-33131).
            applied = before;
            throw err;
        }
        console.debug('[cameraOwner] camera -> Off, frame source detached');
    };
    const releaseManagedCamera = releaseSharedCamera;
    /** Apply the state the CURRENT owner implies. Called at op-run time so a
     * superseded claim's op naturally applies the latest truth. */
    const applyOwnerState = async () => {
        if (disposed)
            return;
        // Do NOT add an `if (applyScheduled) return` short-circuit here. It looks
        // like a free extension of the coalescing `scheduleApply` already does, and
        // it measures WORSE on device: over an identical 10x shared<->exclusive
        // deep-link loop on an iPhone SE it took bridge errors from 0.67 to 1.0 per
        // crossing and halved how often the camera reached `On` (SDC-33115 F14,
        // A/B recorded in the ticket log). Deferring the transition appears to move
        // it into a worse window rather than avoiding the collision. Measure before
        // reintroducing it.
        if (owner === null) {
            await standbySharedCamera();
        }
        else if (owner.mode === 'shared') {
            await acquireSharedCamera();
        }
        else {
            await releaseManagedCamera();
        }
    };
    /** Timeout-raced await of a dying view's native teardown: it must settle
     * before ANY later camera op, or the dispose can stop camera 0 underneath
     * the next owner's freshly-started camera (SDC-32484). Safety valve: a hung
     * dispose must not wedge the chain forever. */
    const awaitTeardown = async (teardown) => {
        let timer;
        const timeout = new Promise(resolve => (timer = setTimeout(resolve, 10000)));
        const settled = teardown.then(() => undefined, () => undefined);
        void settled.then(() => clearTimeout(timer));
        await Promise.race([settled, timeout]);
    };
    const pendingSteps = [];
    let applyScheduled = false;
    const scheduleApply = () => {
        if (applyScheduled)
            return;
        applyScheduled = true;
        void enqueue(async () => {
            // Reset FIRST: a step pushed while this op is mid-drain is picked up by
            // the loop below AND may schedule a follow-up apply-op — which then
            // finds an empty list and runs one harmless no-op apply. The
            // alternative (reset after the drain) can drop a step entirely.
            applyScheduled = false;
            while (pendingSteps.length > 0) {
                const step = pendingSteps.shift();
                if (step)
                    await step();
            }
            await applyOwnerState();
        });
    };
    const mutate = (step) => {
        if (disposed)
            return;
        pendingSteps.push(step);
        scheduleApply();
    };
    const addClaim = (claim) => {
        mutate(() => {
            console.debug(`[cameraOwner] claim add: mode=${claim.mode} active=${claim.active}`);
            if (claim.active)
                owner = claim;
        });
    };
    const updateClaim = (claim, patch) => {
        mutate(() => {
            Object.assign(claim, patch);
            console.debug(`[cameraOwner] claim update: mode=${claim.mode} active=${claim.active}`);
            if (claim.active) {
                // Claim ownership: last writer wins, the previous owner is superseded.
                owner = claim;
            }
            else if (owner === claim) {
                // Deactivating while owner: release. Deactivations from superseded
                // owners are ignored.
                owner = null;
            }
        });
    };
    const removeClaim = (claim, teardown) => {
        mutate(async () => {
            // The teardown barrier holds even for a superseded owner: its native
            // dispose still touches camera 0, so later ops must wait for it.
            if (teardown)
                await awaitTeardown(teardown);
            console.debug(`[cameraOwner] claim remove: mode=${claim.mode} owner=${owner === claim}`);
            if (owner === claim)
                owner = null;
        });
    };
    const whenGranted = (claim) => {
        return enqueue(() => Promise.resolve());
    };
    const inspect = () => ({
        ownerMode: owner === null ? null : owner.mode,
        applied,
        acquireSucceeded,
        pendingSteps: pendingSteps.length,
    });
    // Read `owner` here, not via `inspect()`: that is diagnostic-only by contract
    // and its read can be stale.
    const warnIfExclusive = (prop) => {
        if (owner !== null && owner.mode === 'exclusive') {
            console.warn(`ScanditProvider: \`${prop}\` has no visible effect while a view owns the camera ` +
                'exclusively (SparkScanAioView). Set SparkScanViewSettings.defaultTorchState / ' +
                'defaultCameraPosition instead.');
        }
    };
    return {
        setTorch(next) {
            return enqueue(() => {
                warnIfExclusive('torchState');
                desiredTorch = next;
                if (camera !== null)
                    camera.desiredTorchState = next;
                return Promise.resolve();
            });
        },
        setPosition(next) {
            return enqueue(async () => {
                warnIfExclusive('cameraPosition');
                position = next;
                await applyOwnerState();
            });
        },
        setCameraSettings(next) {
            return enqueue(async () => {
                desiredSettings = next;
                if (camera !== null && next !== null)
                    await camera.applySettings(next);
            });
        },
        idle() {
            return chain.then(() => undefined, () => undefined);
        },
        dispose() {
            return enqueue(async () => {
                if (disposed)
                    return;
                disposed = true;
                owner = null;
                if (camera !== null) {
                    await camera.switchToDesiredState(FrameSourceState.Off);
                    await context.setFrameSource(null);
                }
                await context.dispose();
            });
        },
        // ─── Ownership surface (backs `useCameraClaim`) ─────────────────────────
        addClaim,
        updateClaim,
        removeClaim,
        whenGranted,
        // ─── Diagnostics ────────────────────────────────────────────────────────
        inspect,
    };
}
const ScanditInternalContext = createContext(null);
/** Reflects a provider's camera-related props onto the singleton camera. */
function useApplyCameraProps(owner, props) {
    const { frameSourceState, torchState, cameraPosition } = props;
    const cameraSettings = useStableProp(props.cameraSettings);
    useEffect(() => {
        if (cameraPosition !== undefined)
            void owner.setPosition(cameraPosition);
    }, [owner, cameraPosition]);
    useEffect(() => {
        if (torchState !== undefined)
            void owner.setTorch(torchState);
    }, [owner, torchState]);
    useEffect(() => {
        if (cameraSettings !== undefined)
            void owner.setCameraSettings(cameraSettings);
    }, [owner, cameraSettings]);
    // The camera is ownership-driven: it is only turned on when a view (or an
    // explicit `frameSourceState={On}`) claims it.
    //   - undefined → do nothing (let views drive the camera).
    //   - Off       → do nothing (no claim).
    //   - On        → claim ownership for as long as this prop stays On. A view
    //                 claiming later supersedes this (last writer wins).
    useEffect(() => {
        if (frameSourceState !== FrameSourceState.On)
            return;
        const claim = { mode: 'shared', active: true };
        owner.addClaim(claim);
        return () => owner.removeClaim(claim);
    }, [owner, frameSourceState]);
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
function NestedScanditProvider({ parent, frameSourceState, torchState, cameraPosition, cameraSettings, licenseKey, settings, options, children, }) {
    if (licenseKey || settings || options) {
        console.warn('ScanditProvider: licenseKey/settings/options are ignored on nested providers.');
    }
    useApplyCameraProps(parent.owner, { frameSourceState, torchState, cameraPosition, cameraSettings });
    return React.createElement(ScanditInternalContext.Provider, { value: parent }, children);
}
function RootScanditProvider({ licenseKey, options, settings, frameSourceState, torchState, cameraPosition, cameraSettings, onError, children, }) {
    const context = useMemo(() => DataCaptureContext.initialize(licenseKey, options ?? null, settings ?? null), 
    // The context is a singleton keyed on licenseKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [licenseKey]);
    // Keep the latest `onError` in a ref so the owner — memoized on `[context]`,
    // and intentionally NOT recreated when `onError` changes — always calls the
    // current callback through a stable wrapper.
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const owner = useMemo(() => createCameraOwner(context, undefined, e => onErrorRef.current?.(e)), [context]);
    // Apply our own props to the singleton. The provider must NOT claim the
    // camera on its own — only an explicit `frameSourceState={On}` from a
    // consumer does. Position/torch defaults are still applied so the camera has
    // a known configuration once something claims it.
    useApplyCameraProps(owner, {
        frameSourceState,
        torchState: torchState ?? DEFAULT_TORCH,
        cameraPosition: cameraPosition ?? DEFAULT_POSITION,
        cameraSettings,
    });
    // Dispose context + camera on unmount. Chained onto the owner's chain so
    // any in-flight operation finishes first.
    useEffect(() => {
        return () => {
            void owner.dispose();
        };
    }, [owner]);
    const internal = useMemo(() => ({ context, owner }), [context, owner]);
    return React.createElement(ScanditInternalContext.Provider, { value: internal }, children);
}
// ─── Internal hooks consumed by AIO view packages ────────────────────────────
/** Internal — exposes the shared context + camera coordinator to AIO views. */
function useScanditInternal() {
    const internal = useContext(ScanditInternalContext);
    if (!internal) {
        throw new Error('This component must be rendered inside a <ScanditProvider>.');
    }
    return internal;
}
/** Internal — used by AIO views to attach modes to the shared context. */
function useDataCaptureContextInternal() {
    return useScanditInternal().context;
}

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
function usePassThroughProps(target, props, keys) {
    useEffect(() => {
        if (!target)
            return;
        for (const key of keys) {
            const value = props[key];
            if (value === undefined)
                continue;
            target[key] = value;
        }
        // `keys` is `as const` at the call site — its identity and length are
        // stable across renders, so the spread produces a same-length,
        // positionally-stable dep array, which is what useEffect requires.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, ...keys.map(k => props[k])]);
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
function useMode(options) {
    const { canAttach = true, settingsDeps } = options;
    const optsRef = useRef(options);
    optsRef.current = options;
    const modeRef = useRef(null);
    const attachedRef = useRef(false);
    // Desired enabled state, seeded from `disabled` at first render. Updated by
    // enable()/disable() and flushed to the mode once attached.
    const desiredEnabledRef = useRef(!options.disabled);
    // Serializes attach()/detach() so focus toggling can't interleave add/remove
    // on the shared context (which is single-active-mode).
    const opChainRef = useRef(Promise.resolve());
    // Bumped *synchronously* by detach(). An in-flight attach op captures the
    // value when it starts and re-checks after its awaits: a detach() issued
    // mid-attach makes the attach roll itself back instead of completing on a
    // dead screen (SDC-32484 — the device trace `attaching → detaching →
    // attach complete, setEnabled=true` re-enabled a mode after teardown).
    const detachEpochRef = useRef(0);
    // Chain an op onto the serialized queue. The `.catch` keeps the chain alive:
    // a failed attach/detach must not poison the queue and silently drop every
    // later lifecycle op.
    const enqueue = useCallback((op) => {
        opChainRef.current = opChainRef.current.then(op).catch(err => {
            // Interpolated, not passed as an object — see `describeError`.
            console.warn(`[useMode] lifecycle operation failed: ${describeError(err)}`);
        });
        return opChainRef.current;
    }, []);
    const getMode = useCallback(() => {
        if (modeRef.current)
            return modeRef.current;
        console.debug('[useMode] create mode');
        modeRef.current = optsRef.current.createMode();
        return modeRef.current;
    }, []);
    const isAttached = useCallback(() => attachedRef.current, []);
    // Debug tag: identifies WHICH mode instance logs (SDC-32484 interim instrumentation).
    const tag = () => (modeRef.current ? modeRef.current.constructor.name : 'unattached');
    // Attach (add to context) + attachables, then flush desired enabled state.
    // Idempotent (no-op while already attached). Reuses the same mode instance so
    // its listener survives across detach→attach.
    const attach = useCallback(() => enqueue(async () => {
        if (attachedRef.current)
            return;
        // Respect the readiness gate (e.g. BarcodeCount waits for its native view).
        // A focus-driven attach() before the gate opens is skipped; the mount
        // effect re-runs attach() once `canAttach` flips true.
        if (optsRef.current.canAttach === false) {
            console.debug('[useMode] attach parked (canAttach=false)');
            return;
        }
        const epoch = detachEpochRef.current;
        const mode = getMode();
        console.debug(`[useMode:${tag()}] attaching`);
        await attachThenAttachables(() => optsRef.current.attach(mode), optsRef.current.attachables);
        attachedRef.current = true;
        // detach() may have been requested while the async attach was in
        // flight (unmount / blur / `disabled` mid-attach). The attach still
        // completes — the queued detach op right behind us needs a symmetric
        // attached state to tear down — but it must NOT enable the mode: the
        // screen is dead or vetoed, and enabling here re-opens the camera on
        // it (SDC-32484 — device trace `attaching → detaching → attach
        // complete, setEnabled=true`).
        const detachPending = detachEpochRef.current !== epoch;
        const enabled = detachPending ? false : desiredEnabledRef.current;
        if (detachPending)
            console.debug('[useMode] detach requested mid-attach — forcing disabled');
        console.debug(`[useMode:${tag()}] attach complete, setEnabled=${enabled}`);
        await optsRef.current.setEnabled(mode, enabled);
    }), [enqueue, getMode]);
    // Detach attachables + the mode (remove from context). Idempotent. Keeps the
    // instance so a later attach() re-adds the same object.
    const detach = useCallback(() => {
        // Synchronous bump so an attach op already past its idempotency check
        // observes the detach request and cancels itself (see attach()).
        detachEpochRef.current++;
        return enqueue(async () => {
            if (!attachedRef.current)
                return;
            const mode = modeRef.current;
            attachedRef.current = false;
            console.debug(`[useMode:${tag()}] detaching`);
            if (mode)
                await detachAttachablesThen(optsRef.current.attachables, () => optsRef.current.detach(mode));
        });
    }, [enqueue]);
    const applyEnabled = useCallback(async (enabled) => {
        desiredEnabledRef.current = enabled;
        if (modeRef.current && attachedRef.current) {
            console.debug(`[useMode:${tag()}] setEnabled=${enabled}`);
            await optsRef.current.setEnabled(modeRef.current, enabled);
        }
        else {
            console.debug(`[useMode] enable=${enabled} deferred (not attached)`);
        }
    }, []);
    const enable = useCallback(() => applyEnabled(true), [applyEnabled]);
    const disable = useCallback(() => applyEnabled(false), [applyEnabled]);
    // Attach on mount once `canAttach`. attach() honors the desired enabled state
    // (seeded from `!disabled`), so a disabled view never auto-enables.
    useEffect(() => {
        if (!canAttach)
            return;
        void attach();
    }, [canAttach, attach]);
    // Settings reapply. Only meaningful when a mode exists.
    useEffect(() => {
        if (!modeRef.current)
            return;
        console.debug('[useMode] reapply settings');
        void Promise.resolve(optsRef.current.applySettings(modeRef.current));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, settingsDeps);
    // Detach on unmount.
    useEffect(() => {
        return () => {
            void detach();
        };
    }, [detach]);
    return { getMode, modeRef, isAttached, enable, disable, attach, detach };
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

/**
 * Handle modes lifetime by calling `onEnable` / `onDisable` when the navigation focus or blur event happens or AppState changes to not active.
 */
function useLifecycleHook({ navigation, disabled = false, appStateHandlingDisabled = false, onEnable, onDisable, }) {
    // Latest-ref so effects/listeners read current callbacks and `disabled`
    // without depending on them (which would re-run / re-subscribe).
    const latest = useRef({ onEnable, onDisable, disabled, appStateHandlingDisabled });
    latest.current = { onEnable, onDisable, disabled, appStateHandlingDisabled };
    // We track focus so the AppState listener won't enable a blurred screen.
    const focusedRef = useRef(true);
    useEffect(() => {
        if (navigation === undefined || navigation.addListener === undefined) {
            return;
        }
        console.debug('[useLifecycleHook] subscribing to focus/blur');
        const offFocus = navigation.addListener('focus', () => {
            focusedRef.current = true;
            if (!latest.current.disabled && AppState.currentState === 'active') {
                console.debug('[useLifecycleHook] enable');
                void latest.current.onEnable();
            }
        });
        const offBlur = navigation.addListener('blur', () => {
            focusedRef.current = false;
            console.debug('[useLifecycleHook] disable');
            void latest.current.onDisable();
        });
        return () => {
            console.debug('[useLifecycleHook] unsubscribing from focus/blur');
            offFocus();
            offBlur();
        };
    }, [navigation]);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', next => {
            if (latest.current.appStateHandlingDisabled) {
                return;
            }
            console.debug(`[useLifecycleHook] app state -> ${next}`);
            if (next === 'active') {
                if (!latest.current.disabled && focusedRef.current) {
                    void latest.current.onEnable();
                }
            }
            else {
                void latest.current.onDisable();
            }
        });
        return () => subscription.remove();
    }, []);
    // React to `disabled` flips.
    useEffect(() => {
        if (disabled) {
            void latest.current.onDisable();
        }
        else if (focusedRef.current && AppState.currentState === 'active') {
            void latest.current.onEnable();
        }
    }, [disabled]);
}

// Native per-view window lifecycle events (emitted by the view containers on
// both platforms — see ViewWindowEventsRelay / ViewWindowEvents). They drive
// the single-owner camera model without any navigation-library coupling:
// attach → claim, detach → release.
const WINDOW_ATTACHED_EVENT = 'NativeView.onWindowAttached';
const WINDOW_DETACHED_EVENT = 'NativeView.onWindowDetached';
let windowEventsCaller = null;
function getWindowEventsCaller() {
    if (windowEventsCaller === null) {
        windowEventsCaller = createRNNativeCaller(NativeModules.ScanditDataCaptureCore);
    }
    return windowEventsCaller;
}
function eventViewId(event) {
    const ev = event;
    if (typeof ev.viewId === 'number')
        return ev.viewId;
    if (typeof ev.data === 'string') {
        try {
            const parsed = JSON.parse(ev.data);
            if (typeof parsed.viewId === 'number')
                return parsed.viewId;
        }
        catch {
            return null;
        }
    }
    return null;
}
/**
 * The entire camera-ownership contract a view wrapper needs to learn. Register
 * a claim and drive it declaratively via `active`; the coordinator in
 * `ScanditProvider.tsx` derives the actual camera state from the full set of
 * currently-registered claims (see its module doc for the derivation rules)
 * and coalesces rapid changes into a single native transition.
 */
function useCameraClaim({ mode, active, nativeViewRef }) {
    const { owner } = useScanditInternal();
    // Stable identity for the lifetime of this hook instance — the coordinator
    // keys its claim Set (and `granted()` waiters) on object identity, not
    // value equality.
    const claimRef = useRef(null);
    if (claimRef.current === null) {
        claimRef.current = { mode, active };
    }
    const registeredRef = useRef(false);
    const releasedRef = useRef(false);
    // `useLayoutEffect`, not `useEffect`: a caller that flips `active` via
    // `setState` and then immediately calls `granted()` relies on the claim
    // being synced to the coordinator within the SAME commit that applied the
    // state change, before `granted()`'s (microtask-deferred) check runs —
    // `useEffect`'s passive-effect scheduling can lag a tick behind that.
    useLayoutEffect(() => {
        const claim = claimRef.current;
        if (!registeredRef.current) {
            registeredRef.current = true;
            releasedRef.current = false;
            owner.addClaim(claim);
            return;
        }
        if (claim.mode !== mode || claim.active !== active) {
            owner.updateClaim(claim, { mode, active });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [owner, mode, active]);
    // Native window lifecycle → ownership (SDC-32484 single-owner model):
    // attach → (re-)claim if the wrapper currently wants the camera, detach →
    // release. Superseded/stale flips are harmless: the coordinator ignores
    // deactivations from non-owners and claims are idempotent.
    const desiredActiveRef = useRef(active);
    desiredActiveRef.current = active;
    useEffect(() => {
        if (!nativeViewRef)
            return;
        const caller = getWindowEventsCaller();
        let disposed = false;
        const subscriptions = [];
        const matchesOwnView = (event) => {
            const id = eventViewId(event);
            if (id === null || nativeViewRef.current == null)
                return false;
            // Resolved lazily at event time: the ref is typically still null when
            // this effect first runs (the child component mounts later).
            const tag = findNodeHandle(nativeViewRef.current);
            return tag !== null && id === tag;
        };
        const subscribe = (eventName, onEvent) => {
            void caller
                .registerEvent(eventName, event => {
                if (!disposed && matchesOwnView(event))
                    onEvent();
                return Promise.resolve();
            })
                .then(subscription => {
                if (disposed)
                    void caller.unregisterEvent(eventName, subscription);
                else
                    subscriptions.push([eventName, subscription]);
            });
        };
        subscribe(WINDOW_ATTACHED_EVENT, () => {
            if (desiredActiveRef.current && !releasedRef.current) {
                owner.updateClaim(claimRef.current, { active: true });
            }
        });
        subscribe(WINDOW_DETACHED_EVENT, () => {
            if (!releasedRef.current) {
                owner.updateClaim(claimRef.current, { active: false });
            }
        });
        return () => {
            disposed = true;
            for (const [eventName, subscription] of subscriptions) {
                void caller.unregisterEvent(eventName, subscription);
            }
        };
    }, [owner, nativeViewRef]);
    // Safety-net release on unmount for a caller that never explicitly calls
    // `release()` — mirrors the old `useApplyCameraProps` cleanup pattern.
    useEffect(() => {
        return () => {
            if (!releasedRef.current) {
                releasedRef.current = true;
                owner.removeClaim(claimRef.current);
            }
        };
    }, [owner]);
    return useMemo(() => ({
        granted: () => 
        // Deferred by one microtask: lets a same-turn `setState` (that a
        // caller just issued right before calling `granted()`) reach the
        // layout effect above first, so this doesn't read a stale `active`.
        Promise.resolve().then(() => owner.whenGranted(claimRef.current)),
        release: teardown => {
            if (releasedRef.current)
                return;
            releasedRef.current = true;
            owner.removeClaim(claimRef.current, teardown);
        },
    }), [owner]);
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
function attachNativeViewWhenReady({ tag, node, whenReady, createNativeView, }) {
    return new Promise((resolve, reject) => {
        if (!node)
            return resolve();
        void whenReady()
            .then(async () => {
            const nodeId = findNodeHandle(node);
            if (nodeId == null)
                return resolve();
            await createNativeView(nodeId);
            resolve();
        })
            .catch((err) => {
            // Interpolated, not passed as an object — see `describeError`.
            console.warn(`[useMode:${tag}] attach failed: ${describeError(err)}`);
            reject(err instanceof Error ? err : new Error(String(err)));
        });
    });
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    attachNativeViewWhenReady: attachNativeViewWhenReady,
    describeError: describeError,
    useCameraClaim: useCameraClaim,
    useDataCaptureContextInternal: useDataCaptureContextInternal,
    useLifecycleHook: useLifecycleHook,
    useMode: useMode,
    useModeListener: useModeListener,
    useNativeControl: useNativeControl,
    useOverlay: useOverlay,
    usePassThroughProps: usePassThroughProps,
    useScanditInternal: useScanditInternal,
    useStableProp: useStableProp,
    useViewHandle: useViewHandle
});

initCoreDefaults();
initCoreProxy();

export { Camera, CameraPosition, DataCaptureContext, DataCaptureVersion, DataCaptureView, FrameSourceState, RNNativeCaller, ScanditProvider, TorchState, index as _internal, createRNNativeCaller, getModuleDynamicDefaults, getNativeModule, initCoreDefaults, initCoreProxy, useCameraPermission, useIsForeground, useScanditContext };
//# sourceMappingURL=index.js.map
