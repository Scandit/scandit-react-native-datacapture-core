"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSerializeable = exports.serializationDefault = exports.ignoreFromSerializationIfNull = exports.nameForSerialization = exports.ignoreFromSerialization = void 0;
function ignoreFromSerialization(target, propertyName) {
    target.ignoredProperties = target.ignoredProperties || [];
    target.ignoredProperties.push(propertyName);
}
exports.ignoreFromSerialization = ignoreFromSerialization;
function nameForSerialization(customName) {
    return function (target, propertyName) {
        target.customPropertyNames = target.customPropertyNames || {};
        target.customPropertyNames[propertyName] = customName;
    };
}
exports.nameForSerialization = nameForSerialization;
function ignoreFromSerializationIfNull(target, propertyName) {
    target.ignoredIfNullProperties = target.ignoredIfNullProperties || [];
    target.ignoredIfNullProperties.push(propertyName);
}
exports.ignoreFromSerializationIfNull = ignoreFromSerializationIfNull;
function serializationDefault(defaultValue) {
    return function (target, propertyName) {
        target.customPropertyDefaults = target.customPropertyDefaults || {};
        target.customPropertyDefaults[propertyName] = defaultValue;
    };
}
exports.serializationDefault = serializationDefault;
var DefaultSerializeable = /** @class */ (function () {
    function DefaultSerializeable() {
    }
    DefaultSerializeable.prototype.toJSON = function () {
        var _this = this;
        var properties = Object.keys(this);
        // use @ignoreFromSerialization to ignore properties
        var ignoredProperties = this.ignoredProperties || [];
        // use @ignoreFromSerializationIfNull to ignore properties if they're null
        var ignoredIfNullProperties = this.ignoredIfNullProperties || [];
        // use @nameForSerialization('customName') to rename properties in the JSON output
        var customPropertyNames = this.customPropertyNames || {};
        // use @serializationDefault({}) to use a different value in the JSON output if they're null
        var customPropertyDefaults = this.customPropertyDefaults || {};
        return properties.reduce(function (json, property) {
            if (ignoredProperties.includes(property)) {
                return json;
            }
            var value = _this[property];
            if (value === undefined) {
                return json;
            }
            // Ignore if it's null and should be ignored.
            // This is basically responsible for not including optional properties in the JSON if they're null,
            // as that's not always deserialized to mean the same as not present.
            if (value === null && ignoredIfNullProperties.includes(property)) {
                return json;
            }
            if (value === null && customPropertyDefaults[property] !== undefined) {
                value = customPropertyDefaults[property];
            }
            // Serialize if serializeable
            if (value != null && value.toJSON) {
                value = value.toJSON();
            }
            // Serialize the array if the elements are serializeable
            if (Array.isArray(value)) {
                value = value.map(function (e) { return e.toJSON ? e.toJSON() : e; });
            }
            var propertyName = customPropertyNames[property] || property;
            json[propertyName] = value;
            return json;
        }, {});
    };
    return DefaultSerializeable;
}());
exports.DefaultSerializeable = DefaultSerializeable;
//# sourceMappingURL=Serializeable.js.map