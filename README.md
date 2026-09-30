# RNK2 Properties Ltd — Marketing Website

A MERN-stack marketing site for a UK residential design-and-build company.
The differentiator: one team carries a project from architectural drawings
through planning/building-regs to a finished, guaranteed build.

Monorepo with two independent apps:

```
rnk2-properties/
  client/   React + Vite (plain CSS, no framework)
  server/   Express + Mongoose API
```

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local `mongod`, or a connection string from Atlas)

## 1. Install dependencies

From the `rnk2-properties/` directory, install each app separately:

```bash
cd rnk2-properties/server
npm install

cd ../client
npm install
```

## 2. Configure the server

```bash
cd rnk2-properties/server
cp .env.example .env
```

Edit `.env` if your MongoDB URI, port, or client origin differ from the
defaults:

```
MONGODB_URI=mongodb://127.0.0.1:27017/rnk2-properties
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

## 3. Run both apps (two terminals)

**Terminal 1 — API server** (starts on `http://localhost:5000`):

```bash
cd rnk2-properties/server
npm run dev
```

**Terminal 2 — client** (starts on `http://localhost:5173`):

```bash
cd rnk2-properties/client
npm run dev
```

The Vite dev server proxies any `/api/*` request to `http://localhost:5000`
(see `client/vite.config.js`), so the React app talks to the API with plain
relative fetches — no CORS juggling needed in development.

Open `http://localhost:5173` in a browser.

## Routes

The client is a single-page app (`react-router-dom`):

| Route | Page |
| --- | --- |
| `/` | Homepage — hero, capabilities, work grid, process, testimonial, quote form |
| `/work/:slug` | Individual project page — brief, approach, key facts, related projects |

Project slugs, photos, and detail copy (brief/approach/location/duration)
are defined per project in `client/src/siteConfig.js` (`site.work`).
Add a project by adding an entry there — a page is generated automatically,
no new component needed.

## Scripts

**server/package.json**

| Script        | What it does                                   |
| ------------- | ----------------------------------------------- |
| `npm run dev` | Runs the API with `node --watch` (auto-restart) |
| `npm start`   | Runs the API once, no watcher (production)      |

**client/package.json**

| Script          | What it does                          |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts the Vite dev server             |
| `npm run build` | Builds a production bundle to `dist/`  |
| `npm run preview` | Serves the production build locally |
| `npm run lint`  | Runs ESLint over the client source     |

## API

`POST /api/quotes` — creates a quote request.

Body (JSON):

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "07123 456789",
  "projectType": "Extension",
  "postcode": "RG1 8EX",
  "message": "Optional details about the project."
}
```

`projectType` must be one of: `Extension`, `Conversion`, `New Build`,
`Design only`.

Responses:
- `201` — `{ ok: true, quote: { id, createdAt } }`
- `400` — `{ ok: false, errors: { field: "message", ... } }`

`GET /api/health` — basic liveness check.

## Swapping in real company details

Every placeholder figure, name, and contact detail used on the site
(stats, track record, testimonial, project names, phone/email, company
registration number, areas covered) lives in one file:

```
client/src/siteConfig.js
```

Edit that file and the whole site updates — no need to hunt through
components. If an image fails to load, the card falls back to a
blueprint-blue gradient automatically.

**All photos currently on the site are placeholders** — real UK
construction/property photos chosen to be safe to use (no visible people,
number plates, or third-party business signage), but they are not RNK2's
own work and must be replaced with real project photography before launch.
Swap the files in `client/public/images/` (same filenames) or update the
paths in `siteConfig.js`.

| File | Used for | Source | License |
| --- | --- | --- | --- |
| `hero.jpg` | Hero background | [Pxhere via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Architecture-villa-house-building-home-construction-542165.jpg) | CC0 (no attribution required) |
| `work-1.jpg` | Riverside Extension | [Jonathan Thacker, Geograph](https://commons.wikimedia.org/wiki/File:The_trials_of_having_an_extension_built_at_the_rear_of_the_house_-_geograph.org.uk_-_6905478.jpg) | CC BY-SA 2.0 |
| `work-2.jpg` | Oakfield Loft Conversion | [Norman Caesar, Geograph](https://commons.wikimedia.org/wiki/File:Loft_Conversion_-_geograph.org.uk_-_2705677.jpg) | CC BY-SA 2.0 |
| `work-3.jpg` | The Beechwood House | [Wilson Adams, Geograph](https://commons.wikimedia.org/wiki/File:A_New_House_under_construction_-_geograph.org.uk_-_352294.jpg) | CC BY-SA 2.0 |
| `work-4.jpg` | Mill Lane Garage Conversion | [Bob Harvey, Geograph](https://commons.wikimedia.org/wiki/File:Double_detached_garage_-_geograph.org.uk_-_6660718.jpg) | CC BY-SA 2.0 |

The CC BY-SA images require attribution for as long as they remain on the
site (credit + link + license, as listed above). Once replaced with real
RNK2 photography, this attribution requirement no longer applies and this
table can be deleted.

## Production build

```bash
cd rnk2-properties/client
npm run build
```

Outputs a static bundle to `client/dist/`, which can be served by any static
host or by the Express server behind a reverse proxy. The API (`server/`)
deploys as a standard Node/Express app — set `MONGODB_URI`, `PORT`, and
`CLIENT_ORIGIN` as environment variables in your hosting provider.

The site uses client-side routing (project detail pages live at
`/work/:slug`). Your static host needs an SPA fallback — unmatched routes
must serve `client/dist/index.html` instead of a 404, or a direct link /
refresh on a project page will break. `vite preview` and most static
hosts (Netlify, Vercel, Cloudflare Pages) do this automatically; if
self-hosting with nginx or similar, add a fallback rule (e.g.
`try_files $uri /index.html;`).
