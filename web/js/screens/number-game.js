// Number Game — 1:1 port of NumberGameActivity.kt + activity_number_game.xml.
//
// Visual layout mirrors the Android activity exactly:
//   1. Gradient hero header (44dp top padding, 20dp h-padding) with a
//      MaterialToolbar (back arrow + title) and a centered gold score badge.
//   2. A surface MaterialCardView (24dp radius, 3dp elev) hosting the
//      question text, the big number/romaji display, four App.Button.Option
//      buttons, and an optional surface-soft feedback card.
//   3. On round 10 completion the card is replaced by the result LinearLayout
//      (centered emoji + final score + replay/back buttons).
//
// Functional preservation:
//   - 10 rounds; round index alternates question types
//     (even = "show digits, pick romaji" ; odd = "show romaji, pick digits").
//   - 4 options shuffled with the correct number; 3 wrong distractors in 1..9999.
//   - 1000ms feedback delay (same as Kotlin postDelayed) before the next round.
//   - Final score "X / 10".

import { el, mount, randomInt, shuffle } from "../dom.js";
import { Router } from "../router.js";

const ONES      = { 1: "ichi", 2: "ni",     3: "san",      4: "yon",      5: "go",     6: "roku",      7: "nana",      8: "hachi",     9: "kyuu" };
const TENS      = { 1: "juu",  2: "ni-juu", 3: "san-juu",  4: "yon-juu",  5: "go-juu", 6: "roku-juu",  7: "nana-juu",  8: "hachi-juu", 9: "kyuu-juu" };
const HUNDREDS  = { 1: "hyaku", 2: "ni-hyaku", 3: "san-byaku", 4: "yon-hyaku", 5: "go-hyaku", 6: "rop-pyaku", 7: "nana-hyaku", 8: "hap-pyaku", 9: "kyuu-hyaku" };
const THOUSANDS = { 1: "sen",   2: "ni-sen",   3: "san-zen",   4: "yon-sen",   5: "go-sen",   6: "roku-sen",   7: "nana-sen",   8: "has-sen",    9: "kyuu-sen" };

// Mirrors NumberGameActivity.numberToRomaji exactly.
export function numberToRomaji(n) {
  if (n === 0) return "zero";
  const parts = [];
  let r = n;
  const t = Math.floor(r / 1000); r %= 1000;
  if (t > 0) parts.push(THOUSANDS[t] || "");
  const h = Math.floor(r / 100); r %= 100;
  if (h > 0) parts.push(HUNDREDS[h] || "");
  const ten = Math.floor(r / 10); r %= 10;
  if (ten > 0) parts.push(TENS[ten] || "");
  if (r > 0) parts.push(ONES[r] || "");
  return parts.filter(Boolean).join(" ");
}

