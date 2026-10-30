# Giscus setup

The integration is implemented, but Discussions is enabled, but Giscus repository access is awaiting GitHub reauthentication. Comments remain in a pending state until setup is complete.

1. In `K0ykwon/k0ykwon.github.io` → Settings → General → Features, enable Discussions.
2. Install https://github.com/apps/giscus for **only** this repository.
3. Open https://giscus.app, enter `K0ykwon/k0ykwon.github.io`, and select an Announcements category.
4. Copy its exact `data-category` and `data-category-id` into `comments-config.js` (`category` and `categoryId`).
5. Deploy the config change. No secrets are required.

Each article uses strict `specific` mapping with the immutable term `blog/<slug>`. Do not use `pathname`: all articles share `/` and differ in the hash. The term is independent of interface language, page title, and cache query parameters. Language and theme are passed to Giscus, and theme changes update the iframe via its documented postMessage API.

Verify two distinct articles show separate discussions, theme/language changes, and GitHub sign-in before announcing comments are live. Posting a test comment requires explicit user authorization.
