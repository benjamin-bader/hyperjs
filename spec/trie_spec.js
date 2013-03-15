describe("Trie", function() {
  describe(".getHeight", function() {
    it("returns one for an empty Trie", function() {
      var t = new Hyper.Trie();
      expect(t.getHeight()).toEqual(1);
    });

    it("returns the number of characters of the longest word stored, plus one", function() {
      var t = new Hyper.Trie();

      t.addWord("a");
      t.addWord("bb");
      t.addWord("eros");
      t.addWord("barbados");

      expect(t.getHeight()).toEqual("barbados".length + 1);
      expect(t.children[0].getHeight()).toEqual(1);
      expect(t.children[1].getHeight()).toEqual("barbados".length);
      expect(t.children[4].getHeight()).toEqual(4);
    });
  });

  describe(".addWord", function() {
    var trie;

    beforeEach(function() {
      trie = new Hyper.Trie();
    });

    it("adds words to the trie.", function() {
      trie.addWord("barbary");
      trie.addWord("barbarian");
      trie.addWord("barbarism");
      trie.addWord("racism");

      expect(trie.lookup("barbary")).toBe(true);
      expect(trie.lookup("barbarian")).toBe(true);
      expect(trie.lookup("barbarism")).toBe(true);
      expect(trie.lookup("racism")).toBe(true);

      expect(trie.lookup("ablism")).toBe(false);
      expect(trie.lookup("barbell")).toBe(false);
    });

    it("is idempotent", function() {

    });

    describe("when .getHeight() has been called", function() {
      beforeEach(function() {
        trie.getHeight();
      });

      it("raises an Error.", function() {
        function shouldThrow() {
          trie.addWord("foo");
        }

        expect(shouldThrow).toThrow();
      });

      it("raises an error with an informative message.", function() {
        try {
          trie.addWord("foo");
          fail();
        } catch (e) {
          expect(e.message).toMatch(/Adding is already complete/i);
        }
      });
    });
  });

  describe(".freeze", function() {
    var trie;

    beforeEach(function() {
      trie = new Hyper.Trie();

      trie.addWord("barbary");
      trie.addWord("barbarian");
      trie.addWord("barbarism");
      trie.addWord("racism");
    });

    it("returns a frozen Trie", function() {
      expect(trie.freeze() instanceof Hyper.Trie.Frozen).toBe(true);
    });

    it("returns a trie that responds to .lookup identically to the source trie.", function() {
      expect(trie.lookup("barbary")).toBe(true);
      expect(trie.lookup("barbarian")).toBe(true);
      expect(trie.lookup("barbarism")).toBe(true);
      expect(trie.lookup("racism")).toBe(true);

      expect(trie.lookup("ablism")).toBe(false);
      expect(trie.lookup("barbell")).toBe(false);

      var frozen = trie.freeze();

      expect(frozen.lookup("barbary")).toBe(true);
      expect(frozen.lookup("barbarian")).toBe(true);
      expect(frozen.lookup("barbarism")).toBe(true);
      expect(frozen.lookup("racism")).toBe(true);

      expect(frozen.lookup("ablism")).toBe(false);
      expect(frozen.lookup("barbell")).toBe(false);
    });
  });
});