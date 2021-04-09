"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipeToZoom = exports.TapToFocus = void 0;
var Serializeable_1 = require("./private/Serializeable");
var TapToFocus = /** @class */ (function (_super) {
    __extends(TapToFocus, _super);
    function TapToFocus() {
        var _this = _super.call(this) || this;
        _this.type = 'tapToFocus';
        return _this;
    }
    return TapToFocus;
}(Serializeable_1.DefaultSerializeable));
exports.TapToFocus = TapToFocus;
var SwipeToZoom = /** @class */ (function (_super) {
    __extends(SwipeToZoom, _super);
    function SwipeToZoom() {
        var _this = _super.call(this) || this;
        _this.type = 'swipeToZoom';
        return _this;
    }
    return SwipeToZoom;
}(Serializeable_1.DefaultSerializeable));
exports.SwipeToZoom = SwipeToZoom;
//# sourceMappingURL=DataCaptureView+Related.js.map