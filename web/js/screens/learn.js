// learn.js — Learn tab.
//
// Renders the design's HomeScreen DOM structure (from
// design_handoff_kimura_redesign/screen-home.jsx + shell.jsx) using
// the existing vanilla-JS infrastructure (router + store, no React).
// Class names mirror the design's CSS so the override stylesheet
// applies cleanly:
//
//   .kimura-screen.screen-enter
//     .top-band                    ← TopBand (logo + chips + xp track)
//       .gold-line                 ← gold accent strip at the bottom
//     .kimura-content              ← scrollable area
//       .kimura-content__inner     ← internal padding
//         .chapter (× N)           ← per chapter
//           .chapter-banner        ← red gradient + 章 watermark
//           ol.chapter__nodes      ← zigzag list of path nodes
//             li.path-node-row     ← per lesson
//               .path-node-item    ← clickable wrapper
//                 .path-node[--current|--completed|--locked]
//                 .path-node-label
//         .daily-review            ← hanko + "חזרה יומית" + cta
//
// Per-element styling is in the override sheet (`override-*.css`)
// where the design's CSS rules now target these exact selectors.

import { el, mount } from "../dom.js";
import {
  getCompletedLessonIds,
  getTotalXP,
  getStreak,
} from "../store.js";

// Inject the screen-local stylesheet once (idempotent).
function ensureStylesheet() {
  const HREF = "css/screens/learn.css";
  const links = document.head.querySelectorAll('link[rel="stylesheet"]');
  for (const link of links) {
    if (link.getAttribute("href") === HREF) return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = HREF;
  document.head.appendChild(link);
}

// Chapters mirror the existing UNITS structure (so the user sees the
// same Hebrew titles + lesson groupings she's used to) but rendered
// in the design's chapter-banner style.
const CHAPTERS = [
  { id: 1, title: "פתיחה",        from: 1,  to: 4  },
  { id: 2, title: "דקדוק בסיסי",  from: 5,  to: 8  },
  { id: 3, title: "פעלים",        from: 9,  to: 13 },
  { id: 4, title: "מתקדם",        from: 14, to: 17 },
  { id: 5, title: "למטיילים",     from: 18, to: 23 },
];

// XP per "level" — matches the design's user.xpNext (2000).
const XP_PER_LEVEL = 2000;

// First not-completed-yet lesson that's actually unlocked. Sequential
// unlock: lesson 1 always unlocked; N unlocked if N-1 completed.
function findCurrentLessonId(lessons, completedIds) {
  for (const lesson of lessons) {
    const id = lesson.id;
    if (completedIds.has(id)) continue;
    const unlocked = id === 1 || completedIds.has(id - 1);
    if (unlocked) return id;
  }
  return null;
}

function lessonState(lesson, completedIds, currentId) {
  if (completedIds.has(lesson.id)) return "completed";
  if (lesson.id === currentId)     return "current";
  if (lesson.id === 1 || completedIds.has(lesson.id - 1)) return "available";
  return "locked";
}

// ── Top band ────────────────────────────────────────────────
// The design's TopBand wraps title + stat chips + xp progress in a
// red textured header with a gold-line at the bottom. The fake "9:41"
// status bar from the prototype is intentionally not ported — the
// device's own status bar fills that area in PWA standalone mode.
function statChip(icon, value, kind) {
  return el("div", { class: "stat-chip stat-chip--" + kind, "aria-label": kind },
    el("span", { class: "stat-chip__icon", "aria-hidden": "true" }, icon),
    el("span", { class: "stat-chip__value" }, value),
  );
}

function renderTopBand({ streak, xpInLevel, xpForNext, totalXp }) {
  const xpPct = Math.max(0, Math.min(100,
    xpForNext ? Math.round((xpInLevel / xpForNext) * 100) : 0));

  return el("header", { class: "top-band" },
    el("div", { class: "top-band__inner" },
      el("div", { class: "top-band__row" },
        // Empty back-slot (Learn is a root tab, no back).
        el("div", { class: "top-band__slot" }),
        el("div", { class: "top-band__title-wrap" },
          el("img", {
            class: "top-band__logo",
            src: "assets/kimura_logo.png",
            alt: "קימורה",
          }),
        ),
        el("div", { class: "top-band__slot" }),
      ),
      el("div", { class: "top-band__chips" },
        statChip("🔥", String(streak) + " ימים", "streak"),
        statChip("⚡", String(totalXp) + " XP", "xp"),
      ),
      el("div", { class: "top-band__xp-track", role: "progressbar",
                  "aria-valuemin": "0", "aria-valuemax": "100",
                  "aria-valuenow": String(xpPct) },
        el("div", { class: "top-band__xp-fill", style: { width: xpPct + "%" } }),
      ),
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );
}

// ── Chapter banner ──────────────────────────────────────────
// Red gradient banner with 章 watermark on the leading edge. The
// completed/total badge sits on the trailing edge with a small
// gold progress bar.
function renderChapterBanner(chapter, completedCount, totalCount) {
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  return el("div", { class: "chapter-banner" },
    // Decorative 章 (chapter) watermark behind the text.
    el("span", { class: "chapter-banner__watermark", "aria-hidden": "true" }, "章"),
    el("div", { class: "chapter-banner__row" },
      el("div", { class: "chapter-banner__head" },
        el("div", { class: "chapter-banner__tag" }, "Chapter " + chapter.id),
        el("div", { class: "chapter-banner__title" }, chapter.title),
      ),
      el("div", { class: "chapter-banner__progress" },
        el("div", { class: "chapter-banner__progress-text" },
          completedCount + "/" + totalCount),
        el("div", { class: "chapter-banner__progress-track" },
          el("div", { class: "chapter-banner__progress-fill",
                      style: { width: pct + "%" } }),
        ),
      ),
    ),
  );
}

// ── Path node (a single lesson on the journey) ─────────────
// 74×74 red-gradient circle with kana glyph centered. State variants:
//   • current   — pulsing red ring (CSS animation `pulse-current`)
//   • completed — gold check badge (CSS `::after`)
//   • locked    — greyscale gradient + lock glyph
//   • available — same as current (no pulse) — default look
function renderPathNode(lesson, state, alignIdx, router) {
  // Zigzag: even index → leading edge, odd → trailing edge.
  const align = (alignIdx % 2 === 0) ? "start" : "end";
  const isLocked = state === "locked";
  const cls = ["path-node"];
  if (state === "completed") cls.push("path-node--completed");
  if (state === "current")   cls.push("path-node--current");
  if (state === "locked")    cls.push("path-node--locked");

  const glyph = lesson.glyph || lesson.emoji || "•";

  const onClick = isLocked ? undefined : () => router.go("#/lesson/" + lesson.id);

  const label = el("div", { class: "path-node-label" });
  const meta = el("div", { class: "path-node-label__meta" });
  meta.appendChild(el("span", null, lesson.number || ""));
  if (state === "current") {
    meta.appendChild(el("span", { class: "path-node-label__pill" }, "עכשיו"));
  } else if (state === "completed") {
    meta.appendChild(el("span", { class: "path-node-label__check",
                                   "aria-label": "הושלם" }, "✓"));
  }
  label.appendChild(meta);
  label.appendChild(el("div", { class: "path-node-label__title" }, lesson.title || ""));
  if (lesson.subtitle) {
    label.appendChild(el("div", { class: "path-node-label__sub" }, lesson.subtitle));
  }

  const ariaLabel = (lesson.title || "") + ", " + (lesson.number || "") +
    (state === "completed" ? ", הושלם" :
     state === "current"   ? ", עכשיו" :
     state === "locked"    ? ", נעול" : "");

  return el("li", { class: "path-node-row path-node-row--" + align },
    el("div", {
      class: "path-node-item" + (isLocked ? " path-node-item--locked" : ""),
      role: "button",
      tabindex: isLocked ? "-1" : "0",
      "aria-label": ariaLabel,
      "aria-disabled": isLocked ? "true" : "false",
      onClick,
      onKeyDown: (e) => {
        if (isLocked) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.go("#/lesson/" + lesson.id);
        }
      },
    },
      el("div", { class: cls.join(" ") },
        isLocked
          ? el("span", { class: "path-node__lock", "aria-hidden": "true" }, "🔒")
          : el("span", { class: "path-node__glyph", "aria-hidden": "true" }, glyph),
      ),
      label,
    ),
  );
}

// ── Daily review card (bottom of the home screen) ─────────────
// Decorative section divider + a single card with a hanko (red rotated
// stamp) on one side and a primary "התחילו" CTA on the other. The CTA
// jumps the user back into the current lesson if there is one.
function renderDailyReview(currentLessonId, router) {
  return el("section", { class: "daily-review" },
    el("div", { class: "daily-review__divider-row", "aria-hidden": "true" },
      el("span", { class: "daily-review__divider-line daily-review__divider-line--start" }),
      el("h3", { class: "daily-review__heading" }, "תרגול נוסף"),
      el("span", { class: "daily-review__divider-line daily-review__divider-line--end" }),
    ),
    el("div", { class: "card daily-review__card" },
      el("div", { class: "hanko daily-review__hanko",
                  "aria-hidden": "true" }, "復"),
      el("div", { class: "daily-review__text" },
        el("div", { class: "daily-review__title" }, "חזרה יומית"),
        el("div", { class: "daily-review__sub" },
          "המשיכו מאיפה שעצרתם"),
      ),
      el("button", {
        type: "button",
        class: "btn btn-primary daily-review__cta",
        onClick: currentLessonId
          ? () => router.go("#/lesson/" + currentLessonId)
          : undefined,
        disabled: currentLessonId == null,
      }, "התחילו"),
    ),
  );
}

// ── Build the per-chapter view-model from raw lesson data ──
function buildChapterModels(lessons, completedIds) {
  const currentId = findCurrentLessonId(lessons, completedIds);
  return CHAPTERS.map(function (ch) {
    const inChapter = lessons.filter(function (l) {
      return l.id >= ch.from && l.id <= ch.to;
    });
    const completed = inChapter.reduce(function (n, l) {
      return n + (completedIds.has(l.id) ? 1 : 0);
    }, 0);
    return {
      id: ch.id,
      title: ch.title,
      lessons: inChapter.map(function (l) {
        return { lesson: l, state: lessonState(l, completedIds, currentId) };
      }),
      completedCount: completed,
      totalCount: inChapter.length,
      currentId,
    };
  });
}

// ── Public entry ─────────────────────────────────────────────
export function Learn({ host, ctx }) {
  ensureStylesheet();
  const lessons = (ctx && ctx.lessons) || [];
  const router  = ctx && ctx.router;
  const completedIds = getCompletedLessonIds();
  const chapters = buildChapterModels(lessons, completedIds);
  const currentLessonId = findCurrentLessonId(lessons, completedIds);

  const totalXp = getTotalXP();
  const xpInLevel = totalXp % XP_PER_LEVEL;
  // (totalXp passed into renderTopBand below for the chip text)

  const screen = el("div", { class: "kimura-screen learn-screen screen-enter" },
    renderTopBand({
      streak: getStreak(),
      xpInLevel,
      xpForNext: XP_PER_LEVEL,
      totalXp,
    }),
    el("div", { class: "kimura-content" },
      el("div", { class: "kimura-content__inner" },
        ...chapters.map(function (ch) {
          return el("section", { class: "chapter" },
            renderChapterBanner(ch, ch.completedCount, ch.totalCount),
            el("ol", { class: "chapter__nodes" },
              ...ch.lessons.map(function (item, i) {
                return renderPathNode(item.lesson, item.state, i, router);
              }),
            ),
          );
        }),
        renderDailyReview(currentLessonId, router),
      ),
    ),
  );

  mount(host, screen);
}
