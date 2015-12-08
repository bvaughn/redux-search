/** @flow */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { reducer as searchReducer, reduxSearch } from '../src/index'
import { reducer as resourceReducer } from './resources'
import thunk from 'redux-thunk'

export default function createAppStore (): Object {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
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
