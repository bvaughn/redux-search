module.exports =
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _selectors = __webpack_require__(2);
	
	var _actions = __webpack_require__(3);
	
	var _reduxSearch = __webpack_require__(5);
	
	var _reduxSearch2 = _interopRequireDefault(_reduxSearch);
	
	var _reducer = __webpack_require__(24);
	
	var _reducer2 = _interopRequireDefault(_reducer);
	
	var _SearchApi = __webpack_require__(22);
	
	var _SearchApi2 = _interopRequireDefault(_SearchApi);
	
	exports['default'] = _reduxSearch2['default'];
	exports.defaultSearchStateSelector = _selectors.defaultSearchStateSelector;
	exports.getSearchSelectors = _selectors.getSearchSelectors;
	exports.reducer = _reducer2['default'];
	exports.reduxSearch = _reduxSearch2['default'];
	exports.createSearchAction = _actions.search;
	exports.SearchApi = _SearchApi2['default'];
	
	var _jsWorkerSearch = __webpack_require__(23);
	
	Object.defineProperty(exports, 'INDEX_MODES', {
	  enumerable: true,
	  get: function get() {
	    return _jsWorkerSearch.INDEX_MODES;
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	
	/** Default state selector */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.defaultSearchStateSelector = defaultSearchStateSelector;
	exports.getSearchSelectors = getSearchSelectors;
	exports.getTextSelector = getTextSelector;
	exports.getResultSelector = getResultSelector;
	exports.getUnfilteredResultSelector = getUnfilteredResultSelector;
	
	function defaultSearchStateSelector(state) {
	  return state.search;
	}
	
	/**
	 * Creates convenience selectors for the specified resource.
	 *
	 * @param filterFunction Custom filter function for resources that are computed (not basic maps)
	 * @param resourceName eg "databases"
	 * @param resourceSelector Returns an iterable resouce map for a given, searchable resource.
	 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
	 */
	
	function getSearchSelectors(_ref) {
	  var filterFunction = _ref.filterFunction;
	  var resourceName = _ref.resourceName;
	  var resourceSelector = _ref.resourceSelector;
	  var _ref$searchStateSelector = _ref.searchStateSelector;
	  var searchStateSelector = _ref$searchStateSelector === undefined ? defaultSearchStateSelector : _ref$searchStateSelector;
	
	  return {
	    text: getTextSelector({ resourceName: resourceName, searchStateSelector: searchStateSelector }),
	    result: getResultSelector({ filterFunction: filterFunction, resourceName: resourceName, resourceSelector: resourceSelector, searchStateSelector: searchStateSelector }),
	    unfilteredResult: getUnfilteredResultSelector({ resourceName: resourceName, searchStateSelector: searchStateSelector })
	  };
	}
	
	/**
	 * Returns the current search text for a given searchable resource.
	 *
	 * @param resourceName eg "databases"
	 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
	 */
	
	function getTextSelector(_ref2) {
	  var resourceName = _ref2.resourceName;
	  var _ref2$searchStateSelector = _ref2.searchStateSelector;
	  var searchStateSelector = _ref2$searchStateSelector === undefined ? defaultSearchStateSelector : _ref2$searchStateSelector;
	
	  return function textSelector(state) {
	    return searchStateSelector(state)[resourceName].text;
	  };
	}
	
	/**
	 * Creates a default filter function capable of handling Maps and Objects.
	 */
	function createFilterFunction(resource) {
	  return resource.has instanceof Function ? function (id) {
	    return resource.has(id);
	  } : function (id) {
	    return resource[id];
	  };
	}
	
	/**
	 * Returns the current result list for a given searchable resource.
	 * This list is pre-filtered to ensure that all ids exist within the current resource collection.
	 *
	 * @param filterFunction Custom filter function for resources that are computed (not basic maps)
	 * @param resourceName eg "databases"
	 * @param resourceSelector Returns an iterable resouce map for a given, searchable resource.
	 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
	 */
	
	function getResultSelector(_ref3) {
	  var filterFunction = _ref3.filterFunction;
	  var resourceName = _ref3.resourceName;
	  var resourceSelector = _ref3.resourceSelector;
	  var _ref3$searchStateSelector = _ref3.searchStateSelector;
	  var searchStateSelector = _ref3$searchStateSelector === undefined ? defaultSearchStateSelector : _ref3$searchStateSelector;
	
	  var unfilteredResultSelector = getUnfilteredResultSelector({ resourceName: resourceName, searchStateSelector: searchStateSelector });
	
	  return function resultSelector(state) {
	    var result = unfilteredResultSelector(state);
	    var resource = resourceSelector(resourceName, state);
	
	    return result.filter(filterFunction || createFilterFunction(resource));
	  };
	}
	
	/**
	 * Returns the current result list for a given searchable resource.
	 * This list is not pre-filtered; see issue #29 for more backstory.
	 *
	 * @param resourceName eg "databases"
	 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
	 */
	
	function getUnfilteredResultSelector(_ref4) {
	  var resourceName = _ref4.resourceName;
	  var _ref4$searchStateSelector = _ref4.searchStateSelector;
	  var searchStateSelector = _ref4$searchStateSelector === undefined ? defaultSearchStateSelector : _ref4$searchStateSelector;
	
	  return function resultSelector(state) {
	    return searchStateSelector(state)[resourceName].result;
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.searchAPI = searchAPI;
	exports.search = search;
	exports.receiveResult = receiveResult;
	exports.initializeResources = initializeResources;
	
	var _constants = __webpack_require__(4);
	
	function searchAPI(method) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return {
	      type: _constants.SEARCH_API,
	      payload: {
	        method: method,
	        args: args
	      }
	    };
	  };
	}
	
	var defineIndex = searchAPI('defineIndex');
	exports.defineIndex = defineIndex;
	var indexResource = searchAPI('indexResource');
	exports.indexResource = indexResource;
	var performSearch = searchAPI('performSearch');
	
	exports.performSearch = performSearch;
	
	function search(resourceName) {
	  return function searchResource(text) {
	    return {
	      type: _constants.ACTION,
	      payload: {
	        api: performSearch(resourceName, text),
	        action: {
	          type: _constants.SEARCH,
	          payload: {
	            resourceName: resourceName,
	            text: text
	          }
	        }
	      }
	    };
	  };
	}
	
	function receiveResult(resourceName) {
	  return function receiveResultForResource(result) {
	    return {
	      type: _constants.RECEIVE_RESULT,
	      payload: {
	        resourceName: resourceName,
	        result: result
	      }
	    };
	  };
	}
	
	function initializeResources(resourceNames) {
	  return {
	    type: _constants.INITIALIZE_RESOURCES,
	    payload: {
	      resourceNames: resourceNames
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var SEARCH_API = '@@reduxSearch/API';
	exports.SEARCH_API = SEARCH_API;
	var SEARCH_STATE_SELECTOR = '@@reduxSearch/searchStateSelector';
	
	exports.SEARCH_STATE_SELECTOR = SEARCH_STATE_SELECTOR;
	// Action constants
	var ACTION = '@@reduxSearch/action';
	exports.ACTION = ACTION;
	var INITIALIZE_RESOURCES = '@@reduxSearch/initializeResources';
	exports.INITIALIZE_RESOURCES = INITIALIZE_RESOURCES;
	var RECEIVE_RESULT = '@@reduxSearch/receiveResult';
	exports.RECEIVE_RESULT = RECEIVE_RESULT;
	var SEARCH = '@@reduxSearch/search';
	exports.SEARCH = SEARCH;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = reduxSearch;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _redux = __webpack_require__(6);
	
	var _selectors = __webpack_require__(2);
	
	var _actions = __webpack_require__(3);
	
	var actions = _interopRequireWildcard(_actions);
	
	var _constants = __webpack_require__(4);
	
	var _searchMiddleware = __webpack_require__(21);
	
	var _searchMiddleware2 = _interopRequireDefault(_searchMiddleware);
	
	var _SearchApi = __webpack_require__(22);
	
	var _SearchApi2 = _interopRequireDefault(_SearchApi);
	
	/**
	 * Creates higher-order search store to be composed with other store enhancers.
	 * This function accepts the following, optional parameters (via a params Object):
	 * • resourceIndexes:
	 *     Maps searchable resources to search configurations.
	 *     Configurations must be one of the following types:
	 *     (1) an array of searchable field names (eg. ["name", "description"])
	 *     (2) a custom indexing function (eg. ({ resources: Iterable<Object>, indexDocument: Function }))
	 * • resourceSelector:
	 *     Selector responsible for returning an iterable resouce map for a given, searchable resource.
	 *     This function should be capable of returning a map for each resource listed in :resourceIndexes.
	 *     Its signature should look like this: (resourceName: string, state: Object): Iterable<Object>
	 *     If this value is specified then the search index will be automatically built/updated whenever resources change.
	 *     Ommit this property if you wish to manage the search index manually.
	 * • Search:
	 *     Observable Search API.
	 *     Defaults to redux-search-supplied SearchApi but can be overriden for testing purposes.
	 *     Refer to SearchApi.js for more information if you choose to override this.
	 * • searchStateSelector:
	 *     Selects the search sub-state within the state store.
	 *     Default implementation provided; override if you add searchReducer() to a node other than :search.
	 */
	
	function reduxSearch() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var _ref$resourceIndexes = _ref.resourceIndexes;
	  var resourceIndexes = _ref$resourceIndexes === undefined ? {} : _ref$resourceIndexes;
	  var resourceSelector = _ref.resourceSelector;
	  var _ref$searchApi = _ref.searchApi;
	  var searchApi = _ref$searchApi === undefined ? new _SearchApi2['default']() : _ref$searchApi;
	  var _ref$searchStateSelector = _ref.searchStateSelector;
	  var searchStateSelector = _ref$searchStateSelector === undefined ? _selectors.defaultSearchStateSelector : _ref$searchStateSelector;
	
	  return function (createStore) {
	    return function (reducer, initialState) {
	      var store = (0, _redux.applyMiddleware)((0, _searchMiddleware2['default'])(searchApi))(createStore)(reducer, initialState);
	
	      store.search = searchApi;
	      store[_constants.SEARCH_STATE_SELECTOR] = searchStateSelector;
	
	      var resourceNames = Object.keys(resourceIndexes);
	      store.dispatch(actions.initializeResources(resourceNames));
	
	      searchApi.subscribe(function (_ref2) {
	        var result = _ref2.result;
	        var resourceName = _ref2.resourceName;
	        var text = _ref2.text;
	
	        // Here we handle item responses
	        // It can be fancier, but at its core this is all it is
	        store.dispatch(actions.receiveResult(resourceName)(result));
	      }, function (error) {
	        // TODO: Somehow handle error; redux-router lets you pass a callback
	        throw error;
	      });
	
	      // Auto-index if a :resourceSelector has been provided
	      if (resourceSelector) {
	        (function () {
	          var currentResources = {};
	
	          store.subscribe(function () {
	            var nextState = store.getState();
	            var searchState = store[_constants.SEARCH_STATE_SELECTOR](nextState);
	
	            for (var resourceName in resourceIndexes) {
	              var resource = resourceSelector(resourceName, nextState);
	
	              // Only rebuild the search index for resources that have changed
	              if (currentResources[resourceName] !== resource) {
	                currentResources[resourceName] = resource;
	
	                var resourceIndex = resourceIndexes[resourceName];
	                var searchString = searchState[resourceName].text;
	
	                store.dispatch(actions.indexResource({
	                  fieldNamesOrIndexFunction: resourceIndex,
	                  resourceName: resourceName,
	                  resources: resource,
	                  state: nextState
	                }));
	                store.dispatch(actions.search(resourceName)(searchString));
	              }
	            }
	          });
	        })();
	      }
	
	      return store;
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;
	
	var _createStore = __webpack_require__(8);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _combineReducers = __webpack_require__(16);
	
	var _combineReducers2 = _interopRequireDefault(_combineReducers);
	
	var _bindActionCreators = __webpack_require__(18);
	
	var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);
	
	var _applyMiddleware = __webpack_require__(19);
	
	var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);
	
	var _compose = __webpack_require__(20);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	var _warning = __webpack_require__(17);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/*
	* This is a dummy function to check if the function name has been altered by minification.
	* If the function has been minified and NODE_ENV !== 'production', warn the user.
	*/
	function isCrushed() {}
	
	if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}
	
	exports.createStore = _createStore2["default"];
	exports.combineReducers = _combineReducers2["default"];
	exports.bindActionCreators = _bindActionCreators2["default"];
	exports.applyMiddleware = _applyMiddleware2["default"];
	exports.compose = _compose2["default"];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ActionTypes = undefined;
	exports["default"] = createStore;
	
	var _isPlainObject = __webpack_require__(9);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _symbolObservable = __webpack_require__(14);
	
	var _symbolObservable2 = _interopRequireDefault(_symbolObservable);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = exports.ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} enhancer The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, initialState, enhancer) {
	  var _ref2;
	
	  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = initialState;
	    initialState = undefined;
	  }
	
	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }
	
	    return enhancer(createStore)(reducer, initialState);
	  }
	
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;
	
	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected listener to be a function.');
	    }
	
	    var isSubscribed = true;
	
	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	
	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!(0, _isPlainObject2["default"])(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i]();
	    }
	
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }
	
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/zenparsing/es-observable
	   */
	  function observable() {
	    var _ref;
	
	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	
	      subscribe: function subscribe(observer) {
	        if (typeof observer !== 'object') {
	          throw new TypeError('Expected the observer to be an object.');
	        }
	
	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }
	
	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[_symbolObservable2["default"]] = function () {
	      return this;
	    }, _ref;
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(10),
	    isHostObject = __webpack_require__(12),
	    isObjectLike = __webpack_require__(13);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}
	
	module.exports = isPlainObject;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(11);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	module.exports = isHostObject;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';
	
	module.exports = __webpack_require__(15)(global || window || this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;
	
		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}
	
		return result;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports["default"] = combineReducers;
	
	var _createStore = __webpack_require__(8);
	
	var _isPlainObject = __webpack_require__(9);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _warning = __webpack_require__(17);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	  var reducerKeys = Object.keys(reducers);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!(0, _isPlainObject2["default"])(inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return !reducers.hasOwnProperty(key);
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	function combineReducers(reducers) {
	  var reducerKeys = Object.keys(reducers);
	  var finalReducers = {};
	  for (var i = 0; i < reducerKeys.length; i++) {
	    var key = reducerKeys[i];
	    if (typeof reducers[key] === 'function') {
	      finalReducers[key] = reducers[key];
	    }
	  }
	  var finalReducerKeys = Object.keys(finalReducers);
	
	  var sanityError;
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  return function combination() {
	    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var action = arguments[1];
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
	      if (warningMessage) {
	        (0, _warning2["default"])(warningMessage);
	      }
	    }
	
	    var hasChanged = false;
	    var nextState = {};
	    for (var i = 0; i < finalReducerKeys.length; i++) {
	      var key = finalReducerKeys[i];
	      var reducer = finalReducers[key];
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      nextState[key] = nextStateForKey;
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	    }
	    return hasChanged ? nextState : state;
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = bindActionCreators;
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  var keys = Object.keys(actionCreators);
	  var boundActionCreators = {};
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var actionCreator = actionCreators[key];
	    if (typeof actionCreator === 'function') {
	      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
	    }
	  }
	  return boundActionCreators;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports["default"] = applyMiddleware;
	
	var _compose = __webpack_require__(20);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (createStore) {
	    return function (reducer, initialState, enhancer) {
	      var store = createStore(reducer, initialState, enhancer);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  } else {
	    var _ret = function () {
	      var last = funcs[funcs.length - 1];
	      var rest = funcs.slice(0, -1);
	      return {
	        v: function v() {
	          return rest.reduceRight(function (composed, f) {
	            return f(composed);
	          }, last.apply(undefined, arguments));
	        }
	      };
	    }();
	
	    if (typeof _ret === "object") return _ret.v;
	  }
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = searchMiddleware;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	var _constants = __webpack_require__(4);
	
	/**
	 * Middleware for interacting with the search API
	 * @param {Search} Search object
	 */
	
	function searchMiddleware(search) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch;
	    return function (next) {
	      return function (action) {
	        var payload = action.payload;
	
	        if (action.type === _constants.SEARCH_API) {
	          var method = payload.method;
	          var args = payload.args;
	
	          return search[method].apply(search, _toConsumableArray(args));
	        } else if (action.type === _constants.ACTION) {
	          next(payload.action);
	          return dispatch(payload.api);
	        } else {
	          return next(action);
	        }
	      };
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _jsWorkerSearch = __webpack_require__(23);
	
	var _jsWorkerSearch2 = _interopRequireDefault(_jsWorkerSearch);
	
	/**
	 * Observable that manages communication between redux-search middleware and the Search utility.
	 * This class maps resource names to search indicies and manages subscribers.
	 */
	
	var SubscribableSearchApi = (function () {
	
	  /**
	   * Constructor.
	   */
	
	  function SubscribableSearchApi() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var indexMode = _ref.indexMode;
	
	    _classCallCheck(this, SubscribableSearchApi);
	
	    this._indexMode = indexMode;
	    this._resourceToSearchMap = {};
	
	    // Subscribers
	    this._onErrorSubscribers = [];
	    this._onNextSubscribers = [];
	  }
	
	  /**
	   * Subscribe to Search events.
	   * Subscribers will be notified each time a Search is performed.
	   *
	   * Successful searches will call :onNext with the following parameters:
	   * >result: An array of uids matching the search
	   * >text: Search string
	   * >resourceName: Identifies the resource that was searched
	   *
	   * Failed searches (searches that result in an Error) will call :onError with an Error parameter.
	   *
	   * This method returns a callback that can be used to unsubscribe from Search events.
	   * Just invoke the function without any parameters to unsubscribe.
	   */
	
	  _createClass(SubscribableSearchApi, [{
	    key: 'subscribe',
	    value: function subscribe(onNext, onError) {
	      this._onNextSubscribers.push(onNext);
	      this._onErrorSubscribers.push(onError);
	
	      return function dispose() {
	        this._onNextSubscribers = this._onNextSubscribers.filter(function (subscriber) {
	          return subscriber !== onNext;
	        });
	        this._onErrorSubscribers = this._onErrorSubscribers.filter(function (subscriber) {
	          return subscriber !== onError;
	        });
	      };
	    }
	
	    /**
	     * Builds a searchable index of a set of resources.
	     *
	     * @param fieldNamesOrIndexFunction This value is passed to reduxSearch() factory during initialization
	     *   It is either an Array of searchable fields (to be auto-indexed)
	     *   Or a custom index function to be called with a :resources object and an :indexDocument callback
	     * @param resourceName Uniquely identifies the resource (eg. "databases")
	     * @param resources Map of resource uid to resource (Object)
	     * @param state State object to be passed to custom resource-indexing functions
	     */
	  }, {
	    key: 'indexResource',
	    value: function indexResource(_ref2) {
	      var fieldNamesOrIndexFunction = _ref2.fieldNamesOrIndexFunction;
	      var resourceName = _ref2.resourceName;
	      var resources = _ref2.resources;
	      var state = _ref2.state;
	
	      var search = new _jsWorkerSearch2['default']({
	        indexMode: this._indexMode
	      });
	
	      if (Array.isArray(fieldNamesOrIndexFunction)) {
	        if (resources.forEach instanceof Function) {
	          resources.forEach(function (resource) {
	            fieldNamesOrIndexFunction.forEach(function (field) {
	              search.indexDocument(resource.id, resource[field] || '');
	            });
	          });
	        } else {
	          var _loop = function () {
	            var resource = resources[key];
	            fieldNamesOrIndexFunction.forEach(function (field) {
	              search.indexDocument(resource.id, resource[field] || '');
	            });
	          };
	
	          for (var key in resources) {
	            _loop();
	          }
	        }
	      } else if (fieldNamesOrIndexFunction instanceof Function) {
	        fieldNamesOrIndexFunction({
	          indexDocument: search.indexDocument,
	          resources: resources,
	          state: state
	        });
	      } else {
	        throw Error('Expected resource index to be either an Array of fields or an index function');
	      }
	
	      this._resourceToSearchMap[resourceName] = search;
	    }
	
	    /**
	     * Searches a resource and returns a Promise to be resolved with an array of uids that match the search string.
	     * Upon completion (or failure) this method also notifies all current subscribers.
	     *
	     * @param resourceName Uniquely identifies the resource (eg. "databases")
	     * @param text Search string
	     */
	  }, {
	    key: 'performSearch',
	    value: function performSearch(resourceName, text) {
	      var search, result;
	      return regeneratorRuntime.async(function performSearch$(context$2$0) {
	        while (1) switch (context$2$0.prev = context$2$0.next) {
	          case 0:
	            context$2$0.prev = 0;
	            search = this._resourceToSearchMap[resourceName];
	            context$2$0.next = 4;
	            return regeneratorRuntime.awrap(search.search(text));
	
	          case 4:
	            result = context$2$0.sent;
	
	            this._notifyNext({
	              result: result,
	              text: text,
	              resourceName: resourceName
	            });
	
	            return context$2$0.abrupt('return', result);
	
	          case 9:
	            context$2$0.prev = 9;
	            context$2$0.t0 = context$2$0['catch'](0);
	
	            this._notifyError(context$2$0.t0);
	
	            throw context$2$0.t0;
	
	          case 13:
	          case 'end':
	            return context$2$0.stop();
	        }
	      }, null, this, [[0, 9]]);
	    }
	
	    /** Notify all subscribes of :onError */
	  }, {
	    key: '_notifyError',
	    value: function _notifyError(error) {
	      this._onErrorSubscribers.forEach(function (subscriber) {
	        return subscriber(error);
	      });
	    }
	
	    /** Notify all subscribes of :onNext */
	  }, {
	    key: '_notifyNext',
	    value: function _notifyNext(data) {
	      this._onNextSubscribers.forEach(function (subscriber) {
	        return subscriber(data);
	      });
	    }
	  }]);
	
	  return SubscribableSearchApi;
	})();
	
	exports['default'] = SubscribableSearchApi;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports =
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
	
		module.exports = __webpack_require__(1);
	
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.INDEX_MODES = exports.default = undefined;
		
		var _util = __webpack_require__(2);
		
		Object.defineProperty(exports, 'INDEX_MODES', {
		  enumerable: true,
		  get: function get() {
		    return _util.INDEX_MODES;
		  }
		});
		
		var _SearchApi = __webpack_require__(6);
		
		var _SearchApi2 = _interopRequireDefault(_SearchApi);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		exports.default = _SearchApi2.default;
	
	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.INDEX_MODES = exports.default = undefined;
		
		var _constants = __webpack_require__(3);
		
		Object.defineProperty(exports, 'INDEX_MODES', {
		  enumerable: true,
		  get: function get() {
		    return _constants.INDEX_MODES;
		  }
		});
		
		var _SearchUtility = __webpack_require__(4);
		
		var _SearchUtility2 = _interopRequireDefault(_SearchUtility);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		exports.default = _SearchUtility2.default;
	
	/***/ },
	/* 3 */
	/***/ function(module, exports) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		var INDEX_MODES = exports.INDEX_MODES = {
		  // Indexes for all substring searches (e.g. the term "cat" is indexed as "c", "ca", "cat", "a", "at", and "t").
		  // Based on 'all-substrings-index-strategy' from js-search;
		  // github.com/bvaughn/js-search/blob/master/source/index-strategy/all-substrings-index-strategy.ts
		  ALL_SUBSTRINGS: 'ALL_SUBSTRINGS',
		
		  // Indexes for exact word matches only.
		  // Based on 'exact-word-index-strategy' from js-search;
		  // github.com/bvaughn/js-search/blob/master/source/index-strategy/exact-word-index-strategy.ts
		  EXACT_WORDS: 'EXACT_WORDS',
		
		  // Indexes for prefix searches (e.g. the term "cat" is indexed as "c", "ca", and "cat" allowing prefix search lookups).
		  // Based on 'prefix-index-strategy' from js-search;
		  // github.com/bvaughn/js-search/blob/master/source/index-strategy/prefix-index-strategy.ts
		  PREFIXES: 'PREFIXES'
		};
	
	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _constants = __webpack_require__(3);
		
		var _SearchIndex = __webpack_require__(5);
		
		var _SearchIndex2 = _interopRequireDefault(_SearchIndex);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Synchronous client-side full-text search utility.
		 * Forked from JS search (github.com/bvaughn/js-search).
		 */
		
		var SearchUtility = function () {
		
		  /**
		   * Constructor.
		   *
		   * @param indexMode See #setIndexMode
		   */
		
		  function SearchUtility() {
		    var _ref10 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		
		    var _ref10$indexMode = _ref10.indexMode;
		    var indexMode = _ref10$indexMode === undefined ? _constants.INDEX_MODES.ALL_SUBSTRINGS : _ref10$indexMode;
		
		    _classCallCheck(this, SearchUtility);
		
		    this._indexMode = indexMode;
		
		    this.searchIndex = new _SearchIndex2.default();
		    this.uids = {};
		  }
		
		  /**
		   * Returns a constant representing the current index mode.
		   */
		
		  _createClass(SearchUtility, [{
		    key: 'getIndexMode',
		    value: function getIndexMode() {
		      function _ref(_id) {
		        if (!(typeof _id === 'string')) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id));
		        }
		
		        return _id;
		      }
		
		      return _ref(this._indexMode);
		    }
		
		    /**
		     * Adds or updates a uid in the search index and associates it with the specified text.
		     * Note that at this time uids can only be added or updated in the index, not removed.
		     *
		     * @param uid Uniquely identifies a searchable object
		     * @param text Text to associate with uid
		     */
		
		  }, {
		    key: 'indexDocument',
		    value: function indexDocument(uid, text) {
		      function _ref2(_id2) {
		        if (!(_id2 instanceof SearchUtility)) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchUtility\n\nGot:\n' + _inspect(_id2));
		        }
		
		        return _id2;
		      }
		
		      if (!(typeof text === 'string')) {
		        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
		      }
		
		      this.uids[uid] = true;
		
		      var fieldTokens = this._tokenize(this._sanitize(text));
		
		      if (!(Array.isArray(fieldTokens) && fieldTokens.every(function (item) {
		        return typeof item === 'string';
		      }))) {
		        throw new TypeError('Value of variable "fieldTokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(fieldTokens));
		      }
		
		      if (!(fieldTokens && (typeof fieldTokens[Symbol.iterator] === 'function' || Array.isArray(fieldTokens)))) {
		        throw new TypeError('Expected fieldTokens to be iterable, got ' + _inspect(fieldTokens));
		      }
		
		      var _iteratorNormalCompletion = true;
		      var _didIteratorError = false;
		      var _iteratorError = undefined;
		
		      try {
		        for (var _iterator = fieldTokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		          var fieldToken = _step.value;
		
		          var expandedTokens = this._expandToken(fieldToken);
		
		          if (!(Array.isArray(expandedTokens) && expandedTokens.every(function (item) {
		            return typeof item === 'string';
		          }))) {
		            throw new TypeError('Value of variable "expandedTokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(expandedTokens));
		          }
		
		          if (!(expandedTokens && (typeof expandedTokens[Symbol.iterator] === 'function' || Array.isArray(expandedTokens)))) {
		            throw new TypeError('Expected expandedTokens to be iterable, got ' + _inspect(expandedTokens));
		          }
		
		          var _iteratorNormalCompletion2 = true;
		          var _didIteratorError2 = false;
		          var _iteratorError2 = undefined;
		
		          try {
		            for (var _iterator2 = expandedTokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
		              var expandedToken = _step2.value;
		
		              this.searchIndex.indexDocument(expandedToken, uid);
		            }
		          } catch (err) {
		            _didIteratorError2 = true;
		            _iteratorError2 = err;
		          } finally {
		            try {
		              if (!_iteratorNormalCompletion2 && _iterator2.return) {
		                _iterator2.return();
		              }
		            } finally {
		              if (_didIteratorError2) {
		                throw _iteratorError2;
		              }
		            }
		          }
		        }
		      } catch (err) {
		        _didIteratorError = true;
		        _iteratorError = err;
		      } finally {
		        try {
		          if (!_iteratorNormalCompletion && _iterator.return) {
		            _iterator.return();
		          }
		        } finally {
		          if (_didIteratorError) {
		            throw _iteratorError;
		          }
		        }
		      }
		
		      return _ref2(this);
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
		      function _ref3(_id3) {
		        if (!Array.isArray(_id3)) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<any>\n\nGot:\n' + _inspect(_id3));
		        }
		
		        return _id3;
		      }
		
		      if (!(typeof query === 'string')) {
		        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
		      }
		
		      if (!query) {
		        return _ref3(Object.keys(this.uids));
		      } else {
		        var tokens = this._tokenize(this._sanitize(query));
		
		        if (!(Array.isArray(tokens) && tokens.every(function (item) {
		          return typeof item === 'string';
		        }))) {
		          throw new TypeError('Value of variable "tokens" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(tokens));
		        }
		
		        return _ref3(this.searchIndex.search(tokens));
		      }
		    }
		
		    /**
		     * Sets a new index mode.
		     * See util/constants/INDEX_MODES
		     */
		
		  }, {
		    key: 'setIndexMode',
		    value: function setIndexMode(indexMode) {
		      if (!(typeof indexMode === 'string')) {
		        throw new TypeError('Value of argument "indexMode" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(indexMode));
		      }
		
		      if (Object.keys(this.uids).length > 0) {
		        throw Error('indexMode cannot be changed once documents have been indexed');
		      }
		
		      this._indexMode = indexMode;
		    }
		
		    /**
		     * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/
		     *
		     * @private
		     */
		
		  }, {
		    key: '_expandToken',
		    value: function _expandToken(token) {
		      function _ref5(_id5) {
		        if (!(Array.isArray(_id5) && _id5.every(function (item) {
		          return typeof item === 'string';
		        }))) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id5));
		        }
		
		        return _id5;
		      }
		
		      if (!(typeof token === 'string')) {
		        throw new TypeError('Value of argument "token" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(token));
		      }
		
		      switch (this._indexMode) {
		        case _constants.INDEX_MODES.EXACT_WORDS:
		          return [token];
		        case _constants.INDEX_MODES.PREFIXES:
		          return _ref5(this._expandPrefixTokens(token));
		
		        case _constants.INDEX_MODES.ALL_SUBSTRINGS:
		        default:
		          return _ref5(this._expandAllSubstringTokens(token));
		
		      }
		    }
		  }, {
		    key: '_expandAllSubstringTokens',
		    value: function _expandAllSubstringTokens(token) {
		      function _ref6(_id6) {
		        if (!(Array.isArray(_id6) && _id6.every(function (item) {
		          return typeof item === 'string';
		        }))) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id6));
		        }
		
		        return _id6;
		      }
		
		      if (!(typeof token === 'string')) {
		        throw new TypeError('Value of argument "token" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(token));
		      }
		
		      var expandedTokens = [];
		
		      // String.prototype.charAt() may return surrogate halves instead of whole characters.
		      // When this happens in the context of a web-worker it can cause Chrome to crash.
		      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.
		      // Resources:
		      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
		      // https://mathiasbynens.be/notes/javascript-unicode
		      try {
		        for (var i = 0, length = token.length; i < length; ++i) {
		          var substring = '';
		
		          for (var j = i; j < length; ++j) {
		            substring += token.charAt(j);
		
		            if (!(typeof substring === 'string')) {
		              throw new TypeError('Value of variable "substring" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(substring));
		            }
		
		            expandedTokens.push(substring);
		          }
		        }
		      } catch (error) {
		        console.error('Unable to parse token "' + token + '" ' + error);
		      }
		
		      return _ref6(expandedTokens);
		    }
		  }, {
		    key: '_expandPrefixTokens',
		    value: function _expandPrefixTokens(token) {
		      function _ref7(_id7) {
		        if (!(Array.isArray(_id7) && _id7.every(function (item) {
		          return typeof item === 'string';
		        }))) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id7));
		        }
		
		        return _id7;
		      }
		
		      if (!(typeof token === 'string')) {
		        throw new TypeError('Value of argument "token" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(token));
		      }
		
		      var expandedTokens = [];
		
		      // String.prototype.charAt() may return surrogate halves instead of whole characters.
		      // When this happens in the context of a web-worker it can cause Chrome to crash.
		      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.
		      // Resources:
		      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
		      // https://mathiasbynens.be/notes/javascript-unicode
		      try {
		        for (var i = 0, length = token.length; i < length; ++i) {
		          expandedTokens.push(token.substr(0, i + 1));
		        }
		      } catch (error) {
		        console.error('Unable to parse token "' + token + '" ' + error);
		      }
		
		      return _ref7(expandedTokens);
		    }
		
		    /**
		     * @private
		     */
		
		  }, {
		    key: '_sanitize',
		    value: function _sanitize(string) {
		      function _ref8(_id8) {
		        if (!(typeof _id8 === 'string')) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id8));
		        }
		
		        return _id8;
		      }
		
		      if (!(typeof string === 'string')) {
		        throw new TypeError('Value of argument "string" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(string));
		      }
		
		      return _ref8(string.trim().toLocaleLowerCase());
		    }
		
		    /**
		     * @private
		     */
		
		  }, {
		    key: '_tokenize',
		    value: function _tokenize(text) {
		      function _ref9(_id9) {
		        if (!(Array.isArray(_id9) && _id9.every(function (item) {
		          return typeof item === 'string';
		        }))) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(_id9));
		        }
		
		        return _id9;
		      }
		
		      if (!(typeof text === 'string')) {
		        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
		      }
		
		      return _ref9(text.split(/\s+/).filter(function (text) {
		        return text;
		      })); // Remove empty tokens
		    }
		  }]);
		
		  return SearchUtility;
		}();
		
		exports.default = SearchUtility;
		
		function _inspect(input) {
		  if (input === null) {
		    return 'null';
		  } else if (input === undefined) {
		    return 'void';
		  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
		    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
		  } else if (Array.isArray(input)) {
		    if (input.length > 0) {
		      var first = _inspect(input[0]);
	
		      if (input.every(function (item) {
		        return _inspect(item) === first;
		      })) {
		        return first.trim() + '[]';
		      } else {
		        return '[' + input.map(_inspect).join(', ') + ']';
		      }
		    } else {
		      return 'Array';
		    }
		  } else {
		    var keys = Object.keys(input);
	
		    if (!keys.length) {
		      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		        return input.constructor.name;
		      } else {
		        return 'Object';
		      }
		    }
	
		    var entries = keys.map(function (key) {
		      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
		    }).join('\n  ');
	
		    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		      return input.constructor.name + ' {\n  ' + entries + '\n}';
		    } else {
		      return '{ ' + entries + '\n}';
		    }
		  }
		}
	
	/***/ },
	/* 5 */
	/***/ function(module, exports) {
	
		"use strict";
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Maps search tokens to uids.
		 * This structure is used by the Search class to optimize search operations.
		 * Forked from JS search (github.com/bvaughn/js-search).
		 */
		
		var SearchIndex = function () {
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
		      if (!(typeof token === 'string')) {
		        throw new TypeError("Value of argument \"token\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(token));
		      }
		
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
		      function _ref2(_id2) {
		        if (!Array.isArray(_id2)) {
		          throw new TypeError("Function return value violates contract.\n\nExpected:\nArray<any>\n\nGot:\n" + _inspect(_id2));
		        }
		
		        return _id2;
		      }
		
		      if (!(Array.isArray(tokens) && tokens.every(function (item) {
		        return typeof item === 'string';
		      }))) {
		        throw new TypeError("Value of argument \"tokens\" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n" + _inspect(tokens));
		      }
		
		      var uidMap = {};
		
		      if (!(uidMap != null && (typeof uidMap === "undefined" ? "undefined" : _typeof(uidMap)) === 'object')) {
		        throw new TypeError("Value of variable \"uidMap\" violates contract.\n\nExpected:\n{ [uid: any]: any\n}\n\nGot:\n" + _inspect(uidMap));
		      }
		
		      var initialized = false;
		
		      if (!(tokens && (typeof tokens[Symbol.iterator] === 'function' || Array.isArray(tokens)))) {
		        throw new TypeError("Expected tokens to be iterable, got " + _inspect(tokens));
		      }
		
		      var _iteratorNormalCompletion = true;
		      var _didIteratorError = false;
		      var _iteratorError = undefined;
		
		      try {
		        for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		          var _token = _step.value;
		
		          var currentUidMap = this.tokenToUidMap[_token] || {};
		
		          if (!(currentUidMap != null && (typeof currentUidMap === "undefined" ? "undefined" : _typeof(currentUidMap)) === 'object')) {
		            throw new TypeError("Value of variable \"currentUidMap\" violates contract.\n\nExpected:\n{ [uid: any]: any\n}\n\nGot:\n" + _inspect(currentUidMap));
		          }
		
		          if (!initialized) {
		            initialized = true;
		
		            for (var _uid2 in currentUidMap) {
		              uidMap[_uid2] = currentUidMap[_uid2];
		            }
		          } else {
		            for (var _uid3 in uidMap) {
		              if (!currentUidMap[_uid3]) {
		                delete uidMap[_uid3];
		              }
		            }
		          }
		        }
		      } catch (err) {
		        _didIteratorError = true;
		        _iteratorError = err;
		      } finally {
		        try {
		          if (!_iteratorNormalCompletion && _iterator.return) {
		            _iterator.return();
		          }
		        } finally {
		          if (_didIteratorError) {
		            throw _iteratorError;
		          }
		        }
		      }
		
		      var uids = [];
		
		      if (!Array.isArray(uids)) {
		        throw new TypeError("Value of variable \"uids\" violates contract.\n\nExpected:\nArray<any>\n\nGot:\n" + _inspect(uids));
		      }
		
		      for (var _uid in uidMap) {
		        uids.push(uidMap[_uid]);
		      }
		
		      return _ref2(uids);
		    }
		  }]);
		
		  return SearchIndex;
		}();
		
		exports.default = SearchIndex;
		
		function _inspect(input) {
		  if (input === null) {
		    return 'null';
		  } else if (input === undefined) {
		    return 'void';
		  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
		    return typeof input === "undefined" ? "undefined" : _typeof(input);
		  } else if (Array.isArray(input)) {
		    if (input.length > 0) {
		      var first = _inspect(input[0]);
	
		      if (input.every(function (item) {
		        return _inspect(item) === first;
		      })) {
		        return first.trim() + '[]';
		      } else {
		        return '[' + input.map(_inspect).join(', ') + ']';
		      }
		    } else {
		      return 'Array';
		    }
		  } else {
		    var keys = Object.keys(input);
	
		    if (!keys.length) {
		      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		        return input.constructor.name;
		      } else {
		        return 'Object';
		      }
		    }
	
		    var entries = keys.map(function (key) {
		      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
		    }).join('\n  ');
	
		    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		      return input.constructor.name + ' {\n  ' + entries + '\n}';
		    } else {
		      return '{ ' + entries + '\n}';
		    }
		  }
		}
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _util = __webpack_require__(2);
		
		var _util2 = _interopRequireDefault(_util);
		
		var _worker = __webpack_require__(7);
		
		var _worker2 = _interopRequireDefault(_worker);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Search API that uses web workers when available.
		 * Indexing and searching is performed in the UI thread as a fallback when web workers aren't supported.
		 */
		
		var SearchApi = function () {
		  function SearchApi() {
		    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		
		    var indexMode = _ref3.indexMode;
		
		    _classCallCheck(this, SearchApi);
		
		    // Based on https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
		    // But with added check for Node environment
		    if (typeof window !== 'undefined' && window.Worker) {
		      this._search = new _worker2.default({ indexMode: indexMode });
		    } else {
		      this._search = new _util2.default({ indexMode: indexMode });
		    }
		
		    // Prevent methods from losing context when passed around.
		    this.indexDocument = this.indexDocument.bind(this);
		
		    if (!(typeof this.indexDocument === 'function')) {
		      throw new TypeError('Value of "this.indexDocument" violates contract.\n\nExpected:\n(any, string) => SearchApi\n\nGot:\n' + _inspect(this.indexDocument));
		    }
		
		    this.search = this.search.bind(this);
		
		    if (!(typeof this.search === 'function')) {
		      throw new TypeError('Value of "this.search" violates contract.\n\nExpected:\n(string) => Promise\n\nGot:\n' + _inspect(this.search));
		    }
		  }
		
		  /**
		   * Adds or updates a uid in the search index and associates it with the specified text.
		   * Note that at this time uids can only be added or updated in the index, not removed.
		   *
		   * @param uid Uniquely identifies a searchable object
		   * @param text Text to associate with uid
		   */
		
		  _createClass(SearchApi, [{
		    key: 'indexDocument',
		    value: function indexDocument(uid, text) {
		      function _ref(_id) {
		        if (!(_id instanceof SearchApi)) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchApi\n\nGot:\n' + _inspect(_id));
		        }
		
		        return _id;
		      }
		
		      if (!(typeof text === 'string')) {
		        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
		      }
		
		      this._search.indexDocument(uid, text);
		
		      return _ref(this);
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
		     * @return Promise to be resolved with an Array of matching uids
		     */
		
		  }, {
		    key: 'search',
		    value: function search(query) {
		      function _ref2(_id2) {
		        if (!(_id2 instanceof Promise)) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id2));
		        }
		
		        return _id2;
		      }
		
		      if (!(typeof query === 'string')) {
		        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
		      }
		
		      // Promise.resolve handles both synchronous and web-worker Search utilities
		      return _ref2(Promise.resolve(this._search.search(query)));
		    }
		  }]);
		
		  return SearchApi;
		}();
		
		exports.default = SearchApi;
		
		function _inspect(input) {
		  if (input === null) {
		    return 'null';
		  } else if (input === undefined) {
		    return 'void';
		  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
		    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
		  } else if (Array.isArray(input)) {
		    if (input.length > 0) {
		      var first = _inspect(input[0]);
	
		      if (input.every(function (item) {
		        return _inspect(item) === first;
		      })) {
		        return first.trim() + '[]';
		      } else {
		        return '[' + input.map(_inspect).join(', ') + ']';
		      }
		    } else {
		      return 'Array';
		    }
		  } else {
		    var keys = Object.keys(input);
	
		    if (!keys.length) {
		      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		        return input.constructor.name;
		      } else {
		        return 'Object';
		      }
		    }
	
		    var entries = keys.map(function (key) {
		      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
		    }).join('\n  ');
	
		    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		      return input.constructor.name + ' {\n  ' + entries + '\n}';
		    } else {
		      return '{ ' + entries + '\n}';
		    }
		  }
		}
	
	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.default = undefined;
		
		var _SearchWorkerLoader = __webpack_require__(8);
		
		var _SearchWorkerLoader2 = _interopRequireDefault(_SearchWorkerLoader);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		exports.default = _SearchWorkerLoader2.default;
	
	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {
	
		'use strict';
		
		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
		
		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
		
		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		
		var _uuid = __webpack_require__(9);
		
		var _uuid2 = _interopRequireDefault(_uuid);
		
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
		
		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
		
		/**
		 * Client side, full text search utility.
		 * This interface exposes web worker search capabilities to the UI thread.
		 */
		
		var SearchWorkerLoader = function () {
		
		  /**
		   * Constructor.
		   */
		
		  function SearchWorkerLoader() {
		    var _this = this;
		
		    var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		
		    var indexMode = _ref3.indexMode;
		    var WorkerClass = _ref3.WorkerClass;
		
		    _classCallCheck(this, SearchWorkerLoader);
		
		    // Defer worker import until construction to avoid testing error:
		    // Error: Cannot find module 'worker!./[workername]'
		    if (!WorkerClass) {
		      WorkerClass = __webpack_require__(11);
		    }
		
		    // Maintain context if references are passed around
		    this.indexDocument = this.indexDocument.bind(this);
		
		    if (!(typeof this.indexDocument === 'function')) {
		      throw new TypeError('Value of "this.indexDocument" violates contract.\n\nExpected:\n(any, string) => SearchWorkerLoader\n\nGot:\n' + _inspect(this.indexDocument));
		    }
		
		    this.search = this.search.bind(this);
		
		    if (!(typeof this.search === 'function')) {
		      throw new TypeError('Value of "this.search" violates contract.\n\nExpected:\n(string) => Promise\n\nGot:\n' + _inspect(this.search));
		    }
		
		    this.callbackQueue = [];
		    this.callbackIdMap = {};
		
		    this.worker = new WorkerClass();
		    this.worker.onerror = function (event) {
		      var _event$data = event.data;
		      var callbackId = _event$data.callbackId;
		      var error = _event$data.error;
		
		      _this._updateQueue({ callbackId: callbackId, error: error });
		    };
		    this.worker.onmessage = function (event) {
		      var _event$data2 = event.data;
		      var callbackId = _event$data2.callbackId;
		      var results = _event$data2.results;
		
		      _this._updateQueue({ callbackId: callbackId, results: results });
		    };
		
		    // Override default :indexMode if a specific one has been requested
		    if (indexMode) {
		      this.worker.postMessage({
		        method: 'setIndexMode',
		        indexMode: indexMode
		      });
		    }
		  }
		
		  /**
		   * Adds or updates a uid in the search index and associates it with the specified text.
		   * Note that at this time uids can only be added or updated in the index, not removed.
		   *
		   * @param uid Uniquely identifies a searchable object
		   * @param text Text to associate with uid
		   */
		
		  _createClass(SearchWorkerLoader, [{
		    key: 'indexDocument',
		    value: function indexDocument(uid, text) {
		      function _ref(_id) {
		        if (!(_id instanceof SearchWorkerLoader)) {
		          throw new TypeError('Function return value violates contract.\n\nExpected:\nSearchWorkerLoader\n\nGot:\n' + _inspect(_id));
		        }
		
		        return _id;
		      }
		
		      if (!(typeof text === 'string')) {
		        throw new TypeError('Value of argument "text" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(text));
		      }
		
		      this.worker.postMessage({
		        method: 'indexDocument',
		        text: text,
		        uid: uid
		      });
		
		      return _ref(this);
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
		     * @return Promise to be resolved with an array of uids
		     */
		
		  }, {
		    key: 'search',
		    value: function search(query) {
		      var _this2 = this;
		
		      if (!(typeof query === 'string')) {
		        throw new TypeError('Value of argument "query" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(query));
		      }
		
		      return new Promise(function (resolve, reject) {
		        var callbackId = _uuid2.default.v4();
		        var data = { callbackId: callbackId, reject: reject, resolve: resolve };
		
		        _this2.worker.postMessage({
		          method: 'search',
		          query: query,
		          callbackId: callbackId
		        });
		
		        _this2.callbackQueue.push(data);
		        _this2.callbackIdMap[callbackId] = data;
		      });
		    }
		
		    /**
		     * Updates the queue and flushes any completed promises that are ready.
		     */
		
		  }, {
		    key: '_updateQueue',
		    value: function _updateQueue(_ref4) {
		      var callbackId = _ref4.callbackId;
		      var error = _ref4.error;
		      var results = _ref4.results;
		
		      var target = this.callbackIdMap[callbackId];
		      target.complete = true;
		      target.error = error;
		      target.results = results;
		
		      while (this.callbackQueue.length) {
		        var data = this.callbackQueue[0];
		
		        if (!data.complete) {
		          break;
		        }
		
		        this.callbackQueue.shift();
		
		        delete this.callbackIdMap[data.callbackId];
		
		        if (data.error) {
		          data.reject(data.error);
		        } else {
		          data.resolve(data.results);
		        }
		      }
		    }
		  }]);
		
		  return SearchWorkerLoader;
		}();
		
		exports.default = SearchWorkerLoader;
		
		function _inspect(input) {
		  if (input === null) {
		    return 'null';
		  } else if (input === undefined) {
		    return 'void';
		  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
		    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
		  } else if (Array.isArray(input)) {
		    if (input.length > 0) {
		      var first = _inspect(input[0]);
	
		      if (input.every(function (item) {
		        return _inspect(item) === first;
		      })) {
		        return first.trim() + '[]';
		      } else {
		        return '[' + input.map(_inspect).join(', ') + ']';
		      }
		    } else {
		      return 'Array';
		    }
		  } else {
		    var keys = Object.keys(input);
	
		    if (!keys.length) {
		      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		        return input.constructor.name;
		      } else {
		        return 'Object';
		      }
		    }
	
		    var entries = keys.map(function (key) {
		      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
		    }).join('\n  ');
	
		    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
		      return input.constructor.name + ' {\n  ' + entries + '\n}';
		    } else {
		      return '{ ' + entries + '\n}';
		    }
		  }
		}
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		//     uuid.js
		//
		//     Copyright (c) 2010-2012 Robert Kieffer
		//     MIT License - http://opensource.org/licenses/mit-license.php
		
		// Unique ID creation requires a high quality random # generator.  We feature
		// detect to determine the best RNG source, normalizing to a function that
		// returns 128-bits of randomness, since that's what's usually required
		var _rng = __webpack_require__(10);
		
		// Maps for number <-> hex string conversion
		var _byteToHex = [];
		var _hexToByte = {};
		for (var i = 0; i < 256; i++) {
		  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
		  _hexToByte[_byteToHex[i]] = i;
		}
		
		// **`parse()` - Parse a UUID into it's component bytes**
		function parse(s, buf, offset) {
		  var i = (buf && offset) || 0, ii = 0;
		
		  buf = buf || [];
		  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
		    if (ii < 16) { // Don't overflow!
		      buf[i + ii++] = _hexToByte[oct];
		    }
		  });
		
		  // Zero out remaining bytes if string was short
		  while (ii < 16) {
		    buf[i + ii++] = 0;
		  }
		
		  return buf;
		}
		
		// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
		function unparse(buf, offset) {
		  var i = offset || 0, bth = _byteToHex;
		  return  bth[buf[i++]] + bth[buf[i++]] +
		          bth[buf[i++]] + bth[buf[i++]] + '-' +
		          bth[buf[i++]] + bth[buf[i++]] + '-' +
		          bth[buf[i++]] + bth[buf[i++]] + '-' +
		          bth[buf[i++]] + bth[buf[i++]] + '-' +
		          bth[buf[i++]] + bth[buf[i++]] +
		          bth[buf[i++]] + bth[buf[i++]] +
		          bth[buf[i++]] + bth[buf[i++]];
		}
		
		// **`v1()` - Generate time-based UUID**
		//
		// Inspired by https://github.com/LiosK/UUID.js
		// and http://docs.python.org/library/uuid.html
		
		// random #'s we need to init node and clockseq
		var _seedBytes = _rng();
		
		// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
		var _nodeId = [
		  _seedBytes[0] | 0x01,
		  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
		];
		
		// Per 4.2.2, randomize (14 bit) clockseq
		var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
		
		// Previous uuid creation time
		var _lastMSecs = 0, _lastNSecs = 0;
		
		// See https://github.com/broofa/node-uuid for API details
		function v1(options, buf, offset) {
		  var i = buf && offset || 0;
		  var b = buf || [];
		
		  options = options || {};
		
		  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
		
		  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
		  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
		  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
		  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
		  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
		
		  // Per 4.2.1.2, use count of uuid's generated during the current clock
		  // cycle to simulate higher resolution clock
		  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
		
		  // Time since last uuid creation (in msecs)
		  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
		
		  // Per 4.2.1.2, Bump clockseq on clock regression
		  if (dt < 0 && options.clockseq === undefined) {
		    clockseq = clockseq + 1 & 0x3fff;
		  }
		
		  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
		  // time interval
		  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
		    nsecs = 0;
		  }
		
		  // Per 4.2.1.2 Throw error if too many uuids are requested
		  if (nsecs >= 10000) {
		    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
		  }
		
		  _lastMSecs = msecs;
		  _lastNSecs = nsecs;
		  _clockseq = clockseq;
		
		  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
		  msecs += 12219292800000;
		
		  // `time_low`
		  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
		  b[i++] = tl >>> 24 & 0xff;
		  b[i++] = tl >>> 16 & 0xff;
		  b[i++] = tl >>> 8 & 0xff;
		  b[i++] = tl & 0xff;
		
		  // `time_mid`
		  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
		  b[i++] = tmh >>> 8 & 0xff;
		  b[i++] = tmh & 0xff;
		
		  // `time_high_and_version`
		  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
		  b[i++] = tmh >>> 16 & 0xff;
		
		  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
		  b[i++] = clockseq >>> 8 | 0x80;
		
		  // `clock_seq_low`
		  b[i++] = clockseq & 0xff;
		
		  // `node`
		  var node = options.node || _nodeId;
		  for (var n = 0; n < 6; n++) {
		    b[i + n] = node[n];
		  }
		
		  return buf ? buf : unparse(b);
		}
		
		// **`v4()` - Generate random UUID**
		
		// See https://github.com/broofa/node-uuid for API details
		function v4(options, buf, offset) {
		  // Deprecated - 'format' argument, as supported in v1.2
		  var i = buf && offset || 0;
		
		  if (typeof(options) == 'string') {
		    buf = options == 'binary' ? new Array(16) : null;
		    options = null;
		  }
		  options = options || {};
		
		  var rnds = options.random || (options.rng || _rng)();
		
		  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
		  rnds[6] = (rnds[6] & 0x0f) | 0x40;
		  rnds[8] = (rnds[8] & 0x3f) | 0x80;
		
		  // Copy bytes to buffer, if provided
		  if (buf) {
		    for (var ii = 0; ii < 16; ii++) {
		      buf[i + ii] = rnds[ii];
		    }
		  }
		
		  return buf || unparse(rnds);
		}
		
		// Export public API
		var uuid = v4;
		uuid.v1 = v1;
		uuid.v4 = v4;
		uuid.parse = parse;
		uuid.unparse = unparse;
		
		module.exports = uuid;
	
	
	/***/ },
	/* 10 */
	/***/ function(module, exports) {
	
		/* WEBPACK VAR INJECTION */(function(global) {
		var rng;
		
		if (global.crypto && crypto.getRandomValues) {
		  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
		  // Moderately fast, high quality
		  var _rnds8 = new Uint8Array(16);
		  rng = function whatwgRNG() {
		    crypto.getRandomValues(_rnds8);
		    return _rnds8;
		  };
		}
		
		if (!rng) {
		  // Math.random()-based (RNG)
		  //
		  // If all else fails, use Math.random().  It's fast, but is of unspecified
		  // quality.
		  var  _rnds = new Array(16);
		  rng = function() {
		    for (var i = 0, r; i < 16; i++) {
		      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
		      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
		    }
		
		    return _rnds;
		  };
		}
		
		module.exports = rng;
		
		
		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))
	
	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {
	
		module.exports = function() {
			return __webpack_require__(12)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId])\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\texports: {},\n/******/ \t\t\tid: moduleId,\n/******/ \t\t\tloaded: false\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.loaded = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tvar _util = __webpack_require__(1);\n\t\n\tvar _util2 = _interopRequireDefault(_util);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\t/**\n\t * Search entry point to web worker.\n\t * Builds search index and performs searches on separate thread from the ui.\n\t */\n\t\n\tvar searchUtility = new _util2.default();\n\t\n\tself.addEventListener('message', function (event) {\n\t  var data = event.data;\n\t  var method = data.method;\n\t\n\t  switch (method) {\n\t    case 'indexDocument':\n\t      var uid = data.uid;\n\t      var text = data.text;\n\t\n\t      searchUtility.indexDocument(uid, text);\n\t      break;\n\t    case 'search':\n\t      var callbackId = data.callbackId;\n\t      var query = data.query;\n\t\n\t      var results = searchUtility.search(query);\n\t\n\t      self.postMessage({ callbackId: callbackId, results: results });\n\t      break;\n\t    case 'setIndexMode':\n\t      var indexMode = data.indexMode;\n\t\n\t      searchUtility.setIndexMode(indexMode);\n\t      break;\n\t  }\n\t}, false);\n\n/***/ },\n/* 1 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\texports.INDEX_MODES = exports.default = undefined;\n\t\n\tvar _constants = __webpack_require__(2);\n\t\n\tObject.defineProperty(exports, 'INDEX_MODES', {\n\t  enumerable: true,\n\t  get: function get() {\n\t    return _constants.INDEX_MODES;\n\t  }\n\t});\n\t\n\tvar _SearchUtility = __webpack_require__(3);\n\t\n\tvar _SearchUtility2 = _interopRequireDefault(_SearchUtility);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\texports.default = _SearchUtility2.default;\n\n/***/ },\n/* 2 */\n/***/ function(module, exports) {\n\n\t'use strict';\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\tvar INDEX_MODES = exports.INDEX_MODES = {\n\t  // Indexes for all substring searches (e.g. the term \"cat\" is indexed as \"c\", \"ca\", \"cat\", \"a\", \"at\", and \"t\").\n\t  // Based on 'all-substrings-index-strategy' from js-search;\n\t  // github.com/bvaughn/js-search/blob/master/source/index-strategy/all-substrings-index-strategy.ts\n\t  ALL_SUBSTRINGS: 'ALL_SUBSTRINGS',\n\t\n\t  // Indexes for exact word matches only.\n\t  // Based on 'exact-word-index-strategy' from js-search;\n\t  // github.com/bvaughn/js-search/blob/master/source/index-strategy/exact-word-index-strategy.ts\n\t  EXACT_WORDS: 'EXACT_WORDS',\n\t\n\t  // Indexes for prefix searches (e.g. the term \"cat\" is indexed as \"c\", \"ca\", and \"cat\" allowing prefix search lookups).\n\t  // Based on 'prefix-index-strategy' from js-search;\n\t  // github.com/bvaughn/js-search/blob/master/source/index-strategy/prefix-index-strategy.ts\n\t  PREFIXES: 'PREFIXES'\n\t};\n\n/***/ },\n/* 3 */\n/***/ function(module, exports, __webpack_require__) {\n\n\t'use strict';\n\t\n\tvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\t\n\tvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\t\n\tvar _constants = __webpack_require__(2);\n\t\n\tvar _SearchIndex = __webpack_require__(4);\n\t\n\tvar _SearchIndex2 = _interopRequireDefault(_SearchIndex);\n\t\n\tfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\t\n\tfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\t\n\t/**\n\t * Synchronous client-side full-text search utility.\n\t * Forked from JS search (github.com/bvaughn/js-search).\n\t */\n\t\n\tvar SearchUtility = function () {\n\t\n\t  /**\n\t   * Constructor.\n\t   *\n\t   * @param indexMode See #setIndexMode\n\t   */\n\t\n\t  function SearchUtility() {\n\t    var _ref10 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];\n\t\n\t    var _ref10$indexMode = _ref10.indexMode;\n\t    var indexMode = _ref10$indexMode === undefined ? _constants.INDEX_MODES.ALL_SUBSTRINGS : _ref10$indexMode;\n\t\n\t    _classCallCheck(this, SearchUtility);\n\t\n\t    this._indexMode = indexMode;\n\t\n\t    this.searchIndex = new _SearchIndex2.default();\n\t    this.uids = {};\n\t  }\n\t\n\t  /**\n\t   * Returns a constant representing the current index mode.\n\t   */\n\t\n\t  _createClass(SearchUtility, [{\n\t    key: 'getIndexMode',\n\t    value: function getIndexMode() {\n\t      function _ref(_id) {\n\t        if (!(typeof _id === 'string')) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(_id));\n\t        }\n\t\n\t        return _id;\n\t      }\n\t\n\t      return _ref(this._indexMode);\n\t    }\n\t\n\t    /**\n\t     * Adds or updates a uid in the search index and associates it with the specified text.\n\t     * Note that at this time uids can only be added or updated in the index, not removed.\n\t     *\n\t     * @param uid Uniquely identifies a searchable object\n\t     * @param text Text to associate with uid\n\t     */\n\t\n\t  }, {\n\t    key: 'indexDocument',\n\t    value: function indexDocument(uid, text) {\n\t      function _ref2(_id2) {\n\t        if (!(_id2 instanceof SearchUtility)) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nSearchUtility\\n\\nGot:\\n' + _inspect(_id2));\n\t        }\n\t\n\t        return _id2;\n\t      }\n\t\n\t      if (!(typeof text === 'string')) {\n\t        throw new TypeError('Value of argument \"text\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(text));\n\t      }\n\t\n\t      this.uids[uid] = true;\n\t\n\t      var fieldTokens = this._tokenize(this._sanitize(text));\n\t\n\t      if (!(Array.isArray(fieldTokens) && fieldTokens.every(function (item) {\n\t        return typeof item === 'string';\n\t      }))) {\n\t        throw new TypeError('Value of variable \"fieldTokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(fieldTokens));\n\t      }\n\t\n\t      if (!(fieldTokens && (typeof fieldTokens[Symbol.iterator] === 'function' || Array.isArray(fieldTokens)))) {\n\t        throw new TypeError('Expected fieldTokens to be iterable, got ' + _inspect(fieldTokens));\n\t      }\n\t\n\t      var _iteratorNormalCompletion = true;\n\t      var _didIteratorError = false;\n\t      var _iteratorError = undefined;\n\t\n\t      try {\n\t        for (var _iterator = fieldTokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t          var fieldToken = _step.value;\n\t\n\t          var expandedTokens = this._expandToken(fieldToken);\n\t\n\t          if (!(Array.isArray(expandedTokens) && expandedTokens.every(function (item) {\n\t            return typeof item === 'string';\n\t          }))) {\n\t            throw new TypeError('Value of variable \"expandedTokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(expandedTokens));\n\t          }\n\t\n\t          if (!(expandedTokens && (typeof expandedTokens[Symbol.iterator] === 'function' || Array.isArray(expandedTokens)))) {\n\t            throw new TypeError('Expected expandedTokens to be iterable, got ' + _inspect(expandedTokens));\n\t          }\n\t\n\t          var _iteratorNormalCompletion2 = true;\n\t          var _didIteratorError2 = false;\n\t          var _iteratorError2 = undefined;\n\t\n\t          try {\n\t            for (var _iterator2 = expandedTokens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n\t              var expandedToken = _step2.value;\n\t\n\t              this.searchIndex.indexDocument(expandedToken, uid);\n\t            }\n\t          } catch (err) {\n\t            _didIteratorError2 = true;\n\t            _iteratorError2 = err;\n\t          } finally {\n\t            try {\n\t              if (!_iteratorNormalCompletion2 && _iterator2.return) {\n\t                _iterator2.return();\n\t              }\n\t            } finally {\n\t              if (_didIteratorError2) {\n\t                throw _iteratorError2;\n\t              }\n\t            }\n\t          }\n\t        }\n\t      } catch (err) {\n\t        _didIteratorError = true;\n\t        _iteratorError = err;\n\t      } finally {\n\t        try {\n\t          if (!_iteratorNormalCompletion && _iterator.return) {\n\t            _iterator.return();\n\t          }\n\t        } finally {\n\t          if (_didIteratorError) {\n\t            throw _iteratorError;\n\t          }\n\t        }\n\t      }\n\t\n\t      return _ref2(this);\n\t    }\n\t\n\t    /**\n\t     * Searches the current index for the specified query text.\n\t     * Only uids matching all of the words within the text will be accepted.\n\t     * If an empty query string is provided all indexed uids will be returned.\n\t     *\n\t     * Document searches are case-insensitive (e.g. \"search\" will match \"Search\").\n\t     * Document searches use substring matching (e.g. \"na\" and \"me\" will both match \"name\").\n\t     *\n\t     * @param query Searchable query text\n\t     * @return Array of uids\n\t     */\n\t\n\t  }, {\n\t    key: 'search',\n\t    value: function search(query) {\n\t      function _ref3(_id3) {\n\t        if (!Array.isArray(_id3)) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n' + _inspect(_id3));\n\t        }\n\t\n\t        return _id3;\n\t      }\n\t\n\t      if (!(typeof query === 'string')) {\n\t        throw new TypeError('Value of argument \"query\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(query));\n\t      }\n\t\n\t      if (!query) {\n\t        return _ref3(Object.keys(this.uids));\n\t      } else {\n\t        var tokens = this._tokenize(this._sanitize(query));\n\t\n\t        if (!(Array.isArray(tokens) && tokens.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Value of variable \"tokens\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(tokens));\n\t        }\n\t\n\t        return _ref3(this.searchIndex.search(tokens));\n\t      }\n\t    }\n\t\n\t    /**\n\t     * Sets a new index mode.\n\t     * See util/constants/INDEX_MODES\n\t     */\n\t\n\t  }, {\n\t    key: 'setIndexMode',\n\t    value: function setIndexMode(indexMode) {\n\t      if (!(typeof indexMode === 'string')) {\n\t        throw new TypeError('Value of argument \"indexMode\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(indexMode));\n\t      }\n\t\n\t      if (Object.keys(this.uids).length > 0) {\n\t        throw Error('indexMode cannot be changed once documents have been indexed');\n\t      }\n\t\n\t      this._indexMode = indexMode;\n\t    }\n\t\n\t    /**\n\t     * Index strategy based on 'all-substrings-index-strategy.ts' in github.com/bvaughn/js-search/\n\t     *\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_expandToken',\n\t    value: function _expandToken(token) {\n\t      function _ref5(_id5) {\n\t        if (!(Array.isArray(_id5) && _id5.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id5));\n\t        }\n\t\n\t        return _id5;\n\t      }\n\t\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError('Value of argument \"token\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(token));\n\t      }\n\t\n\t      switch (this._indexMode) {\n\t        case _constants.INDEX_MODES.EXACT_WORDS:\n\t          return [token];\n\t        case _constants.INDEX_MODES.PREFIXES:\n\t          return _ref5(this._expandPrefixTokens(token));\n\t\n\t        case _constants.INDEX_MODES.ALL_SUBSTRINGS:\n\t        default:\n\t          return _ref5(this._expandAllSubstringTokens(token));\n\t\n\t      }\n\t    }\n\t  }, {\n\t    key: '_expandAllSubstringTokens',\n\t    value: function _expandAllSubstringTokens(token) {\n\t      function _ref6(_id6) {\n\t        if (!(Array.isArray(_id6) && _id6.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id6));\n\t        }\n\t\n\t        return _id6;\n\t      }\n\t\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError('Value of argument \"token\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(token));\n\t      }\n\t\n\t      var expandedTokens = [];\n\t\n\t      // String.prototype.charAt() may return surrogate halves instead of whole characters.\n\t      // When this happens in the context of a web-worker it can cause Chrome to crash.\n\t      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.\n\t      // Resources:\n\t      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt\n\t      // https://mathiasbynens.be/notes/javascript-unicode\n\t      try {\n\t        for (var i = 0, length = token.length; i < length; ++i) {\n\t          var substring = '';\n\t\n\t          for (var j = i; j < length; ++j) {\n\t            substring += token.charAt(j);\n\t\n\t            if (!(typeof substring === 'string')) {\n\t              throw new TypeError('Value of variable \"substring\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(substring));\n\t            }\n\t\n\t            expandedTokens.push(substring);\n\t          }\n\t        }\n\t      } catch (error) {\n\t        console.error('Unable to parse token \"' + token + '\" ' + error);\n\t      }\n\t\n\t      return _ref6(expandedTokens);\n\t    }\n\t  }, {\n\t    key: '_expandPrefixTokens',\n\t    value: function _expandPrefixTokens(token) {\n\t      function _ref7(_id7) {\n\t        if (!(Array.isArray(_id7) && _id7.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id7));\n\t        }\n\t\n\t        return _id7;\n\t      }\n\t\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError('Value of argument \"token\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(token));\n\t      }\n\t\n\t      var expandedTokens = [];\n\t\n\t      // String.prototype.charAt() may return surrogate halves instead of whole characters.\n\t      // When this happens in the context of a web-worker it can cause Chrome to crash.\n\t      // Catching the error is a simple solution for now; in the future I may try to better support non-BMP characters.\n\t      // Resources:\n\t      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt\n\t      // https://mathiasbynens.be/notes/javascript-unicode\n\t      try {\n\t        for (var i = 0, length = token.length; i < length; ++i) {\n\t          expandedTokens.push(token.substr(0, i + 1));\n\t        }\n\t      } catch (error) {\n\t        console.error('Unable to parse token \"' + token + '\" ' + error);\n\t      }\n\t\n\t      return _ref7(expandedTokens);\n\t    }\n\t\n\t    /**\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_sanitize',\n\t    value: function _sanitize(string) {\n\t      function _ref8(_id8) {\n\t        if (!(typeof _id8 === 'string')) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(_id8));\n\t        }\n\t\n\t        return _id8;\n\t      }\n\t\n\t      if (!(typeof string === 'string')) {\n\t        throw new TypeError('Value of argument \"string\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(string));\n\t      }\n\t\n\t      return _ref8(string.trim().toLocaleLowerCase());\n\t    }\n\t\n\t    /**\n\t     * @private\n\t     */\n\t\n\t  }, {\n\t    key: '_tokenize',\n\t    value: function _tokenize(text) {\n\t      function _ref9(_id9) {\n\t        if (!(Array.isArray(_id9) && _id9.every(function (item) {\n\t          return typeof item === 'string';\n\t        }))) {\n\t          throw new TypeError('Function return value violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n' + _inspect(_id9));\n\t        }\n\t\n\t        return _id9;\n\t      }\n\t\n\t      if (!(typeof text === 'string')) {\n\t        throw new TypeError('Value of argument \"text\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n' + _inspect(text));\n\t      }\n\t\n\t      return _ref9(text.split(/\\s+/).filter(function (text) {\n\t        return text;\n\t      })); // Remove empty tokens\n\t    }\n\t  }]);\n\t\n\t  return SearchUtility;\n\t}();\n\t\n\texports.default = SearchUtility;\n\t\n\tfunction _inspect(input) {\n\t  if (input === null) {\n\t    return 'null';\n\t  } else if (input === undefined) {\n\t    return 'void';\n\t  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {\n\t    return typeof input === 'undefined' ? 'undefined' : _typeof(input);\n\t  } else if (Array.isArray(input)) {\n\t    if (input.length > 0) {\n\t      var first = _inspect(input[0]);\n\n\t      if (input.every(function (item) {\n\t        return _inspect(item) === first;\n\t      })) {\n\t        return first.trim() + '[]';\n\t      } else {\n\t        return '[' + input.map(_inspect).join(', ') + ']';\n\t      }\n\t    } else {\n\t      return 'Array';\n\t    }\n\t  } else {\n\t    var keys = Object.keys(input);\n\n\t    if (!keys.length) {\n\t      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t        return input.constructor.name;\n\t      } else {\n\t        return 'Object';\n\t      }\n\t    }\n\n\t    var entries = keys.map(function (key) {\n\t      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';\n\t    }).join('\\n  ');\n\n\t    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t      return input.constructor.name + ' {\\n  ' + entries + '\\n}';\n\t    } else {\n\t      return '{ ' + entries + '\\n}';\n\t    }\n\t  }\n\t}\n\n/***/ },\n/* 4 */\n/***/ function(module, exports) {\n\n\t\"use strict\";\n\t\n\tvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; };\n\t\n\tvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\t\n\tObject.defineProperty(exports, \"__esModule\", {\n\t  value: true\n\t});\n\t\n\tfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\t\n\t/**\n\t * Maps search tokens to uids.\n\t * This structure is used by the Search class to optimize search operations.\n\t * Forked from JS search (github.com/bvaughn/js-search).\n\t */\n\t\n\tvar SearchIndex = function () {\n\t  function SearchIndex() {\n\t    _classCallCheck(this, SearchIndex);\n\t\n\t    this.tokenToUidMap = {};\n\t  }\n\t\n\t  /**\n\t   * Maps the specified token to a uid.\n\t   *\n\t   * @param token Searchable token (e.g. \"road\")\n\t   * @param uid Identifies a document within the searchable corpus\n\t   */\n\t\n\t  _createClass(SearchIndex, [{\n\t    key: \"indexDocument\",\n\t    value: function indexDocument(token, uid) {\n\t      if (!(typeof token === 'string')) {\n\t        throw new TypeError(\"Value of argument \\\"token\\\" violates contract.\\n\\nExpected:\\nstring\\n\\nGot:\\n\" + _inspect(token));\n\t      }\n\t\n\t      if (!this.tokenToUidMap[token]) {\n\t        this.tokenToUidMap[token] = {};\n\t      }\n\t\n\t      this.tokenToUidMap[token][uid] = uid;\n\t    }\n\t\n\t    /**\n\t     * Finds uids that have been mapped to the set of tokens specified.\n\t     * Only uids that have been mapped to all tokens will be returned.\n\t     *\n\t     * @param tokens Array of searchable tokens (e.g. [\"long\", \"road\"])\n\t     * @return Array of uids that have been associated with the set of search tokens\n\t     */\n\t\n\t  }, {\n\t    key: \"search\",\n\t    value: function search(tokens) {\n\t      function _ref2(_id2) {\n\t        if (!Array.isArray(_id2)) {\n\t          throw new TypeError(\"Function return value violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n\" + _inspect(_id2));\n\t        }\n\t\n\t        return _id2;\n\t      }\n\t\n\t      if (!(Array.isArray(tokens) && tokens.every(function (item) {\n\t        return typeof item === 'string';\n\t      }))) {\n\t        throw new TypeError(\"Value of argument \\\"tokens\\\" violates contract.\\n\\nExpected:\\nArray<string>\\n\\nGot:\\n\" + _inspect(tokens));\n\t      }\n\t\n\t      var uidMap = {};\n\t\n\t      if (!(uidMap != null && (typeof uidMap === \"undefined\" ? \"undefined\" : _typeof(uidMap)) === 'object')) {\n\t        throw new TypeError(\"Value of variable \\\"uidMap\\\" violates contract.\\n\\nExpected:\\n{ [uid: any]: any\\n}\\n\\nGot:\\n\" + _inspect(uidMap));\n\t      }\n\t\n\t      var initialized = false;\n\t\n\t      if (!(tokens && (typeof tokens[Symbol.iterator] === 'function' || Array.isArray(tokens)))) {\n\t        throw new TypeError(\"Expected tokens to be iterable, got \" + _inspect(tokens));\n\t      }\n\t\n\t      var _iteratorNormalCompletion = true;\n\t      var _didIteratorError = false;\n\t      var _iteratorError = undefined;\n\t\n\t      try {\n\t        for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t          var _token = _step.value;\n\t\n\t          var currentUidMap = this.tokenToUidMap[_token] || {};\n\t\n\t          if (!(currentUidMap != null && (typeof currentUidMap === \"undefined\" ? \"undefined\" : _typeof(currentUidMap)) === 'object')) {\n\t            throw new TypeError(\"Value of variable \\\"currentUidMap\\\" violates contract.\\n\\nExpected:\\n{ [uid: any]: any\\n}\\n\\nGot:\\n\" + _inspect(currentUidMap));\n\t          }\n\t\n\t          if (!initialized) {\n\t            initialized = true;\n\t\n\t            for (var _uid2 in currentUidMap) {\n\t              uidMap[_uid2] = currentUidMap[_uid2];\n\t            }\n\t          } else {\n\t            for (var _uid3 in uidMap) {\n\t              if (!currentUidMap[_uid3]) {\n\t                delete uidMap[_uid3];\n\t              }\n\t            }\n\t          }\n\t        }\n\t      } catch (err) {\n\t        _didIteratorError = true;\n\t        _iteratorError = err;\n\t      } finally {\n\t        try {\n\t          if (!_iteratorNormalCompletion && _iterator.return) {\n\t            _iterator.return();\n\t          }\n\t        } finally {\n\t          if (_didIteratorError) {\n\t            throw _iteratorError;\n\t          }\n\t        }\n\t      }\n\t\n\t      var uids = [];\n\t\n\t      if (!Array.isArray(uids)) {\n\t        throw new TypeError(\"Value of variable \\\"uids\\\" violates contract.\\n\\nExpected:\\nArray<any>\\n\\nGot:\\n\" + _inspect(uids));\n\t      }\n\t\n\t      for (var _uid in uidMap) {\n\t        uids.push(uidMap[_uid]);\n\t      }\n\t\n\t      return _ref2(uids);\n\t    }\n\t  }]);\n\t\n\t  return SearchIndex;\n\t}();\n\t\n\texports.default = SearchIndex;\n\t\n\tfunction _inspect(input) {\n\t  if (input === null) {\n\t    return 'null';\n\t  } else if (input === undefined) {\n\t    return 'void';\n\t  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {\n\t    return typeof input === \"undefined\" ? \"undefined\" : _typeof(input);\n\t  } else if (Array.isArray(input)) {\n\t    if (input.length > 0) {\n\t      var first = _inspect(input[0]);\n\n\t      if (input.every(function (item) {\n\t        return _inspect(item) === first;\n\t      })) {\n\t        return first.trim() + '[]';\n\t      } else {\n\t        return '[' + input.map(_inspect).join(', ') + ']';\n\t      }\n\t    } else {\n\t      return 'Array';\n\t    }\n\t  } else {\n\t    var keys = Object.keys(input);\n\n\t    if (!keys.length) {\n\t      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t        return input.constructor.name;\n\t      } else {\n\t        return 'Object';\n\t      }\n\t    }\n\n\t    var entries = keys.map(function (key) {\n\t      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';\n\t    }).join('\\n  ');\n\n\t    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {\n\t      return input.constructor.name + ' {\\n  ' + entries + '\\n}';\n\t    } else {\n\t      return '{ ' + entries + '\\n}';\n\t    }\n\t  }\n\t}\n\n/***/ }\n/******/ ]);\n//# sourceMappingURL=a6e8d10e25215827e7c5.worker.js.map", __webpack_require__.p + "a6e8d10e25215827e7c5.worker.js");
		};
	
	/***/ },
	/* 12 */
	/***/ function(module, exports) {
	
		// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string
		
		var URL = window.URL || window.webkitURL;
		module.exports = function(content, url) {
			try {
				try {
					var blob;
					try { // BlobBuilder = Deprecated, but widely implemented
						var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
						blob = new BlobBuilder();
						blob.append(content);
						blob = blob.getBlob();
					} catch(e) { // The proposed API
						blob = new Blob([content]);
					}
					return new Worker(URL.createObjectURL(blob));
				} catch(e) {
					return new Worker('data:application/javascript,' + encodeURIComponent(content));
				}
			} catch(e) {
				return new Worker(url);
			}
		}
	
	/***/ }
	/******/ ]);
	//# sourceMappingURL=js-worker-search.js.map

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _handlers;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = searchReducer;
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _constants = __webpack_require__(4);
	
	/**
	 * The user must add this reducer to their app store/tree.
	 * By default it is assumed that this reducer will be added at :search.
	 * If you use another location you must pass a custom :searchStateSelector to reduxSearch().
	 */
	
	function searchReducer(state, _ref) {
	  if (state === undefined) state = {};
	  var payload = _ref.payload;
	  var type = _ref.type;
	
	  if (handlers.hasOwnProperty(type)) {
	    return handlers[type](state, payload);
	  } else {
	    return state;
	  }
	}
	
	/**
	 * Search state reducers.
	 */
	var handlers = (_handlers = {}, _defineProperty(_handlers, _constants.INITIALIZE_RESOURCES, function (state, _ref2) {
	  var resourceNames = _ref2.resourceNames;
	
	  return resourceNames.reduce(function (result, resourceName) {
	    result[resourceName] = {
	      isSearching: false,
	      result: [],
	      text: ''
	    };
	    return result;
	  }, _extends({}, state));
	}), _defineProperty(_handlers, _constants.RECEIVE_RESULT, function (state, _ref3) {
	  var resourceName = _ref3.resourceName;
	  var result = _ref3.result;
	
	  return _extends({}, state, _defineProperty({}, resourceName, _extends({}, state[resourceName], {
	    isSearching: false,
	    result: result
	  })));
	}), _defineProperty(_handlers, _constants.SEARCH, function (state, _ref4) {
	  var resourceName = _ref4.resourceName;
	  var text = _ref4.text;
	
	  return _extends({}, state, _defineProperty({}, resourceName, _extends({}, state[resourceName], {
	    isSearching: true,
	    text: text
	  })));
	}), _handlers);
	exports.handlers = handlers;

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map