// profile.js — Profile tab.
//
// 1:1 port of the design's ProfileScreen
// (design_handoff_kimura_redesign/screen-profile-media.jsx). Vanilla
// JS rendering against the existing store. Content blocks (in order):
//
//   1. Top band: "הפרופיל שלי" + JP subtitle (big variant)
//   2. Profile card: avatar (clickable to upload) + 📷 badge,
//      editable name with ✎, "רמה X · תלמיד מתקדם",
//      XP progress bar + "{xp} / {xpNext} XP"
//   3. Big-stats grid: streak / XP / achievements-count (3 cards)
//   4. Achievements section: 3-col grid of 6 achievement cards
//      (locked variants are dimmed + show a lock icon)
//   5. Weekly activity section: 7 vertical bars (Sun-Sat),
//      today's bar highlighted with the red gradient

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

const XP_PER_LEVEL = 500;
const RESET_CONFIRM_TEXT = "האם לאפס את כל ההתקדמות שלך? פעולה זו אינה ניתנת לביטול.";

// ────────────────────────────────────────────────────────────
// Achievements — derived from real progress at render time.
// Each has a JP "glyph" character that lives in the small red circle.
// ────────────────────────────────────────────────────────────
function buildAchievements({ completed, streak, xp }) {
  return [
    { id: "first",     glyph: "始", name: "צעד ראשון",     earned: completed >= 1  },
    { id: "five",      glyph: "五", name: "5 שיעורים",     earned: completed >= 5  },
    { id: "ten",       glyph: "十", name: "10 שיעורים",    earned: completed >= 10 },
    { id: "streak7",   glyph: "週", name: "שבוע ברצף",     earned: streak    >= 7  },
    { id: "xp500",     glyph: "百", name: "500 XP",         earned: xp        >= 500 },
    { id: "complete",  glyph: "全", name: "כל הקורס",      earned: completed >= TOTAL_LESSONS },
  ];
}

// ────────────────────────────────────────────────────────────
// First letter of name (Latin / Hebrew / Japanese), used inside the
// avatar circle when there's no uploaded photo.
// ────────────────────────────────────────────────────────────
function firstLetter(name) {
  if (!name) return "?";
  for (const ch of name) {
    if (/\p{L}/u.test(ch)) return ch.toUpperCase();
  }
  return "?";
}

// ────────────────────────────────────────────────────────────
// Photo picker — opens a hidden <input type=file> and on selection
// reads the file as a data URL so it can be persisted to localStorage.
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// Top band — same shape as Media / Lesson Journey, "big" variant
// with an italic Japanese subtitle below the Hebrew title.
// ────────────────────────────────────────────────────────────
function topBand(title, subtitleJp) {
  return el("header", { class: "top-band top-band--big" },
    el("div", { class: "top-band__inner" },
      el("div", { class: "top-band__row" },
        el("div", { class: "top-band__slot" }),
        el("div", { class: "top-band__title-wrap" },
          el("h1", { class: "top-band__title" }, title),
          el("p",  { class: "top-band__subtitle top-band__subtitle--jp" }, subtitleJp),
        ),
        el("div", { class: "top-band__slot" }),
      ),
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );
}

// ────────────────────────────────────────────────────────────
// Profile identity card — clickable avatar + 📷 badge + editable
// name with ✎ + "רמה X · תלמיד מתקדם" + XP progress bar.
// ────────────────────────────────────────────────────────────
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

  const xpPct = Math.max(0, Math.min(100,
    Math.round((state.xpInLevel / state.xpForNext) * 100)));

  // Avatar — image if uploaded, otherwise first letter on red gradient.
  const avatarInner = state.photo
    ? null
    : el("span", { class: "profile-identity__avatar-letter" },
        firstLetter(state.name));
  const avatarStyle = state.photo
    ? { backgroundImage: "url(" + state.photo + ")",
        backgroundSize: "cover",
        backgroundPosition: "center" }
    : {};

  return el("section", { class: "card profile-identity" },
    el("div", { class: "profile-identity__row" },
      el("button", {
        type: "button",
        class: "profile-identity__avatar",
        style: avatarStyle,
        onClick: onEditPhoto,
        "aria-label": "שנה תמונת פרופיל",
      },
        avatarInner,
        el("span", { class: "profile-identity__camera-badge", "aria-hidden": "true" }, "📷"),
      ),
      el("div", { class: "profile-identity__text" },
        el("button", {
          type: "button",
          class: "profile-identity__name-btn",
          onClick: onEditName,
        },
          el("span", { class: "profile-identity__name" }, state.name),
          el("span", { class: "profile-identity__edit-glyph", "aria-hidden": "true" }, "✎"),
        ),
        el("div", { class: "profile-identity__role" },
          "רמה " + state.level + " · תלמיד מתקדם"),
      ),
    ),
    el("div", {
      class: "progress-track profile-identity__xp-track",
      role: "progressbar",
      "aria-valuemin": "0", "aria-valuemax": "100",
      "aria-valuenow": String(xpPct),
    },
      el("span", {
        class: "progress-fill profile-identity__xp-fill",
        style: { width: xpPct + "%" },
      }),
    ),
    el("div", { class: "profile-identity__xp-text" },
      state.xpInLevel + " / " + state.xpForNext + " XP"),
  );
}

