import Main from './Main'
import expect from 'expect.js'

describe('Main', () => {
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
    search = new Main(StubWorker)
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

    it('should resolve the returned Promise on search completion', (done) => {
      const promise = search.search('cat')
      promise.then(result => {
        expect(result).to.eql(['a', 'b'])
        done()
      })
      search.worker.resolveSearch(0, ['a', 'b'])
    })

    it('should resolve multple concurrent searches', (done) => {
      Promise.all([
        search.search('cat'),
        search.search('dog')
      ]).then(result => {
        done()
      })

      search.worker.resolveSearch(0, ['a'])
      search.worker.resolveSearch(1, ['a', 'b'])
    })

    it('should resolve searches in the correct order', (done) => {
      const promises = [
        search.search('cat'),
        search.search('dog'),
        search.search('rat')
      ]

      let results = []
      promises.forEach(promise =>
        promise.then(result => results.push(result))
      )

      Promise.all(promises).then(result => {
        expect(results.length).to.equal(3)
        expect(results[0]).to.eql(['0'])
        expect(results[1]).to.eql(['1'])
        expect(results[2]).to.eql(['2'])
        done()
      })

      search.worker.resolveSearch(1, ['1'])
      search.worker.resolveSearch(0, ['0'])
      search.worker.resolveSearch(2, ['2'])
    })

    it('should not reject all searches if one fails', (done) => {
      const promises = [
        search.search('cat'),
        search.search('dog')
      ]

      let results = []
      let errors = []
      promises.forEach(promise =>
        promise.then(
          result => results.push(result),
          error => errors.push(error)
        )
      )

      Promise.all(promises).then(
        () => {},
        () => {
          expect(results.length).to.equal(1)
          expect(results[0]).to.eql(['0'])
          expect(errors.length).to.equal(1)
          expect(errors[0].message).to.eql('1')
          done()
        }
      )

      search.worker.rejectSearch(1, new Error('1'))
      search.worker.resolveSearch(0, ['0'])
    })
  })
})
