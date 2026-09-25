(function () {
  'use strict';
  // Cloudflare Web Analytics: cookieless visitor counts for the whole site.
  // Paste the site token from Cloudflare dashboard → Analytics → Web analytics.
  // Left empty, this file does nothing.
  var TOKEN = 'a2ac7fa068194be8834b929e1cba63df';
  if (!TOKEN || location.hostname === 'localhost') return;
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
