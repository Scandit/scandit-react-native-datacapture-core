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
exports.Brush = exports.Color = exports.MarginsWithUnit = exports.SizeWithUnitAndAspect = exports.SizeWithAspect = exports.Size = exports.SizeWithUnit = exports.RectWithUnit = exports.Rect = exports.PointWithUnit = exports.NumberWithUnit = exports.Quadrilateral = exports.Point = void 0;
var CommonEnums_1 = require("./CommonEnums");
var Serializeable_1 = require("./private/Serializeable");
var Point = /** @class */ (function (_super) {
    __extends(Point, _super);
    function Point(x, y) {
        var _this = _super.call(this) || this;
        _this._x = x;
        _this._y = y;
        return _this;
    }
    Object.defineProperty(Point.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Point.fromJSON = function (json) {
        return new Point(json.x, json.y);
    };
    __decorate([
        Serializeable_1.nameForSerialization('x')
    ], Point.prototype, "_x", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('y')
    ], Point.prototype, "_y", void 0);
    return Point;
}(Serializeable_1.DefaultSerializeable));
exports.Point = Point;
var Quadrilateral = /** @class */ (function (_super) {
    __extends(Quadrilateral, _super);
    function Quadrilateral(topLeft, topRight, bottomRight, bottomLeft) {
        var _this = _super.call(this) || this;
        _this._topLeft = topLeft;
        _this._topRight = topRight;
        _this._bottomRight = bottomRight;
        _this._bottomLeft = bottomLeft;
        return _this;
    }
    Object.defineProperty(Quadrilateral.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quadrilateral.prototype, "topRight", {
        get: function () {
            return this._topRight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quadrilateral.prototype, "bottomRight", {
        get: function () {
            return this._bottomRight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Quadrilateral.prototype, "bottomLeft", {
        get: function () {
            return this._bottomLeft;
        },
        enumerable: false,
        configurable: true
    });
    Quadrilateral.fromJSON = function (json) {
        return new Quadrilateral(Point.fromJSON(json.topLeft), Point.fromJSON(json.topRight), Point.fromJSON(json.bottomRight), Point.fromJSON(json.bottomLeft));
    };
    __decorate([
        Serializeable_1.nameForSerialization('topLeft')
    ], Quadrilateral.prototype, "_topLeft", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('topRight')
    ], Quadrilateral.prototype, "_topRight", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('bottomRight')
    ], Quadrilateral.prototype, "_bottomRight", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('bottomLeft')
    ], Quadrilateral.prototype, "_bottomLeft", void 0);
    return Quadrilateral;
}(Serializeable_1.DefaultSerializeable));
exports.Quadrilateral = Quadrilateral;
var NumberWithUnit = /** @class */ (function (_super) {
    __extends(NumberWithUnit, _super);
    function NumberWithUnit(value, unit) {
        var _this = _super.call(this) || this;
        _this._value = value;
        _this._unit = unit;
        return _this;
    }
    Object.defineProperty(NumberWithUnit.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NumberWithUnit.prototype, "unit", {
        get: function () {
            return this._unit;
        },
        enumerable: false,
        configurable: true
    });
    NumberWithUnit.fromJSON = function (json) {
        return new NumberWithUnit(json.value, json.unit);
    };
    __decorate([
        Serializeable_1.nameForSerialization('value')
    ], NumberWithUnit.prototype, "_value", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('unit')
    ], NumberWithUnit.prototype, "_unit", void 0);
    return NumberWithUnit;
}(Serializeable_1.DefaultSerializeable));
exports.NumberWithUnit = NumberWithUnit;
var PointWithUnit = /** @class */ (function (_super) {
    __extends(PointWithUnit, _super);
    function PointWithUnit(x, y) {
        var _this = _super.call(this) || this;
        _this._x = x;
        _this._y = y;
        return _this;
    }
    Object.defineProperty(PointWithUnit.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointWithUnit.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    PointWithUnit.fromJSON = function (json) {
        return new PointWithUnit(NumberWithUnit.fromJSON(json.x), NumberWithUnit.fromJSON(json.y));
    };
    Object.defineProperty(PointWithUnit, "zero", {
        get: function () {
            return new PointWithUnit(new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel), new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel));
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('x')
    ], PointWithUnit.prototype, "_x", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('y')
    ], PointWithUnit.prototype, "_y", void 0);
    return PointWithUnit;
}(Serializeable_1.DefaultSerializeable));
exports.PointWithUnit = PointWithUnit;
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    function Rect(origin, size) {
        var _this = _super.call(this) || this;
        _this._origin = origin;
        _this._size = size;
        return _this;
    }
    Object.defineProperty(Rect.prototype, "origin", {
        get: function () {
            return this._origin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('origin')
    ], Rect.prototype, "_origin", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], Rect.prototype, "_size", void 0);
    return Rect;
}(Serializeable_1.DefaultSerializeable));
exports.Rect = Rect;
var RectWithUnit = /** @class */ (function (_super) {
    __extends(RectWithUnit, _super);
    function RectWithUnit(origin, size) {
        var _this = _super.call(this) || this;
        _this._origin = origin;
        _this._size = size;
        return _this;
    }
    Object.defineProperty(RectWithUnit.prototype, "origin", {
        get: function () {
            return this._origin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RectWithUnit.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('origin')
    ], RectWithUnit.prototype, "_origin", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], RectWithUnit.prototype, "_size", void 0);
    return RectWithUnit;
}(Serializeable_1.DefaultSerializeable));
exports.RectWithUnit = RectWithUnit;
var SizeWithUnit = /** @class */ (function (_super) {
    __extends(SizeWithUnit, _super);
    function SizeWithUnit(width, height) {
        var _this = _super.call(this) || this;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Object.defineProperty(SizeWithUnit.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithUnit.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('width')
    ], SizeWithUnit.prototype, "_width", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('height')
    ], SizeWithUnit.prototype, "_height", void 0);
    return SizeWithUnit;
}(Serializeable_1.DefaultSerializeable));
exports.SizeWithUnit = SizeWithUnit;
var Size = /** @class */ (function (_super) {
    __extends(Size, _super);
    function Size(width, height) {
        var _this = _super.call(this) || this;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Object.defineProperty(Size.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Size.fromJSON = function (json) {
        return new Size(json.width, json.height);
    };
    __decorate([
        Serializeable_1.nameForSerialization('width')
    ], Size.prototype, "_width", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('height')
    ], Size.prototype, "_height", void 0);
    return Size;
}(Serializeable_1.DefaultSerializeable));
exports.Size = Size;
var SizeWithAspect = /** @class */ (function () {
    function SizeWithAspect(size, aspect) {
        this._size = size;
        this._aspect = aspect;
    }
    Object.defineProperty(SizeWithAspect.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithAspect.prototype, "aspect", {
        get: function () {
            return this._aspect;
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('size')
    ], SizeWithAspect.prototype, "_size", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('aspect')
    ], SizeWithAspect.prototype, "_aspect", void 0);
    return SizeWithAspect;
}());
exports.SizeWithAspect = SizeWithAspect;
var SizeWithUnitAndAspect = /** @class */ (function () {
    function SizeWithUnitAndAspect() {
        this._widthAndHeight = null;
        this._widthAndAspectRatio = null;
        this._heightAndAspectRatio = null;
        this._shorterDimensionAndAspectRatio = null;
    }
    Object.defineProperty(SizeWithUnitAndAspect.prototype, "widthAndHeight", {
        get: function () {
            return this._widthAndHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithUnitAndAspect.prototype, "widthAndAspectRatio", {
        get: function () {
            return this._widthAndAspectRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithUnitAndAspect.prototype, "heightAndAspectRatio", {
        get: function () {
            return this._heightAndAspectRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithUnitAndAspect.prototype, "shorterDimensionAndAspectRatio", {
        get: function () {
            return this._shorterDimensionAndAspectRatio;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SizeWithUnitAndAspect.prototype, "sizingMode", {
        get: function () {
            if (this.widthAndAspectRatio) {
                return CommonEnums_1.SizingMode.WidthAndAspectRatio;
            }
            if (this.heightAndAspectRatio) {
                return CommonEnums_1.SizingMode.HeightAndAspectRatio;
            }
            if (this.shorterDimensionAndAspectRatio) {
                return CommonEnums_1.SizingMode.ShorterDimensionAndAspectRatio;
            }
            return CommonEnums_1.SizingMode.WidthAndHeight;
        },
        enumerable: false,
        configurable: true
    });
    SizeWithUnitAndAspect.sizeWithWidthAndHeight = function (widthAndHeight) {
        var sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndHeight = widthAndHeight;
        return sizeWithUnitAndAspect;
    };
    SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio = function (width, aspectRatio) {
        var sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndAspectRatio = new SizeWithAspect(width, aspectRatio);
        return sizeWithUnitAndAspect;
    };
    SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio = function (height, aspectRatio) {
        var sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._heightAndAspectRatio = new SizeWithAspect(height, aspectRatio);
        return sizeWithUnitAndAspect;
    };
    SizeWithUnitAndAspect.sizeWithShorterDimensionAndAspectRatio = function (shorterDimension, aspectRatio) {
        var sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._shorterDimensionAndAspectRatio = new SizeWithAspect(shorterDimension, aspectRatio);
        return sizeWithUnitAndAspect;
    };
    SizeWithUnitAndAspect.fromJSON = function (json) {
        if (json.width && json.height) {
            return this.sizeWithWidthAndHeight(new SizeWithUnit(NumberWithUnit.fromJSON(json.width), NumberWithUnit.fromJSON(json.height)));
        }
        else if (json.width && json.aspect) {
            return this.sizeWithWidthAndAspectRatio(NumberWithUnit.fromJSON(json.width), json.aspect);
        }
        else if (json.height && json.aspect) {
            return this.sizeWithHeightAndAspectRatio(NumberWithUnit.fromJSON(json.height), json.aspect);
        }
        else if (json.shorterDimension && json.aspect) {
            return this.sizeWithShorterDimensionAndAspectRatio(NumberWithUnit.fromJSON(json.shorterDimension), json.aspect);
        }
        else {
            throw new Error("SizeWithUnitAndAspectJSON is malformed: " + JSON.stringify(json));
        }
    };
    SizeWithUnitAndAspect.prototype.toJSON = function () {
        switch (this.sizingMode) {
            case CommonEnums_1.SizingMode.WidthAndAspectRatio:
                return {
                    width: this.widthAndAspectRatio.size.toJSON(),
                    aspect: this.widthAndAspectRatio.aspect,
                };
            case CommonEnums_1.SizingMode.HeightAndAspectRatio:
                return {
                    height: this.heightAndAspectRatio.size.toJSON(),
                    aspect: this.heightAndAspectRatio.aspect,
                };
            case CommonEnums_1.SizingMode.ShorterDimensionAndAspectRatio:
                return {
                    shorterDimension: this.shorterDimensionAndAspectRatio.size.toJSON(),
                    aspect: this.shorterDimensionAndAspectRatio.aspect,
                };
            default:
                return {
                    width: this.widthAndHeight.width.toJSON(),
                    height: this.widthAndHeight.height.toJSON(),
                };
        }
    };
    __decorate([
        Serializeable_1.nameForSerialization('widthAndHeight')
    ], SizeWithUnitAndAspect.prototype, "_widthAndHeight", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('widthAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_widthAndAspectRatio", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('heightAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_heightAndAspectRatio", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('shorterDimensionAndAspectRatio')
    ], SizeWithUnitAndAspect.prototype, "_shorterDimensionAndAspectRatio", void 0);
    return SizeWithUnitAndAspect;
}());
exports.SizeWithUnitAndAspect = SizeWithUnitAndAspect;
var MarginsWithUnit = /** @class */ (function (_super) {
    __extends(MarginsWithUnit, _super);
    function MarginsWithUnit(left, right, top, bottom) {
        var _this = _super.call(this) || this;
        _this._left = left;
        _this._right = right;
        _this._top = top;
        _this._bottom = bottom;
        return _this;
    }
    Object.defineProperty(MarginsWithUnit.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MarginsWithUnit.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MarginsWithUnit.prototype, "top", {
        get: function () {
            return this._top;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MarginsWithUnit.prototype, "bottom", {
        get: function () {
            return this._bottom;
        },
        enumerable: false,
        configurable: true
    });
    MarginsWithUnit.fromJSON = function (json) {
        return new MarginsWithUnit(NumberWithUnit.fromJSON(json.left), NumberWithUnit.fromJSON(json.right), NumberWithUnit.fromJSON(json.top), NumberWithUnit.fromJSON(json.bottom));
    };
    Object.defineProperty(MarginsWithUnit, "zero", {
        get: function () {
            return new MarginsWithUnit(new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel), new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel), new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel), new NumberWithUnit(0, CommonEnums_1.MeasureUnit.Pixel));
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        Serializeable_1.nameForSerialization('left')
    ], MarginsWithUnit.prototype, "_left", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('right')
    ], MarginsWithUnit.prototype, "_right", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('top')
    ], MarginsWithUnit.prototype, "_top", void 0);
    __decorate([
        Serializeable_1.nameForSerialization('bottom')
    ], MarginsWithUnit.prototype, "_bottom", void 0);
    return MarginsWithUnit;
}(Serializeable_1.DefaultSerializeable));
exports.MarginsWithUnit = MarginsWithUnit;
var Color = /** @class */ (function () {
    function Color(hex) {
        this.hexadecimalString = hex;
    }
    Object.defineProperty(Color.prototype, "redComponent", {
        get: function () {
            return this.hexadecimalString.slice(0, 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "greenComponent", {
        get: function () {
            return this.hexadecimalString.slice(2, 4);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blueComponent", {
        get: function () {
            return this.hexadecimalString.slice(4, 6);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "alphaComponent", {
        get: function () {
            return this.hexadecimalString.slice(6, 8);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "red", {
        get: function () {
            return Color.hexToNumber(this.redComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "green", {
        get: function () {
            return Color.hexToNumber(this.greenComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "blue", {
        get: function () {
            return Color.hexToNumber(this.blueComponent);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "alpha", {
        get: function () {
            return Color.hexToNumber(this.alphaComponent);
        },
        enumerable: false,
        configurable: true
    });
    Color.fromHex = function (hex) {
        return new Color(Color.normalizeHex(hex));
    };
    Color.fromRGBA = function (red, green, blue, alpha) {
        var _this = this;
        if (alpha === void 0) { alpha = 1; }
        var hexString = [red, green, blue, this.normalizeAlpha(alpha)]
            .reduce(function (hex, colorComponent) { return hex + _this.numberToHex(colorComponent); }, '');
        return new Color(hexString);
    };
    Color.hexToNumber = function (hex) {
        return parseInt(hex, 16);
    };
    Color.fromJSON = function (json) {
        return Color.fromHex(json);
    };
    Color.numberToHex = function (x) {
        x = Math.round(x);
        var hex = x.toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex.toUpperCase();
    };
    Color.normalizeHex = function (hex) {
        // remove leading #
        if (hex[0] === '#') {
            hex = hex.slice(1);
        }
        // double digits if single digit
        if (hex.length < 6) {
            hex = hex.split('').map(function (s) { return s + s; }).join('');
        }
        // add alpha if missing
        if (hex.length === 6) {
            hex = hex + 'FF';
        }
        return hex.toUpperCase();
    };
    Color.normalizeAlpha = function (alpha) {
        if (alpha > 0 && alpha <= 1) {
            return 255 * alpha;
        }
        return alpha;
    };
    Color.prototype.withAlpha = function (alpha) {
        var newHex = this.hexadecimalString.slice(0, 6) + Color.numberToHex(Color.normalizeAlpha(alpha));
        return Color.fromHex(newHex);
    };
    Color.prototype.toJSON = function () {
        return this.hexadecimalString;
    };
    return Color;
}());
exports.Color = Color;
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush(fillColor, strokeColor, strokeWidth) {
        if (fillColor === void 0) { fillColor = Brush.defaults.fillColor; }
        if (strokeColor === void 0) { strokeColor = Brush.defaults.strokeColor; }
        if (strokeWidth === void 0) { strokeWidth = Brush.defaults.strokeWidth; }
        var _this = _super.call(this) || this;
        _this.fill = { color: fillColor };
        _this.stroke = { color: strokeColor, width: strokeWidth };
        return _this;
    }
    Object.defineProperty(Brush, "transparent", {
        get: function () {
            var transparentBlack = Color.fromRGBA(255, 255, 255, 0);
            return new Brush(transparentBlack, transparentBlack, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "fillColor", {
        get: function () {
            return this.fill.color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "strokeColor", {
        get: function () {
            return this.stroke.color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "strokeWidth", {
        get: function () {
            return this.stroke.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "copy", {
        get: function () {
            return new Brush(this.fillColor, this.strokeColor, this.strokeWidth);
        },
        enumerable: false,
        configurable: true
    });
    return Brush;
}(Serializeable_1.DefaultSerializeable));
exports.Brush = Brush;
//# sourceMappingURL=Common.js.map