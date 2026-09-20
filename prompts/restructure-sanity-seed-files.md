# Restructure the Sanity seed into source data, video metadata, and NDJSON

## Goal

Refactor the existing monolithic `studio/scripts/seed.ts` into a dedicated `studio/scripts/seed/` workflow matching the requested structure:

```text
studio/scripts/seed/
  build-ndjson.mjs
  content.mjs
  README.md
  resolve-videos.mjs
  seed.ndjson
  videos.json
```

Keep the same coherent Vertex sample catalog and make `seed.ndjson` the reviewable, importable Sanity fixture. Keep `videos.json` as the single reviewable source of resolved video metadata.

## Guidance read

- Root `AGENTS.md`, especially the standalone Studio boundary, fixed content relationships, private-dataset rules, video-provider requirements, approval workflow, and required checks.
- `sanity-best-practices`:
  - `references/project-structure.md`
  - `references/migration.md`
- Installed Sanity CLI and `@sanity/import` documentation for NDJSON imports, `--replace`, and `_sanityAsset` URL stubs.

This guidance keeps the workflow inside the standalone Studio, uses normal Sanity references, preserves Portable Text, avoids browser credentials, and lets the importer upload image URLs through the asset pipeline.

## Existing code inspected

- `studio/scripts/seed.ts` currently contains all types, content fixtures, image definitions, YouTube metadata, validation, image upload, slug-based upsert, remote validation, and command-line routing in one roughly 38 KB file.
- The current fixture contains 3 instructors, 3 categories, 8 lessons, 4 embedded modules, 2 courses, 8 unique YouTube URLs, and 13 Picsum images.
- `studio/package.json` exposes `seed`, `seed:dry-run`, and `seed:validate`; the root package forwards the same commands.
- `README.md` documents the current idempotent seed workflow.
- The Studio schema already supports every seeded field. No schema or frontend changes are needed.
- The worktree contains existing changes from the workspace split. Preserve all unrelated work.

## Decisions and assumptions

### File responsibilities

- `content.mjs` is the human-edited source for instructors, categories, lessons, courses, Portable Text helpers, resources, image specifications, stable array keys, and fixture validation.
- `videos.json` contains one entry per lesson video with stable fields such as provider, provider video ID, canonical URL, title, author/channel, and duration in seconds. Lesson content joins to this file by a stable video key rather than repeating metadata.
- `resolve-videos.mjs` validates every configured YouTube URL and refreshes only the resolvable metadata in `videos.json`. It must fail clearly on removed, private, malformed, duplicated, or topic-mismatched entries and must not mutate Sanity.
- `build-ndjson.mjs` loads and validates `content.mjs` plus `videos.json`, compiles the final Sanity documents, and writes one compact JSON document per line to `seed.ndjson` with a final newline.
- `seed.ndjson` is committed so content changes are reviewable and imports do not depend on running the metadata resolver first.
- `README.md` documents the edit, resolve, build, verify, import, and remote-validation workflow.

### Document identity and references

- A portable NDJSON graph needs stable document IDs so course references can point to instructor, category, and lesson documents before import.
- Use opaque, pre-generated seed fixture IDs stored centrally in `content.mjs`; do not derive IDs from titles, slugs, paths, or related IDs.
- Treat these IDs as fixture identities only. Do not introduce deterministic-ID conventions into application code or normal authoring.
- Keep stable `_key` values for Portable Text, learning outcomes, modules, lesson references, and resources.
- Build references from the central ID map and validate that every `_ref` resolves to exactly one document in the generated fixture.
- Import with replacement semantics so rerunning the fixture updates the same seed documents without deleting unrelated content.
- Because the previous slug-based seed may already have created documents with Sanity-generated IDs, add a pre-import collision check by `_type` and `slug.current`. Abort with actionable output if a matching slug exists under a different ID; never silently create duplicates or delete/migrate existing records.

### Images

- Preserve all 13 existing deterministic Picsum image definitions and alt text.
- Emit Sanity import asset stubs in the generated NDJSON using the supported `_sanityAsset: "image@https://..."` form.
- Let `sanity dataset import` download each image, upload it through the Sanity asset pipeline, and patch the resulting image reference.
- Keep HTTPS validation, unique image seeds, semantic alt text, and the existing size limit/checks where the import tooling permits them.
- Do not store the Picsum URL as the final content image value.

### Scope

- Preserve the existing sample-content inventory and wording unless a mechanical adjustment is required by the split.
- Do not add video transcript documents, chapters, Context configuration, progress, search, or frontend pages.
- Do not change the Sanity schemas or GROQ queries.
- Remove `studio/scripts/seed.ts` only after all its required behavior has moved into the new folder and package scripts no longer reference it.

## Expected files to touch

