let CACHE_NAME = "nsa-academy-cache-v1";
const urlsToCache = [
  "/",
  "/login",
  "/register",
  "logout",
  "/cricket",
  "/cricket/scoreboard",
  "/cricket/finalscore",
  "/cricket/players",
  "/cricket/matches",
  "/cricket/new-match",
  "/cricket/settings",
];
self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
