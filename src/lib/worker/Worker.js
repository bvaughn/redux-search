/**
 * Search entry point to web worker.
 * Builds search index and performs searches on separate thread from the ui.
 * @flow
 */
import Search from '../Search'

const search = new Search()

self.addEventListener('message', event => {
  const { data } = event
  const { method } = data

  switch (method) {
    case 'indexDocument':
      const { uid, text } = data

      search.indexDocument(uid, text)
      break
    case 'search':
      const { callbackId, query } = data

      const results = search.search(query)

      self.postMessage({ callbackId, results })
      break
  }
}, false)
