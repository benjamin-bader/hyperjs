var Tok = hjs.Token;

describe("Token", function() {
	expect(Tok.LINE_TERM).toBeDefined();
	expect(Tok.STRING).toBeDefined();
	expect(Tok.NUMBER).toBeDefined();
	expect(Tok.ID).toBeDefined();
	expect(Tok.SYMBOL).toBeDefined();
	expect(Tok.COMMENT).toBeDefined();
	expect(Tok.CONTINUATOR).toBeDefined();
	expect(Tok.WHITESPACE).toBeDefined();

	it("remembers its position in the source text", function() {
		var t = new Tok("")
	});
});