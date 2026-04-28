// flashcards.js — 1:1 port of activity_flashcard.xml + FlashcardActivity.kt.
//
// Layout (top → bottom):
//   1) Header (bg_header.png) holding
//        - Toolbar (back arrow + "כרטיסיות")
//        - bg_stats_chip counter "N / total" centered
//   2) Centered card area (padding=20dp)
//        - 260dp tall card. Front = bg_flashcard_front (washi 24dp + 1.5dp
//          stroke) with Japanese (52sp bold) + romaji (18sp muted) +
//          "הקש להפיכה" hint pill. Back = bg_flashcard_back (red gradient
//          24dp) with emoji (44sp), Hebrew (30sp bold), Japanese (18sp @
//          0.85), romaji (13sp @ 0.65).
//        - Tap card or Flip button to toggle (CSS rotateY 200ms).
//   3) Nav row: Prev (small) / Flip (primary, weight 1.4) / Next (small)
//   4) Full-width primary "🔊  שמע הגייה" button.

import { el, mount } from "../dom.js";

const FLIP_DURATION_MS = 200;

export function Flashcards({ host, ctx, params }) {
  const { lessons, router, speaker } = ctx;
  const lessonId = Number(params.id);
  const lesson = (lessons || []).find(l => Number(l.id) === lessonId);

  if (!lesson || !Array.isArray(lesson.vocabulary) || lesson.vocabulary.length === 0) {
    router.go(`#/lesson/${lessonId}`);
    return;
  }

  const state = {
    vocab: lesson.vocabulary,
    index: 0,
    showingFront: true,
    flipping: false,
  };

  // ---- Render --------------------------------------------------------------
  function render() {
    const root = el(
      "div",
      { class: "screen flashcard-screen" },
      renderHeader(),
      renderBody()
    );
    mount(host, root);
  }

  function renderHeader() {
    return el(
      "header",
      { class: "flashcard-header" },
      el(
        "div",
        { class: "flashcard-header__top" },
        el(
          "button",
          {
            type: "button",
            class: "flashcard-header__back",
            "aria-label": "חזור",
            onClick: () => router.back(),
          },
          el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })
        ),
        el("h1", { class: "flashcard-header__title" }, "כרטיסיות")
      ),
      el(
        "p",
        { class: "flashcard-counter bg-stats-chip" },
        `${state.index + 1} / ${state.vocab.length}`
      )
    );
  }

  function renderBody() {
    const item = state.vocab[state.index];
    const total = state.vocab.length;
    const flipClass = state.showingFront ? "" : "is-flipped";

    return el(
      "main",
      { class: "flashcard-body" },
      // 260dp card area, FrameLayout port — uses 3D flip via rotateY
      el(
        "div",
        {
          class: ["flashcard-card", flipClass].filter(Boolean).join(" "),
          onClick: toggleFlip,
        },
        // Front face — washi
        el(
          "div",
          { class: "flashcard-face flashcard-face--front bg-flashcard-front" },
          el("div", { class: "flashcard-front__japanese", lang: "ja" }, item.japanese || ""),
          el("div", { class: "flashcard-front__romaji dir-ltr" }, item.romaji || ""),
          el("div", { class: "flashcard-front__hint" }, "הקש להפיכה")
        ),
        // Back face — red gradient
        el(
          "div",
          { class: "flashcard-face flashcard-face--back bg-flashcard-back" },
          el("div", { class: "flashcard-back__emoji" }, item.emoji || ""),
          el("div", { class: "flashcard-back__hebrew" }, item.hebrew || ""),
          el("div", { class: "flashcard-back__japanese", lang: "ja" }, item.japanese || ""),
          el("div", { class: "flashcard-back__romaji dir-ltr" }, item.romaji || "")
        )
      ),
      // Navigation row: Prev / Flip / Next
      el(
        "div",
        { class: "flashcard-nav" },
        el(
          "button",
          {
            type: "button",
            class: "btn btn--small flashcard-nav__btn flashcard-nav__btn--prev",
            disabled: state.index === 0,
            onClick: onPrev,
          },
          "◀  הקודם"
        ),
        el(
          "button",
          {
            type: "button",
            class: "btn flashcard-nav__btn flashcard-nav__btn--flip",
            onClick: toggleFlip,
          },
          "הפוך כרטיס"
        ),
        el(
          "button",
          {
            type: "button",
            class: "btn btn--small flashcard-nav__btn flashcard-nav__btn--next",
            disabled: state.index >= total - 1,
            onClick: onNext,
          },
          "הבא  ▶"
        )
      ),
      // Full-width audio button
      el(
        "button",
        {
          type: "button",
          class: "btn btn--block flashcard-speak",
          onClick: () => speaker.speak(item.japanese || ""),
        },
        "🔊  שמע הגייה"
      )
    );
  }

  // ---- Handlers ------------------------------------------------------------
  function toggleFlip(e) {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    if (state.flipping) return;
    state.flipping = true;
    state.showingFront = !state.showingFront;
    render();
    setTimeout(() => { state.flipping = false; }, FLIP_DURATION_MS);
  }

  function onPrev() {
    if (state.index === 0) return;
    state.index--;
    state.showingFront = true;
    render();
  }

  function onNext() {
    if (state.index >= state.vocab.length - 1) return;
    state.index++;
    state.showingFront = true;
    render();
  }

  render();
}
