/*
 * Machine data for all simulated Enigma models.
 * Sources: Crypto Museum (cryptomuseum.com), Wikipedia "Enigma rotor details",
 * Tony Sale / Bletchley Park.
 *   w = rotor wiring (contact A..Z -> letter)
 *   n = notches: the letter in the window at which the next rotor is
 *       carried along on the following key press
 * Descriptions and user groups are translated in js/i18n.js
 * (keys m.<id>.user, m.<id>.info and preset.<id>).
 */
(function (root) {
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const QWERTZ = 'QWERTZUIOASDFGHJKPYXCVBNML';

  const MIL_ROTORS = {
    I:    { w: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', n: 'Q' },
    II:   { w: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', n: 'E' },
    III:  { w: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', n: 'V' },
    IV:   { w: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', n: 'J' },
    V:    { w: 'VZBRGITYUPSDNHLXAWMJQOFECK', n: 'Z' },
    VI:   { w: 'JPGVOUMFYQBENHZRDKASXLICTW', n: 'ZM' },
    VII:  { w: 'NZJHGRCXMYSWBOUFAIVLPEKQDT', n: 'ZM' },
    VIII: { w: 'FKQHTLXOCBJSPDZRAMEWNIUYGV', n: 'ZM' }
  };
  const pick = (obj, keys) => Object.fromEntries(keys.map(k => [k, obj[k]]));

  const MACHINES = {
    I: {
      name: 'Enigma I',
      year: '1932',
      etw: ABC,
      rotors: pick(MIL_ROTORS, ['I', 'II', 'III', 'IV', 'V']),
      reflectors: {
        A: 'EJMZALYXVBWFCRQUONTSPIKHGD',
        B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
        C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'
      },
      slots: 3,
      plugboard: true,
      stepping: 'lever',
      display: 'numbers',
      reflectorSettable: false,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'B' },
    },
    M3: {
      name: 'Enigma M3',
      year: '1934',
      etw: ABC,
      rotors: pick(MIL_ROTORS, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']),
      reflectors: {
        B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
        C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL'
      },
      slots: 3,
      plugboard: true,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: false,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'B' },
    },
    M4: {
      name: 'Enigma M4',
      year: '1942',
      etw: ABC,
      rotors: pick(MIL_ROTORS, ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']),
      greek: {
        Beta:  { w: 'LEYJVCNIXWPBQMDRTAKZGFUHOS', n: '' },
        Gamma: { w: 'FSOKANUERHMBTIYCWLQPZXVGJD', n: '' }
      },
      reflectors: {
        'B dünn': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
        'C dünn': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'
      },
      slots: 3,
      plugboard: true,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: false,
      defaults: { rotors: ['I', 'II', 'III'], greek: 'Beta', reflector: 'B dünn' },
    },
    Norway: {
      name: 'Enigma “Norenigma”',
      year: '1945',
      etw: ABC,
      rotors: {
        I:   { w: 'WTOKASUYVRBXJHQCPZEFMDINLG', n: 'Q' },
        II:  { w: 'GJLPUBSWEMCTQVHXAOFZDRKYNI', n: 'E' },
        III: { w: 'JWFMHNBPUSDYTIXVZGRQLAOEKC', n: 'V' },
        IV:  { w: 'FGZJMVXEPBWSHQTLIUDYKCNRAO', n: 'J' },
        V:   { w: 'HEJXQOTZBVFDASCILWPGYNMURK', n: 'Z' }
      },
      reflectors: { UKW: 'MOWJYPUXNDSRAIBFVLKZGQCHET' },
      slots: 3,
      plugboard: true,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: false,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    D: {
      name: 'Enigma D',
      year: '1926',
      etw: QWERTZ,
      rotors: {
        I:   { w: 'LPGSZMHAEOQKVXRFYBUTNICJDW', n: 'Y' },
        II:  { w: 'SLVGBTFXJQOHEWIRZYAMKPCNDU', n: 'E' },
        III: { w: 'CJGDPSHKTURAWZXFMYNQOBVLIE', n: 'N' }
      },
      reflectors: { UKW: 'IMETCGFRAYSQBZXWLHKDVUPOJN' },
      slots: 3,
      plugboard: false,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    K: {
      name: 'Enigma K (Swiss-K)',
      year: '1938',
      etw: QWERTZ,
      rotors: {
        I:   { w: 'PEZUOHXSCVFMTBGLRINQJWAYDK', n: 'Y' },
        II:  { w: 'ZOUESYDKFWPCIQXHMVBLGNJRAT', n: 'E' },
        III: { w: 'EHRVXGAOBQUSIMZFLYNWKTPDJC', n: 'N' }
      },
      reflectors: { UKW: 'IMETCGFRAYSQBZXWLHKDVUPOJN' },
      slots: 3,
      plugboard: false,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    Railway: {
      name: 'Enigma “Rocket”',
      year: '1941',
      etw: QWERTZ,
      rotors: {
        I:   { w: 'JGDQOXUSCAMIFRVTPNEWKBLZYH', n: 'N' },
        II:  { w: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ', n: 'E' },
        III: { w: 'JVIUBHTCDYAKEQZPOSGXNRMWFL', n: 'Y' }
      },
      reflectors: { UKW: 'QYHOGNECVPUZTFDJAXWMKISRBL' },
      slots: 3,
      plugboard: false,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    T: {
      name: 'Enigma T “Tirpitz”',
      year: '1942',
      etw: 'KZROUQHYAIGBLWVSTDXFPNMCJE',
      rotors: {
        I:    { w: 'KPTYUELOCVGRFQDANJMBSWHZXI', n: 'WZEKQ' },
        II:   { w: 'UPHZLWEQMTDJXCAKSOIGVBYFNR', n: 'WZFLR' },
        III:  { w: 'QUDLYRFEKONVZAXWHMGPJBSICT', n: 'WZEKQ' },
        IV:   { w: 'CIWTBKXNRESPFLYDAGVHQUOJZM', n: 'WZFLR' },
        V:    { w: 'UAXGISNJBVERDYLFZWTPCKOHMQ', n: 'YCFKR' },
        VI:   { w: 'XFUZGALVHCNYSEWQTDMRBKPIOJ', n: 'XEIMQ' },
        VII:  { w: 'BJVFTXPLNAYOZIKWGDQERUCHSM', n: 'YCFKR' },
        VIII: { w: 'YMTPNZHWKODAJXELUQVGCBISFR', n: 'XEIMQ' }
      },
      reflectors: { UKW: 'GEKPBTAUMOCNILJDXZYFHWVQSR' },
      slots: 3,
      plugboard: false,
      stepping: 'lever',
      display: 'letters',
      reflectorSettable: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    G312: {
      name: 'Enigma G (G-312)',
      year: '1931',
      etw: QWERTZ,
      rotors: {
        I:   { w: 'DMTWSILRUYQNKFEJCAZBPGXOHV', n: 'SUVWZABCEFGIKLOPQ' },
        II:  { w: 'HQZGPJTMOBLNCIFDYAWVEUSRKX', n: 'STVYZACDFGHKMNQ' },
        III: { w: 'UQNTLSZFMREHDPXKIBVYGJCWOA', n: 'UWXAEFHKMNR' }
      },
      reflectors: { UKW: 'RULQMZJSYGOCETKWDAHNBXPVIF' },
      slots: 3,
      plugboard: false,
      stepping: 'gear',
      display: 'letters',
      reflectorSettable: true,
      reflectorSteps: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    },
    G260: {
      name: 'Enigma G (G-260)',
      year: '1931',
      etw: QWERTZ,
      rotors: {
        I:   { w: 'RCSPBLKQAUMHWYTIFZVGOJNEXD', n: 'SUVWZABCEFGIKLOPQ' },
        II:  { w: 'WCMIBVPJXAROSGNDLZKEYHUFQT', n: 'STVYZACDFGHKMNQ' },
        III: { w: 'FVDHZELSQMAXOKYIWPGCBUJTNR', n: 'UWXAEFHKMNR' }
      },
      reflectors: { UKW: 'IMETCGFRAYSQBZXWLHKDVUPOJN' },
      slots: 3,
      plugboard: false,
      stepping: 'gear',
      display: 'letters',
      reflectorSettable: true,
      reflectorSteps: true,
      defaults: { rotors: ['I', 'II', 'III'], reflector: 'UKW' },
    }
  };

  const PRESETS = [
    {
      id: 'barbarossa',
      machine: 'I',
      cfg: { rotors: ['II', 'IV', 'V'], reflector: 'B', rings: [1, 20, 11], positions: [1, 11, 0], plugs: 'AV BS CG DL FU HZ IN KM OW RX' },
      text: 'EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK'
    },
    {
      id: 'u534',
      machine: 'M4',
      cfg: { greek: 'Beta', rotors: ['II', 'IV', 'I'], reflector: 'B dünn', rings: [0, 0, 0, 21], positions: [21, 9, 13, 0], plugs: 'AT BL DF GJ HM NW OP QY RZ VX' },
      text: 'NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG'
    }
  ];

  const api = { MACHINES, PRESETS, ABC, QWERTZ };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof window !== 'undefined' ? window : globalThis);
