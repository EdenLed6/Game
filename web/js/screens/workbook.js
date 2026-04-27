import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Workbook } from "../store.js";

const TYPE_LABEL = {
  TYPED_ANSWER: "Typed answer",
  FILL_BLANK: "Fill in the blanks",
  IMAGE_MATCH: "Match text to picture",
  TEXT_MATCH: "Matching",
  SENTENCE_ORDER: "Sentence building",
  DIALOGUE_COMPLETE: "Dialogue completion",
  FREE_WRITING: "Writing practice",
  LISTENING: "Listening",
  PAGE_NOTES: "PDF page practice",
};

function normalize(s) {
  return (s || "").toLowerCase().trim().normalize("NFKC").replace(/\s+/g, " ");
}

export function WorkbookScreen(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  const exercises = data.allWorkbookExercises.filter(e => e.lessonId === lessonId);
  if (!exercises.length) {
    Router.go(`/lesson/${lessonId}`);
    return;
  }
  const state = { index: 0, message: null };

  function render() {
    const ex = exercises[state.index];
    const completed = Workbook.getLessonCompletedCount(lessonId, exercises);
    const total = exercises.length;
    const percent = Math.floor((completed / total) * 100);
    const isComplete = Workbook.isComplete(ex.id);
    const hintRevealed = Workbook.getRevealedHintCount(ex.id);

    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, `Workbook · עמוד ${ex.pageNumber}`),
        isComplete ? el("span", { class: "chip green" }, "✓") : null
      ),
      el("main", { class: "container", style: { paddingTop: "12px" } },
        el("div", { class: "muted", style: { textAlign: "center", marginBottom: "4px" } },
          `Workbook progress: ${completed} of ${total} completed`
        ),
        el("div", { class: "progress-bar dark" },
          el("div", { class: "progress-bar-fill", style: { width: percent + "%" } })
        ),
        el("div", { class: "workbook-page-tabs", style: { marginTop: "12px" } },
          exercises.map((e, i) => el("button", {
            class: "workbook-page-tab" + (i === state.index ? " current" : "") + (Workbook.isComplete(e.id) ? " complete" : ""),
            onClick: () => { state.index = i; state.message = null; render(); },
          }, `p${e.pageNumber}`))
        ),
        el("div", { class: "stack-loose", style: { marginTop: "12px" } },
          headerCard(ex),
          referenceCard(ex),
          answerCard(ex),
          helpCard(ex, hintRevealed),
          state.message ? el("div", { class: "feedback-card", style: state.message.error ? { background: "var(--wrong-light-red)", borderColor: "var(--wrong-red)" } : { background: "var(--correct-green-light)", borderColor: "var(--green-stroke)" } },
            el("strong", {}, state.message.title), el("br"), state.message.text
          ) : null,
          el("div", { class: "row" },
            el("button", { class: "btn btn-outline grow", disabled: state.index === 0, onClick: () => { state.index--; state.message = null; render(); } }, "◀ Back"),
            el("button", { class: "btn btn-outline grow", disabled: state.index >= exercises.length - 1, onClick: () => { state.index++; state.message = null; render(); } }, "Next ▶")
          )
        )
      )
    );
    mount(view);
  }

  function headerCard(ex) {
    return el("div", { class: "card stack-tight" },
      el("div", { class: "muted", style: { fontSize: "13px" } }, "Digital course workbook"),
      el("h2", { style: { margin: "2px 0 4px" } }, ex.title),
      el("span", { class: "label-pill" }, TYPE_LABEL[ex.type] || ex.type),
      el("p", { style: { margin: "8px 0 0" } }, ex.prompt),
      ex.japaneseToSpeak ? el("button", { class: "btn btn-gold btn-sm", style: { marginTop: "8px" }, onClick: () => Speaker.speak(ex.japaneseToSpeak) }, "🔊 Hear Japanese") : null
    );
  }

  function referenceCard(ex) {
    return el("div", { class: "card stack-tight" },
      el("h3", { style: { margin: 0, fontSize: "16px" } }, "Original booklet reference"),
      el("div", { class: "workbook-reference" }, ex.referenceText || "")
    );
  }

  function answerCard(ex) {
    const answer = Workbook.getAnswer(ex.id);
    return el("div", { class: "card stack-tight" },
      el("h3", { style: { margin: 0, fontSize: "16px" } }, "Your answer"),
      ex.options?.length ? el("div", { class: "muted", style: { fontSize: "13px" } }, `Answer bank: ${ex.options.join("  |  ")}`) : null,
      el("textarea", {
        class: "workbook-textarea",
        placeholder: "Type here. Your answer is saved only on this device.",
        maxLength: ex.maxAnswerLength || 1200,
        value: answer,
        oninput: (e) => Workbook.saveAnswer(ex.id, e.target.value, ex.maxAnswerLength),
        rows: ex.type === "FREE_WRITING" || ex.type === "PAGE_NOTES" ? 7 : 4,
      }),
      el("div", { class: "row" },
        el("button", {
          class: "btn btn-primary grow",
          onClick: () => check(ex),
        }, "Check"),
        el("button", {
          class: "btn btn-outline grow",
          onClick: () => {
            Workbook.markComplete(ex.id, true);
            state.message = { title: "Saved", text: "Marked as done. ההתקדמות עודכנה.", error: false };
            render();
          },
        }, "Save done")
      )
    );
  }

  function helpCard(ex, hintRevealed) {
    return el("div", { class: "card stack-tight" },
      el("h3", { style: { margin: 0, fontSize: "16px" } }, "Need help?"),
      el("div", { class: "muted", style: { fontSize: "13px" } }, "Use hints or open the lesson info. התשובה שלך נשמרת אוטומטית."),
      ex.hints && hintRevealed > 0
        ? el("div", { class: "workbook-hints" },
            ex.hints.slice(0, hintRevealed).map((h, i) => el("div", { class: "workbook-hint" }, `Hint ${i + 1}: ${h.text}`))
          )
        : null,
      el("div", { class: "row" },
        ex.hints && hintRevealed < (ex.hints?.length || 0)
          ? el("button", { class: "btn btn-outline btn-sm", onClick: () => { Workbook.revealNextHint(ex.id, ex.hints.length); render(); } }, "💡 Show hint")
          : null,
        el("button", { class: "btn btn-outline btn-sm", onClick: () => showLessonInfo(lesson) }, "📘 Open lesson info")
      )
    );
  }

  function check(ex) {
    Workbook.recordAttempt(ex.id);
    const answer = Workbook.getAnswer(ex.id);
    if (!answer.trim()) {
      state.message = { title: "Write something first", text: "Your draft is private and saved on this device.", error: true };
      render();
      return;
    }
    if (!ex.expectedAnswers || ex.expectedAnswers.length === 0) {
      Workbook.markComplete(ex.id, true);
      state.message = { title: "Saved", text: "This is an open workbook task, so it is saved without strict grading.", error: false };
      render();
      return;
    }
    const norm = normalize(answer);
    const matched = ex.expectedAnswers.some(a => norm.includes(normalize(a)));
    if (matched) {
      Workbook.markComplete(ex.id, true);
      state.message = { title: "Nice work", text: "Your answer includes one of the expected patterns.", error: false };
    } else {
      state.message = { title: "Not yet", text: "Use a hint or reopen the lesson info, then try again.", error: true };
    }
    render();
  }

  function showLessonInfo(lesson) {
    if (!lesson) {
      alert("No lesson reference was found.");
      return;
    }
    const grammar = lesson.grammarPoints.map(g => [g.title, g.pattern || "", g.content].filter(Boolean).join("\n")).join("\n\n");
    const vocab = lesson.vocabulary.map(v => `${v.japanese}  ${v.romaji}  -  ${v.hebrew}`).join("\n");
    const examples = lesson.examples.map(e => `${e.japanese || ""}  ${e.romaji}  -  ${e.hebrew}`).join("\n");
    alert([lesson.title, "", grammar, "", vocab, "", examples].filter(s => s !== undefined).join("\n"));
  }

  render();
}
