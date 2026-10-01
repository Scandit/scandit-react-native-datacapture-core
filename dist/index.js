import { CORE_PROXY_TYPE_NAMES, registerCoreProxies, loadCoreDefaults, setCoreDefaultsLoader, BaseDataCaptureView, DataCaptureContext, TorchState, CameraPosition, Camera, FrameSourceState } from './core.js';
export { AimerViewfinder, Anchor, Brush, CameraSettings, CameraSwitchControl, ClusteringMode, Color, ContextStatus, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameDataSettings, FrameDataSettingsBuilder, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogoStyle, MacroMode, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, SelectionMode, SequenceFrameSource, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchSwitchControl, Vibration, VibrationType, VideoResolution, WaveFormVibration, ZoomSwitchControl, ZoomSwitchOrientation } from './core.js';
import { NativeEventEmitter, Platform, NativeModules, TurboModuleRegistry, findNodeHandle, requireNativeComponent, AppState, PermissionsAndroid } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef, useLayoutEffect } from 'react';

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
        return '8.6.1';
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
function createCameraOwner(context, cameraFactory = position => Camera.atPosition(position), onError) {
    let camera = null;
    // The position the live `camera` was created for; recreate only when it flips.
    let createdPosition = null;
    let position = DEFAULT_POSITION;
    let desiredTorch = DEFAULT_TORCH;
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
            console.warn('ScanditProvider: camera operation failed', err);
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
        if (camera === null || createdPosition !== position) {
            // `Camera.atPosition` returns null when the position is unavailable on
            // the device. Don't crash the chain — warn and leave the camera off; a
            // later position change can retry.
            camera = cameraFactory(position);
            if (camera === null) {
                console.warn('ScanditProvider: no camera available at position', position);
                return;
            }
            createdPosition = position;
        }
        camera.desiredTorchState = desiredTorch;
        // Mark before the awaits: a partial failure leaves applied='on' so a
        // later release fully unwinds the half-attached camera.
        applied = 'on';
        acquireSucceeded = false;
        try {
            await context.setFrameSource(camera);
            await camera.switchToDesiredState(FrameSourceState.On);
            acquireSucceeded = true;
        }
        catch (err) {
            if (retriesLeft > 0) {
                console.warn('ScanditProvider: switching the camera on failed, retrying once', err);
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
    };
    /** Hard release: full Off + frame source detached. Required when the device
     * must be free immediately - an exclusive (own-camera) owner taking camera 0,
     * or provider dispose. Standby is not enough there: it keeps the capture
     * session (and the context's frame source) alive. */
    const releaseSharedCamera = async () => {
        if (camera === null || applied === 'off')
            return;
        applied = 'off';
        acquireSucceeded = false;
        await camera.switchToDesiredState(FrameSourceState.Off);
        await context.setFrameSource(null);
    };
    const releaseManagedCamera = releaseSharedCamera;
    /** Apply the state the CURRENT owner implies. Called at op-run time so a
     * superseded claim's op naturally applies the latest truth. */
    const applyOwnerState = async () => {
        if (disposed)
            return;
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
    return {
        setTorch(next) {
            return enqueue(() => {
                desiredTorch = next;
                if (camera !== null)
                    camera.desiredTorchState = next;
                return Promise.resolve();
            });
        },
        setPosition(next) {
            return enqueue(async () => {
                position = next;
                await applyOwnerState();
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
    };
}
const ScanditInternalContext = createContext(null);
/** Reflects a provider's camera-related props onto the singleton camera. */
function useApplyCameraProps(owner, props) {
    const { frameSourceState, torchState, cameraPosition } = props;
    useEffect(() => {
        if (cameraPosition !== undefined)
            void owner.setPosition(cameraPosition);
    }, [owner, cameraPosition]);
    useEffect(() => {
        if (torchState !== undefined)
            void owner.setTorch(torchState);
    }, [owner, torchState]);
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
 *   props to the same singleton camera. Last writer wins; values are not reverted
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
function RootScanditProvider({ licenseKey, options, settings, frameSourceState, torchState, cameraPosition, onError, children, }) {
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
            console.warn('[useMode] lifecycle operation failed', err);
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

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
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

export { Camera, CameraPosition, DataCaptureContext, DataCaptureVersion, DataCaptureView, FrameSourceState, RNNativeCaller, ScanditProvider, TorchState, index as _internal, createRNNativeCaller, getModuleDefaults, getNativeModule, initCoreDefaults, initCoreProxy, useCameraPermission, useIsForeground, useScanditContext };
//# sourceMappingURL=index.js.map
