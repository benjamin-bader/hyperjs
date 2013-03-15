ArityException = function(expected, actual) {
  this.message = "Expected " + expected + " arguments, got " + actual + ".";
};

UnknownIdentifierException = function(identifier) {
  this.message = "Unknown identifier '" + identifier + "'";
};

UnknownIdentifierException.prototype = Error;
ArityException.prototype = Error;

Environment = function() {
  this.last_subject = null;
  this.has_subject = false;

  this.set_subject = function(subject) {
    this.has_subject  = subject !== null;
    this.last_subject = subject;
  };

  this.get_subject() {
    return this.last_subject;
  };

  this.ask = function(prompt, okButtonName, cancelButtonName) {
    alert(prompt);
  };

  this.answer = function(prompt) {
    alert(prompt);
  };


};

OpCodes = {
  "PUSH":  { id =  0, operands: 1 },
  "POP":   { id =  1, operands: 0 },
  "DUP":   { id =  2, operands: 0 },
  "CMP":   { id =  3, operands: 0 },
  "ADD":   { id =  4, operands: 1 },
  "SUB":   { id =  5, operands: 1 },
  "MUL":   { id =  6, operands: 1 },
  "STO":   { id =  7, operands: 1 },
  "LOD":   { id =  8, operands: 1 },
  "CALL":  { id =  9, operands: 1 },
  "RET":   { id = 10, operands: 0 }
};

Keywords = {
  "put": true,
  "ask": true,
  "answer": true,
  "do": true,
  "while": true,
  "for": true,
  "to" : true,
  "repeat": true,
  "until": true,
  "call": true,
  "on": true,
  "function": true,
  "end": true,
  "pass": true,
  "tell": true,
  "is": true,
  "a": true,
  "first": true,
  "last": true,
  "word": true
};

Tokens = {
  "PUT":      { id =   0 }
  "PUT_INTO": { id =   1, value = "" },
  "ASK":      { id =   2 },
  "ANSWER":   { id =   3 }
};

Scope = function(parent_scope) {
  var parent = parent_scope;
  var locals = {};

  this.resolve_reference = function(reference) {
    var value = locals[reference];

    if (value) {
      return value;
    }

    return parent.resolve_reference(reference);
  }
};

Frame = function() {
  this.locals = {};
};

Intrinsics = (function(math) {
  this.abs = function(x) {
    return math.abs(x);
  };

  this.annuity = function(rate, periods) {
    return (1 - math.pow(1 + rate, -periods) / rate;
  };

  this.atan = function(x) {
    return math.atan(x);
  };

  this.average = function(values) {
    var total = 0;
    var len = values.length;

    for (var i = 0; i < len; ++i) {
      total += values[i];
    }

    return total / len;
  };

  this.charToNum = function(c) {
    if (typeof c === 'string') {

    }
    else if (typeof c === 'undefined') {
      
    }
  };

  this.sin = function(x) {
    return math.sin(x);
  };

  this.cos = function(x) {
    return math.cos(x);
  };

  this.tan = function(x) {
    return math.tan(x);
  };
})(Math);

NotEnoughOperandsError = function(code, expected, actual) {
  this.opcode = code;
  this.expected_operands = expected;
  this.actual_operands = actual;
};

StackUnderflowError = function() {

};

Runtime = (function(debug) {
  var stack = [];
  var lastValue = null;
  var globals = {};
  var callstack = [];

  var ensureStackHasOne = function() {
    if (stack.length < 1) {
      throw new StackUnderflowError();
    }
  };

  var resolveReference = function(ref) {

  };

  var call = function(target, addNewFrame) {
    addNewFrame = typeof addNewFrame !== 'undefined' ? addNewFrame : false;
  };

  this.declareLocal = function(scope, local) {
    // Something
  };

  this.execute = function(script, args) {
    for (var op in script) {
      var code_definition = OpCodes[op.code];
      
      if (debug) {
        if (op.operands.length < code_definition.operands) {
          throw new NotEnoughOperandsError(
            code_definition.operands, op.operands.length);
        }
      }

      switch (op.code) {
        case OpCodes.PUSH:
          stack.shift(op.operands[0]);
          break;
        case OpCodes.POP:
          ensureStackHasOne();
          stack.pop();
          break;
        case OpCodes.DUP:
          ensureStackHasOne();

      }
    }
  };

})();

Compiler = (function() {
  /*
    Kinds of statements:
    - do
    - if/then/else
    - put
    - loop
    - repeat
    - exit
  */



})();

HyperTalkScript = function(environment, owner, text) {
  this.arity = 0;
  this.text = text;
  this.is_handler = this.text.startsWith('on ');
  this.actions = [];

  this.variables = {};

  this.owner = owner;

  this.validate_arity = function(arguments) {
    if (arity != arguments.length) {
      throw new ArityException(this.arity, arguments.length);
    }


  };

  this.execute = function(environment, arguments) {

  };

  this.put_in_variable = function(name, value) {
    this.variables[name] = value;
  };

  this.get_variable = function(name) {

  }

  this.parse = function() {
    if (this.text.startsWith('on'))
    for (var line in this.lines()) {
      if (line.startsWith('put')) {
        // TODO: put
      }
      else if (line.startsWith('ask')) {
        // TODO: ask
      }
      else if (line.startsWith('answer')) {
        // TODO: answer
      }
      else if (line.startsWith('go')) {
        // TODO: go
      }

    }
  };
};

BaseObject = function() {
  var message_handlers = {};


  this.get = function(prop) {
    return this.prop;
  };

  this.set = function(prop, value) {
    this.prop = value;
  };

  this.build_message_heirarchy = function() {
    return [this];
  }

  this.add_handler = function(message, script) {
    message_handlers[message] = script;
  };

  this.remove_handler = function(message) {
    delete message_handlers[message];
  };

  this.handles_message = function(message) {
    return this.message_handlers[message] != undefined;
  };

  this.send = function(message, args) {
    if (!this.handles_message(message)) {
      return false;
    }

    var handler = this.message_handlers[message];


  };
};

Background = function() {
  this.prototype = BaseObject;
};

Card = function() {
  this.prototype = BaseObject;
};

Hypercard = (function() {
  var objects_by_id = [];
  var object_ids_by_name = {};
  var cards = [];
  var cards_by_name = {};
  var backgrounds = [];
  var backgrounds_by_name = {};
  var stacks = [];
  var stacks_by_name = {};

  var card_width = 280;
  var card_height = 180;

  var build_message_heirarchy_from_object(obj) {
    var card = obj.card;
    var bgnd = card.background;
    var stack = bgnd.stack;
    var home = home_stack;

    return [obj, card, bgnd, stack, home, this];
  };

  this.sendMessage = function(message, args) {
    if (message == '' || typeof message === 'undefined') {
      // Null message - what to do?  Default to nothing for now.
    }

    args = typeof args !== 'undefined' ? args : [];
  };

  this.ask = function(prompt, accept, reject) {
    // Prompt the user.
    return ''; // Actually, return what the user entered!
  };

  this.answer = function(prompt) {
    alert(prompt);
  };

Lexer = function(script) {
  var len = script.length;

  
};

(function() {
  var t = new Trie();

  for (var kw in KEYWORDS) {
    t.add(kw);
  }

  Lexer.prototype.KEYWORD_TRIE = t;
})();

}) ();