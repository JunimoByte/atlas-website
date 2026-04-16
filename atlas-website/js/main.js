/* Atlas — Main Application Script */

// Browser list (used by ticker + scan)

const BROWSERS = [
  'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave', 'Vivaldi', 'Waterfox',
  'Librewolf', 'Pale Moon', 'Basilisk', 'SeaMonkey', 'Flock', 'Spyglass Mosaic',
  'NCSA Mosaic', 'Midori', 'Falkon', 'Konqueror', 'Epiphany',
  'Min', 'Nyxt', 'qutebrowser', 'Floorp', 'Dillo', 'NetSurf', 'Netscape',
  'LibreWolf', 'Palemoon', 'Edge', 'Opera GX', 'Arc',
  'Thorium', 'Floorp', 'Mercury', 'IceCat', 'AOL', 'Mullvad',
  'Baidu', 'Maxthon', 'Opera GX', 'Orion', 'DuckDuckGo',
];


// Ticker

function buildTicker() {
  const t = document.getElementById('ticker');
  if (!t) return;
  const frag = document.createDocumentFragment();
  const list = [...BROWSERS, ...BROWSERS];
  for (let i = 0; i < list.length; i++) {
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


// Scan bars

function buildScanBars() {
  const browsers = [
    { name: 'Chrome', color: 'c1', profiles: 3, size: '1.2 GB', val: 1200 },
    { name: 'Firefox', color: 'c2', profiles: 2, size: '840 MB', val: 840 },
    { name: 'Brave', color: 'c3', profiles: 1, size: '620 MB', val: 620 },
    { name: 'Mosaic', color: 'c4', profiles: 1, size: '4 MB', val: 4 },
    { name: 'Flock', color: 'c5', profiles: 2, size: '210 MB', val: 210 },
    { name: 'Vivaldi', color: 'c6', profiles: 1, size: '380 MB', val: 380 },
  ];
  const wrap = document.getElementById('scanBars');
  if (!wrap) return;
  wrap.innerHTML = browsers.map((b, i) => `
    <div class="scan-browser-row">
      <div class="scan-name">${b.name}</div>
      <div class="scan-track">
        <div class="scan-fill ${b.color}" id="sf${i}"></div>
      </div>
      <div class="scan-pct" id="sp${i}">—</div>
    </div>
  `).join('');
  wrap._meta = browsers;
}

function animateScan() {
  const wrap = document.getElementById('scanBars');
  const browsers = wrap && wrap._meta;
  if (!browsers) return;
  const speeds = [1.4, 1.6, 1.2, 0.8, 1.5, 1.3];
  const maxVal = Math.max(...browsers.map(b => b.val || 100));
  browsers.forEach((b, i) => {
    const fill = document.getElementById(`sf${i}`);
    const label = document.getElementById(`sp${i}`);
    if (!fill) return;
    const targetPct = b.val ? Math.max(2, (b.val / maxVal) * 100) : 100;
    setTimeout(() => {
      fill.classList.add('animating');
      fill.style.width = targetPct + '%';
      fill.style.transitionDuration = speeds[i] + 's';
      label.textContent = b.profiles + (b.profiles === 1 ? ' profile' : ' profiles');
      setTimeout(() => {
        label.textContent = b.size;
      }, speeds[i] * 1000);
    }, i * 220);
  });
  const total = browsers.reduce((s, b) => s + b.profiles, 0);
  const finishMs = (browsers.length - 1) * 220 + Math.max(...speeds) * 1000 + 200;
  setTimeout(() => {
    const statusText = document.getElementById('scanStatusText');
    const spinner = document.querySelector('.scan-spinner');
    if (statusText) statusText.textContent = browsers.length + ' browsers · ' + total + ' profiles · ready to archive';
    if (spinner) spinner.style.borderTopColor = '#22c55e';
  }, finishMs);
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
