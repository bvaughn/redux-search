import { SearchApi } from './SearchApi'
import expect from 'expect.js'

/** Simple smoke test of non-web-worker based SearchApi */
describe('SearchApi', () => {
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

  it('should return documents ids for any searchable field matching a query', async () => {
    const searchApi = getSearchApi()
    const ids = await searchApi.performSearch('documents', 'One')
    expect(ids.length).to.equal(1)
    expect(ids[0]).to.equal(1)
  })
})
