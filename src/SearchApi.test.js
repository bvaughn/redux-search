import test from 'blue-tape'
import { SearchApi } from './SearchApi'

function getSearchApi () {
  const documentA = {id: 1, name: 'One', description: 'The first document'}
  const documentB = {id: 2, name: 'Two', description: 'The second document'}
  const documentC = {id: 3, name: 'Three', description: 'The third document'}

  const searchApi = new SearchApi() // Single-threaded Search API for easier testing
  searchApi.indexResource(
    'documents',
    ['name', 'description'],
    [ documentA, documentB, documentC ]
  )
  return searchApi
}

/** Simple smoke test of non-web-worker based SearchApi */
test('SearchApi should return documents ids for any searchable field matching a query', async t => {
  const searchApi = getSearchApi()
  const ids = await searchApi.performSearch('documents', 'One')
  t.equal(ids.length, 1)
  t.equal(ids[0], 1)
})
