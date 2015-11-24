import Immutable from 'immutable'
import Search from './Search'
import expect from 'expect.js'

describe('Search', () => {
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

  let searchableDocuments

  beforeEach(() => {
    searchableDocuments = new Search()

    documents.forEach(doc => {
      searchableDocuments.indexDocument(doc.get('id'), doc.get('name'))
      searchableDocuments.indexDocument(doc.get('id'), doc.get('description'))
    })
  })

  it('should return documents ids for any searchable field matching a query', () => {
    let ids = searchableDocuments.search('One')
    expect(ids.length).to.equal(1)
    expect(ids).to.contain(1)

    ids = searchableDocuments.search('Third')
    expect(ids.length).to.equal(1)
    expect(ids).to.contain(3)

    ids = searchableDocuments.search('the')
    expect(ids.length).to.equal(3)
    expect(ids).to.contain(1)
    expect(ids).to.contain(2)
    expect(ids).to.contain(3)

    ids = searchableDocuments.search('楌') // Tests matching of other script systems
    expect(ids.length).to.equal(2)
    expect(ids).to.contain(4)
    expect(ids).to.contain(5)
  })

  it('should return documents ids only if document matches all tokens in a query', () => {
    let ids = searchableDocuments.search('the second')
    expect(ids.length).to.equal(1)
    expect(ids).to.contain(2)

    ids = searchableDocuments.search('three document') // Spans multiple fields
    expect(ids.length).to.equal(1)
    expect(ids).to.contain(3)
  })

  it('should return an empty array for query without matching documents', () => {
    const ids = searchableDocuments.search('four')
    expect(ids.length).to.equal(0)
  })

  it('should return all uids for an empty query', () => {
    const ids = searchableDocuments.search('')
    expect(ids.length).to.equal(5)
  })

  it('should ignore case when searching', () => {
    ['one', 'One', 'ONE'].forEach((text) => {
      const ids = searchableDocuments.search(text)
      expect(ids.length).to.equal(1)
      expect(ids).to.contain(1)
    })
  })

  it('should use substring matching', () => {
    let texts = ['sec', 'second', 'eco', 'cond']
    texts.forEach((text) => {
      let ids = searchableDocuments.search(text)
      expect(ids.length).to.equal(1)
      expect(ids).to.contain(2)
    })

    texts = ['堦', '堦ヴ', '堦ヴ礯', 'ヴ', 'ヴ礯']
    texts.forEach((text) => {
      let ids = searchableDocuments.search(text)
      expect(ids.length).to.equal(2)
      expect(ids).to.contain(4)
      expect(ids).to.contain(5)
    })
  })

  it('should allow custom indexing via indexDocument', () => {
    const text = 'xyz'
    let ids = searchableDocuments.search(text)
    expect(ids.length).to.equal(0)

    const id = documentA.get('id')
    searchableDocuments.indexDocument(id, text)

    ids = searchableDocuments.search(text)
    expect(ids.length).to.equal(1)
    expect(ids).to.contain(id)
  })
})
