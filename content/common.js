(() => {
  // Shared helpers for content scripts.
  const NS = "__ramenCleaner";
  if (window[NS]) return;

  const Cleaner = {
    debounce(fn, ms = 200) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
      };
    },

    injectStyle(cssText, id) {
      const styleId = id || "ramen-cleaner-style";
      let el = document.getElementById(styleId);
      if (!el) {
        el = document.createElement("style");
        el.id = styleId;
        el.type = "text/css";
        document.documentElement.appendChild(el);
      }
      if (el.textContent !== cssText) el.textContent = cssText;
    },

    hide(el) {
      if (!el || el.nodeType !== 1) return;
      // Use inline style to override site CSS.
      el.style.setProperty("display", "none", "important");
      el.setAttribute("data-ramen-hidden", "1");
    },

    remove(el) {
      try {
        el?.remove?.();
      } catch (_) {
        // ignore
      }
    },

    observe(run) {
      const obs = new MutationObserver(() => run());
      obs.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      return obs;
    },

    text(el) {
      try {
        return (el?.innerText || el?.textContent || "").trim();
      } catch (_) {
        return "";
      }
    },

    includesAny(text, needles) {
      if (!text) return false;
      const t = String(text).toLowerCase();
      return needles.some((n) => t.includes(String(n).toLowerCase()));
    },

    closestAny(el, selectors) {
      for (const sel of selectors) {
        const found = el?.closest?.(sel);
        if (found) return found;
      }
      return null;
    },

    // Hide a "section-like" container for a marker node.
    hideSectionAround(markerEl) {
      if (!markerEl) return;
      const section = Cleaner.closestAny(markerEl, [
        "div[role='article']",
        "div[role='region']",
        "div[data-pagelet]",
        "section",
      ]);
      if (section) {
        Cleaner.hide(section);
        return;
      }
      // fallback: walk up a few levels
      let el = markerEl;
      for (let i = 0; i < 6; i++) {
        if (!el?.parentElement) break;
        el = el.parentElement;
      }
      Cleaner.hide(el);
    },
  };

  window[NS] = Cleaner;
})();
