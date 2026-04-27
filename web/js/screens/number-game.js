import { el, mount, randomInt, shuffle } from "../dom.js";
import { Router } from "../router.js";

const ONES = { 1: "ichi", 2: "ni", 3: "san", 4: "yon", 5: "go", 6: "roku", 7: "nana", 8: "hachi", 9: "kyuu" };
const TENS = { 1: "juu", 2: "ni-juu", 3: "san-juu", 4: "yon-juu", 5: "go-juu", 6: "roku-juu", 7: "nana-juu", 8: "hachi-juu", 9: "kyuu-juu" };
const HUNDREDS = { 1: "hyaku", 2: "ni-hyaku", 3: "san-byaku", 4: "yon-hyaku", 5: "go-hyaku", 6: "rop-pyaku", 7: "nana-hyaku", 8: "hap-pyaku", 9: "kyuu-hyaku" };
const THOUSANDS = { 1: "sen", 2: "ni-sen", 3: "san-zen", 4: "yon-sen", 5: "go-sen", 6: "roku-sen", 7: "nana-sen", 8: "has-sen", 9: "kyuu-sen" };

// Mirror NumberGameActivity.numberToRomaji exactly.
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

export function NumberGame(data, lessonId) {
  const state = { score: 0, round: 0, correctIndex: 0, isTypeA: true, options: [], number: 0, awaiting: false };

  function generateWrong(correct, count) {
    const wrong = new Set();
    while (wrong.size < count) {
      const c = randomInt(1, 9999);
      if (c !== correct && !wrong.has(c)) wrong.add(c);
    }
    return [...wrong];
  }

  function startRound() {
    state.awaiting = false;
    state.number = randomInt(1, 9999);
    state.isTypeA = state.round % 2 === 0;
    const wrong = generateWrong(state.number, 3);
    const all = shuffle([state.number, ...wrong]);
    state.correctIndex = all.indexOf(state.number);
    state.options = all;
    render();
  }

  function pick(i) {
    if (state.awaiting) return;
    state.awaiting = true;
    const isCorrect = i === state.correctIndex;
    if (isCorrect) state.score++;
    render(i, isCorrect);
    state.round++;
    setTimeout(() => {
      if (state.round >= 10) {
        renderResults();
      } else {
        startRound();
      }
    }, 1000);
  }

  function render(selectedIndex = null, isCorrect = null) {
    const display = state.isTypeA
      ? el("div", { class: "num-display" }, el("div", { class: "digits" }, String(state.number)))
      : el("div", { class: "num-display" }, el("div", { class: "romaji" }, numberToRomaji(state.number)));
    const buttons = state.options.map((n, i) => {
      let cls = "quiz-option";
      if (state.awaiting) {
        if (i === state.correctIndex) cls += " correct";
        else if (i === selectedIndex) cls += " wrong";
      }
      const label = state.isTypeA ? numberToRomaji(n) : String(n);
      return el("button", { class: cls, disabled: state.awaiting, onClick: () => pick(i) }, label);
    });
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "🔢 משחק מספרים")
      ),
      el("main", { class: "container", style: { paddingTop: "12px" } },
        el("div", { class: "row between" },
          el("div", {}, `סיבוב ${state.round + 1} / 10`),
          el("div", { class: "chip gold" }, `ניקוד: ${state.score}`)
        ),
        el("div", { class: "stack-loose", style: { marginTop: "12px" } },
          el("div", { class: "quiz-question" }, state.isTypeA ? "כיצד אומרים את המספר ביפנית?" : "מה המספר?"),
          display,
          el("div", { class: "quiz-options" }, buttons),
          state.awaiting ? el("div", { class: "feedback-card" }, isCorrect ? "נכון!" : "לא נכון. התשובה הנכונה מודגשת בירוק.") : null
        )
      )
    );
    mount(view);
  }

  function renderResults() {
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go(`/lesson/${lessonId}`) }, "→"),
        el("h1", {}, "🔢 משחק מספרים")
      ),
      el("main", { class: "container", style: { paddingTop: "16px" } },
        el("div", { class: "results stack" },
          el("div", { class: "emoji" }, state.score >= 7 ? "🎉" : "🔢"),
          el("div", { class: "final-score" }, `${state.score} / 10`),
          el("div", { class: "summary" }, "כל הכבוד על הסבב!"),
          el("div", { class: "row" },
            el("button", { class: "btn btn-outline grow", onClick: () => { state.score = 0; state.round = 0; startRound(); } }, "🔄 שחק שוב"),
            el("button", { class: "btn btn-primary grow", onClick: () => Router.go(`/lesson/${lessonId}`) }, "חזרה לשיעור")
          )
        )
      )
    );
    mount(view);
  }

  startRound();
}
