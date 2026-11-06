/*
 * Enigma engine: pure logic without DOM, also testable in Node.
 * cfg = {
 *   rotors: ['I','II','III'],     // left -> right
 *   greek: 'Beta',                // M4 only
 *   rings: [..], positions: [..]  // 0..25, incl. Greek rotor first (M4)
 *   reflector: 'B', reflectorPos: 0,
 *   plugs: 'AB CD EF'
 * }
 */
(function (root) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const toIdx = c => c.charCodeAt(0) - 65;
  const mod = n => ((n % 26) + 26) % 26;
  const arr = s => [...s].map(toIdx);
  const inv = a => { const r = new Array(26); a.forEach((v, i) => { r[v] = i; }); return r; };

  class Rotor {
    constructor(name, def, ring, pos) {
      this.name = name;
      this.fwd = arr(def.w);
      this.bwd = inv(this.fwd);
      this.notches = [...(def.n || '')].map(toIdx);
      this.ring = ring || 0;
      this.pos = pos || 0;
    }
    atNotch() { return this.notches.includes(this.pos); }
    step() { this.pos = mod(this.pos + 1); }
    forward(c) { const s = this.pos - this.ring; return mod(this.fwd[mod(c + s)] - s); }
    backward(c) { const s = this.pos - this.ring; return mod(this.bwd[mod(c + s)] - s); }
  }

  function parsePlugs(str) {
    const map = [...Array(26).keys()];
    const pairs = [];
    const letters = (str || '').toUpperCase().replace(/[^A-Z]/g, '');
    for (let i = 0; i + 1 < letters.length; i += 2) {
      const a = toIdx(letters[i]), b = toIdx(letters[i + 1]);
      if (a === b || map[a] !== a || map[b] !== b) continue; // invalid or duplicate
      map[a] = b; map[b] = a; pairs.push(letters[i] + letters[i + 1]);
    }
    return { map, pairs };
  }

  class Enigma {
    constructor(machine, cfg) {
      this.m = machine;
      const extra = machine.greek ? 1 : 0;
      const n = machine.slots + extra;
      const rings = cfg.rings || new Array(n).fill(0);
      const pos = cfg.positions || new Array(n).fill(0);
      this.rotors = [];
      if (extra) {
        const g = cfg.greek || Object.keys(machine.greek)[0];
        this.rotors.push(new Rotor(g, machine.greek[g], rings[0], pos[0]));
      }
      cfg.rotors.forEach((name, i) => {
        const def = machine.rotors[name];
        if (!def) throw new Error('Unknown rotor ' + name);
        this.rotors.push(new Rotor(name, def, rings[i + extra], pos[i + extra]));
      });
      const rname = cfg.reflector || Object.keys(machine.reflectors)[0];
      this.reflectorName = rname;
      this.refl = arr(machine.reflectors[rname]);
      this.reflPos = machine.reflectorSettable ? (cfg.reflectorPos || 0) : 0;
      this.etw = arr(machine.etw);       // contact i <- key etw[i]
      this.etwInv = inv(this.etw);       // key -> contact
      const p = machine.plugboard ? parsePlugs(cfg.plugs) : parsePlugs('');
      this.plug = p.map;
      this.plugPairs = p.pairs;
    }

    get positions() { return this.rotors.map(r => r.pos); }

    step() {
      const L = this.rotors.length;
      const r = this.rotors[L - 1], m = this.rotors[L - 2], l = this.rotors[L - 3];
      if (this.m.stepping === 'gear') {
        // Counter drive (Enigma G): carry like an odometer, no double step
        const c0 = r.atNotch(); r.step();
        if (c0) {
          const c1 = m.atNotch(); m.step();
          if (c1) {
            const c2 = l.atNotch(); l.step();
            if (c2 && this.m.reflectorSteps) this.reflPos = mod(this.reflPos + 1);
          }
        }
      } else {
        // Pawl and ratchet stepping incl. the double step of the middle rotor
        const mn = m.atNotch(), rn = r.atNotch();
        if (mn) { m.step(); l.step(); }
        else if (rn) { m.step(); }
        r.step();
      }
    }

    reflect(c) { const p = this.reflPos; return mod(this.refl[mod(c + p)] - p); }

    /* Encrypts one letter (0..25); returns the result and the current path */
    press(k) {
      this.step();
      const trace = [];
      let c = this.plug[k];
      trace.push(['Stecker', c]);
      c = this.etwInv[c];
      trace.push(['ETW', c]);
      for (let i = this.rotors.length - 1; i >= 0; i--) {
        c = this.rotors[i].forward(c); trace.push([this.rotors[i].name, c]);
      }
      c = this.reflect(c); trace.push(['UKW', c]);
      for (let i = 0; i < this.rotors.length; i++) {
        c = this.rotors[i].backward(c); trace.push([this.rotors[i].name, c]);
      }
      c = this.etw[c]; trace.push(['ETW', c]);
      c = this.plug[c]; trace.push(['Stecker', c]);
      return { out: c, trace };
    }

    pressChar(ch) { return A[this.press(toIdx(ch)).out]; }

    encodeText(text) {
      return [...Enigma.normalize(text)].map(ch => this.pressChar(ch)).join('');
    }

    static normalize(text) {
      return (text || '').toUpperCase()
        .replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').replace(/ß/g, 'SS')
        .replace(/[^A-Z]/g, '');
    }
  }

  const api = { Enigma, Rotor, parsePlugs, ALPHA: A };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof window !== 'undefined' ? window : globalThis);
