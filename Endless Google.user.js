// ==UserScript==
// @name            Endless Google
// @description     Load more results automatically and endlessly.
// @version         0.0.7
// @icon            https://github.com/tumpio/gmscripts/raw/master/Endless_Google/large.png
// @include         https://www.google.*
// @exclude         https://www.google.*/*&tbm=isch*
// @run-at          document-idle
// @noframes
// @license         MIT
// @author          tumpio
// @oujs:author     tumpio
// ==/UserScript==

// TODO: on page refresh:
//  2: load only the last scrolled page (on refresh, load last requested page) (could be a good default, needs scroll up support)
//      beforeunload -> store last requested page with GM_setVariable() and reload it instead
// TODO: onerror, onabort: show to user "page loading failed", button to retry

// FIXME: bug: Suggested images don't show up on new requested pages
// case: https://www.google.fi/webhp?tab=ww&ei=e0UjU9ynEKqkyAO46YD4DQ&ved=0CBEQ1S4#q=tetsaus
// workaround, hiding now

// FUTURE: Options dialog
// FUTURE: Replace footer with page #no info UI
// FUTURE: Add page up/down and back to top/bottom controls UI + (go to the page #n)?
// FUTURE: Add columns support
// FUTURE: show page loading icon
// FUTURE: show page fav-icons for results
// FUTURE: number results
// FUTURE: option to load static google css
// FUTURE: support scroll up

// NOTE: Options
var request_pct = 0.05; // percentage of window height left on document to request next page, value must be between 0-1
var event_type = "scroll"; // or "wheel"
var on_page_refresh = 1;
// 0: reload all previous pages requested
// 1: load only the first page (prevent restoring the scroll position)
// 2: load only the last page requested
var main = document.getElementById("main");
var rcnt = document.getElementById("rcnt");
var input = document.querySelector("form[role=search] input[name=q]");
var input_value = input.value;
var old_scrollY = 0;
var scroll_events = 0;
var next_link = null;
var cols = [];
var request_offsetHeight = 0;
var stop_events = false;

input.addEventListener("blur", reset, false); // NOTE: listens for new search input to reset state
window.addEventListener(event_type, onScroll, false);
window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
}, false);

async function requestNextPage(link) {
  console.log("request next");
  console.log(link);

  var response = await window.fetch(link);
  if (!response.ok)
    throw Error(response.statusText);

  var el = document.getElementById('navcnt');
  el.parentNode.removeChild(el); //Deletes the navigation box

  var holder = document.createElement("div");
  holder.innerHTML = await response.text();
  next_link = holder.querySelector("#pnnext").href;

  var next_col = document.createElement("div");
  next_col.className = "EG_col";
  next_col.appendChild(holder.querySelector("#center_col"));

  var rel_search = next_col.querySelector("#extrares");
  var rel_images = next_col.querySelector("#imagebox_bigimages");
  var rel_ads = next_col.querySelector("#tads");
  if (rel_search)
    rel_search.style.display = "none"; // NOTE: Hides repeating "related searches"
  if (rel_images)
    rel_images.style.display = "none"; // NOTE: Hides related images, that are broken (bug)
  if (rel_ads)
    rel_ads.style.display = "none"; // NOTE: Hides repeating "search results ad"

  cols.push(next_col);
  console.log("Page no: " + cols.length);
  next_col.id = next_col.className + "_" + (cols.length - 1); // NOTE: add unique id for every new col

  if (!rcnt || cols.length === 1) // NOTE: needs to be rechecked on a state reset too, and late insertation of element on google instant
    rcnt = document.getElementById("rcnt");
  rcnt.appendChild(next_col);
  stop_events = false;
  window.addEventListener(event_type, onScroll, false);
}

function onScroll(e) {
  var y = window.scrollY;
  // if (scroll_events === 0) old_scrollY = y; // stops only if scroll position was on 2. page
  var delta = e.deltaY || y - old_scrollY; // NOTE: e.deltaY for "wheel" event
  if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
    console.log("scroll end");
    window.removeEventListener(event_type, onScroll, false);

    try {
      if (!stop_events) {
        stop_events = true;
        requestNextPage(next_link || document.getElementById("pnnext").href)
        	.catch(e => console.error('request failed', e.toString()));
      }
    }
    catch (err) {
      console.error(err.name + ": " + err.message);
      // NOTE: recovery unnecessary, input event handles it with reset on new search
    }
  }
  old_scrollY = y;
  scroll_events += 1;
}

// NOTE: Resets the script state on a new search
function reset() {
  if (input.value !== input_value) {
    input_value = input.value;
    window.scrollTo(0, 0);
    for (var i = 0; i < cols.length; i++)
      rcnt.removeChild(cols[i]);
    cols = [];
    next_link = null;
    old_scrollY = 0;
    scroll_events = 0;
    console.log("RESET");
  }
}

console.log("egoogle.js initialized");
console.log("egoogle.js loaded");
