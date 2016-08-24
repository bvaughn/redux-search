import test from 'tape'
import { INDEX_MODES } from 'js-worker-search'
import SearchApi from './SearchApi'

function getSearchApi ({ indexMode } = {}) {
  const documentA = {id: 1, name: 'One', description: 'The first document'}
  const documentB = {id: 2, name: 'Two', description: 'The second document'}
  const documentC = {id: 3, name: 'Three', description: 'The third document'}

  const searchApi = new SearchApi({ indexMode }) // Single-threaded Search API for easier testing
  searchApi.indexResource({
    fieldNamesOrIndexFunction: ['name', 'description'],
    resourceName: 'documents',
    resources: [ documentA, documentB, documentC ],
    state: {}
  })

  return searchApi
}

/** Simple smoke test of non-web-worker based SearchApi */
test('SearchApi should return documents ids for any searchable field matching a query', async t => {
  const searchApi = getSearchApi()
  const ids = await searchApi.performSearch('documents', 'One')
  t.equal(ids.length, 1)
  t.equal(ids[0], 1)
  t.end()
})

test('SearchApi should pass through the correct :indexMode for ALL_SUBSTRINGS', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.ALL_SUBSTRINGS })

  const matches = await searchApi.performSearch('documents', 'econ')
  t.equal(matches.length, 1)
  t.equal(matches[0], 2)

  const noMatches = await searchApi.performSearch('documents', 'xyz')
  t.equal(noMatches.length, 0)

  t.end()
})

test('SearchApi should pass through the correct :indexMode for PREFIXES', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.PREFIXES })

  const matches = await searchApi.performSearch('documents', 'Thre')
  t.equal(matches.length, 1)
  t.equal(matches[0], 3)

  const noMatches = await searchApi.performSearch('documents', 'econd')
  t.equal(noMatches.length, 0)

  t.end()
})

test('SearchApi should pass through the correct :indexMode for EXACT_WORDS', async t => {
  const searchApi = getSearchApi({ indexMode: INDEX_MODES.EXACT_WORDS })

  const matches = await searchApi.performSearch('documents', 'One')
  t.equal(matches.length, 1)
  t.equal(matches[0], 1)

  const noMatches = await searchApi.performSearch('documents', 'seco')
  t.equal(noMatches.length, 0)

  t.end()
})
