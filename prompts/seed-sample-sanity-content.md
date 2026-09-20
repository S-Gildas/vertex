# Seed coherent sample content in Sanity

## Goal

Add a deterministic, rerunnable seed workflow for the existing Vertex Sanity Studio and use it to create realistic published sample content:

- 3 instructors;
- 3 categories;
- 2 distinct courses;
- 2 ordered modules per course;
- 2 ordered lessons per module, for 8 lessons total;
- one unique, real, topic-matched YouTube video per lesson;
- seeded Lorem Picsum images uploaded into Sanity for every course cover, instructor photo, and lesson poster.

The catalog and future cross-course search should receive coherent data rather than isolated placeholder records. Do not add video transcript documents, chapters, search configuration, or frontend pages in this task.

## Guidance read

- Root `AGENTS.md`, especially the standalone Studio boundary, fixed course/module/lesson relationships, private-dataset rules, YouTube playback decision, and required checks.
- `sanity-best-practices` skill:
  - `references/schema.md`
  - `references/migration.md`
- `sanity-migration` skill:
  - `references/general.md`
- Installed Sanity CLI documentation for `sanity exec SCRIPT --with-user-token`.

The skills shaped this implementation toward a repeatable script, real Sanity image assets, Portable Text, reference-first write ordering, actual returned document IDs, and post-seed validation.

## Existing code inspected

- The repository is already split into standalone `studio/` and `web/` workspaces.
- The Studio uses Sanity `5.31.2` and has `course`, `lesson`, `instructor`, and `category` documents plus embedded `courseModule`, `learningOutcome`, `resource`, `portableText`, and `imageWithAlt` objects.
- Courses contain ordered embedded modules; modules contain ordered lesson references.
- Lessons intentionally have no parent-course reference.
- Only lessons store `durationSeconds`. Existing GROQ derives course duration using `math::sum(modules[].lessons[]->durationSeconds)`; module duration is likewise derivable from its lesson references. No aggregate duration field should be added.
- Course covers, instructor photos, and lesson posters are required `imageWithAlt` values backed by Sanity assets.
- Lesson notes and instructor biographies are required Portable Text.
- The Studio CLI reads `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`; `studio/.env.local` is not currently present.
- The worktree contains existing user changes from the workspace split. Preserve them.

## Decisions and assumptions

### Meaning of duration consistency

- “A module equals the sum of its lessons, and a course equals the sum of its modules” means duration totals must be derived and validated from lesson durations.
- Do not duplicate module or course duration values in Sanity.
- The seed validation report will calculate each module total and each course total, and assert that each course total equals the sum of its module totals.

### Seed strategy

- Add a TypeScript seed script under `studio/scripts/` and run it through the installed Sanity CLI with the authenticated user token.
- Add a `seed` npm script to the Studio workspace and a convenient root alias if consistent with existing root scripts.
- Make reruns converge without deleting unrelated content:
  - find ordinary documents by unique `_type` plus `slug.current`;
  - fail clearly if more than one document has the same seed slug;
  - create a document normally when missing so Sanity generates its `_id`;
  - patch the existing document when found;
  - use the real returned `_id` values to build references;
  - publish the seeded documents rather than creating drafts;
  - use stable `_key` values for generated arrays.
- Create/update shared records and lessons before courses so every course reference resolves.
- Do not use `createOrReplace` with slug-derived ordinary document IDs.
- Do not delete or overwrite unrelated instructors, categories, lessons, courses, or assets.

### Images

- Fetch deterministic URLs in the form `https://picsum.photos/seed/<seed>/<width>/<height>`.
- Use distinct semantic seed strings for each of the 13 required images: 2 course covers, 3 instructor photos, and 8 lesson posters.
- Use landscape dimensions for covers/posters and square dimensions for instructor photos.
- Upload each fetched image through the Sanity asset pipeline and store a normal image asset reference plus meaningful alt text.
- Check HTTP success and image content type before upload. Fail with the seed name and URL if Picsum cannot be fetched.
- Rely on Sanity's content-addressed image assets to avoid creating a new binary asset when a rerun receives the same image bytes.
- Do not store raw external image URLs in content documents.

### Seed inventory

Create these instructors:

1. **Maya Chen** (`maya-chen`) — JavaScript, web platform, asynchronous programming. Used by the JavaScript course.
2. **Dr. Elias Okafor** (`elias-okafor`) — machine learning, neural networks, transformers. Used by the AI course.
3. **Sofia Ramirez** (`sofia-ramirez`) — Python, data science, model evaluation. Available for catalog breadth and future courses.

Create these categories:

