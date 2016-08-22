# filter_proxy.js

----
## What Is `filter_proxy.js`?
It's a small and simple little linear sequential function based `application/json` filter. 

Functions may be defined; when they return `true`, the object they inspected will be deleted from any arrays it's a part of or otherwise be set to `{}`. 

----
## Codeworks
`_filter` is a function that'll immediately make a deep copy of the given data. It'll then iterate `__filter` recursively over the entire object (whatever it's structure), and apply any functions given. `__filter` will modify the object in appropriate cases. 

Both filter helper functions are explicitly separate from `resp_filter`, which is the function actually used by boiler plate. Currently, filter functions are defined inside `resp_filter`. 

Additionally, `filter_proxy.js` defines a `_clean_array` function, which is used by `__filter` to remove objects when they're part of an array. 

----
## Likely Issues
### Performance
The whole thing is sequential. Benchmarking shows processing times of up to half a second for real world data. If needed, it'd be relatively easy to split the data in `resp_filter` and start parallel `_filter` threads. 

### `_clean_array`
`_clean_array` is a somewhat dirty implementation of the clearing algorithm, however defining a clean function á la

```javascript
Array.prototype.clean = function(deleteValue) { // adds a function to simulate ArrayList like behaviour
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};
```

will not work, because the `__filter` will then iterate over this function as if it was an ordinary property. Some solution to this may be found, but for now, this seems to work fine. 
