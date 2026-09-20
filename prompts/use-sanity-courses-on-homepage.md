# Use published Sanity courses on the homepage

## Goal

Replace the three hard-coded course cards in the homepage `All Courses` section with the real, published course documents stored in Sanity Studio. Preserve the supplied desktop design and the existing responsive behavior.

## Skills and documentation read

- `sanity-best-practices/SKILL.md`
- `sanity-best-practices/references/nextjs.md`
- `sanity-best-practices/references/groq.md`
- Next.js 16 local documentation for App Router data fetching and images under `node_modules/next/dist/docs/01-app/01-getting-started/`

## Existing code inspected

- `web/app/page.tsx`
- `web/app/globals.css`
- `web/components/vertex-ui.tsx`
- `web/sanity/data/index.ts`
- `web/sanity/queries/courses.ts`
- `web/sanity/lib/client.ts`
- `web/sanity/lib/image.ts`
- `web/sanity/env.ts`
- `web/sanity.types.ts`
- `web/next.config.ts`
- `web/.env.example`
- `studio/src/schemaTypes/documents/course.ts`
- `studio/src/schemaTypes/objects/courseModule.ts`
- `studio/src/schemaTypes/documents/lesson.ts`
- `studio/scripts/seed/seed.ndjson`

## Findings

- `web/app/page.tsx` currently defines three fictional course objects and custom Next.js, Docker, and TypeScript artwork.
- The server-only `getCourses()` helper already reads published course documents from the private Sanity dataset using `ALL_COURSES_QUERY`.
- The existing course projection already provides every field needed by the cards: `_id`, title, slug, summary, cover image, level, module count, lesson count, and summed lesson duration.
- The homepage is already a Server Component, so it can await `getCourses()` without exposing the Sanity read token to the browser.
- Course cover images are remote Sanity CDN assets and need to be rendered with the image configuration supported by the installed Next.js version.

## Decisions and assumptions

- Interpret “cette page” as the homepage section shown in the supplied reference image: `web/app/page.tsx`, section `#courses`.
- Render every published Sanity course returned by `getCourses()`, ordered by the existing GROQ query (`title asc`). Do not add an arbitrary three-course limit.
- Keep the current card layout and responsive grid; additional courses wrap onto following rows.
- Use each course's Sanity `coverImage` and its authored `alt` text. Do not retain or generate fictional framework logos.
- Format `level` for display (`beginner` to `Beginner`, etc.), total lesson duration from seconds as hours/minutes, and module count with correct singular/plural.
- Do not invent fallback course content. If Sanity returns no published courses, show a concise empty state in the section.
- Keep the existing one-hour Sanity revalidation behavior; this task does not add draft preview or live editing.
- Do not create catalog or course-detail routes as part of this focused change. Existing navigation behavior remains unchanged.

## Expected files to touch

- `web/app/page.tsx`
- `web/app/globals.css`
- `web/next.config.ts` only if required by the installed Next.js image component for `cdn.sanity.io`

## Implementation requirements

1. Remove the hard-coded `courses` array and the fictional `CourseArtwork` branches.
2. Import and call the existing server-only `getCourses()` helper from the async homepage Server Component.
3. Type course card props from the existing generated/query-backed `CourseCard` type rather than declaring a disconnected duplicate model.
4. Render course title, summary, normalized level, formatted total duration, module count, and Sanity cover image from the query result.
5. Use `_id` as the React list key.
6. Keep the data fetch server-side and keep `SANITY_API_READ_TOKEN` out of all client code and rendered props.
7. Preserve the supplied visual design: card dimensions, typography, borders, spacing, metadata row, three-column desktop grid, and responsive wrapping.
8. Add only the minimal CSS necessary for real cover images and for long real titles/summaries not to overflow the card.
9. Render an honest empty state if there are no published courses; never fall back to the current fictional cards.
10. Do not change the Sanity schema, seed data, authentication, search, or unrelated page sections.

## Security considerations

- Fetch through `web/sanity/data/index.ts`, which is guarded by `server-only`.
- Never expose or rename `SANITY_API_READ_TOKEN`.
- Keep the Sanity dataset read in the published perspective.
- Project only the fields required by the existing query and do not send full lesson documents to the browser.

## Acceptance criteria

- The homepage `All Courses` cards are derived exclusively from published Sanity `course` documents.
- Editing a published course's title, summary, level, cover image, modules, or lesson durations in Studio is reflected after the configured revalidation period.
- No `Next.js for Production`, `Docker Essentials`, or `TypeScript Deep Dive` hard-coded object remains in the homepage implementation.
- Each card shows its real Sanity cover image, title, summary, level, total lesson duration, and module count.
- More than three courses render correctly by wrapping in the existing responsive grid.
- Zero courses produces an empty state and no fabricated content.
- The Sanity read token remains server-only.
- Type check, lint, and production build pass.

## Checks to run

From `web/`:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Start `npm run dev` and confirm the homepage responds successfully.

## Exact manual test steps

1. Open Sanity Studio and note the title, summary, cover image, level, modules, and lesson durations of at least one published course.
2. Start the web app and open `/`.
3. Scroll to `All Courses` and confirm the course appears with those exact authored values.
4. Confirm no fictional hard-coded course appears unless a course with that exact content genuinely exists in Sanity.
5. Publish a small change to a course title or summary in Studio.
6. After the configured revalidation window, reload `/` and confirm the change appears.
7. Check a desktop viewport: three cards per row with the reference spacing and styling.
8. Check tablet and mobile viewports: the cards wrap without horizontal overflow and metadata remains readable.
9. If testing an empty dataset, confirm the section shows the empty state rather than sample cards.
