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
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
var TorchState;
(function (TorchState) {
    TorchState["On"] = "on";
    TorchState["Off"] = "off";
    TorchState["Auto"] = "auto";
})(TorchState = exports.TorchState || (exports.TorchState = {}));
var CameraPosition;
(function (CameraPosition) {
    CameraPosition["WorldFacing"] = "worldFacing";
    CameraPosition["UserFacing"] = "userFacing";
    CameraPosition["Unspecified"] = "unspecified";
})(CameraPosition = exports.CameraPosition || (exports.CameraPosition = {}));
var VideoResolution;
(function (VideoResolution) {
    VideoResolution["Auto"] = "auto";
    VideoResolution["HD"] = "hd";
    VideoResolution["FullHD"] = "fullHd";
    VideoResolution["UHD4K"] = "uhd4k";
})(VideoResolution = exports.VideoResolution || (exports.VideoResolution = {}));
var FocusRange;
(function (FocusRange) {
    FocusRange["Full"] = "full";
    FocusRange["Near"] = "near";
    FocusRange["Far"] = "far";
})(FocusRange = exports.FocusRange || (exports.FocusRange = {}));
var PrivateCameraProperty;
(function (PrivateCameraProperty) {
    PrivateCameraProperty["CameraAPI"] = "api";
})(PrivateCameraProperty || (PrivateCameraProperty = {}));
var CameraSettings = /** @class */ (function (_super) {
    __extends(CameraSettings, _super);
    function CameraSettings(settings) {
        var _this = _super.call(this) || this;
        _this.preferredResolution = Defaults_1.Defaults.Camera.Settings.preferredResolution;
        _this.maxFrameRate = Defaults_1.Defaults.Camera.Settings.maxFrameRate;
        _this.zoomFactor = Defaults_1.Defaults.Camera.Settings.zoomFactor;
        _this.api = 1;
        _this.focus = {
            range: Defaults_1.Defaults.Camera.Settings.focusRange,
        };
        if (settings !== undefined && settings !== null) {
            Object.getOwnPropertyNames(settings).forEach(function (propertyName) {
                _this[propertyName] = settings[propertyName];
            });
        }
        return _this;
    }
    Object.defineProperty(CameraSettings.prototype, "focusRange", {
        get: function () {
            return this.focus.range;
        },
        set: function (newRange) {
            this.focus.range = newRange;
        },
        enumerable: true,
        configurable: true
    });
    CameraSettings.fromJSON = function (json) {
        var settings = new CameraSettings();
        settings.preferredResolution = json.preferredResolution;
        settings.maxFrameRate = json.maxFrameRate;
        settings.zoomFactor = json.zoomFactor;
        settings.focusRange = json.focusRange;
        if (json.api !== undefined && json.api !== null) {
            settings.api = json.api;
        }
        return settings;
    };
    CameraSettings.prototype.setProperty = function (name, value) {
        switch (name) {
            case PrivateCameraProperty.CameraAPI:
                this.api = value;
                break;
        }
    };
    CameraSettings.prototype.getProperty = function (name) {
        switch (name) {
            case PrivateCameraProperty.CameraAPI:
                return this.api;
        }
    };
    return CameraSettings;
}(Serializeable_1.DefaultSerializeable));
exports.CameraSettings = CameraSettings;
//# sourceMappingURL=Camera+Related.js.map