// media.js — Media tab.
//
// 1:1 port of the design's MediaScreen
// (design_handoff_kimura_redesign/screen-profile-media.jsx).
//
// Content blocks (in order):
//   1. Top band: "תכנים נוספים" + JP subtitle "追加コンテンツ" (big variant)
//   2. Featured card: 140px red-gradient banner with rotated 新 hanko
//      top-leading + 桜 watermark top-trailing + "מומלץ השבוע" tag +
//      Hebrew title; below the banner a 38px play-icon button + meta
//      ("kind · duration") + tag.
//   3. Filter chips row (horizontally scrollable):
//        הכל / וידאו / שמע / מאמרים / מוזיקה
//      Active = red bg + white text; inactive = cream-2 + ink-soft.
//   4. Media list — each item: 54×54 red-gradient rounded-square w/
//      kanji glyph, title + "tag · duration", icon button on the right.
//
// The user's actual media inventory (Schooler URL, 7 PDFs, Spotify
// podcast) is mapped into this structure with kanji glyphs and a
// "kind" tag (article / audio / etc.) so the design templates work.

import { el, mount } from "../dom.js";

const SCHOOLER_URL      = "https://my.schooler.biz/s/63734/login";
const SPOTIFY_SHOW_URL  = "https://open.spotify.com/show/6T5VhT26vZS4HflX3Wtvt4";

// Media catalog — `kind` matches the design's filter buttons. `glyph`
// is the kanji shown in the per-item red square. `href` opens the
// resource (PDFs in a new tab, Spotify in the app/web player, etc.).
const MEDIA = [
  // FEATURED (rendered separately at the top, not in the list)
  { id: "featured", kind: "article", glyph: "学",
    title: "אתר הקורס — Schooler",
    tag:   "מומלץ השבוע",
    sub:   "חומרי לימוד, תרגולים ועוד",
    duration: "אתר",
    href:  SCHOOLER_URL, featured: true },

  // Podcast
  { id: "podcast", kind: "audio", glyph: "音",
    title: "יפן ב-15 דקות",
    tag:   "פודקאסט",
    duration: "סדרה",
    href:  SPOTIFY_SHOW_URL },

  // PDFs — preserve the historical label↔file mismatch from the original
  // Kotlin source (fragment_media.xml: btnOpenPdfMain → course_travelers,
  // btnOpenPdfTravelers → course_main). Kept for parity.
  { id: "pdf-main",       kind: "article", glyph: "本",
    title: "חומרי לימוד — קורס מתחילים", tag: "PDF", duration: "ספר",
    href:  "assets/pdfs/course_travelers.pdf" },
  { id: "pdf-travelers",  kind: "article", glyph: "旅",
    title: "קורס יפנית למטיילים", tag: "PDF", duration: "ספר",
    href:  "assets/pdfs/course_main.pdf" },
  { id: "pdf-matome",     kind: "article", glyph: "纏",
    title: "סיכום — מסכם דקדוק", tag: "PDF", duration: "סיכום",
    href:  "assets/pdfs/exercise_matome.pdf" },
  { id: "pdf-ownership",  kind: "article", glyph: "持",
    title: "תרגול שייכות (NO)", tag: "תרגול", duration: "PDF",
    href:  "assets/pdfs/exercise_ownership.pdf" },
  { id: "pdf-present",    kind: "article", glyph: "今",
    title: "תרגול פעלים — הווה/עתיד", tag: "תרגול", duration: "PDF",
    href:  "assets/pdfs/exercise_present_future.pdf" },
  { id: "pdf-past",       kind: "article", glyph: "昔",
    title: "תרגול פעלים — עבר", tag: "תרגול", duration: "PDF",
    href:  "assets/pdfs/exercise_past.pdf" },
  { id: "pdf-time",       kind: "article", glyph: "時",
    title: "תרגול שעות", tag: "תרגול", duration: "PDF",
    href:  "assets/pdfs/exercise_time.pdf" },
];

// Filter chip definitions — same set as design. The "video" and
// "music" filters are present even though the user's catalog has
// none — so those filter results show an empty-state.
const FILTERS = [
  { id: "all",     label: "הכל",      icon: "✦" },
  { id: "video",   label: "וידאו",    icon: "▶" },
  { id: "audio",   label: "שמע",      icon: "🎧" },
  { id: "article", label: "מאמרים",  icon: "📄" },
  { id: "music",   label: "מוזיקה",  icon: "♪" },
];

// Right-side icon for a media item card, by kind.
function iconForKind(kind) {
  if (kind === "video") return "▶";
  if (kind === "audio") return "🎧";
  if (kind === "music") return "♪";
  return "→"; // articles / default
}

