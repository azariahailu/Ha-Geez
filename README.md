# ሀ ግእዝ

A community **Ge'ez → Amharic** lexicon. Readers search published headwords, or submit a word. A submitted word is saved and appears in the public dictionary when it is added. The lexicon desk can also load a full word list from Excel or CSV.

The pages are a Next.js app meant to run locally with one command and to deploy on Vercel.

## Local

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

No database server is required. The first run creates `data/ha-geez.db` (SQLite, via libSQL) and fills it from `data/geez-lexicon.xlsx`. The workbook has 13,080 rows: the first is the introduction, and the other 13,079 are words. A repeated spelling stays as its own word. Nine of those words have an origin and no definition. Delete that file and restart to load the workbook again.

There is no default admin password. The first visit to `/admin` asks you to create one.

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
| `/about` | A longer paraphrase of the language's history, with the church seal |
| `/about-ha-geez` | What this dictionary is, its sources, and a short tour |
| `/submit` | Send one or more words |
| `/contact` | Send a message. It is kept apart from word submissions |
| `/admin` | Review words, read messages, edit page text, and import a spreadsheet |
| `/admin/reset` | Replace a forgotten password with the recovery code |

Search ignores extra spaces, so `ቤተ ክርስቲያን` and `ቤተክርስቲያን` match. Fidel has no case. A typed query returns headwords that contain it, with the exact word first. If no headword matches, the search uses the origin and the Amharic definition.

## Admin

The first visit to `/admin` shows a form to create a password. That form does not appear again. The password is stored as a scrypt hash in `admin_auth`. Nothing in the environment sets it, and there is no default.

After the password is saved, a recovery code is shown once. Copy it, then choose **I have saved it**. The code is the only way to replace a forgotten password. It is not stored in a form that can be shown again.

`/admin/reset` asks for that code and a new password. The old code stops working, the old session ends, and a new recovery code is shown once. Five wrong passwords or recovery codes lock both pages for 15 minutes.

If the password and the recovery code are both lost, delete the single `admin_auth` row with a database client. The next visit to `/admin` asks for a new password. The word list stays. Deleting `data/ha-geez.db` also clears the password, and reloads the workbook.

Once signed in:

- **Pending** — edit the headword, origin, or definition, then approve. Approval publishes that ticket as its own word. A spelling that is already listed stays listed beside it.
- **Decline** — keeps the ticket out of the lexicon. It can be restored later.
- **Published** — correct a live entry, or send it back to the queue.
- **Import** — load `.xlsx`, `.csv`, or `.tsv`.
- **Messages** — notes from Contact us. They are not mixed with words waiting to be added.
- **Pages** — edit the wording on any public page. The heading of Dictionary, About Ge'ez, About ሀ ግእዝ, and Contact us is also the tab. Capitals are kept as typed. Saving the original text clears that change. Images and the tour video can be pointed at another address from the same screen. The word list itself stays under Published.

Page text, contact messages, and the word list live in the same database. Deleting `data/ha-geez.db` clears the password, the edited wording, the messages, and reloads the workbook.

The session is an httpOnly cookie lasting seven days. Replacing the password signs out other sessions.

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
7. A spelling that is listed once is updated. A spelling that is already listed more than once is left as it is, so a separate sense is not overwritten. Two rows of a new spelling are both added. Pending tickets are not overwritten. Do not import the bundled workbook again: the repeated spellings in it would be skipped, and a second copy is not what that step is for.
8. Older `.xls` files are not read. In Excel, use Save As → `.xlsx` or CSV (UTF-8).

Try the samples before the full sheet:

- `data/sample-import.csv`
- `data/sample-import.xlsx`

The bundled workbook is already loaded on an empty database. Importing the sample updates any of those four words that are already listed and adds the rest.

Up to 20,000 rows and 8 MB per file. Split anything larger.

## Environment

Copy `.env.example` to `.env.local` if you want to override the defaults.

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | `libsql://…` database URL. Unset locally to use SQLite. |
| `TURSO_AUTH_TOKEN` | Turso token. Required when the URL is set. |

`LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` are accepted as aliases. A `postgres://` URL is intentionally unused: one SQLite-compatible schema serves both the local file and Turso, so `npm run dev` does not need Docker or a Neon project.

## Deploy on Vercel

The app is a standard Next.js build. `vercel.json` runs `npm run build`, which is `next build` and then a seed of the hosted database. The server needs a hosted libSQL database because the local file is not persistent there. Page wording, contact messages, the word list, and the admin password all live in that database and are read on each visit. An edit saved in the deployed admin updates the live pages without another deploy. Edits made only in a local `data/ha-geez.db` stay on that computer.

Search waits 400ms after the last keystroke, and the Search button looks the word up at once. An identical lookup is kept for ten minutes, at the edge and in the server cache, and is dropped when a word is published, edited, or imported. The dictionary is not baked into static files: a newly added word has to be able to appear without another deploy.

This project has to be on GitHub before Vercel can build it. From the Cursor project, use **Create repo** and choose GitHub. The name can be `ha-geez`.

1. Create a free [Turso](https://turso.tech) database named `ha-geez`. In the Turso dashboard, open the database, copy the `libsql://` URL, and create a token. Or, with the Turso CLI:

   ```bash
   turso db create ha-geez
   turso db show ha-geez --url
   turso db tokens create ha-geez
   ```

2. In [Vercel](https://vercel.com), choose **Add New → Project** and import the GitHub repository. Leave the framework as Next.js. The repository already sets the build command.
3. Add environment variables for Production. Leave them available to the build (the default). Do not commit them.
   - `TURSO_DATABASE_URL` — the `libsql://` URL
   - `TURSO_AUTH_TOKEN` — the token from the step above
4. Deploy. The build loads `data/geez-lexicon.xlsx` into Turso, 13,079 words, in batches, and can continue if it is interrupted. If the token is hidden from the build, the first visits load the word list instead. Refresh once if the first open fails.
5. Open `/admin` on the live address and create the password before sharing that address. Keep the recovery code. It is shown once. The password is not an environment variable, and the one on your computer does not carry over.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- libSQL — SQLite file locally, Turso on Vercel
- Noto Sans Ethiopic and Noto Serif Ethiopic for Fidel

## Language note

About Ge'ez paraphrases Isaias Haileab Gebrai, “Ge'ez” (Mahibere Kidusan / EOTC Sunday School Department, 17 February 2022), [eotcmk.org/e/geez](https://eotcmk.org/e/geez/). It is not a copy of that article. The citation appears once, at the start of that page.
