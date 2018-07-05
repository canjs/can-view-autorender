/*[process-shim]*/
(function(global, env) {
	// jshint ignore:line
	if (typeof process === "undefined") {
		global.process = {
			argv: [],
			cwd: function() {
				return "";
			},
			browser: true,
			env: {
				NODE_ENV: env || "development"
			},
			version: "",
			platform:
				global.navigator &&
				global.navigator.userAgent &&
				/Windows/.test(global.navigator.userAgent)
					? "win"
					: ""
		};
	}
})(
	typeof self == "object" && self.Object == Object
		? self
		: typeof process === "object" &&
		  Object.prototype.toString.call(process) === "[object process]"
			? global
			: window,
	"development"
);

/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{ "can-util/namespace": "can" },
	typeof self == "object" && self.Object == Object
		? self
		: typeof process === "object" &&
		  Object.prototype.toString.call(process) === "[object process]"
			? global
			: window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*can-namespace@1.0.0#can-namespace*/
define('can-namespace', function (require, exports, module) {
    module.exports = {};
});
/*can-symbol@1.6.1#can-symbol*/
define('can-symbol', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        var namespace = require('can-namespace');
        var CanSymbol;
        if (typeof Symbol !== 'undefined' && typeof Symbol.for === 'function') {
            CanSymbol = Symbol;
        } else {
            var symbolNum = 0;
            CanSymbol = function CanSymbolPolyfill(description) {
                var symbolValue = '@@symbol' + symbolNum++ + description;
                var symbol = {};
                Object.defineProperties(symbol, {
                    toString: {
                        value: function () {
                            return symbolValue;
                        }
                    }
                });
                return symbol;
            };
            var descriptionToSymbol = {};
            var symbolToDescription = {};
            CanSymbol.for = function (description) {
                var symbol = descriptionToSymbol[description];
                if (!symbol) {
                    symbol = descriptionToSymbol[description] = CanSymbol(description);
                    symbolToDescription[symbol] = description;
                }
                return symbol;
            };
            CanSymbol.keyFor = function (symbol) {
                return symbolToDescription[symbol];
            };
            [
                'hasInstance',
                'isConcatSpreadable',
                'iterator',
                'match',
                'prototype',
                'replace',
                'search',
                'species',
                'split',
                'toPrimitive',
                'toStringTag',
                'unscopables'
            ].forEach(function (name) {
                CanSymbol[name] = CanSymbol('Symbol.' + name);
            });
        }
        [
            'isMapLike',
            'isListLike',
            'isValueLike',
            'isFunctionLike',
            'getOwnKeys',
            'getOwnKeyDescriptor',
            'proto',
            'getOwnEnumerableKeys',
            'hasOwnKey',
            'hasKey',
            'size',
            'getName',
            'getIdentity',
            'assignDeep',
            'updateDeep',
            'getValue',
            'setValue',
            'getKeyValue',
            'setKeyValue',
            'updateValues',
            'addValue',
            'removeValues',
            'apply',
            'new',
            'onValue',
            'offValue',
            'onKeyValue',
            'offKeyValue',
            'getKeyDependencies',
            'getValueDependencies',
            'keyHasDependencies',
            'valueHasDependencies',
            'onKeys',
            'onKeysAdded',
            'onKeysRemoved',
            'onPatches'
        ].forEach(function (name) {
            CanSymbol.for('can.' + name);
        });
        module.exports = namespace.Symbol = CanSymbol;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-reflect@1.17.0#reflections/helpers*/
define('can-reflect/reflections/helpers', [
    'require',
    'exports',
    'module',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    module.exports = {
        makeGetFirstSymbolValue: function (symbolNames) {
            var symbols = symbolNames.map(function (name) {
                return canSymbol.for(name);
            });
            var length = symbols.length;
            return function getFirstSymbol(obj) {
                var index = -1;
                while (++index < length) {
                    if (obj[symbols[index]] !== undefined) {
                        return obj[symbols[index]];
                    }
                }
            };
        },
        hasLength: function (list) {
            var type = typeof list;
            if (type === 'string' || Array.isArray(list)) {
                return true;
            }
            var length = list && (type !== 'boolean' && type !== 'number' && 'length' in list) && list.length;
            return typeof list !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in list);
        }
    };
});
/*can-reflect@1.17.0#reflections/type/type*/
define('can-reflect/reflections/type/type', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/helpers'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var helpers = require('can-reflect/reflections/helpers');
    var plainFunctionPrototypePropertyNames = Object.getOwnPropertyNames(function () {
    }.prototype);
    var plainFunctionPrototypeProto = Object.getPrototypeOf(function () {
    }.prototype);
    function isConstructorLike(func) {
        var value = func[canSymbol.for('can.new')];
        if (value !== undefined) {
            return value;
        }
        if (typeof func !== 'function') {
            return false;
        }
        var prototype = func.prototype;
        if (!prototype) {
            return false;
        }
        if (plainFunctionPrototypeProto !== Object.getPrototypeOf(prototype)) {
            return true;
        }
        var propertyNames = Object.getOwnPropertyNames(prototype);
        if (propertyNames.length === plainFunctionPrototypePropertyNames.length) {
            for (var i = 0, len = propertyNames.length; i < len; i++) {
                if (propertyNames[i] !== plainFunctionPrototypePropertyNames[i]) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }
    var getNewOrApply = helpers.makeGetFirstSymbolValue([
        'can.new',
        'can.apply'
    ]);
    function isFunctionLike(obj) {
        var result, symbolValue = obj[canSymbol.for('can.isFunctionLike')];
        if (symbolValue !== undefined) {
            return symbolValue;
        }
        result = getNewOrApply(obj);
        if (result !== undefined) {
            return !!result;
        }
        return typeof obj === 'function';
    }
    function isPrimitive(obj) {
        var type = typeof obj;
        if (obj == null || type !== 'function' && type !== 'object') {
            return true;
        } else {
            return false;
        }
    }
    function isBuiltIn(obj) {
        if (isPrimitive(obj) || Array.isArray(obj) || isPlainObject(obj) || Object.prototype.toString.call(obj) !== '[object Object]' && Object.prototype.toString.call(obj).indexOf('[object ') !== -1) {
            return true;
        } else {
            return false;
        }
    }
    function isValueLike(obj) {
        var symbolValue;
        if (isPrimitive(obj)) {
            return true;
        }
        symbolValue = obj[canSymbol.for('can.isValueLike')];
        if (typeof symbolValue !== 'undefined') {
            return symbolValue;
        }
        var value = obj[canSymbol.for('can.getValue')];
        if (value !== undefined) {
            return !!value;
        }
    }
    function isMapLike(obj) {
        if (isPrimitive(obj)) {
            return false;
        }
        var isMapLike = obj[canSymbol.for('can.isMapLike')];
        if (typeof isMapLike !== 'undefined') {
            return !!isMapLike;
        }
        var value = obj[canSymbol.for('can.getKeyValue')];
        if (value !== undefined) {
            return !!value;
        }
        return true;
    }
    var onValueSymbol = canSymbol.for('can.onValue'), onKeyValueSymbol = canSymbol.for('can.onKeyValue'), onPatchesSymbol = canSymbol.for('can.onPatches');
    function isObservableLike(obj) {
        if (isPrimitive(obj)) {
            return false;
        }
        return Boolean(obj[onValueSymbol] || obj[onKeyValueSymbol] || obj[onPatchesSymbol]);
    }
    function isListLike(list) {
        var symbolValue, type = typeof list;
        if (type === 'string') {
            return true;
        }
        if (isPrimitive(list)) {
            return false;
        }
        symbolValue = list[canSymbol.for('can.isListLike')];
        if (typeof symbolValue !== 'undefined') {
            return symbolValue;
        }
        var value = list[canSymbol.iterator];
        if (value !== undefined) {
            return !!value;
        }
        if (Array.isArray(list)) {
            return true;
        }
        return helpers.hasLength(list);
    }
    var supportsSymbols = typeof Symbol !== 'undefined' && typeof Symbol.for === 'function';
    var isSymbolLike;
    if (supportsSymbols) {
        isSymbolLike = function (symbol) {
            return typeof symbol === 'symbol';
        };
    } else {
        var symbolStart = '@@symbol';
        isSymbolLike = function (symbol) {
            if (typeof symbol === 'object' && !Array.isArray(symbol)) {
                return symbol.toString().substr(0, symbolStart.length) === symbolStart;
            } else {
                return false;
            }
        };
    }
    var coreHasOwn = Object.prototype.hasOwnProperty;
    var funcToString = Function.prototype.toString;
    var objectCtorString = funcToString.call(Object);
    function isPlainObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return false;
        }
        var proto = Object.getPrototypeOf(obj);
        if (proto === Object.prototype || proto === null) {
            return true;
        }
        var Constructor = coreHasOwn.call(proto, 'constructor') && proto.constructor;
        return typeof Constructor === 'function' && Constructor instanceof Constructor && funcToString.call(Constructor) === objectCtorString;
    }
    module.exports = {
        isConstructorLike: isConstructorLike,
        isFunctionLike: isFunctionLike,
        isListLike: isListLike,
        isMapLike: isMapLike,
        isObservableLike: isObservableLike,
        isPrimitive: isPrimitive,
        isBuiltIn: isBuiltIn,
        isValueLike: isValueLike,
        isSymbolLike: isSymbolLike,
        isMoreListLikeThanMapLike: function (obj) {
            if (Array.isArray(obj)) {
                return true;
            }
            if (obj instanceof Array) {
                return true;
            }
            if (obj == null) {
                return false;
            }
            var value = obj[canSymbol.for('can.isMoreListLikeThanMapLike')];
            if (value !== undefined) {
                return value;
            }
            var isListLike = this.isListLike(obj), isMapLike = this.isMapLike(obj);
            if (isListLike && !isMapLike) {
                return true;
            } else if (!isListLike && isMapLike) {
                return false;
            }
        },
        isIteratorLike: function (obj) {
            return obj && typeof obj === 'object' && typeof obj.next === 'function' && obj.next.length === 0;
        },
        isPromise: function (obj) {
            return obj instanceof Promise || Object.prototype.toString.call(obj) === '[object Promise]';
        },
        isPlainObject: isPlainObject
    };
});
/*can-reflect@1.17.0#reflections/call/call*/
define('can-reflect/reflections/call/call', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    module.exports = {
        call: function (func, context) {
            var args = [].slice.call(arguments, 2);
            var apply = func[canSymbol.for('can.apply')];
            if (apply) {
                return apply.call(func, context, args);
            } else {
                return func.apply(context, args);
            }
        },
        apply: function (func, context, args) {
            var apply = func[canSymbol.for('can.apply')];
            if (apply) {
                return apply.call(func, context, args);
            } else {
                return func.apply(context, args);
            }
        },
        'new': function (func) {
            var args = [].slice.call(arguments, 1);
            var makeNew = func[canSymbol.for('can.new')];
            if (makeNew) {
                return makeNew.apply(func, args);
            } else {
                var context = Object.create(func.prototype);
                var ret = func.apply(context, args);
                if (typeReflections.isPrimitive(ret)) {
                    return context;
                } else {
                    return ret;
                }
            }
        }
    };
});
/*can-reflect@1.17.0#reflections/get-set/get-set*/
define('can-reflect/reflections/get-set/get-set', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var setKeyValueSymbol = canSymbol.for('can.setKeyValue'), getKeyValueSymbol = canSymbol.for('can.getKeyValue'), getValueSymbol = canSymbol.for('can.getValue'), setValueSymbol = canSymbol.for('can.setValue');
    var reflections = {
        setKeyValue: function (obj, key, value) {
            if (typeReflections.isSymbolLike(key)) {
                if (typeof key === 'symbol') {
                    obj[key] = value;
                } else {
                    Object.defineProperty(obj, key, {
                        enumerable: false,
                        configurable: true,
                        value: value,
                        writable: true
                    });
                }
                return;
            }
            var setKeyValue = obj[setKeyValueSymbol];
            if (setKeyValue !== undefined) {
                return setKeyValue.call(obj, key, value);
            } else {
                obj[key] = value;
            }
        },
        getKeyValue: function (obj, key) {
            var getKeyValue = obj[getKeyValueSymbol];
            if (getKeyValue) {
                return getKeyValue.call(obj, key);
            }
            return obj[key];
        },
        deleteKeyValue: function (obj, key) {
            var deleteKeyValue = obj[canSymbol.for('can.deleteKeyValue')];
            if (deleteKeyValue) {
                return deleteKeyValue.call(obj, key);
            }
            delete obj[key];
        },
        getValue: function (value) {
            if (typeReflections.isPrimitive(value)) {
                return value;
            }
            var getValue = value[getValueSymbol];
            if (getValue) {
                return getValue.call(value);
            }
            return value;
        },
        setValue: function (item, value) {
            var setValue = item && item[setValueSymbol];
            if (setValue) {
                return setValue.call(item, value);
            } else {
                throw new Error('can-reflect.setValue - Can not set value.');
            }
        },
        splice: function (obj, index, removing, adding) {
            var howMany;
            if (typeof removing !== 'number') {
                var updateValues = obj[canSymbol.for('can.updateValues')];
                if (updateValues) {
                    return updateValues.call(obj, index, removing, adding);
                }
                howMany = removing.length;
            } else {
                howMany = removing;
            }
            if (arguments.length <= 3) {
                adding = [];
            }
            var splice = obj[canSymbol.for('can.splice')];
            if (splice) {
                return splice.call(obj, index, howMany, adding);
            }
            return [].splice.apply(obj, [
                index,
                howMany
            ].concat(adding));
        },
        addValues: function (obj, adding, index) {
            var add = obj[canSymbol.for('can.addValues')];
            if (add) {
                return add.call(obj, adding, index);
            }
            if (Array.isArray(obj) && index === undefined) {
                return obj.push.apply(obj, adding);
            }
            return reflections.splice(obj, index, [], adding);
        },
        removeValues: function (obj, removing, index) {
            var removeValues = obj[canSymbol.for('can.removeValues')];
            if (removeValues) {
                return removeValues.call(obj, removing, index);
            }
            if (Array.isArray(obj) && index === undefined) {
                removing.forEach(function (item) {
                    var index = obj.indexOf(item);
                    if (index >= 0) {
                        obj.splice(index, 1);
                    }
                });
                return;
            }
            return reflections.splice(obj, index, removing, []);
        }
    };
    reflections.get = reflections.getKeyValue;
    reflections.set = reflections.setKeyValue;
    reflections['delete'] = reflections.deleteKeyValue;
    module.exports = reflections;
});
/*can-reflect@1.17.0#reflections/observe/observe*/
define('can-reflect/reflections/observe/observe', [
    'require',
    'exports',
    'module',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var slice = [].slice;
    function makeFallback(symbolName, fallbackName) {
        return function (obj, event, handler, queueName) {
            var method = obj[canSymbol.for(symbolName)];
            if (method !== undefined) {
                return method.call(obj, event, handler, queueName);
            }
            return this[fallbackName].apply(this, arguments);
        };
    }
    function makeErrorIfMissing(symbolName, errorMessage) {
        return function (obj) {
            var method = obj[canSymbol.for(symbolName)];
            if (method !== undefined) {
                var args = slice.call(arguments, 1);
                return method.apply(obj, args);
            }
            throw new Error(errorMessage);
        };
    }
    module.exports = {
        onKeyValue: makeFallback('can.onKeyValue', 'onEvent'),
        offKeyValue: makeFallback('can.offKeyValue', 'offEvent'),
        onKeys: makeErrorIfMissing('can.onKeys', 'can-reflect: can not observe an onKeys event'),
        onKeysAdded: makeErrorIfMissing('can.onKeysAdded', 'can-reflect: can not observe an onKeysAdded event'),
        onKeysRemoved: makeErrorIfMissing('can.onKeysRemoved', 'can-reflect: can not unobserve an onKeysRemoved event'),
        getKeyDependencies: makeErrorIfMissing('can.getKeyDependencies', 'can-reflect: can not determine dependencies'),
        getWhatIChange: makeErrorIfMissing('can.getWhatIChange', 'can-reflect: can not determine dependencies'),
        getChangesDependencyRecord: function getChangesDependencyRecord(handler) {
            var fn = handler[canSymbol.for('can.getChangesDependencyRecord')];
            if (typeof fn === 'function') {
                return fn();
            }
        },
        keyHasDependencies: makeErrorIfMissing('can.keyHasDependencies', 'can-reflect: can not determine if this has key dependencies'),
        onValue: makeErrorIfMissing('can.onValue', 'can-reflect: can not observe value change'),
        offValue: makeErrorIfMissing('can.offValue', 'can-reflect: can not unobserve value change'),
        getValueDependencies: makeErrorIfMissing('can.getValueDependencies', 'can-reflect: can not determine dependencies'),
        valueHasDependencies: makeErrorIfMissing('can.valueHasDependencies', 'can-reflect: can not determine if value has dependencies'),
        onPatches: makeErrorIfMissing('can.onPatches', 'can-reflect: can not observe patches on object'),
        offPatches: makeErrorIfMissing('can.offPatches', 'can-reflect: can not unobserve patches on object'),
        onInstancePatches: makeErrorIfMissing('can.onInstancePatches', 'can-reflect: can not observe onInstancePatches on Type'),
        offInstancePatches: makeErrorIfMissing('can.offInstancePatches', 'can-reflect: can not unobserve onInstancePatches on Type'),
        onInstanceBoundChange: makeErrorIfMissing('can.onInstanceBoundChange', 'can-reflect: can not observe bound state change in instances.'),
        offInstanceBoundChange: makeErrorIfMissing('can.offInstanceBoundChange', 'can-reflect: can not unobserve bound state change'),
        isBound: makeErrorIfMissing('can.isBound', 'can-reflect: cannot determine if object is bound'),
        onEvent: function (obj, eventName, callback, queue) {
            if (obj) {
                var onEvent = obj[canSymbol.for('can.onEvent')];
                if (onEvent !== undefined) {
                    return onEvent.call(obj, eventName, callback, queue);
                } else if (obj.addEventListener) {
                    obj.addEventListener(eventName, callback, queue);
                }
            }
        },
        offEvent: function (obj, eventName, callback, queue) {
            if (obj) {
                var offEvent = obj[canSymbol.for('can.offEvent')];
                if (offEvent !== undefined) {
                    return offEvent.call(obj, eventName, callback, queue);
                } else if (obj.removeEventListener) {
                    obj.removeEventListener(eventName, callback, queue);
                }
            }
        },
        setPriority: function (obj, priority) {
            if (obj) {
                var setPriority = obj[canSymbol.for('can.setPriority')];
                if (setPriority !== undefined) {
                    setPriority.call(obj, priority);
                    return true;
                }
            }
            return false;
        },
        getPriority: function (obj) {
            if (obj) {
                var getPriority = obj[canSymbol.for('can.getPriority')];
                if (getPriority !== undefined) {
                    return getPriority.call(obj);
                }
            }
            return undefined;
        }
    };
});
/*can-reflect@1.17.0#reflections/shape/shape*/
define('can-reflect/reflections/shape/shape', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/helpers'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var getSetReflections = require('can-reflect/reflections/get-set/get-set');
    var typeReflections = require('can-reflect/reflections/type/type');
    var helpers = require('can-reflect/reflections/helpers');
    var getPrototypeOfWorksWithPrimitives = true;
    try {
        Object.getPrototypeOf(1);
    } catch (e) {
        getPrototypeOfWorksWithPrimitives = false;
    }
    var ArrayMap;
    if (typeof Map === 'function') {
        ArrayMap = Map;
    } else {
        function isEven(num) {
            return !(num % 2);
        }
        ArrayMap = function () {
            this.contents = [];
        };
        ArrayMap.prototype = {
            _getIndex: function (key) {
                var idx;
                do {
                    idx = this.contents.indexOf(key, idx);
                } while (idx !== -1 && !isEven(idx));
                return idx;
            },
            has: function (key) {
                return this._getIndex(key) !== -1;
            },
            get: function (key) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    return this.contents[idx + 1];
                }
            },
            set: function (key, value) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    this.contents[idx + 1] = value;
                } else {
                    this.contents.push(key);
                    this.contents.push(value);
                }
            },
            'delete': function (key) {
                var idx = this._getIndex(key);
                if (idx !== -1) {
                    this.contents.splice(idx, 2);
                }
            }
        };
    }
    var shapeReflections;
    var shiftFirstArgumentToThis = function (func) {
        return function () {
            var args = [this];
            args.push.apply(args, arguments);
            return func.apply(null, args);
        };
    };
    var getKeyValueSymbol = canSymbol.for('can.getKeyValue');
    var shiftedGetKeyValue = shiftFirstArgumentToThis(getSetReflections.getKeyValue);
    var setKeyValueSymbol = canSymbol.for('can.setKeyValue');
    var shiftedSetKeyValue = shiftFirstArgumentToThis(getSetReflections.setKeyValue);
    var sizeSymbol = canSymbol.for('can.size');
    var hasUpdateSymbol = helpers.makeGetFirstSymbolValue([
        'can.updateDeep',
        'can.assignDeep',
        'can.setKeyValue'
    ]);
    var shouldUpdateOrAssign = function (obj) {
        return typeReflections.isPlainObject(obj) || Array.isArray(obj) || !!hasUpdateSymbol(obj);
    };
    function isSerializedHelper(obj) {
        if (typeReflections.isPrimitive(obj)) {
            return true;
        }
        if (hasUpdateSymbol(obj)) {
            return false;
        }
        return typeReflections.isBuiltIn(obj) && !typeReflections.isPlainObject(obj) && !Array.isArray(obj);
    }
    var Object_Keys;
    try {
        Object.keys(1);
        Object_Keys = Object.keys;
    } catch (e) {
        Object_Keys = function (obj) {
            if (typeReflections.isPrimitive(obj)) {
                return [];
            } else {
                return Object.keys(obj);
            }
        };
    }
    function makeSerializer(methodName, symbolsToCheck) {
        var serializeMap = null;
        function SerializeOperation(MapType) {
            this.first = !serializeMap;
            if (this.first) {
                serializeMap = createSerializeMap(MapType);
            }
            this.map = serializeMap;
            this.result = null;
        }
        SerializeOperation.prototype.end = function () {
            if (this.first) {
                serializeMap = null;
            }
            return this.result;
        };
        function createSerializeMap(Type) {
            var MapType = Type || ArrayMap;
            return {
                unwrap: new MapType(),
                serialize: new MapType(),
                isSerializing: {
                    unwrap: new MapType(),
                    serialize: new MapType()
                },
                circularReferenceIsSerializing: {
                    unwrap: new MapType(),
                    serialize: new MapType()
                }
            };
        }
        return function serializer(value, MapType) {
            if (isSerializedHelper(value)) {
                return value;
            }
            var operation = new SerializeOperation(MapType);
            if (typeReflections.isValueLike(value)) {
                operation.result = this[methodName](getSetReflections.getValue(value));
            } else {
                var isListLike = typeReflections.isIteratorLike(value) || typeReflections.isMoreListLikeThanMapLike(value);
                operation.result = isListLike ? [] : {};
                if (operation.map[methodName].has(value)) {
                    if (operation.map.isSerializing[methodName].has(value)) {
                        operation.map.circularReferenceIsSerializing[methodName].set(value, true);
                    }
                    return operation.map[methodName].get(value);
                } else {
                    operation.map[methodName].set(value, operation.result);
                }
                for (var i = 0, len = symbolsToCheck.length; i < len; i++) {
                    var serializer = value[symbolsToCheck[i]];
                    if (serializer) {
                        operation.map.isSerializing[methodName].set(value, true);
                        var oldResult = operation.result;
                        operation.result = serializer.call(value, oldResult);
                        operation.map.isSerializing[methodName].delete(value);
                        if (operation.result !== oldResult) {
                            if (operation.map.circularReferenceIsSerializing[methodName].has(value)) {
                                operation.end();
                                throw new Error('Cannot serialize cirular reference!');
                            }
                            operation.map[methodName].set(value, operation.result);
                        }
                        return operation.end();
                    }
                }
                if (typeof obj === 'function') {
                    operation.map[methodName].set(value, value);
                    operation.result = value;
                } else if (isListLike) {
                    this.eachIndex(value, function (childValue, index) {
                        operation.result[index] = this[methodName](childValue);
                    }, this);
                } else {
                    this.eachKey(value, function (childValue, prop) {
                        operation.result[prop] = this[methodName](childValue);
                    }, this);
                }
            }
            return operation.end();
        };
    }
    var makeMap;
    if (typeof Map !== 'undefined') {
        makeMap = function (keys) {
            var map = new Map();
            shapeReflections.eachIndex(keys, function (key) {
                map.set(key, true);
            });
            return map;
        };
    } else {
        makeMap = function (keys) {
            var map = {};
            keys.forEach(function (key) {
                map[key] = true;
            });
            return {
                get: function (key) {
                    return map[key];
                },
                set: function (key, value) {
                    map[key] = value;
                },
                keys: function () {
                    return keys;
                }
            };
        };
    }
    var fastHasOwnKey = function (obj) {
        var hasOwnKey = obj[canSymbol.for('can.hasOwnKey')];
        if (hasOwnKey) {
            return hasOwnKey.bind(obj);
        } else {
            var map = makeMap(shapeReflections.getOwnEnumerableKeys(obj));
            return function (key) {
                return map.get(key);
            };
        }
    };
    function addPatch(patches, patch) {
        var lastPatch = patches[patches.length - 1];
        if (lastPatch) {
            if (lastPatch.deleteCount === lastPatch.insert.length && patch.index - lastPatch.index === lastPatch.deleteCount) {
                lastPatch.insert.push.apply(lastPatch.insert, patch.insert);
                lastPatch.deleteCount += patch.deleteCount;
                return;
            }
        }
        patches.push(patch);
    }
    function updateDeepList(target, source, isAssign) {
        var sourceArray = this.toArray(source);
        var patches = [], lastIndex = -1;
        this.eachIndex(target, function (curVal, index) {
            lastIndex = index;
            if (index >= sourceArray.length) {
                if (!isAssign) {
                    addPatch(patches, {
                        index: index,
                        deleteCount: target.length - index + 1,
                        insert: []
                    });
                }
                return false;
            }
            var newVal = sourceArray[index];
            if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                addPatch(patches, {
                    index: index,
                    deleteCount: 1,
                    insert: [newVal]
                });
            } else {
                this.updateDeep(curVal, newVal);
            }
        }, this);
        if (sourceArray.length > lastIndex) {
            addPatch(patches, {
                index: lastIndex + 1,
                deleteCount: 0,
                insert: sourceArray.slice(lastIndex + 1)
            });
        }
        for (var i = 0, patchLen = patches.length; i < patchLen; i++) {
            var patch = patches[i];
            getSetReflections.splice(target, patch.index, patch.deleteCount, patch.insert);
        }
        return target;
    }
    shapeReflections = {
        each: function (obj, callback, context) {
            if (typeReflections.isIteratorLike(obj) || typeReflections.isMoreListLikeThanMapLike(obj)) {
                return shapeReflections.eachIndex(obj, callback, context);
            } else {
                return shapeReflections.eachKey(obj, callback, context);
            }
        },
        eachIndex: function (list, callback, context) {
            if (Array.isArray(list)) {
                return shapeReflections.eachListLike(list, callback, context);
            } else {
                var iter, iterator = list[canSymbol.iterator];
                if (typeReflections.isIteratorLike(list)) {
                    iter = list;
                } else if (iterator) {
                    iter = iterator.call(list);
                }
                if (iter) {
                    var res, index = 0;
                    while (!(res = iter.next()).done) {
                        if (callback.call(context || list, res.value, index++, list) === false) {
                            break;
                        }
                    }
                } else {
                    shapeReflections.eachListLike(list, callback, context);
                }
            }
            return list;
        },
        eachListLike: function (list, callback, context) {
            var index = -1;
            var length = list.length;
            if (length === undefined) {
                var size = list[sizeSymbol];
                if (size) {
                    length = size.call(list);
                } else {
                    throw new Error('can-reflect: unable to iterate.');
                }
            }
            while (++index < length) {
                var item = list[index];
                if (callback.call(context || item, item, index, list) === false) {
                    break;
                }
            }
            return list;
        },
        toArray: function (obj) {
            var arr = [];
            shapeReflections.each(obj, function (value) {
                arr.push(value);
            });
            return arr;
        },
        eachKey: function (obj, callback, context) {
            if (obj) {
                var enumerableKeys = shapeReflections.getOwnEnumerableKeys(obj);
                var getKeyValue = obj[getKeyValueSymbol] || shiftedGetKeyValue;
                return shapeReflections.eachIndex(enumerableKeys, function (key) {
                    var value = getKeyValue.call(obj, key);
                    return callback.call(context || obj, value, key, obj);
                });
            }
            return obj;
        },
        'hasOwnKey': function (obj, key) {
            var hasOwnKey = obj[canSymbol.for('can.hasOwnKey')];
            if (hasOwnKey) {
                return hasOwnKey.call(obj, key);
            }
            var getOwnKeys = obj[canSymbol.for('can.getOwnKeys')];
            if (getOwnKeys) {
                var found = false;
                shapeReflections.eachIndex(getOwnKeys.call(obj), function (objKey) {
                    if (objKey === key) {
                        found = true;
                        return false;
                    }
                });
                return found;
            }
            return obj.hasOwnProperty(key);
        },
        getOwnEnumerableKeys: function (obj) {
            var getOwnEnumerableKeys = obj[canSymbol.for('can.getOwnEnumerableKeys')];
            if (getOwnEnumerableKeys) {
                return getOwnEnumerableKeys.call(obj);
            }
            if (obj[canSymbol.for('can.getOwnKeys')] && obj[canSymbol.for('can.getOwnKeyDescriptor')]) {
                var keys = [];
                shapeReflections.eachIndex(shapeReflections.getOwnKeys(obj), function (key) {
                    var descriptor = shapeReflections.getOwnKeyDescriptor(obj, key);
                    if (descriptor.enumerable) {
                        keys.push(key);
                    }
                }, this);
                return keys;
            } else {
                return Object_Keys(obj);
            }
        },
        getOwnKeys: function (obj) {
            var getOwnKeys = obj[canSymbol.for('can.getOwnKeys')];
            if (getOwnKeys) {
                return getOwnKeys.call(obj);
            } else {
                return Object.getOwnPropertyNames(obj);
            }
        },
        getOwnKeyDescriptor: function (obj, key) {
            var getOwnKeyDescriptor = obj[canSymbol.for('can.getOwnKeyDescriptor')];
            if (getOwnKeyDescriptor) {
                return getOwnKeyDescriptor.call(obj, key);
            } else {
                return Object.getOwnPropertyDescriptor(obj, key);
            }
        },
        unwrap: makeSerializer('unwrap', [canSymbol.for('can.unwrap')]),
        serialize: makeSerializer('serialize', [
            canSymbol.for('can.serialize'),
            canSymbol.for('can.unwrap')
        ]),
        assignMap: function (target, source) {
            var hasOwnKey = fastHasOwnKey(target);
            var getKeyValue = target[getKeyValueSymbol] || shiftedGetKeyValue;
            var setKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(source, function (value, key) {
                if (!hasOwnKey(key) || getKeyValue.call(target, key) !== value) {
                    setKeyValue.call(target, key, value);
                }
            });
            return target;
        },
        assignList: function (target, source) {
            var inserting = shapeReflections.toArray(source);
            getSetReflections.splice(target, 0, inserting, inserting);
            return target;
        },
        assign: function (target, source) {
            if (typeReflections.isIteratorLike(source) || typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.assignList(target, source);
            } else {
                shapeReflections.assignMap(target, source);
            }
            return target;
        },
        assignDeepMap: function (target, source) {
            var hasOwnKey = fastHasOwnKey(target);
            var getKeyValue = target[getKeyValueSymbol] || shiftedGetKeyValue;
            var setKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(source, function (newVal, key) {
                if (!hasOwnKey(key)) {
                    getSetReflections.setKeyValue(target, key, newVal);
                } else {
                    var curVal = getKeyValue.call(target, key);
                    if (newVal === curVal) {
                    } else if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                        setKeyValue.call(target, key, newVal);
                    } else {
                        shapeReflections.assignDeep(curVal, newVal);
                    }
                }
            }, this);
            return target;
        },
        assignDeepList: function (target, source) {
            return updateDeepList.call(this, target, source, true);
        },
        assignDeep: function (target, source) {
            var assignDeep = target[canSymbol.for('can.assignDeep')];
            if (assignDeep) {
                assignDeep.call(target, source);
            } else if (typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.assignDeepList(target, source);
            } else {
                shapeReflections.assignDeepMap(target, source);
            }
            return target;
        },
        updateMap: function (target, source) {
            var sourceKeyMap = makeMap(shapeReflections.getOwnEnumerableKeys(source));
            var sourceGetKeyValue = source[getKeyValueSymbol] || shiftedGetKeyValue;
            var targetSetKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(target, function (curVal, key) {
                if (!sourceKeyMap.get(key)) {
                    getSetReflections.deleteKeyValue(target, key);
                    return;
                }
                sourceKeyMap.set(key, false);
                var newVal = sourceGetKeyValue.call(source, key);
                if (newVal !== curVal) {
                    targetSetKeyValue.call(target, key, newVal);
                }
            }, this);
            shapeReflections.eachIndex(sourceKeyMap.keys(), function (key) {
                if (sourceKeyMap.get(key)) {
                    targetSetKeyValue.call(target, key, sourceGetKeyValue.call(source, key));
                }
            });
            return target;
        },
        updateList: function (target, source) {
            var inserting = shapeReflections.toArray(source);
            getSetReflections.splice(target, 0, target, inserting);
            return target;
        },
        update: function (target, source) {
            if (typeReflections.isIteratorLike(source) || typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.updateList(target, source);
            } else {
                shapeReflections.updateMap(target, source);
            }
            return target;
        },
        updateDeepMap: function (target, source) {
            var sourceKeyMap = makeMap(shapeReflections.getOwnEnumerableKeys(source));
            var sourceGetKeyValue = source[getKeyValueSymbol] || shiftedGetKeyValue;
            var targetSetKeyValue = target[setKeyValueSymbol] || shiftedSetKeyValue;
            shapeReflections.eachKey(target, function (curVal, key) {
                if (!sourceKeyMap.get(key)) {
                    getSetReflections.deleteKeyValue(target, key);
                    return;
                }
                sourceKeyMap.set(key, false);
                var newVal = sourceGetKeyValue.call(source, key);
                if (typeReflections.isPrimitive(curVal) || typeReflections.isPrimitive(newVal) || shouldUpdateOrAssign(curVal) === false) {
                    targetSetKeyValue.call(target, key, newVal);
                } else {
                    shapeReflections.updateDeep(curVal, newVal);
                }
            }, this);
            shapeReflections.eachIndex(sourceKeyMap.keys(), function (key) {
                if (sourceKeyMap.get(key)) {
                    targetSetKeyValue.call(target, key, sourceGetKeyValue.call(source, key));
                }
            });
            return target;
        },
        updateDeepList: function (target, source) {
            return updateDeepList.call(this, target, source);
        },
        updateDeep: function (target, source) {
            var updateDeep = target[canSymbol.for('can.updateDeep')];
            if (updateDeep) {
                updateDeep.call(target, source);
            } else if (typeReflections.isMoreListLikeThanMapLike(source)) {
                shapeReflections.updateDeepList(target, source);
            } else {
                shapeReflections.updateDeepMap(target, source);
            }
            return target;
        },
        hasKey: function (obj, key) {
            if (obj == null) {
                return false;
            }
            if (typeReflections.isPrimitive(obj)) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    return true;
                } else {
                    var proto;
                    if (getPrototypeOfWorksWithPrimitives) {
                        proto = Object.getPrototypeOf(obj);
                    } else {
                        proto = obj.__proto__;
                    }
                    ;
                    if (proto !== undefined) {
                        return key in proto;
                    } else {
                        return obj[key] !== undefined;
                    }
                }
            }
            var hasKey = obj[canSymbol.for('can.hasKey')];
            if (hasKey) {
                return hasKey.call(obj, key);
            }
            var found = shapeReflections.hasOwnKey(obj, key);
            return found || key in obj;
        },
        getAllEnumerableKeys: function () {
        },
        getAllKeys: function () {
        },
        assignSymbols: function (target, source) {
            shapeReflections.eachKey(source, function (value, key) {
                var symbol = typeReflections.isSymbolLike(canSymbol[key]) ? canSymbol[key] : canSymbol.for(key);
                getSetReflections.setKeyValue(target, symbol, value);
            });
            return target;
        },
        isSerialized: isSerializedHelper,
        size: function (obj) {
            if (obj == null) {
                return 0;
            }
            var size = obj[sizeSymbol];
            var count = 0;
            if (size) {
                return size.call(obj);
            } else if (helpers.hasLength(obj)) {
                return obj.length;
            } else if (typeReflections.isListLike(obj)) {
                shapeReflections.eachIndex(obj, function () {
                    count++;
                });
                return count;
            } else if (obj) {
                return shapeReflections.getOwnEnumerableKeys(obj).length;
            } else {
                return undefined;
            }
        },
        defineInstanceKey: function (cls, key, properties) {
            var defineInstanceKey = cls[canSymbol.for('can.defineInstanceKey')];
            if (defineInstanceKey) {
                return defineInstanceKey.call(cls, key, properties);
            }
            var proto = cls.prototype;
            defineInstanceKey = proto[canSymbol.for('can.defineInstanceKey')];
            if (defineInstanceKey) {
                defineInstanceKey.call(proto, key, properties);
            } else {
                Object.defineProperty(proto, key, shapeReflections.assign({
                    configurable: true,
                    enumerable: !typeReflections.isSymbolLike(key),
                    writable: true
                }, properties));
            }
        }
    };
    shapeReflections.isSerializable = shapeReflections.isSerialized;
    shapeReflections.keys = shapeReflections.getOwnEnumerableKeys;
    module.exports = shapeReflections;
});
/*can-reflect@1.17.0#reflections/shape/schema/schema*/
define('can-reflect/reflections/shape/schema/schema', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/shape/shape'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var getSetReflections = require('can-reflect/reflections/get-set/get-set');
    var shapeReflections = require('can-reflect/reflections/shape/shape');
    var getSchemaSymbol = canSymbol.for('can.getSchema'), isMemberSymbol = canSymbol.for('can.isMember'), newSymbol = canSymbol.for('can.new');
    function comparator(a, b) {
        return a.localeCompare(b);
    }
    function sort(obj) {
        if (typeReflections.isPrimitive(obj)) {
            return obj;
        }
        var out;
        if (typeReflections.isListLike(obj)) {
            out = [];
            shapeReflections.eachKey(obj, function (item) {
                out.push(sort(item));
            });
            return out;
        }
        if (typeReflections.isMapLike(obj)) {
            out = {};
            shapeReflections.getOwnKeys(obj).sort(comparator).forEach(function (key) {
                out[key] = sort(getSetReflections.getKeyValue(obj, key));
            });
            return out;
        }
        return obj;
    }
    function isPrimitiveConverter(Type) {
        return Type === Number || Type === String || Type === Boolean;
    }
    var schemaReflections = {
        getSchema: function (type) {
            if (type === undefined) {
                return undefined;
            }
            var getSchema = type[getSchemaSymbol];
            if (getSchema === undefined) {
                type = type.constructor;
                getSchema = type && type[getSchemaSymbol];
            }
            return getSchema !== undefined ? getSchema.call(type) : undefined;
        },
        getIdentity: function (value, schema) {
            schema = schema || schemaReflections.getSchema(value);
            if (schema === undefined) {
                throw new Error('can-reflect.getIdentity - Unable to find a schema for the given value.');
            }
            var identity = schema.identity;
            if (!identity || identity.length === 0) {
                throw new Error('can-reflect.getIdentity - Provided schema lacks an identity property.');
            } else if (identity.length === 1) {
                return getSetReflections.getKeyValue(value, identity[0]);
            } else {
                var id = {};
                identity.forEach(function (key) {
                    id[key] = getSetReflections.getKeyValue(value, key);
                });
                return JSON.stringify(schemaReflections.cloneKeySort(id));
            }
        },
        cloneKeySort: function (obj) {
            return sort(obj);
        },
        convert: function (value, Type) {
            if (isPrimitiveConverter(Type)) {
                return Type(value);
            }
            var isMemberTest = Type[isMemberSymbol], isMember = false, type = typeof Type, createNew = Type[newSymbol];
            if (isMemberTest !== undefined) {
                isMember = isMemberTest.call(Type, value);
            } else if (type === 'function') {
                if (typeReflections.isConstructorLike(Type)) {
                    isMember = value instanceof Type;
                }
            }
            if (isMember) {
                return value;
            }
            if (createNew !== undefined) {
                return createNew.call(Type, value);
            } else if (type === 'function') {
                if (typeReflections.isConstructorLike(Type)) {
                    return new Type(value);
                } else {
                    return Type(value);
                }
            } else {
                throw new Error('can-reflect: Can not convert values into type. Type must provide `can.new` symbol.');
            }
        }
    };
    module.exports = schemaReflections;
});
/*can-reflect@1.17.0#reflections/get-name/get-name*/
define('can-reflect/reflections/get-name/get-name', [
    'require',
    'exports',
    'module',
    'can-symbol',
    'can-reflect/reflections/type/type'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    var typeReflections = require('can-reflect/reflections/type/type');
    var getNameSymbol = canSymbol.for('can.getName');
    function setName(obj, nameGetter) {
        if (typeof nameGetter !== 'function') {
            var value = nameGetter;
            nameGetter = function () {
                return value;
            };
        }
        Object.defineProperty(obj, getNameSymbol, { value: nameGetter });
    }
    function getName(obj) {
        var type = typeof obj;
        if (obj === null || type !== 'object' && type !== 'function') {
            return '' + obj;
        }
        var nameGetter = obj[getNameSymbol];
        if (nameGetter) {
            return nameGetter.call(obj);
        }
        if (type === 'function') {
            return obj.name;
        }
        if (obj.constructor && obj !== obj.constructor) {
            var parent = getName(obj.constructor);
            if (parent) {
                if (typeReflections.isValueLike(obj)) {
                    return parent + '<>';
                }
                if (typeReflections.isMoreListLikeThanMapLike(obj)) {
                    return parent + '[]';
                }
                if (typeReflections.isMapLike(obj)) {
                    return parent + '{}';
                }
            }
        }
        return undefined;
    }
    module.exports = {
        setName: setName,
        getName: getName
    };
});
/*can-reflect@1.17.0#types/map*/
define('can-reflect/types/map', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/shape/shape',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var shape = require('can-reflect/reflections/shape/shape');
    var CanSymbol = require('can-symbol');
    function keysPolyfill() {
        var keys = [];
        var currentIndex = 0;
        this.forEach(function (val, key) {
            keys.push(key);
        });
        return {
            next: function () {
                return {
                    value: keys[currentIndex],
                    done: currentIndex++ === keys.length
                };
            }
        };
    }
    if (typeof Map !== 'undefined') {
        shape.assignSymbols(Map.prototype, {
            'can.getOwnEnumerableKeys': Map.prototype.keys,
            'can.setKeyValue': Map.prototype.set,
            'can.getKeyValue': Map.prototype.get,
            'can.deleteKeyValue': Map.prototype['delete'],
            'can.hasOwnKey': Map.prototype.has
        });
        if (typeof Map.prototype.keys !== 'function') {
            Map.prototype.keys = Map.prototype[CanSymbol.for('can.getOwnEnumerableKeys')] = keysPolyfill;
        }
    }
    if (typeof WeakMap !== 'undefined') {
        shape.assignSymbols(WeakMap.prototype, {
            'can.getOwnEnumerableKeys': function () {
                throw new Error('can-reflect: WeakMaps do not have enumerable keys.');
            },
            'can.setKeyValue': WeakMap.prototype.set,
            'can.getKeyValue': WeakMap.prototype.get,
            'can.deleteKeyValue': WeakMap.prototype['delete'],
            'can.hasOwnKey': WeakMap.prototype.has
        });
    }
});
/*can-reflect@1.17.0#types/set*/
define('can-reflect/types/set', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/shape/shape',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var shape = require('can-reflect/reflections/shape/shape');
    var CanSymbol = require('can-symbol');
    if (typeof Set !== 'undefined') {
        shape.assignSymbols(Set.prototype, {
            'can.isMoreListLikeThanMapLike': true,
            'can.updateValues': function (index, removing, adding) {
                if (removing !== adding) {
                    shape.each(removing, function (value) {
                        this.delete(value);
                    }, this);
                }
                shape.each(adding, function (value) {
                    this.add(value);
                }, this);
            },
            'can.size': function () {
                return this.size;
            }
        });
        if (typeof Set.prototype[CanSymbol.iterator] !== 'function') {
            Set.prototype[CanSymbol.iterator] = function () {
                var arr = [];
                var currentIndex = 0;
                this.forEach(function (val) {
                    arr.push(val);
                });
                return {
                    next: function () {
                        return {
                            value: arr[currentIndex],
                            done: currentIndex++ === arr.length
                        };
                    }
                };
            };
        }
    }
    if (typeof WeakSet !== 'undefined') {
        shape.assignSymbols(WeakSet.prototype, {
            'can.isListLike': true,
            'can.isMoreListLikeThanMapLike': true,
            'can.updateValues': function (index, removing, adding) {
                if (removing !== adding) {
                    shape.each(removing, function (value) {
                        this.delete(value);
                    }, this);
                }
                shape.each(adding, function (value) {
                    this.add(value);
                }, this);
            },
            'can.size': function () {
                throw new Error('can-reflect: WeakSets do not have enumerable keys.');
            }
        });
    }
});
/*can-reflect@1.17.0#can-reflect*/
define('can-reflect', [
    'require',
    'exports',
    'module',
    'can-reflect/reflections/call/call',
    'can-reflect/reflections/get-set/get-set',
    'can-reflect/reflections/observe/observe',
    'can-reflect/reflections/shape/shape',
    'can-reflect/reflections/shape/schema/schema',
    'can-reflect/reflections/type/type',
    'can-reflect/reflections/get-name/get-name',
    'can-namespace',
    'can-reflect/types/map',
    'can-reflect/types/set'
], function (require, exports, module) {
    'use strict';
    var functionReflections = require('can-reflect/reflections/call/call');
    var getSet = require('can-reflect/reflections/get-set/get-set');
    var observe = require('can-reflect/reflections/observe/observe');
    var shape = require('can-reflect/reflections/shape/shape');
    var schema = require('can-reflect/reflections/shape/schema/schema');
    var type = require('can-reflect/reflections/type/type');
    var getName = require('can-reflect/reflections/get-name/get-name');
    var namespace = require('can-namespace');
    var reflect = {};
    [
        functionReflections,
        getSet,
        observe,
        shape,
        type,
        getName,
        schema
    ].forEach(function (reflections) {
        for (var prop in reflections) {
            reflect[prop] = reflections[prop];
        }
    });
    require('can-reflect/types/map');
    require('can-reflect/types/set');
    module.exports = namespace.Reflect = reflect;
});
/*can-log@1.0.0#can-log*/
define('can-log', function (require, exports, module) {
    'use strict';
    exports.warnTimeout = 5000;
    exports.logLevel = 0;
    exports.warn = function () {
        var ll = this.logLevel;
        if (ll < 2) {
            if (typeof console !== 'undefined' && console.warn) {
                this._logger('warn', Array.prototype.slice.call(arguments));
            } else if (typeof console !== 'undefined' && console.log) {
                this._logger('log', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports.log = function () {
        var ll = this.logLevel;
        if (ll < 1) {
            if (typeof console !== 'undefined' && console.log) {
                this._logger('log', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports.error = function () {
        var ll = this.logLevel;
        if (ll < 1) {
            if (typeof console !== 'undefined' && console.error) {
                this._logger('error', Array.prototype.slice.call(arguments));
            }
        }
    };
    exports._logger = function (type, arr) {
        try {
            console[type].apply(console, arr);
        } catch (e) {
            console[type](arr);
        }
    };
});
/*can-log@1.0.0#dev/dev*/
define('can-log/dev/dev', [
    'require',
    'exports',
    'module',
    'can-log'
], function (require, exports, module) {
    'use strict';
    var canLog = require('can-log');
    module.exports = {
        warnTimeout: 5000,
        logLevel: 0,
        stringify: function (value) {
            var flagUndefined = function flagUndefined(key, value) {
                return value === undefined ? '/* void(undefined) */' : value;
            };
            return JSON.stringify(value, flagUndefined, '  ').replace(/"\/\* void\(undefined\) \*\/"/g, 'undefined');
        },
        warn: function () {
        },
        log: function () {
        },
        error: function () {
        },
        _logger: canLog._logger
    };
});
/*can-string@1.0.0#can-string*/
define('can-string', function (require, exports, module) {
    'use strict';
    var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strQuote = /"/g, strSingleQuote = /'/g, strHyphenMatch = /-+(.)?/g, strCamelMatch = /[a-z][A-Z]/g, convertBadValues = function (content) {
            var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
            return '' + (isInvalid ? '' : content);
        };
    var string = {
        esc: function (content) {
            return convertBadValues(content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, '&#39;');
        },
        capitalize: function (s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        camelize: function (str) {
            return convertBadValues(str).replace(strHyphenMatch, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        hyphenate: function (str) {
            return convertBadValues(str).replace(strCamelMatch, function (str) {
                return str.charAt(0) + '-' + str.charAt(1).toLowerCase();
            });
        },
        underscore: function (s) {
            return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
        },
        undHash: strUndHash
    };
    module.exports = string;
});
/*can-construct@3.5.0#can-construct*/
define('can-construct', [
    'require',
    'exports',
    'module',
    'can-reflect',
    'can-log/dev/dev',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var dev = require('can-log/dev/dev');
    var namespace = require('can-namespace');
    var initializing = 0;
    var Construct = function () {
        if (arguments.length) {
            return Construct.extend.apply(Construct, arguments);
        }
    };
    var canGetDescriptor;
    try {
        Object.getOwnPropertyDescriptor({});
        canGetDescriptor = true;
    } catch (e) {
        canGetDescriptor = false;
    }
    var getDescriptor = function (newProps, name) {
            var descriptor = Object.getOwnPropertyDescriptor(newProps, name);
            if (descriptor && (descriptor.get || descriptor.set)) {
                return descriptor;
            }
            return null;
        }, inheritGetterSetter = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            var descriptor;
            for (var name in newProps) {
                if (descriptor = getDescriptor(newProps, name)) {
                    this._defineProperty(addTo, oldProps, name, descriptor);
                } else {
                    Construct._overwrite(addTo, oldProps, name, newProps[name]);
                }
            }
        }, simpleInherit = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            for (var name in newProps) {
                Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        };
    canReflect.assignMap(Construct, {
        constructorExtends: true,
        newInstance: function () {
            var inst = this.instance(), args;
            if (inst.setup) {
                Object.defineProperty(inst, '__inSetup', {
                    configurable: true,
                    enumerable: false,
                    value: true,
                    writable: true
                });
                args = inst.setup.apply(inst, arguments);
                if (args instanceof Construct.ReturnValue) {
                    return args.value;
                }
                inst.__inSetup = false;
            }
            if (inst.init) {
                inst.init.apply(inst, args || arguments);
            }
            return inst;
        },
        _inherit: canGetDescriptor ? inheritGetterSetter : simpleInherit,
        _defineProperty: function (what, oldProps, propName, descriptor) {
            Object.defineProperty(what, propName, descriptor);
        },
        _overwrite: function (what, oldProps, propName, val) {
            Object.defineProperty(what, propName, {
                value: val,
                configurable: true,
                enumerable: true,
                writable: true
            });
        },
        setup: function (base) {
            var defaults = canReflect.assignDeepMap({}, base.defaults);
            this.defaults = canReflect.assignDeepMap(defaults, this.defaults);
        },
        instance: function () {
            initializing = 1;
            var inst = new this();
            initializing = 0;
            return inst;
        },
        extend: function (name, staticProperties, instanceProperties) {
            var shortName = name, klass = staticProperties, proto = instanceProperties;
            if (typeof shortName !== 'string') {
                proto = klass;
                klass = shortName;
                shortName = null;
            }
            if (!proto) {
                proto = klass;
                klass = null;
            }
            proto = proto || {};
            var _super_class = this, _super = this.prototype, Constructor, prototype;
            prototype = this.instance();
            Construct._inherit(proto, _super, prototype);
            if (shortName) {
            } else if (klass && klass.shortName) {
                shortName = klass.shortName;
            } else if (this.shortName) {
                shortName = this.shortName;
            }
            function init() {
                if (!initializing) {
                    return (!this || this.constructor !== Constructor) && arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) : Constructor.newInstance.apply(Constructor, arguments);
                }
            }
            Constructor = typeof namedCtor === 'function' ? namedCtor(constructorName, init) : function () {
                return init.apply(this, arguments);
            };
            for (var propName in _super_class) {
                if (_super_class.hasOwnProperty(propName)) {
                    Constructor[propName] = _super_class[propName];
                }
            }
            Construct._inherit(klass, _super_class, Constructor);
            canReflect.assignMap(Constructor, {
                constructor: Constructor,
                prototype: prototype
            });
            if (shortName !== undefined) {
                if (Object.getOwnPropertyDescriptor) {
                    var desc = Object.getOwnPropertyDescriptor(Constructor, 'name');
                    if (!desc || desc.configurable) {
                        Object.defineProperty(Constructor, 'name', {
                            writable: true,
                            value: shortName,
                            configurable: true
                        });
                    }
                }
                Constructor.shortName = shortName;
            }
            Constructor.prototype.constructor = Constructor;
            var t = [_super_class].concat(Array.prototype.slice.call(arguments)), args = Constructor.setup.apply(Constructor, t);
            if (Constructor.init) {
                Constructor.init.apply(Constructor, args || t);
            }
            return Constructor;
        },
        ReturnValue: function (value) {
            this.value = value;
        }
    });
    Construct.prototype.setup = function () {
    };
    Construct.prototype.init = function () {
    };
    module.exports = namespace.Construct = Construct;
});
/*can-queues@1.1.2#queue-state*/
define('can-queues/queue-state', function (require, exports, module) {
    module.exports = { lastTask: null };
});
/*can-assign@1.2.0#can-assign*/
define('can-assign', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    var namespace = require('can-namespace');
    module.exports = namespace.assign = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-queues@1.1.2#queue*/
define('can-queues/queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue-state',
    'can-log/dev/dev',
    'can-assign'
], function (require, exports, module) {
    var queueState = require('can-queues/queue-state');
    var canDev = require('can-log/dev/dev');
    var assign = require('can-assign');
    function noOperation() {
    }
    var Queue = function (name, callbacks) {
        this.callbacks = assign({
            onFirstTask: noOperation,
            onComplete: function () {
                queueState.lastTask = null;
            }
        }, callbacks || {});
        this.name = name;
        this.index = 0;
        this.tasks = [];
        this._log = false;
    };
    Queue.prototype.constructor = Queue;
    Queue.noop = noOperation;
    Queue.prototype.enqueue = function (fn, context, args, meta) {
        var len = this.tasks.push({
            fn: fn,
            context: context,
            args: args,
            meta: meta || {}
        });
        if (len === 1) {
            this.callbacks.onFirstTask(this);
        }
    };
    Queue.prototype.flush = function () {
        while (this.index < this.tasks.length) {
            var task = this.tasks[this.index++];
            task.fn.apply(task.context, task.args);
        }
        this.index = 0;
        this.tasks = [];
        this.callbacks.onComplete(this);
    };
    Queue.prototype.log = function () {
        this._log = arguments.length ? arguments[0] : true;
    };
    module.exports = Queue;
});
/*can-queues@1.1.2#priority-queue*/
define('can-queues/priority-queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue'
], function (require, exports, module) {
    var Queue = require('can-queues/queue');
    var PriorityQueue = function () {
        Queue.apply(this, arguments);
        this.taskMap = new Map();
        this.taskContainersByPriority = [];
        this.curPriorityIndex = Infinity;
        this.curPriorityMax = 0;
        this.isFlushing = false;
        this.tasksRemaining = 0;
    };
    PriorityQueue.prototype = Object.create(Queue.prototype);
    PriorityQueue.prototype.constructor = PriorityQueue;
    PriorityQueue.prototype.enqueue = function (fn, context, args, meta) {
        if (!this.taskMap.has(fn)) {
            this.tasksRemaining++;
            var isFirst = this.taskContainersByPriority.length === 0;
            var task = {
                fn: fn,
                context: context,
                args: args,
                meta: meta || {}
            };
            var taskContainer = this.getTaskContainerAndUpdateRange(task);
            taskContainer.tasks.push(task);
            this.taskMap.set(fn, task);
            if (isFirst) {
                this.callbacks.onFirstTask(this);
            }
        }
    };
    PriorityQueue.prototype.getTaskContainerAndUpdateRange = function (task) {
        var priority = task.meta.priority || 0;
        if (priority < this.curPriorityIndex) {
            this.curPriorityIndex = priority;
        }
        if (priority > this.curPriorityMax) {
            this.curPriorityMax = priority;
        }
        var tcByPriority = this.taskContainersByPriority;
        var taskContainer = tcByPriority[priority];
        if (!taskContainer) {
            taskContainer = tcByPriority[priority] = {
                tasks: [],
                index: 0
            };
        }
        return taskContainer;
    };
    PriorityQueue.prototype.flush = function () {
        if (this.isFlushing) {
            return;
        }
        this.isFlushing = true;
        while (true) {
            if (this.curPriorityIndex <= this.curPriorityMax) {
                var taskContainer = this.taskContainersByPriority[this.curPriorityIndex];
                if (taskContainer && taskContainer.tasks.length > taskContainer.index) {
                    var task = taskContainer.tasks[taskContainer.index++];
                    this.tasksRemaining--;
                    this.taskMap['delete'](task.fn);
                    task.fn.apply(task.context, task.args);
                } else {
                    this.curPriorityIndex++;
                }
            } else {
                this.taskMap = new Map();
                this.curPriorityIndex = Infinity;
                this.curPriorityMax = 0;
                this.taskContainersByPriority = [];
                this.isFlushing = false;
                this.callbacks.onComplete(this);
                return;
            }
        }
    };
    PriorityQueue.prototype.isEnqueued = function (fn) {
        return this.taskMap.has(fn);
    };
    PriorityQueue.prototype.flushQueuedTask = function (fn) {
        var task = this.dequeue(fn);
        if (task) {
            task.fn.apply(task.context, task.args);
        }
    };
    PriorityQueue.prototype.dequeue = function (fn) {
        var task = this.taskMap.get(fn);
        if (task) {
            var priority = task.meta.priority || 0;
            var taskContainer = this.taskContainersByPriority[priority];
            var index = taskContainer.tasks.indexOf(task, taskContainer.index);
            if (index >= 0) {
                taskContainer.tasks.splice(index, 1);
                this.tasksRemaining--;
                this.taskMap['delete'](task.fn);
                return task;
            } else {
                console.warn('Task', fn, 'has already run');
            }
        }
    };
    PriorityQueue.prototype.tasksRemainingCount = function () {
        return this.tasksRemaining;
    };
    module.exports = PriorityQueue;
});
/*can-queues@1.1.2#completion-queue*/
define('can-queues/completion-queue', [
    'require',
    'exports',
    'module',
    'can-queues/queue'
], function (require, exports, module) {
    var Queue = require('can-queues/queue');
    var CompletionQueue = function () {
        Queue.apply(this, arguments);
        this.flushCount = 0;
    };
    CompletionQueue.prototype = Object.create(Queue.prototype);
    CompletionQueue.prototype.constructor = CompletionQueue;
    CompletionQueue.prototype.flush = function () {
        if (this.flushCount === 0) {
            this.flushCount++;
            while (this.index < this.tasks.length) {
                var task = this.tasks[this.index++];
                task.fn.apply(task.context, task.args);
            }
            this.index = 0;
            this.tasks = [];
            this.flushCount--;
            this.callbacks.onComplete(this);
        }
    };
    module.exports = CompletionQueue;
});
/*can-queues@1.1.2#can-queues*/
define('can-queues', [
    'require',
    'exports',
    'module',
    'can-log/dev/dev',
    'can-queues/queue',
    'can-queues/priority-queue',
    'can-queues/queue-state',
    'can-queues/completion-queue',
    'can-namespace'
], function (require, exports, module) {
    var canDev = require('can-log/dev/dev');
    var Queue = require('can-queues/queue');
    var PriorityQueue = require('can-queues/priority-queue');
    var queueState = require('can-queues/queue-state');
    var CompletionQueue = require('can-queues/completion-queue');
    var ns = require('can-namespace');
    var batchStartCounter = 0;
    var addedTask = false;
    var isFlushing = false;
    var batchNum = 0;
    var batchData;
    var queueNames = [
        'notify',
        'derive',
        'domUI',
        'mutate'
    ];
    var NOTIFY_QUEUE, DERIVE_QUEUE, DOM_UI_QUEUE, MUTATE_QUEUE;
    NOTIFY_QUEUE = new Queue('NOTIFY', {
        onComplete: function () {
            DERIVE_QUEUE.flush();
        },
        onFirstTask: function () {
            if (!batchStartCounter) {
                NOTIFY_QUEUE.flush();
            } else {
                addedTask = true;
            }
        }
    });
    DERIVE_QUEUE = new PriorityQueue('DERIVE', {
        onComplete: function () {
            DOM_UI_QUEUE.flush();
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    DOM_UI_QUEUE = new CompletionQueue('DOM_UI', {
        onComplete: function () {
            MUTATE_QUEUE.flush();
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    MUTATE_QUEUE = new Queue('MUTATE', {
        onComplete: function () {
            queueState.lastTask = null;
            isFlushing = false;
        },
        onFirstTask: function () {
            addedTask = true;
        }
    });
    var queues = {
        Queue: Queue,
        PriorityQueue: PriorityQueue,
        CompletionQueue: CompletionQueue,
        notifyQueue: NOTIFY_QUEUE,
        deriveQueue: DERIVE_QUEUE,
        domUIQueue: DOM_UI_QUEUE,
        mutateQueue: MUTATE_QUEUE,
        batch: {
            start: function () {
                batchStartCounter++;
                if (batchStartCounter === 1) {
                    batchNum++;
                    batchData = { number: batchNum };
                }
            },
            stop: function () {
                batchStartCounter--;
                if (batchStartCounter === 0) {
                    if (addedTask) {
                        addedTask = false;
                        isFlushing = true;
                        NOTIFY_QUEUE.flush();
                    }
                }
            },
            isCollecting: function () {
                return batchStartCounter > 0;
            },
            number: function () {
                return batchNum;
            },
            data: function () {
                return batchData;
            }
        },
        enqueueByQueue: function enqueueByQueue(fnByQueue, context, args, makeMeta, reasonLog) {
            if (fnByQueue) {
                queues.batch.start();
                queueNames.forEach(function (queueName) {
                    var name = queueName + 'Queue';
                    var QUEUE = queues[name];
                    var tasks = fnByQueue[queueName];
                    if (tasks !== undefined) {
                        tasks.forEach(function (fn) {
                            var meta = makeMeta != null ? makeMeta(fn, context, args) : {};
                            meta.reasonLog = reasonLog;
                            QUEUE.enqueue(fn, context, args, meta);
                        });
                    }
                });
                queues.batch.stop();
            }
        },
        stack: function () {
            var current = queueState.lastTask;
            var stack = [];
            while (current) {
                stack.unshift(current);
                current = current.meta.parentTask;
            }
            return stack;
        },
        logStack: function () {
            var stack = this.stack();
            stack.forEach(function (task, i) {
                var meta = task.meta;
                if (i === 0 && meta && meta.reasonLog) {
                    canDev.log.apply(canDev, meta.reasonLog);
                }
                var log = meta && meta.log ? meta.log : [
                    task.fn.name,
                    task
                ];
                canDev.log.apply(canDev, [task.meta.stack.name + ' ran task:'].concat(log));
            });
        },
        taskCount: function () {
            return NOTIFY_QUEUE.tasks.length + DERIVE_QUEUE.tasks.length + DOM_UI_QUEUE.tasks.length + MUTATE_QUEUE.tasks.length;
        },
        flush: function () {
            NOTIFY_QUEUE.flush();
        },
        log: function () {
            NOTIFY_QUEUE.log.apply(NOTIFY_QUEUE, arguments);
            DERIVE_QUEUE.log.apply(DERIVE_QUEUE, arguments);
            DOM_UI_QUEUE.log.apply(DOM_UI_QUEUE, arguments);
            MUTATE_QUEUE.log.apply(MUTATE_QUEUE, arguments);
        }
    };
    if (ns.queues) {
        throw new Error('You can\'t have two versions of can-queues, check your dependencies');
    } else {
        module.exports = ns.queues = queues;
    }
});
/*can-key-tree@1.2.0#can-key-tree*/
define('can-key-tree', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var reflect = require('can-reflect');
    function isBuiltInPrototype(obj) {
        if (obj === Object.prototype) {
            return true;
        }
        var protoString = Object.prototype.toString.call(obj);
        var isNotObjObj = protoString !== '[object Object]';
        var isObjSomething = protoString.indexOf('[object ') !== -1;
        return isNotObjObj && isObjSomething;
    }
    function getDeepSize(root, level) {
        if (level === 0) {
            return reflect.size(root);
        } else if (reflect.size(root) === 0) {
            return 0;
        } else {
            var count = 0;
            reflect.each(root, function (value) {
                count += getDeepSize(value, level - 1);
            });
            return count;
        }
    }
    function getDeep(node, items, depth, maxDepth) {
        if (!node) {
            return;
        }
        if (maxDepth === depth) {
            if (reflect.isMoreListLikeThanMapLike(node)) {
                reflect.addValues(items, reflect.toArray(node));
            } else {
                throw new Error('can-key-tree: Map-type leaf containers are not supported yet.');
            }
        } else {
            reflect.each(node, function (value) {
                getDeep(value, items, depth + 1, maxDepth);
            });
        }
    }
    function clearDeep(node, keys, maxDepth, deleteHandler) {
        if (maxDepth === keys.length) {
            if (reflect.isMoreListLikeThanMapLike(node)) {
                var valuesToRemove = reflect.toArray(node);
                if (deleteHandler) {
                    valuesToRemove.forEach(function (value) {
                        deleteHandler.apply(null, keys.concat(value));
                    });
                }
                reflect.removeValues(node, valuesToRemove);
            } else {
                throw new Error('can-key-tree: Map-type leaf containers are not supported yet.');
            }
        } else {
            reflect.each(node, function (value, key) {
                clearDeep(value, keys.concat(key), maxDepth, deleteHandler);
                reflect.deleteKeyValue(node, key);
            });
        }
    }
    var KeyTree = function (treeStructure, callbacks) {
        var FirstConstructor = treeStructure[0];
        if (reflect.isConstructorLike(FirstConstructor)) {
            this.root = new FirstConstructor();
        } else {
            this.root = FirstConstructor;
        }
        this.callbacks = callbacks || {};
        this.treeStructure = treeStructure;
        this.empty = true;
    };
    reflect.assign(KeyTree.prototype, {
        add: function (keys) {
            if (keys.length > this.treeStructure.length) {
                throw new Error('can-key-tree: Can not add path deeper than tree.');
            }
            var place = this.root;
            var rootWasEmpty = this.empty === true;
            for (var i = 0; i < keys.length - 1; i++) {
                var key = keys[i];
                var childNode = reflect.getKeyValue(place, key);
                if (!childNode) {
                    var Constructor = this.treeStructure[i + 1];
                    if (isBuiltInPrototype(Constructor.prototype)) {
                        childNode = new Constructor();
                    } else {
                        childNode = new Constructor(key);
                    }
                    reflect.setKeyValue(place, key, childNode);
                }
                place = childNode;
            }
            if (reflect.isMoreListLikeThanMapLike(place)) {
                reflect.addValues(place, [keys[keys.length - 1]]);
            } else {
                throw new Error('can-key-tree: Map types are not supported yet.');
            }
            if (rootWasEmpty) {
                this.empty = false;
                if (this.callbacks.onFirst) {
                    this.callbacks.onFirst.call(this);
                }
            }
            return this;
        },
        getNode: function (keys) {
            var node = this.root;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                node = reflect.getKeyValue(node, key);
                if (!node) {
                    return;
                }
            }
            return node;
        },
        get: function (keys) {
            var node = this.getNode(keys);
            if (this.treeStructure.length === keys.length) {
                return node;
            } else {
                var Type = this.treeStructure[this.treeStructure.length - 1];
                var items = new Type();
                getDeep(node, items, keys.length, this.treeStructure.length - 1);
                return items;
            }
        },
        delete: function (keys, deleteHandler) {
            var parentNode = this.root, path = [this.root], lastKey = keys[keys.length - 1];
            for (var i = 0; i < keys.length - 1; i++) {
                var key = keys[i];
                var childNode = reflect.getKeyValue(parentNode, key);
                if (childNode === undefined) {
                    return false;
                } else {
                    path.push(childNode);
                }
                parentNode = childNode;
            }
            if (!keys.length) {
                clearDeep(parentNode, [], this.treeStructure.length - 1, deleteHandler);
            } else if (keys.length === this.treeStructure.length) {
                if (reflect.isMoreListLikeThanMapLike(parentNode)) {
                    if (deleteHandler) {
                        deleteHandler.apply(null, keys.concat(lastKey));
                    }
                    reflect.removeValues(parentNode, [lastKey]);
                } else {
                    throw new Error('can-key-tree: Map types are not supported yet.');
                }
            } else {
                var nodeToRemove = reflect.getKeyValue(parentNode, lastKey);
                if (nodeToRemove !== undefined) {
                    clearDeep(nodeToRemove, keys, this.treeStructure.length - 1, deleteHandler);
                    reflect.deleteKeyValue(parentNode, lastKey);
                } else {
                    return false;
                }
            }
            for (i = path.length - 2; i >= 0; i--) {
                if (reflect.size(parentNode) === 0) {
                    parentNode = path[i];
                    reflect.deleteKeyValue(parentNode, keys[i]);
                } else {
                    break;
                }
            }
            if (reflect.size(this.root) === 0) {
                this.empty = true;
                if (this.callbacks.onEmpty) {
                    this.callbacks.onEmpty.call(this);
                }
            }
            return true;
        },
        size: function () {
            return getDeepSize(this.root, this.treeStructure.length - 1);
        },
        isEmpty: function () {
            return this.empty;
        }
    });
    module.exports = KeyTree;
});
/*can-globals@1.2.0#can-globals-proto*/
define('can-globals/can-globals-proto', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var canReflect = require('can-reflect');
        function dispatch(key) {
            var handlers = this.eventHandlers[key];
            if (handlers) {
                var handlersCopy = handlers.slice();
                var value = this.getKeyValue(key);
                for (var i = 0; i < handlersCopy.length; i++) {
                    handlersCopy[i](value);
                }
            }
        }
        function Globals() {
            this.eventHandlers = {};
            this.properties = {};
        }
        Globals.prototype.define = function (key, value, enableCache) {
            if (enableCache === undefined) {
                enableCache = true;
            }
            if (!this.properties[key]) {
                this.properties[key] = {
                    default: value,
                    value: value,
                    enableCache: enableCache
                };
            }
            return this;
        };
        Globals.prototype.getKeyValue = function (key) {
            var property = this.properties[key];
            if (property) {
                if (typeof property.value === 'function') {
                    if (property.cachedValue) {
                        return property.cachedValue;
                    }
                    if (property.enableCache) {
                        property.cachedValue = property.value();
                        return property.cachedValue;
                    } else {
                        return property.value();
                    }
                }
                return property.value;
            }
        };
        Globals.prototype.makeExport = function (key) {
            return function (value) {
                if (arguments.length === 0) {
                    return this.getKeyValue(key);
                }
                if (typeof value === 'undefined' || value === null) {
                    this.deleteKeyValue(key);
                } else {
                    if (typeof value === 'function') {
                        this.setKeyValue(key, function () {
                            return value;
                        });
                    } else {
                        this.setKeyValue(key, value);
                    }
                    return value;
                }
            }.bind(this);
        };
        Globals.prototype.offKeyValue = function (key, handler) {
            if (this.properties[key]) {
                var handlers = this.eventHandlers[key];
                if (handlers) {
                    var i = handlers.indexOf(handler);
                    handlers.splice(i, 1);
                }
            }
            return this;
        };
        Globals.prototype.onKeyValue = function (key, handler) {
            if (this.properties[key]) {
                if (!this.eventHandlers[key]) {
                    this.eventHandlers[key] = [];
                }
                this.eventHandlers[key].push(handler);
            }
            return this;
        };
        Globals.prototype.deleteKeyValue = function (key) {
            var property = this.properties[key];
            if (property !== undefined) {
                property.value = property.default;
                property.cachedValue = undefined;
                dispatch.call(this, key);
            }
            return this;
        };
        Globals.prototype.setKeyValue = function (key, value) {
            if (!this.properties[key]) {
                return this.define(key, value);
            }
            var property = this.properties[key];
            property.value = value;
            property.cachedValue = undefined;
            dispatch.call(this, key);
            return this;
        };
        Globals.prototype.reset = function () {
            for (var key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    this.properties[key].value = this.properties[key].default;
                    this.properties[key].cachedValue = undefined;
                    dispatch.call(this, key);
                }
            }
            return this;
        };
        canReflect.assignSymbols(Globals.prototype, {
            'can.getKeyValue': Globals.prototype.getKeyValue,
            'can.setKeyValue': Globals.prototype.setKeyValue,
            'can.deleteKeyValue': Globals.prototype.deleteKeyValue,
            'can.onKeyValue': Globals.prototype.onKeyValue,
            'can.offKeyValue': Globals.prototype.offKeyValue
        });
        module.exports = Globals;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#can-globals-instance*/
define('can-globals/can-globals-instance', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-globals/can-globals-proto'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var namespace = require('can-namespace');
        var Globals = require('can-globals/can-globals-proto');
        var globals = new Globals();
        if (namespace.globals) {
            throw new Error('You can\'t have two versions of can-globals, check your dependencies');
        } else {
            module.exports = namespace.globals = globals;
        }
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#global/global*/
define('can-globals/global/global', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        globals.define('global', function () {
            return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : typeof process === 'object' && {}.toString.call(process) === '[object process]' ? global : window;
        });
        module.exports = globals.makeExport('global');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#document/document*/
define('can-globals/document/document', [
    'require',
    'exports',
    'module',
    'can-globals/global/global',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        require('can-globals/global/global');
        var globals = require('can-globals/can-globals-instance');
        globals.define('document', function () {
            return globals.getKeyValue('global').document;
        });
        module.exports = globals.makeExport('document');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#is-node/is-node*/
define('can-globals/is-node/is-node', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        globals.define('isNode', function () {
            return typeof process === 'object' && {}.toString.call(process) === '[object process]';
        });
        module.exports = globals.makeExport('isNode');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-globals@1.2.0#is-browser-window/is-browser-window*/
define('can-globals/is-browser-window/is-browser-window', [
    'require',
    'exports',
    'module',
    'can-globals/can-globals-instance',
    'can-globals/is-node/is-node'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var globals = require('can-globals/can-globals-instance');
        require('can-globals/is-node/is-node');
        globals.define('isBrowserWindow', function () {
            var isNode = globals.getKeyValue('isNode');
            return typeof window !== 'undefined' && typeof document !== 'undefined' && isNode === false;
        });
        module.exports = globals.makeExport('isBrowserWindow');
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-dom-events@1.3.0#helpers/util*/
define('can-dom-events/helpers/util', [
    'require',
    'exports',
    'module',
    'can-globals/document/document',
    'can-globals/is-browser-window/is-browser-window'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var getCurrentDocument = require('can-globals/document/document');
        var isBrowserWindow = require('can-globals/is-browser-window/is-browser-window');
        function getTargetDocument(target) {
            return target.ownerDocument || getCurrentDocument();
        }
        function createEvent(target, eventData, bubbles, cancelable) {
            var doc = getTargetDocument(target);
            var event = doc.createEvent('HTMLEvents');
            var eventType;
            if (typeof eventData === 'string') {
                eventType = eventData;
            } else {
                eventType = eventData.type;
                for (var prop in eventData) {
                    if (event[prop] === undefined) {
                        event[prop] = eventData[prop];
                    }
                }
            }
            if (bubbles === undefined) {
                bubbles = true;
            }
            event.initEvent(eventType, bubbles, cancelable);
            return event;
        }
        function isDomEventTarget(obj) {
            if (!(obj && obj.nodeName)) {
                return obj === window;
            }
            var nodeType = obj.nodeType;
            return nodeType === 1 || nodeType === 9 || nodeType === 11;
        }
        function addDomContext(context, args) {
            if (isDomEventTarget(context)) {
                args = Array.prototype.slice.call(args, 0);
                args.unshift(context);
            }
            return args;
        }
        function removeDomContext(context, args) {
            if (!isDomEventTarget(context)) {
                args = Array.prototype.slice.call(args, 0);
                context = args.shift();
            }
            return {
                context: context,
                args: args
            };
        }
        var fixSyntheticEventsOnDisabled = false;
        (function () {
            if (!isBrowserWindow()) {
                return;
            }
            var testEventName = 'fix_synthetic_events_on_disabled_test';
            var input = document.createElement('input');
            input.disabled = true;
            var timer = setTimeout(function () {
                fixSyntheticEventsOnDisabled = true;
            }, 50);
            var onTest = function onTest() {
                clearTimeout(timer);
                input.removeEventListener(testEventName, onTest);
            };
            input.addEventListener(testEventName, onTest);
            try {
                var event = document.create('HTMLEvents');
                event.initEvent(testEventName, false);
                input.dispatchEvent(event);
            } catch (e) {
                onTest();
                fixSyntheticEventsOnDisabled = true;
            }
        }());
        function isDispatchingOnDisabled(element, event) {
            var eventType = event.type;
            var isInsertedOrRemoved = eventType === 'inserted' || eventType === 'removed';
            var isDisabled = !!element.disabled;
            return isInsertedOrRemoved && isDisabled;
        }
        function forceEnabledForDispatch(element, event) {
            return fixSyntheticEventsOnDisabled && isDispatchingOnDisabled(element, event);
        }
        module.exports = {
            createEvent: createEvent,
            addDomContext: addDomContext,
            removeDomContext: removeDomContext,
            isDomEventTarget: isDomEventTarget,
            getTargetDocument: getTargetDocument,
            forceEnabledForDispatch: forceEnabledForDispatch
        };
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-dom-events@1.3.0#helpers/make-event-registry*/
define('can-dom-events/helpers/make-event-registry', function (require, exports, module) {
    'use strict';
    function EventRegistry() {
        this._registry = {};
    }
    module.exports = function makeEventRegistry() {
        return new EventRegistry();
    };
    EventRegistry.prototype.has = function (eventType) {
        return !!this._registry[eventType];
    };
    EventRegistry.prototype.get = function (eventType) {
        return this._registry[eventType];
    };
    EventRegistry.prototype.add = function (event, eventType) {
        if (!event) {
            throw new Error('An EventDefinition must be provided');
        }
        if (typeof event.addEventListener !== 'function') {
            throw new TypeError('EventDefinition addEventListener must be a function');
        }
        if (typeof event.removeEventListener !== 'function') {
            throw new TypeError('EventDefinition removeEventListener must be a function');
        }
        eventType = eventType || event.defaultEventType;
        if (typeof eventType !== 'string') {
            throw new TypeError('Event type must be a string, not ' + eventType);
        }
        if (this.has(eventType)) {
            throw new Error('Event "' + eventType + '" is already registered');
        }
        this._registry[eventType] = event;
        var self = this;
        return function remove() {
            self._registry[eventType] = undefined;
        };
    };
});
/*can-dom-events@1.3.0#helpers/-make-delegate-event-tree*/
define('can-dom-events/helpers/-make-delegate-event-tree', [
    'require',
    'exports',
    'module',
    'can-key-tree',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var KeyTree = require('can-key-tree');
    var canReflect = require('can-reflect');
    var useCapture = function (eventType) {
        return eventType === 'focus' || eventType === 'blur';
    };
    function makeDelegator(domEvents) {
        var Delegator = function Delegator(parentKey) {
            this.element = parentKey;
            this.events = {};
            this.delegated = {};
        };
        canReflect.assignSymbols(Delegator.prototype, {
            'can.setKeyValue': function (eventType, handlersBySelector) {
                var handler = this.delegated[eventType] = function (ev) {
                    canReflect.each(handlersBySelector, function (handlers, selector) {
                        var cur = ev.target;
                        do {
                            var el = cur === document ? document.documentElement : cur;
                            var matches = el.matches || el.msMatchesSelector;
                            if (matches.call(el, selector)) {
                                handlers.forEach(function (handler) {
                                    handler.call(el, ev);
                                });
                            }
                            cur = cur.parentNode;
                        } while (cur && cur !== ev.currentTarget);
                    });
                };
                this.events[eventType] = handlersBySelector;
                domEvents.addEventListener(this.element, eventType, handler, useCapture(eventType));
            },
            'can.getKeyValue': function (eventType) {
                return this.events[eventType];
            },
            'can.deleteKeyValue': function (eventType) {
                domEvents.removeEventListener(this.element, eventType, this.delegated[eventType], useCapture(eventType));
                delete this.delegated[eventType];
                delete this.events[eventType];
            },
            'can.getOwnEnumerableKeys': function () {
                return Object.keys(this.events);
            }
        });
        return Delegator;
    }
    module.exports = function makeDelegateEventTree(domEvents) {
        var Delegator = makeDelegator(domEvents);
        return new KeyTree([
            Map,
            Delegator,
            Object,
            Array
        ]);
    };
});
/*can-dom-events@1.3.0#can-dom-events*/
define('can-dom-events', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-dom-events/helpers/util',
    'can-dom-events/helpers/make-event-registry',
    'can-dom-events/helpers/-make-delegate-event-tree'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var namespace = require('can-namespace');
        var util = require('can-dom-events/helpers/util');
        var makeEventRegistry = require('can-dom-events/helpers/make-event-registry');
        var makeDelegateEventTree = require('can-dom-events/helpers/-make-delegate-event-tree');
        var domEvents = {
            _eventRegistry: makeEventRegistry(),
            addEvent: function (event, eventType) {
                return this._eventRegistry.add(event, eventType);
            },
            addEventListener: function (target, eventType) {
                var hasCustomEvent = domEvents._eventRegistry.has(eventType);
                if (hasCustomEvent) {
                    var event = domEvents._eventRegistry.get(eventType);
                    return event.addEventListener.apply(domEvents, arguments);
                }
                var eventArgs = Array.prototype.slice.call(arguments, 1);
                return target.addEventListener.apply(target, eventArgs);
            },
            removeEventListener: function (target, eventType) {
                var hasCustomEvent = domEvents._eventRegistry.has(eventType);
                if (hasCustomEvent) {
                    var event = domEvents._eventRegistry.get(eventType);
                    return event.removeEventListener.apply(domEvents, arguments);
                }
                var eventArgs = Array.prototype.slice.call(arguments, 1);
                return target.removeEventListener.apply(target, eventArgs);
            },
            addDelegateListener: function (root, eventType, selector, handler) {
                domEvents._eventTree.add([
                    root,
                    eventType,
                    selector,
                    handler
                ]);
            },
            removeDelegateListener: function (target, eventType, selector, handler) {
                domEvents._eventTree.delete([
                    target,
                    eventType,
                    selector,
                    handler
                ]);
            },
            dispatch: function (target, eventData, bubbles, cancelable) {
                var event = util.createEvent(target, eventData, bubbles, cancelable);
                var enableForDispatch = util.forceEnabledForDispatch(target, event);
                if (enableForDispatch) {
                    target.disabled = false;
                }
                var ret = target.dispatchEvent(event);
                if (enableForDispatch) {
                    target.disabled = true;
                }
                return ret;
            }
        };
        domEvents._eventTree = makeDelegateEventTree(domEvents);
        module.exports = namespace.domEvents = domEvents;
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-event-queue@1.1.0#dependency-record/merge*/
define('can-event-queue/dependency-record/merge', [
    'require',
    'exports',
    'module',
    'can-reflect'
], function (require, exports, module) {
    'use strict';
    var canReflect = require('can-reflect');
    var mergeValueDependencies = function mergeValueDependencies(obj, source) {
        var sourceValueDeps = source.valueDependencies;
        if (sourceValueDeps) {
            var destValueDeps = obj.valueDependencies;
            if (!destValueDeps) {
                destValueDeps = new Set();
                obj.valueDependencies = destValueDeps;
            }
            canReflect.eachIndex(sourceValueDeps, function (dep) {
                destValueDeps.add(dep);
            });
        }
    };
    var mergeKeyDependencies = function mergeKeyDependencies(obj, source) {
        var sourcekeyDeps = source.keyDependencies;
        if (sourcekeyDeps) {
            var destKeyDeps = obj.keyDependencies;
            if (!destKeyDeps) {
                destKeyDeps = new Map();
                obj.keyDependencies = destKeyDeps;
            }
            canReflect.eachKey(sourcekeyDeps, function (keys, obj) {
                var entry = destKeyDeps.get(obj);
                if (!entry) {
                    entry = new Set();
                    destKeyDeps.set(obj, entry);
                }
                canReflect.eachIndex(keys, function (key) {
                    entry.add(key);
                });
            });
        }
    };
    module.exports = function mergeDependencyRecords(object, source) {
        mergeKeyDependencies(object, source);
        mergeValueDependencies(object, source);
        return object;
    };
});
/*can-event-queue@1.1.0#map/map*/
define('can-event-queue/map/map', [
    'require',
    'exports',
    'module',
    'can-log/dev/dev',
    'can-queues',
    'can-reflect',
    'can-symbol',
    'can-key-tree',
    'can-dom-events',
    'can-dom-events/helpers/util',
    'can-event-queue/dependency-record/merge'
], function (require, exports, module) {
    'use strict';
    var canDev = require('can-log/dev/dev');
    var queues = require('can-queues');
    var canReflect = require('can-reflect');
    var canSymbol = require('can-symbol');
    var KeyTree = require('can-key-tree');
    var domEvents = require('can-dom-events');
    var isDomEventTarget = require('can-dom-events/helpers/util').isDomEventTarget;
    var mergeDependencyRecords = require('can-event-queue/dependency-record/merge');
    var metaSymbol = canSymbol.for('can.meta'), dispatchBoundChangeSymbol = canSymbol.for('can.dispatchInstanceBoundChange'), dispatchInstanceOnPatchesSymbol = canSymbol.for('can.dispatchInstanceOnPatches'), onKeyValueSymbol = canSymbol.for('can.onKeyValue'), offKeyValueSymbol = canSymbol.for('can.offKeyValue'), onEventSymbol = canSymbol.for('can.onEvent'), offEventSymbol = canSymbol.for('can.offEvent'), onValueSymbol = canSymbol.for('can.onValue'), offValueSymbol = canSymbol.for('can.offValue');
    var legacyMapBindings;
    function addHandlers(obj, meta) {
        if (!meta.handlers) {
            meta.handlers = new KeyTree([
                Object,
                Object,
                Object,
                Array
            ], {
                onFirst: function () {
                    if (obj._eventSetup !== undefined) {
                        obj._eventSetup();
                    }
                    if (obj.constructor[dispatchBoundChangeSymbol]) {
                        obj.constructor[dispatchBoundChangeSymbol](obj, true);
                    }
                },
                onEmpty: function () {
                    if (obj._eventTeardown !== undefined) {
                        obj._eventTeardown();
                    }
                    if (obj.constructor[dispatchBoundChangeSymbol]) {
                        obj.constructor[dispatchBoundChangeSymbol](obj, false);
                    }
                }
            });
        }
        if (!meta.listenHandlers) {
            meta.listenHandlers = new KeyTree([
                Map,
                Map,
                Object,
                Array
            ]);
        }
    }
    var ensureMeta = function ensureMeta(obj) {
        var meta = obj[metaSymbol];
        if (!meta) {
            meta = {};
            canReflect.setKeyValue(obj, metaSymbol, meta);
        }
        addHandlers(obj, meta);
        return meta;
    };
    function stopListeningArgumentsToKeys(bindTarget, event, handler, queueName) {
        if (arguments.length && canReflect.isPrimitive(bindTarget)) {
            queueName = handler;
            handler = event;
            event = bindTarget;
            bindTarget = this.context;
        }
        if (typeof event === 'function') {
            queueName = handler;
            handler = event;
            event = undefined;
        }
        if (typeof handler === 'string') {
            queueName = handler;
            handler = undefined;
        }
        var keys = [];
        if (bindTarget) {
            keys.push(bindTarget);
            if (event || handler || queueName) {
                keys.push(event);
                if (queueName || handler) {
                    keys.push(queueName || this.defaultQueue);
                    if (handler) {
                        keys.push(handler);
                    }
                }
            }
        }
        return keys;
    }
    var props = {
        dispatch: function (event, args) {
            if (!this.__inSetup) {
                if (typeof event === 'string') {
                    event = { type: event };
                }
                var meta = ensureMeta(this);
                var handlers = meta.handlers;
                var handlersByType = event.type !== undefined && handlers.getNode([event.type]);
                var dispatchConstructorPatches = event.patches && this.constructor[dispatchInstanceOnPatchesSymbol];
                var patchesNode = event.patches !== undefined && handlers.getNode([
                    'can.patches',
                    'onKeyValue'
                ]);
                var keysNode = event.keyChanged !== undefined && handlers.getNode([
                    'can.keys',
                    'onKeyValue'
                ]);
                var batch = dispatchConstructorPatches || handlersByType || patchesNode || keysNode;
                if (batch) {
                    queues.batch.start();
                }
                if (handlersByType) {
                    if (handlersByType.onKeyValue) {
                        queues.enqueueByQueue(handlersByType.onKeyValue, this, args, event.makeMeta, event.reasonLog);
                    }
                    if (handlersByType.event) {
                        event.batchNum = queues.batch.number();
                        var eventAndArgs = [event].concat(args);
                        queues.enqueueByQueue(handlersByType.event, this, eventAndArgs, event.makeMeta, event.reasonLog);
                    }
                }
                if (keysNode) {
                    queues.enqueueByQueue(keysNode, this, [event.keyChanged], event.makeMeta, event.reasonLog);
                }
                if (patchesNode) {
                    queues.enqueueByQueue(patchesNode, this, [event.patches], event.makeMeta, event.reasonLog);
                }
                if (dispatchConstructorPatches) {
                    this.constructor[dispatchInstanceOnPatchesSymbol](this, event.patches);
                }
                if (batch) {
                    queues.batch.stop();
                }
            }
            return event;
        },
        addEventListener: function (key, handler, queueName) {
            ensureMeta(this).handlers.add([
                key,
                'event',
                queueName || 'mutate',
                handler
            ]);
            return this;
        },
        removeEventListener: function (key, handler, queueName) {
            if (key === undefined) {
                var handlers = ensureMeta(this).handlers;
                var keyHandlers = handlers.getNode([]);
                Object.keys(keyHandlers).forEach(function (key) {
                    handlers.delete([
                        key,
                        'event'
                    ]);
                });
            } else if (!handler && !queueName) {
                ensureMeta(this).handlers.delete([
                    key,
                    'event'
                ]);
            } else if (!handler) {
                ensureMeta(this).handlers.delete([
                    key,
                    'event',
                    queueName || 'mutate'
                ]);
            } else {
                ensureMeta(this).handlers.delete([
                    key,
                    'event',
                    queueName || 'mutate',
                    handler
                ]);
            }
            return this;
        },
        one: function (event, handler) {
            var one = function () {
                legacyMapBindings.off.call(this, event, one);
                return handler.apply(this, arguments);
            };
            legacyMapBindings.on.call(this, event, one);
            return this;
        },
        listenTo: function (bindTarget, event, handler, queueName) {
            if (canReflect.isPrimitive(bindTarget)) {
                queueName = handler;
                handler = event;
                event = bindTarget;
                bindTarget = this;
            }
            if (typeof event === 'function') {
                queueName = handler;
                handler = event;
                event = undefined;
            }
            ensureMeta(this).listenHandlers.add([
                bindTarget,
                event,
                queueName || 'mutate',
                handler
            ]);
            legacyMapBindings.on.call(bindTarget, event, handler, queueName || 'mutate');
            return this;
        },
        stopListening: function () {
            var keys = stopListeningArgumentsToKeys.apply({
                context: this,
                defaultQueue: 'mutate'
            }, arguments);
            var listenHandlers = ensureMeta(this).listenHandlers;
            function deleteHandler(bindTarget, event, queue, handler) {
                legacyMapBindings.off.call(bindTarget, event, handler, queue);
            }
            listenHandlers.delete(keys, deleteHandler);
            return this;
        },
        on: function (eventName, handler, queue) {
            var listenWithDOM = isDomEventTarget(this);
            if (listenWithDOM) {
                if (typeof handler === 'string') {
                    domEvents.addDelegateListener(this, eventName, handler, queue);
                } else {
                    domEvents.addEventListener(this, eventName, handler, queue);
                }
            } else {
                if ('addEventListener' in this) {
                    this.addEventListener(eventName, handler, queue);
                } else if (this[onKeyValueSymbol]) {
                    canReflect.onKeyValue(this, eventName, handler, queue);
                } else if (this[onEventSymbol]) {
                    this[onEventSymbol](eventName, handler, queue);
                } else {
                    if (!eventName && this[onValueSymbol]) {
                        canReflect.onValue(this, handler, queue);
                    } else {
                        throw new Error('can-event-queue: Unable to bind ' + eventName);
                    }
                }
            }
            return this;
        },
        off: function (eventName, handler, queue) {
            var listenWithDOM = isDomEventTarget(this);
            if (listenWithDOM) {
                if (typeof handler === 'string') {
                    domEvents.removeDelegateListener(this, eventName, handler, queue);
                } else {
                    domEvents.removeEventListener(this, eventName, handler, queue);
                }
            } else {
                if ('removeEventListener' in this) {
                    this.removeEventListener(eventName, handler, queue);
                } else if (this[offKeyValueSymbol]) {
                    canReflect.offKeyValue(this, eventName, handler, queue);
                } else if (this[offEventSymbol]) {
                    this[offEventSymbol](eventName, handler, queue);
                } else {
                    if (!eventName && this[offValueSymbol]) {
                        canReflect.offValue(this, handler, queue);
                    } else {
                        throw new Error('can-event-queue: Unable to unbind ' + eventName);
                    }
                }
            }
            return this;
        }
    };
    var symbols = {
        'can.onKeyValue': function (key, handler, queueName) {
            ensureMeta(this).handlers.add([
                key,
                'onKeyValue',
                queueName || 'mutate',
                handler
            ]);
        },
        'can.offKeyValue': function (key, handler, queueName) {
            ensureMeta(this).handlers.delete([
                key,
                'onKeyValue',
                queueName || 'mutate',
                handler
            ]);
        },
        'can.isBound': function () {
            return !ensureMeta(this).handlers.isEmpty();
        },
        'can.getWhatIChange': function getWhatIChange(key) {
        },
        'can.onPatches': function (handler, queue) {
            var handlers = ensureMeta(this).handlers;
            handlers.add([
                'can.patches',
                'onKeyValue',
                queue || 'notify',
                handler
            ]);
        },
        'can.offPatches': function (handler, queue) {
            var handlers = ensureMeta(this).handlers;
            handlers.delete([
                'can.patches',
                'onKeyValue',
                queue || 'notify',
                handler
            ]);
        }
    };
    function defineNonEnumerable(obj, prop, value) {
        Object.defineProperty(obj, prop, {
            enumerable: false,
            value: value
        });
    }
    legacyMapBindings = function (obj) {
        canReflect.assignMap(obj, props);
        return canReflect.assignSymbols(obj, symbols);
    };
    defineNonEnumerable(legacyMapBindings, 'addHandlers', addHandlers);
    defineNonEnumerable(legacyMapBindings, 'stopListeningArgumentsToKeys', stopListeningArgumentsToKeys);
    props.bind = props.addEventListener;
    props.unbind = props.removeEventListener;
    canReflect.assignMap(legacyMapBindings, props);
    canReflect.assignSymbols(legacyMapBindings, symbols);
    defineNonEnumerable(legacyMapBindings, 'start', function () {
        console.warn('use can-queues.batch.start()');
        queues.batch.start();
    });
    defineNonEnumerable(legacyMapBindings, 'stop', function () {
        console.warn('use can-queues.batch.stop()');
        queues.batch.stop();
    });
    defineNonEnumerable(legacyMapBindings, 'flush', function () {
        console.warn('use can-queues.flush()');
        queues.flush();
    });
    defineNonEnumerable(legacyMapBindings, 'afterPreviousEvents', function (handler) {
        console.warn('don\'t use afterPreviousEvents');
        queues.mutateQueue.enqueue(function afterPreviousEvents() {
            queues.mutateQueue.enqueue(handler);
        });
        queues.flush();
    });
    defineNonEnumerable(legacyMapBindings, 'after', function (handler) {
        console.warn('don\'t use after');
        queues.mutateQueue.enqueue(handler);
        queues.flush();
    });
    module.exports = legacyMapBindings;
});
/*can-observation-recorder@1.2.0#can-observation-recorder*/
define('can-observation-recorder', [
    'require',
    'exports',
    'module',
    'can-namespace',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    var canSymbol = require('can-symbol');
    var stack = [];
    var addParentSymbol = canSymbol.for('can.addParent');
    var ObservationRecorder = {
        stack: stack,
        start: function () {
            var deps = {
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                childDependencies: new Set(),
                traps: null,
                ignore: 0
            };
            stack.push(deps);
            return deps;
        },
        stop: function () {
            return stack.pop();
        },
        add: function (obj, event) {
            var top = stack[stack.length - 1];
            if (top && top.ignore === 0) {
                if (top.traps) {
                    top.traps.push([
                        obj,
                        event
                    ]);
                } else {
                    if (event === undefined) {
                        top.valueDependencies.add(obj);
                    } else {
                        var eventSet = top.keyDependencies.get(obj);
                        if (!eventSet) {
                            eventSet = new Set();
                            top.keyDependencies.set(obj, eventSet);
                        }
                        eventSet.add(event);
                    }
                }
            }
        },
        addMany: function (observes) {
            var top = stack[stack.length - 1];
            if (top) {
                if (top.traps) {
                    top.traps.push.apply(top.traps, observes);
                } else {
                    for (var i = 0, len = observes.length; i < len; i++) {
                        this.add(observes[i][0], observes[i][1]);
                    }
                }
            }
        },
        created: function (obs) {
            var top = stack[stack.length - 1];
            if (top) {
                top.childDependencies.add(obs);
                if (obs[addParentSymbol]) {
                    obs[addParentSymbol](top);
                }
            }
        },
        ignore: function (fn) {
            return function () {
                if (stack.length) {
                    var top = stack[stack.length - 1];
                    top.ignore++;
                    var res = fn.apply(this, arguments);
                    top.ignore--;
                    return res;
                } else {
                    return fn.apply(this, arguments);
                }
            };
        },
        isRecording: function () {
            var len = stack.length;
            var last = len && stack[len - 1];
            return last && last.ignore === 0 && last;
        },
        makeDependenciesRecord: function () {
            return {
                traps: null,
                keyDependencies: new Map(),
                valueDependencies: new Set(),
                ignore: 0
            };
        },
        makeDependenciesRecorder: function () {
            return ObservationRecorder.makeDependenciesRecord();
        },
        trap: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                var oldTraps = top.traps;
                var traps = top.traps = [];
                return function () {
                    top.traps = oldTraps;
                    return traps;
                };
            } else {
                return function () {
                    return [];
                };
            }
        },
        trapsCount: function () {
            if (stack.length) {
                var top = stack[stack.length - 1];
                return top.traps.length;
            } else {
                return 0;
            }
        }
    };
    if (namespace.ObservationRecorder) {
        throw new Error('You can\'t have two versions of can-observation-recorder, check your dependencies');
    } else {
        module.exports = namespace.ObservationRecorder = ObservationRecorder;
    }
});
/*can-simple-map@4.2.0#can-simple-map*/
define('can-simple-map', [
    'require',
    'exports',
    'module',
    'can-construct',
    'can-event-queue/map/map',
    'can-queues',
    'can-observation-recorder',
    'can-reflect',
    'can-log/dev/dev',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var Construct = require('can-construct');
    var eventQueue = require('can-event-queue/map/map');
    var queues = require('can-queues');
    var ObservationRecorder = require('can-observation-recorder');
    var canReflect = require('can-reflect');
    var dev = require('can-log/dev/dev');
    var canSymbol = require('can-symbol');
    var ensureMeta = function ensureMeta(obj) {
        var metaSymbol = canSymbol.for('can.meta');
        var meta = obj[metaSymbol];
        if (!meta) {
            meta = {};
            canReflect.setKeyValue(obj, metaSymbol, meta);
        }
        return meta;
    };
    var SimpleMap = Construct.extend('SimpleMap', {
        setup: function (initialData) {
            this._data = {};
            if (initialData && typeof initialData === 'object') {
                this.attr(initialData);
            }
        },
        attr: function (prop, value) {
            var self = this;
            if (arguments.length === 0) {
                ObservationRecorder.add(this, 'can.keys');
                var data = {};
                canReflect.eachKey(this._data, function (value, prop) {
                    ObservationRecorder.add(this, prop);
                    data[prop] = value;
                }, this);
                return data;
            } else if (arguments.length > 1) {
                var had = this._data.hasOwnProperty(prop);
                var old = this._data[prop];
                this._data[prop] = value;
                if (old !== value) {
                    var dispatched = {
                        keyChanged: !had ? prop : undefined,
                        type: prop
                    };
                    this.dispatch(dispatched, [
                        value,
                        old
                    ]);
                }
            } else if (typeof prop === 'object') {
                queues.batch.start();
                canReflect.eachKey(prop, function (value, key) {
                    self.attr(key, value);
                });
                queues.batch.stop();
            } else {
                if (prop !== 'constructor') {
                    ObservationRecorder.add(this, prop);
                    return this._data[prop];
                }
                return this.constructor;
            }
        },
        serialize: function () {
            return canReflect.serialize(this, Map);
        },
        get: function () {
            return this.attr.apply(this, arguments);
        },
        set: function () {
            return this.attr.apply(this, arguments);
        },
        log: function (key) {
        }
    });
    eventQueue(SimpleMap.prototype);
    var simpleMapProto = {
        'can.isMapLike': true,
        'can.isListLike': false,
        'can.isValueLike': false,
        'can.getKeyValue': SimpleMap.prototype.get,
        'can.setKeyValue': SimpleMap.prototype.set,
        'can.deleteKeyValue': function (prop) {
            var dispatched;
            if (this._data.hasOwnProperty(prop)) {
                var old = this._data[prop];
                delete this._data[prop];
                dispatched = {
                    keyChanged: prop,
                    type: prop
                };
                this.dispatch(dispatched, [
                    undefined,
                    old
                ]);
            }
        },
        'can.getOwnEnumerableKeys': function () {
            ObservationRecorder.add(this, 'can.keys');
            return Object.keys(this._data);
        },
        'can.assignDeep': function (source) {
            queues.batch.start();
            canReflect.assignMap(this, source);
            queues.batch.stop();
        },
        'can.updateDeep': function (source) {
            queues.batch.start();
            canReflect.updateMap(this, source);
            queues.batch.stop();
        },
        'can.keyHasDependencies': function (key) {
            return false;
        },
        'can.getKeyDependencies': function (key) {
            return undefined;
        }
    };
    canReflect.assignSymbols(SimpleMap.prototype, simpleMapProto);
    module.exports = SimpleMap;
});
/*can-view-model@4.0.1#can-view-model*/
define('can-view-model', [
    'require',
    'exports',
    'module',
    'can-simple-map',
    'can-namespace',
    'can-globals/document/document',
    'can-reflect',
    'can-symbol'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var SimpleMap = require('can-simple-map');
        var ns = require('can-namespace');
        var getDocument = require('can-globals/document/document');
        var canReflect = require('can-reflect');
        var canSymbol = require('can-symbol');
        var viewModelSymbol = canSymbol.for('can.viewModel');
        module.exports = ns.viewModel = function (el, attr, val) {
            if (typeof el === 'string') {
                el = getDocument().querySelector(el);
            } else if (canReflect.isListLike(el) && !el.nodeType) {
                el = el[0];
            }
            if (canReflect.isObservableLike(attr) && canReflect.isMapLike(attr)) {
                el[viewModelSymbol] = attr;
                return;
            }
            var scope = el[viewModelSymbol];
            if (!scope) {
                scope = new SimpleMap();
                el[viewModelSymbol] = scope;
            }
            switch (arguments.length) {
            case 0:
            case 1:
                return scope;
            case 2:
                return canReflect.getKeyValue(scope, attr);
            default:
                canReflect.setKeyValue(scope, attr, val);
                return el;
            }
        };
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-util@3.12.0#js/is-container/is-container*/
define('can-util/js/is-container/is-container', function (require, exports, module) {
    'use strict';
    module.exports = function (current) {
        return /^f|^o/.test(typeof current);
    };
});
/*can-util@3.12.0#js/get/get*/
define('can-util/js/get/get', [
    'require',
    'exports',
    'module',
    'can-util/js/is-container/is-container'
], function (require, exports, module) {
    'use strict';
    var isContainer = require('can-util/js/is-container/is-container');
    function get(obj, name) {
        var parts = typeof name !== 'undefined' ? (name + '').replace(/\[/g, '.').replace(/]/g, '').split('.') : [], length = parts.length, current, i, container;
        if (!length) {
            return obj;
        }
        current = obj;
        for (i = 0; i < length && isContainer(current) && current !== null; i++) {
            container = current;
            current = container[parts[i]];
        }
        return current;
    }
    module.exports = get;
});
/*can-util@3.12.0#js/is-array/is-array*/
define('can-util/js/is-array/is-array', [
    'require',
    'exports',
    'module',
    'can-log/dev/dev',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var dev = require('can-log/dev/dev');
    var namespace = require('can-namespace');
    var hasWarned = false;
    module.exports = namespace.isArray = function (arr) {
        return Array.isArray(arr);
    };
});
/*can-util@3.12.0#js/string/string*/
define('can-util/js/string/string', [
    'require',
    'exports',
    'module',
    'can-util/js/get/get',
    'can-util/js/is-container/is-container',
    'can-log/dev/dev',
    'can-util/js/is-array/is-array',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var get = require('can-util/js/get/get');
    var isContainer = require('can-util/js/is-container/is-container');
    var canDev = require('can-log/dev/dev');
    var isArray = require('can-util/js/is-array/is-array');
    var namespace = require('can-namespace');
    var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strReplacer = /\{([^\}]+)\}/g, strQuote = /"/g, strSingleQuote = /'/g, strHyphenMatch = /-+(.)?/g, strCamelMatch = /[a-z][A-Z]/g, convertBadValues = function (content) {
            var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
            return '' + (isInvalid ? '' : content);
        }, deleteAtPath = function (data, path) {
            var parts = path ? path.replace(/\[/g, '.').replace(/]/g, '').split('.') : [];
            var current = data;
            for (var i = 0; i < parts.length - 1; i++) {
                if (current) {
                    current = current[parts[i]];
                }
            }
            if (current) {
                delete current[parts[parts.length - 1]];
            }
        };
    var string = {
        esc: function (content) {
            return convertBadValues(content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, '&#39;');
        },
        getObject: function (name, roots) {
            roots = isArray(roots) ? roots : [roots || window];
            var result, l = roots.length;
            for (var i = 0; i < l; i++) {
                result = get(roots[i], name);
                if (result) {
                    return result;
                }
            }
        },
        capitalize: function (s, cache) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        camelize: function (str) {
            return convertBadValues(str).replace(strHyphenMatch, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        hyphenate: function (str) {
            return convertBadValues(str).replace(strCamelMatch, function (str, offset) {
                return str.charAt(0) + '-' + str.charAt(1).toLowerCase();
            });
        },
        underscore: function (s) {
            return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
        },
        sub: function (str, data, remove) {
            var obs = [];
            str = str || '';
            obs.push(str.replace(strReplacer, function (whole, inside) {
                var ob = get(data, inside);
                if (remove === true) {
                    deleteAtPath(data, inside);
                }
                if (ob === undefined || ob === null) {
                    obs = null;
                    return '';
                }
                if (isContainer(ob) && obs) {
                    obs.push(ob);
                    return '';
                }
                return '' + ob;
            }));
            return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
        },
        replaceWith: function (str, data, replacer, shouldRemoveMatchedPaths) {
            return str.replace(strReplacer, function (whole, path) {
                var value = get(data, path);
                if (shouldRemoveMatchedPaths) {
                    deleteAtPath(data, path);
                }
                return replacer(path, value);
            });
        },
        replacer: strReplacer,
        undHash: strUndHash
    };
    module.exports = namespace.string = string;
});
/*can-util@3.12.0#js/is-array-like/is-array-like*/
define('can-util/js/is-array-like/is-array-like', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    function isArrayLike(obj) {
        var type = typeof obj;
        if (type === 'string') {
            return true;
        } else if (type === 'number') {
            return false;
        }
        var length = obj && type !== 'boolean' && typeof obj !== 'number' && 'length' in obj && obj.length;
        return typeof obj !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    }
    module.exports = namespace.isArrayLike = isArrayLike;
});
/*can-util@3.12.0#js/is-iterable/is-iterable*/
define('can-util/js/is-iterable/is-iterable', [
    'require',
    'exports',
    'module',
    'can-symbol'
], function (require, exports, module) {
    'use strict';
    var canSymbol = require('can-symbol');
    module.exports = function (obj) {
        return obj && !!obj[canSymbol.iterator || canSymbol.for('iterator')];
    };
});
/*can-util@3.12.0#js/each/each*/
define('can-util/js/each/each', [
    'require',
    'exports',
    'module',
    'can-util/js/is-array-like/is-array-like',
    'can-util/js/is-iterable/is-iterable',
    'can-symbol',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var isArrayLike = require('can-util/js/is-array-like/is-array-like');
    var has = Object.prototype.hasOwnProperty;
    var isIterable = require('can-util/js/is-iterable/is-iterable');
    var canSymbol = require('can-symbol');
    var namespace = require('can-namespace');
    function each(elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (isArrayLike(elements)) {
                for (len = elements.length; i < len; i++) {
                    item = elements[i];
                    if (callback.call(context || item, item, i, elements) === false) {
                        break;
                    }
                }
            } else if (isIterable(elements)) {
                var iter = elements[canSymbol.iterator || canSymbol.for('iterator')]();
                var res, value;
                while (!(res = iter.next()).done) {
                    value = res.value;
                    callback.call(context || elements, Array.isArray(value) ? value[1] : value, value[0]);
                }
            } else if (typeof elements === 'object') {
                for (key in elements) {
                    if (has.call(elements, key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                        break;
                    }
                }
            }
        }
        return elements;
    }
    module.exports = namespace.each = each;
});
/*can-util@3.12.0#js/is-function/is-function*/
define('can-util/js/is-function/is-function', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    var isFunction = function () {
        if (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') {
            return function (value) {
                return Object.prototype.toString.call(value) === '[object Function]';
            };
        }
        return function (value) {
            return typeof value === 'function';
        };
    }();
    module.exports = namespace.isFunction = isFunction;
});
/*can-util@3.12.0#js/import/import*/
define('can-util/js/import/import', [
    'require',
    'exports',
    'module',
    'can-util/js/is-function/is-function',
    'can-globals/global/global',
    'can-namespace'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var isFunction = require('can-util/js/is-function/is-function');
        var global = require('can-globals/global/global')();
        var namespace = require('can-namespace');
        module.exports = namespace.import = function (moduleName, parentName) {
            return new Promise(function (resolve, reject) {
                try {
                    if (typeof global.System === 'object' && isFunction(global.System['import'])) {
                        global.System['import'](moduleName, { name: parentName }).then(resolve, reject);
                    } else if (global.define && global.define.amd) {
                        global.require([moduleName], function (value) {
                            resolve(value);
                        });
                    } else if (global.require) {
                        resolve(global.require(moduleName));
                    } else {
                        if (typeof stealRequire !== 'undefined') {
                            steal.import(moduleName, { name: parentName }).then(resolve, reject);
                        } else {
                            resolve();
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-util@3.12.0#js/is-plain-object/is-plain-object*/
define('can-util/js/is-plain-object/is-plain-object', [
    'require',
    'exports',
    'module',
    'can-namespace'
], function (require, exports, module) {
    'use strict';
    var namespace = require('can-namespace');
    var core_hasOwn = Object.prototype.hasOwnProperty;
    function isWindow(obj) {
        return obj !== null && obj == obj.window;
    }
    function isPlainObject(obj) {
        if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj) || obj.constructor && obj.constructor.shortName) {
            return false;
        }
        try {
            if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || core_hasOwn.call(obj, key);
    }
    module.exports = namespace.isPlainObject = isPlainObject;
});
/*can-util@3.12.0#dom/events/events*/
define('can-util/dom/events/events', [
    'require',
    'exports',
    'module',
    'can-globals/document/document',
    'can-globals/is-browser-window/is-browser-window',
    'can-util/js/is-plain-object/is-plain-object',
    'can-log/dev/dev',
    'can-namespace'
], function (require, exports, module) {
    (function (global, require, exports, module) {
        'use strict';
        var getDocument = require('can-globals/document/document');
        var isBrowserWindow = require('can-globals/is-browser-window/is-browser-window');
        var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
        var fixSyntheticEventsOnDisabled = false;
        var dev = require('can-log/dev/dev');
        var namespace = require('can-namespace');
        function isDispatchingOnDisabled(element, ev) {
            var isInsertedOrRemoved = isPlainObject(ev) ? ev.type === 'inserted' || ev.type === 'removed' : ev === 'inserted' || ev === 'removed';
            var isDisabled = !!element.disabled;
            return isInsertedOrRemoved && isDisabled;
        }
        module.exports = namespace.events = {
            addEventListener: function () {
                this.addEventListener.apply(this, arguments);
            },
            removeEventListener: function () {
                this.removeEventListener.apply(this, arguments);
            },
            canAddEventListener: function () {
                return this.nodeName && (this.nodeType === 1 || this.nodeType === 9) || this === window;
            },
            dispatch: function (event, args, bubbles) {
                var ret;
                var dispatchingOnDisabled = fixSyntheticEventsOnDisabled && isDispatchingOnDisabled(this, event);
                var doc = this.ownerDocument || getDocument();
                var ev = doc.createEvent('HTMLEvents');
                var isString = typeof event === 'string';
                ev.initEvent(isString ? event : event.type, bubbles === undefined ? true : bubbles, false);
                if (!isString) {
                    for (var prop in event) {
                        if (ev[prop] === undefined) {
                            ev[prop] = event[prop];
                        }
                    }
                }
                if (this.disabled === true && ev.type !== 'fix_synthetic_events_on_disabled_test') {
                }
                ev.args = args;
                if (dispatchingOnDisabled) {
                    this.disabled = false;
                }
                ret = this.dispatchEvent(ev);
                if (dispatchingOnDisabled) {
                    this.disabled = true;
                }
                return ret;
            }
        };
        (function () {
            if (!isBrowserWindow()) {
                return;
            }
            var testEventName = 'fix_synthetic_events_on_disabled_test';
            var input = document.createElement('input');
            input.disabled = true;
            var timer = setTimeout(function () {
                fixSyntheticEventsOnDisabled = true;
            }, 50);
            var onTest = function onTest() {
                clearTimeout(timer);
                module.exports.removeEventListener.call(input, testEventName, onTest);
            };
            module.exports.addEventListener.call(input, testEventName, onTest);
            try {
                module.exports.dispatch.call(input, testEventName, [], false);
            } catch (e) {
                onTest();
                fixSyntheticEventsOnDisabled = true;
            }
        }());
    }(function () {
        return this;
    }(), require, exports, module));
});
/*can-view-autorender@4.1.0#can-view-autorender*/
define('can-view-autorender', [
    'require',
    'exports',
    'module',
    'can-view-model',
    'can-util/js/string/string',
    'can-util/js/each/each',
    'can-util/js/import/import',
    'can-namespace',
    'can-util/dom/events/events'
], function (require, exports, module) {
    'use strict';
    var canViewModel = require('can-view-model');
    var camelize = require('can-util/js/string/string').camelize;
    var each = require('can-util/js/each/each');
    var importer = require('can-util/js/import/import');
    var namespace = require('can-namespace');
    var domEvents = require('can-util/dom/events/events');
    var ignoreAttributesRegExp = /^(dataViewId|class|id|type|src)$/i;
    var typeMatch = /\s*text\/(stache)\s*/;
    function isIn(element, type) {
        while (element.parentNode) {
            element = element.parentNode;
            if (element.nodeName.toLowerCase() === type.toLowerCase()) {
                return true;
            }
        }
    }
    function setAttr(el, attr, scope) {
        var camelized = camelize(attr);
        if (!ignoreAttributesRegExp.test(camelized)) {
            var value = el.getAttribute(attr);
            if (scope.attr) {
                scope.attr(camelized, value);
            } else if (scope.set) {
                scope.set(camelized, value);
            } else {
                scope[camelized] = value;
            }
        }
    }
    function insertAfter(ref, element) {
        if (ref.nextSibling) {
            ref.parentNode.insertBefore(element, ref.nextSibling);
        } else {
            ref.parentNode.appendChild(element);
        }
    }
    function render(renderer, scope, el) {
        var frag = renderer(scope);
        if (isIn(el, 'head')) {
            document.body.appendChild(frag);
        } else if (el.nodeName.toLowerCase() === 'script') {
            insertAfter(el, frag);
        } else {
            insertAfter(el, frag);
            el.parentNode.removeChild(el);
        }
    }
    function setupScope(el) {
        var scope = canViewModel(el);
        each(el.attributes || [], function (attr) {
            setAttr(el, attr.name, scope);
        });
        domEvents.addEventListener.call(el, 'attributes', function (ev) {
            setAttr(el, ev.attributeName, scope);
        });
        return scope;
    }
    var promise = new Promise(function (resolve, reject) {
        function autoload() {
            var promises = [];
            each(document.querySelectorAll('[can-autorender]'), function (el, i) {
                el.style.display = 'none';
                var text = el.innerHTML || el.text, typeAttr = el.getAttribute('type'), typeInfo = typeAttr.match(typeMatch), type = typeInfo && typeInfo[1], typeModule = 'can-' + type;
                promises.push(importer(typeModule).then(function (engine) {
                    if (engine.async) {
                        return engine.async(text).then(function (renderer) {
                            render(renderer, setupScope(el), el);
                        });
                    } else {
                        var renderer = engine(text);
                        render(renderer, setupScope(el), el);
                    }
                }));
            });
            Promise.all(promises).then(resolve, reject);
        }
        if (document.readyState === 'complete') {
            autoload();
        } else {
            domEvents.addEventListener.call(window, 'load', autoload);
        }
    });
    module.exports = namespace.autorender = function autorender(success, error) {
        return promise.then(success, error);
    };
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") ? global : window);