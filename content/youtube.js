(() => {
  const Cleaner = window.__ramenCleaner;
  if (!Cleaner) return;

  const SHORTS_WORDS = [
    "shorts",
    "short",
    "短片",
    "短视频",
    "ショート",
    "쇼츠",
  ];

  function applyCss() {
    Cleaner.injectStyle(
      `
/* Core Shorts components */
ytd-reel-shelf-renderer,
ytd-reel-item-renderer,
ytd-reel-video-renderer,
#shorts-container,
#shorts-inner-container {
  display: none !important;
}

/* Some layouts embed shorts shelf as a rich shelf */
ytd-rich-shelf-renderer[is-shorts],
ytd-rich-section-renderer[is-shorts] {
  display: none !important;
}
`,
      "ramen-youtube-hide-shorts-css"
    );
  }

  function hideShortsNav() {
    // Left nav entries to /shorts
    const links = Array.from(
      document.querySelectorAll(
        "a[href^='/shorts'], a[href*='youtube.com/shorts']"
      )
    );

    for (const a of links) {
      const entry = Cleaner.closestAny(a, [
        "ytd-guide-entry-renderer",
        "ytd-mini-guide-entry-renderer",
        "tp-yt-paper-item",
        "yt-chip-cloud-chip-renderer",
      ]);
      if (entry) Cleaner.hide(entry);
    }
  }

  function hideShortsShelvesByTitle() {
    // Find shelves whose visible title includes Shorts.
    const shelves = Array.from(document.querySelectorAll("ytd-rich-shelf-renderer"));
    for (const s of shelves) {
      const titleEl = s.querySelector("#title, yt-formatted-string#title");
      const title = Cleaner.text(titleEl);
      if (Cleaner.includesAny(title, SHORTS_WORDS)) {
        Cleaner.hide(s);
      }
    }

    // Also hide some older / alternative shelf renderers.
    const altShelves = Array.from(
      document.querySelectorAll("ytd-shelf-renderer, ytd-item-section-renderer")
    );
    for (const s of altShelves) {
      const h = s.querySelector("#title, h2, yt-formatted-string");
      const t = Cleaner.text(h);
      if (Cleaner.includesAny(t, SHORTS_WORDS)) {
        // If it contains reel items, definitely hide.
        if (s.querySelector("ytd-reel-item-renderer, ytd-reel-shelf-renderer")) {
          Cleaner.hide(s);
          continue;
        }
        // Otherwise only hide if title is clearly a Shorts shelf.
        if (t && Cleaner.includesAny(t, ["shorts", "短片", "短视频"])) Cleaner.hide(s);
      }
    }
  }

  const run = Cleaner.debounce(() => {
    applyCss();
    hideShortsNav();
    hideShortsShelvesByTitle();
  }, 250);

  // initial + dynamic
  run();
  Cleaner.observe(run);
})();
