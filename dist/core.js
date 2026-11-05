function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var eventemitter3 = {exports: {}};

var hasRequiredEventemitter3;

function requireEventemitter3 () {
	if (hasRequiredEventemitter3) return eventemitter3.exports;
	hasRequiredEventemitter3 = 1;
	(function (module) {

		var has = Object.prototype.hasOwnProperty
		  , prefix = '~';

		/**
		 * Constructor to create a storage for our `EE` objects.
		 * An `Events` instance is a plain object whose properties are event names.
		 *
		 * @constructor
		 * @private
		 */
		function Events() {}

		//
		// We try to not inherit from `Object.prototype`. In some engines creating an
		// instance in this way is faster than calling `Object.create(null)` directly.
		// If `Object.create(null)` is not supported we prefix the event names with a
		// character to make sure that the built-in object properties are not
		// overridden or used as an attack vector.
		//
		if (Object.create) {
		  Events.prototype = Object.create(null);

		  //
		  // This hack is needed because the `__proto__` property is still inherited in
		  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
		  //
		  if (!new Events().__proto__) prefix = false;
		}

		/**
		 * Representation of a single event listener.
		 *
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
		 * @constructor
		 * @private
		 */
		function EE(fn, context, once) {
		  this.fn = fn;
		  this.context = context;
		  this.once = once || false;
		}

		/**
		 * Add a listener for a given event.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} once Specify if the listener is a one-time listener.
		 * @returns {EventEmitter}
		 * @private
		 */
		function addListener(emitter, event, fn, context, once) {
		  if (typeof fn !== 'function') {
		    throw new TypeError('The listener must be a function');
		  }

		  var listener = new EE(fn, context || emitter, once)
		    , evt = prefix ? prefix + event : event;

		  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		  else emitter._events[evt] = [emitter._events[evt], listener];

		  return emitter;
		}

		/**
		 * Clear event by name.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} evt The Event name.
		 * @private
		 */
		function clearEvent(emitter, evt) {
		  if (--emitter._eventsCount === 0) emitter._events = new Events();
		  else delete emitter._events[evt];
		}

		/**
		 * Minimal `EventEmitter` interface that is molded against the Node.js
		 * `EventEmitter` interface.
		 *
		 * @constructor
		 * @public
		 */
		function EventEmitter() {
		  this._events = new Events();
		  this._eventsCount = 0;
		}

		/**
		 * Return an array listing the events for which the emitter has registered
		 * listeners.
		 *
		 * @returns {Array}
		 * @public
		 */
		EventEmitter.prototype.eventNames = function eventNames() {
		  var names = []
		    , events
		    , name;

		  if (this._eventsCount === 0) return names;

		  for (name in (events = this._events)) {
		    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		  }

		  if (Object.getOwnPropertySymbols) {
		    return names.concat(Object.getOwnPropertySymbols(events));
		  }

		  return names;
		};

		/**
		 * Return the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Array} The registered listeners.
		 * @public
		 */
		EventEmitter.prototype.listeners = function listeners(event) {
		  var evt = prefix ? prefix + event : event
		    , handlers = this._events[evt];

		  if (!handlers) return [];
		  if (handlers.fn) return [handlers.fn];

		  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
		    ee[i] = handlers[i].fn;
		  }

		  return ee;
		};

		/**
		 * Return the number of listeners listening to a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Number} The number of listeners.
		 * @public
		 */
		EventEmitter.prototype.listenerCount = function listenerCount(event) {
		  var evt = prefix ? prefix + event : event
		    , listeners = this._events[evt];

		  if (!listeners) return 0;
		  if (listeners.fn) return 1;
		  return listeners.length;
		};

		/**
		 * Calls each of the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Boolean} `true` if the event had listeners, else `false`.
		 * @public
		 */
		EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return false;

		  var listeners = this._events[evt]
		    , len = arguments.length
		    , args
		    , i;

		  if (listeners.fn) {
		    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

		    switch (len) {
		      case 1: return listeners.fn.call(listeners.context), true;
		      case 2: return listeners.fn.call(listeners.context, a1), true;
		      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
		      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
		      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
		      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		    }

		    for (i = 1, args = new Array(len -1); i < len; i++) {
		      args[i - 1] = arguments[i];
		    }

		    listeners.fn.apply(listeners.context, args);
		  } else {
		    var length = listeners.length
		      , j;

		    for (i = 0; i < length; i++) {
		      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

		      switch (len) {
		        case 1: listeners[i].fn.call(listeners[i].context); break;
		        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
		        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
		        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
		        default:
		          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
		            args[j - 1] = arguments[j];
		          }

		          listeners[i].fn.apply(listeners[i].context, args);
		      }
		    }
		  }

		  return true;
		};

		/**
		 * Add a listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.on = function on(event, fn, context) {
		  return addListener(this, event, fn, context, false);
		};

		/**
		 * Add a one-time listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.once = function once(event, fn, context) {
		  return addListener(this, event, fn, context, true);
		};

		/**
		 * Remove the listeners of a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn Only remove the listeners that match this function.
		 * @param {*} context Only remove the listeners that have this context.
		 * @param {Boolean} once Only remove one-time listeners.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return this;
		  if (!fn) {
		    clearEvent(this, evt);
		    return this;
		  }

		  var listeners = this._events[evt];

		  if (listeners.fn) {
		    if (
		      listeners.fn === fn &&
		      (!once || listeners.once) &&
		      (!context || listeners.context === context)
		    ) {
		      clearEvent(this, evt);
		    }
		  } else {
		    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
		      if (
		        listeners[i].fn !== fn ||
		        (once && !listeners[i].once) ||
		        (context && listeners[i].context !== context)
		      ) {
		        events.push(listeners[i]);
		      }
		    }

		    //
		    // Reset the array, or remove it completely if we have no more listeners.
		    //
		    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
		    else clearEvent(this, evt);
		  }

		  return this;
		};

		/**
		 * Remove all listeners, or those of the specified event.
		 *
		 * @param {(String|Symbol)} [event] The event name.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		  var evt;

		  if (event) {
		    evt = prefix ? prefix + event : event;
		    if (this._events[evt]) clearEvent(this, evt);
		  } else {
		    this._events = new Events();
		    this._eventsCount = 0;
		  }

		  return this;
		};

		//
		// Alias methods names because people roll like that.
		//
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.addListener = EventEmitter.prototype.on;

		//
		// Expose the prefix.
		//
		EventEmitter.prefixed = prefix;

		//
		// Allow `EventEmitter` to be imported as module namespace.
		//
		EventEmitter.EventEmitter = EventEmitter;

		//
		// Expose the module.
		//
		{
		  module.exports = EventEmitter;
		} 
	} (eventemitter3));
	return eventemitter3.exports;
}

var eventemitter3Exports = requireEventemitter3();
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

class FactoryMaker {
    static bindInstance(clsName, instance) {
        FactoryMaker.instances.set(clsName, { instance });
    }
    static bindLazyInstance(clsName, builder) {
        FactoryMaker.instances.set(clsName, { builder });
    }
    static bindInstanceIfNotExists(clsName, instance) {
        if (FactoryMaker.instances.has(clsName)) {
            return;
        }
        FactoryMaker.instances.set(clsName, { instance });
    }
    static getInstance(clsName) {
        var _a;
        const item = FactoryMaker.instances.get(clsName);
        if (item === null || item === undefined) {
            throw new Error(`Trying to get a non existing instance for ${clsName}`);
        }
        if (!item.instance && item.builder) {
            item.instance = (_a = item.builder) === null || _a === void 0 ? void 0 : _a.call(item);
        }
        return item.instance;
    }
    static createInstance(clsName) {
        var _a;
        const item = FactoryMaker.instances.get(clsName);
        if (item === null || item === undefined) {
            throw new Error(`Trying to get a non existing instance for ${clsName}`);
        }
        const proxyInstance = (_a = item.builder) === null || _a === void 0 ? void 0 : _a.call(item);
        if (proxyInstance === undefined) {
            throw new Error(`item.builder?.() returned undefined for ${clsName}`);
        }
        return proxyInstance;
    }
}
FactoryMaker.instances = new Map();

let coreDefaultsLoader;
function setCoreDefaultsLoader(loader) {
    coreDefaultsLoader = loader;
}
function ensureCoreDefaults() {
    var _a, _b;
    const existing = (_a = FactoryMaker.instances.get('CoreDefaults')) === null || _a === void 0 ? void 0 : _a.instance;
    if (existing) {
        return existing;
    }
    coreDefaultsLoader === null || coreDefaultsLoader === void 0 ? void 0 : coreDefaultsLoader();
    const reloaded = (_b = FactoryMaker.instances.get('CoreDefaults')) === null || _b === void 0 ? void 0 : _b.instance;
    if (reloaded) {
        return reloaded;
    }
    throw new Error('CoreDefaults missing and re-init failed');
}
function getCoreDefaults() {
    return ensureCoreDefaults();
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function ignoreFromSerialization(target, propertyName) {
    target.ignoredProperties = target.ignoredProperties || [];
    target.ignoredProperties.push(propertyName);
}

function nameForSerialization(customName) {
    return (target, propertyName) => {
        target.customPropertyNames = target.customPropertyNames || {};
        target.customPropertyNames[propertyName] = customName;
    };
}

function ignoreFromSerializationIfNull(target, propertyName) {
    target.ignoredIfNullProperties = target.ignoredIfNullProperties || [];
    target.ignoredIfNullProperties.push(propertyName);
}

function serializationDefault(defaultValue) {
    return (target, propertyName) => {
        target.customPropertyDefaults = target.customPropertyDefaults || {};
        target.customPropertyDefaults[propertyName] = defaultValue;
    };
}

class DefaultSerializeable {
    toJSON() {
        const properties = Object.keys(this);
        // use @ignoreFromSerialization to ignore properties
        const ignoredProperties = this.ignoredProperties || [];
        // use @ignoreFromSerializationIfNull to ignore properties if they're null
        const ignoredIfNullProperties = this.ignoredIfNullProperties || [];
        // use @nameForSerialization('customName') to rename properties in the JSON output
        const customPropertyNames = this.customPropertyNames || {};
        // use @serializationDefault({}) to use a different value in the JSON output if they're null
        const customPropertyDefaults = this.customPropertyDefaults || {};
        return properties.reduce((json, property) => {
            if (ignoredProperties.includes(property)) {
                return json;
            }
            let value = this[property];
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
            // JSON.stringify turns a Set into {}; the wire format for a set is an array.
            if (value instanceof Set) {
                value = Array.from(value);
            }
            // Serialize the array if the elements are serializeable
            if (Array.isArray(value)) {
                value = value.map(e => (e.toJSON ? e.toJSON() : e));
            }
            const propertyName = customPropertyNames[property] || property;
            json[propertyName] = value;
            return json;
        }, {});
    }
}

class TapToFocus extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'tapToFocus';
        this.showUIIndicator = true;
        this.listeners = [];
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            const wasEmpty = this.listeners.length === 0;
            this.listeners.push(listener);
            if (wasEmpty && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    removeListener(listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
            if (this.listeners.length === 0 && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    triggerFocus(point) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._controller) {
                yield this._controller.triggerFocus(point);
            }
        });
    }
}
__decorate([
    nameForSerialization('showUIIndicator')
], TapToFocus.prototype, "showUIIndicator", void 0);
__decorate([
    ignoreFromSerialization
], TapToFocus.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], TapToFocus.prototype, "onListenersChanged", void 0);
__decorate([
    ignoreFromSerialization
], TapToFocus.prototype, "_controller", void 0);

class PrivateFocusGestureDeserializer {
    static fromJSON(json) {
        if (json && json.type === new TapToFocus()['type']) {
            return new TapToFocus();
        }
        else {
            return null;
        }
    }
}

class SwipeToZoom extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'swipeToZoom';
        this.listeners = [];
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            const wasEmpty = this.listeners.length === 0;
            this.listeners.push(listener);
            if (wasEmpty && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    removeListener(listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
            if (this.listeners.length === 0 && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    triggerZoomIn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._controller) {
                yield this._controller.triggerZoomIn();
            }
        });
    }
    triggerZoomOut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._controller) {
                yield this._controller.triggerZoomOut();
            }
        });
    }
}
__decorate([
    ignoreFromSerialization
], SwipeToZoom.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], SwipeToZoom.prototype, "onListenersChanged", void 0);
__decorate([
    ignoreFromSerialization
], SwipeToZoom.prototype, "_controller", void 0);

class PinchToZoom extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'pinchToZoom';
        this.listeners = [];
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            const wasEmpty = this.listeners.length === 0;
            this.listeners.push(listener);
            if (wasEmpty && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    removeListener(listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
            if (this.listeners.length === 0 && this.onListenersChanged) {
                this.onListenersChanged();
            }
        }
    }
    triggerZoomIn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._controller) {
                yield this._controller.triggerZoomIn();
            }
        });
    }
    triggerZoomOut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._controller) {
                yield this._controller.triggerZoomOut();
            }
        });
    }
}
__decorate([
    ignoreFromSerialization
], PinchToZoom.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], PinchToZoom.prototype, "onListenersChanged", void 0);
__decorate([
    ignoreFromSerialization
], PinchToZoom.prototype, "_controller", void 0);

class PrivateZoomGestureDeserializer {
    static fromJSON(json) {
        if (json && json.type === 'swipeToZoom') {
            return new SwipeToZoom();
        }
        else if (json && json.type === 'pinchToZoom') {
            return new PinchToZoom();
        }
        else {
            return null;
        }
    }
    static fromJSONArray(jsonArray) {
        return jsonArray
            .map(json => PrivateZoomGestureDeserializer.fromJSON(json))
            .filter((gesture) => gesture !== null);
    }
}

var FontFamily;
(function (FontFamily) {
    FontFamily["SystemDefault"] = "systemDefault";
    FontFamily["ModernMono"] = "modernMono";
    FontFamily["SystemSans"] = "systemSans";
})(FontFamily || (FontFamily = {}));

var TextAlignment;
(function (TextAlignment) {
    TextAlignment["Left"] = "left";
    TextAlignment["Right"] = "right";
    TextAlignment["Center"] = "center";
    TextAlignment["Start"] = "start";
    TextAlignment["End"] = "end";
})(TextAlignment || (TextAlignment = {}));

class Point extends DefaultSerializeable {
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    static fromJSON(json) {
        return new Point(json.x, json.y);
    }
    constructor(x, y) {
        super();
        this._x = x;
        this._y = y;
    }
}
__decorate([
    nameForSerialization('x')
], Point.prototype, "_x", void 0);
__decorate([
    nameForSerialization('y')
], Point.prototype, "_y", void 0);

class Quadrilateral extends DefaultSerializeable {
    get topLeft() {
        return this._topLeft;
    }
    get topRight() {
        return this._topRight;
    }
    get bottomRight() {
        return this._bottomRight;
    }
    get bottomLeft() {
        return this._bottomLeft;
    }
    static fromJSON(json) {
        return new Quadrilateral(Point.fromJSON(json.topLeft), Point.fromJSON(json.topRight), Point.fromJSON(json.bottomRight), Point.fromJSON(json.bottomLeft));
    }
    constructor(topLeft, topRight, bottomRight, bottomLeft) {
        super();
        this._topLeft = topLeft;
        this._topRight = topRight;
        this._bottomRight = bottomRight;
        this._bottomLeft = bottomLeft;
    }
}
__decorate([
    nameForSerialization('topLeft')
], Quadrilateral.prototype, "_topLeft", void 0);
__decorate([
    nameForSerialization('topRight')
], Quadrilateral.prototype, "_topRight", void 0);
__decorate([
    nameForSerialization('bottomRight')
], Quadrilateral.prototype, "_bottomRight", void 0);
__decorate([
    nameForSerialization('bottomLeft')
], Quadrilateral.prototype, "_bottomLeft", void 0);

class NumberWithUnit extends DefaultSerializeable {
    get value() {
        return this._value;
    }
    get unit() {
        return this._unit;
    }
    static fromJSON(json) {
        return new NumberWithUnit(json.value, json.unit);
    }
    constructor(value, unit) {
        super();
        this._value = value;
        this._unit = unit;
    }
}
__decorate([
    nameForSerialization('value')
], NumberWithUnit.prototype, "_value", void 0);
__decorate([
    nameForSerialization('unit')
], NumberWithUnit.prototype, "_unit", void 0);

var MeasureUnit;
(function (MeasureUnit) {
    MeasureUnit["DIP"] = "dip";
    MeasureUnit["Pixel"] = "pixel";
    MeasureUnit["Fraction"] = "fraction";
})(MeasureUnit || (MeasureUnit = {}));

class PointWithUnit extends DefaultSerializeable {
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    static fromJSON(json) {
        return new PointWithUnit(NumberWithUnit.fromJSON(json.x), NumberWithUnit.fromJSON(json.y));
    }
    static get zero() {
        return new PointWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
    }
    constructor(x, y) {
        super();
        this._x = x;
        this._y = y;
    }
}
__decorate([
    nameForSerialization('x')
], PointWithUnit.prototype, "_x", void 0);
__decorate([
    nameForSerialization('y')
], PointWithUnit.prototype, "_y", void 0);

class Rect extends DefaultSerializeable {
    get origin() {
        return this._origin;
    }
    get size() {
        return this._size;
    }
    constructor(origin, size) {
        super();
        this._origin = origin;
        this._size = size;
    }
}
__decorate([
    nameForSerialization('origin')
], Rect.prototype, "_origin", void 0);
__decorate([
    nameForSerialization('size')
], Rect.prototype, "_size", void 0);

class RectWithUnit extends DefaultSerializeable {
    get origin() {
        return this._origin;
    }
    get size() {
        return this._size;
    }
    constructor(origin, size) {
        super();
        this._origin = origin;
        this._size = size;
    }
}
__decorate([
    nameForSerialization('origin')
], RectWithUnit.prototype, "_origin", void 0);
__decorate([
    nameForSerialization('size')
], RectWithUnit.prototype, "_size", void 0);

class Color {
    get redComponent() {
        return this.hexadecimalString.slice(0, 2);
    }
    get greenComponent() {
        return this.hexadecimalString.slice(2, 4);
    }
    get blueComponent() {
        return this.hexadecimalString.slice(4, 6);
    }
    get alphaComponent() {
        return this.hexadecimalString.slice(6, 8);
    }
    get red() {
        return Color.hexToNumber(this.redComponent);
    }
    get green() {
        return Color.hexToNumber(this.greenComponent);
    }
    get blue() {
        return Color.hexToNumber(this.blueComponent);
    }
    get alpha() {
        return Color.hexToNumber(this.alphaComponent);
    }
    static fromHex(hex) {
        return new Color(Color.normalizeHex(hex));
    }
    static fromRGBA(red, green, blue, alpha = 1) {
        const hexString = [red, green, blue, this.normalizeAlpha(alpha)].reduce((hex, colorComponent) => hex + this.numberToHex(colorComponent), '');
        return new Color(hexString);
    }
    static hexToNumber(hex) {
        return parseInt(hex, 16);
    }
    static fromJSON(json) {
        return Color.fromHex(json);
    }
    static numberToHex(x) {
        x = Math.round(x);
        let hex = x.toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex.toUpperCase();
    }
    static normalizeHex(hex) {
        // remove leading #
        if (hex[0] === '#') {
            hex = hex.slice(1);
        }
        // double digits if single digit
        if (hex.length < 6) {
            hex = hex
                .split('')
                .map(s => s + s)
                .join('');
        }
        // add alpha if missing
        if (hex.length === 6) {
            hex = hex + 'FF';
        }
        return hex.toUpperCase();
    }
    static normalizeAlpha(alpha) {
        if (alpha > 0 && alpha <= 1) {
            return 255 * alpha;
        }
        return alpha;
    }
    constructor(hex) {
        this.hexadecimalString = hex;
    }
    withAlpha(alpha) {
        const newHex = this.hexadecimalString.slice(0, 6) + Color.numberToHex(Color.normalizeAlpha(alpha));
        return Color.fromHex(newHex);
    }
    toJSON() {
        return '#' + this.hexadecimalString;
    }
}

class ScanditIcon extends DefaultSerializeable {
    static fromJSON(json) {
        if (!json) {
            return null;
        }
        // SDC-33589: native sends the three colors as hex strings ('#FFFFFFFF'), so assigning them
        // through left a raw string sitting in a Color-typed field -- `.redComponent` was undefined
        // on it. Convert, as every other defaults parser in the module does. The round trip is
        // lossless: Color.fromJSON is fromHex and toJSON re-emits '#' + hexadecimalString.
        const scanditIcon = new ScanditIcon(ScanditIcon.colorFromJSON(json.iconColor), ScanditIcon.colorFromJSON(json.backgroundColor), json.backgroundShape || null, json.icon || null, ScanditIcon.colorFromJSON(json.backgroundStrokeColor), json.backgroundStrokeWidth);
        return scanditIcon;
    }
    // The wire value is a hex string despite ScanditIconJSON typing it as Color; tolerate an
    // already-converted Color so a caller passing a real instance is not mangled.
    static colorFromJSON(value) {
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            return Color['fromJSON'](value);
        }
        return value;
    }
    constructor(iconColor, backgroundColor, backgroundShape, icon, backgroundStrokeColor, backgroundStrokeWidth) {
        super();
        this._backgroundStrokeWidth = 3.0;
        this._iconColor = iconColor;
        this._backgroundColor = backgroundColor;
        this._backgroundShape = backgroundShape;
        this._icon = icon;
        this._backgroundStrokeColor = backgroundStrokeColor;
        this._backgroundStrokeWidth = backgroundStrokeWidth;
    }
    get backgroundColor() {
        return this._backgroundColor;
    }
    get backgroundShape() {
        return this._backgroundShape;
    }
    get icon() {
        return this._icon;
    }
    get iconColor() {
        return this._iconColor;
    }
    get backgroundStrokeColor() {
        return this._backgroundStrokeColor;
    }
    get backgroundStrokeWidth() {
        return this._backgroundStrokeWidth;
    }
}
__decorate([
    nameForSerialization('backgroundColor'),
    ignoreFromSerializationIfNull
], ScanditIcon.prototype, "_backgroundColor", void 0);
__decorate([
    nameForSerialization('backgroundShape'),
    ignoreFromSerializationIfNull
], ScanditIcon.prototype, "_backgroundShape", void 0);
__decorate([
    nameForSerialization('icon'),
    ignoreFromSerializationIfNull
], ScanditIcon.prototype, "_icon", void 0);
__decorate([
    nameForSerialization('iconColor'),
    ignoreFromSerializationIfNull
], ScanditIcon.prototype, "_iconColor", void 0);
__decorate([
    nameForSerialization('backgroundStrokeColor'),
    ignoreFromSerializationIfNull
], ScanditIcon.prototype, "_backgroundStrokeColor", void 0);
__decorate([
    nameForSerialization('backgroundStrokeWidth')
], ScanditIcon.prototype, "_backgroundStrokeWidth", void 0);

class ScanditIconBuilder {
    constructor() {
        this._iconColor = null;
        this._backgroundColor = null;
        this._backgroundShape = null;
        this._icon = null;
        this._backgroundStrokeColor = null;
        this._backgroundStrokeWidth = 3.0;
    }
    withIconColor(iconColor) {
        this._iconColor = iconColor;
        return this;
    }
    withBackgroundColor(backgroundColor) {
        this._backgroundColor = backgroundColor;
        return this;
    }
    withBackgroundShape(backgroundShape) {
        this._backgroundShape = backgroundShape;
        return this;
    }
    withIcon(iconType) {
        this._icon = iconType;
        return this;
    }
    withBackgroundStrokeColor(backgroundStrokeColor) {
        this._backgroundStrokeColor = backgroundStrokeColor;
        return this;
    }
    withBackgroundStrokeWidth(backgroundStrokeWidth) {
        this._backgroundStrokeWidth = backgroundStrokeWidth;
        return this;
    }
    build() {
        return new ScanditIcon(this._iconColor, this._backgroundColor, this._backgroundShape, this._icon, this._backgroundStrokeColor, this._backgroundStrokeWidth);
    }
}

var ScanditIconShape;
(function (ScanditIconShape) {
    ScanditIconShape["Circle"] = "circle";
    ScanditIconShape["Square"] = "square";
})(ScanditIconShape || (ScanditIconShape = {}));

var ScanditIconType;
(function (ScanditIconType) {
    ScanditIconType["ArrowRight"] = "arrowRight";
    ScanditIconType["ArrowLeft"] = "arrowLeft";
    ScanditIconType["ArrowUp"] = "arrowUp";
    ScanditIconType["ArrowDown"] = "arrowDown";
    ScanditIconType["ToPick"] = "toPick";
    ScanditIconType["Checkmark"] = "checkmark";
    ScanditIconType["XMark"] = "xMark";
    ScanditIconType["QuestionMark"] = "questionMark";
    ScanditIconType["ExclamationMark"] = "exclamationMark";
    ScanditIconType["LowStock"] = "lowStock";
    ScanditIconType["ExpiredItem"] = "expiredItem";
    ScanditIconType["WrongItem"] = "wrongItem";
    ScanditIconType["FragileItem"] = "fragileItem";
    ScanditIconType["StarFilled"] = "starFilled";
    ScanditIconType["StarHalfFilled"] = "starHalfFilled";
    ScanditIconType["ChevronUp"] = "chevronUp";
    ScanditIconType["ChevronDown"] = "chevronDown";
    ScanditIconType["ChevronLeft"] = "chevronLeft";
    ScanditIconType["ChevronRight"] = "chevronRight";
    ScanditIconType["InspectItem"] = "inspectItem";
    ScanditIconType["StarOutlined"] = "starOutlined";
    ScanditIconType["Print"] = "print";
    ScanditIconType["Plus"] = "plus";
    ScanditIconType["Minus"] = "minus";
    ScanditIconType["Delete"] = "delete";
    ScanditIconType["Slash"] = "slash";
})(ScanditIconType || (ScanditIconType = {}));

class Size extends DefaultSerializeable {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    static fromJSON(json) {
        return new Size(json.width, json.height);
    }
    constructor(width, height) {
        super();
        this._width = width;
        this._height = height;
    }
}
__decorate([
    nameForSerialization('width')
], Size.prototype, "_width", void 0);
__decorate([
    nameForSerialization('height')
], Size.prototype, "_height", void 0);

class SizeWithAspect extends DefaultSerializeable {
    get size() {
        return this._size;
    }
    get aspect() {
        return this._aspect;
    }
    constructor(size, aspect) {
        super();
        this._size = size;
        this._aspect = aspect;
    }
}
__decorate([
    nameForSerialization('size')
], SizeWithAspect.prototype, "_size", void 0);
__decorate([
    nameForSerialization('aspect')
], SizeWithAspect.prototype, "_aspect", void 0);

class SizeWithUnit extends DefaultSerializeable {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    constructor(width, height) {
        super();
        this._width = width;
        this._height = height;
    }
}
__decorate([
    nameForSerialization('width')
], SizeWithUnit.prototype, "_width", void 0);
__decorate([
    nameForSerialization('height')
], SizeWithUnit.prototype, "_height", void 0);

var SizingMode;
(function (SizingMode) {
    SizingMode["WidthAndHeight"] = "widthAndHeight";
    SizingMode["WidthAndAspectRatio"] = "widthAndAspectRatio";
    SizingMode["HeightAndAspectRatio"] = "heightAndAspectRatio";
    SizingMode["ShorterDimensionAndAspectRatio"] = "shorterDimensionAndAspectRatio";
})(SizingMode || (SizingMode = {}));

class SizeWithUnitAndAspect {
    constructor() {
        this._widthAndHeight = null;
        this._widthAndAspectRatio = null;
        this._heightAndAspectRatio = null;
        this._shorterDimensionAndAspectRatio = null;
    }
    get widthAndHeight() {
        return this._widthAndHeight;
    }
    get widthAndAspectRatio() {
        return this._widthAndAspectRatio;
    }
    get heightAndAspectRatio() {
        return this._heightAndAspectRatio;
    }
    get shorterDimensionAndAspectRatio() {
        return this._shorterDimensionAndAspectRatio;
    }
    get sizingMode() {
        if (this.widthAndAspectRatio) {
            return SizingMode.WidthAndAspectRatio;
        }
        if (this.heightAndAspectRatio) {
            return SizingMode.HeightAndAspectRatio;
        }
        if (this.shorterDimensionAndAspectRatio) {
            return SizingMode.ShorterDimensionAndAspectRatio;
        }
        return SizingMode.WidthAndHeight;
    }
    static sizeWithWidthAndHeight(widthAndHeight) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndHeight = widthAndHeight;
        return sizeWithUnitAndAspect;
    }
    static sizeWithWidthAndAspectRatio(width, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._widthAndAspectRatio = new SizeWithAspect(width, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static sizeWithHeightAndAspectRatio(height, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._heightAndAspectRatio = new SizeWithAspect(height, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static sizeWithShorterDimensionAndAspectRatio(shorterDimension, aspectRatio) {
        const sizeWithUnitAndAspect = new SizeWithUnitAndAspect();
        sizeWithUnitAndAspect._shorterDimensionAndAspectRatio = new SizeWithAspect(shorterDimension, aspectRatio);
        return sizeWithUnitAndAspect;
    }
    static fromJSON(json) {
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
            throw new Error(`SizeWithUnitAndAspectJSON is malformed: ${JSON.stringify(json)}`);
        }
    }
    toJSON() {
        switch (this.sizingMode) {
            case SizingMode.WidthAndAspectRatio:
                return {
                    width: this.widthAndAspectRatio.size.toJSON(),
                    aspect: this.widthAndAspectRatio.aspect,
                };
            case SizingMode.HeightAndAspectRatio:
                return {
                    height: this.heightAndAspectRatio.size.toJSON(),
                    aspect: this.heightAndAspectRatio.aspect,
                };
            case SizingMode.ShorterDimensionAndAspectRatio:
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
    }
}
__decorate([
    nameForSerialization('widthAndHeight')
], SizeWithUnitAndAspect.prototype, "_widthAndHeight", void 0);
__decorate([
    nameForSerialization('widthAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_widthAndAspectRatio", void 0);
__decorate([
    nameForSerialization('heightAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_heightAndAspectRatio", void 0);
__decorate([
    nameForSerialization('shorterDimensionAndAspectRatio')
], SizeWithUnitAndAspect.prototype, "_shorterDimensionAndAspectRatio", void 0);

class MarginsWithUnit extends DefaultSerializeable {
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
    get top() {
        return this._top;
    }
    get bottom() {
        return this._bottom;
    }
    static fromJSON(json) {
        return new MarginsWithUnit(NumberWithUnit.fromJSON(json.left), NumberWithUnit.fromJSON(json.right), NumberWithUnit.fromJSON(json.top), NumberWithUnit.fromJSON(json.bottom));
    }
    static get zero() {
        return new MarginsWithUnit(new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel), new NumberWithUnit(0, MeasureUnit.Pixel));
    }
    constructor(left, right, top, bottom) {
        super();
        this._left = left;
        this._right = right;
        this._top = top;
        this._bottom = bottom;
    }
}
__decorate([
    nameForSerialization('left')
], MarginsWithUnit.prototype, "_left", void 0);
__decorate([
    nameForSerialization('right')
], MarginsWithUnit.prototype, "_right", void 0);
__decorate([
    nameForSerialization('top')
], MarginsWithUnit.prototype, "_top", void 0);
__decorate([
    nameForSerialization('bottom')
], MarginsWithUnit.prototype, "_bottom", void 0);

class Brush extends DefaultSerializeable {
    static get transparent() {
        const transparentBlack = Color.fromRGBA(255, 255, 255, 0);
        return new Brush(transparentBlack, transparentBlack, 0);
    }
    get fillColor() {
        return this.fill.color;
    }
    get strokeColor() {
        return this.stroke.color;
    }
    get strokeWidth() {
        return this.stroke.width;
    }
    get copy() {
        return new Brush(this.fillColor, this.strokeColor, this.strokeWidth);
    }
    static fromJSON(brushJson) {
        return new Brush(Color.fromHex(brushJson.fillColor), Color.fromHex(brushJson.strokeColor), brushJson.strokeWidth);
    }
    constructor(fillColor = Brush.defaults.fillColor, strokeColor = Brush.defaults.strokeColor, strokeWidth = Brush.defaults.strokeWidth) {
        super();
        this.fill = { color: fillColor };
        this.stroke = { color: strokeColor, width: strokeWidth };
    }
}

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
})(Anchor || (Anchor = {}));

var Orientation;
(function (Orientation) {
    Orientation["Unknown"] = "unknown";
    Orientation["Portrait"] = "portrait";
    Orientation["PortraitUpsideDown"] = "portraitUpsideDown";
    Orientation["LandscapeRight"] = "landscapeRight";
    Orientation["LandscapeLeft"] = "landscapeLeft";
})(Orientation || (Orientation = {}));

var Direction;
(function (Direction) {
    Direction["None"] = "none";
    Direction["Horizontal"] = "horizontal";
    Direction["LeftToRight"] = "leftToRight";
    Direction["RightToLeft"] = "rightToLeft";
    Direction["Vertical"] = "vertical";
    Direction["TopToBottom"] = "topToBottom";
    Direction["BottomToTop"] = "bottomToTop";
})(Direction || (Direction = {}));

var ScanIntention;
(function (ScanIntention) {
    ScanIntention["Manual"] = "manual";
    ScanIntention["Smart"] = "smart";
    /**
     * @deprecated Use SelectionMode.Auto instead. Will be removed in 9.0.
     */
    ScanIntention["SmartSelection"] = "smartSelection";
})(ScanIntention || (ScanIntention = {}));

var SelectionMode;
(function (SelectionMode) {
    SelectionMode["Off"] = "off";
    SelectionMode["On"] = "on";
    SelectionMode["Auto"] = "auto";
})(SelectionMode || (SelectionMode = {}));

/**
 * Symbol returned by parseIfShouldHandle when an event should be skipped
 * (filtered out based on viewId/modeId mismatch).
 */
const SKIP = Symbol('EventDataParser.SKIP');
class EventDataParser {
    static parse(data) {
        if (data == null) {
            return null;
        }
        return JSON.parse(data);
    }
    /**
     * Check if an event should be handled based on viewId/modeId filtering.
     * Used by React Native new architecture for pre-parse filtering to avoid
     * unnecessary JSON parsing of events not intended for this consumer.
     *
     * @param ev The event payload to check
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns true if the event should be handled, false if it should be skipped
     */
    static shouldHandle(ev, ids) {
        // If event has no filter fields (old arch, Cordova, Capacitor), proceed to parse
        if (ev.viewId === undefined && ev.modeId === undefined) {
            return true;
        }
        // Check viewId match if both are specified
        if (ids.viewId !== undefined && ev.viewId !== undefined && ev.viewId !== ids.viewId) {
            return false;
        }
        // Check modeId match if both are specified
        if (ids.modeId !== undefined && ev.modeId !== undefined && ev.modeId !== ids.modeId) {
            return false;
        }
        return true;
    }
    /**
     * Parse event data if it should be handled, otherwise return SKIP.
     *
     * Filtering is performed in two stages:
     * 1. Pre-parse: if the event wrapper carries viewId/modeId, skip parsing entirely on mismatch.
     * 2. Post-parse: verify the parsed payload's viewId/modeId matches the expected ids.
     *
     * @param ev The event payload to check and parse
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns SKIP if filtered out, null if parse failed, or parsed data
     */
    static parseIfShouldHandle(ev, ids) {
        if (!this.shouldHandle(ev, ids)) {
            return SKIP;
        }
        const parsed = this.parse(ev.data);
        if (parsed === null) {
            return null;
        }
        const data = parsed;
        if (ids.modeId !== undefined && data.modeId !== undefined && data.modeId !== ids.modeId) {
            return SKIP;
        }
        if (ids.viewId !== undefined && data.viewId !== undefined && data.viewId !== ids.viewId) {
            return SKIP;
        }
        return parsed;
    }
}

