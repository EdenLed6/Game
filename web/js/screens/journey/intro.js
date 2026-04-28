// intro.js — Step 1 of LessonJourney.
//
// 1:1 port of LessonJourneyActivity.showIntro() (Kotlin :247–367) and the
// associated buildVideoCard() helper (:369–448).
//
// The journey shell owns the header, progress bar, step title, back arrow
// and the bottom continue button. This step renders only the body content
// into the host element it receives:
//
//   ┌─────────────────────────────────────┐
//   │   [emoji 80sp]                      │
//   │   Lesson title (28sp bold, primary) │
//   │   Lesson subtitle (16sp muted)      │
//   │   ┌─ video card (210dp tall) ────┐  │  ← only if lesson.videoUrl
//   │   │ <iframe src=…?autoplay=0…>   │  │
//   │   │ [56×56 overflow blocker]     │  │
//   │   └──────────────────────────────┘  │
//   │   ┌─ preview .lj-card ───────────┐  │  ← only if vocab.length > 0
//   │   │ "בשיעור זה תלמד:"            │  │
//   │   │ • japanese = hebrew × 3      │  │
//   │   └──────────────────────────────┘  │
//   └─────────────────────────────────────┘
//
// Bottom continue button label: "התחל ✨" (Kotlin :248). Tapping it calls
// journey.advance() which goes to TEACH.

import { el } from "../../dom.js";

// Build the verbatim Vimeo URL with the same query params the Android
// WebView used (LessonJourneyActivity.kt:443). We accept the URL as-is
// and only append the params; if the host already has a query string the
// `?` is replaced with `&` so we never produce an invalid URL.
function buildEmbedUrl(rawUrl) {
  const params = "autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0";
  try {
    // Mirror the Android code which simply appends "?…". The vast majority
    // of lessons use https://player.vimeo.com/video/<id> with no existing
    // query string, but guard against the edge case anyway so a malformed
    // entry can't throw and crash the step.
    if (typeof rawUrl !== "string" || rawUrl.length === 0) return "";
    const sep = rawUrl.includes("?") ? "&" : "?";
    return rawUrl + sep + params;
  } catch (_) {
    return "";
  }
}

export function Intro({ hostEl, lesson, journey }) {
  // Per Kotlin :248 — the bottom continue button reads "התחל ✨" on INTRO.
  // The shell resets the label to "המשך" before calling each step renderer
  // (lesson-journey.js :230), so we have to set it every time we mount.
  if (journey && typeof journey.setContinueLabel === "function") {
    journey.setContinueLabel("התחל ✨");
  }

  // Children we'll append to the step root, in order.
  const children = [];

  // ── Emoji (Kotlin :273–281) ──
  children.push(
    el("div", { class: "lj-intro__emoji", "aria-hidden": "true" }, lesson.emoji || ""),
  );

  // ── Title (Kotlin :283–294) ──
  children.push(
    el("h2", { class: "lj-intro__title" }, lesson.title || ""),
  );

  // ── Subtitle (Kotlin :296–306) ──
  if (lesson.subtitle) {
    children.push(
      el("p", { class: "lj-intro__subtitle" }, lesson.subtitle),
    );
  }

  // ── Video card (Kotlin :308–314 + buildVideoCard :369–448) ──
  // Black background, 16dp radius, full-width, 210dp tall. Only shown when
  // the lesson has a videoUrl. Cleared on dispose so playback stops when
  // the user advances to TEACH.
  const videoUrl = typeof lesson.videoUrl === "string" ? lesson.videoUrl : "";
  if (videoUrl.length > 0) {
    const embedSrc = buildEmbedUrl(videoUrl);
    const iframe = el("iframe", {
      class: "lj-intro__video-iframe",
      src: embedSrc,
      frameborder: "0",
      allow: "autoplay; fullscreen; picture-in-picture",
      allowfullscreen: "",
      title: lesson.title || "video",
      loading: "lazy",
      referrerpolicy: "no-referrer-when-downgrade",
    });

    // Top-right 56×56 transparent overlay that swallows clicks on the
    // corner where Vimeo renders its overflow ("...") menu. The Android
    // app injected JS to hide that button via WebView.evaluateJavascript;
    // browsers block cross-origin script injection so we instead block
    // the click region from the parent frame (the iframe still receives
    // pointer events everywhere else).
    const overlay = el("div", {
      class: "lj-intro__video-overlay",
      "aria-hidden": "true",
    });

    const videoCard = el(
      "div",
      { class: "lj-intro__video" },
      iframe,
      overlay,
    );
    children.push(videoCard);

    // Stop playback before the next step renders. lesson-journey.js calls
    // every registered disposer in flushDisposers() before tearing down
    // the step host, which is exactly when we want to clear the iframe.
    if (journey && typeof journey.onDispose === "function") {
      journey.onDispose(() => {
        try { iframe.src = ""; } catch (_) { /* ignore */ }
      });
    }
  }

  // ── Preview card (Kotlin :316–364) ──
  // "בשיעור זה תלמד:" + first 3 vocab items as "japanese = hebrew" bullets.
  // Hidden entirely when the lesson has no vocabulary.
  const vocab = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [];
  const preview = vocab.slice(0, 3);
  if (preview.length > 0) {
    const list = el(
      "ul",
      { class: "lj-intro__preview-list" },
      ...preview.map((item) =>
        el(
          "li",
          { class: "lj-intro__preview-item" },
          // Japanese stays in its native script (RTL page, but the JP+
          // Hebrew "=" line reads naturally inside the RTL flow). Render
          // the whole row as plain text — no LTR island needed because
          // both halves are short and the "=" is balanced punctuation.
          `${item.japanese || ""} = ${item.hebrew || ""}`,
        ),
      ),
    );

    children.push(
      el(
        "section",
        { class: "lj-card lj-intro__preview" },
        el("h3", { class: "lj-intro__preview-title" }, "בשיעור זה תלמד:"),
        list,
      ),
    );
  }

  // Mount everything as a single .lj-step block.
  hostEl.appendChild(
    el("div", { class: "lj-step lj-step--intro" }, ...children),
  );
}
