// router.js — minimal hash router.
//
// Routes (mirroring the APK's bottom-nav UI):
//   #/learn                     (Learn tab — default)
//   #/media                     (Media tab)
//   #/profile                   (Profile tab)
//   #/lesson/:id                (LessonJourney — starts at INTRO step)
//   #/lesson/:id/:step          (LessonJourney — jumps to step
//                                intro|teach|vocab|practice|quiz|complete)
//
// Anything else falls back to #/learn — the APK doesn't expose standalone
// game/practice screens through the UI, so neither does the web.

const VALID_STEPS = new Set(["intro", "teach", "vocab", "practice", "quiz", "complete"]);

const ROUTES = [
  // Tab routes — bottom nav visible on these
  { pattern: /^\/?$/,       name: "learn",  tab: "learn",   showNav: true,  redirect: "#/learn" },
  { pattern: /^\/learn$/,   name: "learn",  tab: "learn",   showNav: true  },
  { pattern: /^\/media$/,   name: "media",  tab: "media",   showNav: true  },
  { pattern: /^\/profile$/, name: "profile", tab: "profile", showNav: true },

  // Lesson journey — bottom nav hidden
  { pattern: /^\/lesson\/(\d+)$/,                    name: "lesson-journey", showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/([a-z]+)$/,          name: "lesson-journey", showNav: false, params: ["id", "step"] },
];

export class Router {
  constructor({ onChange } = {}) {
    this.onChange = onChange || (() => {});
    this._handler = () => this._dispatch();
  }

  start() {
    window.addEventListener("hashchange", this._handler);
    if (!location.hash || location.hash === "#" || location.hash === "#/") {
      location.replace("#/learn");
      return;
    }
    this._dispatch();
  }

  stop() {
    window.removeEventListener("hashchange", this._handler);
  }

  go(hash) {
    if (!hash.startsWith("#")) hash = "#" + (hash.startsWith("/") ? hash : "/" + hash);
    if (location.hash === hash) {
      // force redispatch
      this._dispatch();
    } else {
      location.hash = hash;
    }
  }

  back() {
    if (history.length > 1) history.back();
    else this.go("#/learn");
  }

  current() {
    const h = location.hash.replace(/^#/, "") || "/learn";
    return this._match(h) || { name: "not-found", path: h, params: {}, showNav: false };
  }

  _match(path) {
    for (const r of ROUTES) {
      const m = r.pattern.exec(path);
      if (!m) continue;
      const params = {};
      if (r.params) r.params.forEach((p, i) => { params[p] = m[i + 1]; });
      // Validate journey step name; an invalid step falls through to the
      // generic "lesson without a step" handler and the journey starts at
      // INTRO.
      if (params.step && !VALID_STEPS.has(params.step)) {
        return null;
      }
      return {
        name: r.name,
        tab: r.tab || null,
        showNav: !!r.showNav,
        path,
        params,
        redirect: r.redirect || null,
      };
    }
    return null;
  }

  _dispatch() {
    const path = location.hash.replace(/^#/, "") || "/learn";
    const route = this._match(path);
    if (!route) {
      location.replace("#/learn");
      return;
    }
    if (route.redirect) {
      location.replace(route.redirect);
      return;
    }
    this.onChange(route);
  }
}
