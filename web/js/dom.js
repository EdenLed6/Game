// Minimal DOM helpers — keeps screens terse and dependency-free.
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class" || k === "className") {
      node.className = v;
    } else if (k === "style" && typeof v === "object") {
      Object.assign(node.style, v);
    } else if (k === "dataset" && typeof v === "object") {
      Object.assign(node.dataset, v);
    } else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k in node && typeof v !== "boolean" && k !== "for") {
      node[k] = v;
    } else if (k === "html") {
      node.innerHTML = v;
    } else {
      node.setAttribute(k === "for" ? "for" : k, String(v));
    }
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  return node;
}

export function mount(view) {
  const root = document.getElementById("app");
  root.replaceChildren(view);
  // Reset scroll for new screen
  window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pageEl({ title, subtitle, onBack, body, hero }) {
  return el(
    "div",
    { class: "page" },
    el(
      "header",
      { class: "toolbar" },
      onBack ? el("button", { class: "btn-back", title: "חזור", onClick: onBack }, "→") : null,
      el("h1", {}, title || ""),
      subtitle ? el("span", { class: "muted" }, subtitle) : null
    ),
    hero,
    el("main", { class: "container" }, body)
  );
}