class Observable extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.listeners = [];
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    notifyListeners(property, value) {
        this.listeners.forEach(listener => listener(property, value));
    }
}
__decorate([
    ignoreFromSerialization
], Observable.prototype, "listeners", void 0);

class HtmlElementPosition {
    constructor(top, left) {
        this.top = 0;
        this.left = 0;
        this.top = top;
        this.left = left;
    }
    didChangeComparedTo(other) {
        if (!other)
            return true;
        return this.top !== other.top || this.left !== other.left;
    }
}
class HtmlElementSize {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    didChangeComparedTo(other) {
        if (!other)
            return true;
        return this.width !== other.width || this.height !== other.height;
    }
}
class HTMLElementState {
    constructor() {
        this.isShown = false;
        this.position = null;
        this.size = null;
        this.shouldBeUnderContent = false;
    }
    get isValid() {
        return (this.isShown !== undefined &&
            this.isShown !== null &&
            this.position !== undefined &&
            this.position !== null &&
            this.size !== undefined &&
            this.size !== null &&
            this.shouldBeUnderContent !== undefined &&
            this.shouldBeUnderContent !== null);
    }
    didChangeComparedTo(other) {
        var _a, _b, _c, _d;
        if (!other)
            return true;
        const positionChanged = (_b = (_a = this.position) === null || _a === void 0 ? void 0 : _a.didChangeComparedTo(other.position)) !== null && _b !== void 0 ? _b : this.position !== other.position;
        const sizeChanged = (_d = (_c = this.size) === null || _c === void 0 ? void 0 : _c.didChangeComparedTo(other.size)) !== null && _d !== void 0 ? _d : this.size !== other.size;
        return positionChanged || sizeChanged || this.shouldBeUnderContent !== other.shouldBeUnderContent;
    }
}

class RectangularViewfinderAnimation extends DefaultSerializeable {
    static fromJSON(json) {
        if (json === null) {
            return null;
        }
        return new RectangularViewfinderAnimation(json.looping);
    }
    get isLooping() {
        return this._isLooping;
    }
    constructor(isLooping) {
        super();
        this._isLooping = false;
        this._isLooping = isLooping;
    }
}
__decorate([
    nameForSerialization('isLooping')
], RectangularViewfinderAnimation.prototype, "_isLooping", void 0);

// Capacitor returns nested values as already-parsed objects; other bridges (Cordova, RN) return JSON strings.
function parseOrUse(value) {
    return typeof value === 'string' ? JSON.parse(value) : value;
}
function parseDefaults(jsonDefaults) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const coreDefaults = {
        Camera: {
            Settings: {
                preferredResolution: jsonDefaults.Camera.Settings.preferredResolution,
                zoomFactor: jsonDefaults.Camera.Settings.zoomFactor,
                focusRange: jsonDefaults.Camera.Settings.focusRange,
                zoomGestureZoomFactor: jsonDefaults.Camera.Settings.zoomGestureZoomFactor,
                zoomLevels: (_a = jsonDefaults.Camera.Settings.zoomLevels) !== null && _a !== void 0 ? _a : [1, 2],
                focusGestureStrategy: jsonDefaults.Camera.Settings.focusGestureStrategy,
                shouldPreferSmoothAutoFocus: jsonDefaults.Camera.Settings.shouldPreferSmoothAutoFocus,
                torchLevel: (_b = jsonDefaults.Camera.Settings.torchLevel) !== null && _b !== void 0 ? _b : 1.0,
                macroMode: ((_c = jsonDefaults.Camera.Settings.macroMode) !== null && _c !== void 0 ? _c : 'auto'),
                adaptiveExposure: (_d = jsonDefaults.Camera.Settings.adaptiveExposure) !== null && _d !== void 0 ? _d : false,
                manualLensPosition: (_e = jsonDefaults.Camera.Settings.manualLensPosition) !== null && _e !== void 0 ? _e : 0,
                focusStrategy: (_f = jsonDefaults.Camera.Settings.focusStrategy) !== null && _f !== void 0 ? _f : 'auto',
                properties: jsonDefaults.Camera.Settings.properties,
            },
            defaultPosition: (jsonDefaults.Camera.defaultPosition || null),
            availablePositions: jsonDefaults.Camera.availablePositions,
        },
        ZoomSwitchControl: {
            orientation: ((_h = (_g = jsonDefaults.ZoomSwitchControl) === null || _g === void 0 ? void 0 : _g.orientation) !== null && _h !== void 0 ? _h : 'horizontal'),
            isAlwaysExpanded: (_k = (_j = jsonDefaults.ZoomSwitchControl) === null || _j === void 0 ? void 0 : _j.isAlwaysExpanded) !== null && _k !== void 0 ? _k : false,
            isExpanded: (_m = (_l = jsonDefaults.ZoomSwitchControl) === null || _l === void 0 ? void 0 : _l.isExpanded) !== null && _m !== void 0 ? _m : false,
            accessibilityLabel: (_p = (_o = jsonDefaults.ZoomSwitchControl) === null || _o === void 0 ? void 0 : _o.accessibilityLabel) !== null && _p !== void 0 ? _p : 'Zoom <level>',
            accessibilityHint: (_r = (_q = jsonDefaults.ZoomSwitchControl) === null || _q === void 0 ? void 0 : _q.accessibilityHint) !== null && _r !== void 0 ? _r : 'Adjusts the camera zoom level',
        },
        DataCaptureView: {
            scanAreaMargins: MarginsWithUnit['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.scanAreaMargins)),
            pointOfInterest: PointWithUnit['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.pointOfInterest)),
            logoAnchor: jsonDefaults.DataCaptureView.logoAnchor,
            logoOffset: PointWithUnit['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.logoOffset)),
            focusGesture: PrivateFocusGestureDeserializer['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.focusGesture)),
            zoomGesture: PrivateZoomGestureDeserializer['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.zoomGesture)),
            zoomGestures: jsonDefaults.DataCaptureView.zoomGestures
                ? PrivateZoomGestureDeserializer['fromJSONArray'](parseOrUse(jsonDefaults.DataCaptureView.zoomGestures).map(parseOrUse))
                : PrivateZoomGestureDeserializer['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.zoomGesture)) != null
                    ? [PrivateZoomGestureDeserializer['fromJSON'](parseOrUse(jsonDefaults.DataCaptureView.zoomGesture))]
                    : [],
            logoStyle: jsonDefaults.DataCaptureView.logoStyle,
            shouldShowZoomNotification: jsonDefaults.DataCaptureView.shouldShowZoomNotification,
        },
        RectangularViewfinder: Object.keys(jsonDefaults.RectangularViewfinder.styles).reduce((acc, key) => {
            const viewfinder = jsonDefaults.RectangularViewfinder.styles[key];
            acc.styles[key] = {
                size: SizeWithUnitAndAspect['fromJSON'](parseOrUse(viewfinder.size)),
                color: Color['fromJSON'](viewfinder.color),
                disabledColor: Color['fromJSON'](viewfinder.disabledColor),
                style: viewfinder.style,
                lineStyle: viewfinder.lineStyle,
                dimming: viewfinder.dimming,
                disabledDimming: viewfinder.disabledDimming,
                animation: RectangularViewfinderAnimation['fromJSON'](parseOrUse(viewfinder.animation)),
            };
            return acc;
        }, { defaultStyle: jsonDefaults.RectangularViewfinder.defaultStyle, styles: {} }),
        AimerViewfinder: {
            frameColor: Color['fromJSON'](jsonDefaults.AimerViewfinder.frameColor),
            dotColor: Color['fromJSON'](jsonDefaults.AimerViewfinder.dotColor),
        },
        Brush: new Brush(Color['fromJSON'](jsonDefaults.Brush.fillColor), Color['fromJSON'](jsonDefaults.Brush.strokeColor), jsonDefaults.Brush.strokeWidth),
        LaserlineViewfinder: {
            width: NumberWithUnit['fromJSON'](parseOrUse(jsonDefaults.LaserlineViewfinder.width)),
            enabledColor: Color['fromJSON'](jsonDefaults.LaserlineViewfinder.enabledColor),
            disabledColor: Color['fromJSON'](jsonDefaults.LaserlineViewfinder.disabledColor),
        },
        deviceID: jsonDefaults.deviceID,
        Version: (_s = jsonDefaults.Version) !== null && _s !== void 0 ? _s : null,
    };
    // Inject defaults to avoid a circular dependency between these classes and the defaults
    Brush['defaults'] = coreDefaults.Brush;
    return coreDefaults;
}
function loadCoreDefaults(jsonDefaults) {
    const coreDefaults = parseDefaults(jsonDefaults);
    FactoryMaker.bindInstanceIfNotExists('CoreDefaults', coreDefaults);
}

/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */
// THIS FILE IS GENERATED by scripts/defaults_generator/generate.py from
// scripts/defaults_generator/defaults/core.json. Do not edit by hand.
const CameraSettingsGeneratedDefaults = {
    preferredResolution: 'fullHd',
    zoomFactor: 1.0,
    focusRangeAndroid: 'full',
    focusRangeIos: 'near',
    focusGestureStrategy: 'manualUntilCapture',
    zoomGestureZoomFactor: 2.0,
    shouldPreferSmoothAutoFocus: false,
    torchLevel: 1.0,
    macroMode: 'auto',
    adaptiveExposure: false,
    zoomLevels: [1.0, 2.0],
    propertiesMinFrameRate: 15.0,
    propertiesColorCorrection: true,
    propertiesEdgeEnhancementMode: 'off',
    propertiesToneMappingCurve: 'none',
    propertiesNoiseReductionMode: 'off',
    propertiesPreferredAspectRatio: 'auto',
    propertiesExposureTargetBias: 0.0,
    propertiesApi: 0,
    propertiesRegionStrategy: 'default',
    propertiesFocusStrategy: 'auto',
    propertiesOverwriteWithHighestResolution: false,
};
const DataCaptureViewGeneratedDefaults = {
    scanAreaMargins: { "left": { "value": 0, "unit": 'fraction' }, "top": { "value": 0, "unit": 'fraction' }, "right": { "value": 0, "unit": 'fraction' }, "bottom": { "value": 0, "unit": 'fraction' } },
    pointOfInterest: { "x": { "value": 0.5, "unit": 'fraction' }, "y": { "value": 0.5, "unit": 'fraction' } },
    logoAnchor: 'bottomRight',
    logoOffset: { "x": { "value": 0, "unit": 'fraction' }, "y": { "value": 0, "unit": 'fraction' } },
    focusGesture: { "type": 'tapToFocus', "showUIIndicator": true },
    zoomGesture: { "type": 'swipeToZoom' },
    zoomGestures: [{ "type": 'swipeToZoom' }, { "type": 'pinchToZoom' }],
    logoStyle: 'extended',
    shouldShowZoomNotification: true,
};
const RectangularViewfinderGeneratedDefaults = {
    defaultStyle: 'rounded',
    stylesRoundedSize: { "shorterDimension": { "unit": 'fraction', "value": 0.75 }, "aspect": 1.0 },
    stylesRoundedColor: '#FFFFFFFF',
    stylesRoundedStyle: 'rounded',
    stylesRoundedLineStyle: 'light',
    stylesRoundedDimming: 0.0,
    stylesRoundedAnimation: { "looping": true },
    stylesRoundedDisabledDimming: 0.0,
    stylesRoundedDisabledColor: '#00000000',
    stylesSquareSize: { "shorterDimension": { "unit": 'fraction', "value": 0.75 }, "aspect": 1.0 },
    stylesSquareColor: '#FFFFFFFF',
    stylesSquareStyle: 'square',
    stylesSquareLineStyle: 'light',
    stylesSquareDimming: 0.0,
    stylesSquareAnimation: { "looping": true },
    stylesSquareDisabledDimming: 0.0,
    stylesSquareDisabledColor: '#00000000',
};
const BrushGeneratedDefaults = {
    fillColor: '#00000000',
    strokeColor: '#00000000',
    strokeWidth: 0.0,
};
const AimerViewfinderGeneratedDefaults = {
    frameColor: '#FFFFFFFF',
    dotColor: '#FFFFFFCC',
};
const ZoomSwitchControlGeneratedDefaults = {
    orientation: 'default',
    isAlwaysExpanded: false,
    isExpanded: false,
    accessibilityHint: 'Adjusts the camera zoom level',
};
const LaserlineViewfinderGeneratedDefaults = {
    width: { "unit": 'fraction', "value": 0.8 },
    enabledColor: '#FFFFFFFF',
    disabledColor: '#00000000',
};

// Not exported from generated/index.ts's public surface, but used directly here to assemble the
// nested JSON shape expected by parseDefaults.
function platformDefault(android, ios, platform) {
    return platform === 'ios' ? ios : android;
}
/**
 * Assembles the nested JSON shape that parseDefaults (loadCoreDefaults.ts) expects, out of the flat
 * generated defaults, restricted to the keys that are knowable statically at build time.
 *
 * Excluded (genuinely dynamic, native-only) keys, mirroring CoreDefaults.getDynamic() on
 * Android:
 * - Version
 * - deviceID
 * - Camera.defaultPosition
 * - Camera.availablePositions
 * - ZoomSwitchControl.accessibilityLabel
 */
function buildStaticCoreDefaultsJson(platform) {
    return {
        Camera: {
            Settings: {
                preferredResolution: CameraSettingsGeneratedDefaults.preferredResolution,
                zoomFactor: CameraSettingsGeneratedDefaults.zoomFactor,
                focusRange: platformDefault(CameraSettingsGeneratedDefaults.focusRangeAndroid, CameraSettingsGeneratedDefaults.focusRangeIos, platform),
                zoomGestureZoomFactor: CameraSettingsGeneratedDefaults.zoomGestureZoomFactor,
                focusGestureStrategy: CameraSettingsGeneratedDefaults.focusGestureStrategy,
                shouldPreferSmoothAutoFocus: CameraSettingsGeneratedDefaults.shouldPreferSmoothAutoFocus,
                torchLevel: CameraSettingsGeneratedDefaults.torchLevel,
                macroMode: CameraSettingsGeneratedDefaults.macroMode,
                adaptiveExposure: CameraSettingsGeneratedDefaults.adaptiveExposure,
                zoomLevels: CameraSettingsGeneratedDefaults.zoomLevels,
                properties: {
                    minFrameRate: CameraSettingsGeneratedDefaults.propertiesMinFrameRate,
                    colorCorrection: CameraSettingsGeneratedDefaults.propertiesColorCorrection,
                    edgeEnhancementMode: CameraSettingsGeneratedDefaults.propertiesEdgeEnhancementMode,
                    toneMappingCurve: CameraSettingsGeneratedDefaults.propertiesToneMappingCurve,
                    noiseReductionMode: CameraSettingsGeneratedDefaults.propertiesNoiseReductionMode,
                    preferredAspectRatio: CameraSettingsGeneratedDefaults.propertiesPreferredAspectRatio,
                    overwriteWithHighestResolution: CameraSettingsGeneratedDefaults.propertiesOverwriteWithHighestResolution,
                    exposureTargetBias: CameraSettingsGeneratedDefaults.propertiesExposureTargetBias,
                    regionStrategy: CameraSettingsGeneratedDefaults.propertiesRegionStrategy,
                    focusStrategy: CameraSettingsGeneratedDefaults.propertiesFocusStrategy,
                    api: CameraSettingsGeneratedDefaults.propertiesApi,
                },
            },
            // defaultPosition / availablePositions are dynamic (device-probed); not staticized.
        },
        ZoomSwitchControl: {
            orientation: ZoomSwitchControlGeneratedDefaults.orientation,
            isAlwaysExpanded: ZoomSwitchControlGeneratedDefaults.isAlwaysExpanded,
            isExpanded: ZoomSwitchControlGeneratedDefaults.isExpanded,
            accessibilityHint: ZoomSwitchControlGeneratedDefaults.accessibilityHint,
            // accessibilityLabel is dynamic (localized); not staticized.
        },
        DataCaptureView: {
            scanAreaMargins: DataCaptureViewGeneratedDefaults.scanAreaMargins,
            pointOfInterest: DataCaptureViewGeneratedDefaults.pointOfInterest,
            logoAnchor: DataCaptureViewGeneratedDefaults.logoAnchor,
            logoOffset: DataCaptureViewGeneratedDefaults.logoOffset,
            focusGesture: DataCaptureViewGeneratedDefaults.focusGesture,
            zoomGesture: DataCaptureViewGeneratedDefaults.zoomGesture,
            zoomGestures: DataCaptureViewGeneratedDefaults.zoomGestures,
            logoStyle: DataCaptureViewGeneratedDefaults.logoStyle,
            shouldShowZoomNotification: DataCaptureViewGeneratedDefaults.shouldShowZoomNotification,
        },
        RectangularViewfinder: {
            defaultStyle: RectangularViewfinderGeneratedDefaults.defaultStyle,
            styles: {
                rounded: {
                    size: RectangularViewfinderGeneratedDefaults.stylesRoundedSize,
                    color: RectangularViewfinderGeneratedDefaults.stylesRoundedColor,
                    style: RectangularViewfinderGeneratedDefaults.stylesRoundedStyle,
                    lineStyle: RectangularViewfinderGeneratedDefaults.stylesRoundedLineStyle,
                    dimming: RectangularViewfinderGeneratedDefaults.stylesRoundedDimming,
                    animation: RectangularViewfinderGeneratedDefaults.stylesRoundedAnimation,
                    disabledDimming: RectangularViewfinderGeneratedDefaults.stylesRoundedDisabledDimming,
                    disabledColor: RectangularViewfinderGeneratedDefaults.stylesRoundedDisabledColor,
                },
                square: {
                    size: RectangularViewfinderGeneratedDefaults.stylesSquareSize,
                    color: RectangularViewfinderGeneratedDefaults.stylesSquareColor,
                    style: RectangularViewfinderGeneratedDefaults.stylesSquareStyle,
                    lineStyle: RectangularViewfinderGeneratedDefaults.stylesSquareLineStyle,
                    dimming: RectangularViewfinderGeneratedDefaults.stylesSquareDimming,
                    animation: RectangularViewfinderGeneratedDefaults.stylesSquareAnimation,
                    disabledDimming: RectangularViewfinderGeneratedDefaults.stylesSquareDisabledDimming,
                    disabledColor: RectangularViewfinderGeneratedDefaults.stylesSquareDisabledColor,
                },
            },
        },
        AimerViewfinder: {
            frameColor: AimerViewfinderGeneratedDefaults.frameColor,
            dotColor: AimerViewfinderGeneratedDefaults.dotColor,
        },
        LaserlineViewfinder: {
            width: LaserlineViewfinderGeneratedDefaults.width,
            enabledColor: LaserlineViewfinderGeneratedDefaults.enabledColor,
            disabledColor: LaserlineViewfinderGeneratedDefaults.disabledColor,
        },
        Brush: {
            fillColor: BrushGeneratedDefaults.fillColor,
            strokeColor: BrushGeneratedDefaults.strokeColor,
            strokeWidth: BrushGeneratedDefaults.strokeWidth,
        },
        // Version, deviceID are dynamic (native-only); not staticized.
    };
}

var LogCategory;
(function (LogCategory) {
    LogCategory[LogCategory["Bridge"] = 1] = "Bridge";
    LogCategory[LogCategory["Lifecycle"] = 2] = "Lifecycle";
    LogCategory[LogCategory["Listener"] = 4] = "Listener";
    LogCategory[LogCategory["Events"] = 8] = "Events";
})(LogCategory || (LogCategory = {}));
const NAMES$1 = {
    [LogCategory.Bridge]: 'Bridge',
    [LogCategory.Lifecycle]: 'Lifecycle',
    [LogCategory.Listener]: 'Listener',
    [LogCategory.Events]: 'Events',
};
function logCategoryName(category) {
    var _a;
    return (_a = NAMES$1[category]) !== null && _a !== void 0 ? _a : 'Unknown';
}

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Off"] = 0] = "Off";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Debug"] = 4] = "Debug";
    LogLevel[LogLevel["Trace"] = 5] = "Trace";
})(LogLevel || (LogLevel = {}));
const NAMES = {
    [LogLevel.Off]: 'OFF  ',
    [LogLevel.Error]: 'ERROR',
    [LogLevel.Warn]: 'WARN ',
    [LogLevel.Info]: 'INFO ',
    [LogLevel.Debug]: 'DEBUG',
    [LogLevel.Trace]: 'TRACE',
};
function logLevelName(level) {
    var _a;
    return (_a = NAMES[level]) !== null && _a !== void 0 ? _a : 'UNK  ';
}

/**
 * Issue a raw `executeCore` bridge call from inside the logging module.
 *
 * `BaseProxy` does not declare `_call` — it is implementation detail of the
 * concrete `NativeProxy` — but the logging module has to reach it directly:
 * its methods are deliberately kept out of the generated command schema, so
 * there are no generated proxy wrappers to call instead. This centralises the
 * one cast that fact requires, rather than repeating it per call site.
 */
function callCore(proxy, args) {
    return proxy._call('executeCore', args);
}

// FactoryMaker throws until the framework has bound its proxies.
function coreProxy() {
    try {
        return FactoryMaker.getInstance('CoreProxy');
    }
    catch (_a) {
        return undefined;
    }
}
// getCoreDefaults() throws until a DataCaptureContext has loaded them.
function sdkVersion() {
    var _a;
    try {
        return (_a = getCoreDefaults().Version) !== null && _a !== void 0 ? _a : 'unknown';
    }
    catch (_b) {
        return 'unknown';
    }
}
function serializeLogRecord(record) {
    return JSON.stringify(Object.assign(Object.assign({}, record), { time: new Date(record.ts).toISOString(), level: logLevelName(record.level).trim(), category: logCategoryName(record.category) }));
}
function buildLogHeader(level, now = new Date()) {
    return JSON.stringify({
        type: 'scandit-debug-log',
        formatVersion: 2,
        sdkVersion: sdkVersion(),
        exportedAt: now.toISOString(),
        level: logLevelName(level).trim(),
    });
}
function writeLogs(path, level, flushPending) {
    return __awaiter(this, void 0, void 0, function* () {
        const proxy = coreProxy();
        if (proxy === undefined) {
            throw new Error('ScanditLogger.writeLogs: the SDK is not initialised yet');
        }
        yield flushPending();
        const result = yield callCore(proxy, Object.assign(Object.assign({ moduleName: 'CoreModule', methodName: 'writeLogs', isEventRegistration: false }, (path === undefined ? {} : { path })), { header: buildLogHeader(level) }));
        // Every FrameworksResult implementation wraps a non-map success value as `{ data: <string> }`.
        const written = result === null || result === void 0 ? void 0 : result.data;
        if (typeof written !== 'string' || written.length === 0) {
            throw new Error('ScanditLogger.writeLogs: the native side did not report where the file was written');
        }
        return written;
    });
}

const BUFFER_SIZE = 1000;
const NATIVE_QUEUE_CAP = 1000;
const REDACTED = '[redacted]';
const REDACTED_ARG_KEYS = Object.freeze([
    'frameData',
    'viewBytes',
    'licenseKey',
    'deviceName',
    'externalId',
    'deviceOS',
    'deviceModelName',
    'deviceId',
    'barcodeResult',
    'mrzResult',
    'vizResult',
    'mobileDocumentResult',
    'mobileDocumentOcrResult',
    'verificationResult',
    'nfcResult',
    'imageInfo',
    'firstName',
    'lastName',
    'fullName',
    'sex',
    'dateOfBirth',
    'nationality',
    'nationalityISO',
    'address',
    'documentNumber',
    'documentAdditionalNumber',
    'passportNumber',
    'visaNumber',
    'dateOfExpiry',
    'dateOfIssue',
    'age',
    'frontReviewImage',
]);
// Log-storage calls carry headers and record batches, never worth storing as a record's args.
const REDACTED_ARG_METHODS = Object.freeze([
    'parseString',
    'parseRawData',
    'writeLogs',
    'appendLogs',
    'clearLogs',
]);
class ScanditLogger {
    /**
     * Merge per-method log metadata into the global registry. Called as a
     * module-load side effect by each platform package's generated
     * `LogMetadata.ts` barrel. Last write wins for duplicate keys.
     */
    static registerMethodMetadata(metadata) {
        for (const [key, value] of Object.entries(metadata)) {
            ScanditLogger._methodMetadata.set(key, value);
        }
    }
    /** Lookup the metadata for a given native method name, if any. */
    static getMethodMetadata(methodName) {
        return ScanditLogger._methodMetadata.get(methodName);
    }
    static _redactValue(value) {
        if (value == null)
            return value;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (trimmed.length === 0 || (trimmed[0] !== '{' && trimmed[0] !== '[')) {
                return value;
            }
            try {
                const parsed = JSON.parse(trimmed);
                return JSON.stringify(ScanditLogger._redactValue(parsed));
            }
            catch (_a) {
                return value;
            }
        }
        if (Array.isArray(value)) {
            return value.map(v => ScanditLogger._redactValue(v));
        }
        if (typeof value === 'object') {
            const out = {};
            for (const [k, v] of Object.entries(value)) {
                out[k] = ScanditLogger._redactedArgKeys.has(k) ? REDACTED : ScanditLogger._redactValue(v);
            }
            return out;
        }
        return value;
    }
    static _applyArgPolicy(message, fields) {
        if (fields === undefined || !('args' in fields))
            return fields;
        const { args } = fields, rest = __rest(fields, ["args"]);
        const redacted = ScanditLogger._isRedactedArgMethod(message)
            ? ScanditLogger._redactEveryValue(args)
            : ScanditLogger._redactValue(args);
        return Object.assign(Object.assign({}, rest), { args: redacted });
    }
    static _isRedactedArgMethod(message) {
        const method = message.slice(message.lastIndexOf('.') + 1).replace(/^\$+/, '');
        return REDACTED_ARG_METHODS.includes(method);
    }
    static _redactEveryValue(args) {
        if (Array.isArray(args))
            return args.map(() => REDACTED);
        if (args !== null && typeof args === 'object') {
            const out = {};
            for (const key of Object.keys(args))
                out[key] = REDACTED;
            return out;
        }
        return REDACTED;
    }
    static _applyErrorPolicy(error) {
        if (error === undefined || error.stack === undefined)
            return error;
        const rest = __rest(error, ["stack"]);
        return rest;
    }
    static setLevel(level) {
        ScanditLogger._level = level;
        ScanditLogger._emitConfig();
    }
    static getLevel() {
        return ScanditLogger._level;
    }
    /**
     * Subscribe to configuration changes (`setLevel`). The callback fires immediately with the current
     * configuration when attached, then again on every subsequent change.
     * Returns an unsubscribe function.
     *
     * Used by `installNativeLogReceiver` to push the JS-side config to the
     * native singletons over the bridge. Not part of the customer-facing API.
     */
    static onConfigChange(cb) {
        ScanditLogger._configListeners.add(cb);
        try {
            cb({ level: ScanditLogger._level });
        }
        catch (err) {
            console.error('[ScanditLogger] config listener threw on attach:', err);
        }
        return () => ScanditLogger._configListeners.delete(cb);
    }
    static _emitConfig() {
        if (ScanditLogger._configListeners.size === 0)
            return;
        const cfg = { level: ScanditLogger._level };
        // Snapshot: a listener may attach another (the lazy receiver does), and a live
        // Set iteration would visit the newcomer in the same pass, firing it twice.
        for (const cb of [...ScanditLogger._configListeners]) {
            try {
                cb(cfg);
            }
            catch (err) {
                console.error('[ScanditLogger] config listener threw:', err);
            }
        }
    }
    static getRecentLogs() {
        const out = [];
        const count = ScanditLogger._count;
        const start = count < BUFFER_SIZE ? 0 : ScanditLogger._writeIdx;
        const total = Math.min(count, BUFFER_SIZE);
        for (let i = 0; i < total; i++) {
            const record = ScanditLogger._buffer[(start + i) % BUFFER_SIZE];
            if (record !== undefined)
                out.push(record);
        }
        return out;
    }
    static subscribe(cb) {
        ScanditLogger._subscribers.add(cb);
        return () => ScanditLogger._subscribers.delete(cb);
    }
    static clear() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            ScanditLogger._buffer = new Array(BUFFER_SIZE);
            ScanditLogger._writeIdx = 0;
            ScanditLogger._count = 0;
            ScanditLogger._pendingForNative = [];
            const proxy = coreProxy();
            if (proxy === undefined)
                return;
            // An appendLogs already in flight would otherwise land after the delete.
            yield ((_a = ScanditLogger._nativeSink) === null || _a === void 0 ? void 0 : _a.flush());
            yield callCore(proxy, {
                moduleName: 'CoreModule',
                methodName: 'clearLogs',
                isEventRegistration: false,
            });
        });
    }
    /** TS-emitted records not yet handed to native storage. Internal: used by `installNativeLogReceiver`. */
    static pendingNativeRecordCount() {
        return ScanditLogger._pendingForNative.length;
    }
    /** Removes and returns every record waiting for native storage. Internal. */
    static takePendingNativeRecords() {
        const records = ScanditLogger._pendingForNative;
        ScanditLogger._pendingForNative = [];
        return records;
    }
    /** Registers (or, with `undefined`, removes) the sink that moves queued records to native storage. Internal. */
    static setNativeSink(sink) {
        ScanditLogger._nativeSink = sink;
    }
    static _enqueueForNative(record) {
        var _a;
        const queue = ScanditLogger._pendingForNative;
        queue.push(record);
        if (queue.length > NATIVE_QUEUE_CAP)
            queue.shift();
        try {
            (_a = ScanditLogger._nativeSink) === null || _a === void 0 ? void 0 : _a.onQueued();
        }
        catch (err) {
            console.error('[ScanditLogger] native sink threw:', err);
        }
    }
    /**
     * Writes the records the SDK stored on the device, oldest first, as a redacted JSON-lines file
     * and resolves with the absolute path written. Without `path` the file is
     * `scandit-debug-log.jsonl` in the application's cache directory, replaced on every call.
     *
     * An app can only write inside its own storage: pass a path under the app container on iOS
     * (Documents, Library or the temporary directory) or under `Context.getFilesDir()` /
     * `Context.getExternalFilesDir()` on Android. A relative `path` is resolved against the app's
     * documents/files directory, which is the portable way to ask for a destination.
     *
     * Rejects when no record is stored (call `setLevel` first), the SDK is not initialized yet,
     * or the destination cannot be written.
     */
    static writeLogs(path) {
        return writeLogs(path, ScanditLogger.getLevel(), () => { var _a, _b; return (_b = (_a = ScanditLogger._nativeSink) === null || _a === void 0 ? void 0 : _a.flush()) !== null && _b !== void 0 ? _b : Promise.resolve(); });
    }
    /** Whether a record at `level` would be kept under the current level. */
    static isEnabled(level) {
        return level !== LogLevel.Off && ScanditLogger._level !== LogLevel.Off && level <= ScanditLogger._level;
    }
    static emit(level, category, source, message, fields, durationMs, error) {
        if (!ScanditLogger.isEnabled(level))
            return;
        const record = {
            ts: Date.now(),
            level,
            category,
            source,
            message,
            fields: ScanditLogger._applyArgPolicy(message, fields),
            durationMs,
            error: ScanditLogger._applyErrorPolicy(error),
        };
        ScanditLogger._buffer[ScanditLogger._writeIdx] = record;
        ScanditLogger._writeIdx = (ScanditLogger._writeIdx + 1) % BUFFER_SIZE;
        ScanditLogger._count++;
        ScanditLogger._enqueueForNative(record);
        ScanditLogger.writeToNativeSink(record);
        for (const sub of ScanditLogger._subscribers) {
            try {
                sub(record);
            }
            catch (err) {
                // Subscribers must not break the SDK.
                console.error('[ScanditLogger] subscriber threw:', err);
            }
        }
    }
    /**
     * Insert a `LogRecord` produced by the native side into the local buffer.
     *
     * Applies the TS-side level gate; native already applied its per-method override.
     *
     * Skips the platform-native console sink (the native side already wrote
     * to `android.util.Log` / `os_log` / etc.).
     *
     * Best-effort correlation: when the incoming
     * record has a `durationMs`, look back for the most recent unmatched
     * `ts.bridge` record with the same method name (last segment after the
     * dot) within a 10-second window and attach a derived
     * `fields.bridgeOverheadMs = tsRoundTrip - nativeWork`.
     *
     * Notifies subscribers so live consumers see a unified TS + native
     * stream. Intended for use by `installNativeLogReceiver` and equivalent
     * platform adapters — not part of the customer-facing API.
     */
    static ingest(record) {
        if (ScanditLogger._level === LogLevel.Off)
            return;
        if (record.level > ScanditLogger._level)
            return;
        const enriched = ScanditLogger._withBridgeOverhead(Object.assign(Object.assign({}, record), { fields: ScanditLogger._applyArgPolicy(record.message, record.fields), error: ScanditLogger._applyErrorPolicy(record.error) }));
        ScanditLogger._buffer[ScanditLogger._writeIdx] = enriched;
        ScanditLogger._writeIdx = (ScanditLogger._writeIdx + 1) % BUFFER_SIZE;
        ScanditLogger._count++;
        for (const sub of ScanditLogger._subscribers) {
            try {
                sub(enriched);
            }
            catch (err) {
                console.error('[ScanditLogger] subscriber threw:', err);
            }
        }
    }
    static _withBridgeOverhead(record) {
        var _a;
        if (record.durationMs === undefined)
            return record;
        if (record.source.startsWith('ts.'))
            return record;
        const nativeMethod = record.message;
        const window = ScanditLogger._CORRELATION_WINDOW_MS;
        const total = Math.min(ScanditLogger._count, BUFFER_SIZE);
        if (total === 0)
            return record;
        const writeIdx = ScanditLogger._writeIdx;
        // Walk newest → oldest in the ring buffer.
        for (let i = 1; i <= total; i++) {
            const idx = (writeIdx - i + BUFFER_SIZE * 2) % BUFFER_SIZE;
            const candidate = ScanditLogger._buffer[idx];
            if (!candidate)
                continue;
            if (record.ts - candidate.ts > window)
                break;
            if (!candidate.source.startsWith('ts.bridge'))
                continue;
            if (candidate.durationMs === undefined)
                continue;
            const dot = candidate.message.lastIndexOf('.');
            const candidateMethod = dot >= 0 ? candidate.message.slice(dot + 1) : candidate.message;
            if (candidateMethod !== nativeMethod)
                continue;
            const overheadMs = candidate.durationMs - record.durationMs;
            return Object.assign(Object.assign({}, record), { fields: Object.assign(Object.assign({}, ((_a = record.fields) !== null && _a !== void 0 ? _a : {})), { bridgeOverheadMs: overheadMs }) });
        }
        return record;
    }
    static format(record) {
        const ts = new Date(record.ts).toISOString();
        const level = logLevelName(record.level);
        const category = `[${logCategoryName(record.category)}]`.padEnd(15);
        const source = record.source.padEnd(16);
        const parts = [ts, level, category, source, record.message];
        if (record.durationMs !== undefined)
            parts.push(`duration=${record.durationMs}ms`);
        if (record.fields !== undefined)
            parts.push(`fields=${ScanditLogger.formatFields(record.fields)}`);
        if (record.error !== undefined)
            parts.push(`error=${record.error.name}: ${record.error.message}`);
        return parts.join('  ');
    }
    static formatFields(fields) {
        try {
            return JSON.stringify(fields);
        }
        catch (_a) {
            return '[unserializable]';
        }
    }
    static writeToNativeSink(record) {
        const line = ScanditLogger.format(record);
        switch (record.level) {
            case LogLevel.Error:
                console.error(line);
                return;
            case LogLevel.Warn:
                console.warn(line);
                return;
            case LogLevel.Info:
                console.info(line);
                return;
            case LogLevel.Debug:
            case LogLevel.Trace:
                console.debug(line);
                return;
            default:
                return;
        }
    }
}
ScanditLogger._level = LogLevel.Off;
ScanditLogger._buffer = new Array(BUFFER_SIZE);
ScanditLogger._writeIdx = 0;
ScanditLogger._count = 0;
ScanditLogger._subscribers = new Set();
ScanditLogger._configListeners = new Set();
ScanditLogger._pendingForNative = [];
ScanditLogger._redactedArgKeys = new Set(REDACTED_ARG_KEYS);
ScanditLogger._CORRELATION_WINDOW_MS = 10000;
ScanditLogger._methodMetadata = new Map();

