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
- `assets/desk-reference.webp`: owner-provided four-scene illustration, framed with SVG to remove the reference browser chrome and sample footer. Room theme and the window scene are independent layers.
- `assets/favicon.svg`: a plain YK favicon.

Only public project repositories are linked. Research manuscripts are labeled in progress. Blog posts and a CV are not fabricated.

Weather uses Open-Meteo's public current-weather endpoint for Seoul. The clock always uses `Asia/Seoul`. Failed requests display an explicit unavailable state, with no invented temperature. No geolocation, accounts, analytics, or API keys are used. Fonts have local fallbacks.

The new site starts with a new root commit. The prior repository was backed up separately before replacement.

Object navigation uses only a thin hand-drawn circle on hover, keyboard focus, or selection. The illustration is shown without added text, icons, screen effects, or notebook graphics. They support keyboard focus and reduced-motion preferences. Section URLs are bookmarkable (`#research`, `#software`, etc.), including browser back/forward navigation.
