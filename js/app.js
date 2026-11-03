/* ═══════════════════════════════════════════════════════════
   تدفّق — مركز إدارة المال الشخصي
   محرك التطبيق: حالة، رسوم بيانية مرسومة يدويًا، ذكاء مالي
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─────────── الأيقونات ─────────── */
const I = {
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
};

/* ─────────── الثوابت ─────────── */
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const SHORT_AR  = ['ينا','فبر','مار','أبر','ماي','يون','يول','أغس','سبت','أكت','نوف','ديس'];
const CURS = ['ر.س','د.إ','$','€','ج.م','د.ك','£','₺'];

const CATS = {
  expense: [
    {id:'food',       name:'طعام ومشروبات', icon:'🍜', color:'#f97316'},
    {id:'transport',  name:'مواصلات',       icon:'🚕', color:'#22d3ee'},
    {id:'home',       name:'إيجار وفواتير', icon:'🏠', color:'#8b5cf6'},
    {id:'shopping',   name:'تسوّق',          icon:'🛍️', color:'#fb7185'},
    {id:'fun',        name:'ترفيه',         icon:'🎬', color:'#34d399'},
    {id:'health',     name:'صحة',           icon:'💊', color:'#fbbf24'},
    {id:'education',  name:'تعليم',         icon:'📚', color:'#60a5fa'},
    {id:'other',      name:'أخرى',          icon:'✨', color:'#94a3b8'},
  ],
  income: [
    {id:'salary',    name:'راتب',      icon:'💼', color:'#34d399'},
    {id:'freelance', name:'عمل حر',    icon:'💻', color:'#22d3ee'},
    {id:'invest',    name:'استثمارات', icon:'📈', color:'#8b5cf6'},
    {id:'gift',      name:'هدية',      icon:'🎁', color:'#fb7185'},
    {id:'other-i',   name:'أخرى',      icon:'💰', color:'#fbbf24'},
  ],
};
const GOAL_COLORS = ['#8b5cf6','#22d3ee','#fb7185','#34d399','#fbbf24','#f97316'];
const PAGE_META = {
  dashboard:  ['لوحة التحكم','نظرة شاملة على أموالك'],
  transactions:['المعاملات','سجّل دخلك ومصاريفك'],
  budgets:    ['الميزانيات','تحكّم في سقف صرفك الشهري'],
  goals:      ['الأهداف','ادّخر من أجل ما تحب'],
  reports:    ['التقارير','تحليلات وذكاء مالي'],
  settings:   ['الإعدادات','خصّص تجربتك'],
};

/* ─────────── أدوات مساعدة ─────────── */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const easeOut = t => 1 - Math.pow(1 - t, 3);
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

const fmt   = n => (Math.round(n * 100) / 100).toLocaleString('en-US', {maximumFractionDigits: 2});
const money = n => fmt(n) + ' ' + S.settings.currency;
const fmtK  = v => v >= 1000 ? (Math.round(v / 100) / 10) + 'ك' : String(Math.round(v));

const pad2 = n => String(n).padStart(2, '0');
const dISO = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const todayISO = () => dISO(new Date());
const monthKey = iso => iso.slice(0, 7);
const monthLabel = mk => { const [y, m] = mk.split('-'); return MONTHS_AR[+m - 1] + ' ' + y; };
const shortMonth = mk => SHORT_AR[+mk.split('-')[1] - 1];
const monthAdd = (mk, d) => { const [y, m] = mk.split('-').map(Number); const dt = new Date(y, m - 1 + d, 1); return dt.getFullYear() + '-' + pad2(dt.getMonth() + 1); };
const daysInMonth = mk => { const [y, m] = mk.split('-').map(Number); return new Date(y, m, 0).getDate(); };
const lastNMonths = n => { const out = []; const mk = monthKey(todayISO()); for (let i = n - 1; i >= 0; i--) out.push(monthAdd(mk, -i)); return out; };
const fmtDate = ds => { const d = new Date(ds + 'T00:00:00'); return d.getDate() + ' ' + MONTHS_AR[d.getMonth()] + ' ' + d.getFullYear(); };
const daysLeft = iso => Math.ceil((new Date(iso + 'T00:00:00') - new Date(todayISO() + 'T00:00:00')) / 864e5);

const catOf = t => (CATS[t.type] || CATS.expense).find(c => c.id === t.category) || {id: t.category, name: 'أخرى', icon: t.type === 'income' ? '💰' : '✨', color: '#94a3b8'};
const catById = id => CATS.expense.find(c => c.id === id) || CATS.income.find(c => c.id === id);

const sortedTx = () => [...S.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
const uniqueMonths = () => [...new Set(S.transactions.map(t => t.date.slice(0, 7)))].sort().reverse();
const monthTx = mk => S.transactions.filter(t => t.date.startsWith(mk));
function monthSums(mk) {
  let income = 0, expense = 0;
  for (const t of S.transactions) if (t.date.startsWith(mk)) t.type === 'income' ? income += t.amount : expense += t.amount;
  return {income, expense};
}
function catBreakdown(mk) {
  const map = {};
  for (const t of S.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(mk)) continue;
    const c = catOf(t);
    map[c.id] = map[c.id] || {id: c.id, name: c.name, icon: c.icon, color: c.color, value: 0};
    map[c.id].value += t.amount;
  }
  return Object.values(map).sort((a, b) => b.value - a.value);
}
const balanceAll = () => S.transactions.reduce((a, t) => a + (t.type === 'income' ? t.amount : -t.amount), 0);

/* ─────────── الخريطة الحرارية اليومية ─────────── */
function heatmapData(mk) {
  const perDay = {};
  for (const t of S.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(mk)) continue;
    const d = +t.date.slice(8, 10);
    perDay[d] = (perDay[d] || 0) + t.amount;
  }
  return {perDay};
}
function heatmapHTML(mk) {
  const {perDay} = heatmapData(mk);
  const dim = daysInMonth(mk);
  const mIdx = +mk.slice(5, 7) - 1;
  const max = Math.max(0, ...Object.values(perDay));
  const today = todayISO();
  const isCur = mk === monthKey(today);
  const curDay = +today.slice(8, 10);
  const firstDow = new Date(mk + '-01T00:00:00').getDay();
  const dows = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت'];
  let cells = '', bestDay = 0, bestVal = 0, noSpend = 0;
  for (let i = 0; i < firstDow; i++) cells += '<span></span>';
  for (let d = 1; d <= dim; d++) {
    const v = perDay[d] || 0;
    if (v > bestVal) { bestVal = v; bestDay = d; }
    const future = isCur && d > curDay;
    if (!future && v === 0) noSpend++;
    let style = '';
    if (future) style = '';
    else if (max > 0 && v > 0) {
      const ratio = v / max;
      const hue = ratio < .34 ? '52,211,153' : ratio < .67 ? '251,191,36' : '251,113,133';
      const alpha = .28 + ratio * .72;
      style = `background:rgba(${hue},${alpha.toFixed(2)});` + (ratio >= .34 ? 'color:#fff;' : '');
    }
    cells += `<div class="hm-cell ${future ? 'offday' : ''} ${isCur && d === curDay ? 'today' : ''}" style="${style}" title="${d} ${MONTHS_AR[mIdx]}${v ? ' — ' + money(v) : ' — بلا صرف'}">${d}</div>`;
  }
  return `
  <div class="hm-dows">${dows.map(d => `<span>${d}</span>`).join('')}</div>
  <div class="hm-grid">${cells}</div>
  <div class="hm-stats">
    <span class="chip">🔥 أعلى يوم: ${bestDay ? bestDay + ' ' + MONTHS_AR[mIdx] + ' (' + money(bestVal) + ')' : '—'}</span>
    <span class="chip">🧘 أيام بلا صرف: ${noSpend}</span>
  </div>
  <div class="hm-legend">أقل <i style="background:rgba(52,211,153,.3)"></i><i style="background:rgba(251,191,36,.55)"></i><i style="background:rgba(251,113,133,.75)"></i><i style="background:rgba(251,113,133,1)"></i> أكثر</div>`;
}

/* ─────────── الحالة والتخزين ─────────── */
const STORE_KEY = 'tadafuq_v1';

function normalize(d) {
  const s = d && typeof d === 'object' ? d : {};
  const budgets = {};
  if (s.budgets && typeof s.budgets === 'object')
    for (const [k, v] of Object.entries(s.budgets)) if (+v > 0) budgets[k] = +v;
  return {
    transactions: Array.isArray(s.transactions) ? s.transactions
      .filter(t => t && t.amount != null && t.date)
      .map(t => ({id: String(t.id || uid()), type: t.type === 'income' ? 'income' : 'expense', amount: +t.amount || 0, category: String(t.category || 'other'), date: String(t.date), note: String(t.note || ''), _rec: t._rec ? String(t._rec) : ''}))
      : [],
    recurring: Array.isArray(s.recurring) ? s.recurring
      .filter(r => r && r.amount != null)
      .map(r => ({id: String(r.id || uid()), type: r.type === 'income' ? 'income' : 'expense', amount: +r.amount || 0, category: String(r.category || 'other'), note: String(r.note || ''), day: Math.min(28, Math.max(1, +r.day || 1)), active: r.active !== false, lastRun: /^\d{4}-\d{2}$/.test(String(r.lastRun || '')) ? String(r.lastRun) : ''}))
      : [],
    challenges: (s.challenges && typeof s.challenges === 'object') ? {
      w52: (s.challenges.w52 && Array.isArray(s.challenges.w52.weeks))
        ? {start: String(s.challenges.w52.start || ''), weeks: s.challenges.w52.weeks.slice(0, 52).map(w => !!w)}
        : null,
      noSpendGoal: Math.min(31, Math.max(1, +s.challenges.noSpendGoal || 8)),
    } : {w52: null, noSpendGoal: 8},
    budgets,
    goals: Array.isArray(s.goals) ? s.goals
      .filter(g => g && g.id)
      .map(g => ({id: String(g.id), name: String(g.name || 'هدف'), target: +g.target || 0, saved: +g.saved || 0, deadline: g.deadline || '', color: g.color || '#8b5cf6'}))
      : [],
    settings: Object.assign({theme: 'dark', currency: 'ر.س'}, s.settings || {}),
  };
}

