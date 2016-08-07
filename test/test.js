/*jshint expr: true*/

'use strict';

const chai = require('chai');
const expect = chai.expect;
const RollupTransform = require('../');

var transform = new RollupTransform({ test: true });

describe('transform', function() {

	it ('should return true when filename is .npm.js', () => {
		expect(transform.canTransform('my.rollup.js')).to.be.true;
	});

	it ('should return false when filename is .js', () => {
		expect(transform.canTransform('my.js')).to.be.false;
	});

	it ('should compile package', () => {
		return transform.compile(__dirname + '/nop.rollup.js', new Buffer('import * as mod from \'./mod\';')).then(result => {
			expect(result).to.be.an('object');
			expect(result.data).to.be.instanceOf(Buffer);
			expect(result.data.toString()).to.equal('import \'nop\';');
		});
	});

});
