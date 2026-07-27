# Butterflies.ai

A polished meeting-intelligence workspace inspired by Fireflies.ai. It helps users review meetings, search meeting records, inspect transcripts, and save manual meeting entries.

## Current feature status

### Working now

- **Supabase-backed profile flow:** Create a profile with name, email, and password; return through the sign-in page; the active profile name appears in the sidebar.
- **Supabase meeting data:** Meetings, participants, transcript segments, and action items are read from Supabase. New manual meetings are saved there.
- **Dashboard:** Search meeting titles, newest/oldest sorting, cards, skeleton loading, empty states, and responsive navigation.
- **Meeting detail:** Simulated media player, clickable transcript timestamps, current-line highlighting, transcript search/highlighting, summary, topics, chapters, and action items.
- **Manual meeting entry:** Use **New** to create a meeting with current date/time, duration, and comma-separated participants.
- **Theme:** Appearance control in Settings toggles light/dark mode and keeps the choice while navigating.
- **Navigation:** Sidebar pages, profile dropdown, sign out, and “Log in with another ID” are wired.
- **Deployment:** The frontend is ready for Vercel. Supabase is the deployed data backend.

### Placeholder / not yet implemented

- Calendar, Zoom, Google Meet, Microsoft Teams, CRM, and Live Meeting Bot integrations
- Real audio/video uploads and speech-to-text
- Real calendar synchronization
- Team collaboration, sharing permissions, comments, and notifications
- Production-grade authentication and authorization
- Transcript file upload in the deployed Supabase flow

> **Demo security note:** The current sign-in flow is a demo profile lookup with client-side password verification and public Supabase demo policies. It is not production authentication. Do not use real passwords or sensitive data. For production, replace it with Supabase Auth and restrictive Row Level Security policies.

## Technology

| Area | Technology |
| --- | --- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Lucide icons |
| Deployed data backend | Supabase Postgres + REST API |
| Local API prototype | FastAPI, SQLAlchemy, SQLite |
| Deployment | Vercel frontend + Supabase backend |

## Architecture

The production/demo deployment uses the browser-to-Supabase path below. The FastAPI/SQLite API remains in the repository as the original local backend prototype.

```text
Next.js on Vercel
      |
      | Supabase public URL + anon key
      v
Supabase Postgres
  ├── workspace_users
  ├── meetings
  ├── participants
  ├── transcript_segments
  └── action_items
```

## Setup

### 1. Configure Supabase

Create a Supabase project. In **SQL Editor**, run [supabase/schema.sql](supabase/schema.sql) to create and seed the meeting tables.

For the demo profile flow, also run:

```sql
create table if not exists public.workspace_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text,
  password_salt text,
  created_at timestamptz not null default now()
);

alter table public.workspace_users enable row level security;

create policy "Demo profiles can insert"
on public.workspace_users for insert to anon with check (true);

create policy "Demo profiles can read"
on public.workspace_users for select to anon using (true);
```

### 2. Configure environment variables

Create `frontend/.env.local` from [frontend/.env.example](frontend/.env.example):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env.local`. The `.gitignore` rules exclude it and other credential files.

### 3. Run locally

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Set the Vercel **Root Directory** to `frontend`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Vercel Environment Variables.
4. Deploy.

Pushes to `main` trigger future Vercel deployments automatically.

## Local FastAPI prototype

The original FastAPI + SQLite implementation remains available for local API experimentation:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload
```

The hosted frontend does not currently call this API.
