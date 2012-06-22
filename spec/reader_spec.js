describe("StringReader", function() {
	it("exists in hyperjs", function() {
		expect(hyperjs).not.toBeUndefined();
		expect(hyperjs).not.toBeNull();

		expect(hyperjs.StringReader).not.toBeNull();
		expect(hyperjs.StringReader).not.toBeUndefined();
		expect(typeof hyperjs.StringReader).toBe("function");
	});

	it("has 1-based column numbering", function() {
		expect(new hyperjs.StringReader("a").column()).toEqual(1);
	});

	it("has 1-based line numbering", function() {
		expect(new hyperjs.StringReader("x").line()).toEqual(1);
	});

	describe(".readNextChar", function() {
		var reader;

		var nc = function() {
			reader.readNextChar();
		};

		it("reads characters from a string one at a time", function() {
			reader = new hyperjs.StringReader("asdf");

			expect(nc()).toEqual("a");
			expect(nc()).toEqual("s");
			expect(nc()).toEqual("d");
			expect(nc()).toEqual("f");
		});

		it("returns the empty string when input has been exhausted", function() {
			reader = new hyperjs.StringReader("a");

			expect(nc()).toEqual("a");
			expect(nc()).toEqual("");
		});

		it("tracks column numbers across reads", function() {
			reader = new hyperjs.StringReader("abcd");

			expect(reader.column()).toEqual(1);
			
			expect(nc()).toEqual("a");
			expect(reader.column()).toEqual(2);

			expect(nc()).toEqual("b");
			expect(reader.column()).toEqual(3);

			expect(nc()).toEqual("c");
			expect(reader.column()).toEqual(4);

			expect(nc()).toEqual("d");
		});

		it("tracks line numbers across reads", function() {
			reader = new hyperjs.StringReader("asdf\njkl;");

			expect(reader.line()).toEqual(1);
			nc();
			nc();
			nc();
			nc();

			expect(nc()).toEqual("\n");
			expect(reader.line()).toEqual(2);
		});

		it("sets the column back to 1 when the line increments", function() {
			reader = new hyperjs.StringReader("a\nb\n");

			expect(nc()).toEqual("a");
			expect(reader.line()).toEqual(1);
			expect(reader.column()).toEqual(2);

			expect(nc()).toEqual("\n");
			expect(reader.line()).toEqual(2);
			expect(reader.column()).toEqual(1);

			expect(nc()).toEqual("b");
			expect(reader.line()).toEqual(2);
			expect(reader.column()).toEqual(2);

			expect(nc()).toEqual("\n");
			expect(reader.line()).toEqual(3);
			expect(reader.column()).toEqual(1);
		});

		it("treats '\\u2028' as a newline", function() {
			reader = new hyperjs.StringReader("\u2028");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\u2029' as a newline", function() {
			reader = new hyperjs.StringReader("\u2029");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\n' as a newline", function() {
			reader = new hyperjs.StringReader("\r");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\r' as a newline", function() {
			reader = new hyperjs.StringReader("\r");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\r\\n' as a single newline", function() {
			reader = new hyperjs.StringReader("\r\n");

			expect(reader.line()).toEqual(1);
			expect(reader.column()).toEqual(1);

			expect(nc()).toEqual("\r");
			expect(reader.line()).toEqual(2);
			expect(reader.column()).toEqual(1);

			expect(nc()).toEqual("\n");
			expect(reader.line()).toEqual(2);
			expect(reader.column()).toEqual(1);
		});
	});
});