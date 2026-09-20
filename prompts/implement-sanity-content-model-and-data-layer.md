# Implement Vertex Sanity content model, standalone Studio, and server data layer

## Goal

Implement the first production content foundation for Vertex:

- a standalone Sanity Studio workspace;
- schemas for `course`, embedded `module`, `lesson`, `instructor`, and `category`;
- a server-only Sanity read client in the Next.js web workspace;
- typed GROQ queries and data-access functions for catalog, course, lesson, instructor, and category reads.

Do not implement pages, seed content, search, video ingestion, progress, preview/presentation, or write APIs in this task.

## Guidance read

- Root `AGENTS.md`, especially the standalone-workspace boundary, fixed data relationships, private-dataset requirements, and required checks.
- `sanity-best-practices` skill:
  - `references/schema.md`
  - `references/nextjs.md`
  - `references/groq.md`
- `content-modeling-best-practices` skill:
  - `references/reference-vs-embedding.md`
  - `references/taxonomy-classification.md`
- Installed Next.js 16.3.5 guidance:
  - Server and Client Components
  - Fetching Data
  - Data Security
  - Environment Variables

## Existing code inspected

- The repository is currently one root Next.js workspace.
- The Studio is embedded at `app/studio/[[...tool]]/page.tsx` using root `sanity.config.ts` and `sanity.cli.ts`.
- `sanity/schemaTypes/index.ts` is empty.
- `sanity/lib/client.ts` is a public CDN client and is not protected with `server-only`.
- `sanity/lib/live.ts` exists but has no token configuration and is not mounted by the root layout.
- The current app already contains homepage, design-system, Clerk routes, middleware/proxy, styles, and local fonts that must continue to work.
- `.env.local` already defines the public Sanity project ID and dataset names, but `.env.example` does not list the Sanity variables or a private read token.
- Installed relevant versions include Next.js 16.3.5, next-sanity 13.3.4, Sanity 5.31.2, and React 19.2.8.
- The worktree contains existing user changes. Preserve them while moving files.

## Decisions and assumptions

### Workspace structure

- Convert the repository into an npm-workspaces monorepo with `web/` and `studio/` packages.
- Move the existing Next.js application into `web/` without changing its visual or authentication behavior.
- Move Sanity authoring configuration and schemas into `studio/`.
- Remove the embedded `/studio` Next.js route and Studio-only dependencies from `web/`.
- Keep repository-level guidance, prompts, skills, and shared metadata at the root.
- Add root scripts that make the two workspaces easy to run and check independently.

### Content model

- `course` is a document with:
  - required title and slug;
  - required summary;
  - required cover image with hotspot and required alt text;
  - required level using a controlled beginner/intermediate/advanced list;
  - required non-negative numeric USD price;
  - optional `popular` flag defaulting to false;
  - optional non-negative display-only student count;
  - one to six embedded learning outcomes, each containing a semantic icon key, title, and description;
  - required instructor reference;
  - required category reference;
  - one or more ordered embedded modules.
- `module` is an object embedded only in a course. It has a required title, required summary, and one or more ordered lesson references. Module and lesson display numbers are derived from array order and are not stored.
- `lesson` is a document with:
  - required title and slug;
  - required HTTPS video URL;
  - required poster image with hotspot and required alt text;
  - required positive duration in seconds;
  - free-preview boolean defaulting to false;
  - optional non-negative display-only student count;
  - Portable Text notes using standard blocks and links;
  - one or more short key points;
  - optional pro tip;
  - optional resources containing controlled type, title, optional description, and HTTPS URL.
- `instructor` is a document with required name, slug, photo with alt text, one or more expertise strings, and Portable Text bio.
- `category` is a flat taxonomy document with required title, slug, and description.
- Use `defineType`, `defineField`, and `defineArrayMember` throughout, document/object icons from supported Sanity icon subpath imports, useful previews, editor descriptions, and practical validation.
- Let Sanity generate ordinary document IDs. Enforce slug presence and use source-based slug generation.
- Do not add parent-course references to lessons or turn modules into documents.

### Studio authoring experience

- Give authors a deliberate structure grouped as Courses, Lessons, Instructors, and Categories rather than the generic document-type list.
- Keep Vision enabled with the shared dated API version.
- Use environment-backed project ID and dataset values suitable for a standalone Vite Studio (`SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`).
- Add Studio-local `.env.example` documentation, without committing secrets.

### Web read boundary and data layer

