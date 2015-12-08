/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Search entry point to web worker.
	 * Builds search index and performs searches on separate thread from the ui.
	 * 
	 */
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _Search = __webpack_require__(1);
	
	var _Search2 = _interopRequireDefault(_Search);
	
	var search = new _Search2['default']();
	
	self.addEventListener('message', function (event) {
	  var data = event.data;
	  var method = data.method;
	
	  switch (method) {
	    case 'indexDocument':
	      var uid = data.uid,
	          text = data.text;
	
	      search.indexDocument(uid, text);
	      break;
	    case 'search':
	      var callbackId = data.callbackId,
	          query = data.query;
	
	      var results = search.search(query);
	
	      self.postMessage({ callbackId: callbackId, results: results });
	      break;
	  }
	}, false);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _SearchIndex = __webpack_require__(2);
	
	var _SearchIndex2 = _interopRequireDefault(_SearchIndex);
	
	/**
	 * Client side, full text search utility.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	
	var Search = (function () {
	
	  /**
	   * Constructor.
	   */
	
	  function Search() {
	    _classCallCheck(this, Search);
	
	    this.searchIndex = new _SearchIndex2['default']();
	    this.uids = {};
	  }
	
	  /**
	   * Adds or updates a uid in the search index and associates it with the specified text.
	   * Note that at this time uids can only be added or updated in the index, not removed.
	   *
	   * @param uid Uniquely identifies a searchable object
	   * @param text Text to associate with uid
	   */
	
	  _createClass(Search, [{
	    key: 'indexDocument',
	    value: function indexDocument(uid, text) {
	      var _this = this;
	
	      this.uids[uid] = true;
	
	      var fieldTokens = this._tokenize(this._sanitize(text));
	
	      fieldTokens.forEach(function (fieldToken) {
	        var expandedTokens = _this._expandToken(fieldToken);
	
	        expandedTokens.forEach(function (expandedToken) {
	          return _this.searchIndex.indexDocument(expandedToken, uid);
	        });
	      });
	
	      return this;
	    }
	
	    /**
	     * Searches the current index for the specified query text.
	     * Only uids matching all of the words within the text will be accepted.
	     * If an empty query string is provided all indexed uids will be returned.
	     *
	     * Document searches are case-insensitive (e.g. "search" will match "Search").
	     * Document searches use substring matching (e.g. "na" and "me" will both match "name").
	     *
	     * @param query Searchable query text
	     * @return Array of uids
	     */
	  }, {
	    key: 'search',
	    value: function search(query) {
	      if (!query) {
	        return Object.keys(this.uids);
	      } else {
	        var tokens = this._tokenize(this._sanitize(query));
	
	        return this.searchIndex.search(tokens);
	      }
	    }
	
	    /**
	     * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/
	     *
	     * @private
	     */
	  }, {
	    key: '_expandToken',
	    value: function _expandToken(token) {
	      var expandedTokens = [];
	
	      for (var i = 0, _length = token.length; i < _length; ++i) {
	        var prefixString = '';
	
	        for (var j = i; j < _length; ++j) {
	          prefixString += token.charAt(j);
	          expandedTokens.push(prefixString);
	        }
	      }
	
	      return expandedTokens;
	    }
	
	    /**
	     * @private
	     */
	  }, {
	    key: '_sanitize',
	    value: function _sanitize(string) {
	      return string.trim().toLocaleLowerCase();
	    }
	
	    /**
	     * @private
	     */
	  }, {
	    key: '_tokenize',
	    value: function _tokenize(text) {
	      return text.split(/\s+/).filter(function (text) {
	        return text;
	      }); // Remove empty tokens
	    }
	  }]);
	
	  return Search;
	})();
	
	exports['default'] = Search;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	
	/**
	 * Maps search tokens to uids.
	 * This structure is used by the Search class to optimize search operations.
	 * Forked from JS search (github.com/bvaughn/js-search).
	 */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SearchIndex = (function () {
	  function SearchIndex() {
	    _classCallCheck(this, SearchIndex);
	
	    this.tokenToUidMap = {};
	  }
	
	  /**
	   * Maps the specified token to a uid.
	   *
	   * @param token Searchable token (e.g. "road")
	   * @param uid Identifies a document within the searchable corpus
	   */
	
	  _createClass(SearchIndex, [{
	    key: "indexDocument",
	    value: function indexDocument(token, uid) {
	      if (!this.tokenToUidMap[token]) {
	        this.tokenToUidMap[token] = {};
	      }
	
	      this.tokenToUidMap[token][uid] = uid;
	    }
	
	    /**
	     * Finds uids that have been mapped to the set of tokens specified.
	     * Only uids that have been mapped to all tokens will be returned.
	     *
	     * @param tokens Array of searchable tokens (e.g. ["long", "road"])
	     * @return Array of uids that have been associated with the set of search tokens
	     */
	  }, {
	    key: "search",
	    value: function search(tokens) {
	      var _this = this;
	
	      var uidMap = {};
	      var initialized = false;
	
	      tokens.forEach(function (token) {
	        var currentUidMap = _this.tokenToUidMap[token] || {};
	
	        if (!initialized) {
	          initialized = true;
	
	          for (var _uid in currentUidMap) {
	            uidMap[_uid] = currentUidMap[_uid];
	          }
	        } else {
	          for (var _uid2 in uidMap) {
	            if (!currentUidMap[_uid2]) {
	              delete uidMap[_uid2];
	            }
	          }
	        }
	      });
	
	      var uids = [];
	
	      for (var _uid3 in uidMap) {
	        uids.push(uidMap[_uid3]);
	      }
	
	      return uids;
	    }
	  }]);
	
	  return SearchIndex;
	})();
	
	exports["default"] = SearchIndex;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=6e9ede787278f510e9e7.worker.js.map