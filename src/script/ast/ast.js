
(function(exports, TT, undefined) {
  "use strict";

  /**
   * Represents a node in a HyperTalk AST.  Not so useful on its own.
   * @constructor
   * @param {Span} A span indicating the node's position in the source text.
   */
  function Node(span) {
    if (!(this instanceof Node)) {
      return new Node(span);
    } 

    this.span = span;
  };

  /**
   * Transforms the parse tree under the current node into a simpler form,
   * if possible.  Must be implemented in node subclasses.
   */
  Node.prototype.simplify = function() {
    throw new Error("Not implemented!");
  };

  /**
   * Represents a value-bearing node with two children, such as addition, subtraction,
   * put-into, etc.
   */
  function BinaryNode(span, left, op, right) {
    if (!(this instanceof BinaryNode)) {
      return new BinaryNode(span, left, op, right);
    }

    Node.call(this, span);
    this.left = left;
    this.op = op;
    this.right = right;
  };

  Hyper.inherit(Node, BinaryNode);

  /**
   * A qualifier of a chunk expression, e.g. "first word of" or "any character".
   * @constructor
   * @param {Span} The region of the source text occupied by this qualifer
   * @param {String} A numeric word (e.g. "first", "second", etc.) or the special word "any".
   * @param {String} The noun of the qualifier, e.g. "word", "letter", etc.
   */
  function ChunkQualifier(span, ordinal, type) {
    if (!(this instanceof ChunkQualifier)) {
      return new ChunkQualifier(span, ordinal, type);
    }

    this.span_ = span;
    this.ordinal_ = ordinal;
    this.type_ = type;
  };

  ChunkQualifier.prototype.getSpan = function() {
    return this.span_;
  };

  ChunkQualifier.prototype.getOrdinal = function() {
    return this.ordinal_;
  };

  ChunkQualifier.prototype.getType = function() {
    return this.type_;
  };

  /**
   * Represents a chunk expression yielding a portion of a larger value.
   * @constructor
   * @param {Span}
   * @param {Array.<ChunkQualifier>} The qualifiers comprising the chunk to yield.
   * @param {Expression} The value-bearing expression to be chunked.
   */
  function ChunkExpression(span, qualifiers, expr) {
    if (!(this instanceof ChunkExpression)) {
      return new ChunkExpression(span, qualifiers, expr);
    }

    Node.call(this, span);
    this.qualifiers = qualifiers;
    this.expr = expr;
  };

  Hyper.inherit(Node, ChunkExpression);

  function PutCommand(span, expr, target) {
    if (!(this instanceof PutCommand)) {
      return new PutCommand(span, expr, target);
    }

    Node.call(this, span);
    this.expr = expr;
    this.target = target;
  };

  Hyper.inherit(Node, PutCommand);


  BinaryNode.prototype.simplify = function() {
    // XXX Implement arithmetic simplifications
    this.left.simplify();
    this.right.simplify();

    // Simplify stuff here
  };

  /**
   * Represents the declaration of a message handler.
   * @constructor
   * @param {Span} The region of the source compassing this message handler
   * @param {string} The name of this message handler
   * @param {![string]} The parameter names taken by this message handler
   * @param {![Node]} The statements comprising the body of this message handler
   */
  function MessageHandlerNode(span, name, parameters, statements) {
    if (!(this instanceof MessageHandlerNode)) {
      return new MessageHandlerNode(span, name, parameters, statements);
    }

    Node.call(this, span);
    this.name = name;
    this.parameters = parameters;
    this.statements = statements;
  };

  Hyper.inherit(Node, MessageHandlerNode);

  MessageHandlerNode.prototype.simplify = function() {
    for (var i = 0, len = this.statements.length; i < len; ++i) {
      this.statements[i].simplify();
    }
  };

  /**
   * Represents the declaration of a function.
   * @constructor
   * @param {Span} The region of the source compassing this function
   * @param {string} The name of this function
   * @param {![string]} The parameter names taken by this function
   * @param {![Node]} The statements comprising the body of this function
   */
  function FunctionNode(span, name, parameters, statements) {
    if (!(this instanceof FunctionNode)) {
      return new FunctionNode(span, name, parameters, statements);
    }

    Node.call(this, span);
    this.name = name;
    this.parameters = parameters;
    this.statements = statements;
  };

  Hyper.inherit(Node, FunctionNode);

  FunctionNode.prototype.simplify = function() {
    for (var i = 0, len = this.statements.length; i < len; ++i) {
      this.statements[i].simplify();
    }
  };

  /**
   * Represents a variable assignment statement.
   */
  function AssignNode(span, left, right) {
    if (!(this instanceof AssignNode)) {
      return new AssignNode(span, left, right);
    }

    BinaryNode.call(this, span, left, '=', right);
  };

  Hyper.inherit(BinaryNode, AssignNode);

  function StatementNode() {

  };

  function ExpressionNode() {

  };

  Hyper.inherit(Node, StatementNode);
  Hyper.inherit(Node, ExpressionNode);

  function IfNode() {

  };

  Hyper.inherit(Node, IfNode);

  exports.Node = Node;
  exports.StatementNode = StatementNode;
  exports.ExpressionNode = ExpressionNode;
  exports.BinaryNode = BinaryNode;
  exports.IfNode = IfNode;
  exports.ChunkExpression = ChunkExpression;
  exports.ChunkQualifier = ChunkQualifier;

})(Hyper.Script.Ast || (Hyper.Script.Ast = {}), Hyper.Script.TokenType);

