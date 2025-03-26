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
            console.warn(`Trying to get a non existing instance for ${clsName}`);
            return;
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

function createEventEmitter() {
    const ee = new EventEmitter();
    FactoryMaker.bindInstanceIfNotExists('EventEmitter', ee);
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

class BaseController {
    get _proxy() {
        return FactoryMaker.getInstance(this.proxyName);
    }
    constructor(proxyName) {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
        this.proxyName = proxyName;
    }
    emit(event, payload) {
        this.eventEmitter.emit(event, payload);
    }
}
class BaseNewController {
    get _proxy() {
        return this._cachedProxy;
    }
    constructor(proxyName) {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
        this._cachedProxy = FactoryMaker.createInstance(proxyName);
    }
    emit(event, payload) {
        this.eventEmitter.emit(event, payload);
    }
}
class BaseNativeProxy {
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
}
/**
 * JS Proxy hook to act as middleware to all the calls performed by an AdvancedNativeProxy instance
 * This will allow AdvancedNativeProxy to call dynamically the methods defined in the interface defined
 * as parameter in createAdvancedNativeProxy function
 */
const advancedNativeProxyHook = {
    /**
     * Dynamic property getter for the AdvancedNativeProxy
     * In order to call a native method this needs to be preceded by the `$` symbol on the name, ie `$methodName`
     * In order to set a native event handler this needs to be preceded by `on$` prefix, ie `on$eventName`
     * @param advancedNativeProxy
     * @param prop
     */
    get(advancedNativeProxy, prop) {
        // Important: $ and on$ are required since if they are not added all
        // properties present on AdvancedNativeProxy will be redirected to the
        // advancedNativeProxy._call, which will call native even for the own
        // properties of the class
        // All the methods with the following structure
        // $methodName will be redirected to the special _call
        // method on AdvancedNativeProxy
        if (prop.startsWith("$")) {
            return (args) => {
                return advancedNativeProxy._call(prop.substring(1), args);
            };
            // All methods with the following structure
            // on$methodName will trigger the event handler properties
        }
        else if (prop.startsWith("on$")) {
            return advancedNativeProxy[prop.substring(3)];
            // Everything else will be taken as a property
        }
        else {
            return advancedNativeProxy[prop];
        }
    }
};
/**
 * AdvancedNativeProxy will provide an easy way to communicate between native proxies
 * and other parts of the architecture such as the controller layer
 */
class AdvancedNativeProxy extends BaseNativeProxy {
    constructor(nativeCaller, events = []) {
        super();
        this.nativeCaller = nativeCaller;
        this.events = events;
        this.eventSubscriptions = new Map();
        this.events.forEach((event) => __awaiter(this, void 0, void 0, function* () {
            yield this._registerEvent(event);
        }));
        // Wrapping the AdvancedNativeProxy instance with the JS proxy hook
        return new Proxy(this, advancedNativeProxyHook);
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const event of this.events) {
                yield this._unregisterEvent(event);
            }
        });
    }
    _call(fnName, args) {
        return this.nativeCaller.callFn(fnName, args);
    }
    _registerEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = (args) => __awaiter(this, void 0, void 0, function* () {
                this.eventEmitter.emit(event.nativeEventName, args);
            });
            this.eventEmitter.on(event.nativeEventName, (args) => __awaiter(this, void 0, void 0, function* () {
                // Call to the special method defined on the JS Proxy hook
                yield this[`on$${event.name}`](args);
            }));
            const subscription = yield this.nativeCaller.registerEvent(event.nativeEventName, handler);
            this.eventSubscriptions.set(event.name, subscription);
        });
    }
    _unregisterEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = this.eventSubscriptions.get(event.name);
            yield this.nativeCaller.unregisterEvent(event.nativeEventName, subscription);
            this.eventEmitter.off(event.nativeEventName);
            this.eventSubscriptions.delete(event.name);
        });
    }
}
/**
 * Function to create a custom AdvancedNativeProxy. This will return an object which will provide dynamically the
 * methods specified in the PROXY interface.
 *
 * The Proxy interface implemented in order to call native methods will require a special mark
 * `$methodName` for method calls
 * `on$methodName` for the listeners added to the events defined in eventsEnum
 * @param nativeCaller
 * @param eventsEnum
 */
function createAdvancedNativeProxy(nativeCaller, eventsEnum = undefined) {
    const eventsList = Object.entries(eventsEnum).map(([key, value]) => ({
        name: key,
        nativeEventName: value
    }));
    return new AdvancedNativeProxy(nativeCaller, eventsList);
}

function getCoreDefaults() {
    return FactoryMaker.getInstance('CoreDefaults');
}

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
            // Serialize the array if the elements are serializeable
            if (Array.isArray(value)) {
                value = value.map(e => e.toJSON ? e.toJSON() : e);
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
    }
}

class PrivateFocusGestureDeserializer {
    static fromJSON(json) {
        if (json && json.type === new TapToFocus().type) {
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
    }
}

class PrivateZoomGestureDeserializer {
    static fromJSON(json) {
        if (json && json.type === new SwipeToZoom().type) {
            return new SwipeToZoom();
        }
        else {
            return null;
        }
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

var CameraPosition;
(function (CameraPosition) {
    CameraPosition["WorldFacing"] = "worldFacing";
    CameraPosition["UserFacing"] = "userFacing";
    CameraPosition["Unspecified"] = "unspecified";
})(CameraPosition || (CameraPosition = {}));

var FrameSourceListenerEvents;
(function (FrameSourceListenerEvents) {
    FrameSourceListenerEvents["didChangeState"] = "FrameSourceListener.onStateChanged";
})(FrameSourceListenerEvents || (FrameSourceListenerEvents = {}));

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

class ScanditIcon extends DefaultSerializeable {
    static fromJSON(json) {
        if (!json) {
            return null;
        }
        const scanditIcon = new ScanditIcon(json.iconColor || null, json.backgroundColor || null, json.backgroundShape || null, json.icon || null, json.backgroundStrokeColor || null, json.backgroundStrokeWidth);
        return scanditIcon;
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
    ScanditIconType["XMark"] = "xmark";
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
        const hexString = [red, green, blue, this.normalizeAlpha(alpha)]
            .reduce((hex, colorComponent) => hex + this.numberToHex(colorComponent), '');
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
            hex = hex.split('').map(s => s + s).join('');
        }
        // add alpha if missing
        if (hex.length === 6) {
            hex = hex + 'FF';
        }
        return '#' + hex.toUpperCase();
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
        return this.hexadecimalString;
    }
}

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
})(ScanIntention || (ScanIntention = {}));

