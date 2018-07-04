redux-search
-----

<img src="https://cloud.githubusercontent.com/assets/29597/11708504/c2f637ce-9ec4-11e5-8eb9-c248664e8d3b.png" alt="Redux Search" data-canonical-src="https://cloud.githubusercontent.com/assets/29597/11708504/c2f637ce-9ec4-11e5-8eb9-c248664e8d3b.png" width="364" height="100" />

![NPM version](https://img.shields.io/npm/v/redux-search.svg)
![NPM license](https://img.shields.io/npm/l/redux-search.svg)
![NPM total downloads](https://img.shields.io/npm/dt/redux-search.svg)
![NPM monthly downloads](https://img.shields.io/npm/dm/redux-search.svg)
[![Circle CI badge](https://img.shields.io/circleci/project/bvaughn/redux-search/master.svg)](https://circleci.com/gh/bvaughn/redux-search)

Higher-order Redux library for searching collections of objects. Search algorithms powered by [js-worker-search](https://github.com/bvaughn/js-worker-search).

Check out the live demo at [bvaughn.github.io/redux-search](http://bvaughn.github.io/redux-search/)

Or install it yourself with NPM:

```
npm install --save redux-search
```

Overview
---------

This README provides a quick introduction of redux-search. For more details refer to the [API documentation](https://github.com/bvaughn/redux-search/tree/master/docs).

redux-search searches collections of documents and returns results as an `Array` of document ids. It is important to note that the documents themselves aren't returned. This is because the actual search is performed in a web-worker thread for performance reasons. In order to avoid serializing the documents and passing them back and forth, redux-search simply passes their ids.

Because of this, each document _must contain an `id` attribute_.

redux-search provides an [action](docs/README.md#createsearchactionresourcename) for searching resources as well as [selectors](docs/README.md#getsearchselectors-filterfunction-resourcename-resourceselector-searchstateselector-) for getting search results and the current search text. It then watches the store for resource changes and automatically updates search results as needed.

Note that redux-search currently depends on the Regenerator runtime. It is recommended that your project require the [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) to provide that runtime.

Example
---------

#### Configuring the Store

redux-search watches the store for changes to searchable collections and automatically builds a search index. To do this, it simply needs to be told which resources to watch and which fields to index.

```javascript
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { searchReducer, reduxSearch } from 'redux-search'

// Configure reducer to store state at state.search
// You can store it elsewhere but you will need to supply your own :searchStateSelector
const rootReducer = combineReducers({
  search: searchReducer
  // Your other reducers go here...
})

// Compose :reduxSearch with other store enhancers
const enhancer = compose(
  applyMiddleware(...yourMiddleware),
  reduxSearch({
    // Configure redux-search by telling it which resources to index for searching
    resourceIndexes: {
      // In this example Books will be searchable by :title and :author
      books: ['author', 'title']
    },
    // This selector is responsible for returning each collection of searchable resources
    resourceSelector: (resourceName, state) => {
      // In our example, all resources are stored in the state under a :resources Map
      // For example "books" are stored under state.resources.books
      return state.resources.get(resourceName)
    }
  })
)

// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
const store = createStore(rootReducer, initialState, enhancer)
```

#### Customizing Search Index

By default, redux-search builds an index to match all substrings.
You can override this behavior by providing your own, pre-configured `searchApi` param to the middleware like so:

```js
import { reduxSearch, SearchApi, INDEX_MODES } from 'redux-search'

// all-substrings match by default; same as current
// eg "c", "ca", "a", "at", "cat" match "cat"
const allSubstringsSearchApi = new SearchApi()

// prefix matching (eg "c", "ca", "cat" match "cat")
const prefixSearchApi = new SearchApi({
  indexMode: INDEX_MODES.PREFIXES
})

// exact words matching (eg only "cat" matches "cat")
const exactWordsSearchApi = new SearchApi({
  indexMode: INDEX_MODES.EXACT_WORDS
})

const finalCreateStore = compose(
  // Other middleware ...
  reduxSearch({
    resourceIndexes: { ... },
    resourceSelector: (resourceName, state) => state.resources.get(resourceName),
    searchApi: allSubstringsSearchApi || prefixSearchApi || exactWordsSearchApi
  })
)(createStore)
```

#### Custom word boundaries (tokenization) and case-sensitivity

You can also pass parameters to the SearchApi constructor that customize the way the
search splits up the text into words (tokenizes) and change the search from the default
case-insensitive to case-sensitive:

```js
import { reduxSearch, SearchApi } from 'redux-search'

const finalCreateStore = compose(
  // Other middleware ...
  reduxSearch({
    resourceIndexes: { ... },
    resourceSelector: (resourceName, state) => state.resources.get(resourceName),
    searchApi: new SearchApi({
      // split on all non-alphanumeric characters,
      // so this/that gets split to ['this','that'], for example
      tokenizePattern: /[^a-z0-9]+/,
      // make the search case-sensitive
      caseSensitive: true
    })
  })
)(createStore)
```

#### Connecting a Component

redux-search provides selectors and action-creators for easily connecting components with the search state. For example, using `reselect` you might connect your component like so:

```javascript
// Elsewhere, in a smart component module...
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { createSearchAction, getSearchSelectors } from 'redux-search'

// :books is a map (Object or Immutable.Map) with ids as keys
// These ids correspond to :result returned by getSearchSelectors('books')
const books = state => state.getIn(['resources', 'books'])

// :text is a selector that returns the text Books are currently filtered by
// :result is an Array of Book ids that match the current seach :text (or all Books if there is no search :text)
const {
  text, // search text
  result // book ids
} = getSearchSelectors({
  resourceName: 'books',
  resourceSelector: (resourceName, state) => state.resources.get(resourceName)
})

const selectors = createSelector(
  [result, books, text],
  (bookIds, books, searchText) => ({
    bookIds,
    books,
    searchText
  })
)

const actions = {
  searchBooks: createSearchAction('books')
}

export default connect(selectors, actions)(YourConnectedComponent)
```

Changelog
---------

Changes are tracked in the [changelog](CHANGELOG.md).

License
---------

redux-search is available under the MIT License.
