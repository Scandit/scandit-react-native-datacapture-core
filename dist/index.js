import { FactoryMaker, FrameSourceListenerEvents, BaseNativeProxy, DataCaptureViewEvents, createNativeProxy, loadCoreDefaults, BaseDataCaptureView } from './core.js';
export { AimerViewfinder, Anchor, Brush, Camera, CameraPosition, CameraSettings, Color, ContextStatus, DataCaptureContext, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameDataSettings, FrameDataSettingsBuilder, FrameSourceState, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, LogoStyle, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchState, TorchSwitchControl, Vibration, VideoResolution, WaveFormVibration, ZoomSwitchControl } from './core.js';
import { NativeModules, NativeEventEmitter, InteractionManager, findNodeHandle, requireNativeComponent, Platform } from 'react-native';
import React from 'react';

// tslint:disable-next-line:variable-name
const NativeModule$4 = NativeModules.ScanditDataCaptureCore;
class NativeFeedbackProxy {
    emitFeedback(feedback) {
        return NativeModule$4.emitFeedback(JSON.stringify(feedback.toJSON()));
    }
}

// tslint:disable:variable-name
const NativeModule$3 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter$1 = new NativeEventEmitter(NativeModule$3);
// tslint:enable:variable-name
class NativeImageFrameSourceProxy {
    eventEmitter;
    nativeListeners = [];
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
    getCurrentCameraState(position) {
        return NativeModule$3.getCurrentCameraState(position);
    }
    switchCameraToDesiredState(desiredStateJson) {
        return NativeModule$3.switchCameraToDesiredState(desiredStateJson);
    }
    registerListenerForEvents() {
        NativeModule$3.registerListenerForCameraEvents();
    }
    unregisterListenerForEvents() {
        NativeModule$3.unregisterListenerForCameraEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
    }
    subscribeDidChangeState() {
        const didChangeState = RNEventEmitter$1.addListener(FrameSourceListenerEvents.didChangeState, (event) => {
            this.eventEmitter.emit(FrameSourceListenerEvents.didChangeState, event.data);
        });
        this.nativeListeners.push(didChangeState);
    }
}

// tslint:disable:variable-name
const NativeModule$2 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter = new NativeEventEmitter(NativeModule$2);
// tslint:enable:variable-name
class NativeDataCaptureViewProxy extends BaseNativeProxy {
    nativeListeners = [];
    constructor() {
        super();
    }
    addOverlay(overlayJson) {
        return NativeModule$2.addOverlay(overlayJson);
    }
    removeOverlay(overlayJson) {
        return NativeModule$2.removeOverlay(overlayJson);
    }
    createView(viewJson) {
        return NativeModule$2.createDataCaptureView(viewJson);
    }
    updateView(viewJson) {
        return NativeModule$2.updateDataCaptureView(viewJson);
    }
    removeView(viewId) {
        return Promise.resolve();
    }
    viewPointForFramePoint({ viewId, pointJson }) {
        return NativeModule$2.viewPointForFramePoint({ viewId, point: pointJson });
    }
    viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateralJson }) {
        return NativeModule$2.viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateral: quadrilateralJson });
    }
    registerListenerForViewEvents(viewId) {
        NativeModule$2.registerListenerForViewEvents(viewId);
    }
    unregisterListenerForViewEvents(viewId) {
        NativeModule$2.unregisterListenerForViewEvents(viewId);
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
    }
    subscribeDidChangeSize() {
        const didChangeSize = RNEventEmitter.addListener(DataCaptureViewEvents.didChangeSize, (event) => {
            this.eventEmitter.emit(DataCaptureViewEvents.didChangeSize, event.data);
        });
        this.nativeListeners.push(didChangeSize);
    }
    // Only for HTML Based views
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return Promise.resolve();
    }
    show() {
        return Promise.resolve();
    }
    hide() {
        return Promise.resolve();
    }
}

function initCoreProxy() {
    FactoryMaker.bindInstance('FeedbackProxy', new NativeFeedbackProxy());
    FactoryMaker.bindInstance('ImageFrameSourceProxy', new NativeImageFrameSourceProxy());
    FactoryMaker.bindInstance('DataCaptureViewProxy', new NativeDataCaptureViewProxy());
    FactoryMaker.bindLazyInstance('DataCaptureContextProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureCore);
        return createNativeProxy(caller);
    });
    FactoryMaker.bindLazyInstance('CameraProxy', () => {
        const caller = createRNNativeCaller(NativeModules.ScanditDataCaptureCore);
        return createNativeProxy(caller);
    });
}

// tslint:disable-next-line:variable-name
const NativeModule$1 = NativeModules.ScanditDataCaptureCore;
function initCoreDefaults() {
    loadCoreDefaults(NativeModule$1.Defaults);
}

// tslint:disable-next-line:variable-name
const NativeModule = NativeModules.ScanditDataCaptureCore;
class DataCaptureVersion {
    static get pluginVersion() {
        return '7.5.0';
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
        this.view = BaseDataCaptureView.forContext(props.context, false);
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
    addOverlay(overlay) {
        this.view.addOverlay(overlay);
    }
    removeOverlay(overlay) {
        this.view.removeOverlay(overlay);
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
        InteractionManager.runAfterInteractions(() => {
            // Check if component is still mounted before creating view
            if (this._isMounted) {
                this.createDataCaptureView();
            }
        });
    }
    render() {
        return React.createElement(RNTDataCaptureView, { ...this.props });
    }
    createDataCaptureView() {
        const viewId = findNodeHandle(this);
        this.view.createNativeView(viewId);
    }
    removeAllOverlays() {
        this.view.removeAllOverlays();
    }
}
// tslint:disable-next-line:variable-name
const RNTDataCaptureView = requireNativeComponent('RNTDataCaptureView', DataCaptureView);

class RNNativeCaller {
    nativeModule;
    nativeEventEmitter;
    constructor(nativeModule) {
        this.nativeModule = nativeModule;
        this.nativeEventEmitter = new NativeEventEmitter(this.nativeModule);
    }
    get framework() {
        return 'react-native';
    }
    get frameworkVersion() {
        const { major, minor, patch } = Platform.constants?.reactNativeVersion;
        return `${major}.${minor}.${patch}`;
    }
    callFn(fnName, args) {
        // @ts-ignore
        if (args === null || args === undefined || (args?.length && args.length > 0)) {
            return this.nativeModule[fnName]();
        }
        return this.nativeModule[fnName](args);
    }
    async registerEvent(evName, handler) {
        return this.nativeEventEmitter.addListener(evName, async (event) => {
            await handler(event);
        });
    }
    async unregisterEvent(_evName, subscription) {
        await subscription.remove();
    }
    eventHook(args) {
        return args;
    }
}
function createRNNativeCaller(nativeModule) {
    return new RNNativeCaller(nativeModule);
}

initCoreDefaults();
initCoreProxy();

export { DataCaptureVersion, DataCaptureView, RNNativeCaller, createRNNativeCaller, initCoreDefaults, initCoreProxy };
//# sourceMappingURL=index.js.map
