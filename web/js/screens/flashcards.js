import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";

export function Flashcards(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.vocabulary.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  const state = { index: 0, showFront: true };

  function render() {
    const v = lesson.vocabulary[state.index];
    const card = state.showFront
      ? el("div", { class: "flashcard", onClick: flip },
          el("div", { class: "japanese-big" }, v.japanese),
          el("div", { class: "romaji-big" }, v.romaji),
          el("div", { class: "hint" }, "הקש להפיכה")
        )
      : el("div", { class: "flashcard", onClick: flip },
          el("div", { class: "emoji-big" }, v.emoji || "🔤"),
          el("div", { class: "hebrew-big" }, v.hebrew),
          el("div", { class: "japanese-big", style: { fontSize: "26px", marginTop: "8px" } }, v.japanese),
          el("div", { class: "romaji-big", style: { fontSize: "16px" } }, v.romaji)
        );

    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "כרטיסיות")
      ),
      el("main", { class: "container", style: { paddingTop: "16px" } },
        el("div", { class: "stack-loose" },
          card,
          el("div", { class: "fc-controls" },
            el("button", { class: "btn btn-outline", disabled: state.index === 0, onClick: prev }, "◀ הקודם"),
            el("div", { class: "fc-counter" }, `${state.index + 1} / ${lesson.vocabulary.length}`),
            el("button", { class: "btn btn-outline", disabled: state.index >= lesson.vocabulary.length - 1, onClick: next }, "הבא ▶")
          ),
          el("div", { class: "row", style: { justifyContent: "center", marginTop: "8px" } },
            el("button", { class: "speak-btn", onClick: () => Speaker.speak(v.japanese) }, "🔊"),
            el("button", { class: "btn btn-primary btn-sm", onClick: flip }, "הפוך כרטיסייה")
          )
        )
      )
    );
    mount(view);
  }

  function flip() { state.showFront = !state.showFront; render(); }
  function prev() { if (state.index > 0) { state.index--; state.showFront = true; render(); } }
  function next() { if (state.index < lesson.vocabulary.length - 1) { state.index++; state.showFront = true; render(); } }

  render();
}