class EventDataParser {
    static parse(data) {
        if (data == null) {
            return null;
        }
        return JSON.parse(data);
    }
}

class Observable extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.listeners = [];
    }
    addListener(listener) {
        this.listeners.push(listener);
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
        return this.isShown !== undefined && this.isShown !== null
            && this.position !== undefined && this.position !== null
            && this.size !== undefined && this.size !== null
            && this.shouldBeUnderContent !== undefined && this.shouldBeUnderContent !== null;
    }
    didChangeComparedTo(other) {
        var _a, _b, _c, _d;
        if (!other)
            return true;
        const positionChanged = (_b = (_a = this.position) === null || _a === void 0 ? void 0 : _a.didChangeComparedTo(other.position)) !== null && _b !== void 0 ? _b : (this.position !== other.position);
        const sizeChanged = (_d = (_c = this.size) === null || _c === void 0 ? void 0 : _c.didChangeComparedTo(other.size)) !== null && _d !== void 0 ? _d : (this.size !== other.size);
        return positionChanged || sizeChanged || this.shouldBeUnderContent !== other.shouldBeUnderContent;
    }
}

class ImageFrameSourceController {
    static forImage(imageFrameSource) {
        const controller = new ImageFrameSourceController();
        controller.imageFrameSource = imageFrameSource;
        return controller;
    }
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
        this._proxy = FactoryMaker.getInstance('ImageFrameSourceProxy');
    }
    getCurrentState() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._proxy.getCurrentCameraState(this.imageFrameSource.position);
            if (result == null) {
                return FrameSourceState.Off;
            }
            return result.data;
        });
    }
    switchCameraToDesiredState(desiredStateJson) {
        return this._proxy.switchCameraToDesiredState(desiredStateJson);
    }
    subscribeListener() {
        var _a, _b;
        this._proxy.registerListenerForEvents();
        (_b = (_a = this._proxy).subscribeDidChangeState) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.eventEmitter.on(FrameSourceListenerEvents.didChangeState, (data) => {
            const event = EventDataParser.parse(data);
            if (event === null) {
                console.error('ImageFrameSourceController didChangeState payload is null');
                return;
            }
            const newState = event.state;
            this.imageFrameSource.listeners.forEach(listener => {
                if (listener.didChangeState) {
                    listener.didChangeState(this.imageFrameSource, newState);
                }
            });
        });
    }
    unsubscribeListener() {
        this._proxy.unregisterListenerForEvents();
        this.eventEmitter.removeAllListeners(FrameSourceListenerEvents.didChangeState);
    }
}

class ImageFrameSource extends DefaultSerializeable {
    set context(newContext) {
        if (newContext == null) {
            this.controller.unsubscribeListener();
        }
        else if (this._context == null) {
            this.controller.subscribeListener();
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
        this.controller = ImageFrameSourceController.forImage(this);
    }
    didChange() {
        if (this.context) {
            return this.context.update();
        }
        else {
            return Promise.resolve();
        }
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
        return this.controller.getCurrentState();
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

class PrivateFrameData {
    get imageBuffers() {
        return this._imageBuffers;
    }
    get orientation() {
        return this._orientation;
    }
    static fromJSON(json) {
        const frameData = new PrivateFrameData();
        frameData._imageBuffers = json.imageBuffers.map((imageBufferJSON) => {
            const imageBuffer = new ImageBuffer();
            imageBuffer._width = imageBufferJSON.width;
            imageBuffer._height = imageBufferJSON.height;
            imageBuffer._data = imageBufferJSON.data;
            return imageBuffer;
        });
        frameData._orientation = json.orientation;
        return frameData;
    }
    static empty() {
        const frameData = new PrivateFrameData();
        frameData._imageBuffers = [];
        frameData._orientation = 90;
        return frameData;
    }
}

class CameraController {
    static get _proxy() {
        return FactoryMaker.getInstance('CameraProxy');
    }
    static forCamera(camera) {
        const controller = new CameraController();
        controller.camera = camera;
        return controller;
    }
    constructor() {
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
    get privateCamera() {
        return this.camera;
    }
    static getFrame(frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CameraController._proxy.getFrame(frameId);
            if (result == null) {
                return PrivateFrameData.empty();
            }
            const frameDataJSON = JSON.parse(result.data);
            return PrivateFrameData.fromJSON(frameDataJSON);
        });
    }
    static getFrameOrNull(frameId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CameraController._proxy.getFrame(frameId);
            if (result == null) {
                return null;
            }
            const frameDataJSON = JSON.parse(result.data);
            return PrivateFrameData.fromJSON(frameDataJSON);
        });
    }
    getCurrentState() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CameraController._proxy.getCurrentCameraState(this.privateCamera.position);
            if (result == null) {
                return FrameSourceState.Off;
            }
            return result.data;
        });
    }
    getIsTorchAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CameraController._proxy.isTorchAvailable(this.privateCamera.position);
            if (result == null) {
                return false;
            }
            return result.data === 'true';
        });
    }
    switchCameraToDesiredState(desiredState) {
        return CameraController._proxy.switchCameraToDesiredState(desiredState);
    }
    subscribeListener() {
        var _a, _b;
        CameraController._proxy.registerListenerForCameraEvents();
        (_b = (_a = CameraController._proxy).subscribeDidChangeState) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.eventEmitter.on(FrameSourceListenerEvents.didChangeState, (data) => {
            const event = EventDataParser.parse(data);
            if (event) {
                this.privateCamera.listeners.forEach(listener => {
                    var _a;
                    (_a = listener === null || listener === void 0 ? void 0 : listener.didChangeState) === null || _a === void 0 ? void 0 : _a.call(listener, this.camera, event.state);
                });
            }
        });
    }
    unsubscribeListener() {
        CameraController._proxy.unregisterListenerForCameraEvents();
        this.eventEmitter.off(FrameSourceListenerEvents.didChangeState);
    }
}

