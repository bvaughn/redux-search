/** Tests search actions, reducers, and selectors. */
import test from 'tape'
import Immutable from 'immutable'
import {
  initializeResources,
  receiveResult,
  search
} from './actions'
import reducer from './reducer'
import {
  getResultSelector,
  getSearchSelectors,
  getTextSelector,
  getUnfilteredResultSelector
} from './selectors'

const RESOURCE_NAME = RESOURCE_NAME

test('getSearchSelectors should return a wrapper containing the correct default selectors', t => {
  const wrapper = getSearchSelectors({
    resourceName: RESOURCE_NAME,
    resourceSelector: () => {}
  })
  t.equal(Object.keys(wrapper).length, 3)
  t.ok(wrapper.result instanceof Function)
  t.ok(wrapper.text instanceof Function)
  t.ok(wrapper.unfilteredResult instanceof Function)
  t.end()
})

function intializeState ({
  resourceName = RESOURCE_NAME,
  resource = {},
  result = [],
  text = 'brian'
} = {}) {
  let state = {
    resources: { [resourceName]: resource },
    search: {}
  }
  state.search = reducer(state.search, initializeResources([resourceName]))
  if (text) {
    state.search = reducer(state.search, search(resourceName)(text).payload.action)
  }
  if (result) {
    state.search = reducer(state.search, receiveResult(resourceName)(result))
  }
  return state
}

test('getTextSelector should return text provided by the default :searchStateSelector', t => {
  const state = intializeState()
  const selector = getTextSelector({ resourceName: RESOURCE_NAME })
  t.equal(selector(state), 'brian')
  t.end()
})

test('getTextSelector should invoke the custom :searchStateSelector if provided', t => {
  const state = intializeState()
  const calls = []
  const selector = getTextSelector({
    resourceName: RESOURCE_NAME,
    searchStateSelector: state => {
      calls.push(state)
      return state.search
    }
  })
  selector(state)
  t.equal(calls.length, 1)
  t.equal(calls[0], state)
  t.end()
})

test('getResultSelector should remove resources that are no longer in the resource Map', t => {
  const state = intializeState({
    resource: Immutable.Map({
      brian: {},
      fernando: {}
    }),
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  t.equal(result.length, 2)
  t.ok(result.includes('brian'))
  t.ok(result.includes('fernando'))
  t.end()
})

test('getResultSelector should remove resources that are no longer in the resource Array', t => {
  const state = intializeState({
    resource: {
      brian: {},
      fernando: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  t.equal(result.length, 2)
  t.ok(result.includes('brian'))
  t.ok(result.includes('fernando'))
  t.end()
})

test('getResultSelector should invoke the custom :filterFunction if provide', t => {
  const state = intializeState({
    resource: {
      brian: {}
    },
    result: ['brian', 'cesar', 'fernando']
  })
  const calls = []
  const selector = getResultSelector({
    filterFunction: id => calls.push(id),
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  selector(state)
  t.equal(calls.length, 3)
  t.ok(calls.includes('brian'))
  t.ok(calls.includes('cesar'))
  t.ok(calls.includes('fernando'))
  t.end()
})

test('getUnfilteredResultSelector should not remove resources that are no longer in the resource collection', t => {
  const state = intializeState({
    resource: Immutable.Map({
      brian: {},
      fernando: {}
    }),
    result: ['brian', 'cesar', 'fernando']
  })
  const selector = getUnfilteredResultSelector({
    resourceName: RESOURCE_NAME,
    resourceSelector: (resourceName, state) => state.resources[resourceName]
  })
  const result = selector(state)
  t.equal(result.length, 3)
  t.ok(result.includes('brian'))
  t.ok(result.includes('cesar'))
  t.ok(result.includes('fernando'))
  t.end()
})
