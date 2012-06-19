;
(function(toplevel) {
	if (typeof toplevel.Trie !== 'undefined')
		return;

	function Trie() {
		this.children = {};
	};

	function FrozenTrie(trie) {
		
	}

	function add_internal(trie, word, i) {
		var t = trie;

		for (var i = 0, len = word.length; i < len; ++i) {
			var letter = word[i];
			var node = t.children[letter];

			if (node == null || node == undefined) {
				node = new Trie();
				t.children[letter] = node;
			}

			t = node;
		}
	};

	function freeze(trie) {
		// Change trie from a graph to a 2D array of Numbers;
		// This reduces lookups to array-index access, and hopefully
		// provides some sweet performance boosts.  Premature optimization.
		// Yes, I know.
	};

	FrozenTrie.prototype = Trie;

	Trie.add = function(word) {
		add_internal(this, this.word, 0);
	}

	toplevel.Trie = function() {
		var children = {};

		this.add = function()
	};
})(window);