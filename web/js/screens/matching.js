// matching.js — 1:1 port of activity_matching.xml + MatchingGameActivity.kt
// + item_match_word.xml + MatchAdapter.kt.
//
// Layout (top → bottom):
//   1) Header (bg_header.png) holding
//        - Toolbar (back arrow + "התאמת מילים")
//        - Score row: gold bg_score_badge "ניקוד: N" (weight 1) +
//          instructions text "התאם את המילים היפניות לתרגומן" (weight 2,
//          12sp white @ 0.85)
//   2) Two-column matching area (LinearLayout horizontal, padding=16dp)
//        - Left column (RecyclerView): Japanese words
//        - Right column (RecyclerView): Hebrew translations
//        - Each card (item_match_word.xml): MaterialCardView, surface,
//          16dp radius, 1.5dp optionStroke, padding=14dp, 15sp bold center.
//          State NORMAL → SELECTED (yellow) → MATCHED (green, locked) /
//          WRONG (red, 500ms then revert).
//   3) Complete overlay (visibility=gone until all matched):
//        - 🎉 emoji 72sp, "כל הזוגות הותאמו! ניקוד: N" 22sp bold,
//          App.Button.Gold "🔄 שחק שוב" + App.Button "חזור לשיעור"

import { el, mount } from "../dom.js";

const WRONG_FLASH_MS = 500;

