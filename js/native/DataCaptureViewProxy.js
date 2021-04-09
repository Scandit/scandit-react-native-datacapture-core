"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCaptureViewProxy = void 0;
var react_native_1 = require("react-native");
var Common_1 = require("../Common");
// tslint:disable:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var EventEmitter = new react_native_1.NativeEventEmitter(NativeModule);
// tslint:enable:variable-name
var DataCaptureViewListenerName;
(function (DataCaptureViewListenerName) {
    DataCaptureViewListenerName["didChangeSize"] = "dataCaptureViewListener-didChangeSize";
})(DataCaptureViewListenerName || (DataCaptureViewListenerName = {}));
var DataCaptureViewProxy = /** @class */ (function () {
    function DataCaptureViewProxy() {
        this.nativeListeners = [];
    }
    DataCaptureViewProxy.forDataCaptureView = function (view) {
        var viewProxy = new DataCaptureViewProxy();
        viewProxy.view = view;
        viewProxy.subscribeListener();
        return viewProxy;
    };
    DataCaptureViewProxy.prototype.viewPointForFramePoint = function (point) {
        return NativeModule.viewPointForFramePoint(JSON.stringify(point.toJSON()))
            .then(function (jsonString) { return Common_1.Point.fromJSON(JSON.parse(jsonString)); });
    };
    DataCaptureViewProxy.prototype.viewQuadrilateralForFrameQuadrilateral = function (quadrilateral) {
        return NativeModule.viewQuadrilateralForFrameQuadrilateral(JSON.stringify(quadrilateral.toJSON()))
            .then(function (jsonString) { return Common_1.Quadrilateral.fromJSON(JSON.parse(jsonString)); });
    };
    DataCaptureViewProxy.prototype.dispose = function () {
        this.unsubscribeListener();
    };
    DataCaptureViewProxy.prototype.subscribeListener = function () {
        var _this = this;
        NativeModule.registerListenerForViewEvents();
        var didChangeSize = EventEmitter.addListener(DataCaptureViewListenerName.didChangeSize, function (body) {
            var size = Common_1.Size.fromJSON(body.size);
            var orientation = body.orientation;
            _this.view.listeners.forEach(function (listener) {
                if (listener.didChangeSize) {
                    listener.didChangeSize(_this.view.viewComponent, size, orientation);
                }
            });
        });
        this.nativeListeners.push(didChangeSize);
    };
    DataCaptureViewProxy.prototype.unsubscribeListener = function () {
        NativeModule.unregisterListenerForViewEvents();
        this.nativeListeners.forEach(function (listener) { return listener.remove(); });
        this.nativeListeners = [];
    };
    return DataCaptureViewProxy;
}());
exports.DataCaptureViewProxy = DataCaptureViewProxy;
//# sourceMappingURL=DataCaptureViewProxy.js.map