# AGENTS.md

## Project overview
Taskpad is a to-do app with per-task notes, priorities, due dates, search and filters.
Stack: React 18 + Vite (JavaScript), Supabase (Postgres + Auth), deployed on Vercel.

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build` (run this before finishing any change)

## Project structure
- `src/App.jsx`: session handling, shows Auth or Tasks
- `src/Auth.jsx`: email/password sign in and sign up
- `src/Tasks.jsx`: loading, adding, filtering, deleting tasks
- `src/TaskItem.jsx`: a single task with autosaving notes
- `src/supabase.js`: Supabase client
- `schema.sql`: table definition and Row Level Security policy

## Conventions
- Functional components with hooks only; no class components.
- Keep styles in `src/styles.css`; no CSS frameworks.
- Update the UI optimistically, then roll back if the Supabase call fails.
- Show errors to the user; don't swallow them.

## Database rules
- Every table must have Row Level Security enabled with a per-user policy.
- Any schema change goes in `schema.sql` as well as being applied in Supabase.

## Do not
- Never commit `.env` or any secret. Only `VITE_SUPABASE_URL` and the publishable key belong in client code.
- Never use a `sb_secret_` or `service_role` key in the frontend.
- Don't add new dependencies without a clear reason.
