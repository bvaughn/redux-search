/** @flow */
import Immutable from 'immutable'
import styles from './Widget.css'
import React, { PropTypes } from 'react'
import { VirtualScroll } from 'react-virtualized'

Widget.propTypes = {
  generateData: PropTypes.func.isRequired,
  recordIds: PropTypes.any.isRequired,
  recordsMap: PropTypes.any.isRequired,
  rowRenderer: PropTypes.any.isRequired,
  searchData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
export default function Widget ({
  generateData,
  recordIds,
  recordsMap,
  rowRenderer,
  searchData,
  title
}) {
  const totalSize = recordsMap instanceof Immutable.Collection
    ? recordsMap.size
    : Object.keys(recordsMap).length
  const filteredSize = recordIds instanceof Immutable.Collection
    ? recordIds.size
    : recordIds.length

  return (
    <div>
      <h2 className={styles.Title}>
        {title}
        {totalSize > 0 &&
          <small className={styles.ResultsSummary}>
            {filteredSize} of {totalSize}
          </small>
        }
      </h2>
      <div className={styles.ControlBar}>
        <button
          className={styles.Button}
          onClick={generateData}
        >
          Generate Data
        </button>
        <input
          disabled={recordsMap.size === 0}
          className={styles.SearchInput}
          onChange={event => searchData(event.target.value)}
          placeholder='Search..'
        />
      </div>
      <VirtualScroll
        className={styles.VirtualScroll}
        width={300}
        height={200}
        rowsCount={filteredSize}
        rowHeight={20}
        rowRenderer={rowRenderer}
      />
    </div>
  )
}
