/* Atlas — Main Application Script */

// Browser list (used by ticker + scan)

const BROWSERS = [
  'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave', 'Vivaldi', 'Waterfox',
  'Librewolf', 'Pale Moon', 'Basilisk', 'SeaMonkey', 'Flock', 'Spyglass Mosaic',
  'NCSA Mosaic', 'WWW Browser', 'Midori', 'Falkon', 'Konqueror', 'Epiphany',
  'Min', 'Nyxt', 'qutebrowser', 'Lagrange', 'Dillo', 'NetSurf', 'Links2',
  'Chrome Dev', 'Firefox Nightly', 'Edge Canary', 'Opera GX', 'Arc',
  'Thorium', 'Floorp', 'Mercury', 'IceCat', 'Tor Browser', 'Mullvad',
  'Chrome Beta', 'Edge Beta', 'Firefox Beta', 'Orion', 'Chromium',
];


// Ticker

function buildTicker() {
  const t = document.getElementById('ticker');
  if (!t) return;
  const doubled = [...BROWSERS, ...BROWSERS];
  t.innerHTML = doubled.map(b =>
    `<div class="ticker-item"><span class="ticker-dot"></span>${b}</div>`
  ).join('');
}


// Scan bars

function buildScanBars() {
  const browsers = [
    { name: 'Chrome',  color: 'c1' },
    { name: 'Firefox', color: 'c2' },
    { name: 'Brave',   color: 'c3' },
    { name: 'Mosaic',  color: 'c4' },
    { name: 'Flock',   color: 'c5' },
    { name: 'Vivaldi', color: 'c6' },
  ];
  const wrap = document.getElementById('scanBars');
  if (!wrap) return;
  wrap.innerHTML = browsers.map((b, i) => `
    <div class="scan-browser-row">
      <div class="scan-name">${b.name}</div>
      <div class="scan-track">
        <div class="scan-fill ${b.color}" id="sf${i}"></div>
      </div>
      <div class="scan-pct" id="sp${i}">0%</div>
    </div>
  `).join('');
}

function animateScan() {
  const targets = [92, 87, 100, 64, 78, 95];
  targets.forEach((t, i) => {
    const fill = document.getElementById(`sf${i}`);
    const pct  = document.getElementById(`sp${i}`);
    if (!fill) return;
    setTimeout(() => {
      fill.classList.add('animating');
      fill.style.width = t + '%';
      let cur = 0;
      const interval = setInterval(() => {
        cur = Math.min(cur + Math.ceil(t / 30), t);
        pct.textContent = cur + '%';
        if (cur >= t) clearInterval(interval);
      }, 60);
    }, i * 260);
  });
  setTimeout(() => {
    const statusText = document.getElementById('scanStatusText');
    const spinner = document.querySelector('.scan-spinner');
    if (statusText) statusText.textContent = '6 browsers · 34 profiles found · 2.1 GB estimated';
    if (spinner) spinner.style.borderTopColor = '#22c55e';
  }, 2600);
}


// Download modal

function openDownload() {
  document.getElementById('dlModal').classList.add('open');
}

function closeDownload() {
  document.getElementById('dlModal').classList.remove('open');
}

function closeIfOverlay(e) {
  if (e.target === document.getElementById('dlModal')) closeDownload();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDownload();
});


// Scroll reveal

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Pipeline animation

const pipeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const steps = entry.target.querySelectorAll('.pipe-step');
      steps.forEach((step, i) => {
        const delay = parseInt(step.dataset.delay) || 0;
        setTimeout(() => step.classList.add('lit'), delay);
      });
      pipeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const pipeline = document.getElementById('pipeline');
if (pipeline) pipeObserver.observe(pipeline);


// Scan demo observer

const scanObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateScan();
      scanObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const scanDemo = document.querySelector('.scan-demo');
if (scanDemo) scanObserver.observe(scanDemo);


// Nav scroll effect

const nav = document.getElementById('topnav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 20
      ? 'rgba(10,10,11,0.92)'
      : 'rgba(10,10,11,0.72)';
  }, { passive: true });
}


// Init

buildTicker();
buildScanBars();