1. **Web Development** (`web-development`) — used by the JavaScript course.
2. **Artificial Intelligence** (`artificial-intelligence`) — used by the AI course.
3. **Data Science** (`data-science`) — available for future content and cross-category catalog testing.

Populate every instructor biography as valid Portable Text and provide realistic expertise arrays. Populate category descriptions within the current schema limits.

### Course 1: Modern JavaScript Foundations

- Slug: `modern-javascript-foundations`
- Level: beginner
- Instructor: Maya Chen
- Category: Web Development
- Popular: true
- Include a realistic summary, price, display-only student count, 4 learning outcomes, cover image, and coherent lesson metadata.

Module 1, **Language Foundations**:

1. **Variables, Values, and Declarations** (`javascript-variables-values-and-declarations`)
   - YouTube: `https://www.youtube.com/watch?v=cRi9Xa4jBws`
   - Source/topic: Codecademy, “JavaScript Variables Explained - A Beginner's Guide to Coding!”
   - Cover `var`, `let`, `const`, reassignment, and choosing declarations.
2. **Functions and JavaScript Scope** (`javascript-functions-and-scope`)
   - YouTube: `https://www.youtube.com/watch?v=ky2mNs4kGh8`
   - Source/topic: Dev Dreamer, “Understanding JavaScript Scope.”
   - Cover function boundaries, global/local/function/block scope, and declaration behavior.

Module 2, **Collections and Asynchronous Flow**:

1. **Transforming Arrays with Modern Methods** (`javascript-array-transformation-methods`)
   - YouTube: `https://www.youtube.com/watch?v=R8rmfD9Y5-c`
   - Source/topic: Web Dev Simplified, “8 Must Know JavaScript Array Methods.”
   - Cover `filter`, `map`, `find`, `forEach`, `some`, `every`, `reduce`, and `includes`.
2. **Asynchronous JavaScript with Async/Await** (`javascript-async-await`)
   - YouTube: `https://www.youtube.com/watch?v=V_Kr9OSfDeU`
   - Source/topic: Web Dev Simplified, “JavaScript Async Await.”
   - Cover promises, `async`, `await`, readable sequencing, and error-handling context.

### Course 2: Neural Networks and Modern AI

- Slug: `neural-networks-and-modern-ai`
- Level: intermediate
- Instructor: Dr. Elias Okafor
- Category: Artificial Intelligence
- Popular: true
- Include a realistic summary, price, display-only student count, 4 learning outcomes, cover image, and coherent lesson metadata.

Module 1, **How Neural Networks Learn**:

1. **Neural Network Intuition** (`neural-network-intuition`)
   - YouTube: `https://www.youtube.com/watch?v=aircAruvnKk`
   - Source/topic: 3Blue1Brown, “But what is a neural network? | Deep learning chapter 1.”
   - Cover neurons, layers, activations, parameters, and handwritten-digit intuition.
2. **Gradient Descent and Learning** (`gradient-descent-and-learning`)
   - YouTube: `https://www.youtube.com/watch?v=IHZwWFHWa-w`
   - Source/topic: 3Blue1Brown, “Gradient descent, how neural networks learn | Deep Learning Chapter 2.”
   - Cover loss, gradients, parameter updates, and the optimization landscape.

Module 2, **Language Models and Attention**:

1. **Large Language Models, Briefly Explained** (`large-language-models-explained`)
   - YouTube: `https://www.youtube.com/watch?v=LPZh9BOjkQs`
   - Source/topic: 3Blue1Brown, “Large Language Models explained briefly.”
   - Cover tokens, pretraining, prediction, transformers, and chatbot behavior.
2. **Attention in Transformers, Step by Step** (`attention-in-transformers`)
   - YouTube: `https://www.youtube.com/watch?v=eMlx5fFNoYc`
   - Source/topic: 3Blue1Brown, “Attention in transformers, step-by-step | Deep Learning Chapter 6.”
   - Cover embeddings, queries/keys/values, masking, multiple heads, and context.

### Lesson content quality

- Every lesson must have a unique video URL; validate uniqueness before any mutation.
- Record a verified positive duration in seconds for each selected video. The implementation may verify metadata using the public YouTube page/oEmbed-compatible metadata available at implementation time; if automated duration metadata is unavailable, use the observed runtime and keep it in the reviewed fixture.
- Give every lesson 3–5 topic-specific key points, concise Portable Text notes, a relevant pro tip, and 1–2 HTTPS resources from stable first-party or authoritative documentation where practical.
- Mark one lesson per course as a free preview.
- Use plausible non-negative display student counts.
- Keep course/module/lesson topics aligned so catalog totals and future search results are meaningful.
- Include search-overlap vocabulary naturally—such as functions, arrays, async flows, optimization, parameters, models, and transformers—without keyword stuffing.

