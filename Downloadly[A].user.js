// ==UserScript==
// @name Downloadly[A]
// @description Force Cached Downloadly
// @namespace Aggelos
// @author Aggelos
// @exclude *://webcache.googleusercontent.com/search?q=cache:*
// @include *://downloadly.ir/*                             
// @grant none
// ==/UserScript==

document.location = "https://webcache.googleusercontent.com/search?q=cache:" + document.location;