function seedState() {
  const tx = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const base = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = base.getFullYear(), m = base.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const cap = i === 0 ? now.getDate() : dim;
    const add = (day, type, category, amount, note) => {
      const dd = Math.max(1, Math.min(day, cap));
      tx.push({id: uid() + Math.random().toString(36).slice(2, 4), type, category, amount: Math.round(amount), note, date: y + '-' + pad2(m + 1) + '-' + pad2(dd)});
    };
    add(1, 'income', 'salary', 8500, 'راتب شهري');
    if (Math.random() > .5) add(13 + Math.floor(Math.random() * 9), 'income', 'freelance', 400 + Math.round(Math.random() * 900), 'مشروع حر');
    add(2, 'expense', 'home', 2000, 'إيجار الشقة');
    add(5, 'expense', 'home', 130 + Math.round(Math.random() * 220), 'فاتورة كهرباء وماء');
    for (let w = 1; w <= 4; w++) add(w * 7 - Math.floor(Math.random() * 2), 'expense', 'food', 150 + Math.round(Math.random() * 280), 'تسوق البقالة الأسبوعي');
    for (let w = 1; w <= 4; w++) add(w * 7 + 2, 'expense', 'transport', 40 + Math.round(Math.random() * 90), 'مواصلات');
    if (Math.random() > .3) add(9 + Math.floor(Math.random() * 15), 'expense', 'fun', 60 + Math.round(Math.random() * 170), 'سينما / مطعم');
    if (Math.random() > .4) add(7 + Math.floor(Math.random() * 16), 'expense', 'shopping', 80 + Math.round(Math.random() * 360), 'تسوّق أونلاين');
    if (Math.random() > .6) add(12, 'expense', 'health', 90 + Math.round(Math.random() * 200), 'صيدلية');
    if (Math.random() > .5) add(18, 'expense', 'education', 100 + Math.round(Math.random() * 250), 'كتاب / كورس');
  }
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return dISO(d); };
  const state = normalize({
    transactions: tx,
    budgets: {food: 1500, transport: 400, home: 2500, shopping: 800, fun: 300, health: 200, education: 300, other: 200},
    goals: [
      {id: uid(), name: 'iPhone جديد 📱', target: 5500, saved: 2100, deadline: addDays(120), color: '#8b5cf6'},
      {id: uid(), name: 'صندوق الطوارئ 🛟', target: 20000, saved: 13500, deadline: addDays(365), color: '#22d3ee'},
      {id: uid(), name: 'رحلة إلى اليابان ✈️', target: 15000, saved: 5400, deadline: addDays(240), color: '#fb7185'},
    ],
    recurring: [
      {type: 'income', amount: 8500, category: 'salary', note: 'راتب شهري', day: 1, active: true, lastRun: monthKey(todayISO())},
      {type: 'expense', amount: 2000, category: 'home', note: 'إيجار الشقة', day: 2, active: true, lastRun: monthKey(todayISO())},
      {type: 'expense', amount: 39, category: 'fun', note: 'اشتراك ترفيه', day: 7, active: true, lastRun: monthKey(todayISO())},
    ],
    challenges: {w52: null, noSpendGoal: 8},
    settings: {theme: 'dark', currency: 'ر.س'},
  });
  state._seeded = true;
  return state;
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch (e) {}
  const s = seedState();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}
let S = load();
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {}
  updateChrome();
}

/* ─────────── المعاملات المتكررة ─────────── */
function processRecurring() {
  const today = todayISO(), curMk = monthKey(today), curDay = +today.slice(8, 10);
  let added = 0;
  for (const r of S.recurring) {
    if (!r.active) continue;
    let mk = r.lastRun ? monthAdd(r.lastRun, 1) : curMk;
    let guard = 0;
    while (mk <= curMk && guard++ < 60) {
      const day = Math.min(r.day, daysInMonth(mk));
      if (mk === curMk && day > curDay) break;
      S.transactions.push({id: uid(), type: r.type, amount: r.amount, category: r.category, note: r.note, date: mk + '-' + pad2(day), _rec: r.id});
      added++;
      r.lastRun = mk;
      mk = monthAdd(mk, 1);
    }
  }
  if (added) {
    save();
    toast(`🔁 سجّلنا ${added} ${added === 1 ? 'معاملة متكررة' : 'معاملات متكررة'} تلقائيًا`, 'info');
  }
}

/* ─────────── الإشعارات والتأكيد ─────────── */
function toast(msg, type = 'info', actionLabel, actionFn) {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span class="t-dot"></span><span>${esc(msg)}</span>` +
    (actionLabel ? `<button class="toast-action">${esc(actionLabel)}</button>` : '');
  if (actionLabel) {
    el.querySelector('.toast-action').addEventListener('click', () => { actionFn(); el.remove(); });
  }
  $('#toasts').appendChild(el);
  const ttl = actionLabel ? 6000 : 3500;
  setTimeout(() => { if (el.isConnected) { el.classList.add('out'); setTimeout(() => el.remove(), 450); } }, ttl);
}
let onConfirm = null;
function showConfirm(title, msg, cb) {
  $('#confirm-title').textContent = title;
  $('#confirm-msg').textContent = msg;
  onConfirm = cb;
  openModal('confirm-modal');
}
function openModal(id) { $('#' + id).classList.add('open'); document.body.classList.add('no-scroll'); }
function closeModals() { $$('.modal-backdrop.open').forEach(m => m.classList.remove('open')); document.body.classList.remove('no-scroll'); }

/* ─────────── الخلفية: جزيئات + توهج المؤشر + كونفيتي ─────────── */
let bgColorRGB = '139,152,255';
const bgParts = [];
function initParticles() {
  const cv = $('#bg-canvas'), ctx = cv.getContext('2d');
  const size = () => {
    const d = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  size();
  addEventListener('resize', size);
  const N = innerWidth < 700 ? 30 : 58;
  for (let i = 0; i < N; i++) bgParts.push({x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.8 + .8});
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of bgParts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = innerWidth; if (p.x > innerWidth) p.x = 0;
      if (p.y < 0) p.y = innerHeight; if (p.y > innerHeight) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(${bgColorRGB},.5)`; ctx.fill();
    }
    for (let i = 0; i < bgParts.length; i++) for (let j = i + 1; j < bgParts.length; j++) {
      const a = bgParts[i], b = bgParts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 < 12100) {
        ctx.strokeStyle = `rgba(${bgColorRGB},${(1 - d2 / 12100) * .14})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  })();
}
function initCursorGlow() {
  const g = $('.cursor-glow'); if (!g) return;
  let raf = 0;
  addEventListener('mousemove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
  }, {passive: true});
}
const confetti = (() => {
  const cv = $('#confetti-canvas'), ctx = cv.getContext('2d');
  let parts = [], raf = null;
  const size = () => {
    const d = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  size(); addEventListener('resize', size);
  const COLS = ['#818cf8','#22d3ee','#34d399','#fbbf24','#fb7185','#f472b6'];
  function burst(x = innerWidth / 2, y = innerHeight * .35, n = 170) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 8;
      parts.push({x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3, s: 5 + Math.random() * 6, c: COLS[i % COLS.length], rot: Math.random() * 6.3, vr: (Math.random() - .5) * .3, life: 1});
    }
    if (!raf) tick();
  }
  function tick() {
    raf = requestAnimationFrame(tick);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += .16; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.rot += p.vr; p.life -= .008;
      if (p.life <= 0 || p.y > innerHeight + 40) continue;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .66);
      ctx.restore();
    }
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
    if (!parts.length) { cancelAnimationFrame(raf); raf = null; }
  }
  return {burst};
})();

/* ─────────── أدوات الرسم على Canvas ─────────── */
function setup(canvas) {
  const dpr = Math.min(2, devicePixelRatio || 1);
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return {ctx, w: r.width, h: r.height};
}
function niceMax(v) {
  if (v <= 0) return 10;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}
function moveSmooth(ctx, pts) {
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1], p1 = pts[i], mx = (p0.x + p1.x) / 2;
    ctx.bezierCurveTo(mx, p0.y, mx, p1.y, p1.x, p1.y);
  }
}

/* — الرسم الخطي — */
function drawLine(canvas, labels, series) {
  const {ctx, w, h} = setup(canvas);
  const pad = {t: 18, r: 16, b: 30, l: 38};
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = niceMax(Math.max(...series.flatMap(s => s.data), 1) * 1.12);
  const X = i => pad.l + (labels.length === 1 ? iw / 2 : i * iw / (labels.length - 1));
  const Y = v => pad.t + ih - (v / max) * ih;
  const gridC = cssVar('--grid-c') || 'rgba(148,163,184,.14)';
  const txtC = cssVar('--text2') || '#98a3c3';
  function base() {
    ctx.clearRect(0, 0, w, h);
    ctx.font = '10.5px Tajawal, sans-serif';
    for (let g = 0; g <= 4; g++) {
      const v = max * g / 4, y = Y(v);
      ctx.strokeStyle = gridC; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = txtC; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(fmtK(v), 2, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    labels.forEach((L, i) => { ctx.fillStyle = txtC; ctx.fillText(L, X(i), h - 9); });
  }
  const t0 = performance.now(), dur = 1100;
  (function frame(t) {
    const p = easeOut(Math.min(1, (t - t0) / dur));
    base();
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, pad.l + iw * p + 3, h); ctx.clip();
    for (const s of series) {
      const pts = s.data.map((v, i) => ({x: X(i), y: Y(v)}));
      const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ih);
      grad.addColorStop(0, s.color + '30');
      grad.addColorStop(1, s.color + '00');
      ctx.beginPath(); moveSmooth(ctx, pts);
      ctx.lineTo(pts[pts.length - 1].x, Y(0)); ctx.lineTo(pts[0].x, Y(0)); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); moveSmooth(ctx, pts);
      ctx.strokeStyle = s.color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
      for (const pt of pts) {
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.4, 0, 7); ctx.fillStyle = s.color; ctx.fill();
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.5, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
      }
    }
    ctx.restore();
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}

/* — الرسم الدائري (الدونات) — */
function drawDonut(canvas, items) {
  const {ctx, w, h} = setup(canvas);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 15, LW = 25;
  const total = items.reduce((a, i) => a + i.value, 0);
  const track = cssVar('--surface3') || 'rgba(148,163,184,.16)';
  canvas._segs = [];
  function draw(sweep) {
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = track; ctx.lineWidth = LW; ctx.stroke();
    if (total <= 0) return;
    let a = -Math.PI / 2;
    const gap = items.length > 1 ? .04 : 0;
    canvas._segs = [];
    for (const it of items) {
      const ang = it.value / total * Math.PI * 2 * sweep;
      const start = a + gap / 2, end = a + ang - gap / 2;
      if (end > start) {
        ctx.beginPath(); ctx.arc(cx, cy, R, start, end);
        ctx.strokeStyle = it.color; ctx.lineWidth = LW; ctx.lineCap = 'butt'; ctx.stroke();
      }
      canvas._segs.push({start: a, end: a + ang, item: it});
      a += ang;
    }
  }
  const t0 = performance.now(), dur = 1000;
  (function fr(t) {
    const p = easeOut(Math.min(1, (t - t0) / dur));
    draw(p);
    if (p < 1) requestAnimationFrame(fr);
  })(t0);
}
function bindDonutHover(canvas) {
  const tip = $('#donut-tip'), wrap = canvas.parentElement;
  canvas.addEventListener('mousemove', e => {
    const segs = canvas._segs || [];
    if (!segs.length) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = canvas.clientWidth / 2, cy = canvas.clientHeight / 2, R = Math.min(canvas.clientWidth, canvas.clientHeight) / 2 - 15;
    const d = Math.hypot(x - cx, y - cy);
    if (d < R - 14 || d > R + 14) { tip.style.opacity = 0; return; }
    let ang = Math.atan2(y - cy, x - cx);
    ang = (ang + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const seg = segs.find(s => ang >= s.start && ang <= s.end);
    if (seg) {
      tip.textContent = seg.item.label + ' — ' + money(seg.item.value);
      tip.style.left = x + 'px'; tip.style.top = (y - 12) + 'px'; tip.style.opacity = 1;
    } else tip.style.opacity = 0;
  });
  canvas.addEventListener('mouseleave', () => { tip.style.opacity = 0; });
  wrap.addEventListener('mouseleave', () => { tip.style.opacity = 0; });
}

/* — الرسم بالأعمدة — */
function drawBar(canvas, labels, groups) {
  const {ctx, w, h} = setup(canvas);
  const pad = {t: 18, r: 12, b: 30, l: 38};
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = niceMax(Math.max(...groups.flatMap(g => [g.income, g.expense]), 1) * 1.12);
  const slot = iw / labels.length;
  const bw = Math.min(16, slot / 3.6);
  const gridC = cssVar('--grid-c') || 'rgba(148,163,184,.14)';
  const txtC = cssVar('--text2') || '#98a3c3';
  const t0 = performance.now(), dur = 950;
  (function fr(t) {
    const p = easeOut(Math.min(1, (t - t0) / dur));
    ctx.clearRect(0, 0, w, h);
    ctx.font = '10.5px Tajawal, sans-serif';
    for (let g = 0; g <= 4; g++) {
      const v = max * g / 4, y = pad.t + ih - (v / max) * ih;
      ctx.strokeStyle = gridC; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillStyle = txtC; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(fmtK(v), 2, y);
    }
    ctx.textBaseline = 'alphabetic';
    labels.forEach((L, i) => {
      const cx0 = pad.l + slot * i + slot / 2;
      ctx.fillStyle = txtC; ctx.textAlign = 'center';
      ctx.fillText(L, cx0, h - 9);
      const g = groups[i];
      const bars = [
        {v: g.income,  c: '#34d399', x: cx0 + 2},
        {v: g.expense, c: '#fb7185', x: cx0 - bw - 2},
      ];
      for (const b of bars) {
        const bh = (b.v / max) * ih * p;
        if (bh < .5) continue;
        const y = pad.t + ih - bh;
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(b.x, y, bw, bh, Math.min(4, bw / 2)); ctx.fillStyle = b.c; ctx.fill(); }
        else { ctx.fillStyle = b.c; ctx.fillRect(b.x, y, bw, bh); }
      }
    });
    if (p < 1) requestAnimationFrame(fr);
  })(t0);
}

/* — حلقة SVG — */
function ringSVG(p, color, size = 92, stroke = 9) {
  const r = (size - stroke) / 2 - 2;
  const C = 2 * Math.PI * r;
  const off = C * (1 - Math.min(1, Math.max(0, p)));
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke-width:${stroke}"/>
      <circle class="ring-val" cx="${size / 2}" cy="${size / 2}" r="${r}" style="stroke:${color};stroke-width:${stroke};stroke-dasharray:${C.toFixed(1)};stroke-dashoffset:${C.toFixed(1)}" data-off="${off.toFixed(1)}"/>
    </svg>
    <div class="ring-txt" style="color:${color}">${Math.round(Math.min(1, Math.max(0, p)) * 100)}%</div>
  </div>`;
}

