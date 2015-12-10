[`reduxSearch`](README.md#reduxsearch-resourceindexes-resourceselector-searchapi-searchstateselector-)
------
Typically redux-search can be configured to index documents using an array of searchable field names.

```javascript
const store = compose(
  reduxSearch({
    // Other configuration goes here...
    resourceIndexes: {
      // Search configuration here (eg. search all Books by :title and :author)
      books: ['author', 'title']
    }
  })
)(createStore)(rootReducer)
```

Sometimes you may want to index on computed values. Or perhaps your collection's attributes can't be accessed using simple bracket notation. In that case you can provide your own custom indexing function. For example, a book with multiple related authors might be indexed like so:

```javascript
const store = compose(
  reduxSearch({
    // Other configuration goes here...
    resourceIndexes: {
      books: ({ resources, indexDocument }) => {
        resources.forEach(book => {
          indexDocument(book.id, book.name)
          book.authors.forEach(
            author => indexDocument(book.id, author.name)
          )
        })
      }
    }
  })
)(createStore)(rootReducer)
```

You can use the `indexDocument` callback to index your collection on as many fields as you would like. Indexing is done in a web-worker thread and so it won't block the UI.
