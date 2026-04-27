import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";

export function SentenceBuilder(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.examples.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  const state = {
    examples: lesson.examples,
    index: 0,
    score: 0,
    chips: [],   // [{word, used}]
    built: [],   // [chip indices in chips order]
    feedback: null,
  };

  loadQuestion();

  function loadQuestion() {
    const ex = state.examples[state.index];
    const words = ex.romaji.trim().split(/\s+/);
    state.chips = shuffle(words).map(w => ({ word: w, used: false }));
    state.built = [];
    state.feedback = null;
    render();
  }

  function render() {
    const ex = state.examples[state.index];
    const allUsed = state.chips.every(c => c.used);
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "✏️ בניית משפטים")
      ),
      el("main", { class: "container", style: { paddingTop: "12px" } },
        el("div", { class: "row between" },
          el("div", {}, `${state.index + 1} / ${state.examples.length}`),
          el("div", { class: "chip gold" }, `ניקוד: ${state.score}`)
        ),
        el("div", { class: "stack-loose", style: { marginTop: "12px" } },
          el("div", { class: "sb-question" }, ex.hebrew),
          el("div", { class: "muted" }, "סדר את המילים כדי לבנות את המשפט"),
          el("div", { class: "sb-built" }, state.built.length ? state.built.map(i => state.chips[i].word).join(" ") : "—"),
          el("div", { class: "sb-chips" },
            state.chips.map((c, i) => el("button", {
              class: "sb-chip" + (c.used ? " used" : ""),
              disabled: c.used || state.feedback != null,
              onClick: () => { c.used = true; state.built.push(i); render(); },
            }, c.word))
          ),
          state.feedback
            ? el("div", { class: "feedback-card", style: { background: state.feedback.correct ? "var(--correct-green-light)" : "var(--wrong-light-red)", borderColor: state.feedback.correct ? "var(--green-stroke)" : "var(--wrong-red)" } },
                state.feedback.text
              )
            : null,
          el("div", { class: "row" },
            state.feedback
              ? el("button", { class: "btn btn-primary grow", onClick: advance }, state.index + 1 < state.examples.length ? "הבא →" : "סיים")
              : el("button", {
                  class: "btn btn-primary grow",
                  disabled: !allUsed,
                  onClick: check,
                }, "בדוק"),
            el("button", { class: "btn btn-outline", onClick: () => loadQuestion() }, "↺ אפס")
          )
        )
      )
    );
    mount(view);
  }

  function check() {
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

  function advance() {
    state.index++;
    if (state.index < state.examples.length) loadQuestion();
    else renderResults();
  }

  function renderResults() {
    const total = state.examples.length;
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "✏️ בניית משפטים")
      ),
      el("main", { class: "container", style: { paddingTop: "16px" } },
        el("div", { class: "results stack" },
          el("div", { class: "emoji" }, state.score >= total * 0.7 ? "🎉" : "📚"),
          el("div", { class: "final-score" }, `${state.score} / ${total}`),
          el("div", { class: "summary" }, "סבב הסתיים!"),
          el("div", { class: "row" },
            el("button", { class: "btn btn-outline grow", onClick: () => { state.index = 0; state.score = 0; loadQuestion(); } }, "🔄 שחק שוב"),
            el("button", { class: "btn btn-primary grow", onClick: () => Router.go(`/lesson/${lessonId}`) }, "חזרה לשיעור")
          )
        )
      )
    );
    mount(view);
  }
}
