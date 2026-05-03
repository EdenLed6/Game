// media.js — Media tab.
//
// 1:1 port of fragment_media.xml + MediaFragment.kt
//   /home/user/Game/.ui-source/app/src/main/res/layout/fragment_media.xml
//   /home/user/Game/.ui-source/app/src/main/java/com/nihongo/beginner/MediaFragment.kt
//
// Quirk preserved from the Kotlin source:
//   btnOpenPdfMain      ("חומרי לימוד — קורס מתחילים")  → opens course_travelers.pdf
//   btnOpenPdfTravelers ("✈️ קורס יפנית למטיילים")     → opens course_main.pdf
// (The labels are SWAPPED relative to the file names. Kept for parity.)

import { el, mount } from "../dom.js";

const SCHOOLER_URL      = "https://my.schooler.biz/s/63734/login";
const SPOTIFY_SHOW_URL  = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4";
const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/show/6T5VhT26vZS4HflX3Wtvt4?utm_source=generator&theme=0";

// (label, pdf-filename) — order matches fragment_media.xml top→bottom.
const PDF_BUTTONS = [
  { label: "📖  חומרי לימוד — קורס מתחילים", file: "course_travelers.pdf" }, // intentional swap
  { label: "✈️  קורס יפנית למטיילים",        file: "course_main.pdf"      }, // intentional swap
  { label: "📋  סיכום — מסכם דקדוק",          file: "exercise_matome.pdf"  },
  { label: "📝  תרגול שייכות (NO)",           file: "exercise_ownership.pdf" },
  { label: "📝  תרגול פעלים הווה/עתיד",       file: "exercise_present_future.pdf" },
  { label: "📝  תרגול פעלים עבר",             file: "exercise_past.pdf"    },
  { label: "📝  תרגול שעות",                  file: "exercise_time.pdf"    },
];

// Anchor styled as a full-width red MaterialButton.
function pdfButton({ label, file }) {
  return el("a", {
    class: "btn btn--block media-btn-link",
    href: `assets/pdfs/${file}`,
    target: "_blank",
    rel: "noopener",
  }, label);
}

function header() {
  // <HeaderLinearLayout android:layout_height="96dp" gravity="center" orientation="vertical">
  return el("div", { class: "header header--vertical bg-gradient-hero" },
    el("h1", { class: "header__screen-title" }, "מדיה"),
    el("p",  { class: "header__subtitle" },     "קישורים, חומרי לימוד ופודקאסטים"),
  );
}

function schoolerCard() {
  // cardSchooler — globe emoji + title + subtitle + red full-width button
  return el("section", { class: "media-card media-card--schooler" },
    el("div", { class: "media-card__head" },
      el("div", { class: "media-card__emoji" }, "🌐"),
      el("div", { class: "media-card__head-text" },
        el("h2", { class: "media-card__title" }, "אתר הקורס"),
        el("p",  { class: "media-card__subtitle" }, "Schooler — חומרי לימוד, תרגולים ועוד"),
      ),
    ),
    el("a", {
      class: "btn btn--block media-btn-link",
      href: SCHOOLER_URL,
      target: "_blank",
      rel: "noopener",
    }, "פתח את אתר הקורס"),
  );
}

function pdfsCard() {
  // cardPdfs — page-icon emoji + title + subtitle + 7 stacked red buttons
  return el("section", { class: "media-card media-card--pdfs" },
    el("div", { class: "media-card__head" },
      el("div", { class: "media-card__emoji" }, "📄"),
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
  // cardPodcast — mic emoji + title + subtitle + Spotify embed iframe + outlined "open in Spotify"
  return el("section", { class: "media-card media-card--podcast" },
    el("div", { class: "media-card__head" },
      el("div", { class: "media-card__emoji" }, "🎙️"),
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
      class: "btn btn--block media-btn-link",
      href: SPOTIFY_SHOW_URL,
      target: "_blank",
      rel: "noopener",
    }, "פתח ב-Spotify"),
  );
}

export function Media({ host /*, ctx */ }) {
  // Inject screen-specific stylesheet exactly once.
  ensureStyle();

  const screen = el("div", { class: "screen media-screen" },
    header(),
    el("div", { class: "media-screen__scroll" },
      el("div", { class: "media-screen__content" },
        schoolerCard(),
        pdfsCard(),
        podcastCard(),
      ),
    ),
  );

  mount(host, screen);
}

function ensureStyle() {
  if (document.getElementById("css-media-screen")) return;
  // Already linked from index.html? Skip.
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.getAttribute("href") === "css/screens/media.css") return;
  }
  const link = document.createElement("link");
  link.id   = "css-media-screen";
  link.rel  = "stylesheet";
  link.href = "css/screens/media.css";
  document.head.appendChild(link);
}
