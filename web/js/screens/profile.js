// profile.js — Profile tab.
//
// Renders the design's ProfileScreen DOM (from
// design_handoff_kimura_redesign/screen-profile-media.jsx) using
// vanilla JS via el(). Class names mirror the design's CSS so the
// override stylesheet applies cleanly:
//
//   .kimura-screen.profile-screen.screen-enter
//     header.top-band                   ← red gradient header
//       .top-band__inner
//         .top-band__row                ← title + subtitle
//       .gold-line                      ← gold accent strip
//     .kimura-content
//       .kimura-content__inner
//         .profile-identity (card)      ← avatar + name + role + edit
//         .profile-stats (grid 3-up)    ← streak / XP / lessons
//         .profile-progress             ← course progress bar
//         button.btn.btn-ghost          ← reset progress

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
    return el("div", { class: "profile-identity__avatar" },
      el("img", { src: photoDataUrl, alt: "", "aria-hidden": "true" }),
    );
  }
  return el("div", { class: "profile-identity__avatar" }, firstLetter(name));
}

function pickPhoto(onLoaded) {
  const input = document.createElement("input");
  input.type = "file";
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
  setTimeout(() => input.remove(), 0);
}

// ---------- DOM builders ----------

function topBand(title, subtitle) {
  return el("header", { class: "top-band" },
    el("div", { class: "top-band__inner" },
      el("div", { class: "top-band__row" },
        el("div", { class: "top-band__slot" }),
        el("div", { class: "top-band__title-wrap" },
          el("h1", { class: "top-band__title" }, title),
          subtitle ? el("p", { class: "top-band__subtitle" }, subtitle) : null,
        ),
        el("div", { class: "top-band__slot" }),
      ),
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );
}

function identityCard(state, rerender) {
  const onEditName = () => {
    const next = window.prompt("עריכת שם", state.name);
    if (next == null) return;
    setProfileName((next.trim() || "הלומד שלי"));
    rerender();
  };
  const onEditPhoto = () => {
    pickPhoto((dataUrl) => {
      if (!dataUrl) return;
      setProfilePhoto(dataUrl);
      rerender();
    });
  };

  return el("section", { class: "card profile-identity" },
    el("div", { class: "profile-identity__avatar-wrap" },
      avatarNode(state.name, state.photo),
      el("button", {
        type: "button",
        class: "profile-identity__photo-edit",
        "aria-label": "החלף תמונת פרופיל",
        onClick: onEditPhoto,
      }, "📷"),
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
    }, "✎"),
  );
}

function statCell({ icon, value, label, kind }) {
  return el("div", { class: "card profile-stats__cell profile-stats__cell--" + kind },
    el("div", { class: "profile-stats__icon", "aria-hidden": "true" }, icon),
    el("div", { class: "profile-stats__value" }, value),
    el("div", { class: "profile-stats__label" }, label),
  );
}

function statsGrid(state) {
  return el("section", { class: "profile-stats" },
    statCell({ icon: "🔥", value: String(state.streak),                                   label: "רצף ימים", kind: "streak"   }),
    statCell({ icon: "⚡", value: String(state.xp),                                       label: "XP",       kind: "xp"       }),
    statCell({ icon: "📚", value: state.completed + "/" + TOTAL_LESSONS,                  label: "שיעורים",  kind: "lessons"  }),
  );
}

function progressCard(state) {
  const pct = TOTAL_LESSONS > 0
    ? Math.floor((state.completed * 100) / TOTAL_LESSONS)
    : 0;
  return el("section", { class: "card profile-progress" },
    el("div", { class: "profile-progress__row" },
      el("h3", { class: "profile-progress__label" }, "התקדמות בקורס"),
      el("span", { class: "profile-progress__percent" }, pct + "%"),
    ),
    el("div", {
      class: "progress-track profile-progress__bar",
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": String(pct),
    },
      el("span", {
        class: "progress-fill profile-progress__fill",
        style: { width: pct + "%" },
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
    class: "btn btn-ghost profile-reset",
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
    const screen = el("div", { class: "kimura-screen profile-screen screen-enter" },
      topBand("הפרופיל שלי", "ניהול פרופיל, התקדמות והישגים"),
      el("div", { class: "kimura-content" },
        el("div", { class: "kimura-content__inner" },
          identityCard(state, render),
          statsGrid(state),
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
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/profile.css") return;
  }
  const link = document.createElement("link");
  link.id   = "css-profile-screen";
  link.rel  = "stylesheet";
  link.href = "css/screens/profile.css";
  document.head.appendChild(link);
}
