/*can-view-autorender@3.0.0-pre.1#can-view-autorender*/
define(function (require, exports, module) {
    var canViewModel = require('can-view-model');
    var camelize = require('can-util/js/string').camelize;
    var each = require('can-util/js/each');
    var importer = require('can-util/js/import');
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