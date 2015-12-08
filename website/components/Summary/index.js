/** @flow */
import React from 'react'
import styles from './Summary.css'

export default function Summary () {
  return (
    <p className={styles.Summary}>
      This test harness mimics what might happen in a real production app.
      The button below generates 1,000 fake contacts.
      <code>redux-search</code> then automatically indexes those contacts based on the fields it's been configured to use (address, phone, email, title, and name).
      At that point you can search the contacts using the search input and the table below will be automatically filtered by the exported <code>redux-search</code> selector.
    </p>
  )
}
