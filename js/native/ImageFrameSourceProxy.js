"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFrameSourceProxy = void 0;
var react_native_1 = require("react-native");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var FrameSourceListenerName;
(function (FrameSourceListenerName) {
    FrameSourceListenerName["didChangeState"] = "frameSourceListener-didChangeState";
})(FrameSourceListenerName || (FrameSourceListenerName = {}));
var ImageFrameSourceProxy = /** @class */ (function () {
    function ImageFrameSourceProxy() {
        this.nativeListeners = [];
    }
    ImageFrameSourceProxy.forImage = function (imageFrameSource) {
        var proxy = new ImageFrameSourceProxy();
        proxy.imageFrameSource = imageFrameSource;
        return proxy;
    };
    ImageFrameSourceProxy.prototype.getCurrentState = function () {
        return NativeModule.getCurrentCameraState(this.imageFrameSource.position);
    };
    ImageFrameSourceProxy.prototype.dispose = function () {
        this.unsubscribeListener();
        return NativeModule.dispose();
    };
    ImageFrameSourceProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForCameraEvents();
        var didChangeState = EventEmitter.addListener(FrameSourceListenerName.didChangeState, function (body) {
            var newState = body.state;
            _this.imageFrameSource.listeners.forEach(function (listener) {
                if (listener.didChangeState) {
                    listener.didChangeState(_this.imageFrameSource, newState);
                }
            });
        });
        this.nativeListeners.push(didChangeState);
    };
    ImageFrameSourceProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForCameraEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    return ImageFrameSourceProxy;
}());
exports.ImageFrameSourceProxy = ImageFrameSourceProxy;
//# sourceMappingURL=ImageFrameSourceProxy.js.map