/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2025- Scandit AG. All rights reserved.
 */
/**
 * Adapter class for Core operations.
 * Provides typed methods that internally call $executeCore.
 * Generated from schema definition to ensure parameter and method name consistency.
 */
class CoreProxyAdapter {
    constructor(proxy) {
        this.proxy = proxy;
    }
    /**
     * Gets the camera state for a given position
     * @param cameraPosition Camera position as JSON string
     */
    getCameraState(_a) {
        return __awaiter(this, arguments, void 0, function* ({ cameraPosition }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'getCameraState',
                isEventRegistration: false,
                cameraPosition,
            });
            return JSON.parse(result.data);
        });
    }
    /**
     * Switches the camera to the desired state
     * @param stateJson Desired camera state as JSON string
     */
    switchCameraToDesiredState(_a) {
        return __awaiter(this, arguments, void 0, function* ({ stateJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'switchCameraToDesiredState',
                isEventRegistration: false,
                stateJson,
            });
            return result;
        });
    }
    /**
     * Checks if torch is available for the given camera position
     * @param cameraPosition Camera position as JSON string
     */
    isTorchAvailable(_a) {
        return __awaiter(this, arguments, void 0, function* ({ cameraPosition }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'isTorchAvailable',
                isEventRegistration: false,
                cameraPosition,
            });
            return result.data === 'true';
        });
    }
    /**
     * Checks if macro mode is available for the current device
     */
    isMacroModeAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'isMacroModeAvailable',
                isEventRegistration: false,
            });
            return result.data === 'true';
        });
    }
    /**
     * Registers a persistent listener for frame source state change events
     */
    registerFrameSourceListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerFrameSourceListener',
                isEventRegistration: true,
            });
            return result;
        });
    }
    /**
     * Unregisters the frame source event listener
     */
    unregisterFrameSourceListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterFrameSourceListener',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Adds an NV21 frame to the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source the frame is added to
     * @param width Frame width in pixels
     * @param height Frame height in pixels
     * @param frameData Base64-encoded NV21 frame bytes
     */
    addFrameToSequenceFrameSource(_a) {
        return __awaiter(this, arguments, void 0, function* ({ frameSourceId, width, height, frameData, }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'addFrameToSequenceFrameSource',
                isEventRegistration: false,
                frameSourceId,
                width,
                height,
                frameData,
            });
            return result;
        });
    }
    /**
     * Returns the current state of the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source to get the state of
     */
    getSequenceFrameSourceState(_a) {
        return __awaiter(this, arguments, void 0, function* ({ frameSourceId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'getSequenceFrameSourceState',
                isEventRegistration: false,
                frameSourceId,
            });
            return JSON.parse(result.data);
        });
    }
    /**
     * Registers a persistent listener for torch state change events
     */
    registerTorchStateListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerTorchStateListener',
                isEventRegistration: true,
            });
            return result;
        });
    }
    /**
     * Unregisters the torch state event listener
     */
    unregisterTorchStateListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterTorchStateListener',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Registers a persistent listener for zoom level change events
     */
    registerZoomLevelListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerZoomLevelListener',
                isEventRegistration: true,
            });
            return result;
        });
    }
    /**
     * Unregisters the zoom level event listener
     */
    unregisterZoomLevelListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterZoomLevelListener',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Selects the zoom level on the ZoomSwitchControl. Returns the actual zoom level applied.
     * @param viewId View identifier
     * @param zoomLevel Desired zoom level as a zoom factor
     */
    selectZoomLevel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId, zoomLevel }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'selectZoomLevel',
                isEventRegistration: false,
                viewId,
                zoomLevel,
            });
            return Number(result.data);
        });
    }
    /**
     * Registers a persistent listener for macro mode change events
     */
    registerMacroModeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerMacroModeListener',
                isEventRegistration: true,
            });
            return result;
        });
    }
    /**
     * Unregisters the macro mode event listener
     */
    unregisterMacroModeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterMacroModeListener',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Gets the last frame data by frame ID as JSON
     * @param frameId Unique frame identifier
     */
    getLastFrameAsJson(_a) {
        return __awaiter(this, arguments, void 0, function* ({ frameId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'getLastFrameAsJson',
                isEventRegistration: false,
                frameId,
            });
            return result.data;
        });
    }
    /**
     * Gets the last frame data by frame ID as JSON, or null if not found
     * @param frameId Unique frame identifier
     */
    getLastFrameOrNullAsJson(_a) {
        return __awaiter(this, arguments, void 0, function* ({ frameId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'getLastFrameOrNullAsJson',
                isEventRegistration: false,
                frameId,
            });
            if (result === null)
                return null;
            return result.data;
        });
    }
    /**
     * Creates a DataCaptureContext from JSON
     * @param contextJson DataCaptureContext configuration as JSON string
     */
    createContextFromJson(_a) {
        return __awaiter(this, arguments, void 0, function* ({ contextJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'createContextFromJson',
                isEventRegistration: false,
                contextJson,
            });
            return result;
        });
    }
    /**
     * Updates a DataCaptureContext from JSON
     * @param contextJson Updated DataCaptureContext configuration as JSON string
     */
    updateContextFromJson(_a) {
        return __awaiter(this, arguments, void 0, function* ({ contextJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'updateContextFromJson',
                isEventRegistration: false,
                contextJson,
            });
            return result;
        });
    }
    /**
     * Subscribes to context events with persistent listener
     */
    subscribeContextListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'subscribeContextListener',
                isEventRegistration: true,
            });
            return result;
        });
    }
    /**
     * Unsubscribes from context events
     */
    unsubscribeContextListener() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unsubscribeContextListener',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Adds a mode to the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    addModeToContext(_a) {
        return __awaiter(this, arguments, void 0, function* ({ modeJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'addModeToContext',
                isEventRegistration: false,
                modeJson,
            });
            return result;
        });
    }
    /**
     * Removes a mode from the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    removeModeFromContext(_a) {
        return __awaiter(this, arguments, void 0, function* ({ modeJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'removeModeFromContext',
                isEventRegistration: false,
                modeJson,
            });
            return result;
        });
    }
    /**
     * Removes all modes from the DataCaptureContext
     */
    removeAllModes() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'removeAllModes',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Gets open source software license information
     */
    getOpenSourceSoftwareLicenseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'getOpenSourceSoftwareLicenseInfo',
                isEventRegistration: false,
            });
            return result.data;
        });
    }
    /**
     * Disposes the DataCaptureContext and releases resources
     */
    disposeContext() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'disposeContext',
                isEventRegistration: false,
            });
            return result;
        });
    }
    /**
     * Converts a point from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param pointJson Point in frame coordinates as JSON string
     */
    viewPointForFramePoint(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId, pointJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'viewPointForFramePoint',
                isEventRegistration: false,
                viewId,
                pointJson,
            });
            return result.data;
        });
    }
    /**
     * Converts a quadrilateral from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param quadrilateralJson Quadrilateral in frame coordinates as JSON string
     */
    viewQuadrilateralForFrameQuadrilateral(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId, quadrilateralJson, }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'viewQuadrilateralForFrameQuadrilateral',
                isEventRegistration: false,
                viewId,
                quadrilateralJson,
            });
            return result.data;
        });
    }
    /**
     * Registers persistent event listener for view events
     * @param viewId View identifier
     */
    registerListenerForViewEvents(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerListenerForViewEvents',
                isEventRegistration: true,
                viewId,
            });
            return result;
        });
    }
    /**
     * Unregisters the view event listener
     * @param viewId View identifier
     */
    unregisterListenerForViewEvents(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterListenerForViewEvents',
                isEventRegistration: false,
                viewId,
            });
            return result;
        });
    }
    /**
     * Registers a persistent listener for focus gesture events
     * @param viewId View identifier
     */
    registerFocusGestureListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerFocusGestureListener',
                isEventRegistration: true,
                viewId,
            });
            return result;
        });
    }
    /**
     * Unregisters the focus gesture event listener
     * @param viewId View identifier
     */
    unregisterFocusGestureListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterFocusGestureListener',
                isEventRegistration: false,
                viewId,
            });
            return result;
        });
    }
    /**
     * Triggers a focus as if the focus gesture was performed
     * @param viewId View identifier
     * @param pointJson Point in view coordinates as JSON string
     */
    triggerFocus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId, pointJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'triggerFocus',
                isEventRegistration: false,
                viewId,
                pointJson,
            });
            return result;
        });
    }
    /**
     * Triggers a zoom in gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'triggerZoomIn',
                isEventRegistration: false,
                viewId,
            });
            return result;
        });
    }
    /**
     * Triggers a zoom out gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomOut(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'triggerZoomOut',
                isEventRegistration: false,
                viewId,
            });
            return result;
        });
    }
    /**
     * Registers a persistent listener for zoom gesture events
     * @param viewId View identifier
     */
    registerZoomGestureListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'registerZoomGestureListener',
                isEventRegistration: true,
                viewId,
            });
            return result;
        });
    }
    /**
     * Unregisters the zoom gesture event listener
     * @param viewId View identifier
     */
    unregisterZoomGestureListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewId }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'unregisterZoomGestureListener',
                isEventRegistration: false,
                viewId,
            });
            return result;
        });
    }
    /**
     * Updates the DataCaptureView configuration
     * @param viewJson Updated view configuration as JSON string
     */
    updateDataCaptureView(_a) {
        return __awaiter(this, arguments, void 0, function* ({ viewJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'updateDataCaptureView',
                isEventRegistration: false,
                viewJson,
            });
            return result;
        });
    }
    /**
     * Emits haptic/audio feedback
     * @param feedbackJson Feedback configuration as JSON string
     */
    emitFeedback(_a) {
        return __awaiter(this, arguments, void 0, function* ({ feedbackJson }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'emitFeedback',
                isEventRegistration: false,
                feedbackJson,
            });
            return result;
        });
    }
    /**
     * Registers a listener for an event with the global listener registry
     * @param eventName Event name
     * @param viewId View identifier the listener is scoped to
     * @param modeId Mode identifier the listener is scoped to
     */
    addListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ eventName, viewId, modeId, }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'addListener',
                isEventRegistration: true,
                eventName,
                viewId,
                modeId,
            });
            return result;
        });
    }
    /**
     * Removes a listener for an event from the global listener registry
     * @param eventName Event name
     * @param viewId View identifier the listener is scoped to
     * @param modeId Mode identifier the listener is scoped to
     */
    removeListener(_a) {
        return __awaiter(this, arguments, void 0, function* ({ eventName, viewId, modeId, }) {
            const result = yield this.proxy.$executeCore({
                moduleName: 'CoreModule',
                methodName: 'removeListener',
                isEventRegistration: false,
                eventName,
                viewId,
                modeId,
            });
            return result;
        });
    }
}

/*
 *
 * Global registry to handle listeners for events.
 * subscription: name based, listen to all events of name x
 * handler: mode/view id based, handle events of name x for mode/view id y
 * listener: user specified listener, each handler has a list of listeners.
 */
function listenerRegistryState() {
    const g = globalThis;
    if (!g.__scanditListenerRegistryState) {
        g.__scanditListenerRegistryState = {
            fallbackEmitter: new EventEmitter(),
            subscriptions: new Map(),
            handlers: new Map(),
        };
    }
    return g.__scanditListenerRegistryState;
}
class ListenerRegistry {
    static get fallbackEmitter() {
        return listenerRegistryState().fallbackEmitter;
    }
    // Map event name to its subscription
    // Subscriptions extract the id and call the correct handler
    static get subscriptions() {
        return listenerRegistryState().subscriptions;
    }
    // Map an event name to its handlers, one per mode/view plus any id-less ones
    // aka an event can have multiple modes listening to it and each mode can have multiple listeners
    static get handlers() {
        return listenerRegistryState().handlers;
    }
    /*
     * Add a listener for a given event and target.
     * We store multiple listeners for the same event and target, only the latest handler is called when the event is emitted.
     */
    static addListener(eventName, target, listener, handlerFn) {
        const slot = this.slotFor(eventName);
        if (target === null) {
            return this.addGlobalListener(slot, listener, handlerFn);
        }
        const key = targetKey(target);
        const handler = slot.byTarget.get(key);
        if (handler === null || handler === void 0 ? void 0 : handler.listeners.some(l => l === listener)) {
            // Listener already registered
            return slot.ready;
        }
        if (!handler) {
            slot.byTarget.set(key, { listeners: [listener], handler: handlerFn });
            return Promise.all([slot.ready, this.nativeAddListener(eventName, target)]).then(() => undefined);
        }
        else {
            slot.byTarget.set(key, { listeners: [...handler.listeners, listener], handler: handlerFn });
            return slot.ready;
        }
    }
    static listenersFor(eventName, target) {
        var _a, _b;
        const slot = this.handlers.get(eventName);
        if (!slot) {
            return [];
        }
        if (target === null) {
            return slot.global.flatMap(handler => handler.listeners);
        }
        return [...((_b = (_a = slot.byTarget.get(targetKey(target))) === null || _a === void 0 ? void 0 : _a.listeners) !== null && _b !== void 0 ? _b : [])];
    }
    static hasListeners(eventName, target) {
        return this.listenersFor(eventName, target).length > 0;
    }
    static removeListener(eventName, target, listener) {
        const slot = this.handlers.get(eventName);
        if (!slot) {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'no handlers found for event', { eventName });
            return Promise.resolve();
        }
        const handler = target === null
            ? slot.global.find(candidate => candidate.listeners.some(l => l === listener))
            : slot.byTarget.get(targetKey(target));
        if (!handler) {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'no handler found for event target', {
                eventName,
                target: describeTarget(target),
            });
            return Promise.resolve();
        }
        handler.listeners = handler.listeners.filter(l => l !== listener);
        if (handler.listeners.length !== 0) {
            return Promise.resolve();
        }
        const pending = [];
        if (target === null) {
            slot.global = slot.global.filter(candidate => candidate !== handler);
            if (slot.global.length === 0) {
                pending.push(this.nativeRemoveListener(eventName, null));
            }
        }
        else {
            slot.byTarget.delete(targetKey(target));
            pending.push(this.nativeRemoveListener(eventName, target));
        }
        if (slot.byTarget.size === 0 && slot.global.length === 0) {
            this.handlers.delete(eventName);
            pending.push(this.unsubscribeToEvent(eventName));
        }
        return Promise.all(pending).then(() => undefined);
    }
    static addGlobalListener(slot, listener, handlerFn) {
        if (slot.global.some(candidate => candidate.listeners.some(l => l === listener))) {
            return slot.ready;
        }
        const handler = slot.global.find(candidate => candidate.handler === handlerFn);
        if (!handler) {
            const pending = [slot.ready];
            if (slot.global.length === 0) {
                pending.push(this.nativeAddListener(slot.eventName, null));
            }
            slot.global.push({ listeners: [listener], handler: handlerFn });
            return Promise.all(pending).then(() => undefined);
        }
        if (handler.listeners.some(l => l === listener)) {
            // Listener already registered
            return slot.ready;
        }
        handler.listeners = [...handler.listeners, listener];
        return slot.ready;
    }
    static slotFor(eventName) {
        let slot = this.handlers.get(eventName);
        if (!slot) {
            slot = { eventName, byTarget: new Map(), global: [], ready: Promise.resolve() };
            this.handlers.set(eventName, slot);
            slot.ready = this.subscribeToEvent(eventName);
        }
        return slot;
    }
    static handleEvent(eventName, ...args) {
        const slot = this.handlers.get(eventName);
        if (!slot) {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'no handlers registered for event', {
                eventName,
            });
            return;
        }
        const dataPayload = args[0];
        const parsedData = parseData(dataPayload);
        if (parsedData === null) {
            ScanditLogger.emit(LogLevel.Error, LogCategory.Listener, 'ts.core', 'event unhandled, payload could not be decoded', { eventName });
            return;
        }
        for (const handler of [...slot.global]) {
            handler.handler(handler.listeners, dataPayload, parsedData);
        }
        const targetKeys = targetKeysOf(dataPayload, parsedData);
        if (targetKeys.length === 0) {
            if (slot.byTarget.size === 1) {
                const [handler] = slot.byTarget.values();
                handler.handler(handler.listeners, dataPayload, parsedData);
            }
            else if (slot.byTarget.size > 1) {
                ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'event carries no target id, dropped', {
                    eventName,
                    targets: slot.byTarget.size,
                });
            }
            return;
        }
        for (const key of targetKeys) {
            const handler = slot.byTarget.get(key);
            if (handler) {
                handler.handler(handler.listeners, dataPayload, parsedData);
            }
        }
    }
    // Native RegistryEmitter sends every event registered here through CoreEventEmitter.
    static eventSource() {
        var _a;
        const proxy = this.coreProxy();
        return { proxy, emitter: (_a = proxy === null || proxy === void 0 ? void 0 : proxy.eventEmitter) !== null && _a !== void 0 ? _a : this.fallbackEmitter };
    }
    static subscribeToEvent(eventName) {
        const { proxy: source, emitter } = this.eventSource();
        const subscription = (...args) => this.handleEvent(eventName, ...args);
        emitter.on(eventName, subscription);
        this.subscriptions.set(eventName, subscription);
        return Promise.resolve(source === null || source === void 0 ? void 0 : source.subscribeForEvents([eventName])).catch(error => {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'failed to subscribe to native event', {
                eventName,
                error: String(error),
            });
        });
    }
    static coreProxy() {
        try {
            return FactoryMaker.getInstance('CoreProxy');
        }
        catch (_a) {
            return undefined;
        }
    }
    static nativeAddListener(eventName, target) {
        const proxy = this.coreProxy();
        if (!proxy) {
            return Promise.resolve();
        }
        return new CoreProxyAdapter(proxy).addListener(Object.assign({ eventName }, nativeTarget(target))).catch(error => {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'failed to register native listener', {
                eventName,
                error: String(error),
            });
        });
    }
    static nativeRemoveListener(eventName, target) {
        const proxy = this.coreProxy();
        if (!proxy) {
            return Promise.resolve();
        }
        return new CoreProxyAdapter(proxy).removeListener(Object.assign({ eventName }, nativeTarget(target))).catch(error => {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'failed to unregister native listener', {
                eventName,
                error: String(error),
            });
        });
    }
    static reset() {
        for (const [eventName, subscription] of this.subscriptions) {
            this.eventSource().emitter.off(eventName, subscription);
        }
        this.subscriptions.clear();
        this.handlers.clear();
    }
    static unsubscribeToEvent(eventName) {
        const subscription = this.subscriptions.get(eventName);
        if (!subscription) {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'no subscription found for event', {
                eventName,
            });
            return Promise.resolve();
        }
        const { proxy: source, emitter } = this.eventSource();
        emitter.off(eventName, subscription);
        this.subscriptions.delete(eventName);
        return Promise.resolve(source === null || source === void 0 ? void 0 : source.unsubscribeFromEvents([eventName])).catch(error => {
            ScanditLogger.emit(LogLevel.Warn, LogCategory.Listener, 'ts.core', 'failed to unsubscribe from native event', {
                eventName,
                error: String(error),
            });
        });
    }
}
function nativeTarget(target) {
    if (target === null) {
        return {};
    }
    return 'viewId' in target ? { viewId: target.viewId } : { modeId: target.modeId };
}
function targetKey(target) {
    return 'viewId' in target ? `view:${target.viewId}` : `mode:${target.modeId}`;
}
function describeTarget(target) {
    return target === null ? 'none' : targetKey(target);
}
function idOf(field, ev, data) {
    const fromData = data[field];
    if (typeof fromData === 'number') {
        return fromData;
    }
    const fromWrapper = ev[field];
    return typeof fromWrapper === 'number' ? fromWrapper : null;
}
function targetKeysOf(ev, data) {
    var _a;
    const keys = [];
    const viewId = (_a = idOf('viewId', ev, data)) !== null && _a !== void 0 ? _a : idOf('dataCaptureViewId', ev, data);
    if (viewId !== null) {
        keys.push(`view:${viewId}`);
    }
    const modeId = idOf('modeId', ev, data);
    if (modeId !== null) {
        keys.push(`mode:${modeId}`);
    }
    return keys;
}
function parseData(ev) {
    if (typeof (ev === null || ev === void 0 ? void 0 : ev.data) !== 'string') {
        return null;
    }
    try {
        return JSON.parse(ev.data);
    }
    catch (_a) {
        return null;
    }
}
FactoryMaker.bindInstance('ListenerRegistry', ListenerRegistry);

class ContextStatus {
    static fromJSON(json) {
        const status = new ContextStatus();
        status._code = json.code;
        status._message = json.message;
        status._isValid = json.isValid;
        return status;
    }
    get message() {
        return this._message;
    }
    get code() {
        return this._code;
    }
    get isValid() {
        return this._isValid;
    }
}

class FrameDataSettings extends DefaultSerializeable {
    constructor() {
        super();
        // Enables the file system cache for the frame.
        this._isFileSystemCacheEnabled = false;
        // The quality of the image. 0-100.
        this._imageQuality = 100;
        // Enables the auto-rotation of the frame.
        this._isAutoRotateEnabled = false;
    }
    get isFileSystemCacheEnabled() {
        return this._isFileSystemCacheEnabled;
    }
    set isFileSystemCacheEnabled(enabled) {
        this._isFileSystemCacheEnabled = enabled;
    }
    get imageQuality() {
        return this._imageQuality;
    }
    set imageQuality(quality) {
        if (quality < 0 || quality > 100) {
            throw new Error('Image quality must be between 0 and 100');
        }
        this._imageQuality = quality;
    }
    get isAutoRotateEnabled() {
        return this._isAutoRotateEnabled;
    }
    set isAutoRotateEnabled(enabled) {
        this._isAutoRotateEnabled = enabled;
    }
}
__decorate([
    nameForSerialization('sc_frame_isFileSystemCacheEnabled')
], FrameDataSettings.prototype, "_isFileSystemCacheEnabled", void 0);
__decorate([
    nameForSerialization('sc_frame_imageQuality')
], FrameDataSettings.prototype, "_imageQuality", void 0);
__decorate([
    nameForSerialization('sc_frame_autoRotate')
], FrameDataSettings.prototype, "_isAutoRotateEnabled", void 0);

class FrameDataSettingsBuilder {
    constructor(settings) {
        this.settings = settings;
    }
    enableFileSystemCache(enabled) {
        this.settings.isFileSystemCacheEnabled = enabled;
        return this;
    }
    setImageQuality(quality) {
        this.settings.imageQuality = quality;
        return this;
    }
    enableAutoRotate(enabled) {
        this.settings.isAutoRotateEnabled = enabled;
        return this;
    }
}

class DataCaptureContextSettings extends DefaultSerializeable {
    constructor() {
        super();
        this._frameSettings = new FrameDataSettings();
    }
    get frameDataSettings() {
        return this._frameSettings;
    }
    set frameDataSettings(settings) {
        this._frameSettings = settings;
    }
    frameDataSettingsBuilder() {
        return new FrameDataSettingsBuilder(this._frameSettings);
    }
    setProperty(name, value) {
        this[name] = value;
    }
    getProperty(name) {
        return this[name];
    }
}
__decorate([
    nameForSerialization('frameDataSettings')
], DataCaptureContextSettings.prototype, "_frameSettings", void 0);

class OpenSourceSoftwareLicenseInfo {
    constructor(licenseText) {
        this._licenseText = licenseText;
    }
    get licenseText() {
        return this._licenseText;
    }
}

class BaseController {
    get _proxy() {
        return this._cachedProxy;
    }
    dispose() { }
    constructor(proxyName) {
        this._cachedProxy = FactoryMaker.createInstance(proxyName);
    }
}

function errorMessage(err) {
    return err instanceof Error ? err.message : String(err);
}

const INSTRUMENTED = Symbol.for('scanditLogger.bridgeCallInstrumented');
const SOURCE = 'ts.bridge';
// The log file's own commands: a record about storing records would be stored in turn, forever.
const UNLOGGED_METHODS = new Set(['appendLogs', 'clearLogs']);
var BridgeCallKind;
(function (BridgeCallKind) {
    BridgeCallKind["Method"] = "method";
    BridgeCallKind["EventRegistration"] = "eventRegistration";
})(BridgeCallKind || (BridgeCallKind = {}));
function isUnlogged(args) {
    const method = args === null || args === void 0 ? void 0 : args.methodName;
    return typeof method === 'string' && UNLOGGED_METHODS.has(method);
}
function isInstrumented(call) {
    return call[INSTRUMENTED] === true;
}
/**
 * Binds `call` to `owner` and decorates it so each invocation emits one `LogRecord`.
 * Idempotent: an already instrumented `call` is returned as is.
 */
function instrumentBridgeCall(call, owner, kind) {
    if (isInstrumented(call))
        return call;
    const bound = call.bind(owner);
    const instrumented = kind === BridgeCallKind.EventRegistration
        ? createDispatcher(bound, /*defaultCategory*/ LogCategory.Listener, /*tag*/ '$$')
        : createDispatcher(bound, /*defaultCategory*/ LogCategory.Bridge, /*tag*/ '$');
    return Object.assign(instrumented, { [INSTRUMENTED]: true });
}
// Must stay a plain (non-async) function: an `async` wrapper allocates a Promise
// and adds a microtask tick even when it only returns `call(...)` unchanged.
function createDispatcher(call, defaultCategory, tag) {
    return (fnName, args) => {
        // Gate on Off alone: gating on Debug would also suppress the LogLevel.Error
        // record the catch block emits, which a level of e.g. Error must still get.
        if (ScanditLogger.getLevel() === LogLevel.Off || isUnlogged(args)) {
            try {
                return call(fnName, args);
            }
            catch (err) {
                // Keep the async signature's contract: the removed `async` wrapper turned a
                // sync throw into a rejection. Cast, not wrap, so the value reaches the caller as thrown.
                return Promise.reject(err);
            }
        }
        return instrument(call, fnName, args, defaultCategory, tag);
    };
}
function instrument(call, fnName, args, defaultCategory, tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        const { message, level, category, errorCategory, buildFields } = resolveDispatch(fnName, args, defaultCategory, tag);
        // Built once, and only if a record will use it: per-frame Trace calls are dropped at Debug.
        let fields;
        let fieldsBuilt = false;
        const getFields = () => {
            if (!fieldsBuilt) {
                fields = buildFields();
                fieldsBuilt = true;
            }
            return fields;
        };
        // Snapshot the args before the call can mutate them.
        if (ScanditLogger.isEnabled(level))
            getFields();
        try {
            // `await` tolerates both Promise and non-Promise returns. Some test
            // doubles (and historical native modules) return plain values; we still
            // want to record one LogRecord per call.
            const result = yield call(fnName, args);
            ScanditLogger.emit(level, category, SOURCE, message, ScanditLogger.isEnabled(level) ? getFields() : undefined, Date.now() - start);
            return result;
        }
        catch (err) {
            ScanditLogger.emit(LogLevel.Error, errorCategory, SOURCE, message, getFields(), Date.now() - start, toLogError(err));
            throw err;
        }
    });
}
/**
 * Many proxies route calls through a generic dispatcher (e.g.
 * `proxy.$executeCore({ moduleName, methodName, ... })`). When we detect that
 * shape, surface the actual `moduleName.methodName` in the log message
 * instead of the meaningless outer dispatcher name. Also lift any
 * `modeId`/`viewId`/`parentId` from the args into `fields`, and re-route
 * `isEventRegistration: true` calls into the `Listener` category.
 */
const DISPATCHER_KEYS = new Set(['moduleName', 'methodName', 'isEventRegistration']);
const ID_KEYS = new Set(['modeId', 'viewId', 'parentId']);
function resolveDispatch(fnName, args, defaultCategory, tag) {
    var _a, _b, _c;
    const dispatcher = (args !== null && args !== void 0 ? args : {});
    const method = typeof dispatcher.methodName === 'string' ? dispatcher.methodName : undefined;
    const baseCategory = method !== undefined && dispatcher.isEventRegistration ? LogCategory.Listener : defaultCategory;
    const override = ScanditLogger.getMethodMetadata(method !== null && method !== void 0 ? method : fnName);
    return {
        message: method !== undefined ? `${(_a = dispatcher.moduleName) !== null && _a !== void 0 ? _a : fnName}.${method}` : `${tag}${fnName}`,
        level: (_b = override === null || override === void 0 ? void 0 : override.level) !== null && _b !== void 0 ? _b : LogLevel.Debug,
        category: (_c = override === null || override === void 0 ? void 0 : override.category) !== null && _c !== void 0 ? _c : baseCategory,
        errorCategory: baseCategory,
        buildFields: () => buildFields(args, dispatcher),
    };
}
function buildFields(args, dispatcher) {
    const fields = {};
    if (typeof dispatcher.modeId === 'number')
        fields.modeId = dispatcher.modeId;
    if (typeof dispatcher.viewId === 'number')
        fields.viewId = dispatcher.viewId;
    if (typeof dispatcher.parentId === 'number')
        fields.parentId = dispatcher.parentId;
    // Inner args go under `fields.args`, minus dispatcher boilerplate and the
    // already-promoted IDs; `ScanditLogger.emit` decides which values survive.
    if (args != null && typeof args === 'object') {
        const innerArgs = {};
        for (const [key, value] of Object.entries(dispatcher)) {
            if (DISPATCHER_KEYS.has(key) || ID_KEYS.has(key))
                continue;
            innerArgs[key] = value;
        }
        if (Object.keys(innerArgs).length > 0) {
            fields.args = innerArgs;
        }
    }
    return Object.keys(fields).length ? fields : undefined;
}
function toLogError(err) {
    if (err instanceof Error) {
        return { name: err.name, message: errorMessage(err), stack: err.stack };
    }
    return { name: 'Error', message: errorMessage(err) };
}

/** Instruments a proxy's bridge calls for logging; `NativeProxy` already does this at construction. Idempotent. */
function wrapNativeProxy(target) {
    target._call = instrumentBridgeCall(target._call, target, BridgeCallKind.Method);
    target._callEventRegistration = instrumentBridgeCall(target._callEventRegistration, target, BridgeCallKind.EventRegistration);
}

const BATCH_EVENT = 'ScanditLogger.batch';
const FILE_FLUSH_INTERVAL_MS = 100;
const FILE_FLUSH_MAX_RECORDS = 50;
/**
 * Per-proxy teardown for everything `installNativeLogReceiver` registers — both
 * the BATCH_EVENT listener and the config listener. Keyed weakly so a discarded
 * proxy does not pin its closures.
 *
 * Both need this. `proxy.eventEmitter` is `eventemitter3`, whose `on()` appends
 * unconditionally: it de-duplicates neither distinct closures nor repeated
 * registrations of the same function reference (verified empirically). So a
 * second `installNativeLogReceiver` on the same proxy — e.g. after a module
 * teardown/reinit — would leave the previous BATCH_EVENT handler attached and
 * every native record would be ingested once per accumulated handler,
 * duplicating entries in the ring buffer and in `subscribe(cb)` callbacks.
 */
const previousTeardowns = new WeakMap();
/**
 * Different bridges deliver the same logical event in different shapes.
 *
 * - RN new architecture wraps every event in `{ name, data: <JSON-stringified payload>, ... }`.
 * - RN old architecture / direct emitters may deliver the payload object directly.
 *
 * Normalise into a `BatchPayload` regardless of which shape we receive.
 */
function parseBatchPayload(raw) {
    if (raw == null)
        return null;
    if (typeof raw !== 'object')
        return null;
    const obj = raw;
    if (Array.isArray(obj.records))
        return obj;
    if (typeof obj.data === 'string') {
        try {
            const parsed = JSON.parse(obj.data);
            if (parsed && Array.isArray(parsed.records))
                return parsed;
        }
        catch (_a) {
            return null;
        }
    }
    return null;
}
// Sends queued records to `appendLogs` at 50 waiting or 100 ms after the first, draining any
// queued earlier on attach; the returned detach leaves unsent records queued.
function attachNativeFileSink(proxy) {
    let timer;
    let sending = Promise.resolve();
    const sendAll = () => {
        if (timer !== undefined) {
            clearTimeout(timer);
            timer = undefined;
        }
        const records = ScanditLogger.takePendingNativeRecords();
        for (let i = 0; i < records.length; i += FILE_FLUSH_MAX_RECORDS) {
            const lines = records
                .slice(i, i + FILE_FLUSH_MAX_RECORDS)
                .map(serializeLogRecord)
                .join('\n');
            sending = sending
                .then(() => callCore(proxy, { moduleName: 'CoreModule', methodName: 'appendLogs', isEventRegistration: false, lines }))
                .then(() => undefined)
                .catch((err) => {
                console.warn('[ScanditLogger] could not store log records on the device:', errorMessage(err));
            });
        }
    };
    const onQueued = () => {
        if (ScanditLogger.pendingNativeRecordCount() >= FILE_FLUSH_MAX_RECORDS) {
            sendAll();
        }
        else if (timer === undefined) {
            timer = setTimeout(sendAll, FILE_FLUSH_INTERVAL_MS);
        }
    };
    const flush = () => {
        sendAll();
        return sending;
    };
    ScanditLogger.setNativeSink({ onQueued, flush });
    if (ScanditLogger.pendingNativeRecordCount() > 0)
        onQueued();
    return () => {
        ScanditLogger.setNativeSink(undefined);
        if (timer !== undefined)
            clearTimeout(timer);
        timer = undefined;
    };
}
/**
 * Wire up the cross-bridge log channel: subscribe to the native-emitted
 * `ScanditLogger.batch` event and merge each incoming record into the local
 * in-memory buffer.
 *
 * Native records are inserted via `ScanditLogger.ingest` so they:
 *   • are NOT re-checked against TS-side level/category gating (native
 *     already applied its own gates);
 *   • are NOT re-written to the JS console (native already wrote them to
 *     the platform-native logger);
 *   • DO appear in `getRecentLogs()` and DO trigger `subscribe(cb)`
 *     callbacks, giving the customer one unified record stream.
 *
 * Call this once per framework, immediately after the NativeProxy is bound
 * (typically in `init*Proxy.ts`).
 *
 * Returns a teardown that detaches the BATCH_EVENT handler, the config
 * listener and the `appendLogs` sink, so the receiver can be turned off again. Calling this function more
 * than once on the same proxy is safe: the previous registration is disposed
 * first. It is NOT safe to rely on the EventEmitter to de-duplicate — it does
 * not (see `previousTeardowns`).
 */
