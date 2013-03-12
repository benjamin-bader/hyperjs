"use strict";

if (!Hyper) {
  Hyper = {};
}

if (!Hyper.Script) {
  Hyper.Script = {};
}

(function(hs, Lexer, TT, undefined) {
  function Parser(script) {
    var self = this instanceof Parser
               ? this
               : new Parser(script);

    self.__lexer__ = new Lexer(script);
    self.__originalScript__ = script;

    return self;
  };

  Parser.prototype = {};

  function ParseError(message) {
    var self = this instanceof ParseError ? this : new ParseError(message);
    self.message = message;
    return self;
  };

  ParseError.prototype = new Error();
  ParseError.prototype.constructor = ParseError;
  ParseError.prototype.name = 'ParseError';

  Parser.prototype.__

  Parser.prototype.parse = function() {
    var peek = function(n) { return this.__lexer__.lookToken(n||0); };
    var tok = this.__lexer__.readToken();
  };

  hs.Parser = Parser;
  hs.ParseError = ParseError;

})(Hyper.Script, Hyper.Script.Lexer, Hyper.Script.TokenType);

