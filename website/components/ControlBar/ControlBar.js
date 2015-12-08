/** @flow */
import { actions, contacts, filteredContactIds } from '../../resources'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import styles from './ControlBar.css'
import React from 'react'

export function ControlBar ({ contacts, filteredContactIds, generateContacts, searchContacts }) {
  return (
    <div className={styles.ControlBar}>
      <div
        className={styles.Button}
        onClick={generateContacts}
      >
        Step 1: Generate Fake Contacts
      </div>
      <input
        className={styles.SearchInput}
        onChange={event => searchContacts(event.target.value)}
        placeholder='Step 3: Search contacts...'
      />
      <div>
        Showing {filteredContactIds.size} out of {contacts.size} contacts.
      </div>
    </div>
  )
}

const selectors = createSelector(
  [contacts, filteredContactIds],
  (contacts, filteredContactIds) => ({
    contacts,
    filteredContactIds
  })
)

export default connect(selectors, {
  generateContacts: actions.generateContacts,
  searchContacts: actions.searchContacts
})(ControlBar)
