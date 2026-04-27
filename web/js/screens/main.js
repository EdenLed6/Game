import { el, mount } from "../dom.js";
import { Router } from "../router.js";
import { Progress } from "../store.js";

export function Main(data) {
  const total = Progress.getTotalLessons();
  const completed = Progress.getCompletedCount();
  const completedIds = new Set(Progress.getCompletedIds());
  const percent = Math.floor((completed * 100) / total);

  const view = el("div", { class: "page" },
    el("section", { class: "hero" },
      el("h1", { class: "hero-title" }, "🥋 NihongoBeginner"),
      el("p", { class: "hero-subtitle" }, "יפנית למתחילים · Japanese for Hebrew speakers"),
      el("div", { class: "progress-card" },
        el("div", { class: "row" },
          el("div", { class: "progress-percent" }, `${percent}%`),
          el("span", { class: "progress-label" }, "יפנית")
        ),
        el("div", { class: "progress-bar" },
          el("div", { class: "progress-bar-fill", style: { width: percent + "%" } })
        ),
        el("div", { class: "progress-text" }, `הושלמו ${completed} מתוך ${total} שיעורים`)
      ),
      el("button", {
        class: "btn btn-gold btn-block",
        onClick: () => Router.go("/challenge"),
      }, "🥋  התחל אתגר נינג'ה")
    ),
    completed > 0
      ? el("div", { class: "banner" },
          completed === total
            ? "כל השיעורים הושלמו. すごい!"
            : `המשיכי כך: עוד ${total - completed} שיעורים לסיום`
        )
      : null,
    el("h2", { class: "lessons-title" }, "📚  השיעורים שלי"),
    el("div", { class: "lesson-list" },
      data.lessons.map(lesson => lessonCard(lesson, completedIds.has(lesson.id)))
    )
  );

  mount(view);
}

function lessonCard(lesson, isComplete) {
  return el("button", {
    class: "lesson-card",
    onClick: () => Router.go(`/lesson/${lesson.id}`),
  },
    el("div", { class: "emoji" }, lesson.emoji || "🇯🇵"),
    el("div", { class: "meta" },
      el("div", { class: "number" }, lesson.number),
      el("div", { class: "title" }, lesson.title),
      el("div", { class: "subtitle" }, lesson.subtitle)
    ),
    isComplete ? el("span", { class: "badge-done" }, "✓") : null
  );
}
