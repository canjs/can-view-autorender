# can-view-autorender

[![Build Status](https://travis-ci.org/canjs/can-view-autorender.png?branch=master)](https://travis-ci.org/canjs/can-view-autorender)

Automatically render templates found in the document

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-view-autorender';
```

### CommonJS use

Use `require` to load `can-view-autorender` and everything else
needed to create a template that uses `can-view-autorender`:

```js
var plugin = require("can-view-autorender");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-view-autorender` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-view-autorender',
		    	location: 'node_modules/can-view-autorender/dist/amd',
		    	main: 'lib/can-view-autorender'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-view-autorender/dist/global/can-view-autorender.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
