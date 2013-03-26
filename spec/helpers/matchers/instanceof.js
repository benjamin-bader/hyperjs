beforeEach(function() {
  this.addMatchers({
    toBeAnInstanceOf: function(constructor) {
      return this.actual instanceof constructor;
    }
  });
});

