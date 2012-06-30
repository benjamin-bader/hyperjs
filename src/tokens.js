;

var isCommonJs = typeof window === "undefined";
var toplevel = isCommonJs ? exports : window;

if (typeof toplevel.hjs === "undefined") {
	toplevel.hjs = {};
};

(function(hjs) {
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

	function isEOF() {
		return (this.type == Token.LINE_TERM && (this.text == null || this.text == ''))
			|| (this.type == Token.ID && this.text != null && this.text == "__END__");
	};

	function toString() {
		return this.text;
	}

	Token.prototype = new Token();
	Token.prototype.isEOF = isEOF;
	Token.prototype.toString = toString;

	// Constants
	Token.LINE_TERM   = 0;
	Token.STRING      = 1;
	Token.NUMBER      = 2;
	Token.ID          = 3;
	Token.SYMBOL      = 4;
	Token.COMMENT     = 5;
	Token.CONTINUATOR = 6;
	Token.WHITESPACE  = 7;

	// Exports
	hjs.Token = Token;
})(toplevel.hjs);