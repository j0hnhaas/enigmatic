/* global MACHINES, PRESETS, Enigma */
(function () {
  'use strict';
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML'];
  const $ = s => document.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const mod = n => ((n % 26) + 26) % 26;
  const STORE = 'enigma-pwa-v1';

  /* ---------- Zustand ---------- */
  let store = {};
  try { store = JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { store = {}; }
  const state = {
    model: store.model && MACHINES[store.model] ? store.model : 'I',
    cfgs: store.cfgs || {},
    sound: store.sound !== false,
    groups: store.groups !== false,
    tapeIn: store.tapeIn || '',
    tapeOut: store.tapeOut || ''
  };
  let enigma = null;
  let history = [];
  let litLamp = null;
  let heldKey = null;
  let pendingSocket = null;

  const M = () => MACHINES[state.model];
  const nWheels = () => M().slots + (M().greek ? 1 : 0);

  function defaultCfg(id) {
    const m = MACHINES[id], n = m.slots + (m.greek ? 1 : 0);
    return {
      rotors: [...m.defaults.rotors], greek: m.defaults.greek, reflector: m.defaults.reflector,
      rings: new Array(n).fill(0), positions: new Array(n).fill(0), reflectorPos: 0, plugs: ''
    };
  }
  function cfg() {
    let c = state.cfgs[state.model];
    const m = M();
    const valid = c && Array.isArray(c.rotors) && c.rotors.length === m.slots && c.rotors.every(r => m.rotors[r]) &&
      m.reflectors[c.reflector] && c.positions && c.positions.length === nWheels();
    if (!valid) c = state.cfgs[state.model] = defaultCfg(state.model);
    return c;
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        model: state.model, cfgs: state.cfgs, sound: state.sound, groups: state.groups,
        tapeIn: state.tapeIn.slice(-5000), tapeOut: state.tapeOut.slice(-5000)
      }));
    } catch (e) { /* Speicher nicht verfügbar */ }
  }
  function rebuild() {
    enigma = new Enigma(M(), cfg());
    cfg().plugs = enigma.plugPairs.join(' ');
  }
  function syncFromMachine() {
    const c = cfg();
    c.positions = enigma.positions;
    c.reflectorPos = enigma.reflPos;
  }

  const label = (i) => M().display === 'numbers' ? String(i + 1).padStart(2, '0') : A[mod(i)];

  /* ---------- Klang ---------- */
  let actx = null;
  function click(strong) {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime, len = strong ? 0.06 : 0.03;
      const buf = actx.createBuffer(1, Math.floor(actx.sampleRate * len), actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
      const src = actx.createBufferSource(); src.buffer = buf;
      const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = strong ? 1800 : 3200; bp.Q.value = 1.2;
      const g = actx.createGain(); g.gain.value = strong ? 0.9 : 0.4;
      src.connect(bp).connect(g).connect(actx.destination); src.start(t);
      if (strong) {
        const o = actx.createOscillator(), og = actx.createGain();
        o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.08);
        og.gain.setValueAtTime(0.35, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        o.connect(og).connect(actx.destination); o.start(t); o.stop(t + 0.12);
      }
    } catch (e) { /* kein Audio */ }
  }

  /* ---------- Walzen ---------- */
  function renderRotors() {
    const box = $('#rotors');
    box.innerHTML = '';
    const m = M(), c = cfg();
    const units = [];
    if (m.reflectorSettable) units.push({ name: 'UKW', get: () => enigma.reflPos, set: v => { enigma.reflPos = mod(v); } });
    // immer über "enigma" zugreifen: die Instanz wird bei Steckeränderungen neu erzeugt
    enigma.rotors.forEach((r, i) => units.push({ name: r.name, get: () => enigma.rotors[i].pos, set: v => { enigma.rotors[i].pos = mod(v); } }));
    units.forEach(u => {
      const unit = el('div', 'rotor-unit');
      const win = el('div', 'window');
      const strip = el('div', 'strip');
      const prev = el('span', 'prev'), cur = el('span', 'cur'), next = el('span', 'next');
      strip.append(prev, cur, next);
      win.append(strip);
      const wheel = el('button', 'wheel');
      wheel.type = 'button';
      wheel.setAttribute('aria-label', `Walze ${u.name} drehen`);
      const name = el('div', 'rotor-name', u.name);
      unit.append(name, win, wheel);
      const draw = (dir) => {
        const p = u.get();
        prev.textContent = label(p - 1); cur.textContent = label(p); next.textContent = label(p + 1);
        if (dir) { strip.classList.remove('roll-up', 'roll-down'); void strip.offsetWidth; strip.classList.add(dir > 0 ? 'roll-up' : 'roll-down'); }
      };
      u.draw = draw;
      const turn = (d) => {
        u.set(u.get() + d); syncFromMachine(); history = []; draw(d); click(false); save(); renderSettings();
        wheel.style.setProperty('--rib', `${(parseFloat(getComputedStyle(wheel).getPropertyValue('--rib')) || 0) + d * 6}px`);
      };
      wheel.addEventListener('click', e => {
        const r = wheel.getBoundingClientRect();
        turn(e.clientY < r.top + r.height / 2 ? -1 : 1);
      });
      wheel.addEventListener('wheel', e => { e.preventDefault(); turn(e.deltaY > 0 ? 1 : -1); }, { passive: false });
      let startY = null;
      wheel.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
      wheel.addEventListener('touchmove', e => {
        if (startY == null) return;
        const dy = e.touches[0].clientY - startY;
        if (Math.abs(dy) > 18) { turn(dy > 0 ? 1 : -1); startY = e.touches[0].clientY; }
        e.preventDefault();
      }, { passive: false });
      win.addEventListener('wheel', e => { e.preventDefault(); turn(e.deltaY > 0 ? 1 : -1); }, { passive: false });
      draw();
      box.append(unit);
    });
    box._units = units;
    $('#model-tag').textContent = m.name.replace('Enigma ', '');
  }
  function updateRotors(before) {
    const units = $('#rotors')._units || [];
    const now = (M().reflectorSettable ? [enigma.reflPos] : []).concat(enigma.positions);
    units.forEach((u, i) => u.draw(before && before[i] !== now[i] ? 1 : 0));
  }

  /* ---------- Lampen & Tasten ---------- */
  function renderBoards() {
    const lamps = $('#lamps'), keys = $('#keys');
    lamps.innerHTML = ''; keys.innerHTML = '';
    ROWS.forEach(row => {
      const lr = el('div', 'row'), kr = el('div', 'row');
      [...row].forEach(ch => {
        const lamp = el('div', 'lamp'); lamp.dataset.l = ch; lamp.append(el('span', '', ch));
        lr.append(lamp);
        const key = el('button', 'key'); key.type = 'button'; key.dataset.k = ch;
        key.append(el('span', 'cap', ch));
        key.setAttribute('aria-label', 'Taste ' + ch);
        key.addEventListener('pointerdown', e => { e.preventDefault(); key.setPointerCapture?.(e.pointerId); press(ch); });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => key.addEventListener(ev, () => release(ch)));
        key.addEventListener('contextmenu', e => e.preventDefault());
        kr.append(key);
      });
      lamps.append(lr); keys.append(kr);
    });
  }

  function press(ch) {
    if (heldKey) return;
    heldKey = ch;
    const before = (M().reflectorSettable ? [enigma.reflPos] : []).concat(enigma.positions);
    history.push({ positions: enigma.positions, reflPos: enigma.reflPos, len: state.tapeIn.length });
    if (history.length > 1000) history.shift();
    const res = enigma.press(A.indexOf(ch));
    const out = A[res.out];
    syncFromMachine();
    document.querySelector(`.key[data-k="${ch}"]`)?.classList.add('down');
    litLamp = document.querySelector(`.lamp[data-l="${out}"]`);
    litLamp?.classList.add('lit');
    state.tapeIn += ch; state.tapeOut += out;
    updateRotors(before); renderTape(); renderTrace(ch, res.trace); click(true);
    save();
  }
  function release(ch) {
    if (heldKey !== ch) return;
    heldKey = null;
    document.querySelector(`.key[data-k="${ch}"]`)?.classList.remove('down');
    litLamp?.classList.remove('lit'); litLamp = null;
    click(false);
    renderSettings();
  }

  /* ---------- Papierstreifen ---------- */
  const fmt = s => state.groups ? s.replace(/(.{5})/g, '$1 ').trim() : s;
  function renderTape() {
    $('#tape-in').textContent = fmt(state.tapeIn);
    $('#tape-out').textContent = fmt(state.tapeOut);
    $('#counter').textContent = state.tapeIn.length + ' Zeichen';
    ['#tape-in', '#tape-out'].forEach(s => { const t = $(s); t.scrollTop = t.scrollHeight; });
  }
  function renderTrace(key, trace) {
    const box = $('#trace');
    box.innerHTML = '';
    const add = (lbl, ch, cls) => {
      const s = el('span', 'hop ' + (cls || '')); s.append(el('small', '', lbl), el('b', '', ch)); box.append(s);
    };
    add('Taste', key, 'end');
    trace.forEach(([stage, c]) => add(stage, A[c], stage === 'UKW' ? 'refl' : ''));
    box.lastChild.classList.add('end');
    box.lastChild.querySelector('small').textContent = 'Lampe';
    if (!M().plugboard) box.querySelectorAll('.hop').forEach((h, i, all) => { if (i === 1 || i === all.length - 1) h.classList.add('muted'); });
    box.lastChild.classList.remove('muted');
  }

  /* ---------- Steckerbrett ---------- */
  function renderPlugboard() {
    const fp = $('#frontplate');
    fp.hidden = !M().plugboard;
    if (!M().plugboard) return;
    const pb = $('#plugboard');
    pb.querySelectorAll('.prow').forEach(r => r.remove());
    ROWS.forEach(row => {
      const r = el('div', 'prow');
      [...row].forEach(ch => {
        const s = el('button', 'socket'); s.type = 'button'; s.dataset.s = ch;
        s.append(el('span', 'plabel', ch), el('span', 'holes'));
        s.setAttribute('aria-label', 'Buchse ' + ch);
        s.addEventListener('click', () => { socketClick(ch); s.blur(); });
        r.append(s);
      });
      pb.append(r);
    });
    drawCables();
  }
  function pairs() { return (cfg().plugs || '').split(/\s+/).filter(p => p.length === 2); }
  function socketClick(ch) {
    let ps = pairs();
    const existing = ps.find(p => p.includes(ch));
    if (existing) {
      ps = ps.filter(p => p !== existing);
      pendingSocket = null;
    } else if (pendingSocket && pendingSocket !== ch) {
      if (ps.length >= 13) { toast('Alle 13 Kabel sind gesteckt.'); pendingSocket = null; }
      else { ps.push(pendingSocket + ch); pendingSocket = null; }
    } else {
      pendingSocket = pendingSocket === ch ? null : ch;
    }
    cfg().plugs = ps.join(' ');
    rebuild(); history = []; click(false); save(); drawCables(); renderSettings();
  }
  function drawCables() {
    const pb = $('#plugboard'), svg = $('#cables');
    if (!M().plugboard || !pb.offsetWidth) return;
    const box = pb.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    const center = ch => {
      const h = pb.querySelector(`.socket[data-s="${ch}"] .holes`).getBoundingClientRect();
      return { x: h.left - box.left + h.width / 2, y: h.top - box.top + h.height / 2 };
    };
    pb.querySelectorAll('.socket').forEach(s => {
      s.classList.toggle('plugged', pairs().some(p => p.includes(s.dataset.s)));
      s.classList.toggle('pending', s.dataset.s === pendingSocket);
    });
    const colors = ['#1d1b18', '#2a1f17', '#211d1a'];
    pairs().forEach((p, i) => {
      const a = center(p[0]), b = center(p[1]);
      const sag = Math.min(box.height - Math.max(a.y, b.y) + 10, 18 + Math.abs(a.x - b.x) * 0.1 + Math.abs(a.y - b.y) * 0.2);
      const d = `M${a.x},${a.y} C${a.x},${a.y + sag} ${b.x},${b.y + sag} ${b.x},${b.y}`;
      const g = document.createElementNS(ns, 'g');
      const mk = (w, c, op) => { const pth = document.createElementNS(ns, 'path'); pth.setAttribute('d', d); pth.setAttribute('stroke', c); pth.setAttribute('stroke-width', w); pth.setAttribute('fill', 'none'); pth.setAttribute('stroke-linecap', 'round'); if (op) pth.setAttribute('opacity', op); return pth; };
      g.append(mk(7, '#000', 0.5), mk(5, colors[i % 3]), mk(1.2, '#6b6157', 0.55));
      [a, b].forEach(pt => {
        const plug = document.createElementNS(ns, 'rect');
        plug.setAttribute('x', pt.x - 9); plug.setAttribute('y', pt.y - 7); plug.setAttribute('width', 18); plug.setAttribute('height', 14); plug.setAttribute('rx', 3);
        plug.setAttribute('class', 'plug');
        g.append(plug);
        const t = document.createElementNS(ns, 'circle'); t.setAttribute('cx', pt.x); t.setAttribute('cy', pt.y); t.setAttribute('r', 2.2); t.setAttribute('fill', '#8a7d6c');
        g.append(t);
      });
      svg.append(g);
    });
  }

  /* ---------- Einstellungen ---------- */
  function select(options, value, onChange, labels) {
    const s = el('select');
    options.forEach((o, i) => { const op = el('option', '', labels ? labels[i] : o); op.value = o; if (String(o) === String(value)) op.selected = true; s.append(op); });
    s.addEventListener('change', () => onChange(s.value));
    return s;
  }
  function field(lbl, ...controls) {
    const f = el('div', 'field'); f.append(el('label', '', lbl));
    const g = el('div', 'controls'); controls.forEach(c => g.append(c)); f.append(g); return f;
  }
  const idxs = [...Array(26).keys()];
  function changed() { rebuild(); history = []; save(); renderRotors(); renderPlugboard(); renderSettings(); }

  function renderSettings() {
    const body = $('#settings-body');
    if (!body) return;
    const m = M(), c = cfg();
    body.innerHTML = '';
    const lbls = idxs.map(i => m.display === 'numbers' ? `${String(i + 1).padStart(2, '0')} (${A[i]})` : A[i]);
    const extra = m.greek ? 1 : 0;

    const rnames = Object.keys(m.reflectors);
    const reflControls = [];
    if (rnames.length > 1) reflControls.push(select(rnames, c.reflector, v => { c.reflector = v; changed(); }));
    else reflControls.push(el('span', 'fixed', rnames[0]));
    if (m.reflectorSettable) reflControls.push(select(idxs, c.reflectorPos, v => { c.reflectorPos = +v; changed(); }, idxs.map(i => 'Stellung ' + A[i])));
    body.append(field('Umkehrwalze', ...reflControls));

    const order = [];
    if (extra) order.push(select(Object.keys(m.greek), c.greek, v => { c.greek = v; changed(); }));
    c.rotors.forEach((r, i) => order.push(select(Object.keys(m.rotors), r, v => {
      const j = c.rotors.indexOf(v);
      if (j >= 0 && j !== i) c.rotors[j] = c.rotors[i]; // Walze existiert nur einmal: tauschen
      c.rotors[i] = v; changed();
    })));
    body.append(field('Walzenlage (links → rechts)', ...order));

    body.append(field('Ringstellung', ...c.rings.map((v, i) => select(idxs, v, nv => { c.rings[i] = +nv; changed(); }, lbls))));
    body.append(field('Grundstellung', ...c.positions.map((v, i) => select(idxs, v, nv => { c.positions[i] = +nv; changed(); }, lbls))));

    if (m.plugboard) {
      const inp = el('input'); inp.type = 'text'; inp.value = c.plugs; inp.placeholder = 'z. B. AV BS CG DL FU';
      inp.autocapitalize = 'characters'; inp.spellcheck = false;
      inp.addEventListener('change', () => { c.plugs = inp.value; changed(); });
      body.append(field('Steckerverbindungen', inp));
    }
    const reset = el('button', 'btn small', 'Auf Standard zurücksetzen'); reset.type = 'button';
    reset.addEventListener('click', () => { state.cfgs[state.model] = defaultCfg(state.model); changed(); });
    body.append(reset);
    void extra;
  }

  function renderPresets() {
    const box = $('#presets'); box.innerHTML = '';
    PRESETS.forEach(p => {
      const b = el('button', 'btn small preset', p.title); b.type = 'button';
      b.addEventListener('click', () => {
        state.model = p.machine; $('#model').value = p.machine;
        state.cfgs[p.machine] = Object.assign(defaultCfg(p.machine), JSON.parse(JSON.stringify(p.cfg)));
        state.tapeIn = ''; state.tapeOut = '';
        changed(); renderTape();
        $('#bulk-text').value = p.text;
        $('.bulk').open = true;
        $('#settings').close();
        toast('Schlüssel gesetzt, Geheimtext eingefügt. Jetzt „Durch die Maschine schicken“.');
      });
      box.append(b);
    });
  }

  /* ---------- Modellwechsel ---------- */
  function renderModelSelect() {
    const s = $('#model'); s.innerHTML = '';
    Object.entries(MACHINES).forEach(([id, m]) => {
      const o = el('option', '', `${m.name} · ${m.year}`); o.value = id; s.append(o);
    });
    s.value = state.model;
    s.addEventListener('change', () => { state.model = s.value; history = []; pendingSocket = null; changed(); document.body.dataset.model = state.model; });
  }
  function renderInfo() {
    const m = M();
    $('#info-title').textContent = m.name;
    $('#info-meta').textContent = `${m.user} · ab ${m.year} · ${Object.keys(m.rotors).length} Walzen${m.greek ? ' + Zusatzwalze' : ''} · ${m.plugboard ? 'mit' : 'ohne'} Steckerbrett · ${m.stepping === 'gear' ? 'Zahnradantrieb' : 'Schaltklinken'}`;
    $('#info-text').textContent = m.info;
  }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ---------- Ereignisse ---------- */
  function bind() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.querySelector('dialog[open]')) return;
      const k = e.key.toUpperCase();
      if (k.length === 1 && A.includes(k)) { e.preventDefault(); if (!e.repeat) press(k); }
      else if (e.key === 'Backspace') { e.preventDefault(); undo(); }
    });
    document.addEventListener('keyup', e => { const k = e.key.toUpperCase(); if (heldKey && (k === heldKey || !A.includes(k))) release(heldKey); });
    window.addEventListener('blur', () => heldKey && release(heldKey));

    $('#btn-settings').addEventListener('click', () => { renderSettings(); $('#settings').showModal(); });
    $('#btn-info').addEventListener('click', () => { renderInfo(); $('#info').showModal(); });
    $('#settings').addEventListener('close', () => { renderRotors(); });
    $('#opt-sound').checked = state.sound;
    $('#opt-groups').checked = state.groups;
    $('#opt-sound').addEventListener('change', e => { state.sound = e.target.checked; save(); });
    $('#opt-groups').addEventListener('change', e => { state.groups = e.target.checked; save(); renderTape(); });

    $('#btn-undo').addEventListener('click', undo);
    $('#btn-clear').addEventListener('click', () => { state.tapeIn = ''; state.tapeOut = ''; history = []; renderTape(); save(); });
    $('#btn-copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(fmt(state.tapeOut)); toast('Ausgabe kopiert.'); }
      catch (e) { toast('Kopieren nicht möglich.'); }
    });
    $('#btn-bulk').addEventListener('click', () => {
      const text = Enigma.normalize($('#bulk-text').value);
      if (!text) { toast('Kein Text mit Buchstaben A–Z.'); return; }
      history = [];
      let out = '';
      for (const ch of text) out += A[enigma.press(A.indexOf(ch)).out];
      syncFromMachine();
      state.tapeIn += text; state.tapeOut += out;
      renderTape(); updateRotors(); save(); click(true);
      toast(`${text.length} Zeichen verarbeitet.`);
    });

    new ResizeObserver(() => drawCables()).observe($('#plugboard'));

    let deferred;
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#btn-install').hidden = false; });
    $('#btn-install').addEventListener('click', async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#btn-install').hidden = true; });
  }
  function undo() {
    const h = history.pop();
    if (!h) { toast('Nichts zum Zurücknehmen.'); return; }
    enigma.rotors.forEach((r, i) => { r.pos = h.positions[i]; });
    enigma.reflPos = h.reflPos;
    syncFromMachine();
    state.tapeIn = state.tapeIn.slice(0, h.len); state.tapeOut = state.tapeOut.slice(0, h.len);
    updateRotors(); renderTape(); save(); click(false);
  }

  /* ---------- Start ---------- */
  renderModelSelect();
  document.body.dataset.model = state.model;
  rebuild();
  renderRotors(); renderBoards(); renderPlugboard(); renderTape(); renderPresets(); renderSettings();
  bind();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