var TorchState;
(function (TorchState) {
    TorchState["On"] = "on";
    TorchState["Off"] = "off";
    TorchState["Auto"] = "auto";
})(TorchState || (TorchState = {}));

class Camera extends DefaultSerializeable {
    static get coreDefaults() {
        return getCoreDefaults();
    }
    set context(newContext) {
        this._context = newContext;
    }
    get context() {
        return this._context;
    }
    static get default() {
        if (Camera.coreDefaults.Camera.defaultPosition) {
            const camera = new Camera();
            camera.position = Camera.coreDefaults.Camera.defaultPosition;
            return camera;
        }
        else {
            return null;
        }
    }
    static withSettings(settings) {
        const camera = Camera.default;
        if (camera) {
            camera.settings = settings;
        }
        return camera;
    }
    static asPositionWithSettings(cameraPosition, settings) {
        if (Camera.coreDefaults.Camera.availablePositions.includes(cameraPosition)) {
            const camera = new Camera();
            camera.settings = settings;
            camera.position = cameraPosition;
            return camera;
        }
        else {
            return null;
        }
    }
    static atPosition(cameraPosition) {
        if (Camera.coreDefaults.Camera.availablePositions.includes(cameraPosition)) {
            const camera = new Camera();
            camera.position = cameraPosition;
            return camera;
        }
        else {
            return null;
        }
    }
    get desiredState() {
        return this._desiredState;
    }
    set desiredTorchState(desiredTorchState) {
        this._desiredTorchState = desiredTorchState;
        this.didChange();
    }
    get desiredTorchState() {
        return this._desiredTorchState;
    }
    constructor() {
        super();
        this.type = 'camera';
        this.settings = null;
        this._desiredTorchState = TorchState.Off;
        this._desiredState = FrameSourceState.Off;
        this.listeners = [];
        this._context = null;
        this.controller = CameraController.forCamera(this);
    }
    switchToDesiredState(state) {
        this._desiredState = state;
        return this.controller.switchCameraToDesiredState(state);
    }
    getCurrentState() {
        return this.controller.getCurrentState();
    }
    getIsTorchAvailable() {
        return this.controller.getIsTorchAvailable();
    }
    /**
     * @deprecated
     */
    get isTorchAvailable() {
        console.warn('isTorchAvailable is deprecated. Use getIsTorchAvailable instead.');
        return false;
    }
    addListener(listener) {
        if (listener == null) {
            return;
        }
        if (this.listeners.length === 0) {
            this.controller.subscribeListener();
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
        if (this.listeners.length === 0) {
            this.controller.unsubscribeListener();
        }
    }
    applySettings(settings) {
        this.settings = settings;
        return this.didChange();
    }
    didChange() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.context) {
                yield this.context.update();
            }
        });
    }
}
__decorate([
    serializationDefault({})
], Camera.prototype, "settings", void 0);
__decorate([
    nameForSerialization('desiredTorchState')
], Camera.prototype, "_desiredTorchState", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "_desiredState", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], Camera.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], Camera, "coreDefaults", null);

