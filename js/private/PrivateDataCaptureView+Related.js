"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateZoomGestureDeserializer = exports.PrivateFocusGestureDeserializer = void 0;
var DataCaptureView_Related_1 = require("../DataCaptureView+Related");
var PrivateFocusGestureDeserializer = /** @class */ (function () {
    function PrivateFocusGestureDeserializer() {
    }
    PrivateFocusGestureDeserializer.fromJSON = function (json) {
        if (json && json.type === new DataCaptureView_Related_1.TapToFocus().type) {
            return new DataCaptureView_Related_1.TapToFocus();
        }
        else {
            return null;
        }
    };
    return PrivateFocusGestureDeserializer;
}());
exports.PrivateFocusGestureDeserializer = PrivateFocusGestureDeserializer;
var PrivateZoomGestureDeserializer = /** @class */ (function () {
    function PrivateZoomGestureDeserializer() {
    }
    PrivateZoomGestureDeserializer.fromJSON = function (json) {
        if (json && json.type === new DataCaptureView_Related_1.SwipeToZoom().type) {
            return new DataCaptureView_Related_1.SwipeToZoom();
        }
        else {
            return null;
        }
    };
    return PrivateZoomGestureDeserializer;
}());
exports.PrivateZoomGestureDeserializer = PrivateZoomGestureDeserializer;
//# sourceMappingURL=PrivateDataCaptureView+Related.js.map