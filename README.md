# Vertex

Vertex is an AI-powered learning platform. The repository contains two independent workspaces:

- `web/`: the Next.js learner application and server-only Sanity data layer.
- `studio/`: the standalone Sanity Studio and content schema.

## Install

```bash
npm install
```

Copy `web/.env.example` to `web/.env.local` and provide Clerk credentials, the Sanity project and dataset, and a read-only `SANITY_API_READ_TOKEN`. Copy `studio/.env.example` to `studio/.env.local` and provide the same Sanity project and dataset.

## Run locally

Run the applications in separate terminals:

```bash
npm run dev:web
npm run dev:studio
```

The web app defaults to [http://localhost:3000](http://localhost:3000). The Studio prints its local URL, normally `http://localhost:3333`.

## Content model

The Studio manages courses, lessons, instructors, and categories. Modules are ordered objects embedded in courses, and each module holds an ordered list of lesson references. Lesson and module numbers are derived from that order.

The Sanity dataset is private. All application reads go through `web/sanity/data` on the server with a read-only token. Browser code must not import the Sanity client or data-access modules.

## Catalog content

The Studio includes a deterministic catalog fixture with 6 categories, 5 instructors, 120 lessons, and 10 courses. Its canonical sources are `studio/scripts/seed/videos.json` and `studio/scripts/seed/seed.ndjson`. See `studio/scripts/seed/README.md` for validation, backup, replacement, and rollback details.

Validate the fixture locally without credentials or remote writes:

```bash
npm run seed:dry-run
```

Before writing, configure `studio/.env.local`, authenticate the Sanity CLI, and review the project and dataset printed by the preflight. The guarded command validates the fixture, backs up the dataset, deletes only the four catalog document types, imports the replacement fixture and images, then validates the stored result:

```bash
npx sanity login
npm run seed
```

Rerunning the command converges to the same 141 catalog documents and never deletes unrelated document types or assets. Validate the stored counts, references, unique videos, images, Portable Text, lesson membership, and durations independently with:

```bash
npm run seed:validate
```

## Type generation

After changing a schema or GROQ query, regenerate the schema and query result types:

```bash
npm run typegen
```

This extracts the standalone Studio schema to an ignored `web/sanity/schema.json` file and writes the committed `web/sanity.types.ts` output.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

Deploy `web/` as the Next.js application and `studio/` as a separate Sanity Studio application. From the Studio workspace, authenticated maintainers can run:

```bash
npm run deploy --workspace studio
npm run schema:deploy --workspace studio
```

Deploying the Studio application is required before Sanity Context can serve this dataset in later search work.

Inter and Playfair Display are self-hosted in `web/public/fonts/`; their license notices are included there. The homepage and `/design-system` remain public, while Clerk handles account UI and authentication.
