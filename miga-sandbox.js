/* MigaBuilder sandboxed previews.
 * AI-generated websites, games, apps and widgets run inside an <iframe sandbox>
 * without allow-same-origin, so their scripts get a throwaway origin: they
 * cannot read this site's localStorage, cookies, saved drafts or API keys,
 * and cannot reach into the page around them.
 *
 * A sandboxed frame has no storage of its own, and generated code that calls
 * localStorage (high scores, to-do lists) would crash. wrap() adds a small
 * in-memory stand-in so the preview still works; the downloaded file uses the
 * real storage when opened on its own.
 *
 * Usage: MigaSandbox.render(iframe, html)   // or iframe.srcdoc = MigaSandbox.wrap(html)
 */
(function () {
  'use strict';
  var RULES = 'allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-downloads';
  var SHIM = '<script>(function(){function M(){var d={};return{getItem:function(k){return Object.prototype.hasOwnProperty.call(d,k)?d[k]:null},' +
    'setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},' +
    'get length(){return Object.keys(d).length}}}["localStorage","sessionStorage"].forEach(function(n){try{Object.defineProperty(window,n,{value:M(),configurable:true})}catch(e){}})})();<\/script>';

  function wrap(html) {
    html = String(html == null ? '' : html);
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, function (m) { return m + SHIM; });
    if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, function (m) { return m + '<head>' + SHIM + '</head>'; });
    return SHIM + html;
  }

  function lock(frame) {
    if (frame && frame.getAttribute('sandbox') !== RULES) frame.setAttribute('sandbox', RULES);
    return frame;
  }

  function render(frame, html) {
    lock(frame).srcdoc = wrap(html);
  }

  window.MigaSandbox = { rules: RULES, wrap: wrap, lock: lock, render: render };
})();