function installNativeLogReceiver(proxy) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Dispose anything a previous install left attached to this proxy before
        // registering again, otherwise handlers accumulate and records are ingested
        // once per accumulated handler.
        (_a = previousTeardowns.get(proxy)) === null || _a === void 0 ? void 0 : _a();
        const onBatch = (rawEvent) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const payload = parseBatchPayload(rawEvent);
            const records = payload === null || payload === void 0 ? void 0 : payload.records;
            if (!records || records.length === 0)
                return;
            for (const raw of records) {
                const record = {
                    ts: Number(raw.ts) || Date.now(),
                    level: (_a = raw.level) !== null && _a !== void 0 ? _a : LogLevel.Info,
                    category: (_b = raw.category) !== null && _b !== void 0 ? _b : LogCategory.Bridge,
                    source: String((_c = raw.source) !== null && _c !== void 0 ? _c : 'native.unknown'),
                    message: String((_d = raw.message) !== null && _d !== void 0 ? _d : ''),
                    fields: (_e = raw.fields) !== null && _e !== void 0 ? _e : undefined,
                    durationMs: (_f = raw.durationMs) !== null && _f !== void 0 ? _f : undefined,
                    error: (_g = raw.error) !== null && _g !== void 0 ? _g : undefined,
                };
                ScanditLogger.ingest(record);
            }
        };
        proxy.eventEmitter.on(BATCH_EVENT, onBatch);
        // Push TS-side config (level) to the native singleton.
        // Fires once immediately on attach (carrying whatever level the customer
        // already set), then again on every subsequent setLevel call. Failures are logged but never throw.
        //
        // Each onConfigChange call adds a fresh closure to a Set, so without a
        // teardown a re-install would leave the previous listener attached and fire
        // one redundant `setLoggerConfig` bridge call per accumulated listener on
        // every subsequent setLevel.
        const disposeConfigListener = ScanditLogger.onConfigChange(cfg => {
            void callCore(proxy, {
                moduleName: 'CoreModule',
                methodName: 'setLoggerConfig',
                isEventRegistration: false,
                level: cfg.level,
            }).catch((err) => {
                console.warn('[ScanditLogger] native config sync failed:', errorMessage(err));
            });
        });
        const detachFileSink = attachNativeFileSink(proxy);
        const teardown = () => {
            proxy.eventEmitter.off(BATCH_EVENT, onBatch);
            disposeConfigListener();
            detachFileSink();
            previousTeardowns.delete(proxy);
        };
        // Publish the teardown SYNCHRONOUSLY, before the first `await` below. Everything
        // this function registers is attached above with no intervening suspension, so a
        // concurrent second install (two module inits racing, or a reinit that does not
        // await the previous install) is guaranteed to find a complete teardown at the
        // top of this function and dispose it. Registering listeners before an `await`
        // but publishing the teardown after it would leave a window in which the second
        // call sees nothing to dispose and both `onBatch` handlers stay attached —
        // reintroducing exactly the duplicate-ingestion bug this file prevents.
        previousTeardowns.set(proxy, teardown);
        try {
            // Cast: BaseProxy declares `subscribeForEvents(): void`, but the concrete
            // NativeProxy implementation is async — every framework relies on that
            // promise for backpressure during native subscribe.
            yield proxy.subscribeForEvents([BATCH_EVENT]);
        }
        catch (err) {
            // Subscribing may be a no-op on frameworks that auto-deliver events.
            // Failing here must not block SDK init.
            console.warn('[ScanditLogger] could not subscribe to native batch event:', err);
        }
        return teardown;
    });
}
/**
 * Lazy front door for `installNativeLogReceiver`: attaches only a JS-side
 * `ScanditLogger.onConfigChange` gate (a `Set.add` plus a synchronous
 * callback — zero bridge traffic) and performs the real, bridge-crossing
 * install on the first config whose `level !== LogLevel.Off`. Every app that
 * never calls `setLevel` above `Off` never crosses the bridge for logging.
 *
 * `onConfigChange` fires synchronously on attach, so a customer who already
 * called `setLevel(Debug)` before SDK init still gets the install immediately
 * — this function does not delay that case, only the Off default.
 *
 * `onInstalled`, if given, runs once, right after the real install resolves
 * — the hook `registerCoreProxies` uses to open the Cordova-only native log
 * channel behind the same first-enable gate instead of eagerly.
 */
function armNativeLogReceiver(proxy, onInstalled) {
    let installedTeardown = null;
    let installing = false;
    let disposed = false;
    const disposeGate = ScanditLogger.onConfigChange(cfg => {
        // Guarded explicitly, not left to installNativeLogReceiver's own idempotency, so
        // a still-enabled app issues no second subscribeForEvents on every setLevel.
        if (cfg.level === LogLevel.Off || installedTeardown || installing || disposed)
            return;
        // `installing` covers the await window inside installNativeLogReceiver, during
        // which installedTeardown is not yet assigned.
        installing = true;
        void installNativeLogReceiver(proxy)
            .then(teardown => {
            // Torn down mid-install: undo it, or the receiver outlives its own teardown.
            if (disposed) {
                teardown();
                return;
            }
            installedTeardown = teardown;
            onInstalled === null || onInstalled === void 0 ? void 0 : onInstalled();
        })
            .catch((err) => {
            // Debug logging is diagnostic: never let a failure here surface as an
            // unhandled rejection. `void` does not consume a chained `.then`'s rejection.
            console.warn('[ScanditLogger] could not install the native log receiver:', err);
        })
            .finally(() => {
            installing = false;
        });
    });
    return () => {
        disposed = true;
        disposeGate();
        installedTeardown === null || installedTeardown === void 0 ? void 0 : installedTeardown();
    };
}

/**
 * Open the persistent native→TS log-batch channel on frameworks whose bridge
 * requires an explicit `isEventRegistration: true` call before the native
 * side will deliver events at all (Cordova: `CordovaEventEmitter.emit` is a
 * no-op until `registerCallback` has run for the event name — see
 * `CordovaEventEmitter.kt`/`.swift`). RN and Capacitor don't need this: their
 * bridges deliver native events without a dedicated subscribe call.
 *
 * This stays a SEPARATE opt-in from `installNativeLogReceiver` — folding the
 * two together would add a native call on every framework, not just the ones
 * that need it.
 *
 * `registerCoreProxies` is the only caller: it runs this after
 * `installNativeLogReceiver` has attached its `ScanditLogger.batch` handler and
 * called `proxy.subscribeForEvents(...)`, so the TS-side plumbing is ready
 * before native starts delivering, and only for providers that declare
 * `requiresNativeLogChannel`.
 *
 * Never throws — a failure here must not block SDK init. Mirrors
 * `installNativeLogReceiver`'s `console.warn` handling.
 */
function subscribeNativeLogChannel(proxy) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield callCore(proxy, {
                moduleName: 'CoreModule',
                methodName: 'subscribeLoggerListener',
                isEventRegistration: true,
            });
        }
        catch (err) {
            console.warn('[ScanditLogger] could not subscribe to native log channel:', err);
        }
    });
}

/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */
// THIS FILE IS GENERATED. DO NOT EDIT MANUALLY.
// Generator: scripts/bridge_generator/generate.py
// Schema: scripts/bridge_generator/schemas/core.json
/**
 * Per-method `LogRecord` level and category overrides for the CoreProxy
 * bridge surface. Consumed by the centralized `ScanditLogger` interceptor:
 * per-frame / per-scan callbacks log at `Trace` under their category label, so
 * they only show once the level is raised to `Trace`.
 *
 * Auto-registered as a side effect of importing this module via the
 * generated `index.ts` barrel — no customer wiring required.
 */
const CORE_PROXY_LOG_METADATA = {};
ScanditLogger.registerMethodMetadata(CORE_PROXY_LOG_METADATA);

/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */
// THIS FILE IS GENERATED. DO NOT EDIT MANUALLY.
// Generator: scripts/bridge_generator/generate.py
// Schema: scripts/bridge_generator/schemas/core.json
//
// Typed interfaces + throwing parse<Type> validators derived from the
// serialization JSON schemas referenced by this module's bridge params.
// No runtime dependency: validation is hand-rolled below, not zod/ajv.
//
// parse<Type> enforces only the JSON Schema keywords expressible without a
// schema engine: required, type, enum, string const, additionalProperties,
// null-ness, and root-level oneOf (dispatched on the discriminator to the
// matching variant's parser).
// NOT enforced — a payload violating one of these still parses:
//   pattern, minimum/maximum, minLength/maxLength, multipleOf, and
//   property-level oneOf of more than one non-null variant (those
//   properties are typed `unknown` and left unvalidated).
const ALLOWED_KEYS_PIXEL_POINT = new Set(['x', 'y']);
function parsePixelPoint(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('PixelPoint: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_PIXEL_POINT.has(key)) {
            throw new Error(`PixelPoint: unknown property '${key}'`);
        }
    }
    let xValue = obj['x'];
    if (xValue === undefined) {
        throw new Error("PixelPoint: missing required property 'x'");
    }
    else if (xValue !== null) {
        if (typeof xValue !== 'number') {
            throw new Error('PixelPoint.x: expected a number');
        }
    }
    else {
        throw new Error('PixelPoint.x: null is not allowed');
    }
    let yValue = obj['y'];
    if (yValue === undefined) {
        throw new Error("PixelPoint: missing required property 'y'");
    }
    else if (yValue !== null) {
        if (typeof yValue !== 'number') {
            throw new Error('PixelPoint.y: expected a number');
        }
    }
    else {
        throw new Error('PixelPoint.y: null is not allowed');
    }
    return {
        x: xValue,
        y: yValue,
    };
}
const ALLOWED_KEYS_PIXEL_QUADRILATERAL = new Set(['topLeft', 'topRight', 'bottomRight', 'bottomLeft']);
function parsePixelQuadrilateral(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('PixelQuadrilateral: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_PIXEL_QUADRILATERAL.has(key)) {
            throw new Error(`PixelQuadrilateral: unknown property '${key}'`);
        }
    }
    let topLeftValue = obj['topLeft'];
    if (topLeftValue === undefined) {
        throw new Error("PixelQuadrilateral: missing required property 'topLeft'");
    }
    else if (topLeftValue !== null) {
        topLeftValue = parsePixelPoint(topLeftValue);
    }
    else {
        throw new Error('PixelQuadrilateral.topLeft: null is not allowed');
    }
    let topRightValue = obj['topRight'];
    if (topRightValue === undefined) {
        throw new Error("PixelQuadrilateral: missing required property 'topRight'");
    }
    else if (topRightValue !== null) {
        topRightValue = parsePixelPoint(topRightValue);
    }
    else {
        throw new Error('PixelQuadrilateral.topRight: null is not allowed');
    }
    let bottomRightValue = obj['bottomRight'];
    if (bottomRightValue === undefined) {
        throw new Error("PixelQuadrilateral: missing required property 'bottomRight'");
    }
    else if (bottomRightValue !== null) {
        bottomRightValue = parsePixelPoint(bottomRightValue);
    }
    else {
        throw new Error('PixelQuadrilateral.bottomRight: null is not allowed');
    }
    let bottomLeftValue = obj['bottomLeft'];
    if (bottomLeftValue === undefined) {
        throw new Error("PixelQuadrilateral: missing required property 'bottomLeft'");
    }
    else if (bottomLeftValue !== null) {
        bottomLeftValue = parsePixelPoint(bottomLeftValue);
    }
    else {
        throw new Error('PixelQuadrilateral.bottomLeft: null is not allowed');
    }
    return {
        topLeft: topLeftValue,
        topRight: topRightValue,
        bottomRight: bottomRightValue,
        bottomLeft: bottomLeftValue,
    };
}
const ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_STATE = [
    'on',
    'off',
    'starting',
    'stopping',
    'standby',
    'bootingUp',
    'wakingUp',
    'goingToSleep',
    'shuttingDown',
];
const ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_CAMERA_POSITION = ['worldFacing', 'userFacing', 'unspecified'];
const ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_EVENT = ['FrameSourceListener.onStateChanged'];
const ALLOWED_KEYS_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED = new Set(['state', 'cameraPosition', 'event']);
function parseFrameSourceListenerOnStateChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('FrameSourceListenerOnStateChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED.has(key)) {
            throw new Error(`FrameSourceListenerOnStateChanged: unknown property '${key}'`);
        }
    }
    let stateValue = obj['state'];
    if (stateValue === undefined) {
        throw new Error("FrameSourceListenerOnStateChanged: missing required property 'state'");
    }
    else if (stateValue !== null) {
        if (!ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_STATE.includes(stateValue)) {
            throw new Error("FrameSourceListenerOnStateChanged.state: unknown enum value '" + String(stateValue) + "'");
        }
    }
    else {
        throw new Error('FrameSourceListenerOnStateChanged.state: null is not allowed');
    }
    let cameraPositionValue = obj['cameraPosition'];
    if (cameraPositionValue === undefined) {
        cameraPositionValue = undefined;
    }
    else if (cameraPositionValue !== null) {
        if (!ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_CAMERA_POSITION.includes(cameraPositionValue)) {
            throw new Error("FrameSourceListenerOnStateChanged.cameraPosition: unknown enum value '" + String(cameraPositionValue) + "'");
        }
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("FrameSourceListenerOnStateChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_FRAME_SOURCE_LISTENER_ON_STATE_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("FrameSourceListenerOnStateChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('FrameSourceListenerOnStateChanged.event: null is not allowed');
    }
    return {
        state: stateValue,
        cameraPosition: cameraPositionValue,
        event: eventValue,
    };
}
const ENUM_VALUES_TORCH_LISTENER_ON_TORCH_STATE_CHANGED_STATE = ['on', 'off', 'auto'];
const ENUM_VALUES_TORCH_LISTENER_ON_TORCH_STATE_CHANGED_EVENT = ['TorchListener.onTorchStateChanged'];
const ALLOWED_KEYS_TORCH_LISTENER_ON_TORCH_STATE_CHANGED = new Set(['state', 'event']);
function parseTorchListenerOnTorchStateChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('TorchListenerOnTorchStateChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_TORCH_LISTENER_ON_TORCH_STATE_CHANGED.has(key)) {
            throw new Error(`TorchListenerOnTorchStateChanged: unknown property '${key}'`);
        }
    }
    let stateValue = obj['state'];
    if (stateValue === undefined) {
        throw new Error("TorchListenerOnTorchStateChanged: missing required property 'state'");
    }
    else if (stateValue !== null) {
        if (!ENUM_VALUES_TORCH_LISTENER_ON_TORCH_STATE_CHANGED_STATE.includes(stateValue)) {
            throw new Error("TorchListenerOnTorchStateChanged.state: unknown enum value '" + String(stateValue) + "'");
        }
    }
    else {
        throw new Error('TorchListenerOnTorchStateChanged.state: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("TorchListenerOnTorchStateChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_TORCH_LISTENER_ON_TORCH_STATE_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("TorchListenerOnTorchStateChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('TorchListenerOnTorchStateChanged.event: null is not allowed');
    }
    return {
        state: stateValue,
        event: eventValue,
    };
}
const ENUM_VALUES_ZOOM_LISTENER_ON_ZOOM_LEVEL_CHANGED_EVENT = ['ZoomListener.onZoomLevelChanged'];
const ALLOWED_KEYS_ZOOM_LISTENER_ON_ZOOM_LEVEL_CHANGED = new Set(['oldZoomLevel', 'newZoomLevel', 'event']);
function parseZoomListenerOnZoomLevelChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('ZoomListenerOnZoomLevelChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_ZOOM_LISTENER_ON_ZOOM_LEVEL_CHANGED.has(key)) {
            throw new Error(`ZoomListenerOnZoomLevelChanged: unknown property '${key}'`);
        }
    }
    let oldZoomLevelValue = obj['oldZoomLevel'];
    if (oldZoomLevelValue === undefined) {
        throw new Error("ZoomListenerOnZoomLevelChanged: missing required property 'oldZoomLevel'");
    }
    else if (oldZoomLevelValue !== null) {
        if (typeof oldZoomLevelValue !== 'number') {
            throw new Error('ZoomListenerOnZoomLevelChanged.oldZoomLevel: expected a number');
        }
    }
    else {
        throw new Error('ZoomListenerOnZoomLevelChanged.oldZoomLevel: null is not allowed');
    }
    let newZoomLevelValue = obj['newZoomLevel'];
    if (newZoomLevelValue === undefined) {
        throw new Error("ZoomListenerOnZoomLevelChanged: missing required property 'newZoomLevel'");
    }
    else if (newZoomLevelValue !== null) {
        if (typeof newZoomLevelValue !== 'number') {
            throw new Error('ZoomListenerOnZoomLevelChanged.newZoomLevel: expected a number');
        }
    }
    else {
        throw new Error('ZoomListenerOnZoomLevelChanged.newZoomLevel: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("ZoomListenerOnZoomLevelChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_ZOOM_LISTENER_ON_ZOOM_LEVEL_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("ZoomListenerOnZoomLevelChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('ZoomListenerOnZoomLevelChanged.event: null is not allowed');
    }
    return {
        oldZoomLevel: oldZoomLevelValue,
        newZoomLevel: newZoomLevelValue,
        event: eventValue,
    };
}
const ENUM_VALUES_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED_MACRO_MODE = ['on', 'off', 'auto'];
const ENUM_VALUES_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED_EVENT = ['MacroModeListener.onMacroModeChanged'];
const ALLOWED_KEYS_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED = new Set(['macroMode', 'event']);
function parseMacroModeListenerOnMacroModeChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('MacroModeListenerOnMacroModeChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED.has(key)) {
            throw new Error(`MacroModeListenerOnMacroModeChanged: unknown property '${key}'`);
        }
    }
    let macroModeValue = obj['macroMode'];
    if (macroModeValue === undefined) {
        throw new Error("MacroModeListenerOnMacroModeChanged: missing required property 'macroMode'");
    }
    else if (macroModeValue !== null) {
        if (!ENUM_VALUES_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED_MACRO_MODE.includes(macroModeValue)) {
            throw new Error("MacroModeListenerOnMacroModeChanged.macroMode: unknown enum value '" + String(macroModeValue) + "'");
        }
    }
    else {
        throw new Error('MacroModeListenerOnMacroModeChanged.macroMode: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("MacroModeListenerOnMacroModeChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_MACRO_MODE_LISTENER_ON_MACRO_MODE_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("MacroModeListenerOnMacroModeChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('MacroModeListenerOnMacroModeChanged.event: null is not allowed');
    }
    return {
        macroMode: macroModeValue,
        event: eventValue,
    };
}
const ENUM_VALUES_DATA_CAPTURE_CONTEXT_LISTENER_ON_OBSERVATION_STARTED_EVENT = [
    'DataCaptureContextListener.onObservationStarted',
];
const ALLOWED_KEYS_DATA_CAPTURE_CONTEXT_LISTENER_ON_OBSERVATION_STARTED = new Set(['licenseInfo', 'event']);
function parseDataCaptureContextListenerOnObservationStarted(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('DataCaptureContextListenerOnObservationStarted: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_DATA_CAPTURE_CONTEXT_LISTENER_ON_OBSERVATION_STARTED.has(key)) {
            throw new Error(`DataCaptureContextListenerOnObservationStarted: unknown property '${key}'`);
        }
    }
    let licenseInfoValue = obj['licenseInfo'];
    if (licenseInfoValue === undefined) {
        throw new Error("DataCaptureContextListenerOnObservationStarted: missing required property 'licenseInfo'");
    }
    else if (licenseInfoValue !== null) {
        if (typeof licenseInfoValue !== 'string') {
            throw new Error('DataCaptureContextListenerOnObservationStarted.licenseInfo: expected a string');
        }
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("DataCaptureContextListenerOnObservationStarted: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_DATA_CAPTURE_CONTEXT_LISTENER_ON_OBSERVATION_STARTED_EVENT.includes(eventValue)) {
            throw new Error("DataCaptureContextListenerOnObservationStarted.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('DataCaptureContextListenerOnObservationStarted.event: null is not allowed');
    }
    return {
        licenseInfo: licenseInfoValue,
        event: eventValue,
    };
}
const ENUM_VALUES_DATA_CAPTURE_CONTEXT_LISTENER_ON_STATUS_CHANGED_EVENT = [
    'DataCaptureContextListener.onStatusChanged',
];
const ALLOWED_KEYS_DATA_CAPTURE_CONTEXT_LISTENER_ON_STATUS_CHANGED = new Set(['status', 'event']);
function parseDataCaptureContextListenerOnStatusChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('DataCaptureContextListenerOnStatusChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_DATA_CAPTURE_CONTEXT_LISTENER_ON_STATUS_CHANGED.has(key)) {
            throw new Error(`DataCaptureContextListenerOnStatusChanged: unknown property '${key}'`);
        }
    }
    let statusValue = obj['status'];
    if (statusValue === undefined) {
        throw new Error("DataCaptureContextListenerOnStatusChanged: missing required property 'status'");
    }
    else if (statusValue !== null) {
        if (typeof statusValue !== 'string') {
            throw new Error('DataCaptureContextListenerOnStatusChanged.status: expected a string');
        }
    }
    else {
        throw new Error('DataCaptureContextListenerOnStatusChanged.status: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("DataCaptureContextListenerOnStatusChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_DATA_CAPTURE_CONTEXT_LISTENER_ON_STATUS_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("DataCaptureContextListenerOnStatusChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('DataCaptureContextListenerOnStatusChanged.event: null is not allowed');
    }
    return {
        status: statusValue,
        event: eventValue,
    };
}
const ENUM_VALUES_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_ORIENTATION = [
    'unknown',
    'portrait',
    'portraitUpsideDown',
    'landscapeLeft',
    'landscapeRight',
];
const ENUM_VALUES_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_EVENT = ['DataCaptureViewListener.onSizeChanged'];
const ALLOWED_KEYS_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED = new Set(['viewId', 'size', 'orientation', 'event']);
function parseDataCaptureViewListenerOnSizeChanged(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('DataCaptureViewListenerOnSizeChanged: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED.has(key)) {
            throw new Error(`DataCaptureViewListenerOnSizeChanged: unknown property '${key}'`);
        }
    }
    let viewIdValue = obj['viewId'];
    if (viewIdValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChanged: missing required property 'viewId'");
    }
    else if (viewIdValue !== null) {
        if (typeof viewIdValue !== 'number') {
            throw new Error('DataCaptureViewListenerOnSizeChanged.viewId: expected a number');
        }
        if (!Number.isInteger(viewIdValue)) {
            throw new Error('DataCaptureViewListenerOnSizeChanged.viewId: expected an integer');
        }
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChanged.viewId: null is not allowed');
    }
    let sizeValue = obj['size'];
    if (sizeValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChanged: missing required property 'size'");
    }
    else if (sizeValue !== null) {
        sizeValue = parseDataCaptureViewListenerOnSizeChangedSize(sizeValue);
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChanged.size: null is not allowed');
    }
    let orientationValue = obj['orientation'];
    if (orientationValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChanged: missing required property 'orientation'");
    }
    else if (orientationValue !== null) {
        if (!ENUM_VALUES_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_ORIENTATION.includes(orientationValue)) {
            throw new Error("DataCaptureViewListenerOnSizeChanged.orientation: unknown enum value '" + String(orientationValue) + "'");
        }
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChanged.orientation: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChanged: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_EVENT.includes(eventValue)) {
            throw new Error("DataCaptureViewListenerOnSizeChanged.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChanged.event: null is not allowed');
    }
    return {
        viewId: viewIdValue,
        size: sizeValue,
        orientation: orientationValue,
        event: eventValue,
    };
}
const ALLOWED_KEYS_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_SIZE = new Set(['width', 'height']);
function parseDataCaptureViewListenerOnSizeChangedSize(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('DataCaptureViewListenerOnSizeChangedSize: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_DATA_CAPTURE_VIEW_LISTENER_ON_SIZE_CHANGED_SIZE.has(key)) {
            throw new Error(`DataCaptureViewListenerOnSizeChangedSize: unknown property '${key}'`);
        }
    }
    let widthValue = obj['width'];
    if (widthValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChangedSize: missing required property 'width'");
    }
    else if (widthValue !== null) {
        if (typeof widthValue !== 'number') {
            throw new Error('DataCaptureViewListenerOnSizeChangedSize.width: expected a number');
        }
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChangedSize.width: null is not allowed');
    }
    let heightValue = obj['height'];
    if (heightValue === undefined) {
        throw new Error("DataCaptureViewListenerOnSizeChangedSize: missing required property 'height'");
    }
    else if (heightValue !== null) {
        if (typeof heightValue !== 'number') {
            throw new Error('DataCaptureViewListenerOnSizeChangedSize.height: expected a number');
        }
    }
    else {
        throw new Error('DataCaptureViewListenerOnSizeChangedSize.height: null is not allowed');
    }
    return {
        width: widthValue,
        height: heightValue,
    };
}
const ENUM_VALUES_FOCUS_GESTURE_LISTENER_ON_FOCUS_GESTURE_EVENT = ['FocusGestureListener.onFocusGesture'];
const ALLOWED_KEYS_FOCUS_GESTURE_LISTENER_ON_FOCUS_GESTURE = new Set(['viewId', 'focusGesture', 'point', 'event']);
function parseFocusGestureListenerOnFocusGesture(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('FocusGestureListenerOnFocusGesture: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_FOCUS_GESTURE_LISTENER_ON_FOCUS_GESTURE.has(key)) {
            throw new Error(`FocusGestureListenerOnFocusGesture: unknown property '${key}'`);
        }
    }
    let viewIdValue = obj['viewId'];
    if (viewIdValue === undefined) {
        throw new Error("FocusGestureListenerOnFocusGesture: missing required property 'viewId'");
    }
    else if (viewIdValue !== null) {
        if (typeof viewIdValue !== 'number') {
            throw new Error('FocusGestureListenerOnFocusGesture.viewId: expected a number');
        }
        if (!Number.isInteger(viewIdValue)) {
            throw new Error('FocusGestureListenerOnFocusGesture.viewId: expected an integer');
        }
    }
    else {
        throw new Error('FocusGestureListenerOnFocusGesture.viewId: null is not allowed');
    }
    let focusGestureValue = obj['focusGesture'];
    if (focusGestureValue === undefined) {
        throw new Error("FocusGestureListenerOnFocusGesture: missing required property 'focusGesture'");
    }
    else if (focusGestureValue !== null) {
        if (typeof focusGestureValue !== 'string') {
            throw new Error('FocusGestureListenerOnFocusGesture.focusGesture: expected a string');
        }
    }
    else {
        throw new Error('FocusGestureListenerOnFocusGesture.focusGesture: null is not allowed');
    }
    let pointValue = obj['point'];
    if (pointValue === undefined) {
        throw new Error("FocusGestureListenerOnFocusGesture: missing required property 'point'");
    }
    else if (pointValue !== null) {
        if (typeof pointValue !== 'string') {
            throw new Error('FocusGestureListenerOnFocusGesture.point: expected a string');
        }
    }
    else {
        throw new Error('FocusGestureListenerOnFocusGesture.point: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("FocusGestureListenerOnFocusGesture: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_FOCUS_GESTURE_LISTENER_ON_FOCUS_GESTURE_EVENT.includes(eventValue)) {
            throw new Error("FocusGestureListenerOnFocusGesture.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('FocusGestureListenerOnFocusGesture.event: null is not allowed');
    }
    return {
        viewId: viewIdValue,
        focusGesture: focusGestureValue,
        point: pointValue,
        event: eventValue,
    };
}
const ENUM_VALUES_ZOOM_GESTURE_LISTENER_ON_ZOOM_IN_GESTURE_EVENT = ['ZoomGestureListener.onZoomInGesture'];
const ALLOWED_KEYS_ZOOM_GESTURE_LISTENER_ON_ZOOM_IN_GESTURE = new Set(['viewId', 'zoomGesture', 'event']);
function parseZoomGestureListenerOnZoomInGesture(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('ZoomGestureListenerOnZoomInGesture: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_ZOOM_GESTURE_LISTENER_ON_ZOOM_IN_GESTURE.has(key)) {
            throw new Error(`ZoomGestureListenerOnZoomInGesture: unknown property '${key}'`);
        }
    }
    let viewIdValue = obj['viewId'];
    if (viewIdValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomInGesture: missing required property 'viewId'");
    }
    else if (viewIdValue !== null) {
        if (typeof viewIdValue !== 'number') {
            throw new Error('ZoomGestureListenerOnZoomInGesture.viewId: expected a number');
        }
        if (!Number.isInteger(viewIdValue)) {
            throw new Error('ZoomGestureListenerOnZoomInGesture.viewId: expected an integer');
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomInGesture.viewId: null is not allowed');
    }
    let zoomGestureValue = obj['zoomGesture'];
    if (zoomGestureValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomInGesture: missing required property 'zoomGesture'");
    }
    else if (zoomGestureValue !== null) {
        if (typeof zoomGestureValue !== 'string') {
            throw new Error('ZoomGestureListenerOnZoomInGesture.zoomGesture: expected a string');
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomInGesture.zoomGesture: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomInGesture: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_ZOOM_GESTURE_LISTENER_ON_ZOOM_IN_GESTURE_EVENT.includes(eventValue)) {
            throw new Error("ZoomGestureListenerOnZoomInGesture.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomInGesture.event: null is not allowed');
    }
    return {
        viewId: viewIdValue,
        zoomGesture: zoomGestureValue,
        event: eventValue,
    };
}
const ENUM_VALUES_ZOOM_GESTURE_LISTENER_ON_ZOOM_OUT_GESTURE_EVENT = ['ZoomGestureListener.onZoomOutGesture'];
const ALLOWED_KEYS_ZOOM_GESTURE_LISTENER_ON_ZOOM_OUT_GESTURE = new Set(['viewId', 'zoomGesture', 'event']);
function parseZoomGestureListenerOnZoomOutGesture(raw) {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new Error('ZoomGestureListenerOnZoomOutGesture: expected an object');
    }
    const obj = raw;
    for (const key of Object.keys(obj)) {
        if (!ALLOWED_KEYS_ZOOM_GESTURE_LISTENER_ON_ZOOM_OUT_GESTURE.has(key)) {
            throw new Error(`ZoomGestureListenerOnZoomOutGesture: unknown property '${key}'`);
        }
    }
    let viewIdValue = obj['viewId'];
    if (viewIdValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomOutGesture: missing required property 'viewId'");
    }
    else if (viewIdValue !== null) {
        if (typeof viewIdValue !== 'number') {
            throw new Error('ZoomGestureListenerOnZoomOutGesture.viewId: expected a number');
        }
        if (!Number.isInteger(viewIdValue)) {
            throw new Error('ZoomGestureListenerOnZoomOutGesture.viewId: expected an integer');
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomOutGesture.viewId: null is not allowed');
    }
    let zoomGestureValue = obj['zoomGesture'];
    if (zoomGestureValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomOutGesture: missing required property 'zoomGesture'");
    }
    else if (zoomGestureValue !== null) {
        if (typeof zoomGestureValue !== 'string') {
            throw new Error('ZoomGestureListenerOnZoomOutGesture.zoomGesture: expected a string');
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomOutGesture.zoomGesture: null is not allowed');
    }
    let eventValue = obj['event'];
    if (eventValue === undefined) {
        throw new Error("ZoomGestureListenerOnZoomOutGesture: missing required property 'event'");
    }
    else if (eventValue !== null) {
        if (!ENUM_VALUES_ZOOM_GESTURE_LISTENER_ON_ZOOM_OUT_GESTURE_EVENT.includes(eventValue)) {
            throw new Error("ZoomGestureListenerOnZoomOutGesture.event: unknown enum value '" + String(eventValue) + "'");
        }
    }
    else {
        throw new Error('ZoomGestureListenerOnZoomOutGesture.event: null is not allowed');
    }
    return {
        viewId: viewIdValue,
        zoomGesture: zoomGestureValue,
        event: eventValue,
    };
}

function createTolerantPayloadParser(logPrefix) {
    // Warn-once keys per event, so a repeating malformed payload costs one log line, not one per frame.
    const warnedSchemaValidationEvents = new Set();
    return {
        parsePayloadTolerantly(raw, strict, fallback, eventName) {
            try {
                return strict(raw);
            }
            catch (error) {
                if (!warnedSchemaValidationEvents.has(eventName)) {
                    warnedSchemaValidationEvents.add(eventName);
                    console.warn(`${logPrefix} ${eventName}: payload failed schema validation, falling back to tolerant parsing: ${String(error)}`);
                }
                return fallback(raw);
            }
        },
        resetWarnings() {
            warnedSchemaValidationEvents.clear();
        },
    };
}

const tolerantParser$2 = createTolerantPayloadParser('DataCaptureContextController');
var DataCaptureContextEvents;
(function (DataCaptureContextEvents) {
    DataCaptureContextEvents["didChangeStatus"] = "DataCaptureContextListener.onStatusChanged";
    DataCaptureContextEvents["didStartObservingContext"] = "DataCaptureContextListener.onObservationStarted";
    // Listed because the generated SubscribeContextListenerCommand registers the native callback
    // for every name in the schema's event list, and on Cordova that registration is the gate: an
    // unlisted name reaches notifyListeners with no handler and warns. Ignored here.
    DataCaptureContextEvents["didChangeFrameSource"] = "DataCaptureContextListener.onFrameSourceChanged";
})(DataCaptureContextEvents || (DataCaptureContextEvents = {}));
class DataCaptureContextController extends BaseController {
    get framework() {
        return this._proxy.framework;
    }
    get frameworkVersion() {
        return this._proxy.frameworkVersion;
    }
    static getOpenSourceSoftwareLicenseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const proxy = FactoryMaker.getInstance('CoreProxy');
            if (!proxy) {
                return new OpenSourceSoftwareLicenseInfo('Unable to load the open source software license info.');
            }
            const adapter = new CoreProxyAdapter(proxy);
            const result = yield adapter.getOpenSourceSoftwareLicenseInfo();
            return new OpenSourceSoftwareLicenseInfo(result);
        });
    }
    constructor(listener) {
        super('DataCaptureContextProxy');
        this._listenerRegistered = false;
        this.adapter = new CoreProxyAdapter(this._proxy);
        this.listener = listener;
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._listenerRegistered) {
                return;
            }
            yield this.adapter.subscribeContextListener();
            this._proxy.subscribeForEvents(Object.values(DataCaptureContextEvents));
            this._proxy.eventEmitter.on(DataCaptureContextEvents.didChangeStatus, this.handleDidChangeStatusEvent.bind(this));
            this._proxy.eventEmitter.on(DataCaptureContextEvents.didStartObservingContext, this.handleDidStartObservingContextEvent.bind(this));
            this._proxy.eventEmitter.on(DataCaptureContextEvents.didChangeFrameSource, this.handleDidChangeFrameSourceEvent.bind(this));
            this._listenerRegistered = true;
        });
    }
    updateContextFromJson(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.updateContextFromJson({ contextJson: JSON.stringify(context) });
        });
    }
    addModeToContext(mode) {
        return this.adapter.addModeToContext({ modeJson: JSON.stringify(mode) });
    }
    removeModeFromContext(mode) {
        return this.adapter.removeModeFromContext({ modeJson: JSON.stringify(mode) });
    }
    removeAllModesFromContext() {
        return this.adapter.removeAllModes();
    }
    dispose() {
        void this.unsubscribeListener();
        void this.adapter.disposeContext();
        this._proxy.dispose();
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._listenerRegistered) {
                return;
            }
            yield this.adapter.unsubscribeContextListener();
            this._proxy.unsubscribeFromEvents(Object.values(DataCaptureContextEvents));
            this._proxy.eventEmitter.off(DataCaptureContextEvents.didChangeStatus, this.handleDidChangeStatusEvent.bind(this));
            this._proxy.eventEmitter.off(DataCaptureContextEvents.didStartObservingContext, this.handleDidStartObservingContextEvent.bind(this));
            this._proxy.eventEmitter.off(DataCaptureContextEvents.didChangeFrameSource, this.handleDidChangeFrameSourceEvent.bind(this));
            this._listenerRegistered = false;
        });
    }
    createContextFromJson(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.createContextFromJson({ contextJson: JSON.stringify(context) });
        });
    }
    handleDidChangeStatusEvent(eventPayload) {
        const cast = EventDataParser.parseIfShouldHandle(eventPayload, {});
        if (cast === SKIP) {
            return;
        }
        if (cast === null) {
            console.error('DataCaptureContextController didChangeStatus payload is null');
            return;
        }
        const event = tolerantParser$2.parsePayloadTolerantly(cast, parseDataCaptureContextListenerOnStatusChanged, map => {
            // `status` is an embedded JSON string decoded below via JSON.parse -- a non-string must
            // decline BEFORE the decode, not throw out of this handler (SDC-32670).
            if (typeof map.status !== 'string') {
                return null;
            }
            return {
                status: map.status,
                event: DataCaptureContextEvents.didChangeStatus,
            };
        }, 'didChangeStatus');
        if (event === null) {
            return;
        }
        // The tolerant parse guarantees `status` is a string, not that it holds valid JSON -- decode
        // failures must not throw out of this handler. Flutter's `_handleStatusChanged` guards the
        // same decode (SDC-32670).
        let contextStatus;
        try {
            contextStatus = ContextStatus['fromJSON'](JSON.parse(event.status));
        }
        catch (error) {
            console.warn(`DataCaptureContextController didChangeStatus: undecodable status: ${String(error)}`);
            return;
        }
        this.reportStatus(contextStatus);
    }
    // Deliberately empty: jsmobile keeps its own frame-source state in CameraSwitchControlController.
    // The handler exists so the event has a consumer.
    handleDidChangeFrameSourceEvent() { }
    // `licenseInfo` is wire-present on this event (both natives emit it) but unconsumed by
    // jsmobile -- only Flutter reads it. Adding a consumer here would be new public API and is out
    // of scope for SDC-32670; parsed here only so a malformed payload is caught, not silently used.
    handleDidStartObservingContextEvent(eventPayload) {
        // The payload is parsed for validation only; nothing here reads it (see comment above). This
        // callback signals that the context is live, so no payload problem may suppress it -- an app
        // waiting on a callback that never arrives has no way to notice. `SKIP` is the one case that
        // must still suppress, because it means the event belongs to a different view/mode.
        try {
            const cast = EventDataParser.parseIfShouldHandle(eventPayload, {});
            if (cast === SKIP) {
                return;
            }
            if (cast !== null) {
                tolerantParser$2.parsePayloadTolerantly(cast, parseDataCaptureContextListenerOnObservationStarted, map => {
                    // `licenseInfo` is legitimately null on both natives -- do not require it, only reject
                    // a wrong-typed value (SDC-32670).
                    const rawLicenseInfo = map.licenseInfo;
                    if (rawLicenseInfo !== null && rawLicenseInfo !== undefined && typeof rawLicenseInfo !== 'string') {
                        return null;
                    }
                    // Positive `typeof` narrowing rather than `?? null`: narrowing an `unknown` by a
                    // negative guard does not survive into the object literal on the DebugApp's tsc, which
                    // then sees `unknown` and fails TS2345.
                    const licenseInfo = typeof rawLicenseInfo === 'string' ? rawLicenseInfo : null;
                    return {
                        licenseInfo,
                        event: DataCaptureContextEvents.didStartObservingContext,
                    };
                }, 'didStartObservingContext');
            }
        }
        catch (error) {
            console.warn(`DataCaptureContextController didStartObservingContext: unparsable payload: ${String(error)}`);
        }
        this.listener.didStartObservingContext();
    }
    reportStatus(contextStatus) {
        this.listener.didChangeStatus(contextStatus);
    }
}

