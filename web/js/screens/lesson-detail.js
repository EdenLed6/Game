// Lesson Detail screen — pixel port of activity_lesson_detail.xml +
//   item_grammar.xml + item_vocab.xml + item_example.xml.
//
// Mirrors LessonDetailActivity.kt:
//   - red gradient app bar (back arrow + lesson title)
//   - lesson header (emoji block + title + subtitle)
//   - grammar / vocabulary / examples sections (with section headers and
//     accent strips)
//   - activity buttons:
//       Workbook (gold, full width)
//       Quiz + Flashcards row
//       Matching + (Number Game on lesson 8) row
//       Sentence Builder full-width row (lessons 11–16)
//
// Hebrew strings come from the XML directly so visuals match.

import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";

// Inline SVGs so the CSS can colour-tint via currentColor and so we don't
// pay for extra HTTP round-trips per icon.

// ic_arrow_right — used inside the back button. We render it pointing in the
// "back" direction at runtime via CSS.
const ARROW_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M8.59,16.59L13.17,12 8.59,7.41 10,6l6,6-6,6-1.41-1.41z"/>
  </svg>
`.trim();

// ic_volume — speaker icon for vocab/example pronounce buttons.
const VOLUME_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"/>
    <path fill="currentColor" d="M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
`.trim();

export function LessonDetail(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson) {
    Router.go("/");
    return;
  }

  const view = el(
    "div",
    { class: "page lesson-detail-page" },

    // ----- AppBar (gradient with toolbar + header card inside) -----
    el(
      "header",
      { class: "lesson-detail-appbar" },

      // Toolbar — back arrow + lesson title (white)
      el(
        "div",
        { class: "lesson-detail-toolbar" },
        el(
          "button",
          {
            class: "back-btn",
            type: "button",
            "aria-label": "חזור",
            title: "חזור",
            onClick: () => Router.back(),
            html: ARROW_SVG,
          },
        ),
        el("h1", { class: "toolbar-title" }, lesson.title),
      ),

      // Header content — emoji square + title/subtitle text column
      el(
        "div",
        { class: "lesson-detail-header" },
        el("div", { class: "header-emoji" }, lesson.emoji || ""),
        el(
          "div",
          { class: "header-text" },
          el("h2", { class: "header-title" }, lesson.title),
          el("div", { class: "header-subtitle" }, lesson.subtitle),
        ),
      ),
    ),

    // ----- Body -----
    el(
      "main",
      { class: "lesson-detail-body" },
      grammarSection(lesson),
      vocabSection(lesson),
      examplesSection(lesson),
      gamesSection(lesson),
    ),
  );

  mount(view);
}

// ---------- Grammar section ----------
// XML: section header (red accent strip + "דקדוק") + RecyclerView of grammar
// cards with marginBottom 20dp.
function grammarSection(lesson) {
  const items = lesson.grammarPoints || [];
  if (!items.length) return null;
  return el(
    "section",
    { class: "detail-section grammar" },
    sectionHeader("grammar", "דקדוק"),
    ...items.map(grammarCard),
  );
}

// item_grammar.xml — card with a 4dp colorPrimary stripe stretched
// vertically and a content column (title / body / pattern).
function grammarCard(g) {
  return el(
    "div",
    { class: "grammar-card" },
    el("div", { class: "grammar-strip", "aria-hidden": "true" }),
    el(
      "div",
      { class: "grammar-content" },
      el("div", { class: "grammar-title" }, g.title || ""),
      g.content ? el("div", { class: "grammar-body" }, g.content) : null,
      g.pattern ? el("div", { class: "grammar-pattern" }, g.pattern) : null,
    ),
  );
}

// ---------- Vocabulary section ----------
// XML: section header (gold accent strip + "אוצר מילים") + RecyclerView,
// marginBottom 20dp. Section is hidden if vocabulary is empty (Activity binding).
function vocabSection(lesson) {
  const items = lesson.vocabulary || [];
  if (!items.length) return null;
  return el(
    "section",
    { class: "detail-section vocab" },
    sectionHeader("vocab", "אוצר מילים"),
    ...items.map(vocabCard),
  );
}

// item_vocab.xml — emoji bubble (52dp) + japanese (22sp bold)/romaji chip
// inline + hebrew underneath + outlined speak button on the inline-end side.
function vocabCard(v) {
  return el(
    "div",
    { class: "vocab-card" },
    el("div", { class: "vocab-emoji" }, v.emoji || "🔤"),
    el(
      "div",
      { class: "vocab-text" },
      el(
        "div",
        { class: "vocab-row" },
        el("div", { class: "vocab-japanese", lang: "ja" }, v.japanese || ""),
        v.romaji ? el("span", { class: "vocab-romaji" }, v.romaji) : null,
      ),
      v.hebrew ? el("div", { class: "vocab-hebrew" }, v.hebrew) : null,
    ),
    speakButton(v.japanese || v.romaji || ""),
  );
}

