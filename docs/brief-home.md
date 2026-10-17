# Eontyre.com — Home page and reusable Sanity blocks

## Goal
Build the Eontyre.com home page (design "Home — B") in Sanity and the front end, as a set of reusable page-builder blocks. The same blocks will be used later for Business system, Webshop, API, Integrations and other pages, so build them generic, not home-page specific.

References (all in this folder):
- `reference/home-b.html` — the finished design as plain HTML with inline styles. Open it in a browser at 1440px. Every block is marked with a `BLOCK` comment and a `data-block="…"` attribute that matches the block names below. Treat it as the visual source of truth; translate it into components, don't copy the inline styles.
- `reference/blocks/*.png` — screenshots of each block at 1440px. If a screenshot and the HTML differ (the screenshot tool wraps "All integrations" onto two lines and greys the plate field), follow the HTML: button labels stay on one line and the plate field is white.

## Block map
| # | Block | Screenshot |
|---|---|---|
| — | Header (`siteSettings`) | `1-header-and-hero.png` |
| 1 | `heroBlock` | `1-header-and-hero.png` |
| 2 | `statsBlock` | `2-stats-and-feature-rows.png` |
| 3 | `featureRowsBlock` | `2-stats-and-feature-rows.png`, `3-feature-rows.png` |
| 4 | `logoGridBlock` | `4-logo-grid.png` |
| 5 | `ctaBannerBlock` | `5-cta-banner.png` |
| — | Footer (`siteSettings`) | `6-footer.png` | The text in this brief is the final copy; use it verbatim as seed content.

## Scope (first delivery)
1. Global documents: `siteSettings` (header and footer).
2. `page` document with `slug`, `seo` and a `blocks[]` array.
3. Six blocks: `heroBlock`, `statsBlock`, `featureRowsBlock`, `logoGridBlock`, `ctaBannerBlock`, and the shared `button`/`link` objects.
4. Seed the home page with the content below.

Out of scope for now: live plate search API, integrations directory, news, the other pages.

---

## Design tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0E0E0E` | Page and header background |
| `surface` | `#181716` | Feature rows, logo tiles |
| `surfaceHover` | `#201E1C` | Feature row hover |
| `footerBg` | `#141414` | Footer |
| `border` | `#2A2725` | Hairlines between sections |
| `text` | `#F2EEE9` | Primary text |
| `textMuted` | `#BDB6AE` | Body copy on dark |
| `textSubtle` | `#A39D96` | Labels, stat captions |
| `textOnImage` | `#D9D2C9` / `#E8E1D8` | Body copy on photos |
| `accent` | `#F26B1D` | Primary buttons, stat numbers, index numbers |
| `accentHover` | `#FF8A45` | Primary button hover |
| `onAccent` | `#141414` | Text on orange |
| `plateBlue` | `#1F4FB8` | EU band on plate input |

Build tokens so a light theme can be added later (direction C exists: same layout, `bg #FFFFFF`, `surface #F5F2EE`, `text #141414`, `textMuted #3D3833`, accent text `#C2540F`). Every block gets a `theme: dark | light` field, default `dark`. Only dark needs to look finished in this delivery.

### Typography (Google Fonts)
- **Display:** Archivo (variable, load the `wdth` axis: `Archivo:wdth,wght@62..125,400..900`). Always uppercase.
  - H1: weight 900, `font-stretch: 125%`, `clamp(52px, 8.6vw, 132px)`, line-height 0.9, letter-spacing -0.01em
  - H2: weight 800, `font-stretch: 115%`, `clamp(30px, 3.4vw, 48px)`, line-height 1
  - H2 large (CTA banner): `clamp(34px, 4.4vw, 64px)`
  - Stat number: weight 800, stretch 115%, 44px
- **Body:** Schibsted Grotesk 400/500/600/700. Body 17–19px, line-height 1.55. Nav 15px/500.
- **Mono:** IBM Plex Mono 400/500. Index numbers (13px) and the plate input (24px, letter-spacing 0.08em).

### Layout
- Content max-width 1280px, side padding `clamp(20px, 4vw, 40px)`.
- Section vertical padding `clamp(72px, 9vw, 128px)`.
- Buttons are pills (`border-radius: 999px`), except the header CTA, which is square (2px).
- No shadows, no gradients except the dark fade over hero photos.

---

## Global: `siteSettings`

**Header** (64px tall, `bg`, bottom border `border`)
- `logo` (image; white version on dark, black on light). Files: `assets/eontyre-logo-white.png`, `eontyre-logo-black.png`.
- `navItems[]`: `{label, link}`. Active item gets a 2px orange underline.
- `secondaryLink`: "Log in" → `https://app.eontyre.com`
- `primaryCta`: "Try free for 30 days" → `/start`
- Mobile (< 900px): collapse nav into a menu button. Not designed yet; keep it simple.

**Footer** (`footerBg`)
- `tagline`: "Business system, webshop and API for the tyre industry."
- `columns[]`: `{title, links[]}`
  - Product: Business system, Webshop, API and integrations, Integrations and add-ons, Who it's for, About Eontyre, Support
  - Get started: Free 30-day trial, Book a demo, Log in, News
- `contact`: title "Contact our resellers", lines "Sweden: +46 (0)20 - 12 10 34", "Norway: +47 67 22 88 99", link "E-mail us"
- `legal`: "© {year} Eontyre", link "Terms and conditions" → `https://eontyre.com/assets/docs/General_Terms_EONTYRE_20241201.pdf`

---

## Blocks

### 1. `heroBlock`
Full-width photo with text bottom-left.

