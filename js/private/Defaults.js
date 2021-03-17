"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defaults = void 0;
var react_native_1 = require("react-native");
var Common_1 = require("../Common");
var PrivateDataCaptureView_Related_1 = require("./PrivateDataCaptureView+Related");
// tslint:disable-next-line:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
// tslint:disable-next-line:variable-name
exports.Defaults = {
    Camera: {
        Settings: {
            preferredResolution: NativeModule.Defaults.Camera.Settings.preferredResolution,
            zoomFactor: NativeModule.Defaults.Camera.Settings.zoomFactor,
            focusRange: NativeModule.Defaults.Camera.Settings.focusRange,
            zoomGestureZoomFactor: NativeModule.Defaults.Camera.Settings.zoomGestureZoomFactor,
            focusGestureStrategy: NativeModule.Defaults.Camera.Settings.focusGestureStrategy,
        },
        defaultPosition: (NativeModule.Defaults.Camera.defaultPosition || null),
        availablePositions: NativeModule.Defaults.Camera.availablePositions,
    },
    DataCaptureView: {
        scanAreaMargins: Common_1.MarginsWithUnit
            .fromJSON(JSON.parse(NativeModule.Defaults.DataCaptureView.scanAreaMargins)),
        pointOfInterest: Common_1.PointWithUnit
            .fromJSON(JSON.parse(NativeModule.Defaults.DataCaptureView.pointOfInterest)),
        logoAnchor: NativeModule.Defaults.DataCaptureView.logoAnchor,
        logoOffset: Common_1.PointWithUnit
            .fromJSON(JSON.parse(NativeModule.Defaults.DataCaptureView.logoOffset)),
        focusGesture: PrivateDataCaptureView_Related_1.PrivateFocusGestureDeserializer
            .fromJSON(JSON.parse(NativeModule.Defaults.DataCaptureView.focusGesture)),
        zoomGesture: PrivateDataCaptureView_Related_1.PrivateFocusGestureDeserializer
            .fromJSON(JSON.parse(NativeModule.Defaults.DataCaptureView.zoomGesture)),
    },
    LaserlineViewfinder: {
        width: Common_1.NumberWithUnit
            .fromJSON(JSON.parse(NativeModule.Defaults.LaserlineViewfinder.width)),
        enabledColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.LaserlineViewfinder.enabledColor),
        disabledColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.LaserlineViewfinder.disabledColor),
    },
    RectangularViewfinder: {
        size: Common_1.SizeWithUnitAndAspect
            .fromJSON(JSON.parse(NativeModule.Defaults.RectangularViewfinder.size)),
        color: Common_1.Color
            .fromJSON(NativeModule.Defaults.RectangularViewfinder.color),
    },
    SpotlightViewfinder: {
        size: Common_1.SizeWithUnitAndAspect
            .fromJSON(JSON.parse(NativeModule.Defaults.SpotlightViewfinder.size)),
        enabledBorderColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.SpotlightViewfinder.enabledBorderColor),
        disabledBorderColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.SpotlightViewfinder.disabledBorderColor),
        backgroundColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.SpotlightViewfinder.backgroundColor),
    },
    AimerViewfinder: {
        frameColor: Common_1.Color.fromJSON(NativeModule.Defaults.AimerViewfinder.frameColor),
        dotColor: Common_1.Color.fromJSON(NativeModule.Defaults.AimerViewfinder.dotColor),
    },
    Brush: {
        fillColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.Brush.fillColor),
        strokeColor: Common_1.Color
            .fromJSON(NativeModule.Defaults.Brush.strokeColor),
        strokeWidth: NativeModule.Defaults.Brush.strokeWidth,
    },
    deviceID: NativeModule.Defaults.deviceID,
};
// Inject defaults to avoid a circular dependency between these classes and the defaults
Common_1.Brush.defaults = exports.Defaults.Brush;
//# sourceMappingURL=Defaults.js.map