// learn.js — Learn tab.
//
// Ports fragment_learn.xml + LessonPathAdapter.kt:
//   • Header banner: "Kimura" title + streak chip + XP chip (bg_header.png)
//   • Scrollable lesson journey path:
//       - Unit header cards (5 units, hardcoded ranges + colors per
//         LessonPathAdapter.UNITS / UNIT_COLORS)
//       - Lesson nodes with zigzag (alternating left/right) layout, solid
//         connectors between consecutive nodes (3dp × 20dp cardStroke,
//         matches item_lesson_node.xml vConnectorBottom), completed/active/
//         locked states
//   • Tap a node → navigate to #/lesson/${id} (matches Android intent into
//     LessonJourneyActivity)
//
// Sources of truth:
//   .ui-source/app/src/main/res/layout/fragment_learn.xml
//   .ui-source/app/src/main/res/layout/item_unit_header.xml
//   .ui-source/app/src/main/res/layout/item_lesson_node.xml
//   .ui-source/app/src/main/java/.../adapter/LessonPathAdapter.kt
//   .ui-source/app/src/main/java/.../LearnFragment.kt

import { el, mount } from "../dom.js";
import {
  getCompletedLessonIds,
  getTotalXP,
  getStreak,
} from "../store.js";

// Inject the screen-local stylesheet once (idempotent — won't double up).
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

// Hardcoded units — copied verbatim from LessonPathAdapter.UNITS / UNIT_COLORS.
const UNITS = [
  { title: "פתיחה",        emoji: "🌸", from: 1,  to: 4,  color: "#C0362A" },
  { title: "דקדוק בסיסי",  emoji: "📖", from: 5,  to: 8,  color: "#0EA5E9" },
  { title: "פעלים",        emoji: "✍️", from: 9,  to: 13, color: "#F59E0B" },
  { title: "מתקדם",        emoji: "🏆", from: 14, to: 17, color: "#8B5CF6" },
  { title: "למטיילים",     emoji: "🗾", from: 18, to: 23, color: "#16A34A" },
];

// Build the flat list of items (header / node) just like buildPathItems()
// — preserves order so we can compute zigzag parity from a global node index.
function buildPathItems(lessons, completedIds) {
  const items = [];
  for (const unit of UNITS) {
    const unitLessons = lessons.filter(l => l.id >= unit.from && l.id <= unit.to);
    const completedInUnit = unitLessons.reduce(
      (n, l) => n + (completedIds.has(l.id) ? 1 : 0), 0,
    );
    items.push({
      kind: "header",
      title: unit.title,
      emoji: unit.emoji,
      subtitle: `${completedInUnit} / ${unitLessons.length} שיעורים`,
      color: unit.color,
    });
    for (const lesson of unitLessons) {
      const state = completedIds.has(lesson.id) ? "completed" : "active";
      items.push({ kind: "node", lesson, state });
    }
  }
  return items;
}

function renderUnitHeader(item) {
  return el(
    "section",
    {
      class: "unit-header",
      style: { background: item.color },
      role: "heading",
      "aria-level": "2",
    },
    el("span", { class: "unit-header__emoji", "aria-hidden": "true" }, item.emoji),
    el("div", { class: "unit-header__text" },
      el("div", { class: "unit-header__title" }, item.title),
      el("div", { class: "unit-header__subtitle" }, item.subtitle),
    ),
  );
}

function nodeBgClass(state) {
  switch (state) {
    case "completed": return "bg-node-completed";
    case "locked":    return "bg-node-locked";
    case "active":
    default:          return "bg-node-active";
  }
}

function renderNode(item, { router, nodeIndex, isLast }) {
  // Zigzag offset: matches LessonPathAdapter — even index → -X, odd → +X.
  // Direction value is fed into translateX via a CSS custom property; CSS
  // owns the magnitude so it can shrink on small screens.
  const dir = nodeIndex % 2 === 0 ? -1 : 1;

  const lesson = item.lesson;
  const cls = ["lesson-node", `lesson-node--${item.state}`];
  if (isLast) cls.push("lesson-node--last");

  // Badge (gold check for completed; lock pill for locked).
  let badge = null;
  if (item.state === "completed") {
    badge = el("span", { class: "lesson-node__badge" },
      el("img", {
        src: "assets/icons/ic_completed_badge.svg",
        alt: "",
        "aria-hidden": "true",
      }),
    );
  } else if (item.state === "locked") {
    badge = el("span", { class: "lesson-node__badge lesson-node__badge--lock" },
      el("img", {
        src: "assets/icons/ic_lock_node.svg",
        alt: "",
        "aria-hidden": "true",
      }),
    );
  }

  const ariaLabel = `${lesson.title}, ${lesson.number}` +
    (item.state === "completed" ? ", הושלם" :
     item.state === "locked"    ? ", נעול" : "");

  return el(
    "button",
    {
      type: "button",
      class: cls,
      style: { "--node-dir": String(dir) },
      "aria-label": ariaLabel,
      onClick: () => router.go(`#/lesson/${lesson.id}`),
    },
    el("span", { class: ["lesson-node__circle", nodeBgClass(item.state)] },
      el("span", { class: "lesson-node__emoji", "aria-hidden": "true" }, lesson.emoji || ""),
      badge,
    ),
    el("div", { class: "lesson-node__label" },
      el("div", { class: "lesson-node__title" }, lesson.title || ""),
      el("div", { class: "lesson-node__number" }, lesson.number || ""),
    ),
    el("span", { class: "lesson-node__connector", "aria-hidden": "true" }),
  );
}

function renderHeader({ streak, xp }) {
  return el("header", { class: "learn-header" },
    el("h1", { class: "learn-header__title" }, "Kimura"),
    el("div", { class: "learn-header__chips" },
      el("span", { class: "bg-stats-chip", "aria-label": `רצף ${streak} ימים` },
        el("span", { class: "chip-emoji", "aria-hidden": "true" }, "🔥"),
        el("span", { class: "chip-count" }, String(streak)),
      ),
      el("span", { class: "bg-stats-chip", "aria-label": `${xp} נקודות ניסיון` },
        el("span", { class: "chip-emoji", "aria-hidden": "true" }, "⭐"),
        el("span", { class: "chip-count" }, `${xp} XP`),
      ),
    ),
  );
}

export function Learn({ host, ctx }) {
  ensureStylesheet();

  const { lessons = [], router } = ctx || {};
  const completedIds = getCompletedLessonIds();
  const items = buildPathItems(lessons, completedIds);

  // Walk items, mapping each to a DOM node. Track running node index for
  // the zigzag, and detect the last NODE entry to suppress its connector
  // (matches LessonPathAdapter: invisible only on the very last item).
  let nodeIdx = 0;
  let lastNodePos = -1;
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].kind === "node") { lastNodePos = i; break; }
  }

  const listChildren = items.map((item, pos) => {
    if (item.kind === "header") {
      return renderUnitHeader(item);
    }
    const isLast = pos === lastNodePos;
    const nodeEl = renderNode(item, { router, nodeIndex: nodeIdx, isLast });
    nodeIdx += 1;
    return nodeEl;
  });

  const screen = el("div", { class: "learn-screen" },
    renderHeader({ streak: getStreak(), xp: getTotalXP() }),
    el("div", { class: "learn-path" },
      el("div", { class: "learn-path__list" }, listChildren),
    ),
  );

  mount(host, screen);
}
