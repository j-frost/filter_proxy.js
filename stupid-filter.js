#!/usr/bin/env node

function filter( d ) {
	var r = JSON.parse( JSON.stringify(d) );
	var hits = r.data.hits.hits;
	for (i = 0; i < hits.length; i++) {
		var hit = hits[i];
		var docs = hit._source.newsletterDocuments;
		hit._source.newsletterDocuments = docs.filter( function(doc) {
			return doc.newsletter !== "Division News Financial Services";
		});
	}
	return r;
}

// ***
// boilerplate
// ***

var sdata  = require( './data-1.json' );
var mdata = require( './data-10.json' );
var ldata = require( './data-40.json' );
var xdata = require( './data-100.json' );
var edata = require( './data-400.json' );
var cdata = require( './data-100000.json' );
var json = cdata;
var r = filter( json );

var hits = json.data.hits.hits
for (i = 0; i < hits.length; i++) {
	var hit = hits[i];
	var docs = hit._source.newsletterDocuments;
	var offset = 0;
	for (j = 0; j < docs.length; j++) {
		jdoc = docs[j].newsletter;
		console.log( jdoc );
		try {
			rdoc = r.data.hits.hits[i]._source.newsletterDocuments[j - offset].newsletter;
		}
		catch (e) {
			offset++;
		}
		if ( jdoc !== rdoc ) {
			offset++;
		}
		else {
			console.log( rdoc );
		}
		console.log();
	}
}
