/**
 * This is the entray point to the documentation/demo/test harness site for redux-search.
 * This target is published to the root of the `gh-pages` branch.
 * @flow
 */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createAppStore from './createAppStore'
import './global.css'

const store = createAppStore()

render((
    <div>
      <Provider store={store}>
        <div>Coming soon!</div>
      </Provider>
    </div>
  ),
  document.getElementById('root')
)
