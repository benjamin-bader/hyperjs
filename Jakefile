var fs = require('fs');

var packOrder = [
	'src/common.js',
	'src/script/tokens.js',
	'src/script/reader.js',
	'src/script/lexer.js'
];

var testFiles = [
	'spec/script/tokens_spec.js',
	'spec/script/reader_spec.js',
	'spec/script/lexer_spec.js'
];

/**
 * Wraps code compilation.  If you want to switch to another compiler e.g.
 * Uglify.js do it here.
 *
 * @constructor
 * @param {number} optimization A number from 0 to 2, inclusive, specifying the optimization level to use.  Higher is more.
 * @param {string} target The name of the compiled output file.
 * @param {Array<string>} sources The ordered list of source files to compile.
 */
function Compiler(optimization, target, sources) {
	this.DEFAULT_TARGET = "./bin/hyper.js";
	this.DEFAULT_OPTIMIZATION_LEVEL = 1;

	function optimizationName(opt) {
		switch (opt.toString()) {
			case "0": return "WHITESPACE_ONLY";
			case "1": return "SIMPLE_OPTIMIZATIONS";
			case "2": return "ADVANCED_OPTIMIZATIONS";
			default:
				fail("Invalid optimization level.  Valid levels are 0, 1, and 2.");
		}
	};

	this.getTargetFlag = function() {
		return "--js_output_file " + (target || this.DEFAULT_TARGET).toString();
	};

	this.getOptimizationFlag = function() {
		var opt = optimization;

		if (typeof opt == 'undefined') {
			opt = this.DEFAULT_OPTIMIZATION_LEVEL;
		}

		return "--compilation_level=" + optimizationName(opt);
	};

	this.getExternsLine = function() {
		return "--extern src/closure_externs.js";
	};

	this.getJsFileFlags = function() {
		return sources
			.map(function(file) { return "--js " + file; })
			.reduce(function(f1, f2) { return f1 + " " + f2; });
	};

	this.getCommandLine = function() {
		var sourceLine = this.getJsFileFlags();
		var optLine    = this.getOptimizationFlag();
		var outputFlag = this.getTargetFlag();
		var externLine = this.getExternsLine();

		return ["closure-compiler", externLine, sourceLine, optLine, outputFlag].join(" ");
	};

	this.invoke = function() {
		try {
			var commandLine = this.getCommandLine();
			console.log("Invoking Closure with command line: " + commandLine)
			jake.exec(commandLine);
		}
		catch (e) {
			console.log(e.message);
		}
	};
};

/**
 * Wraps Jasmine test execution.
 */
function Jasmine(sourceFiles, testFiles) {
	this.catTestFile = function() {
		jake.exec("rm -rf test", null, {breakOnError: false});
		jake.exec("mkdir test", null, {breakOnError: false});
		jake.exec("touch test/case.js");

		for (var i in sourceFiles) {
			jake.exec("cat " + sourceFiles[i] + " >> test/case.js");
		}

		for (var i in testFiles) {
			jake.exec("cat " + testFiles[i] + " >> test/case.js");
		}
	};

	this.getCommandLine = function() {
		return "jasmine-headless-webkit test/case.js"; 
	};

	this.invoke = function() {
		this.catTestFile();
		jake.exec(this.getCommandLine(), function() {}, {printStdout: true, breakOnError: false});
		//jake.exec("rm -rf test", null, {breakOnError: false});
	};
};

function NotImplementedError() {

};

NotImplementedError.prototype = new Error("Not yet implemented!  Yell at the developer.");

namespace('hs', function() {
	desc('Generates Closure export files.');
	task('exports', [], function() {
		throw new NotImplementedError();
	});

	// Build the damn thing
	desc('Compiles HyperJS.');
	task('build', [], function() {
		var compiler = new Compiler(process.env.opt, process.env.target, packOrder);

		compiler.invoke();
	});

	desc('Compiles HyperJS and runs unit tests.')
	task('test', [], function() {
		var jasmine = new Jasmine(packOrder, testFiles);
		jasmine.invoke();
	});

	task('compile', ['test'], function() {
		throw new NotImplementedError();
	});
});