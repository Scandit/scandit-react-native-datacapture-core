"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContextStatus = /** @class */ (function () {
    function ContextStatus() {
    }
    ContextStatus.fromJSON = function (json) {
        var status = new ContextStatus();
        status._code = json.code;
        status._message = json.message;
        status._isValid = json.isValid;
        return status;
    };
    Object.defineProperty(ContextStatus.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextStatus.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContextStatus.prototype, "isValid", {
        get: function () {
            return this._isValid;
        },
        enumerable: true,
        configurable: true
    });
    return ContextStatus;
}());
exports.ContextStatus = ContextStatus;
//# sourceMappingURL=DataCaptureContext+Related.js.map