import test from 'tape'
import Immutable from 'immutable'
import Search from './Search'

const documentA = Immutable.fromJS({id: 1, name: 'One', description: 'The first document'})
const documentB = Immutable.fromJS({id: 2, name: 'Two', description: 'The second document'})
const documentC = Immutable.fromJS({id: 3, name: 'Three', description: 'The third document'})
const documentD = Immutable.fromJS({id: 4, name: '楌ぴ', description: '堦ヴ礯 ラ蝥曣んを 檨儯饨䶧'})
const documentE = Immutable.fromJS({id: 5, name: 'ㄨ穯ゆ姎囥', description: '楌ぴ 堦ヴ礯 ラ蝥曣んを 檨儯饨䶧䏤'})
const documents = [
  documentA,
  documentB,
  documentC,
  documentD,
  documentE
]

function init () {
  const searchableDocuments = new Search()

  documents.forEach(doc => {
    searchableDocuments.indexDocument(doc.get('id'), doc.get('name'))
    searchableDocuments.indexDocument(doc.get('id'), doc.get('description'))
  })

  return searchableDocuments
}

test('Search should return documents ids for any searchable field matching a query', t => {
  const searchableDocuments = init()
  let ids = searchableDocuments.search('One')
  t.equal(ids.length, 1)
  t.deepLooseEqual(ids, [1])

  ids = searchableDocuments.search('Third')
  t.equal(ids.length, 1)
  t.deepLooseEqual(ids, [3])

  ids = searchableDocuments.search('the')
  t.equal(ids.length, 3)
  t.deepLooseEqual(ids, [1, 2, 3])

  ids = searchableDocuments.search('楌') // Tests matching of other script systems
  t.equal(ids.length, 2)
  t.deepLooseEqual(ids, [4, 5])
  t.end()
})

test('Search should return documents ids only if document matches all tokens in a query', t => {
  const searchableDocuments = init()
  let ids = searchableDocuments.search('the second')
  t.equal(ids.length, 1)
  t.equal(ids[0], 2)

  ids = searchableDocuments.search('three document') // Spans multiple fields
  t.equal(ids.length, 1)
  t.equal(ids[0], 3)
  t.end()
})

test('Search should return an empty array for query without matching documents', t => {
  const searchableDocuments = init()
  const ids = searchableDocuments.search('four')
  t.equal(ids.length, 0)
  t.end()
})

test('Search should return all uids for an empty query', t => {
  const searchableDocuments = init()
  const ids = searchableDocuments.search('')
  t.equal(ids.length, 5)
  t.end()
})

test('Search should ignore case when searching', t => {
  const searchableDocuments = init()
  const texts = ['one', 'One', 'ONE']
  texts.forEach((text) => {
    const ids = searchableDocuments.search(text)
    t.equal(ids.length, 1)
    t.equal(ids[0], 1)
  })

  t.end()
})

test('Search should use substring matching', t => {
  const searchableDocuments = init()
  let texts = ['sec', 'second', 'eco', 'cond']
  texts.forEach((text) => {
    let ids = searchableDocuments.search(text)
    t.equal(ids.length, 1)
    t.equal(ids[0], 2)
  })

  texts = ['堦', '堦ヴ', '堦ヴ礯', 'ヴ', 'ヴ礯']
  texts.forEach((text) => {
    let ids = searchableDocuments.search(text)
    t.equal(ids.length, 2)
    t.deepLooseEqual(ids, [4, 5])
  })

  t.end()
})

test('Search should allow custom indexing via indexDocument', t => {
  const searchableDocuments = init()
  const text = 'xyz'
  let ids = searchableDocuments.search(text)
  t.equal(ids.length, 0)

  const id = documentA.get('id')
  searchableDocuments.indexDocument(id, text)

  ids = searchableDocuments.search(text)
  t.equal(ids.length, 1)
  t.equal(ids[0], 1)
  t.end()
})
