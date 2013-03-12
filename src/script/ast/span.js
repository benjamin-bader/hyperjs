
(function(ast, undefined) {
  "use strict";

  /**
   * Represents a contiguous region of a text document.
   * @constructor
   * @param {number} The line on which the span begins
   * @param {number} The column on which the span begins
   * @param {number} The line on which the span ends
   * @param {number} The column on which the span ends
   */
  function Span(span) {
    if (!(this instanceof Span)) {
      return new Span(span);
    }

    this.startLine = startLine;
    this.startCol = startCol;
    this.endLine = endLine;
    this.endCol = endCol;
  };

  /**
   * Gets the span's starting line.
   * @return {number}
   */
  Span.prototype.getStartLine = function() {
    return this.startLine;
  };

  /**
   * Gets the span's starting column.
   * @return {number}
   */
  Span.prototype.getStartCol = function() {
    return this.startCol;
  };

  /**
   * Gets the span's ending line.
   * @return {number}
   */
  Span.prototype.getEndLine = function() {
    return this.endLine;
  };

  /**
   * Gets the span's ending column.
   * @return {number}
   */
  Span.prototype.getEndCol = function() {
    return this.endCol;
  };

  /**
   * Gets a string representation of this span.
   * @return {string}
   */
  Span.prototype.toString = function() {
    return this.getStartLine() + ":"
         + this.getStartCol() + "-"
         + this.getEndLine() + ":"
         + this.getEndCol();
  };

  ast.Span = Span;
})(Hyper.Script.Ast || {Hyper.Script.Ast = {}));

