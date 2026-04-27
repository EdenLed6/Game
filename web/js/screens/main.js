// Main screen — pixel port of activity_main.xml + item_lesson_card.xml.
//
// Mirrors MainActivity.kt:
//   - hero (logo + progress card + gold challenge button)
//   - achievement banner (visible when completed > 0)
//   - "השיעורים שלי" section title
//   - vertical lessons list
//
// All strings (Hebrew) come straight from the XML / strings.xml so the visual
// match is 1:1.

import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Progress } from "../store.js";

// Inline arrow icon used inside lesson cards (mirrors @drawable/ic_arrow_right).
// We inline so the card can darken/tint or get auto-mirrored under RTL purely
// via CSS without an extra <img> request.
const ARROW_RIGHT_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path fill="#1A0800" d="M8.59,16.59L13.17,12 8.59,7.41 10,6l6,6-6,6-1.41-1.41z"/>
  </svg>
`.trim();

// ic_completed_badge — gold circle + white check. Static, kept out of CSS so
// the asset is identical to Android.
const COMPLETED_BADGE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
    <path fill="#F59E0B" d="M16,2C8.27,2 2,8.27 2,16S8.27,30 16,30 30,23.73 30,16 23.73,2 16,2z"/>
    <path fill="#FFFFFF" d="M13.5,21.5L8.5,16.5 10.2,14.8 13.5,18.1 21.8,9.8 23.5,11.5z"/>
  </svg>
`.trim();

export function Main(data) {
  const total = Progress.getTotalLessons();
  const completed = Progress.getCompletedCount();
  const completedIds = new Set(Progress.getCompletedIds());
  // Mirrors Kotlin integer division: completedCount * 100 / 17.
  const percent = Math.floor((completed * 100) / total);

  const view = el(
    "div",
    { class: "page main-page" },

    // ----- Hero (gradient) -----
    el(
      "section",
      { class: "main-hero" },

      // The empty MaterialToolbar slot (?actionBarSize, marginBottom 16dp).
      // It carries no title — keep an empty 56dp spacer to match the Android
      // top-padding visually.
      el("div", { class: "toolbar-spacer", "aria-hidden": "true" }),

      // Logo: 130×90dp, centered, marginBottom 20dp.
      el("img", {
        class: "logo",
        src: "assets/kimura_logo_red.png",
        alt: "Kimura",
        width: 130,
        height: 90,
      }),

      // Progress hero box (bg_progress_hero, 18dp pad, 20dp marginBottom).
      el(
        "div",
        { class: "progress-card" },
        el(
          "div",
          { class: "progress-row" },
          el("div", { class: "progress-percent" }, `${percent}%`),
          el("span", { class: "progress-course-title" }, "יפנית"),
        ),
        el(
          "div",
          { class: "progress-indicator", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percent },
          el("div", { class: "progress-fill", style: { width: percent + "%" } }),
        ),
        el("div", { class: "progress-text" }, `הושלמו ${completed} מתוך ${total} שיעורים`),
      ),

      // Gold challenge button — App.Button.Gold (foundation .btn .btn-gold).
      el(
        "button",
        {
          class: "btn btn-gold btn-challenge",
          type: "button",
          onClick: () => Router.go("/challenge"),
        },
        "🥋  התחל אתגר נינג'ה",
      ),
    ),

    // ----- Achievement banner — visible only when completed > 0 -----
    completed > 0
      ? el(
          "div",
          { class: "main-achievement" },
          completed === total
            ? "כל השיעורים הושלמו. すごい!"
            : `המשיכי כך: עוד ${total - completed} שיעורים לסיום`,
        )
      : null,

    // ----- "השיעורים שלי" title -----
    el("h2", { class: "main-lessons-title" }, "📚  השיעורים שלי"),

    // ----- Lessons list -----
    el(
      "div",
      { class: "main-lessons-list" },
      data.lessons.map((lesson) => lessonCard(lesson, completedIds.has(lesson.id))),
    ),
  );

  mount(view);
}

// Mirrors LessonAdapter.LessonViewHolder.bind() + the item_lesson_card.xml layout.
function lessonCard(lesson, isCompleted) {
  const card = el(
    "button",
    {
      type: "button",
      class: "lesson-card" + (isCompleted ? " is-completed" : ""),
      onClick: () => Router.go(`/lesson/${lesson.id}`),
      "aria-label": `${lesson.number} ${lesson.title}`,
    },

    // Emoji bubble (56×56, bg_icon_bubble, 28sp)
    el("div", { class: "lesson-emoji" }, lesson.emoji || "🇯🇵"),

    // Content column
    el(
      "div",
      { class: "lesson-content" },
      // Lesson number chip (e.g. "שיעור 1")
      el("div", { class: "lesson-number" }, lesson.number),
      // Title (16sp bold)
      el("div", { class: "lesson-title" }, lesson.title),
      // Subtitle (12sp muted)
      el("div", { class: "lesson-subtitle" }, lesson.subtitle),
      // Completion label — only when completed (bg_option_correct pill, "✓  הושלם")
      isCompleted ? el("div", { class: "lesson-completion-label" }, "✓  הושלם") : null,
    ),

    // Right side: completed badge (when done) + arrow.
    el(
      "div",
      { class: "lesson-right" },
      isCompleted
        ? el("div", { class: "lesson-completed-badge", html: COMPLETED_BADGE_SVG })
        : null,
      el("div", { class: "lesson-arrow", html: ARROW_RIGHT_SVG }),
    ),
  );

  return card;
}
