// Run with: node tests/test.js
const { MACHINES, PRESETS } = require('../js/machines.js');
const { Enigma } = require('../js/enigma.js');
const I18N = require('../js/i18n.js');

let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✔ ' : '  ✘ ') + msg); if (!cond) fail++; };
const isPerm = w => w.length === 26 && new Set(w).size === 26 && /^[A-Z]+$/.test(w);

console.log('Wirings');
for (const [id, m] of Object.entries(MACHINES)) {
  ok(isPerm(m.etw), `${id}: entry wheel is a permutation`);
  for (const [n, r] of Object.entries({ ...m.rotors, ...(m.greek || {}) }))
    ok(isPerm(r.w), `${id}: rotor ${n} is a permutation`);
  for (const [n, w] of Object.entries(m.reflectors)) {
    const inv = isPerm(w) && [...w].every((c, i) => w.charCodeAt(c.charCodeAt(0) - 65) === 65 + i && c.charCodeAt(0) !== 65 + i);
    ok(inv, `${id}: reflector ${n} is an involution without fixed points`);
  }
}

console.log('Known test vectors');
const e1 = new Enigma(MACHINES.I, { rotors: ['I', 'II', 'III'], reflector: 'B' });
ok(e1.encodeText('AAAAA') === 'BDZGO', 'Enigma I, I-II-III, reflector B, AAA: AAAAA -> BDZGO');

const dbl = new Enigma(MACHINES.I, { rotors: ['I', 'II', 'III'], reflector: 'B', positions: [0, 3, 20] });
dbl.press(0); dbl.press(0); dbl.press(0);
ok(dbl.positions.join() === [1, 5, 23].join(), 'Double step ADU -> ADV -> AEW -> BFX');

const expected = {
  barbarossa: 'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAFFLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEINSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX',
  u534: 'VONVONJLOOKSJHFFTTTEINSEINSDREIZWOYYQNNSNEUNINHALTXXBEIANGRIFFUNTERWASSERGEDRUECKTYWABOSXLETZTERGEGNERSTANDNULACHTDREINULUHRMARQUANTONJOTANEUNACHTSEYHSDREIYZWOZWONULGRADYACHTSMYSTOSSENACHXEKNSVIERMBFAELLTYNNNNNNOOOVIERYSICHTEINSNULL'
};
for (const p of PRESETS) {
  const out = new Enigma(MACHINES[p.machine], p.cfg).encodeText(p.text);
  ok(out === expected[p.id], `Historic message "${p.id}" decrypts to the known plaintext`);
  if (out !== expected[p.id]) console.log('    ' + out.slice(0, 60));
}

console.log('Reciprocity of all models');
for (const [id, m] of Object.entries(MACHINES)) {
  const n = m.slots + (m.greek ? 1 : 0);
  const cfg = { rotors: m.defaults.rotors, greek: m.defaults.greek, reflector: m.defaults.reflector,
    positions: [3, 17, 25, 8].slice(0, n), rings: [5, 1, 9, 2].slice(0, n), reflectorPos: 7, plugs: 'AQ WE RT' };
  const plain = 'THISISALONGERTESTTEXTTHATCAUSESMANYSTEPSANDTURNSALLROTORS'.repeat(10);
  const c = new Enigma(m, cfg).encodeText(plain);
  const back = new Enigma(m, cfg).encodeText(c);
  ok(back === plain && [...c].every((ch, i) => ch !== plain[i]), `${id}: decrypts correctly, no letter maps to itself`);
}

console.log('Translations');
const enKeys = Object.keys(I18N.STRINGS.en);
const required = [
  ...Object.keys(MACHINES).flatMap(id => [`m.${id}.user`, `m.${id}.info`]),
  ...PRESETS.map(p => `preset.${p.id}`)
];
ok(required.every(k => enKeys.includes(k)), 'English covers every machine and preset');
for (const lang of Object.keys(I18N.LANGS)) {
  const keys = Object.keys(I18N.STRINGS[lang] || {});
  const missing = enKeys.filter(k => !keys.includes(k));
  const extra = keys.filter(k => !enKeys.includes(k));
  ok(!missing.length && !extra.length, `${lang}: same keys as English` + (missing.length ? ` (missing: ${missing.join(', ')})` : '') + (extra.length ? ` (extra: ${extra.join(', ')})` : ''));
  const badVars = enKeys.filter(k => {
    const vars = s => (s.match(/\{\w+\}/g) || []).sort().join();
    return vars(I18N.STRINGS.en[k]) !== vars(I18N.STRINGS[lang][k] || '');
  });
  ok(!badVars.length, `${lang}: placeholders match English` + (badVars.length ? ` (${badVars.join(', ')})` : ''));
}

console.log(fail ? `\n${fail} failure(s)` : '\nAll tests passed');
process.exit(fail ? 1 : 0);
