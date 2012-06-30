describe("StringReader", function() {
	it("exists in Hyperjs", function() {
		expect(Hyperjs).toBeDefined();
		expect(Hyperjs).not.toBeNull();

		expect(Hyperjs.StringReader).not.toBeNull();
		expect(Hyperjs.StringReader).toBeDefined();
		expect(typeof Hyperjs.StringReader).toBe("function");
	});

	it("has 1-based column numbering", function() {
		expect(new Hyperjs.StringReader("a").column()).toEqual(1);
	});

	it("has 1-based line numbering", function() {
		expect(new Hyperjs.StringReader("x").line()).toEqual(1);
	});

	describe(".isEOF", function() {
		it("returns true when all input has been exhausted", function() {
			var reader = new Hyperjs.StringReader("a");

			expect(reader.isEOF()).toBe(false);
			reader.readNextChar();
			expect(reader.isEOF()).toBe(true);
		});
	});

	describe(".reset", function() {
		describe("when .mark has not been called", function() {
			it("returns the reader to its initial state", function() {
				var reader = new Hyperjs.StringReader("a\nc");

				expect(reader.isEOF()).toBe(false);
				expect(reader.column()).toBe(1);
				expect(reader.line()).toBe(1);

				reader.readNextChar();
				reader.readNextChar();
				reader.readNextChar();

				expect(reader.isEOF()).toBe(true);
				expect(reader.column()).toEqual(2);
				expect(reader.line()).toEqual(2);

				reader.reset();

				expect(reader.isEOF()).toBe(false);
				expect(reader.column()).toBe(1);
				expect(reader.line()).toBe(1);
			});

			it("has no effect if the reader is in its initial state", function() {
				var reader = new Hyperjs.StringReader("ab");

				expect(reader.isEOF()).toBe(false);
				expect(reader.column()).toBe(1);
				expect(reader.line()).toBe(1);

				reader.reset();

				expect(reader.isEOF()).toBe(false);
				expect(reader.column()).toBe(1);
				expect(reader.line()).toBe(1);
			});
		});

		describe("when a position has been marked", function() {
			it("returns the reader to the marked line and column", function() {
				var text = "ab\ncd\nef";
				var reader = new Hyperjs.StringReader(text);

				reader.readNextChar();
				reader.readNextChar();
				reader.readNextChar();
				reader.readNextChar();

				expect(reader.line()).toEqual(2);
				expect(reader.column()).toEqual(1);

				reader.mark();

				reader.readNextChar();
				reader.readNextChar();
				reader.readNextChar();
				reader.readNextChar();

				expect(reader.line()).toEqual(3);
				expect(reader.column()).toEqual(2);

				reader.reset();

				expect(reader.line()).toEqual(2);
				expect(reader.column()).toEqual(1);
			});

			describe("and the reader is at the marked position", function() {
				it("has no effect", function() {
					var reader = new Hyperjs.StringReader("abcd");

					reader.readNextChar();
					reader.readNextChar();

					expect(reader.column()).toEqual(3);
					
					reader.mark();
					reader.reset();

					expect(reader.column()).toEqual(3);
				});
			});
		});
	});

	describe(".readNextChar", function() {
		var reader;

		var nc = function() {
			reader.readNextChar();
		};

		it("reads characters from a string one at a time", function() {
			reader = new Hyperjs.StringReader("asdf");

			expect(nc()).toEqual("a");
			expect(nc()).toEqual("s");
			expect(nc()).toEqual("d");
			expect(nc()).toEqual("f");
		});

		it("returns the empty string when input has been exhausted", function() {
			reader = new Hyperjs.StringReader("a");

			expect(nc()).toEqual("a");
			expect(nc()).toEqual("");
		});

		it("tracks column numbers across reads", function() {
			reader = new Hyperjs.StringReader("abcd");

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
			reader = new Hyperjs.StringReader("asdf\njkl;");

			expect(reader.line()).toEqual(1);
			nc();
			nc();
			nc();
			nc();

			expect(nc()).toEqual("\n");
			expect(reader.line()).toEqual(2);
		});

		it("sets the column back to 1 when the line increments", function() {
			reader = new Hyperjs.StringReader("a\nb\n");

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
			reader = new Hyperjs.StringReader("\u2028");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\u2029' as a newline", function() {
			reader = new Hyperjs.StringReader("\u2029");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\n' as a newline", function() {
			reader = new Hyperjs.StringReader("\r");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\r' as a newline", function() {
			reader = new Hyperjs.StringReader("\r");

			expect(reader.line()).toEqual(1);
			nc();
			expect(reader.line()).toEqual(2);
		});

		it("treats '\\r\\n' as a single newline", function() {
			reader = new Hyperjs.StringReader("\r\n");

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

	describe(".read", function() {
		it("fills a buffer with a number of characters", function() {
			var reader = new Hyperjs.StringReader("abcdefg");
			var buf = "";

			reader.read(buf, 3);
			expect(buf).toEqual("abc");
		});

		it("returns the number of characters read", function())
	});
});