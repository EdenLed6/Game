// number-game.js — 1:1 port of NumberGameActivity.kt + activity_number_game.xml.
//
// Source of truth:
//   /home/user/Game/.ui-source/app/src/main/res/layout/activity_number_game.xml
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/NumberGameActivity.kt
//
// Game loop (preserved verbatim):
//   - 10 rounds total.
//   - round % 2 == 0 → "כיצד אומרים את המספר ביפנית?" (digit shown, romaji options).
//   - else            → "מה המספר?" (romaji shown, digit options).
//   - Each round picks a random number in 1..9999 + 3 distinct random wrongs.
//   - On select: correct option goes green, wrong (if any) goes red, feedback shows.
//   - 1000ms delay → next round (or result screen on round 10).
//   - Result screen: 🎯 emoji + "score / 10" + "🔄 שחק שוב" + "חזור לשיעור".
//
// numberToRomaji() mirrors the Kotlin `when` blocks exactly.

import { el, mount, clear, nextFrame } from "../dom.js";

const ROUNDS_PER_GAME = 10;
const RESULT_DELAY_MS = 1000;

// ---------- numberToRomaji (mirrors Kotlin) ----------
const ONES_MAP = {
  1: "ichi", 2: "ni", 3: "san", 4: "yon", 5: "go",
  6: "roku", 7: "nana", 8: "hachi", 9: "kyuu",
};
const TENS_MAP = {
  1: "juu", 2: "ni-juu", 3: "san-juu", 4: "yon-juu", 5: "go-juu",
  6: "roku-juu", 7: "nana-juu", 8: "hachi-juu", 9: "kyuu-juu",
};
const HUNDREDS_MAP = {
  1: "hyaku", 2: "ni-hyaku", 3: "san-byaku", 4: "yon-hyaku", 5: "go-hyaku",
  6: "rop-pyaku", 7: "nana-hyaku", 8: "hap-pyaku", 9: "kyuu-hyaku",
};
const THOUSANDS_MAP = {
  1: "sen", 2: "ni-sen", 3: "san-zen", 4: "yon-sen", 5: "go-sen",
  6: "roku-sen", 7: "nana-sen", 8: "has-sen", 9: "kyuu-sen",
};

function numberToRomaji(n) {
  if (n === 0) return "zero";
  const parts = [];
  let remaining = n;

  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousands > 0 && THOUSANDS_MAP[thousands]) parts.push(THOUSANDS_MAP[thousands]);

  const hundreds = Math.floor(remaining / 100);
  remaining %= 100;
  if (hundreds > 0 && HUNDREDS_MAP[hundreds]) parts.push(HUNDREDS_MAP[hundreds]);

  const tens = Math.floor(remaining / 10);
  remaining %= 10;
  if (tens > 0 && TENS_MAP[tens]) parts.push(TENS_MAP[tens]);

  if (remaining > 0 && ONES_MAP[remaining]) parts.push(ONES_MAP[remaining]);

  return parts.join(" ");
}

// ---------- helpers ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWrongNumbers(correct, count) {
  const wrongs = [];
  while (wrongs.length < count) {
    const candidate = randInt(1, 9999);
    if (candidate !== correct && !wrongs.includes(candidate)) {
      wrongs.push(candidate);
    }
  }
  return wrongs;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- screen ----------
