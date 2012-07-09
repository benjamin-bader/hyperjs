/**
 * Copyright (c) 2012 Ben Bader
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

Hyper = (function(hjs) {
	/** @const */ var UNI_LINE_SEPARATOR      = '\u2028';
	/** @const */ var UNI_PARAGRAPH_SEPARATOR = '\u2029';
	/** @const */ var CARRIAGE_RETURN         = '\r';
	/** @const */ var LINE_FEED               = '\n';
	
	/**
	 * Represents an object that can read a string, remembering positional
	 * information.
	 *
	 * @constructor
	 * @param {string} string The string to be read.
	 */
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

	StringReader.prototype = {
		len: 0,
		pos: 0,
		col: 1,
		line: 1,
		mpos: 0,
		mcol: 1,
		mline: 1,
		lastCr: false,
		mlastCr: false,
		text: ''
	};

	/**
	 * Returns the current column.
	 *
	 * @return {number}
	 */
	StringReader.prototype.getColumn = function() {
		return this.col;
	};

	/**
	 * Returns the current line.
	 *
	 * @return {number}
	 */
	StringReader.prototype.getLine = function() {
		return this.line;
	};

	/**
	 * Returns the most recently-marked column.
	 *
	 * @return {number}
	 */
	StringReader.prototype.markedColumn = function() {
		return this.mcol;
	};

	/**
	 * Returns the most recently-marked line.
	 *
	 * @return {number}
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
	 *
	 * @return {boolean}
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
				this.line++;
			}

			this.col = 1;
			this.lastCr = false;
		} else {
			this.col++;
			this.lastCr = false;
		}
	};

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
	};

	hjs.StringReader = StringReader;

	return hjs;

})(Hyper || {});