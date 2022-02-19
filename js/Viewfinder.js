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
exports.AimerViewfinder = exports.SpotlightViewfinder = exports.RectangularViewfinder = exports.LaserlineViewfinder = exports.NoViewfinder = void 0;
var Common_1 = require("./Common");
var CommonEnums_1 = require("./CommonEnums");
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
// tslint:disable-next-line:variable-name
exports.NoViewfinder = { type: 'none' };
var LaserlineViewfinder = /** @class */ (function (_super) {
    __extends(LaserlineViewfinder, _super);
    function LaserlineViewfinder(style) {
        var _this = _super.call(this) || this;
        _this.type = 'laserline';
        var viewfinderStyle = style || Defaults_1.Defaults.LaserlineViewfinder.defaultStyle;
        _this._style = Defaults_1.Defaults.LaserlineViewfinder.styles[viewfinderStyle].style;
        _this.width = Defaults_1.Defaults.LaserlineViewfinder.styles[viewfinderStyle].width;
        _this.enabledColor = Defaults_1.Defaults.LaserlineViewfinder.styles[viewfinderStyle].enabledColor;
        _this.disabledColor = Defaults_1.Defaults.LaserlineViewfinder.styles[viewfinderStyle].disabledColor;
        return _this;
    }
    Object.defineProperty(LaserlineViewfinder.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('style')
    ], LaserlineViewfinder.prototype, "_style", void 0);
    return LaserlineViewfinder;
}(Serializeable_1.DefaultSerializeable));
exports.LaserlineViewfinder = LaserlineViewfinder;
var RectangularViewfinder = /** @class */ (function (_super) {
    __extends(RectangularViewfinder, _super);
    function RectangularViewfinder(style, lineStyle) {
        var _this = _super.call(this) || this;
        _this.type = 'rectangular';
        var viewfinderStyle = style || Defaults_1.Defaults.RectangularViewfinder.defaultStyle;
        _this._style = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].style;
        _this._lineStyle = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
        _this._dimming = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].dimming;
        _this._disabledDimming = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].disabledDimming;
        _this._animation = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].animation;
        _this._color = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].color;
        _this._disabledColor = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].disabledColor;
        _this._sizeWithUnitAndAspect = Defaults_1.Defaults.RectangularViewfinder.styles[viewfinderStyle].size;
        if (lineStyle !== undefined) {
            _this._lineStyle = lineStyle;
        }
        return _this;
    }
    Object.defineProperty(RectangularViewfinder.prototype, "sizeWithUnitAndAspect", {
        get: function () {
            return this._sizeWithUnitAndAspect;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "lineStyle", {
        get: function () {
            return this._lineStyle;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "disabledColor", {
        get: function () {
            return this._disabledColor;
        },
        set: function (value) {
            this._disabledColor = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "dimming", {
        get: function () {
            return this._dimming;
        },
        set: function (value) {
            this._dimming = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "disabledDimming", {
        get: function () {
            return this._disabledDimming;
        },
        set: function (value) {
            this._disabledDimming = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectangularViewfinder.prototype, "animation", {
        get: function () {
            return this._animation;
        },
        set: function (animation) {
            this._animation = animation;
        },
        enumerable: false,
        configurable: true
    });
    RectangularViewfinder.prototype.setSize = function (size) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
    };
    RectangularViewfinder.prototype.setWidthAndAspectRatio = function (width, heightToWidthAspectRatio) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
    };
    RectangularViewfinder.prototype.setHeightAndAspectRatio = function (height, widthToHeightAspectRatio) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
    };
    RectangularViewfinder.prototype.setShorterDimensionAndAspectRatio = function (fraction, aspectRatio) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithShorterDimensionAndAspectRatio(new Common_1.NumberWithUnit(fraction, CommonEnums_1.MeasureUnit.Fraction), aspectRatio);
    };
    __decorate([
        Serializeable_1.nameForSerialization('style')
    ], RectangularViewfinder.prototype, "_style", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('lineStyle')
    ], RectangularViewfinder.prototype, "_lineStyle", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('dimming')
    ], RectangularViewfinder.prototype, "_dimming", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('disabledDimming')
    ], RectangularViewfinder.prototype, "_disabledDimming", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('animation')
    ], RectangularViewfinder.prototype, "_animation", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('color')
    ], RectangularViewfinder.prototype, "_color", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('disabledColor')
    ], RectangularViewfinder.prototype, "_disabledColor", void 0);
    return RectangularViewfinder;
}(Serializeable_1.DefaultSerializeable));
exports.RectangularViewfinder = RectangularViewfinder;
var SpotlightViewfinder = /** @class */ (function (_super) {
    __extends(SpotlightViewfinder, _super);
    function SpotlightViewfinder() {
        var _this = _super.call(this) || this;
        _this.type = 'spotlight';
        _this._sizeWithUnitAndAspect = Defaults_1.Defaults.SpotlightViewfinder.size;
        _this.enabledBorderColor = Defaults_1.Defaults.SpotlightViewfinder.enabledBorderColor;
        _this.disabledBorderColor = Defaults_1.Defaults.SpotlightViewfinder.disabledBorderColor;
        _this.backgroundColor = Defaults_1.Defaults.SpotlightViewfinder.backgroundColor;
        // tslint:disable-next-line:no-console
        console.warn('SpotlightViewfinder is deprecated and will be removed in a future release. Use RectangularViewfinder instead.');
        return _this;
    }
    Object.defineProperty(SpotlightViewfinder.prototype, "sizeWithUnitAndAspect", {
        get: function () {
            return this._sizeWithUnitAndAspect;
        },
        enumerable: false,
        configurable: true
    });
    SpotlightViewfinder.prototype.setSize = function (size) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
    };
    SpotlightViewfinder.prototype.setWidthAndAspectRatio = function (width, heightToWidthAspectRatio) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
    };
    SpotlightViewfinder.prototype.setHeightAndAspectRatio = function (height, widthToHeightAspectRatio) {
        this._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
    };
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], SpotlightViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);
    return SpotlightViewfinder;
}(Serializeable_1.DefaultSerializeable));
exports.SpotlightViewfinder = SpotlightViewfinder;
var AimerViewfinder = /** @class */ (function (_super) {
    __extends(AimerViewfinder, _super);
    function AimerViewfinder() {
        var _this = _super.call(this) || this;
        _this.type = 'aimer';
        _this.frameColor = Defaults_1.Defaults.AimerViewfinder.frameColor;
        _this.dotColor = Defaults_1.Defaults.AimerViewfinder.dotColor;
        return _this;
    }
    return AimerViewfinder;
}(Serializeable_1.DefaultSerializeable));
exports.AimerViewfinder = AimerViewfinder;
//# sourceMappingURL=Viewfinder.js.map