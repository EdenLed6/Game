import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";

export function Matching(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || lesson.vocabulary.length < 4) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  // Pick up to 8 random pairs
  const pool = shuffle(lesson.vocabulary).slice(0, 8);

  const state = {
    pool,
    left: shuffle(pool).map(v => ({ word: v.japanese, key: v.japanese, status: "normal" })),
    right: shuffle(pool).map(v => ({ word: v.hebrew, key: v.hebrew, status: "normal" })),
    selectedLeft: null,
    selectedRight: null,
    score: 0,
    matched: 0,
    isProcessing: false,
  };

  function reshuffle() {
    state.left = shuffle(state.pool).map(v => ({ word: v.japanese, key: v.japanese, status: "normal" }));
    state.right = shuffle(state.pool).map(v => ({ word: v.hebrew, key: v.hebrew, status: "normal" }));
    state.selectedLeft = null;
    state.selectedRight = null;
    state.score = 0;
    state.matched = 0;
    state.isProcessing = false;
    render();
  }

  function render() {
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "התאמה")
      ),
      el("main", { class: "container", style: { paddingTop: "14px" } },
        el("div", { class: "row between" },
          el("div", {}, "התאם את המילים היפניות לתרגומן"),
          el("div", { class: "chip gold" }, `ניקוד: ${state.score}`)
        ),
        el("div", { class: "match-grid", style: { marginTop: "12px" } },
          el("div", { class: "match-col" },
            state.left.map((item, i) => tile(item, () => onLeft(i)))
          ),
          el("div", { class: "match-col" },
            state.right.map((item, i) => tile(item, () => onRight(i)))
          )
        ),
        state.matched === state.pool.length
          ? el("div", { class: "stack", style: { marginTop: "16px" } },
              el("div", { class: "feedback-card" }, `כל הזוגות הותאמו! ניקוד: ${state.score}`),
              el("div", { class: "row" },
                el("button", { class: "btn btn-outline grow", onClick: reshuffle }, "🔄 שחק שוב"),
                el("button", { class: "btn btn-primary grow", onClick: () => Router.go(`/lesson/${lessonId}`) }, "חזרה לשיעור")
              )
            )
          : null
      )
    );
    mount(view);
  }

  function tile(item, onClick) {
    return el("button", {
      class: "match-tile " + (item.status === "selected" ? "selected" : item.status === "matched" ? "matched" : item.status === "wrong" ? "wrong" : ""),
      disabled: item.status === "matched" || state.isProcessing,
      onClick,
    }, item.word);
  }

  function onLeft(i) {
    if (state.isProcessing) return;
    if (state.left[i].status === "matched") return;
    if (state.selectedLeft != null && state.selectedLeft !== i) {
      state.left[state.selectedLeft].status = "normal";
    }
    state.selectedLeft = i;
    state.left[i].status = "selected";
    tryMatch();
    render();
  }

  function onRight(i) {
    if (state.isProcessing) return;
    if (state.right[i].status === "matched") return;
    if (state.selectedRight != null && state.selectedRight !== i) {
      state.right[state.selectedRight].status = "normal";
    }
    state.selectedRight = i;
    state.right[i].status = "selected";
    tryMatch();
    render();
  }

  function tryMatch() {
    if (state.selectedLeft == null || state.selectedRight == null) return;
    state.isProcessing = true;
    const li = state.selectedLeft, ri = state.selectedRight;
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
    } else {
      state.left[li].status = "wrong";
      state.right[ri].status = "wrong";
      setTimeout(() => {
        state.left[li].status = "normal";
        state.right[ri].status = "normal";
        state.selectedLeft = null;
        state.selectedRight = null;
        state.isProcessing = false;
        render();
      }, 500);
    }
  }

  render();
}
