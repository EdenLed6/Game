// profile.js — Profile tab.
//
// 1:1 port of fragment_profile.xml + ProfileFragment.kt
//   /home/user/Game/.ui-source/app/src/main/res/layout/fragment_profile.xml
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/ProfileFragment.kt
//
// Layout (top → bottom):
//   1. Header banner ("פרופיל" + subtitle)
//   2. Identity card — circular avatar (with photo edit overlay) + name + role + name-edit icon
//   3. Stats row — 3 equal cards: streak / XP / lessons
//   4. Progress card — "התקדמות בקורס" + percent + linear bar
//   5. Red full-width "אפס התקדמות" button

import { el, mount } from "../dom.js";
import {
  getStreak,
  getTotalXP,
  getCompletedCount,
  getProfileName,
  setProfileName,
  getProfilePhoto,
  setProfilePhoto,
  resetProgress,
  TOTAL_LESSONS,
} from "../store.js";

const ROLE_TEXT          = "לומד יפנית";
const RESET_CONFIRM_TEXT = "האם לאפס את כל ההתקדמות שלך? פעולה זו אינה ניתנת לביטול.";

// ---------- avatar helpers ----------
function firstLetter(name) {
  if (!name) return "?";
  for (const ch of name) {
    if (/\p{L}/u.test(ch)) return ch.toUpperCase();
  }
  return "?";
}

function avatarNode(name, photoDataUrl) {
  if (photoDataUrl) {
    return el("div", { class: "profile-identity__avatar bg-avatar-circle" },
      el("img", { src: photoDataUrl, alt: "", "aria-hidden": "true" }),
    );
  }
  return el("div", { class: "profile-identity__avatar bg-avatar-circle" }, firstLetter(name));
}

// ---------- photo picker (file → dataURL) ----------
function pickPhoto(onLoaded) {
  const input = document.createElement("input");
  input.type   = "file";
  input.accept = "image/*";
  input.style.display = "none";
  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLoaded(String(reader.result || ""));
    reader.readAsDataURL(file);
  }, { once: true });
  document.body.appendChild(input);
  input.click();
  // cleanup later (after change has fired)
  setTimeout(() => input.remove(), 0);
}

// ---------- DOM builders ----------
function header() {
  return el("div", { class: "header header--vertical bg-gradient-hero" },
    el("h1", { class: "header__screen-title" }, "פרופיל"),
    el("p",  { class: "header__subtitle" },     "ניהול פרופיל, התקדמות והישגים"),
  );
}

function identityCard(state, rerender) {
  const onEditName = () => {
    const next = window.prompt("עריכת שם", state.name);
    if (next == null) return;                        // cancelled
    const trimmed = next.trim() || "הלומד שלי";
    setProfileName(trimmed);
    rerender();
  };
  const onEditPhoto = () => {
    pickPhoto((dataUrl) => {
      if (!dataUrl) return;
      setProfilePhoto(dataUrl);
      rerender();
    });
  };

  return el("section", { class: "profile-identity" },
    // avatar wrap = stacked avatar + small photo-edit button
    el("div", { class: "profile-identity__avatar-wrap" },
      avatarNode(state.name, state.photo),
      el("button", {
        type: "button",
        class: "profile-identity__photo-edit",
        "aria-label": "החלף תמונת פרופיל",
        onClick: onEditPhoto,
      },
        el("img", { src: "assets/icons/ic_edit.svg", alt: "" }),
      ),
    ),
    el("div", { class: "profile-identity__text" },
      el("h2", { class: "profile-identity__name" }, state.name),
      el("p",  { class: "profile-identity__role" }, ROLE_TEXT),
    ),
    el("button", {
      type: "button",
      class: "profile-identity__name-edit",
      "aria-label": "ערוך שם",
      onClick: onEditName,
    },
      el("img", { src: "assets/icons/ic_edit.svg", alt: "" }),
    ),
  );
}

function statsRow(state) {
  return el("section", { class: "profile-stats" },
    statCell({
      img: "assets/ic_stat_streak.jpg",
      value: String(state.streak),
      valueClass: "profile-stats__value--streak",
      label: "רצף ימים",
    }),
    statCell({
      img: "assets/ic_stat_xp.jpg",
      value: String(state.xp),
      valueClass: "profile-stats__value--xp",
      label: "ניקוד XP",
    }),
    statCell({
      img: "assets/ic_stat_lessons.jpg",
      value: `${state.completed}/${TOTAL_LESSONS}`,
      valueClass: "profile-stats__value--lessons",
      label: "שיעורים",
    }),
  );
}

function statCell({ img, value, valueClass, label }) {
  return el("div", { class: "profile-stats__cell" },
    el("img", { class: "profile-stats__icon", src: img, alt: "" }),
    el("div", { class: ["profile-stats__value", valueClass] }, value),
    el("div", { class: "profile-stats__label" }, label),
  );
}

function progressCard(state) {
  const pct = TOTAL_LESSONS > 0
    ? Math.floor((state.completed * 100) / TOTAL_LESSONS)
    : 0;
  return el("section", { class: "profile-progress" },
    el("div", { class: "profile-progress__row" },
      el("h3", { class: "profile-progress__label" }, "התקדמות בקורס"),
      el("span", { class: "profile-progress__percent" }, `${pct}%`),
    ),
    el("div", {
      class: "profile-progress__bar",
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": String(pct),
    },
      el("span", {
        class: "profile-progress__fill",
        style: { width: `${pct}%` },
      }),
    ),
  );
}

function resetButton(rerender) {
  const onReset = () => {
    if (!window.confirm(RESET_CONFIRM_TEXT)) return;
    resetProgress();
    rerender();
  };
  return el("button", {
    type: "button",
    class: "btn btn--block profile-reset",
    onClick: onReset,
  }, "אפס התקדמות");
}

// ---------- main ----------
export function Profile({ host /*, ctx */ }) {
  ensureStyle();

  function readState() {
    return {
      name:      getProfileName(),
      photo:     getProfilePhoto(),
      streak:    getStreak(),
      xp:        getTotalXP(),
      completed: getCompletedCount(),
    };
  }

  function render() {
    const state = readState();
    const screen = el("div", { class: "screen profile-screen" },
      header(),
      el("div", { class: "profile-screen__scroll" },
        el("div", { class: "profile-screen__content" },
          identityCard(state, render),
          statsRow(state),
          progressCard(state),
          resetButton(render),
        ),
      ),
    );
    mount(host, screen);
  }

  render();
}

function ensureStyle() {
  if (document.getElementById("css-profile-screen")) return;
  // Already linked from index.html? Skip.
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/profile.css") return;
  }
  const link = document.createElement("link");
  link.id   = "css-profile-screen";
  link.rel  = "stylesheet";
  link.href = "css/screens/profile.css";
  document.head.appendChild(link);
}
