# WorldScars

<p align="center">
  <a href="https://worldscars-archive.netlify.app">
    <img src="docs/screenshot.jpg" alt="WorldScars: The world watched." width="100%">
  </a>
</p>

<p align="center">
  <a href="https://worldscars-archive.netlify.app"><b>▶ &nbsp;LIVE SITE: worldscars-archive.netlify.app</b></a>
</p>

<p align="center">
  <a href="https://worldscars-archive.netlify.app"><img alt="Live" src="https://img.shields.io/badge/LIVE-open%20the%20archive-c0160f?style=for-the-badge"></a>
  <a href="https://worldscars-backend.onrender.com/api/health"><img alt="API" src="https://img.shields.io/badge/API-Render-0a0a09?style=for-the-badge"></a>
</p>

**The world watched. Then it scrolled past.**

WorldScars is an archive of the images the world saw for a moment and forgot: earthquakes, wars, camps, the people inside them. Every image is filed as an *exhibit* with a location, a source and a testimony, so it can't be quietly lost.

The interface is designed as a raw evidence archive: black and bone-white, one blood-red accent, film grain, torn case files and redaction bars.

## Stack

| Layer    | Tech |
| -------- | ---- |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 3, React Router 7, served by nginx |
| Backend  | Spring Boot 3.5 (Java 17), Spring Data JPA, PostgreSQL |
| Images   | Cloudinary (stored in the `worldscars/` folder, resized on the fly) |
| Deploy   | Docker; Railway (backend from the root `Dockerfile`, frontend from `frontend/Dockerfile`) |

## Pages

| Route          | Page |
| -------------- | ---- |
| `/`            | Hero ("The world watched."), visitor protocol, latest entries |
| `/archive`     | Searchable, paginated archive of exhibits |
| `/exhibit/:id` | Dossier: image, case file, testimony, expunge control |
| `/file`        | Exhibit intake form (needs the clearance key) |

Old links (`/gallery`, `/upload`, `/image/:id`) redirect to the new routes.

## Running locally

### With Docker (everything)

```bash
cp .env.example .env      # fill in Cloudinary keys + ADMIN_TOKEN
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8080/api/health

### Without Docker

Backend (needs a Postgres database):

```bash
cd backend
export DATABASE_URL=jdbc:postgresql://localhost:5432/worldscars
export DATABASE_USERNAME=postgres DATABASE_PASSWORD=postgres
export CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=...
export ADMIN_TOKEN=some-long-random-string
./mvnw spring-boot:run
```

Frontend:

```bash
cd frontend
echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local
npm install
npm run dev               # http://localhost:5173
```

Tests: `cd backend && ./mvnw test` (uses an in-memory H2 database and a mocked Cloudinary).

## Environment variables

### Backend

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `DATABASE_URL` | yes | JDBC URL, e.g. `jdbc:postgresql://host:5432/db` |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | yes | Database credentials |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | Image storage. **Never commit these.** |
| `ADMIN_TOKEN` | for writes | Clearance key for uploading and deleting. If unset, all writes are refused. |
| `FRONTEND_URL` | no | Extra CORS origin(s), comma separated. localhost and the Railway frontend are always allowed. |
| `PORT` | no | Defaults to 8080 |

### Frontend (build time)

| Variable | Purpose |
| -------- | ------- |
| `VITE_API_BASE_URL` | Backend base URL. Vite bakes it in at **build** time (Docker build arg / Railway variable). Defaults to the production Railway backend. |

## API

Errors are always `{"error": "message"}` with a meaningful status (400, 401, 404, 413, 500).

| Method | Path | Auth | Notes |
| ------ | ---- | ---- | ----- |
| GET | `/api/health` | – | `{"status":"ok"}` |
| GET | `/api/images?q=&page=0&size=24` | – | Newest first. Returns `{items, page, size, totalItems, totalPages, last}`. `q` searches title, location and description. |
| GET | `/api/images/{id}` | – | 404 if missing |
| POST | `/api/images/upload` | `X-Admin-Token` | multipart: `file` (JPEG/PNG/WebP/GIF/AVIF, ≤10 MB), `title`, `description?`, `location?`, `source?` (http/https only) → 201 |
| DELETE | `/api/images/{id}` | `X-Admin-Token` | Deletes the record **and** the Cloudinary file |

## Data model

`images`: `id`, `title`, `description`, `image_url`, `public_id` (Cloudinary id, new), `location`, `source`, `uploaded_at`. The schema updates itself (`ddl-auto=update`). Records filed before `public_id` existed still clean up correctly, because the id is derived from their URL.

## Deploying (Netlify + Render + Neon)

1. **Database (Neon):** create a project and copy the connection string (`postgresql://user:pass@host/db?sslmode=require`). The backend accepts that format directly as `DATABASE_URL`.
2. **Backend (Render):** New → Blueprint → pick this repo (uses `render.yaml`), then fill in `DATABASE_URL`, `CLOUDINARY_*`, `ADMIN_TOKEN`. Leave `FRONTEND_URL` until step 3. The free plan sleeps when idle, so the first request after a pause is slow.
3. **Frontend (Netlify):** import the repo (settings come from `netlify.toml`) and set `VITE_API_BASE_URL` to the Render URL. Then put the Netlify URL into the backend's `FRONTEND_URL` on Render.
