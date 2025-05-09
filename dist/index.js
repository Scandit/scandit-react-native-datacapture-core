import { FactoryMaker, FrameSourceListenerEvents, BaseNativeProxy, DataCaptureContextEvents, DataCaptureViewEvents, loadCoreDefaults, BaseDataCaptureView } from './core.js';
export { AimerViewfinder, Anchor, Brush, Camera, CameraPosition, CameraSettings, Color, ContextStatus, DataCaptureContext, DataCaptureContextSettings, Direction, Expiration, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameSourceState, ImageBuffer, ImageFrameSource, LicenseInfo, LogoStyle, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, Point, PointWithUnit, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchState, TorchSwitchControl, Vibration, VideoResolution, WaveFormVibration, ZoomSwitchControl } from './core.js';
import { NativeModules, NativeEventEmitter, Platform, InteractionManager, findNodeHandle, requireNativeComponent } from 'react-native';
import React from 'react';

// tslint:disable-next-line:variable-name
const NativeModule$6 = NativeModules.ScanditDataCaptureCore;
class NativeFeedbackProxy {
    emitFeedback(feedback) {
        return NativeModule$6.emitFeedback(JSON.stringify(feedback.toJSON()));
    }
}

// tslint:disable:variable-name
const NativeModule$5 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter$3 = new NativeEventEmitter(NativeModule$5);
// tslint:enable:variable-name
class NativeImageFrameSourceProxy {
    eventEmitter;
    nativeListeners = [];
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
    getCurrentCameraState(position) {
        return NativeModule$5.getCurrentCameraState(position);
    }
    switchCameraToDesiredState(desiredStateJson) {
        return NativeModule$5.switchCameraToDesiredState(desiredStateJson);
    }
    registerListenerForEvents() {
        NativeModule$5.registerListenerForCameraEvents();
    }
    unregisterListenerForEvents() {
        NativeModule$5.unregisterListenerForCameraEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
    }
    subscribeDidChangeState() {
        const didChangeState = RNEventEmitter$3.addListener(FrameSourceListenerEvents.didChangeState, (event) => {
            this.eventEmitter.emit(FrameSourceListenerEvents.didChangeState, event.data);
        });
        this.nativeListeners.push(didChangeState);
    }
}

// tslint:disable:variable-name
const NativeModule$4 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter$2 = new NativeEventEmitter(NativeModule$4);
// tslint:enable:variable-name
const { major, minor, patch } = Platform.constants?.reactNativeVersion;
class NativeDataCaptureContextProxy extends BaseNativeProxy {
    nativeListeners = [];
    get framework() {
        return 'react-native';
    }
    get frameworkVersion() {
        return `${major}.${minor}.${patch}`;
    }
    contextFromJSON(contextJson) {
        return NativeModule$4.contextFromJSON(contextJson);
    }
    updateContextFromJSON(contextJson) {
        return NativeModule$4.updateContextFromJSON(contextJson);
    }
    addModeToContext(modeJson) {
        return NativeModule$4.addModeToContext(modeJson);
    }
    removeModeFromContext(modeJson) {
        return NativeModule$4.removeModeFromContext(modeJson);
    }
    removeAllModesFromContext() {
        return NativeModule$4.removeAllModesFromContext();
    }
    dispose() {
        return NativeModule$4.dispose();
    }
    registerListenerForDataCaptureContext() {
        NativeModule$4.registerListenerForEvents();
    }
    unregisterListenerForDataCaptureContext() {
        const p = NativeModule$4.unregisterListenerForEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
        return p;
    }
    subscribeDidChangeStatus() {
        const didChangeStatus = RNEventEmitter$2.addListener(DataCaptureContextEvents.didChangeStatus, (event) => {
            this.eventEmitter.emit(DataCaptureContextEvents.didChangeStatus, event.data);
        });
        this.nativeListeners.push(didChangeStatus);
    }
    subscribeDidStartObservingContext() {
        const didStartObservingContext = RNEventEmitter$2.addListener(DataCaptureContextEvents.didStartObservingContext, () => {
            this.eventEmitter.emit(DataCaptureContextEvents.didStartObservingContext);
        });
        this.nativeListeners.push(didStartObservingContext);
    }
    getOpenSourceSoftwareLicenseInfo() {
        return NativeModule$4.getOpenSourceSoftwareLicenseInfo();
    }
}

