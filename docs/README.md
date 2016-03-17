Documentation
------

redux-search provides the following named exports:

* [`createSearchAction`](#createsearchactionresourcename)
* [`getSearchSelectors`](#getsearchselectors-filterfunction-resourcename-resourceselector-searchstateselector-)
* [`reducer`](#reducer)
* [`reduxSearch`](#reduxsearch-resourceindexes-resourceselector-searchapi-searchstateselector-)
* [`SearchApi`](#searchapi)

### `createSearchAction(resourceName)`
Factory function that creates Redux search actions. This function requires a single parameter (a `resourceName` string) that identifies a searchable resource. For example:

```javascript
import { createSearchAction } from 'redux-search'

const actions = {
  searchBooks: createSearchAction('books')
}
```

### `getSearchSelectors({ filterFunction, resourceName, resourceSelector, searchStateSelector })`

Creates selectors for a searchable resource. This function returns an object with selectors defined as the following properties:

* **text**: Selector that returns the current search text for a given searchable resource.
* **result**: Selector that returns the current result list for a given searchable resource. This list is pre-filtered to ensure that all ids exist within the current resource collection.
* **unfilteredResult**: Selector that returns the current result list for a given searchable resource. This list is not pre-filtered and should only be used for computed resources.

This method accepts the following named parameters:

##### filterFunction

Custom filter function for computed resources. A default filter function capable of supporting plain Objects and immutable Maps is provided. If you provide your own filter function it should have the following signature: `(id: string): boolean`

##### resourceName
Identifies a searchable resource (eg. 'books')

##### resourceSelector:
Selector responsible for returning an iterable resource map for a given, searchable resource. This function should be capable of returning a map for each resource listed in `resourceIndexes`. Its signature should look like this: `(resourceName: string, state: Object): Iterable<Object>`

##### searchStateSelector
Responsible for returning the Search state. A default implementation is provided. Override only if you add `searchReducer()` to the store somewhere other than `state.search`.

For example:

```javascript
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getSearchSelectors } from 'redux-search'

const { text, result } = getSearchSelectors('books')
const books = state => state.getIn(['resources', 'books'])

const selectors = createSelector(
  [result, books, text],
  (result, books, text) => ({
    bookIds: result,
    books,
    searchText: text
  })
)
```

### `reducer`

The root reducer for redux-search. It is recommended that you add this to the application state as `search`. For example:

```javascript
import { combineReducers } from 'redux'
import { reducer } from '../src/index'

const rootReducer = combineReducers({
  search: reducer
  // Your other reducers go here...
})
```

If you add the reducer at an alternate location you will need to supply a `searchStateSelector` to `reduxSearch()` and `getSearchSelectors()`.

### `reduxSearch({ resourceIndexes, resourceSelector, searchApi, searchStateSelector })`
Creates higher-order search store to be composed with other store enhancers.
This function accepts the following named parameters (via a params Object):

##### resourceIndexes:
Maps searchable resources to search configurations. Configurations must be one of the following types:

1. an array of searchable field names (eg. `["name", "description"]`)
2. a custom indexing function ([read more about that here](reduxSearch.md))

##### resourceSelector:
Selector responsible for returning an iterable resource map for a given, searchable resource. This function should be capable of returning a map for each resource listed in `resourceIndexes`. Its signature should look like this: `(resourceName: string, state: Object): Iterable<Object>`

If this value is specified then the search index will be automatically built/updated whenever resources change. Ommit this property if you wish to manage the search index manually.

##### searchApi:
Observable Search API. Override for testing purposes or to integrate with a search library other than [js-worker-search](https://github.com/bvaughn/js-worker-search/). Refer to [`SearchApi`](#searchapi) for more information if you choose to override this interface.

##### searchStateSelector:
Selects the search sub-state within the state store. A default implementation is provided. Override only if you add `searchReducer()` to the store somewhere other than `state.search`.

### `SearchApi`
+The search API is an observable that manages communication between the redux-search middleware and the underlying search utility. It maps resource names to search indicies and coordinates searches. It supports both single-threaded and web-worker modes and will determine which to use automatically based on the capabilities of the current environment.

You can override this API with `reduxSearch()` (for testing purposes) like so:

```javascript
reduxSearch({
  // Configure :resourceIndexes and :resourceSelector here and then...
  searchApi = new StubSearchApi()
})
```

In the above example `StubSearchApi` will need to implement the following methods:

##### `subscribe (onNext, onError)`
Subscribe to Search events. Subscribers will be notified each time a Search is performed.

Successful searches will call `onNext` with the following parameters:
* **result**: An array of ids matching the search
* **text**: Search string
* **resourceName**: Identifies the resource that was searched

Failed searches (searches that result in an Error) will call `onError` with an `Error` parameter.

This method returns a callback that can be used to unsubscribe from Search events. Just invoke the function without any parameters to unsubscribe.

##### `indexResource (resourceName, fieldNamesOrIndexFunction, resources)`
Builds a searchable index of a set of resources. It accepts the following parameters:

* **resourceName** Uniquely identifies the resource (eg. "databases")
* **fieldNamesOrIndexFunction** This value is passed to reduxSearch() factory during initialization. It is either an Array of searchable fields (to be auto-indexed) or a custom index function to be called with a `resources` object and an `indexDocument` callback function.
* **resources** Map of resource id to resource (Object)

##### `async performSearch (resourceName, text)`
Searches a resource and returns a Promise to be resolved with an array of ids that match the search string. Upon completion (or failure) this method also notifies all current subscribers. It accepts the following parameters:

* **resourceName** Uniquely identifies the resource (eg. "books")
* **text** Search string
