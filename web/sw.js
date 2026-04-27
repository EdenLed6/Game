// Minimal service worker — cache the app shell for offline play.
const VERSION = "v1";
const CACHE = "nihongo-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/screens.css",
  "./js/main.js",
  "./js/router.js",
  "./js/dom.js",
  "./js/store.js",
  "./js/speaker.js",
  "./js/screens/main.js",
  "./js/screens/lesson-detail.js",
  "./js/screens/quiz.js",
  "./js/screens/flashcards.js",
  "./js/screens/matching.js",
  "./js/screens/number-game.js",
  "./js/screens/sentence-builder.js",
  "./js/screens/challenge.js",
  "./js/screens/workbook.js",
  "./data/lessons.json",
  "./data/workbook.json",
  "./icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached || new Response("offline", { status: 503 }));
    })
  );
});
