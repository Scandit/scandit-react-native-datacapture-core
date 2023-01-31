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
exports.Feedback = exports.Sound = exports.Vibration = void 0;
var FeedbackProxy_1 = require("./native/FeedbackProxy");
var Serializeable_1 = require("./private/Serializeable");
var VibrationType;
(function (VibrationType) {
    VibrationType["default"] = "default";
    VibrationType["selectionHaptic"] = "selectionHaptic";
    VibrationType["successHaptic"] = "successHaptic";
})(VibrationType || (VibrationType = {}));
var Vibration = /** @class */ (function (_super) {
    __extends(Vibration, _super);
    function Vibration(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        return _this;
    }
    Object.defineProperty(Vibration, "defaultVibration", {
        get: function () {
            return new Vibration(VibrationType.default);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vibration, "selectionHapticFeedback", {
        get: function () {
            return new Vibration(VibrationType.selectionHaptic);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vibration, "successHapticFeedback", {
        get: function () {
            return new Vibration(VibrationType.successHaptic);
        },
        enumerable: false,
        configurable: true
    });
    Vibration.fromJSON = function (json) {
        return new Vibration(json.type);
    };
    return Vibration;
}(Serializeable_1.DefaultSerializeable));
exports.Vibration = Vibration;
var Sound = /** @class */ (function (_super) {
    __extends(Sound, _super);
    function Sound(resource) {
        var _this = _super.call(this) || this;
        _this.resource = null;
        _this.resource = resource;
        return _this;
    }
    Object.defineProperty(Sound, "defaultSound", {
        get: function () {
            return new Sound(null);
        },
        enumerable: false,
        configurable: true
    });
    Sound.fromJSON = function (json) {
        return new Sound(json.resource);
    };
    __decorate([
        Serializeable_1.ignoreFromSerializationIfNull
    ], Sound.prototype, "resource", void 0);
    return Sound;
}(Serializeable_1.DefaultSerializeable));
exports.Sound = Sound;
var Feedback = /** @class */ (function (_super) {
    __extends(Feedback, _super);
    function Feedback(vibration, sound) {
        var _this = _super.call(this) || this;
        _this._vibration = null;
        _this._sound = null;
        _this._vibration = vibration;
        _this._sound = sound;
        _this.proxy = FeedbackProxy_1.FeedbackProxy.forFeedback(_this);
        return _this;
    }
    Object.defineProperty(Feedback, "defaultFeedback", {
        get: function () {
            return new Feedback(Vibration.defaultVibration, Sound.defaultSound);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Feedback.prototype, "vibration", {
        get: function () {
            return this._vibration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Feedback.prototype, "sound", {
        get: function () {
            return this._sound;
        },
        enumerable: false,
        configurable: true
    });
    Feedback.fromJSON = function (json) {
        return new Feedback(json.vibration ? Vibration.fromJSON(json.vibration) : null, json.sound ? Sound.fromJSON(json.sound) : null);
    };
    Feedback.prototype.emit = function () {
        this.proxy.emit();
    };
    __decorate([
        Serializeable_1.ignoreFromSerializationIfNull,
        Serializeable_1.nameForSerialization('vibration')
    ], Feedback.prototype, "_vibration", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerializationIfNull,
        Serializeable_1.nameForSerialization('sound')
    ], Feedback.prototype, "_sound", void 0);
    __decorate([
        Serializeable_1.ignoreFromSerialization
    ], Feedback.prototype, "proxy", void 0);
    return Feedback;
}(Serializeable_1.DefaultSerializeable));
exports.Feedback = Feedback;
//# sourceMappingURL=Feedback.js.map