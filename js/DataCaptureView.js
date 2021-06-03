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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCaptureView = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var PrivateDataCaptureView_1 = require("./private/PrivateDataCaptureView");
var DataCaptureView = /** @class */ (function (_super) {
    __extends(DataCaptureView, _super);
    function DataCaptureView(props) {
        var _this = _super.call(this, props) || this;
        _this.view = PrivateDataCaptureView_1.PrivateDataCaptureView.forContext(_this.props.context);
        _this.view.viewComponent = _this;
        return _this;
    }
    Object.defineProperty(DataCaptureView.prototype, "scanAreaMargins", {
        get: function () {
            return this.view.scanAreaMargins;
        },
        set: function (newValue) {
            this.view.scanAreaMargins = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(DataCaptureView.prototype, "pointOfInterest", {
        get: function () {
            return this.view.pointOfInterest;
        },
        set: function (newValue) {
            this.view.pointOfInterest = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(DataCaptureView.prototype, "logoStyle", {
        get: function () {
            return this.view.logoStyle;
        },
        set: function (style) {
            this.view.logoStyle = style;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataCaptureView.prototype, "logoAnchor", {
        get: function () {
            return this.view.logoAnchor;
        },
        set: function (newValue) {
            this.view.logoAnchor = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(DataCaptureView.prototype, "logoOffset", {
        get: function () {
            return this.view.logoOffset;
        },
        set: function (newValue) {
            this.view.logoOffset = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(DataCaptureView.prototype, "focusGesture", {
        get: function () {
            return this.view.focusGesture;
        },
        set: function (newValue) {
            this.view.focusGesture = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(DataCaptureView.prototype, "zoomGesture", {
        get: function () {
            return this.view.zoomGesture;
        },
        set: function (newValue) {
            this.view.zoomGesture = newValue;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    DataCaptureView.prototype.addOverlay = function (overlay) {
        this.view.addOverlay(overlay);
    };
    ;
    DataCaptureView.prototype.removeOverlay = function (overlay) {
        this.view.removeOverlay(overlay);
    };
    ;
    DataCaptureView.prototype.addListener = function (listener) {
        this.view.addListener(listener);
    };
    ;
    DataCaptureView.prototype.removeListener = function (listener) {
        this.view.removeListener(listener);
    };
    ;
    DataCaptureView.prototype.viewPointForFramePoint = function (point) {
        return this.view.viewPointForFramePoint(point);
    };
    ;
    DataCaptureView.prototype.viewQuadrilateralForFrameQuadrilateral = function (quadrilateral) {
        return this.view.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
    };
    ;
    DataCaptureView.prototype.addControl = function (control) {
        return this.view.addControl(control);
    };
    DataCaptureView.prototype.removeControl = function (control) {
        return this.view.removeControl(control);
    };
    DataCaptureView.prototype.componentWillUnmount = function () {
        this.view.dispose();
    };
    DataCaptureView.prototype.render = function () {
        return react_1.default.createElement(RNTDataCaptureView, __assign({}, this.props));
    };
    return DataCaptureView;
}(react_1.default.Component));
exports.DataCaptureView = DataCaptureView;
// tslint:disable-next-line:variable-name
var RNTDataCaptureView = react_native_1.requireNativeComponent('RNTDataCaptureView', DataCaptureView);
//# sourceMappingURL=DataCaptureView.js.map