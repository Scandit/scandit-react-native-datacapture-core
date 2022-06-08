"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCaptureVersion = void 0;
var react_native_1 = require("react-native");
// tslint:disable-next-line:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var DataCaptureVersion = /** @class */ (function () {
    function DataCaptureVersion() {
    }
    Object.defineProperty(DataCaptureVersion, "pluginVersion", {
        get: function () {
            return '6.13.1';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataCaptureVersion, "sdkVersion", {
        get: function () {
            return NativeModule.Version;
        },
        enumerable: false,
        configurable: true
    });
    return DataCaptureVersion;
}());
exports.DataCaptureVersion = DataCaptureVersion;
//# sourceMappingURL=DataCaptureVersion.js.map