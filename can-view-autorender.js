var canViewModel = require('can-view-model');
var camelize = require('can-util/js/string/string').camelize;
var each = require('can-util/js/each/each');

var deferred = new can.Deferred(),
	ignoreAttributesRegExp = /^(dataViewId|class|id|type|src)$/i;

var typeMatch = /\s*text\/(stache)\s*/;
function isIn(element, type) {
	while(element.parentNode) {
		element = element.parentNode;
		if(element.nodeName.toLowerCase() === type.toLowerCase()) {
			return true;
		}
	}
}
function setAttr(el, attr, scope){
	var camelized = camelize(attr);
	if (!ignoreAttributesRegExp.test(camelized) ) {
		scope.attr(camelized, el.getAttribute(attr));
	}
}
function insertAfter(ref, element) {
	if(ref.nextSibling){
		ref.parentNode.insertBefore(element, ref.nextSibling);
	} else {
		ref.parentNode.appendChild(element);
	}
}

function render(renderer, scope, el) {
	var frag = renderer(scope);
	if( isIn(el,"head") ) {
		document.body.appendChild(frag);
	} else if(el.nodeName.toLowerCase() === "script") {
		insertAfter(el, frag);
	} else {
		insertAfter(el, frag);
		el.parentNode.removeChild(el);
	}
}
function setupScope(el) {
	var scope = canViewModel(el);

	can.each(el.attributes || [], function(attr) {
		setAttr(el, attr.name, scope);
	});

	can.bind.call(el, "attributes", function (ev) {
		setAttr(el, ev.attributeName, scope);
	});

	return scope;
}

function autoload(){
	var promises = [];

	each( document.querySelectorAll("[can-autorender]"), function( el, i){
		el.style.display = "none";

		var text = el.innerHTML || el.text,
			typeAttr = el.getAttribute("type"),
			typeInfo = typeAttr.match( typeMatch ),
			type = typeInfo && typeInfo[1],
			typeModule = "can/view/" + type;

		if(window.System || !(window.define && window.define.amd)) {
			typeModule += "/" + type;
		}

		promises.push( can["import"](typeModule).then(function(engine){

			engine = can[type] || engine;
			if(engine.async) {
				return engine.async(text).then(function(renderer){
					render(renderer, setupScope(el), el);
				});
			} else {
				var renderer = engine(text);
				render(renderer, setupScope(el), el);
			}

		}) );

	});

	can.when.apply(can, promises).then(
		can.proxy(deferred.resolve, deferred),
		can.proxy(deferred.reject, deferred)
	);
}

if (document.readyState === 'complete') {
	autoload();
} else {
	can.bind.call(window, 'load', autoload);
}

var promise = deferred.promise();

module.exports = function autorender(success, error){
	return promise.then(success, error);
};
