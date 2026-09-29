# Taskpad (React + Supabase)

To-do app with per-task notes, priorities, due dates, search and filters.
Each user signs in with email/password and only sees their own tasks (Row Level Security).

## Setup
1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of `schema.sql`, and run it.
3. (Optional, for quick testing) In **Authentication → Providers → Email**, turn off "Confirm email".
4. Copy `.env.example` to `.env` and fill in your Project URL and anon key
   (**Project Settings → API**).
5. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Structure
- `schema.sql`      table + Row Level Security policy
- `src/supabase.js` Supabase client
- `src/App.jsx`     session handling (shows Auth or Tasks)
- `src/Auth.jsx`    sign in / sign up
- `src/Tasks.jsx`   loading, adding, filtering, deleting tasks
- `src/TaskItem.jsx` one task, with autosaving notes
- 
