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
exports.Camera = void 0;
var Camera_Related_1 = require("./Camera+Related");
var FrameSource_1 = require("./FrameSource");
var CameraProxy_1 = require("./native/CameraProxy");
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.type = 'camera';
        _this.settings = null;
        _this._desiredTorchState = Camera_Related_1.TorchState.Off;
        _this._desiredState = FrameSource_1.FrameSourceState.Off;
        _this.listeners = [];
        _this._context = null;
        _this.proxy = CameraProxy_1.CameraProxy.forCamera(_this);
        return _this;
    }
    Object.defineProperty(Camera.prototype, "context", {
        get: function () {
            return this._context;
        },
        set: function (newContext) {
            if (newContext == null) {
                this.proxy.unsubscribeListener();
            }
            else if (this._context == null) {
                this.proxy.subscribeListener();
            }
            this._context = newContext;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera, "default", {
        get: function () {
            if (Defaults_1.Defaults.Camera.defaultPosition) {
                var camera = new Camera();
                camera.position = Defaults_1.Defaults.Camera.defaultPosition;
                return camera;
            }
            else {
                return null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Camera.atPosition = function (cameraPosition) {
        if (Defaults_1.Defaults.Camera.availablePositions.includes(cameraPosition)) {
            var camera = new Camera();
            camera.position = cameraPosition;
            return camera;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(Camera.prototype, "desiredState", {
        get: function () {
            return this._desiredState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "desiredTorchState", {
        get: function () {
            return this._desiredTorchState;
        },
        set: function (desiredTorchState) {
            this._desiredTorchState = desiredTorchState;
            this.didChange();
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.switchToDesiredState = function (state) {
        this._desiredState = state;
        return this.didChange();
    };
    Camera.prototype.getCurrentState = function () {
        return this.proxy.getCurrentState();
    };
    Camera.prototype.getIsTorchAvailable = function () {
        return this.proxy.getIsTorchAvailable();
    };
    Camera.prototype.addListener = function (listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    };
    Camera.prototype.removeListener = function (listener) {
        if (listener == null) {
            return;
        }
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
    Camera.prototype.applySettings = function (settings) {
        this.settings = settings;
        return this.didChange();
    };
    Camera.prototype.didChange = function () {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
    };
    __decorate([
        Serializeable_1.serializationDefault({})
    ], Camera.prototype, "settings", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('desiredTorchState')
    ], Camera.prototype, "_desiredTorchState", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('desiredState')
    ], Camera.prototype, "_desiredState", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], Camera.prototype, "listeners", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], Camera.prototype, "_context", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], Camera.prototype, "proxy", void 0);
    return Camera;
}(Serializeable_1.DefaultSerializeable));
exports.Camera = Camera;
//# sourceMappingURL=Camera.js.map