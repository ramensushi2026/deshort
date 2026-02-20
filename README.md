# deshort (deshort.com)

A lightweight browser extension that hides **YouTube Shorts** and **Facebook Reels / short-video modules** from feeds and listings.

- It **does not block direct links**. If you open a Shorts/Reels URL directly, it should still work.
- This is a UI cleaner (DOM/CSS hide) and may need selector updates when YouTube/Facebook change layouts.

## Install (Chrome / Chromium)

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder:

   `/Users/ramen/code/deshort`

5. Refresh YouTube / Facebook

## What it hides

### YouTube
- Shorts shelves / Shorts listing sections
- Most navigation entries that point to `/shorts`

### Facebook
- Reels modules in feed/listing surfaces
- Some navigation entries that point to `/reels` or `/reel/`

## Safari

Safari requires packaging as a **Safari Web Extension** (typically via Xcode). If you want a Safari build, we can convert and provide an installable app bundle.

## Repo

https://github.com/ramensushi2026/deshort
