/** Build Script
 *
 *  Assembles partials into a single index.html.
 *
 *  Usage:
 *    node build.js
 *
 *  The output is written to ./index.html.
 *  Edit partials in ./partials/, styles in ./css/,
 *  and scripts in ./js/ — then rebuild.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Ordered list of partials to inject into <body>

const PARTIALS = [
  'nav',
  'hero',
  'ticker',
  'features',
  'pipeline',
  'scan',
  'trust',
  'changelog',
  'details',
  'footer',
  'modal',
];

// Read a file with error handling

function read(filePath) {
  const abs = path.resolve(ROOT, filePath);
  if (!fs.existsSync(abs)) {
    console.error(`[ERROR] Missing file: ${abs}`);
    process.exit(1);
  }
  return fs.readFileSync(abs, 'utf-8');
}

// Assemble partials

function buildBody() {
  return PARTIALS.map(name => {
    const file = `partials/${name}.html`;
    const html = read(file).trim();
    return `  ${html.split('\n').join('\n  ')}`;
  }).join('\n\n');
}

// Build the full page

function build() {
  const css = read('css/style.css');
  const js = read('js/main.js');
  const body = buildBody();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Atlas</title>
  <meta name="description" content="Atlas backs up browser profiles. Cross-platform, fully offline, fully yours." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://junimobyte.github.io/atlas-website/" />
  <meta property="og:title" content="Atlas — Offline Browser Backups" />
  <meta property="og:description" content="Atlas backs up browser profiles. Cross-platform, fully offline, fully yours." />
  <meta property="og:image" content="https://junimobyte.github.io/atlas-website/assets/og/Image.jpg" />
  <link rel="canonical" href="https://junimobyte.github.io/atlas-website/" />
  <link rel="manifest" href="manifest.json" />

  <!-- X (Twitter) -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://junimobyte.github.io/atlas-website/" />
  <meta property="twitter:title" content="Atlas — Offline Browser Backups" />
  <meta property="twitter:description" content="Atlas backs up browser profiles. Cross-platform, fully offline, fully yours." />
  <meta property="twitter:image" content="https://junimobyte.github.io/atlas-website/assets/og/Image.jpg" />

  <meta name="theme-color" content="#0a0a0b" />
  <link rel="icon" href="assets/ico/Atlas.ico" type="image/x-icon" />
  <link rel="author" href="humans.txt" />

  <style>
${css}
  </style>
</head>
<body>

${body}

  <script>
${js}
  </script>
</body>
</html>
`;

  const outPath = path.resolve(ROOT, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`[OK] Built index.html (${sizeKB} KB)`);
  console.log(`     ${PARTIALS.length} partials assembled`);
}

build();
