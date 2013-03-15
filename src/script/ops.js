(function(hs, undefined) {
  "use strict";

  /**
   * Enum of HyperTalk operators.
   * @enum {number}
   */
  var Ops = {
    PLUS: 0,
    MINUS: 1,
    MUL: 2,
    DIV: 3,
    STRCAT: 4,
    EXP: 5,
    EQ: 6,
    LT: 7,
    GT: 8,
    NEQ: 9,
    LTE: 10,
    GTE: 11,
    OR: 12,
    CONTAINS: 13,
    NOTCONTAINS: 14,
    MOD: 15,
    IS: 16,
    ISNOT: 17,
    ISA: 18,
    ISNOTA: 19,
    NEG: 20,
    NOT: 21,
    STRCATSPC: 22
  };

  /**
   * An operator-precedence lookup table.
   * @const
   */
  var Precedence = (function() {
    var p = {};
    p[Ops.NEG] = 1;
    p[Ops.NOT] = 1;

    p[Ops.EXP] = 2;

    p[Ops.MUL] = 3;
    p[Ops.DIV] = 3;
    p[Ops.MOD] = 3;

    p[Ops.PLUS] = 4;
    p[Ops.MINUS] = 4;

    p[Ops.STRCAT] = 5;
    p[Ops.STRCATSPC] = 5;

    p[Ops.CONTAINS] = 6;
    p[Ops.NOTCONTAINS] = 6;
    p[Ops.LT] = 6;
    p[Ops.LTE] = 6;
    p[Ops.GT] = 6;
    p[Ops.GTE] = 6;

    p[Ops.ISA] = 7;
    p[Ops.ISNOTA] = 7;

    p[Ops.IS] = 8;
    p[Ops.ISNOT] = 8;
    p[Ops.EQ] = 8;
    p[Ops.NEQ] = 8;

    p[Ops.AND] = 9;

    p[Ops.OR] = 10;

    var precedenceArray = new Array(Object.size(Ops));

    for (var opName in Ops) {
      var op = Ops[opName];
      precedenceArray[op] = p[op];
    }

    return precedenceArray;
  })();

  hs.Ops = Ops;
  hs.Precedence = Precedence;

})(Hyper.Script);