/* — الحركات المشتركة — */
function animateCounters(root) {
  root.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 950;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(target * easeOut(p)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}
function animateBars(root) {
  root.querySelectorAll('.bar-fill[data-w]').forEach(el => {
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = el.dataset.w + '%'; }));
  });
}
function animateRings(root) {
  root.querySelectorAll('.ring-val[data-off]').forEach(c => {
    requestAnimationFrame(() => requestAnimationFrame(() => { c.style.strokeDashoffset = c.dataset.off; }));
  });
}

/* ─────────── قوالب مشتركة ─────────── */
function txRow(t) {
  const c = catOf(t);
  return `<div class="tx-row" data-id="${t.id}">
    <div class="tx-icon">${c.icon}</div>
    <div class="tx-info"><b>${esc(t.note || c.name)}</b><span>${c.name} • ${fmtDate(t.date)}${t._rec ? ' • 🔁' : ''}</span></div>
    <div class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '−'} ${fmt(t.amount)} <small>${S.settings.currency}</small></div>
    <div class="tx-actions">
      <button class="icon-btn act-edit" title="تعديل">${I.edit}</button>
      <button class="icon-btn act-del" title="حذف">${I.trash}</button>
    </div>
  </div>`;
}
function insightHTML(i) {
  return `<div class="insight ${i.tone}"><span class="i-icon">${i.icon}</span><div><b>${i.title}</b><p>${i.text}</p></div></div>`;
}
function emptyHTML(kind) {
  const map = {
    tx:   {i: '🧾', t: 'لا توجد معاملات', s: 'ابدأ بتسجيل أول معاملة لك'},
    goal: {i: '🎯', t: 'لا توجد أهداف بعد', s: 'حدّد هدفك الأول وابدأ الادخار نحوه'},
  };
  const m = map[kind] || map.tx;
  return `<div class="empty"><div class="e-icon">${m.i}</div><b>${m.t}</b><p>${m.s}</p>
    <button class="btn btn-primary empty-cta" data-empty="${kind}">${kind === 'goal' ? '+ هدف جديد' : '+ معاملة جديدة'}</button></div>`;
}
function trendHtml(c, p, invert) {
  if (!p) return '—';
  const d = Math.round((c - p) / p * 100);
  if (d === 0) return '<span>مثل الشهر الماضي</span>';
  const up = d > 0, good = invert ? !up : up;
  return `<span class="trend ${good ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(d)}%</span><span>مقارنة بالشهر الماضي</span>`;
}
function afterRender(el) {
  animateCounters(el); animateBars(el); animateRings(el);
  el.querySelectorAll('.tx-row').forEach(row => {
    const id = row.dataset.id;
    row.querySelector('.act-edit')?.addEventListener('click', () => {
      const t = S.transactions.find(x => x.id === id);
      if (t) openTxModal(t);
    });
    row.querySelector('.act-del')?.addEventListener('click', () => {
      const idx = S.transactions.findIndex(x => x.id === id);
      if (idx < 0) return;
      const [tx] = S.transactions.splice(idx, 1);
      save(); render[currentPage]();
      toast('حُذفت المعاملة', 'info', '↩️ تراجع', () => {
        S.transactions.splice(Math.min(idx, S.transactions.length), 0, tx);
        save(); render[currentPage]();
        toast('استُعيدت المعاملة', 'success');
      });
    });
  });
  el.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));
  el.querySelectorAll('.empty-cta').forEach(b => b.addEventListener('click', () => b.dataset.empty === 'goal' ? openGoalModal() : openTxModal()));
}

