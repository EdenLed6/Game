// lesson-detail.js — LessonDetail screen.
//
// Ports activity_lesson_detail.xml + LessonDetailActivity.kt with a hint of
// LessonJourneyActivity's intro hero (header banner + emoji bubble + title +
// subtitle + Vimeo video preview + "in this lesson" preview card) so the web
// build packs the journey-style intro and the per-section content into a
// single scrollable surface.
//
// Layout flow (top → bottom):
//   1. Red header banner (bg_header.png) — back arrow + lesson title
//   2. Hero row in the banner: 72dp progress-hero emoji bubble + title + subtitle
//   3. Tabs strip: "תוכן השיעור" / "מילים חדשות" (matches Android TabLayout)
//   4. PAGE 1 (תוכן השיעור):
//        • Embedded Vimeo iframe (16:9) if videoUrl present
//        • "בשיעור זה תלמד:" preview card (top 3 vocab) if vocab present
//        • Grammar section (red strip) — list of grammar cards
//        • Examples section (teal strip) — list of example cards
//        • Games section (purple strip) — Workbook (gold), Quiz+Flashcards row,
//          Matching+NumberGame row, SentenceBuilder full-width
//          NumberGame visible only on lesson 8
//          SentenceBuilder visible only on lessons 11..16
//          Flashcards disabled if vocabulary is empty
//          Matching disabled if vocabulary < 4
//   5. PAGE 2 (מילים חדשות): list of vocab cards w/ red speaker buttons
//
// Sources of truth:
//   .ui-source/app/src/main/res/layout/activity_lesson_detail.xml
//   .ui-source/app/src/main/res/layout/item_vocab.xml
//   .ui-source/app/src/main/res/layout/item_grammar.xml
//   .ui-source/app/src/main/res/layout/item_example.xml
//   .ui-source/app/src/main/java/.../LessonDetailActivity.kt
//   .ui-source/app/src/main/java/.../LessonJourneyActivity.kt (video card +
//     intro preview)
//   .ui-source/app/src/main/java/.../adapter/{Vocab,Grammar,Example}Adapter.kt

import { el, mount } from "../dom.js";
import * as speaker from "../speaker.js";

