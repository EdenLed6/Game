// Sentence Builder — 1:1 port of SentenceBuilderActivity.kt + activity_sentence_builder.xml.
//
// Layout:
//   1. Gradient hero (paddingTop=44dp, paddingStart/End=20dp, paddingBottom=16dp)
//      with toolbar (back arrow + title) + centered gold score badge.
//   2. Builder card (margin=16dp, radius=24dp, elev=3dp): instruction (13sp, muted,
//      centered) → question (18sp bold, start) → built sentence display (surfaceSoft,
//      12dp radius, 1dp dividerSoft stroke, minHeight=52dp, 16sp) → word chips grid
//      → optional feedback card → "בדוק תשובה" (filled red) / "השאלה הבאה" (outlined).
//   3. Result screen (centered, padding=32dp): emoji 🧩 + final score "X / N" +
//      "🔄 שחק שוב" (gold) + "חזור לשיעור" (outlined).
//
// Functional preservation: examples come from lesson.examples; words are split on
// whitespace and shuffled; tap a chip to append it to the built sentence; the
// chip "disappears" (View.GONE in the adapter) — we mirror that with the
// is-picked → is-used class chain. checkAnswer() does case-insensitive trimmed
// equality. ↺ אפס resets the round (reshuffle words).

import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";

export function SentenceBuilder(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.examples || lesson.examples.length === 0) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  const state = {
    examples: lesson.examples,
    index: 0,
    score: 0,
    chips: [],          // [{ word, used, picking }] — picking triggers the pick animation
    built: [],          // chip indices in pick order
    feedback: null,     // { correct: bool, text: string } | null
    showResult: false,
  };

  // Mirrors loadQuestion(): reset, shuffle the example's romaji words.
  function loadQuestion() {
    const ex = state.examples[state.index];
    const words = ex.romaji.trim().split(/\s+/);
    state.chips = shuffle(words).map(w => ({ word: w, used: false, picking: false, returning: true }));
    state.built = [];
    state.feedback = null;
    render();
  }

  // Mirrors checkAnswer(): equalsIgnoreCase on trimmed strings.
  function checkAnswer() {
    const ex = state.examples[state.index];
    const built = state.built.map(i => state.chips[i].word).join(" ").trim();
    const correct = built.toLowerCase() === ex.romaji.trim().toLowerCase();
    if (correct) {
      state.score++;
      state.feedback = { correct: true, text: "נכון! 🎉" };
    } else {
      state.feedback = { correct: false, text: `לא נכון. התשובה: ${ex.romaji}` };
    }
    render();
  }

  // Mirrors advanceQuestion()
  function advance() {
    state.index++;
    if (state.index < state.examples.length) {
      loadQuestion();
    } else {
      state.showResult = true;
      render();
    }
  }

  // Mirrors restartGame()
  function restart() {
    state.index = 0;
    state.score = 0;
    state.showResult = false;
    loadQuestion();
  }

  function back() {
    Router.go(`/lesson/${lessonId}`);
  }

  function pickChip(idx) {
    const chip = state.chips[idx];
    if (chip.used || chip.picking) return;
    if (state.feedback != null) return;
    chip.picking = true;
    state.built.push(idx);
    render();
    // After the pick animation completes, mark used (display:none) — same end
    // state as the adapter's View.GONE.
    setTimeout(() => {
      chip.picking = false;
      chip.used = true;
      render();
    }, 220);
  }

  function render() {
    if (state.showResult) {
      mount(renderResult());
      return;
    }
    mount(renderGame());
  }

  function renderGame() {
    const ex = state.examples[state.index];
    const allUsed = state.chips.every(c => c.used || c.picking);
    const builtText = state.built
      .map(i => state.chips[i].word)
      .join(" ");

    return el(
      "div",
      { class: "sb-screen" },
      // Gradient hero header
      el(
        "header",
        { class: "sb-hero" },
        el(
          "div",
          { class: "sb-toolbar" },
          el("button", { class: "sb-back", onClick: back, "aria-label": "חזור" }, "→"),
          el("h1", { class: "sb-title" }, "✏️ בניית משפטים"),
        ),
        el(
          "div",
          { class: "sb-score-row" },
          el("div", { class: "sb-score" }, `ניקוד: ${state.score}`),
        ),
      ),
      // Builder card
      el(
        "div",
        { class: "sb-card" },
        el("div", { class: "sb-instruction" }, "סדר את המילים כדי לבנות את המשפט"),
        el("div", { class: "sb-question" }, ex.hebrew),
        // Built sentence display (cardSoft style)
        el(
          "div",
          { class: "sb-built-card" },
          el(
            "div",
            { class: "sb-built" + (builtText ? "" : " is-empty") },
            builtText || " ",
          ),
        ),
        // Word chips
        el(
          "div",
          { class: "sb-chips" },
          state.chips.map((c, i) => chipButton(c, i)),
        ),
        // Optional feedback card
        state.feedback
          ? el("div", {
              class: "sb-feedback " + (state.feedback.correct ? "is-correct" : "is-wrong"),
            }, state.feedback.text)
          : null,
        // Action buttons. The Activity has Check then Next as two stacked buttons,
        // toggling visibility with View.VISIBLE/GONE; we mirror that here.
        el(
          "div",
          { class: "sb-actions" },
          state.feedback
            ? el("button", { class: "sb-btn", onClick: advance },
                state.index + 1 < state.examples.length ? "השאלה הבאה" : "סיים")
            : el("button", {
                class: "sb-btn",
                disabled: !allUsed,
                onClick: checkAnswer,
              }, "בדוק תשובה"),
          // ↺ אפס — soft reset of the current round (re-shuffles the same example).
          state.feedback
            ? null
            : el("button", { class: "sb-btn is-outlined", onClick: loadQuestion }, "↺ אפס"),
        ),
      ),
    );
  }

  function chipButton(c, i) {
    let cls = "sb-chip";
    if (c.used) cls += " is-used";
    if (c.picking) cls += " is-picked";
    if (c.returning) cls += " is-returning";
    // Reset returning flag after first render so it doesn't replay.
    if (c.returning) {
      // Schedule clearing the flag after one tick — keeps the bounce-in to
      // play exactly once when chips are first laid out / after ↺ אפס.
      queueMicrotask(() => { c.returning = false; });
    }
    return el(
      "button",
      {
        class: cls,
        disabled: c.used || c.picking || state.feedback != null,
        onClick: () => pickChip(i),
        type: "button",
      },
      c.word,
    );
  }

  function renderResult() {
    const total = state.examples.length;
    return el(
      "div",
      { class: "sb-screen" },
      el(
        "header",
        { class: "sb-hero" },
        el(
          "div",
          { class: "sb-toolbar" },
          el("button", { class: "sb-back", onClick: back, "aria-label": "חזור" }, "→"),
          el("h1", { class: "sb-title" }, "✏️ בניית משפטים"),
        ),
        el(
          "div",
          { class: "sb-score-row" },
          el("div", { class: "sb-score" }, `ניקוד: ${state.score}`),
        ),
      ),
      el(
        "div",
        { class: "sb-result" },
        el("div", { class: "sb-result-emoji" }, "🧩"),
        el("div", { class: "sb-result-score" }, `${state.score} / ${total}`),
        el(
          "div",
          { class: "sb-result-actions" },
          el("button", { class: "sb-btn is-gold", onClick: restart }, "🔄  שחק שוב"),
          el("button", { class: "sb-btn is-outlined", onClick: back }, "חזור לשיעור"),
        ),
      ),
    );
  }

  loadQuestion();
}