export function NumberGame({ host, ctx, params }) {
  ensureStyle();

  const router = ctx.router;
  const lessonId = params && params.id;
  const backTo   = lessonId ? `#/lesson/${lessonId}` : "#/learn";

  // Game state
  const state = {
    score: 0,
    round: 0,
    correctIndex: 0,
    options: [],     // numbers
    isTypeA: true,
    locked: false,
    showResult: false,
    delayHandle: null,
  };

  // Build DOM scaffold once
  const optionButtons = [
    el("button", { class: "ng-option", type: "button", onClick: () => onSelect(0) }),
    el("button", { class: "ng-option", type: "button", onClick: () => onSelect(1) }),
    el("button", { class: "ng-option", type: "button", onClick: () => onSelect(2) }),
    el("button", { class: "ng-option", type: "button", onClick: () => onSelect(3) }),
  ];
  const tvQuestion  = el("p",   { class: "ng-question" });
  const tvDisplay   = el("div", { class: "ng-display dir-ltr" });
  const tvFeedback  = el("p",   { class: "ng-feedback" });
  const cardFeedback = el("div", { class: "ng-feedback-card" }, tvFeedback);
  const tvScore     = el("span", { class: "ng-score-badge bg-score-badge" });

  const gameLayout = el("div", { class: "ng-card" },
    tvQuestion,
    tvDisplay,
    el("div", { class: "ng-options" }, ...optionButtons),
    cardFeedback,
  );

  const tvFinal = el("div", { class: "ng-final-score" });
  const resultLayout = el("div", { class: "ng-result", style: { display: "none" } },
    el("div", { class: "ng-result__emoji" }, "🎯"),
    tvFinal,
    el("button", {
      class: "btn btn--gold btn--block ng-result__btn",
      type: "button",
      onClick: () => restart(),
    }, "🔄  שחק שוב"),
    el("button", {
      class: "btn btn--block ng-result__btn",
      type: "button",
      onClick: () => router.go(backTo),
    }, "חזור לשיעור"),
  );

  const screen = el("div", { class: "screen ng-screen" },
    el("div", { class: "ng-header bg-gradient-hero" },
      el("button", {
        class: "ng-header__back",
        type: "button",
        "aria-label": "חזור",
        onClick: () => router.go(backTo),
      }, el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })),
      el("h1", { class: "ng-header__title" }, "Kimura"),
      el("div", { class: "ng-header__score-row" }, tvScore),
    ),
    el("div", { class: "ng-body" },
      gameLayout,
      resultLayout,
    ),
  );

  function setScore(n) {
    tvScore.textContent = `ניקוד: ${n}`;
  }

  function setOptionState(btn, kind /* default | correct | wrong */) {
    btn.classList.remove("ng-option--correct", "ng-option--wrong");
    if (kind === "correct") btn.classList.add("ng-option--correct");
    else if (kind === "wrong") btn.classList.add("ng-option--wrong");
  }

  function startRound() {
    state.locked = false;
    optionButtons.forEach(b => {
      b.disabled = false;
      setOptionState(b, "default");
    });
    cardFeedback.classList.remove("ng-feedback-card--visible");
    tvFeedback.textContent = "";

    const number = randInt(1, 9999);
    state.isTypeA = (state.round % 2 === 0);

    const wrongs = generateWrongNumbers(number, 3);
    const all = shuffle([number, ...wrongs]);
    state.options = all;
    state.correctIndex = all.indexOf(number);

    if (state.isTypeA) {
      tvQuestion.textContent = "כיצד אומרים את המספר ביפנית?";
      tvDisplay.textContent  = String(number);
      all.forEach((n, i) => { optionButtons[i].textContent = numberToRomaji(n); });
    } else {
      tvQuestion.textContent = "מה המספר?";
      tvDisplay.textContent  = numberToRomaji(number);
      all.forEach((n, i) => { optionButtons[i].textContent = String(n); });
    }
  }

  function onSelect(index) {
    if (state.locked) return;
    state.locked = true;
    optionButtons.forEach(b => { b.disabled = true; });

    const correctIdx = state.correctIndex;
    setOptionState(optionButtons[correctIdx], "correct");

    if (index !== correctIdx) {
      setOptionState(optionButtons[index], "wrong");
      tvFeedback.textContent = "לא נכון! התשובה הנכונה מודגשת בירוק";
    } else {
      state.score++;
      setScore(state.score);
      tvFeedback.textContent = "נכון!";
    }
    cardFeedback.classList.add("ng-feedback-card--visible");

    state.round++;
    if (state.delayHandle) clearTimeout(state.delayHandle);
    if (state.round >= ROUNDS_PER_GAME) {
      state.delayHandle = setTimeout(() => showResult(), RESULT_DELAY_MS);
    } else {
      state.delayHandle = setTimeout(() => startRound(), RESULT_DELAY_MS);
    }
  }

  function showResult() {
    state.showResult = true;
    gameLayout.style.display = "none";
    resultLayout.style.display = "";
    tvFinal.textContent = `${state.score} / ${ROUNDS_PER_GAME}`;
    // Mount-time animation: ng-result__emoji scale_in (.4s)
    resultLayout.classList.remove("ng-result--in");
    void resultLayout.offsetWidth;
    resultLayout.classList.add("ng-result--in");
  }

  function restart() {
    if (state.delayHandle) clearTimeout(state.delayHandle);
    state.score = 0;
    state.round = 0;
    state.showResult = false;
    setScore(0);
    resultLayout.style.display = "none";
    gameLayout.style.display = "";
    startRound();
  }

  // Initial render
  setScore(0);
  mount(host, screen);
  // Start first round on the next frame so layout settles before measuring buttons.
  nextFrame().then(() => startRound());
}

// ---------- stylesheet injection (idempotent) ----------
function ensureStyle() {
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/number-game.css") return;
  }
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "css/screens/number-game.css";
  document.head.appendChild(link);
}
