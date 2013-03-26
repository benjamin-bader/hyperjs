describe("Hyper.Script.Parser", function() {
  it("is a function", function() {
    expect(typeof Hyper.Script.Parser).toBe('function');
  });

  it("is new-agnostic", function() {
    var nonNewParser = Hyper.Script.Parser("script");
    expect(nonNewParser).toBeAnInstanceOf(Hyper.Script.Parser);
  });

  it("can read lexer tokens", function() {
    var script = "ident 1.23";
    var parser = new Hyper.Script.Parser(script);

    var tokOne = parser.getIdentifier();
    var tokTwo = parser.getNumber();

    expect(tokOne.type).toBe(Hyper.Script.TokenType.ID);
    expect(tokOne.text).toBe("ident");

    expect(tokTwo.type).toBe(Hyper.Script.TokenType.NUMBER);
    expect(tokTwo.text).toBe("1.23");
  });

  it("can read message handlers with empty bodies", function() {
    var script = "on messageName\nend messageName";
    var parser = new Hyper.Script.Parser(script);
    var handler = parser.parseMessageHandlerDefinition();

    expect(handler).not.toBeNull();
    expect(handler).toBeAnInstanceOf(Hyper.Script.Ast.MessageHandlerNode);
    expect(handler.getName()).toBe("messageName");
  });

  describe("can read message handlers with parameters", function() {
    it("that are comma-separated", function() {
      var script = "on messageNameCommas paramOne, paramTwo\nend messageNameCommas";
      var parser = new Hyper.Script.Parser(script);
      var handler = parser.parseMessageHandlerDefinition();

      expect(handler).not.toBeNull();
      expect(handler).toBeAnInstanceOf(Hyper.Script.Ast.MessageHandlerNode);
      expect(handler.getName()).toBe("messageNameCommas");
      expect(handler.getArgs().length).toBe(2);
      expect(handler.getArgs()[0]).toBe("paramOne");
      expect(handler.getArgs()[1]).toBe("paramTwo");
    });

    it("that are not comma-separated", function() {
      var script = "on messageNameNoCommas paramOne paramTwo\nend messageNameNoCommas";
      var parser = new Hyper.Script.Parser(script);
      var handler = parser.parseMessageHandlerDefinition();

      expect(handler).not.toBeNull();
      expect(handler).toBeAnInstanceOf(Hyper.Script.Ast.MessageHandlerNode);
      expect(handler.getName()).toBe("messageNameNoCommas");
      expect(handler.getArgs().length).toBe(2);
      expect(handler.getArgs()[0]).toBe("paramOne");
      expect(handler.getArgs()[1]).toBe("paramTwo");
    });
  });

  it("can read message handlers that have single-statment bodies", function() {
    var script = 'on msg\n  put "hello"\nend msg';
    var parser = new Hyper.Script.Parser(script);
    var handler = parser.parseMessageHandlerDefinition();

    expect(handler).not.toBeNull();
    expect(handler.getName()).toBe("msg");
  });
});
