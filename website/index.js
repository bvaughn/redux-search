/**
 * This is the entray point to the documentation/demo/test harness site for redux-search.
 * This target is published to the root of the `gh-pages` branch.
 * @flow
 */
import createAppStore from './createAppStore'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import Application from './Application'
import React from 'react'

const store = createAppStore()

render((
    <div>
      <Provider store={store}>
        <Application/>
      </Provider>
    </div>
  ),
  document.getElementById('root')
)