/* ─────────── الصفحة: لوحة التحكم ─────────── */
function renderDashboard() {
  const el = $('#page-dashboard');
  const curMk = monthKey(todayISO()), prevMk = monthAdd(curMk, -1);
  const cur = monthSums(curMk), prev = monthSums(prevMk);
  const balance = balanceAll();
  const rate = cur.income > 0 ? (cur.income - cur.expense) / cur.income * 100 : null;
  const months = lastNMonths(6);
  const byCat = catBreakdown(curMk);
  const recent = sortedTx().slice(0, 6);
  const goals = [...S.goals].sort((a, b) => (b.saved / (b.target || 1)) - (a.saved / (a.target || 1))).slice(0, 3);
  const catTotal = byCat.reduce((a, c) => a + c.value, 0);

  el.innerHTML = `
  <div class="stats-grid">
    <div class="card stat hero">
      <div class="s-top"><span>الرصيد الحالي</span><span class="s-icon">💠</span></div>
      <div class="s-val"><span data-count="${balance}">0</span> <small>${S.settings.currency}</small></div>
      <div class="s-sub">كل دخلك − كل مصروفك</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>دخل ${monthLabel(curMk)}</span><span class="s-icon">📥</span></div>
      <div class="s-val income-c">+<span data-count="${cur.income}">0</span></div>
      <div class="s-sub">${trendHtml(cur.income, prev.income)}</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>مصروف ${monthLabel(curMk)}</span><span class="s-icon">📤</span></div>
      <div class="s-val expense-c">−<span data-count="${cur.expense}">0</span></div>
      <div class="s-sub">${trendHtml(cur.expense, prev.expense, true)}</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>معدل التوفير</span><span class="s-icon">🪙</span></div>
      <div class="s-val"><span data-count="${rate ?? 0}" data-suffix="%">0</span></div>
      <div class="s-sub">${rate === null ? 'سجّل دخلك ليُحسب' : 'من دخل هذا الشهر'}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h3><span>التدفق النقدي — آخر 6 أشهر</span>
        <span class="legend-mini"><span><span class="dot" style="background:#34d399"></span> دخل</span><span><span class="dot" style="background:#fb7185"></span> مصروف</span></span>
      </h3>
      <canvas id="line-canvas"></canvas>
    </div>
    <div class="card">
      <h3><span>توزيع المصروفات</span><button class="link" data-go="transactions">التفاصيل ←</button></h3>
      <div class="donut-wrap">
        <canvas id="donut-canvas"></canvas>
        <div class="donut-center" id="donut-center"></div>
        <div class="chart-tip" id="donut-tip"></div>
      </div>
      <div id="donut-legend"></div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h3><span>أحدث المعاملات</span><button class="link" data-go="transactions">عرض الكل ←</button></h3>
      ${recent.length ? `<div class="tx-list">${recent.map(txRow).join('')}</div>` : emptyHTML('tx')}
    </div>
    <div class="card">
      <h3><span>تقدّم الأهداف</span><button class="link" data-go="goals">إدارة ←</button></h3>
      ${goals.length ? goals.map(g => {
        const p = Math.min(100, Math.round(g.saved / Math.max(1, g.target) * 100));
        return `<div class="goal-mini">
          <div class="gm-top"><span>${esc(g.name)}</span><b>${p}%</b></div>
          <div class="bar"><div class="bar-fill" data-w="${p}" style="background:linear-gradient(90deg,${g.color}88,${g.color})"></div></div>
          <span class="gm-sub">${money(g.saved)} من ${money(g.target)}</span>
        </div>`;
      }).join('') : emptyHTML('goal')}
    </div>
  </div>`;

  drawLine($('#line-canvas'), months.map(shortMonth), [
    {name: 'الدخل',   color: '#34d399', data: months.map(m => monthSums(m).income)},
    {name: 'المصروف', color: '#fb7185', data: months.map(m => monthSums(m).expense)},
  ]);
  const donutItems = byCat.map(c => ({label: c.name, value: c.value, color: c.color}));
  $('#donut-center').innerHTML = catTotal
    ? `<b>${fmt(catTotal)}</b><span>إجمالي المصروف</span>`
    : `<b>0</b><span>لا مصروفات بعد</span>`;
  drawDonut($('#donut-canvas'), donutItems);
  bindDonutHover($('#donut-canvas'));
  $('#donut-legend').innerHTML = byCat.slice(0, 6).map(c => {
    const pct = catTotal ? Math.round(c.value / catTotal * 100) : 0;
    return `<div class="legend-row"><span class="dot" style="background:${c.color}"></span><span>${c.icon} ${c.name}</span><span class="lr-pct">${pct}%</span><b class="lr-val">${money(c.value)}</b></div>`;
  }).join('') || '<p class="muted" style="text-align:center">أضف مصروفات لتظهر هنا</p>';

  afterRender(el);
}

