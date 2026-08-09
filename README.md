# Precision Asset Transportation — www.assettrans.com

A static marketing site for Precision Asset Transportation. No build step, no
framework, no dependencies — plain HTML, one stylesheet and one small script,
so it can be hosted anywhere and edited with any text editor.

```
index.html          Home
services.html       What we move, item by item
specialties.html    Estate sales, office moves, liquidations
about.html          Standard of care + FAQ
contact.html        Quote form and phone
404.html            Not-found page
assets/css/         styles.css   — the whole design system
assets/js/          main.js      — mobile menu, scroll reveals, form handling
assets/img/         logo-mark.svg, favicon.svg + generated PNGs
tools/              og-image.html, render-images.js — image generator
CNAME               www.assettrans.com  (used by GitHub Pages)
site.webmanifest    robots.txt   sitemap.xml
```

The phone number **1-888-751-9924** appears in the header, the hero, every
call-to-action band, the footer, and as a fixed tap-to-call bar on phones.

## Preview it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Going live on www.assettrans.com

The domain stays registered at GoDaddy either way — you only change where its
DNS points.

### Option A — GitHub Pages (free, already set up)

1. In this repository: **Settings → Pages → Build and deployment**, set
   *Source* to "Deploy from a branch", pick the branch holding this site and
   the `/ (root)` folder, then Save.
2. Still on that page, set **Custom domain** to `www.assettrans.com`. The
   `CNAME` file in this repo already carries that value.
3. In GoDaddy, open **My Products → Domains → assettrans.com → DNS**, and set:

   | Type  | Name | Value                  | TTL    |
   |-------|------|------------------------|--------|
   | CNAME | www  | `mfalme09.github.io`   | 1 hour |
   | A     | @    | `185.199.108.153`      | 1 hour |
   | A     | @    | `185.199.109.153`      | 1 hour |
   | A     | @    | `185.199.110.153`      | 1 hour |
   | A     | @    | `185.199.111.153`      | 1 hour |

   Delete GoDaddy's default parked-page records for `@` and `www` first —
   they conflict. The four A records make the bare `assettrans.com` redirect
   to the `www` version.
4. Back in GitHub Pages, wait for the DNS check to pass, then tick
   **Enforce HTTPS**. Certificates can take up to an hour to issue.

### Option B — Netlify, Cloudflare Pages or similar

Connect the repo, leave the build command empty and set the publish directory
to `/`. Then point GoDaddy's `www` CNAME at the hostname the platform gives
you.

### Option C — GoDaddy's own hosting

If you bought hosting from GoDaddy, no DNS changes are needed. Upload the
contents of this folder (not the folder itself) to `public_html` via cPanel
File Manager or FTP, keeping the `assets/` directory structure intact.

## Regenerating the images

Everything on the page is SVG or CSS, but a few things have to be real
raster images: the card that appears when someone shares a link on
Facebook, LinkedIn, iMessage or X, and the icon iOS uses when a visitor
saves the site to their home screen. Those are checked into `assets/img/`
already, so you only need this if you change the logo or the wording on
the share card.

```bash
npm install playwright && npx playwright install chromium
node tools/render-images.js
```

That regenerates `og-image.png` (1200x630), `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png` and `favicon-32.png`. The share card's
layout lives in `tools/og-image.html` — open it in a browser to see
exactly what gets captured.

## Making the quote form deliver email

Right now the form on `contact.html` opens the visitor's own email program
with all their answers pre-filled and addressed to `info@assettrans.com`.
That works everywhere but relies on the visitor having email set up on their
device, so it's worth upgrading once you're live.

1. Create a free form endpoint at [Formspree](https://formspree.io) (or
   FormSubmit, Basin, Netlify Forms — any of them work).
2. Open `assets/js/main.js` and put the URL they give you in the empty
   quotes near the top:

   ```js
   var FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
   ```

That's the only change needed — the form will then POST there, show a thank-you
message in place, and the page will never reload.

## Before you announce the site

A handful of details only you can confirm. Search-and-replace them across the
`.html` files:

- **Email address.** `info@assettrans.com` is used throughout. Change it if
  you'd rather use a different inbox, and make sure that mailbox actually
  exists at your email provider.
- **Hours.** The footer and contact page currently say Monday–Saturday
  7am–7pm, Sunday by appointment.
- **Service area.** The site is written for nationwide work with no city
  named. If you want to rank locally, add your city and state to the page
  titles, the footer, and the `areaServed` field in the JSON-LD block at the
  top of `index.html` — and add your street address there too.
- **Licensing and insurance.** The site deliberately makes no claim about
  either — there is nothing on any page saying the company is licensed or
  insured. Once you have a USDOT or MC number, or a state mover license,
  adding it to the footer is worth doing: it builds trust, and some states
  require the number to appear in advertising.
- **The logo.** `assets/img/logo-mark.svg` is a vector rebuild of the PA
  monogram in the brand's navy and gold. If you have the original artwork
  from your designer, drop the file into `assets/img/` and point the `<img
  src>` tags at it — there are two per page, one in the header and one in the
  footer.
- **Photography.** The design deliberately leaves room for real job photos:
  a piano on a board, a crated painting, a crew in a stairwell. Real photos of
  your own work will do more for conversion than anything else you can add.

## Notes for whoever edits this next

- The header and footer are copied into each page rather than pulled from a
  template. If you change one, change all six files.
- Colors, spacing and fonts are all defined as CSS custom properties at the
  top of `assets/css/styles.css`. Change them there once and the whole site
  follows.
- The circuit-trace texture in the dark sections is a single inline SVG in the
  `.circuitry` rule — add that class to any section to get it.
- The site works with JavaScript disabled; `main.js` only enhances.
- Each page carries structured data in a `<script type="application/ld+json">`
  block: company details and hours on the home page, a service catalog on
  the services page, the six questions and answers on the About page, and
  breadcrumbs throughout. This is what lets Google show the FAQ and the
  phone number directly in search results. If you edit an FAQ answer on the
  About page, edit the matching answer in its JSON block too — Google
  penalizes structured data that does not match what a visitor sees.
