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
var Common_1 = require("./Common");
var Defaults_1 = require("./private/Defaults");
var Serializeable_1 = require("./private/Serializeable");
// tslint:disable-next-line:variable-name
exports.NoViewfinder = { type: 'none' };
var LaserlineViewfinder = /** @class */ (function (_super) {
    __extends(LaserlineViewfinder, _super);
    function LaserlineViewfinder() {
        var _this = _super.call(this) || this;
        _this.type = 'laserline';
        _this.width = Defaults_1.Defaults.LaserlineViewfinder.width;
        _this.enabledColor = Defaults_1.Defaults.LaserlineViewfinder.enabledColor;
        _this.disabledColor = Defaults_1.Defaults.LaserlineViewfinder.disabledColor;
        return _this;
    }
    return LaserlineViewfinder;
}(Serializeable_1.DefaultSerializeable));
exports.LaserlineViewfinder = LaserlineViewfinder;
var RectangularViewfinder = /** @class */ (function (_super) {
    __extends(RectangularViewfinder, _super);
    function RectangularViewfinder() {
        var _this = _super.call(this) || this;
        _this.type = 'rectangular';
        _this._sizeWithUnitAndAspect = Defaults_1.Defaults.RectangularViewfinder.size;
        _this.color = Defaults_1.Defaults.RectangularViewfinder.color;
        return _this;
    }
    Object.defineProperty(RectangularViewfinder.prototype, "sizeWithUnitAndAspect", {
        get: function () {
            return this._sizeWithUnitAndAspect;
        },
        enumerable: true,
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
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);
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
        return _this;
    }
    Object.defineProperty(SpotlightViewfinder.prototype, "sizeWithUnitAndAspect", {
        get: function () {
            return this._sizeWithUnitAndAspect;
        },
        enumerable: true,
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
//# sourceMappingURL=Viewfinder.js.map