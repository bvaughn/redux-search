import {
  ACTION,
  SEARCH_API
} from './constants'

/**
 * Middleware for interacting with the search API
 * @param {Search} Search object
 */
export default function searchMiddleware (search: Object): Function {
  return ({ dispatch }) => next => action => {
    const { payload } = action
    if (action.type === SEARCH_API) {
      const { method, args } = payload
      return search[method](...args)
    } else if (action.type === ACTION) {
      next(payload.action)
      return dispatch(payload.api)
    } else {
      return next(action)
    }
  }
}