class ControlImage extends DefaultSerializeable {
    constructor(type, data, name) {
        super();
        this.type = type;
        this._data = data;
        this._name = name;
    }
    static fromBase64EncodedImage(data) {
        if (data === null)
            return null;
        return new ControlImage("base64", data, null);
    }
    static fromResourceName(resource) {
        return new ControlImage("resource", null, resource);
    }
    isBase64EncodedImage() {
        return this.type === "base64";
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

class DataCaptureContextSettings extends DefaultSerializeable {
    constructor() {
        super();
    }
    setProperty(name, value) {
        this[name] = value;
    }
    getProperty(name) {
        return this[name];
    }
}

class OpenSourceSoftwareLicenseInfo {
    constructor(licenseText) {
        this._licenseText = licenseText;
    }
    get licenseText() {
        return this._licenseText;
    }
}

var DataCaptureContextEvents;
(function (DataCaptureContextEvents) {
    DataCaptureContextEvents["didChangeStatus"] = "DataCaptureContextListener.onStatusChanged";
    DataCaptureContextEvents["didStartObservingContext"] = "DataCaptureContextListener.onObservationStarted";
})(DataCaptureContextEvents || (DataCaptureContextEvents = {}));
class DataCaptureContextController {
    static get framework() {
        return FactoryMaker.getInstance('DataCaptureContextProxy').framework;
    }
    static get frameworkVersion() {
        return FactoryMaker.getInstance('DataCaptureContextProxy').frameworkVersion;
    }
    get privateContext() {
        return this.context;
    }
    static forDataCaptureContext(context) {
        const controller = new DataCaptureContextController();
        controller.context = context;
        controller.initialize();
        return controller;
    }
    static forDataCaptureContextAsync(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new DataCaptureContextController();
            controller.context = context;
            yield controller.initialize();
            return controller;
        });
    }
    constructor() {
        this._proxy = FactoryMaker.getInstance('DataCaptureContextProxy');
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
    }
    updateContextFromJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._proxy.updateContextFromJSON(JSON.stringify(this.context.toJSON()));
            }
            catch (error) {
                this.notifyListenersOfDeserializationError(error);
                throw error;
            }
        });
    }
    addModeToContext(mode) {
        return this._proxy.addModeToContext(JSON.stringify(mode.toJSON()));
    }
    removeModeFromContext(mode) {
        return this._proxy.removeModeFromContext(JSON.stringify(mode.toJSON()));
    }
    removeAllModesFromContext() {
        return this._proxy.removeAllModesFromContext();
    }
    dispose() {
        this.unsubscribeListener();
        this._proxy.dispose();
    }
    unsubscribeListener() {
        this._proxy.unregisterListenerForDataCaptureContext();
        this.eventEmitter.removeAllListeners(DataCaptureContextEvents.didChangeStatus);
        this.eventEmitter.removeAllListeners(DataCaptureContextEvents.didStartObservingContext);
    }
    initialize() {
        this.subscribeListener();
        return this.initializeContextFromJSON();
    }
    initializeContextFromJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._proxy.contextFromJSON(JSON.stringify(this.context.toJSON()));
            }
            catch (error) {
                this.notifyListenersOfDeserializationError(error);
                throw error;
            }
        });
    }
    static getOpenSourceSoftwareLicenseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const proxy = FactoryMaker.getInstance('DataCaptureContextProxy');
            const result = yield proxy.getOpenSourceSoftwareLicenseInfo();
            return new OpenSourceSoftwareLicenseInfo(result.data);
        });
    }
    subscribeListener() {
        var _a, _b, _c, _d;
        this._proxy.registerListenerForDataCaptureContext();
        (_b = (_a = this._proxy).subscribeDidChangeStatus) === null || _b === void 0 ? void 0 : _b.call(_a);
        (_d = (_c = this._proxy).subscribeDidStartObservingContext) === null || _d === void 0 ? void 0 : _d.call(_c);
        this.eventEmitter.on(DataCaptureContextEvents.didChangeStatus, (data) => {
            const event = EventDataParser.parse(data);
            if (event === null) {
                console.error('DataCaptureContextController didChangeStatus payload is null');
                return;
            }
            const contextStatus = ContextStatus.fromJSON(JSON.parse(event.status));
            this.notifyListenersOfDidChangeStatus(contextStatus);
        });
        this.eventEmitter.on(DataCaptureContextEvents.didStartObservingContext, () => {
            this.privateContext.listeners.forEach(listener => {
                var _a;
                (_a = listener.didStartObservingContext) === null || _a === void 0 ? void 0 : _a.call(listener, this.context);
            });
        });
    }
    notifyListenersOfDeserializationError(error) {
        const contextStatus = ContextStatus
            .fromJSON({
            message: error,
            code: -1,
            isValid: true,
        });
        this.notifyListenersOfDidChangeStatus(contextStatus);
    }
    notifyListenersOfDidChangeStatus(contextStatus) {
        this.privateContext.listeners.forEach(listener => {
            if (listener.didChangeStatus) {
                listener.didChangeStatus(this.context, contextStatus);
            }
        });
    }
}

class DataCaptureContext extends DefaultSerializeable {
    static get coreDefaults() {
        return getCoreDefaults();
    }
    get frameSource() {
        return this._frameSource;
    }
    static get deviceID() {
        return DataCaptureContext.coreDefaults.deviceID;
    }
    /**
     * @deprecated
     */
    get deviceID() {
        console.log('The instance property "deviceID" on the DataCaptureContext is deprecated, please use the static property DataCaptureContext.deviceID instead.');
        return DataCaptureContext.deviceID;
    }
    static forLicenseKey(licenseKey) {
        return DataCaptureContext.create(licenseKey, null, null);
    }
    static forLicenseKeyWithSettings(licenseKey, settings) {
        return DataCaptureContext.create(licenseKey, null, settings);
    }
    static forLicenseKeyWithOptions(licenseKey, options) {
        return DataCaptureContext.create(licenseKey, options, null);
    }
    static create(licenseKey, options, settings) {
        if (options == null) {
            options = { deviceName: null };
        }
        if (!DataCaptureContext.instance) {
            DataCaptureContext.instance = new DataCaptureContext(licenseKey, options.deviceName || '', settings);
        }
        return DataCaptureContext.instance;
    }
    constructor(licenseKey, deviceName, settings) {
        super();
        this.licenseKey = licenseKey;
        this.deviceName = deviceName;
        this._framework = DataCaptureContextController.framework;
        this._frameworkVersion = DataCaptureContextController.frameworkVersion;
        this.settings = new DataCaptureContextSettings();
        this._frameSource = null;
        this.view = null;
        this.modes = [];
        this.listeners = [];
        if (settings) {
            this.settings = settings;
        }
        this.initialize();
    }
    setFrameSource(frameSource) {
        if (this._frameSource) {
            this._frameSource.context = null;
        }
        this._frameSource = frameSource;
        if (frameSource) {
            frameSource.context = this;
        }
        return this.update();
    }
    addListener(listener) {
        if (this.listeners.includes(listener)) {
            return;
        }
        this.listeners.push(listener);
    }
    removeListener(listener) {
        if (!this.listeners.includes(listener)) {
            return;
        }
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    addMode(mode) {
        if (!this.modes.includes(mode)) {
            this.modes.push(mode);
            mode._context = this;
            this.controller.addModeToContext(mode);
        }
    }
    removeMode(mode) {
        if (this.modes.includes(mode)) {
            this.modes.splice(this.modes.indexOf(mode), 1);
            mode._context = null;
            this.controller.removeModeFromContext(mode);
        }
    }
    removeAllModes() {
        this.modes.forEach(mode => {
            mode._context = null;
        });
        this.modes = [];
        this.controller.removeAllModesFromContext();
    }
    dispose() {
        var _a;
        if (!this.controller) {
            return;
        }
        DataCaptureContext.instance = null;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.removeAllModes();
        this.controller.dispose();
    }
    applySettings(settings) {
        this.settings = settings;
        return this.update();
    }
    static getOpenSourceSoftwareLicenseInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return DataCaptureContextController.getOpenSourceSoftwareLicenseInfo();
        });
    }
    // Called when the capture view is shown, that is the earliest point that we need the context deserialized.
    initialize() {
        if (this.controller) {
            return;
        }
        this.controller = DataCaptureContextController.forDataCaptureContext(this);
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.controller) {
                return;
            }
            this.controller = yield DataCaptureContextController.forDataCaptureContextAsync(this);
        });
    }
    update() {
        if (!this.controller) {
            return Promise.resolve();
        }
        return this.controller.updateContextFromJSON();
    }
}
DataCaptureContext.instance = null;
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
], DataCaptureContext, "coreDefaults", null);