const modeBaseBrand = Symbol('ModeBase');
function isModeBase(value) {
    return (typeof value === 'object' && value !== null && value[modeBaseBrand] === true);
}

class DataCaptureContext extends DefaultSerializeable {
    static get sharedInstance() {
        if (DataCaptureContext._instance == null) {
            DataCaptureContext._instance = new DataCaptureContext('', '', null);
        }
        return DataCaptureContext._instance;
    }
    static getOpenSourceSoftwareLicenseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return DataCaptureContextController.getOpenSourceSoftwareLicenseInfo();
        });
    }
    static get coreDefaults() {
        return getCoreDefaults();
    }
    get frameSource() {
        return this._frameSource;
    }
    static get deviceID() {
        return DataCaptureContext.coreDefaults.deviceID;
    }
    static forLicenseKey(licenseKey) {
        const instance = DataCaptureContext.create(licenseKey, null, null);
        // Call initialize to ensure the shared instance is updated.
        void instance.createNativeContext();
        return instance;
    }
    static forLicenseKeyWithSettings(licenseKey, settings) {
        const instance = DataCaptureContext.create(licenseKey, null, settings);
        // Call initialize to ensure the shared instance is updated.
        void instance.createNativeContext();
        return instance;
    }
    static forLicenseKeyWithOptions(licenseKey, options) {
        const instance = DataCaptureContext.create(licenseKey, options, null);
        // Call initialize to ensure the shared instance is updated.
        void instance.createNativeContext();
        return instance;
    }
    static initialize(licenseKey, options = null, settings = null) {
        DataCaptureContext.create(licenseKey, options, settings);
        void DataCaptureContext.sharedInstance.createNativeContext();
        return DataCaptureContext.sharedInstance;
    }
    static create(licenseKey, options, settings) {
        DataCaptureContext.sharedInstance.licenseKey = licenseKey;
        DataCaptureContext.sharedInstance.deviceName = (options === null || options === void 0 ? void 0 : options.deviceName) || '';
        DataCaptureContext.sharedInstance.settings = settings || new DataCaptureContextSettings();
        return DataCaptureContext.sharedInstance;
    }
    constructor(licenseKey, deviceName, settings) {
        super();
        this.licenseKey = licenseKey;
        this.deviceName = deviceName;
        this._framework = 'unknown';
        this._frameworkVersion = 'unknown';
        this.settings = new DataCaptureContextSettings();
        this._frameSource = null;
        this.view = null;
        this.modes = [];
        this.listeners = [];
        this.licenseKey = licenseKey;
        this.deviceName = deviceName;
        if (settings) {
            this.settings = settings;
        }
        if (this.controller == null) {
            this.controller = new DataCaptureContextController({
                didChangeStatus: contextStatus => this.notifyListenersOfDidChangeStatus(contextStatus),
                didStartObservingContext: () => this.notifyListenersOfDidStartObservingContext(),
            });
            this._framework = this.controller.framework;
            this._frameworkVersion = this.controller.frameworkVersion;
        }
    }
    setFrameSource(frameSource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._frameSource) {
                this._frameSource.context = null;
            }
            this._frameSource = frameSource;
            if (frameSource) {
                // Set the flag to indicate that the native frame source is being created
                frameSource.setNativeFrameSourceIsBeingCreated();
            }
            yield this.update();
            // Make camera active once the set on native side is complete
            if (frameSource) {
                frameSource.context = this;
            }
        });
    }
    /**
     * Mirror a frame-source change that already occurred on the native side (e.g. a
     * CameraSwitchControl tap handled by the native camera switcher, which swaps the context's
     * active camera on its own). Repoints the TS-side frame source and active-context pointers
     * WITHOUT re-serializing to native — native is already in this state, so calling
     * setFrameSource() would trigger a redundant, and failing, swap.
     *
     * Private on purpose: framework-internal callers (CameraSwitchControl) reach it
     * through the PrivateDataCaptureContext cast, keeping it off the public SDK surface.
     */
    adoptActiveFrameSource(frameSource) {
        if (this._frameSource === frameSource) {
            return;
        }
        if (this._frameSource) {
            this._frameSource.context = null;
        }
        this._frameSource = frameSource;
        frameSource.context = this;
    }
    // Reached by BaseDataCaptureView through PrivateDataCaptureContext.
    attachView(view) {
        this.view = view;
    }
    addListener(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.listeners.length === 0) {
                yield this.controller.subscribeListener();
            }
            if (this.listeners.includes(listener)) {
                return;
            }
            this.listeners.push(listener);
        });
    }
    removeListener(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.listeners.includes(listener)) {
                return;
            }
            this.listeners.splice(this.listeners.indexOf(listener), 1);
            if (this.listeners.length === 0) {
                return this.controller.unsubscribeListener();
            }
        });
    }
    addMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addModeInternal(mode);
        });
    }
    setMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeAllModes();
            yield this.addModeInternal(mode);
        });
    }
    removeCurrentMode() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.modes.length === 0) {
                return;
            }
            if (this.modes.length > 1) {
                console.warn('removeCurrentMode() called with multiple modes active. Consider using removeMode() for specific mode removal. Only the first mode will be removed.');
            }
            yield this.removeModeInternal(this.modes[0]);
        });
    }
    removeMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeModeInternal(mode);
        });
    }
    removeAllModes() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.modes.length === 0) {
                return;
            }
            this.modes.forEach(mode => this.detachMode(mode));
            this.modes = [];
            yield this.controller.removeAllModesFromContext();
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.controller) {
                return;
            }
            (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
            yield this.removeAllModes();
            this.controller.dispose();
        });
    }
    applySettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = settings;
            yield this.update();
        });
    }
    notifyListenersOfDidChangeStatus(contextStatus) {
        this.listeners.forEach(listener => {
            if (listener.didChangeStatus) {
                listener.didChangeStatus(this, contextStatus);
            }
        });
    }
    notifyListenersOfDidStartObservingContext() {
        this.listeners.forEach(listener => {
            var _a;
            (_a = listener.didStartObservingContext) === null || _a === void 0 ? void 0 : _a.call(listener, this);
        });
    }
    createNativeContext() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.controller.createContextFromJson(this.toJSON());
            }
            catch (error) {
                this.notifyListenersOfNativeContextError(error);
                throw error;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.controller) {
                return;
            }
            try {
                yield this.controller.updateContextFromJson(this.toJSON());
            }
            catch (error) {
                this.notifyListenersOfNativeContextError(error);
                throw error;
            }
        });
    }
    // Serializing the context or native deserializing it failed; listeners learn of it as a status change.
    notifyListenersOfNativeContextError(error) {
        this.notifyListenersOfDidChangeStatus(ContextStatus['fromJSON']({
            message: error,
            code: -1,
            isValid: true,
        }));
    }
    addModeInternal(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.modes.includes(mode)) {
                this.modes.push(mode);
                if (isModeBase(mode)) {
                    mode.onStartAddingToContext(this);
                    try {
                        yield this.controller.addModeToContext(mode.toJSON());
                    }
                    catch (error) {
                        const index = this.modes.indexOf(mode);
                        if (index !== -1) {
                            this.modes.splice(index, 1);
                        }
                        mode.onFailedAddingToContext();
                        throw error;
                    }
                    mode.onAddedToContext();
                }
                else {
                    yield this.controller.addModeToContext(mode.toJSON());
                    mode._context = this;
                }
            }
        });
    }
    removeModeInternal(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.modes.indexOf(mode);
            if (index !== -1) {
                this.modes.splice(index, 1);
            }
            this.detachMode(mode);
            yield this.controller.removeModeFromContext(mode.toJSON());
        });
    }
    detachMode(mode) {
        if (isModeBase(mode)) {
            mode.onRemovedFromContext();
        }
        else {
            mode._context = null;
        }
    }
}
__decorate([
    ignoreFromSerialization
], DataCaptureContext.prototype, "controller", void 0);
__decorate([
    nameForSerialization('framework')
], DataCaptureContext.prototype, "_framework", void 0);
__decorate([
    nameForSerialization('frameworkVersion')
], DataCaptureContext.prototype, "_frameworkVersion", void 0);
__decorate([
    nameForSerialization('frameSource')
], DataCaptureContext.prototype, "_frameSource", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureContext.prototype, "view", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureContext.prototype, "modes", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureContext.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureContext, "_instance", void 0);
__decorate([
    ignoreFromSerialization
], DataCaptureContext, "coreDefaults", null);

var _a;
class ModeBase extends DefaultSerializeable {
    onStartAddingToContext(context) {
        var _b, _c;
        if (this.controller === null) {
            this.controller = this.createController();
        }
        if (this.listenerController === null) {
            this.listenerController = (_c = (_b = this.createListenerController) === null || _b === void 0 ? void 0 : _b.call(this)) !== null && _c !== void 0 ? _c : null;
        }
        this.created = new Promise(resolve => {
            this.resolveCreated = resolve;
        });
        this._context = context;
        this.state = 'creating';
    }
    onAddedToContext() {
        var _b;
        if (!this.resolveCreated) {
            console.error('onAddedToContext called without onStartAddingToContext being called first');
            return;
        }
        this.resolveCreated();
        this.resolveCreated = null;
        this.state = 'created';
        (_b = this.onCreated) === null || _b === void 0 ? void 0 : _b.call(this);
    }
    onFailedAddingToContext() {
        var _b;
        (_b = this.resolveCreated) === null || _b === void 0 ? void 0 : _b.call(this);
        this.resolveCreated = null;
        this.created = null;
        this.state = 'notCreated';
        this._context = null;
    }
    onRemovedFromContext() {
        var _b, _c;
        (_b = this.resolveCreated) === null || _b === void 0 ? void 0 : _b.call(this);
        this.resolveCreated = null;
        this.state = 'notCreated';
        this.created = null;
        this._context = null;
        (_c = this.listenerController) === null || _c === void 0 ? void 0 : _c.dispose();
        this.listenerController = null;
        if (!this.controller) {
            return;
        }
        this.controller.dispose();
        this.controller = null;
    }
    awaitCreation() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.created;
            while (this.state === 'creating') {
                yield this.created;
            }
            return this.state === 'created';
        });
    }
    withController(action, fallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.awaitCreation())) {
                this.logHeld();
                return fallback;
            }
            if (!this.controller) {
                this.logModeError('controller is not created');
                return fallback;
            }
            return action(this.controller);
        });
    }
    withListenerController(action, fallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.awaitCreation())) {
                this.logHeld();
                return fallback;
            }
            if (!this.listenerController) {
                this.logModeError('listener controller is not created');
                return fallback;
            }
            return action(this.listenerController);
        });
    }
    logHeld() {
        ScanditLogger.emit(LogLevel.Debug, LogCategory.Lifecycle, 'ts.mode', `${this.constructor.name}: held until it is added to a context`);
    }
    logModeError(detail) {
        const message = `${this.constructor.name}: ${detail}`;
        ScanditLogger.emit(LogLevel.Error, LogCategory.Lifecycle, 'ts.mode', message);
        if (ScanditLogger.getLevel() < LogLevel.Error) {
            console.error(message);
        }
    }
    get context() {
        return this._context;
    }
    constructor() {
        var _b, _c;
        super();
        this.state = 'notCreated';
        this.created = null;
        this.resolveCreated = null;
        this.modeId = Math.floor(Math.random() * 100000000);
        this.controller = null;
        this.listenerController = null;
        this._context = null;
        this[_a] = true;
        this.controller = this.createController();
        this.listenerController = (_c = (_b = this.createListenerController) === null || _b === void 0 ? void 0 : _b.call(this)) !== null && _c !== void 0 ? _c : null;
    }
}
_a = modeBaseBrand;
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "state", void 0);
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "created", void 0);
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "resolveCreated", void 0);
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "listenerController", void 0);
__decorate([
    ignoreFromSerialization
], ModeBase.prototype, "_context", void 0);

var VibrationType;
(function (VibrationType) {
    VibrationType["default"] = "default";
    VibrationType["selectionHaptic"] = "selectionHaptic";
    VibrationType["successHaptic"] = "successHaptic";
    VibrationType["failureHaptic"] = "failureHaptic";
    VibrationType["waveForm"] = "waveForm";
    VibrationType["impactHaptic"] = "impactHaptic";
})(VibrationType || (VibrationType = {}));

class Vibration extends DefaultSerializeable {
    static get defaultVibration() {
        return new Vibration(VibrationType.default);
    }
    static get selectionHapticFeedback() {
        return new Vibration(VibrationType.selectionHaptic);
    }
    static get successHapticFeedback() {
        return new Vibration(VibrationType.successHaptic);
    }
    static get failureHapticFeedback() {
        return new Vibration(VibrationType.failureHaptic);
    }
    static get impactHapticFeedback() {
        return new Vibration(VibrationType.impactHaptic);
    }
    static fromJSON(json) {
        if (json.type === 'waveForm') {
            return new WaveFormVibration(json.timings, json.amplitudes);
        }
        return new Vibration(json.type);
    }
    constructor(type) {
        super();
        this.type = type;
    }
}
class WaveFormVibration extends Vibration {
    get timings() {
        return this._timings;
    }
    get amplitudes() {
        return this._amplitudes;
    }
    constructor(timings, amplitudes = null) {
        super(VibrationType.waveForm);
        this._timings = timings;
        this._amplitudes = amplitudes;
    }
}
__decorate([
    nameForSerialization('timings')
], WaveFormVibration.prototype, "_timings", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('amplitudes')
], WaveFormVibration.prototype, "_amplitudes", void 0);

class Sound extends DefaultSerializeable {
    static get defaultSound() {
        return new Sound(null);
    }
    static fromJSON(json) {
        return new Sound(json.resource);
    }
    constructor(resource) {
        super();
        this.resource = null;
        this.resource = resource;
    }
}
__decorate([
    ignoreFromSerializationIfNull
], Sound.prototype, "resource", void 0);

class FeedbackController extends BaseController {
    constructor() {
        super('CoreProxy');
        this.adapter = new CoreProxyAdapter(this._proxy);
    }
    emitFeedback(feedback) {
        void this.adapter.emitFeedback({ feedbackJson: JSON.stringify(feedback) });
    }
    dispose() {
        this._proxy.dispose();
    }
}

class Feedback extends DefaultSerializeable {
    static get defaultFeedback() {
        return new Feedback(Vibration.defaultVibration, Sound.defaultSound);
    }
    get vibration() {
        return this._vibration;
    }
    get sound() {
        return this._sound;
    }
    static fromJSON(json) {
        return new Feedback((json === null || json === void 0 ? void 0 : json.vibration) ? Vibration.fromJSON(json.vibration) : null, (json === null || json === void 0 ? void 0 : json.sound) ? Sound.fromJSON(json.sound) : null);
    }
    constructor(vibration, sound) {
        super();
        this._vibration = null;
        this._sound = null;
        this._vibration = vibration;
        this._sound = sound;
        this.controller = new FeedbackController();
    }
    emit() {
        this.controller.emitFeedback(this.toJSON());
    }
    toJSON() {
        return super.toJSON();
    }
}
__decorate([
    nameForSerialization('vibration')
], Feedback.prototype, "_vibration", void 0);
__decorate([
    nameForSerialization('sound')
], Feedback.prototype, "_sound", void 0);
__decorate([
    ignoreFromSerialization
], Feedback.prototype, "controller", void 0);

var FocusGestureListenerEvents;
(function (FocusGestureListenerEvents) {
    FocusGestureListenerEvents["onFocusGesture"] = "FocusGestureListener.onFocusGesture";
})(FocusGestureListenerEvents || (FocusGestureListenerEvents = {}));

var ZoomGestureListenerEvents;
(function (ZoomGestureListenerEvents) {
    ZoomGestureListenerEvents["onZoomInGesture"] = "ZoomGestureListener.onZoomInGesture";
    ZoomGestureListenerEvents["onZoomOutGesture"] = "ZoomGestureListener.onZoomOutGesture";
})(ZoomGestureListenerEvents || (ZoomGestureListenerEvents = {}));

var FrameSourceListenerEvents;
(function (FrameSourceListenerEvents) {
    FrameSourceListenerEvents["didChangeState"] = "FrameSourceListener.onStateChanged";
})(FrameSourceListenerEvents || (FrameSourceListenerEvents = {}));

var TorchListenerEvents;
(function (TorchListenerEvents) {
    TorchListenerEvents["didChangeTorchToState"] = "TorchListener.onTorchStateChanged";
})(TorchListenerEvents || (TorchListenerEvents = {}));

var MacroModeListenerEvents;
(function (MacroModeListenerEvents) {
    MacroModeListenerEvents["didChangeMacroMode"] = "MacroModeListener.onMacroModeChanged";
})(MacroModeListenerEvents || (MacroModeListenerEvents = {}));

var ZoomListenerEvents;
(function (ZoomListenerEvents) {
    ZoomListenerEvents["didChangeZoomLevel"] = "ZoomListener.onZoomLevelChanged";
})(ZoomListenerEvents || (ZoomListenerEvents = {}));

const tolerantParser$1 = createTolerantPayloadParser('CameraController');
/**
 * Clears warn-once bookkeeping between test cases.
 * @internal Test-only; not part of this package's consumable surface.
 */
function resetCameraControllerPayloadParserWarnings() {
    tolerantParser$1.resetWarnings();
}
class CameraController extends BaseController {
    constructor(cameraPosition, listener) {
        super('CoreProxy');
        // Arrow function wrapper to avoid .bind(this) and always use current class state
        this.handleDidChangeStateEventWrapper = (ev) => {
            return this.handleDidChangeStateEvent(ev);
        };
        // Arrow function wrapper to avoid .bind(this) and always use current class state
        this.handleDidChangeTorchToStateEventWrapper = (ev) => {
            return this.handleDidChangeTorchToStateEvent(ev);
        };
        // Arrow function wrapper to avoid .bind(this) and always use current class state
        this.handleDidChangeMacroModeEventWrapper = (ev) => {
            return this.handleDidChangeMacroModeEvent(ev);
        };
        // Arrow function wrapper to avoid .bind(this) and always use current class state
        this.handleDidChangeZoomLevelEventWrapper = (ev) => {
            return this.handleDidChangeZoomLevelEvent(ev);
        };
        this.cameraPosition = cameraPosition;
        this.listener = listener;
        this.adapter = new CoreProxyAdapter(this._proxy);
        void this.subscribeListener();
    }
    getCurrentState() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.getCameraState({
                cameraPosition: this.cameraPosition,
            });
        });
    }
    getIsTorchAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.isTorchAvailable({
                cameraPosition: this.cameraPosition,
            });
        });
    }
    switchCameraToDesiredState(desiredState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.switchCameraToDesiredState({
                stateJson: desiredState.toString(),
            });
        });
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerFrameSourceListener();
            this._proxy.subscribeForEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.on(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterFrameSourceListener();
            this._proxy.unsubscribeFromEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.off(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    subscribeTorchListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerTorchStateListener();
            this._proxy.subscribeForEvents([TorchListenerEvents.didChangeTorchToState]);
            this._proxy.eventEmitter.on(TorchListenerEvents.didChangeTorchToState, this.handleDidChangeTorchToStateEventWrapper);
        });
    }
    unsubscribeTorchListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterTorchStateListener();
            this._proxy.unsubscribeFromEvents([TorchListenerEvents.didChangeTorchToState]);
            this._proxy.eventEmitter.off(TorchListenerEvents.didChangeTorchToState, this.handleDidChangeTorchToStateEventWrapper);
        });
    }
    subscribeMacroModeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerMacroModeListener();
            this._proxy.subscribeForEvents([MacroModeListenerEvents.didChangeMacroMode]);
            this._proxy.eventEmitter.on(MacroModeListenerEvents.didChangeMacroMode, this.handleDidChangeMacroModeEventWrapper);
        });
    }
    unsubscribeMacroModeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterMacroModeListener();
            this._proxy.unsubscribeFromEvents([MacroModeListenerEvents.didChangeMacroMode]);
            this._proxy.eventEmitter.off(MacroModeListenerEvents.didChangeMacroMode, this.handleDidChangeMacroModeEventWrapper);
        });
    }
    subscribeZoomListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerZoomLevelListener();
            this._proxy.subscribeForEvents([ZoomListenerEvents.didChangeZoomLevel]);
            this._proxy.eventEmitter.on(ZoomListenerEvents.didChangeZoomLevel, this.handleDidChangeZoomLevelEventWrapper);
        });
    }
    unsubscribeZoomListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterZoomLevelListener();
            this._proxy.unsubscribeFromEvents([ZoomListenerEvents.didChangeZoomLevel]);
            this._proxy.eventEmitter.off(ZoomListenerEvents.didChangeZoomLevel, this.handleDidChangeZoomLevelEventWrapper);
        });
    }
    dispose() {
        void this.unsubscribeListener();
        void this.unsubscribeTorchListener();
        void this.unsubscribeMacroModeListener();
        void this.unsubscribeZoomListener();
        this._proxy.dispose();
    }
    handleDidChangeStateEvent(ev) {
        const cast = EventDataParser.parseIfShouldHandle(ev, {});
        if (cast === SKIP || cast === null) {
            return;
        }
        const parsed = tolerantParser$1.parsePayloadTolerantly(cast, parseFrameSourceListenerOnStateChanged, map => {
            // `cameraPosition` is legitimately absent for a non-Camera frame source on both natives
            // (an explicit `null` is also still accepted, for compatibility with payloads from older
            // native versions), so it must NOT be required -- only `state` is. Declining on a
            // missing/wrong-typed `state` beats guessing (SDC-32670).
            if (typeof map.state !== 'string') {
                return null;
            }
            if (map.cameraPosition !== undefined && map.cameraPosition !== null && typeof map.cameraPosition !== 'string') {
                return null;
            }
            return {
                state: map.state,
                cameraPosition: map.cameraPosition,
                event: FrameSourceListenerEvents.didChangeState,
            };
        }, 'didChangeState');
        if (parsed === null) {
            return;
        }
        const event = {
            state: parsed.state,
            cameraPosition: parsed.cameraPosition,
        };
        // cameraPosition is absent/null for a non-Camera frame source on both natives (SDC-32670) --
        // such an event can never match this camera's position, so it's filtered out same as a mismatch.
        if (event.cameraPosition == null || event.cameraPosition !== this.cameraPosition) {
            return;
        }
        this.listener.didChangeState(event.state);
    }
    handleDidChangeTorchToStateEvent(ev) {
        const cast = EventDataParser.parseIfShouldHandle(ev, {});
        if (cast === SKIP || cast === null) {
            return;
        }
        const event = tolerantParser$1.parsePayloadTolerantly(cast, parseTorchListenerOnTorchStateChanged, map => {
            // `state` is required to build a TorchState; without it there is nothing to hand
            // listeners, so decline rather than fabricate one (SDC-32670).
            if (typeof map.state !== 'string') {
                return null;
            }
            return {
                state: map.state,
                event: TorchListenerEvents.didChangeTorchToState,
            };
        }, 'didChangeTorchToState');
        if (event === null) {
            return;
        }
        this.listener.didChangeTorchState(event.state);
    }
    handleDidChangeMacroModeEvent(ev) {
        const cast = EventDataParser.parseIfShouldHandle(ev, {});
        if (cast === SKIP || cast === null) {
            return;
        }
        const event = tolerantParser$1.parsePayloadTolerantly(cast, parseMacroModeListenerOnMacroModeChanged, map => {
            // `macroMode` is required to build a MacroMode; without it there is nothing to hand
            // listeners, so decline rather than fabricate one (SDC-32670).
            if (typeof map.macroMode !== 'string') {
                return null;
            }
            return {
                macroMode: map.macroMode,
                event: MacroModeListenerEvents.didChangeMacroMode,
            };
        }, 'didChangeMacroMode');
        if (event === null) {
            return;
        }
        this.listener.didChangeMacroMode(event.macroMode);
    }
    handleDidChangeZoomLevelEvent(ev) {
        const cast = EventDataParser.parseIfShouldHandle(ev, {});
        if (cast === SKIP || cast === null) {
            return;
        }
        const event = tolerantParser$1.parsePayloadTolerantly(cast, parseZoomListenerOnZoomLevelChanged, map => {
            // Both zoom levels are Float/CGFloat on the wire, not necessarily integers -- require
            // `number`, not `Number.isInteger`. Missing/wrong-typed either one, decline (SDC-32670).
            if (typeof map.oldZoomLevel !== 'number' || typeof map.newZoomLevel !== 'number') {
                return null;
            }
            return {
                oldZoomLevel: map.oldZoomLevel,
                newZoomLevel: map.newZoomLevel,
                event: ZoomListenerEvents.didChangeZoomLevel,
            };
        }, 'didChangeZoomLevel');
        if (event === null) {
            return;
        }
        this.listener.didChangeZoomLevel(event.oldZoomLevel, event.newZoomLevel);
    }
}

var FrameSourceState;
(function (FrameSourceState) {
    FrameSourceState["On"] = "on";
    FrameSourceState["Off"] = "off";
    FrameSourceState["Starting"] = "starting";
    FrameSourceState["Stopping"] = "stopping";
    FrameSourceState["Standby"] = "standby";
    FrameSourceState["BootingUp"] = "bootingUp";
    FrameSourceState["WakingUp"] = "wakingUp";
    FrameSourceState["GoingToSleep"] = "goingToSleep";
    FrameSourceState["ShuttingDown"] = "shuttingDown";
})(FrameSourceState || (FrameSourceState = {}));

/**
 * Observes which camera native treats as active.
 *
 * The native `CameraSwitchControl` swaps the DataCaptureContext's active camera on its own when
 * tapped and the TS layer is never told. This controller listens to the frame-source state events
 * (which carry the camera position) and reports each camera that native brought up, so the owner
 * can mirror the switch without issuing any native call.
 */
class CameraSwitchControlController extends BaseController {
    constructor(onCameraActivated) {
        super('CoreProxy');
        this.subscribed = false;
        // Arrow-function wrapper (matches CameraController) so `this` stays bound and always current.
        this.handleDidChangeStateWrapper = (ev) => {
            return this.handleDidChangeState(ev);
        };
        this.onCameraActivated = onCameraActivated;
        this.adapter = new CoreProxyAdapter(this._proxy);
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.subscribed) {
                return;
            }
            this.subscribed = true;
            yield this.adapter.registerFrameSourceListener();
            this._proxy.subscribeForEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.on(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateWrapper);
        });
    }
    unsubscribe() {
        if (!this.subscribed) {
            return;
        }
        this.subscribed = false;
        // Only detach our JS handler. We intentionally do NOT unregister the native frame-source
        // listener — the active camera's own CameraController may still depend on it.
        this._proxy.eventEmitter.off(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateWrapper);
    }
    handleDidChangeState(ev) {
        const event = EventDataParser.parseIfShouldHandle(ev, {});
        if (event === SKIP || event === null) {
            return;
        }
        // Only report a camera that reached a STABLE up state (on/standby). Transition states
        // (starting, bootingUp, …) must never be written into `desiredState`: that field serializes
        // to native, whose state machine rejects transition values as a desired state
        // (BAR_REQUIRES(!isTransition(state)) in async_start_stop_state_machine.cc → abort).
        // The paired "off" event for the outgoing camera is likewise ignored.
        if (event.state !== FrameSourceState.On && event.state !== FrameSourceState.Standby) {
            return;
        }
        // A non-camera frame source carries no position; there is no camera to report.
        if (event.cameraPosition == null) {
            return;
        }
        this.onCameraActivated(event.cameraPosition, event.state);
    }
}

class ImageBuffer {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get data() {
        return this._data;
    }
}

class ImageFrameSourceController extends BaseController {
    constructor(onStateChanged) {
        super('CoreProxy');
        this.handleDidChangeStateEventWrapper = (ev) => {
            return this.handleDidChangeStateEvent(ev);
        };
        this.onStateChanged = onStateChanged;
        this.adapter = new CoreProxyAdapter(this._proxy);
        void this.subscribeListener();
    }
    getCurrentState(cameraPosition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.getCameraState({
                cameraPosition: JSON.stringify(cameraPosition),
            });
        });
    }
    switchCameraToDesiredState(desiredStateJson) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.switchCameraToDesiredState({
                stateJson: desiredStateJson,
            });
        });
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerFrameSourceListener();
            this._proxy.subscribeForEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.on(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterFrameSourceListener();
            this._proxy.unsubscribeFromEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.off(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    dispose() {
        void this.unsubscribeListener();
        this._proxy.dispose();
    }
    handleDidChangeStateEvent(ev) {
        const event = EventDataParser.parseIfShouldHandle(ev, {});
        if (event === SKIP) {
            return;
        }
        if (event === null) {
            console.error('ImageFrameSourceController didChangeState payload is null');
            return;
        }
        this.onStateChanged(event.state);
    }
}

class ImageFrameSource extends DefaultSerializeable {
    set context(newContext) {
        if (newContext == null) {
            void this.controller.unsubscribeListener();
        }
        else if (this._context == null) {
            void this.controller.subscribeListener();
        }
        this._context = newContext;
    }
    get context() {
        return this._context;
    }
    get desiredState() {
        return this._desiredState;
    }
    static create(image) {
        const imageFrameSource = new ImageFrameSource();
        imageFrameSource.image = image;
        return imageFrameSource;
    }
    static fromJSON(json) {
        return ImageFrameSource.create(json.image);
    }
    constructor() {
        super();
        this.type = 'image';
        this.image = '';
        this._id = `${Date.now()}`;
        this._desiredState = FrameSourceState.Off;
        this.listeners = [];
        this._context = null;
        this.controller = new ImageFrameSourceController(state => this.notifyStateChanged(state));
    }
    switchToDesiredState(state) {
        this._desiredState = state;
        return this.controller.switchCameraToDesiredState(state);
    }
    addListener(listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (listener == null) {
            return;
        }
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    getCurrentState() {
        return this.controller.getCurrentState(this.position);
    }
    notifyStateChanged(state) {
        this.listeners.forEach(listener => {
            if (listener.didChangeState) {
                listener.didChangeState(this, state);
            }
        });
    }
    didChange() {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
    }
    setNativeFrameSourceIsBeingCreated() {
        // ImageFrameSource has no asynchronous native initialization step, so
        // there is nothing to track here. The method exists only to satisfy the
        // PrivateFrameSource contract that DataCaptureContext.setFrameSource()
        // invokes on every frame source.
    }
}
__decorate([
    nameForSerialization('id')
], ImageFrameSource.prototype, "_id", void 0);
__decorate([
    nameForSerialization('desiredState')
], ImageFrameSource.prototype, "_desiredState", void 0);
__decorate([
    ignoreFromSerialization
], ImageFrameSource.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], ImageFrameSource.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], ImageFrameSource.prototype, "controller", void 0);

class SequenceFrameSourceController extends BaseController {
    constructor(frameSourceId, onStateChanged) {
        super('CoreProxy');
        this.handleDidChangeStateEventWrapper = (ev) => {
            return this.handleDidChangeStateEvent(ev);
        };
        this.frameSourceId = frameSourceId;
        this.onStateChanged = onStateChanged;
        this.adapter = new CoreProxyAdapter(this._proxy);
        void this.subscribeListener();
    }
    getCurrentState() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adapter.getSequenceFrameSourceState({
                frameSourceId: this.frameSourceId,
            });
        });
    }
    switchToDesiredState(desiredState) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.switchCameraToDesiredState({
                stateJson: desiredState.toString(),
            });
        });
    }
    addFrame(width, height, frameData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.addFrameToSequenceFrameSource({
                frameSourceId: this.frameSourceId,
                width,
                height,
                frameData,
            });
        });
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.registerFrameSourceListener();
            this._proxy.subscribeForEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.on(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.unregisterFrameSourceListener();
            this._proxy.unsubscribeFromEvents([FrameSourceListenerEvents.didChangeState]);
            this._proxy.eventEmitter.off(FrameSourceListenerEvents.didChangeState, this.handleDidChangeStateEventWrapper);
        });
    }
    dispose() {
        void this.unsubscribeListener();
        this._proxy.dispose();
    }
    handleDidChangeStateEvent(ev) {
        const event = EventDataParser.parseIfShouldHandle(ev, {});
        if (event === SKIP) {
            return;
        }
        if (event === null) {
            console.error('SequenceFrameSourceController didChangeState payload is null');
            return;
        }
        this.onStateChanged(event.state);
    }
}

/**
 * A frame source that processes frames fed to it via {@link SequenceFrameSource.addFrame},
 * in the order they are added. Use it when the camera is not handled by the SDK (e.g. when
 * another framework owns the camera).
 */
