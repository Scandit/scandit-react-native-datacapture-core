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
exports.PrivateDataCaptureView = void 0;
var DataCaptureContext_1 = require("../DataCaptureContext");
var DataCaptureViewProxy_1 = require("../native/DataCaptureViewProxy");
var Defaults_1 = require("./Defaults");
var Serializeable_1 = require("./Serializeable");
var PrivateDataCaptureView = /** @class */ (function (_super) {
    __extends(PrivateDataCaptureView, _super);
    function PrivateDataCaptureView() {
        var _this = _super.call(this) || this;
        _this._context = null;
        _this.scanAreaMargins = Defaults_1.Defaults.DataCaptureView.scanAreaMargins;
        _this.pointOfInterest = Defaults_1.Defaults.DataCaptureView.pointOfInterest;
        _this.logoAnchor = Defaults_1.Defaults.DataCaptureView.logoAnchor;
        _this.logoOffset = Defaults_1.Defaults.DataCaptureView.logoOffset;
        _this.focusGesture = Defaults_1.Defaults.DataCaptureView.focusGesture;
        _this.zoomGesture = Defaults_1.Defaults.DataCaptureView.zoomGesture;
        _this.overlays = [];
        _this.controls = [];
        _this.logoStyle = Defaults_1.Defaults.DataCaptureView.logoStyle;
        _this.listeners = [];
        _this.proxy = DataCaptureViewProxy_1.DataCaptureViewProxy.forDataCaptureView(_this);
        return _this;
    }
    Object.defineProperty(PrivateDataCaptureView.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (context) {
            if (!(context instanceof DataCaptureContext_1.DataCaptureContext || context == null)) {
                // This should never happen, but let's just be sure
                throw new Error('The context for a capture view must be a DataCaptureContext');
            }
            this._context = context;
            if (this._context) {
                this._context.view = this;
                this._context.initialize();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PrivateDataCaptureView.prototype, "privateContext", {
        get: function () {
            return this.context;
        },
        enumerable: false,
        configurable: true
    });
    PrivateDataCaptureView.forContext = function (context) {
        var view = new PrivateDataCaptureView();
        view.context = context;
        return view;
    };
    PrivateDataCaptureView.prototype.addOverlay = function (overlay) {
        if (this.overlays.includes(overlay)) {
            return;
        }
        overlay.view = this;
        this.overlays.push(overlay);
        this.privateContext.update();
    };
    PrivateDataCaptureView.prototype.removeOverlay = function (overlay) {
        if (!this.overlays.includes(overlay)) {
            return;
        }
        overlay.view = null;
        this.overlays.splice(this.overlays.indexOf(overlay), 1);
        this.privateContext.update();
    };
    PrivateDataCaptureView.prototype.addListener = function (listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    };
    PrivateDataCaptureView.prototype.removeListener = function (listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
    };
    PrivateDataCaptureView.prototype.viewPointForFramePoint = function (point) {
        return this.proxy.viewPointForFramePoint(point);
    };
    PrivateDataCaptureView.prototype.viewQuadrilateralForFrameQuadrilateral = function (quadrilateral) {
        return this.proxy.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
    };
    PrivateDataCaptureView.prototype.addControl = function (control) {
        if (!this.controls.includes(control)) {
            control.view = this;
            this.controls.push(control);
            this.privateContext.update();
        }
    };
    PrivateDataCaptureView.prototype.removeControl = function (control) {
        if (this.controls.includes(control)) {
            control.view = null;
            this.controls.splice(this.overlays.indexOf(control), 1);
            this.privateContext.update();
        }
    };
    PrivateDataCaptureView.prototype.controlUpdated = function () {
        this.privateContext.update();
    };
    PrivateDataCaptureView.prototype.dispose = function () {
        var _this = this;
        this.overlays.forEach(function (overlay) { return _this.removeOverlay(overlay); });
        this.listeners.forEach(function (listener) { return _this.removeListener(listener); });
        this.proxy.dispose();
    };
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], PrivateDataCaptureView.prototype, "_context", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], PrivateDataCaptureView.prototype, "viewComponent", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], PrivateDataCaptureView.prototype, "proxy", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], PrivateDataCaptureView.prototype, "listeners", void 0);
    return PrivateDataCaptureView;
}(Serializeable_1.DefaultSerializeable));
exports.PrivateDataCaptureView = PrivateDataCaptureView;
//# sourceMappingURL=PrivateDataCaptureView.js.map