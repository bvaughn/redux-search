/** @flow */
import { actions, filteredIdArray, filteredIdList, immutableMap, map } from './resources'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Card, CardWrapper } from './components/Card'
import Footer from './components/Footer'
import Header from './components/Header'
import Immutable from 'immutable'
import React, { PropTypes } from 'react'
import Widget from './components/Widget'
import styles from './Application.css'

Application.propTypes = {
  generateData: PropTypes.func.isRequired,
  generateImmutableData: PropTypes.func.isRequired,
  filteredIdArray: PropTypes.array.isRequired,
  filteredIdList: PropTypes.instanceOf(Immutable.List).isRequired,
  immutableMap: PropTypes.any.isRequired,
  map: PropTypes.object.isRequired,
  searchData: PropTypes.func.isRequired,
  searchImmutableData: PropTypes.func.isRequired
}
export default function Application ({
  generateData,
  generateImmutableData,
  filteredIdArray,
  filteredIdList,
  immutableMap,
  map,
  searchData,
  searchImmutableData
}) {
  return (
    <div>
      <Header/>
      <CardWrapper>
        <Card>
          <p>
            This test harness mimics what might happen in a real production app.
            The buttons below generate fake data.
            redux-search then automatically indexes that data based on the way the store was configured.
            At that point you can search the data using actions and selectors exported by redux-search.
            (<a href='https://github.com/treasure-data/redux-search/tree/master/website'>View the source</a>.)
          </p>
        </Card>
      </CardWrapper>
      <CardWrapper>
        <Card>
          <Widget
            generateData={generateImmutableData}
            recordIds={filteredIdList}
            recordsMap={immutableMap}
            rowRenderer={
              index => {
                const contact = immutableMap.get(filteredIdList.get(index))
                return (
                  <div
                    key={index}
                    className={styles.Row}
                  >
                    {contact.name}, {contact.title}
                  </div>
                )
              }
            }
            searchData={searchImmutableData}
            title={'Immutable List of Maps'}
          />
        </Card>
        <Card>
          <Widget
            generateData={generateData}
            recordIds={filteredIdArray}
            recordsMap={map}
            rowRenderer={
              index => {
                const contact = map[filteredIdArray[index]]
                return (
                  <div
                    key={index}
                    className={styles.Row}
                  >
                    {contact.name}, {contact.title}
                  </div>
                )
              }
            }
            searchData={searchData}
            title={'Array of Objects'}
          />
        </Card>
      </CardWrapper>
      <Footer/>
    </div>
  )
}

const selectors = createSelector(
  [filteredIdArray, filteredIdList, immutableMap, map],
  (filteredIdArray, filteredIdList, immutableMap, map) => ({
    filteredIdArray,
    filteredIdList,
    immutableMap,
    map
  })
)

export default connect(selectors, actions)(Application)
