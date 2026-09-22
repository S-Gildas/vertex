# Implement the seeded lesson page

## Goal

Build `/lessons/[slug]` in the web workspace to match `vertex-lesson.png` at desktop size and adapt cleanly to mobile. Render the seeded Sanity lesson and its parent course, module, neighboring lessons, and on-page video. Link to it from the existing course curriculum.

## Guidance and code inspected

- `AGENTS.md`, `web/AGENTS.md`, and the supplied `vertex-lesson.png`.
- Sanity best practices skill: `SKILL.md`, `references/nextjs.md`, `references/groq.md`, and `references/portable-text.md`.
- Installed Next.js docs: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` and `05-server-and-client-components.md`; route params and search params are promises in this version.
- Existing course page, curriculum/actions, shared icons, global CSS, server-only Sanity client/data helper, lesson/course GROQ, schema, generated types, Clerk shell, and seed fixture.
- The seed has 10 courses, 120 lessons, and YouTube video URLs. Its content differs from the mockup. Use the mockup for visual structure and actual Sanity data for text, counts, and timing.

## Implementation decisions

- Keep the page public. Fetch all content on the server through the existing private Sanity client and token. Return 404 for an unknown lesson. Derive course and ordered neighbors through the course module references.
- Expand the existing lesson GROQ projection to include ordered module lesson summaries, slugs, and durations. Update the server data helper and regenerate Sanity query types through the Studio TypeGen workflow.
- Match the reference's header, left curriculum rail, breadcrumb, lesson heading/stats, 16:9 player, content/notes tabs, key points, pro tip, resource cards, and bottom previous/next controls. Use existing fonts, colors, icon patterns, Clerk controls, and CSS conventions. Stack/collapse the rail sensibly on narrow screens.
- Embed the seeded YouTube video on the page using a validated `youtube.com`/`youtu.be` video ID and `youtube-nocookie.com/embed`. Read an optional `start` query parameter as a bounded nonnegative integer and pass it to the provider's start option. Show a clear unavailable state for invalid or absent video URLs. Do not claim Vimeo/Bunny support in this task, since ingestion for them is not present.
- Render `notes` as Portable Text, with the first introductory paragraph used as a concise description/overview only if present; avoid duplicate paragraphs. Keep the Notes tab presentational as specified in `AGENTS.md`, while lesson content displays the authored notes, key points, pro tip, and resources.
- Use real durations and student counts. Do not display the reference's 35% progress or completion checks as factual because there is no progress store yet. A simple current lesson indicator is sufficient.
- Make curriculum lesson rows and previous/next links real links. Update the existing course curriculum rows to link to lesson slugs. Do not change seed documents or add schemas.
- Capture a `lesson_viewed` browser event when PostHog is configured, using the established project pattern. Keep analytics keys and Sanity token boundaries intact.

## Expected files

- `web/app/lessons/[slug]/page.tsx` (new)
- `web/components/lesson-content.tsx` or similarly scoped client component (new)
- `web/components/lesson-video.tsx` if needed (new)
- `web/components/course-content.tsx`
- `web/sanity/queries/lessons.ts`, `web/sanity/data/index.ts`, `web/sanity.types.ts`
- `web/app/globals.css`
- `web/package.json` and lockfile only if Portable Text rendering needs the explicit `@portabletext/react` dependency

## Security and reliability

- Never send the Sanity read token to the browser. No browser Sanity writes or client-side GROQ.
- Validate provider host/video ID and `start` before constructing the embed URL. Do not embed arbitrary lesson URLs.
- Use `rel="noopener noreferrer"` for external resource links opened in a new tab; only render valid HTTPS links.
- Avoid made-up lesson data, completion state, timestamps, or student counts.

## Acceptance criteria

- Any seeded `/lessons/<slug>` route renders its actual lesson data and parent course; unknown slug returns 404.
- The YouTube player remains on the lesson page and can play; `?start=75` starts at that second.
- Sidebar, breadcrumb, and previous/next links navigate through the seeded course order.
- Authenticated and signed-out users can browse. Desktop resembles the image, and mobile has no horizontal overflow.
- Notes, key points, pro tip, and resource links come from Sanity, with absent optional fields handled cleanly.

## Checks

1. `npm run typegen` from the repository root after changing the query.
2. `npm run typecheck --workspace web` and `npm run lint --workspace web`.
3. `npm run build --workspace web` because route and server modules change.
4. Start `npm run dev --workspace web` and request a seeded lesson URL; inspect server output and page behavior. This task does not change Studio schemas or content, so a Studio deploy/import is unnecessary.

## Exact manual test steps

1. Start the web dev server with the configured `.env.local` and open `/lessons/nextjs-app-router-in-depth-file-system-routing`.
2. Confirm the title, module, duration, notes, key points, pro tip, and resources match the seeded content, then play and pause the embedded YouTube video without leaving Vertex.
3. Open the same URL with `?start=75`; confirm the player begins near 1:15.
4. Use a sidebar lesson link, Previous/Next, and Back to course; confirm the destinations and active row.
5. Open `/courses/nextjs-app-router-in-depth`, expand a module, and click a lesson to reach its page.
6. Resize from the reference desktop width down to 375px and confirm the player, content, navigation, and curriculum remain usable without horizontal scrolling.
7. Open an unknown lesson slug and confirm a 404.
