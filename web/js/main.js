// main.js — bootstraps the Kimura web port.
//
// 1. Fetch lessons.json + workbook.json (in parallel).
// 2. Instantiate Router.
// 3. Render bottom nav (3 tabs).
// 4. On every route change, mount the matching screen module.
//
// All screen modules export a function that takes { host, ctx } where
// ctx = { router, store, speaker, lessons, workbook, params }.

import { Router }                    from "./router.js";
import { renderBottomNav,
         setBottomNavVisible,
         setActiveTab }              from "./tabs.js";
import { mount, el }                 from "./dom.js";
import * as store                    from "./store.js";
import * as speaker                  from "./speaker.js";

// Screen modules — only the four screens that the APK's bottom-nav UI
// actually exposes. The lesson journey (multi-step orchestrator) handles
// every per-lesson page (intro / teach / vocab / practice / quiz / complete).
import { Learn }         from "./screens/learn.js";
import { Media }         from "./screens/media.js";
import { Profile }       from "./screens/profile.js";
import { LessonJourney } from "./screens/lesson-journey.js";

const SCREEN_MAP = {
  "learn":          Learn,
  "media":          Media,
  "profile":        Profile,
  "lesson-journey": LessonJourney,
};

async function loadJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load", url, err);
    return null;
  }
}

function showError(host, message) {
  mount(host, el("div", { class: "stub-screen" },
    el("p", {}, "אירעה שגיאה בטעינת התוכן."),
    el("p", { class: "t-muted", style: { marginTop: "8px" } }, String(message || ""))
  ));
}

(async function boot() {
  // Kill any service worker + cache from the previous web port. The earlier
  // version registered web/sw.js; that file no longer exists but the browser
  // keeps serving the stale cached HTML/CSS/JS until the SW is unregistered.
  // CRITICAL: if a SW was actually controlling this page, the HTML/CSS/JS
  // we're currently running are themselves cached. Unregistering does NOT
  // re-fetch — only a reload does. So we force one (gated by sessionStorage
  // to avoid an infinite loop in the rare case unregister fails).
  let killedSW = false;
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length > 0) killedSW = true;
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {}
  }
  if (typeof caches !== "undefined") {
    try {
      const keys = await caches.keys();
      if (keys.length > 0) killedSW = true;
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {}
  }
  if (killedSW && !sessionStorage.getItem("kimura-sw-killed")) {
    sessionStorage.setItem("kimura-sw-killed", "1");
    const u = new URL(location.href);
    u.searchParams.set("_t", String(Date.now()));
    location.replace(u.toString());
    return;
  }

  // PWA stale-CSS detector: if any <link rel="stylesheet"> in the cached
  // index.html points to a file that no longer exists on the server (404),
  // the cached HTML is stale and we force a hard reload from network.
  // After a deploy that renames override-*.css the PWA can boot with the
  // old href cached; this triggers exactly once and brings it back up to
  // date without the user having to reinstall.
  try {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const checks = await Promise.all(
      links.map((l) =>
        fetch(l.href, { method: "HEAD", cache: "no-store" })
          .then((r) => r.ok)
          .catch(() => true), // network errors don't trigger reload
      ),
    );
    if (checks.some((ok) => ok === false)) {
      const u = new URL(location.href);
      u.searchParams.set("_t", String(Date.now()));
      location.replace(u.toString());
      return;
    }
  } catch {}

  // PWA install button — only visible in a regular web browser, hidden
  // automatically inside the installed PWA via @media (display-mode:
  // standalone) in CSS.
  //
  // On Chrome / Edge / Samsung Internet on Android the browser fires
  // `beforeinstallprompt` once it decides the site is installable. We
  // capture the event, show our button, and replay the prompt when the
  // user clicks. iOS Safari does not fire this event — we detect iOS
  // and instead show inline instructions ("Share → Add to Home Screen").
  (function setupPwaInstall() {
    const installBtn = document.getElementById("pwa-install-btn");
    if (!installBtn) return;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
    if (isStandalone) return; // already installed → never show

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.hidden = false;
    });

    if (isIOS) {
      // Safari iOS has no install prompt API; show the button so the
      // user gets guided instructions on tap.
      installBtn.hidden = false;
    }

    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (outcome === "accepted") installBtn.hidden = true;
        return;
      }
      if (isIOS) {
        // The native iOS Share Sheet has the "Add to Home Screen"
        // option — direct the user there. RTL Hebrew copy.
        alert(
          "כדי להתקין את האפליקציה:\n" +
          "1. לחצו על כפתור השיתוף בתחתית הדפדפן\n" +
          "2. גללו ובחרו “הוסף למסך הבית”\n" +
          "3. לחצו “הוסף”"
        );
      }
    });

    window.addEventListener("appinstalled", () => {
      installBtn.hidden = true;
      deferredPrompt = null;
    });
  })();

  // Lock zoom — the meta viewport already says user-scalable=no but some
  // Android browsers (Samsung Internet, sometimes Chrome) ignore that flag
  // for accessibility. Block the pinch + double-tap gestures at the JS
  // level too so the page can't be zoomed regardless of browser policy.
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  let lastTap = 0;
  document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTap < 350) e.preventDefault();
    lastTap = now;
  }, { passive: false });
  document.addEventListener("wheel", (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  const host    = document.getElementById("screen-host");
  const navHost = document.getElementById("bottom-nav");

  // Parallel fetch — these are independent
  const [lessons, workbook] = await Promise.all([
    loadJSON("data/lessons.json"),
    loadJSON("data/workbook.json"),
  ]);

  if (!lessons) {
    showError(host, "lessons.json לא נטען");
    return;
  }

  // NOTE: Android's ProgressManager.recordActivity() is only invoked from
  // LessonJourneyActivity.onQuizComplete() after a passing score (>=80%).
  // We do not call it on app open to mirror that behavior.

  const router = new Router({ onChange: (route) => render(route) });

  const ctx = {
    router,
    store,
    speaker,
    lessons,
    workbook: workbook || { pageTexts: {}, lessonForPage: {}, lessonTitles: {}, interactiveExercises: [] },
  };

  function render(route) {
    // Bottom nav visibility + active-tab marker
    setBottomNavVisible(navHost, route.showNav);
    if (route.tab) setActiveTab(navHost, route.tab);

    const Screen = SCREEN_MAP[route.name];
    if (!Screen) {
      showError(host, `Unknown route: ${route.name}`);
      return;
    }
    try {
      Screen({ host, ctx, params: route.params, route });
    } catch (err) {
      console.error(err);
      showError(host, err && err.message);
    }
  }

  // Initial nav render — done once, then route handler keeps active tab in sync
  renderBottomNav(navHost, { router, current: "learn" });

  router.start();
})();
