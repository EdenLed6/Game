// dom.js — tiny DOM helpers (no framework, no build step)
//
// Usage:
//   const root = el("div", { class: "card" }, "hello");
//   mount(host, root);          // replaces children of host
//   mount(host, [a, b, c]);     // also accepts arrays
//   clear(host);                // empties host

export function el(tag, props, ...children) {
  const node = document.createElement(tag);
  if (props && typeof props === "object" && !Array.isArray(props) && !(props instanceof Node)) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class" || k === "className") {
        node.className = Array.isArray(v) ? v.filter(Boolean).join(" ") : String(v);
      } else if (k === "style" && typeof v === "object") {
        Object.assign(node.style, v);
      } else if (k === "dataset" && typeof v === "object") {
        for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = String(dv);
      } else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === "html") {
        node.innerHTML = v;
      } else if (k === "ref" && typeof v === "function") {
        v(node);
      } else if (k in node && typeof node[k] !== "function") {
        try { node[k] = v; } catch { node.setAttribute(k, String(v)); }
      } else {
        node.setAttribute(k, v === true ? "" : String(v));
      }
    }
  } else if (props !== undefined) {
    children.unshift(props);
  }
  appendChildren(node, children);
  return node;
}

function appendChildren(node, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) appendChildren(node, c);
    else if (c instanceof Node) node.appendChild(c);
    else node.appendChild(document.createTextNode(String(c)));
  }
}

export function mount(host, content) {
  if (!host) return;
  while (host.firstChild) host.removeChild(host.firstChild);
  if (content == null) return;
  if (Array.isArray(content)) appendChildren(host, content);
  else if (content instanceof Node) host.appendChild(content);
  else host.appendChild(document.createTextNode(String(content)));
}

export function clear(host) {
  if (!host) return;
  while (host.firstChild) host.removeChild(host.firstChild);
}

export function text(s) {
  return document.createTextNode(String(s));
}

// Promise that resolves on next animation frame
export function nextFrame() {
  return new Promise(r => requestAnimationFrame(() => r()));
}
