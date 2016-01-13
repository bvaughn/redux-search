# Changelog

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
