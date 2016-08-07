donot-transform-rollup
==========================

[![Build Status](https://travis-ci.org/donotjs/donot-transform-rollup.svg?branch=master)](https://travis-ci.org/donotjs/donot-transform-rollup)

[rollup](http://npmjs.org/packages/rollup) for [donot](http://github.com/donotjs/donot).

# Usage

Using the rollup donot transform plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    RollupTransform = require('donot-transform-rollup');

	var server = http.createServer(donot(__dirname + '/public', {
		transforms: [ new RollupTransform({
			// Options
		}) ]
	}));

	server.listen(8000);

Now `.js` files in the `/public` folder will automatically be compiled, rendered and served as rollup compiled versions with the `.rollup.js` extension.

# License

MIT
