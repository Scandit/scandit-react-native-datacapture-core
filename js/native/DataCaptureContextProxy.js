"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCaptureContextProxy = void 0;
var react_native_1 = require("react-native");
var DataCaptureContext_Related_1 = require("../DataCaptureContext+Related");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var DataCaptureContextListenerName;
(function (DataCaptureContextListenerName) {
    DataCaptureContextListenerName["didChangeStatus"] = "dataCaptureContextListener-didChangeStatus";
    DataCaptureContextListenerName["didStartObservingContext"] = "dataCaptureContextListener-didStartObservingContext";
})(DataCaptureContextListenerName || (DataCaptureContextListenerName = {}));
var DataCaptureContextProxy = /** @class */ (function () {
    function DataCaptureContextProxy() {
        this.nativeListeners = [];
    }
    Object.defineProperty(DataCaptureContextProxy.prototype, "privateContext", {
        get: function () {
            return this.context;
        },
        enumerable: false,
        configurable: true
    });
    DataCaptureContextProxy.forDataCaptureContext = function (context) {
        var contextProxy = new DataCaptureContextProxy();
        contextProxy.context = context;
        contextProxy.initialize();
        return contextProxy;
    };
    DataCaptureContextProxy.prototype.updateContextFromJSON = function () {
        var _this = this;
        return NativeModule.updateContextFromJSON(JSON.stringify(this.context.toJSON()))
            .catch(function (error) {
            _this.notifyListenersOfDeserializationError(error);
            return Promise.reject(error);
        });
    };
    DataCaptureContextProxy.prototype.dispose = function () {
        this.unsubscribeListener();
        return NativeModule.dispose();
    };
    DataCaptureContextProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    DataCaptureContextProxy.prototype.initialize = function () {
        this.subscribeListener();
        return this.initializeContextFromJSON();
    };
    DataCaptureContextProxy.prototype.initializeContextFromJSON = function () {
        var _this = this;
        return NativeModule.contextFromJSON(JSON.stringify(this.context.toJSON()))
            .catch(function (error) {
            _this.notifyListenersOfDeserializationError(error);
            return Promise.reject(error);
        });
    };
    DataCaptureContextProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForEvents();
        var didChangeStatus = EventEmitter.addListener(DataCaptureContextListenerName.didChangeStatus, function (body) {
            var contextStatus = DataCaptureContext_Related_1.ContextStatus.fromJSON(JSON.parse(body.status));
            _this.notifyListenersOfDidChangeStatus(contextStatus);
        });
        var didStartObservingContext = EventEmitter.addListener(DataCaptureContextListenerName.didStartObservingContext, function (body) {
            _this.privateContext.listeners.forEach(function (listener) {
                if (listener.didStartObservingContext) {
                    listener.didStartObservingContext(_this.context);
                }
            });
        });
        this.nativeListeners.push(didChangeStatus);
        this.nativeListeners.push(didStartObservingContext);
    };
    DataCaptureContextProxy.prototype.notifyListenersOfDeserializationError = function (error) {
        var contextStatus = DataCaptureContext_Related_1.ContextStatus
            .fromJSON({
            message: error,
            code: -1,
            isValid: true,
        });
        this.notifyListenersOfDidChangeStatus(contextStatus);
    };
    DataCaptureContextProxy.prototype.notifyListenersOfDidChangeStatus = function (contextStatus) {
        var _this = this;
        this.privateContext.listeners.forEach(function (listener) {
            if (listener.didChangeStatus) {
                listener.didChangeStatus(_this.context, contextStatus);
            }
        });
    };
    return DataCaptureContextProxy;
}());
exports.DataCaptureContextProxy = DataCaptureContextProxy;
//# sourceMappingURL=DataCaptureContextProxy.js.map