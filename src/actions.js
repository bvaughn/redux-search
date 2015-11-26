/**
 * @flow
 */
import {
  ACTION,
  INITIALIZE_RESOURCES,
  SEARCH_API,
  SEARCH,
  RECEIVE_RESULT
} from './constants'

export function searchAPI (method: string): Object {
  return (...args) => ({
    type: SEARCH_API,
    payload: {
      method,
      args
    }
  })
}
export const defineIndex = searchAPI('defineIndex')
export const indexResource = searchAPI('indexResource')
export const performSearch = searchAPI('performSearch')

export function search (resourceName: string): Function {
  return function searchResource (text: string): Object {
    return {
      type: ACTION,
      payload: {
        api: performSearch(resourceName, text),
        action: {
          type: SEARCH,
          payload: {
            resourceName,
            text
          }
        }
      }
    }
  }
}

export function receiveResult (resourceName: string): Function {
  return function receiveResultForResource (result: Array<string>): Object {
    return {
      type: RECEIVE_RESULT,
      payload: {
        resourceName,
        result
      }
    }
  }
}

export function initializeResources (resourceNames: Array<string>): Object {
  return {
    type: INITIALIZE_RESOURCES,
    payload: {
      resourceNames
    }
  }
}
