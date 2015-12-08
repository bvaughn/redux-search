/** @flow */
import { combineReducers, compose, createStore } from 'redux'
import { reducer as searchReducer, reduxSearch, SearchApi } from '../src/index'
import { reducer as resourceReducer } from './resources'

export default function createAppStore (): Object {
  const finalCreateStore = compose(
    reduxSearch({
      resourceIndexes: {
        contacts: ['address', 'email', 'name', 'phone', 'title']
      },
      resourceSelector: (resourceName, state) => {
        return state.resources.get(resourceName)
      }
    })
  )(createStore)

  const rootReducer = combineReducers({
    resources: resourceReducer,
    search: searchReducer
  })

  return finalCreateStore(rootReducer)
}
