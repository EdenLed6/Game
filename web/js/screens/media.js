// media.js — Media tab.
//
// Renders the design's MediaScreen DOM (from screen-profile-media.jsx)
// using vanilla JS via el(). Class names mirror the design's CSS so
// the override stylesheet applies cleanly:
//
//   .kimura-screen.media-screen.screen-enter
//     header.top-band                  ← red gradient header
//       .gold-line
//     .kimura-content
//       .kimura-content__inner
//         .card.media-featured         ← featured banner with hanko + 章 watermark
//         .card.media-card (× N)       ← each: head + content + button
//
// Quirk preserved from the Kotlin source: the two top PDF labels are
// intentionally swapped vs file names. Kept for parity.

import { el, mount } from "../dom.js";

const SCHOOLER_URL      = "https://my.schooler.biz/s/63734/login";
const SPOTIFY_SHOW_URL  = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4";
const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/show/6T5VhT26vZS4HflX3Wtvt4?utm_source=generator&theme=0";

const PDF_BUTTONS = [
  { label: "📖  חומרי לימוד — קורס מתחילים", file: "course_travelers.pdf" },
  { label: "✈️  קורס יפנית למטיילים",        file: "course_main.pdf"      },
  { label: "📋  סיכום — מסכם דקדוק",          file: "exercise_matome.pdf"  },
  { label: "📝  תרגול שייכות (NO)",           file: "exercise_ownership.pdf" },
  { label: "📝  תרגול פעלים הווה/עתיד",       file: "exercise_present_future.pdf" },
  { label: "📝  תרגול פעלים עבר",             file: "exercise_past.pdf"    },
  { label: "📝  תרגול שעות",                  file: "exercise_time.pdf"    },
];

function topBand(title, subtitle) {
  return el("header", { class: "top-band" },
    el("div", { class: "top-band__inner" },
      el("div", { class: "top-band__row" },
        el("div", { class: "top-band__slot" }),
        el("div", { class: "top-band__title-wrap" },
          el("h1", { class: "top-band__title" }, title),
          subtitle ? el("p", { class: "top-band__subtitle" }, subtitle) : null,
        ),
        el("div", { class: "top-band__slot" }),
      ),
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );
}

// Featured banner with a decorative hanko + Japanese watermark — mirrors
// the design's MediaScreen featured card at the top.
function featuredBanner() {
  return el("a", {
    class: "card media-featured",
    href: SCHOOLER_URL,
    target: "_blank",
    rel: "noopener",
  },
    el("span", { class: "media-featured__watermark", "aria-hidden": "true" }, "学"),
    el("div", { class: "hanko media-featured__hanko", "aria-hidden": "true" }, "授"),
    el("div", { class: "media-featured__text" },
      el("div", { class: "media-featured__tag" }, "FEATURED"),
      el("h2", { class: "media-featured__title" }, "אתר הקורס"),
      el("p",  { class: "media-featured__sub" }, "Schooler — חומרי לימוד, תרגולים ועוד"),
    ),
    el("span", { class: "media-featured__arrow", "aria-hidden": "true" }, "←"),
  );
}

function pdfButton({ label, file }) {
  return el("a", {
    class: "btn btn-ghost btn--block media-btn-link",
    href: "assets/pdfs/" + file,
    target: "_blank",
    rel: "noopener",
  }, label);
}

function pdfsCard() {
  return el("section", { class: "card media-card media-card--pdfs" },
    el("div", { class: "media-card__head" },
      el("div", { class: "hanko media-card__hanko", "aria-hidden": "true" }, "本"),
      el("div", { class: "media-card__head-text" },
        el("h2", { class: "media-card__title" }, "חומרי לימוד"),
        el("p",  { class: "media-card__subtitle" }, "קובצי PDF של הקורס"),
      ),
    ),
    el("div", { class: "media-card__pdf-list" },
      ...PDF_BUTTONS.map(pdfButton),
    ),
  );
}

function podcastCard() {
  return el("section", { class: "card media-card media-card--podcast" },
    el("div", { class: "media-card__head" },
      el("div", { class: "hanko media-card__hanko", "aria-hidden": "true" }, "音"),
      el("div", { class: "media-card__head-text" },
        el("h2", { class: "media-card__title" }, "יפן ב-15 דקות"),
        el("p",  { class: "media-card__subtitle" }, "פודקאסט ביפנית לרמת מתחילים"),
      ),
    ),
    el("iframe", {
      class: "media-card__embed",
      src: SPOTIFY_EMBED_URL,
      title: "Spotify embed — יפן ב-15 דקות",
      frameborder: "0",
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
      loading: "lazy",
      allowfullscreen: true,
    }),
    el("a", {
      class: "btn btn-primary btn--block media-btn-link",
      href: SPOTIFY_SHOW_URL,
      target: "_blank",
      rel: "noopener",
    }, "פתח ב-Spotify"),
  );
}

export function Media({ host /*, ctx */ }) {
  ensureStyle();

  const screen = el("div", { class: "kimura-screen media-screen screen-enter" },
    topBand("תכנים נוספים", "קישורים, חומרי לימוד ופודקאסטים"),
    el("div", { class: "kimura-content" },
      el("div", { class: "kimura-content__inner" },
        featuredBanner(),
        pdfsCard(),
        podcastCard(),
      ),
    ),
  );

  mount(host, screen);
}

function ensureStyle() {
  if (document.getElementById("css-media-screen")) return;
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/media.css") return;
  }
  const link = document.createElement("link");
  link.id   = "css-media-screen";
  link.rel  = "stylesheet";
  link.href = "css/screens/media.css";
  document.head.appendChild(link);
}
