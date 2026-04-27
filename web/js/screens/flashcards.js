// Flashcards screen — pixel-1:1 port of activity_flashcard.xml + FlashcardActivity.kt.
//
// Vertical LinearLayout:
//   1) Gradient hero (paddingTop=44, sides=20, paddingBottom=16)
//        - MaterialToolbar (back arrow + title)
//        - tvCardCounter (bg_stats_chip dark pill, white 13sp bold)
//   2) Body (centered LinearLayout, padding=20, weight=1)
//        - 260dp FrameLayout with cardFront / cardBack stacked. Tapping either
//          (or btnFlip) flips between them. The XML uses anim/card_flip_in.xml
//          and anim/card_flip_out.xml (objectAnimator rotationY 200ms). We
//          reproduce that with CSS transform: rotateY().
//        - Navigation row (btnPrev / btnFlip / btnNext, weights 1/1.4/1).
//        - btnSpeakCard (full-width outlined red pill).

import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";

export function Flashcards(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.vocabulary || !lesson.vocabulary.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  // Mirror FlashcardActivity field state.
  const state = {
    vocab: lesson.vocabulary,
    index: 0,
    showFront: true,
  };

  function render() {
    const total = state.vocab.length;
    const v = state.vocab[state.index];

    const view = el(
      "div",
      { class: "fc-screen" },
      // ---- Hero ---------------------------------------------------------
      el(
        "header",
        { class: "fc-hero" },
        el(
          "div",
          { class: "app-toolbar", style: { paddingTop: "0", paddingBottom: "0" } },
          el(
            "button",
            {
              class: "toolbar-back",
              "aria-label": "חזור",
              onClick: () => Router.go(`/lesson/${lessonId}`),
            },
            "←"
          ),
          el("h1", { class: "toolbar-title" }, "כרטיסיות")
        ),
        el(
          "span",
          { class: "fc-counter-chip" },
          `${state.index + 1} / ${total}`
        )
      ),
      // ---- Body ---------------------------------------------------------
      el(
        "main",
        { class: "fc-body" },
        // Card stage with front + back. The .is-front / .is-back class on the
        // stage drives the rotateY transform on each face — same outcome as
        // setting cardFront.visibility=VISIBLE / cardBack.visibility=GONE in
        // Kotlin, but with a real flip animation.
        el(
          "div",
          {
            class: "fc-card-stage " + (state.showFront ? "is-front" : "is-back"),
            // Tapping anywhere on the stage flips, just like cardFront/cardBack
            // both having setOnClickListener { toggleCard() }.
            onClick: flip,
          },
          // Front face — white card with Japanese + romaji + hint chip.
          el(
            "div",
            { class: "fc-card fc-card-front" },
            el("p", { class: "fc-front-japanese" }, v.japanese || ""),
            el("p", { class: "fc-front-romaji" }, v.romaji || ""),
            el("span", { class: "fc-hint-chip" }, "הקש להפיכה")
          ),
          // Back face — red gradient card with emoji + Hebrew + Japanese + romaji.
          el(
            "div",
            { class: "fc-card fc-card-back" },
            el("p", { class: "fc-back-emoji" }, v.emoji || "🔤"),
            el("p", { class: "fc-back-hebrew" }, v.hebrew || ""),
            el("p", { class: "fc-back-japanese" }, v.japanese || ""),
            el("p", { class: "fc-back-romaji" }, v.romaji || "")
          )
        ),
        // Navigation row
        el(
          "div",
          { class: "fc-nav" },
          el(
            "button",
            {
              class: "btn-prev",
              type: "button",
              disabled: state.index === 0,
              onClick: prev,
            },
            "◀  הקודם"
          ),
          el(
            "button",
            {
              class: "btn-flip",
              type: "button",
              onClick: flip,
            },
            "הפוך כרטיס"
          ),
          el(
            "button",
            {
              class: "btn-next",
              type: "button",
              disabled: state.index >= state.vocab.length - 1,
              onClick: next,
            },
            "הבא  ▶"
          )
        ),
        // Speak button
        el(
          "button",
          {
            class: "fc-speak-btn",
            type: "button",
            onClick: () => Speaker.speak(v.japanese || ""),
          },
          "🔊  שמע הגייה"
        )
      )
    );

    mount(view);
  }

  function flip() {
    state.showFront = !state.showFront;
    render();
  }

  function prev() {
    if (state.index > 0) {
      state.index--;
      state.showFront = true;
      render();
    }
  }

  function next() {
    if (state.index < state.vocab.length - 1) {
      state.index++;
      state.showFront = true;
      render();
    }
  }

  render();
}