## Expected files to touch

- `prompts/seed-sample-sanity-content.md`
- `studio/scripts/seed.ts` (or a small `studio/scripts/seed/` split if it materially improves readability)
- `studio/package.json`
- root `package.json` if adding a root seed alias
- `README.md` for prerequisites, command, rerun behavior, and validation output
- `studio/.env.example` only if the chosen safe authentication flow needs a documented variable beyond CLI login; do not add a secret value

No schema or frontend query changes are expected. If implementation proves one is necessary, stop and explain the mismatch before broadening scope.

## Security and operational requirements

- Use the project and dataset resolved by the existing Studio CLI config; do not hardcode either value.
- Require an authenticated Sanity CLI user via `--with-user-token`, or an equivalently scoped server-side token if the existing CLI cannot support the script. Never commit or print a token.
- Print the target project ID and dataset and require an explicit `--confirm` argument before any remote mutation.
- Support `--dry-run` that performs fixture validation and prints the intended document/image inventory without writing to Sanity.
- Never expose the mutation client or credentials to the web workspace or browser.
- Do not log environment values, auth tokens, or raw authorization errors that may contain secrets.
- Treat the seed as additive/upsert-only; do not truncate the dataset or delete documents.
- Validate all remote image responses before upload and cap accepted payload size to a reasonable image limit.

## Acceptance criteria

- A dry run succeeds without credentials or dataset mutation and reports 3 instructors, 3 categories, 8 lessons, 4 modules, 2 courses, 8 unique YouTube URLs, and 13 Picsum image seeds.
- A confirmed authenticated run creates or updates all seed content in the configured dataset and publishes it.
- Running the seed a second time updates the same slug-matched documents and does not create duplicate content documents.
- All course instructor/category references and module lesson references resolve to real documents.
- Each lesson appears in exactly one seeded course module; no seeded lesson is orphaned or referenced twice.
- Module order and lesson order exactly match this prompt.
- Every module duration printed by validation equals the sum of its lessons, and every course duration equals the sum of its module totals.
- All 8 lesson video URLs are distinct, are `https://www.youtube.com/watch?v=...` URLs, and point to real, lesson-relevant videos.
- All 13 requested visuals originate from unique seeded Picsum URLs and are stored as Sanity image assets with alt text.
- Instructor bios and lesson notes are valid Portable Text blocks, not Markdown or raw HTML.
- All generated array entries have stable `_key` values.
- Existing schema validation passes for the seeded documents.
- No unrelated content is modified or removed.

## Checks to run

Run and report exact results:

1. `npm run seed --workspace studio -- --dry-run`
2. Studio TypeScript check.
3. Studio production build because workspace scripts/configuration change.
4. Root/web lint only if shared files or web code are touched unexpectedly.
5. Confirmed seed against the configured live dataset only after the user has approved this prompt and the CLI target/credentials are available.
6. `sanity documents validate` for the seeded document types, or the closest supported non-interactive validation command in the installed CLI.
7. A post-seed GROQ validation script/query that reports:
   - counts by seeded type;
   - missing/unresolved references;
   - duplicate seed slugs;
   - duplicate lesson video URLs;
   - lesson membership counts;
   - module and course duration totals;
   - missing image assets/alt text;
   - malformed Portable Text.
8. Start the Studio dev server and verify it reaches a ready state.

If the Studio environment or Sanity login is missing, complete and verify the local script/build work, then report the exact setup and seed commands under `Needs your attention`; never claim the remote seed succeeded.

## Exact manual test steps

1. Copy `studio/.env.example` to `studio/.env.local` and set the intended Sanity project ID and dataset.
2. From the repository root, authenticate with the Sanity CLI if necessary.
3. Run the dry-run seed command and confirm the printed target, counts, YouTube URLs, Picsum seeds, and duration rollups.
4. Run the confirmed seed command with the documented `--confirm` flag.
5. Run the documented post-seed validation command and confirm it reports zero duplicate slugs, zero duplicate videos, zero unresolved references, zero orphaned seeded lessons, and zero duration mismatches.
6. Start Studio and open Courses. Confirm exactly the two seeded course slugs exist and each contains two ordered modules with two ordered lesson references.
7. Open representative lesson, instructor, and course documents. Confirm Portable Text, image assets, alt text, key points, resources, and references render in the editor.
8. Open each lesson's YouTube URL and confirm the video exists and teaches the lesson topic.
9. Start the web app with its existing Sanity read environment configured. Confirm the catalog query returns both courses with 2 modules, 4 lessons, and a derived duration equal to the lesson total.
10. Run the confirmed seed a second time, rerun validation, and confirm content document counts and relationships remain stable.