class SequenceFrameSource extends DefaultSerializeable {
    set context(newContext) {
        if (newContext == null) {
            void this.controller.unsubscribeListener();
        }
        else if (this._context == null) {
            void this.controller.subscribeListener();
        }
        this._context = newContext;
    }
    get context() {
        return this._context;
    }
    get desiredState() {
        return this._desiredState;
    }
    /**
     * Creates a sequence frame source for the given camera position. On iOS the lens position
     * (0.0-1.0) sets the capture device lens position; on Android it is ignored.
     */
    static create(position, lensPosition) {
        const sequenceFrameSource = new SequenceFrameSource();
        sequenceFrameSource.position = position;
        sequenceFrameSource._lensPosition = lensPosition !== null && lensPosition !== void 0 ? lensPosition : 1;
        return sequenceFrameSource;
    }
    static fromJSON(json) {
        return SequenceFrameSource.create(json.position, json.lensPosition);
    }
    constructor() {
        super();
        this.type = 'sequence';
        this._lensPosition = 1;
        this._id = `${Date.now()}-${SequenceFrameSource.nextInstanceId++}`;
        this._desiredState = FrameSourceState.Off;
        this.listeners = [];
        this._context = null;
        this.controller = new SequenceFrameSourceController(this._id, state => this.notifyStateChanged(state));
    }
    switchToDesiredState(state) {
        this._desiredState = state;
        return this.controller.switchToDesiredState(state);
    }
    /**
     * Adds a frame with the given width and height. The frame data must be the Base64 encoding
     * of the raw NV21 bytes of the frame. If this frame source is on and connected to a
     * data capture context, this is the next frame that will be processed.
     */
    addFrame(width, height, frameData) {
        return this.controller.addFrame(width, height, frameData);
    }
    addListener(listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (listener == null) {
            return;
        }
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    getCurrentState() {
        return this.controller.getCurrentState();
    }
    notifyStateChanged(state) {
        this.listeners.forEach(listener => {
            if (listener.didChangeState) {
                listener.didChangeState(this, state);
            }
        });
    }
    didChange() {
        if (this.context) {
            return this.context.update();
        }
        return Promise.resolve();
    }
    setNativeFrameSourceIsBeingCreated() {
        // SequenceFrameSource has no asynchronous native initialization step, so
        // there is nothing to track here. The method exists only to satisfy the
        // PrivateFrameSource contract that DataCaptureContext.setFrameSource()
        // invokes on every frame source.
    }
}
// The native handlers key their instance-reuse and addFrame routing on this id, so it must
// be unique across instances — a timestamp alone can collide within the same millisecond.
SequenceFrameSource.nextInstanceId = 0;
__decorate([
    nameForSerialization('lensPosition')
], SequenceFrameSource.prototype, "_lensPosition", void 0);
__decorate([
    nameForSerialization('id')
], SequenceFrameSource.prototype, "_id", void 0);
__decorate([
    nameForSerialization('desiredState')
], SequenceFrameSource.prototype, "_desiredState", void 0);
__decorate([
    ignoreFromSerialization
], SequenceFrameSource.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], SequenceFrameSource.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], SequenceFrameSource.prototype, "controller", void 0);

class PrivateFrameData {
    get imageBuffers() {
        return this._imageBuffers;
    }
    get imageBuffer() {
        return this._imageBuffers[0];
    }
    get orientation() {
        return this._orientation;
    }
    get timestamp() {
        return this._timestamp;
    }
    static fromJSON(json) {
        var _a;
        const frameData = new PrivateFrameData();
        frameData._imageBuffers = json.imageBuffers.map((imageBufferJSON) => {
            const imageBuffer = new ImageBuffer();
            imageBuffer._width = imageBufferJSON.width;
            imageBuffer._height = imageBufferJSON.height;
            imageBuffer._data = imageBufferJSON.data;
            return imageBuffer;
        });
        frameData._orientation = json.orientation;
        frameData._timestamp = (_a = json.timestamp) !== null && _a !== void 0 ? _a : -1;
        return frameData;
    }
    static empty() {
        const frameData = new PrivateFrameData();
        frameData._imageBuffers = [];
        frameData._orientation = 90;
        frameData._timestamp = -1;
        return frameData;
    }
}

class FrameDataController extends BaseController {
    constructor() {
        super('CoreProxy');
        this.adapter = new CoreProxyAdapter(this._proxy);
    }
    getFrame(frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adapter.getLastFrameAsJson({ frameId });
            if (result == null) {
                return PrivateFrameData.empty();
            }
            const frameDataJSON = JSON.parse(result);
            return PrivateFrameData.fromJSON(frameDataJSON);
        });
    }
    getFrameOrNull(frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adapter.getLastFrameAsJson({ frameId });
            if (result == null) {
                return null;
            }
            const frameDataJSON = JSON.parse(result);
            return PrivateFrameData.fromJSON(frameDataJSON);
        });
    }
}

var TorchState;
(function (TorchState) {
    TorchState["On"] = "on";
    TorchState["Off"] = "off";
    TorchState["Auto"] = "auto";
})(TorchState || (TorchState = {}));

/**
 * Camera lifecycle and operation handling:
 *
 * Phase 1 - Initial State (before native creation starts):
 *   - Camera object exists in TypeScript but not yet being created on native side
 *   - State changes (torch, desired state, settings) only update TypeScript properties
 *   - No native calls are triggered
 *
 * Phase 2 - Native Creation In Progress (after setFrameSource, before context set):
 *   - setFrameSource() called on DataCaptureContext, triggering setNativeFrameSourceIsBeingCreated()
 *   - A promise is created that will resolve when the native camera is ready
 *   - State changes during this phase await the native ready promise before executing
 *   - Native camera is created asynchronously
 *
 * Phase 3 - Active State (after context set):
 *   - Native camera is ready and available
 *   - The native ready promise is resolved
 *   - All state changes execute immediately on native side
 */
class Camera extends DefaultSerializeable {
    static get coreDefaults() {
        return getCoreDefaults();
    }
    static create(position, settings, desiredTorchState, desiredState) {
        const cameraPosition = position || Camera.coreDefaults.Camera.defaultPosition;
        if (!cameraPosition) {
            return null;
        }
        const existingCamera = Camera._cameraInstances.get(cameraPosition);
        if (existingCamera) {
            existingCamera.resetPhaseState();
            if (settings !== undefined) {
                existingCamera.settings = settings;
            }
            if (desiredTorchState !== undefined) {
                existingCamera._desiredTorchState = desiredTorchState;
                void existingCamera.didChange();
            }
            if (desiredState !== undefined) {
                existingCamera._desiredState = desiredState;
                void existingCamera.controller.switchCameraToDesiredState(desiredState);
            }
            return existingCamera;
        }
        if (!Camera.coreDefaults.Camera.availablePositions.includes(cameraPosition)) {
            return null;
        }
        const camera = new Camera(cameraPosition, settings, desiredTorchState, desiredState);
        Camera._cameraInstances.set(cameraPosition, camera);
        return camera;
    }
    static withSettings(settings) {
        return Camera.create(undefined, settings);
    }
    static asPositionWithSettings(cameraPosition, settings) {
        return Camera.create(cameraPosition, settings);
    }
    static atPosition(cameraPosition) {
        if (!Camera.coreDefaults.Camera.availablePositions.includes(cameraPosition)) {
            return null;
        }
        const existingCamera = Camera._cameraInstances.get(cameraPosition);
        if (existingCamera) {
            return existingCamera;
        }
        return Camera.create(cameraPosition);
    }
    constructor(position, settings, desiredTorchState, desiredState) {
        super();
        this.type = 'camera';
        this.settings = null;
        this._desiredTorchState = TorchState.Off;
        this._desiredState = FrameSourceState.Off;
        this._hasTorchStateListeners = false;
        this._hasMacroModeListeners = false;
        this.currentCameraState = FrameSourceState.Off;
        this.listeners = [];
        this.torchListeners = [];
        this.macroModeListeners = [];
        this.zoomListeners = [];
        this._hasZoomListeners = false;
        this._context = null;
        this.nativeReadyResolver = null;
        this.nativeReadyRejecter = null;
        this.nativeReadyPromise = null;
        this.nativeReadyTimeout = null;
        this._position = position || Camera.coreDefaults.Camera.defaultPosition;
        this.settings = settings || null;
        this._desiredTorchState = desiredTorchState || TorchState.Off;
        this._desiredState = desiredState || FrameSourceState.Off;
        this.controller = new CameraController(this._position, {
            didChangeState: state => this.handleNativeStateChanged(state),
            didChangeTorchState: torchState => this.handleNativeTorchStateChanged(torchState),
            didChangeMacroMode: macroMode => this.handleNativeMacroModeChanged(macroMode),
            didChangeZoomLevel: (oldZoomLevel, newZoomLevel) => this.handleNativeZoomLevelChanged(oldZoomLevel, newZoomLevel),
        });
    }
    switchToDesiredState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            this._desiredState = state;
            if (this.nativeReadyPromise) {
                // Phase 2: Wait for native camera to be ready, then switch state
                yield this.nativeReadyPromise;
                yield this.controller.switchCameraToDesiredState(state);
                return;
            }
            if (!this.isActiveCamera) {
                // Phase 1: Not yet added to context
                const warning = 'The current camera is not added to the DataCaptureContext. Add camera to the DataCaptureContext first.';
                ScanditLogger.emit(LogLevel.Warn, LogCategory.Lifecycle, 'ts.camera', warning);
                if (ScanditLogger.getLevel() < LogLevel.Warn) {
                    console.warn(warning);
                }
                return;
            }
            // Phase 3: Execute immediately
            yield this.controller.switchCameraToDesiredState(state);
        });
    }
    getCurrentState() {
        return Promise.resolve(this.currentCameraState);
    }
    getIsTorchAvailable() {
        return this.controller.getIsTorchAvailable();
    }
    addListener(listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (listener == null) {
            return;
        }
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    addTorchListener(listener) {
        if (this.torchListeners.includes(listener)) {
            return;
        }
        this.torchListeners.push(listener);
        this._hasTorchStateListeners = this.torchListeners.length > 0;
        if (this.torchListeners.length === 1) {
            void this.controller.subscribeTorchListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    removeTorchListener(listener) {
        if (!this.torchListeners.includes(listener)) {
            return;
        }
        this.torchListeners.splice(this.torchListeners.indexOf(listener), 1);
        this._hasTorchStateListeners = this.torchListeners.length > 0;
        if (this.torchListeners.length === 0) {
            void this.controller.unsubscribeTorchListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    addMacroModeListener(listener) {
        if (this.macroModeListeners.includes(listener)) {
            return;
        }
        this.macroModeListeners.push(listener);
        this._hasMacroModeListeners = this.macroModeListeners.length > 0;
        if (this.macroModeListeners.length === 1) {
            void this.controller.subscribeMacroModeListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    removeMacroModeListener(listener) {
        if (!this.macroModeListeners.includes(listener)) {
            return;
        }
        this.macroModeListeners.splice(this.macroModeListeners.indexOf(listener), 1);
        this._hasMacroModeListeners = this.macroModeListeners.length > 0;
        if (this.macroModeListeners.length === 0) {
            void this.controller.unsubscribeMacroModeListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    addZoomListener(listener) {
        if (this.zoomListeners.includes(listener)) {
            return;
        }
        this.zoomListeners.push(listener);
        this._hasZoomListeners = this.zoomListeners.length > 0;
        if (this.zoomListeners.length === 1) {
            void this.controller.subscribeZoomListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    removeZoomListener(listener) {
        if (!this.zoomListeners.includes(listener)) {
            return;
        }
        this.zoomListeners.splice(this.zoomListeners.indexOf(listener), 1);
        this._hasZoomListeners = this.zoomListeners.length > 0;
        if (this.zoomListeners.length === 0) {
            void this.controller.unsubscribeZoomListener();
        }
        if (this.isActiveCamera) {
            void this.didChange();
        }
    }
    applySettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = settings;
            if (this.nativeReadyPromise) {
                // Phase 2: Wait for native camera to be ready, then apply settings
                yield this.nativeReadyPromise;
                yield this.didChange();
            }
            else if (this.isActiveCamera) {
                // Phase 3: Execute immediately
                yield this.didChange();
            }
            else {
                ScanditLogger.emit(LogLevel.Debug, LogCategory.Lifecycle, 'ts.camera', 'Camera.applySettings: stored until the camera is set as the frame source');
            }
        });
    }
    set context(newContext) {
        this._context = newContext;
        if (newContext) {
            // Phase 3: Native camera is ready, resolve the promise so waiting operations can proceed
            if (this.nativeReadyTimeout) {
                clearTimeout(this.nativeReadyTimeout);
                this.nativeReadyTimeout = null;
            }
            if (this.nativeReadyResolver) {
                this.nativeReadyResolver();
                this.nativeReadyResolver = null;
                this.nativeReadyRejecter = null;
                this.nativeReadyPromise = null;
            }
        }
        else {
            // When context is removed, reset everything
            if (this.nativeReadyTimeout) {
                clearTimeout(this.nativeReadyTimeout);
                this.nativeReadyTimeout = null;
            }
            this.nativeReadyResolver = null;
            this.nativeReadyRejecter = null;
            this.nativeReadyPromise = null;
        }
    }
    get context() {
        return this._context;
    }
    setNativeFrameSourceIsBeingCreated() {
        this.nativeReadyPromise = new Promise((resolve, reject) => {
            this.nativeReadyResolver = resolve;
            this.nativeReadyRejecter = reject;
            this.nativeReadyTimeout = setTimeout(() => {
                this.nativeReadyTimeout = null;
                if (this.nativeReadyRejecter) {
                    this.nativeReadyRejecter(new Error('Camera native initialization timed out after 5 seconds'));
                    this.nativeReadyResolver = null;
                    this.nativeReadyRejecter = null;
                    this.nativeReadyPromise = null;
                }
            }, 5000);
        });
    }
    get isActiveCamera() {
        return this._context !== null;
    }
    static get default() {
        const defaultPosition = Camera.coreDefaults.Camera.defaultPosition;
        if (!defaultPosition) {
            return null;
        }
        return Camera.atPosition(defaultPosition);
    }
    static isMacroModeAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const proxy = FactoryMaker.getInstance('CoreProxy');
            if (!proxy) {
                return false;
            }
            const adapter = new CoreProxyAdapter(proxy);
            return yield adapter.isMacroModeAvailable();
        });
    }
    get position() {
        return this._position;
    }
    get isTorchAvailable() {
        return this.controller.getIsTorchAvailable();
    }
    get desiredState() {
        return this._desiredState;
    }
    set desiredTorchState(desiredTorchState) {
        this._desiredTorchState = desiredTorchState;
        if (this.nativeReadyPromise) {
            // Phase 2: Wait for native camera to be ready, then update
            void this.nativeReadyPromise.then(() => this.didChange());
        }
        else if (this.isActiveCamera) {
            // Phase 3: Execute immediately
            void this.didChange();
        }
        // Phase 1: Just update the property, no action needed
    }
    get desiredTorchState() {
        return this._desiredTorchState;
    }
    didChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context) {
                yield this.context.update();
            }
        });
    }
    // Native reports events for this position whether or not the camera is in use; only the
    // camera attached to a context forwards them to its listeners.
    handleNativeStateChanged(state) {
        if (!this.isActiveCamera) {
            return;
        }
        this.currentCameraState = state;
        this.listeners.forEach(listener => {
            var _a;
            (_a = listener === null || listener === void 0 ? void 0 : listener.didChangeState) === null || _a === void 0 ? void 0 : _a.call(listener, this, this._desiredState);
        });
    }
    handleNativeTorchStateChanged(torchState) {
        if (!this.isActiveCamera) {
            return;
        }
        this.desiredTorchState = torchState;
        this.torchListeners.forEach(listener => {
            var _a;
            (_a = listener === null || listener === void 0 ? void 0 : listener.didChangeTorchToState) === null || _a === void 0 ? void 0 : _a.call(listener, torchState);
        });
    }
    handleNativeMacroModeChanged(macroMode) {
        if (!this.isActiveCamera) {
            return;
        }
        this.macroModeListeners.forEach(listener => {
            var _a;
            (_a = listener === null || listener === void 0 ? void 0 : listener.didChangeMacroMode) === null || _a === void 0 ? void 0 : _a.call(listener, macroMode);
        });
    }
    handleNativeZoomLevelChanged(oldZoomLevel, newZoomLevel) {
        if (!this.isActiveCamera) {
            return;
        }
        this.zoomListeners.forEach(listener => {
            var _a;
            (_a = listener === null || listener === void 0 ? void 0 : listener.didChangeZoomLevel) === null || _a === void 0 ? void 0 : _a.call(listener, oldZoomLevel, newZoomLevel);
        });
    }
    resetPhaseState() {
        if (this.nativeReadyTimeout) {
            clearTimeout(this.nativeReadyTimeout);
            this.nativeReadyTimeout = null;
        }
        this.nativeReadyResolver = null;
        this.nativeReadyRejecter = null;
        this.nativeReadyPromise = null;
    }
}
Camera._cameraInstances = new Map();
__decorate([
    ignoreFromSerialization
], Camera.prototype, "controller", void 0);
__decorate([
    serializationDefault({})
], Camera.prototype, "settings", void 0);
__decorate([
    nameForSerialization('position')
], Camera.prototype, "_position", void 0);
__decorate([
    nameForSerialization('desiredTorchState')
], Camera.prototype, "_desiredTorchState", void 0);
__decorate([
    nameForSerialization('desiredState')
], Camera.prototype, "_desiredState", void 0);
__decorate([
    nameForSerialization('hasTorchStateListeners')
], Camera.prototype, "_hasTorchStateListeners", void 0);
__decorate([
    nameForSerialization('hasMacroModeListeners')
], Camera.prototype, "_hasMacroModeListeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "currentCameraState", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "torchListeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "macroModeListeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "zoomListeners", void 0);
__decorate([
    nameForSerialization('hasZoomListeners')
], Camera.prototype, "_hasZoomListeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "nativeReadyResolver", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "nativeReadyRejecter", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "nativeReadyPromise", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "nativeReadyTimeout", void 0);
__decorate([
    ignoreFromSerialization
], Camera, "_cameraInstances", void 0);
__decorate([
    ignoreFromSerialization
], Camera, "coreDefaults", null);

class ControlImage extends DefaultSerializeable {
    static fromBase64EncodedImage(data) {
        if (data === null)
            return null;
        return new ControlImage('base64', data, null);
    }
    static fromResourceName(resource) {
        return new ControlImage('resource', null, resource);
    }
    constructor(type, data, name) {
        super();
        this.type = type;
        this._data = data;
        this._name = name;
    }
    isBase64EncodedImage() {
        return this.type === 'base64';
    }
    get data() {
        return this._data;
    }
}
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('data')
], ControlImage.prototype, "_data", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('name')
], ControlImage.prototype, "_name", void 0);

