# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- `artifacts/ict-club` — ICT Club of NJBS marketing + community website (React + Vite, wouter routing). Ported from a Vercel/Next.js project. Pages: home, team, projects, events, contact, dashboard, profile, admin, code, privacy/terms, and auth (login/signup/forgot/reset/error).
- `artifacts/api-server` — Express API at `/api`. Implements auth (email/password with JWT cookies via `bcryptjs` + `jsonwebtoken`), public content (events, projects, team, contact, event registration), and admin CRUD. All `/api/admin/*` routes are gated behind a `requireAdmin` middleware that checks the JWT cookie and the user's `role`. OAuth endpoints return `501 Not Implemented` until Google/GitHub credentials are configured.
- `artifacts/mockup-sandbox` — design/preview sandbox.

## Database

- PostgreSQL (Replit-managed) accessed via Drizzle ORM in `lib/db`.
- Tables: `users`, `events`, `projects`, `team`, `messages`, `settings`, `attendance`. Schemas mirror the original Mongoose models with snake_case column names and integer primary keys.
- Apply schema changes with `pnpm --filter @workspace/db run push`.
- The first user must be promoted to `admin` manually:
  `UPDATE users SET role = 'admin' WHERE email = '<your-email>';`

## Migration notes

- `src/lib/next-shim.ts` provides `useRouter` / `usePathname` / `useSearchParams` / `redirect` mapped onto wouter so files copied from the Next.js app keep working.
- Frontend env vars use `import.meta.env.VITE_*` (Vite convention), not `process.env.NEXT_PUBLIC_*`.
- `JWT_SECRET` is read from the environment in production. In development a random value is generated per process — sessions don't survive an api-server restart unless `JWT_SECRET` is set.
- Original Next.js source (Mongoose models, Supabase client, OAuth callbacks) is preserved in `.migration-backup/` for reference.
