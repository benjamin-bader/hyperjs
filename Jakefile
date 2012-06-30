var fs = require('fs');

function NotImplementedError() {

};

NotImplementedError.prototype = Error;

var packOrder = [
	'src/tokens.js',
	'src/reader.js',
	'src/lexer.js'
];


task('deps', [], function() {
	throw new NotImplementedError();
});

namespace('hs', function() {
	JS_PATTERN = /.*\.js/;

	namespace('deps', function() {
		task('order', [], function() {
			var sourceFiles = jake.readdirR('src');
			var testFiles   = jake.readdirR('spec');


		});
	});

	// Build the damn thing
	desc('Compiles HyperJS using Google Closure.');
	task('build', [], function() {
		var optimizationFlag = (function(n) {
			switch (n) {
				case 0: return '--compilation_level=WHITESPACE_ONLY';
				case 1: return '--compilation_level=SIMPLE_OPTIMIZATIONS';
				case 2: return '--compilation_level=ADVANCED_OPTIMIZATIONS';
				default:
					fail("Invalid optimization level.  Valid levels are 0, 1, and 2.");
					break;
			}
		})(process.env.ol || 1);

		var outputFlag;

		if (process.env.o) {
			outputFlag = process.env.o;
		} else {
			outputFlag = './bin/hyper.js';
		}

		outputFlag = '--js_output_file ' + outputFlag;

		var input = packOrder
						.map(function(filename) { return '--js ' + filename; })
						.reduce(function(d1, d2) { return d1 + ' ' + d2; });

		jake.exec('java -jar ext/compiler.jar ' + input + ' ' + optimizationFlag + ' ' + outputFlag);
	});

	task('dep-order')
	task('pack', [], function() {
		var outfile = fs.createFileSync()

		for (var filename in packOrder) {
			// TODO: HTF should this work?
			sys.shell('cat ' + filename + ' >> ' + outfile);
		}

		throw new NotImplementedError();
	});

	task('test', ['pack'], function() {
		throw new NotImplementedError();
	});

	task('compile', ['test'], function() {
		throw new NotImplementedError();
	});
});