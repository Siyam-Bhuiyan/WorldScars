# WorldScars deploy checklist (Neon + Render + Netlify + UptimeRobot)

Everything in the repo is already done and pushed. These are the only steps left, and they need your accounts.
Secret values are NOT in this file. Copy them from your local `backend/.env` (it has all 4 you need).

Total: about 15 minutes. Do the steps in order.

---

## 1. Neon: database (2 min)
1. Go to https://neon.tech and sign in with GitHub.
2. Create a project (any name, e.g. `worldscars`).
3. Click **Connect** and copy the connection string.
   It looks like `postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require`.
   Keep this tab open: you paste it in step 2.

## 2. Render: backend (5 min)
1. Go to https://dashboard.render.com and sign in with GitHub.
2. **New +** > **Blueprint** > pick the `WorldScars` repo > **Apply**.
3. When it asks for variables, paste these. The Cloudinary and ADMIN_TOKEN values come from `backend/.env`.

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | the Neon string from step 1 |
   | `CLOUDINARY_CLOUD_NAME` | from `backend/.env` |
   | `c` | from `backend/.env` |
   | `CLOUDINARY_API_SECRET` | from `backend/.env` |
   | `ADMIN_TOKEN` | from `backend/.env` |
   | `FRONTEND_URL` | leave empty for now |

4. Wait for **Live**. Copy the service URL (`https://worldscars-backend-xxxx.onrender.com`).
5. Check: open `<that URL>/api/health`. You should see `{"status":"ok"}`.

## 3. Netlify: frontend (3 min)
1. Go to https://app.netlify.com and sign in with GitHub.
2. **Add new site** > **Import an existing project** > GitHub > `WorldScars`.
   Build settings fill themselves in from `netlify.toml`. Don't change them.
3. Before deploying, open **Environment variables** and add:
   - `VITE_API_BASE_URL` = the Render URL from step 2 (no trailing `/`)
4. **Deploy**. Copy your Netlify URL (`https://something.netlify.app`).

## 4. Render again: allow the frontend (1 min)
1. Render > your service > **Environment**.
2. Set `FRONTEND_URL` = your Netlify URL from step 3 (no trailing `/`). Save. It redeploys by itself.

## 5. UptimeRobot: keep it awake, always live (2 min)
1. Go to https://uptimerobot.com and make a free account.
2. **Add New Monitor**:
   - Type: **HTTP(s)**
   - URL: `<your Render URL>/api/health`
   - Interval: **5 minutes**
3. Save.

## 6. Test (2 min)
1. Open your Netlify site.
2. Go to **File an exhibit**, pick an image, add a title, type your clearance key (the `ADMIN_TOKEN`), and submit.
3. Check that the exhibit shows up in the archive.
4. Open it and test delete (the control is at the bottom of the case file).

---

## What I can do for you
- Read any error or log you paste and fix the code or config, then push it.
- Move your old images (they're still in Cloudinary) into the new database. Send me your old Railway database connection string and I'll write the import.
- Add a custom domain setup guide once you have a domain.

## If something goes wrong
| Symptom | Likely cause |
|---|---|
| Site loads, archive shows "unreachable" | `VITE_API_BASE_URL` is wrong, or `FRONTEND_URL` isn't set (step 4) |
| First page load takes about 1 minute | Render woke from sleep: step 5 isn't set up yet |
| Upload says "Invalid clearance key" | The key you typed doesn't match `ADMIN_TOKEN` on Render |
| Render build fails | Copy the log and send it to me |