var DataCaptureViewEvents;
(function (DataCaptureViewEvents) {
    DataCaptureViewEvents["didChangeSize"] = "DataCaptureViewListener.onSizeChanged";
})(DataCaptureViewEvents || (DataCaptureViewEvents = {}));
class DataCaptureViewController extends BaseController {
    static forDataCaptureView(view, autoCreateNativeView) {
        const controller = new DataCaptureViewController();
        controller.view = view;
        if (autoCreateNativeView) {
            controller.createView();
            controller.subscribeListener();
        }
        return controller;
    }
    constructor() {
        super('DataCaptureViewProxy');
    }
    viewPointForFramePoint(point) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._proxy.viewPointForFramePoint(JSON.stringify(point.toJSON()));
            return Point.fromJSON(JSON.parse(result.data));
        });
    }
    viewQuadrilateralForFrameQuadrilateral(quadrilateral) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._proxy.viewQuadrilateralForFrameQuadrilateral(JSON.stringify(quadrilateral.toJSON()));
            return Quadrilateral.fromJSON(JSON.parse(result.data));
        });
    }
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return this._proxy.setPositionAndSize(top, left, width, height, shouldBeUnderWebView);
    }
    show() {
        return this._proxy.show();
    }
    hide() {
        return this._proxy.hide();
    }
    createNativeView() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createView();
            this.subscribeListener();
        });
    }
    removeNativeView() {
        return this._proxy.removeView();
    }
    createView() {
        return this._proxy.createView(JSON.stringify(this.view.toJSON()));
    }
    updateView() {
        return this._proxy.updateView(JSON.stringify(this.view.toJSON()));
    }
    dispose() {
        this.unsubscribeListener();
    }
    subscribeListener() {
        var _a, _b;
        this._proxy.registerListenerForViewEvents();
        (_b = (_a = this._proxy).subscribeDidChangeSize) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.eventEmitter.on(DataCaptureViewEvents.didChangeSize, (data) => {
            const event = EventDataParser.parse(data);
            if (event === null) {
                console.error('DataCaptureViewController didChangeSize payload is null');
                return;
            }
            const size = Size.fromJSON(event.size);
            const orientation = event.orientation;
            this.view.listeners.forEach(listener => {
                if (listener.didChangeSize) {
                    listener.didChangeSize(this.view.viewComponent, size, orientation);
                }
            });
        });
    }
    unsubscribeListener() {
        this._proxy.unregisterListenerForViewEvents();
        this.eventEmitter.removeAllListeners(DataCaptureViewEvents.didChangeSize);
    }
}

