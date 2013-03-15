/**
 * Copyright (c) 2012 Ben Bader
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @define {boolean}
 */
var HYPER_DEBUG = true;

Object.size = function(obj) {
	var size = 0;

	for (var key in obj) {
		if (!obj.hasOwnProperty(key))
			continue;

		++size;
	}

	return size;
}

if (HYPER_DEBUG || typeof Array.prototype.map !== 'function') {
	Array.prototype.map = function(fn, thisArg) {
		var result = [],
			length = this.length,
			self = thisArg || this;

		for (var i = 0; i < length; ++i) {
			result.push(fn.call(self, this[i], i));
		};

		return result;
	};
}

if (HYPER_DEBUG || typeof Array.prototype.max !== 'function') {

	/**
	 * Returns the largest value in the array, optionally using a supplied
	 * comparison function to compute the value.
	 *
	 * @param {function} cmp A standard comparison function returning <0, 0, and >0.
	 * @param {object} thisArg An optional object to be used as the value of 'this'
	 *                         the comparison function.
	 * @return {?}
	 */
	Array.prototype.max = function(cmp, thisArg) {
		if (this.length == 0) {
			return undefined;
		}

		if (this.length == 1) {
			return this[0];
		}

		var reducer;

		if (cmp) {
			reducer = function(acc, v) {
				return cmp.call(thisArg || this, v, acc) > 0 ? v : acc;
			}
		} else {
			reducer = function(acc, v) {
				if (typeof acc === 'undefined') {
					return v;
				}

				return v > acc ? v : acc;
			}
		}

		return this.reduce(reducer);
	}
}

if (HYPER_DEBUG || typeof Array.prototype.zip !== 'function') {
	Array.prototype.zip = function(other, fn, thisArg) {
		var i = 0,
			len = Math.min(this.length, other.length),
			fn = fn || function(x, y) { return [x, y]; },
			self = thisArg || this,
			result = [];

		for (; i < len; ++i) {
			result.push(fn.call(self, this[i], other[i]));
		}

		return result;
	}
}

if (HYPER_DEBUG || typeof Array.prototype.all !== 'function') {
	Array.prototype.all = function(fn, thisArg) {
		var i = 0,
			len = this.length,
			self = thisArg || this;

		if (!fn || typeof fn !== 'function') {
			throw new Error("A predicate function is required in all.");
		}

		for (; i < len; ++i) {
			if (!fn.call(self, this[i])) {
				return false;
			}
		}

		return true;
	}
}

if (HYPER_DEBUG || typeof Array.prototype.reduce !== 'function') {
	Array.prototype.reduce = function(fn, seed, thisArg) {
		var i = 0,
			length = this.length,
			self = thisArg || this;

		if (length == 0) {
			return seed;
		}

		if (length == 1) {
			return fn.call(self, seed, this[0], 0, this);
		}

		seed = typeof seed === 'undefined' ? this[i++] : seed;

		for (; i < length; ++i) {
			seed = fn.call(self, seed, this[i], i, this);
		}

		return seed;
	};
}

if (HYPER_DEBUG || typeof Array.prototype.forEach !== 'function') {
	Array.prototype.forEach = function(fn) {
		for (var len = this.length, i = 0; i < len; ++i) {
			fn(this[i], i, this);
		}
	};
}

if (HYPER_DEBUG || typeof Array.prototype.sum !== 'function') {
	Array.prototype.sum = function() {
		return this.reduce(function(x, y) { return x + y; }, 0);
	}
}

/*
 * Define the core namespace of Hyper on the main window object (or exports if this is on the server).
 */

(function(root) {
  root.Hyper = {};

	function debug(message) {
		console.log(message);
	}

	root.Hyper.debug = HYPER_DEBUG ? debug : function() {};

  root.Hyper.inherit = function(Parent, Child) {
    var surrogate = function() {};
    surrogate.prototype = Parent.prototype;
    Child.prototype = new surrogate();
    Child.prototype.constructor = Child;
  };
})(this);
