(() => {
  const Cleaner = window.__ramenCleaner;
  if (!Cleaner) return;

  const REELS_WORDS = [
    "reels",
    "reel",
    "reels and short videos",
    "短片",
    "短视频",
    "精選短片",
  ];

  function applyCss() {
    Cleaner.injectStyle(
      `
/* Hide obvious Reels links in sidebars / nav */
a[href*="/reels"],
a[href*="/reel/"] {
  /* Keep direct links usable if you open a reel page; we only hide listing links. */
}
`,
      "ramen-facebook-css"
    );
  }

  function hideNavReelsEntries() {
    const navLinks = Array.from(
      document.querySelectorAll(
        "a[href*='facebook.com/reels'], a[href^='/reels'], a[href*='/reels/']"
      )
    );
    for (const a of navLinks) {
      const item = Cleaner.closestAny(a, [
        "div[role='listitem']",
        "li",
        "div[data-pagelet]",
      ]);
      if (item) Cleaner.hide(item);
    }
  }

  function hideReelsModulesByText() {
    // Find headings/labels that mention Reels and hide surrounding module.
    const candidates = Array.from(
      document.querySelectorAll(
        "span, div, h2, h3"
      )
    );

    for (const el of candidates) {
      const t = Cleaner.text(el);
      if (!t) continue;
      if (t.length > 60) continue; // avoid big paragraphs
      if (!Cleaner.includesAny(t, REELS_WORDS)) continue;

      // Avoid hiding legit items that just contain the word in comments.
      // Prefer nodes that look like section headers.
      const looksLikeHeader =
        el.closest("header") ||
        el.matches("h2,h3") ||
        el.getAttribute("role") === "heading";

      if (looksLikeHeader) {
        Cleaner.hideSectionAround(el);
      }
    }
  }

  function hideFeedCardsThatAreReels() {
    // Heuristic: if a feed 'article' contains reel links, hide the whole card.
    const reelAnchors = Array.from(
      document.querySelectorAll("a[href*='/reel/'], a[href*='/reels/']")
    );

    for (const a of reelAnchors) {
      // If you're already on a reel page, don't hide the whole page.
      if (location.pathname.startsWith("/reel/") || location.pathname.startsWith("/reels/")) {
        continue;
      }

      const card = Cleaner.closestAny(a, ["div[role='article']"]);
      if (card) {
        Cleaner.hide(card);
        continue;
      }

      // Some reels shelves are not role=article; hide nearby region/pagelet.
      const region = Cleaner.closestAny(a, ["div[role='region']", "div[data-pagelet]"]);
      if (region) Cleaner.hide(region);
    }
  }

  const run = Cleaner.debounce(() => {
    applyCss();
    hideNavReelsEntries();
    hideReelsModulesByText();
    hideFeedCardsThatAreReels();
  }, 350);

  run();
  Cleaner.observe(run);
})();
