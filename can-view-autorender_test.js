var QUnit = require('steal-qunit');
require('can/test/test');

var makeIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		delete window.isReady;
		delete window.hasError;
		document.body.removeChild(iframe);
		start();
	};
	window.hasError = function(error) {
		ok(false, error.message);
		window.removeMyself();
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

var makeBasicTestIframe = function(src){
	var iframe = document.createElement('iframe');
	window.removeMyself = function(){
		delete window.removeMyself;
		delete window.isReady;
		delete window.hasError;
		document.body.removeChild(iframe);
		start();
	};
	window.hasError = function(error) {
		ok(false, error.message);
		window.removeMyself();
	};
	window.isReady = function(el, scope) {
		equal(el.length, 1,"only one my-component");
		equal(el.html(), "Hello World","template rendered");
		equal(el[0].className, "inserted","template rendered");

		equal(scope.attr("message"), "Hello World", "Scope correctly setup");
		window.removeMyself();
	};
	document.body.appendChild(iframe);
	iframe.src = src;
};

QUnit.module("can-view-autorender");

QUnit.asyncTest("the basics are able to work for steal", function(){
	makeBasicTestIframe("test/basics.html?" + Math.random());
});

QUnit.asyncTest("autoload loads a jquery viewmodel fn", function(){
	makeIframe("tests/steal-viewmodel.html?" + Math.random());
});
