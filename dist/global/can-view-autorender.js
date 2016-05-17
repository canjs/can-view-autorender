/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-view-autorender@3.0.0-pre.1#can-view-autorender*/
define('can-view-autorender', function (require, exports, module) {
    var canViewModel = require('can-view-model');
    var camelize = require('can-util/js/string/string').camelize;
    var each = require('can-util/js/each/each');
    var importer = require('can-util/js/import/import');
    var events = require('can-event');
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
            scope.attr(camelized, el.getAttribute(attr));
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
        events.on.call(el, 'attributes', function (ev) {
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
                console.log(typeModule);
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
            events.on.call(window, 'load', autoload);
        }
    });
    module.exports = function autorender(success, error) {
        return promise.then(success, error);
    };
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();