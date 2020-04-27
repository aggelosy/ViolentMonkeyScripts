// ==UserScript==
// @name          Enhanced Library Genesis
// @description   OCDownload
// @namespace     Aggelos
// @author        demcookies
// @oujs:author   dem
// @version       0.1
// @license       MIT
// @include         *://libgen.io/*/index.php*
// @include         *://gen.lib.rus.ec/*/index.php*
// @run-at        document-end
// @require       http://code.jquery.com/jquery-latest.js
// ==/UserScript==

$('td div a').on('click', function(ev){
    ev.preventDefault();
    var link = $(this).attr('href');
    // GETs the html file where the link originally points
    $.when($.get(link, function(data) {
        data = $.parseHTML(data);
        // The download link is the second in the original file
        link = $(data).find('a:eq(1)').attr('href');
    })).then(function() {
        window.location.href = link;
    });
});