# Implementation prompt: Vertex homepage

## Goal

Replace the current `/` design-system showcase with a responsive homepage that closely reproduces `vertex-home.png`. Preserve the existing showcase at `/design-system`. This task covers the visible homepage only; the course catalog, search results, authentication, Sanity data, progress, and analytics are separate features.

## Instructions and sources reviewed

- Read `AGENTS.md` and the user-supplied screenshot at `C:\Users\Lenovo\Downloads\design-20260917T134042Z-1-001\design\vertex-home.png` (1024 × 1536). The screenshot is the visual source of truth.
- Inspected `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `components/vertex-ui.tsx`, `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `README.md`, and `prompts/implement-vertex-design-system.md`.
- Read the installed Next.js 16.3.5 guides for App Router pages, navigation, CSS, and fonts under `node_modules/next/dist/docs/01-app/01-getting-started/`.
- No user-named or clearly needed product skill applies to this visual-only work. Use the existing code-native SVG, self-hosted Inter and Playfair Display fonts, and CSS. No generated bitmap is needed.

## Current state and decisions

- The repo is a single Next.js workspace. `/` currently renders a static design-system page, and there are no course, search, or My Learning routes or backend integrations yet.
- Move that existing page to `/design-system` without changing its content. Put the new homepage at `/`.
- Keep the homepage course data as local display examples matching the reference image until Sanity content and real routes exist. Do not imply that these are live catalog records.
- The visible search field accepts text and has an accessible label. It will not submit to a missing search route. The `Courses` navigation, hero button, and `View all courses` link scroll to the homepage's `All Courses` section. `My Learning`, notification bell, avatar, and course cards remain presentational until their destinations/features are built; do not render misleading dead links.
- Use the existing Vertex logo and icons where they match. Create small code-native SVG/CSS marks for the Docker and TypeScript course artwork as needed. A neutral CSS avatar treatment can stand in for the portrait because no standalone portrait asset is supplied.
- Scope homepage styling under a page root class so the preserved design-system page stays visually unchanged. Keep global tokens and font setup.

## Files expected to change

- `app/page.tsx`: new semantic homepage markup and static course-card data.
- `app/design-system/page.tsx`: preserved design-system page moved from `/`.
- `app/globals.css`: scoped homepage layout, decoration, card, and responsive styles.
- `app/layout.tsx`: homepage metadata.
- `README.md`: route description and local run notes, if needed.
- This prompt records implementation and verification details.

## Visual requirements

- At the reference's 1024 px desktop width, reproduce the centered white page with fine warm border and diagonal side hatching, 98 px header, Vertex mark, `Courses` and `My Learning` navigation, bell, and circular avatar.
- Reproduce the centered hero: outlined `INTELLIGENT LEARNING` eyebrow; two-line Playfair headline; supporting copy; orange `Explore Courses` button; wide bordered search field with search icon, placeholder, and `⌘ K` key hint.
- Reproduce the `All Courses` section with heading, orange `View all courses` link, and three equal cards for Next.js for Production, Docker Essentials, and TypeScript Deep Dive. Match their supplied titles, descriptions, level, duration, and module counts. Include the bottom rule and small metadata icons.
- Reproduce the announcement row with a thin rule on each side, outlined star, and `New courses and lessons added every week.` text. Add the pale coral stepped decoration at the lower edge of the screenshot.
- Match image geometry, type hierarchy, spacing, thin warm borders, restrained shadows, and orange accents. Use the supplied Inter and Playfair Display fonts. Do not add unrelated content or redesign the screenshot.
- At tablet/mobile widths, let the header, hero, search field, and course cards adapt without horizontal page scrolling. Stack cards on narrow phones while keeping the desktop layout accurate.

## Accessibility and security

- Use one page `h1`, semantic navigation/sections/articles, accessible names for any actionable icon controls, and visible keyboard focus.
- Use real anchors only for working in-page navigation. Decorative artwork and icons should be hidden from assistive technology.
- No remote assets, API calls, secrets, writes, injected HTML, or browser-side data integration.

## Acceptance criteria

- `/` closely matches `vertex-home.png` at 1024 px wide and presents all screenshot content in the same order.
- `/design-system` still renders the existing design-system reference.
- The three working course-section links scroll correctly. Search input can be typed into without navigating to a nonexistent route.
- Mobile width around 375 px has no horizontal page overflow, clipped important text, or overlapping controls.
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, and a dev-server smoke check pass, or real failures are reported.

## Checks to run

1. Run `npx tsc --noEmit` from the repo root.
2. Run `npm run lint`.
3. Run `npm run build` because a route, layout metadata, and styles change.
4. Start `npm run dev` and request both `/` and `/design-system`.
5. If a browser preview is available, compare `/` against the reference near 1024 × 1536 and inspect a 375 px viewport.

## Exact manual test steps

1. Run `npm run dev` in `C:\Users\Lenovo\Desktop\vertex` and open `http://localhost:3000/` at 1024 px wide. Compare header, hero, cards, and lower decoration against `vertex-home.png`.
2. Click `Courses`, `Explore Courses`, and `View all courses`; each should scroll to `All Courses`.
3. Type into the search field and tab through the page. Confirm visible focus and no unexpected navigation.
4. Resize to 375 px wide. Check that navigation stays readable, cards stack, and there is no horizontal scroll.
5. Open `http://localhost:3000/design-system` and confirm the previous showcase remains available.
