/**
 * Copyright © 2012 Ben Bader
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

(function(hs, undefined) {
  var ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0','_'];
  var ALPHABET_SIZE = ALPHABET.length;
  var CHAR_TO_NUM = (function() {
    var dict = {};

    for (var i = 0; i < ALPHABET_SIZE; ++i) {
      dict[ALPHABET[i]] = i;
    }

    return dict;
  })();

  var generateId = (function() {
    var nodeId = 1;

    return function() {
      return nodeId++;
    }
  })();

  function charnum(c) {
    return CHAR_TO_NUM[c.charAt(0)];
  };

  function Trie() {
    this.children = new Array(ALPHABET_SIZE);
    this.endOfWord = false;
    this.height = -1;
    this.id = generateId();

    for (var i = 0; i < ALPHABET_SIZE; ++i) {
      this.children[i] = undefined;
    }
  };

  Trie.prototype.__computeHeight__ = function() {
    var maxHeight = 0;

    for (var len = this.children.length, i = 0; i < len; ++i) {
      var child = this.children[i];

      if (!child) {
        continue;
      }

      var childHeight = child.getHeight();

      if (childHeight > maxHeight) {
        maxHeight = childHeight;
      }
    }

    this.height = maxHeight + 1;
  };

  Trie.prototype.getCanonicalString = function() {
    var h = "";

    for (var i = 0; i < ALPHABET_SIZE; ++i) {
      var child = this.children[i];
      h += child ? child.getIdentifier() : "_";
    }

    h += "|";
    h += this.height;

    if (this.endOfWord) {
      h += "|e";
    }

    return h;
  };

  Trie.prototype.getIdentifier = function() {
    return this.id.toString();
  };

  Trie.prototype.__addWord__ = function(word, i) {
    if (i == word.length) {
      this.endOfWord = true;
      return;
    }

    var c = charnum(word[i]);
    var n = this.children[c];

    if (!n) {
      this.children[c] = n = new Trie();
    }

    n.__addWord__(word, i + 1);
  };

  Trie.prototype.__lookup__ = function(word, i) {
    if (i == word.length) {
      return this.endOfWord;
    }

    var child = this.children[charnum(word[i])];

    if (child) {
      return child.__lookup__(word, i + 1);
    }

    return false;
  };

  Trie.prototype.freeze = function() {
    // Canonicalize trie nodes
    // This means reducing the trie to the set of nodes
    // which are unique in height+children+eow, under the
    // invariant that all lower nodes have already been
    // canonicalized.  Ie end-of-word nodes first, then
    // backwards.  This results in a directed acyclic
    // word graph, a trie with shared suffixes.

    var canonicalNodes = {};
    var numToNode = [null];

    // Identify the set of "canonical" nodes
    function canonicalize(node, height) {
      if (!node) {
        return;
      }

      if (node.getHeight() > height) {
        for (var i = 0; i < ALPHABET_SIZE; ++i) {
          canonicalize(node.children[i], height);
        }

        return;
      }

      if (node.getHeight() != height) {
        return;
      }

      for (var i = 0; i < ALPHABET_SIZE; ++i) {
        var child = node.children[i];

        if (!child) {
          continue;
        }

        var canon = canonicalNodes[child.getCanonicalString()];

        if (canon) {
          node.children[i] = canon;
        } else {
          canonicalNodes[child.getCanonicalString()] = child;
          numToNode.push(child);
        }
      }
    };

    // Start from the leaves and canonicalize upwards
    for (var i = 1; i <= this.getHeight(); ++i) {
      canonicalize(this, i);
    }

    // Don't forget the root!
    canonicalNodes[this.getCanonicalString()] = this;
    numToNode.push(this);
    
    // Now that we've converted the trie to a DAWG, it's time to squash it
    // down in memory.  We'll use a '2-D' array
    // Map nodes to indices
    var nodeToNum = {};

    for (var len = numToNode.length, i = 1; i < len; ++i) {
      nodeToNum[numToNode[i].getIdentifier()] = i;
    }

    // Make a 2D array of numWords * []
    var arrayTrie = new Array(numToNode.length);

    for (var len = arrayTrie.length, i = 0; i < len; ++i) {
      arrayTrie[i] = [];
    }

    var root = this;
    function fill(node) {
      if (!node) {
        return;
      }

      for (var i = 0; i < ALPHABET_SIZE; ++i) {
        fill(node.children[i]);
      }

      var num = nodeToNum[node.getIdentifier()];

      for (var i = 0; i < ALPHABET_SIZE; ++i) {
        var subArr = arrayTrie[num];

        arrayTrie[num][i] = node.children[i] ? nodeToNum[node.children[i].getIdentifier()] : 0;
      }

      if (node.endOfWord) {
        arrayTrie[num][ALPHABET_SIZE] = 1;
      }
    };

    fill(this);

    // Profit
    return new FrozenTrie(arrayTrie, nodeToNum[this.getIdentifier()], this.getHeight());
  };

  Trie.prototype.addWord = function(word) {
    if (this.height != -1) {
      throw new Error("Adding is already complete.");
    }

    this.__addWord__(word, 0);
  };

  Trie.prototype.lookup = function(word) {
    return this.__lookup__(word, 0);
  };

  Trie.prototype.getHeight = function(word) {
    if (this.height == -1) {
      this.__computeHeight__();
    }

    return this.height;
  };

  Trie.prototype.getSize = function() {
    return 1 + this.children.map(function(child) { return child ? child.getSize() : 0; }).sum();
  };

  Trie.prototype.debug = function() {
    var stack = [[this]];
    var result = [];
    var visited = {};
    var cur, i, len;

    function label(node, pos) {
      return (pos !== undefined ? ALPHABET[pos] : "<root>") + ":" + node.getIdentifier();
    }

    while (cur = stack.shift()) {
      var row = [],
        node = cur[0],
        pos = cur[1];

      if (visited.hasOwnProperty(node.getIdentifier())) {
        continue;
      }

      row.push(label(node, pos));

      for (i = 0; i < ALPHABET_SIZE; ++i) {
        if (!node.children[i]) {
          continue;
        } 

        row.push(label(node.children[i], i))
        stack.push([node.children[i], i]);
      }

      result.push(row.join(" "));
      visited[node.getIdentifier()] = true;
    }

    return { length: result.length, rows: result };
  }

  function FrozenTrie(array, root, height) {
    var nextChar = function(node, c) {
      return array[node][charnum(c)];
    };

    var isEOW = function(node) {
      return array[node][ALPHABET_SIZE] == 1;
    };

    function __lookup(word, i, node) {
      if (i == word.length) {
        return isEOW(node);
      }

      var letter = word.charAt(i);
      var nc = nextChar(node, letter);

      if (!nc) {
        return false;
      }

      return __lookup(word, i + 1, nc);
    }

    if (HYPER_DEBUG) {
      this.__array__ = function() {
        return array;
      }
    }

    this.getHeight = function() {
      return height;
    };

    this.lookup = function(word) {
      return __lookup(word, 0, root);
    };

    this.toString = function() { return array.toString(); }
  };

  FrozenTrie.prototype = new Trie();

  FrozenTrie.prototype.addWord = function() {
    throw new Error("Cannot add word to a frozen trie.");
  };

  hs.Trie = Trie;
  hs.Trie.Frozen = FrozenTrie;

  return hs;
})(Hyper);
