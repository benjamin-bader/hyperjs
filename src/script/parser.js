(function(hs, Lexer, TT, undefined) {
  "use strict";

  /**
   * The HyperTalk parser.
   * @constructor
   * @param {string} script The script to be parsed.
   */
  function Parser(script) {
    var self = this instanceof Parser
               ? this
               : new Parser(script);

    self.__lexer__ = new Lexer(script);
    self.__originalScript__ = script;

    return self;
  };

  function ParseError(message) {
    if (!(this instanceof ParseError)) {
      return new ParseError(message);
    }

    Error.call(this, message);
  };

  Hyper.inherit(Error, ParseError);

  Parser.prototype.parse = function() {
    var peek = function(n) { return this.__lexer__.lookToken(n||0); };
    var tok = this.__lexer__.readToken();
  };

  hs.Parser = Parser;
  hs.ParseError = ParseError;

})(Hyper.Script, Hyper.Script.Lexer, Hyper.Script.TokenType);

