# Implementation prompt: Vertex course detail page

## Goal

Build only the public course detail page shown in the user-supplied reference. Add a dynamic App Router route at `/courses/[slug]`, render the selected course from the existing private Sanity data layer, and make homepage course cards open their matching course page. Do not build lesson detail pages in this task.

## Instructions and sources reviewed

- Read the root `AGENTS.md` and `web/AGENTS.md`.
- Inspected `web/app/page.tsx`, `web/app/layout.tsx`, `web/app/globals.css`, `web/components/home-course-collection.tsx`, `web/components/vertex-ui.tsx`, `web/sanity/data/index.ts`, `web/sanity/queries/courses.ts`, `web/sanity/queries/lessons.ts`, `web/sanity.types.ts`, `web/next.config.ts`, the workspace package scripts, and the current seed fixture.
- Read the installed Next.js 16.3.5 App Router documentation for layouts/pages, dynamic route segments, `Link`, navigation, and asynchronous route params under `node_modules/next/dist/docs/01-app/`.
- Used `sanity-best-practices` and its Next.js integration reference. Keep fetching server-side through the existing `getCourseBySlug()` helper, preserve the standalone Studio boundary, and use `notFound()` for an unknown course.
- The supplied course-page screenshot is the visual source of truth. Reuse the existing Inter/Playfair fonts, Vertex logo, icon primitives, Clerk header patterns, Sanity images, and established warm/orange design tokens.

## Current state and decisions

- The app currently has only `/`, `/design-system`, and Clerk auth routes. There is no course detail route.
- The existing `COURSE_BY_SLUG_QUERY` already returns the course hero data, learning outcomes, instructor summary, ordered modules, and ordered lesson summaries needed by the page. No schema or Studio change is required.
- Create `/courses/[slug]` as a Server Component. In Next.js 16, await `params`, fetch by slug on the server, and call `notFound()` when no matching published record is returned.
- Homepage cards with a valid slug become full-card `Link`s to `/courses/<slug>`. A card without a slug remains non-navigational rather than generating a broken URL.
- The course page remains public. Do not add middleware protection or expose Sanity credentials to the browser.
- Match the reference as a reusable data-driven page, not a hardcoded Next.js-only mock. Text, image, metrics, outcomes, modules, lessons, and instructor data come from the selected Sanity course.
- The screenshot's “Course Content” rows are interpreted using the actual schema: each ordered module is an accordion row, and expanding it reveals that module's ordered lessons. Lesson titles are display-only in this task and must not link to an unimplemented lesson route.
- Show the first six module rows initially when more exist, with a `Show all N modules` / `Show fewer modules` control. This small disclosure/accordion interaction may live in a narrowly scoped Client Component; all fetching stays in the server page.
- `Continue Learning` scrolls to the course-content section because lesson pages are out of scope. `Bookmark`, progress, notification, and `My Learning` remain presentational as established by the product brief; do not invent persistence or backend behavior.
- Derive duration and counts from returned content. If optional Sanity fields are absent, omit or gracefully simplify that element instead of inventing content.

## Files expected to change

- `web/app/courses/[slug]/page.tsx`: dynamic server-rendered course page, metadata, missing-course handling, and semantic page sections.
- `web/components/course-content.tsx`: minimal client-side module expansion and show-all behavior, if interaction cannot remain native HTML.
- `web/app/page.tsx`: make valid homepage course cards link to their course routes.
- `web/app/globals.css`: page-scoped course-detail styling and responsive rules, plus any small course-card link reset needed.
- `web/components/vertex-ui.tsx`: only if an existing icon primitive must be extended for a reference icon; prefer reuse.
- `web/sanity/queries/courses.ts`, `web/sanity.types.ts`: only if inspection during implementation finds a truly missing projected value; regenerate types rather than hand-editing generated output when the query changes.

## Visual requirements