function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Matching({ host, ctx, params }) {
  const { lessons, router } = ctx;
  const lessonId = Number(params.id);
  const lesson = (lessons || []).find(l => Number(l.id) === lessonId);

  if (!lesson || !Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 4) {
    router.go(`#/lesson/${lessonId}`);
    return;
  }

  // Pick up to 8 unique vocab pairs — matches Kotlin shuffled().take(8)
  const sourcePairs = shuffle(lesson.vocabulary).slice(0, 8);

  const state = {
    pairs: sourcePairs,
    leftWords: [],            // [{word, key}]   — Japanese
    rightWords: [],           // [{word, key}]   — Hebrew
    leftStates: [],           // "normal" | "selected" | "matched" | "wrong"
    rightStates: [],
    selectedLeft: null,
    selectedRight: null,
    score: 0,
    matchedCount: 0,
    isProcessing: false,
    finished: false,
  };

  function startGame() {
    state.selectedLeft = null;
    state.selectedRight = null;
    state.score = 0;
    state.matchedCount = 0;
    state.isProcessing = false;
    state.finished = false;

    const leftOrder  = shuffle(state.pairs);
    const rightOrder = shuffle(state.pairs);
    state.leftWords  = leftOrder.map(p => ({ word: p.japanese, key: p.japanese }));
    state.rightWords = rightOrder.map(p => ({ word: p.hebrew,   key: p.hebrew }));
    state.leftStates  = state.leftWords.map(() => "normal");
    state.rightStates = state.rightWords.map(() => "normal");
    render();
  }

  // ---- Render --------------------------------------------------------------
  function render() {
    const root = el(
      "div",
      { class: "screen matching-screen" },
      renderHeader(),
      state.finished ? renderComplete() : renderBoard()
    );
    mount(host, root);
  }

  function renderHeader() {
    return el(
      "header",
      { class: "matching-header" },
      el(
        "div",
        { class: "matching-header__top" },
        el(
          "button",
          {
            type: "button",
            class: "matching-header__back",
            "aria-label": "חזור",
            onClick: () => router.back(),
          },
          el("img", { src: "assets/icons/ic_arrow_back.svg", alt: "" })
        ),
        // MatchingGameActivity layout has no app:title — toolbar inherits the
        // application label ("Kimura").
        el("h1", { class: "matching-header__title" }, "Kimura")
      ),
      el(
        "div",
        { class: "matching-header__row" },
        el(
          "div",
          { class: "matching-score bg-score-badge" },
          `ניקוד: ${state.score}`
        ),
        el(
          "div",
          { class: "matching-instructions" },
          "התאם את המילים היפניות לתרגומן"
        )
      )
    );
  }

  function renderBoard() {
    return el(
      "main",
      { class: "matching-body" },
      el(
        "div",
        { class: "matching-column matching-column--left" },
        ...state.leftWords.map((w, i) =>
          renderCard(w.word, state.leftStates[i], () => onLeftClick(i), true)
        )
      ),
      el(
        "div",
        { class: "matching-column matching-column--right" },
        ...state.rightWords.map((w, i) =>
          renderCard(w.word, state.rightStates[i], () => onRightClick(i), false)
        )
      )
    );
  }

  function renderCard(word, cardState, onClick, isJapanese) {
    const cls = [
      "match-card",
      "match-card--" + cardState,
      isJapanese ? "match-card--ja" : null,
    ].filter(Boolean).join(" ");
    const locked = cardState === "matched";
    return el(
      "button",
      {
        type: "button",
        class: cls,
        disabled: locked,
        onClick: locked ? null : onClick,
      },
      el(
        "span",
        { class: "match-card__text", lang: isJapanese ? "ja" : "he" },
        word
      )
    );
  }

  function renderComplete() {
    return el(
      "main",
      { class: "matching-complete" },
      el("p", { class: "matching-complete__emoji" }, "🎉"),
      el(
        "p",
        { class: "matching-complete__title" },
        `כל הזוגות הותאמו! ניקוד: ${state.score}`
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--gold btn--block matching-complete__btn",
          onClick: startGame,
        },
        "🔄  שחק שוב"
      ),
      el(
        "button",
        {
          type: "button",
          class: "btn btn--block matching-complete__btn",
          onClick: () => router.go(`#/lesson/${lessonId}`),
        },
        "חזור לשיעור"
      )
    );
  }

  // ---- Handlers ------------------------------------------------------------
  function onLeftClick(i) {
    if (state.isProcessing) return;
    if (state.leftStates[i] === "matched") return;
    if (state.selectedLeft != null && state.selectedLeft !== i &&
        state.leftStates[state.selectedLeft] !== "matched") {
      state.leftStates[state.selectedLeft] = "normal";
    }
    state.selectedLeft = i;
    state.leftStates[i] = "selected";
    render();
    tryMatch();
  }

  function onRightClick(i) {
    if (state.isProcessing) return;
    if (state.rightStates[i] === "matched") return;
    if (state.selectedRight != null && state.selectedRight !== i &&
        state.rightStates[state.selectedRight] !== "matched") {
      state.rightStates[state.selectedRight] = "normal";
    }
    state.selectedRight = i;
    state.rightStates[i] = "selected";
    render();
    tryMatch();
  }

  function tryMatch() {
    if (state.selectedLeft == null || state.selectedRight == null) return;

    const li = state.selectedLeft;
    const ri = state.selectedRight;
    state.isProcessing = true;

    const leftWord  = state.leftWords[li].key;
    const rightWord = state.rightWords[ri].key;
    const isMatch = state.pairs.some(
      p => p.japanese === leftWord && p.hebrew === rightWord
    );

    if (isMatch) {
      state.leftStates[li] = "matched";
      state.rightStates[ri] = "matched";
      state.score++;
      state.matchedCount++;
      state.selectedLeft = null;
      state.selectedRight = null;
      state.isProcessing = false;
      if (state.matchedCount === state.pairs.length) {
        state.finished = true;
      }
      render();
    } else {
      state.leftStates[li] = "wrong";
      state.rightStates[ri] = "wrong";
      render();
      setTimeout(() => {
        if (state.leftStates[li] === "wrong") state.leftStates[li] = "normal";
        if (state.rightStates[ri] === "wrong") state.rightStates[ri] = "normal";
        state.selectedLeft = null;
        state.selectedRight = null;
        state.isProcessing = false;
        render();
      }, WRONG_FLASH_MS);
    }
  }

  // Kick off
  startGame();
}
