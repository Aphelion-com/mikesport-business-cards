# Mike Sport — Digital Business Cards

A production-ready web app for creating and managing **digital business card
landing pages** for Mike Sport employees. Each employee gets a polished,
mobile-first public page (e.g. `/rawad-halloun`), a downloadable **vCard
(.vcf)**, and a **QR code** that links to their page.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma +
PostgreSQL**, fully Docker-ready for deployment with **Hostinger Docker Manager
(Compose)**.

---

## ✨ Features

### Public landing page (`/[slug]`)
- Mobile-first, premium Mike Sport design (blue gradient header, white rounded card)
- Full name, position, mobile & company phone (with optional extension), email,
  website, address
- Profile image or auto-generated initials avatar
- Optional social links (LinkedIn, Instagram, Facebook, TikTok)
- **Save Contact** button → downloads a valid vCard 3.0 `.vcf`
- Clean icons, smooth spacing, looks great on iPhone

### Admin dashboard (`/admin`)
- Login page protected by username/password from environment variables
- Stats: total cards & active cards
- Create / edit / delete cards (with confirmation before delete)
- Activate / deactivate cards
- Search by name, email, or position
- Auto-generated slug from full name (with manual override)
- Show + copy public URL, preview button
- QR code preview + **download QR as PNG**

### API
- `GET /api/cards` — list (admin)
- `POST /api/cards` — create (admin)
- `GET|PATCH|DELETE /api/cards/[slug]` — manage (admin)
- `GET /api/cards/[slug]/vcf` — download vCard (public)
- `POST /api/auth/login` / `POST /api/auth/logout`

---

## 🧱 Tech stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Framework | Next.js 14 (App Router, standalone) |
| Language  | TypeScript                          |
| Styling   | Tailwind CSS                        |
| ORM       | Prisma                              |
| Database  | PostgreSQL 16                       |
| Auth      | HMAC-signed cookie (no paid libs)   |
| QR codes  | `qrcode` (MIT)                      |
| Icons     | `lucide-react` (ISC)               |

All libraries are free and open source.

---

## 🗄️ Data model (`Card`)

`id`, `fullName`, `slug` (unique), `position`, `mobilePhone`, `companyPhone`,
`extension`, `email`, `website`, `address`, `profileImageUrl`, `linkedinUrl`,
`instagramUrl`, `facebookUrl`, `tiktokUrl`, `isActive`, `createdAt`,
`updatedAt`.

Seed data includes **Rawad Halloun** and **Simon Haddad**.

---

## 🔐 Environment variables

Copy `.env.example` to `.env` and fill in real values:

| Variable               | Description                                          |
|------------------------|------------------------------------------------------|
| `POSTGRES_DB`          | Postgres database name                               |
| `POSTGRES_USER`        | Postgres username                                    |
| `POSTGRES_PASSWORD`    | Postgres password                                    |
| `DATABASE_URL`         | Prisma connection string (host = `db` in Compose)    |
| `NEXT_PUBLIC_BASE_URL` | Public base URL, e.g. `https://cards.mikesport.tech` |
| `ADMIN_USERNAME`       | Admin login username                                 |
| `ADMIN_PASSWORD`       | Admin login password                                 |
| `AUTH_SECRET`          | Long random secret for signing sessions (≥32 chars)  |

> Generate a strong `AUTH_SECRET` with: `openssl rand -base64 32`

---

## 🚀 Deploy with Docker (Hostinger Docker Manager → Compose)

The app runs on **host port `3015`** (container port `3000`), with a persistent
PostgreSQL volume.

### Steps

1. **Upload the project** to your server (or pull from Git).

2. **Create the `.env` file** next to `docker-compose.yml`:
   ```bash
   cp .env.example .env
   # then edit .env with real values
   ```
   - Make sure `DATABASE_URL` uses host **`db`** and the same
     `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` you set.
   - Set `NEXT_PUBLIC_BASE_URL` to your real domain (no trailing slash).

3. In **Hostinger Docker Manager**, create a new project using **Compose** and
   paste / point it to this repo's `docker-compose.yml`, or run manually:
   ```bash
   docker compose up -d --build
   ```

4. On first start, the app container automatically:
   - waits for PostgreSQL,
   - syncs the schema (`prisma db push`),
   - seeds Rawad Halloun & Simon Haddad (idempotent).

5. **Point your domain** (e.g. `cards.mikesport.tech`) at the server and proxy
   it to **port 3015** (Hostinger reverse proxy / domain settings).

6. Open:
   - Public card: `https://cards.mikesport.tech/rawad-halloun`
   - Admin: `https://cards.mikesport.tech/admin`

### Useful commands
```bash
docker compose logs -f app      # view app logs
docker compose restart app      # restart the app
docker compose down             # stop (keeps the pgdata volume)
docker compose down -v          # stop AND delete the database volume
```

> To skip seeding on startup, set `SKIP_SEED=1` in the app environment.

---

## 💻 Local development

Requires Node.js 20+ and a local PostgreSQL (or use the Docker `db` service).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   For local dev, set DATABASE_URL host to localhost, e.g.:
#   postgresql://mikesport:password@localhost:5432/mikesport_cards?schema=public
#   and NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 3. Sync schema + seed
npm run prisma:generate
npm run prisma:push
npm run seed

# 4. Run the dev server
npm run dev
# → http://localhost:3000
```

You can spin up just the database with:
```bash
docker compose up -d db
```

---

## 🧩 Project structure

```
prisma/
  schema.prisma        # Card model
  seed.ts              # Rawad Halloun + Simon Haddad
src/
  app/
    [slug]/page.tsx           # public landing page
    admin/                    # login + dashboard + create/edit
    api/
      auth/                   # login / logout
      cards/                  # CRUD + /[slug]/vcf
    error.tsx / not-found.tsx
  components/                 # Dashboard, CardForm, QrModal, etc.
  lib/                        # prisma, auth, validation, slug, vcard
  middleware.ts               # protects /admin
Dockerfile
docker-compose.yml
docker-entrypoint.sh
.env.example
```

---

## 🔎 Notes

- The vCard route returns **vCard 3.0** with name, title, organization
  (Mike Sport), mobile & company phone, email, website, and address.
- QR codes encode `NEXT_PUBLIC_BASE_URL + /slug` and can be downloaded as PNG
  from the dashboard.
- Inactive cards return a **404** on their public page and vCard route.
- Admin routes are protected by middleware; API mutations re-check the session.

© Mike Sport
