# Fix Clerk sign-in and sign-up 404 after sign-out

## Goal

Make the homepage Sign in and Sign up controls work reliably after a user signs out. Both flows must open the app's local Clerk pages, with no Next.js 404.

## Guidance read

- `AGENTS.md`, including its implementation-prompt approval rule and required checks.
- Previously read local `clerk`, `clerk-setup`, `clerk-cli`, and `clerk-nextjs-patterns` skills.
- Local Next.js 16.3.5 docs for Proxy and App Router pages/layouts.
- Current Clerk documentation for `ClerkProvider`, `SignUpButton`, `SignIn`, and `SignUp` URL/routing behavior.

## Code and runtime inspected

- `app/layout.tsx`: `ClerkProvider` is present but has no explicit `signInUrl` or `signUpUrl`.
- `app/page.tsx`: the signed-out header uses `SignInButton` and `SignUpButton`.
- `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`: Clerk pages exist.
- `proxy.ts`: Clerk middleware runs on application routes.
- `.env.example`: documents local sign-in and sign-up URL variables. The private `.env.local` was not read or printed.
- `next.config.ts`: no custom route configuration.
- Current port 3000 `next dev`: `/` returns 200, while `/sign-in` and `/sign-up` return 404. Its generated `.next/dev/types/routes.d.ts` contains only `/` and `/design-system`.
- Existing production build: its route manifest includes both auth routes. A temporary `next start` on port 3001 returned 200 for `/`, `/sign-in`, and `/sign-up`; that temporary server was stopped.

## Diagnosis and decisions

The current development server has a stale generated route table. The local auth routes are valid because the production server serves them. Clerk's button behavior also needs deterministic local targets: Clerk documents that buttons can fall back to Account Portal when `signInUrl` and `signUpUrl` are missing, and this can produce a 404 when the portal is unavailable. The actual URL reached by the user's click is not visible in the screenshot, so the fix will cover both observed causes.

1. Set both local auth URLs explicitly on `ClerkProvider`: `/sign-in` and `/sign-up`.
2. Keep the existing catch-all Clerk pages and public browsing behavior.
3. Stop the identified stale `next dev` process on port 3000, safely remove only generated `.next/dev` cache after verifying the absolute path is inside this workspace, and restart `npm run dev`.
4. Do not inspect or expose `.env.local` contents, change Clerk keys, or add custom authentication logic.

## Expected files

- `app/layout.tsx` for explicit Clerk auth URLs.
- This prompt file.
- Generated `.next/dev` files will be recreated by Next.js; no generated files will be committed.

## Security considerations

- Keep `CLERK_SECRET_KEY` server-only and `.env.local` ignored.
- Keep sign-in and sign-up public; do not gate them through proxy.
- Do not infer authentication from the client for private features.

## Acceptance criteria

- After a fresh dev-server start, `/sign-in` and `/sign-up` return 200, and the generated route table includes both.
- `ClerkProvider` sends both header buttons to local auth pages.
- After sign-out, a user can open either flow without a 404; switching between sign-in and sign-up works.
- Type check, lint, and production build pass.

## Checks to run

1. `npx tsc --noEmit` after regenerating Next route types if necessary.
2. `npm run lint`.
3. `npm run build` because `app/layout.tsx` changes.
4. Start `npm run dev` and request `/`, `/sign-in`, and `/sign-up`; confirm HTTP 200.
5. Run `git diff --check` and review the diff without printing secret values.

## Exact manual test steps

1. Open `http://localhost:3000` in a browser and sign in with the test account.
2. Open the profile menu and select Sign out.
3. Select Sign in; verify the browser opens the local `/sign-in` page, not a 404.
4. Return to `/` signed out, select Sign up, and verify the local `/sign-up` page opens.
5. Use the Clerk links between Sign in and Sign up and confirm both pages remain available.
