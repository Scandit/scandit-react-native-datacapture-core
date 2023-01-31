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
exports.RectangularLocationSelection = exports.RadiusLocationSelection = exports.NoneLocationSelection = void 0;
var Common_1 = require("./Common");
var Serializeable_1 = require("./private/Serializeable");
// tslint:disable-next-line:variable-name
exports.NoneLocationSelection = { type: 'none' };
var RadiusLocationSelection = /** @class */ (function (_super) {
    __extends(RadiusLocationSelection, _super);
    function RadiusLocationSelection(radius) {
        var _this = _super.call(this) || this;
        _this.type = 'radius';
        _this._radius = radius;
        return _this;
    }
    Object.defineProperty(RadiusLocationSelection.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('radius')
    ], RadiusLocationSelection.prototype, "_radius", void 0);
    return RadiusLocationSelection;
}(Serializeable_1.DefaultSerializeable));
exports.RadiusLocationSelection = RadiusLocationSelection;
var RectangularLocationSelection = /** @class */ (function (_super) {
    __extends(RectangularLocationSelection, _super);
    function RectangularLocationSelection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'rectangular';
        return _this;
    }
    Object.defineProperty(RectangularLocationSelection.prototype, "sizeWithUnitAndAspect", {
        get: function () {
            return this._sizeWithUnitAndAspect;
        },
        enumerable: false,
        configurable: true
    });
    RectangularLocationSelection.withSize = function (size) {
        var locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
        return locationSelection;
    };
    RectangularLocationSelection.withWidthAndAspectRatio = function (width, heightToWidthAspectRatio) {
        var locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect
            .sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
        return locationSelection;
    };
    RectangularLocationSelection.withHeightAndAspectRatio = function (height, widthToHeightAspectRatio) {
        var locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = Common_1.SizeWithUnitAndAspect
            .sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
        return locationSelection;
    };
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], RectangularLocationSelection.prototype, "_sizeWithUnitAndAspect", void 0);
    return RectangularLocationSelection;
}(Serializeable_1.DefaultSerializeable));
exports.RectangularLocationSelection = RectangularLocationSelection;
//# sourceMappingURL=LocationSelection.js.map