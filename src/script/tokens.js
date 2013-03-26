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
   * @param {TokenType} type The lexical type of this token.
   * @param {string} text The text comprising this token.
   * @param {Hyper.Script.Span} span The region of the source file comprising this token.
   */
  function Token(type, text, span) {
    this.type = type;
    this.text = text;
    this.span = span;
    this.specialToken = null;
    this.next = null;
  };

  /**
   * Returns a value indicating whether this token represents the end of input.
   * @this {Token}
   * @return {boolean}
   */
  Token.prototype.isEOF = function() {
    return (this.type == TokenType.LINE_TERM && (this.text || '') == '')
      || (this.type == TokenType.ID && this.text != null && this.text == "__END__");
  };

  /**
   * Returns a string representation of this token.
   */
  Token.prototype.toString = function() {
    return this.text + "{" + this.beginLine + ":" + this.beginCol + "-" + this.endLine + ":" + this.endCol + "}";
  };

  Token.prototype.getSpan = function() {
    return this.span;
  };

  Token.prototype.getBeginLine = function() {
    return this.span.getStartLine();
  };

  Token.prototype.getBeginCol = function() {
    return this.span.getStartCol();
  };

  Token.prototype.getEndLine = function() {
    return this.span.getEndLine();
  };

  Token.prototype.getEndCol = function() {
    return this.span.getEndCol();
  };

  // Exports
  hjs.TokenType = TokenType;
  hjs.Token = Token;

  return hjs;
})(Hyper.Script || (Hyper.Script = {}));
