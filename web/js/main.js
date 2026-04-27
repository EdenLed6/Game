import { Router } from "./router.js";
import { Main } from "./screens/main.js";
import { LessonDetail } from "./screens/lesson-detail.js";
import { Quiz } from "./screens/quiz.js";
import { Flashcards } from "./screens/flashcards.js";
import { Matching } from "./screens/matching.js";
import { NumberGame } from "./screens/number-game.js";
import { SentenceBuilder } from "./screens/sentence-builder.js";
import { Challenge } from "./screens/challenge.js";
import { WorkbookScreen } from "./screens/workbook.js";

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function bootstrap() {
  const [lessons, workbook] = await Promise.all([
    loadJSON("data/lessons.json"),
    loadJSON("data/workbook.json"),
  ]);

  const data = {
    lessons,
    lessonsById: Object.fromEntries(lessons.map(l => [l.id, l])),
    workbook,
  };

  // Build the full per-lesson workbook exercise list (interactive + auto PAGE_NOTES)
  // mirroring DigitalCourseWorkbook.getExercisesForLesson()
  data.allWorkbookExercises = buildAllWorkbookExercises(workbook);

  // Routes
  Router
    .add("/", () => Main(data))
    .add("/lesson/:id", ({ id }) => LessonDetail(data, parseInt(id, 10)))
    .add("/quiz/:id", ({ id }) => Quiz(data, parseInt(id, 10)))
    .add("/flashcards/:id", ({ id }) => Flashcards(data, parseInt(id, 10)))
    .add("/matching/:id", ({ id }) => Matching(data, parseInt(id, 10)))
    .add("/numbers/:id", ({ id }) => NumberGame(data, parseInt(id, 10)))
    .add("/sentences/:id", ({ id }) => SentenceBuilder(data, parseInt(id, 10)))
    .add("/challenge", () => Challenge(data))
    .add("/workbook/:id", ({ id }) => WorkbookScreen(data, parseInt(id, 10)));

  Router.start();

  // Service worker (only when served over http(s))
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

// Mirrors:
//   private fun lessonForPage(page) ... (already in workbook.lessonForPage)
//   fun getExercisesForLesson(lessonId): combine interactiveExercises + auto PAGE_NOTES per page
function buildAllWorkbookExercises(workbook) {
  const out = [...workbook.interactiveExercises];
  const pageNumbers = Object.keys(workbook.pageTexts).map(s => parseInt(s, 10)).sort((a, b) => a - b);
  for (const page of pageNumbers) {
    const lessonId = workbook.lessonForPage[String(page)];
    if (!lessonId) continue;
    const id = `digital-p${String(page).padStart(2, "0")}-notes`;
    const text = workbook.pageTexts[String(page)];
    out.push({
      id,
      lessonId,
      pageNumber: page,
      title: `Workbook page ${page}`,
      type: "PAGE_NOTES",
      prompt: "Read this workbook page, then write your notes or answer exactly as you would in the printed booklet.",
      referenceText: text,
      japaneseToSpeak: japaneseSnippet(text),
      hints: [
        { text: "Use the reference text above as the original booklet content for this page." },
        { text: "If this page is an answer page, compare it only after trying the previous exercise." },
      ],
      options: [],
      expectedAnswers: [],
      maxAnswerLength: 1200,
    });
  }
  // Sort by pageNumber then id, mirroring Kotlin compareBy { pageNumber }.thenBy { id }
  out.sort((a, b) => {
    if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  return out;
}

function japaneseSnippet(s) {
  let out = "";
  for (const ch of s || "") {
    const c = ch.codePointAt(0);
    if ((c >= 0x3040 && c <= 0x30FF) || (c >= 0x4E00 && c <= 0x9FAF)) {
      out += ch;
      if (out.length >= 80) break;
    }
  }
  return out;
}

bootstrap().catch(err => {
  console.error("Bootstrap failed:", err);
  document.getElementById("app").textContent = "אירעה שגיאה בטעינה. נסה לרענן.";
});
