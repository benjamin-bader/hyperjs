;

var isCommonJs = typeof window === "undefined";
var toplevel = isCommonJs ? exports : window;

if (typeof toplevel.hjs === "undefined") {
	toplevel.hjs = {};
}

(function(hjs) {
	var DIGIT_PATTERN = /\d/;
	var HEX_DIGIT_PATTERN = /[0-9a-fA-F]/;
	var LETTER_PATTERN = /[a-zA-Z]/i;
	var LINE_TERM_PATTERN = /[\n\r\u2028\u2029]/;
	var WHITESPACE_PATTERN = /\s|\r|\n/;
	var NULL_CHAR = String.fromCharCode(0);

	var escapes = {
		'n': '\n',
		't': '\t',
		'r': '\r',
		'\\': '\\'
	};

	function isNumberStart(c) {
		return c == "." || DIGIT_PATTERN.test(c);
	};

	function isNumberPart(c) {
		return c == "'" || isNumberStart(c);
	};

	function isIdStart(c) {
		return LETTER_PATTERN.test(c)
			|| c == "'";
	};

	function isIdPart(c) {
		return c == "."
			|| c == "'"
			|| isIdStart(c)
			|| DIGIT_PATTERN.test(c);
	};

	function isLineTerm(c) {
		return c == NULL_CHAR
			|| LINE_TERM_PATTERN.test(c);
	};

	function isWhitespace(c) {
		return WHITESPACE_PATTERN.test(c);
	};

	function Lexer(source) {
		this.source    = source;
		this.pos       = 0;
		this.reader    = new hjs.StringReader(source);
		this.buffer    = [];
		this.lastToken = null;
	};

	Lexer.prototype.__makeToken__ = function(type, token) {
		return new hjs.Token(
						type,
						token,
						this.source,
						this.reader.markedLine(),
						this.reader.markedColumn(),
						this.reader.line(),
						this.reader.column());
	};

	Lexer.prototype.__readLineTerm__ = function(firstChar) {
		if (firstChar == "") {
			return this.__makeToken__(hjs.Token.LINE_TERM, "");
		}

		var numChars = 1;

		while (LINE_TERM_PATTERN.test(this.reader.readNextChar())) {
			++numChars;
		}

		this.reader.reset();

		return this.__makeToken__(hjs.Token.LINE_TERM, this.reader.read(numChars));
	};

	Lexer.prototype.__readNumber__ = function(firstChar) {

	};

	Lexer.prototype.__readHexLiteral__ = function(prefix) {
		var numChars = prefix.length;

		while (HEX_DIGIT_PATTERN.test(this.reader.readNextChar())) {
			++numChars;
		}

		this.reader.reset();

		var tok = this.reader.read(numChars);

		return this.__makeToken__(hjs.Token.NUMBER, tok);
	};

	Lexer.prototype.__readString__ = function(firstChar) {
		var tok = '"';

		while (true) {
			var nextChar = this.reader.readNextChar();
			
			if (isLineTerm(nextChar))
				break;

			if (nextChar == '"') {
				tok.push(nextChar);
				break;
			}

			if (nextChar == '\\') {
				nextChar = this.reader.readNextChar();

				if (isLineTerm(nextChar))
					break;
				
				var unescaped = escapes[nextChar];

				if (typeof unescaped !== 'undefined') {
					tok.push(unescaped);
				}
			} else {
				tok.push(nextChar);
			}
		}

		return this.__makeToken__(hjs.Token.STRING, tok);
	};

	Lexer.prototype.__readId__ = function(firstChar) {

	};

	Lexer.prototype.__readSingleCharComment__ = function(firstChar) {

	};

	Lexer.prototype.__readDoubleCharComment__ = function(firstChar) {

	};

	Lexer.prototype.__readBoundedComment__ = function(firstChar) {

	};

	Lexer.prototype.__readLineContinuation__ = function(firstChar) {

	};

	// The workhorse.  Who needs flex, anyways?
	// My sincere thanks to Rebecca Bettencourt for doing
	// the hard stuff.
	Lexer.prototype.__nextToken__ = function() {
		this.reader.mark();

		var firstChar = this.reader.readNextChar();
		var numChars  = 1;

		if (isLineTerm(firstChar)) {
			if (firstChar == "") {
				return this.__makeToken__(hjs.Token.LINE_TERM, "");
			} else {
				var nextChar = firstChar;
				var tok = nextChar;
				
				while (nextChar != "" && isLineTerm(nextChar = this.reader.readNextChar())) {
					numChars++;
					tok += nextChar;
				}

				return this.__makeToken__(hjs.Token.LINE_TERM, tok);
			}
		}

		// String literal
		else if (firstChar == "\"") {
			return this.__readString__(firstChar);
		}

		// Numeric literal
		else if (isNumberStart(firstChar)) {
			var nextChar;

			// Maybe a hex literal?
			if (firstChar == '0') {
				var nextChar = this.reader.readNextChar();

				if (nextChar == 'x') {
					return this.__readHexLiteral("0x");
				}
			}

			while (isNumberPart(this.reader.readNextChar())) {
				++numChars;
			}

			this.reader.reset();

			var tok = "";
			for (var i = 0; i < numChars; ++i) {
				tok.push(this.reader.readNextChar());
			}

			return this.__makeToken__(hjs.Token.NUMBER, tok);
		}

		// Identifier
		else if (isIdStart(firstChar)) {
			while (isIdPart(this.reader.readNextChar())) {
				++numChars;
			}

			this.reader.reset();

			var tok = "";
			for (var i = 0; i < numChars; ++i) {
				tok.push(this.reader.readNextChar());
			}

			return this.__makeToken__(hjs.Token.ID, tok);
		}

		// Comment
		else if (firstChar == "#" || firstChar == "\u2014" || firstChar == "\u2015") {
			while (!isLineTerm(this.reader.readNextChar())) ++numChars;
			var tok = "";
			this.reader.reset();
			for (var i = 0; i < numChars; ++i) {
				tok.push(this.reader.readNextChar());
			}

			return this.__makeToken__(hjs.Token.COMMENT, tok);
		}

		// Two-character comment initiator
		else if (firstChar == "-" || firstChar == "/") {
			var secondChar = this.reader.readNextChar();
			++numChars;

			if (firstChar == secondChar) {
				while (!isLineTerm(this.reader.readNextChar())) ++numChars;
				var tok = "";
				this.reader.reset();
				for (var i = 0; i < numChars; ++i) {
					tok.push(this.reader.readNextChar());
				}

				return this.__makeToken__(hjs.Token.COMMENT, tok);
			} else {
				this.reader.reset();
				this.reader.readNextChar();
				return this.__makeToken__(hjs.Token.SYMBOL, firstChar);
			}
		}

		// Begin-end delimited comment
		else if (firstChar == "\u221E" || firstChar == "~") {
			var secondChar = this.reader.readNextChar(); ++numChars;

			if (firstChar == secondChar) {
				var nextToLastChar = firstChar;
				var lastChar = secondChar;

				while (nextToLastChar == firstChar && lastChar == firstChar) {
					nextToLastChar = lastChar;
					lastChar = this.reader.readNextChar();
					++numChars;
				}

				while ((nextToLastChar != "" && nextToLastChar != firstChar) || (lastChar != "" && lastChar != firstChar)) {
					nextToLastChar = lastChar;
					lastChar = this.reader.readNextChar();
					++numChars;
				} 

				while (this.reader.readNextChar() == firstChar) ++numChars;

				var tok = "";
				this.reader.reset();
				for (var i = 0; i < numChars; ++i) {
					tok.push(this.reader.readNextChar());
				}

				return this.__makeToken__(hjs.Token.COMMENT, tok);
			} else {
				this.reader.reset();
				this.reader.readNextChar();
				return this.__makeToken__(hjs.Token.SYMBOL, firstChar);
			}
		}

		// Line continuation
		else if (firstChar == "\u00AC" || firstChar == "\\") {
			while (true) {
				var nextChar = this.reader.readNextChar();
				++numChars;

				if (isLineTerm(nextChar)) {
					while (nextChar != "" && isLineTerm(nextChar = this.reader.readNextChar())) {
						++numChars;
					}

					var tok = "";
					this.reader.reset();
					for (var i = 0; i < numChars; ++i) {
						tok.push(this.reader.readNextChar());
					}

					return this.__makeToken__(hjs.Token.CONTINUATOR, tok);
				} else if (!isWhitespace(nextChar)) {
					this.reader.reset();
					this.reader.readNextChar();

					return this.__makeToken__(hjs.Token.SYMBOL, firstChar);
				}
			}
		}

		// Whitespace
		else if (isWhitespace(firstChar)) {
			return this.__makeToken__(hjs.Token.WHITESPACE, firstChar);
		}

		// Symbol token
		else {
			return this.__makeToken__(hjs.Token.SYMBOL, firstChar);
		}
	};

	Lexer.prototype.__assembleToken__ = function() {
		var tok = this.__nextToken__();

		while (tok.type == hjs.Token.COMMENT
			|| tok.type == hjs.Token.CONTINUATOR
			|| tok.type == hjs.Token.WHITESPACE) {
			var nextTok = this.__nextToken__();
			nextTok.specialToken = tok;
			tok = nextTok;
		}

		return tok;
	};

	Lexer.prototype.getToken = function() {
		var tok = this.buffer.length > 0 ? buffer.unshift(1) : this.__assembleToken__();
		if (this.lastToken != null) {
			this.lastToken.next = tok;
		}

		this.lastToken = tok;

		return tok;
	};

	Lexer.prototype.lookToken = function(pos) {
		if (pos < 1) {
			return this.lastToken;
		}

		while (this.buffer.length < pos) {
			this.buffer.push(this.__assembleToken__());
		}

		return this.buffer[pos - 1];
	};

	Lexer.prototype.getSource = function() {
		return this.source;
	};

	Lexer.prototype.getCurrentLine = function() {
		return this.reader.line();
	};

	Lexer.prototype.getCurrentColumn = function() {
		return this.reader.column();
	};

	hjs.Lexer = Lexer;

})(toplevel.hjs);