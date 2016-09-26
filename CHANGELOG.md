# Changelog

# 2.3.1
Added guard against undefined Redux action in reducer.

# 2.3.0
Added CommonJS and ES6 module builds (as well as the pre-existing UMD build_.
ComonJS build is now the default `package.json` target instead of the UMD target.

# 2.2.0
Added support for configurable index strategy (supported in `js-worker-search` version 1.1.0).
Search users can now choose between all-substring matches (default), prefix matches, and exact word matches only.
To override the default, simply pass a configured `SearchApi` argument to the `reduxSearch` middleware like so:

```js
import { reduxSearch, SearchApi, INDEX_MODES } from 'redux-search'

const indexMode = INDEX_MODES.PREFIXES || INDEX_MODES.EXACT_WORDS || INDEX_MODES.ALL_SUBSTRINGS

const finalCreateStore = compose(
  // Other middleware ...
  reduxSearch({
    resourceIndexes: { ... },
    resourceSelector: (resourceName, state) => state.resources.get(resourceName),
    searchApi: new SearchApi({ indexMode })
  })
)(createStore)
```

# 2.1.0
Named `state` object passed to custom resource-indexing functions in order to enable more flexible custom indices.

# 2.0.0
Extract web-worker search utilty into its own NPM package, [js-worker-search](https://github.com/bvaughn/js-worker-search). Moved web-worker support detection (previously managed by `CapabilitiesBasedSearchApi`) into that module as well to simplify the redux-search interface.

### Upgrade path (1.x to 2.x)
If you were previously importing `CapabilitiesBasedSearchApi` or `WorkerSearchApi` directly you should now just import `SearchApi`. It will handle auto-detecting web-worker support and use the correct implementation under the hood.

`SearchUtility` will now longer be exported by this package. Import it from [js-worker-search](https://github.com/bvaughn/js-worker-search) instead.

# 1.0.0
Result selector created by `getSearchSelectors` automatically filters the result list to ensure that all results are all present in the resource collection. (See issue #29 for more background information.)

### Upgrade path (0.x to 1.x)

Update `getSearchSelectors` references to use named parameters. For example this...

```javascript
const selectors = getSearchSelectors('books')
```

...becomes this...

```javascript
const selectors = getSearchSelectors({
  resourceName: 'books',
  resourceSelector: (resourceName, state) => state.resources.get(resourceName)
})
```

# 0.2.0
Added `CapabilitiesBasedSearchApi` for auto-detecting web worker support and degrading if needed.
Exporting `SearchUtility` in case library users want to implement custom search functionality.

# 0.1.0
Initial release.
