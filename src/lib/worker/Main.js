/**
 * Client side, full text search utility.
 * This interface exposes web worker search capabilities to the UI thread.
 * @flow
 */
// TODO import SearchIndexWorker from 'worker?inline=true!./Worker'
import uuid from 'node-uuid'

/**
 * Client side, full text search utility.
 */
export default class SearchWorkerLoader {

  /**
   * Constructor.
   */
  constructor (WorkerClass /* TODO = SearchIndexWorker */) {
    // Maintain context if references are passed around
    this.indexDocument = this.indexDocument.bind(this)
    this.search = this.search.bind(this)

    this.callbackQueue = []
    this.callbackIdMap = {}

    this.worker = new WorkerClass()
    this.worker.onerror = event => {
      const { callbackId, error } = event.data
      this._updateQueue({ callbackId, error })
    }
    this.worker.onmessage = event => {
      const { callbackId, results } = event.data
      this._updateQueue({ callbackId, results })
    }
  }

  /**
   * Adds or updates a uid in the search index and associates it with the specified text.
   * Note that at this time uids can only be added or updated in the index, not removed.
   *
   * @param uid Uniquely identifies a searchable object
   * @param text Text to associate with uid
   */
  indexDocument (uid: any, text: string): SearchWorkerLoader {
    this.worker.postMessage({
      method: 'indexDocument',
      text,
      uid
    })

    return this
  }

  /**
   * Searches the current index for the specified query text.
   * Only uids matching all of the words within the text will be accepted.
   * If an empty query string is provided all indexed uids will be returned.
   *
   * Document searches are case-insensitive (e.g. "search" will match "Search").
   * Document searches use substring matching (e.g. "na" and "me" will both match "name").
   *
   * @param query Searchable query text
   * @return Promise to be resolved with an array of uids
   */
  search (query: string): Promise {
    return new Promise((resolve, reject) => {
      const callbackId = uuid.v4()
      const data = { callbackId, reject, resolve }

      this.worker.postMessage({
        method: 'search',
        query,
        callbackId
      })

      this.callbackQueue.push(data)
      this.callbackIdMap[callbackId] = data
    })
  }

  /**
   * Updates the queue and flushes any completed promises that are ready.
   */
  _updateQueue ({ callbackId, error, results }) {
    const target = this.callbackIdMap[callbackId]
    target.complete = true
    target.error = error
    target.results = results

    while (this.callbackQueue.length) {
      let data = this.callbackQueue[0]

      if (!data.complete) {
        break
      }

      this.callbackQueue.shift()

      delete this.callbackIdMap[data.callbackId]

      if (data.error) {
        data.reject(data.error)
      } else {
        data.resolve(data.results)
      }
    }
  }
}
