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
exports.RectangularViewfinderAnimation = exports.LaserlineViewfinderStyle = exports.RectangularViewfinderLineStyle = exports.RectangularViewfinderStyle = void 0;
var Serializeable_1 = require("./private/Serializeable");
var RectangularViewfinderStyle;
(function (RectangularViewfinderStyle) {
    RectangularViewfinderStyle["Legacy"] = "legacy";
    RectangularViewfinderStyle["Rounded"] = "rounded";
    RectangularViewfinderStyle["Square"] = "square";
})(RectangularViewfinderStyle = exports.RectangularViewfinderStyle || (exports.RectangularViewfinderStyle = {}));
var RectangularViewfinderLineStyle;
(function (RectangularViewfinderLineStyle) {
    RectangularViewfinderLineStyle["Light"] = "light";
    RectangularViewfinderLineStyle["Bold"] = "bold";
})(RectangularViewfinderLineStyle = exports.RectangularViewfinderLineStyle || (exports.RectangularViewfinderLineStyle = {}));
var LaserlineViewfinderStyle;
(function (LaserlineViewfinderStyle) {
    LaserlineViewfinderStyle["Legacy"] = "legacy";
    LaserlineViewfinderStyle["Animated"] = "animated";
})(LaserlineViewfinderStyle = exports.LaserlineViewfinderStyle || (exports.LaserlineViewfinderStyle = {}));
var RectangularViewfinderAnimation = /** @class */ (function (_super) {
    __extends(RectangularViewfinderAnimation, _super);
    function RectangularViewfinderAnimation(isLooping) {
        var _this = _super.call(this) || this;
        _this._isLooping = false;
        _this._isLooping = isLooping;
        return _this;
    }
    RectangularViewfinderAnimation.fromJSON = function (json) {
        if (json === null) {
            return null;
        }
        return new RectangularViewfinderAnimation(json.looping);
    };
    Object.defineProperty(RectangularViewfinderAnimation.prototype, "isLooping", {
        get: function () {
            return this._isLooping;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('isLooping')
    ], RectangularViewfinderAnimation.prototype, "_isLooping", void 0);
    return RectangularViewfinderAnimation;
}(Serializeable_1.DefaultSerializeable));
exports.RectangularViewfinderAnimation = RectangularViewfinderAnimation;
//# sourceMappingURL=Viewfinder+Related.js.map