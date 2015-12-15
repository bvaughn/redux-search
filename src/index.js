/* @flow */
import {
  defaultSearchStateSelector,
  getSearchSelectors
} from './selectors'
import { search } from './actions'
import reduxSearch from './reduxSearch'
import reducer from './reducer'
import {
  CapabilitiesBasedSearchApi,
  SearchApi,
  WorkerSearchApi
} from './SearchApi'
import { Search } from './lib'

export default reduxSearch
export {
  defaultSearchStateSelector,
  getSearchSelectors,
  reducer,
  reduxSearch,
  search as createSearchAction,
  Search as SearchUtility,
  CapabilitiesBasedSearchApi,
  SearchApi,
  WorkerSearchApi
}
