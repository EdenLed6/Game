// Self-destructing service worker.
//
// The previous web port (PR #4) registered an old sw.js that aggressively
// cached the HTML/CSS/JS for offline use. After the rebuild the cached old
// shell still gets served first, blocking users from ever seeing the new app.
//
// This file replaces the old sw.js with a minimal one that, on activation,
// (1) clears every cache, (2) unregisters itself, and (3) tells any open tab
// to reload. After one visit the browser is back to a normal no-SW state.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {}

    try {
      await self.registration.unregister();
    } catch {}

    try {
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    } catch {}
  })());
});

// Pass-through fetch — never cache anything.
self.addEventListener("fetch", () => {});
