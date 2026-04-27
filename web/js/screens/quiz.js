import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Progress } from "../store.js";

export function Quiz(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson || !lesson.exercises.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }

  const state = {
    questions: lesson.exercises,
    index: 0,
    score: 0,
    selected: null,
    submitted: false,
  };

  function render() {
    const total = state.questions.length;
    const isResults = state.index >= total;
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "חידון"),
      ),
      el("main", { class: "container", style: { paddingTop: "14px" } },
        isResults ? renderResults() : renderQuestion()
      )
    );
    mount(view);
  }

  function renderQuestion() {
    const total = state.questions.length;
    const q = state.questions[state.index];
    const optionButtons = q.options.map((opt, i) => {
      let cls = "quiz-option";
      if (state.submitted) {
        if (i === q.correctIndex) cls += " correct";
        else if (i === state.selected) cls += " wrong";
      } else if (state.selected === i) {
        cls += " selected";
      }
      return el("button", {
        class: cls,
        disabled: state.submitted,
        onClick: () => {
          if (state.submitted) return;
          state.selected = i;
          render();
        },
      }, `${i + 1}. ${opt}`);
    });

    return el("div", { class: "stack-loose" },
      el("div", { class: "quiz-progress" }, `שאלה ${state.index + 1} מתוך ${total}`),
      el("div", { class: "progress-bar dark" },
        el("div", { class: "progress-bar-fill", style: { width: ((state.index / total) * 100) + "%" } })
      ),
      el("div", { class: "row" },
        el("div", { class: "quiz-question grow" }, q.question),
        el("button", { class: "speak-btn", onClick: () => Speaker.speak(q.question) }, "🔊")
      ),
      el("div", { class: "quiz-options" }, optionButtons),
      state.submitted
        ? el("div", { class: "stack" },
            el("div", { class: "feedback-card" },
              q.explanation || (state.selected === q.correctIndex ? "נכון!" : "סקור את הסיכום ונסה את הבא.")
            ),
            el("button", { class: "btn btn-primary btn-block", onClick: next }, state.index + 1 < total ? "השאלה הבאה →" : "סיים")
          )
        : el("button", {
            class: "btn btn-primary btn-block",
            disabled: state.selected == null,
            onClick: submit,
          }, "בדוק תשובה")
    );
  }

  function submit() {
    if (state.selected == null) return;
    state.submitted = true;
    if (state.selected === state.questions[state.index].correctIndex) state.score++;
    render();
  }

  function next() {
    state.index++;
    state.selected = null;
    state.submitted = false;
    render();
  }

  function renderResults() {
    const total = state.questions.length;
    const percent = Math.floor((state.score * 100) / total);
    const passed = percent >= 70;
    if (passed) Progress.markLessonCompleted(lessonId);
    return el("div", { class: "results stack" },
      el("div", { class: "emoji" }, passed ? "🎉" : "📚"),
      el("div", { class: "final-score" }, `${state.score} / ${total}`),
      el("div", { class: "summary" }, `דיוק: ${percent}% · נדרש 70% כדי להשלים את השיעור`),
      el("div", { class: passed ? "feedback-card" : "feedback-card", style: { background: passed ? "var(--correct-green-light)" : undefined, borderColor: passed ? "var(--green-stroke)" : undefined } },
        passed ? "כל הכבוד! עברת את השיעור! השיעור סומן כהושלם." : "נסה שוב כדי לעבור את השיעור (70% נדרש)"
      ),
      el("div", { class: "row" },
        el("button", { class: "btn btn-outline grow", onClick: () => {
          state.index = 0; state.score = 0; state.selected = null; state.submitted = false;
          render();
        } }, "🔄 שחק שוב"),
        el("button", { class: "btn btn-primary grow", onClick: () => Router.go(`/lesson/${lessonId}`) }, "חזרה לשיעור")
      )
    );
  }

  render();
}
