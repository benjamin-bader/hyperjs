describe("Lexer", function() {
  it("should lex ALL THE STRINGS!!!!", function() {
    expect(true).toBe(true);
  });

  describe(".buffer", function() {
    var lexer;

    beforeEach(function() {
      lexer = new Hyper.Script.Lexer("oh hai there");
    });

    it("is always defined.", function() {
      expect(lexer.buffer).toBeDefined();
    });

    it("is an array", function() {
      expect(lexer.buffer instanceof Array).toEqual(true);
    });

    it("is empty by default", function() {
      expect(lexer.buffer.length).toEqual(0);
    });
  });

  describe("when given a string containing a valid identifier", function() {
    it("returns token of type ID", function() {
      var source = "idOfMe";
      var lexer = new Hyper.Script.Lexer(source);
      var token = lexer.getToken();

      expect(token).not.toBeNull();
      expect(token.type).toEqual(Hyper.Script.TokenType.ID);
      expect(token.text).toEqual("idOfMe");
    });
  });

  describe(".__readNumber__()", function() {
    var lexer;
    var text;

    it("expects the first char to be given as an argument", function() {
      lexer = new Hyper.Script.Lexer("123");
      lexer.reader.readNextChar();
      expect(lexer.__readNumber__("1").text).toEqual("123");
    });

    beforeEach(function() {
      lexer = new Hyper.Script.Lexer(text);
      lexer.reader.readNextChar();
    });

    describe("when given the string '123'", function() {
      text = "123";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '0'", function() {
      text = "0";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '0.1'", function() {
      text = "0.1";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '.1'", function() {
      text = ".1";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '-.1'", function() {
      text = "-.1";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '1e10'", function() {
      text = "1e10";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '1e-2'", function() {
      text = "1e-2";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '-.1e10'", function() {
      text = "-.1e10";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '0.1e10'", function() {
      text = "0.1e10";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
    
    describe("when given the string '1.1e10'", function() {
      text = "1.1e10";

      it("yields a token of type Number", function() {
        expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it ("yields a token with the text '" + text + "'", function() {
        var tok = lexer.__readNumber__(text[0]);
        expect(tok.text).toEqual(text);
      });
    });
  });

  describe(".__nextToken__()", function() {
    var text, lexer;

    describe("when given the string 'asdf'", function() {
      beforeEach(function() {
        text = "asdf";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("yields a token of type ID", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.ID);
      });

      it("yields a token containing the text 'asdf'", function() {
        expect(lexer.__nextToken__().text).toEqual("asdf");
      });

      describe("and when called twice", function() {
        it("yields an ID token and a LINE_TERM token", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.ID);

          var tok = lexer.__nextToken__();
          expect(tok.type).toEqual(Hyper.Script.TokenType.LINE_TERM);
        });

        it("yields a second token with an empty string for text", function() {
          lexer.__nextToken__();
          expect(lexer.__nextToken__().text).toEqual("");
        });
      });
    });

    describe("when given the string '¬\n", function() {
      beforeEach(function() {
        text = "¬\n";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("yields a token of type CONTINUATOR", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.CONTINUATOR);
      })
    })

    describe("when given the string '1.23'", function() {
      beforeEach(function() {
        text = "1.23";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("yields a token of type NUMBER", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it("yields a token containing the text '1.23'.", function() {
        expect(lexer.__nextToken__().text).toEqual("1.23");
      });
    });

    describe("when given the string '1.e10'", function() {
      beforeEach(function() {
        text = "1.e10";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("yields a token of type SYMBOL.", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.SYMBOL);
      });

      it("yields a token containing the text '1'.", function() {
        expect(lexer.__nextToken__().text).toEqual("1");
      });
    });

    describe("when given the string '.08", function() {
      beforeEach(function() {
        text = ".08";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("yields a token of type NUMBER", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it("yields a token containing the text '.08'.", function() {
        expect(lexer.__nextToken__().text).toEqual(".08");
      });
    });

    describe("when at a string with leading whitespace", function() {
      beforeEach(function() {
        text = "        foo";
        lexer = new Hyper.Script.Lexer(text);
      });

      it("collapses consecutive whitespace into a single WHITESPACE token", function() {
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.WHITESPACE);
        expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.ID);
      });

      it("preserves all consecutive whitespace chars in the token text", function() {
        var i = text.indexOf('f');
        var whitespace = text.substr(0, i);
        var tok = lexer.__nextToken__();

        expect(tok.type).toEqual(Hyper.Script.TokenType.WHITESPACE);
        expect(tok.text).toEqual(whitespace);
      });
    })

    describe("can handle single-character-initiated comments", function() {
      describe("beginning with '#'", function() {
        beforeEach(function() {
          text = "# this is some comment that isn't actually very useful\n";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of the current line", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
        });
      });

      describe("beginning with '#' and not followed by a newline", function() {
        beforeEach(function() {
          text = "# this is some comment that isn't actually very useful";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          var token = lexer.__nextToken__();
          expect(token.type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of input", function() {
          var token = lexer.__nextToken__();
          expect(token.text).toEqual(text);
        });
      });

      describe("beginning with '\u2014'", function() {
        beforeEach(function() {
          text = "\u2014 this is some comment that isn't actually very useful\n";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of the current line", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
        });
      });

      describe("beginning with '\u2015'", function() {
        beforeEach(function() {
          text = "\u2015 this is some comment that isn't actually very useful\n";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of the current line", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
        });
      });
    });

    describe("when given a double-character-initiated comment", function() {
      describe("beginning with '--'", function() {
        beforeEach(function() {
          text = "-- this is some comment that isn't actually very useful\n";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of the current line", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
        });
      });

      describe("beginning with '//", function() {
        beforeEach(function() {
          text = "// this is some comment that isn't actually very useful\n";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment character to the end of the current line", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
        });
      });
    });

    describe("when given a bounded comment", function() {
      describe("delimited with two or more '~' characters", function() {
        beforeEach(function() {
          text = "~~ this is some comment that isn't actually very useful\nand it spans several lines. ~~1.23";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment sequence to the comment terminator.", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 4));
        });
      });

      describe("delimited with two or more '∞' characters", function() {
        beforeEach(function() {
          text = "∞∞ this is some comment that isn't actually very useful\nand it spans several lines. ∞∞1.23";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("by producing a token of type COMMENT", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("by producing a token with the text from the comment sequence to the comment terminator.", function() {
          expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 4));
        });
      });

      describe("that has no terminator", function() {
        beforeEach(function() {
          text = "~~ blah blah blah\n\nput 1 * 2 * 3 && getInput";
          lexer = new Hyper.Script.Lexer(text);
        });

        it("consumes the rest of the input and yields a single COMMENT token.", function() {
          expect(lexer.__nextToken__().type).toEqual(Hyper.Script.TokenType.COMMENT);
        });

        it("yields a COMMENT token with the remainder of the available input.", function() {
          expect(lexer.__nextToken__().text).toEqual(text);
        });
      });
    });
  });

  describe(".__assembleToken__()", function() {
    var text, lexer;

    it("returns only semantically-meaningful tokens", function() {
      var tok;

      text = "ask ¬ \n \"how are you?\" -- This is a comment";
      lexer = new Hyper.Script.Lexer(text);

      tok = lexer.__assembleToken__();
      expect(tok.type).toEqual(Hyper.Script.TokenType.ID);
      expect(tok.text).toEqual("ask");

      tok = lexer.__assembleToken__();
      expect(tok.type).toEqual(Hyper.Script.TokenType.STRING);
      expect(tok.text).toEqual("\"how are you?\"");

      tok = lexer.__assembleToken__();
      expect(tok.type).toEqual(Hyper.Script.TokenType.LINE_TERM);
      expect(tok.text).toEqual("");
    });

    describe("when given text ' ~~ test ~~ 1 * 2'", function() {
      beforeEach(function() {
        text = " ~~ test ~~ 1 * 2";
        lexer = new Hyper.Script.Lexer(text); 
      });

      it("yields first a NUMBER token", function() {
        expect(lexer.__assembleToken__().type).toEqual(Hyper.Script.TokenType.NUMBER);
      });

      it("yields second a SYMBOL token", function() {
        lexer.__assembleToken__();

        expect(lexer.__assembleToken__().type).toEqual(Hyper.Script.TokenType.SYMBOL);
      });

      it("yields a token with the previous whitespace linked", function() {
        var tok = lexer.__assembleToken__();

        expect(tok.type).toEqual(Hyper.Script.TokenType.NUMBER);
        expect(tok.specialToken).toBeDefined();
        expect(tok.specialToken.type).toEqual(Hyper.Script.TokenType.WHITESPACE);
        expect(tok.specialToken.specialToken).toBeDefined();
        expect(tok.specialToken.specialToken.type).toEqual(Hyper.Script.TokenType.COMMENT);
        expect(tok.specialToken.specialToken.specialToken).toBeDefined();
        expect(tok.specialToken.specialToken.specialToken.type).toEqual(Hyper.Script.TokenType.WHITESPACE);
      });
    });

    describe("when given the text 'on mouseUp\nanswer \"hello, Hyper.Script.js!\"\nend mouseUp'", function() {
      it("yields the only ID tokens, and one STRING token.", function() {
        var tok;
        var expectedTokenCount = 8;
        var actualTokenCount = 0;
        var types = [Hyper.Script.TokenType.ID,
               Hyper.Script.TokenType.ID,
               Hyper.Script.TokenType.LINE_TERM,
               Hyper.Script.TokenType.ID,
               Hyper.Script.TokenType.STRING,
               Hyper.Script.TokenType.LINE_TERM,
               Hyper.Script.TokenType.ID,
               Hyper.Script.TokenType.ID];
        
        var texts = ["on", "mouseUp", '\n', "answer", '"hello, Hyper.Script.js!"', "\n", "end", "mouseUp"];
        var lexer = new Hyper.Script.Lexer('on mouseUp\nanswer "hello, Hyper.Script.js!"\nend mouseUp');

        while (true) {
          tok = lexer.__assembleToken__();

          if (tok.isEOF()) {
            break;
          }

          ++actualTokenCount;

          expect(tok.type).toEqual(types[actualTokenCount - 1]);
          expect(tok.text).toEqual(texts[actualTokenCount - 1]);
        }

        expect(actualTokenCount).toEqual(expectedTokenCount);
      });
    });
  });

  describe(".lookToken()", function() {
    var text, lexer;

    beforeEach(function() {
      lexer = new Hyper.Script.Lexer(text);
    });

    it("looks ahead to the nth token in the token stream, where the current position is 0", function() {
      lexer = new Hyper.Script.Lexer("one 2 ~~three~~");

      expect(lexer.lookToken(0).type).toEqual(Hyper.Script.TokenType.ID);
      expect(lexer.lookToken(1).type).toEqual(Hyper.Script.TokenType.NUMBER);
      expect(lexer.lookToken(2).type).toEqual(Hyper.Script.TokenType.LINE_TERM);
      expect(lexer.lookToken(2).specialToken).toBeDefined();
      expect(lexer.lookToken(2).specialToken.type).toEqual(Hyper.Script.TokenType.COMMENT);
    })

    describe("when given a multi-token string", function() {
      text = "do make say think 1 + - 2.0";

      it("returns the nth token from the lexer's current position", function() {
        expect(lexer.lookToken(2).type).toEqual(Hyper.Script.TokenType.ID);
        expect(lexer.lookToken(2).text).toEqual("say");

        expect(lexer.lookToken(4).type).toEqual(Hyper.Script.TokenType.NUMBER);
        expect(lexer.lookToken(4).text).toEqual("1");

        expect(lexer.lookToken(6).type).toEqual(Hyper.Script.TokenType.SYMBOL);
        expect(lexer.lookToken(6).text).toEqual("-");

        var tok = lexer.getToken();
        expect(tok.type).toEqual(Hyper.Script.TokenType.ID);
        expect(tok.text).toEqual("do");

        expect(lexer.lookToken(2).type).toEqual(Hyper.Script.TokenType.ID);
        expect(lexer.lookToken(2).text).toEqual("think");

        expect(lexer.lookToken(4).type).toEqual(Hyper.Script.TokenType.SYMBOL);
        expect(lexer.lookToken(4).text).toEqual("+");

        expect(lexer.lookToken(6).type).toEqual(Hyper.Script.TokenType.NUMBER);
        expect(lexer.lookToken(6).text).toEqual("2.0");
      });

      it("populates the lexer's look-ahead buffer.", function() {
        expect(lexer.buffer.length).toEqual(0);

        lexer.lookToken(2);

        expect(lexer.buffer.length).toEqual(3);
      });
    });
  });

  describe(".getToken", function() {
    var text, lexer, n;

    beforeEach(function() {
      lexer = new Hyper.Script.Lexer("go to the first card of me");
    });

    describe("when .lookToken(n) has been called", function() {
      var LOOK_COUNT = 2;

      beforeEach(function() {
        lexer.lookToken(LOOK_COUNT);
      });

      it("returns tokens from the look-buffer and not from the source text", function() {
        expect(lexer.buffer.length).toEqual(3);
        expect(lexer.getToken().text).toEqual("go");
        expect(lexer.buffer.length).toEqual(2);
      });
    });
  });
});
