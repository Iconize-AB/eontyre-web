# Eontyre.com — Phase 2: all pages, booking calendar and the full block library

Read `BRIEF.md` first. Design tokens, `siteSettings`, shared objects (`link`, `button`) and the five phase 1 blocks still apply. This brief adds the remaining pages and turns the site into one library of reusable blocks.

## Priority
1. **Booking calendar on the Business system page.** It is missing from the current build. It is a core selling point and must be on the page (block `productScreenBlock`, screen `bookingCalendar`).
2. New blocks and the two extensions of existing blocks.
3. New document types: `integration` and `post`, with templates for `/integrations/[slug]` and `/news/[slug]`.
4. Seed all pages.

## References
- `reference/site/*.dc.html`: the finished design of every page, direction B (dark). Open them in a browser at 1440px; they need `support.js` and `assets/` from the same folder, which are included. Each `<section>` has a `data-block="…"` attribute naming the block that builds it. Use these files as the source of truth for layout, spacing and **all copy**; copy text verbatim as seed content.
- `reference/components/booking-calendar.html`: the booking calendar on its own, as plain HTML.
- `reference/blocks/10-…png` to `97-…png`: screenshots at 1440px, named `{nn}-{block}-{variant}.png`. If a screenshot and the HTML differ, follow the HTML (the screenshot tool sometimes drops grid lines or wraps text).

Ignore the template syntax in the `.dc.html` files (`{{ }}`, `<sc-for>`, `<sc-if>`, `<dc-import>`). It is prototype markup. Demo data inside the `<script>` class (integrations list, news posts, plate search results) is seed content.

## Rules for every block
- Every block has: `theme` (`dark` | `light`, default `dark`), `background` (`default` | `surface`, default `default`), `anchorId` (optional string, used by `anchorNavBlock` and `#links`), and `paddingTop` (`default` | `none`).
- Section padding `clamp(64px, 8vw, 112px)` vertical, content max-width 1280px.
- H2 in blocks: Archivo 800, `font-stretch: 115%`, uppercase, `clamp(30px, 3.2vw, 44px)`, line-height 1.05. H1 in `pageHeroBlock`: Archivo 800, stretch 118%, uppercase, `clamp(44px, 5.4vw, 76px)`, line-height 1.
- Eyebrow: 16px/600 in `accent`.
- Two-column layouts use `grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr))`, gap `48px 64px`, so they stack on mobile without breakpoints.
- Lists inside blocks are separated by 1px hairlines (`#34302D` on surface, `#2A2725` on default).
- Body text in blocks is Portable Text (paragraphs, bold, links), not plain strings, unless stated.
- No block may hard-code copy. Everything visible comes from Sanity.

---

## New blocks

