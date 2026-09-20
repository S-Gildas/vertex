# Replace the Sanity catalog with the supplied dataset

## Goal

Replace the current Vertex catalog content in Sanity project `smobuwyq`, dataset `production`, with the two user-supplied fixtures while preserving any Sanity documents outside the catalog types in scope.

The supplied files are:

- `videos.json`: `C:\Users\Lenovo\.codex\attachments\80f9587b-66c2-4f4e-84e6-e7de1f1e7bab\pasted-text.txt`
- `seed.ndjson`: `C:\Users\Lenovo\.codex\attachments\62231ab9-f630-4e00-917e-4e9c9990d75c\pasted-text.txt`

## Skills and guidance read

- `sanity-migration`
  - Treat the replacement as a repeatable migration.
  - Validate inventory, relationships, assets, import order, rerun behavior, and the remote result.
  - Take a backup and require a human checkpoint before writing to Sanity.
- `sanity-best-practices`, migration guidance
  - Keep Portable Text structured.
  - Validate schema compatibility explicitly because API imports do not enforce Studio validation.
  - Use the CLI/NDJSON path for bulk content.
- Repository `AGENTS.md`
  - Keep the Studio and web workspaces separate.
  - Keep Sanity access server-side.
  - Run and report real checks.

## Existing code and data inspected

- `studio/scripts/seed/videos.json`
- `studio/scripts/seed/seed.ndjson`
- `studio/scripts/seed/content.mjs`
- `studio/scripts/seed/build-ndjson.mjs`
- `studio/scripts/seed/resolve-videos.mjs`
- `studio/scripts/seed/README.md`
- `studio/package.json`
- `studio/sanity.cli.ts`
- `studio/src/env.ts`
- Catalog schemas under `studio/src/schemaTypes/documents/`
- Web GROQ queries under `web/sanity/queries/`
- Web Sanity data helpers and generated types

Current local fixture inventory:

- 3 instructors
- 3 categories
- 8 lessons
- 2 courses
- 8 video metadata entries

New fixture inventory:

- 6 categories
- 5 instructors
- 120 lessons
- 10 courses
- 141 documents total
- 120 unique YouTube metadata entries
- 140 internal references, all resolved within the fixture
- 135 unique image import directives
- No invalid Sanity document IDs
- Every lesson has exactly one matching video metadata entry by YouTube video ID

## Decisions and assumptions

1. Treat the supplied fixtures as the new canonical seed data and preserve their explicit IDs. These IDs are already used by all internal references and make replacement/reruns deterministic.
2. Replace only `_type in ["course", "lesson", "instructor", "category"]`. Do not truncate the dataset and do not delete agent configuration, progress, future video documents, system documents, or other unrelated content.
3. Export a timestamped backup before any remote deletion.
4. The supplied lesson contract is canonical: use `thumbnail` and `duration`. Update the Studio schema, GROQ projections, duration rollups, generated Sanity types, and affected code references from the old `poster` / `durationSeconds` names. Do not import schema-invalid shadow fields.
5. Keep `videos.json` as offline provider metadata. It is not itself a Sanity document import. Its shape is a key-addressed object with `{id, title, channel, duration, query}` values.
6. Replace the old seed pipeline assumptions that are hard-coded to 8 videos and 16 documents. The new validation must read the supplied `videos.json` and `seed.ndjson` directly and must not regenerate the fixture from the obsolete `content.mjs` data.
7. Old catalog image assets may become unreferenced after replacement. Do not delete assets automatically; asset cleanup is a separate destructive maintenance task.
8. Import external image directives through the Sanity CLI. Fail the import if assets cannot be fetched; do not use `--allow-failing-assets`.

## Expected files to touch

- `studio/scripts/seed/videos.json`
- `studio/scripts/seed/seed.ndjson`
- `studio/scripts/seed/README.md`
- `studio/scripts/seed/build-ndjson.mjs` or a clearly named replacement validator
- `studio/scripts/seed/resolve-videos.mjs` if retained, so it understands the new video metadata shape; otherwise remove its obsolete command and document the replacement workflow
- `studio/scripts/seed/content.mjs` if removal is required to prevent accidental regeneration of the old fixture
- A new narrowly scoped remote replacement/validation script under `studio/scripts/seed/`
- `studio/package.json`
- Root `package.json` only if workspace command aliases need to change
- `studio/src/schemaTypes/documents/lesson.ts`
- `web/sanity/queries/lessons.ts`
- `web/sanity/queries/courses.ts`
- `web/sanity.types.ts` through Sanity TypeGen
- `web/sanity/schema.json` through schema extraction
- Any direct `poster` / `durationSeconds` lesson references found by repository search

Do not touch unrelated user changes.

## Requirements

### Local fixture installation

