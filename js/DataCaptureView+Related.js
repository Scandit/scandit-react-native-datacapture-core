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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoStyle = exports.ZoomSwitchControl = exports.TorchSwitchControl = exports.SwipeToZoom = exports.TapToFocus = void 0;
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
var TorchSwitchControl = /** @class */ (function (_super) {
    __extends(TorchSwitchControl, _super);
    function TorchSwitchControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'torch';
        _this.icon = {
            on: { default: null, pressed: null },
            off: { default: null, pressed: null },
        };
        _this.view = null;
        return _this;
    }
    Object.defineProperty(TorchSwitchControl.prototype, "torchOffImage", {
        get: function () {
            return this.icon.off.default;
        },
        set: function (torchOffImage) {
            var _a;
            this.icon.off.default = torchOffImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TorchSwitchControl.prototype, "torchOffPressedImage", {
        get: function () {
            return this.icon.off.pressed;
        },
        set: function (torchOffPressedImage) {
            var _a;
            this.icon.off.pressed = torchOffPressedImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TorchSwitchControl.prototype, "torchOnImage", {
        get: function () {
            return this.icon.on.default;
        },
        set: function (torchOnImage) {
            var _a;
            this.icon.on.default = torchOnImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TorchSwitchControl.prototype, "torchOnPressedImage", {
        get: function () {
            return this.icon.on.pressed;
        },
        set: function (torchOnPressedImage) {
            var _a;
            this.icon.on.pressed = torchOnPressedImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], TorchSwitchControl.prototype, "view", void 0);
    return TorchSwitchControl;
}(Serializeable_1.DefaultSerializeable));
exports.TorchSwitchControl = TorchSwitchControl;
var ZoomSwitchControl = /** @class */ (function (_super) {
    __extends(ZoomSwitchControl, _super);
    function ZoomSwitchControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'zoom';
        _this.icon = {
            zoomedOut: { default: null, pressed: null },
            zoomedIn: { default: null, pressed: null },
        };
        _this.view = null;
        return _this;
    }
    Object.defineProperty(ZoomSwitchControl.prototype, "zoomedOutImage", {
        get: function () {
            return this.icon.zoomedOut.default;
        },
        set: function (zoomedOutImage) {
            var _a;
            this.icon.zoomedOut.default = zoomedOutImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomSwitchControl.prototype, "zoomedInImage", {
        get: function () {
            return this.icon.zoomedIn.default;
        },
        set: function (zoomedInImage) {
            var _a;
            this.icon.zoomedIn.default = zoomedInImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomSwitchControl.prototype, "zoomedInPressedImage", {
        get: function () {
            return this.icon.zoomedIn.pressed;
        },
        set: function (zoomedInPressedImage) {
            var _a;
            this.icon.zoomedIn.pressed = zoomedInPressedImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomSwitchControl.prototype, "zoomedOutPressedImage", {
        get: function () {
            return this.icon.zoomedOut.pressed;
        },
        set: function (zoomedOutPressedImage) {
            var _a;
            this.icon.zoomedOut.pressed = zoomedOutPressedImage;
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], ZoomSwitchControl.prototype, "view", void 0);
    return ZoomSwitchControl;
}(Serializeable_1.DefaultSerializeable));
exports.ZoomSwitchControl = ZoomSwitchControl;
var LogoStyle;
(function (LogoStyle) {
    LogoStyle["Minimal"] = "minimal";
    LogoStyle["Extended"] = "extended";
})(LogoStyle = exports.LogoStyle || (exports.LogoStyle = {}));
//# sourceMappingURL=DataCaptureView+Related.js.map