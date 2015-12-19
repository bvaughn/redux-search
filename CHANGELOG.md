# Changelog

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
