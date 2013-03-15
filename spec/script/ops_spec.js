describe("HyperTalk Operators", function() {
  var Ops = Hyper.Script.Ops;
  var Prec = Hyper.Script.Precedence;

  it("are defined", function() {
    expect(Ops).toBeDefined();
  });

  it("have defined precedences", function() {
    expect(Prec).toBeDefined();
  });

  it("are represented by a numeric enum", function() {
    for (var key in Ops) {
      var op = Ops[key];
      expect(typeof op).toBe('number');
    }
  });

  it("all have a numeric precedence", function() {
    for (var key in Ops) {
      var op = Ops[key];
      var p = Prec[op];
      expect(typeof p).toBe('number');
    }
  });
});