// ---------- stylesheet bootstrap ----------
function ensureStylesheet() {
  const HREF = "css/screens/lesson-detail.css";
  for (const link of document.head.querySelectorAll('link[rel="stylesheet"]')) {
    if (link.getAttribute("href") === HREF) return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = HREF;
  document.head.appendChild(link);
}

// ---------- inline back-arrow icon ----------
function backArrowSVG() {
  // ic_arrow_back.svg — direction is honored by the parent's RTL flow; we use
  // a CSS transform on the wrapper to flip when needed.
  return el("span", {
    class: "ld-icon-back",
    "aria-hidden": "true",
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M20,11H7.83l5.59-5.59L12,4l-8,8 8,8 1.41-1.41L7.83,13H20v-2z"/></svg>',
  });
}

// ---------- small speaker icon (uses currentColor) ----------
function speakerSVG() {
  return el("span", {
    class: "ld-icon-speaker",
    "aria-hidden": "true",
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M3,9v6h4l5,5V4L7,9H3zm13.5,3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-0.73 2.5-2.25 2.5-4.02z"/><path fill="currentColor" d="M14,3.23v2.06c2.89,0.86 5,3.54 5,6.71s-2.11,5.85-5,6.71v2.06c4.01-0.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  });
}

// ---------- vocab card (item_vocab.xml port) ----------
function renderVocabCard(item) {
  const speakBtn = el(
    "button",
    {
      type: "button",
      class: "ld-vocab__speak",
      "aria-label": `השמע ${item.japanese || item.romaji || ""}`,
      onClick: (ev) => {
        ev.stopPropagation();
        speaker.speak(item.japanese || item.romaji || "");
      },
    },
    speakerSVG(),
  );

  return el(
    "article",
    { class: "ld-vocab-card bg-card-modern" },
    el(
      "div",
      { class: "ld-vocab-card__row" },
      el(
        "span",
        { class: "ld-vocab__emoji bg-icon-bubble", "aria-hidden": "true" },
        item.emoji || "",
      ),
      el(
        "div",
        { class: "ld-vocab__text" },
        el(
          "div",
          { class: "ld-vocab__top" },
          el("span", { class: "ld-vocab__japanese dir-ltr" }, item.japanese || ""),
          item.romaji
            ? el("span", { class: "ld-vocab__romaji bg-lesson-number-chip dir-ltr" }, item.romaji)
            : null,
        ),
        item.hebrew
          ? el("div", { class: "ld-vocab__hebrew" }, item.hebrew)
          : null,
      ),
      speakBtn,
    ),
  );
}

// ---------- grammar card (item_grammar.xml port) ----------
function renderGrammarCard(item) {
  return el(
    "article",
    { class: "ld-grammar-card bg-card-modern" },
    el("div", { class: "ld-grammar-card__row" },
      el("span", { class: "ld-grammar-card__strip", "aria-hidden": "true" }),
      el("div", { class: "ld-grammar-card__body" },
        item.title
          ? el("h3", { class: "ld-grammar-card__title" }, item.title)
          : null,
        item.content
          ? el("p", { class: "ld-grammar-card__content" }, item.content)
          : null,
        item.pattern
          ? el("p", { class: "ld-grammar-card__pattern bg-grammar-pattern" }, item.pattern)
          : null,
      ),
    ),
  );
}

// ---------- example card (item_example.xml port) ----------
function renderExampleCard(item) {
  // The Android adapter speaks the romaji-or-japanese on tap.
  const speakText = item.japanese || item.romaji || "";
  const speakBtn = el(
    "button",
    {
      type: "button",
      class: "ld-vocab__speak",
      "aria-label": "השמע דוגמה",
      onClick: (ev) => { ev.stopPropagation(); speaker.speak(speakText); },
    },
    speakerSVG(),
  );

  return el(
    "article",
    { class: "ld-example-card bg-card-modern" },
    el(
      "div",
      { class: "ld-example-card__row" },
      el(
        "div",
        { class: "ld-example-card__text" },
        item.romaji
          ? el("div", { class: "ld-example__romaji dir-ltr" }, item.romaji)
          : null,
        item.japanese
          ? el("div", { class: "ld-example__japanese dir-ltr" }, item.japanese)
          : null,
        item.hebrew
          ? el("div", { class: "ld-example__hebrew bg-lesson-number-chip" }, item.hebrew)
          : null,
      ),
      speakBtn,
    ),
  );
}

// ---------- section header (red/teal/purple/gold accent strip) ----------
function renderSectionHeader(title, accentColor) {
  return el(
    "header",
    { class: "ld-section-header" },
    el("span", {
      class: "ld-section-header__strip",
      style: { background: accentColor },
      "aria-hidden": "true",
    }),
    el("h2", { class: "ld-section-header__title" }, title),
  );
}

// ---------- vimeo embed (iframe) ----------
function renderVideoCard(videoUrl, lesson, router) {
  if (!videoUrl) return null;
  // videoUrl is e.g. https://player.vimeo.com/video/1032805127
  const params = "autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0&dnt=1";
  const src = `${videoUrl}?${params}`;

  return el(
    "section",
    { class: "ld-video-card", "aria-label": "וידאו השיעור" },
    el("div", { class: "ld-video-card__frame" },
      el("iframe", {
        class: "ld-video-card__iframe",
        src,
        title: `וידאו: ${lesson.title || ""}`,
        loading: "lazy",
        allow: "autoplay; fullscreen; picture-in-picture",
        allowfullscreen: true,
        frameborder: "0",
      }),
    ),
    // "Open fullscreen" affordance — navigates to the dedicated Video screen.
    el(
      "button",
      {
        type: "button",
        class: "ld-video-card__expand",
        "aria-label": "פתח במסך מלא",
        onClick: () => router && router.go(`#/lesson/${lesson.id}/video`),
      },
      el("span", { "aria-hidden": "true" }, "⛶ מסך מלא"),
    ),
  );
}

// ---------- "בשיעור זה תלמד" preview card (LessonJourneyActivity.kt port) ----------
function renderPreviewCard(lesson) {
  const top = (lesson.vocabulary || []).slice(0, 3);
  if (top.length === 0) return null;

  return el(
    "section",
    { class: "ld-preview-card bg-card-modern", "aria-label": "תצוגה מקדימה" },
    el("h3", { class: "ld-preview-card__title" }, "בשיעור זה תלמד:"),
    el(
      "ul",
      { class: "ld-preview-card__list" },
      top.map(v =>
        el("li", { class: "ld-preview-card__item" },
          el("span", { class: "dir-ltr" }, v.japanese || v.romaji || ""),
          " = ",
          el("span", {}, v.hebrew || ""),
        ),
      ),
    ),
  );
}

// ---------- games section (LessonDetailActivity.kt port) ----------
function renderGames(lesson, router) {
  const id = lesson.id;
  const hasVocab = (lesson.vocabulary || []).length > 0;
  const hasFour  = (lesson.vocabulary || []).length >= 4;
  const showNumberGame      = id === 8;
  const showSentenceBuilder = id >= 11 && id <= 16;

  const go = (suffix) => () => router && router.go(`#/lesson/${id}/${suffix}`);

  // Workbook — gold full-width
  const workbookBtn = el(
    "button",
    {
      type: "button",
      class: "btn btn--gold btn--block ld-game-btn",
      onClick: go("workbook"),
    },
    "📖  חוברת עבודה אינטראקטיבית",
  );

  // Quiz + Flashcards row
  const quizBtn = el(
    "button",
    { type: "button", class: "btn ld-game-btn", onClick: go("quiz") },
    "📝  חידון",
  );
  const flashcardsBtn = el(
    "button",
    {
      type: "button",
      class: "btn ld-game-btn",
      disabled: !hasVocab,
      onClick: hasVocab ? go("flashcards") : undefined,
    },
    "🃏  כרטיסיות",
  );

  // Matching + NumberGame row
  const matchingBtn = el(
    "button",
    {
      type: "button",
      class: "btn ld-game-btn",
      disabled: !hasFour,
      onClick: hasFour ? go("matching") : undefined,
    },
    "🔗  התאמה",
  );

  const numberGameBtn = showNumberGame
    ? el(
        "button",
        { type: "button", class: "btn ld-game-btn", onClick: go("number-game") },
        "🔢  מספרים",
      )
    : null;

  // SentenceBuilder full-width row (lessons 11..16 only)
  const sentenceBtn = showSentenceBuilder
    ? el(
        "button",
        { type: "button", class: "btn btn--block ld-game-btn", onClick: go("sentence-builder") },
        "🧩  בניית משפטים",
      )
    : null;

  // Compose rows. When NumberGame is hidden, Matching renders alone in the
  // row to mirror the Android layout where btnNumberGame's slot collapses.
  return [
    workbookBtn,
    el("div", { class: "ld-game-row" },
      el("div", { class: "ld-game-cell" }, quizBtn),
      el("div", { class: "ld-game-cell" }, flashcardsBtn),
    ),
    el("div", { class: "ld-game-row" },
      el("div", { class: "ld-game-cell" }, matchingBtn),
      numberGameBtn ? el("div", { class: "ld-game-cell" }, numberGameBtn) : null,
    ),
    sentenceBtn,
  ];
}

// ---------- screen entry ----------
export function LessonDetail({ host, ctx, params }) {
  ensureStylesheet();

  const { lessons = [], router } = ctx || {};
  const id = Number(params && params.id);
  const lesson = lessons.find(l => Number(l.id) === id);

  if (!lesson) {
    mount(host, el("div", { class: "screen" },
      el("div", { class: "stub-screen" }, "השיעור לא נמצא")));
    return;
  }

  // Cancel any speech started inside this screen if the user navigates away.
  const stopSpeaking = () => speaker.stopSpeaking();

  // ---------- Header / hero banner ----------
  const header = el(
    "header",
    { class: "ld-header" },
    el(
      "button",
      {
        type: "button",
        class: "ld-header__back",
        "aria-label": "חזור",
        onClick: () => { stopSpeaking(); router && router.back(); },
      },
      backArrowSVG(),
    ),
    el(
      "div",
      { class: "ld-header__row" },
      el(
        "span",
        { class: "ld-header__emoji bg-progress-hero", "aria-hidden": "true" },
        lesson.emoji || "",
      ),
      el(
        "div",
        { class: "ld-header__text" },
        el("h1", { class: "ld-header__title" }, lesson.title || ""),
        lesson.subtitle
          ? el("p", { class: "ld-header__subtitle" }, lesson.subtitle)
          : null,
      ),
    ),
  );

  // ---------- Tabs strip ----------
  const tabContent = el("button",
    { type: "button", class: "ld-tab is-active", role: "tab", "aria-selected": "true" },
    "תוכן השיעור");
  const tabVocab = el("button",
    { type: "button", class: "ld-tab", role: "tab", "aria-selected": "false" },
    "מילים חדשות");
  const tabsStrip = el("nav",
    { class: "ld-tabs", role: "tablist", "aria-label": "תוכן השיעור" },
    tabContent, tabVocab);

  // ---------- PAGE 1: content ----------
  const grammarList = (lesson.grammarPoints || []).map(renderGrammarCard);
  const examples    = lesson.examples || [];
  const examplesList = examples.map(renderExampleCard);

  const pageContent = el(
    "section",
    { class: "ld-page ld-page--content", role: "tabpanel", "aria-label": "תוכן השיעור" },
    renderVideoCard(lesson.videoUrl, lesson, router),
    renderPreviewCard(lesson),

    // Grammar
    grammarList.length
      ? el("div", { class: "ld-section" },
          renderSectionHeader("דקדוק", "var(--color-primary)"),
          el("div", { class: "ld-card-list" }, grammarList),
        )
      : null,

    // Examples — section only renders if there's at least one
    examplesList.length
      ? el("div", { class: "ld-section" },
          renderSectionHeader("דוגמאות", "var(--color-accent-teal)"),
          el("div", { class: "ld-card-list" }, examplesList),
        )
      : null,

    // Games
    el("div", { class: "ld-section ld-section--games" },
      renderSectionHeader("תרגול ומשחקים", "var(--color-accent-purple)"),
      el("div", { class: "ld-games" }, renderGames(lesson, router)),
    ),
  );

  // ---------- PAGE 2: vocabulary ----------
  const vocabList = (lesson.vocabulary || []).map(renderVocabCard);
  const pageVocab = el(
    "section",
    { class: "ld-page ld-page--vocab", role: "tabpanel", "aria-label": "מילים חדשות", hidden: true },
    el("div", { class: "ld-section" },
      renderSectionHeader("מילים חדשות", "var(--color-secondary)"),
      vocabList.length
        ? el("div", { class: "ld-card-list" }, vocabList)
        : el("p", { class: "ld-empty" }, "אין מילים חדשות בשיעור זה"),
    ),
  );

  // ---------- Composed scroll host ----------
  const scrollHost = el(
    "div",
    { class: "ld-scroll" },
    pageContent, pageVocab,
  );

  // ---------- Tab switching ----------
  function selectTab(name) {
    const isContent = name === "content";
    tabContent.classList.toggle("is-active", isContent);
    tabContent.setAttribute("aria-selected", isContent ? "true" : "false");
    tabVocab.classList.toggle("is-active", !isContent);
    tabVocab.setAttribute("aria-selected", !isContent ? "true" : "false");
    pageContent.hidden = !isContent;
    pageVocab.hidden = isContent;
    scrollHost.scrollTop = 0;
    stopSpeaking();
  }
  tabContent.addEventListener("click", () => selectTab("content"));
  tabVocab.addEventListener("click", () => selectTab("vocab"));

  const screen = el(
    "div",
    { class: "screen ld-screen" },
    header,
    tabsStrip,
    scrollHost,
  );

  mount(host, screen);
}
