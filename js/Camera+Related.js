"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFrameSource = exports.ImageBuffer = exports.CameraSettings = exports.FocusGestureStrategy = exports.FocusRange = exports.VideoResolution = exports.CameraPosition = exports.TorchState = void 0;
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
var FrameSource_1 = require("./FrameSource");
var ImageFrameSourceProxy_1 = require("./native/ImageFrameSourceProxy");
var TorchState;
(function (TorchState) {
    TorchState["On"] = "on";
    TorchState["Off"] = "off";
    TorchState["Auto"] = "auto";
})(TorchState || (exports.TorchState = TorchState = {}));
var CameraPosition;
(function (CameraPosition) {
    CameraPosition["WorldFacing"] = "worldFacing";
    CameraPosition["UserFacing"] = "userFacing";
    CameraPosition["Unspecified"] = "unspecified";
})(CameraPosition || (exports.CameraPosition = CameraPosition = {}));
var VideoResolution;
(function (VideoResolution) {
    VideoResolution["Auto"] = "auto";
    VideoResolution["HD"] = "hd";
    VideoResolution["FullHD"] = "fullHd";
    VideoResolution["UHD4K"] = "uhd4k";
})(VideoResolution || (exports.VideoResolution = VideoResolution = {}));
var FocusRange;
(function (FocusRange) {
    FocusRange["Full"] = "full";
    FocusRange["Near"] = "near";
    FocusRange["Far"] = "far";
})(FocusRange || (exports.FocusRange = FocusRange = {}));
var FocusGestureStrategy;
(function (FocusGestureStrategy) {
    FocusGestureStrategy["None"] = "none";
    FocusGestureStrategy["Manual"] = "manual";
    FocusGestureStrategy["ManualUntilCapture"] = "manualUntilCapture";
    FocusGestureStrategy["AutoOnLocation"] = "autoOnLocation";
})(FocusGestureStrategy || (exports.FocusGestureStrategy = FocusGestureStrategy = {}));
var CameraSettings = /** @class */ (function (_super) {
    __extends(CameraSettings, _super);
    function CameraSettings(settings) {
        var _this = _super.call(this) || this;
        _this.focusHiddenProperties = [
            'range',
            'manualLensPosition',
            'shouldPreferSmoothAutoFocus',
            'focusStrategy',
            'focusGestureStrategy'
        ];
        _this.preferredResolution = Defaults_1.Defaults.Camera.Settings.preferredResolution;
        _this.zoomFactor = Defaults_1.Defaults.Camera.Settings.zoomFactor;
        _this.zoomGestureZoomFactor = Defaults_1.Defaults.Camera.Settings.zoomGestureZoomFactor;
        _this.focus = {
            range: Defaults_1.Defaults.Camera.Settings.focusRange,
            focusGestureStrategy: Defaults_1.Defaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: Defaults_1.Defaults.Camera.Settings.shouldPreferSmoothAutoFocus,
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
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CameraSettings.prototype, "focusGestureStrategy", {
        get: function () {
            return this.focus.focusGestureStrategy;
        },
        set: function (newStrategy) {
            this.focus.focusGestureStrategy = newStrategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CameraSettings.prototype, "shouldPreferSmoothAutoFocus", {
        get: function () {
            return this.focus.shouldPreferSmoothAutoFocus;
        },
        set: function (newShouldPreferSmoothAutoFocus) {
            this.focus.shouldPreferSmoothAutoFocus = newShouldPreferSmoothAutoFocus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CameraSettings.prototype, "maxFrameRate", {
        get: function () {
            // tslint:disable-next-line:no-console
            console.warn('maxFrameRate is deprecated');
            return 0;
        },
        set: function (newValue) {
            // tslint:disable-next-line:no-console
            console.warn('maxFrameRate is deprecated');
        },
        enumerable: false,
        configurable: true
    });
    CameraSettings.fromJSON = function (json) {
        var e_1, _a;
        var settings = new CameraSettings();
        settings.preferredResolution = json.preferredResolution;
        settings.zoomFactor = json.zoomFactor;
        settings.focusRange = json.focusRange;
        settings.zoomGestureZoomFactor = json.zoomGestureZoomFactor;
        settings.focusGestureStrategy = json.focusGestureStrategy;
        settings.shouldPreferSmoothAutoFocus = json.shouldPreferSmoothAutoFocus;
        if (json.properties !== undefined) {
            try {
                for (var _b = __values(Object.keys(json.properties)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    settings.setProperty(key, json.properties[key]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return settings;
    };
    CameraSettings.prototype.setProperty = function (name, value) {
        if (this.focusHiddenProperties.includes(name)) {
            this.focus[name] = value;
            return;
        }
        this[name] = value;
    };
    CameraSettings.prototype.getProperty = function (name) {
        if (this.focusHiddenProperties.includes(name)) {
            return this.focus[name];
        }
        return this[name];
    };
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], CameraSettings.prototype, "focusHiddenProperties", void 0);
    return CameraSettings;
}(Serializeable_1.DefaultSerializeable));
exports.CameraSettings = CameraSettings;
var ImageBuffer = /** @class */ (function () {
    function ImageBuffer() {
    }
    Object.defineProperty(ImageBuffer.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageBuffer.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageBuffer.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    return ImageBuffer;
}());
exports.ImageBuffer = ImageBuffer;
var ImageFrameSource = /** @class */ (function (_super) {
    __extends(ImageFrameSource, _super);
    function ImageFrameSource() {
        var _this = _super.call(this) || this;
        _this.type = 'image';
        _this.image = '';
        _this._id = "".concat(Date.now());
        _this._desiredState = FrameSource_1.FrameSourceState.Off;
        _this.listeners = [];
        _this._context = null;
        _this.proxy = ImageFrameSourceProxy_1.ImageFrameSourceProxy.forImage(_this);
        return _this;
    }
    Object.defineProperty(ImageFrameSource.prototype, "context", {
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
    Object.defineProperty(ImageFrameSource.prototype, "desiredState", {
        get: function () {
            return this._desiredState;
        },
        enumerable: false,
        configurable: true
    });
    ImageFrameSource.create = function (image) {
        var imageFrameSource = new ImageFrameSource();
        imageFrameSource.image = image;
        return imageFrameSource;
    };
    ImageFrameSource.fromJSON = function (json) {
        return ImageFrameSource.create(json.image);
    };
    ImageFrameSource.prototype.didChange = function () {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
    };
    ImageFrameSource.prototype.switchToDesiredState = function (state) {
        this._desiredState = state;
        return this.didChange();
    };
    ImageFrameSource.prototype.addListener = function (listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    };
    ImageFrameSource.prototype.removeListener = function (listener) {
        if (listener == null) {
            return;
        }
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
    ImageFrameSource.prototype.getCurrentState = function () {
        return this.proxy.getCurrentState();
    };
    __decorate([
        (0, Serializeable_1.nameForSerialization)('id')
    ], ImageFrameSource.prototype, "_id", void 0);
    __decorate([
        (0, Serializeable_1.nameForSerialization)('desiredState')
    ], ImageFrameSource.prototype, "_desiredState", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], ImageFrameSource.prototype, "listeners", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], ImageFrameSource.prototype, "_context", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], ImageFrameSource.prototype, "proxy", void 0);
    return ImageFrameSource;
}(Serializeable_1.DefaultSerializeable));
exports.ImageFrameSource = ImageFrameSource;
//# sourceMappingURL=Camera+Related.js.map