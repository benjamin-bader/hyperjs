describe("Hyper.Script.Span", function() {
  var startLine, startCol, endLine, endCol;
  var span;

  beforeEach(function() {
    startLine = 1;
    startCol = 1;
    endLine = 5;
    endCol = 5;

    span = new Hyper.Script.Span(startLine, startCol, endLine, endCol);
  });

  it("is defined", function() {
    expect(typeof Hyper.Script.Span).toBe('function');
  });

  it("takes start line, start col, end line, end col as constructor params", function() {
    expect(span.getStartLine()).toBe(startLine);
    expect(span.getStartCol()).toBe(startCol);
    expect(span.getEndLine()).toBe(endLine);
    expect(span.getEndCol()).toBe(endCol);
  });

  it("is new-safe", function() {
    var nonNewSpan = Hyper.Script.Span(startLine, startCol, endLine, endCol);
    expect(nonNewSpan instanceof Hyper.Script.Span).toBeTruthy();
  });
});
