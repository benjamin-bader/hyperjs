var Tok = Hyper.Script.TokenType;

describe("Token", function() {
	it("has defined token types", function() {
		expect(Tok.LINE_TERM).toBeDefined();
		expect(Tok.STRING).toBeDefined();
		expect(Tok.NUMBER).toBeDefined();
		expect(Tok.ID).toBeDefined();
		expect(Tok.SYMBOL).toBeDefined();
		expect(Tok.COMMENT).toBeDefined();
		expect(Tok.CONTINUATOR).toBeDefined();
		expect(Tok.WHITESPACE).toBeDefined();
	});
});