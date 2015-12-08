/** @flow */
import React from 'react'
import styles from './Summary.css'

export default function Summary () {
  return (
    <div className={styles.Summary}>
      This test harness mimics what might happen in a real production app.
      First it generates 1,000 fake contacts.
      redux-search then automatically indexes those contacts based on the fields it's been configured to use (address, phone, email, title, and name).
      At that point you can search the contacts using the search input and the table below will be automatically filtered by the exported redux-search selector.
      (<a href='https://github.com/treasure-data/redux-search/tree/master/website'>View the source</a>.)
    </div>
  )
}
