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

// Screen modules — every one is a stub right now; other agents fill them in
import { Learn }            from "./screens/learn.js";
import { Media }            from "./screens/media.js";
import { Profile }          from "./screens/profile.js";
import { LessonDetail }     from "./screens/lesson-detail.js";
import { Quiz }             from "./screens/quiz.js";
import { Flashcards }       from "./screens/flashcards.js";
import { Matching }         from "./screens/matching.js";
import { NumberGame }       from "./screens/number-game.js";
import { SentenceBuilder }  from "./screens/sentence-builder.js";
import { Workbook }         from "./screens/workbook.js";
import { Video }            from "./screens/video.js";
import { Challenge }        from "./screens/challenge.js";

const SCREEN_MAP = {
  "learn":            Learn,
  "media":            Media,
  "profile":          Profile,
  "lesson-detail":    LessonDetail,
  "quiz":             Quiz,
  "flashcards":       Flashcards,
  "matching":         Matching,
  "number-game":      NumberGame,
  "sentence-builder": SentenceBuilder,
  "workbook":         Workbook,
  "video":            Video,
  "challenge":        Challenge,
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
  if ("serviceWorker" in navigator) {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch {}
  }
  if (typeof caches !== "undefined") {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch {}
  }

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
