/*
 * See-through view: shows the inside of the machine and animates the path of
 * the current for the last key press.
 *
 * Layout (left -> right): reflector, rotors (left .. right), entry wheel,
 * plugboard (if the model has one), keys/lamps. Every column has 26 contacts
 * stacked vertically; wires inside the rotors are drawn faintly and slide by
 * one contact when a rotor steps.
 */
(function (root) {
  'use strict';
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NS = 'http://www.w3.org/2000/svg';
  const ROW = 12, TOP = 82, GAP = 30, MARGIN = 14;
  const Y = c => TOP + c * ROW;
  const md = n => ((n % 26) + 26) % 26;
  const COL_FWD = '#ffcf5a', COL_BACK = '#ff7a45';

  function mk(tag, attrs, parent, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  class SeeThrough {
    constructor(host, opts) {
      this.host = host;
      this.tr = opts.tr;
      this.label = opts.label;
      this.speed = opts.speed || 6;
      this.stepMode = !!opts.stepMode;
      this.onSettings = opts.onSettings || (() => {});
      this.prevPos = null;
      this.run = 0;
      this.stages = [];
      this.si = 0;
      this.lastPlay = null;
      this.buildShell();
    }

    /* ---------- DOM shell: svg + control bar + caption ---------- */
    buildShell() {
      const h = this.host;
      h.innerHTML = '';
      const scroll = document.createElement('div');
      scroll.className = 'st-scroll';
      this.svg = mk('svg', { class: 'st-svg', role: 'img' }, scroll);
      h.appendChild(scroll);

      const bar = document.createElement('div');
      bar.className = 'st-bar';
      bar.innerHTML =
        '<span class="st-legend"><i class="st-fwd"></i><span data-st="forward"></span></span>' +
        '<span class="st-legend"><i class="st-back"></i><span data-st="backward"></span></span>' +
        '<label class="st-speed"><span data-st="speed"></span><input type="range" min="1" max="10" step="1"></label>' +
        '<label class="st-step"><input type="checkbox"> <span data-st="stepMode"></span></label>' +
        '<button type="button" class="btn small st-next"></button>';
      h.appendChild(bar);
      this.cap = document.createElement('div');
      this.cap.className = 'st-cap';
      this.cap.setAttribute('aria-live', 'polite');
      h.appendChild(this.cap);

      const range = bar.querySelector('input[type=range]');
      range.value = this.speed;
      range.addEventListener('input', () => { this.speed = +range.value; this.onSettings(this); });
      const chk = bar.querySelector('input[type=checkbox]');
      chk.checked = this.stepMode;
      chk.addEventListener('change', () => {
        this.stepMode = chk.checked; this.onSettings(this); this.syncBar();
        if (this.lastPlay) this.play(...this.lastPlay);
      });
      this.nextBtn = bar.querySelector('.st-next');
      this.nextBtn.addEventListener('click', () => this.next());
      this.applyLang();
    }

    applyLang() {
      this.host.querySelectorAll('[data-st]').forEach(e => { e.textContent = this.tr(e.dataset.st); });
      this.nextBtn.textContent = this.tr('next') + ' →';
      if (!this.stages.length) this.cap.textContent = this.tr('stPrompt');
      else this.cap.textContent = this.stages[Math.max(0, Math.min(this.si, this.stages.length) - 1)]?.cap() || this.tr('stPrompt');
      if (this.enigma) this.render(this.enigma, this.machine, true);
    }

    syncBar() { this.nextBtn.hidden = !this.stepMode; }

    /* ---------- static drawing ---------- */
    layout(enigma, machine) {
      const cols = [];
      let x = MARGIN;
      const add = (type, w, extra) => { const c = Object.assign({ type, L: x, R: x + w, w, cx: x + w / 2 }, extra); cols.push(c); x += w + GAP; return c; };
      add('refl', 52);
      enigma.rotors.forEach((r, i) => add('rotor', 60, { i }));
      add('etw', 56);
      if (machine.plugboard) add('plug', 56);
      add('keys', 30);
      this.width = x - GAP + MARGIN;
      return cols;
    }

    render(enigma, machine, force) {
      this.enigma = enigma; this.machine = machine;
      const cols = this.cols = this.layout(enigma, machine);
      const svg = this.svg;
      const H = TOP + 25 * ROW + 26;
      svg.setAttribute('viewBox', `0 0 ${this.width} ${H}`);
      svg.style.minWidth = Math.round(this.width * 0.82) + 'px';
      svg.innerHTML = '';
      const defs = mk('defs', {}, svg);
      const g1 = mk('linearGradient', { id: 'st-cyl', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      [['0', '#0d0c0b'], ['.18', '#2c2925'], ['.5', '#4a453e'], ['.82', '#2c2925'], ['1', '#0d0c0b']].forEach(([o, c]) => mk('stop', { offset: o, 'stop-color': c }, g1));
      const g2 = mk('linearGradient', { id: 'st-plate', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
      [['0', '#1b1a18'], ['.5', '#2a2824'], ['1', '#1b1a18']].forEach(([o, c]) => mk('stop', { offset: o, 'stop-color': c }, g2));
      const f = mk('filter', { id: 'st-glow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs);
      mk('feGaussianBlur', { stdDeviation: 2.4, result: 'b' }, f);
      const m = mk('feMerge', {}, f); mk('feMergeNode', { in: 'b' }, m); mk('feMergeNode', { in: 'SourceGraphic' }, m);

      const base = mk('g', {}, svg);
      this.wires = mk('g', {}, svg);
      this.current = mk('g', { filter: 'url(#st-glow)' }, svg);
      this.marks = mk('g', {}, svg);
      const bodyY = TOP - 12, bodyH = 25 * ROW + 24;
      const pos = enigma.positions;
      const changed = this.prevPos && this.prevPos.length === pos.length && !force ? pos.map((p, i) => p !== this.prevPos[i]) : pos.map(() => false);
      const reflChanged = this.prevRefl != null && this.prevRefl !== enigma.reflPos && !force;

      cols.forEach(col => {
        const head = (txt, sub) => {
          mk('text', { x: col.cx, y: 20, class: 'st-head' }, base, txt);
          if (sub != null) {
            const ww = Math.max(28, String(sub).length * 8 + 10);
            mk('rect', { x: col.cx - ww / 2, y: 30, width: ww, height: 20, rx: 3, class: 'st-win' }, base);
            mk('text', { x: col.cx, y: 44.5, class: 'st-winl' }, base, sub);
          }
        };
        if (col.type === 'keys') {
          head(this.tr('trKey'));
          for (let c = 0; c < 26; c++) mk('text', { x: col.cx, y: Y(c) + 4, class: 'st-key', id: 'st-k' + c }, base, A[c]);
          return;
        }
        const isRotor = col.type === 'rotor' || col.type === 'refl';
        mk('rect', { x: col.L, y: bodyY, width: col.w, height: bodyH, rx: isRotor ? 8 : 4, fill: isRotor ? 'url(#st-cyl)' : 'url(#st-plate)', class: 'st-body' }, base);
        if (isRotor) for (let k = 1; k < 4; k++) mk('line', { x1: col.L + col.w * k / 4, y1: bodyY + 3, x2: col.L + col.w * k / 4, y2: bodyY + bodyH - 3, class: 'st-rib' }, base);
        for (let c = 0; c < 26; c++) {
          mk('circle', { cx: col.R, cy: Y(c), r: 2.1, class: 'st-pin' }, base);
          if (col.type !== 'refl') mk('circle', { cx: col.L, cy: Y(c), r: 2.1, class: 'st-pin' }, base); // reflector: contacts on one face only
        }
        const w = mk('g', { class: 'st-wires' }, this.wires);
        if (col.type === 'refl') {
          head(this.tr('trRefl'), machine.reflectorSettable ? A[enigma.reflPos] : enigma.reflectorName.split(' ')[0]);
          if (reflChanged) w.classList.add('st-slide');
          for (let c = 0; c < 26; c++) {
            const o = enigma.reflect(c);
            if (o > c) mk('path', { d: `M${col.R} ${Y(c)} H${col.R - 12 - (c % 6) * 5} V${Y(o)} H${col.R}` }, w);
          }
        } else if (col.type === 'rotor') {
          const r = enigma.rotors[col.i];
          head(r.name, this.label(r.pos));
          for (let c = 0; c < 26; c++) mk('line', { x1: col.R, y1: Y(c), x2: col.L, y2: Y(r.forward(c)) }, w);
          if (changed[col.i]) w.classList.add('st-slide');
        } else if (col.type === 'etw') {
          head(this.tr('trEtw'));
          for (let c = 0; c < 26; c++) mk('line', { x1: col.R, y1: Y(c), x2: col.L, y2: Y(enigma.etwInv[c]) }, w);
        } else if (col.type === 'plug') {
          head(this.tr('trPlug'));
          for (let c = 0; c < 26; c++) {
            const p = enigma.plug[c];
            if (p === c) mk('line', { x1: col.R, y1: Y(c), x2: col.L, y2: Y(c) }, w);
            else mk('path', { d: `M${col.R} ${Y(c)} C${col.cx} ${Y(c)} ${col.cx} ${Y(p)} ${col.L} ${Y(p)}`, class: 'st-cable' }, w);
          }
        }
      });
      this.prevPos = pos.slice();
      this.prevRefl = enigma.reflPos;
      if (this.lastPlay && force) this.replayMarks();
    }

    /* ---------- current path ---------- */
    buildStages(key, trace) {
      const e = this.enigma, tr = this.tr, cols = this.cols;
      const n = e.rotors.length;
      const col = t => cols.find(c => c.type === t);
      const refl = col('refl'), etw = col('etw'), plug = col('plug'), keys = col('keys');
      const rot = cols.filter(c => c.type === 'rotor');
      const v = i => trace[i][1];
      const P = pts => 'M' + pts.map(p => p.join(' ')).join(' L');
      const S = [];
      const windows = e.rotors.map(r => this.label(r.pos)).join(' ');
      S.push({ cap: () => tr('stKey', { k: A[key], w: windows }) });

      let c = key, x0 = keys.L;
      const p0 = v(0);
      if (plug) {
        S.push({ d: P([[x0, Y(c)], [plug.R, Y(c)], [plug.L, Y(p0)]]), col: COL_FWD, cap: () => p0 === key ? tr('stPlugNone', { a: A[key] }) : tr('stPlug', { a: A[key], b: A[p0] }) });
        x0 = plug.L;
      }
      c = p0;
      const e0 = v(1);
      S.push({ d: P([[x0, Y(c)], [etw.R, Y(c)], [etw.L, Y(e0)]]), col: COL_FWD, cap: () => tr('stEtwIn', { a: A[e0] }) });
      c = e0; x0 = etw.L;
      for (let i = n - 1, t = 2; i >= 0; i--, t++) {
        const r = rot[i], o = v(t), rr = e.rotors[i], from = c;
        S.push({ d: P([[x0, Y(c)], [r.R, Y(c)], [r.L, Y(o)]]), col: COL_FWD, cap: () => tr('stRotor', { r: rr.name, p: this.label(rr.pos), a: A[from], b: A[o] }) });
        c = o; x0 = r.L;
      }
      const ro = v(2 + n), rin = c;
      const bx = refl.R - 12 - (Math.min(c, ro) % 6) * 5;
      S.push({ d: P([[x0, Y(c)], [refl.R, Y(c)], [bx, Y(c)], [bx, Y(ro)], [refl.R, Y(ro)]]), col: COL_BACK, cap: () => tr('stRefl', { a: A[rin], b: A[ro] }) });
      c = ro; x0 = refl.R;
      for (let i = 0, t = 3 + n; i < n; i++, t++) {
        const r = rot[i], b = v(t), rr = e.rotors[i], from = c;
        S.push({ d: P([[x0, Y(c)], [r.L, Y(c)], [r.R, Y(b)]]), col: COL_BACK, cap: () => tr('stRotorBack', { r: rr.name, a: A[from], b: A[b] }) });
        c = b; x0 = r.R;
      }
      const l = v(3 + 2 * n);
      const lamp = v(4 + 2 * n);
      if (plug) {
        S.push({ d: P([[x0, Y(c)], [etw.L, Y(c)], [etw.R, Y(l)]]), col: COL_BACK, cap: () => tr('stEtwOut', { a: A[l] }) });
        S.push({ d: P([[etw.R, Y(l)], [plug.L, Y(l)], [plug.R, Y(lamp)], [keys.L, Y(lamp)]]), col: COL_BACK, cap: () => lamp === l ? tr('stPlugNone', { a: A[l] }) : tr('stPlug', { a: A[l], b: A[lamp] }) });
      } else {
        S.push({ d: P([[x0, Y(c)], [etw.L, Y(c)], [etw.R, Y(l)], [keys.L, Y(l)]]), col: COL_BACK, cap: () => tr('stEtwOut', { a: A[l] }) });
      }
      S.push({ lamp, cap: () => tr('stLamp', { a: A[key], b: A[lamp] }) });
      return S;
    }

    play(key, trace) {
      const token = ++this.run;
      this.lastPlay = [key, trace];
      this.current.innerHTML = ''; this.marks.innerHTML = '';
      this.svg.querySelectorAll('.st-key').forEach(k => k.classList.remove('on', 'lamp'));
      this.svg.querySelector('#st-k' + key)?.classList.add('on');
      this.stages = this.buildStages(key, trace);
      this.si = 0;
      this.syncBar();
      this.showStage(this.stages[this.si++], token, true);
      if (!this.stepMode) this.auto(token);
    }

    async auto(token) {
      await new Promise(r => setTimeout(r, 250));
      while (this.si < this.stages.length && token === this.run) {
        await this.showStage(this.stages[this.si++], token);
      }
    }

    next() {
      if (!this.stages.length || this.si >= this.stages.length) return;
      this.showStage(this.stages[this.si++], this.run);
    }

    showStage(st, token, instant) {
      this.cap.textContent = st.cap();
      if (st.lamp != null) {
        const k = this.svg.querySelector('#st-k' + st.lamp);
        k?.classList.add('lamp');
        const keys = this.cols.find(c => c.type === 'keys');
        mk('circle', { cx: keys.cx, cy: Y(st.lamp), r: 8.5, class: 'st-lampring' }, this.marks);
        mk('text', { x: keys.cx, y: Y(st.lamp) + 4.5, class: 'st-key lamp' }, this.marks, A[st.lamp]);
        return Promise.resolve();
      }
      if (!st.d) return Promise.resolve();
      const p = mk('path', { d: st.d, stroke: st.col, class: 'st-current' }, this.current);
      const L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      if (instant) { p.style.strokeDashoffset = 0; return Promise.resolve(); }
      const v = 0.08 * Math.pow(1.4, this.speed - 1); // px per ms
      const t0 = performance.now();
      return new Promise(res => {
        const f = now => {
          if (token !== this.run) return res();
          const q = Math.min(1, (now - t0) * v / L);
          p.style.strokeDashoffset = L * (1 - q);
          q < 1 ? requestAnimationFrame(f) : res();
        };
        requestAnimationFrame(f);
      });
    }

    /* After a full re-render (language switch) show the finished path again */
    replayMarks() {
      const [key, trace] = this.lastPlay;
      const done = this.si;
      this.stages = this.buildStages(key, trace);
      this.svg.querySelector('#st-k' + key)?.classList.add('on');
      for (let i = 0; i < Math.min(done, this.stages.length); i++) this.showStage(this.stages[i], this.run, true);
      this.si = done;
    }

    clear() {
      this.run++; this.lastPlay = null; this.stages = []; this.si = 0;
      if (this.current) { this.current.innerHTML = ''; this.marks.innerHTML = ''; }
      this.cap.textContent = this.tr('stPrompt');
    }
  }

  root.SeeThrough = SeeThrough;
})(typeof window !== 'undefined' ? window : globalThis);
