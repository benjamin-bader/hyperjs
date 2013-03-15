describe("StringReader", function() {
  it("exists in Hyper", function() {
    expect(Hyper).toBeDefined();
    expect(Hyper).not.toBeNull();

    expect(Hyper.Script.StringReader).not.toBeNull();
    expect(Hyper.Script.StringReader).toBeDefined();
    expect(typeof Hyper.Script.StringReader).toBe("function");
  });

  it("has 1-based column numbering", function() {
    expect(new Hyper.Script.StringReader("a").getColumn()).toEqual(1);
  });

  it("has 1-based line numbering", function() {
    expect(new Hyper.Script.StringReader("x").getLine()).toEqual(1);
  });

  describe(".isEOF", function() {
    it("returns true when all input has been exhausted", function() {
      var reader = new Hyper.Script.StringReader("a");

      expect(reader.isEOF()).toBe(false);
      reader.readNextChar();
      expect(reader.isEOF()).toBe(true);
    });
  });

  describe(".reset", function() {
    describe("when .mark has not been called", function() {
      it("returns the reader to its initial state", function() {
        var reader = new Hyper.Script.StringReader("a\nc");

        expect(reader.isEOF()).toBe(false);
        expect(reader.getColumn()).toBe(1);
        expect(reader.getLine()).toBe(1);

        reader.readNextChar();
        reader.readNextChar();
        reader.readNextChar();

        expect(reader.isEOF()).toBe(true);
        expect(reader.getColumn()).toEqual(2);
        expect(reader.getLine()).toEqual(2);

        reader.reset();

        expect(reader.isEOF()).toBe(false);
        expect(reader.getColumn()).toBe(1);
        expect(reader.getLine()).toBe(1);
      });

      it("has no effect if the reader is in its initial state", function() {
        var reader = new Hyper.Script.StringReader("ab");

        expect(reader.isEOF()).toBe(false);
        expect(reader.getColumn()).toBe(1);
        expect(reader.getLine()).toBe(1);

        reader.reset();

        expect(reader.isEOF()).toBe(false);
        expect(reader.getColumn()).toBe(1);
        expect(reader.getLine()).toBe(1);
      });
    });

    describe("when a position has been marked", function() {
      it("returns the reader to the marked line and column", function() {
        var text = "ab\ncd\nef";
        var reader = new Hyper.Script.StringReader(text);

        reader.readNextChar();
        reader.readNextChar();
        reader.readNextChar();

        expect(reader.getLine()).toEqual(2);
        expect(reader.getColumn()).toEqual(1);

        reader.mark();

        reader.readNextChar();
        reader.readNextChar();
        reader.readNextChar();
        reader.readNextChar();

        expect(reader.getLine()).toEqual(3);
        expect(reader.getColumn()).toEqual(2);

        reader.reset();

        expect(reader.getLine()).toEqual(2);
        expect(reader.getColumn()).toEqual(1);
      });

      describe("and the reader is at the marked position", function() {
        it("has no effect", function() {
          var reader = new Hyper.Script.StringReader("abcd");

          reader.readNextChar();
          reader.readNextChar();

          expect(reader.getColumn()).toEqual(3);
          
          reader.mark();
          reader.reset();

          expect(reader.getColumn()).toEqual(3);
        });
      });
    });
  });

  describe(".readNextChar", function() {
    var reader;

    var nc = function() {
      return reader.readNextChar();
    };

    it("reads characters from a string one at a time", function() {
      reader = new Hyper.Script.StringReader("asdf");

      expect(nc()).toEqual("a");
      expect(nc()).toEqual("s");
      expect(nc()).toEqual("d");
      expect(nc()).toEqual("f");
    });

    it("returns the empty string when input has been exhausted", function() {
      reader = new Hyper.Script.StringReader("a");

      expect(nc()).toEqual("a");
      expect(nc()).toEqual("");
    });

    it("tracks column numbers across reads", function() {
      reader = new Hyper.Script.StringReader("abcd");

      expect(reader.getColumn()).toEqual(1);
      
      expect(nc()).toEqual("a");
      expect(reader.getColumn()).toEqual(2);

      expect(nc()).toEqual("b");
      expect(reader.getColumn()).toEqual(3);

      expect(nc()).toEqual("c");
      expect(reader.getColumn()).toEqual(4);

      expect(nc()).toEqual("d");
    });

    it("tracks line numbers across reads", function() {
      reader = new Hyper.Script.StringReader("asdf\njkl;");

      expect(reader.getLine()).toEqual(1);
      nc();
      nc();
      nc();
      nc();

      expect(nc()).toEqual("\n");
      expect(reader.getLine()).toEqual(2);
    });

    it("sets the column back to 1 when the line increments", function() {
      reader = new Hyper.Script.StringReader("a\nb\n");

      expect(nc()).toEqual("a");
      expect(reader.getLine()).toEqual(1);
      expect(reader.getColumn()).toEqual(2);

      expect(nc()).toEqual("\n");
      expect(reader.getLine()).toEqual(2);
      expect(reader.getColumn()).toEqual(1);

      expect(nc()).toEqual("b");
      expect(reader.getLine()).toEqual(2);
      expect(reader.getColumn()).toEqual(2);

      expect(nc()).toEqual("\n");
      expect(reader.getLine()).toEqual(3);
      expect(reader.getColumn()).toEqual(1);
    });

    it("treats '\\u2028' as a newline", function() {
      reader = new Hyper.Script.StringReader("\u2028");

      expect(reader.getLine()).toEqual(1);
      nc();
      expect(reader.getLine()).toEqual(2);
    });

    it("treats '\\u2029' as a newline", function() {
      reader = new Hyper.Script.StringReader("\u2029");

      expect(reader.getLine()).toEqual(1);
      nc();
      expect(reader.getLine()).toEqual(2);
    });

    it("treats '\\n' as a newline", function() {
      reader = new Hyper.Script.StringReader("\r");

      expect(reader.getLine()).toEqual(1);
      nc();
      expect(reader.getLine()).toEqual(2);
    });

    it("treats '\\r' as a newline", function() {
      reader = new Hyper.Script.StringReader("\r");

      expect(reader.getLine()).toEqual(1);
      nc();
      expect(reader.getLine()).toEqual(2);
    });

    it("treats '\\r\\n' as a single newline", function() {
      reader = new Hyper.Script.StringReader("\r\n");

      expect(reader.getLine()).toEqual(1);
      expect(reader.getColumn()).toEqual(1);

      expect(nc()).toEqual("\r");
      expect(reader.getLine()).toEqual(2);
      expect(reader.getColumn()).toEqual(1);

      expect(nc()).toEqual("\n");
      expect(reader.getLine()).toEqual(2);
      expect(reader.getColumn()).toEqual(1);
    });
  });

  describe(".read", function() {
    var reader;

    beforeEach(function() {
      reader = new Hyper.Script.StringReader("Now is the time for all good men to come to the aid of their country.");
    });

    it("reads an arbitrarily-sized chunk of the input starting at the current position", function() {
      expect(reader.read(6)).toEqual("Now is");
    });

    it("tracks line and column positions as does .readNextChar", function() {
      expect(reader.read(10)).toEqual("Now is the");
      expect(reader.getColumn()).toEqual(11);
    });
  });
});