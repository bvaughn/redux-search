/** @flow */
import React from 'react'
import styles from './Card.css'

Card.propTypes = {
  children: React.PropTypes.node.isRequired
}
export default function Card ({ children }) {
  return (
    <div className={styles.Card}>
      {children}
    </div>
  )
}
