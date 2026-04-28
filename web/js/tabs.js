// tabs.js — renders the 3 BottomNavigationView tabs.
//
// Order in bottom_nav_menu.xml: media → learn → profile.
// In Hebrew RTL the visual layout is right-to-left, but the DOM order
// from menu/bottom_nav_menu.xml is preserved.

import { el, mount } from "./dom.js";

const TABS = [
  { id: "media",   label: "מדיה",   icon: "assets/ic_media_jp.png"   },
  { id: "learn",   label: "למד",    icon: "assets/ic_learn_jp.png"   },
  { id: "profile", label: "פרופיל", icon: "assets/ic_profile_jp.png" },
];

export function renderBottomNav(host, { router, current }) {
  if (!host) return;
  const buttons = TABS.map(t => {
    const btn = el("button", {
      type: "button",
      class: "bottom-nav__btn",
      "data-tab": t.id,
      "aria-label": t.label,
      onClick: () => router.go(`#/${t.id}`),
    },
      el("img", { src: t.icon, alt: "", "aria-hidden": "true" }),
      el("span", {}, t.label),
    );
    if (current === t.id) btn.setAttribute("aria-current", "page");
    return btn;
  });
  mount(host, buttons);
}

export function setBottomNavVisible(host, visible) {
  if (!host) return;
  host.classList.toggle("is-hidden", !visible);
  // Also hide the divider when the nav is hidden so the screen is truly full-bleed
  const divider = document.querySelector(".bottom-nav-divider");
  if (divider) divider.classList.toggle("is-hidden", !visible);
}

export function setActiveTab(host, tabId) {
  if (!host) return;
  host.querySelectorAll(".bottom-nav__btn").forEach(btn => {
    if (btn.dataset.tab === tabId) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
}
