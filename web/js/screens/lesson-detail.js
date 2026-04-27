import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Speaker } from "../speaker.js";

export function LessonDetail(data, lessonId) {
  const lesson = data.lessonsById[lessonId];
  if (!lesson) {
    Router.go("/");
    return;
  }

  const view = el("div", { class: "page" },
    el("header", { class: "toolbar" },
      el("button", { class: "btn-back", onClick: () => Router.go("/"), title: "חזור" }, "→"),
      el("h1", {}, lesson.title)
    ),
    el("section", { class: "lesson-header" },
      el("div", { class: "emoji" }, lesson.emoji || ""),
      el("h1", {}, lesson.title),
      el("div", { class: "subtitle" }, `${lesson.number} · ${lesson.subtitle}`)
    ),
    el("main", { class: "container", style: { paddingTop: "16px" } },
      grammarSection(lesson),
      vocabSection(lesson),
      examplesSection(lesson),
      gamesSection(lesson)
    )
  );

  mount(view);
}

function grammarSection(lesson) {
  if (!lesson.grammarPoints?.length) return null;
  return el("section", { class: "section" },
    el("h2", {}, "📖 דקדוק"),
    el("div", { class: "stack" },
      lesson.grammarPoints.map(g => el("div", { class: "card grammar-card" },
        el("div", { class: "title" }, g.title),
        el("div", { class: "content" }, g.content),
        g.pattern ? el("div", { class: "pattern" }, g.pattern) : null
      ))
    )
  );
}

function vocabSection(lesson) {
  if (!lesson.vocabulary?.length) return null;
  return el("section", { class: "section" },
    el("h2", {}, "📝 אוצר מילים"),
    el("div", { class: "stack-tight" },
      lesson.vocabulary.map(v => el("div", { class: "vocab-row" },
        el("div", { class: "emoji" }, v.emoji || "🔤"),
        el("div", { class: "meta" },
          el("div", { class: "japanese" }, v.japanese),
          el("div", { class: "romaji" }, v.romaji),
          el("div", { class: "hebrew" }, v.hebrew)
        ),
        el("button", { class: "speak-btn", title: "השמע", onClick: () => Speaker.speak(v.japanese) }, "🔊")
      ))
    )
  );
}

function examplesSection(lesson) {
  if (!lesson.examples?.length) return null;
  return el("section", { class: "section" },
    el("h2", {}, "💡 דוגמאות"),
    el("div", { class: "stack-tight" },
      lesson.examples.map(ex => el("div", { class: "example-row" },
        el("div", { class: "row" },
          el("div", { class: "romaji grow" }, ex.romaji),
          el("button", { class: "speak-btn", title: "השמע", onClick: () => Speaker.speak(ex.japanese || ex.romaji) }, "🔊")
        ),
        ex.japanese ? el("div", { class: "japanese" }, ex.japanese) : null,
        el("div", { class: "hebrew" }, ex.hebrew)
      ))
    )
  );
}

function gamesSection(lesson) {
  const buttons = [];
  buttons.push(gameButton("📓 חוברת תרגול", true, () => Router.go(`/workbook/${lesson.id}`)));
  buttons.push(gameButton("📝 חידון", true, () => Router.go(`/quiz/${lesson.id}`)));
  buttons.push(gameButton("🎴 כרטיסיות", lesson.vocabulary.length > 0, () => Router.go(`/flashcards/${lesson.id}`)));
  buttons.push(gameButton("🔗 התאמה", lesson.vocabulary.length >= 4, () => Router.go(`/matching/${lesson.id}`)));
  if (lesson.id === 8) {
    buttons.push(gameButton("🔢 משחק מספרים", true, () => Router.go(`/numbers/${lesson.id}`)));
  }
  if (lesson.id >= 11 && lesson.id <= 16) {
    buttons.push(gameButton("✏️ בניית משפטים", true, () => Router.go(`/sentences/${lesson.id}`)));
  }
  return el("section", { class: "section" },
    el("h2", {}, "🎮 משחקים"),
    el("div", { class: "games-grid" }, buttons)
  );
}

function gameButton(label, enabled, onClick) {
  return el("button", {
    class: "btn " + (enabled ? "btn-primary" : "btn-outline"),
    disabled: !enabled,
    onClick: enabled ? onClick : null,
  }, label);
}