- Create a server-only environment module that validates:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`;
  - `NEXT_PUBLIC_SANITY_DATASET`;
  - `SANITY_API_READ_TOKEN`.
- Create a `server-only` Sanity client configured for the private dataset, a dated API version, CDN reads in production, and the private read token.
- Do not expose the read token through a `NEXT_PUBLIC_` variable and do not make Sanity reads from Client Components.
- Create query modules using `defineQuery`, parameters rather than interpolation, explicit nested projections, `_key` for arrays, and merged reference projections.
- Create a small data-access API with functions for:
  - all courses for the catalog;
  - popular courses;
  - one course by slug with ordered modules and lesson summaries;
  - one lesson by slug with its reverse-resolved course, module, derived module index, and derived lesson index;
  - all instructors and one instructor by slug with their courses;
  - all categories and one category by slug with its courses.
- Return `null` for missing singular records and arrays for collection reads.
- Keep query result shapes focused: course cards do not fetch lesson notes; lesson detail can fetch notes/resources; no unprojected documents.
- Add Sanity TypeGen configuration, schema extraction/type generation scripts, generated types, and use generated query result types in the data-access functions.
- Do not enable Live Content API or browser tokens in this task. The read layer uses published private-dataset content only.

## Expected files to touch

The exact split may vary slightly if package tooling requires it, but expected changes are:

- Root:
  - `package.json`
  - `package-lock.json`
  - `.gitignore`
  - `README.md`
- Move existing Next.js files/config into `web/`, including:
  - `app/`
  - `components/`
  - `public/`
  - `proxy.ts`
  - `next.config.ts`
  - `postcss.config.mjs`
  - `eslint.config.mjs`
  - `tsconfig.json`
  - `.env.example`
  - `package.json`
- New or moved web data files:
  - `web/sanity/env.ts`
  - `web/sanity/lib/client.ts`
  - `web/sanity/lib/image.ts`
  - `web/sanity/queries/*.ts`
  - `web/sanity/data/*.ts`
  - `web/sanity-typegen.json`
  - `web/sanity.types.ts`
- Standalone Studio:
  - `studio/package.json`
  - `studio/tsconfig.json`
  - `studio/sanity.config.ts`
  - `studio/sanity.cli.ts`
  - `studio/.env.example`
  - `studio/src/env.ts`
  - `studio/src/structure.ts`
  - `studio/src/schemaTypes/index.ts`
  - `studio/src/schemaTypes/documents/{course,lesson,instructor,category}.ts`
  - `studio/src/schemaTypes/objects/{courseModule,learningOutcome,resource,portableText,imageWithAlt}.ts`
- Remove obsolete embedded-Studio files after their standalone replacements exist, including `web/app/studio/[[...tool]]/page.tsx` and any root copies superseded by the workspace split.

## Security requirements

- Import `server-only` in the environment, Sanity client, and data-access boundary as appropriate.
- Validate all required environment variables at startup with messages that name the missing variable but never print its value.
- Keep `SANITY_API_READ_TOKEN` server-only.
- Use the minimum read-only Sanity token; do not add mutation methods or a write token.
- Never pass the raw client or token into Client Components.
- Parameterize every user-controlled GROQ value.
- Query only published content through the read client.
- Keep `.env.local` and all secrets ignored; commit example variable names only.

## Acceptance criteria

- The repository has independently runnable `web` and `studio` workspaces.
- The existing homepage, design system, Clerk routes, and proxy compile from `web` with no intended behavior or visual change.
- There is no embedded Studio route in Next.js.
- Studio loads the five requested schema concepts, with `module` embedded inside `course`.
- All fields required by the Vertex specification are represented with sensible validation, preview configuration, and author-facing labels/descriptions.
- Course modules preserve lesson order, and no stored module/lesson numbering fields exist.
- Lessons do not store a parent course reference.
- Notes and instructor bio are Portable Text, not markdown.
- The read client works with a private dataset token and cannot be imported into client code.
- The data layer exposes all listed catalog/detail/instructor/category functions and uses explicit projections.
- Lesson detail reverse-resolves the owning course and calculates module and lesson indexes from array order.
- TypeGen extracts the Studio schema, finds the web GROQ queries, and generates usable query result types.
- `.env.example` files form the canonical variable list without containing credentials.
- Documentation explains setup, local commands, TypeGen, and the separate deployment model.

## Checks to run

From the repository root or the named workspace, run and report exact results:

1. Install/update workspace dependencies with `npm install`.
2. Studio type check.
3. Studio lint, if the scaffolded Studio lint configuration provides it.
4. Studio production build.
5. Sanity schema extract.
6. Sanity TypeGen generation.
7. Web TypeScript check with `tsc --noEmit`.
8. Web lint.
9. Web production build.
10. Start the web dev server and verify it reaches a ready state.
11. Start the Studio dev server and verify it reaches a ready state.

Deployment and schema deployment require authenticated Sanity CLI access and are external state changes. Run them only if credentials are already available and the commands can target the configured project safely; otherwise report the exact manual commands under `Needs your attention`.

## Exact manual test steps

1. Copy the documented web and Studio example variables into ignored local environment files and provide a read-only Sanity token for the web app.
2. Run the web and Studio dev commands in separate terminals.
3. Open `http://localhost:3000` and confirm the existing homepage renders.
4. Open `http://localhost:3000/design-system` and confirm the existing design-system page renders.
5. Confirm `/studio` is no longer served by Next.js.
6. Open the Studio URL printed by its dev command, sign in, and confirm the navigation shows Courses, Lessons, Instructors, and Categories.
7. Create an instructor and category.
8. Create two lessons with notes, key points, poster images, durations, and at least one resource.
9. Create a course with cover image, metadata, learning outcomes, the instructor/category references, and one embedded module that references the lessons in a known order.
10. Publish all documents.
11. Use Studio Vision to run the exported catalog and detail query shapes with representative slug parameters, confirming only projected fields are returned.
12. Swap the lesson reference order in the course, republish, and confirm query output order changes without editing a stored lesson number.
13. Temporarily remove `SANITY_API_READ_TOKEN`, run the web check, and confirm startup/build fails with a clear missing-variable message and no secret value.
