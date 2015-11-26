/** @flow */

/**
 * Maps search tokens to uids.
 * This structure is used by the Search class to optimize search operations.
 * Forked from JS search (github.com/bvaughn/js-search).
 */
export default class SearchIndex {
  tokenToUidMap: { [token: string]: any }

  constructor () {
    this.tokenToUidMap = {}
  }

  /**
   * Maps the specified token to a uid.
   *
   * @param token Searchable token (e.g. "road")
   * @param uid Identifies a document within the searchable corpus
   */
  indexDocument (token: string, uid: any): void {
    if (!this.tokenToUidMap[token]) {
      this.tokenToUidMap[token] = {}
    }

    this.tokenToUidMap[token][uid] = uid
  }

  /**
   * Finds uids that have been mapped to the set of tokens specified.
   * Only uids that have been mapped to all tokens will be returned.
   *
   * @param tokens Array of searchable tokens (e.g. ["long", "road"])
   * @return Array of uids that have been associated with the set of search tokens
   */
  search (tokens: Array<string>): Array<any> {
    let uidMap: {[uid: any]: any} = {}
    let initialized = false

    tokens.forEach(token => {
      let currentUidMap: {[uid: any]: any} = this.tokenToUidMap[token] || {}

      if (!initialized) {
        initialized = true

        for (let uid in currentUidMap) {
          uidMap[uid] = currentUidMap[uid]
        }
      } else {
        for (let uid in uidMap) {
          if (!currentUidMap[uid]) {
            delete uidMap[uid]
          }
        }
      }
    })

    let uids: Array<any> = []

    for (let uid in uidMap) {
      uids.push(uidMap[uid])
    }

    return uids
  }
}
