/** @flow */
import { actions, contacts, filteredContactIds } from '../../resources'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import styles from './ControlBar.css'
import React from 'react'

export function ControlBar ({
  buildSearchIndex,
  contacts,
  filteredContactIds,
  generateContacts,
  searchContacts
}) {
  return (
    <div className={styles.ControlBar}>
      <button
        className={styles.Button}
        onClick={generateContacts}
      >
        Generate Fake Contacts
      </button>
      <input
        disabled={contacts.size === 0}
        className={styles.SearchInput}
        onChange={event => searchContacts(event.target.value)}
        placeholder='Search contacts...'
      />
      {contacts.size > 0 &&
        <div className={styles.Summary}>
          Showing {filteredContactIds.size} out of {contacts.size} contacts.
        </div>
      }
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
