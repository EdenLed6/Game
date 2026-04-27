import { el, mount, shuffle } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";
import { Progress } from "../store.js";

// Mirrors GameChallengeActivity.kt
export function Challenge(data) {
  const deck = buildChallengeDeck(data.lessons);
  const state = {
    questions: shuffle(deck).slice(0, 12),
    index: 0,
    score: 0,
    lives: 3,
    streak: 0,
    highScore: Progress.getChallengeHighScore(),
    selected: null,
    submitted: false,
  };

  function render() {
    if (state.index >= state.questions.length || state.lives <= 0) {
      return renderResult();
    }
    const q = state.questions[state.index];
    const buttons = q.options.map((opt, i) => {
      let cls = "quiz-option";
      if (state.submitted) {
        if (i === q.correctIndex) cls += " correct";
        else if (i === state.selected) cls += " wrong";
      }
      return el("button", {
        class: cls,
        disabled: state.submitted,
        onClick: () => onSelect(i),
      }, `${i + 1}. ${opt}`);
    });

    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go("/") }, "→"),
        el("h1", {}, "🥋 אתגר נינג'ה")
      ),
      el("main", { class: "container", style: { paddingTop: "12px" } },
        el("div", { class: "challenge-stats" },
          el("div", { class: "stat-card" },
            el("div", { class: "label" }, "ניקוד"),
            el("div", { class: "value score" }, String(state.score))
          ),
          el("div", { class: "stat-card" },
            el("div", { class: "label" }, "חיים"),
            el("div", { class: "value hearts" }, "♥".repeat(state.lives) + "♡".repeat(3 - state.lives))
          ),
          el("div", { class: "stat-card" },
            el("div", { class: "label" }, "רצף"),
            el("div", { class: "value streak" }, String(state.streak))
          )
        ),
        el("div", { class: "row between" },
          el("div", { class: "muted" }, `שאלה ${state.index + 1} / ${state.questions.length}`),
          el("div", { class: "chip" }, `שיא: ${state.highScore}`)
        ),
        el("div", { class: "progress-bar dark", style: { marginTop: "6px" } },
          el("div", { class: "progress-bar-fill", style: { width: ((state.index / state.questions.length) * 100) + "%" } })
        ),
        el("div", { class: "stack-loose", style: { marginTop: "12px" } },
          el("div", { class: "row" },
            el("div", { class: "quiz-question grow" }, q.prompt),
            el("button", { class: "speak-btn", onClick: () => Speaker.speak(q.prompt) }, "🔊")
          ),
          el("div", { class: "quiz-options" }, buttons),
          state.submitted
            ? el("div", { class: "feedback-card" },
                state.selected === q.correctIndex ? `נכון! ${q.explanation}` : `לא נכון. ${q.explanation}`
              )
            : null
        )
      )
    );
    mount(view);
  }

  function onSelect(i) {
    if (state.submitted) return;
    state.selected = i;
    state.submitted = true;
    const q = state.questions[state.index];
    if (i === q.correctIndex) {
      state.streak++;
      state.score += 100 + state.streak * 15;
    } else {
      state.lives--;
      state.streak = 0;
    }
    render();
    setTimeout(() => {
      state.index++;
      state.selected = null;
      state.submitted = false;
      render();
    }, 1100);
  }

  function renderResult() {
    const isNewRecord = state.score > state.highScore;
    if (isNewRecord) {
      Progress.saveChallengeHighScore(state.score);
      state.highScore = state.score;
    }
    const view = el("div", { class: "page" },
      el("header", { class: "toolbar" },
        el("button", { class: "btn-back", onClick: () => Router.go("/") }, "→"),
        el("h1", {}, "🥋 אתגר נינג'ה")
      ),
      el("main", { class: "container", style: { paddingTop: "16px" } },
        el("div", { class: "results stack" },
          el("div", { class: "emoji" }, isNewRecord ? "🏆" : (state.lives <= 0 ? "💔" : "🎉")),
          el("div", { class: "final-score" }, String(state.score)),
          el("div", { class: "summary" }, isNewRecord ? "שיא חדש!" : "סיום אתגר"),
          el("div", { class: "feedback-card" },
            state.lives <= 0 ? "נגמרו החיים, אבל כל סיבוב מחזק את הזיכרון." : `השלמת את כל האתגר. השיא שלך: ${state.highScore}`
          ),
          el("div", { class: "row" },
            el("button", { class: "btn btn-outline grow", onClick: () => Challenge(data) }, "🔄 שחק שוב"),
            el("button", { class: "btn btn-primary grow", onClick: () => Router.go("/") }, "חזרה")
          )
        )
      )
    );
    mount(view);
  }

  render();
}

// Mirrors buildChallengeDeck() — quiz questions across all lessons + 2 vocab questions per item.
function buildChallengeDeck(lessons) {
  const quizQuestions = [];
  for (const lesson of lessons) {
    for (const q of lesson.exercises) {
      quizQuestions.push({
        prompt: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || `מתוך ${lesson.title}`,
      });
    }
  }

  const seen = new Set();
  const vocabulary = [];
  for (const lesson of lessons) {
    for (const v of lesson.vocabulary) {
      const key = v.japanese + v.hebrew;
      if (!seen.has(key)) { seen.add(key); vocabulary.push(v); }
    }
  }
  const hebrewPool = [...new Set(vocabulary.map(v => v.hebrew))];
  const japanesePool = [...new Set(vocabulary.map(v => v.japanese))];

  const vocabQuestions = [];
  for (const v of vocabulary) {
    const a = makeQuestion({
      prompt: `מה הפירוש של ${v.japanese} (${v.romaji})?`,
      correct: v.hebrew,
      pool: hebrewPool,
      explanation: `${v.japanese} = ${v.hebrew}`,
    });
    if (a) vocabQuestions.push(a);
    const b = makeQuestion({
      prompt: `איזו מילה יפנית מתאימה ל-${v.hebrew}?`,
      correct: v.japanese,
      pool: japanesePool,
      explanation: `${v.hebrew} = ${v.japanese}`,
    });
    if (b) vocabQuestions.push(b);
  }

  return [...quizQuestions, ...vocabQuestions].filter(q => q.options.length === 4);
}

function makeQuestion({ prompt, correct, pool, explanation }) {
  const wrong = shuffle(pool.filter(x => x !== correct)).slice(0, 3);
  if (wrong.length < 3) return null;
  const options = shuffle([...wrong, correct]);
  return { prompt, options, correctIndex: options.indexOf(correct), explanation };
}
