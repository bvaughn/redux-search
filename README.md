redux-search
-----
Higher-order Redux library for searching collections of objects. Search algorithms based on [js-search](https://github.com/bvaughn/js-search) but with added web-worker support for better performance.

Check out the live demo at [treasure-data.github.io/redux-search](http://treasure-data.github.io/redux-search/)

Or install it yourself with NPM:

```
npm install --save redux-search
```

### Basic Usage

Here is a quick introduction of `redux-search`. For more detailed information refer to the [API documentation](https://github.com/treasure-data/redux-search/tree/master/docs).

#### Configuring the Store

`redux-search` watches the store for changes to searchable collections and automatically builds a search index. To do this, it simply needs to be told which resources to watch and which fields to index.

```javascript
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { reducer as searchReducer, reduxSearch } from '../src/index'

// Configure reducer to store state at state.search
// You can store it elsewhere but you will need to supply your own :searchStateSelector
const rootReducer = combineReducers({
  search: searchReducer
  // Your other reducers go here...
})

// Compose :reduxSearch with other store enhancers
const store = compose(
  applyMiddleware(...yourMiddleware),
  reduxSearch({
    resourceIndexes: {
      // Search configuration here (eg. search all Books by :title and :author)
      books: ['author', 'title']
    },
    resourceSelector: (resourceName, state) => {
      // Resource selector here (eg. get books collection)
      return state.resources.get(resourceName)
    }
  })
)(createStore)(rootReducer)
```

#### Connecting a Component

`redux-search` provides selectors and action-creators for easily connecting components with the search state. For example, using `reselect` you might connect your component like so:

```javascript
// Elsewhere, in a smart component module...
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { createSearchAction, getSearchSelectors } from 'redux-search'

// :text is a selector that returns the text Books are currently filtered by
// :result is an Array of Book ids that match the current seach :text (or all Books if there is no search :text)
const {
  text as searchText,
  result as bookIds
} = getSearchSelectors('books')

const selectors = createSelector(
  [bookIds, books, text],
  (bookIds, books, text) => ({
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
