# Butterflies.ai

A polished meeting-intelligence workspace inspired by the core Fireflies-style workflow: searchable meeting records, synchronized transcripts, AI summaries, and action tracking.

## Features

- Responsive SaaS dashboard with meeting search, participant avatars, skeleton loading, and empty states
- Meeting detail view with a simulated media player and synchronized transcript
- AI summary, topics, chapters, and action items
- REST API for meeting and action-item CRUD
- TXT, JSON, and VTT transcript imports
- SQLite persistence and automatic realistic seed data
- Coming-soon integration gallery

## Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Radix primitives |
| Backend | FastAPI, SQLAlchemy |
| Database | SQLite |

## Structure

```text
frontend/                 Next.js application
  app/                    dashboard, detail and integration routes
  components/             shared shell, navigation and meeting UI
  lib/                    API client and types
backend/app/              FastAPI API, ORM models and seed data
```

## Data model

`Meeting` has one-to-many relationships to `Participant`, `TranscriptSegment`, and `ActionItem`. Meeting summaries, topics, and chapters are stored with each meeting; transcript content is normalized into its own table.

## Run locally

1. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a Python environment and install backend dependencies:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

3. Start the seeded backend:

   ```bash
   python -m uvicorn app.main:app --app-dir backend --reload
   ```

4. Start Next.js in a second terminal:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` when deploying separately.

### Supabase authentication

Create a Supabase project, enable Email authentication, then create `frontend/.env.local` from `.env.example` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The `/signup` and `/login` pages use Supabase Auth directly with the public anon key.

## API

- `GET /meetings?search=` and `GET /meetings/{id}`
- `POST`, `PUT`, `DELETE /meetings/{id}`
- `POST /meetings/{id}/actions`, `PATCH`, `DELETE /actions/{id}`
- `POST /upload/{meeting_id}` for `.txt`, `.json`, or `.vtt`

## Assumptions

Authentication uses a default workspace user. Recording playback is a polished simulated player; media storage and speech-to-text are intentionally future integrations.
