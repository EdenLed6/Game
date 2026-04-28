// video.js — full-screen video player.
//
// Ports VideoPlayerActivity.kt:
//   • Receives a lesson id via the route params (#/lesson/:id/video)
//   • Loads the lesson's videoUrl in a Vimeo player iframe with the same query
//     string the Android WebView uses
//     (autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0)
//   • Provides a back chip + the lesson title centered in a slim toolbar
//   • Iframe fills the rest of the viewport
//
// Sources of truth:
//   .ui-source/app/src/main/java/.../VideoPlayerActivity.kt

import { el, mount } from "../dom.js";

function ensureStylesheet() {
  const HREF = "css/screens/video.css";
  for (const link of document.head.querySelectorAll('link[rel="stylesheet"]')) {
    if (link.getAttribute("href") === HREF) return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = HREF;
  document.head.appendChild(link);
}

function backArrowSVG() {
  return el("span", {
    class: "video-icon-back",
    "aria-hidden": "true",
    html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M20,11H7.83l5.59-5.59L12,4l-8,8 8,8 1.41-1.41L7.83,13H20v-2z"/></svg>',
  });
}

// Build the full Vimeo embed URL — mirrors the WebView call in
// VideoPlayerActivity.onCreate(). Kotlin literal:
//   webView.loadUrl("https://player.vimeo.com/video/$videoId?autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0")
function buildVimeoSrc(rawUrl) {
  if (!rawUrl) return null;
  // The Android code parses videoId = url.substringAfterLast("/").substringBefore("?")
  // — but our JSON URLs already point at https://player.vimeo.com/video/<id>,
  // so we can just append the params directly.
  const base = rawUrl.split("?")[0];
  const params = "autoplay=0&title=0&byline=0&portrait=0&share=0&pip=0&vimeo_logo=0";
  return `${base}?${params}`;
}

export function Video({ host, ctx, params }) {
  ensureStylesheet();

  const { lessons = [], router } = ctx || {};
  const id = Number(params && params.id);
  const lesson = lessons.find(l => Number(l.id) === id);

  // Title for the toolbar — falls back to a generic label if we can't find
  // the lesson (matches VideoPlayerActivity's empty-string fallback).
  const title = lesson ? lesson.title : "וידאו";
  const videoUrl = lesson && lesson.videoUrl;
  const src = buildVimeoSrc(videoUrl);

  // Toolbar — minimal: back button + title centered
  const toolbar = el(
    "header",
    { class: "video-toolbar" },
    el(
      "button",
      {
        type: "button",
        class: "video-toolbar__back",
        "aria-label": "חזור",
        onClick: () => router && router.back(),
      },
      backArrowSVG(),
    ),
    el("h1", { class: "video-toolbar__title" }, title || ""),
    // Spacer to balance the back button so the title stays centered
    el("span", { class: "video-toolbar__spacer", "aria-hidden": "true" }),
  );

  // Player area
  const player = src
    ? el(
        "iframe",
        {
          class: "video-iframe",
          src,
          title: `וידאו: ${title || ""}`,
          allow: "autoplay; fullscreen; picture-in-picture",
          allowfullscreen: true,
          frameborder: "0",
        },
      )
    : el(
        "div",
        { class: "video-empty" },
        el("p", {}, "אין וידאו זמין לשיעור זה."),
      );

  const screen = el(
    "div",
    { class: "screen video-screen" },
    toolbar,
    el("div", { class: "video-stage" }, player),
  );

  mount(host, screen);
}