class BaseDataCaptureView extends DefaultSerializeable {
    get context() {
        return this._context;
    }
    set context(context) {
        if (!(context instanceof DataCaptureContext || context == null)) {
            // This should never happen, but let's just be sure
            throw new Error('The context for a capture view must be a DataCaptureContext');
        }
        this._context = context;
        if (this._context) {
            this._context.view = this;
        }
    }
    get coreDefaults() {
        return getCoreDefaults();
    }
    get scanAreaMargins() {
        return this._scanAreaMargins;
    }
    set scanAreaMargins(newValue) {
        this._scanAreaMargins = newValue;
        this.controller.updateView();
    }
    get pointOfInterest() {
        return this._pointOfInterest;
    }
    set pointOfInterest(newValue) {
        this._pointOfInterest = newValue;
        this.controller.updateView();
    }
    get logoAnchor() {
        return this._logoAnchor;
    }
    set logoAnchor(newValue) {
        this._logoAnchor = newValue;
        this.controller.updateView();
    }
    get logoOffset() {
        return this._logoOffset;
    }
    set logoOffset(newValue) {
        this._logoOffset = newValue;
        this.controller.updateView();
    }
    get focusGesture() {
        return this._focusGesture;
    }
    set focusGesture(newValue) {
        this._focusGesture = newValue;
        this.controller.updateView();
    }
    get zoomGesture() {
        return this._zoomGesture;
    }
    set zoomGesture(newValue) {
        this._zoomGesture = newValue;
        this.controller.updateView();
    }
    get logoStyle() {
        return this._logoStyle;
    }
    set logoStyle(newValue) {
        this._logoStyle = newValue;
        this.controller.updateView();
    }
    get privateContext() {
        return this.context;
    }
    static forContext(context, autoCreateNativeView = true) {
        const view = new BaseDataCaptureView(autoCreateNativeView);
        view.context = context;
        view.isViewCreated = autoCreateNativeView;
        return view;
    }
    constructor(autoCreateNativeView) {
        super();
        this._context = null;
        this.overlays = [];
        this.controls = [];
        this.listeners = [];
        this.isViewCreated = false;
        this.controller = DataCaptureViewController.forDataCaptureView(this, autoCreateNativeView);
        this._scanAreaMargins = this.coreDefaults.DataCaptureView.scanAreaMargins;
        this._pointOfInterest = this.coreDefaults.DataCaptureView.pointOfInterest;
        this._logoAnchor = this.coreDefaults.DataCaptureView.logoAnchor;
        this._logoOffset = this.coreDefaults.DataCaptureView.logoOffset;
        this._focusGesture = this.coreDefaults.DataCaptureView.focusGesture;
        this._zoomGesture = this.coreDefaults.DataCaptureView.zoomGesture;
        this._logoStyle = this.coreDefaults.DataCaptureView.logoStyle;
    }
    addOverlay(overlay) {
        if (this.overlays.includes(overlay)) {
            return;
        }
        overlay.view = this;
        this.overlays.push(overlay);
        this.controller.updateView();
    }
    removeOverlay(overlay) {
        if (!this.overlays.includes(overlay)) {
            return;
        }
        overlay.view = null;
        this.overlays.splice(this.overlays.indexOf(overlay), 1);
        this.controller.updateView();
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
    addControl(control) {
        if (!this.controls.includes(control)) {
            control.view = this;
            this.controls.push(control);
            this.controller.updateView();
        }
    }
    addControlWithAnchorAndOffset(control, anchor, offset) {
        if (!this.controls.includes(control)) {
            control.view = this;
            control.anchor = anchor;
            control.offset = offset;
            this.controls.push(control);
            this.controller.updateView();
        }
    }
    removeControl(control) {
        if (this.controls.includes(control)) {
            control.view = null;
            this.controls.splice(this.controls.indexOf(control), 1);
            this.controller.updateView();
        }
    }
    controlUpdated() {
        this.controller.updateView();
    }
    createNativeView() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isViewCreated) {
                return Promise.resolve();
            }
            yield this.controller.createNativeView();
            this.isViewCreated = true;
        });
    }
    removeNativeView() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isViewCreated) {
                return Promise.resolve();
            }
            this.controller.removeNativeView();
            this.isViewCreated = false;
        });
    }
    dispose() {
        this.overlays = [];
        this.listeners.forEach(listener => this.removeListener(listener));
        this.controller.dispose();
        this.isViewCreated = false;
    }
    // HTML Views only
    setFrame(frame, isUnderContent = false) {
        return this.setPositionAndSize(frame.origin.y, frame.origin.x, frame.size.width, frame.size.height, isUnderContent);
    }
    setPositionAndSize(top, left, width, height, shouldBeUnderWebView) {
        return this.controller.setPositionAndSize(top, left, width, height, shouldBeUnderWebView);
    }
    show() {
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        this.privateContext.initialize();
        return this.controller.show();
    }
    hide() {
        if (!this.context) {
            throw new Error('There should be a context attached to a view that should be shown');
        }
        return this.controller.hide();
    }
}
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "_context", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "viewComponent", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "coreDefaults", null);
__decorate([
    nameForSerialization('scanAreaMargins')
], BaseDataCaptureView.prototype, "_scanAreaMargins", void 0);
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
    nameForSerialization('zoomGesture')
], BaseDataCaptureView.prototype, "_zoomGesture", void 0);
__decorate([
    nameForSerialization('logoStyle')
], BaseDataCaptureView.prototype, "_logoStyle", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "controller", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "listeners", void 0);
__decorate([
    ignoreFromSerialization
], BaseDataCaptureView.prototype, "isViewCreated", void 0);

