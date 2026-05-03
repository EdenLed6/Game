// intro.js — Step 1 of the Lesson Journey (port of design's IntroPhase).
//
// 1:1 visual port of design_handoff_kimura_redesign/screen-lesson.jsx
// IntroPhase. The journey shell owns the top band (with title +
// subtitle + back/home + progress); this step renders the body:
//
//   ┌─ .card.intro-card (centered text, padded) ─────────┐
//   │ .hanko (top-leading, rotated -8deg)                │
//   │ "{lesson.number}" (red-deep tag, 11px)             │
//   │ <h1>{lesson.title}</h1>  (Frank Ruhl Libre 30px)   │
//   │ <div>{lesson.subtitle}</div>  (Cormorant italic)   │
//   │ <div class="jp" lesson.glyph>   (red-deep 80px)    │
//   └────────────────────────────────────────────────────┘
//
//   "בשיעור הזה" tag-row + .intro-sections list:
//     ▸ סרטון פתיחה  (1)              (only if videoUrl)
//     ▸ דקדוק        (N)
//     ▸ מילים        (N)
//     ▸ דוגמאות      (N)
//     ▸ תרגול        (N)
//     ▸ מבחן         (N)
//   Each row is a cream-2 card with a small tinted icon-circle.
//
//   The lesson video (if any) is rendered AFTER the sections list as a
//   16/10 black-bg iframe — preserves the existing behavior so users
//   still see the Vimeo embed without a separate "video" phase.
//
//   Bottom continue button label: "התחל שיעור ←"

import { el } from "../../dom.js";

function buildEmbedUrl(rawUrl) {
  const params = "autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0";
  try {
    if (typeof rawUrl !== "string" || rawUrl.length === 0) return "";
    const sep = rawUrl.includes("?") ? "&" : "?";
    return rawUrl + sep + params;
  } catch (_) {
    return "";
  }
}

// Section row inside the "בשיעור הזה" list — small icon circle + label
// + count, on a cream-2 card surface with a 1px cream-3 border.
function sectionRow({ icon, label, count }) {
  return el("div", { class: "intro-sections__row" },
    el("div", { class: "intro-sections__icon", "aria-hidden": "true" }, icon),
    el("div", { class: "intro-sections__label" }, label),
    el("div", { class: "intro-sections__count" }, String(count)),
  );
}

export function Intro({ hostEl, lesson, journey }) {
  // Bottom continue label per the design — "התחל שיעור ←"
  journey.setContinueLabel("התחל שיעור ←");

  const sections = [];
  if (lesson.videoUrl) {
    sections.push({ icon: "▶", label: "סרטון פתיחה", count: 1 });
  }
  if (lesson.grammarPoints && lesson.grammarPoints.length > 0) {
    sections.push({ icon: "📖", label: "דקדוק", count: lesson.grammarPoints.length });
  }
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    sections.push({ icon: "✨", label: "מילים", count: lesson.vocabulary.length });
  }
  if (lesson.examples && lesson.examples.length > 0) {
    sections.push({ icon: "📄", label: "דוגמאות", count: lesson.examples.length });
  }
  if (lesson.practiceCards && lesson.practiceCards.length > 0) {
    sections.push({ icon: "🔄", label: "תרגול", count: lesson.practiceCards.length });
  }
  if (lesson.exercises && lesson.exercises.length > 0) {
    sections.push({ icon: "🏆", label: "מבחן", count: lesson.exercises.length });
  }

  // ── Hanko card ─────────────────────────────────────────────
  const hanko = el(
    "div",
    {
      class: "hanko intro-card__hanko",
      "aria-hidden": "true",
    },
    lesson.glyph || (lesson.emoji || "?"),
  );

  const heroCard = el(
    "div",
    { class: "card intro-card" },
    hanko,
    el("div", { class: "intro-card__number" }, (lesson.number || "").toUpperCase()),
    el("h1", { class: "intro-card__title" }, lesson.title || ""),
    el("div", { class: "intro-card__subtitle" }, lesson.subtitle || ""),
    el(
      "div",
      { class: "intro-card__big-glyph jp", "aria-hidden": "true" },
      lesson.glyph || lesson.emoji || "",
    ),
  );

  // ── Sections list ──────────────────────────────────────────
  const sectionsBlock = el(
    "section",
    { class: "intro-sections" },
    el("div", { class: "intro-sections__heading" }, "בשיעור הזה"),
    el(
      "div",
      { class: "intro-sections__list" },
      ...sections.map(sectionRow),
    ),
  );

  // ── Optional Vimeo video card ─────────────────────────────
  const videoUrl = typeof lesson.videoUrl === "string" ? lesson.videoUrl : "";
  let videoCard = null;
  if (videoUrl.length > 0) {
    const embedSrc = buildEmbedUrl(videoUrl);
    const iframe = el("iframe", {
      class: "intro-video__iframe",
      src: embedSrc,
      frameborder: "0",
      allow: "autoplay; fullscreen; picture-in-picture",
      allowfullscreen: "",
      title: lesson.title || "video",
      loading: "lazy",
      referrerpolicy: "no-referrer-when-downgrade",
    });
    videoCard = el("div", { class: "intro-video" }, iframe);
    // Stop playback before the next step renders.
    if (journey && typeof journey.onDispose === "function") {
      journey.onDispose(() => {
        try { iframe.src = ""; } catch (_) { /* ignore */ }
      });
    }
  }

  // ── Mount ──────────────────────────────────────────────────
  hostEl.appendChild(
    el(
      "div",
      { class: "lj-step lj-step--intro intro-phase" },
      heroCard,
      sectionsBlock,
      videoCard,
    ),
  );
}
