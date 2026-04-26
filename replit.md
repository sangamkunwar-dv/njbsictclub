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
- `artifacts/api-server` — Express API at `/api`. Currently exposes stub routes for the ICT Club app's auth, content, and admin endpoints so the frontend renders without external services. Replace the stubs in `artifacts/api-server/src/routes/index.ts` with real handlers when MongoDB/Supabase/JWT secrets are wired.
- `artifacts/mockup-sandbox` — design/preview sandbox.

## Migration notes

- `src/lib/next-shim.ts` provides `useRouter` / `usePathname` / `useSearchParams` / `redirect` mapped onto wouter so files copied from the Next.js app keep working.
- Original Next.js source is preserved in `.migration-backup/` for reference.
