describe("Array.prototype", function() {
	describe(".map", function() {
		it("should be defined", function() {
			expect(Array.prototype.map).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.map).toBe('function');
		});

		it("applies each element of the array to a mapping function, returning a new array composed of the results", function() {
			var arr = [2, 4, 6, 8, 10];

			expect(arr.map(function(x) { return (x + 1).toString(); })).toEqual(["3", "5", "7", "9", "11"]);
		});
	});

	describe(".zip", function() {
		it("should be defined", function() {
			expect(Array.prototype.zip).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.zip).toBe('function');
		});

		it("combines two arrays into one array of tuples", function() {
			var arrayOne = [1, 2, 3, 4, 5, 6];
			var arrayTwo = [7, 8, 9, 10, 11, 12];

			expect(arrayOne.zip(arrayTwo)).toEqual([[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]]);
		});

		it("accepts a mapping function whose output is used in place of tuples", function() {
			var arrayOne = [1, 2, 3, 4, 5, 6];
			var arrayTwo = [7, 8, 9, 10, 11, 12];
			var mapfn = function(x, y) { return x + y; };

			expect(arrayOne.zip(arrayTwo, mapfn)).toEqual([8, 10, 12, 14, 16, 18]);
		});

		it("accepts a parameter to use as the value of 'this' inside of a given mapping function", function() {
			var arrayOne = [1, 2, 3, 4, 5, 6];
			var arrayTwo = [7, 8, 9, 10, 11, 12];
			var thisArg = { value: 10 };
			var mapfn = function(x, y) { return x + y + this.value; };

			expect(arrayOne.zip(arrayTwo, mapfn, thisArg)).toEqual([18, 20, 22, 24, 26, 28]);
		});
	});

	describe(".max", function() {
		it("should be defined", function() {
			expect(Array.prototype.max).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.max).toBe('function');
		});

		it("returns the largest element in the array, using default greater-than comparison", function() {
			var array = [1, 2, 3, 4, 5];
			expect([1,2,3,4,5].max()).toEqual(5);
			expect([5,4,3,2,1].max()).toEqual(5);
			expect([1,2,5,3,4].max()).toEqual(5);

			expect([undefined, undefined, 5].max()).toEqual(5);
			expect([undefined, undefined, -10].max()).toEqual(-10);
		});

		describe("when given an optional comparison function", function() {
			it("applies it to each element of the array", function() {
				var array = [1, 2, 3, 4, -5];
				var cmp = function(x, y) {
					var tx = typeof x,
						ty = typeof y;

					if (tx === 'undefined' && ty === 'undefined') {
						return 0;
					} else if (tx === 'undefined') {
						return -1;
					} else if (ty === 'undefined') {
						return 1;
					}

					var xx = Math.abs(x),
						yy = Math.abs(y);

					if (xx < yy) {
						return -1;
					} else if (xx > yy) {
						return 1;
					} else {
						return 0;
					}
				};

				expect(array.max(cmp)).toEqual(-5);
			});
		});
	});

	describe(".reduce", function() {
		it("should be defined", function() {
			expect(Array.prototype.reduce).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.reduce).toBe('function');
		});

		it("accepts a callback taking an accumulator, an element, the element's index, and the array itself", function() {
			var arr = [1, 2, 3];
			var fn = function(acc, n, i, a) {
				expect(a).toBe(arr);
				expect(a[i]).toEqual(n);
				expect(i).toEqual(acc + 1);

				return i;
			};

			arr.reduce(fn, -1);
		});

		it("is a standard left-fold operation, applying an accumulator and each element to a given function.", function() {
			var arr = [1, 2, 3, 4, 5];
			var timesCalled = 0;
			var fn = function(acc, n) { ++timesCalled; acc.push(n); return acc; }; // The identity function for left-reduce

			expect(arr.reduce(fn, [])).toEqual([1, 2, 3, 4, 5]);
			expect(timesCalled).toEqual(arr.length);
		});

		describe("when the array is empty", function() {
			it("returns the given seed value", function() {
				var arr = [];
				var blowup = function() { throw new Error("should not be called!"); };
				
				expect(arr.reduce(blowup)).not.toBeDefined();
				expect(arr.reduce(blowup, "seed")).toEqual("seed");
			});
		});

		describe("when the array has one element", function() {
			it("calls the given function with the seed as an accumulator, even if seed is undefined (i.e. not given)", function() {
				var arr = ["x"];
				var cb = { fn: function(acc, el) { return (acc || "asdf") + el; } };

				spyOn(cb, 'fn').andCallThrough();

				expect(arr.reduce(cb.fn)).toEqual("asdfx");
				expect(cb.fn).toHaveBeenCalledWith(undefined, "x", 0, arr);

				expect(arr.reduce(cb.fn, "y")).toEqual("yx");
				expect(cb.fn).toHaveBeenCalledWith("y", "x", 0, arr);
			});
		});

		describe("when no seed is given", function() {
			it("uses the first element of the array as a seed", function() {
				var arr = [1, 2];
				var cb = {
					fn: function(acc, n) {
						return acc + n;
					}
				};

				spyOn(cb, 'fn').andCallThrough();
				
				expect(arr.reduce(cb.fn)).toEqual(3);
				expect(cb.fn).toHaveBeenCalledWith(1, 2, 1, arr);
				expect(cb.fn.callCount).toEqual(1);
			});
		});
	});

	describe(".all", function() {
		it("should be defined", function() {
			expect(Array.prototype.all).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.all).toBe('function');
		});

		describe("when given a predicate function", function() {
			describe("which returns true for all elements", function() {
				it("returns true", function() {
					var arr = [1, 2, 3];
					expect(arr.all(function(x) { return x > 0; })).toBe(true);
				});
			});

			describe("which is not satisfied by all elements", function() {
				it("returns false", function() {
					var arr = [1, 2, 3, 4, -5];
					expect(arr.all(function(x) { return x > 0; })).toBe(false);
				});
			});
		});

		it("accepts a predicate function and, optionally, an object to be used as 'this' within the predicate", function() {
			var self = { cutoff: 2 };
			var arr = [3, 4, 5];

			arr.cutoff = 10;
			
			expect(arr.all(function(x) { expect(this).toBe(self); return x > this.cutoff; }, self)).toBe(true);
			expect(arr.all(function(x) { expect(this).toBe(arr);  return x > this.cutoff; })).toBe(false);
		});
	});

	describe(".forEach", function() {
		it("should be defined", function() {
			expect(Array.prototype.forEach).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.forEach).toBe('function');
		});

		it("applies each array element to a given function", function() {
			var src = [1, 2, 3, 4, 5];
			var dst = [];

			src.forEach(function(n) { dst.push(n); });

			expect(dst).toEqual([1, 2, 3, 4, 5]);
			expect(dst).not.toBe(src);
		});

		describe("when the array is empty", function() {
			it("doesn't call the given function", function() {
				var cb = { fn: function() { } };
				spyOn(cb, 'fn');

				[].forEach(cb.fn);

				expect(cb.fn).not.toHaveBeenCalled();
			});
		});
	});

	describe(".sum", function() {
		it("should be defined", function() {
			expect(Array.prototype.sum).toBeDefined();
		});

		it("should be a function", function() {
			expect(typeof Array.prototype.sum).toBe('function');
		});

		it("adds all numbers in an array and returns the result", function() {
			var array = [1, 2, 3, 4, 5];
			expect(array.sum()).toEqual(15);
		});
	});
});