- Reproduce the reference's centered warm-white page shell, fine warm border, diagonal side hatching, 98 px desktop header, Vertex brand, navigation, bell, and Clerk user area.
- Add the breadcrumb row (`All Courses` then the current title), with `All Courses` returning to the homepage course section.
- Reproduce the two-column hero: large course cover at left; popular badge when applicable, large Playfair title, summary, metadata row, orange `Continue Learning` action, and outlined `Bookmark` treatment at right.
- Reproduce the bordered `What you’ll learn` panel with a responsive two-column grid of outcome cards and orange line icons selected from each outcome's existing icon value.
- Reproduce the `Course Content` section with module count and total duration, fine bordered rows, ordered number markers, title, summary, duration/count context where real data permits it, and chevrons. Expanded modules show their lessons clearly without navigating away.
- Reproduce the bottom progress strip shown in the reference as a presentational surface, including completion copy, progress rail, and continue action. Do not add progress storage in this task.
- Use the selected Sanity cover image through `next/image`; the existing `cdn.sanity.io` image configuration is sufficient. Use a restrained fallback panel if the image is missing.
- Match the screenshot's spacing, typography hierarchy, thin borders, restrained shadows, orange accents, and lower coral decoration. Do not add instructor biography, reviews, recommendations, purchasing UI, or unrelated course sections.
- Preserve desktop accuracy near the reference width. At tablet/mobile widths, stack the hero, collapse outcome cards to one column, keep accordions usable, and prevent horizontal scrolling or clipped controls.

## Functional requirements

- `/courses/<existing-slug>` renders the matching Sanity course and reflects module/lesson ordering from the course document.
- `/courses/<unknown-slug>` returns the Next.js not-found state.
- Every homepage course card with a slug is keyboard- and pointer-activatable and navigates to its detail page.
- Module disclosure controls have correct `aria-expanded`/`aria-controls` relationships and can be used with a keyboard.
- The show-all control appears only when the number of modules exceeds the initial visible limit.
- No lesson link is created until the lesson-detail task is approved separately.

## Accessibility and security

- Use one `h1`, semantic header/nav/main/sections, ordered course content, meaningful image alt text, accessible labels for icon-only UI, visible focus states, and native buttons for disclosure controls.
- Avoid nested interactive elements when making course cards clickable.
- Keep `SANITY_API_READ_TOKEN` and Clerk secret values server-only. Do not introduce client-side Sanity fetching, raw HTML injection, content writes, new secrets, or public dataset assumptions.
- Render only trusted React text values and validated route-derived data through the existing typed query helper.

## Acceptance criteria

- The dynamic course route visually matches the supplied reference and is driven by the corresponding Sanity document.
- Clicking a homepage course card with a slug opens the correct course detail URL.
- Hero, learning outcomes, course-content accordions, show-all behavior, and presentational progress strip work without building a lesson page.
- Unknown slugs use the framework not-found response; absent optional content does not crash the page.
- At approximately 1024 px and 375 px widths, there is no unintended horizontal overflow, overlapping text, or unusable control.
- Typecheck, lint, production build, and a dev-server route smoke test pass, or their exact failures are reported.

## Checks to run

1. Run `npm run typecheck --workspace web`.
2. Run `npm run lint --workspace web`.
3. Run `npm run build --workspace web` because a dynamic route and server-rendered page are added.
4. Start `npm run dev --workspace web` and request `/`, one real `/courses/<slug>` URL, and one nonexistent course URL.
5. Inspect the page near the reference desktop width and at a 375 px mobile viewport.

## Exact manual test steps

1. From `C:\Users\Lenovo\Desktop\vertex`, run `npm run dev --workspace web` and open `http://localhost:3000/`.
2. Click the `Next.js for Production` card. Confirm the URL changes to its `/courses/<slug>` route and the course title, image, summary, outcomes, metadata, modules, and lessons correspond to that Sanity course.
3. Compare the course page at roughly 1024 px wide with the supplied reference: header, breadcrumb, hero, outcomes, course content, progress strip, borders, typography, and spacing.
4. Expand and collapse several module rows with pointer and keyboard. Confirm the correct lessons appear and no lesson navigation occurs.
5. If more than six modules exist, use `Show all N modules`, then `Show fewer modules`, and confirm the displayed set and `aria-expanded` state update.
6. Activate `Continue Learning` and confirm it moves focus/scroll context to Course Content without navigating to a missing page.
7. Open `http://localhost:3000/courses/does-not-exist` and confirm the app returns its not-found state.
8. Resize to 375 px wide and confirm the hero stacks, outcome cards become one column, course rows remain readable, and there is no horizontal scrollbar.
