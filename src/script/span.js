
(function(exports, undefined) {
  "use strict";

  /**
   * Represents a contiguous region of a text document.
   * @constructor
   * @param {number} The line on which the span begins
   * @param {number} The column on which the span begins
   * @param {number} The line on which the span ends
   * @param {number} The column on which the span ends
   */
  function Span(startLine, startCol, endLine, endCol) {
    if (!(this instanceof Span)) {
      return new Span(startLine, startCol, endLine, endCol);
    }

    this.startLine_ = startLine;
    this.startCol_ = startCol;
    this.endLine_ = endLine;
    this.endCol_ = endCol;
  };

  /**
   * Gets the span's starting line.
   * @return {number}
   */
  Span.prototype.getStartLine = function() {
    return this.startLine_;
  };

  /**
   * Gets the span's starting column.
   * @return {number}
   */
  Span.prototype.getStartCol = function() {
    return this.startCol_;
  };

  /**
   * Gets the span's ending line.
   * @return {number}
   */
  Span.prototype.getEndLine = function() {
    return this.endLine_;
  };

  /**
   * Gets the span's ending column.
   * @return {number}
   */
  Span.prototype.getEndCol = function() {
    return this.endCol_;
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

  exports.Span = Span;
})(Hyper.Script || (Hyper.Script = {}));

