import { CORE_PROXY_TYPE_NAMES, registerCoreProxies, loadCoreDefaults, setCoreDefaultsLoader, BaseDataCaptureView } from './core.js';
export { AimerViewfinder, Anchor, Brush, Camera, CameraPosition, CameraSettings, ClusteringMode, Color, ContextStatus, DataCaptureContext, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameDataSettings, FrameDataSettingsBuilder, FrameSourceState, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogoStyle, MacroMode, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchState, TorchSwitchControl, Vibration, VideoResolution, WaveFormVibration, ZoomSwitchControl } from './core.js';
import { NativeEventEmitter, Platform, NativeModules, TurboModuleRegistry, InteractionManager, findNodeHandle, requireNativeComponent } from 'react-native';
import React from 'react';

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
        return '8.3.1';
    }
    static get sdkVersion() {
        return NativeModule.Version;
    }
}

class DataCaptureView extends React.Component {
    view;
    _isMounted = false;
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
    get zoomGesture() {
        return this.view.zoomGesture;
    }
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
        this.view.dispose();
    }
    componentDidMount() {
        this._isMounted = true;
        // This is required to ensure that findNodeHandle returns a valid handle
        void InteractionManager.runAfterInteractions(async () => {
            // Check if component is still mounted before creating view
            if (this._isMounted) {
                await this.createDataCaptureView();
            }
        });
    }
    render() {
        return React.createElement(RNTDataCaptureView, { ...this.props });
    }
    removeAllOverlays() {
        this.view.removeAllOverlays();
    }
    async createDataCaptureView() {
        const viewId = findNodeHandle(this);
        await this.view.createNativeView(viewId);
    }
}
const RNTDataCaptureView = requireNativeComponent('RNTDataCaptureView');

initCoreDefaults();
initCoreProxy();

export { DataCaptureVersion, DataCaptureView, RNNativeCaller, createRNNativeCaller, getModuleDefaults, getNativeModule, initCoreDefaults, initCoreProxy };
//# sourceMappingURL=index.js.map
