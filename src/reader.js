;

var isCommonJs = typeof window == "undefined";
var toplevel = isCommonJs ? exports : window;

if (typeof toplevel.hyperjs === "undefined") {
	toplevel.hyperjs = {};
}

(function(hyperjs) {
	var UNI_LINE_SEPARATOR      = '\u2028';
	var UNI_PARAGRAPH_SEPARATOR = '\u2029';
	var CARRIAGE_RETURN         = '\r';
	var LINE_FEED               = '\n';
	
	function StringReader(string) {
		this.len   = string.length;
		this.pos   = 0;
		this.text  = string;
		this.col   = 1;
		this.line  = 1;
		this.mcol  = 1;
		this.mline = 1;

		this.lastCr  = false;
		this.mlastCr = false;
	};

	StringReader.prototype.column = function() {
		return this.col;
	};

	StringReader.prototype.line = function() {
		return this.line;
	};

	StringReader.prototype.markedColumn = function() {
		return this.mcol;
	};

	StringReader.prototype.markedLine = function() {
		return this.mlin;
	};

	StringReader.prototype.isEOF = function() {
		return this.pos >= this.len;
	};

	StringReader.prototype.reset = function() {
		this.pos     = 0;
		this.col     = 1;
		this.line    = 1;
		this.mcol    = 1
		this.mline   = 1;
		this.lastCr  = false
		this.mlastCr = false
	};

	StringReader.prototype.readNextChar = function() {
		if (this.isEOF()) {
			return "";
		}

		var ch = this.text.charAt(this.pos++);

		if (ch == UNI_LINE_SEPARATOR || ch == UNI_PARAGRAPH_SEPARATOR) {
			this.line++;
			this.col = 1;
			this.lastCr = false;
		} else if (ch == CARRIAGE_RETURN) {
			this.line++;
			this.col = 1;
			this.lastCr = true;
		} else if (ch == LINE_FEED) {
			if (!this.lastCr) {
				line++;
			}

			this.col = 1;
			this.lastCr = false;
		} else {
			this.col++;
			this.lastCr = false;
		}

		return ch;
	};

	hyperjs.StringReader = StringReader;

})(toplevel.hyperjs);