describe("Lexer", function() {
	it("should lex ALL THE STRINGS!!!!", function() {
		expect(true).toBe(true);
	});

	describe("when given a string containing a valid identifier", function() {
		it("returns token of type ID", function() {
			var source = "idOfMe";
			var lexer = new Hyper.Lexer(source);
			var token = lexer.getToken();

			expect(token).not.toBeNull();
			expect(token.type).toEqual(Hyper.TokenType.ID);
			expect(token.text).toEqual("idOfMe");
			expect(token.source).toEqual(source);
		});
	});

	describe("when given a string containing an integer number", function() {
		it("returns a token of type NUMBER", function() {
			var source = "1234";
		});
	});

	describe("__readNumber__", function() {
		var lexer;
		var text;

		it("expects the first char to be given as an argument", function() {
			lexer = new Hyper.Lexer("123");
			lexer.reader.readNextChar();
			expect(lexer.__readNumber__("1").text).toEqual("123");
		});

		describe("when given the string '123'", function() {
			beforeEach(function() {
				text = "123";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '0'", function() {
			beforeEach(function() {
				text = "0";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '0.1'", function() {
			beforeEach(function() {
				text = "0.1";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '.1'", function() {
			beforeEach(function() {
				text = ".1";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '-.1'", function() {
			beforeEach(function() {
				text = "-.1";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '1e10'", function() {
			beforeEach(function() {
				text = "1e10";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '1e-2'", function() {
			beforeEach(function() {
				text = "1e-2";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '-.1e10'", function() {
			beforeEach(function() {
				text = "-.1e10";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '0.1e10'", function() {
			beforeEach(function() {
				text = "0.1e10";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
		
		describe("when given the string '1.1e10'", function() {
			beforeEach(function() {
				text = "1.1e10";
				lexer = new Hyper.Lexer(text);
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__(text[0]).type).toEqual(Hyper.TokenType.NUMBER);
			});

			it ("yields a token with the text '" + text + "'", function() {
				var tok = lexer.__readNumber__(text[0]);
				expect(tok.text).toEqual(text);
			});
		});
	});

	describe("__nextToken__", function() {
		var text, lexer;

		describe("when given the string 'asdf'", function() {
			beforeEach(function() {
				text = "asdf";
				lexer = new Hyper.Lexer(text);
			});

			it("yields a token of type ID", function() {
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.ID);
			});

			it("yields a token containing the text 'asdf'", function() {
				expect(lexer.__nextToken__().text).toEqual("asdf");
			});

			describe("and when called twice", function() {
				it("yields an ID token and a LINE_TERM token", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.ID);

					var tok = lexer.__nextToken__();
					expect(tok.type).toEqual(Hyper.TokenType.LINE_TERM);
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
				lexer = new Hyper.Lexer(text);
			});

			it("yields a token of type CONTINUATOR", function() {
				console.log("testing...")
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.CONTINUATOR);
			})
		})

		describe("when given the string '1.23'", function() {
			beforeEach(function() {
				text = "1.23";
				lexer = new Hyper.Lexer(text);
			});

			it("yields a token of type NUMBER", function() {
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.NUMBER);
			});

			it("yields a token containing the text '1.23'.", function() {
				expect(lexer.__nextToken__().text).toEqual("1.23");
			});
		});

		describe("when given the string '.08", function() {
			beforeEach(function() {
				text = ".08";
				lexer = new Hyper.Lexer(text);
			});

			it("yields a token of type NUMBER", function() {
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.NUMBER);
			});

			it("yields a token containing the text '.08'.", function() {
				expect(lexer.__nextToken__().text).toEqual(".08");
			});
		});

		describe("when at a string with leading whitespace", function() {
			beforeEach(function() {
				text = "        foo";
				lexer = new Hyper.Lexer(text);
			});

			it("collapses consecutive whitespace into a single WHITESPACE token", function() {
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.WHITESPACE);
				expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.ID);
			});

			it("preserves all consecutive whitespace chars in the token text", function() {
				var i = text.indexOf('f');
				var whitespace = text.substr(0, i);
				var tok = lexer.__nextToken__();

				expect(tok.type).toEqual(Hyper.TokenType.WHITESPACE);
				expect(tok.text).toEqual(whitespace);
			});
		})

		describe("can handle single-character-initiated comments", function() {
			describe("beginning with '#'", function() {
				beforeEach(function() {
					text = "# this is some comment that isn't actually very useful\n";
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("by producing a token with the text from the comment character to the end of the current line", function() {
					expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
				});
			});

			describe("beginning with '\u2014'", function() {
				beforeEach(function() {
					text = "\u2014 this is some comment that isn't actually very useful\n";
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("by producing a token with the text from the comment character to the end of the current line", function() {
					expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
				});
			});

			describe("beginning with '\u2015'", function() {
				beforeEach(function() {
					text = "\u2015 this is some comment that isn't actually very useful\n";
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
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
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("by producing a token with the text from the comment character to the end of the current line", function() {
					expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 1));
				});
			});

			describe("beginning with '//", function() {
				beforeEach(function() {
					text = "// this is some comment that isn't actually very useful\n";
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
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
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("by producing a token with the text from the comment sequence to the comment terminator.", function() {
					expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 4));
				});
			});

			describe("delimited with two or more '∞' characters", function() {
			  beforeEach(function() {
					text = "∞∞ this is some comment that isn't actually very useful\nand it spans several lines. ∞∞1.23";
					lexer = new Hyper.Lexer(text);
				});

				it("by producing a token of type COMMENT", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("by producing a token with the text from the comment sequence to the comment terminator.", function() {
					expect(lexer.__nextToken__().text).toEqual(text.substr(0, text.length - 4));
				});
			});

			describe("that has no terminator", function() {
				beforeEach(function() {
					text = "~~ blah blah blah\n\nput 1 * 2 * 3 && getInput";
					lexer = new Hyper.Lexer(text);
				});

				it("consumes the rest of the input and yields a single COMMENT token.", function() {
					expect(lexer.__nextToken__().type).toEqual(Hyper.TokenType.COMMENT);
				});

				it("yields a COMMENT token with the remainder of the available input.", function() {
					expect(lexer.__nextToken__().text).toEqual(text);
				});
			});
		});
	});

	describe(".__assembleToken__", function() {
		var text, lexer;

		it("returns only semantically-meaningful tokens", function() {
			var tok;

			text = "ask ¬ \n \"how are you?\" -- This is a comment";
			lexer = new Hyper.Lexer(text);

			tok = lexer.__assembleToken__();
			expect(tok.type).toEqual(Hyper.TokenType.ID);
			expect(tok.text).toEqual("ask");

			tok = lexer.__assembleToken__();
			expect(tok.type).toEqual(Hyper.TokenType.STRING);
			expect(tok.text).toEqual("\"how are you?\"");

			tok = lexer.__assembleToken__();
			expect(tok.type).toEqual(Hyper.TokenType.LINE_TERM);
			expect(tok.text).toEqual("");
		});

		describe("when given text ' ~~ test ~~ 1 * 2'", function() {
			beforeEach(function() {
				text = " ~~ test ~~ 1 * 2";
				lexer = new Hyper.Lexer(text);	
			});

			it("yields first a NUMBER token", function() {
				expect(lexer.__assembleToken__().type).toEqual(Hyper.TokenType.NUMBER);
			});

			it("yields second a SYMBOL token", function() {
				lexer.__assembleToken__();

				expect(lexer.__assembleToken__().type).toEqual(Hyper.TokenType.SYMBOL);
			});

			it("yields a token with the previous whitespace linked", function() {
				var tok = lexer.__assembleToken__();

				expect(tok.type).toEqual(Hyper.TokenType.NUMBER);
				expect(tok.specialToken).toBeDefined();
				expect(tok.specialToken.type).toEqual(Hyper.TokenType.WHITESPACE);
				expect(tok.specialToken.specialToken).toBeDefined();
				expect(tok.specialToken.specialToken.type).toEqual(Hyper.TokenType.COMMENT);
				expect(tok.specialToken.specialToken.specialToken).toBeDefined();
				expect(tok.specialToken.specialToken.specialToken.type).toEqual(Hyper.TokenType.WHITESPACE);
			});
		});

		describe("when given the text 'on mouseUp\nanswer \"hello, Hyper.js!\"\nend mouseUp'", function() {
			it("yields the only ID tokens, and one STRING token.", function() {
				var tok;
				var expectedTokenCount = 8;
				var actualTokenCount = 0;
				var types = [Hyper.TokenType.ID,
							 Hyper.TokenType.ID,
							 Hyper.TokenType.LINE_TERM,
							 Hyper.TokenType.ID,
							 Hyper.TokenType.STRING,
							 Hyper.TokenType.LINE_TERM,
							 Hyper.TokenType.ID,
							 Hyper.TokenType.ID];
				
				var texts = ["on", "mouseUp", '\n', "answer", '"hello, Hyper.js!"', "\n", "end", "mouseUp"];
				var lexer = new Hyper.Lexer('on mouseUp\nanswer "hello, Hyper.js!"\nend mouseUp');

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

	describe(".getToken", function() {
		expect(1).toEqual(2);
		// Something to the effect of "behaves like the above but drawing from buffer where applicable".
	});
});