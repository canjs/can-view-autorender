var Component = require('can-component');
var stache = require('can-stache');

module.exports = Component.extend({
	tag: "my-component",
	// call can.stache b/c it should be imported auto-magically
	template: stache("{{message}}"),
	scope: {
		message: "Hello World"
	}
});