// ────────────────────────────────────────────────────────────
// Top band — same shape as Profile, big variant w/ JP subtitle.
// ────────────────────────────────────────────────────────────
function topBand(title, subtitleJp) {
  return el("header", { class: "top-band top-band--big" },
    el("div", { class: "top-band__inner" },
      el("div", { class: "top-band__row" },
        el("div", { class: "top-band__slot" }),
        el("div", { class: "top-band__title-wrap" },
          el("h1", { class: "top-band__title" }, title),
          el("p",  { class: "top-band__subtitle top-band__subtitle--jp" }, subtitleJp),
        ),
        el("div", { class: "top-band__slot" }),
      ),
    ),
    el("div", { class: "gold-line", "aria-hidden": "true" }),
  );
}

// ────────────────────────────────────────────────────────────
// Featured card — 140px red gradient banner with hanko + 桜 watermark
// + Hebrew title; below the banner a play button + meta line.
// Clicking opens the linked resource.
// ────────────────────────────────────────────────────────────
function featuredCard(item) {
  return el("a", {
    class: "card lift media-featured",
    href: item.href,
    target: "_blank",
    rel: "noopener",
  },
    el("div", { class: "media-featured__banner" },
      el("div", { class: "hanko media-featured__hanko",
                  "aria-hidden": "true" }, "新"),
      el("div", { class: "media-featured__watermark", "aria-hidden": "true" }, "桜"),
      el("div", { class: "media-featured__text" },
        el("div", { class: "media-featured__tag" }, item.tag || "מומלץ השבוע"),
        el("div", { class: "media-featured__title" }, item.title),
      ),
    ),
    el("div", { class: "media-featured__foot" },
      el("span", { class: "btn-icon media-featured__play",
                   "aria-hidden": "true" }, "▶"),
      el("div", { class: "media-featured__meta" },
        el("div", { class: "media-featured__meta-line" },
          item.duration + (item.sub ? " · " + item.sub : "")),
        el("div", { class: "media-featured__meta-sub" }, "פתחו עכשיו →"),
      ),
    ),
  );
}

// ────────────────────────────────────────────────────────────
// Filter chip — onClick re-renders the list with that kind.
// ────────────────────────────────────────────────────────────
function filterChip(filter, active, onClick) {
  return el("button", {
    type: "button",
    class: "media-chip" + (active ? " media-chip--active" : ""),
    onClick: () => onClick(filter.id),
  },
    el("span", { class: "media-chip__icon", "aria-hidden": "true" }, filter.icon),
    el("span", null, filter.label),
  );
}

// ────────────────────────────────────────────────────────────
// Media list item — kanji square + title + meta + right icon.
// ────────────────────────────────────────────────────────────
function mediaItem(item) {
  return el("a", {
    class: "card lift media-item",
    href: item.href,
    target: "_blank",
    rel: "noopener",
  },
    el("div", { class: "media-item__glyph-box" },
      el("span", { class: "media-item__glyph" }, item.glyph),
    ),
    el("div", { class: "media-item__text" },
      el("div", { class: "media-item__title" }, item.title),
      el("div", { class: "media-item__meta" },
        item.tag + " · " + item.duration),
    ),
    el("span", { class: "btn-icon media-item__play",
                 "aria-hidden": "true" }, iconForKind(item.kind)),
  );
}

// ────────────────────────────────────────────────────────────
// Public entry
// ────────────────────────────────────────────────────────────
export function Media({ host /*, ctx */ }) {
  ensureStyle();

  let activeFilter = "all";

  function listItemsForFilter() {
    return MEDIA.filter(m => !m.featured)
      .filter(m => activeFilter === "all" || m.kind === activeFilter);
  }

  function render() {
    const featured = MEDIA.find(m => m.featured);
    const items = listItemsForFilter();

    const chipsRow = el("div", { class: "media-filters" },
      ...FILTERS.map(f =>
        filterChip(f, activeFilter === f.id, (id) => {
          activeFilter = id;
          render();
        })
      ),
    );

    const listSection = el("div", { class: "media-list" },
      ...(items.length === 0
        ? [el("div", { class: "media-list__empty" }, "אין פריטים בקטגוריה הזאת")]
        : items.map(mediaItem)),
    );

    const screen = el("div", { class: "kimura-screen media-screen screen-enter" },
      topBand("תכנים נוספים", "追加コンテンツ"),
      el("div", { class: "kimura-content" },
        el("div", { class: "kimura-content__inner" },
          featured ? featuredCard(featured) : null,
          chipsRow,
          listSection,
        ),
      ),
    );
    mount(host, screen);
  }

  render();
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