/* ─────────── الصفحة: المعاملات ─────────── */
let fSearch = '', fMonth = 'all', fType = 'all', fCat = 'all';
function renderTransactions(fromSearch) {
  const el = $('#page-transactions');
  const months = uniqueMonths();
  const list = sortedTx().filter(t =>
    (fMonth === 'all' || t.date.startsWith(fMonth)) &&
    (fType === 'all' || t.type === fType) &&
    (fCat === 'all' || t.category === fCat) &&
    (!fSearch || (t.note || '').includes(fSearch) || catOf(t).name.includes(fSearch))
  );
  const inc = list.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const exp = list.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  el.innerHTML = `
  <div class="toolbar">
    <input type="search" id="f-search" placeholder="🔍 ابحث في الملاحظات والتصنيفات…" value="${esc(fSearch)}"/>
    <div class="pills" id="f-type">
      <button class="pill ${fType === 'all' ? 'active' : ''}" data-v="all">الكل</button>
      <button class="pill ${fType === 'income' ? 'active' : ''}" data-v="income">دخل</button>
      <button class="pill ${fType === 'expense' ? 'active' : ''}" data-v="expense">مصروف</button>
    </div>
    <select id="f-month">
      <option value="all">كل الأشهر</option>
      ${months.map(m => `<option value="${m}" ${fMonth === m ? 'selected' : ''}>${monthLabel(m)}</option>`).join('')}
    </select>
    <select id="f-cat">
      <option value="all">كل التصنيفات</option>
      <optgroup label="مصروف">${CATS.expense.map(c => `<option value="${c.id}" ${fCat === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}</optgroup>
      <optgroup label="دخل">${CATS.income.map(c => `<option value="${c.id}" ${fCat === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}</optgroup>
    </select>
    <button class="btn btn-primary" id="add-btn-2">+ إضافة</button>
  </div>
  <div class="chips">
    <span class="chip">${list.length} معاملة</span>
    <span class="chip">دخل<b class="income-c">+${money(inc)}</b></span>
    <span class="chip">مصروف<b class="expense-c">−${money(exp)}</b></span>
    <span class="chip">الصافي<b class="${inc - exp >= 0 ? 'income-c' : 'expense-c'}">${money(inc - exp)}</b></span>
  </div>
  ${S.recurring.length ? `<div class="card" style="margin-bottom:16px">
    <h3><span>🔁 المعاملات المتكررة</span></h3>
    <div class="rec-list">${S.recurring.map(r => {
      const c = (CATS[r.type] || CATS.expense).find(x => x.id === r.category) || {icon: '🔁', name: 'أخرى'};
      return `<div class="rec-row" data-id="${r.id}">
        <div class="tx-icon">${c.icon}</div>
        <div class="tx-info"><b>${esc(r.note || c.name)}</b><span>يوم ${r.day} من كل شهر • ${r.active ? 'نشطة 🟢' : 'موقوفة ⏸️'}</span></div>
        <div class="tx-amount ${r.type}">${r.type === 'income' ? '+' : '−'} ${fmt(r.amount)}</div>
        <label class="switch" title="${r.active ? 'إيقاف مؤقت' : 'تفعيل'}">
          <input type="checkbox" class="rec-toggle" ${r.active ? 'checked' : ''}/><span class="track"></span>
        </label>
        <button class="icon-btn rec-del" title="حذف القاعدة">${I.trash}</button>
      </div>`;
    }).join('')}</div>
  </div>` : ''}
  <div class="card">
    ${list.length ? `<div class="tx-list">${list.map(txRow).join('')}</div>` : emptyHTML('tx')}
  </div>`;

  $('#f-search').addEventListener('input', e => { fSearch = e.target.value.trim(); renderTransactions(true); });
  $$('#f-type .pill', el).forEach(b => b.addEventListener('click', () => { fType = b.dataset.v; renderTransactions(); }));
  $('#f-month').addEventListener('change', e => { fMonth = e.target.value; renderTransactions(); });
  $('#f-cat').addEventListener('change', e => { fCat = e.target.value; renderTransactions(); });
  $('#add-btn-2').addEventListener('click', () => openTxModal());

  $$('.rec-row', el).forEach(row => {
    const id = row.dataset.id;
    row.querySelector('.rec-toggle')?.addEventListener('change', e => {
      const r = S.recurring.find(x => x.id === id);
      if (!r) return;
      r.active = e.target.checked;
      if (r.active) {
        r.lastRun = monthKey(todayISO());
        toast('فُعّلت القاعدة — ستبدأ من الشهر القادم 🔁', 'success');
      } else toast('أُوقفت القاعدة مؤقتًا ⏸️', 'info');
      save(); renderTransactions();
    });
    row.querySelector('.rec-del')?.addEventListener('click', () => {
      const idx = S.recurring.findIndex(x => x.id === id);
      if (idx < 0) return;
      const [rule] = S.recurring.splice(idx, 1);
      save(); renderTransactions();
      toast('حُذفت قاعدة التكرار (المعاملات السابقة تبقى)', 'info', '↩️ تراجع', () => {
        S.recurring.splice(Math.min(idx, S.recurring.length), 0, rule);
        save(); renderTransactions();
        toast('استُعيدت القاعدة', 'success');
      });
    });
  });

  afterRender(el);
  if (fromSearch) {
    const s = $('#f-search');
    s.focus();
    try { s.setSelectionRange(s.value.length, s.value.length); } catch (e) {}
  }
}

/* ─────────── الصفحة: الميزانيات ─────────── */
let editCat = null;
function renderBudgets() {
  const el = $('#page-budgets');
  const mk = monthKey(todayISO());
  const byCat = catBreakdown(mk);
  const spentOf = id => (byCat.find(c => c.id === id) || {value: 0}).value;
  const totalBudget = CATS.expense.reduce((a, c) => a + (+S.budgets[c.id] || 0), 0);
  const totalSpent = byCat.reduce((a, c) => a + c.value, 0);
  const p = totalBudget ? Math.min(1, totalSpent / totalBudget) : 0;

  const rows = CATS.expense.map(c => {
    const b = +S.budgets[c.id] || 0;
    const spent = spentOf(c.id);
    if (editCat === c.id) {
      return `<div class="budget-row">
        <div class="tx-icon">${c.icon}</div>
        <div class="b-main">
          <div class="b-line"><b>${c.name}</b>
            <span class="b-edit">
              <input type="number" id="budget-input" min="0" step="1" placeholder="سقف الشهر" value="${b || ''}"/>
              <button class="btn-mini" id="budget-save">حفظ</button>
              <button class="btn-mini ghostb" id="budget-cancel">إلغاء</button>
            </span>
          </div>
          <div class="b-sub">اكتب سقف الصرف الشهري لهذا التصنيف ثم اضغط Enter</div>
        </div>
      </div>`;
    }
    const pct = b ? Math.min(100, spent / b * 100) : 0;
    const over = b > 0 && spent > b;
    return `<div class="budget-row ${over ? 'over' : ''}">
      <div class="tx-icon">${c.icon}</div>
      <div class="b-main">
        <div class="b-line"><b>${c.name}</b>
          <span class="b-nums">${money(spent)} / ${b ? money(b) : '—'}</span>
          <button class="icon-btn b-edit-btn" data-cat="${c.id}" title="تعديل الميزانية">${I.edit}</button>
        </div>
        <div class="bar"><div class="bar-fill ${over ? 'over' : pct > 80 ? 'warn' : ''}" data-w="${pct}"></div></div>
        <div class="b-sub">${b
          ? (over ? `<span class="bad-c">🚨 تجاوزت بـ ${money(spent - b)}</span>` : `متبقي ${money(b - spent)}`)
          : 'بدون ميزانية — اضغط القلم لتحديد سقف'}</div>
      </div>
    </div>`;
  }).join('');

  const tips = [];
  if (!totalBudget) tips.push({icon: '🎛️', tone: 'info', title: 'لم تحدد أي ميزانية بعد', text: 'اضغط أيقونة القلم بجانب أي تصنيف وحدد سقفًا شهريًا له.'});
  else {
    const overCats = CATS.expense.filter(c => S.budgets[c.id] && spentOf(c.id) > S.budgets[c.id]);
    if (overCats.length) tips.push({icon: '🚨', tone: 'bad', title: `تجاوزت ${overCats.length} من ميزانياتك`, text: overCats.map(c => c.name).join('، ') + ' — خفّف الصرف فيما تبقى من الشهر.'});
    else tips.push({icon: '✅', tone: 'good', title: 'داخل الميزانية', text: 'كل مصروفاتك هذا الشهر تحت السقف المحدد. أحسنت!'});
    const isCur = mk === monthKey(todayISO());
    if (isCur) {
      const days = new Date().getDate();
      const dim = daysInMonth(mk);
      const projected = totalSpent / Math.max(1, days) * dim;
      tips.push({icon: '🔮', tone: projected > totalBudget ? 'warn' : 'info', title: 'توقع نهاية الشهر: ' + money(projected), text: projected > totalBudget ? 'بهذا المعدل ستتجاوز ميزانيتك الكلية.' : 'بهذا المعدل ستبقى داخل ميزانيتك الكلية.'});
    }
  }

  el.innerHTML = `
  <div class="grid-2">
    <div class="card stat">
      <div class="s-top"><span>ميزانية ${monthLabel(mk)}</span><span class="s-icon">🎛️</span></div>
      <div class="budget-total-flex">
        ${ringSVG(p, p >= 1 ? '#fb7185' : p > .8 ? '#fbbf24' : '#34d399', 118, 10)}
        <div>
          <div class="s-val"><span data-count="${totalSpent}">0</span> <small>${S.settings.currency}</small></div>
          <div class="s-sub">من ${money(totalBudget)} المخطط لها</div>
          <div class="s-sub" style="margin-top:6px">${totalBudget - totalSpent >= 0 ? '🟢 متبقي ' + money(totalBudget - totalSpent) : '🔴 تجاوزت بـ ' + money(totalSpent - totalBudget)}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3><span>نصائح سريعة</span></h3>
      <div class="insights">${tips.map(insightHTML).join('')}</div>
    </div>
  </div>
  <div class="card">
    <h3><span>الميزانيات حسب التصنيف — ${monthLabel(mk)}</span></h3>
    <div class="budget-list">${rows}</div>
  </div>`;

  el.querySelectorAll('.b-edit-btn').forEach(b => b.addEventListener('click', () => { editCat = b.dataset.cat; renderBudgets(); }));

  const input = $('#budget-input');
  if (input) {
    const commit = () => {
      const v = parseFloat(input.value);
      if (v > 0) { S.budgets[editCat] = v; toast('حُدّثت الميزانية ✅', 'success'); }
      else { delete S.budgets[editCat]; toast('أُزيلت الميزانية', 'info'); }
      editCat = null; save(); renderBudgets();
    };
    const cancel = () => { editCat = null; renderBudgets(); };
    $('#budget-save').addEventListener('click', commit);
    $('#budget-cancel').addEventListener('click', cancel);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') cancel(); });
    input.addEventListener('blur', () => setTimeout(() => { if (editCat) commit(); }, 180));
    input.focus(); input.select();
  }

  afterRender(el);
}

/* ─────────── الصفحة: الأهداف ─────────── */
function updateSim() {
  const g = S.goals.find(x => x.id === $('#wi-goal').value);
  const slider = $('#wi-slider'), result = $('#wi-result');
  if (!g || !slider || !result) return;
  const remain = Math.max(0, g.target - g.saved);
  slider.max = Math.max(2000, Math.ceil((remain / 6) / 100) * 100 || 2000);
  if (+slider.value > +slider.max) slider.value = slider.max;
  const m = +slider.value;
  $('#wi-val').textContent = money(m) + ' / شهر';
  if (remain === 0) {
    result.innerHTML = `<div><div class="wi-date">مكتمل 🎉</div><div class="wi-sub">حققت هذا الهدف بالفعل — اختر غيره أو ضع هدفًا جديدًا</div></div>`;
    return;
  }
  if (m <= 0) {
    result.innerHTML = `<div><div class="wi-date">لن يتحقق أبدًا 😅</div><div class="wi-sub">بدون ادخار شهري سيبقى ${money(remain)} بعيدًا — حرّك المؤشر</div></div>`;
    return;
  }
  const months = Math.ceil(remain / m);
  const dt = new Date();
  dt.setMonth(dt.getMonth() + months);
  result.innerHTML = ringSVG(Math.min(1, g.saved / g.target), g.color, 84, 8) +
    `<div><div class="wi-date">${MONTHS_AR[dt.getMonth()]} ${dt.getFullYear()}</div>
      <div class="wi-sub">ستكمل هدف «${esc(g.name)}» بعد ${months} ${months === 1 ? 'شهر' : 'أشهر'} — بتاريخ ${dISO(dt)}</div>
      <div class="wi-sub">المتبقي ${money(remain)} ÷ ${money(m)} شهريًا</div></div>`;
  animateRings(result);
}
function renderGoals() {
  const el = $('#page-goals');
  const goals = [...S.goals];

  // متوسط ادخار آخر 3 أشهر كنقطة انطلاق للمحاكاة
  const avgSaving = (() => {
    let sum = 0;
    for (let i = 1; i <= 3; i++) { const m = monthSums(monthAdd(monthKey(todayISO()), -i)); sum += m.income - m.expense; }
    return Math.max(0, Math.round(sum / 3 / 50) * 50);
  })();
  const simGoals = S.goals.filter(g => g.target > 0);

  // بيانات تحدي أيام بلا صرف
  const mk = monthKey(todayISO()), curDay = +todayISO().slice(8, 10);
  const {perDay} = heatmapData(mk);
  const noSpendCount = (() => { let c = 0; for (let d = 1; d <= curDay; d++) if (!perDay[d]) c++; return c; })();
  const streak = (() => { let s = 0; for (let d = curDay; d >= 1; d--) { if (!perDay[d]) s++; else break; } return s; })();
  const ch = S.challenges || {w52: null, noSpendGoal: 8};
  const w52 = ch.w52;
  const weeksDone = w52 ? w52.weeks.filter(Boolean).length : 0;
  const w52money = w52 ? w52.weeks.reduce((a, w, i) => a + (w ? 10 * (i + 1) : 0), 0) : 0;

  el.innerHTML = `
  <div class="page-actions"><button class="btn btn-primary" id="goal-add">+ هدف جديد</button></div>

  <div class="card" style="margin-bottom:20px">
    <h3><span>🧪 محاكاة «ماذا لو»</span></h3>
    ${simGoals.length ? `
    <div class="wi-row">
      <select id="wi-goal">${simGoals.map(g => `<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select>
      <input type="range" id="wi-slider" min="0" max="5000" step="50" value="${avgSaving || 500}"/>
      <span class="wi-val" id="wi-val"></span>
    </div>
    <div class="wi-result" id="wi-result"></div>` : '<p class="muted" style="margin:0">أضف هدفًا أولًا لتجربة المحاكاة.</p>'}
  </div>

  ${goals.length ? `<div class="goals-grid">${goals.map(goalCard).join('')}</div>` : `<div class="card">${emptyHTML('goal')}</div>`}

  <div class="card" style="margin-top:20px">
    <h3><span>🏆 تحديات الادخار</span></h3>
    <div class="ch-grid">
      <div class="ch-card">
        ${ringSVG(weeksDone / 52, weeksDone === 52 ? '#34d399' : '#8b5cf6', 88, 8)}
        <div class="ch-main">
          <div class="ch-title">🗓️ تحدي 52 أسبوعًا</div>
          <div class="ch-sub">${w52
            ? `${weeksDone}/52 أسبوع • ادّخرت ${money(w52money)} من أصل ${money(13780)} عند الإكمال`
            : 'ودّع 10 ر.س في الأسبوع الأول، ثم 20، ثم 30… حتى 520 في الأخير'}</div>
          ${w52
            ? `<div class="wk-grid">${w52.weeks.map((w, i) => `<button class="wk ${w ? 'on' : ''}" data-w="${i}" title="أسبوع ${i + 1} — ${10 * (i + 1)} ر.س">${i + 1}</button>`).join('')}</div>`
            : `<button class="btn btn-primary ch-cta" id="ch-start">ابدأ التحدي 🚀</button>`}
        </div>
      </div>
      <div class="ch-card">
        ${ringSVG(Math.min(1, noSpendCount / ch.noSpendGoal), noSpendCount >= ch.noSpendGoal ? '#34d399' : '#22d3ee', 88, 8)}
        <div class="ch-main">
          <div class="ch-title">🧘 أيام بلا صرف</div>
          <div class="ch-sub">${noSpendCount}/${ch.noSpendGoal} يوم هذا الشهر • ${streak > 0 ? `🔥 سلسلة ${streak} يوم متتالية` : 'ابدأ سلسلتك اليوم!'}</div>
          <div class="ch-inline-goal">الهدف الشهري:
            <input type="number" id="ns-goal" min="1" max="31" value="${ch.noSpendGoal}"/> يومًا
          </div>
          <div class="ns-days">${Array.from({length: curDay}, (_, i) => `<span class="ns-dot ${perDay[i + 1] ? '' : 'on'} ${i + 1 === curDay ? 'today' : ''}"></span>`).join('')}</div>
        </div>
      </div>
    </div>
  </div>`;

  $('#goal-add').addEventListener('click', () => openGoalModal());
  el.querySelectorAll('.goal-card').forEach(card => {
    const id = card.dataset.id;
    const g = S.goals.find(x => x.id === id);
    card.querySelector('.g-edit')?.addEventListener('click', () => openGoalModal(g));
    card.querySelector('.g-del')?.addEventListener('click', () => {
      const idx = S.goals.findIndex(x => x.id === id);
      if (idx < 0) return;
      const [goal] = S.goals.splice(idx, 1);
      save(); renderGoals();
      toast('حُذف الهدف', 'info', '↩️ تراجع', () => {
        S.goals.splice(Math.min(idx, S.goals.length), 0, goal);
        save(); renderGoals();
        toast('استُعيد الهدف', 'success');
      });
    });
    card.querySelector('.g-dep')?.addEventListener('click', () => { if (g) openDeposit(g); });
  });

  // المحاكاة
  if (simGoals.length) {
    $('#wi-goal').addEventListener('change', () => { $('#wi-slider').value = Math.max(50, Math.round(+$('#wi-slider').value)); updateSim(); });
    $('#wi-slider').addEventListener('input', updateSim);
    updateSim();
  }

  // التحديات
  $('#ch-start')?.addEventListener('click', () => {
    S.challenges.w52 = {start: todayISO(), weeks: Array(52).fill(false)};
    save(); renderGoals();
    toast('انطلق تحدي 52 أسبوعًا 🚀 علّم أسبوعك الأول', 'success');
  });
  el.querySelectorAll('.wk').forEach(b => b.addEventListener('click', () => {
    if (!S.challenges.w52) return;
    const i = +b.dataset.w;
    const wasComplete = S.challenges.w52.weeks.every(Boolean);
    S.challenges.w52.weeks[i] = !S.challenges.w52.weeks[i];
    const nowComplete = S.challenges.w52.weeks.every(Boolean);
    save(); renderGoals();
    if (nowComplete && !wasComplete) { confetti.burst(); toast('🎉 أكملت تحدي 52 أسبوعًا وادّخرت 13,780 ر.س!', 'success'); }
  }));
  $('#ns-goal')?.addEventListener('change', e => {
    S.challenges.noSpendGoal = Math.min(31, Math.max(1, parseInt(e.target.value) || 8));
    save(); renderGoals();
    toast('حُدّث هدف أيام بلا صرف', 'success');
  });

  afterRender(el);
}
function goalCard(g) {
  const p = g.target > 0 ? Math.min(1, g.saved / g.target) : 0;
  const done = p >= 1;
  const dl = g.deadline ? daysLeft(g.deadline) : null;
  return `<div class="card goal-card ${done ? 'done' : ''}" data-id="${g.id}">
    ${ringSVG(p, g.color)}
    <div class="g-body">
      <div class="g-top">
        <b>${esc(g.name)} ${done ? '🎉' : ''}</b>
        <div class="g-actions">
          <button class="icon-btn g-edit" title="تعديل">${I.edit}</button>
          <button class="icon-btn g-del" title="حذف">${I.trash}</button>
        </div>
      </div>
      <div class="g-nums"><b>${money(g.saved)}</b><span>من ${money(g.target)}</span></div>
      <div class="g-meta">
        <span>${done ? '✅ مكتمل' : dl === null ? '📅 بدون موعد' : dl >= 0 ? `⏳ باقي ${dl} يوم` : `⚠️ تأخر ${-dl} يوم`}</span>
        ${g.deadline ? `<span>ينتهي ${fmtDate(g.deadline)}</span>` : ''}
      </div>
      ${done ? '<div class="g-done-badge">تحقق الهدف! مبروك 🎉</div>' : '<button class="btn btn-primary g-dep">إيداع 💰</button>'}
    </div>
  </div>`;
}

/* ─────────── الصفحة: التقارير ─────────── */
let rMonth = null;
function buildInsights(mk) {
  const list = [];
  const cur = monthSums(mk), prev = monthSums(monthAdd(mk, -1));
  const txs = monthTx(mk);
  if (!txs.length) return [{icon: '🧭', tone: 'info', title: 'لا بيانات لهذا الشهر', text: 'أضف معاملاتك ليولّد لك التطبيق نصائح ذكية.'}];

  const rate = cur.income > 0 ? (cur.income - cur.expense) / cur.income * 100 : null;
  if (rate !== null) {
    if (rate >= 20) list.push({icon: '🏆', tone: 'good', title: `معدل توفير ممتاز ${fmt(rate)}%`, text: 'تحافظ على صحة مالية رائعة — استمر!'});
    else if (rate >= 10) list.push({icon: '🙂', tone: 'warn', title: `معدل التوفير ${fmt(rate)}%`, text: 'جيد، لكن رفعه فوق 20% سيُسرّع تحقيق أهدافك.'});
    else list.push({icon: '⚠️', tone: 'bad', title: `معدل التوفير ${fmt(rate)}% فقط`, text: 'تصرف معظم دخلك — راجع أكبر بنودك بالأسفل وضع سقفًا لها.'});
  } else list.push({icon: '📭', tone: 'info', title: 'لا دخل مسجّل', text: 'سجّل مصادر دخلك ليكتمل التحليل.'});

  const byCat = catBreakdown(mk);
  if (byCat.length) {
    const top = byCat[0];
    const share = cur.expense > 0 ? top.value / cur.expense * 100 : 0;
    list.push({icon: top.icon, tone: share > 35 ? 'warn' : 'info', title: `أكبر بند: ${top.name} (${fmt(share)}%)`, text: share > 35 ? 'يتجاوز ثلث مصروفاتك — جرّب ميزانية صارمة له.' : 'نسبته معقولة ضمن مصروفاتك.'});
  }
  if (prev.expense > 0) {
    const diff = (cur.expense - prev.expense) / prev.expense * 100;
    if (diff > 10) list.push({icon: '📈', tone: 'bad', title: `صرفت أكثر بـ ${fmt(Math.abs(diff))}%`, text: 'مقارنة بالشهر الماضي — راجع معاملاتك الأخيرة.'});
    else if (diff < -10) list.push({icon: '📉', tone: 'good', title: `خفّضت صرفك بـ ${fmt(Math.abs(diff))}%`, text: 'عمل رائع! وجّه الفرق نحو أهدافك.'});
    else list.push({icon: '➖', tone: 'info', title: 'صرفك مستقر', text: `تغيّر طفيف (${fmt(diff)}%) عن الشهر الماضي.`});
  }
  const big = txs.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  if (big) list.push({icon: '🔍', tone: 'info', title: 'أكبر معاملة: ' + money(big.amount), text: `${catOf(big).name}${big.note ? ' — ' + big.note : ''} في ${fmtDate(big.date)}.`});

  const over = Object.entries(S.budgets).filter(([cid, b]) => (byCat.find(c => c.id === cid) || {value: 0}).value > b);
  if (over.length) list.push({icon: '🚨', tone: 'bad', title: `تجاوزت ${over.length} ${over.length === 1 ? 'ميزانية' : 'ميزانيات'}`, text: over.map(([cid, b]) => {
    const c = catById(cid);
    return `${c ? c.name : cid} بـ ${money((byCat.find(x => x.id === cid) || {value: 0}).value - b)}`;
  }).join('، ') + '.'});

  const dim = daysInMonth(mk);
  const isCur = mk === monthKey(todayISO());
  const days = isCur ? new Date().getDate() : dim;
  const avg = cur.expense / Math.max(1, days);
  list.push({icon: '📆', tone: 'info', title: 'متوسط صرفك اليومي ' + money(avg), text: isCur ? `بتثبيت هذا المعدل سيصل صرف الشهر إلى ~${money(avg * dim)}.` : `على مدار ${dim} يومًا.`});
  return list;
}
function renderReports() {
  if (!rMonth) rMonth = monthKey(todayISO());
  const el = $('#page-reports');
  const months = uniqueMonths();
  if (!months.includes(rMonth)) months.unshift(rMonth);
  const cur = monthSums(rMonth);
  const byCat = catBreakdown(rMonth);
  const top = byCat[0];
  const txs = monthTx(rMonth);
  const big = txs.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0];
  const rate = cur.income > 0 ? (cur.income - cur.expense) / cur.income * 100 : null;
  const dim = daysInMonth(rMonth);
  const isCur = rMonth === monthKey(todayISO());
  const days = isCur ? new Date().getDate() : dim;
  const avg = cur.expense / Math.max(1, days);
  const last6 = [];
  for (let i = 5; i >= 0; i--) last6.push(monthAdd(rMonth, -i));
  const groups = last6.map(m => monthSums(m));

  el.innerHTML = `
  <div class="toolbar">
    <select id="r-month">${months.map(m => `<option value="${m}" ${m === rMonth ? 'selected' : ''}>${monthLabel(m)}</option>`).join('')}</select>
    <div class="legend-mini"><span><span class="dot" style="background:#34d399"></span> دخل</span><span><span class="dot" style="background:#fb7185"></span> مصروف</span></div>
  </div>
  <div class="stats-grid">
    <div class="card stat">
      <div class="s-top"><span>معدل التوفير</span><span class="s-icon">🪙</span></div>
      <div class="s-val"><span data-count="${rate ?? 0}" data-suffix="%">0</span></div>
      <div class="s-sub">${rate === null ? 'سجّل دخلك ليُحسب' : 'من دخل ' + monthLabel(rMonth)}</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>أكبر بند</span><span class="s-icon">${top ? top.icon : '📊'}</span></div>
      <div class="s-val" style="font-size:20px">${top ? top.name : '—'}</div>
      <div class="s-sub">${top && cur.expense ? Math.round(top.value / cur.expense * 100) + '% من المصروف' : 'لا بيانات'}</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>أكبر معاملة</span><span class="s-icon">🔍</span></div>
      <div class="s-val expense-c" style="font-size:20px">${big ? money(big.amount) : '—'}</div>
      <div class="s-sub">${big ? esc(big.note || catOf(big).name) : 'لا بيانات'}</div>
    </div>
    <div class="card stat">
      <div class="s-top"><span>متوسط الصرف اليومي</span><span class="s-icon">📆</span></div>
      <div class="s-val"><span data-count="${avg}">0</span> <small>${S.settings.currency}</small></div>
      <div class="s-sub">${isCur ? 'حتى اليوم' : 'على مدار الشهر'}</div>
    </div>
  </div>
  <div class="card" style="margin-bottom:20px">
    <h3><span>دخل مقابل مصروف — 6 أشهر حتى ${monthLabel(rMonth)}</span></h3>
    <canvas id="bar-canvas"></canvas>
  </div>
  <div class="card" style="margin-bottom:20px">
    <h3><span>🗓️ خريطة الصرف اليومية — ${monthLabel(rMonth)}</span></h3>
    ${heatmapHTML(rMonth)}
  </div>
  <div class="card">
    <h3><span>🧠 التحليل الذكي — ${monthLabel(rMonth)}</span></h3>
    <div class="insights">${buildInsights(rMonth).map(insightHTML).join('')}</div>
  </div>`;

  drawBar($('#bar-canvas'), last6.map(shortMonth), groups);
  $('#r-month').addEventListener('change', e => { rMonth = e.target.value; renderReports(); });
  afterRender(el);
}

/* ─────────── الصفحة: الإعدادات ─────────── */
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tadafuq-backup-' + todayISO() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('تم تصدير نسخة احتياطية 💾', 'success');
}
function renderSettings() {
  const el = $('#page-settings');
  const dark = S.settings.theme !== 'light';
  el.innerHTML = `
  <div class="grid-2 equal">
    <div class="card">
      <h3><span>🎨 المظهر</span></h3>
      <div class="type-toggle">
        <button class="type-btn ${dark ? '' : 'active'}" id="th-light">☀️ فاتح</button>
        <button class="type-btn ${dark ? 'active' : ''}" id="th-dark">🌙 داكن</button>
      </div>
      <p class="muted">يُحفظ اختيارك تلقائيًا.</p>
    </div>
    <div class="card">
      <h3><span>💱 العملة</span></h3>
      <div class="field"><select id="set-currency">${CURS.map(c => `<option ${c === S.settings.currency ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <p class="muted">تُطبَّق على كل المبالغ في التطبيق.</p>
    </div>
  </div>
  <div class="card" style="margin-bottom:20px" id="install-card">
    <h3><span>📲 التثبيت والعمل دون اتصال</span></h3>
    <p class="muted" id="install-note">تدفّق تطبيق ويب تقدمي (PWA) — بعد أول زيارة يخزّن نفسه محليًا ويعمل حتى بدون إنترنت، ويمكن تثبيته كأيقونة مستقلة.</p>
    <button class="btn btn-primary" id="install-btn">${deferredInstall ? '📲 تثبيت التطبيق' : '📲 التثبيت من قائمة المتصفح'}</button>
  </div>
  <div class="card" style="margin-bottom:20px">
    <h3><span>🗄️ البيانات</span></h3>
    <div class="btn-row">
      <button class="btn btn-ghost" id="export-btn">${I.download} تصدير نسخة احتياطية</button>
      <button class="btn btn-ghost" id="import-btn">${I.upload} استيراد نسخة</button>
      <button class="btn btn-ghost" id="demo-btn">🎲 بيانات تجريبية</button>
      <button class="btn btn-danger" id="wipe-btn">${I.trash} مسح كل البيانات</button>
    </div>
    <p class="muted">بياناتك لا تغادر جهازك أبدًا — تُخزَّن محليًا في متصفحك 🔒</p>
  </div>
  <div class="card">
    <h3><span>⌨️ اختصارات</span></h3>
    <div class="kbd-rows">
      <div><kbd>Ctrl</kbd> + <kbd>K</kbd> — لوحة الأوامر والبحث</div>
      <div><kbd>↑</kbd> <kbd>↓</kbd> — التنقل داخل اللوحة، <kbd>Enter</kbd> للتنفيذ</div>
      <div><kbd>Esc</kbd> — إغلاق النوافذ</div>
    </div>
  </div>`;

  $('#th-light').addEventListener('click', () => { setTheme('light'); renderSettings(); });
  $('#th-dark').addEventListener('click', () => { setTheme('dark'); renderSettings(); });
  $('#set-currency').addEventListener('change', e => {
    S.settings.currency = e.target.value;
    save(); toast('تغيّرت العملة إلى ' + e.target.value, 'success');
  });
  $('#export-btn').addEventListener('click', exportData);
  $('#install-btn').addEventListener('click', async () => {
    if (deferredInstall) {
      deferredInstall.prompt();
      const choice = await deferredInstall.userChoice;
      if (choice.outcome === 'accepted') toast('جاري التثبيت… 📲', 'info');
      deferredInstall = null;
    } else {
      toast('من قائمة المتصفح اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» 📲', 'info');
    }
  });
  $('#import-btn').addEventListener('click', () => $('#import-file').click());
  $('#demo-btn').addEventListener('click', () => showConfirm('بيانات تجريبية', 'سيتم استبدال بياناتك الحالية ببيانات تجريبية. متابعة؟', () => {
    S = seedState(); save(); setTheme(S.settings.theme, false); go('dashboard'); toast('تم توليد بيانات تجريبية 🎲', 'success');
  }));
  $('#wipe-btn').addEventListener('click', () => showConfirm('مسح كل البيانات', 'سيتم حذف كل المعاملات والأهداف والميزانيات نهائيًا. هل أنت متأكد؟', () => {
    S = normalize({settings: S.settings}); save(); go('dashboard'); toast('تم مسح البيانات', 'info');
  }));
  afterRender(el);
}

/* ─────────── نافذة المعاملة ─────────── */
let editingTx = null, txType = 'expense', txRepeat = 'once';
function setTxRepeat(mode) {
  txRepeat = mode;
  $$('#tx-repeat .pill').forEach(b => b.classList.toggle('active', b.dataset.v === mode));
  const dayBox = $('#tx-day-box');
  dayBox.classList.toggle('hidden', mode !== 'monthly');
  if (mode === 'monthly') {
    const d = Math.min(28, +(($('#tx-date').value || todayISO()).slice(8, 10)) || 1);
    $('#tx-day').value = d;
  }
}
function setTxType(type, presetCat) {
  txType = type;
  $$('#tx-modal .type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const sel = $('#tx-category');
  sel.innerHTML = CATS[type].map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  sel.value = presetCat && CATS[type].some(c => c.id === presetCat) ? presetCat : CATS[type][0].id;
}
function openTxModal(tx) {
  editingTx = tx || null;
  $('#tx-modal-title').textContent = tx ? 'تعديل المعاملة' : 'معاملة جديدة';
  $('#tx-amount').value = tx ? tx.amount : '';
  $('#tx-note').value = tx ? tx.note : '';
  $('#tx-date').value = tx ? tx.date : todayISO();
  setTxType(tx ? tx.type : 'expense', tx ? tx.category : null);
  setTxRepeat('once');
  $('#tx-repeat-box').classList.toggle('hidden', !!tx);
  openModal('tx-modal');
  setTimeout(() => $('#tx-amount').focus(), 60);
}

/* ─────────── نافذة الهدف والإيداع ─────────── */
let editGoalObj = null, goalColor = '#8b5cf6', depGoal = null;
function paintSwatches() {
  $$('#goal-modal .swatch').forEach(s => s.classList.toggle('active', s.dataset.color === goalColor));
}
function openGoalModal(g) {
  editGoalObj = g || null;
  $('#goal-title-m').textContent = g ? 'تعديل الهدف' : 'هدف جديد';
  $('#g-name').value = g ? g.name : '';
  $('#g-target').value = g ? g.target : '';
  $('#g-saved').value = g ? g.saved : '';
  $('#g-deadline').value = g ? (g.deadline || '') : '';
  goalColor = g ? (GOAL_COLORS.includes(g.color) ? g.color : GOAL_COLORS[0]) : GOAL_COLORS[Math.floor(Math.random() * GOAL_COLORS.length)];
  paintSwatches();
  openModal('goal-modal');
  setTimeout(() => $('#g-name').focus(), 60);
}
function openDeposit(g) {
  depGoal = g;
  $('#dep-name').textContent = g.name;
  $('.dep-cur').textContent = S.settings.currency;
  $('#dep-amount').value = '';
  openModal('deposit-modal');
  setTimeout(() => $('#dep-amount').focus(), 60);
}

/* ─────────── لوحة الأوامر ─────────── */
let palItems = [], palSel = 0;
function paletteCommands() {
  return [
    {icon: '📊', label: 'الانتقال إلى لوحة التحكم', hint: 'صفحة', run: () => go('dashboard')},
    {icon: '🧾', label: 'الانتقال إلى المعاملات', hint: 'صفحة', run: () => go('transactions')},
    {icon: '🎛️', label: 'الانتقال إلى الميزانيات', hint: 'صفحة', run: () => go('budgets')},
    {icon: '🎯', label: 'الانتقال إلى الأهداف والتحديات', hint: 'صفحة', run: () => go('goals')},
    {icon: '📈', label: 'الانتقال إلى التقارير', hint: 'صفحة', run: () => go('reports')},
    {icon: '⚙️', label: 'الانتقال إلى الإعدادات', hint: 'صفحة', run: () => go('settings')},
    {icon: '➕', label: 'معاملة جديدة (مصروف)', hint: 'إضافة', run: () => openTxModal()},
    {icon: '💵', label: 'تسجيل دخل', hint: 'إضافة', run: () => { openTxModal(); setTxType('income'); }},
    {icon: '🔁', label: 'قاعدة تكرار شهرية', hint: 'إضافة', run: () => { openTxModal(); setTimeout(() => setTxRepeat('monthly'), 30); }},
    {icon: '🎯', label: 'هدف ادخار جديد', hint: 'إضافة', run: () => openGoalModal()},
    {icon: '🌗', label: 'تبديل المظهر (داكن / فاتح)', hint: 'مظهر', run: () => setTheme(S.settings.theme === 'dark' ? 'light' : 'dark')},
    {icon: '💾', label: 'تصدير نسخة احتياطية', hint: 'بيانات', run: () => exportData()},
  ];
}
const palRow = (c, i) => `<div class="pal-item" data-i="${i}"><span class="pi">${c.icon}</span><span>${esc(c.label)}</span><span class="${c.pv ? 'pv' : 'hint'}" ${c.style ? `style="${c.style}"` : ''}>${esc(c.hint)}</span></div>`;
function renderPalette(q) {
  q = (q || '').trim();
  const cmds = paletteCommands().filter(c => !q || c.label.includes(q) || c.hint.includes(q));
  const txs = q
    ? sortedTx().filter(t => (t.note || '').includes(q) || catOf(t).name.includes(q) || String(t.amount).includes(q)).slice(0, 6)
    : sortedTx().slice(0, 5);
  palItems = [];
  const rows = [];
  if (cmds.length) {
    rows.push('<div class="pal-group">⚡ أوامر</div>');
    cmds.forEach(c => { const i = palItems.length; palItems.push(c); rows.push(palRow(c, i)); });
  }
  if (txs.length) {
    rows.push('<div class="pal-group">🧾 معاملات</div>');
    txs.forEach(t => {
      const i = palItems.length;
      const c = catOf(t);
      palItems.push({
        icon: c.icon, label: (t.note || c.name) + ' — ' + fmtDate(t.date),
        hint: (t.type === 'income' ? '+' : '−') + fmt(t.amount), pv: true,
        style: t.type === 'income' ? 'color:var(--good)' : 'color:var(--bad)',
        run: () => openTxModal(t),
      });
      rows.push(palRow(palItems[i], i));
    });
  }
  $('#pal-list').innerHTML = rows.length ? rows.join('') : `<div class="pal-empty">لا نتائج لـ «${esc(q)}» 🤷</div>`;
  palSel = Math.min(Math.max(0, palSel), Math.max(0, palItems.length - 1));
  paintPalActive();
  $$('#pal-list .pal-item').forEach(el => {
    el.addEventListener('mouseenter', () => { palSel = +el.dataset.i; paintPalActive(); });
    el.addEventListener('click', () => runPal(+el.dataset.i));
  });
}
function paintPalActive() {
  $$('#pal-list .pal-item').forEach(el => el.classList.toggle('active', +el.dataset.i === palSel));
  const a = $('#pal-list .pal-item.active');
  if (a) a.scrollIntoView({block: 'nearest'});
}
function runPal(i) {
  const it = palItems[i];
  if (!it) return;
  closeModals();
  setTimeout(() => it.run(), 80);
}
function openPalette() {
  palSel = 0;
  openModal('palette-modal');
  $('#pal-input').value = '';
  renderPalette('');
  setTimeout(() => $('#pal-input').focus(), 60);
}

/* ─────────── PWA ─────────── */
let deferredInstall = null;
function initPWA() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstall = e;
    const b = $('#install-btn');
    if (b) b.textContent = '📲 تثبيت التطبيق';
  });
  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    toast('تم تثبيت تدفّق كتطبيق مستقل 📲', 'success');
    const c = $('#install-card');
    if (c) c.remove();
  });
}

/* ─────────── المظهر والتنقل ─────────── */
function setTheme(t, persist = true) {
  document.documentElement.dataset.theme = t;
  bgColorRGB = t === 'dark' ? '139,152,255' : '99,102,180';
  $('#theme-btn').innerHTML = t === 'dark' ? I.sun : I.moon;
  if (persist) { S.settings.theme = t; save(); }
}
function updateChrome() {
  const b = $('#side-balance');
  if (b) b.textContent = money(balanceAll());
  const c = $('#tx-currency');
  if (c) c.textContent = S.settings.currency;
}
const render = {
  dashboard: renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  goals: renderGoals,
  reports: renderReports,
  settings: renderSettings,
};
let currentPage = 'dashboard';
function go(page) {
  currentPage = page;
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  $$('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  const [t, s] = PAGE_META[page];
  $('#page-title').textContent = t;
  $('#page-sub').textContent = s;
  render[page]();
  scrollTo({top: 0, behavior: 'smooth'});
}

/* ─────────── الإقلاع ─────────── */
function init() {
  setTheme(S.settings.theme, false);
  updateChrome();

  // أيقونات ثابتة
  $('#fab').innerHTML = I.plus;
  $$('.modal-close').forEach(b => { b.innerHTML = I.x; b.addEventListener('click', closeModals); });
  $$('.modal-backdrop').forEach(b => b.addEventListener('click', e => { if (e.target === b) closeModals(); }));

  // التنقل والأزرار العلوية
  $$('.nav-item').forEach(b => b.addEventListener('click', () => go(b.dataset.page)));
  $('#theme-btn').addEventListener('click', () => setTheme(S.settings.theme === 'dark' ? 'light' : 'dark'));
  $('#add-btn').addEventListener('click', () => openTxModal());
  $('#fab').addEventListener('click', () => openTxModal());

  // نموذج المعاملة
  $$('#tx-modal .type-btn').forEach(b => b.addEventListener('click', () => setTxType(b.dataset.type)));
  $$('#tx-repeat .pill').forEach(b => b.addEventListener('click', () => setTxRepeat(b.dataset.v)));
  $('#tx-form').addEventListener('submit', e => {
    e.preventDefault();
    const amount = parseFloat($('#tx-amount').value);
    const category = $('#tx-category').value;
    const date = $('#tx-date').value;
    const note = $('#tx-note').value.trim();
    if (!(amount > 0) || !category || !date) { toast('يرجى تعبئة الحقول بشكل صحيح', 'error'); return; }
    if (editingTx) {
      Object.assign(editingTx, {type: txType, amount, category, date, note});
      toast('تم تحديث المعاملة ✅', 'success');
    } else if (txRepeat === 'monthly') {
      const day = Math.min(28, Math.max(1, parseInt($('#tx-day').value) || 1));
      const rule = {id: uid(), type: txType, amount, category, note, day, active: true, lastRun: monthKey(date)};
      S.recurring.push(rule);
      S.transactions.push({id: uid(), type: txType, amount, category, date, note, _rec: rule.id});
      save(); processRecurring();
      toast('أُنشئت قاعدة تكرار شهري 🔁', 'success');
    } else {
      S.transactions.push({id: uid(), type: txType, amount, category, date, note});
      toast('أُضيفت المعاملة 🎉', 'success');
    }
    save(); closeModals(); render[currentPage]();
  });

  // نموذج الهدف
  $$('#goal-modal .swatch').forEach(s => s.addEventListener('click', () => { goalColor = s.dataset.color; paintSwatches(); }));
  $('#goal-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#g-name').value.trim();
    const target = parseFloat($('#g-target').value);
    const saved = parseFloat($('#g-saved').value) || 0;
    const deadline = $('#g-deadline').value;
    if (!name || !(target > 0)) { toast('أدخل اسمًا ومبلغًا مستهدفًا صحيحًا', 'error'); return; }
    if (editGoalObj) {
      Object.assign(editGoalObj, {name, target, saved, deadline, color: goalColor});
      toast('تم تحديث الهدف ✅', 'success');
    } else {
      S.goals.push({id: uid(), name, target, saved, deadline, color: goalColor});
      toast('أُضيف الهدف «' + name + '» 🎯', 'success');
    }
    save(); closeModals(); render[currentPage]();
  });

  // الإيداع
  $('#dep-form').addEventListener('submit', e => {
    e.preventDefault();
    const v = parseFloat($('#dep-amount').value);
    if (!(v > 0) || !depGoal) { toast('أدخل مبلغًا صحيحًا', 'error'); return; }
    const was = depGoal.saved;
    depGoal.saved = Math.round((depGoal.saved + v) * 100) / 100;
    save();
    if (depGoal.saved >= depGoal.target && was < depGoal.target) {
      confetti.burst();
      toast('🎉 مبروك! حققت هدف «' + depGoal.name + '»', 'success');
    } else {
      toast('أُودع ' + money(v) + ' في «' + depGoal.name + '»', 'success');
    }
    closeModals(); render[currentPage]();
  });

  // التأكيد
  $('#confirm-yes').addEventListener('click', () => { closeModals(); if (onConfirm) onConfirm(); onConfirm = null; });

  // الاستيراد
  $('#import-file').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || !Array.isArray(d.transactions)) throw new Error('bad');
        S = normalize(d);
        save(); setTheme(S.settings.theme, false); go('dashboard');
        toast('تم استيراد البيانات بنجاح ✅', 'success');
      } catch (err) { toast('ملف غير صالح ❌', 'error'); }
    };
    r.readAsText(f);
    e.target.value = '';
  });

  // اختصارات لوحة المفاتيح
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModals();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if ($('#palette-modal').classList.contains('open')) closeModals();
      else { closeModals(); openPalette(); }
    }
  });

  // لوحة الأوامر
  $('#palette-btn').addEventListener('click', openPalette);
  $('#pal-input').addEventListener('input', e => { palSel = 0; renderPalette(e.target.value); });
  $('#pal-input').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); paintPalActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); paintPalActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
  });

  // إعادة رسم الرسوم عند تغيير الحجم
  let rzT;
  addEventListener('resize', () => {
    clearTimeout(rzT);
    rzT = setTimeout(() => render[currentPage](), 180);
  });

  // الخلفية الحية
  initParticles();
  initCursorGlow();

  // المعاملات المتكررة + PWA
  processRecurring();
  initPWA();

  // الانطلاق
  go('dashboard');

  // شاشة البداية
  setTimeout(() => {
    const sp = $('#splash');
    if (sp) { sp.classList.add('hide'); setTimeout(() => sp.remove(), 750); }
  }, 1700);

  if (S && S._seeded) {
    delete S._seeded;
    save();
    setTimeout(() => toast('مرحبًا بك في تدفّق 👋 أضفنا بيانات تجريبية — امسحها من الإعدادات', 'info'), 2100);
  }
}
document.addEventListener('DOMContentLoaded', init);
