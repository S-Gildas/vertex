# Fix lesson YouTube playback

## Goal

Fix the error screen shown after pressing Play on the lesson page. Keep playback inside Vertex and preserve `?start=<seconds>` deep links. Do not redesign the lesson page or alter unrelated course content.

## Guidance and inspected code

- `AGENTS.md`, `web/AGENTS.md`, and the installed Next.js Server/Client Components guide.
- `web/components/lesson-video.tsx`, `web/app/lessons/[slug]/page.tsx`, `web/next.config.ts`, `web/proxy.ts`, the seeded `videos.json`, and seed validation.
- YouTube's official [embed help](https://support.google.com/youtube/answer/171780?hl=en), [IFrame API errors](https://developers.google.com/youtube/iframe_api_reference), [embed parameters](https://developers.google.com/youtube/player_parameters), and [client identity requirements](https://developers.google.com/youtube/terms/required-minimum-functionality).
- The current component loads `youtube-nocookie.com/embed/<id>?rel=0&autoplay=1` after the first click. It already uses `strict-origin-when-cross-origin`. The example seeded video `9602Yzvd7ik` returns public YouTube oEmbed metadata, so its ID and public watch page are valid. The screenshot does not show an IFrame API error code, so the exact playback rejection is not yet proven.

## Decision and implementation

- Use YouTube's standard `www.youtube.com/embed/<validated-id>` player with a `start` parameter, preserving the browser's Referer. Avoid forcing autoplay when mounting the iframe; let the provider's own controls start playback. This removes the automatic request path that currently fails after the app's play button and uses the provider's documented baseline embed.
- Keep a single clear play interaction if browser behavior allows it. If removing autoplay requires a second click, render the native iframe immediately with its own play control rather than retaining a misleading custom play button.
- Do not proxy video, use a custom player, or send learners to YouTube.
- Validate the example against a live lesson route, compare the resulting embed URL with YouTube's documented syntax, and inspect browser/network behavior if available. If the specific video is blocked by its owner, document that separately and replace only affected seed URLs after verifying an embeddable source; do not assume an owner restriction from this generic screenshot.

## Files expected to change

- `web/components/lesson-video.tsx`
- `web/app/globals.css` only if the player wrapper needs a small state/style adjustment
- A narrowly scoped check if needed to verify URL construction and `start` behavior

## Security and reliability

- Keep strict 11-character YouTube ID validation and bounded `start` parsing in the server page.
- Keep a non-suppressing Referrer policy so YouTube can identify the embedding site.
- Do not interpolate arbitrary Sanity URLs into iframe `src`; no private keys reach the client.
- Preserve PostHog capture on an actual learner play action where measurable; avoid claiming playback succeeded from iframe load alone.

## Acceptance criteria

- A seeded lesson's YouTube video plays within the page with native controls and no immediate error screen in the manual browser check.
- `?start=75` starts near 1:15, allowing for YouTube keyframe precision.
- Unknown/invalid video URLs show the existing unavailable state.
- Lesson UI outside the player remains unchanged.

## Checks and exact manual steps

1. Run web typecheck, lint, and production build. Start or use the web dev server and request a seeded lesson route.
2. Open `/lessons/nextjs-app-router-in-depth-file-system-routing` in Chrome; use the player control and confirm sound, pause, seek, and full-screen remain on Vertex.
3. Open the same lesson with `?start=75`; play and confirm it starts near 1:15.
4. Open a second seeded lesson and confirm its video plays too. If the original screenshot came from another lesson, test that lesson as well.
