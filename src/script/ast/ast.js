
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
  function Expr(span) {
    if (!(this instanceof Expr)) {
      return new Expr(span);
    }

    Node.call(this, span);
  };

  Hyper.inherit(Node, Expr);

  /* 
   * ScriptList = NL Script | Script
   *
   * Script = Handler | Function
   *
   * Handler =
   *  | ON Ident [IdentList]
   *      StatementList
   *    END Ident
   *
   * IdentList = Ident | Ident COMMA IdentList
   * Ident = whatever
   *
   * Statement =
   *  | if EXPR then STMT
   *  | if EXPR then
   *      STMT LIST
   *    end if
   *  | do
   *      STMT LIST
   *    end do
   *  | global IDENT
   *  | repeat (EXPR [times])
   *      STMT LIST
   *    end repeat
   *
   *  Expr =
   *    | 
   *
   */


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
   * @param {!Expr} conditionExpr The condition to be tested.
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
   * @param {!Expr} untilExpr An expression which controls for how long to repeat.
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

  function GlobalStatementNode(span, name) {
    if (!(this instanceof GlobalStatementNode)) {
      return new GlobalStatementNode(span, name);
    }

    StatementNode.call(this, span);
    this.name_ = name;
  }

  Hyper.inherit(StatementNode, GlobalStatementNode);

  GlobalStatementNode.prototype.getName = function() {
    return this.name_;
  };

  function FunctionOrPropertyExpr(span, functionOrProperty) {
    if (!(this instanceof FunctionOrPropertyExpr)) {
      return new FunctionOrPropertyExpr(span, functionOrProperty);
    }

    Expr.call(this, span);
    this.functionOrProperty_ = functionOrProperty;
  }

  Hyper.inherit(Expr, FunctionOrPropertyExpr);

  FunctionOrPropertyExpr.prototype.getFunctionOrExpr = function() {
    return this.functionOrProperty_;
  };

  function VariableExpr(span, variable) {
    if (!(this instanceof VariableExpr)) {
      return new VariableExpr(span, variable);
    }

    Expr.call(this, span);
    this.variable_ = variable;
  }

  Hyper.inherit(Expr, VariableExpr);

  VariableExpr.prototype.getVariable = function() {
    return this.variable_;
  };

  /**
   * Represents an expression referencing the message box.  Note that this
   * expression is sometimes implicit and might not have a span.
   * @constructor
   * @extends {Expr}
   * @param {Span} span The source region, if any, representing this expression.
   */
  function MessageBoxExpr(span) {
    if (!(this instanceof MessageBoxExpr)) {
      return new MessageBoxExpr(span);
    }

    Expr.call(this, span);
  }

  Hyper.inherit(Expr, MessageBoxExpr);

  function unquote(str) {
    if (str.charAt(0) == '"') {
      return str.substring(1, str.length - 2);
    }

    return str;
  }

  /**
   * Represents a string literal.
   * @constructor
   * @extends {Expr}
   * @param {Span} span The source region comprising this string literal.
   * @param {string} text The string literal itself, including the surrounding quotation marks.
   */
  function StringLiteralExpr(span, text) {
    if (!(this instanceof StringLiteralExpr)) {
      return new StringLiteralExpr(span, text);
    }

    Expr.call(this, span);

    this.text_ = text.substring(1, text.length - 1);
  }

  Hyper.inherit(Expr, StringLiteralExpr);

  StringLiteralExpr.prototype.getText = function() {
    return this.text_;
  };

  /**
   * Represents a value-bearing node with two children, such as addition, subtraction,
   * put-into, etc.
   * @constructor
   * @extends {Expr}
   * @param {!Span} span The source region comprising this binary expression
   * @param {!Expr} left The left side of the binary expression
   * @param {!string} op The operator
   * @param {!Expr} right The right side of the binary expression
   */
  function BinaryExpr(span, left, op, right) {
    if (!(this instanceof BinaryExpr)) {
      return new BinaryExpr(span, left, op, right);
    }

    Expr.call(this, span);
    this.left_ = left;
    this.op_ = op;
    this.right_ = right;
  };

  Hyper.inherit(Expr, BinaryExpr);

  BinaryExpr.prototype.getLeft = function() {
    return this.left_;
  };

  BinaryExpr.prototype.getRight = function() {
    return this.right_;
  };

  BinaryExpr.prototype.getOp = function() {
    return this.op_;
  };

  var ordinalsToNumbers = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10
  };

  var specialOrdinals = [ "middle", "last", "any" ];

  var chunkTypes = (function() {
    var trie = new Hyper.Trie();
    trie.addWord("word");
    trie.addWord("char");
    trie.addWord("character");
    trie.addWord("line");
    trie.addWord("item");
    return trie.freeze();
  })();

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

    Node.call(this, span);

    if (!chunkTypes.lookup(type)) {
      throw new Error("Invalid chunk type: " + type);
    }

    this.ordinal_ = ordinal;
    this.type_ = type;
  };

  Hyper.inherit(Node, ChunkQualifier);

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
   * @param {Expr} The value-bearing expression to be chunked.
   */
  function ChunkExpr(span, qualifiers, expr) {
    if (!(this instanceof ChunkExpr)) {
      return new ChunkExpr(span, qualifiers, expr);
    }

    Node.call(this, span);
    this.qualifiers = qualifiers;
    this.expr = expr;
  };

  Hyper.inherit(Node, ChunkExpr);

  function PutCommandNode(span, expr, target) {
    if (!(this instanceof PutCommandNode)) {
      return new PutCommandNode(span, expr, target);
    }

    StatementNode.call(this, span);
    this.expr_ = expr;
    this.target_ = target;
  };

  Hyper.inherit(StatementNode, PutCommandNode);

  PutCommandNode.prototype.getSourceExpr = function() {
    return this.expr_;
  };

  PutCommandNode.prototype.getTarget = function() {
    return this.target_;
  };

  exports.Node = Node;
  exports.StatementNode = StatementNode;
  exports.Expr = Expr;
  exports.BinaryExpr = BinaryExpr;
  exports.MessageHandlerNode = MessageHandlerNode;
  exports.IfStatementNode = IfStatementNode;
  exports.ChunkExpr = ChunkExpr;
  exports.ChunkQualifier = ChunkQualifier;

  // Export commands
  exports.PutCommandNode = PutCommandNode;

  // Export intrinsic expressions
  exports.MessageBoxExpr = MessageBoxExpr;

  exports.StringLiteralExpr = StringLiteralExpr;

})(Hyper.Script.Ast || (Hyper.Script.Ast = {}), Hyper.Script.TokenType);