class ZoomSwitchControl extends DefaultSerializeable {
    static get coreDefaults() {
        return getCoreDefaults();
    }
    get selectedZoomLevel() {
        return this._selectedZoomLevel;
    }
    constructor() {
        super();
        this.type = 'zoom';
        this.icon = {
            zoomedOut: { default: null, pressed: null },
            zoomedIn: { default: null, pressed: null },
        };
        this.view = null;
        this.anchor = null;
        this.offset = null;
        /** @deprecated Use the unified `accessibilityLabel` property instead. */
        this.contentDescriptionWhenZoomedOut = null;
        /** @deprecated Use the unified `accessibilityLabel` property instead. */
        this.contentDescriptionWhenZoomedIn = null;
        /** @deprecated Use the unified `accessibilityLabel` property instead. */
        this.accessibilityLabelWhenZoomedOut = null;
        /** @deprecated Use the unified `accessibilityLabel` property instead. */
        this.accessibilityLabelWhenZoomedIn = null;
        /** @deprecated Use the unified `accessibilityHint` property instead. */
        this.accessibilityHintWhenZoomedOut = null;
        /** @deprecated Use the unified `accessibilityHint` property instead. */
        this.accessibilityHintWhenZoomedIn = null;
        // v2 properties (8.4) — defaults loaded from native
        this.orientation = ZoomSwitchControl.coreDefaults.ZoomSwitchControl.orientation;
        this.isAlwaysExpanded = ZoomSwitchControl.coreDefaults.ZoomSwitchControl.isAlwaysExpanded;
        this.isExpanded = ZoomSwitchControl.coreDefaults.ZoomSwitchControl.isExpanded;
        this.accessibilityLabel = ZoomSwitchControl.coreDefaults.ZoomSwitchControl.accessibilityLabel;
        this.accessibilityHint = ZoomSwitchControl.coreDefaults.ZoomSwitchControl.accessibilityHint;
        this._selectedZoomLevel = 1;
    }
    selectZoomLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.view == null) {
                throw new Error('Control not yet attached to a view');
            }
            return this.view.selectZoomLevel(level);
        });
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedOutImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedOut.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedOut.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutImage(zoomedOutImage) {
        var _a;
        this.icon.zoomedOut.default = ControlImage.fromBase64EncodedImage(zoomedOutImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedInImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedIn.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedIn.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInImage(zoomedInImage) {
        var _a;
        this.icon.zoomedIn.default = ControlImage.fromBase64EncodedImage(zoomedInImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedInPressedImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedIn.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedIn.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInPressedImage(zoomedInPressedImage) {
        var _a;
        this.icon.zoomedIn.pressed = ControlImage.fromBase64EncodedImage(zoomedInPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    get zoomedOutPressedImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedOut.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedOut.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutPressedImage(zoomedOutPressedImage) {
        var _a;
        this.icon.zoomedOut.pressed = ControlImage.fromBase64EncodedImage(zoomedOutPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedInImage(resource) {
        var _a;
        this.icon.zoomedIn.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedInPressedImage(resource) {
        var _a;
        this.icon.zoomedIn.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedOutImage(resource) {
        var _a;
        this.icon.zoomedOut.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    setZoomedOutPressedImage(resource) {
        var _a;
        this.icon.zoomedOut.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated());
    }
}
__decorate([
    ignoreFromSerialization
], ZoomSwitchControl.prototype, "view", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "anchor", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "offset", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "contentDescriptionWhenZoomedOut", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "contentDescriptionWhenZoomedIn", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "accessibilityLabelWhenZoomedOut", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "accessibilityLabelWhenZoomedIn", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "accessibilityHintWhenZoomedOut", void 0);
__decorate([
    ignoreFromSerializationIfNull
], ZoomSwitchControl.prototype, "accessibilityHintWhenZoomedIn", void 0);
__decorate([
    ignoreFromSerialization
], ZoomSwitchControl.prototype, "_selectedZoomLevel", void 0);
__decorate([
    ignoreFromSerialization
], ZoomSwitchControl, "coreDefaults", null);

class TorchSwitchControl extends DefaultSerializeable {
    constructor() {
        super();
        this.type = 'torch';
        this.icon = {
            on: { default: null, pressed: null },
            off: { default: null, pressed: null },
        };
        this.view = null;
        this.anchor = null;
        this.offset = null;
        this.accessibilityLabelWhenOff = null;
        this.accessibilityHintWhenOff = null;
        this.accessibilityLabelWhenOn = null;
        this.accessibilityHintWhenOn = null;
    }
    get torchOffImage() {
        var _a, _b;
        if (((_a = this.icon.off.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.off.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set torchOffImage(torchOffImage) {
        var _a;
        this.icon.off.default = ControlImage.fromBase64EncodedImage(torchOffImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get torchOffPressedImage() {
        var _a, _b;
        if (((_a = this.icon.off.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.off.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set torchOffPressedImage(torchOffPressedImage) {
        var _a;
        this.icon.off.pressed = ControlImage.fromBase64EncodedImage(torchOffPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get torchOnImage() {
        var _a, _b;
        if (((_a = this.icon.on.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.on.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set torchOnImage(torchOnImage) {
        var _a;
        this.icon.on.default = ControlImage.fromBase64EncodedImage(torchOnImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get torchOnPressedImage() {
        var _a, _b;
        if (((_a = this.icon.on.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.on.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    setTorchOffImage(resource) {
        var _a;
        this.icon.off.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setTorchOffPressedImage(resource) {
        var _a;
        this.icon.off.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setTorchOnImage(resource) {
        var _a;
        this.icon.on.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setTorchOnPressedImage(resource) {
        var _a;
        this.icon.on.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setImageResource(resource) {
        var _a;
        this.icon.off.default = ControlImage.fromResourceName(resource);
        this.icon.off.pressed = ControlImage.fromResourceName(resource);
        this.icon.on.default = ControlImage.fromResourceName(resource);
        this.icon.on.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    set torchOnPressedImage(torchOnPressedImage) {
        var _a;
        this.icon.on.pressed = ControlImage.fromBase64EncodedImage(torchOnPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
}
__decorate([
    ignoreFromSerialization
], TorchSwitchControl.prototype, "view", void 0);
__decorate([
    ignoreFromSerializationIfNull
], TorchSwitchControl.prototype, "anchor", void 0);
__decorate([
    ignoreFromSerializationIfNull
], TorchSwitchControl.prototype, "offset", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityLabelWhenOff')
], TorchSwitchControl.prototype, "accessibilityLabelWhenOff", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityHintWhenOff')
], TorchSwitchControl.prototype, "accessibilityHintWhenOff", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityLabelWhenOn')
], TorchSwitchControl.prototype, "accessibilityLabelWhenOn", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityHintWhenOn')
], TorchSwitchControl.prototype, "accessibilityHintWhenOn", void 0);

class CameraSwitchControl extends DefaultSerializeable {
    get view() {
        return this._view;
    }
    // Attaching to / detaching from a view is the lifecycle hook for keeping the TS camera state
    // in sync with the native camera switcher: subscribe while attached, unsubscribe when removed.
    set view(view) {
        var _a, _b;
        this._view = view;
        if (view) {
            this.controller =
                (_a = this.controller) !== null && _a !== void 0 ? _a : new CameraSwitchControlController((position, state) => this.adoptNativeActiveCamera(position, state));
            void this.controller.subscribe();
        }
        else {
            (_b = this.controller) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        }
    }
    constructor(primaryCamera, secondaryCamera) {
        super();
        this.type = 'camera';
        this.icon = {
            primaryCamera: { default: null, pressed: null },
            secondaryCamera: { default: null, pressed: null },
        };
        this._view = null;
        this.controller = null;
        this.anchor = null;
        this.offset = null;
        this.accessibilityLabelWhenWorldFacing = null;
        this.accessibilityHintWhenWorldFacing = null;
        this.accessibilityLabelWhenUserFacing = null;
        this.accessibilityHintWhenUserFacing = null;
        this._primaryCamera = primaryCamera;
        this._secondaryCamera = secondaryCamera;
    }
    get primaryCamera() {
        return this._primaryCamera;
    }
    get secondaryCamera() {
        return this._secondaryCamera;
    }
    get primaryCameraImage() {
        var _a, _b;
        if (((_a = this.icon.primaryCamera.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.primaryCamera.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set primaryCameraImage(primaryCameraImage) {
        var _a;
        this.icon.primaryCamera.default = ControlImage.fromBase64EncodedImage(primaryCameraImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get primaryCameraPressedImage() {
        var _a, _b;
        if (((_a = this.icon.primaryCamera.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.primaryCamera.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set primaryCameraPressedImage(primaryCameraPressedImage) {
        var _a;
        this.icon.primaryCamera.pressed = ControlImage.fromBase64EncodedImage(primaryCameraPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get secondaryCameraImage() {
        var _a, _b;
        if (((_a = this.icon.secondaryCamera.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.secondaryCamera.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set secondaryCameraImage(secondaryCameraImage) {
        var _a;
        this.icon.secondaryCamera.default = ControlImage.fromBase64EncodedImage(secondaryCameraImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    get secondaryCameraPressedImage() {
        var _a, _b;
        if (((_a = this.icon.secondaryCamera.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.secondaryCamera.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set secondaryCameraPressedImage(secondaryCameraPressedImage) {
        var _a;
        this.icon.secondaryCamera.pressed = ControlImage.fromBase64EncodedImage(secondaryCameraPressedImage);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setPrimaryCameraImage(resource) {
        var _a;
        this.icon.primaryCamera.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setPrimaryCameraPressedImage(resource) {
        var _a;
        this.icon.primaryCamera.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setSecondaryCameraImage(resource) {
        var _a;
        this.icon.secondaryCamera.default = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    setSecondaryCameraPressedImage(resource) {
        var _a;
        this.icon.secondaryCamera.pressed = ControlImage.fromResourceName(resource);
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a['controlUpdated']());
    }
    // Native swaps the context's active camera on its own when the switcher is tapped; mirror that
    // switch in the TS state (context frame source, both cameras' states) without calling native.
    adoptNativeActiveCamera(cameraPosition, state) {
        var _a;
        const context = (_a = this._view) === null || _a === void 0 ? void 0 : _a.context;
        if (!context) {
            return;
        }
        const primary = this._primaryCamera;
        const secondary = this._secondaryCamera;
        const next = cameraPosition === primary.position ? primary : cameraPosition === secondary.position ? secondary : null;
        if (!next || context.frameSource === next) {
            return;
        }
        const previous = context.frameSource;
        context.adoptActiveFrameSource(next);
        next._desiredState = state;
        next.currentCameraState = state;
        if (previous) {
            previous._desiredState = FrameSourceState.Off;
            previous.currentCameraState = FrameSourceState.Off;
        }
    }
}
__decorate([
    nameForSerialization('primaryCamera')
], CameraSwitchControl.prototype, "_primaryCamera", void 0);
__decorate([
    nameForSerialization('secondaryCamera')
], CameraSwitchControl.prototype, "_secondaryCamera", void 0);
__decorate([
    ignoreFromSerialization
], CameraSwitchControl.prototype, "_view", void 0);
__decorate([
    ignoreFromSerialization
], CameraSwitchControl.prototype, "controller", void 0);
__decorate([
    ignoreFromSerializationIfNull
], CameraSwitchControl.prototype, "anchor", void 0);
__decorate([
    ignoreFromSerializationIfNull
], CameraSwitchControl.prototype, "offset", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityLabelWhenWorldFacing')
], CameraSwitchControl.prototype, "accessibilityLabelWhenWorldFacing", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityHintWhenWorldFacing')
], CameraSwitchControl.prototype, "accessibilityHintWhenWorldFacing", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityLabelWhenUserFacing')
], CameraSwitchControl.prototype, "accessibilityLabelWhenUserFacing", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('accessibilityHintWhenUserFacing')
], CameraSwitchControl.prototype, "accessibilityHintWhenUserFacing", void 0);

var VideoResolution;
(function (VideoResolution) {
    /** @deprecated Auto is deprecated. Please use the capture mode's recommendedCameraSettings for the best results. */
    VideoResolution["Auto"] = "auto";
    VideoResolution["HD"] = "hd";
    VideoResolution["FullHD"] = "fullHd";
    VideoResolution["UHD4K"] = "uhd4k";
})(VideoResolution || (VideoResolution = {}));

var FocusRange;
(function (FocusRange) {
    FocusRange["Full"] = "full";
    FocusRange["Near"] = "near";
    FocusRange["Far"] = "far";
})(FocusRange || (FocusRange = {}));

var FocusGestureStrategy;
(function (FocusGestureStrategy) {
    FocusGestureStrategy["None"] = "none";
    FocusGestureStrategy["Manual"] = "manual";
    FocusGestureStrategy["ManualUntilCapture"] = "manualUntilCapture";
    FocusGestureStrategy["AutoOnLocation"] = "autoOnLocation";
})(FocusGestureStrategy || (FocusGestureStrategy = {}));

var LogoStyle;
(function (LogoStyle) {
    LogoStyle["Minimal"] = "minimal";
    LogoStyle["Extended"] = "extended";
})(LogoStyle || (LogoStyle = {}));

class CameraSettings extends DefaultSerializeable {
    static get coreDefaults() {
        return getCoreDefaults();
    }
    get focusRange() {
        return this.focus.range;
    }
    set focusRange(newRange) {
        this.focus.range = newRange;
    }
    get focusGestureStrategy() {
        return this.focus.focusGestureStrategy;
    }
    set focusGestureStrategy(newStrategy) {
        this.focus.focusGestureStrategy = newStrategy;
    }
    get shouldPreferSmoothAutoFocus() {
        return this.focus.shouldPreferSmoothAutoFocus;
    }
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus) {
        this.focus.shouldPreferSmoothAutoFocus = newShouldPreferSmoothAutoFocus;
    }
    static fromJSON(json) {
        var _a, _b, _c, _d;
        const settings = new CameraSettings();
        settings.preferredResolution = json.preferredResolution;
        settings.zoomFactor = json.zoomFactor;
        settings.zoomGestureZoomFactor = json.zoomGestureZoomFactor;
        settings.zoomLevels = (_a = json.zoomLevels) !== null && _a !== void 0 ? _a : [1, 2];
        settings.macroMode = ((_b = json.macroMode) !== null && _b !== void 0 ? _b : CameraSettings.coreDefaults.Camera.Settings.macroMode);
        settings.adaptiveExposure = (_c = json.adaptiveExposure) !== null && _c !== void 0 ? _c : CameraSettings.coreDefaults.Camera.Settings.adaptiveExposure;
        settings.torchLevel = (_d = json.torchLevel) !== null && _d !== void 0 ? _d : CameraSettings.coreDefaults.Camera.Settings.torchLevel;
        settings.focusRange = json.focusRange;
        settings.focusGestureStrategy = json.focusGestureStrategy;
        settings.shouldPreferSmoothAutoFocus = json.shouldPreferSmoothAutoFocus;
        // manualLensPosition, focusStrategy (and on iOS: range) arrive in the properties bag
        // and are routed to the focus bag by setProperty via focusHiddenProperties
        if (json.properties !== undefined) {
            for (const key of Object.keys(json.properties)) {
                settings.setProperty(key, json.properties[key]);
            }
        }
        return settings;
    }
    constructor(settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super();
        this.preferredResolution = CameraSettings.coreDefaults.Camera.Settings.preferredResolution;
        this.zoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomFactor;
        /** @deprecated Use zoomLevels instead. */
        this.zoomGestureZoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomGestureZoomFactor;
        this.zoomLevels = CameraSettings.coreDefaults.Camera.Settings.zoomLevels;
        this.torchLevel = CameraSettings.coreDefaults.Camera.Settings.torchLevel;
        this.macroMode = CameraSettings.coreDefaults.Camera.Settings.macroMode;
        this.adaptiveExposure = CameraSettings.coreDefaults.Camera.Settings.adaptiveExposure;
        this.focusHiddenProperties = [
            'range',
            'manualLensPosition',
            'shouldPreferSmoothAutoFocus',
            'focusStrategy',
            'focusGestureStrategy',
        ];
        this.focus = {
            range: CameraSettings.coreDefaults.Camera.Settings.focusRange,
            focusGestureStrategy: CameraSettings.coreDefaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: CameraSettings.coreDefaults.Camera.Settings.shouldPreferSmoothAutoFocus,
            manualLensPosition: CameraSettings.coreDefaults.Camera.Settings.manualLensPosition,
            focusStrategy: CameraSettings.coreDefaults.Camera.Settings.focusStrategy,
        };
        this.preferredResolution =
            (_a = settings === null || settings === void 0 ? void 0 : settings.preferredResolution) !== null && _a !== void 0 ? _a : CameraSettings.coreDefaults.Camera.Settings.preferredResolution;
        this.zoomFactor = (_b = settings === null || settings === void 0 ? void 0 : settings.zoomFactor) !== null && _b !== void 0 ? _b : CameraSettings.coreDefaults.Camera.Settings.zoomFactor;
        this.zoomGestureZoomFactor =
            (_c = settings === null || settings === void 0 ? void 0 : settings.zoomGestureZoomFactor) !== null && _c !== void 0 ? _c : CameraSettings.coreDefaults.Camera.Settings.zoomGestureZoomFactor;
        this.torchLevel = (_d = settings === null || settings === void 0 ? void 0 : settings.torchLevel) !== null && _d !== void 0 ? _d : CameraSettings.coreDefaults.Camera.Settings.torchLevel;
        this.macroMode = (_e = settings === null || settings === void 0 ? void 0 : settings.macroMode) !== null && _e !== void 0 ? _e : CameraSettings.coreDefaults.Camera.Settings.macroMode;
        this.adaptiveExposure = (_f = settings === null || settings === void 0 ? void 0 : settings.adaptiveExposure) !== null && _f !== void 0 ? _f : CameraSettings.coreDefaults.Camera.Settings.adaptiveExposure;
        this.focus = {
            range: (_g = settings === null || settings === void 0 ? void 0 : settings.focusRange) !== null && _g !== void 0 ? _g : CameraSettings.coreDefaults.Camera.Settings.focusRange,
            focusGestureStrategy: (_h = settings === null || settings === void 0 ? void 0 : settings.focusGestureStrategy) !== null && _h !== void 0 ? _h : CameraSettings.coreDefaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: (_j = settings === null || settings === void 0 ? void 0 : settings.shouldPreferSmoothAutoFocus) !== null && _j !== void 0 ? _j : CameraSettings.coreDefaults.Camera.Settings.shouldPreferSmoothAutoFocus,
            manualLensPosition: (_k = settings === null || settings === void 0 ? void 0 : settings.focus) === null || _k === void 0 ? void 0 : _k.manualLensPosition,
            focusStrategy: (_l = settings === null || settings === void 0 ? void 0 : settings.focus) === null || _l === void 0 ? void 0 : _l.focusStrategy,
        };
        if (settings !== undefined && settings !== null) {
            Object.getOwnPropertyNames(settings).forEach(propertyName => {
                this[propertyName] = settings[propertyName];
            });
        }
    }
    setProperty(name, value) {
        if (this.focusHiddenProperties.includes(name)) {
            this.focus[name] = value;
            return;
        }
        this[name] = value;
    }
    getProperty(name) {
        if (this.focusHiddenProperties.includes(name)) {
            return this.focus[name];
        }
        return this[name];
    }
}
__decorate([
    nameForSerialization('torchLevel')
], CameraSettings.prototype, "torchLevel", void 0);
__decorate([
    nameForSerialization('macroMode')
], CameraSettings.prototype, "macroMode", void 0);
__decorate([
    nameForSerialization('adaptiveExposure')
], CameraSettings.prototype, "adaptiveExposure", void 0);
__decorate([
    ignoreFromSerialization
], CameraSettings.prototype, "focusHiddenProperties", void 0);

var MacroMode;
(function (MacroMode) {
    MacroMode["Auto"] = "auto";
    MacroMode["Off"] = "off";
    MacroMode["On"] = "on";
})(MacroMode || (MacroMode = {}));

var ZoomSwitchOrientation;
(function (ZoomSwitchOrientation) {
    ZoomSwitchOrientation["Default"] = "default";
    ZoomSwitchOrientation["Horizontal"] = "horizontal";
    ZoomSwitchOrientation["Vertical"] = "vertical";
})(ZoomSwitchOrientation || (ZoomSwitchOrientation = {}));

var CameraPosition;
(function (CameraPosition) {
    CameraPosition["WorldFacing"] = "worldFacing";
    CameraPosition["UserFacing"] = "userFacing";
    CameraPosition["Unspecified"] = "unspecified";
})(CameraPosition || (CameraPosition = {}));

class CameraOwnershipManager {
    static getInstance() {
        if (!CameraOwnershipManager.instance) {
            CameraOwnershipManager.instance = new CameraOwnershipManager();
        }
        return CameraOwnershipManager.instance;
    }
    constructor() {
        this.owners = new Map();
        this.waitingQueue = new Map();
        this.protectedCameras = new Set();
    }
    requestOwnership(position, owner) {
        const currentOwner = this.owners.get(position);
        if (currentOwner && currentOwner.id !== owner.id) {
            return false; // Already owned by someone else
        }
        this.owners.set(position, owner);
        this.enableProtectionForOwner(position, owner);
        return true;
    }
    requestOwnershipAsync(position, owner, timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try immediate acquisition first
            if (this.requestOwnership(position, owner)) {
                return true;
            }
            // If not available, wait in queue
            return new Promise(resolve => {
                const request = { owner, resolve };
                if (!this.waitingQueue.has(position)) {
                    this.waitingQueue.set(position, []);
                }
                this.waitingQueue.get(position).push(request);
                // Optional timeout
                if (timeoutMs && timeoutMs > 0) {
                    setTimeout(() => {
                        this.removeFromQueue(position, request);
                        resolve(false); // Timeout - ownership not acquired
                    }, timeoutMs);
                }
            });
        });
    }
    releaseOwnership(position, owner) {
        const currentOwner = this.owners.get(position);
        if (!currentOwner || currentOwner.id !== owner.id) {
            return false; // Not the owner
        }
        this.owners.delete(position);
        this.disableProtectionForPosition(position);
        this.processWaitingQueue(position);
        return true;
    }
    isOwner(position, owner) {
        const currentOwner = this.owners.get(position);
        return (currentOwner === null || currentOwner === void 0 ? void 0 : currentOwner.id) === owner.id;
    }
    getCurrentOwner(position) {
        return this.owners.get(position) || null;
    }
    checkOwnership(position, owner) {
        return this.isOwner(position, owner);
    }
    getOwnedPosition(owner) {
        for (const [position, currentOwner] of this.owners.entries()) {
            if (currentOwner.id === owner.id) {
                return position;
            }
        }
        return null;
    }
    getAllOwnedPositions(owner) {
        const positions = [];
        for (const [position, currentOwner] of this.owners.entries()) {
            if (currentOwner.id === owner.id) {
                positions.push(position);
            }
        }
        return positions;
    }
    enableProtectionForOwner(position, owner) {
        const camera = Camera.atPosition(position);
        if (!camera || this.protectedCameras.has(camera)) {
            return; // Camera not available or already protected
        }
        this.protectCameraForOwner(camera, position, owner);
        this.protectedCameras.add(camera);
    }
    disableProtectionForPosition(position) {
        const camera = Camera.atPosition(position);
        if (!camera || !this.protectedCameras.has(camera)) {
            return;
        }
        this.unprotectCamera(camera);
        this.protectedCameras.delete(camera);
    }
    processWaitingQueue(position) {
        const queue = this.waitingQueue.get(position);
        if (!queue || queue.length === 0) {
            return;
        }
        // Give ownership to the first in queue
        const nextRequest = queue.shift();
        this.owners.set(position, nextRequest.owner);
        this.enableProtectionForOwner(position, nextRequest.owner);
        nextRequest.resolve(true);
        // Clean up empty queue
        if (queue.length === 0) {
            this.waitingQueue.delete(position);
        }
    }
    removeFromQueue(position, requestToRemove) {
        const queue = this.waitingQueue.get(position);
        if (!queue)
            return;
        const index = queue.indexOf(requestToRemove);
        if (index > -1) {
            queue.splice(index, 1);
        }
        if (queue.length === 0) {
            this.waitingQueue.delete(position);
        }
    }
    protectCameraForOwner(camera, position, _owner) {
        var _a, _b, _c, _d;
        const originalSwitchToDesiredState = camera.switchToDesiredState.bind(camera);
        const originalApplySettings = camera.applySettings.bind(camera);
        const originalSetDesiredTorchState = (_b = (_a = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(camera), 'desiredTorchState')) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.bind(camera);
        // Protect switchToDesiredState - only owner can call it
        camera.switchToDesiredState = (state) => __awaiter(this, void 0, void 0, function* () {
            const currentOwner = this.getCurrentOwner(position);
            if (!currentOwner) {
                throw new Error(`Camera operation denied: No owner for camera at ${position}`);
            }
            // Allow operation - the owner is the only one who should have access to this camera instance
            return originalSwitchToDesiredState(state);
        });
        // Protect applySettings - only owner can call it
        camera.applySettings = (settings) => __awaiter(this, void 0, void 0, function* () {
            const currentOwner = this.getCurrentOwner(position);
            if (!currentOwner) {
                throw new Error(`Camera operation denied: No owner for camera at ${position}`);
            }
            return originalApplySettings(settings);
        });
        // Protect desiredTorchState setter - only owner can set it
        if (originalSetDesiredTorchState) {
            Object.defineProperty(camera, 'desiredTorchState', {
                set: (value) => {
                    const currentOwner = this.getCurrentOwner(position);
                    if (!currentOwner) {
                        throw new Error(`Camera operation denied: No owner for camera at ${position}`);
                    }
                    originalSetDesiredTorchState(value);
                },
                get: (_d = (_c = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(camera), 'desiredTorchState')) === null || _c === void 0 ? void 0 : _c.get) === null || _d === void 0 ? void 0 : _d.bind(camera),
                configurable: true,
            });
        }
        // Store originals for restoration
        camera.__originalMethods = {
            switchToDesiredState: originalSwitchToDesiredState,
            applySettings: originalApplySettings,
            setDesiredTorchState: originalSetDesiredTorchState,
        };
    }
    unprotectCamera(camera) {
        var _a, _b;
        const originals = camera.__originalMethods;
        if (!originals)
            return;
        // Restore original methods
        camera.switchToDesiredState = originals.switchToDesiredState;
        camera.applySettings = originals.applySettings;
        if (originals.setDesiredTorchState) {
            Object.defineProperty(camera, 'desiredTorchState', {
                set: originals.setDesiredTorchState,
                get: (_b = (_a = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(camera), 'desiredTorchState')) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.bind(camera),
                configurable: true,
            });
        }
        delete camera.__originalMethods;
    }
}

class CameraOwnershipHelper {
    /**
     * Get camera instance for the owner (only works if you own it)
     */
    static getCamera(position, owner) {
        // Check ownership
        if (!this.ownershipManager.checkOwnership(position, owner)) {
            console.warn(`Camera access denied: ${owner.id} does not own camera at ${position}`);
            return null;
        }
        return Camera.atPosition(position);
    }
    /**
     * Safely execute camera operations (only works if you own the camera)
     */
    static withCamera(position, owner, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            const camera = this.getCamera(position, owner);
            if (!camera) {
                return null;
            }
            try {
                const result = yield operation(camera);
                return result;
            }
            catch (error) {
                console.error(`Camera operation failed for ${owner.id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Execute camera operations, waiting for ownership if necessary
     */
    static withCameraWhenAvailable(position, owner, operation, timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Try to get ownership, wait if necessary
            const acquired = yield this.requestOwnership(position, owner, timeoutMs);
            if (!acquired) {
                console.warn(`Could not acquire camera ownership for ${owner.id} within timeout`);
                return null;
            }
            const camera = Camera.atPosition(position);
            if (!camera) {
                console.warn(`Camera not available at position ${position}`);
                return null;
            }
            try {
                const result = yield operation(camera);
                return result;
            }
            catch (error) {
                console.error(`Camera operation failed for ${owner.id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Request ownership and wait if necessary
     */
    static requestOwnership(position, owner, timeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ownershipManager.requestOwnershipAsync(position, owner, timeoutMs);
        });
    }
    /**
     * Release ownership
     */
    static releaseOwnership(position, owner) {
        return this.ownershipManager.releaseOwnership(position, owner);
    }
    /**
     * Check if owner has ownership
     */
    static hasOwnership(position, owner) {
        return this.ownershipManager.checkOwnership(position, owner);
    }
    /**
     * Get the camera position currently owned by the owner (if unknown)
     */
    static getOwnedPosition(owner) {
        return this.ownershipManager.getOwnedPosition(owner);
    }
    /**
     * Get all camera positions currently owned by the owner
     */
    static getAllOwnedPositions(owner) {
        return this.ownershipManager.getAllOwnedPositions(owner);
    }
    /**
     * Release ownership of all cameras owned by the owner
     */
    static releaseAllOwnerships(owner) {
        const ownedPositions = this.getAllOwnedPositions(owner);
        for (const position of ownedPositions) {
            this.releaseOwnership(position, owner);
        }
    }
}
CameraOwnershipHelper.ownershipManager = CameraOwnershipManager.getInstance();

const NoViewfinder = { type: 'none' };

class RectangularViewfinder extends DefaultSerializeable {
    get sizeWithUnitAndAspect() {
        return this._sizeWithUnitAndAspect;
    }
    set sizeWithUnitAndAspect(value) {
        this._sizeWithUnitAndAspect = value;
        this.update();
    }
    get coreDefaults() {
        return getCoreDefaults();
    }
    constructor(style, lineStyle) {
        super();
        this.type = 'rectangular';
        const viewfinderStyle = style || this.coreDefaults.RectangularViewfinder.defaultStyle;
        this._style = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].style;
        this._lineStyle = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
        this._dimming = parseFloat(this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].dimming);
        this._disabledDimming = parseFloat(this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].disabledDimming);
        this._animation = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].animation;
        this.color = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].color;
        this._sizeWithUnitAndAspect = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].size;
        this._disabledColor = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].disabledColor;
        if (lineStyle !== undefined) {
            this._lineStyle = lineStyle;
        }
    }
    get style() {
        return this._style;
    }
    get lineStyle() {
        return this._lineStyle;
    }
    get dimming() {
        return this._dimming;
    }
    set dimming(value) {
        this._dimming = value;
        this.update();
    }
    get disabledDimming() {
        return this._disabledDimming;
    }
    set disabledDimming(value) {
        this._disabledDimming = value;
        this.update();
    }
    get animation() {
        return this._animation;
    }
    set animation(animation) {
        this._animation = animation;
        this.update();
    }
    setSize(size) {
        this.sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
    }
    setWidthAndAspectRatio(width, heightToWidthAspectRatio) {
        this.sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
    }
    setHeightAndAspectRatio(height, widthToHeightAspectRatio) {
        this.sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
    }
    setShorterDimensionAndAspectRatio(fraction, aspectRatio) {
        this.sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithShorterDimensionAndAspectRatio(new NumberWithUnit(fraction, MeasureUnit.Fraction), aspectRatio);
    }
    get disabledColor() {
        return this._disabledColor;
    }
    set disabledColor(value) {
        this._disabledColor = value;
        this.update();
    }
    update() {
        var _a;
        (_a = this._onChange) === null || _a === void 0 ? void 0 : _a.call(this);
    }
}
__decorate([
    ignoreFromSerialization
], RectangularViewfinder.prototype, "_onChange", void 0);
__decorate([
    nameForSerialization('style')
], RectangularViewfinder.prototype, "_style", void 0);
__decorate([
    nameForSerialization('lineStyle')
], RectangularViewfinder.prototype, "_lineStyle", void 0);
__decorate([
    nameForSerialization('dimming')
], RectangularViewfinder.prototype, "_dimming", void 0);
__decorate([
    nameForSerialization('disabledDimming')
], RectangularViewfinder.prototype, "_disabledDimming", void 0);
__decorate([
    nameForSerialization('animation'),
    ignoreFromSerialization
], RectangularViewfinder.prototype, "_animation", void 0);
__decorate([
    nameForSerialization('size')
], RectangularViewfinder.prototype, "_sizeWithUnitAndAspect", void 0);
__decorate([
    nameForSerialization('disabledColor')
], RectangularViewfinder.prototype, "_disabledColor", void 0);

var RectangularViewfinderStyle;
(function (RectangularViewfinderStyle) {
    RectangularViewfinderStyle["Rounded"] = "rounded";
    RectangularViewfinderStyle["Square"] = "square";
})(RectangularViewfinderStyle || (RectangularViewfinderStyle = {}));

var RectangularViewfinderLineStyle;
(function (RectangularViewfinderLineStyle) {
    RectangularViewfinderLineStyle["Light"] = "light";
    RectangularViewfinderLineStyle["Bold"] = "bold";
})(RectangularViewfinderLineStyle || (RectangularViewfinderLineStyle = {}));

class AimerViewfinder extends DefaultSerializeable {
    get coreDefaults() {
        return getCoreDefaults();
    }
    constructor() {
        super();
        this.type = 'aimer';
        this.frameColor = this.coreDefaults.AimerViewfinder.frameColor;
        this.dotColor = this.coreDefaults.AimerViewfinder.dotColor;
    }
}

class LaserlineViewfinder extends DefaultSerializeable {
    get coreDefaults() {
        return getCoreDefaults();
    }
    constructor() {
        super();
        this.type = 'laserline';
        this.width = this.coreDefaults.LaserlineViewfinder.width;
        this.enabledColor = this.coreDefaults.LaserlineViewfinder.enabledColor;
        this.disabledColor = this.coreDefaults.LaserlineViewfinder.disabledColor;
    }
}

const NoneLocationSelection = { type: 'none' };

class RadiusLocationSelection extends DefaultSerializeable {
    get radius() {
        return this._radius;
    }
    static fromJSON(locationSelectionJson) {
        const radius = NumberWithUnit.fromJSON(locationSelectionJson.radius);
        return new RadiusLocationSelection(radius);
    }
    constructor(radius) {
        super();
        this.type = 'radius';
        this._radius = radius;
    }
}
__decorate([
    nameForSerialization('radius')
], RadiusLocationSelection.prototype, "_radius", void 0);

class RectangularLocationSelection extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'rectangular';
    }
    get sizeWithUnitAndAspect() {
        return this._sizeWithUnitAndAspect;
    }
    static withSize(size) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect['sizeWithWidthAndHeight'](size);
        return locationSelection;
    }
    static withWidthAndAspectRatio(width, heightToWidthAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect['sizeWithWidthAndAspectRatio'](width, heightToWidthAspectRatio);
        return locationSelection;
    }
    static withHeightAndAspectRatio(height, widthToHeightAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect['sizeWithHeightAndAspectRatio'](height, widthToHeightAspectRatio);
        return locationSelection;
    }
    static fromJSON(rectangularLocationSelectionJSON) {
        if (rectangularLocationSelectionJSON.aspect.width && rectangularLocationSelectionJSON.aspect.height) {
            const width = NumberWithUnit['fromJSON'](rectangularLocationSelectionJSON.aspect.width);
            const height = NumberWithUnit['fromJSON'](rectangularLocationSelectionJSON.aspect.height);
            const size = new SizeWithUnit(width, height);
            return this.withSize(size);
        }
        else if (rectangularLocationSelectionJSON.aspect.width && rectangularLocationSelectionJSON.aspect.aspect) {
            const width = NumberWithUnit['fromJSON'](rectangularLocationSelectionJSON.aspect.width);
            return this.withWidthAndAspectRatio(width, rectangularLocationSelectionJSON.aspect.aspect);
        }
        else if (rectangularLocationSelectionJSON.aspect.height && rectangularLocationSelectionJSON.aspect.aspect) {
            const height = NumberWithUnit['fromJSON'](rectangularLocationSelectionJSON.aspect.height);
            return this.withHeightAndAspectRatio(height, rectangularLocationSelectionJSON.aspect.aspect);
        }
        else if (rectangularLocationSelectionJSON.aspect.shorterDimension &&
            rectangularLocationSelectionJSON.aspect.aspect) {
            const shorterDimension = NumberWithUnit['fromJSON'](rectangularLocationSelectionJSON.aspect.shorterDimension);
            const sizeWithUnitAndAspect = SizeWithUnitAndAspect['sizeWithShorterDimensionAndAspectRatio'](shorterDimension, rectangularLocationSelectionJSON.aspect.aspect);
            const locationSelection = new RectangularLocationSelection();
            locationSelection._sizeWithUnitAndAspect = sizeWithUnitAndAspect;
            return locationSelection;
        }
        else {
            throw new Error(`RectangularLocationSelectionJSON is malformed: ${JSON.stringify(rectangularLocationSelectionJSON)}`);
        }
    }
}
__decorate([
    nameForSerialization('size')
], RectangularLocationSelection.prototype, "_sizeWithUnitAndAspect", void 0);

var DataCaptureViewEvents;
(function (DataCaptureViewEvents) {
    DataCaptureViewEvents["didChangeSize"] = "DataCaptureViewListener.onSizeChanged";
    DataCaptureViewEvents["onFocusGesture"] = "FocusGestureListener.onFocusGesture";
})(DataCaptureViewEvents || (DataCaptureViewEvents = {}));
const tolerantParser = createTolerantPayloadParser('DataCaptureViewController');
/**
 * Clears warn-once bookkeeping between test cases.
 * @internal Test-only; not part of this package's consumable surface.
 */
function resetDataCaptureViewPayloadParserWarnings() {
    tolerantParser.resetWarnings();
}
class DataCaptureViewController extends BaseController {
    /** `nativeViewId` reads the id of the native view this controller drives; it changes as the view is (re)created. */
    constructor(nativeViewId, listener) {
        super('DataCaptureViewProxy');
        this._listenerRegistered = false;
        this._focusGestureListenerRegistered = false;
        this._zoomGestureListenerRegistered = false;
        this.handleOnFocusGestureEventWrapper = (eventPayload) => {
            return this.handleOnFocusGestureEvent(eventPayload);
        };
        this.handleOnZoomInGestureEventWrapper = (eventPayload) => {
            return this.handleOnZoomInGestureEvent(eventPayload);
        };
        this.handleOnZoomOutGestureEventWrapper = (eventPayload) => {
            return this.handleOnZoomOutGestureEvent(eventPayload);
        };
        // Arrow function wrapper to avoid .bind(this) and always use current class state
        this.handleDidChangeSizeEventWrapper = (eventPayload) => {
            return this.handleDidChangeSizeEvent(eventPayload);
        };
        this.nativeViewId = nativeViewId;
        this.listener = listener;
        this.adapter = new CoreProxyAdapter(this._proxy);
    }
    viewPointForFramePoint(point) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = point.toJSON();
            const result = yield this.adapter.viewPointForFramePoint({
                viewId: this.nativeViewId(),
                pointJson: JSON.stringify(payload),
            });
            // Direct assignment, not `as unknown as`: PixelPoint and PointJSON are structurally
            // identical, so this keeps compiling only while that stays true.
            const validated = parsePixelPoint(JSON.parse(result));
            return Point['fromJSON'](validated);
        });
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = quadrilateral.toJSON();
            const result = yield this.adapter.viewQuadrilateralForFrameQuadrilateral({
                viewId: this.nativeViewId(),
                quadrilateralJson: JSON.stringify(payload),
            });
            const validated = parsePixelQuadrilateral(JSON.parse(result));
            return Quadrilateral['fromJSON'](validated);
        });
    }
    triggerFocus(point) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = point.toJSON();
            yield this.adapter.triggerFocus({ viewId: this.nativeViewId(), pointJson: JSON.stringify(payload) });
        });
    }
    triggerZoomIn() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.triggerZoomIn({ viewId: this.nativeViewId() });
        });
    }
    triggerZoomOut() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adapter.triggerZoomOut({ viewId: this.nativeViewId() });
        });
    }
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return this._proxy.$setDataCaptureViewPositionAndSize({ top, left, width, height, shouldBeUnderWebView });
    }
    show() {
        if (!this.hasNativeView)
            return Promise.resolve();
        return this._proxy.$showDataCaptureView({ viewId: this.nativeViewId() });
    }
    hide() {
        if (!this.hasNativeView)
            return Promise.resolve();
        return this._proxy.$hideDataCaptureView({ viewId: this.nativeViewId() });
    }
    createNativeView(view) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._proxy.$createDataCaptureView({ viewJson: JSON.stringify(view) });
            yield this.subscribeListener();
        });
    }
    // SDC-33139: `viewId` defaults to whatever the view currently owns, but an
    // orphaned-view cleanup must pass the id its own creation installed: by then
    // a remount may have overwritten the field, and removing by that id would
    // tear down the live view instead of the orphan.
    removeNativeView(viewId = this.nativeViewId()) {
        return this._proxy.$removeDataCaptureView({ viewId });
    }
    updateView(view) {
        if (!this.hasNativeView)
            return Promise.resolve();
        return this.adapter.updateDataCaptureView({ viewJson: JSON.stringify(view) });
    }
    dispose() {
        void this.unsubscribeListener();
        void this.unsubscribeFocusGestureListener();
        void this.unsubscribeZoomGestureListener();
        this._proxy.dispose();
    }
    subscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._listenerRegistered) {
                return;
            }
            yield this.adapter.registerListenerForViewEvents({ viewId: this.nativeViewId() });
            this._proxy.subscribeForEvents(Object.values(DataCaptureViewEvents));
            this._proxy.eventEmitter.on(DataCaptureViewEvents.didChangeSize, this.handleDidChangeSizeEventWrapper);
            this._listenerRegistered = true;
        });
    }
    unsubscribeListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._listenerRegistered) {
                return;
            }
            yield this.adapter.unregisterListenerForViewEvents({ viewId: this.nativeViewId() });
            this._proxy.unsubscribeFromEvents(Object.values(DataCaptureViewEvents));
            this._proxy.eventEmitter.off(DataCaptureViewEvents.didChangeSize, this.handleDidChangeSizeEventWrapper);
            this._listenerRegistered = false;
        });
    }
    updateFocusGestureListenerSubscription(focusGesture, shouldSubscribe) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!focusGesture) {
                if (this._focusGestureListenerRegistered) {
                    yield this.unsubscribeFocusGestureListener();
                }
                return;
            }
            const privateFocusGesture = focusGesture;
            const hasListeners = privateFocusGesture.listeners && privateFocusGesture.listeners.length > 0;
            if (shouldSubscribe && hasListeners && !this._focusGestureListenerRegistered) {
                yield this.subscribeFocusGestureListener();
            }
            else if (!hasListeners && this._focusGestureListenerRegistered) {
                yield this.unsubscribeFocusGestureListener();
            }
        });
    }
    subscribeFocusGestureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._focusGestureListenerRegistered || !this.hasNativeView) {
                return;
            }
            yield this.adapter.registerFocusGestureListener({ viewId: this.nativeViewId() });
            this._proxy.subscribeForEvents([FocusGestureListenerEvents.onFocusGesture]);
            this._proxy.eventEmitter.on(FocusGestureListenerEvents.onFocusGesture, this.handleOnFocusGestureEventWrapper);
            this._focusGestureListenerRegistered = true;
        });
    }
    unsubscribeFocusGestureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._focusGestureListenerRegistered) {
                return;
            }
            yield this.adapter.unregisterFocusGestureListener({ viewId: this.nativeViewId() });
            this._proxy.unsubscribeFromEvents([FocusGestureListenerEvents.onFocusGesture]);
            this._proxy.eventEmitter.off(FocusGestureListenerEvents.onFocusGesture, this.handleOnFocusGestureEventWrapper);
            this._focusGestureListenerRegistered = false;
        });
    }
    handleOnFocusGestureEvent(eventPayload) {
        const cast = EventDataParser.parseIfShouldHandle(eventPayload, {
            viewId: this.nativeViewId(),
        });
        if (cast === SKIP) {
            return;
        }
        if (cast === null) {
            console.error('DataCaptureViewController onFocusGesture payload is null');
            return;
        }
        const event = tolerantParser.parsePayloadTolerantly(cast, parseFocusGestureListenerOnFocusGesture, map => {
            // `point` is required and wire-encoded as an embedded JSON string; without it there is
            // nothing to construct a PointWithUnit from, so decline rather than fabricate one.
            if (typeof map.point !== 'string' || typeof map.viewId !== 'number' || typeof map.focusGesture !== 'string') {
                return null;
            }
            return {
                viewId: map.viewId,
                focusGesture: map.focusGesture,
                point: map.point,
                event: FocusGestureListenerEvents.onFocusGesture,
            };
        }, 'onFocusGesture');
        if (event === null) {
            return;
        }
        this.listener.didFocusGesture(event.point);
    }
    updateZoomGestureListenerSubscription(zoomGestures, shouldSubscribe) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if any of the view's gestures has listeners
            const anyHasListeners = zoomGestures.some(gesture => {
                const privateGesture = gesture;
                return privateGesture.listeners && privateGesture.listeners.length > 0;
            });
            if (shouldSubscribe && anyHasListeners && !this._zoomGestureListenerRegistered) {
                yield this.subscribeZoomGestureListener();
            }
            else if (!anyHasListeners && this._zoomGestureListenerRegistered) {
                yield this.unsubscribeZoomGestureListener();
            }
        });
    }
    selectZoomLevel(zoomLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasNativeView) {
                return Promise.resolve(zoomLevel);
            }
            return this.adapter.selectZoomLevel({ viewId: this.nativeViewId(), zoomLevel });
        });
    }
    subscribeZoomGestureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._zoomGestureListenerRegistered || !this.hasNativeView) {
                return;
            }
            yield this.adapter.registerZoomGestureListener({ viewId: this.nativeViewId() });
            this._proxy.subscribeForEvents([
                ZoomGestureListenerEvents.onZoomInGesture,
                ZoomGestureListenerEvents.onZoomOutGesture,
            ]);
            this._proxy.eventEmitter.on(ZoomGestureListenerEvents.onZoomInGesture, this.handleOnZoomInGestureEventWrapper);
            this._proxy.eventEmitter.on(ZoomGestureListenerEvents.onZoomOutGesture, this.handleOnZoomOutGestureEventWrapper);
            this._zoomGestureListenerRegistered = true;
        });
    }
    unsubscribeZoomGestureListener() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._zoomGestureListenerRegistered) {
                return;
            }
            yield this.adapter.unregisterZoomGestureListener({ viewId: this.nativeViewId() });
            this._proxy.unsubscribeFromEvents([
                ZoomGestureListenerEvents.onZoomInGesture,
                ZoomGestureListenerEvents.onZoomOutGesture,
            ]);
            this._proxy.eventEmitter.off(ZoomGestureListenerEvents.onZoomInGesture, this.handleOnZoomInGestureEventWrapper);
            this._proxy.eventEmitter.off(ZoomGestureListenerEvents.onZoomOutGesture, this.handleOnZoomOutGestureEventWrapper);
            this._zoomGestureListenerRegistered = false;
        });
    }
    handleOnZoomInGestureEvent(eventPayload) {
        const cast = EventDataParser.parseIfShouldHandle(eventPayload, {
            viewId: this.nativeViewId(),
        });
        if (cast === SKIP) {
            return;
        }
        if (cast === null) {
            console.error('DataCaptureViewController onZoomInGesture payload is null');
            return;
        }
        const event = tolerantParser.parsePayloadTolerantly(cast, parseZoomGestureListenerOnZoomInGesture, map => {
            // `viewId`/`zoomGesture` are required to route to this view's gesture listeners; without
            // them there is nothing safe to dispatch, so decline rather than guess (SDC-32670).
            if (typeof map.viewId !== 'number' || typeof map.zoomGesture !== 'string') {
                return null;
            }
            return {
                viewId: map.viewId,
                zoomGesture: map.zoomGesture,
                event: ZoomGestureListenerEvents.onZoomInGesture,
            };
        }, 'onZoomInGesture');
        if (event === null) {
            return;
        }
        // `zoomGesture` is wire-present but the view dispatches to its own `zoomGestures` local
        // state rather than the payload field -- known gap, not schematized into a new consumer.
        this.listener.didZoomInGesture();
    }
    handleOnZoomOutGestureEvent(eventPayload) {
        const cast = EventDataParser.parseIfShouldHandle(eventPayload, {
            viewId: this.nativeViewId(),
        });
        if (cast === SKIP) {
            return;
        }
        if (cast === null) {
            console.error('DataCaptureViewController onZoomOutGesture payload is null');
            return;
        }
        const event = tolerantParser.parsePayloadTolerantly(cast, parseZoomGestureListenerOnZoomOutGesture, map => {
            // Same requirement as onZoomInGesture above: decline rather than dispatch on a bad
            // payload (SDC-32670).
            if (typeof map.viewId !== 'number' || typeof map.zoomGesture !== 'string') {
                return null;
            }
            return {
                viewId: map.viewId,
                zoomGesture: map.zoomGesture,
                event: ZoomGestureListenerEvents.onZoomOutGesture,
            };
        }, 'onZoomOutGesture');
        if (event === null) {
            return;
        }
        // `zoomGesture` is wire-present but unconsumed here, same as onZoomInGesture above.
        this.listener.didZoomOutGesture();
    }
    handleDidChangeSizeEvent(eventPayload) {
        const cast = EventDataParser.parseIfShouldHandle(eventPayload, {
            viewId: this.nativeViewId(),
        });
        if (cast === SKIP) {
            return;
        }
        if (cast === null) {
            console.error('DataCaptureViewController didChangeSize payload is null');
            return;
        }
        const event = tolerantParser.parsePayloadTolerantly(cast, parseDataCaptureViewListenerOnSizeChanged, map => {
            // `size.width`/`size.height` feed Size.fromJSON downstream -- Android sends Int, iOS
            // sends CGFloat, so accept any `number`, but a non-object `size` or non-numeric field
            // must decline rather than produce a Size with NaN/undefined dimensions (SDC-32670).
            if (typeof map.viewId !== 'number' || typeof map.orientation !== 'string') {
                return null;
            }
            const size = map.size;
            if (typeof size !== 'object' ||
                size === null ||
                typeof size.width !== 'number' ||
                typeof size.height !== 'number') {
                return null;
            }
            return {
                viewId: map.viewId,
                size: { width: size.width, height: size.height },
                orientation: map.orientation,
                event: DataCaptureViewEvents.didChangeSize,
            };
        }, 'didChangeSize');
        if (event === null) {
            return;
        }
        this.listener.didChangeSize(Size['fromJSON'](event.size), event.orientation);
    }
    get hasNativeView() {
        return this.nativeViewId() > 0;
    }
}

