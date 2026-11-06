// Ausführen mit: node tests/test.js
const { MACHINES, PRESETS } = require('../js/machines.js');
const { Enigma } = require('../js/enigma.js');

let fail = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✔ ' : '  ✘ ') + msg); if (!cond) fail++; };
const isPerm = w => w.length === 26 && new Set(w).size === 26 && /^[A-Z]+$/.test(w);

console.log('Verdrahtungen');
for (const [id, m] of Object.entries(MACHINES)) {
  ok(isPerm(m.etw), `${id}: ETW ist Permutation`);
  for (const [n, r] of Object.entries({ ...m.rotors, ...(m.greek || {}) }))
    ok(isPerm(r.w), `${id}: Walze ${n} ist Permutation`);
  for (const [n, w] of Object.entries(m.reflectors)) {
    const inv = isPerm(w) && [...w].every((c, i) => w.charCodeAt(c.charCodeAt(0) - 65) === 65 + i && c.charCodeAt(0) !== 65 + i);
    ok(inv, `${id}: UKW ${n} ist fixpunktfreie Involution`);
  }
}

console.log('Bekannte Testvektoren');
const e1 = new Enigma(MACHINES.I, { rotors: ['I', 'II', 'III'], reflector: 'B' });
ok(e1.encodeText('AAAAA') === 'BDZGO', 'Enigma I, I-II-III, UKW B, AAA: AAAAA -> BDZGO');

const dbl = new Enigma(MACHINES.I, { rotors: ['I', 'II', 'III'], reflector: 'B', positions: [0, 3, 20] });
dbl.press(0); dbl.press(0); dbl.press(0);
ok(dbl.positions.join() === [1, 5, 23].join(), 'Doppelschritt ADU -> ADV -> AEW -> BFX');

const expected = {
  barbarossa: 'AUFKLXABTEILUNGXVONXKURTINOWAXKURTINOWAXNORDWESTLXSEBEZXSEBEZXUAFFLIEGERSTRASZERIQTUNGXDUBROWKIXDUBROWKIXOPOTSCHKAXOPOTSCHKAXUMXEINSAQTDREINULLXUHRANGETRETENXANGRIFFXINFXRGTX',
  u534: 'VONVONJLOOKSJHFFTTTEINSEINSDREIZWOYYQNNSNEUNINHALTXXBEIANGRIFFUNTERWASSERGEDRUECKTYWABOSXLETZTERGEGNERSTANDNULACHTDREINULUHRMARQUANTONJOTANEUNACHTSEYHSDREIYZWOZWONULGRADYACHTSMYSTOSSENACHXEKNSVIERMBFAELLTYNNNNNNOOOVIERYSICHTEINSNULL'
};
for (const p of PRESETS) {
  const out = new Enigma(MACHINES[p.machine], p.cfg).encodeText(p.text);
  ok(out === expected[p.id], `${p.title}`);
  if (out !== expected[p.id]) console.log('    ' + out.slice(0, 60));
}

console.log('Reziprozität aller Modelle');
for (const [id, m] of Object.entries(MACHINES)) {
  const cfg = { rotors: m.defaults.rotors, greek: m.defaults.greek, reflector: m.defaults.reflector,
    positions: [3, 17, 25, 8].slice(0, m.slots + (m.greek ? 1 : 0)), rings: [5, 1, 9, 2].slice(0, m.slots + (m.greek ? 1 : 0)),
    reflectorPos: 7, plugs: 'AQ WE RT' };
  const plain = 'DIESISTEINLANGERTESTTEXTDERVIELESCHRITTEAUSLOESTUNDALLEWALZENDREHT'.repeat(10);
  const c = new Enigma(m, cfg).encodeText(plain);
  const back = new Enigma(m, cfg).encodeText(c);
  ok(back === plain && [...c].every((ch, i) => ch !== plain[i]), `${id}: entschlüsselt korrekt, kein Buchstabe auf sich selbst`);
}

console.log(fail ? `\n${fail} Fehler` : '\nAlle Tests bestanden');
process.exit(fail ? 1 : 0);
