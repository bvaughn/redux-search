import SearchIndexWorker from './SearchIndexWorker'
import expect from 'expect.js'

describe('SearchIndexWorker', () => {
  class StubWorker {
    constructor () {
      this.indexedDocumentMap = {}
      this.searchQueue = []
    }

    postMessage (data) {
      const { method, ...props } = data

      switch (method) {
        case 'indexDocument':
          const { uid, text } = props
          if (!this.indexedDocumentMap[uid]) {
            this.indexedDocumentMap[uid] = []
          }
          this.indexedDocumentMap[uid].push(text)
          break
        case 'search':
          const { callbackId, query } = props
          this.searchQueue.push({ callbackId, query })
          break
      }
    }

    rejectSearch (index, error) {
      const { callbackId } = this.searchQueue[index]
      this.onerror({ data: { error, callbackId } })
    }

    resolveSearch (index, results) {
      const { callbackId } = this.searchQueue[index]
      this.onmessage({ data: { results, callbackId } })
    }
  }

  let search

  beforeEach(() => {
    search = new SearchIndexWorker(StubWorker)
  })

  describe('indexDocument', () => {
    it('should index a document with the specified text(s)', () => {
      search.indexDocument('a', 'cat')
      search.indexDocument('a', 'dog')
      search.indexDocument('b', 'cat')

      expect(Object.keys(search.worker.indexedDocumentMap).length).to.equal(2)
      expect(search.worker.indexedDocumentMap.a.length).to.equal(2)
      expect(search.worker.indexedDocumentMap.a).to.eql(['cat', 'dog'])
      expect(search.worker.indexedDocumentMap.b.length).to.equal(1)
      expect(search.worker.indexedDocumentMap.b).to.eql(['cat'])
    })
  })

  describe('indexDocument', () => {
    it('should search for the specified text', () => {
      search.search('cat')
      expect(search.worker.searchQueue.length).to.equal(1)
      expect(search.worker.searchQueue[0].query).to.equal('cat')
    })

    it('should resolve the returned Promise on search completion', async () => {
      const promise = search.search('cat')
      search.worker.resolveSearch(0, ['a', 'b'])

      const result = await promise
      expect(result).to.eql(['a', 'b'])
    })

    it('should resolve multiple concurrent searches', async () => {
      const promises = Promise.all([
        search.search('cat'),
        search.search('dog')
      ])
      search.worker.resolveSearch(0, ['a'])
      search.worker.resolveSearch(1, ['a', 'b'])
      await promises
    })

    it('should resolve searches in the correct order', async () => {
      const results = []
      const promiseList = [
        search.search('cat'),
        search.search('dog'),
        search.search('rat')
      ].map(promise => promise.then(result => results.push(result)))

      search.worker.resolveSearch(1, ['1'])
      search.worker.resolveSearch(0, ['0'])
      search.worker.resolveSearch(2, ['2'])

      await Promise.all(promiseList)
      const [r1, r2, r3] = results
      expect(r1).to.eql(['0'])
      expect(r2).to.eql(['1'])
      expect(r3).to.eql(['2'])
    })

    it('should not reject all searches if one fails', async () => {
      const errors = []
      const results = []
      const promises = [
        search.search('cat'),
        search.search('dog')
      ].map(promise =>
        promise
          .then(result => results.push(result))
          .catch(error => errors.push(error))
      )

      search.worker.rejectSearch(1, new Error('1'))
      search.worker.resolveSearch(0, ['0'])

      try {
        await Promise.all(promises)
      } catch (err) {}

      expect(results.length).to.equal(1)
      expect(results[0]).to.eql(['0'])
      expect(errors.length).to.equal(1)
      expect(errors[0].message).to.equal('1')
    })
  })
})
