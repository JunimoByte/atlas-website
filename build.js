/** Build Script
 *
 *  Assembles partials into a single index.html with minified CSS and JS.
 *
 *  Usage:
 *    node build.js
 *
 *  Output is written to ./index.html.
 *  Edit partials in ./partials/, styles in ./css/,
 *  and scripts in ./js/ — then rebuild.
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const ROOT = __dirname;

// Ordered list of partials to inject into <body>

const PARTIALS = [
  'nav',
  'hero',
  'ticker',
  'platforms',
  'features',
  'pipeline',
  'scan',
  'trust',
  'changelog',
  'details',
  'ownership',
  'footer',
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

// Minify CSS

function minifyCSS(source) {
  const result = new CleanCSS({ level: 2 }).minify(source);
  if (result.errors.length) {
    console.error('[WARN] CSS minification errors:', result.errors);
  }
  return result.styles;
}

// Minify JS (returns a Promise)

async function minifyJS(source) {
  const result = await minify(source, {
    compress: { drop_console: false },
    mangle: true,
  });
  if (!result.code) {
    console.error('[WARN] JS minification produced no output, using source.');
    return source;
  }
  return result.code;
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

async function build() {
  const rawCSS = read('css/style.css');
  const rawJS = read('js/main.js');
  const body = buildBody();

  // Split CSS at the DEFERRED START marker
  const splitMarker = '/* DEFERRED START */';
  const splitIndex = rawCSS.indexOf(splitMarker);
  if (splitIndex === -1) {
    console.error('[ERROR] DEFERRED START marker not found in css/style.css');
    process.exit(1);
  }
  const rawCritical = rawCSS.slice(0, splitIndex);
  const rawDeferred = rawCSS.slice(splitIndex + splitMarker.length);

  const critical = minifyCSS(rawCritical);
  const deferred = minifyCSS(rawDeferred);
  const js = await minifyJS(rawJS);

  // Write deferred CSS as a separate served file
  const deferredOut = path.resolve(ROOT, 'css', 'atlas.min.css');
  fs.writeFileSync(deferredOut, deferred, 'utf-8');
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

  <style>${critical}</style>
  <link rel="preload" href="css/atlas.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="css/atlas.min.css" /></noscript>
</head>
<body>

${body}

  <script>${js}</script>
</body>
</html>
`;

  const outPath = path.resolve(ROOT, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  const rawCSSKB = (Buffer.byteLength(rawCSS, 'utf-8') / 1024).toFixed(1);
  const critKB = (Buffer.byteLength(critical, 'utf-8') / 1024).toFixed(1);
  const defKB = (Buffer.byteLength(deferred, 'utf-8') / 1024).toFixed(1);
  const rawJSKB = (Buffer.byteLength(rawJS, 'utf-8') / 1024).toFixed(1);
  const minJSKB = (Buffer.byteLength(js, 'utf-8') / 1024).toFixed(1);

  console.log(`[OK] Built index.html (${sizeKB} KB)`);
  console.log(`     ${PARTIALS.length} partials assembled`);
  console.log(`     CSS  ${rawCSSKB} KB total -> ${critKB} KB critical (inline) + ${defKB} KB deferred (css/atlas.min.css)`);
  console.log(`     JS   ${rawJSKB} KB -> ${minJSKB} KB`);
}

build().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
