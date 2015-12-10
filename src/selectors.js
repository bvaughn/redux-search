/** @flow */

/** Default state selector */
export function defaultSearchStateSelector (state) {
  return state.search
}

/**
 * Creates convenience selectors for the specified resource.
 *
 * @param resourceName eg "databases"
 * @param searchStateSelector Returns the Search sub-state of the store; (state: Object): Object
 */
export function getSearchSelectors (
  resourceName: string,
  searchStateSelector = defaultSearchStateSelector
): Object {
  const searchSelector = state => searchStateSelector(state)[resourceName]

  return {
    text (state) {
      return searchSelector(state).text
    },
    result (state) {
      return searchSelector(state).result
    },
    isLoading (state) {
      return searchSelector(state).isLoading
    }
  }
}
