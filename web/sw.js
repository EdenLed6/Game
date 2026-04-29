// sw.js — minimal pass-through service worker.
//
// Exists ONLY so the browser marks the site as installable and fires
// `beforeinstallprompt`. Without a registered SW, Chrome / Edge /
// Samsung Internet won't surface their install UI and our custom
// install button can't trigger the one-tap install.
//
// CRITICAL: this SW does NOT cache anything. Every request goes to
// the network — the fetch listener registers but never calls
// event.respondWith, so the browser performs its normal network
// fetch. A previous SW in this codebase cached aggressively and
// caused weeks of stale-content issues; this one is deliberately
// stateless.

self.addEventListener("install", (event) => {
  // Activate immediately on install instead of waiting for all open
  // tabs to close.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Take control of any open clients (the live page) right away, and
  // proactively clear any caches from earlier SW versions that might
  // still be holding stale content.
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {}
    try {
      await self.clients.claim();
    } catch {}
  })());
});

self.addEventListener("fetch", (event) => {
  // Pass-through: do not call event.respondWith, so the browser
  // performs its normal network fetch. A registered fetch listener
  // is what makes the SW count as "controlling" for the
  // installability heuristics — but we deliberately don't intervene
  // in the request flow.
});
