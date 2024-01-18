"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameData = void 0;
var Camera_Related_1 = require("../Camera+Related");
var FrameData = /** @class */ (function () {
    function FrameData() {
    }
    Object.defineProperty(FrameData.prototype, "imageBuffers", {
        get: function () {
            return this._imageBuffers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FrameData.prototype, "orientation", {
        get: function () {
            return this._orientation;
        },
        enumerable: false,
        configurable: true
    });
    FrameData.fromJSON = function (json) {
        var frameData = new FrameData();
        frameData._imageBuffers = json.imageBuffers.map(function (imageBufferJSON) {
            var imageBuffer = new Camera_Related_1.ImageBuffer();
            imageBuffer._width = imageBufferJSON.width;
            imageBuffer._height = imageBufferJSON.height;
            imageBuffer._data = imageBufferJSON.data;
            return imageBuffer;
        });
        frameData._orientation = json.orientation;
        return frameData;
    };
    return FrameData;
}());
exports.FrameData = FrameData;
//# sourceMappingURL=PrivateCamera+Related.js.map