### `pageHeroBlock`
The top of every page except Home. Screenshots: 10, 20, 30, 40, 70, 80, 95.
- `eyebrow`, `heading` (H1), `body`, `buttons[]` (max 2), `contactLines[]` (optional `{label, href}`, rendered large: first line 32px/700, others 18px; used on Support).
- `media`: `none` | `image` | `imageTop` | `code`
  - `none`: text only. If `body` is set it sits in a right column aligned to the bottom of the heading (Integrations). Otherwise heading only (About, News, Who it's for).
  - `image`: split 50/50, text left and vertically centred, image right, min-height 520px, full height of the hero, no padding around it (Business system, Support, integration detail).
  - `imageTop`: full-width image `clamp(320px, 38vw, 520px)` tall, then heading left and body right on `surface` (Webshop).
  - `code`: text left, code panel right (API). Fields `codeMethod` ("GET"), `codePath`, `code` (text, shown in `<pre>`, IBM Plex Mono 13px, line-height 1.7). Panel `#0A0A0A`, 1px `#2E2B28` border, method in `accent`.
- Bottom border 1px `border` when `media` is `image` or `code`.

### `anchorNavBlock`
Jump links under a hero. Screenshot 10.
- `items[]`: `{label, anchorId}`. Validation: `anchorId` must match an `anchorId` of a block on the same page.
- Single row, 15px/500, gap `8px 32px`, wraps. Top and bottom border. Optional: sticky under the header (not in the design; ask before adding).

### `productScreenBlock`
Shows a coded mock of Eontyre's product next to or under text. Screenshots 11, 13, 21.
- `heading`, `body`, `layout`: `split` (text left, screen right) | `stacked` (heading left and body right in one row, screen full width under it).
- `screen`: `bookingCalendar` | `orderSummary` | `plateSearchDemo`. Each is a React component in the front end; Sanity only picks which one.
- The screen always renders in light product colours (white UI), whatever the block theme. It is a picture of the product.
- Defaults: `bookingCalendar` uses `stacked`, the other two `split`.

#### Screen: `bookingCalendar` (priority 1)
This copies Eontyre's **real** booking calendar. Do not restyle it to match the website. Reference: `reference/components/booking-calendar.html`, screenshot `13-productScreen-bookingCalendar.png`.

Container: white, 1px border, radius 8px, `overflow-x: auto`, inner `min-width: 1500px` (scrolls sideways on smaller screens). Font Schibsted Grotesk.

1. **Toolbar** (padding 12px 16px, bottom border `#EAEAEA`): view switch Day / **Week** / Month (active item black with white text), "Jump to today", ‹, "**Week 40** Sep 28–Oct 4", ›, "Calendar" select, spacer, "Filter", "Display settings", "?" circle, and an orange "Close lift" button (`#E2531C`, white text, lock icon). Controls are 38px tall, 1px `#E2E2E2` border, radius 6px.
2. **Legend row**: "BOOKING COLOURS" with Admin `#141414`, Online `#5E9E93`, Auto-booking `#4F7BEA`; divider; "Auto-booking status" with Sent `#2F6FE0`, Accepted `#2E9E5B`, Declined `#D93A2B`.
3. **Day headers**: grid `64px repeat(7, 1fr)`. Weekday 13px, date 15px/600. Saturday red `#D9452B` on `#FFF3F1`, Sunday grey `#6B6B6B` on `#F7F7F7`.
4. **Time grid**: 07:00–14:00, one row per 30 minutes, **36px per row** (540px total). Lines `#ECECEC`. Time labels 11px `#6B6B6B`. Sunday column `#F7F7F7`.
5. **Bookings** are absolutely positioned: `top = minutesSince0700 / 30 × 36px`, `height = durationMinutes / 30 × 36px`. Four kinds:
   - `single`: white card, 3px left border in the source colour, small shadow; plate in bold, service, time, optional "P1" badge (black, white text).
   - `group`: header "[n bookings] · 08:10–09:00" on `#F7F7F7`, then one 30px row per booking with source icon, plate, service and time.
   - `detailed`: name, time, service, and icons (check in green, card, P1).
   - `closedLift`: `#FEF7DC` with a 1px dashed `#E7C76A` border, radius 4px, lock icon and text in `#C46A0A`: "Closed lift · 2024 - Wheel alignment", "Closed", time.
6. **Data**: hard-code the demo week in the front end as a typed array (`bookingCalendarDemo.ts`), taken from the reference file:
   ```ts
   type Source = 'admin' | 'online' | 'auto'
   type Booking =
     | { kind: 'single'; day: number; start: string; end: string; plate: string; service: string; source: Source; badge?: string }
     | { kind: 'group'; day: number; start: string; end: string; items: { plate: string; service: string; start: string; end: string; source: Source }[] }
     | { kind: 'detailed'; day: number; start: string; end: string; name: string; service: string; source: Source; paid?: boolean; badge?: string }
     | { kind: 'closedLift'; day: number; start: string; end: string; label: string }
   ```
   Editors do not edit bookings in Sanity.
7. Static and not interactive. Wrap it in `role="img"` with `aria-label="Example of the Eontyre booking calendar, week view"` and set `aria-hidden` on the inner content.

#### Screen: `orderSummary`
White card: header "Order 48213" and "Volvo V60 · ABC 123", three line items with prices, total row on `#F5F2EE`. Hard-coded demo data. Screenshot 11.

#### Screen: `plateSearchDemo`
Interactive demo. Plate input (white, blue EU band with "S", IBM Plex Mono 26px), "Find tyres" pill, preset chips (ABC 123, XYZ 789, KLM 456), result list (vehicle model and size, then rows of brand/model, source, stock, delivery, price, EU label). Unknown plate shows "No car with that registration number in the demo…". Demo data is in the `<script>` of `Webshop B.dc.html`. Screenshot 21. On a dark theme the card is `surface` with a 1px border and the plate field stays white.

### `textMediaBlock`
Text on one side, photo on the other. Screenshots 12, 23.
- `heading`, `body`, `image` (required alt, aspect 3:2), `imagePosition`: `left` | `right`.
- `list[]` (optional strings) and `listStyle`: `numbered` | `plain`. Numbered = number in `accent` 700 in a 32px column. Hairline above each item and below the last.
- `link` (optional text link with 2px orange underline, offset 4px).

### `featureGridBlock`
A grid of short items. Screenshots 14, 22, 32, 51, 72, 82.
- `heading`, `body`, `headerLink` (optional, right-aligned next to the heading, e.g. "See all integrations").
- `items[]`: `{title, body?, image?, link?}`.
- `variant`:
  - `topRule`: 2px orange top border, title 19px/700, body 16px. Grid `minmax(260px, 1fr)`. Used for "Also included", POS features, contact columns, Start contacts.
  - `numbered`: like `topRule` with a generated number (1, 2, 3) above the title (Support "New customer?").
  - `steps`: compact. Number and title on one line, 1px hairline, no body. Grid `minmax(200px, 1fr)` (Webshop "The whole purchase is connected").
  - `cards`: 1px border box, padding 24px, whole card clickable, hover border `accent` (POS "Works well with").
- `image` shows above the title (64px tall logo strip on API "Ready-made integrations"). Until logos arrive, show nothing; do not render the dashed placeholder from the prototype.
- Contact columns: body can hold `tel:` and `mailto:` links.

### `linkListBlock`
Text left, list of rows right. Screenshots 31, 81.
- `heading`, `body`, `button` (optional), `items[]`: `{label, meta?, link?}`.
- Row: label 16–17px/600, `meta` right-aligned in IBM Plex Mono 14px muted (API endpoints like `/v1/tyres`). If a row has a link, the whole row is the link with a "→" at the right and turns `accent` on hover (Support help centre articles).

### `richTextBlock`
Heading left, body right. Screenshot 71 (About).
- `heading` (H2, max 480px), `body` (Portable Text, 18px, line-height 1.6), `layout`: `split` | `single` (single = one column, max 720px, for legal or long pages).

### `imageBlock`
One wide photo. Screenshot 70.
- `image` (required alt), `aspect`: `21:8` | `16:9` | `3:2`, min-height 280px, inside the 1280px container.

### `integrationDirectoryBlock`
Lists `integration` documents. Screenshot 41.
- `heading` (optional), `showFilter` (boolean), `filterCategories` (default: all categories that have at least one integration), `items` (optional manual selection; if empty, show all, ordered by `orderRank`).
- Filter chips: pill, 1px border `#4A4541`; active chip `accent` with `onAccent` text; label plus count. Filtering happens client-side, and the selected category goes in the URL (`?category=accounting`).
- Card: 1px border, padding 24px, min-height 250px. Logo tile 48×48 (`#24211F`; show `shortName` letters until a logo is uploaded), status at the top right (Available `#6FCF97`, Coming soon `accent`), name 20px/700, category 14px muted, short description, "Read more" link if the integration has a detail page.
- Grid `repeat(auto-fill, minmax(290px, 1fr))`, gap 20px.

### `newsListBlock`
News overview. Screenshots 95, 96.
- `showFeatured` (boolean): the newest post with `featured: true` shows as a large row: image left (3:2), category, date, H2, excerpt, "Read the article".
- `showFilter` (boolean): category chips, same style as the integration directory.
- `pageSize` (default 10), with a "Load more" button (not designed: outline pill, centred).
- List row: grid `180px 1fr auto`; date and category on the left, title 22px/700 and excerpt in the middle, "→" on the right; hover makes the title `accent`.

### `formBlock`
Screenshots 72, 90, 97.
- `formType`: `contact` | `trial` | `newsletter`. The fields for each type are fixed in code, not configurable:
  - `contact`: name, e-mail, message.
  - `trial`: company name, company registration number, phone number, address, zip code, city, country (Sweden, Norway, Denmark, Finland, Other), e-mail, password, terms note with a link.
  - `newsletter`: e-mail only, inline with the button.
- `heading`, `body`, `headingLevel` (`h1` | `h2`; Start uses h1), `submitLabel`, `successHeading`, `successBody`.
- `layout`: `split` (text left, form right) | `withImage` (text and form left, photo right, like Start) | `inline` (newsletter).
- Fields: 1px `#4A4541` border, radius 4px, background `surface`, padding 12px, label 14px/500 above. Submit = primary pill.
- Submissions go to a serverless route. Which service receives them is an open question (see the end of this brief). Validate on the server, honeypot field, no captcha for now.

---

## Changes to phase 1 blocks

### `featureRowsBlock`: add `style`
- `panels` (current, Home): stacked rows, `surface`, 2px gap.
- `editorial` (new, Who it's for, screenshot 60): rows separated by a 1px top border with padding `clamp(40px, 5vw, 64px)` above. Image 3:2 and text side by side. With `imagePosition: alternate`, odd rows have the image left. Row title H2 at `clamp(28px, 3vw, 40px)`. Each row has a text link (`linkLabel`) instead of the whole row being clickable.

### `ctaBannerBlock`: add `style`
- `photo` (current, Home).
- `accent` (new): orange band, padding `clamp(56px, 7vw, 88px)`. H2 left in `#141414`, max 640px. Button right: **black** pill (`#141414` with white text) on orange. No body. Used at the bottom of most pages (screenshot 23).
- `surface` (new): `surface` background, heading and body left, up to 2 buttons right (primary and outline). Screenshot 42.
- `buttons[]` replaces the single `button` (max 2). Migrate the existing field.

---

## New document types

### `integration`
`name`, `slug`, `shortName` (2–3 letters for the tile), `logo` (image, optional), `category` (`accounting` | `payments` | `workshop` | `storage` | `suppliers` | `salesChannels` | `developers`; labels "Accounting", "Payments", "Workshop", "Storage", "Suppliers", "Sales channels", "Developers"), `shortDescription`, `status` (`available` | `comingSoon`), `orderRank`, `hasDetailPage` (boolean), `blocks[]` (the same page builder as `page`), `seo`.

Seed with the 14 integrations in the `DATA` array of `Integrations B.dc.html`. Only "Integrated point of sale" has a detail page for now. Its blocks are in `POS B.dc.html`.

Template `/integrations/[slug]`: breadcrumb (Integrations / {name}, 14px, bottom border, screenshot 50), then the blocks. `logoGridBlock` on Home should reference `integration` documents.

Webshop and API also appear in the directory but link to their own pages (`/webshop`, `/api`). Add a `linkOverride` (link) field for that.

### `post`
`title`, `slug`, `publishedAt`, `category` (`productNews` | `integrations` | `company`; labels "Product news", "Integrations", "Company"), `excerpt` (max 200 characters), `mainImage` (required alt), `featured` (boolean), `body` (Portable Text with images), `seo`.

Seed with the six posts in `News B.dc.html` and the featured post "Integrated point of sale ready for the winter season". **All of these are placeholders**; mark them as drafts.

Template `/news/[slug]` (not designed yet; build it simply with the tokens): breadcrumb (News / {title}), category and date, H1 using the `pageHeroBlock` H1 style, `mainImage` at 16:9, body column max 720px (18px, line-height 1.6), then a `newsListBlock`-style list of the three newest other posts, and the footer.

---

## Pages and block order
Routes in brackets. `[surface]` = `background: surface`.

**Business system** (`/business-system`), file `Platform B.dc.html`
1. `pageHeroBlock` (image)
2. `anchorNavBlock`: Search and ordering, Off-season tyre storage, Booking calendar, Stock and logistics, Customer, car and driver registers
3. `productScreenBlock` (split, orderSummary), anchor `search`
4. `textMediaBlock` (image left, numbered list) [surface], anchor `storage`
5. **`productScreenBlock` (stacked, bookingCalendar), anchor `booking`**
6. `textMediaBlock` (image right) [surface], anchor `stock`
7. `featureGridBlock` (topRule) "Also included", anchor `registers`
8. `ctaBannerBlock` (accent)

**Webshop** (`/webshop`), file `Webshop B.dc.html`
1. `pageHeroBlock` (imageTop)
2. `productScreenBlock` (split, plateSearchDemo). Read `?plate=` from the URL (sent by the hero plate search on Home) and run the search on load.
3. `featureGridBlock` (steps) [surface]
4. `textMediaBlock` (image left, plain list)
5. `ctaBannerBlock` (accent)

**API** (`/api`), file `API B.dc.html`
1. `pageHeroBlock` (code)
2. `linkListBlock` (rows with `meta`, no links)
3. `featureGridBlock` (topRule with images, `headerLink` "See all integrations") [surface]
4. `textMediaBlock` (image left)
5. `ctaBannerBlock` (accent)

**Integrations** (`/integrations`), file `Integrations B.dc.html`
1. `pageHeroBlock` (none, with body)
2. `integrationDirectoryBlock` (showFilter)
3. `ctaBannerBlock` (surface)

**Integration detail** (`/integrations/integrated-point-of-sale`), file `POS B.dc.html`
breadcrumb (template), `pageHeroBlock` (image), `featureGridBlock` (topRule), `featureGridBlock` (cards) [surface], `ctaBannerBlock` (accent)

**Who it's for** (`/who-its-for`), file `Solutions B.dc.html`
1. `pageHeroBlock` (none)
2. `featureRowsBlock` (editorial, alternate, `paddingTop: none`)
3. `ctaBannerBlock` (accent)

**News** (`/news`), file `News B.dc.html`
1. `pageHeroBlock` (none)
2. `newsListBlock` (showFeatured, showFilter)
3. `formBlock` (newsletter, inline) [surface]

**About** (`/about`), file `About B.dc.html`
1. `pageHeroBlock` (none)
2. `imageBlock` (21:8)
3. `richTextBlock` (split)
4. `featureGridBlock` (topRule, contact columns) [surface], anchor `contact`
5. `formBlock` (contact, split) [surface, `paddingTop: none`]

**Support** (`/support`), file `Support B.dc.html`
1. `pageHeroBlock` (image, contactLines: phone and e-mail)
2. `linkListBlock` (with links and a button)
3. `featureGridBlock` (numbered) [surface]

**Start** (`/start`), file `Start B.dc.html`
1. `formBlock` (trial, withImage, h1)
2. `featureGridBlock` (topRule)

Header nav (`siteSettings.navItems`): Business system, Webshop, API, Integrations, Who it's for. Add News to the footer "Get started" column (already in the footer design).

---

## Acceptance checklist
- [ ] Business system shows the booking calendar between "Off-season tyre storage" and "Stock and logistics", and it matches `13-productScreen-bookingCalendar.png`.
- [ ] Every page in the list above can be built in Sanity Studio with no code changes, using only the blocks in BRIEF.md and BRIEF-2.md.
- [ ] Every block works with `theme: dark`. With `theme: light` it is readable (it doesn't need to be polished).
- [ ] Blocks hold up with different amounts of content: 1–12 items in `featureGridBlock`, 0 or 30 integrations, posts without images.
- [ ] Anchor links scroll to their block with an offset for the header (`scroll-margin-top: 80px`).
- [ ] Each block has a preview in Studio (title + variant + thumbnail) so editors can tell them apart.
- [ ] Lighthouse accessibility ≥ 95 on every page; focus states visible on chips, cards and form fields.

## Open questions for Eontyre
- Which service should receive form submissions (contact, trial sign-up, newsletter)? Today's trial sign-up may already post to the Eontyre app; please confirm the endpoint.
- Should "Try free" create an account in the app directly (current eontyre.com behaviour) or only send a lead?
- Integration logos and partner logos.
- The real news posts that should replace the placeholders.
- The help centre article links on Support point to the Freshdesk home page; which articles should they open?

## Files
- `reference/site/`: every page in direction B, plus `support.js` and `assets/`
- `reference/components/booking-calendar.html`: the booking calendar on its own
- `reference/blocks/`: phase 1 screenshots (1–6) and phase 2 screenshots (10–97)
