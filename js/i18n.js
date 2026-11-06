/*
 * User interface translations.
 * Every language must define the same keys as English (checked by tests/test.js).
 * Placeholders in curly braces, e.g. {n}, are filled in by t(key, vars).
 */
(function (root) {
  const LANGS = { en: 'English', es: 'Español', fr: 'Français', pt: 'Português', de: 'Deutsch' };

  const SOURCE = {
    en: {
      ui: {
        seeThrough: 'See-through', seeThroughTitle: 'Show the inside of the machine and the path of the current',
        speed: 'Speed', stepMode: 'Step by step', next: 'Next', forward: 'Forward path', backward: 'Return path',
        stPrompt: 'Press a key to follow the current through the machine.',
        stKey: 'Key {k} pressed: first the rotors step on (windows {w}).',
        stPlug: 'Plugboard: the cable swaps {a} for {b}.', stPlugNone: 'Plugboard: {a} is not plugged and passes straight through.',
        stEtwIn: 'Entry wheel: the current enters the rotors at contact {a}.',
        stRotor: 'Rotor {r} (position {p}): {a} becomes {b}.', stRefl: 'The reflector sends the current back: {a} becomes {b}.',
        stRotorBack: 'Back through rotor {r}: {a} becomes {b}.', stEtwOut: 'Entry wheel: the current leaves the rotors towards letter {a}.',
        stLamp: 'Lamp {b} lights up: {a} has been encrypted as {b}.',
        brand: 'Cipher Machine', model: 'Model', language: 'Language',
        settings: 'Key', settingsTitle: 'Set the key', aboutModel: 'About this model', install: 'Install',
        machineAria: 'Enigma machine', rotorsAria: 'Rotors', plugboard: 'Plugboard (Steckerbrett)',
        message: 'Message', chars: '{n} characters', tapeIn: 'Plaintext / input', tapeOut: 'Output (lamps)',
        undo: '↶ Undo', undoTitle: 'Undo the last keystroke', copy: 'Copy', clear: 'New sheet',
        bulkSummary: 'Paste text and run it through', bulkPlaceholder: 'Paste plaintext or ciphertext… (German umlauts become AE/OE/UE)',
        bulkRun: 'Run through the machine', traceSummary: 'Current path of the last letter', tracePrompt: 'Press a key…',
        dailyKey: 'Daily key (Tagesschlüssel)', historic: 'Historic messages', options: 'Options',
        optSound: 'Key sound', optGroups: 'Output in groups of five', done: 'Done',
        operation: 'How to use', close: 'Close',
        help1: 'Type on your keyboard or tap the keys of the machine. The lamp stays lit while the key is held down.',
        help2: 'Turn the rotors with the thumbwheels: tap the upper or lower half, or use the mouse wheel.',
        help3: 'Plugboard: tap two sockets one after the other to connect them; tap one again to remove the cable.',
        help4: 'To decrypt, set the machine to the same key and type in the ciphertext.',
        sourceCode: 'Source code on GitHub', mitLicense: 'MIT License', dataSources: 'Wiring data from the Crypto Museum and Wikipedia.',
        turnRotor: 'Turn rotor {name}', keyAria: 'Key {k}', socketAria: 'Socket {k}',
        trKey: 'Key', trPlug: 'Plug', trEtw: 'Entry', trRefl: 'Refl.', trLamp: 'Lamp',
        allCables: 'All 13 cables are already plugged in.',
        presetLoaded: 'Key set and ciphertext inserted. Now press “Run through the machine”.',
        copied: 'Output copied.', copyFail: 'Copying is not possible.', noLetters: 'No letters A–Z in the text.',
        processed: '{n} characters processed.', nothingUndo: 'Nothing to undo.',
        reflector: 'Reflector (Umkehrwalze)', position: 'Position {l}',
        rotorOrder: 'Rotor order (Walzenlage), left to right', ringSetting: 'Ring setting (Ringstellung)',
        startPos: 'Start position (Grundstellung)', plugConnections: 'Plugboard pairs (Steckerverbindungen)',
        plugPlaceholder: 'e.g. AV BS CG DL FU', resetDefault: 'Reset to defaults',
        since: 'from', rotorsN: '{n} rotors', plusGreek: '+ extra rotor', withPlug: 'with plugboard', noPlug: 'no plugboard',
        gearDrive: 'gear drive', leverDrive: 'pawl stepping'
      },
      machines: {
        I: ['Army & Air Force', 'The standard machine of the Wehrmacht. Three of five rotors, reflector B (from 1937) and a plugboard, usually with ten cables. The rotor rings carry the numbers 01–26 instead of letters.'],
        M3: ['Kriegsmarine (navy)', 'Navy version of the Enigma I and compatible with it. Three of eight rotors; the navy rotors VI–VIII have two turnover notches (Z and M).'],
        M4: ['Kriegsmarine (U-boats)', 'Four-rotor Enigma of the U-boat fleet (key net “Triton”). The fourth rotor (Beta or Gamma) never moves and sits next to a thin reflector. With Beta at A and reflector B thin it behaves like an M3 with reflector B.'],
        Norway: ['Norwegian police (after 1945)', 'Enigma I machines that were rewired after the war and used by the Norwegian police security service.'],
        D: ['Commercial (Chiffriermaschinen AG)', 'The commercial Enigma on which all later models were based. No plugboard; the entry wheel is wired in keyboard order (QWERTZ…) and the reflector can be set but does not move.'],
        K: ['Swiss Army, Reichsbahn and others', 'A development of the Enigma D with a settable reflector. Switzerland had its rotors rewired; the Swiss-K wiring is simulated here.'],
        Railway: ['German railways (Reichsbahn)', 'An Enigma K with its own wiring for the German railways. Bletchley Park called it “Rocket” and broke it.'],
        T: ['Japanese navy (link to the Kriegsmarine)', 'Built for communication with Japan: eight rotors with five notches each, an unusually wired entry wheel and no plugboard.'],
        G312: ['Abwehr (military intelligence)', 'The counter Enigma of the intelligence service: gear-driven like an odometer (no double step), with many notches and a reflector that turns as well. The simulated machine is G-312 from Bletchley Park.'],
        G260: ['Abwehr (Argentina)', 'Another Abwehr counter Enigma, used for links to South America. Same mechanism as G-312, different wiring.']
      },
      presets: { barbarossa: 'Operation Barbarossa, 7 July 1941 (Enigma I)', u534: 'U-534, May 1945 (Enigma M4)' }
    },

    es: {
      ui: {
        seeThrough: 'Vista interior', seeThroughTitle: 'Mostrar el interior de la máquina y el recorrido de la corriente',
        speed: 'Velocidad', stepMode: 'Paso a paso', next: 'Siguiente', forward: 'Ida', backward: 'Vuelta',
        stPrompt: 'Pulsa una tecla para seguir la corriente a través de la máquina.',
        stKey: 'Tecla {k} pulsada: primero avanzan los rotores (ventanas {w}).',
        stPlug: 'Panel de conexiones: el cable cambia {a} por {b}.', stPlugNone: 'Panel de conexiones: {a} no está conectada y pasa sin cambios.',
        stEtwIn: 'Rotor de entrada: la corriente entra en los rotores por el contacto {a}.',
        stRotor: 'Rotor {r} (posición {p}): {a} se convierte en {b}.', stRefl: 'El reflector devuelve la corriente: {a} se convierte en {b}.',
        stRotorBack: 'De vuelta por el rotor {r}: {a} se convierte en {b}.', stEtwOut: 'Rotor de entrada: la corriente sale de los rotores hacia la letra {a}.',
        stLamp: 'Se enciende la lámpara {b}: {a} se ha cifrado como {b}.',
        brand: 'Máquina de cifrado', model: 'Modelo', language: 'Idioma',
        settings: 'Clave', settingsTitle: 'Configurar la clave', aboutModel: 'Acerca de este modelo', install: 'Instalar',
        machineAria: 'Máquina Enigma', rotorsAria: 'Rotores', plugboard: 'Panel de conexiones (Steckerbrett)',
        message: 'Mensaje', chars: '{n} caracteres', tapeIn: 'Texto claro / entrada', tapeOut: 'Salida (lámparas)',
        undo: '↶ Deshacer', undoTitle: 'Deshacer la última pulsación', copy: 'Copiar', clear: 'Hoja nueva',
        bulkSummary: 'Pegar un texto y procesarlo', bulkPlaceholder: 'Pega aquí un texto claro o cifrado… (las diéresis alemanas se convierten en AE/OE/UE)',
        bulkRun: 'Pasar por la máquina', traceSummary: 'Recorrido de la corriente de la última letra', tracePrompt: 'Pulsa una tecla…',
        dailyKey: 'Clave del día (Tagesschlüssel)', historic: 'Mensajes históricos', options: 'Opciones',
        optSound: 'Sonido de las teclas', optGroups: 'Salida en grupos de cinco', done: 'Listo',
        operation: 'Cómo se usa', close: 'Cerrar',
        help1: 'Escribe con tu teclado o pulsa las teclas de la máquina. La lámpara se enciende mientras la tecla está pulsada.',
        help2: 'Gira los rotores con las ruedas moleteadas: toca la mitad superior o inferior, o usa la rueda del ratón.',
        help3: 'Panel de conexiones: toca dos conectores seguidos para unirlos; vuelve a tocar uno para quitar el cable.',
        help4: 'Para descifrar, ajusta la máquina a la misma clave y escribe el texto cifrado.',
        sourceCode: 'Código fuente en GitHub', mitLicense: 'Licencia MIT', dataSources: 'Datos de cableado según el Crypto Museum y Wikipedia.',
        turnRotor: 'Girar el rotor {name}', keyAria: 'Tecla {k}', socketAria: 'Conector {k}',
        trKey: 'Tecla', trPlug: 'Panel', trEtw: 'Entrada', trRefl: 'Refl.', trLamp: 'Lámpara',
        allCables: 'Los 13 cables ya están conectados.',
        presetLoaded: 'Clave configurada y texto cifrado insertado. Ahora pulsa «Pasar por la máquina».',
        copied: 'Salida copiada.', copyFail: 'No se ha podido copiar.', noLetters: 'El texto no contiene letras A–Z.',
        processed: '{n} caracteres procesados.', nothingUndo: 'No hay nada que deshacer.',
        reflector: 'Reflector (Umkehrwalze)', position: 'Posición {l}',
        rotorOrder: 'Orden de los rotores (Walzenlage), de izquierda a derecha', ringSetting: 'Posición de los anillos (Ringstellung)',
        startPos: 'Posición inicial (Grundstellung)', plugConnections: 'Conexiones del panel (Steckerverbindungen)',
        plugPlaceholder: 'p. ej. AV BS CG DL FU', resetDefault: 'Restablecer valores predeterminados',
        since: 'desde', rotorsN: '{n} rotores', plusGreek: '+ rotor adicional', withPlug: 'con panel de conexiones', noPlug: 'sin panel de conexiones',
        gearDrive: 'accionamiento por engranajes', leverDrive: 'avance por trinquetes'
      },
      machines: {
        I: ['Ejército de Tierra y Luftwaffe', 'La máquina estándar de la Wehrmacht. Tres de cinco rotores, reflector B (desde 1937) y panel de conexiones, normalmente con diez cables. Los anillos de los rotores llevan números del 01 al 26 en lugar de letras.'],
        M3: ['Kriegsmarine (Armada)', 'Versión naval de la Enigma I y compatible con ella. Tres de ocho rotores; los rotores navales VI–VIII tienen dos muescas de arrastre (Z y M).'],
        M4: ['Kriegsmarine (submarinos)', 'Enigma de cuatro rotores de la flota submarina (red de claves «Triton»). El cuarto rotor (Beta o Gamma) no gira y está junto a un reflector fino. Con Beta en A y el reflector B fino se comporta como una M3 con reflector B.'],
        Norway: ['Policía noruega (después de 1945)', 'Máquinas Enigma I recableadas tras la guerra y utilizadas por el servicio de seguridad de la policía noruega.'],
        D: ['Comercial (Chiffriermaschinen AG)', 'La Enigma comercial, base de todos los modelos posteriores. Sin panel de conexiones; el rotor de entrada está cableado en el orden del teclado (QWERTZ…) y el reflector se puede ajustar, pero no gira.'],
        K: ['Ejército suizo, Reichsbahn y otros', 'Evolución de la Enigma D con reflector ajustable. Suiza hizo recablear sus rotores; aquí se simula el cableado Swiss-K.'],
        Railway: ['Ferrocarriles alemanes (Reichsbahn)', 'Una Enigma K con cableado propio para los ferrocarriles alemanes. En Bletchley Park la llamaban «Rocket» y lograron descifrarla.'],
        T: ['Armada japonesa (enlace con la Kriegsmarine)', 'Construida para comunicarse con Japón: ocho rotores con cinco muescas cada uno, un rotor de entrada con un cableado poco habitual y sin panel de conexiones.'],
        G312: ['Abwehr (inteligencia militar)', 'La Enigma con contador del servicio de inteligencia: accionada por engranajes como un cuentakilómetros (sin doble paso), con muchas muescas y un reflector que también gira. Se simula la máquina G-312 de Bletchley Park.'],
        G260: ['Abwehr (Argentina)', 'Otra Enigma con contador de la Abwehr, usada para enlaces con Sudamérica. Mismo mecanismo que la G-312, distinto cableado.']
      },
      presets: { barbarossa: 'Operación Barbarroja, 7 de julio de 1941 (Enigma I)', u534: 'U-534, mayo de 1945 (Enigma M4)' }
    },

    fr: {
      ui: {
        seeThrough: 'Vue intérieure', seeThroughTitle: 'Montrer l’intérieur de la machine et le trajet du courant',
        speed: 'Vitesse', stepMode: 'Pas à pas', next: 'Suivant', forward: 'Aller', backward: 'Retour',
        stPrompt: 'Appuyez sur une touche pour suivre le courant à travers la machine.',
        stKey: 'Touche {k} enfoncée : les rotors avancent d’abord (fenêtres {w}).',
        stPlug: 'Tableau de connexions : le câble échange {a} contre {b}.', stPlugNone: 'Tableau de connexions : {a} n’est pas branchée et passe sans changement.',
        stEtwIn: 'Rotor d’entrée : le courant entre dans les rotors par le contact {a}.',
        stRotor: 'Rotor {r} (position {p}) : {a} devient {b}.', stRefl: 'Le réflecteur renvoie le courant : {a} devient {b}.',
        stRotorBack: 'Retour par le rotor {r} : {a} devient {b}.', stEtwOut: 'Rotor d’entrée : le courant quitte les rotors vers la lettre {a}.',
        stLamp: 'La lampe {b} s’allume : {a} a été chiffrée en {b}.',
        brand: 'Machine à chiffrer', model: 'Modèle', language: 'Langue',
        settings: 'Clé', settingsTitle: 'Régler la clé', aboutModel: 'À propos de ce modèle', install: 'Installer',
        machineAria: 'Machine Enigma', rotorsAria: 'Rotors', plugboard: 'Tableau de connexions (Steckerbrett)',
        message: 'Message', chars: '{n} caractères', tapeIn: 'Texte clair / saisie', tapeOut: 'Sortie (lampes)',
        undo: '↶ Annuler', undoTitle: 'Annuler la dernière frappe', copy: 'Copier', clear: 'Nouvelle feuille',
        bulkSummary: 'Coller un texte et le traiter', bulkPlaceholder: 'Collez un texte clair ou chiffré… (les trémas allemands deviennent AE/OE/UE)',
        bulkRun: 'Passer dans la machine', traceSummary: 'Trajet du courant de la dernière lettre', tracePrompt: 'Appuyez sur une touche…',
        dailyKey: 'Clé du jour (Tagesschlüssel)', historic: 'Messages historiques', options: 'Options',
        optSound: 'Bruit des touches', optGroups: 'Sortie par groupes de cinq', done: 'Terminé',
        operation: 'Mode d’emploi', close: 'Fermer',
        help1: 'Tapez au clavier ou appuyez sur les touches de la machine. La lampe reste allumée tant que la touche est enfoncée.',
        help2: 'Tournez les rotors avec les molettes : touchez la moitié supérieure ou inférieure, ou utilisez la molette de la souris.',
        help3: 'Tableau de connexions : touchez deux prises l’une après l’autre pour les relier ; touchez-en une à nouveau pour retirer le câble.',
        help4: 'Pour déchiffrer, réglez la machine sur la même clé et tapez le texte chiffré.',
        sourceCode: 'Code source sur GitHub', mitLicense: 'Licence MIT', dataSources: 'Données de câblage d’après le Crypto Museum et Wikipédia.',
        turnRotor: 'Tourner le rotor {name}', keyAria: 'Touche {k}', socketAria: 'Prise {k}',
        trKey: 'Touche', trPlug: 'Fiches', trEtw: 'Entrée', trRefl: 'Réfl.', trLamp: 'Lampe',
        allCables: 'Les 13 câbles sont déjà branchés.',
        presetLoaded: 'Clé réglée et texte chiffré inséré. Appuyez maintenant sur « Passer dans la machine ».',
        copied: 'Sortie copiée.', copyFail: 'Impossible de copier.', noLetters: 'Le texte ne contient aucune lettre A–Z.',
        processed: '{n} caractères traités.', nothingUndo: 'Rien à annuler.',
        reflector: 'Réflecteur (Umkehrwalze)', position: 'Position {l}',
        rotorOrder: 'Ordre des rotors (Walzenlage), de gauche à droite', ringSetting: 'Position des anneaux (Ringstellung)',
        startPos: 'Position initiale (Grundstellung)', plugConnections: 'Connexions du tableau (Steckerverbindungen)',
        plugPlaceholder: 'p. ex. AV BS CG DL FU', resetDefault: 'Rétablir les valeurs par défaut',
        since: 'à partir de', rotorsN: '{n} rotors', plusGreek: '+ rotor supplémentaire', withPlug: 'avec tableau de connexions', noPlug: 'sans tableau de connexions',
        gearDrive: 'entraînement par engrenages', leverDrive: 'avance par cliquets'
      },
      machines: {
        I: ['Armée de terre et Luftwaffe', 'La machine standard de la Wehrmacht. Trois rotors sur cinq, réflecteur B (à partir de 1937) et tableau de connexions, généralement avec dix câbles. Les anneaux des rotors portent les nombres 01 à 26 au lieu de lettres.'],
        M3: ['Kriegsmarine (marine)', 'Version navale de l’Enigma I, compatible avec elle. Trois rotors sur huit ; les rotors de la marine VI à VIII ont deux encoches d’entraînement (Z et M).'],
        M4: ['Kriegsmarine (sous-marins)', 'Enigma à quatre rotors de la flotte sous-marine (réseau de clés « Triton »). Le quatrième rotor (Beta ou Gamma) reste immobile, à côté d’un réflecteur mince. Avec Beta sur A et le réflecteur B mince, elle se comporte comme une M3 avec réflecteur B.'],
        Norway: ['Police norvégienne (après 1945)', 'Machines Enigma I recâblées après la guerre et utilisées par le service de sécurité de la police norvégienne.'],
        D: ['Commerciale (Chiffriermaschinen AG)', 'L’Enigma commerciale, base de tous les modèles ultérieurs. Pas de tableau de connexions ; le rotor d’entrée est câblé dans l’ordre du clavier (QWERTZ…) et le réflecteur est réglable mais ne tourne pas.'],
        K: ['Armée suisse, Reichsbahn et autres', 'Évolution de l’Enigma D avec réflecteur réglable. La Suisse a fait recâbler ses rotors ; c’est le câblage Swiss-K qui est simulé ici.'],
        Railway: ['Chemins de fer allemands (Reichsbahn)', 'Une Enigma K au câblage propre aux chemins de fer allemands. Bletchley Park l’appelait « Rocket » et l’a cassée.'],
        T: ['Marine japonaise (liaison avec la Kriegsmarine)', 'Construite pour communiquer avec le Japon : huit rotors à cinq encoches chacun, un rotor d’entrée au câblage inhabituel et pas de tableau de connexions.'],
        G312: ['Abwehr (renseignement militaire)', 'L’Enigma à compteur du service de renseignement : entraînée par engrenages comme un compteur kilométrique (pas de double pas), avec de nombreuses encoches et un réflecteur qui tourne lui aussi. La machine simulée est la G-312 de Bletchley Park.'],
        G260: ['Abwehr (Argentine)', 'Une autre Enigma à compteur de l’Abwehr, utilisée pour les liaisons avec l’Amérique du Sud. Même mécanisme que la G-312, câblage différent.']
      },
      presets: { barbarossa: 'Opération Barbarossa, 7 juillet 1941 (Enigma I)', u534: 'U-534, mai 1945 (Enigma M4)' }
    },

    pt: {
      ui: {
        seeThrough: 'Vista interna', seeThroughTitle: 'Mostrar o interior da máquina e o percurso da corrente',
        speed: 'Velocidade', stepMode: 'Passo a passo', next: 'Próximo', forward: 'Ida', backward: 'Volta',
        stPrompt: 'Pressione uma tecla para acompanhar a corrente pela máquina.',
        stKey: 'Tecla {k} pressionada: primeiro os rotores avançam (janelas {w}).',
        stPlug: 'Painel de conexões: o cabo troca {a} por {b}.', stPlugNone: 'Painel de conexões: {a} não está ligada e passa sem alteração.',
        stEtwIn: 'Rotor de entrada: a corrente entra nos rotores pelo contato {a}.',
        stRotor: 'Rotor {r} (posição {p}): {a} vira {b}.', stRefl: 'O refletor manda a corrente de volta: {a} vira {b}.',
        stRotorBack: 'De volta pelo rotor {r}: {a} vira {b}.', stEtwOut: 'Rotor de entrada: a corrente sai dos rotores para a letra {a}.',
        stLamp: 'A lâmpada {b} acende: {a} foi cifrada como {b}.',
        brand: 'Máquina de cifra', model: 'Modelo', language: 'Idioma',
        settings: 'Chave', settingsTitle: 'Configurar a chave', aboutModel: 'Sobre este modelo', install: 'Instalar',
        machineAria: 'Máquina Enigma', rotorsAria: 'Rotores', plugboard: 'Painel de conexões (Steckerbrett)',
        message: 'Mensagem', chars: '{n} caracteres', tapeIn: 'Texto claro / entrada', tapeOut: 'Saída (lâmpadas)',
        undo: '↶ Desfazer', undoTitle: 'Desfazer o último toque', copy: 'Copiar', clear: 'Folha nova',
        bulkSummary: 'Colar um texto e processá-lo', bulkPlaceholder: 'Cole aqui um texto claro ou cifrado… (tremas alemães viram AE/OE/UE)',
        bulkRun: 'Passar pela máquina', traceSummary: 'Percurso da corrente da última letra', tracePrompt: 'Pressione uma tecla…',
        dailyKey: 'Chave do dia (Tagesschlüssel)', historic: 'Mensagens históricas', options: 'Opções',
        optSound: 'Som das teclas', optGroups: 'Saída em grupos de cinco', done: 'Concluído',
        operation: 'Como usar', close: 'Fechar',
        help1: 'Digite no teclado ou toque nas teclas da máquina. A lâmpada fica acesa enquanto a tecla estiver pressionada.',
        help2: 'Gire os rotores com as rodas serrilhadas: toque na metade de cima ou de baixo, ou use a roda do mouse.',
        help3: 'Painel de conexões: toque em duas tomadas seguidas para ligá-las; toque de novo em uma delas para retirar o cabo.',
        help4: 'Para decifrar, ajuste a máquina para a mesma chave e digite o texto cifrado.',
        sourceCode: 'Código-fonte no GitHub', mitLicense: 'Licença MIT', dataSources: 'Dados das ligações dos rotores segundo o Crypto Museum e a Wikipédia.',
        turnRotor: 'Girar o rotor {name}', keyAria: 'Tecla {k}', socketAria: 'Tomada {k}',
        trKey: 'Tecla', trPlug: 'Painel', trEtw: 'Entrada', trRefl: 'Refl.', trLamp: 'Lâmpada',
        allCables: 'Os 13 cabos já estão ligados.',
        presetLoaded: 'Chave configurada e texto cifrado inserido. Agora toque em “Passar pela máquina”.',
        copied: 'Saída copiada.', copyFail: 'Não foi possível copiar.', noLetters: 'O texto não tem letras A–Z.',
        processed: '{n} caracteres processados.', nothingUndo: 'Nada para desfazer.',
        reflector: 'Refletor (Umkehrwalze)', position: 'Posição {l}',
        rotorOrder: 'Ordem dos rotores (Walzenlage), da esquerda para a direita', ringSetting: 'Posição dos anéis (Ringstellung)',
        startPos: 'Posição inicial (Grundstellung)', plugConnections: 'Ligações do painel (Steckerverbindungen)',
        plugPlaceholder: 'p. ex. AV BS CG DL FU', resetDefault: 'Restaurar valores padrão',
        since: 'desde', rotorsN: '{n} rotores', plusGreek: '+ rotor adicional', withPlug: 'com painel de conexões', noPlug: 'sem painel de conexões',
        gearDrive: 'acionamento por engrenagens', leverDrive: 'avanço por linguetas'
      },
      machines: {
        I: ['Exército e Luftwaffe', 'A máquina padrão da Wehrmacht. Três de cinco rotores, refletor B (a partir de 1937) e painel de conexões, normalmente com dez cabos. Os anéis dos rotores têm os números 01 a 26 em vez de letras.'],
        M3: ['Kriegsmarine (marinha)', 'Versão naval da Enigma I e compatível com ela. Três de oito rotores; os rotores navais VI–VIII têm dois entalhes de arrasto (Z e M).'],
        M4: ['Kriegsmarine (submarinos)', 'Enigma de quatro rotores da frota de submarinos (rede de chaves “Triton”). O quarto rotor (Beta ou Gamma) não gira e fica ao lado de um refletor fino. Com Beta em A e o refletor B fino, comporta-se como uma M3 com refletor B.'],
        Norway: ['Polícia norueguesa (após 1945)', 'Máquinas Enigma I religadas depois da guerra e usadas pelo serviço de segurança da polícia norueguesa.'],
        D: ['Comercial (Chiffriermaschinen AG)', 'A Enigma comercial, base de todos os modelos posteriores. Sem painel de conexões; o rotor de entrada segue a ordem do teclado (QWERTZ…) e o refletor é ajustável, mas não gira.'],
        K: ['Exército suíço, Reichsbahn e outros', 'Evolução da Enigma D com refletor ajustável. A Suíça mandou religar os seus rotores; aqui é simulada a ligação Swiss-K.'],
        Railway: ['Ferrovias alemãs (Reichsbahn)', 'Uma Enigma K com ligações próprias para as ferrovias alemãs. Em Bletchley Park era chamada “Rocket” e foi decifrada lá.'],
        T: ['Marinha japonesa (ligação com a Kriegsmarine)', 'Construída para a comunicação com o Japão: oito rotores com cinco entalhes cada, um rotor de entrada com ligações incomuns e sem painel de conexões.'],
        G312: ['Abwehr (serviço de informações militar)', 'A Enigma com contador do serviço de informações: acionada por engrenagens como um conta-quilômetros (sem passo duplo), com muitos entalhes e um refletor que também gira. A máquina simulada é a G-312 de Bletchley Park.'],
        G260: ['Abwehr (Argentina)', 'Outra Enigma com contador da Abwehr, usada em ligações com a América do Sul. Mesmo mecanismo da G-312, ligações diferentes.']
      },
      presets: { barbarossa: 'Operação Barbarossa, 7 de julho de 1941 (Enigma I)', u534: 'U-534, maio de 1945 (Enigma M4)' }
    },

    de: {
      ui: {
        seeThrough: 'Durchsicht', seeThroughTitle: 'Innenleben und Stromweg der Maschine zeigen',
        speed: 'Tempo', stepMode: 'Schritt für Schritt', next: 'Weiter', forward: 'Hinweg', backward: 'Rückweg',
        stPrompt: 'Taste drücken, um dem Strom durch die Maschine zu folgen.',
        stKey: 'Taste {k} gedrückt: zuerst drehen sich die Walzen weiter (Fenster {w}).',
        stPlug: 'Steckerbrett: das Kabel tauscht {a} gegen {b}.', stPlugNone: 'Steckerbrett: {a} ist nicht gesteckt und geht unverändert durch.',
        stEtwIn: 'Eintrittswalze: der Strom tritt bei Kontakt {a} in den Walzensatz ein.',
        stRotor: 'Walze {r} (Stellung {p}): aus {a} wird {b}.', stRefl: 'Die Umkehrwalze schickt den Strom zurück: aus {a} wird {b}.',
        stRotorBack: 'Zurück durch Walze {r}: aus {a} wird {b}.', stEtwOut: 'Eintrittswalze: der Strom verlässt den Walzensatz zum Buchstaben {a}.',
        stLamp: 'Lampe {b} leuchtet: {a} wurde zu {b} verschlüsselt.',
        brand: 'Chiffriermaschine', model: 'Modell', language: 'Sprache',
        settings: 'Schlüssel', settingsTitle: 'Schlüssel einstellen', aboutModel: 'Über dieses Modell', install: 'Installieren',
        machineAria: 'Enigma-Maschine', rotorsAria: 'Walzen', plugboard: 'Steckerbrett',
        message: 'Funkspruch', chars: '{n} Zeichen', tapeIn: 'Klartext / Eingabe', tapeOut: 'Ausgabe (Lampen)',
        undo: '↶ Zurück', undoTitle: 'Letzten Tastendruck zurücknehmen', copy: 'Kopieren', clear: 'Neues Blatt',
        bulkSummary: 'Text einfügen und durchschreiben', bulkPlaceholder: 'Klartext oder Geheimtext einfügen… (Umlaute werden zu AE/OE/UE)',
        bulkRun: 'Durch die Maschine schicken', traceSummary: 'Stromweg des letzten Buchstabens', tracePrompt: 'Taste drücken…',
        dailyKey: 'Tagesschlüssel', historic: 'Historische Funksprüche', options: 'Optionen',
        optSound: 'Tastengeräusch', optGroups: 'Ausgabe in Fünfergruppen', done: 'Fertig',
        operation: 'Bedienung', close: 'Schließen',
        help1: 'Tippen auf der Tastatur oder auf die Tasten der Maschine. Die Lampe leuchtet, solange die Taste gedrückt ist.',
        help2: 'Walzen mit den Rändelrädern drehen: obere oder untere Hälfte antippen oder das Mausrad benutzen.',
        help3: 'Steckerbrett: zwei Buchsen nacheinander antippen verbindet sie, erneutes Antippen einer Buchse löst das Kabel.',
        help4: 'Zum Entschlüsseln die Maschine auf den gleichen Schlüssel stellen und den Geheimtext eintippen.',
        sourceCode: 'Quellcode auf GitHub', mitLicense: 'MIT-Lizenz', dataSources: 'Verdrahtungsdaten nach Crypto Museum und Wikipedia.',
        turnRotor: 'Walze {name} drehen', keyAria: 'Taste {k}', socketAria: 'Buchse {k}',
        trKey: 'Taste', trPlug: 'Stecker', trEtw: 'ETW', trRefl: 'UKW', trLamp: 'Lampe',
        allCables: 'Alle 13 Kabel sind gesteckt.',
        presetLoaded: 'Schlüssel gesetzt, Geheimtext eingefügt. Jetzt „Durch die Maschine schicken“.',
        copied: 'Ausgabe kopiert.', copyFail: 'Kopieren nicht möglich.', noLetters: 'Kein Text mit Buchstaben A–Z.',
        processed: '{n} Zeichen verarbeitet.', nothingUndo: 'Nichts zum Zurücknehmen.',
        reflector: 'Umkehrwalze', position: 'Stellung {l}',
        rotorOrder: 'Walzenlage (links → rechts)', ringSetting: 'Ringstellung',
        startPos: 'Grundstellung', plugConnections: 'Steckerverbindungen',
        plugPlaceholder: 'z. B. AV BS CG DL FU', resetDefault: 'Auf Standard zurücksetzen',
        since: 'ab', rotorsN: '{n} Walzen', plusGreek: '+ Zusatzwalze', withPlug: 'mit Steckerbrett', noPlug: 'ohne Steckerbrett',
        gearDrive: 'Zahnradantrieb', leverDrive: 'Schaltklinken'
      },
      machines: {
        I: ['Heer & Luftwaffe', 'Die Standardmaschine der Wehrmacht. Drei aus fünf Walzen, Umkehrwalze B (ab 1937), Steckerbrett mit meist zehn Kabeln. Die Walzenringe tragen Zahlen 01–26 statt Buchstaben.'],
        M3: ['Kriegsmarine', 'Marine-Variante der Enigma I, kompatibel zu ihr. Drei aus acht Walzen; die Marine-Walzen VI–VIII haben zwei Übertragskerben (Z und M).'],
        M4: ['Kriegsmarine (U-Boote)', 'Vierwalzen-Enigma der U-Boot-Flotte (Schlüsselnetz „Triton“). Die vierte Walze (Beta oder Gamma) steht still und sitzt neben einer dünnen Umkehrwalze. Mit Beta auf A und UKW B dünn verhält sie sich wie eine M3 mit UKW B.'],
        Norway: ['Norwegische Polizei (nach 1945)', 'Nach Kriegsende neu verdrahtete Enigma-I-Maschinen, die der norwegische Polizeisicherheitsdienst weiter nutzte.'],
        D: ['Kommerziell (Chiffriermaschinen AG)', 'Die kommerzielle Enigma, Basis aller späteren Modelle. Kein Steckerbrett, die Eintrittswalze ist in Tastaturreihenfolge (QWERTZ…) verdrahtet, die Umkehrwalze ist einstellbar, bewegt sich aber nicht.'],
        K: ['Schweizer Armee, Reichsbahn u. a.', 'Weiterentwicklung der Enigma D mit einstellbarer Umkehrwalze. Die Schweiz ließ ihre Walzen neu verdrahten; simuliert ist die Swiss-K-Verdrahtung.'],
        Railway: ['Deutsche Reichsbahn', 'Eine Enigma K mit eigener Verdrahtung für die Reichsbahn. In Bletchley Park als „Rocket“ bezeichnet und gebrochen.'],
        T: ['Japanische Marine (Verbindung zur Kriegsmarine)', 'Für die Kommunikation mit Japan gebaut: acht Walzen mit je fünf Kerben, ungewöhnlich verdrahtete Eintrittswalze, kein Steckerbrett.'],
        G312: ['Abwehr', 'Zählwerk-Enigma des Geheimdienstes: Zahnradantrieb wie ein Kilometerzähler (kein Doppelschritt), sehr viele Kerben und eine Umkehrwalze, die sich mitdreht. Simuliert ist die Maschine G-312 aus Bletchley Park.'],
        G260: ['Abwehr (Argentinien)', 'Weitere Zählwerk-Enigma der Abwehr, eingesetzt für Verbindungen nach Südamerika. Gleiche Mechanik wie G-312, andere Verdrahtung.']
      },
      presets: { barbarossa: 'Operation Barbarossa, 7. Juli 1941 (Enigma I)', u534: 'U-534, Mai 1945 (Enigma M4)' }
    }
  };

  // Flatten into one key -> text table per language
  const STRINGS = {};
  for (const [lang, src] of Object.entries(SOURCE)) {
    const s = Object.assign({}, src.ui);
    for (const [id, [user, info]] of Object.entries(src.machines)) { s[`m.${id}.user`] = user; s[`m.${id}.info`] = info; }
    for (const [id, title] of Object.entries(src.presets)) s[`preset.${id}`] = title;
    STRINGS[lang] = s;
  }

  let current = 'en';

  function detect() {
    const list = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
    for (const l of list) {
      const code = String(l || '').slice(0, 2).toLowerCase();
      if (STRINGS[code]) return code;
    }
    return 'en';
  }

  function t(key, vars) {
    let s = (STRINGS[current] && STRINGS[current][key]) ?? STRINGS.en[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  }

  const I18N = {
    LANGS, STRINGS, t, detect,
    setLang(l) { current = STRINGS[l] ? l : 'en'; return current; },
    get lang() { return current; }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = I18N;
  else root.I18N = I18N;
})(typeof window !== 'undefined' ? window : globalThis);
