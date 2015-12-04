import { combineReducers, createStore } from 'redux'
import reduxSearch from './reduxSearch'
import reducer from './reducer'
import test from 'tape'

function createMiddleware (params = {}) {
  return reduxSearch(params)(createStore)(
    combineReducers({
      search: reducer
    })
  )
}

class MockSearchApi {
  constructor () {
    this.indexResourceCalls = []
    this.performSearchCalls = []
    this.subscribeCalls = []
  }

  indexResource (resourceName, fieldNamesOrIndexFunction, resources) {
    this.indexResourceCalls.push({ resourceName, fieldNamesOrIndexFunction, resources })
  }

  async performSearch (resourceName, text) {
    this.performSearchCalls.push({ resourceName, text })
    return Promise.resolve([])
  }

  subscribe (onNext, onError) {
    this.subscribeCalls.push({ onNext, onError })
  }
}

test('reduxSearch should subscribe to the specified searchApi', t => {
  let searchApi = new MockSearchApi()
  createMiddleware({ searchApi })
  t.equal(searchApi.subscribeCalls.length, 1)
  t.end()
})

test('reduxSearch should auto-index searchable resources if a resourceSelector is specified', t => {
  let searchApi = new MockSearchApi()
  const resourceIndexes = { users: ['name'] }
  const resources = {}
  const resourceSelectorCalls = []
  const resourceSelector = (resourceName, nextState) => {
    resourceSelectorCalls.push({ resourceName, nextState })
    return resources
  }

  const store = createMiddleware({ resourceIndexes, resourceSelector, searchApi })

  t.equal(resourceSelectorCalls.length, 0)

  // Simulate a resource update
  store.dispatch({ type: 'fakeResourceUpdate' })

  // Called once on resource-change and once after search has been re-run
  t.equal(resourceSelectorCalls.length, 2)
  t.equal(resourceSelectorCalls[0].resourceName, 'users')
  t.equal(resourceSelectorCalls[1].resourceName, 'users')
  t.equal(searchApi.indexResourceCalls.length, 1)
  t.end()
})
