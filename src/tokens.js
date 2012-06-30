;

var isCommonJs = typeof window === "undefined";
var toplevel = isCommonJs ? exports : window;

if (typeof toplevel.hjs === "undefined") {
	toplevel.hjs = {};
};

(function(hjs) {
	/**
	 * Defines the types of tokens emitted by the lexer.
	 * @enum
	 */
	var TokenType = {
		LINE_TERM:   0,
		STRING:      1,
		NUMBER:      2,
		ID:          3,
		SYMBOL:      4,
		COMMENT:     5,
		CONTINUATOR: 6,
		WHITESPACE:  7
	}

	/**
	 * Creates a new lexer token.
	 * @constructor
	 * @param {TokenType} type
	 * @param {string} text
	 * @param {string} source
	 * @param {number} beginLine
	 * @param {number} beginCol
	 * @param {number} endLine
	 * @param {number} endCol
	 */
	function Token(type, text, source, beginLine, beginCol, endLine, endCol) {
		this.type = type;
		this.text = text;
		this.source = source;
		this.beginLine = beginLine;
		this.beginCol = beginCol;
		this.endLine = endLine;
		this.endCol = endCol;
		this.specialToken = null;
		this.next = null;
	};

	/**
	 * Returns a value indicating whether this token represents the end of input.
	 * @this {Token}
	 * @return {boolean}
	 */
	Token.prototype.isEOF = function() {
		return (this.type == Token.LINE_TERM && (this.text == null || this.text == ''))
			|| (this.type == Token.ID && this.text != null && this.text == "__END__");
	};

	/**
	 * Returns a string representation of this token.
	 */
	Token.prototype.toString = function() {
		return this.text + "{" + this.beginLine + ":" + this.beginCol + "-" + this.endLine + ":" + this.endCol + "}";
	};

	// Constants
	/*
	Token.LINE_TERM   = 0;
	Token.STRING      = 1;
	Token.NUMBER      = 2;
	Token.ID          = 3;
	Token.SYMBOL      = 4;
	Token.COMMENT     = 5;
	Token.CONTINUATOR = 6;
	Token.WHITESPACE  = 7;
*/
	// Exports
	hjs.TokenType = TokenType;
	hjs.Token = Token;
})(toplevel.hjs);