- Copy the supplied JSON object into `studio/scripts/seed/videos.json` with valid JSON and a final newline.
- Copy the supplied 141-line NDJSON fixture into `studio/scripts/seed/seed.ndjson` with one valid document per line and a final newline.
- Preserve the supplied document IDs, array keys, Portable Text, references, video URLs, and image directives.
- Verify fixture hashes or byte-for-byte equality with the supplied attachments before making any deliberate compatibility transformation. Prefer adapting the application contract rather than silently rewriting fixture content.

### Fixture validation

- Parse every NDJSON line and reject malformed or duplicate IDs.
- Assert exact counts: 6 categories, 5 instructors, 120 lessons, 10 courses.
- Assert unique slugs per type.
- Recursively validate `_key` presence/uniqueness in object arrays where applicable.
- Assert every `_ref` resolves to a document in the fixture.
- Assert each lesson belongs to exactly one course module.
- Assert lesson notes and instructor bios are Portable Text blocks.
- Assert required images contain valid `image@https://...` `_sanityAsset` directives before import.
- Assert 120 unique lesson video URLs and map each YouTube ID to exactly one entry in `videos.json`.
- Assert positive integer `duration` values and consistency between the lesson and video metadata.
- Validate all course instructor/category references and all module lesson references.
- Produce a concise inventory report.

### Schema and web contract

- Rename the lesson schema fields from `poster` to `thumbnail` and from `durationSeconds` to `duration`.
- Keep validation semantics equivalent: required image with alt text and a positive integer duration capped at one day.
- Update all GROQ fields, nested course lesson projections, and duration sums.
- Regenerate schema extraction and TypeGen output.
- Ensure no active code path still requests the obsolete lesson field names.

### Remote replacement

- Print the resolved project and dataset and abort unless they are exactly `smobuwyq` / `production`.
- Query and print pre-replacement counts for the four catalog types.
- Export a timestamped dataset backup to a local ignored backup directory before deletion.
- Stop immediately if backup export fails.
- Delete only catalog documents of the four in-scope types, in a reference-safe operation/order.
- Import the new NDJSON using Sanity CLI replacement semantics.
- Keep unrelated document types untouched.
- Make reruns converge to the same 141 catalog documents.
- Never expose tokens in output, source, or client-side environment variables.

### Remote validation

- Assert exact post-import counts for all four catalog types and 141 total catalog documents.
- Assert that all 141 supplied IDs exist and no older catalog IDs remain.
- Assert no broken catalog references.
- Assert all imported image fields resolve to stored Sanity image asset references.
- Assert 120 unique lesson video URLs and no orphaned lessons.
- Run Sanity document validation against the deployed/current schema.

## Security and safety

- Use the authenticated Sanity CLI/user token only from the Studio workspace.
- Do not add tokens or secrets to tracked files.
- Do not delete or recreate the entire `production` dataset.
- Do not delete image assets as part of this task.
- Do not proceed to deletion without a successful local fixture validation and dataset backup.
- Keep the destructive query limited to the four explicit catalog types.
- Report the backup path so rollback is possible.

## Acceptance criteria

- The local canonical seed files contain the supplied new data.
- The local validation reports 6 categories, 5 instructors, 120 lessons, 10 courses, 120 video entries, no duplicate IDs/slugs, and no broken references.
- Studio and web use `thumbnail` and `duration` consistently for lessons.
- A timestamped backup of `production` exists before remote content is removed.
- Sanity `production` contains exactly the 141 new catalog documents and none of the old catalog documents.
- Unrelated Sanity document types remain unchanged.
- Imported image fields resolve to Sanity assets.
- Type check, lint, schema extraction/TypeGen, Studio build, web production build, and relevant remote validations pass with real output reported.

## Checks to run

From the repository root or the indicated workspace:

1. Run the new local fixture validation/dry run.
2. Run repository search to confirm obsolete lesson fields are absent from active schema/query/application code.
3. Run `npm run typecheck`.
4. Run `npm run lint`.
5. Run schema extraction and TypeGen.
6. Run the Studio build.
7. Run the web production build because GROQ/type contracts changed.
8. Start the Studio and web dev servers long enough to confirm successful startup.
9. Deploy the schema before importing data if the remote schema has not yet been updated.
10. Run the backup, scoped replacement import, and remote validator.
11. Run Sanity document validation and report its exact result.

## Exact manual test steps

1. Open Sanity Studio for project `smobuwyq`, dataset `production`.
2. Confirm there are 6 categories, 5 instructors, 120 lessons, and 10 courses.
3. Open one instructor and confirm its portrait, expertise, and Portable Text biography render.
4. Open one course and confirm its instructor, category, modules, outcomes, and lesson references resolve.
5. Open the first and last lesson and confirm title, thumbnail, duration, notes, key points, resources, and YouTube URL are populated.
6. Open the Vertex web app and verify course totals and lesson cards use the new duration and thumbnail fields.
7. Verify an old catalog slug from the former fixture no longer resolves.
8. Verify a new course slug and a new lesson slug resolve correctly.
9. Keep the reported backup archive until the replacement is accepted.
