# Youngkwon Ko — A desk of ideas

A static portfolio for **https://k0ykwon.github.io/**. The illustrated desk is based on the owner-provided sketch reference. Its objects open accessible in-page sections. The lamp and header switch change the room's light/dark theme independently of Seoul's time and weather.

## Development

Requires Node.js 20 or newer, with no package installation.

```sh
npm run dev
npm test
```

Open http://localhost:3000. Serve the repository root using GitHub Pages from `main` / root. `.nojekyll` makes this a plain static site.

## Content and assets

- `index.html`: desk, navigation, project and research summaries.
- `app.js`: section contents, accessible dialog, theme persistence, Seoul clock and weather.
- `weather.js`: independently tested time and weather handling.
- `styles.css`: responsive layout and the room/window visual states.
- `assets/desk-reference.webp`: owner-provided illustration, framed with SVG to remove the reference browser chrome and sample footer.
- `assets/tomato.svg`: portfolio identity and favicon.

Only public project repositories are linked. Research manuscripts are labeled in progress. Blog posts and a CV are not fabricated.

Weather uses Open-Meteo's public current-weather endpoint for Seoul. The clock always uses `Asia/Seoul`. Failed requests display an explicit unavailable state, with no invented temperature. No geolocation, accounts, analytics, or API keys are used. Fonts have local fallbacks.

The new site starts with a new root commit. The prior repository was backed up separately before replacement.
