/*
 * Modelldaten aller simulierten Enigma-Varianten.
 * Quellen: Crypto Museum (cryptomuseum.com), Wikipedia "Enigma rotor details",
 * Tony Sale / Bletchley Park. Notches = Buchstabe im Fenster, bei dem die
 * nächste Walze beim folgenden Tastendruck mitgenommen wird.
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
      user: 'Heer & Luftwaffe',
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
      info: 'Die Standardmaschine der Wehrmacht. Drei aus fünf Walzen, Umkehrwalze B (ab 1937), Steckerbrett mit meist zehn Kabeln. Die Walzenringe tragen Zahlen 01–26 statt Buchstaben.'
    },
    M3: {
      name: 'Enigma M3',
      year: '1934',
      user: 'Kriegsmarine',
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
      info: 'Marine-Variante der Enigma I, kompatibel zu ihr. Drei aus acht Walzen; die Marine-Walzen VI–VIII haben zwei Übertragskerben (Z und M).'
    },
    M4: {
      name: 'Enigma M4',
      year: '1942',
      user: 'Kriegsmarine (U-Boote)',
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
      info: 'Vierwalzen-Enigma der U-Boot-Flotte (Schlüsselnetz „Triton“). Die vierte Walze (Beta oder Gamma) steht still und sitzt neben einer dünnen Umkehrwalze. Mit Beta auf A und UKW B dünn verhält sie sich wie eine M3 mit UKW B.'
    },
    Norway: {
      name: 'Enigma „Norenigma“',
      year: '1945',
      user: 'Norwegische Polizei (nach 1945)',
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
      info: 'Nach Kriegsende neu verdrahtete Enigma-I-Maschinen, die der norwegische Polizeisicherheitsdienst weiter nutzte.'
    },
    D: {
      name: 'Enigma D',
      year: '1926',
      user: 'Kommerziell (Chiffriermaschinen AG)',
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
      info: 'Die kommerzielle Enigma, Basis aller späteren Modelle. Kein Steckerbrett, die Eintrittswalze ist in Tastaturreihenfolge (QWERTZ…) verdrahtet, die Umkehrwalze ist einstellbar, bewegt sich aber nicht.'
    },
    K: {
      name: 'Enigma K (Swiss-K)',
      year: '1938',
      user: 'Schweizer Armee, Reichsbahn u. a.',
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
      info: 'Weiterentwicklung der Enigma D mit einstellbarer Umkehrwalze. Die Schweiz ließ ihre Walzen neu verdrahten; simuliert ist die Swiss-K-Verdrahtung.'
    },
    Railway: {
      name: 'Enigma „Rocket“',
      year: '1941',
      user: 'Deutsche Reichsbahn',
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
      info: 'Eine Enigma K mit eigener Verdrahtung für die Reichsbahn. In Bletchley Park als „Rocket“ bezeichnet und gebrochen.'
    },
    T: {
      name: 'Enigma T „Tirpitz“',
      year: '1942',
      user: 'Japanische Marine (Verbindung zur Kriegsmarine)',
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
      info: 'Für die Kommunikation mit Japan gebaut: acht Walzen mit je fünf Kerben, ungewöhnlich verdrahtete Eintrittswalze, kein Steckerbrett.'
    },
    G312: {
      name: 'Enigma G (G-312)',
      year: '1931',
      user: 'Abwehr',
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
      info: 'Zählwerk-Enigma des Geheimdienstes: Zahnradantrieb wie ein Kilometerzähler (kein Doppelschritt), sehr viele Kerben und eine Umkehrwalze, die sich mitdreht. Simuliert ist die Maschine G-312 aus Bletchley Park.'
    },
    G260: {
      name: 'Enigma G (G-260)',
      year: '1931',
      user: 'Abwehr (Argentinien)',
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
      info: 'Weitere Abwehr-Zählwerk-Enigma, eingesetzt für Verbindungen nach Südamerika. Gleiche Mechanik wie G-312, andere Verdrahtung.'
    }
  };

  const PRESETS = [
    {
      id: 'barbarossa',
      title: 'Operation Barbarossa, 7. Juli 1941 (Enigma I)',
      machine: 'I',
      cfg: { rotors: ['II', 'IV', 'V'], reflector: 'B', rings: [1, 20, 11], positions: [1, 11, 0], plugs: 'AV BS CG DL FU HZ IN KM OW RX' },
      text: 'EDPUDNRGYSZRCXNUYTPOMRMBOFKTBZREZKMLXLVEFGUEYSIOZVEQMIKUBPMMYLKLTTDEISMDICAGYKUACTCDOMOHWXMUUIAUBSTSLRNBZSZWNRFXWFYSSXJZVIJHIDISHPRKLKAYUPADTXQSPINQMATLPIFSVKDASCTACDPBOPVHJK'
    },
    {
      id: 'u534',
      title: 'U-534, Mai 1945 (Enigma M4)',
      machine: 'M4',
      cfg: { greek: 'Beta', rotors: ['II', 'IV', 'I'], reflector: 'B dünn', rings: [0, 0, 0, 21], positions: [21, 9, 13, 0], plugs: 'AT BL DF GJ HM NW OP QY RZ VX' },
      text: 'NCZWVUSXPNYMINHZXMQXSFWXWLKJAHSHNMCOCCAKUQPMKCSMHKSEINJUSBLKIOSXCKUBHMLLXCSJUSRRDVKOHULXWCCBGVLIYXEOAHXRHKKFVDREWEZLXOBAFGYUJQUKGRTVUKAMEURBVEKSUHHVOYHABCJWMAKLFKLMYFVNRIZRVVRTKOFDANJMOLBGFFLEOPRGTFLVRHOWOPBEKVWMUQFMPWPARMFHAGKXIIBG'
    }
  ];

  const api = { MACHINES, PRESETS, ABC, QWERTZ };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else Object.assign(root, api);
})(typeof window !== 'undefined' ? window : globalThis);
