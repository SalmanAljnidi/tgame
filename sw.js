// Service Worker - offline cache
const CACHE_NAME = "spidey-full-offline-v1767248588";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    ])
  );
});

// Offline-first
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req, {ignoreSearch:true}).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=> caches.match("./index.html", {ignoreSearch:true})))
  );
});
