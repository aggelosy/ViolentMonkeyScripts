// ==UserScript==
// @name        Remove Overlay from LookMovie
// @namespace   AYScripts
// @include     https://lookmovie.ag/*
// @grant       none
// @version     1.0
// @author      -
// @description Disables the AdBlocked Detected overlay.
// ==/UserScript==

// <script>
//   document.addEventListener('DOMContentLoaded', function () {
//       let height = document.querySelector('#ft-site-logo').scrollHeight;
//       setTimeout(function () {
//           if (height < 1) {
//               document.querySelector('body').classList.add('wellcome-boy');
//           }
//       }, 2500);
//     });
// </script>



setTimeout(function(){
  document.querySelector('body').classList.remove('wellcome-boy');
}, 3000);


