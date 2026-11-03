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

The defaults work for local development. See `.env.example` for what each
variable does — in production `MONGODB_URI` and `JWT_SECRET` are required and
the server refuses to start without them.

## 2b. Create a CMS login

Projects and company details are managed in the built-in CMS at `/admin`.
Create the first login (you'll be asked for a password, min. 10 characters):

```bash
cd rnk2-properties/server
npm run create-admin -- someone@example.com "Their Name"
```

Running it again for an existing email resets that person's password. Once
signed in, further people can be added from **Account** in the CMS.

## 3. Run both apps (two terminals)

**Terminal 1 — API server** (starts on `http://localhost:5001`):

```bash
cd rnk2-properties/server
npm run dev
```

**Terminal 2 — client** (starts on `http://localhost:5173`):

```bash
cd rnk2-properties/client
npm run dev
```

The Vite dev server proxies `/api/*` and `/uploads/*` to `http://localhost:5001`
(see `client/vite.config.js`), so the React app talks to the API with plain
relative fetches — no CORS juggling needed in development.

Open `http://localhost:5173` for the site and `http://localhost:5173/admin`
for the CMS.

No local MongoDB? On macOS:
`brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage — hero, capabilities, work grid, coverage map, process, testimonial, quote form |
| `/work/:slug` | Individual project page — gallery, before/after slider, facts, brief, approach, result, timeline, related projects |
| `/privacy-policy` | Privacy policy |
| `/admin` | CMS (sign-in required) — projects, company details, enquiries, users |

## Content (CMS)

All projects and company-specific details are entered by RNK2 in the CMS —
nothing in the codebase needs editing to add work or change a phone number.

- **Projects** start as drafts and only appear on the public site once
  published. Publishing requires a name, type, town, county, brief and at least
  one photo. The first photo is the cover; an optional *before* photo enables
  the before/after slider. Sections left blank are hidden on the project page.
- **Map pins** are placed automatically from the town + county via
  [postcodes.io](https://postcodes.io) (free, UK-only, no key). Only the town
  name is ever sent — no street or postcode is stored. If a town can't be
  found the project simply has no pin.
- **Photos** are uploaded through the CMS, re-encoded to WebP at two sizes
  (2000px + 640px thumbnail), and **all metadata is stripped**, including the
  GPS location phones embed in photos. Files are written to `UPLOAD_DIR`
  (default `server/uploads/`) and served at `/uploads/*`.
- **Company details** (stats, contact, registration numbers, homepage review,
  hero photo) live under *Company details*. Empty fields are hidden on the site
  rather than showing placeholders; with nothing filled in, the homepage simply
  shows no stats, no work section and no map.
- **Enquiries** from the quote form can be read and deleted under *Enquiries*.

Fixed legal copy (data retention period, processors, policy date) stays in
`client/src/siteConfig.js`.

## Scripts

**server/package.json**

| Script        | What it does                                   |
| ------------- | ----------------------------------------------- |
| `npm run dev` | Runs the API with `node --watch` (auto-restart) |
| `npm start`   | Runs in production mode (API + built client)    |
| `npm run create-admin -- email "Name"` | Creates a CMS login, or resets its password |

**client/package.json**

| Script          | What it does                          |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts the Vite dev server             |
| `npm run build` | Builds a production bundle to `dist/`  |
| `npm run preview` | Serves the production build locally |
| `npm run lint`  | Runs ESLint over the client source     |

## API

Public:

- `GET /api/site` — company settings + **published** projects (drafts are never returned).
- `POST /api/quotes` — creates a quote request. Body: `name`, `email`, `phone`,
  `projectType` (`Extension` | `Conversion` | `New Build` | `Design only`),
  `postcode`, optional `message`, and `consent: true`. Returns `201` or `400`
  with `{ ok: false, errors: { field: message } }`.
- `GET /api/health` — liveness check.

CMS (`/api/auth/*`, `/api/admin/*`): session is a 7-day JWT in an `httpOnly`,
`SameSite=Strict` cookie (`Secure` in production). Every admin write must also
send `X-RNK2-Admin: 1` as a CSRF guard. Sign-in is rate limited (10 failed
attempts per 15 minutes per IP). Changing a password signs out other sessions.

## Photos

The only bundled photo is `client/public/images/hero.jpg` (CC0 — [Pxhere via
Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Architecture-villa-house-building-home-construction-542165.jpg),
no attribution required), used as the homepage background until a hero photo
is uploaded under *Company details*. All project photos come from the CMS.

## Coverage map tiles

The homepage coverage map (`client/src/components/CoverageMapView.jsx`) is a
self-hosted [MapLibre GL JS](https://maplibre.org/) map reading a
[PMTiles](https://docs.protomaps.com/) file — no third-party tile server, no
API key, and no runtime requests to anyone outside this site. That file and
its fonts/sprites are generated **once, by the developer**, not at build
time, and checked into `client/public/`:

```
client/public/tiles/thames-valley.pmtiles   # regional vector tiles
client/public/fonts/Noto Sans {Regular,Medium,Italic}/*.pbf   # map label glyphs
client/public/sprites/v4/light*.{json,png}  # map icon sprite
```

**Regenerating the tile file** (only needed if a project lands outside the
current bounding box — otherwise this same file supports unlimited new pins,
since markers are drawn from CMS project data, not from the tiles):

```bash
brew install pmtiles   # one-time, Homebrew core formula

# Check https://build.protomaps.com/ for the current dated build filename
# (rotates every few days), then:
pmtiles extract \
  https://build.protomaps.com/<YYYYMMDD>.pmtiles \
  client/public/tiles/thames-valley.pmtiles \
  --bbox=-1.75,50.70,-0.30,52.05 \
  --maxzoom=12
```

`--maxzoom=12` matches the map's `clusterMaxZoom` and keeps the file small
(~28MB for this region) — this is a regional-context basemap, not
building-level detail, and MapLibre overzooms native tiles automatically for
users who zoom in further, so raising it just grows the file for little
visual benefit. If extraction fails partway with an HTTP 524 (a Cloudflare
timeout on the source archive), it's usually transient — retry, or drop to
`--maxzoom=11`/`10` if it keeps failing at 12.

**Regenerating fonts/sprites** (only needed if upgrading `@protomaps/basemaps`
to a version expecting a newer sprite/glyph set): copy `fonts/Noto Sans
Regular`, `fonts/Noto Sans Medium`, `fonts/Noto Sans Italic`, and
`sprites/v4/light*` from
[protomaps/basemaps-assets](https://github.com/protomaps/basemaps-assets)
into the paths above.

## Going live — checklist

The Express server serves the API, uploaded photos **and** the built React
app from one process, so a single Node host is enough. It already provides
the SPA fallback for `/work/:slug` and `/admin/*`, long-lived caching for
hashed assets and uploads, a strict Content-Security-Policy and other
security headers (helmet), and byte-range support for the map tiles.

### 1. Database (MongoDB Atlas, free tier is fine)

- [ ] Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create
      a free **M0** cluster in the London region (`eu-west-2`).
- [ ] **Database Access** → add a database user with a long generated password.
- [ ] **Network Access** → add `0.0.0.0/0` (or your host's fixed outbound IP if
      it has one).
- [ ] **Connect → Drivers** → copy the connection string, fill in the password
      and add the database name before the `?`:
      ```
      mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/rnk2-properties?retryWrites=true&w=majority
      ```

### 2. Host

- [ ] Connect the GitHub repo, branch `main`.
- [ ] **Build command**
      ```bash
      cd client && npm ci && npm run build && cd ../server && npm ci --omit=dev
      ```
- [ ] **Start command**
      ```bash
      cd server && npm start
      ```
      (`npm start` sets `NODE_ENV=production`.)
- [ ] **Node version** 22 (minimum 18.17).
- [ ] **Persistent disk / volume** (~1GB) mounted at e.g. `/var/data`.
      Hosts with an ephemeral filesystem (Render/Railway/Heroku without a
      volume) delete uploaded photos on every redeploy.
- [ ] **Environment variables**

      | Key | Value |
      |---|---|
      | `MONGODB_URI` | connection string from step 1 (required) |
      | `JWT_SECRET` | min. 32 random characters (required) — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
      | `UPLOAD_DIR` | a folder on the persistent disk, e.g. `/var/data/uploads` |
      | `PORT` | only if the host requires a specific port (default `5001`) |
      | `TRUST_PROXY` | leave unset unless there is more than one proxy in front of the app |

- [ ] Deploy and wait for `RNK2 Properties listening` in the logs.

### 3. First CMS login

- [ ] In the host's shell/console:
      ```bash
      cd server && ADMIN_PASSWORD='a-strong-password' npm run create-admin -- you@yourdomain.co.uk "Your Name"
      ```

### 4. Domain & HTTPS

- [ ] Add the domain and `www.` in the host's custom-domain settings.
- [ ] Add the DNS records it gives you at the domain registrar.
- [ ] Confirm HTTPS works. The CMS cookie is `Secure` in production, so
      sign-in will not work over plain HTTP.

### 5. Check it on the live site

- [ ] Homepage loads (with nothing published there is no Work section or map —
      that's expected).
- [ ] Sign in at `https://yourdomain/admin`.
- [ ] Add a test project with 2–3 photos → **Save & show on website** → check
      the homepage card, project page and map pin.
- [ ] **Redeploy**, then confirm the photos are still there (proves the
      persistent disk is set up correctly).
- [ ] Send a test quote from the website → it appears under **Enquiries**.
- [ ] `curl -I -H "Range: bytes=0-1" https://yourdomain/tiles/thames-valley.pmtiles`
      returns `206`.
- [ ] Delete the test project and test enquiry.

### 6. Hand over to RNK2

- [ ] **Account → Add a person** for each RNK2 staff member. Send the
      password separately and ask them to change it after first sign-in.
- [ ] Send them the [CMS guide for RNK2](#cms-guide-for-rnk2) below.
- [ ] Once real projects are in, review every project page and confirm each
      homeowner has agreed to be shown.

### 7. Legal & housekeeping

- [ ] In `client/src/siteConfig.js`, update `legal.dataSharedWith` with the
      real processor names (host, MongoDB Atlas, email provider) and set
      `legal.policyUpdated` to the go-live date.
- [ ] Backups: export the database periodically (Atlas export or
      `mongodump`) and copy the `UPLOAD_DIR` folder. Atlas M0 has no
      automatic backups.

## CMS guide for RNK2

Plain-English instructions to send to the people updating the website.

1. Go to **yourdomain/admin** and sign in.
2. **Company details** — fill in what you can (year established, phone, email,
   address, Companies House number, a customer review, a homepage photo) and
   click **Save changes**. Anything left blank is simply hidden on the website.
3. **Projects → + Add a project**
   - Fill in the name, type, town (never the street) and county.
   - Drag in all the photos at once. The first one is the cover — use
     **Make cover** or the arrows to change the order, and add a short caption
     to each.
   - Optionally add a **before** photo, taken from the same spot as the cover,
     to show a before/after slider.
   - Write the brief (and the approach/result if you can).
   - Click **Save & show on website**, or **Save as draft** to finish later.
     The panel on the right lists anything still needed before it can go live.
4. On the **Projects** list, use ▲ ▼ to change the order on the website, and
   **Hide from website** to take a project down without deleting it.
5. **Enquiries** shows quote requests from the website. Delete them once
   they're dealt with — the privacy policy promises not to keep them longer
   than 24 months.
6. **Account** — change your password, or add/remove people who can sign in.
7. **iPhone photos:** upload them from the iPhone itself, or export them as JPG
   first when using a computer (HEIC files can't be read).

### Hosting the client separately (optional)

If you'd rather put `client/dist` on a static host, it must proxy `/api/*` and
`/uploads/*` to the Node server (same origin — the CMS cookie is
`SameSite=Strict`), and needs an SPA fallback (unmatched routes serve
`index.html`). The `.pmtiles` file is read with HTTP range requests; verify
with:

```bash
curl -I -H "Range: bytes=0-1" <deployed-url>/tiles/thames-valley.pmtiles
```

Expect `206 Partial Content`.
