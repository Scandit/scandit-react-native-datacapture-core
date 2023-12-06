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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCaptureContext = exports.DataCaptureContextSettings = void 0;
var react_native_1 = require("react-native");
var DataCaptureContextProxy_1 = require("./native/DataCaptureContextProxy");
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
var DataCaptureContextSettings = /** @class */ (function (_super) {
    __extends(DataCaptureContextSettings, _super);
    function DataCaptureContextSettings() {
        return _super.call(this) || this;
    }
    DataCaptureContextSettings.prototype.setProperty = function (name, value) {
        this[name] = value;
    };
    DataCaptureContextSettings.prototype.getProperty = function (name) {
        return this[name];
    };
    return DataCaptureContextSettings;
}(Serializeable_1.DefaultSerializeable));
exports.DataCaptureContextSettings = DataCaptureContextSettings;
// @ts-ignore
var _b = (_a = react_native_1.Platform.constants) === null || _a === void 0 ? void 0 : _a.reactNativeVersion, major = _b.major, minor = _b.minor, patch = _b.patch;
var DataCaptureContext = /** @class */ (function (_super) {
    __extends(DataCaptureContext, _super);
    function DataCaptureContext(licenseKey, deviceName) {
        var _this = _super.call(this) || this;
        _this.licenseKey = licenseKey;
        _this.deviceName = deviceName;
        _this.framework = 'react-native';
        _this.frameworkVersion = major + "." + minor + "." + patch;
        _this.settings = new DataCaptureContextSettings();
        _this._frameSource = null;
        _this.view = null;
        _this.modes = [];
        _this.components = [];
        _this.listeners = [];
        return _this;
    }
    Object.defineProperty(DataCaptureContext.prototype, "frameSource", {
        get: function () {
            return this._frameSource;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataCaptureContext, "deviceID", {
        get: function () {
            return Defaults_1.Defaults.deviceID;
        },
        enumerable: false,
        configurable: true
    });
    DataCaptureContext.forLicenseKey = function (licenseKey) {
        return DataCaptureContext.forLicenseKeyWithOptions(licenseKey, null);
    };
    DataCaptureContext.forLicenseKeyWithSettings = function (licenseKey, settings) {
        var context = this.forLicenseKey(licenseKey);
        if (settings !== null) {
            context.applySettings(settings);
        }
        return context;
    };
    DataCaptureContext.forLicenseKeyWithOptions = function (licenseKey, options) {
        if (options == null) {
            options = { deviceName: null };
        }
        return new DataCaptureContext(licenseKey, options.deviceName || '');
    };
    DataCaptureContext.prototype.setFrameSource = function (frameSource) {
        if (this._frameSource) {
            this._frameSource.context = null;
        }
        this._frameSource = frameSource;
        if (frameSource) {
            frameSource.context = this;
        }
        return this.update();
    };
    DataCaptureContext.prototype.addListener = function (listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    };
    DataCaptureContext.prototype.removeListener = function (listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
    DataCaptureContext.prototype.addMode = function (mode) {
        if (!this.modes.includes(mode)) {
            this.modes.push(mode);
            mode._context = this;
            this.update();
        }
    };
    DataCaptureContext.prototype.removeMode = function (mode) {
        if (this.modes.includes(mode)) {
            this.modes.splice(this.modes.indexOf(mode), 1);
            mode._context = null;
            this.update();
        }
    };
    DataCaptureContext.prototype.removeAllModes = function () {
        this.modes.forEach(function (mode) {
            mode._context = null;
        });
        this.modes = [];
        this.update();
    };
    DataCaptureContext.prototype.dispose = function () {
        var _a;
        if (!this.proxy) {
            return;
        }
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.removeAllModes();
        this.proxy.dispose();
    };
    DataCaptureContext.prototype.applySettings = function (settings) {
        this.settings = settings;
        return this.update();
    };
    // Called when the capture view is shown, that is the earliest point that we need the context deserialized.
    DataCaptureContext.prototype.initialize = function () {
        if (this.proxy) {
            return;
        }
        this.proxy = DataCaptureContextProxy_1.DataCaptureContextProxy.forDataCaptureContext(this);
    };
    DataCaptureContext.prototype.update = function () {
        if (!this.proxy) {
            return Promise.resolve();
        }
        return this.proxy.updateContextFromJSON();
    };
    DataCaptureContext.prototype.addComponent = function (component) {
        if (this.components.includes(component)) {
            return Promise.resolve();
        }
        this.components.push(component);
        component._context = this;
        return this.update();
    };
    __decorate([
        Serializeable_1.nameForSerialization('frameSource')
    ], DataCaptureContext.prototype, "_frameSource", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], DataCaptureContext.prototype, "proxy", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], DataCaptureContext.prototype, "listeners", void 0);
    return DataCaptureContext;
}(Serializeable_1.DefaultSerializeable));
exports.DataCaptureContext = DataCaptureContext;
//# sourceMappingURL=DataCaptureContext.js.map