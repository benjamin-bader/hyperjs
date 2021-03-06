hyper.js
========

HyperCard rekindled - in Javascript!


A great debt is owed to Rebecca Bettencourt and her OpenXION project, from which
much inspiration and implementation guidance was drawn - particularly in the lexer
and parser.

http://www.openxion.org

Build Instructions
==============================

Hyper.js is built using good old make and uses the Google Closure compiler for extra awesomeness.
Tests are run using Jasmine, currently via the jasmine-headless-webkit runner; consequently,
hacking requires Ruby (2.0.0 or greater).
RVM is helpful, though not required; hyper.js provides its own .rvmrc and named gemset.

```
brew install closure-compiler
make all
```

For testing:
```
brew install qt
cd to project directory (answer 'y' to trust the .rvmrc file)
bundle install
make test
```

Notes
==============================

DEPS:
	* jasmine for unit tests
	* jasmine-headless-webkit for executing same
    * ruby (2.0.0 and greater)

TODO:
* Investigate CI solutions.  Will TravisCI work with JS-exclusive projects?  Run Jasmine specs?  Other tests?
  What other hosted CI options are there?  Is it worth it to set up Jenkins on the VPS?
  	* With a nodejs-based build system, looks like Jenkins on a VPS is it.
  	* But can we build via the Rails asset pipeline?  'Twould be nice to avoid a ruby dependency, I guess,
  	  but the final importance of the build system will be to ensure the consistency and quality of the product
  	  by GTFO of the way.  Maybe Rails is less intrusive than jake - investigate!

* Decide on a runtime strategy - top-down interpreter, lexer/parser interpreter, bytecode interpreter?
	* The last might allow for nifty optimizations like JIT, but that's a little absurd in Javascript.
* Apportion HT intrinsics - how many are covered by existing JS features e.g. Math?
* Investigate UI approaches:
	* Need to source all relevant HT events - can Canvas do that on its own?
	* Ideally would have widgets built-in to determine what was clicked.  Don't really want to write
	  R* tree in JS - there's more than enough work as is!

* Understand HyperCard's message hierarchy.
* Evaluate strategies for generating system messages - setTimeout() for idle?  If so, what frequency?
* Message passing needs to be _fast_ - it happens all the time.  Premature optimization, etc, but it
  looks like it will be the hot path.
* Learn the extent to which "intrinsics" are implemented in Home stack scripts
	* Do we need to follow the Home stack model?
	* If not, we can make v1 single-stacked - enabling multiple stacks can come later.

* Spec the tokenizer/lexer
	* Spec a reader-type mechanism
* Implement the lexer
	* Including the script reader
* Spec the god-damned parser
	* Implement the god-damned parser

* Think about the built-in windows - Message Box, Variable Watcher, and the super-important
  Script Window.  Light Table is using a nearly drop-in JS library for code highlighting.
  What was it again?  Can we use it with HT for colorization/indentation?

* More thoughts on interpreter strategies:
	* Line-at-a-time?  HyperCard did the whole thing, but we're not trying for 100% fidelity.

---------
Runtime ideas:
	VM
		Bytecode interpreter to start with
		stack-based (how appropriate)
		variables resolved to numeric index at compile-time
		standard push-pop-dup instructions
		arithmetic instructions 'do the right thing' - don't encode numeric types into the bytecode
			* push 1.0 pushes a float, push "1.0" pushes a string, etc.
		maintain hierarchy tables on the side
		can we keep all cards in arrays indexed by ID?  Ditto for backgrounds, fields, buttons?  Would be great for lookup speeds.
		is Javascript even "fast enough" (in browsers) to make runtime interpretation feasible?

	Precompiled - extend Closure compiler to translate HyperTalk to JS
		Need to preserve the dynamism of message passing


Lexer:
	Produces a stream of HT tokens.  What are they?
		ID of string * pos
		STRING of string * pos
		NUMBER of Number * pos
		SYMBOL of string * pos
		COMMENT of string * pos
		WHITESPACE of string * pos
		LINE_TERM of string * pos

		... more?

Parser:
	Consumes HT tokens and produces statements
	Statements contain expressions - no top-level exprs?

AST:

Script := [HsDecl]

HsDecl := Handler | Function

Function := 'function' Identifier ParamList [Statement] 'end'
Handler := 'on' Identifier ParamList [Statement] 'end'

ParamList := '(' [Identifier] ')'

Statement := Command | Expression

Expression :=
  | ChunkExpression
  | BinaryExpression
  | ConstantExpression
  | ...

ConstantExpression :=
  | '"' (any text) '"'
  | (any number)
