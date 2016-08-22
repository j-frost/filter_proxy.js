#!/usr/bin/env node

function filter( d, m ) { // iterative and staging part
	var r = JSON.parse( JSON.stringify(d) ); // make a deep copy of the original so as to out-of-place the whole thing
	for (var i in m) { // iterate over all relation sets in the array
		var f = m[i]
		for ( var j in Object.keys(f) ) { // iterate over single relations
			var k = Object.keys(f)[j];
			var v = f[k];
			for (var c in r) { // recursively filter the data and every child (r[c]) for key k being equal to value v
				_filter( r, r[c], k, v );
			}
		}
	}
	return r;
}

function _filter( n, c, p, v ) { // recursive part
	if (typeof n !== "object") { // abort trivial cases
		return
	}
	if (c.hasOwnProperty(p) && c[p] === v) { // when we find a case of unwanted value on property
		if ( Array.isArray(n) ) { // either we erase it from the array without touching other entries
			n[n.indexOf(c)] = "";
			n.clean("");
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
				_filter( c, c[g], p, v );
			}
		}
	}
}

Array.prototype.clean = function(deleteValue) { // adds a function to simulate ArrayList like behaviour
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

// 
// boilerplate
// 

var filter_map = [
	{ "newsletter" : "Division News Financial Services" },
	//{ "newsletter" : "Pressespiegel" },
	//{ "newsletter" : "Presse-Abend-Auswertung" },
	//{ "project" : "comdirect" },
	//{ "link" : "" },
	//{ "projectId" : 88 },
	//{ "_id" : "ccs-F256DC85B441" },
	//{ "_type" : "on" },
	{ "total" : 220 }
];

var sdata = require( './data-1.json' );
var mdata = require( './data-40.json' );
var ldata = require( './data-100.json' );
var xdata = require( './data-400.json' );
var edata = require( './data-100000.json' );
var json = edata;
var r = filter( json, filter_map );

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
