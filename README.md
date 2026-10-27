# Youngkwon Ko — A desk of ideas

A static portfolio for **https://k0ykwon.github.io/**. The illustrated desk is based on the owner-provided sketch reference. Its objects reveal sections below the desk and smoothly scroll them into view. The lamp and header switch change the room's light/dark theme independently of Seoul's time and weather.

## Development

Requires Node.js 20 or newer, with no package installation.

```sh
npm run dev
npm test
```

Open http://localhost:3000. Serve the repository root using GitHub Pages from `main` / root. `.nojekyll` makes this a plain static site.

## Content and assets

- `index.html`: desk, navigation, project and research summaries.
- `app.js`: section contents, inline section navigation, theme persistence, Seoul clock and weather.
- `weather.js`: independently tested time and weather handling.
- `styles.css`: responsive layout and the room/window visual states.
- `assets/desk-reference.webp`: original design reference only; the live desk uses its original detailed drawing with aligned lighting masks.
- `assets/favicon.svg`: a plain YK favicon.

Only public project repositories are linked. Research manuscripts are labeled in progress. Blog posts and a CV are not fabricated.

Weather uses Open-Meteo's public current-weather endpoint for Seoul. The clock always uses `Asia/Seoul`. Failed requests display an explicit unavailable state, with no invented temperature. No geolocation, accounts, analytics, or API keys are used. Fonts have local fallbacks.

The new site starts with a new root commit. The prior repository was backed up separately before replacement.

The desk retains the supplied detailed illustration. The sketch has a transparent window mask. Behind it, a separate scene combines a sky gradient, two independently moving cloud layers and the Seoul city/river panorama. The fixed foreground window frame is rendered last, so background scenery cannot cover it. Weather changes window colour, precipitation and interior illumination; sunset adds warm reflected light, and overcast/rain/snow suppress direct window shadows. Manual light/dark mode only affects the interior.

Always-visible handwritten labels receive the hover, keyboard focus and selected-section circle. No object movement or laptop animation is used. Sections still open below the desk and scroll into view.

`assets/desk-frame.svg` is the transparent-window version of the sketch. The page inlines its mask for reliable browser rendering. Cloud motion, rain and snow stay inside the glass and respect reduced-motion preferences.
