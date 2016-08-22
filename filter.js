#!/usr/bin/env node

function filter( d, fs ) { // iterative and staging part
	var r = JSON.parse( JSON.stringify(d) ); // make a deep copy of the original so as to out-of-place the whole thing
	for (var i in fs) { // iterate over all functions to be tested
		var f = fs[i]
		for (var c in r) { // recursively filter the data and every child (r[c]) for key k being equal to value v
			_filter( r, r[c], f );
		}
	}
	return r;
}

function _filter( n, c, f ) { // recursive part
	if (typeof n !== "object") { // abort trivial cases
		return
	}
	if ( f(c) ) { // when we find that the function matches on a child
		if ( Array.isArray(n) ) { // either we erase it from the array without touching other entries
			n[n.indexOf(c)] = "";
			n = _clean_array(n);
		}
		else { // or we delete the entire thing
			for (var k in n) {
				if (n[k] === c) {
					delete n[k];
					break;
				}
			}
		}
	}
	if (typeof c === "object") { // in case the child is itself an object, we must proliferate recursion to all grand children
		for (var g in c) {
			if (typeof c[g] === "object" && c[g] !== null) {
				_filter( c, c[g], f );
			}
		}
	}
}

function _clean_array(a) {
	var n = new Array();
	for (var i = 0; i < a.length; i++) {
		if (a[i]) {
			n.push(a[i]);
		}
	}
	return n;
}

// 
// boilerplate
// 

var fs = [
	function(obj) {
		return obj["newsletter"] === "Division News Financial Services";
	},
	function(obj) {
		return obj["newsletterEditionArticlesId"] >= 2375252;
	}
]

var sdata = require( './data-1.json' );
var mdata = require( './data-40.json' );
var ldata = require( './data-100.json' );
var xdata = require( './data-400.json' );
var edata = require( './data-100000.json' );
var json = edata;
var r = filter( json, fs );

var hits = json.data.hits.hits
for (var i = 0; i < hits.length; i++) {
	var hit = hits[i];
	var docs = hit._source.newsletterDocuments;
	var offset = 0;
	for (var j = 0; j < docs.length; j++) {
		var jdoc = docs[j].newsletter;
		console.log( jdoc );
		try {
			rdoc = r.data.hits.hits[i]._source.newsletterDocuments[j - offset].newsletter;
			if ( jdoc !== rdoc ) {
				offset++;
			}
			else {
				console.log( rdoc );
			}
		}
		catch (e) {
			offset++;
		}
		console.log();
	}
}
