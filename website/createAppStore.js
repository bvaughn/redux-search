/** @flow */
import { compose, createStore } from 'redux'
import { reduxSearch, SearchApi } from '../src/index'
import { reducer as rootReducer } from './resources'

export default function createAppStore ({
  searchApi
} = {}): Object {
  const finalCreateStore = compose(
    reduxSearch({
      resourceIndexes: {
        books: ['author', 'title']
      },
      resourceSelector: (resourceName, state) => {
        return state.resources[resourceName]
      },
      searchApi
    })
  )(createStore)

  return finalCreateStore(rootReducer)
}