function generateIdentifier() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Lets a base *View class's action methods await native view creation. Resolves
// true once creation completes, false if it never will (creation rejected, timed
// out, or the view was disposed/removed). It never rejects, so callers branch on
// the boolean.
//
// Invariants:
//   - Each cycle settles only through the handle `begin()` returns. A view can
//     be disposed while its creation round trip is in flight, and that stale
//     attempt must not satisfy a gate re-armed for the next lifecycle.
//   - `begin()` adopts a promise callers are already parked on rather than
//     replacing it: a caller can legitimately arrive one tick before creation is
//     kicked off, and a fresh promise would strand it.
//   - After `markAbandoned()` the gate stays settled-false until the next
//     `begin()`, so a caller arriving post-teardown returns early instead of
//     parking on a promise nothing resolves.
//   - Every wait is bounded, so a native round trip that never returns cannot
//     park callers forever.
// Deadlines the creation cycle rather than any individual caller, so a caller
// arriving late in a slow creation gets a shorter effective wait. The timer is
// `unref`'d and cleared on settle, so an unawaited gate costs nothing.
const VIEW_CREATION_TIMEOUT_MS = 15000;
// Bounds a wait on a gate whose creation cycle has never been kicked off
// (`generation === 0`). Nothing is in flight to wait for, so the only question
// is how far behind the caller `begin()` is. On the normal path that is
// microtask-close: `tryCreateNativeView()` calls `createNativeView()`
// synchronously. But the Android components also drive creation from a
// `requestAnimationFrame` retry loop when `findNodeHandle` has no tag yet
// (SDC-32583; e.g. `BarcodePickView.tsx` scheduleCreateNativeView), and on a
// congested JS thread that loop can take many frames — so this budget covers
// tens of frames rather than a couple of ticks. Timing out here no-ops the very
// call this gate exists to deliver, so it is deliberately generous relative to
// the microtask case while staying far below the full creation bound.
//
// RESIDUAL RISK, deliberately documented rather than resolved (review rounds
// 23-25): this is a fixed wall-clock budget over a retry loop with no bound of
// its own, so under enough JS-thread congestion a caller can still settle false
// before `begin()` ever opens a cycle. Where the caller's action method writes a
// serialised flag (BarcodeAr/BarcodePick `start`, BarcodeFind `startSearching`)
// the creation payload that follows carries the intent anyway and native still
// acts on it, so the call is not lost. Three call sites have no such flag and
// ARE lost in that case, with only a Warn:
//   - `BaseDataCaptureView.show()` / `.hide()`
//   - `BaseSparkScanView.startScanning()`
//   - `BarcodeCountViewController.endScanningPhase()` / `startScanningPhase()`
// The structural fix is for the RN components to signal "an attempt is
// scheduled" as they enter `scheduleCreateNativeView`, letting the gate apply
// the full bound from that point and leaving this budget to the genuinely
// never-attached Cordova/Capacitor case. Not done here: it re-touches the
// creation path in all six components, so it is the ticket owner's call.
// The full 15 s bound would apply to callers with nothing to wait for at all: a
// view configured but never attached parks a `show()`/`hide()`, a
// `BarcodeCountViewController.endScanningPhase()`, or every property setter
// routed through `BaseBarcodeFindView.update()` for the full timeout where
// before this change they returned immediately. Once `begin()` opens a cycle
// the full bound applies, so a genuinely slow native round trip is unaffected.
const VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS = 1000;
class ViewCreationGate {
    constructor(creationTimeoutMs = VIEW_CREATION_TIMEOUT_MS, preBeginTimeoutMs = VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS) {
        this.creationTimeoutMs = creationTimeoutMs;
        this.preBeginTimeoutMs = preBeginTimeoutMs;
        this.generation = 0;
        // Whether a gated method is actually parked on this cycle. `resolve` cannot
        // answer that: it is armed in the constructor and only cleared by `settle()`,
        // so it means "not yet settled" — true for a view that was constructed, never
        // laid out, and disposed.
        this.hasWaiter = false;
        this.created$ = new Promise(resolve => (this.resolve = resolve));
    }
    // Identifies the current creation cycle. A caller that samples this before
    // writing state which `toJSON()` serialises can tell, after awaiting, whether
    // a cycle opened in between — i.e. whether creation carried that state to
    // native already and a second dispatch would be redundant.
    currentGeneration() {
        return this.generation;
    }
    whenCreated() {
        // Only a caller on an unsettled cycle actually parks; on a settled gate this
        // hands back the memoized result immediately, which is not a wait and must
        // not arm the teardown warning.
        if (this.resolve !== undefined) {
            this.hasWaiter = true;
        }
        // Bound the wait from the moment someone actually waits, so a view whose
        // creation is never kicked off releases its callers instead of hanging.
        this.armTimeout();
        return this.created$;
    }
    // Starts a creation cycle. Only the returned handle can settle this cycle;
    // once the gate has moved on, the handle's calls are ignored. Opening a cycle
    // supersedes any still-in-flight one, so two overlapping attempts can't alias
    // and have the first satisfy waiters belonging to the second.
    begin() {
        const generation = ++this.generation;
        const isCurrent = () => generation === this.generation;
        if (this.resolve === undefined) {
            // The previous cycle already settled — arm a fresh promise for this one.
            // Nobody is parked on it yet, so the waiter flag starts clean.
            this.created$ = new Promise(resolve => (this.resolve = resolve));
            this.hasWaiter = false;
        }
        // Otherwise keep the promise callers are already parked on: they arrived
        // from `onLayout` a tick before creation was kicked off.
        this.clearTimer();
        this.armTimeout();
        return {
            isCurrent,
            succeeded: () => {
                if (isCurrent()) {
                    this.settle(true);
                }
            },
            failed: () => {
                if (isCurrent()) {
                    this.warn('native view creation failed; view methods will no-op');
                    this.settle(false);
                }
            },
        };
    }
    // The view is going away (dispose/removeNativeView): release anyone parked on
    // the gate and stay terminal until the next `begin()`. Re-arming here would
    // hand every later caller a promise nothing resolves.
    markAbandoned() {
        const hadWaiters = this.hasWaiter && this.resolve !== undefined;
        this.generation += 1;
        this.settle(false);
        if (hadWaiters) {
            // A gated method that was parked here now returns having done nothing.
            // The failure and timeout paths warn; without this, teardown-during-wait
            // is the one silent case — the same shape this gate exists to remove.
            this.warn('view torn down while a caller waited for creation; the call did not reach native');
        }
    }
    settle(created) {
        this.clearTimer();
        this.hasWaiter = false;
        const resolve = this.resolve;
        this.resolve = undefined;
        if (resolve !== undefined) {
            resolve(created);
        }
        else {
            // Already settled (or never armed): replace the memoized result so
            // callers arriving later see the current lifecycle state.
            this.created$ = Promise.resolve(created);
        }
    }
    // Starts the bound for the current wait, if one is needed and not already
    // running. Tied to the generation so a superseded cycle's timer is inert.
    armTimeout() {
        var _a, _b;
        if (this.resolve === undefined)
            return; // already settled — nothing to bound
        if (this.timer !== undefined)
            return; // already bounded
        const generation = this.generation;
        // No cycle has ever opened, so bound this on the short pre-`begin()` budget.
        // `begin()` clears and re-arms, which upgrades a caller that arrived first to
        // the full bound.
        const timeoutMs = generation === 0 ? this.preBeginTimeoutMs : this.creationTimeoutMs;
        if (timeoutMs <= 0)
            return;
        const timer = setTimeout(() => {
            if (generation === this.generation && this.resolve !== undefined) {
                this.warn('native view creation did not complete in time; view methods will no-op', {
                    timeoutMs,
                });
                this.settle(false);
            }
        }, timeoutMs);
        this.timer = timer;
        // A view dropped without dispose() would otherwise keep this handle alive
        // for the full timeout (and surface as an open handle under Jest). No-op
        // in React Native, where setTimeout returns a plain number.
        (_b = (_a = timer).unref) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    clearTimer() {
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
    warn(message, fields) {
        ScanditLogger.emit(LogLevel.Warn, LogCategory.Lifecycle, 'ts.core', message, fields);
    }
}

/**
 * Overlay classes the native bridge keys by type alone, so a view can hold at most one.
 *
 * Kept off the public API surface and out of the overlay classes themselves: the value is a
 * display name rather than `constructor.name`, which a minified React Native release bundle
 * mangles exactly where a customer reads the error.
 *
 * @internal
 */
const singleInstanceOverlayNames = new Map();
/** @internal */
function markSingleInstancePerView(overlayClass, displayName) {
    singleInstanceOverlayNames.set(overlayClass, displayName);
}
/** @internal */
function singleInstanceOverlayName(overlay) {
    return singleInstanceOverlayNames.get(overlay.constructor);
}
class BaseDataCaptureView extends DefaultSerializeable {
    get context() {
        return this._context;
    }
    set context(context) {
        if (context != null) {
            context.attachView(this);
        }
        this._context = context;
    }
    get coreDefaults() {
        return getCoreDefaults();
    }
    get scanAreaMargins() {
        return this._scanAreaMargins;
    }
    get viewId() {
        var _a;
        return (_a = this._viewId) !== null && _a !== void 0 ? _a : -1;
    }
    set viewId(newValue) {
        this._viewId = newValue;
    }
    set scanAreaMargins(newValue) {
        this._scanAreaMargins = newValue;
        void this.updateNativeView();
    }
    get pointOfInterest() {
        return this._pointOfInterest;
    }
    set pointOfInterest(newValue) {
        this._pointOfInterest = newValue;
        void this.updateNativeView();
    }
    get logoAnchor() {
        return this._logoAnchor;
    }
    set logoAnchor(newValue) {
        this._logoAnchor = newValue;
        void this.updateNativeView();
    }
    get logoOffset() {
        return this._logoOffset;
    }
    set logoOffset(newValue) {
        this._logoOffset = newValue;
        void this.updateNativeView();
    }
    get focusGesture() {
        return this._focusGesture;
    }
    set focusGesture(newValue) {
        if (this._focusGesture) {
            const privateFocusGesture = this._focusGesture;
            privateFocusGesture.onListenersChanged = undefined;
            privateFocusGesture._controller = null;
            void this.controller.updateFocusGestureListenerSubscription(this._focusGesture, false);
        }
        this._focusGesture = newValue;
        if (newValue) {
            const privateFocusGesture = newValue;
            privateFocusGesture._controller = this.controller;
            privateFocusGesture.onListenersChanged = () => {
                void this.controller.updateFocusGestureListenerSubscription(newValue, true);
            };
            void this.controller.updateFocusGestureListenerSubscription(newValue, true);
        }
        void this.updateNativeView();
    }
    get zoomGestures() {
        return this._zoomGestures;
    }
    set zoomGestures(newValue) {
        // Detach old gestures
        for (const gesture of this._zoomGestures) {
            const privateGesture = gesture;
            privateGesture.onListenersChanged = undefined;
            privateGesture._controller = null;
            void this.controller.updateZoomGestureListenerSubscription(this._zoomGestures, false);
        }
        this._zoomGestures = newValue;
        // Attach new gestures
        for (const gesture of this._zoomGestures) {
            const privateGesture = gesture;
            privateGesture._controller = this.controller;
            privateGesture.onListenersChanged = () => {
                void this.controller.updateZoomGestureListenerSubscription(this._zoomGestures, true);
            };
            void this.controller.updateZoomGestureListenerSubscription(this._zoomGestures, true);
        }
        void this.updateNativeView();
    }
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    get zoomGesture() {
        var _a;
        return (_a = this._zoomGestures[0]) !== null && _a !== void 0 ? _a : null;
    }
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue) {
        this.zoomGestures = newValue != null ? [newValue] : [];
    }
    get logoStyle() {
        return this._logoStyle;
    }
    set logoStyle(newValue) {
        this._logoStyle = newValue;
        void this.updateNativeView();
    }
    get shouldShowZoomNotification() {
        return this._shouldShowZoomNotification;
    }
    set shouldShowZoomNotification(newValue) {
        this._shouldShowZoomNotification = newValue;
        void this.updateNativeView();
    }
    /**
     * Resolves true once this view's native counterpart exists, false if it
     * never will (creation failed, timed out, or the view was torn down).
     *
     * Callers that arrive before creation has been kicked off park until it is,
     * bounded by VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS; once a creation cycle is in
     * flight the bound is VIEW_CREATION_TIMEOUT_MS. Reachable on Cordova/Capacitor
     * when a view method runs before connectToElement().
     *
     * @internal Not part of the documented API surface: it exists so the base
     * view's own action methods can await creation, and is public only because
     * the framework plugins reach it across package boundaries.
     */
    whenViewCreated() {
        return this.viewCreationGate.whenCreated();
    }
    get privateContext() {
        return this.context;
    }
    static forContext(context) {
        const view = new BaseDataCaptureView(context);
        view.context = context;
        return view;
    }
    constructor(context) {
        var _a;
        super();
        this.parentId = null;
        this.overlays = [];
        this.listeners = [];
        this._context = null;
        this._viewId = -1;
        this.controls = [];
        this.isViewCreated = false;
        // SDC-33139: lets a method called before createNativeView finishes (e.g.
        // from a consumer's `onLayout`) await native view creation instead of
        // silently no-oping.
        this.viewCreationGate = new ViewCreationGate();
        this.context = context;
        this._scanAreaMargins = this.coreDefaults.DataCaptureView.scanAreaMargins;
        this._pointOfInterest = this.coreDefaults.DataCaptureView.pointOfInterest;
        this._logoAnchor = this.coreDefaults.DataCaptureView.logoAnchor;
        this._logoOffset = this.coreDefaults.DataCaptureView.logoOffset;
        this._focusGesture = this.coreDefaults.DataCaptureView.focusGesture;
        this._zoomGestures = [];
        this._logoStyle = this.coreDefaults.DataCaptureView.logoStyle;
        this._shouldShowZoomNotification = (_a = this.coreDefaults.DataCaptureView.shouldShowZoomNotification) !== null && _a !== void 0 ? _a : true;
        this.controller = new DataCaptureViewController(() => this.viewId, {
            didChangeSize: (size, orientation) => this.notifyListenersOfDidChangeSize(size, orientation),
            didFocusGesture: pointJson => this.notifyFocusGestureListeners(pointJson),
            didZoomInGesture: () => this.notifyZoomGestureListeners((listener, gesture) => { var _a; return (_a = listener.didZoomInGesture) === null || _a === void 0 ? void 0 : _a.call(listener, gesture); }),
            didZoomOutGesture: () => this.notifyZoomGestureListeners((listener, gesture) => { var _a; return (_a = listener.didZoomOutGesture) === null || _a === void 0 ? void 0 : _a.call(listener, gesture); }),
        });
        // Wire up default zoom gestures after controller is available
        this.zoomGestures = this.coreDefaults.DataCaptureView.zoomGestures;
    }
    /**
     * Adds an overlay to this view.
     *
     * Rejects when the overlay is one the native bridge can hold only one of (currently
     * `ColorFillOverlay`) and the view already has one, so the returned promise needs handling.
     */
    addOverlay(overlay) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.overlays.includes(overlay)) {
                return;
            }
            this.rejectDuplicateSingleInstanceOverlay(overlay);
            overlay.view = this;
            this.overlays.push(overlay);
            yield this.updateNativeView();
        });
    }
    /**
     * Overlays the native bridge keys by type alone cannot be told apart once two are attached: the
     * second displaces the first in the key map, leaving an overlay that is drawn but unreachable,
     * and a later remove is a no-op. A class opts into that constraint by calling
     * `markSingleInstancePerView` at module scope.
     */
    rejectDuplicateSingleInstanceOverlay(overlay) {
        const name = singleInstanceOverlayName(overlay);
        if (name === undefined) {
            return;
        }
        if (this.overlays.some(existing => existing.constructor === overlay.constructor)) {
            throw new Error(`A DataCaptureView can hold only one ${name}. ` +
                'Remove the existing one before adding another, or change its properties in place.');
        }
    }
    /**
     * Re-serializes the view so a mutated overlay reaches native. Overlays that are not owned by
     * a capture mode have no controller of their own, and the native overlay diff keys on
     * `type:modeId` — which never changes — so an in-place property change is invisible without this.
     *
     * @internal
     */
    overlayDidChange(overlay) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.overlays.includes(overlay)) {
                return;
            }
            yield this.updateNativeView();
        });
    }
    removeOverlay(overlay) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.overlays.includes(overlay)) {
                return;
            }
            overlay.view = null;
            this.overlays.splice(this.overlays.indexOf(overlay), 1);
            yield this.updateNativeView();
        });
    }
    removeAllOverlays() {
        if (this.overlays.length === 0) {
            return;
        }
        const overlaysCopy = [...this.overlays];
        for (const overlay of overlaysCopy) {
            overlay.view = null;
            this.overlays.splice(this.overlays.indexOf(overlay), 1);
        }
        void this.updateNativeView();
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
    removeListener(listener) {
        if (this.listeners.includes(listener)) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        }
    }
    viewPointForFramePoint(point) {
        return this.controller.viewPointForFramePoint(point);
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
        return this.controller.viewQuadrilateralForFrameQuadrilateral(quadrilateral);
    }
    triggerFocus(point) {
        return this.controller.triggerFocus(point);
    }
    triggerZoomIn() {
        return this.controller.triggerZoomIn();
    }
    triggerZoomOut() {
        return this.controller.triggerZoomOut();
    }
    addControl(control) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.controls.includes(control)) {
                control.view = this;
                this.controls.push(control);
                yield this.updateNativeView();
            }
        });
    }
    addControlWithAnchorAndOffset(control, anchor, offset) {
        if (!this.controls.includes(control)) {
            control.view = this;
            control.anchor = anchor;
            control.offset = offset;
            this.controls.push(control);
            void this.updateNativeView();
        }
    }
    removeControl(control) {
        if (this.controls.includes(control)) {
            control.view = null;
            this.controls.splice(this.controls.indexOf(control), 1);
            void this.updateNativeView();
        }
    }
    controlUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateNativeView();
        });
    }
    createNativeView(viewId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isViewCreated) {
                return Promise.resolve();
            }
            this.viewId = viewId;
            const attempt = this.viewCreationGate.begin();
            try {
                yield this.controller.createNativeView(this.toJSON());
                if (!attempt.isCurrent()) {
                    // Superseded by a teardown while the round trip was in flight. Leave
                    // isViewCreated false so a remount re-creates instead of taking the
                    // early return above and never opening a new cycle.
                    //
                    // Native created a view nobody owns: the teardown that superseded this
                    // attempt took its `!isViewCreated` early return and issued no removal,
                    // so without this every detach-during-creation cycle leaks one.
                    //
                    // Remove by this attempt's own id rather than whatever `this.viewId`
                    // reads now: a remount during the round trip installs its own id, and
                    // removing by that would tear down the live view instead of the orphan.
                    // The native `$removeDataCaptureView` payload has always carried an
                    // explicit viewId, so no native support is needed for this.
                    try {
                        yield this.controller.removeNativeView(viewId);
                    }
                    catch (removalError) {
                        // Cleanup is best-effort. This runs under a fire-and-forget
                        // `void createNativeView(...)` on unmount, and `dispose()` has
                        // already disposed the controller's proxy by now, so a rejection
                        // here would surface as an unhandled rejection during teardown
                        // rather than reaching any caller.
                        ScanditLogger.emit(LogLevel.Warn, LogCategory.Lifecycle, 'ts.core', 'orphaned native view removal failed', {
                            viewId,
                            error: String(removalError),
                        });
                    }
                    return;
                }
                this.isViewCreated = true;
                this.notifyOverlaysOfViewIdChange();
                // Release the gate BEFORE the flush (review round 25). The gate's contract
                // is "does the native view exist?", and it does as soon as
                // `createNativeView()` resolves — nothing about the flush bears on that.
                // Resolving behind the flush left the 15 s creation deadline running
                // across an extra bridge round trip, so a slow flush timed the gate out
                // and every parked caller returned having done nothing against a view
                // that was created and healthy — this MR's own symptom, reported as
                // 'creation did not complete in time', which would have been untrue. It
                // also made every gated caller wait out that round trip on every mount.
                // Safe: the `isCurrent()` check above already handled teardown, and
                // `succeeded()` is a no-op once superseded.
                attempt.succeeded();
                // SDC-33139: creation now serialises its payload before the consumer's
                // `onLayout` body runs, so a property written from there (measuring the
                // laid-out box is what `onLayout` is for — `scanAreaMargins`,
                // `pointOfInterest`) went out as a separate update while creation was
                // still in flight, and nothing re-flushed it afterwards. Mirror
                // `SparkScanViewController.createView()` and flush once the round trip
                // has landed. Idempotent, and non-fatal: the native view already exists,
                // so a failed flush must not fail creation.
                // Wrapped so the flush is TOTAL (review round 26): these controller
                // methods are not `async`, so a SYNCHRONOUS throw from the body
                // (`toJSON()`/`JSON.stringify` on an unserialisable overlay or control
                // payload) bypasses `.catch()` entirely and lands in the `catch` below —
                // which would call `attempt.failed()` after `succeeded()`, latching the
                // gate false and memoizing it for a view that exists. Every later gated
                // call on that view would then no-op for its whole lifetime: exactly the
                // permanent silent no-op this MR exists to remove.
                yield Promise.resolve()
                    .then(() => this.updateNativeView())
                    .catch(error => {
                    ScanditLogger.emit(LogLevel.Warn, LogCategory.Lifecycle, 'ts.core', 'post-creation view update failed', {
                        viewId,
                        error: String(error),
                    });
                });
            }
            catch (e) {
                attempt.failed();
                throw e;
            }
        });
    }
    // Native needs the full view JSON; skip serializing it until a native view exists.
    updateNativeView() {
        if (!this.controller.hasNativeView)
            return Promise.resolve();
        return this.controller.updateView(this.toJSON());
    }
    notifyListenersOfDidChangeSize(size, orientation) {
        this.listeners.forEach(listener => {
            if (listener.didChangeSize) {
                listener.didChangeSize(this.viewComponent, size, orientation);
            }
        });
    }
    notifyFocusGestureListeners(pointJson) {
        const focusGesture = this._focusGesture;
        if (!focusGesture) {
            return;
        }
        const privateFocusGesture = focusGesture;
        if (!privateFocusGesture.listeners || privateFocusGesture.listeners.length === 0) {
            return;
        }
        // `point` is wire-encoded as a JSON string (native serializes it via toJson()/jsonString),
        // not an object -- it must be decoded before PointWithUnit.fromJSON can read `.x`/`.y` off it.
        // Reading the raw string directly silently produced an object with undefined x/y (SDC-32670).
        let decodedPoint;
        try {
            decodedPoint = JSON.parse(pointJson);
        }
        catch (error) {
            console.error(`DataCaptureViewController onFocusGesture: failed to parse embedded point JSON: ${String(error)}`);
            return;
        }
        const point = PointWithUnit['fromJSON'](decodedPoint);
        privateFocusGesture.listeners.forEach(listener => {
            if (listener.didFocusGesture) {
                listener.didFocusGesture(focusGesture, point);
            }
        });
    }
    // In/out gestures dispatch identically; only the listener method differs.
    notifyZoomGestureListeners(invoke) {
        var _a;
        for (const zoomGesture of this._zoomGestures) {
            const privateZoomGesture = zoomGesture;
            (_a = privateZoomGesture.listeners) === null || _a === void 0 ? void 0 : _a.forEach(listener => invoke(listener, zoomGesture));
        }
    }
    notifyOverlaysOfViewIdChange() {
        this.overlays.forEach(overlay => {
            if (typeof overlay.onViewIdChanged === 'function') {
                overlay.onViewIdChanged();
            }
        });
    }
    removeNativeView() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isViewCreated) {
                // `isViewCreated` flips only after the creation round trip, so getting
                // here can also mean creation is still IN FLIGHT. Supersede it: without
                // this, the in-flight attempt stays current and its `succeeded()`
                // resolves the gate `true` for a view that was asked to go away, and a
                // caller parked in show()/hide() then dispatches against it. Reachable
                // from Cordova's `detachFromElement()`, which does not await removal.
                this.viewCreationGate.markAbandoned();
                return Promise.resolve();
            }
            try {
                yield this.controller.removeNativeView();
            }
            finally {
                // Releasing the gate is cleanup: it must not depend on the native
                // teardown call succeeding, or callers parked on it stay parked.
                this.isViewCreated = false;
                this.viewCreationGate.markAbandoned();
            }
        });
    }
    dispose() {
        this.removeAllOverlays();
        this.listeners.forEach(listener => this.removeListener(listener));
        try {
            this.controller.dispose();
        }
        finally {
            this.viewId = -1;
            this.isViewCreated = false;
            this.viewCreationGate.markAbandoned();
        }
    }
    // HTML Views only
    setFrame(frame, isUnderContent = false) {
        return this.setPositionAndSize(frame.origin.y, frame.origin.x, frame.size.width, frame.size.height, isUnderContent);
    }
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return this.controller.setPositionAndSize(top, left, width, height, shouldBeUnderWebView);
    }
    // Deliberately not `async`: the context check threw synchronously before the
    // creation gate existed, and Cordova's `elementDidChange` calls `_show()`
    // without awaiting or catching. Keeping the throw synchronous preserves that
    // contract; only the gated part is deferred.
    /**
     * No-ops if native view creation never completes (it failed, timed out, or
     * the view was torn down); the gate emits a Warn in that case. There is
     * currently no public hook to detect it: `whenViewCreated()` is internal to
     * this base view, and the React Native components do not re-expose it.
     */
    show() {
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.showWhenCreated();
    }
    showWhenCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.whenViewCreated())) {
                return;
            }
            yield this.controller.show();
        });
    }
    // Synchronous throw, for the same reason as `show()`.
    /**
     * No-ops if native view creation never completes (it failed, timed out, or
     * the view was torn down); the gate emits a Warn in that case. There is
     * currently no public hook to detect it: `whenViewCreated()` is internal to
     * this base view, and the React Native components do not re-expose it.
     */
    hide() {
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.hideWhenCreated();
    }
    hideWhenCreated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.whenViewCreated())) {
                return;
            }
            yield this.controller.hide();
        });
    }
    setProperty(name, value) {
        this[name] = value;
        void this.updateNativeView();
    }
    selectZoomLevel(zoomLevel) {
        return this.controller.selectZoomLevel(zoomLevel);
    }
}
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "viewComponent", void 0);
__decorate([
    nameForSerialization('parentId'),
    ignoreFromSerializationIfNull
], BaseDataCaptureView.prototype, "parentId", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "coreDefaults", null);
__decorate([
    nameForSerialization('scanAreaMargins')
], BaseDataCaptureView.prototype, "_scanAreaMargins", void 0);
__decorate([
    nameForSerialization('viewId')
], BaseDataCaptureView.prototype, "_viewId", void 0);
__decorate([
    nameForSerialization('pointOfInterest')
], BaseDataCaptureView.prototype, "_pointOfInterest", void 0);
__decorate([
    nameForSerialization('logoAnchor')
], BaseDataCaptureView.prototype, "_logoAnchor", void 0);
__decorate([
    nameForSerialization('logoOffset')
], BaseDataCaptureView.prototype, "_logoOffset", void 0);
__decorate([
    nameForSerialization('focusGesture')
], BaseDataCaptureView.prototype, "_focusGesture", void 0);
__decorate([
    nameForSerialization('zoomGestures')
], BaseDataCaptureView.prototype, "_zoomGestures", void 0);
__decorate([
    nameForSerialization('logoStyle')
], BaseDataCaptureView.prototype, "_logoStyle", void 0);
__decorate([
    nameForSerialization('shouldShowZoomNotification')
], BaseDataCaptureView.prototype, "_shouldShowZoomNotification", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "isViewCreated", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "viewCreationGate", void 0);

/**
 * Fills the whole view with a single colour.
 *
 * A view holds at most one. This overlay belongs to no capture mode, so the native bridge keys it
 * by type alone (`colorFill:-1`) and cannot tell two instances apart; adding a second is rejected
 * rather than silently attaching an overlay that could never be removed again.
 */
class ColorFillOverlay extends DefaultSerializeable {
    get color() {
        return this._color;
    }
    set color(color) {
        var _a;
        this._color = color;
        // The overlay diff on the native side keys on `type:modeId`, which never changes for a
        // core overlay, so a re-serialized view is the only way a new color reaches native.
        void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.overlayDidChange(this));
    }
    // `color?: Color` rather than a defaulted parameter: the docs signature collector renders a
    // default expression into the emitted signature, so `color: Color = Color.fromRGBA(...)` is
    // collected as `constructor(color: Color(0, 0, 0, 0))` and no longer matches the rst entry.
    // Same shape SparkScan uses for its optional settings.
    constructor(color) {
        super();
        this.type = 'colorFill';
        this.view = null;
        this._color = color !== null && color !== void 0 ? color : Color.fromRGBA(0, 0, 0, 0);
    }
}
__decorate([
    nameForSerialization('color')
], ColorFillOverlay.prototype, "_color", void 0);
__decorate([
    ignoreFromSerialization
], ColorFillOverlay.prototype, "view", void 0);
markSingleInstancePerView(ColorFillOverlay, 'ColorFillOverlay');

class LicenseInfo extends DefaultSerializeable {
    get expiration() {
        return this._expiration;
    }
}
__decorate([
    nameForSerialization('expiration')
], LicenseInfo.prototype, "_expiration", void 0);

var Expiration;
(function (Expiration) {
    Expiration["Available"] = "available";
    Expiration["Perpetual"] = "perpetual";
    Expiration["NotAvailable"] = "notAvailable";
})(Expiration || (Expiration = {}));

/**
 * JS Proxy hook to act as middleware to all the calls performed by an AdvancedNativeProxy instance
 * This will allow AdvancedNativeProxy to call dynamically the methods defined in the interface defined
 * as parameter in createNativeProxy function
 */
const nativeProxyHook = {
    /**
     * Dynamic property getter for the AdvancedNativeProxy
     *
     * Prefix Conventions:
     * - `$methodName` - Regular native method calls (one-time execution)
     * - `$$methodName` - Event registration methods (persistent listeners)
     * - `on$eventName` - Event handler registration
     *
     * The `$$` prefix is used for methods that establish persistent event listeners on the native side
     * (using callbackContext.successAndKeepCallback() in Cordova). This enables automatic detection
     * in Cordova without requiring manual event configuration lists.
     *
     * Examples:
     * - `$$registerListenerForCameraEvents()` - Sets up persistent camera event listener
     * - `$unregisterListenerForCameraEvents()` - Regular call to cleanup (not persistent)
     * - `$getCurrentCameraState()` - Regular one-time native method call
     *
     * @param advancedNativeProxy
     * @param prop
     */
    get(nativeProxy, prop) {
        // Early return if prop is not a string
        if (typeof prop !== 'string') {
            return undefined;
        }
        // Important: $, and $$ are required since if they are not added all
        // properties present on AdvancedNativeProxy will be redirected to the
        // advancedNativeProxy._call, which will call native even for the own
        // properties of the class
        // Event registration methods with $$ prefix
        // These establish persistent event listeners (callbackContext.successAndKeepCallback())
        // and get special handling in Cordova to set up continuous event callbacks
        if (prop.startsWith('$$')) {
            return (args) => {
                const methodName = prop.substring(2);
                return nativeProxy._callEventRegistration(methodName, args);
            };
        }
        // All the methods with the following structure
        // $methodName will be redirected to the special _call
        // method on AdvancedNativeProxy
        if (prop.startsWith('$')) {
            if (prop in nativeProxy) {
                return nativeProxy[prop];
            }
            return (args) => {
                return nativeProxy._call(prop.substring(1), args);
            };
        }
        else {
            return nativeProxy[prop];
        }
    },
};
class NativeProxy {
    constructor(nativeCaller) {
        this.eventEmitter = new EventEmitter();
        this.nativeCaller = nativeCaller;
        this.eventSubscriptions = new Map();
        this.eventHandlers = new Map();
        // Create the cached handler once
        this.cachedEventHandler = (eventName) => (args) => __awaiter(this, void 0, void 0, function* () {
            this.eventEmitter.emit(eventName, args);
            return Promise.resolve();
        });
        // Instrument the bridge calls for logging before the JS Proxy wraps the instance.
        this._call = instrumentBridgeCall(this._call, this, BridgeCallKind.Method);
        this._callEventRegistration = instrumentBridgeCall(this._callEventRegistration, this, BridgeCallKind.EventRegistration);
        // Wrapping the NativeProxy instance with the JS proxy hook
        return new Proxy(this, nativeProxyHook);
    }
    get framework() {
        if ('framework' in this.nativeCaller) {
            return this.nativeCaller.framework;
        }
        return 'unknown';
    }
    get frameworkVersion() {
        if ('frameworkVersion' in this.nativeCaller) {
            return this.nativeCaller.frameworkVersion;
        }
        return 'unknown';
    }
    subscribeForEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const event of events) {
                yield this._registerEvent(event);
            }
        });
    }
    unsubscribeFromEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const event of events) {
                yield this._unregisterEvent(event);
            }
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const nativeEventName of this.eventSubscriptions.keys()) {
                yield this._unregisterEvent(nativeEventName);
            }
            this.eventSubscriptions.clear();
        });
    }
    _call(fnName, args) {
        return this.nativeCaller.callFn(fnName, args);
    }
    _callEventRegistration(fnName, args) {
        return this.nativeCaller.callFn(fnName, args, { isEventRegistration: true });
    }
    _registerEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.cachedEventHandler(event);
            const subscription = yield this.nativeCaller.registerEvent(event, handler);
            this.eventSubscriptions.set(event, subscription);
        });
    }
    _unregisterEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = this.eventSubscriptions.get(event);
            if (!subscription) {
                // Event was never registered or already unregistered, skip
                return;
            }
            yield this.nativeCaller.unregisterEvent(event, subscription);
            this.eventSubscriptions.delete(event);
        });
    }
}
function createNativeProxy(nativeCaller) {
    return new NativeProxy(nativeCaller);
}

function registerProxies(proxyTypeNames, provider) {
    proxyTypeNames.forEach(proxyType => {
        FactoryMaker.bindLazyInstance(proxyType, () => {
            const caller = provider.getNativeCaller(proxyType);
            return createNativeProxy(caller);
        });
    });
}

const CORE_PROXY_TYPE_NAMES = ['CoreProxy', 'DataCaptureViewProxy', 'DataCaptureContextProxy'];

/**
 * Binds the core proxies and arms debug mode on the resulting core proxy.
 *
 * Every framework bootstraps by this one path: the log receiver used to be
 * installed by a copy of the same block in each wrapper's `init*Proxy`, which
 * let the three copies drift. Frameworks whose bridge needs an explicit event
 * registration before native delivers anything declare
 * `requiresNativeLogChannel` on their provider (Cordova alone, today).
 */
function registerCoreProxies(provider) {
    registerProxies(CORE_PROXY_TYPE_NAMES, provider);
    const coreProxy = FactoryMaker.getInstance('CoreProxy');
    if (!coreProxy) {
        return;
    }
    // Ordering: the batch handler and subscribeForEvents must be in place before the
    // native channel opens, so Cordova's opens from onInstalled, not alongside it.
    armNativeLogReceiver(coreProxy, () => {
        // subscribeNativeLogChannel already catches and warns internally; it never rejects.
        if (provider.requiresNativeLogChannel)
            void subscribeNativeLogChannel(coreProxy);
    });
}

var ClusteringMode;
(function (ClusteringMode) {
    ClusteringMode["Disabled"] = "disabled";
    ClusteringMode["Manual"] = "manual";
    ClusteringMode["Auto"] = "auto";
    ClusteringMode["AutoWithManualCorrection"] = "autoWithManualCorrection";
})(ClusteringMode || (ClusteringMode = {}));

export { AimerViewfinder, Anchor, BaseController, BaseDataCaptureView, Brush, CORE_PROXY_LOG_METADATA, CORE_PROXY_TYPE_NAMES, Camera, CameraController, CameraOwnershipHelper, CameraOwnershipManager, CameraPosition, CameraSettings, CameraSwitchControl, CameraSwitchControlController, ClusteringMode, Color, ColorFillOverlay, ContextStatus, ControlImage, CoreProxyAdapter, DataCaptureContext, DataCaptureContextEvents, DataCaptureContextSettings, DataCaptureViewController, DataCaptureViewEvents, DefaultSerializeable, Direction, EventDataParser, EventEmitter, Expiration, FactoryMaker, Feedback, FocusGestureListenerEvents, FocusGestureStrategy, FocusRange, FontFamily, FrameDataController, FrameDataSettings, FrameDataSettingsBuilder, FrameSourceListenerEvents, FrameSourceState, HTMLElementState, HtmlElementPosition, HtmlElementSize, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, ListenerRegistry, LogCategory, LogLevel, LogoStyle, MacroMode, MacroModeListenerEvents, MarginsWithUnit, MeasureUnit, ModeBase, NativeProxy, NoViewfinder, NoneLocationSelection, NumberWithUnit, Observable, OpenSourceSoftwareLicenseInfo, Orientation, PinchToZoom, Point, PointWithUnit, PrivateFocusGestureDeserializer, PrivateFrameData, PrivateZoomGestureDeserializer, Quadrilateral, REDACTED_ARG_KEYS, REDACTED_ARG_METHODS, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, SKIP, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, ScanditLogger, SelectionMode, SequenceFrameSource, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchListenerEvents, TorchState, TorchSwitchControl, VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS, VIEW_CREATION_TIMEOUT_MS, Vibration, VibrationType, VideoResolution, ViewCreationGate, WaveFormVibration, ZoomGestureListenerEvents, ZoomListenerEvents, ZoomSwitchControl, ZoomSwitchOrientation, armNativeLogReceiver, buildStaticCoreDefaultsJson, createNativeProxy, ensureCoreDefaults, generateIdentifier, getCoreDefaults, ignoreFromSerialization, ignoreFromSerializationIfNull, installNativeLogReceiver, loadCoreDefaults, markSingleInstancePerView, nameForSerialization, registerCoreProxies, registerProxies, resetCameraControllerPayloadParserWarnings, resetDataCaptureViewPayloadParserWarnings, serializationDefault, setCoreDefaultsLoader, singleInstanceOverlayName, subscribeNativeLogChannel, wrapNativeProxy };
//# sourceMappingURL=core.js.map
