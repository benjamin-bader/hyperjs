;

var isCommonJs = typeof window === "undefined";
var toplevel = isCommonJs ? exports : window;

if (typeof toplevel.hjs === "undefined") {
	toplevel.hjs = {};
}

(function(hjs) {
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
		this.mpos  = 0;
		this.mcol  = 1;
		this.mline = 1;

		this.lastCr  = false;
		this.mlastCr = false;
	};

	/**
	 * Returns the current column.
	 */
	StringReader.prototype.column = function() {
		return this.col;
	};

	/**
	 * Returns the current line.
	 */
	StringReader.prototype.line = function() {
		return this.line;
	};

	/**
	 * Returns the most recently-marked column.
	 */
	StringReader.prototype.markedColumn = function() {
		return this.mcol;
	};

	/**
	 * Returns the most recently-marked line.
	 */
	StringReader.prototype.markedLine = function() {
		return this.mline;
	};

	/**
	 * Marks the reader's current state so that it can returned to.
	 */
	StringReader.prototype.mark = function() {
		this.mpos    = this.pos;
		this.mcol    = this.col;
		this.mline   = this.line;
		this.mlastCr = this.lastCr;
	};

	/**
	 * Returns a value indicating whether the reader has reached the end
	 * of its input.
	 */
	StringReader.prototype.isEOF = function() {
		return this.pos >= this.len;
	};

	/**
	 *	Returns the reader to the last marked position.
	 */
	StringReader.prototype.reset = function() {
		this.pos     = this.mpos;
		this.col     = this.mcol;
		this.line    = this.mline;
		this.lastCr  = this.mlastCr;
	};

	/**
	 * Updates the state of the reader based on the just-read character i.e.
	 * updating line/column numbers, etc.
	 */
	StringReader.prototype._incrementColAndLine = function(ch) {
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
	}

	/**
	 * Reads a character from the input and returns it.  Returns the empty
	 * string when the input has been exhausted.
	 */
	StringReader.prototype.readNextChar = function() {
		if (this.isEOF()) {
			return "";
		}

		var ch = this.text.charAt(this.pos++);

		this._incrementColAndLine(ch);		

		return ch;
	};

	StringReader.prototype.read = function(count) {
		var tok = this.text.substr(this.pos, count);
		
		this.pos += tok.length;

		for (var i = 0; i < tok.length; ++i) {
			this._incrementColAndLine(tok.charAt(i));
		}

		return tok;
	}

	hjs.StringReader = StringReader;

})(toplevel.hjs);