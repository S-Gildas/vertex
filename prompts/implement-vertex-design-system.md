# Implementation prompt: Vertex design system

## Goal

Implement the supplied `vertex-designsystem.png` as a responsive, code-native design-system showcase at `/`. Establish reusable visual tokens and small UI primitives so later Vertex pages can follow the same reference. This request covers the design system only; do not build course, search, auth, Sanity, or analytics functionality.

## Reference and inspected code

- Source of truth: `C:\Users\Lenovo\Downloads\design-20260917T134042Z-1-001\design\vertex-designsystem.png`.
- Read `AGENTS.md`, `package.json`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `tsconfig.json`, and the Next 16 local guides for App Router pages, CSS, and fonts in `node_modules/next/dist/docs/01-app/01-getting-started/`.
- The repository is a single Next.js 16.3.5 starter with React 19 and Tailwind 4. It has no existing Vertex components or `prompts/` directory. Existing changes to `AGENTS.md` and untracked skill directories are outside this task.
- No skill was named by the user. The image is best implemented with HTML, CSS, and SVG, so image generation and product integration skills do not apply.

## Decisions and assumptions

- Treat the image as a design reference sheet, not as a request to implement the other page screenshots in the same directory.
- Render the showcase at `/`, replacing the starter homepage. Keep all example content static and clearly illustrative.
- Use Playfair Display and Inter with serif and sans fallbacks. The initial build could not reach Google Fonts; the official variable fonts and OFL notices were subsequently downloaded into `public/fonts/` and are self-hosted with `next/font/local`. Use CSS custom properties exposed through Tailwind 4's theme where useful.
- Use semantic HTML and inline SVG or simple CSS shapes for the mark and icons. Do not use the screenshot as the page background or add an image-generation dependency.
- Make the desktop layout closely follow the image's section order and grid; let panels stack on narrower screens without horizontal overflow.

## Files expected to change

- `app/page.tsx`: showcase sections 01–14 and sample content.
- `app/globals.css`: palette, typography, spacing, radii, shadows, component styles, and responsive layout.
- `app/layout.tsx`: fonts and Vertex metadata.
- `public/fonts/`: official Inter and Playfair Display variable font files and their OFL notices.
- Optionally `components/vertex-ui.tsx` or similarly small files for reusable primitives/icons if that keeps the page maintainable.
- `tsconfig.json` and `eslint.config.mjs` if needed to keep project checks scoped to the application rather than bundled skill examples.
- This prompt file records decisions and exact verification steps.

## Visual requirements

- Reproduce the white/off-white canvas, thin warm borders, rounded panels, tight vertical rhythm, left intro panel, and two-/three-/four-column section arrangements visible in the supplied image.
- Include: logo and intro; primary and neutral color swatches with labels/hex values; Playfair Display and Inter specimens; the eight-row type scale; 4 px-based spacing scale; radius and shadow samples; outline and filled icon rows; button states; search input and select; badges; status indicators; progress bar; four sample cards; navigation/breadcrumb/pagination; and four principle summaries.
- Primary swatches: `#F97316`, `#FB923C`, `#FDBA74`, `#FED7AA`, `#FFF7ED`. Neutral swatches: `#0F172A`, `#334155`, `#64748B`, `#CBD5E1`, `#E2E8F0`, `#F1F5F9`, `#FAFAFC`, `#FFFFFF`.
- Type scale from the image: Display 1 48/56, Display 2 36/44, Heading 1 28/36, Heading 2 22/30, Heading 3 18/26, Body Large 16/24, Body 14/20, Small 12/16. Use Playfair Display for display headings and Inter for everything else.
- Spacing samples: 4, 8, 12, 16, 24, 32, 40, 48, 64 px. Radius samples: 4, 8, 12, 16, 24 px and full. Include the four shadow samples shown.
- Buttons show Primary, Secondary, Tertiary, and Text styles across Default, Hover, and Disabled example rows. Actual interactive controls must have sensible hover, focus, and disabled behavior.
- Maintain the image's component copy and labels where legible. Sample links can be non-navigating visual examples where destinations do not exist yet; do not imply live course data.

## Accessibility and security

- Preserve logical heading order, visible focus treatment, accessible labels for icon-only controls and fields, and adequate contrast where the reference allows.
- Mark purely decorative shapes/icons as hidden from assistive technology.
- No browser secrets, remote API calls, content writes, or HTML injection. This is a static visual implementation.

## Acceptance criteria

- `/` shows all 14 numbered sections in the supplied order and is visually close to the desktop reference.
- The page fits mobile widths without clipped text or horizontal scrolling; panels stack and dense tables remain readable.
- Typography, colors, radii, spacing, card styles, and component states are reusable in later Vertex pages.
- No starter Next.js branding remains in the rendered page or metadata.
- TypeScript, ESLint, production build, and dev-server smoke check pass, or failures are reported accurately.

## Checks to run

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev` and load `/` for a server smoke check.
5. If browser tooling is available, compare the rendered desktop page against the image and inspect a mobile width.

## Exact manual test steps

1. Run `npm run dev` from `C:\Users\Lenovo\Desktop\vertex`.
2. Open `http://localhost:3000/` at about 1024 px wide and compare sections 01–14 with `vertex-designsystem.png`.
3. Resize the browser to 375 px wide. Confirm the panels stack, the type table remains readable, and no horizontal page scroll appears.
4. Tab through buttons, inputs, select, and pagination; confirm visible focus and correctly disabled samples.
