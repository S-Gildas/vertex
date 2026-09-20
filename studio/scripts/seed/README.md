# Sanity catalog seed

This directory contains the canonical Vertex catalog fixture and the guarded workflow that replaces catalog content in Sanity.

## Files

- `videos.json` is the canonical, key-addressed metadata for the 120 YouTube lessons.
- `seed.ndjson` contains the 141 importable Sanity documents, one document per line.
- `validate-fixture.mjs` validates counts, IDs, slugs, Portable Text, references, course membership, images, videos, and durations without contacting Sanity.
- `replace-remote.mjs` performs authenticated target checks, scoped catalog preflight/deletion, and remote validation.
- `backup-dataset.mjs` exports a timestamped dataset backup to the ignored root `.backups/` directory.

The fixture contains 6 categories, 5 instructors, 120 lessons, and 10 courses. Lesson media fields are `thumbnail` and `duration`.

## Local validation

From the repository root:

```bash
npm run seed:dry-run
```

The validator is read-only and needs no credentials.

## Guarded replacement

Configure `studio/.env`, authenticate the Sanity CLI, and run:

```bash
npm run seed
```

The command runs these operations in order:

1. Validate the complete local fixture.
2. Assert the remote target is project `smobuwyq`, dataset `production`, print current catalog counts, and reject external references to catalog documents.
3. Export a timestamped backup. The workflow stops if this fails.
4. Delete only `course`, `lesson`, `instructor`, and `category` documents, in reference-safe order.
5. Import `seed.ndjson` with replacement semantics and upload its image directives.
6. Validate exact remote IDs, counts, references, course membership, video metadata, and image assets.

The workflow does not truncate the dataset and does not delete asset, progress, agent configuration, system, or other unrelated document types. Old assets can become unreferenced and should only be cleaned up in a separate reviewed maintenance task.

## Individual checks

```bash
npm run seed:preflight
npm run seed:backup
npm run seed:validate
```

Do not run `seed:delete` by itself unless a successful backup exists and an immediate import is planned.
