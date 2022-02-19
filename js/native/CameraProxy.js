"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraProxy = void 0;
var react_native_1 = require("react-native");
var PrivateCamera_Related_1 = require("../private/PrivateCamera+Related");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var FrameSourceListenerName;
(function (FrameSourceListenerName) {
    FrameSourceListenerName["didChangeState"] = "frameSourceListener-didChangeState";
})(FrameSourceListenerName || (FrameSourceListenerName = {}));
var CameraProxy = /** @class */ (function () {
    function CameraProxy() {
        this.nativeListeners = [];
    }
    CameraProxy.forCamera = function (camera) {
        var proxy = new CameraProxy();
        proxy.camera = camera;
        return proxy;
    };
    CameraProxy.getLastFrame = function () {
        return NativeModule.getLastFrame().then(function (frameDataJSONString) {
            return PrivateCamera_Related_1.FrameData.fromJSON(JSON.parse(frameDataJSONString));
        });
    };
    CameraProxy.prototype.getCurrentState = function () {
        return NativeModule.getCurrentCameraState(this.camera.position);
    };
    CameraProxy.prototype.getIsTorchAvailable = function () {
        return NativeModule.isTorchAvailable(this.camera.position);
    };
    CameraProxy.prototype.dispose = function () {
        this.unsubscribeListener();
        return NativeModule.dispose();
    };
    CameraProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForCameraEvents();
        var didChangeState = EventEmitter.addListener(FrameSourceListenerName.didChangeState, function (body) {
            var newState = body.state;
            _this.camera.listeners.forEach(function (listener) {
                if (listener.didChangeState) {
                    listener.didChangeState(_this.camera, newState);
                }
            });
        });
        this.nativeListeners.push(didChangeState);
    };
    CameraProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForCameraEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    return CameraProxy;
}());
exports.CameraProxy = CameraProxy;
//# sourceMappingURL=CameraProxy.js.map