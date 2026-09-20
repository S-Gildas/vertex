# Expand all Sanity courses inline on the homepage

## Goal

Show only the first three published Sanity courses in the homepage `All Courses` section by default. When the user clicks `View all courses`, reveal every course directly in the same section without navigating to another page.

## Skills and documentation read

- `sanity-best-practices/SKILL.md`
- `sanity-best-practices/references/nextjs.md`
- Next.js 16 local documentation for Server and Client Components at `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`

## Existing code inspected

- `web/app/page.tsx`
- `web/app/globals.css`
- `web/tsconfig.json`
- Existing server-only Sanity data access through `getCourses()`

## Decisions and assumptions

- Keep all course fetching and card rendering in the homepage Server Component.
- Add a narrowly scoped Client Component that owns only the expanded/collapsed UI state.
- Pass the server-rendered course cards to the Client Component as `children`; do not import the server-only Sanity data layer into client code.
- Show the first three cards on initial render.
- `View all courses` reveals every fetched course inline and changes to `Show fewer courses` so the user can collapse the section again.
- Hide the control entirely when Sanity contains three or fewer published courses.
- Preserve the current Sanity ordering, card design, three-column desktop grid, and responsive behavior.
- Do not add a `/courses` route and do not change the Sanity query, schema, or content.

## Expected files to touch

- `web/app/page.tsx`
- `web/app/globals.css`
- `web/components/home-course-collection.tsx` (new)

## Implementation requirements

1. Create a small Client Component with `useState(false)` for the expanded state.
2. Render the existing `All Courses` heading, the toggle control, and the provided server-rendered cards inside that component.
3. Use a semantic `button`, not an anchor with a fake destination.
4. Add `aria-expanded` and `aria-controls` so assistive technology understands the relationship between the control and grid.
5. Initially hide cards from the fourth onward using a state-driven class and CSS.
6. On the first click, reveal all ten currently published courses without a page navigation or another Sanity request.
7. On the second click, collapse back to three cards and restore the `View all courses` label.
8. Keep `page.tsx` as an async Server Component that calls `getCourses()` and renders `CourseCard` instances.
9. Preserve the existing honest empty state when no courses are published.
10. Do not expose the Sanity read token or move the Sanity query into browser code.
11. Match the existing link-like orange styling for the new button, including keyboard focus behavior.
12. Do not modify unrelated authentication, search, analytics, schema, content, or page sections.

## Security considerations

- Sanity remains accessed exclusively through the existing server-only data layer.
- The Client Component receives rendered React children and a numeric course count only.
- No environment variables, credentials, query client, or write capability are added to the browser bundle.

## Acceptance criteria

- Exactly three course cards are visible when the homepage first loads and more than three courses exist.
- Clicking `View all courses` shows every published course inline on the current page.
- The expanded control reads `Show fewer courses` and collapses the list back to three.
- The control is keyboard accessible and exposes the correct expanded state.
- With three or fewer courses, every course is visible and the toggle is absent.
- With zero courses, the existing empty state remains visible.
- No separate course catalog route is created.
- The Sanity fetch remains server-side.
- Typecheck, lint, and production build pass.

## Checks to run

From `web/`:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Run or use the existing `npm run dev` server and load `/`.

## Exact manual test steps

1. Open `/` with the current ten published Sanity courses.
2. Scroll to `All Courses` and confirm only the first three cards are visible.
3. Confirm the control reads `View all courses`.
4. Click the control and confirm all ten cards appear in the same section without navigation.
5. Confirm the control now reads `Show fewer courses`.
6. Click it again and confirm only the first three cards remain visible.
7. Focus the control with the keyboard, activate it with Enter and Space, and verify both states.
8. Check desktop, tablet, and mobile widths for correct wrapping and no horizontal overflow.
9. If testing with three or fewer published courses, confirm there is no toggle.