- `prompts/restructure-sanity-seed-files.md`
- `studio/scripts/seed.ts` (remove after migration)
- `studio/scripts/seed/build-ndjson.mjs`
- `studio/scripts/seed/content.mjs`
- `studio/scripts/seed/resolve-videos.mjs`
- `studio/scripts/seed/videos.json`
- `studio/scripts/seed/seed.ndjson`
- `studio/scripts/seed/README.md`
- `studio/package.json`
- root `package.json` only if aliases need adjustment
- root `README.md`

No schema or web files should change. Stop and report before broadening scope.

## Security and operational requirements

- Building and locally validating the fixture must require no Sanity credential and make no network mutation.
- Video resolution may use public provider endpoints only and must not require or print secrets.
- Import and remote validation must resolve project and dataset from the existing Studio CLI configuration; never hardcode them.
- Require the authenticated Sanity CLI or an explicitly documented server-side import token. Never commit or print a token.
- Print the target project and dataset before import and require an explicit confirmed command for remote writes.
- Never expose Studio credentials, mutation clients, or seed tooling to the web workspace or browser.
- Do not truncate a dataset, delete unrelated documents, or pass flags that ignore failing assets.

## Package scripts

Keep the existing root command names where possible while making their behavior explicit:

- `seed:videos`: resolve and verify `videos.json` without touching Sanity.
- `seed:build`: generate `seed.ndjson` from the two source files.
- `seed:dry-run`: run fixture validation and verify that the committed NDJSON is current, without remote calls.
- `seed`: run the pre-import collision check, then import the committed NDJSON into the configured dataset with replacement semantics.
- `seed:validate`: validate the stored seed inventory and relationships after import.

Avoid automatically refreshing video metadata as part of every import; changes to `videos.json` must remain visible in code review.

## Acceptance criteria

- The requested six-file seed folder exists and `studio/scripts/seed.ts` is no longer used.
- `content.mjs` is the sole editable source for catalog content and `videos.json` is the sole editable source for video metadata.
- `build-ndjson.mjs` produces byte-for-byte deterministic output on repeated runs.
- `seed.ndjson` contains valid NDJSON: one complete JSON document per non-empty line and a trailing newline.
- The generated fixture contains exactly 3 instructors, 3 categories, 8 lessons, and 2 courses with 4 embedded modules total.
- All 8 lesson video URLs are unique and resolve through `videos.json`; durations remain positive and course/module totals remain derived from lesson durations.
- All references resolve inside the fixture, every seeded lesson belongs to exactly one module, and no seed slug is duplicated.
- All 13 visuals use supported Sanity asset import stubs with unique deterministic URLs and retain meaningful alt text.
- Portable Text and all keyed arrays retain valid `_type` and stable `_key` values.
- The import is rerunnable with replacement semantics and does not modify or delete unrelated documents.
- A collision with content created by the previous slug-based seed aborts before import with exact remediation guidance.
- No token, project ID, dataset name, or private value is committed.

## Checks to run

Run and report the real results:

1. Build `seed.ndjson` twice and verify the second build produces no diff.
2. Run the local dry-run/fixture validation.
3. Parse every non-empty NDJSON line and validate counts, IDs, slugs, references, array keys, Portable Text, asset stubs, video uniqueness, lesson membership, and duration rollups.
4. Run Studio TypeScript checking.
5. Run the Studio production build because package scripts and seed tooling change.
6. Start the Studio dev server and verify it reaches ready state.
7. If Studio credentials and target configuration are available, run the collision check, confirmed import, remote validation, and Sanity document/schema validation.
8. If credentials are unavailable, do not claim a remote import; report the exact remaining commands.

## Exact manual test steps

1. Edit a harmless text value in `studio/scripts/seed/content.mjs`.
2. Run `npm run seed:build` and confirm only the corresponding document line changes in `seed.ndjson`; revert the harmless edit and rebuild.
3. Run `npm run seed:dry-run` and confirm it reports 3 instructors, 3 categories, 8 lessons, 4 modules, 2 courses, 8 videos, and 13 images.
4. Run `npm run seed:videos` only when video metadata intentionally needs refreshing, then inspect the `videos.json` diff and rebuild the NDJSON.
5. Configure `studio/.env.local`, authenticate the Sanity CLI, and verify the intended project and dataset.
6. Run `npm run seed`; confirm the pre-import collision check passes before approving the remote import.
7. Run `npm run seed:validate`; confirm zero duplicate slugs, unresolved references, duplicate video URLs, orphaned lessons, malformed Portable Text blocks, missing images, or duration mismatches.
8. Run `npm run seed` a second time and confirm document counts and references remain stable.
9. Open Studio and inspect one course, lesson, instructor, and category. Confirm images, Portable Text, ordered modules, lesson references, and video URLs render correctly.
