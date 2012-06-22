;
(function(toplevel) {
	function Token(type, text, source, beginLine, beginCol, endLine, endCol) {
		this.type = type;
		this.text = text;
		this.source = source;
		this.beginLine = beginLine;
		this.beginCol = beginCol;
		this.endLine = endLine;
		this.endCol = endCol;
	};

	function isEOF() {
		return (this.type == Token.LINE_TERM && (this.text == null || this.text == ''))
			|| (this.type == Token.ID && this.text != null && this.text == "__END__";)
	};

	function toString() {
		return this.image;
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
	toplevel.Token = Token;
})(window);