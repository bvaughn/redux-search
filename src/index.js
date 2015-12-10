/* @flow */
import {
  defaultSearchStateSelector,
  getSearchSelectors
} from './selectors'
import { search } from './actions'
import reduxSearch from './reduxSearch'
import reducer from './reducer'
import { SearchApi, WorkerSearchApi } from './SearchApi'

export default reduxSearch
export {
  defaultSearchStateSelector,
  getSearchSelectors,
  reducer,
  reduxSearch,
  search as createSearchAction,
  SearchApi,
  WorkerSearchApi
}
