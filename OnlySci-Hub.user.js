// ==UserScript==
// @name OnlySci-Hub
// @namespace Violentmonkey Scripts
// @include https://*.*
// @grant none
// ==/UserScript==

document.body.addEventListener('mousedown', function(e){
    var targ = e.target || e.srcElement;
    if ( targ && targ.href && targ.href.match(/https?:\/\/doi.org/) ) {
        targ.href = targ.href.replace(/https?:\/\/doi\.org/, 'https://sci-hub.tw');
    }
});

document.body.addEventListener('mousedown', function(e){
    var targ = e.target || e.srcElement;
    if ( targ && targ.href && targ.href.match(/https?:\/\/dx.doi.org/) ) {
        targ.href = targ.href.replace(/https?:\/\/dx.doi\.org/, 'https://sci-hub.tw');
    }
});