class ZoomSwitchControl extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'zoom';
        this.icon = {
            zoomedOut: { default: null, pressed: null },
            zoomedIn: { default: null, pressed: null },
        };
        this.view = null;
        this.anchor = null;
        this.offset = null;
    }
    get zoomedOutImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedOut.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedOut.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set zoomedOutImage(zoomedOutImage) {
        var _a;
        this.icon.zoomedOut.default = ControlImage.fromBase64EncodedImage(zoomedOutImage);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedInImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedIn.default) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedIn.default) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set zoomedInImage(zoomedInImage) {
        var _a;
        this.icon.zoomedIn.default = ControlImage.fromBase64EncodedImage(zoomedInImage);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedInPressedImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedIn.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedIn.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set zoomedInPressedImage(zoomedInPressedImage) {
        var _a;
        this.icon.zoomedIn.pressed = ControlImage.fromBase64EncodedImage(zoomedInPressedImage);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    get zoomedOutPressedImage() {
        var _a, _b;
        if (((_a = this.icon.zoomedOut.pressed) === null || _a === void 0 ? void 0 : _a.isBase64EncodedImage()) == true) {
            return (_b = this.icon.zoomedOut.pressed) === null || _b === void 0 ? void 0 : _b.data;
        }
        return null;
    }
    set zoomedOutPressedImage(zoomedOutPressedImage) {
        var _a;
        this.icon.zoomedOut.pressed = ControlImage.fromBase64EncodedImage(zoomedOutPressedImage);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setZoomedInImage(resource) {
        var _a;
        this.icon.zoomedIn.default = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setZoomedInPressedImage(resource) {
        var _a;
        this.icon.zoomedIn.pressed = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setZoomedOutImage(resource) {
        var _a;
        this.icon.zoomedOut.default = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setZoomedOutPressedImage(resource) {
        var _a;
        this.icon.zoomedOut.pressed = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
}
__decorate([
    ignoreFromSerialization
], ZoomSwitchControl.prototype, "view", void 0);

class TorchSwitchControl extends DefaultSerializeable {
    constructor() {
        super(...arguments);
        this.type = 'torch';
        this.icon = {
            on: { default: null, pressed: null },
            off: { default: null, pressed: null },
        };
        this.view = null;
        this.anchor = null;
        this.offset = null;
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
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
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
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
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
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
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
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setTorchOffPressedImage(resource) {
        var _a;
        this.icon.off.pressed = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setTorchOnImage(resource) {
        var _a;
        this.icon.on.default = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setTorchOnPressedImage(resource) {
        var _a;
        this.icon.on.pressed = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    setImageResource(resource) {
        var _a;
        this.icon.off.default = ControlImage.fromResourceName(resource);
        this.icon.off.pressed = ControlImage.fromResourceName(resource);
        this.icon.on.default = ControlImage.fromResourceName(resource);
        this.icon.on.pressed = ControlImage.fromResourceName(resource);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
    set torchOnPressedImage(torchOnPressedImage) {
        var _a;
        this.icon.on.pressed = ControlImage.fromBase64EncodedImage(torchOnPressedImage);
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.controlUpdated();
    }
}
__decorate([
    ignoreFromSerialization
], TorchSwitchControl.prototype, "view", void 0);

var VideoResolution;
(function (VideoResolution) {
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
        const settings = new CameraSettings();
        settings.preferredResolution = json.preferredResolution;
        settings.zoomFactor = json.zoomFactor;
        settings.focusRange = json.focusRange;
        settings.zoomGestureZoomFactor = json.zoomGestureZoomFactor;
        settings.focusGestureStrategy = json.focusGestureStrategy;
        settings.shouldPreferSmoothAutoFocus = json.shouldPreferSmoothAutoFocus;
        if (json.properties !== undefined) {
            for (const key of Object.keys(json.properties)) {
                settings.setProperty(key, json.properties[key]);
            }
        }
        return settings;
    }
    constructor(settings) {
        super();
        this.focusHiddenProperties = [
            'range',
            'manualLensPosition',
            'shouldPreferSmoothAutoFocus',
            'focusStrategy',
            'focusGestureStrategy'
        ];
        this.preferredResolution = CameraSettings.coreDefaults.Camera.Settings.preferredResolution;
        this.zoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomFactor;
        this.zoomGestureZoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomGestureZoomFactor;
        this.focus = {
            range: CameraSettings.coreDefaults.Camera.Settings.focusRange,
            focusGestureStrategy: CameraSettings.coreDefaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: CameraSettings.coreDefaults.Camera.Settings.shouldPreferSmoothAutoFocus
        };
        this.preferredResolution = CameraSettings.coreDefaults.Camera.Settings.preferredResolution;
        this.zoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomFactor;
        this.zoomGestureZoomFactor = CameraSettings.coreDefaults.Camera.Settings.zoomGestureZoomFactor;
        this.focus = {
            range: CameraSettings.coreDefaults.Camera.Settings.focusRange,
            focusGestureStrategy: CameraSettings.coreDefaults.Camera.Settings.focusGestureStrategy,
            shouldPreferSmoothAutoFocus: CameraSettings.coreDefaults.Camera.Settings.shouldPreferSmoothAutoFocus,
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
    ignoreFromSerialization
], CameraSettings.prototype, "focusHiddenProperties", void 0);

const NoViewfinder = { type: 'none' };

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
        this.eventEmitter = FactoryMaker.getInstance('EventEmitter');
        const viewfinderStyle = style || this.coreDefaults.RectangularViewfinder.defaultStyle;
        this._style = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].style;
        this._lineStyle = this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].lineStyle;
        this._dimming = parseFloat(this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].dimming);
        this._disabledDimming =
            parseFloat(this.coreDefaults.RectangularViewfinder.styles[viewfinderStyle].disabledDimming);
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
        this.eventEmitter.emit('viewfinder.update');
    }
}
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
__decorate([
    ignoreFromSerialization
], RectangularViewfinder.prototype, "eventEmitter", void 0);

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

function parseDefaults(jsonDefaults) {
    const coreDefaults = {
        Camera: {
            Settings: {
                preferredResolution: jsonDefaults.Camera.Settings.preferredResolution,
                zoomFactor: jsonDefaults.Camera.Settings.zoomFactor,
                focusRange: jsonDefaults.Camera.Settings.focusRange,
                zoomGestureZoomFactor: jsonDefaults.Camera.Settings.zoomGestureZoomFactor,
                focusGestureStrategy: jsonDefaults.Camera.Settings.focusGestureStrategy,
                shouldPreferSmoothAutoFocus: jsonDefaults.Camera.Settings.shouldPreferSmoothAutoFocus,
                properties: jsonDefaults.Camera.Settings.properties,
            },
            defaultPosition: (jsonDefaults.Camera.defaultPosition || null),
            availablePositions: jsonDefaults.Camera.availablePositions,
        },
        DataCaptureView: {
            scanAreaMargins: MarginsWithUnit
                .fromJSON(JSON.parse(jsonDefaults.DataCaptureView.scanAreaMargins)),
            pointOfInterest: PointWithUnit
                .fromJSON(JSON.parse(jsonDefaults.DataCaptureView.pointOfInterest)),
            logoAnchor: jsonDefaults.DataCaptureView.logoAnchor,
            logoOffset: PointWithUnit
                .fromJSON(JSON.parse(jsonDefaults.DataCaptureView.logoOffset)),
            focusGesture: PrivateFocusGestureDeserializer
                .fromJSON(JSON.parse(jsonDefaults.DataCaptureView.focusGesture)),
            zoomGesture: PrivateZoomGestureDeserializer
                .fromJSON(JSON.parse(jsonDefaults.DataCaptureView.zoomGesture)),
            logoStyle: jsonDefaults.DataCaptureView.logoStyle,
        },
        RectangularViewfinder: Object
            .keys(jsonDefaults.RectangularViewfinder.styles)
            .reduce((acc, key) => {
            const viewfinder = jsonDefaults.RectangularViewfinder.styles[key];
            acc.styles[key] = {
                size: SizeWithUnitAndAspect
                    .fromJSON(JSON.parse(viewfinder.size)),
                color: Color.fromJSON(viewfinder.color),
                disabledColor: Color.fromJSON(viewfinder.disabledColor),
                style: viewfinder.style,
                lineStyle: viewfinder.lineStyle,
                dimming: viewfinder.dimming,
                disabledDimming: viewfinder.disabledDimming,
                animation: RectangularViewfinderAnimation
                    .fromJSON(JSON.parse(viewfinder.animation)),
            };
            return acc;
        }, { defaultStyle: jsonDefaults.RectangularViewfinder.defaultStyle, styles: {} }),
        AimerViewfinder: {
            frameColor: Color.fromJSON(jsonDefaults.AimerViewfinder.frameColor),
            dotColor: Color.fromJSON(jsonDefaults.AimerViewfinder.dotColor),
        },
        Brush: new Brush(Color
            .fromJSON(jsonDefaults.Brush.fillColor), Color
            .fromJSON(jsonDefaults.Brush.strokeColor), jsonDefaults.Brush.strokeWidth),
        deviceID: jsonDefaults.deviceID,
    };
    // Inject defaults to avoid a circular dependency between these classes and the defaults
    Brush.defaults = coreDefaults.Brush;
    return coreDefaults;
}

function loadCoreDefaults(jsonDefaults) {
    const coreDefaults = parseDefaults(jsonDefaults);
    FactoryMaker.bindInstanceIfNotExists('CoreDefaults', coreDefaults);
}

var VibrationType;
(function (VibrationType) {
    VibrationType["default"] = "default";
    VibrationType["selectionHaptic"] = "selectionHaptic";
    VibrationType["successHaptic"] = "successHaptic";
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

class FeedbackController {
    constructor(feedback) {
        this.feedback = feedback;
        this._proxy = FactoryMaker.getInstance('FeedbackProxy');
    }
    static forFeedback(feedback) {
        const controller = new FeedbackController(feedback);
        return controller;
    }
    emit() {
        this._proxy.emitFeedback(this.feedback);
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
        this.controller = FeedbackController.forFeedback(this);
    }
    emit() {
        this.controller.emit();
    }
    toJSON() {
        return super.toJSON();
    }
}
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('vibration')
], Feedback.prototype, "_vibration", void 0);
__decorate([
    ignoreFromSerializationIfNull,
    nameForSerialization('sound')
], Feedback.prototype, "_sound", void 0);
__decorate([
    ignoreFromSerialization
], Feedback.prototype, "controller", void 0);

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
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect.sizeWithWidthAndHeight(size);
        return locationSelection;
    }
    static withWidthAndAspectRatio(width, heightToWidthAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
            .sizeWithWidthAndAspectRatio(width, heightToWidthAspectRatio);
        return locationSelection;
    }
    static withHeightAndAspectRatio(height, widthToHeightAspectRatio) {
        const locationSelection = new RectangularLocationSelection();
        locationSelection._sizeWithUnitAndAspect = SizeWithUnitAndAspect
            .sizeWithHeightAndAspectRatio(height, widthToHeightAspectRatio);
        return locationSelection;
    }
    static fromJSON(rectangularLocationSelectionJSON) {
        if (rectangularLocationSelectionJSON.aspect.width && rectangularLocationSelectionJSON.aspect.height) {
            const width = NumberWithUnit
                .fromJSON(rectangularLocationSelectionJSON.aspect.width);
            const height = NumberWithUnit
                .fromJSON(rectangularLocationSelectionJSON.aspect.height);
            const size = new SizeWithUnit(width, height);
            return this.withSize(size);
        }
        else if (rectangularLocationSelectionJSON.aspect.width && rectangularLocationSelectionJSON.aspect.aspect) {
            const width = NumberWithUnit
                .fromJSON(rectangularLocationSelectionJSON.aspect.width);
            return this.withWidthAndAspectRatio(width, rectangularLocationSelectionJSON.aspect.aspect);
        }
        else if (rectangularLocationSelectionJSON.aspect.height && rectangularLocationSelectionJSON.aspect.aspect) {
            const height = NumberWithUnit
                .fromJSON(rectangularLocationSelectionJSON.aspect.height);
            return this.withHeightAndAspectRatio(height, rectangularLocationSelectionJSON.aspect.aspect);
        }
        else if (rectangularLocationSelectionJSON.aspect.shorterDimension && rectangularLocationSelectionJSON.aspect.aspect) {
            const shorterDimension = NumberWithUnit
                .fromJSON(rectangularLocationSelectionJSON.aspect.shorterDimension);
            const sizeWithUnitAndAspect = SizeWithUnitAndAspect
                .sizeWithShorterDimensionAndAspectRatio(shorterDimension, rectangularLocationSelectionJSON.aspect.aspect);
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

class LicenseInfo extends DefaultSerializeable {
    get expiration() {
        return this._expiration;
    }
}
__decorate([
    nameForSerialization('expiration')
    // @ts-ignore
], LicenseInfo.prototype, "_expiration", void 0);

var Expiration;
(function (Expiration) {
    Expiration["Available"] = "available";
    Expiration["Perpetual"] = "perpetual";
    Expiration["NotAvailable"] = "notAvailable";
})(Expiration || (Expiration = {}));

createEventEmitter();

export { AdvancedNativeProxy, AimerViewfinder, Anchor, BaseController, BaseDataCaptureView, BaseNativeProxy, BaseNewController, Brush, Camera, CameraController, CameraPosition, CameraSettings, Color, ContextStatus, ControlImage, DataCaptureContext, DataCaptureContextEvents, DataCaptureContextSettings, DataCaptureViewController, DataCaptureViewEvents, DefaultSerializeable, Direction, EventDataParser, EventEmitter, Expiration, FactoryMaker, Feedback, FocusGestureStrategy, FocusRange, FontFamily, FrameSourceListenerEvents, FrameSourceState, HTMLElementState, HtmlElementPosition, HtmlElementSize, ImageBuffer, ImageFrameSource, LicenseInfo, LogoStyle, MarginsWithUnit, MeasureUnit, NoViewfinder, NoneLocationSelection, NumberWithUnit, Observable, OpenSourceSoftwareLicenseInfo, Orientation, Point, PointWithUnit, PrivateFocusGestureDeserializer, PrivateFrameData, PrivateZoomGestureDeserializer, Quadrilateral, RadiusLocationSelection, Rect, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, Size, SizeWithAspect, SizeWithUnit, SizeWithUnitAndAspect, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchState, TorchSwitchControl, Vibration, VibrationType, VideoResolution, WaveFormVibration, ZoomSwitchControl, createAdvancedNativeProxy, getCoreDefaults, ignoreFromSerialization, ignoreFromSerializationIfNull, loadCoreDefaults, nameForSerialization, serializationDefault };
//# sourceMappingURL=core.js.map
