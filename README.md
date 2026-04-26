# Atlas Website

## About

Atlas helps users back up browser data locally, providing a simple offline-first interface for managing and exporting profiles.

This repository contains the source code for the Atlas single-page static landing site.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Node.js (build tool)

## Architecture

For easier development, the layout is broken down into partials, JavaScript, and CSS files, which are compiled into a single `index.html` via the provided build script.

The source files are located in the `atlas-website/` directory:
- **`css/`** - Contains the CSS styles (`style.css`).
- **`js/`** - Contains the main JavaScript logic (`main.js`).
- **`partials/`** - Contains the individual HTML sections of the website (e.g. `hero.html`, `footer.html`, `features.html`, etc.).

## Building the Website

To assemble the partials, styles, and scripts into the final `index.html` file, run the included Node.js build script.

### Node.js

No dependencies are required—only Node.js. Run the standard build command via npm:
```bash
npm run build
```

The build script composes all partials, styles, and scripts into a single optimized `index.html` file in the `atlas-website` directory.

## Development Workflow

1. Edit your CSS, JavaScript, or any of the HTML partials.
2. Run the build script (`npm run build`).
3. Open `atlas-website/index.html` in your browser to check the changes.