Fields
- `eyebrow` (string) — "Welcome to a"
- `heading` (string) — "World of Tyres"
- `body` (text) — "The business system, webshop and API for the tyre industry. Sales, tyre storage, booking and stock in one place, in the browser."
- `image` (image with hotspot, required alt) — `assets/hero-forest-road.jpg`
- `height`: `tall` (min 760px) | `fullscreen` (100vh, min 720, max 1100) — default `tall`
- `action`: `none` | `buttons` | `plateSearch`
  - `buttons`: up to 2 `button`
  - `plateSearch`: `placeholder` ("ABC 123"), `buttonLabel` ("Find tyres"), `targetUrl` (`/webshop`, submit as `?plate=ABC123`)

Layout
- Image `object-fit: cover`, respects hotspot.
- Fade: bottom 70% of the hero, linear-gradient from `bg` (at 8%) to transparent, so the photo blends into the next section.
- Content padding-bottom 64px. Under the heading, a two-column grid (min 420px per column, wraps): body left, action right-aligned (max 520px).
- Plate input: white field (`#FFFFFF`, text `#141414`), 4px radius, 34px blue EU band with "S" at the left, mono uppercase text, max 7 characters. Orange pill button, 56px tall.

### 2. `statsBlock`
Row of large numbers. Top and bottom border `border`.
- `items[]` (2–4): `{value, label}`
  - "2.4M" / "tyres sold"
  - "38M" / "API calls a year"
  - "140,000" / "sets in tyre hotels"
- Grid `repeat(auto-fit, minmax(220px, 1fr))`, 32px vertical padding per cell. Number in `accent`, label 15px `textSubtle`.

### 3. `featureRowsBlock`
Stacked rows, text left and photo right, 2px gap between rows.
- `heading` (optional, not used on home)
- `rows[]`: `{title, body, image, link}`. Index number (01, 02, 03) is generated from order, not a field.
- `imagePosition`: `right` | `alternate` — default `right`
- Row: grid `1.1fr 1fr`, `surface` background, hover `surfaceHover`. Whole row is one link. Text padding `clamp(32px, 4vw, 56px)`, vertically centred. Image min-height 320px, cover.
- Mobile (< 768px): stack to image on top, text below.

Content
1. "Business system" — "Sales, off-season tyre storage, booking, stock and customer registers for tyre workshops." → `/business-system` — `px-tyre-warehouse.jpg`
2. "Webshop" — "Registration number search, live stock, fitting bookings and online payment." → `/webshop` — `counter-payment.jpg`
3. "API and integrations" — "Fortnox, Unit4, point of sale, Vecheck, suppliers and a REST API for everything else." → `/api` — `truck-night.jpg`

### 4. `logoGridBlock`
Text left, grid of tiles right (two columns, min 420px, wraps).
- `heading` — "Connected to the rest of your business"
- `body` — "Accounting, payments, check-in, inspections and storage work together with Eontyre."
- `button` — "All integrations" → `/integrations` (outline pill)
- `items[]`: reference to an `integration` document, or `{name, logo?}` if you prefer to wait with the document type. Show the logo if present, otherwise the name (18px/600).
  - Fortnox, Unit4, Point of sale, Check-in, Vecheck, Tread scanning
- Tiles: 3 columns, 2px gap, `surface`, padding 28px 20px.

Recommendation: create an `integration` document type now (`name`, `slug`, `logo`, `category`, `shortDescription`, `status: available | comingSoon`). The integrations page will reuse it.

### 5. `ctaBannerBlock`
Photo background with a dark overlay, text left.
- `heading` — "We help you get started"
- `body` — "We book a meeting, go through your workflow and set up Eontyre with you. Phone support, upgrades and backups are included."
- `button` — "Try free for 30 days" → `/start` (primary)
- `image` — `px-kneeling-repair.jpg` (hotspot around the face, about 30% from the top)
- `overlayOpacity` (number 0–0.8, default 0.55)
- Min-height 520px, content vertically centred, heading max 760px wide.

### Hover and interaction states
- Nav links: no colour change; active page has a 2px orange underline 14px from the bottom of the header.
- Header CTA: `accent` → `accentHover`.
- Feature row: background `surface` → `surfaceHover`, whole row clickable.
- Primary pill: `accent` → `accentHover`. Outline pill: background becomes `text` at 8% opacity.
- Footer links: `#D9D4CE` → `#FFFFFF`.
- Transitions 150ms ease. No movement or scaling.

### Shared objects
- `link`: `internal` (reference to `page`) | `external` (url) — one field for both.
- `button`: `{label, link, variant: primary | outline}`. Primary = orange pill, `onAccent` text, 700. Outline = 1px border in `text` colour, transparent background, 600.

---

## Home page block order
1. heroBlock (action: plateSearch)
2. statsBlock
3. featureRowsBlock
4. logoGridBlock (no top padding, it follows the feature rows directly)
5. ctaBannerBlock

Header and footer come from `siteSettings`.

## Requirements
- Every image requires alt text in Sanity.
- Images through the Sanity image pipeline (`auto=format`, responsive `srcset`). The hero is LCP: preload it, no lazy loading.
- Text contrast must reach 4.5:1. Do not lower opacity on body text placed on photos.
- Visible focus states on links, buttons and the plate input.
- Blocks must look correct with fewer or more items than the seed content (e.g. 2 stats, 4 feature rows, 9 integrations).

## Open questions for Eontyre
- Confirm the stat numbers (2.4M, 38M, 140,000) before go-live.
- Integration logos are missing; names are shown until they arrive.
- Should the plate search call a real lookup now, or only pass the plate to the webshop?
- Dark (B) or light (C) as the default theme.
- Languages: Swedish and Norwegian versions? If yes, plan Sanity i18n from the start.

## Files in this folder
- `reference/home-b.html` — the design in plain HTML, blocks marked
- `reference/blocks/` — one screenshot per block
- `assets/` — logos and the five photos used on the page
