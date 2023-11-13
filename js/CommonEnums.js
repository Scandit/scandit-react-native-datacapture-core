"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anchor = exports.Direction = exports.Orientation = exports.SizingMode = exports.MeasureUnit = void 0;
var MeasureUnit;
(function (MeasureUnit) {
    MeasureUnit["DIP"] = "dip";
    MeasureUnit["Pixel"] = "pixel";
    MeasureUnit["Fraction"] = "fraction";
})(MeasureUnit = exports.MeasureUnit || (exports.MeasureUnit = {}));
var SizingMode;
(function (SizingMode) {
    SizingMode["WidthAndHeight"] = "widthAndHeight";
    SizingMode["WidthAndAspectRatio"] = "widthAndAspectRatio";
    SizingMode["HeightAndAspectRatio"] = "heightAndAspectRatio";
    SizingMode["ShorterDimensionAndAspectRatio"] = "shorterDimensionAndAspectRatio";
})(SizingMode = exports.SizingMode || (exports.SizingMode = {}));
var Orientation;
(function (Orientation) {
    Orientation["Unknown"] = "unknown";
    Orientation["Portrait"] = "portrait";
    Orientation["PortraitUpsideDown"] = "portraitUpsideDown";
    Orientation["LandscapeRight"] = "landscapeRight";
    Orientation["LandscapeLeft"] = "landscapeLeft";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
var Direction;
(function (Direction) {
    Direction["None"] = "none";
    Direction["Horizontal"] = "horizontal";
    Direction["LeftToRight"] = "leftToRight";
    Direction["RightToLeft"] = "rightToLeft";
    Direction["Vertical"] = "vertical";
    Direction["TopToBottom"] = "topToBottom";
    Direction["BottomToTop"] = "bottomToTop";
})(Direction = exports.Direction || (exports.Direction = {}));
var Anchor;
(function (Anchor) {
    Anchor["TopLeft"] = "topLeft";
    Anchor["TopCenter"] = "topCenter";
    Anchor["TopRight"] = "topRight";
    Anchor["CenterLeft"] = "centerLeft";
    Anchor["Center"] = "center";
    Anchor["CenterRight"] = "centerRight";
    Anchor["BottomLeft"] = "bottomLeft";
    Anchor["BottomCenter"] = "bottomCenter";
    Anchor["BottomRight"] = "bottomRight";
})(Anchor = exports.Anchor || (exports.Anchor = {}));
//# sourceMappingURL=CommonEnums.js.map