// tslint:disable:variable-name
const NativeModule$3 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter$1 = new NativeEventEmitter(NativeModule$3);
// tslint:enable:variable-name
class NativeDataCaptureViewProxy extends BaseNativeProxy {
    nativeListeners = [];
    constructor() {
        super();
    }
    addOverlay(overlayJson) {
        return NativeModule$3.addOverlay(overlayJson);
    }
    removeOverlay(overlayJson) {
        return NativeModule$3.removeOverlay(overlayJson);
    }
    createView(viewJson) {
        return NativeModule$3.createDataCaptureView(viewJson);
    }
    updateView(viewJson) {
        return NativeModule$3.updateDataCaptureView(viewJson);
    }
    removeView() {
        return Promise.resolve();
    }
    viewPointForFramePoint(pointJson) {
        return NativeModule$3.viewPointForFramePoint(pointJson);
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateralJson) {
        return NativeModule$3.viewQuadrilateralForFrameQuadrilateral(quadrilateralJson);
    }
    registerListenerForViewEvents() {
        NativeModule$3.registerListenerForViewEvents();
    }
    unregisterListenerForViewEvents() {
        NativeModule$3.unregisterListenerForViewEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
    }
    subscribeDidChangeSize() {
        const didChangeSize = RNEventEmitter$1.addListener(DataCaptureViewEvents.didChangeSize, (event) => {
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

// tslint:disable:variable-name
const NativeModule$2 = NativeModules.ScanditDataCaptureCore;
const RNEventEmitter = new NativeEventEmitter(NativeModule$2);
// tslint:enable:variable-name
class NativeCameraProxy {
    nativeListeners = [];
    eventEmitter;
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
    getFrame(frameId) {
        return NativeModule$2.getFrame(frameId);
    }
    getCurrentCameraState(position) {
        return NativeModule$2.getCurrentCameraState(position);
    }
    isTorchAvailable(position) {
        return NativeModule$2.isTorchAvailable(position);
    }
    switchCameraToDesiredState(desiredStateJson) {
        return NativeModule$2.switchCameraToDesiredState(desiredStateJson);
    }
    registerListenerForCameraEvents() {
        NativeModule$2.registerListenerForCameraEvents();
    }
    unregisterListenerForCameraEvents() {
        const p = NativeModule$2.unregisterListenerForCameraEvents();
        this.nativeListeners.forEach(listener => listener.remove());
        this.nativeListeners = [];
        return p;
    }
    subscribeDidChangeState() {
        const didChangeState = RNEventEmitter.addListener(FrameSourceListenerEvents.didChangeState, (event) => {
            this.eventEmitter.emit(FrameSourceListenerEvents.didChangeState, event.data);
        });
        this.nativeListeners.push(didChangeState);
    }
}

function initCoreProxy() {
    FactoryMaker.bindInstance('DataCaptureContextProxy', new NativeDataCaptureContextProxy());
    FactoryMaker.bindInstance('FeedbackProxy', new NativeFeedbackProxy());
    FactoryMaker.bindInstance('ImageFrameSourceProxy', new NativeImageFrameSourceProxy());
    FactoryMaker.bindInstance('DataCaptureViewProxy', new NativeDataCaptureViewProxy());
    FactoryMaker.bindInstance('CameraProxy', new NativeCameraProxy());
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
        return '7.2.2';
    }
    static get sdkVersion() {
        return NativeModule.Version;
    }
}

class DataCaptureView extends React.Component {
    view;
    constructor(props) {
        super(props);
        // Do not create the view automatically. Do that only when componentDidMount is called.
        this.view = BaseDataCaptureView.forContext(props.context, false);
        this.view.viewComponent = this;
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
        this.view.dispose();
    }
    componentDidMount() {
        // This is required to ensure that findNodeHandle returns a valid handle
        InteractionManager.runAfterInteractions(() => {
            this.createDataCaptureView();
        });
    }
    render() {
        return React.createElement(RNTDataCaptureView, { ...this.props });
    }
    createDataCaptureView() {
        const viewId = findNodeHandle(this);
        this.view.viewId = viewId;
        this.view.createNativeView();
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
