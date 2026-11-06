# Enigma Simulator (PWA)

Ein Simulator historischer Enigma-Chiffriermaschinen im Look der Originale: Holzkiste, Schrumpflack-Platte, Walzenfenster mit Rändelrädern, Glühlampenfeld, Tastatur und Steckerbrett mit Kabeln. Er läuft komplett im Browser, funktioniert offline und lässt sich installieren.

## Simulierte Modelle

| Modell | Jahr | Nutzer | Besonderheiten |
|---|---|---|---|
| Enigma I | 1932 | Heer & Luftwaffe | 3 aus 5 Walzen, UKW A/B/C, Steckerbrett, Zahlenringe 01–26 |
| Enigma M3 | 1934 | Kriegsmarine | 3 aus 8 Walzen (VI–VIII mit Doppelkerbe) |
| Enigma M4 | 1942 | U-Boote | 4. Walze Beta/Gamma, dünne UKW B/C |
| Norenigma | 1945 | Norwegische Polizei | neu verdrahtete Enigma I |
| Enigma D | 1926 | kommerziell | QWERTZ-Eintrittswalze, einstellbare UKW, kein Steckerbrett |
| Enigma K (Swiss-K) | 1938 | Schweiz | wie D, Schweizer Verdrahtung |
| Enigma „Rocket“ | 1941 | Reichsbahn | K-Mechanik, eigene Verdrahtung |
| Enigma T „Tirpitz“ | 1942 | Japan | 8 Walzen mit je 5 Kerben, ungewöhnliche ETW |
| Enigma G-312 / G-260 | 1931 | Abwehr | Zahnradantrieb ohne Doppelschritt, mitdrehende UKW, viele Kerben |

Nicht enthalten, weil keine Verdrahtung gesichert öffentlich dokumentiert ist oder die Mechanik grundlegend abweicht: Enigma A/B, Zählwerk-Enigma A28, Enigma Z (Ziffern), Enigma II, UKW-D (umsteckbare Umkehrwalze), Enigma-Uhr.

## Korrektheit

`node tests/test.js` prüft:
- alle Walzen sind Permutationen und alle Umkehrwalzen fixpunktfreie Involutionen,
- den Standardvektor `AAAAA → BDZGO` (Enigma I, I-II-III, UKW B),
- den Doppelschritt der mittleren Walze,
- die Original-Funksprüche **Operation Barbarossa 1941** (Enigma I) und **U-534 1945** (Enigma M4), die im Klartext herauskommen,
- die Umkehrbarkeit aller Modelle.

Die beiden historischen Funksprüche sind in der App unter **Schlüssel → Historische Funksprüche** hinterlegt.

## Auf GitHub Pages veröffentlichen

1. Neues Repository anlegen, z. B. `enigma`.
2. Den Inhalt dieses Ordners ins Repository-Hauptverzeichnis legen und pushen:
   ```bash
   git init && git add . && git commit -m "Enigma Simulator"
   git branch -M main
   git remote add origin https://github.com/<benutzer>/enigma.git
   git push -u origin main
   ```
3. Auf GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, Branch `main`, Ordner `/ (root)`.
4. Nach etwa einer Minute ist die App unter `https://<benutzer>.github.io/enigma/` erreichbar und installierbar.

Alle Pfade sind relativ, die App funktioniert deshalb auch in einem Unterordner. Die Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert ausliefert.

**Bei Updates** in `sw.js` die Konstante `VERSION` hochzählen, damit installierte Apps die neuen Dateien laden.

## Lokal starten

```bash
python3 -m http.server 8000
# http://localhost:8000
```
(Der Service Worker braucht `http://localhost` oder HTTPS; ein direkt geöffnetes `file://` funktioniert ohne Offline-Modus.)

## Aufbau

```
index.html            Oberfläche
css/style.css         Optik (Holz, Schrumpflack, Lampen, Tasten, Steckerbrett)
js/machines.js        Modelldaten: Verdrahtungen, Kerben, Mechanik
js/enigma.js          Verschlüsselungslogik (ohne DOM, in Node testbar)
js/app.js             Bedienung, Sound, Speicherung, Steckerbrett-Kabel
sw.js                 Offline-Cache
manifest.webmanifest  PWA-Manifest
tests/test.js         Tests
```

Ein neues Modell braucht nur einen Eintrag in `js/machines.js`.

## Lizenz

© 2026 Johnny Haas. Veröffentlicht unter der [MIT-Lizenz](LICENSE).

## Quellen

Verdrahtungen nach Crypto Museum (cryptomuseum.com) und „Enigma rotor details“ (Wikipedia). Die Daten der seltenen Modelle (G, T, Norenigma) lassen sich nicht über historische Funksprüche prüfen; vor einer ernsthaften Nutzung sollten sie mit dem Crypto Museum abgeglichen werden.
