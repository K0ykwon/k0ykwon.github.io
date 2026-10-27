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
- `assets/desk-reference.webp`: original design reference only; the live desk uses individual inline SVG elements.
- `assets/favicon.svg`: a plain YK favicon.

Only public project repositories are linked. Research manuscripts are labeled in progress. Blog posts and a CV are not fabricated.

Weather uses Open-Meteo's public current-weather endpoint for Seoul. The clock always uses `Asia/Seoul`. Failed requests display an explicit unavailable state, with no invented temperature. No geolocation, accounts, analytics, or API keys are used. Fonts have local fallbacks.

The new site starts with a new root commit. The prior repository was backed up separately before replacement.

Desk objects and the Seoul window are individual SVG geometry, not screenshot crops. Always-visible handwritten labels receive the hover, focus and selection circle. The lamp controls the room theme and its separate warm light pool without changing the sky. Below-desk section navigation and reduced-motion support are retained.

Window light falls across the desk: clear daylight and window shadows, warm sunset, diffuse cool rain/cloud light, bright snow reflection and subdued moonlight. Precipitation suppresses direct sun even at sunset. Manual theme selection never changes the weather or time of day.
