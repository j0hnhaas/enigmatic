# Enigmatic – Enigma Simulator (PWA)

A simulator of the historic Enigma cipher machines with the look and feel of the originals: wooden case, crinkle-finish panel, rotor windows with thumbwheels, glowing lampboard, keyboard and a plugboard with real cables. It runs entirely in the browser, works offline and can be installed as an app.

**Live:** https://j0hnhaas.github.io/enigmatic/

**Languages:** English, Español, Français, Português, Deutsch. The app picks the device language on first start (falling back to English); the choice can be changed in the top bar.

## Simulated models

| Model | Year | Used by | Special features |
|---|---|---|---|
| Enigma I | 1932 | German Army & Air Force | 3 of 5 rotors, reflectors A/B/C, plugboard, number rings 01–26 |
| Enigma M3 | 1934 | Kriegsmarine | 3 of 8 rotors (VI–VIII with two notches) |
| Enigma M4 | 1942 | U-boats | 4th rotor Beta/Gamma, thin reflectors B/C |
| Norenigma | 1945 | Norwegian police | rewired Enigma I |
| Enigma D | 1926 | commercial | QWERTZ entry wheel, settable reflector, no plugboard |
| Enigma K (Swiss-K) | 1938 | Switzerland | like D, Swiss wiring |
| Enigma "Rocket" | 1941 | German railways | K mechanism, own wiring |
| Enigma T "Tirpitz" | 1942 | Japan | 8 rotors with 5 notches each, unusual entry wheel |
| Enigma G-312 / G-260 | 1931 | Abwehr | gear drive without double step, moving reflector, many notches |

Not included, because no wiring is reliably documented in public or the mechanism differs fundamentally: Enigma A/B, counter Enigma A28, Enigma Z (digits), Enigma II, reflector D (rewirable), the Enigma Uhr.

## Correctness

`node tests/test.js` checks that
- every rotor is a permutation and every reflector an involution without fixed points,
- the standard vector `AAAAA → BDZGO` holds (Enigma I, rotors I-II-III, reflector B),
- the middle rotor double-steps,
- the original messages **Operation Barbarossa 1941** (Enigma I) and **U-534 1945** (Enigma M4) decrypt to their known plaintexts,
- every model is reciprocal,
- every language has exactly the same texts and placeholders as English.

Both historic messages are available in the app under **Key → Historic messages**.

## Deploying to GitHub Pages

1. Put the contents of this folder in the root of a repository and push it.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. After a minute or two the app is available at `https://<user>.github.io/<repository>/`.

All paths are relative, so the app also works in a sub-folder. The `.nojekyll` file makes GitHub serve the files unchanged.

**When updating**, increase `VERSION` in `sw.js` so installed apps fetch the new files.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
The service worker needs `http://localhost` or HTTPS; opening `index.html` via `file://` works without offline support.

## Structure

```
index.html            user interface (texts carry data-i18n keys)
css/style.css         look (wood, crinkle finish, lamps, keys, plugboard)
js/i18n.js            translations and language detection
js/machines.js        machine data: wirings, notches, mechanism
js/enigma.js          encryption logic (no DOM, testable in Node)
js/app.js             interaction, sound, storage, plugboard cables
sw.js                 offline cache
manifest.webmanifest  PWA manifest
tests/test.js         tests
```

- **New model:** add an entry to `js/machines.js` and its description (`machines`) in every language in `js/i18n.js`.
- **New language:** copy the `en` block in `js/i18n.js`, translate it and add the language to `LANGS`. The tests report any missing text.

German technical terms (Umkehrwalze, Steckerbrett, Walzenlage …) are kept in brackets in the other languages, as is common in Enigma literature. The machine itself (QWERTZ keyboard, rotor names) and the historic messages stay in their original German.

## License

© 2026 Johnny Haas. Released under the [MIT License](LICENSE).

## Sources

Wirings according to the Crypto Museum (cryptomuseum.com) and "Enigma rotor details" (Wikipedia). The data of the rare models (G, T, Norenigma) cannot be verified against historic messages; check them against the Crypto Museum before serious use.
