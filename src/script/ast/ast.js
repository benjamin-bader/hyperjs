
(function(exports, TT, undefined) {
  "use strict";

  /**
   * Represents a node in a HyperTalk AST.  Not so useful on its own.
   * @constructor
   * @param {!Span} A span indicating the node's position in the source text.
   */
  function Node(span) {
    if (!(this instanceof Node)) {
      return new Node(span);
    } 

    this.span_ = span;
  };

  Node.prototype.getSpan = function() {
    return this.span_;
  };

  /**
   * Represents a function definition.
   * @constructor
   * @extends {Node}
   * @param {!Span} span The region of the source text comprising this function.
   * @param {!string} name The name of this function[
   * @param {!Array.<string>} args The list of function arguments, if any.
   * @param {!Array.<StatementNode>} statements The statements comprising this function.
   */
  function FunctionNode(span, name, args, statements) {
    if (!(this instanceof FunctionNode)) {
      return new FunctionNode(span, name, args, statements);
    }

    Node.call(this, span);
    this.name_ = name;
    this.args_ = args;
    this.statements_ = statements;
  };

  Hyper.inherit(Node, FunctionNode);

  FunctionNode.prototype.getName = function() {
    return this.name_;
  };

  FunctionNode.prototype.getArgs = function() {
    return this.args_;
  };

  FunctionNode.prototype.getStatements = function() {
    return this.statements_;
  };

  /**
   * Represents a message handler.
   * @constructor
   * @extends {Node}
   * @param {!Span} The region of the source script comprising this message handler.
   * @parem {!string} The name of the message handled.
   * @param {!Array.<string>} The list of handler arguments, if any.
   * @param {!Array.<StatementNode>} The statements comprising this handler.
   */
  function MessageHandlerNode(span, name, args, statements) {
    if (!(this instanceof MessageHandlerNode)) {
      return new MessageHandlerNode(span, name, args, statements);
    }

    Node.call(this, span);
    this.name_ = name;
    this.args_ = args;
    this.statements_ = statements;
  };

  Hyper.inherit(Node, MessageHandlerNode);

  MessageHandlerNode.prototype.getName = function() {
    return this.name_;
  };

  MessageHandlerNode.prototype.getArgs = function() {
    return this.args_;
  };

  MessageHandlerNode.prototype.getStatements = function() {
    return this.statements_;
  };

  /**
   * Represents an expression yielding a value.
   * @constructor
   * @extends {Node}
   * @param {!Span} The region of source code comprising this expression.
   */
  function ExprNode(span) {
    if (!(this instanceof ExprNode)) {
      return new ExprNode(span);
    }

    Node.call(this, span);
  };

  Hyper.inherit(Node, ExprNode);

  /**
   * Represents a HyperTalk statement.
   * @constructor
   * @extends {Node}
   * @param {!Span} span The region of the source script comprising this statement.
   */
  function StatementNode(span) {
    if (!(this instanceof StatementNode)) {
      return new StatementNode(span);
    }

    Node.call(this, span);
  };

  Hyper.inherit(Node, StatementNode);

  /**
   * Represents an if statement, possibly with an else branch.
   * @constructor
   * @extends {StatementNode}
   * @param {!Span} The resgion of source comprising this if statement.
   * @param {!ExprNode} conditionExpr The condition to be tested.
   * @param {!Array.<StatementNode>} ifStatements The statement(s) to execute should the condition hold.
   * @param {Array.<StatementNode>} elseStatements The statement(s), if any, to execute should the condition not hold.
   */
  function IfStatementNode(span, conditionExpr, ifStatements, elseStatements) {
    if (!(this instanceof IfStatementNode)) {
      return new IfStatementNode(span, conditionExpr, ifStatements, elseStatements);
    }

    StatementNode.call(this, span);
    this.conditionExpr_ = conditionExpr;
    this.ifStatements_ = ifStatements;
    this.elseStatements_ = elseStatements;
  }

  Hyper.inherit(StatementNode, IfStatementNode);

  IfStatementNode.prototype.getConditionExpr = function() {
    return this.conditionExpr_;
  };

  IfStatementNode.prototype.getIfStatements = function() {
    return this.ifStatements_;
  };

  IfStatementNode.prototype.getElseStatements = function() {
    return this.elseStatements_;
  };

  /**
   * A repeat control block.
   * @constructor
   * @extends {StatementNode}
   * @param {!Span} span The region of source comprising this repeat block.
   * @param {!ExprNode} untilExpr An expression which controls for how long to repeat.
   * @param {!Array.<StatementNode>} statements The statements comprising the body of the repeat.
   */
  function RepeatStatementNode(span, untilExpr, statements) {
    if (!(this instanceof RepeateStatementNode)) {
      return new RepeateStatementNode(span, untilExpr, statements);
    }

    StatementNode.call(this, span);
    this.untilExpr_ = untilExpr;
    this.statements_ = statements;
  };

  Hyper.inherit(StatementNode, RepeatStatementNode);

  RepeatStatementNode.prototype.getUntilExpr = function() {
    return this.untilExpr_;
  };

  RepeatStatementNode.prototype.getStatements = function() {
    return tnis.statements_;
  };

  /**
   * A 'do' control block.
   * @constructor
   * @extends {StatementNode}
   * @param {!Span} span The region of source comprising this do block.
   * @param {!Array.<StatementNode>} statements The statments comprising this body of the do block.
   */
  function DoStatementNode(span, statements) {
    if (!(this instanceof DoStatementNode)) {
      return new DoStatementNode(span, statements);
    }

    StatementNode.call(this, span);
    this.statements_ = statements;
  };

  Hyper.inherit(StatementNode, DoStatementNode);

  DoStatementNode.prototype.getStatements = function() {
    return this.statements_;
  };

  function NextStatementNode(span) {
    if (!(this instanceof NextStatementNode)) {
      return new NextStatementNode(span);
    }

    StatementNode.call(this, span);
  };

  Hyper.inherit(StatementNode, NextStatementNode);

  function PassStatementNode(span, messageExpr) {
    if (!(this instanceof PassStatementNode)) {
      return new PassStatementNode(span, messageExpr);
    }

    StatementNode.call(this, span);
    this.messageExpr_ = messageExpr;
  };

  Hyper.inherit(StatementNode, PassStatementNode);

  PassStatementNode.prototype.getMessageExpr = function() {
    return this.messageExpr_;
  };

  function ExitStatementNode(span, target, error) {
    if (!(this instanceof ExitStatementNode)) {
      return new ExitStatementNode(span);
    }

    StatementNode.call(this, span);
    this.target_ = target;
    this.error_ = error;
  };

  Hyper.inherit(StatementNode, ExitStatementNode);

  ExitStatementNode.prototype.getTarget = function() {
    return this.target_;
  };

  ExitStatementNode.prototype.getError = function() {
    return this.error_;
  };

  /**
   * Represents a value-bearing node with two children, such as addition, subtraction,
   * put-into, etc.
   * @constructor
   * @extends {ExprNode}
   * @param {!Span} span The source region comprising this binary expression
   * @param {!ExprNode} left The left side of the binary expression
   * @param {!string} op The operator
   * @param {!ExprNode} right The right side of the binary expression
   */
  function BinaryNode(span, left, op, right) {
    if (!(this instanceof BinaryNode)) {
      return new BinaryNode(span, left, op, right);
    }

    ExprNode.call(this, span);
    this.left_ = left;
    this.op_ = op;
    this.right_ = right;
  };

  Hyper.inherit(Node, BinaryNode);

  BinaryNode.prototype.getLeft = function() {
    return this.left_;
  };

  BinaryNode.prototype.getRight = function() {
    return this.right_;
  };

  BinaryNode.prototype.getOp = function() {
    return this.op_;
  };

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

  exports.Node = Node;
  exports.StatementNode = StatementNode;
  exports.ExpressionNode = ExpressionNode;
  exports.BinaryNode = BinaryNode;
  exports.IfNode = IfNode;
  exports.ChunkExpression = ChunkExpression;
  exports.ChunkQualifier = ChunkQualifier;

})(Hyper.Script.Ast || (Hyper.Script.Ast = {}), Hyper.Script.TokenType);

