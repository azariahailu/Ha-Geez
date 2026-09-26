# ሀ ግእዝ

A community **Ge'ez → Amharic** lexicon. Readers search published headwords, or submit a word for review. Nothing reaches the public dictionary until an editor approves it. Editors can also load a full word list from Excel or CSV.

The pages are a Next.js app meant to run locally with one command and to deploy on Vercel.

## Local

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

No database server is required. The first run creates `data/ha-geez.db` (SQLite, via libSQL) and fills it with a short demonstration lexicon — classroom glosses, not a critical edition. Delete that file and restart to restore the seed.

The local admin password is `dev-ha-geez` until you set `ADMIN_PASSWORD`.

```bash
npm run check   # parser, Fidel order, search, review, and import
npm run lint
npm run build
```

## Pages

| Path | What it is |
| --- | --- |
| `/` | A short introduction to Ge'ez, and to this lexicon |
| `/dictionary` | Search by Ge'ez or Amharic, filter by Fidel family |
| `/about` | A longer paraphrase of the language's history |
| `/submit` | One or more word tickets for the review queue |
| `/admin` | Approve, edit, decline, and import a spreadsheet |

Search ignores extra spaces, so `ቤተ ክርስቲያን` and `ቤተክርስቲያን` match. Fidel has no case. A query matches the headword, the origin, or the Amharic definition.

## Admin

Sign in at `/admin`.

- **Pending** — edit the headword, origin, or definition, then approve. Approval publishes the entry. If that headword is already published, the existing entry is updated and the ticket is removed.
- **Decline** — keeps the ticket out of the lexicon. It can be restored later.
- **Published** — correct a live entry, or send it back to the queue.
- **Import** — load `.xlsx`, `.csv`, or `.tsv`.

In production, set `ADMIN_PASSWORD`. The dev password is refused when `NODE_ENV` is `production`. The session is an httpOnly cookie lasting seven days. Set `ADMIN_SESSION_SECRET` if you want to rotate sessions without changing the password.

## Importing the full sheet

The workbook that was meant to seed the lexicon uses three columns:

| Column | Content | Required |
| --- | --- | --- |
| 1 | Ge'ez word (letters / lemma) | yes |
| 2 | Origin | no |
| 3 | Amharic definition | yes |

1. Sign in at `/admin` and open **Import**.
2. Choose the `.xlsx` (first worksheet) or a CSV export of that sheet.
3. **Preview** shows the first rows and any skipped lines. **Import into the lexicon** writes them.
4. A header row is optional. These names are recognized, in any order: `word`, `lemma`, `geez`, `letters`, `ቃል`, `ግዕዝ`, `origin`, `source`, `መነሻ`, `ምንጭ`, `definition`, `gloss`, `amharic`, `ትርጉም`.
5. Without a recognized header, columns are read in the order word, origin, definition. Do not leave an index column in front.
6. A title row above the header is ignored. Rows missing a word or a definition are skipped and listed.
7. If a published headword already exists, import updates its origin and definition. Pending tickets are not overwritten.
8. Older `.xls` files are not read. In Excel, use Save As → `.xlsx` or CSV (UTF-8).

Try the samples before the full sheet:

- `data/sample-import.csv`
- `data/sample-import.xlsx`

`ጸሎት` is already in the demo seed, so importing the sample updates that entry and adds `እንስሳ`, `ወርኅ`, and `በግ`.

Up to 20,000 rows and 8 MB per file. Split anything larger.

## Environment

Copy `.env.example` to `.env.local` if you want to override the defaults.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Editor password. Required on Vercel. Local default: `dev-ha-geez`. |
| `ADMIN_SESSION_SECRET` | Optional signing secret for the admin cookie. |
| `TURSO_DATABASE_URL` | `libsql://…` database URL. Unset locally to use SQLite. |
| `TURSO_AUTH_TOKEN` | Turso token. Required when the URL is set. |

`LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` are accepted as aliases. A `postgres://` URL is intentionally unused: one SQLite-compatible schema serves both the local file and Turso, so `npm run dev` does not need Docker or a Neon project.

## Deploy on Vercel

The app is a standard Next.js build. Vercel runs `next build`. The server needs a hosted libSQL database because the local file is not persistent there.

1. Create a free [Turso](https://turso.tech) database:

   ```bash
   turso db create ha-geez
   turso db show ha-geez --url
   turso db tokens create ha-geez
   ```

2. Push this project to the git host Vercel will build from.
3. In Vercel, import the repository as a Next.js project. Do not set a custom build command.
4. Add environment variables:
   - `ADMIN_PASSWORD` — a long password, not the local default
   - `TURSO_DATABASE_URL` — the `libsql://` URL
   - `TURSO_AUTH_TOKEN` — the token from the step above
5. Deploy, open `/admin`, and import the full sheet.

The first request against an empty Turso database loads the same demonstration seed as local dev. Importing the real sheet updates and extends it.

If this repo lives on Origin, connect that Origin repository to the Vercel project (Vercel’s git integration, or Origin’s Vercel connection) so production builds track the branch. The app itself does not need an extra adapter: it is the usual Next.js output.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- libSQL — SQLite file locally, Turso on Vercel
- Noto Sans Ethiopic and Noto Serif Ethiopic for Fidel

## Language note

The home page and About page paraphrase Isaias Haileab Gebrai, “Ge'ez” (Mahibere Kidusan / EOTC Sunday School Department, 17 February 2022), [eotcmk.org/e/geez](https://eotcmk.org/e/geez/). They are not a copy of that article.