export function NumberGame(_data, lessonId) {
  const state = {
    score: 0,
    round: 0,
    correctIndex: 0,
    isTypeA: true,
    options: [],
    number: 0,
    awaiting: false,   // true while showing red/green feedback before next round
    selectedIndex: null,
    showResult: false,
    feedbackText: "",
    feedbackKind: null, // "correct" | "wrong" | null
  };

  // Mirrors generateWrongNumbers(correct, count).
  function generateWrongNumbers(correct, count) {
    const wrongs = [];
    while (wrongs.length < count) {
      const c = randomInt(1, 9999);
      if (c !== correct && !wrongs.includes(c)) wrongs.push(c);
    }
    return wrongs;
  }

  // Mirrors startRound(): pick number, pick type, shuffle 4 options.
  function startRound() {
    state.awaiting = false;
    state.selectedIndex = null;
    state.feedbackText = "";
    state.feedbackKind = null;
    state.number = randomInt(1, 9999);
    state.isTypeA = state.round % 2 === 0;
    const wrong = generateWrongNumbers(state.number, 3);
    const all = shuffle([state.number, ...wrong]);
    state.correctIndex = all.indexOf(state.number);
    state.options = all;
    render();
  }

  // Mirrors onOptionSelected(): tints, score++, then 1000ms postDelayed.
  function pick(i) {
    if (state.awaiting) return;
    state.awaiting = true;
    state.selectedIndex = i;
    const isCorrect = i === state.correctIndex;
    if (isCorrect) {
      state.score++;
      state.feedbackText = "נכון!";
      state.feedbackKind = "correct";
    } else {
      state.feedbackText = "לא נכון! התשובה הנכונה מודגשת בירוק";
      state.feedbackKind = "wrong";
    }
    render();
    state.round++;
    setTimeout(() => {
      if (state.round >= 10) {
        state.showResult = true;
        render();
      } else {
        startRound();
      }
    }, 1000);
  }

  function restart() {
    state.score = 0;
    state.round = 0;
    state.showResult = false;
    startRound();
  }

  function back() {
    Router.go(`/lesson/${lessonId}`);
  }

  function render() {
    if (state.showResult) {
      mount(renderResult());
      return;
    }
    mount(renderGame());
  }

  function renderGame() {
    return el(
      "div",
      { class: "ng-screen" },
      // Gradient hero header
      el(
        "header",
        { class: "ng-hero" },
        el(
          "div",
          { class: "ng-toolbar" },
          el("button", {
            class: "ng-back",
            onClick: back,
            "aria-label": "חזור",
          }, "→"),
          el("h1", { class: "ng-title" }, "🔢 משחק מספרים"),
        ),
        el(
          "div",
          { class: "ng-score-row" },
          el("div", { class: "ng-score" }, `ניקוד: ${state.score}`),
        ),
      ),
      // Game card
      el(
        "div",
        { class: "ng-card" },
        el("div", { class: "ng-question" },
          state.isTypeA ? "כיצד אומרים את המספר ביפנית?" : "מה המספר?"),
        el(
          "div",
          {
            // Flash plays only when a new round starts (not while awaiting feedback).
            class: "ng-display" + (state.awaiting ? "" : " flash") + (state.isTypeA ? "" : " is-romaji"),
            "data-round": state.round,
          },
          state.isTypeA ? String(state.number) : numberToRomaji(state.number),
        ),
        el(
          "div",
          { class: "ng-options" },
          state.options.map((n, i) => optionButton(n, i)),
        ),
        state.feedbackText
          ? el("div", {
              class: "ng-feedback" + (state.feedbackKind === "correct" ? " is-correct" :
                                      state.feedbackKind === "wrong"   ? " is-wrong"   : ""),
            }, state.feedbackText)
          : null,
      ),
    );
  }

  function optionButton(n, i) {
    const label = state.isTypeA ? numberToRomaji(n) : String(n);
    let cls = "ng-option";
    if (state.awaiting) {
      if (i === state.correctIndex) cls += " is-correct";
      else if (i === state.selectedIndex) cls += " is-wrong";
    }
    return el(
      "button",
      {
        class: cls,
        disabled: state.awaiting,
        onClick: () => pick(i),
      },
      label,
    );
  }

  function renderResult() {
    return el(
      "div",
      { class: "ng-screen" },
      el(
        "header",
        { class: "ng-hero" },
        el(
          "div",
          { class: "ng-toolbar" },
          el("button", { class: "ng-back", onClick: back, "aria-label": "חזור" }, "→"),
          el("h1", { class: "ng-title" }, "🔢 משחק מספרים"),
        ),
        el(
          "div",
          { class: "ng-score-row" },
          el("div", { class: "ng-score" }, `ניקוד: ${state.score}`),
        ),
      ),
      el(
        "div",
        { class: "ng-result" },
        el("div", { class: "ng-result-emoji" }, "🎯"),
        el("div", { class: "ng-result-score" }, `${state.score} / 10`),
        el(
          "div",
          { class: "ng-result-actions" },
          el("button", { class: "ng-btn is-gold", onClick: restart }, "🔄  שחק שוב"),
          el("button", { class: "ng-btn is-outlined", onClick: back }, "חזור לשיעור"),
        ),
      ),
    );
  }

  startRound();
}
