# Youngkwon Ko portfolio

GitHub Pages portfolio based on the supplied image(3).png. The transparent foreground retains the desk, handwritten labels, window frame and overlapping plants. A separately generated Seoul/Han River illustration sits behind its true alpha window opening. Site theme does not change the foreground illustration. Incoming light follows Seoul time and weather.

Assets: `assets/desk-cutout-v3.webp` (transparent foreground), `assets/seoul-window-v3.webp` (new outdoor illustration). Built-in image generation/editing was used. Foreground prompt: retain the supplied top-left desk panel and its wording, remove outdoor sky/city/river to transparency while preserving foreground leaves and window frame, remove the baked weather widget. Landscape prompt: a calm painterly panorama across Han River toward Seoul, bridge, mountains and N Seoul Tower, soft blue sky and clouds, detailed watercolor/gouache with fine pencil detail, no window, room, foreground plants or text.

The foreground alpha filter removes near-zero residual opacity and restores near-opaque pixels while retaining antialiased leaf edges. Title-aligned underlines provide hover/focus/selection cues. Navigation opens inline sections below the scene. A real Seoul clock/weather widget replaces sample data from the reference.

Run `npm run dev` or `npm test`. No dependencies are required. Published from main / root.

The foreground was further edited to remove baked sunlight, plant cast shadows and yellow rim highlights. All directional light is rendered in SVG: invert the foreground alpha in the source glass area, project this opening and its leaf occlusion onto the desk, then blend coloured light through that mask. Weather suppresses direct light under cloud/rain/snow; the Seoul hour shifts its projection. The manual site theme does not affect these masks.

Version 4 follows the newly supplied desk reference: lamp/research left, notebook navigation centre, laptop/contact right. `assets/desk-wide-v4.webp` is a 1895×830 transparent neutral foreground. CSS fits its entire aspect ratio within available viewport width and height. No crop/stretch is used. The generated Seoul landscape remains separate behind the alpha opening; light projection is remapped to the new aperture.

Version 5 renames the left paper stack to Blog, clears duplicate navigation from the notebook right page, links the profile name to About, and replaces circular selection marks with short text underlines. Research and Experience remain in the main navigation.

Lighting revision: soft radial spill masked to the opaque interior replaces the projected aperture. `lighting.js` interpolates daylight and dusk continuously from Seoul fractional time and API sunrise/sunset, with conservative fallback times. Weather attenuates and cools the spill. Theme changes animate interface paint over 600ms; saved theme restores before animation is enabled. Hover decorations are removed; pointer cursors and keyboard focus outlines remain.

Final two-source lighting: external daylight plus a warm desk lamp. As external light decreases, the room mask darkens while the lamp pool becomes stronger and wider; no illumination depends on the site's manual interface theme. Separate generated panoramas cover dawn, sunset, night, overcast, rain and snow; the existing daytime panorama is retained. Their geometry/style follows the same base image. Seoul's daily API sunrise/sunset control continuous image crossfades and illumination, rather than fixed phase hours. Reduced-motion disables transitions.

Laptop lighting: a cool, bounded screen emitter and alpha-masked spill lift the keyboard, right notebook and Contact card as daylight decreases. A local reduction of the room shade keeps the screen legible without brightening the whole room. It follows daylight rather than the interface theme and fades with the other lighting properties.

Version 6: locally edited the existing transparent desk using built-in image generation. Prompt: preserve all composition, navigation text and neutral lighting; repair pothos leaves/stems and clean glass transparency; fill only the notebook right page with “Working notes”, “Learning representations”, “Building useful tools”, “From ideas to experiments” and a small three-node pen sketch. Asset: `assets/desk-wide-v6.webp` (1895×830). All illumination masks share the same new foreground alpha. Notebook notes are decorative, not duplicate navigation or invented project status.

Theme stability: removed the universal descendant colour transitions that repeatedly retargeted inherited text colours. Typed palette properties now animate only at the root. Backgrounds fade for 600ms; shared foreground colours switch once at 300ms to avoid fading text through the background colour. Existing scene-light transitions and reduced-motion behaviour remain independent.

Laptop glare correction: screen emission now has zero baseline in daylight (including daytime overcast/rain), follows solar darkness, and is capped at 8% for both the screen overlay and local spill. The nighttime room-shade relief stays so the right desk remains legible. Initial CSS power is zero to avoid startup glow.

Live updates: Seoul clock shows seconds and ticks at wall-clock second boundaries, independently from the 30-second lighting updates. Visibility, focus, pageshow/BFCache and online events resync immediately. Weather refreshes every five minutes while visible, retries failed requests after one minute, bypasses HTTP cache, refreshes solar data on a Seoul date change, and deduplicates in-flight requests. Seconds are excluded from live announcements.

Clock display uses hours and minutes only; the wall-clock timer and resume synchronization remain active, and unchanged display text is not rewritten.

2026-10-29: removed the laptop screen emitter, spill, shade-relief mask, power calculation and screen-only regression test. Window and desk-lamp lighting remain. About now includes a short bio, undergraduate education, interests, working approach, and Email/GitHub/LinkedIn links; Contact also includes LinkedIn. Sources and the remaining content plan are in ABOUT_CONTENT_PLAN.md.

2026-10-29 CV update: used the user-supplied CV to fill education/leave status, five experience entries, two publication citations, two awards, technical skills and ORCID. Future Navy completion is explicitly expected. Research work in progress stays separate from publications.

2026-10-29: Experience uses a full-width header and five chronological vertical timeline entries, with a separate awards rail on desktop and awards section below on narrow screens. All CV content is retained. Window light is stronger and moved onto the desk; the lamp's warm pool is wider with less shadow at its center, preserving darkness elsewhere. Laptop lighting remains removed.

2026-10-29: laptop screen is on by default again, with a 2.5% daytime emission and 7% nighttime cap. Local spill ranges 1.5–7%; a darkness-dependent shade mask keeps the nighttime screen readable. It uses the existing interpolated external-darkness property, independently from manual theme selection.
