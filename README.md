# Youngkwon Ko portfolio

GitHub Pages portfolio based on the supplied image(3).png. The transparent foreground retains the desk, handwritten labels, window frame and overlapping plants. A separately generated Seoul/Han River illustration sits behind its true alpha window opening. Site theme does not change the foreground illustration. Incoming light follows Seoul time and weather.

Assets: `assets/desk-cutout-v3.webp` (transparent foreground), `assets/seoul-window-v3.webp` (new outdoor illustration). Built-in image generation/editing was used. Foreground prompt: retain the supplied top-left desk panel and its wording, remove outdoor sky/city/river to transparency while preserving foreground leaves and window frame, remove the baked weather widget. Landscape prompt: a calm painterly panorama across Han River toward Seoul, bridge, mountains and N Seoul Tower, soft blue sky and clouds, detailed watercolor/gouache with fine pencil detail, no window, room, foreground plants or text.

The foreground alpha filter removes near-zero residual opacity and restores near-opaque pixels while retaining antialiased leaf edges. Title-aligned underlines provide hover/focus/selection cues. Navigation opens inline sections below the scene. A real Seoul clock/weather widget replaces sample data from the reference.

Run `npm run dev` or `npm test`. No dependencies are required. Published from main / root.

The foreground was further edited to remove baked sunlight, plant cast shadows and yellow rim highlights. All directional light is rendered in SVG: invert the foreground alpha in the source glass area, project this opening and its leaf occlusion onto the desk, then blend coloured light through that mask. Weather suppresses direct light under cloud/rain/snow; the Seoul hour shifts its projection. The manual site theme does not affect these masks.

Version 4 follows the newly supplied desk reference: lamp/research left, notebook navigation centre, laptop/contact right. `assets/desk-wide-v4.webp` is a 1895×830 transparent neutral foreground. CSS fits its entire aspect ratio within available viewport width and height. No crop/stretch is used. The generated Seoul landscape remains separate behind the alpha opening; light projection is remapped to the new aperture.

Version 5 renames the left paper stack to Blog, clears duplicate navigation from the notebook right page, links the profile name to About, and replaces circular selection marks with short text underlines. Research and Experience remain in the main navigation.

Lighting revision: soft radial spill masked to the opaque interior replaces the projected aperture. `lighting.js` interpolates daylight and dusk continuously from Seoul fractional time and API sunrise/sunset, with conservative fallback times. Weather attenuates and cools the spill. Theme changes animate interface paint over 600ms; saved theme restores before animation is enabled. Hover decorations are removed; pointer cursors and keyboard focus outlines remain.
