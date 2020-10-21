"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackProxy = void 0;
var react_native_1 = require("react-native");
// tslint:disable-next-line:variable-name
var NativeModule = react_native_1.NativeModules.ScanditDataCaptureCore;
var FeedbackProxy = /** @class */ (function () {
    function FeedbackProxy() {
    }
    FeedbackProxy.forFeedback = function (feedback) {
        var proxy = new FeedbackProxy();
        proxy.feedback = feedback;
        return proxy;
    };
    FeedbackProxy.prototype.emit = function () {
        return NativeModule.emitFeedback(JSON.stringify(this.feedback.toJSON()));
    };
    return FeedbackProxy;
}());
exports.FeedbackProxy = FeedbackProxy;
//# sourceMappingURL=FeedbackProxy.js.map