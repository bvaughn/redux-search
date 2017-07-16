/** @flow */
import Search from 'js-worker-search'

/**
 * Observable that manages communication between redux-search middleware and the Search utility.
 * This class maps resource names to search indicies and manages subscribers.
 */
export default class SubscribableSearchApi {

  /**
   * Constructor.
   */
  constructor ({ indexMode, tokenizePattern, caseSensitive } = {}) {
    this._indexMode = indexMode
    this._tokenizePattern = tokenizePattern
    this._caseSensitive = caseSensitive
    this._resourceToSearchMap = {}

    // Subscribers
    this._onErrorSubscribers = []
    this._onNextSubscribers = []
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
  subscribe (onNext, onError) {
    this._onNextSubscribers.push(onNext)
    this._onErrorSubscribers.push(onError)

    return function dispose () {
      this._onNextSubscribers = this._onNextSubscribers.filter(
        subscriber => subscriber !== onNext
      )
      this._onErrorSubscribers = this._onErrorSubscribers.filter(
        subscriber => subscriber !== onError
      )
    }
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
  indexResource ({ fieldNamesOrIndexFunction, resourceName, resources, state }) {
    const search = new Search({
      indexMode: this._indexMode,
      tokenizePattern: this._tokenizePattern,
      caseSensitive: this._caseSensitive
    })
    console.log('aftersearch')

    if (Array.isArray(fieldNamesOrIndexFunction)) {
      if (resources.forEach instanceof Function) {
        resources.forEach(resource => {
          fieldNamesOrIndexFunction.forEach(field => {
            search.indexDocument(resource.id, resource[field] || '')
          })
        })
      } else {
        for (var key in resources) {
          let resource = resources[key]
          fieldNamesOrIndexFunction.forEach(field => {
            search.indexDocument(resource.id, resource[field] || '')
          })
        }
      }
    } else if (fieldNamesOrIndexFunction instanceof Function) {
      fieldNamesOrIndexFunction({
        indexDocument: search.indexDocument,
        resources,
        state
      })
    } else {
      throw Error('Expected resource index to be either an Array of fields or an index function')
    }

    this._resourceToSearchMap[resourceName] = search
  }

  /**
   * Searches a resource and returns a Promise to be resolved with an array of uids that match the search string.
   * Upon completion (or failure) this method also notifies all current subscribers.
   *
   * @param resourceName Uniquely identifies the resource (eg. "databases")
   * @param text Search string
   */
  async performSearch (resourceName, text) {
    try {
      const search = this._resourceToSearchMap[resourceName]
      const result = await search.search(text)

      this._notifyNext({
        result,
        text,
        resourceName
      })

      return result
    } catch (error) {
      this._notifyError(error)

      throw error
    }
  }

  /** Notify all subscribes of :onError */
  _notifyError (error) {
    this._onErrorSubscribers.forEach(
      subscriber => subscriber(error)
    )
  }

  /** Notify all subscribes of :onNext */
  _notifyNext (data) {
    this._onNextSubscribers.forEach(
      subscriber => subscriber(data)
    )
  }
}
