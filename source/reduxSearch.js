import { applyMiddleware } from 'redux'
import { defaultSearchStateSelector } from './selectors'
import * as actions from './actions'
import { SEARCH_STATE_SELECTOR } from './constants'
import searchMiddleware from './searchMiddleware'
import SearchApi from './SearchApi'

/**
 * Creates higher-order search store to be composed with other store enhancers.
 * This function accepts the following, optional parameters (via a params Object):
 * • resourceIndexes:
 *     Maps searchable resources to search configurations.
 *     Configurations must be one of the following types:
 *     (1) an array of searchable field names (eg. ["name", "description"])
 *     (2) a custom indexing function (eg. ({ resources: Iterable<Object>, indexDocument: Function }))
 * • resourceSelector:
 *     Selector responsible for returning an iterable resource map for a given, searchable resource.
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
export default function reduxSearch ({
  resourceIndexes = {},
  resourceSelector,
  searchApi = new SearchApi(),
  searchStateSelector = defaultSearchStateSelector
} = {}) {
  return createStore => (reducer, initialState) => {
    const store = applyMiddleware(
      searchMiddleware(searchApi)
    )(createStore)(reducer, initialState)

    store.search = searchApi
    store[SEARCH_STATE_SELECTOR] = searchStateSelector

    const resourceNames = Object.keys(resourceIndexes)
    store.dispatch(actions.initializeResources(resourceNames))

    searchApi.subscribe(({ result, resourceName, text }) => {
      // Here we handle item responses
      // It can be fancier, but at its core this is all it is
      store.dispatch(actions.receiveResult(resourceName)(result))
    }, error => {
      // TODO: Somehow handle error; redux-router lets you pass a callback
      throw error
    })

    // Auto-index if a :resourceSelector has been provided
    if (resourceSelector) {
      let currentResources = {}

      store.subscribe(() => {
        const nextState = store.getState()
        const searchState = store[SEARCH_STATE_SELECTOR](nextState)

        for (let resourceName in resourceIndexes) {
          const resource = resourceSelector(resourceName, nextState)

          // Only rebuild the search index for resources that have changed
          if (currentResources[resourceName] !== resource) {
            currentResources[resourceName] = resource

            const resourceIndex = resourceIndexes[resourceName]
            const searchString = searchState[resourceName].text

            store.dispatch(actions.indexResource({
              fieldNamesOrIndexFunction: resourceIndex,
              resourceName,
              resources: resource,
              state: nextState
            }))
            store.dispatch(actions.search(resourceName)(searchString))
          }
        }
      })
    }

    return store
  }
}
