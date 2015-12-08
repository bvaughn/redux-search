/**
 * This is the entray point to the documentation/demo/test harness site for redux-search.
 * This target is published to the root of the `gh-pages` branch.
 * @flow
 */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ContactTable from './components/ContactTable'
import ControlBar from './components/ControlBar'
import createAppStore from './createAppStore'
import Header from './components/Header'
import Summary from './components/Summary'
import './global.css'

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

function Application () {
  return (
    <div>
      <Header/>
      <Summary/>
      <ControlBar/>
      <ContactTable/>
    </div>
  )
}