// ---------- Examples section ----------
// XML: teal accent strip + "דוגמאות". marginBottom 24dp.
function examplesSection(lesson) {
  const items = lesson.examples || [];
  if (!items.length) return null;
  return el(
    "section",
    { class: "detail-section examples" },
    sectionHeader("examples", "דוגמאות"),
    ...items.map(exampleCard),
  );
}

// item_example.xml — bold-italic romaji + muted japanese + colored hebrew pill.
function exampleCard(ex) {
  return el(
    "div",
    { class: "example-card" },
    el(
      "div",
      { class: "example-text" },
      ex.romaji ? el("div", { class: "example-romaji" }, ex.romaji) : null,
      ex.japanese ? el("div", { class: "example-japanese", lang: "ja" }, ex.japanese) : null,
      ex.hebrew ? el("div", { class: "example-hebrew" }, ex.hebrew) : null,
    ),
    speakButton(ex.japanese || ex.romaji || ""),
  );
}

// ---------- Activities (games) section ----------
// XML uses purple accent strip + "תרגול ומשחקים".
// Buttons:
//   - btnWorkbook (full-width, gold) – always
//   - btnQuiz (filled red, weight=1) + btnFlashcards (outlined red, weight=1)
//   - btnMatching (outlined, weight=1) + btnNumberGame (outlined, weight=1, only id==8)
//   - btnSentenceBuilder (outlined, full-width, only id in 11..16)
//
// Disable rules (LessonDetailActivity.kt):
//   - btnFlashcards.isEnabled = vocabulary.isNotEmpty()
//   - btnMatching.isEnabled = vocabulary.size >= 4
function gamesSection(lesson) {
  const vocabCount = (lesson.vocabulary || []).length;
  const flashcardsEnabled = vocabCount > 0;
  const matchingEnabled = vocabCount >= 4;
  const showNumberGame = lesson.id === 8;
  const showSentenceBuilder = lesson.id >= 11 && lesson.id <= 16;

  return el(
    "section",
    { class: "detail-section games" },
    sectionHeader("games", "תרגול ומשחקים"),

    // Workbook — App.Button.Gold full width
    el(
      "button",
      {
        class: "btn btn-gold activity-workbook",
        type: "button",
        onClick: () => Router.go(`/workbook/${lesson.id}`),
      },
      "📖  חוברת עבודה אינטראקטיבית",
    ),

    // Row 1: Quiz (filled) + Flashcards (outlined)
    el(
      "div",
      { class: "activity-row" },
      activityButton({
        label: "📝  חידון",
        variant: "filled",
        enabled: true,
        onClick: () => Router.go(`/quiz/${lesson.id}`),
      }),
      activityButton({
        label: "🃏  כרטיסיות",
        variant: "outlined",
        enabled: flashcardsEnabled,
        onClick: () => Router.go(`/flashcards/${lesson.id}`),
      }),
    ),

    // Row 2: Matching + (NumberGame on lesson 8). The XML still reserves the
    // slot when number game is hidden; we mirror by replacing the second cell
    // with an invisible placeholder that keeps the grid balanced.
    el(
      "div",
      { class: "activity-row last" },
      activityButton({
        label: "🔗  התאמה",
        variant: "outlined",
        enabled: matchingEnabled,
        onClick: () => Router.go(`/matching/${lesson.id}`),
      }),
      showNumberGame
        ? activityButton({
            label: "🔢  מספרים",
            variant: "outlined",
            enabled: true,
            onClick: () => Router.go(`/numbers/${lesson.id}`),
          })
        : el("div", { "aria-hidden": "true", style: { visibility: "hidden" } }),
    ),

    // Sentence builder full-width (only lessons 11–16)
    showSentenceBuilder
      ? el(
          "button",
          {
            class: "btn-activity outlined activity-sentence",
            type: "button",
            onClick: () => Router.go(`/sentences/${lesson.id}`),
          },
          "🧩  בניית משפטים",
        )
      : null,
  );
}

// ---------- Helpers ----------

// Re-usable section header: 4dp coloured accent strip + 18sp bold title.
// Variant controls the strip colour.
function sectionHeader(variant, label) {
  return el(
    "div",
    { class: `detail-section-header ${variant}` },
    el("div", { class: "accent-strip", "aria-hidden": "true" }),
    el("h2", {}, label),
  );
}

// Outlined 44dp circular speak button used by both vocab + example cards.
function speakButton(text) {
  return el(
    "button",
    {
      class: "speak-btn",
      type: "button",
      title: "השמע",
      "aria-label": "השמע",
      onClick: () => Speaker.speak(text),
      html: VOLUME_SVG,
    },
  );
}

// Generic activity button factory used by the 2-column rows.
function activityButton({ label, variant, enabled, onClick }) {
  const classes = ["btn-activity"];
  if (variant === "outlined") classes.push("outlined");
  return el(
    "button",
    {
      class: classes.join(" "),
      type: "button",
      disabled: !enabled,
      onClick: enabled ? onClick : null,
    },
    label,
  );
}
