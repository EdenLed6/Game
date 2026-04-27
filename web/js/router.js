// Hash-based router. Routes look like #/path/123.
//
// API:
//   Router.add(pattern, handler)  — pattern uses :param tokens
//   Router.go(path)                — navigate (sets location.hash)
//   Router.start()                 — wire to hashchange + initial load
//   Router.back()                  — history.back() if possible, else go("/")

const routes = [];

function compile(pattern) {
  const keys = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/\/:[^/]+/g, (m) => {
        keys.push(m.slice(2));
        return "/([^/]+)";
      }) +
      "$"
  );
  return { regex, keys };
}

function parseHash() {
  const h = location.hash || "#/";
  return h.startsWith("#") ? h.slice(1) : h;
}

function dispatch() {
  const path = parseHash() || "/";
  for (const r of routes) {
    const m = path.match(r.compiled.regex);
    if (m) {
      const params = {};
      r.compiled.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      try {
        r.handler(params);
      } catch (e) {
        console.error("Route handler error:", e);
      }
      return;
    }
  }
  // Fallback to root
  if (path !== "/") {
    location.hash = "#/";
  }
}

export const Router = {
  add(pattern, handler) {
    routes.push({ pattern, handler, compiled: compile(pattern) });
    return this;
  },
  go(path) {
    if (!path.startsWith("/")) path = "/" + path;
    if (location.hash === "#" + path) {
      dispatch();
    } else {
      location.hash = "#" + path;
    }
  },
  back() {
    if (history.length > 1) history.back();
    else this.go("/");
  },
  current() {
    return parseHash();
  },
  start() {
    window.addEventListener("hashchange", dispatch);
    dispatch();
  },
};
