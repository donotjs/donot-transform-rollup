'use strict';

const path = require('path');
const fs = require('fs');

const rollup = require('rollup');
const hypothetical = require('rollup-plugin-hypothetical');
const async = require('async');

const Transform = require('@donotjs/donot-transform');

class RollupTransform extends Transform {

	constructor(options) {
		super();

		options = options || {};

		this.node_modules = options.test ? __dirname + '/node_modules' : path.resolve(__dirname + '/', '../../');

	}

	canTransform(filename) {
		return /\.rollup\.js/i.test(filename);
	}

	map(filename) {
		return filename.replace(/\.rollup\.js/i, '.js');
	}

	compile(filename, data, map) {
		return new Promise((resolved, rejected) => {

			var files = [];
			files[filename] = data.toString();

			rollup.rollup({
				entry: filename,
				plugins: [
					{
						resolveId: (importee, importer) => {
							if (importee !== filename && importee.split('/').length > 1) {
								return new Promise((resolved, rejected) => {
									const file = path.resolve(path.dirname(importer), importee);
									async.reduce([
										file + '/index.js',
										file + '.js',
										file
									],
									[],
									(paths, path, callback) => {
										fs.stat(path, (err, stats) => {
											if (!err && stats && stats.isFile()) paths.push(path);
											callback(null, paths);
										});
									}, (err, paths) => {
										if (err) return rejected(err);
										if (paths[0]) {
											files = files.concat(paths[0]);
										}
										resolved(paths[0]);
									});
								});
							}
						}
					},
					hypothetical({
						files: files,
						allowRealFiles: true
					})
				],
				onwarn: (str) => {}
			}).then(bundle => {
				var result = bundle.generate({
					sourceMap: true
				});
				resolved({
					data: new Buffer(result.code),
					map: result.map,
					files: files.concat(filename)
				});
			}).catch(rejected);

		});
	}

}

module.exports = exports = RollupTransform;
