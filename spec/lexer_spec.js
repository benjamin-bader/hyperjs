describe("Lexer", function() {
	it("should lex ALL THE STRINGS!!!!", function() {
		expect(true).toBe(false);
	});

	describe("when given a string containing a valid identifier", function() {
		it("returns token of type ID", function() {
			var source = "idOfMe";
			var lexer = new hjs.Lexer(source);
			var token = lexer.nextToken();

			expect(token).not.toBeNull();
			expect(token.type()).toEqual(hjs.TokenType.ID);
			expect(token.text()).toEqual("idOfMe");
			expect(token.source()).toEqual(source);
		});
	});

	describe("when given a string containing an integer number", function() {
		it("returns a token of type NUMBER", function() {
			var source = "1234";
		});
	});

	describe("__readNumber__", function() {
		var lexer;
		describe("when given the string '123'", function() {
			var text = "123";

			beforeEach(function() {
				lexer = new hjs.Lexer(text);
				lexer.reader.mark();
				lexer.reader.readNextChar();
			});

			it("yields a token of type Number", function() {
				expect(lexer.__readNumber__("1").type).toEqual(hjs.TokenType.NUMBER);
			});

			it ("yields a token with the text '123'", function() {
				expect(lexer.__readNumber__("1").text).toEqual(text);
			});
		});

		describe("when given the string '0'", function() {
			it("yields a token of type Number", function() {

			});

			it("yields a token with the text '0'", function() {

			});
		});

		describe("when given the string '0.1'", function() {
			it("yields a token of type Number", function() {

			});

			it("yields a token with the text '0.1'", function() {

			});
		});

		describe("when given the string '.1'", function() {
			it("yields a token of type Number", function() {

			});

			it("yields a token with the text '.1'", function() {

			});
		});

		describe("when given the string '1e10'", function() {
			it("yields a token of type Number", function() {

			});

			it("yields a token with the text '1e10'", function() {

			});
		});

		describe("when given the string '1e-2'", function() {
			it("yields a token of type Number", function() {

			});

			it("yields a token with the text '1e-2'", function() {

			});
		});
	});

	describe("__nextToken__", function() {
		describe("when given the string 'asdf'", function() {
			var text = "asdf";
			var lexer;

			beforeEach(function() {
				lexer = new hjs.Lexer(text);
			});

			it("yields a token of type ID", function() {
				expect(lexer.__nextToken__().type).toEqual(hjs.TokenType.ID);
			});

			it("yields a token containing the text 'asdf'", function() {
				expect(lexer.__nextToken__().text).toEqual("asdf");
			});

			describe("and when called twice", function() {
				it("yields an ID token and a LINE_TERM token", function() {
					expect(lexer.__nextToken__().type).toEqual(hjs.TokenType.ID);
					expect(lexer.__nextToken__().type).toEqual(hjs.TokenType.LINE_TERM);
				});

				it("yields a second token with an empty string for text", function() {
					lexer.__nextToken__();
					expect(lexer.__nextToken__().text).toEqual("");
				});
			});
		});

		describe("when given the string '1.23'", function() {
			it("yields a token of type NUMBER", function() {

			});

			it("yields a token containing the text '1.23'.", function() {

			});
		});

		describe("when given the string '.08", function() {

		});
	});
});