// ────────────────────────────────────────────────────────────
// Big stats grid — 3 cards, each: tinted icon + value + label.
// Tints come from the design (orange / gold / red).
// ────────────────────────────────────────────────────────────
function bigStat({ icon, value, label, tint }) {
  return el("div", { class: "card big-stat" },
    el("div", { class: "big-stat__icon",
                style: { color: tint } }, icon),
    el("div", { class: "big-stat__value" }, String(value)),
    el("div", { class: "big-stat__label" }, label),
  );
}

function bigStatsGrid(state, achievementsEarned) {
  return el("section", { class: "big-stats-grid" },
    bigStat({ icon: "🔥", value: state.streak,             label: "ימים רצוף",  tint: "#FFB87A" }),
    bigStat({ icon: "⚡", value: state.totalXp,            label: "סה\"כ XP",   tint: "#C99A4B" }),
    bigStat({ icon: "🏆", value: achievementsEarned,       label: "הישגים",     tint: "var(--c-red)" }),
  );
}

// ────────────────────────────────────────────────────────────
// Achievements section — h3 + 3-col grid. Locked items are dimmed
// to 55% opacity + show a lock icon in the top-leading corner.
// ────────────────────────────────────────────────────────────
function achievementCard(a) {
  const cls = ["card", "achievement"];
  if (!a.earned) cls.push("achievement--locked");
  return el("div", { class: cls.join(" ") },
    el("div", { class: "achievement__circle" },
      el("span", { class: "achievement__glyph" }, a.glyph),
    ),
    el("div", { class: "achievement__name" }, a.name),
    a.earned ? null
             : el("span", { class: "achievement__lock", "aria-hidden": "true" }, "🔒"),
  );
}

function achievementsSection(achievements) {
  return el("section", { class: "achievements" },
    el("h3", { class: "section-heading" }, "הישגים"),
    el("div", { class: "achievements__grid" },
      ...achievements.map(achievementCard),
    ),
  );
}

// ────────────────────────────────────────────────────────────
// Weekly activity — 7 vertical bars, today highlighted red.
// Heights are placeholder (the user's per-day activity isn't
// tracked yet); displayed LTR so Sunday → Saturday reads naturally.
// ────────────────────────────────────────────────────────────
const WEEK_LABELS  = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
const WEEK_HEIGHTS = [40, 60, 80, 30, 90, 70, 50];

function weeklyActivitySection() {
  // Compute today's column (0=Sunday … 6=Saturday). Highlight that
  // bar with the red gradient instead of the cream gradient.
  const today = new Date().getDay();
  return el("section", { class: "weekly-activity" },
    el("h3", { class: "section-heading" }, "פעילות שבועית"),
    el("div", { class: "card weekly-activity__card" },
      el("div", { class: "weekly-activity__bars" },
        ...WEEK_LABELS.map((label, i) =>
          el("div", { class: "weekly-activity__col" },
            el("div", {
              class: "weekly-activity__bar" + (i === today ? " weekly-activity__bar--today" : ""),
              style: { height: WEEK_HEIGHTS[i] + "%" },
            }),
            el("span", { class: "weekly-activity__day" }, label),
          )
        ),
      ),
    ),
  );
}

// ────────────────────────────────────────────────────────────
// Reset button — at the very bottom, ghost variant.
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// Public entry
// ────────────────────────────────────────────────────────────
export function Profile({ host /*, ctx */ }) {
  ensureStyle();

  function readState() {
    const totalXp = getTotalXP();
    const completed = getCompletedCount();
    return {
      name:       getProfileName(),
      photo:      getProfilePhoto(),
      streak:     getStreak(),
      totalXp:    totalXp,
      level:      1 + Math.floor(totalXp / XP_PER_LEVEL),
      xpInLevel:  totalXp % XP_PER_LEVEL,
      xpForNext:  XP_PER_LEVEL,
      completed:  completed,
    };
  }

  function render() {
    const state = readState();
    const achievements = buildAchievements({
      completed: state.completed,
      streak:    state.streak,
      xp:        state.totalXp,
    });
    const earnedCount = achievements.filter(a => a.earned).length;

    const screen = el("div", { class: "kimura-screen profile-screen screen-enter" },
      topBand("הפרופיל שלי", "私のプロフィール"),
      el("div", { class: "kimura-content" },
        el("div", { class: "kimura-content__inner" },
          identityCard(state, render),
          bigStatsGrid(state, earnedCount),
          achievementsSection(achievements),
          weeklyActivitySection(),
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
