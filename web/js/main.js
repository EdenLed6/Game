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
  // Service worker handling. We need a registered SW so the browser
  // fires `beforeinstallprompt` and our PWA install button can trigger
  // a one-tap install. The current `sw.js` is a deliberate no-op
  // pass-through (no caching), but old SW versions in the wild may
  // still be aggressively caching. So:
  //   1. Walk every existing SW registration; unregister any whose
  //      scriptURL doesn't point to OUR sw.js.
  //   2. Register our pass-through sw.js. If it's already registered,
  //      this is a no-op.
  //   3. Clear any stale caches left by a prior SW.
  //   4. If we had to clean up something, force a one-time reload so
  //      the page isn't being served by the now-defunct old SW.
  let killedSW = false;
  if ("serviceWorker" in navigator) {
    try {
      const ourSwUrl = new URL("sw.js", location.href).href;
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        const swObj = reg.active || reg.waiting || reg.installing;
        const swUrl = swObj ? swObj.scriptURL : "";
        // Unregister anything that isn't our current SW. The check uses
        // startsWith to ignore query strings on the registered URL.
        if (swUrl && !swUrl.startsWith(ourSwUrl)) {
          try { await reg.unregister(); killedSW = true; } catch {}
        }
      }
      // Register our pass-through SW (no-op if already registered).
      try { await navigator.serviceWorker.register("sw.js"); } catch {}
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

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // The earliest `beforeinstallprompt` may have fired before this
    // script ran — the inline <head> script captures it into
    // window.__pwaPrompt. Keep that as our source of truth so the
    // listener and the early capture always agree.
    function getPrompt() { return window.__pwaPrompt; }
    function setPrompt(e) { window.__pwaPrompt = e; }

    // Listener stays attached for the lifetime of the page so that
    // re-fires (e.g. after the user uninstalls the PWA and revisits
    // the web tab) are also caught.
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPrompt(e);
    });
    window.addEventListener("appinstalled", () => {
      setPrompt(null);
    });

    function showManualInstructions() {
      if (isIOS) {
        alert(
          "כדי להתקין את האפליקציה:\n" +
          "1. לחצו על כפתור השיתוף בתחתית הדפדפן\n" +
          "2. גללו ובחרו “הוסף למסך הבית”\n" +
          "3. לחצו “הוסף”"
        );
      } else {
        alert(
          "כדי להתקין את האפליקציה:\n" +
          "1. לחצו על תפריט הדפדפן (⋮ בפינה)\n" +
          "2. בחרו “התקן אפליקציה” או “הוסף למסך הבית”\n" +
          "3. אשרו את ההתקנה"
        );
      }
    }

    // If no prompt is currently buffered when the user clicks (common
    // right after uninstall — Chrome takes a moment before refiring
    // beforeinstallprompt), nudge the SW with `update()` and wait up
    // to 1.5s for the event to arrive. This recovers the auto-install
    // path for the typical "reinstalled the app" flow without forcing
    // the user back to manual instructions.
    function waitForPrompt(timeoutMs) {
      return new Promise(async (resolve) => {
        if (getPrompt()) { resolve(getPrompt()); return; }
        let done = false;
        const onPrompt = (e) => {
          if (done) return;
          done = true;
          e.preventDefault();
          setPrompt(e);
          window.removeEventListener("beforeinstallprompt", onPrompt);
          resolve(e);
        };
        window.addEventListener("beforeinstallprompt", onPrompt);
        // Force the SW registration to refresh — sometimes nudges
        // Chrome's installability heuristics post-uninstall.
        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg && typeof reg.update === "function") await reg.update();
          } catch {}
        }
        setTimeout(() => {
          if (done) return;
          done = true;
          window.removeEventListener("beforeinstallprompt", onPrompt);
          resolve(null);
        }, timeoutMs);
      });
    }

    installBtn.addEventListener("click", async () => {
      let prompt = getPrompt();
      if (!prompt) {
        // Try once to recover a fresh prompt event before falling back
        // to manual instructions.
        prompt = await waitForPrompt(1500);
      }
      if (prompt) {
        try {
          prompt.prompt();
          await prompt.userChoice;
        } catch (_) { /* user dismissed — ok */ }
        // The prompt object is one-shot; clear so a future
        // beforeinstallprompt (e.g. after uninstall) replaces it.
        setPrompt(null);
        return;
      }
      showManualInstructions();
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
