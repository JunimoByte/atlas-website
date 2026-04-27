/* Atlas — Optimized Main Application Script */

// Browser list

const BROWSERS = [
  'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave', 'Vivaldi', 'Waterfox',
  'Librewolf', 'Pale Moon', 'Basilisk', 'SeaMonkey', 'Flock', 'Spyglass Mosaic',
  'NCSA Mosaic', 'Midori', 'Falkon', 'Konqueror', 'Epiphany',
  'Min', 'Nyxt', 'qutebrowser', 'Floorp', 'Dillo', 'NetSurf', 'Netscape',
  'LibreWolf', 'Palemoon', 'Edge', 'Opera GX', 'Arc',
  'Thorium', 'Floorp', 'Mercury', 'IceCat', 'AOL', 'Mullvad',
  'Baidu', 'Maxthon', 'Opera GX', 'Orion', 'DuckDuckGo',
];

// Cache helper

const $ = (id) => document.getElementById(id);


// Ticker

function buildTicker() {
  const t = $('ticker');
  if (!t) return;

  const frag = document.createDocumentFragment();
  const list = BROWSERS.concat(BROWSERS);

  for (let i = 0, len = list.length; i < len; i++) {
    const el = document.createElement('div');
    el.className = 'ticker-item';

    const dot = document.createElement('span');
    dot.className = 'ticker-dot';

    el.appendChild(dot);
    el.appendChild(document.createTextNode(list[i]));
    frag.appendChild(el);
  }

  t.appendChild(frag);
}


// Scan bars (cached)

let scanCache = null;

function buildScanBars() {
  const data = [
    { name: 'Chrome', color: 'c1', profiles: 3, size: '1.2 GB', val: 1200 },
    { name: 'Firefox', color: 'c2', profiles: 2, size: '840 MB', val: 840 },
    { name: 'Brave', color: 'c3', profiles: 1, size: '620 MB', val: 620 },
    { name: 'Mosaic', color: 'c4', profiles: 1, size: '4 MB', val: 4 },
    { name: 'Flock', color: 'c5', profiles: 2, size: '210 MB', val: 210 },
    { name: 'Vivaldi', color: 'c6', profiles: 1, size: '380 MB', val: 380 },
  ];

  const wrap = $('scanBars');
  if (!wrap) return;

  wrap.innerHTML = data.map((b, i) => `
    <div class="scan-browser-row">
      <div class="scan-name">${b.name}</div>
      <div class="scan-track">
        <div class="scan-fill ${b.color}" id="sf${i}"></div>
      </div>
      <div class="scan-pct" id="sp${i}">—</div>
    </div>
  `).join('');

  scanCache = data.map((b, i) => ({
    ...b,
    fill: $('sf' + i),
    label: $('sp' + i)
  }));
}


// 🚀 Smooth animation (GPU-based)

function animateScan() {
  if (!scanCache) return;

  const speeds = [1.4, 1.6, 1.2, 0.8, 1.5, 1.3];
  const maxVal = Math.max(...scanCache.map(b => b.val || 100));

  let longest = 0;

  requestAnimationFrame(() => {
    scanCache.forEach((b, i) => {
      if (!b.fill) return;

      const pct = b.val ? Math.max(2, (b.val / maxVal) * 100) : 100;
      const scale = pct / 100;

      const dur = speeds[i];
      const delay = i * 220;

      longest = Math.max(longest, delay + dur * 1000);

      b.fill.style.transition = `transform ${dur}s cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
      b.fill.style.transform = `scaleX(${scale})`;

      // Label updates (minimal timers)
      setTimeout(() => {
        b.label.textContent =
          b.profiles + (b.profiles === 1 ? ' profile' : ' profiles');

        setTimeout(() => {
          b.label.textContent = b.size;
        }, dur * 1000);

      }, delay);
    });

    // Final UI update
    setTimeout(() => {
      const statusText = $('scanStatusText');
      const spinner = document.querySelector('.scan-spinner');

      if (statusText) {
        const total = scanCache.reduce((s, b) => s + b.profiles, 0);
        statusText.textContent =
          scanCache.length + ' browsers · ' + total + ' profiles · ready to archive';
      }

      if (spinner) spinner.style.borderTopColor = '#22c55e';

    }, longest + 200);
  });
}


// Modal

function openDownload() { $('dlModal')?.classList.add('open'); }
function closeDownload() { $('dlModal')?.classList.remove('open'); }

function closeIfOverlay(e) {
  if (e.target === $('dlModal')) closeDownload();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDownload();
});


// Shared observer

const io = new IntersectionObserver((entries, obs) => {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!entry.isIntersecting) continue;

    const el = entry.target;

    if (el.classList.contains('reveal')) {
      el.classList.add('visible');
    }

    if (el.id === 'pipeline') {
      const steps = el.querySelectorAll('.pipe-step');
      steps.forEach(step => {
        const delay = parseInt(step.dataset.delay) || 0;
        step.style.transitionDelay = delay + 'ms';
        step.classList.add('lit');
      });
    }

    if (el.classList.contains('scan-demo')) {
      animateScan();
    }

    obs.unobserve(el);
  }
}, { threshold: 0.15 });


// Observe

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const pipeline = $('pipeline');
if (pipeline) io.observe(pipeline);

const scanDemo = document.querySelector('.scan-demo');
if (scanDemo) io.observe(scanDemo);


// Init

buildTicker();
buildScanBars();