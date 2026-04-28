// router.js — minimal hash router.
//
// Routes:
//   #/learn                          (Learn tab — default)
//   #/media                          (Media tab)
//   #/profile                        (Profile tab)
//   #/lesson/:id                     (LessonDetail full-screen)
//   #/lesson/:id/quiz
//   #/lesson/:id/flashcards
//   #/lesson/:id/matching
//   #/lesson/:id/number-game
//   #/lesson/:id/sentence-builder
//   #/lesson/:id/workbook
//   #/lesson/:id/video
//   #/challenge

const ROUTES = [
  // Tab routes — bottom nav visible on these
  { pattern: /^\/?$/,            name: "learn",        tab: "learn",   showNav: true,  redirect: "#/learn" },
  { pattern: /^\/learn$/,        name: "learn",        tab: "learn",   showNav: true  },
  { pattern: /^\/media$/,        name: "media",        tab: "media",   showNav: true  },
  { pattern: /^\/profile$/,      name: "profile",      tab: "profile", showNav: true  },

  // Full-screen sub-routes — bottom nav hidden
  { pattern: /^\/lesson\/(\d+)$/,                    name: "lesson-detail",     showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/quiz$/,              name: "quiz",              showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/flashcards$/,        name: "flashcards",        showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/matching$/,          name: "matching",          showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/number-game$/,       name: "number-game",       showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/sentence-builder$/,  name: "sentence-builder",  showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/workbook$/,          name: "workbook",          showNav: false, params: ["id"] },
  { pattern: /^\/lesson\/(\d+)\/video$/,             name: "video",             showNav: false, params: ["id"] },
  { pattern: /^\/challenge$/,                        name: "challenge",         showNav: false },
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
