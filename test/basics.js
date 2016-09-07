var Component = require('can-component');
var stache = require('can-stache');
var SimpleMap = require("can-simple-map");

module.exports = Component.extend({
	tag: "my-component",
	// call can.stache b/c it should be imported auto-magically
	template: stache("{{message}}"),
	scope: function(){
		return new SimpleMap({
			message: "Hello World"
		});
	}
});
