# Chat Overlays — JesusTenG

Eigenständige deutschsprachige Galerie mit den 40 Templates der [Creator-Seite von JesusTenG](https://chatstyle.gg/templates/creator/jesusteng). Der Kauf findet auf Chatstyle statt.

## Lokal starten

Node.js 22 ist ausreichend; es gibt keine npm-Abhängigkeiten.

```powershell
node build.mjs
node check.mjs
node server.mjs
```

Die Vorschau läuft unter http://127.0.0.1:4173. Das Verzeichnis `dist/` lässt sich auf einem statischen Webhost bereitstellen.

## Aufbau

- `source/catalog.json`: 40 verifizierte Template-Namen, Originalmedien-Quellen und Chatstyle-Links.
- `source/editorial.mjs`: deutsche Beschreibungen und individuelle Gestaltungstipps sowie fünf Stilwelten.
- `source/style.css`, `source/app.js`: responsive Gestaltung, Suche, Filter, Sortierung, Nachladen und zugänglicher Video-Dialog.
- `dist/assets/templates/`: 40 lokale WebP-Bilder und 40 lokale WebM-Videos, insgesamt ca. 41 MB. Videos werden erst auf ausdrücklichen Klick geladen und abgespielt. Bei reduzierter Bewegung startet das Video nicht automatisch.
- `build.mjs`: erzeugt Startseite, 40 Detailseiten, fünf Kategorie-Seiten, einen Ratgeber, 404, Sitemap, Canonicals, Open-Graph-Metadaten und JSON-LD.
- `site.config.json`: öffentlicher Ursprung, Creator-Link und Indexierungsstatus.

Kein Tracking, keine externen Schriftarten und keine Cookies im Anwendungscode. Der private Sites-Zugang kann unabhängig davon eigene Anmeldung und Sitzungsdaten verwenden. Die ausgehenden UTM-Parameter kennzeichnen Besuche aus der Galerie, sie messen ohne Auswertung auf Chatstyle selbst nichts.

## Medien aktualisieren

Die Medien wurden am 3. November 2026 von den öffentlich verlinkten CDN-URLs der angegebenen Creator-Seite übernommen. Die Dateien sind lokal gespeichert, damit die Galerie nicht von kurzfristigen Änderungen der CDN-Pfade abhängt. Die Originale bleiben unverändert.

```powershell
Invoke-WebRequest -Uri 'https://chatstyle.gg/templates/creator/jesusteng' -OutFile 'source/creator.html'
node import-catalog.mjs --download
node build.mjs
node check.mjs
```

Der Import erwartet aktuell 40 eindeutige Templates. Ändert sich der Katalog, schlägt er bewusst fehl: dann den Import prüfen, den erwarteten Umfang aktualisieren und für neue Templates eigene Einträge in `source/editorial.mjs` hinzufügen. Vorhandene lokale Medien werden nicht automatisch überschrieben; bei aktualisierten Vorschauen gezielt die betreffende lokale Datei ersetzen. Das rohe HTML bleibt lokal und wird nicht veröffentlicht oder eingecheckt. `node check.mjs` vergleicht die ausgehenden Links mit diesem lokalen Original. Nach einem frischen Checkout zuerst die Creator-Seite wie oben abrufen.

## Für den öffentlichen Start

Die erste Sites-Veröffentlichung ist **privat** und zusätzlich mit `noindex,follow` versehen. Dadurch ist sie eine Vorschau und kann aktuell keinen SEO-Traffic erhalten.

1. Gewünschten Namen und öffentliche Domain festlegen; `origin` in `site.config.json` auf die finale HTTPS-Adresse setzen. Canonicals und Sitemap werden daraus erzeugt.
2. Eigene Betreiber-/Kontaktangaben sowie die für die öffentliche Seite vorgesehenen Rechtstexte ergänzen. Es wurden keine Personenangaben erfunden und nicht die Chatstyle-Rechtstexte als eigene übernommen.
3. Inhalte und Media-Auswahl final prüfen, `indexable` auf `true` setzen, neu bauen und öffentlich veröffentlichen. Sites-Freigabe und `indexable` sind getrennte Einstellungen.
4. Die finale Sitemap unter `/sitemap.xml` in Google Search Console einreichen. Die Galerie hat eigenständige Auswahlhinweise und verlinkt auf die jeweiligen Angebote; Ranking-Verbesserungen sind nicht garantiert.

Preise werden nicht kopiert, weil sie sich ändern können. Jeder Kauf-Link führt direkt zur passenden Template-Seite auf Chatstyle. Im JSON-LD werden keine unbelegten Preise, Bewertungen oder Produktangebote erzeugt.

## Validierung

`node check.mjs` prüft alle internen Links und Medienpfade, die 40 Original-Zielseiten, Dateisignaturen aller 80 Vorschaumedien, eindeutige Seitentitel und Beschreibungen, H1-Struktur, Canonicals, JSON-LD und Sitemap. Browserprüfungen decken Suche, Filter, leere Ergebnisse, Sortierung, Nachladen, Videowiedergabe, Escape-Schließen und mobile Layouts ab.
