// Matching screen — pixel-1:1 port of activity_matching.xml + item_match_word.xml
// + MatchingGameActivity.kt + adapter/MatchAdapter.kt.
//
// Vertical LinearLayout:
//   1) Gradient hero
//        - MaterialToolbar (back arrow + title)
//        - Score+instructions row (gold score badge weight=1, white instructions
//          weight=2, with marginEnd=10dp between).
//   2) Two RecyclerView columns (LinearLayout horizontal, padding=16dp,
//      gap≈12dp). Each item is item_match_word.xml — a MaterialCardView with
//      a centered TextView (15sp bold). Card-state cycles NORMAL → SELECTED →
//      MATCHED / WRONG (mirrors MatchAdapter.State).
//   3) Complete overlay (gravity=center, padding=32dp): 72sp 🎉 emoji,
//      22sp bold result, 16sp muted time line, App.Button.Gold "🔄 שחק שוב",
//      App.Button.Outlined "חזור לשיעור".
//
// Behaviour notes (preserves Kotlin):
//   - vocabItems = lesson.vocabulary.shuffled().take(8)   (computed once per session)
//   - On startGame() we reshuffle leftWords and rightWords independently and
//     reset score/matched/state.
//   - On wrong match both tiles flash WRONG for 500ms, then snap back to NORMAL.

import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";

export function Matching(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.vocabulary || lesson.vocabulary.length < 4) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  // Sample up to 8 random vocabulary pairs; this list is fixed for the session
  // (matches `vocabItems = lesson.vocabulary.shuffled().take(8)`).
  const pool = shuffle(lesson.vocabulary).slice(0, 8);

  const state = {
    pool,
    left: [],            // array of { word, status }   — japanese
    right: [],           // array of { word, status }   — hebrew
    selectedLeft: null,
    selectedRight: null,
    score: 0,
    matched: 0,
    isProcessing: false,
    finished: false,
  };

  // Match Adapter states: "normal" | "selected" | "matched" | "wrong".
  function startGame() {
    const shuffledItems = shuffle(state.pool);
    state.left = shuffledItems.map(v => ({ word: v.japanese, status: "normal" }));
    state.right = shuffle(shuffledItems).map(v => ({ word: v.hebrew, status: "normal" }));
    state.selectedLeft = null;
    state.selectedRight = null;
    state.score = 0;
    state.matched = 0;
    state.isProcessing = false;
    state.finished = false;
    render();
  }

  // ----- Render -----------------------------------------------------------

  function render() {
    const view = el(
      "div",
      { class: "match-screen" },
      hero(),
      state.finished ? renderComplete() : renderGrid()
    );
    mount(view);
  }

  function hero() {
    return el(
      "header",
      { class: "match-hero" },
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
        el("h1", { class: "toolbar-title" }, "התאמה")
      ),
      el(
        "div",
        { class: "match-hero-row" },
        el(
          "div",
          { class: "match-score-badge" },
          `ניקוד: ${state.score}`
        ),
        el(
          "div",
          { class: "match-instructions" },
          "התאם את המילים היפניות לתרגומן"
        )
      )
    );
  }

  function renderGrid() {
    return el(
      "main",
      { class: "match-grid" },
      el(
        "div",
        { class: "match-col match-col-left" },
        state.left.map((item, i) => tile(item, () => onLeft(i)))
      ),
      el(
        "div",
        { class: "match-col match-col-right" },
        state.right.map((item, i) => tile(item, () => onRight(i)))
      )
    );
  }

  function tile(item, onClick) {
    let cls = "match-tile";
    if (item.status === "selected") cls += " is-selected";
    else if (item.status === "matched") cls += " is-matched";
    else if (item.status === "wrong") cls += " is-wrong";
    return el(
      "button",
      {
        class: cls,
        type: "button",
        disabled: item.status === "matched",
        onClick,
      },
      item.word
    );
  }

  function renderComplete() {
    return el(
      "section",
      { class: "match-complete" },
      el("p", { class: "complete-emoji" }, "🎉"),
      el(
        "p",
        { class: "complete-result" },
        `כל הזוגות הותאמו! ניקוד: ${state.score}`
      ),
      // tvMatchTime is set to "" by MatchingGameActivity.showComplete(). Render
      // an empty placeholder so the spacing below the result line still matches.
      el("p", { class: "complete-time" }, ""),
      el(
        "button",
        {
          class: "btn-again",
          type: "button",
          onClick: () => startGame(),
        },
        "🔄  שחק שוב"
      ),
      el(
        "button",
        {
          class: "btn-back",
          type: "button",
          onClick: () => Router.go(`/lesson/${lessonId}`),
        },
        "חזור לשיעור"
      )
    );
  }

  // ----- Behaviour --------------------------------------------------------

  function onLeft(i) {
    if (state.isProcessing) return;
    if (state.left[i].status === "matched") return;
    // If a different left tile was previously selected, reset it to normal.
    if (state.selectedLeft != null && state.selectedLeft !== i) {
      state.left[state.selectedLeft].status = "normal";
    }
    state.selectedLeft = i;
    state.left[i].status = "selected";
    render();
    tryMatch();
  }

  function onRight(i) {
    if (state.isProcessing) return;
    if (state.right[i].status === "matched") return;
    if (state.selectedRight != null && state.selectedRight !== i) {
      state.right[state.selectedRight].status = "normal";
    }
    state.selectedRight = i;
    state.right[i].status = "selected";
    render();
    tryMatch();
  }

  function tryMatch() {
    if (state.selectedLeft == null || state.selectedRight == null) return;
    state.isProcessing = true;

    const li = state.selectedLeft;
    const ri = state.selectedRight;
    const ja = state.left[li].word;
    const he = state.right[ri].word;
    const isMatch = state.pool.some(v => v.japanese === ja && v.hebrew === he);

    if (isMatch) {
      state.left[li].status = "matched";
      state.right[ri].status = "matched";
      state.score++;
      state.matched++;
      state.selectedLeft = null;
      state.selectedRight = null;
      state.isProcessing = false;
      if (state.matched === state.pool.length) {
        state.finished = true;
      }
      render();
    } else {
      state.left[li].status = "wrong";
      state.right[ri].status = "wrong";
      render();
      // 500ms postDelayed in Kotlin — same here.
      setTimeout(() => {
        // Only reset if the two are still the wrong-pair we set; protects
        // against rapid taps changing the selection.
        if (state.left[li]) state.left[li].status = "normal";
        if (state.right[ri]) state.right[ri].status = "normal";
        state.selectedLeft = null;
        state.selectedRight = null;
        state.isProcessing = false;
        render();
      }, 500);
    }
  }

  startGame();
}
