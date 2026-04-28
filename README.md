# Atlas Website

Source code for the Atlas static landing site. The site is built from partials, styles, and scripts assembled into a single `index.html` via a Node.js build script.

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Node.js (build tooling only)
- [`clean-css`](https://github.com/clean-css/clean-css) — CSS minification
- [`terser`](https://github.com/terser/terser) — JavaScript minification

---

## Project Structure

```
atlas-website/
  css/            Global stylesheet
  js/             Main application script
  partials/       HTML sections (hero, nav, footer, etc.)
  assets/
    ico/          Favicon
    og/           Open Graph image
  build.js        Build script
  index.html      Generated output — do not edit directly
  manifest.json   Web app manifest (PWA)
  robots.txt      Search engine directives
  sitemap.xml     Site map
```

---

## Getting Started

**Prerequisites:** Node.js 16 or later.

Install dependencies (only required for minification):

```bash
npm install
```

Build the site:

```bash
npm run build
```

The build script assembles all partials, minifies CSS and JavaScript, and writes the result to `index.html`.

---

## Development Workflow

1. Edit files in `css/`, `js/`, or `partials/`.
2. Run `npm run build`.
3. Open `index.html` in a browser to review changes.

> **Note:** `index.html` is generated output. Any direct edits will be overwritten on the next build. Make changes in the source files only.

---

## Deployment

The site is hosted on GitHub Pages from the repository root. Push to `main` to deploy.

Live: [junimobyte.github.io/atlas-website](https://junimobyte.github.io/atlas-website/)
