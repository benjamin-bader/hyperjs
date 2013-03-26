(function(hs, Lexer, TT, undefined) {
  "use strict";

  function spanFromTokens(startToken, endToken) {
    var startLine = startToken.getBeginLine();
    var startCol = startToken.getBeginCol();
    var endLine = endToken.getEndLine();
    var endCol = endToken.getEndCol();
    return new hs.Span(startLine, startCol, endLine, endCol);
  }

  /**
   * The HyperTalk parser.
   * @constructor
   * @param {string} script The script to be parsed.
   */
  function Parser(script) {
    if (!(this instanceof Parser)) {
      return new Parser(script);
    }

    this.lexer_ = new Lexer(script);
    this.originalScript_ = script;
  };

  function ParseError(message) {
    if (!(this instanceof ParseError)) {
      return new ParseError(message);
    }

    this.message = message || "Could not understand your HyperTalk.";
    this.name = "ParseError";
  };

  Hyper.inherit(Error, ParseError);

  Parser.prototype.parse = function() {
    var peek = function(n) { return this.__lexer__.lookToken(n||0); };
    var tok = this.__lexer__.readToken();
  };

  Parser.prototype.peek = function(index) {
    index = index || 1;
    return this.lexer_.peek(index);
  }

  Parser.prototype.lookAheadImpl = function(type, symbols) {
    var acceptAnyType = false;
    if (type === null || type === undefined) {
      acceptAnyType = true;
    }

    for (var i = 0; i < symbols.length; ++i) {
      var expected = symbols[i];
      var actual = this.lexer_.lookToken(i);

      if (!acceptAnyType && actual.type != type) {
        return false;
      }

      if (actual.text.toLowerCase() !== expected) {
        return false;
      }
    }

    return true;
  };

  /**
   * Looks ahead n tokens and matches that token's text or type,
   * depending on the argument given.
   * @paran {number} n The zero-based lookahead count.
   * @param {string|number} textOrType Either text to match or the numeric type of the token to match.
   */
  Parser.prototype.look = function(n, textOrType) {
    var token = this.lexer_.lookToken(n);

    if (typeof textOrType === 'number') {
      return token.type == textOrType;
    }

    if (typeof textOrType === 'string') {
      return token.text.toLowerCase() === textOrType;
    }

    return token;
  };

  /**
   * @private
   * @param {...string} varArgs The tokens to match[
   * @return {boolean}
   */
  Parser.prototype.lookSymbols = function(varArgs) {
    return this.lookAheadImpl(null, arguments);
  };

  Parser.prototype.error = (function() {
    var errorFormat = "Error parsing your HyperTalk at {line}:{col}: {message}";

    return function(message) {
      var args = {
        line: this.lexer_.getCurrentLine(),
        col: this.lexer_.getCurrentColumn(),
        message: message || "Unspecified parse error - please contact the HyperJS developers!"
      };

      return new ParseError(Hyper.format(errorFormat, args));
    };
  })();

  /**
   * Discards a given number of tokens from the token stream.
   * @private
   * @param {number} count The number of tokens to discard.
   */
  Parser.prototype.discardTokens = function(count) {
    if (!count || count < 0) {
      throw new Error("Invalid value for count, expected a non-negative number but got: " + count);
    }

    for (var i = 0; i < count; ++i) {
      this.lexer_.getToken();
    }
  };

  Parser.prototype.discardTokensOfType = function(type) {
    while (this.lexer_.lookToken(0).type == type) {
      this.lexer_.getToken();
    }
  };

  Parser.prototype.nextToken = function(expectedText) {
    var token = this.lexer_.getToken();
    
    if (expectedText && token.text !== expectedText) {
      throw this.error("Expected '" + expectedText + "'");
    }

    return token;
  };

  Parser.prototype.lookType = function(type, pos) {
    return this.lexer_.lookToken(pos || 0).type == type;
  };

  Parser.prototype.nextTokenAssertType = function(type, name) {
    if (!this.lookType(type, 0)) {
      throw this.error(name);
    }

    return this.nextToken();
  }

  /**
   * Returns true if the token at the given offset is an identifier.
   * @param {?number} pos The position in the token stream to look.  Defaults to zero.
   * @return {boolean} Returns true if the specified token is an identifier.
   */
  Parser.prototype.lookIdentifier = function(pos) {
    return this.lookType(TT.ID, pos);
  };

  /**
   * Consumes and returns the next token, asserting that it is an identifier.
   * @return {Hyper.Script.Token} Returns the identifier token at the head of the stream.
   */
  Parser.prototype.getIdentifier = function() {
    return this.nextTokenAssertType(TT.ID, "Expected an identifier");
  };

  Parser.prototype.lookNumber = function(pos) {
    return this.lookType(TT.NUMBER, pos);
  };

  Parser.prototype.getNumber = function() {
    return this.nextTokenAssertType(TT.NUMBER, "Expected a number");
  };

  Parser.prototype.lookEOL = function(pos) {
    return this.lookType(TT.LINE_TERM, pos);
  };

  Parser.prototype.getEOL = function() {
    return this.nextTokenAssertType(TT.LINE_TERM);
  };

  Parser.prototype.lookStringToken = function(pos) {
    return this.lookType(TT.STRING, pos);
  }

  Parser.prototype.getStringToken = function() {
    return this.nextTokenAssertType(TT.STRING);
  }

  Parser.prototype.parseTopLevel = function() {
    this.discardTokensOfType(Hyper.Script.TokenType.LINE_TERM);
    var handlerOrFunction = this.parseMessageHandlerDefinition();

    if (handlerOrFunction !== null) {
      return handlerOrFunction;
    }

    // If we're here, then we've failed to parse a message handler.  A function
    // definition is the only other legal option. 
    return this.parseFunctionDefinition();
  };

  Parser.prototype.parseMessageHandlerDefinition = function() {
    if (!this.lookSymbols("on")) {
      return null;
    }

    var onToken;
    var messageNameToken;
    var handlerArguments = [];
    var bodyStatements = [];
    var endToken;
    var endMessageNameToken;

    onToken = this.nextToken();
    
    if (!this.lookIdentifier()) {
      throw this.error("Expected a message name.");
    }

    messageNameToken = this.getIdentifier();

    while (!this.lookEOL()) {
      var argNameToken = this.getIdentifier();
      
      // Comma separators are allowed between params, but are optional.
      if (this.lookSymbols(",")) {
        this.nextToken();
      }

      handlerArguments.push(argNameToken);
    }

    this.getEOL();

    // XXX: Implement statement-list parsing

    while (this.lookStatement()) {
      bodyStatements.push(this.parseStatement());
    }

    endToken = this.nextToken("end");
    endMessageNameToken = this.nextToken(messageNameToken.text);

    return new hs.Ast.MessageHandlerNode(
        spanFromTokens(onToken, endMessageNameToken),
        messageNameToken.text,
        handlerArguments.map(function (t) { return t.text; }),
        bodyStatements);
  };

  Parser.prototype.parseFunctionDefinition = function() {
    if (!this.lookSymbols("function")) {
      return null;
    }
  };

  Parser.prototype.lookStatement = function() {
    // Built-in commands
    if (this.lookCommand()) return true;

    return false;
  };

  Parser.prototype.parseStatement = function() {
    // Built-in commands
    if (this.lookSymbols("put")) return this.parseCommand("put");

    throw this.error("Expected a statement");
  };

  var builtInCommands = (function() {
    var cmds = ["put", "pass", "send", "ask", "answer"];
    return Hyper.Trie.fromList(cmds).freeze();
  })();

  Parser.prototype.canUnderstandCommandName = function(name) {
    return builtInCommands.lookup(name);
  };

  Parser.prototype.lookCommand = function() {
    var nextToken = this.look(0);
    return this.canUnderstandCommandName(nextToken.text);
  };

  Parser.prototype.parseCommand = function(commandName) {
    var commandToken = this.nextToken(commandName);

    switch (commandName) {
      case "put": return this.parsePutCommand();
    }

    throw this.error("Invalid or unimplemented command: " + commandName);
  };

  Parser.prototype.parsePutCommand = function() {
    var sourceExpr;
    var targetExpr;
    var span;

    sourceExpr = this.parseExpression();

    if (this.lookSymbols("into") || this.lookSymbols("before") || this.lookSymbols("after")) {
      throw new Error("Not implemented");
    } else {
      // No target, default is the Message Box.  Implicit target has no span, so fix it up here.
      targetExpr = new Hyper.Script.Ast.MessageBoxExpr();
      span = sourceExpr.getSpan();
    }

    this.getEOL();

    return new Hyper.Script.Ast.PutCommandNode(span, sourceExpr, targetExpr);
  };

  Parser.prototype.parseExpression = function() {
    var nextToken = this.look(0);

    if (nextToken.type == TT.STRING) return this.parseStringLiteralExpr();

    throw this.error("Expected an expression, got: " + nextToken);
  };

  Parser.prototype.parseStringLiteralExpr = function() {
    var strTok = this.getStringToken();
    var span = spanFromTokens(strTok, strTok);
    return new Hyper.Script.Ast.StringLiteralExpr(span, strTok.text);
  };

  var ordinals = Hyper.Trie.fromList([
      "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
      "eighth", "ninth", "tenth", "any", "middle", "last"])
    .freeze();

  var chunkTypes = (function() {
    var t = new Hyper.Trie();
    t.add("char");
    t.add("character");
    t.add("word");
    t.add("item");
    t.add("line");
    return t.freeze();
  })();

  Parser.prototype.parseFactor = function() {
    return null;
  };

  Parser.prototype.parseChunkSpec = function() {
    var tokOne = this.peek(1);
    var tokTwo = this.peek(2);

    if (tokOne.type != TT.SYMBOL || tokTwo.type != TT.SYMBOL) {
      return null;
    }

    var qualifier;
    var ordinal;
    //if (ordinals.lookup(tokOne.getValue()) && chunkTypes.lookup(tokTwo.getValue())) {
    //  qualifier = new Hyper.Script.Ast.ChunkQualifier(Hyper.Script.Span.fromTokens(tokOne, tokTwo), tokOne.getValue(), tokTwo.getValue());
    //} else if (chunkTypes.lookup(tokTwo.getValue()) && 

    // XXX Continue!
  };

  hs.Parser = Parser;
  hs.ParseError = ParseError;

})(Hyper.Script || (Hyper.Script = {}), Hyper.Script.Lexer, Hyper.Script.TokenType);

