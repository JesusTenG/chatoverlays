# Chat Overlays — JesusTenG

Mehrsprachiges Next.js-Projekt mit App Router, React und TypeScript für die 40 Templates der [Creator-Seite von JesusTenG](https://chatstyle.gg/templates/creator/jesusteng). Der Kauf findet auf ChatStyle statt. Der bestehende Retro-Look, alle URLs und Originalmedien sind übernommen.

## Lokal entwickeln

Node.js ab 20.9 wird benötigt; geprüft mit Node.js 22. Die Versionen sind in `package.json` und `package-lock.json` festgelegt.

```powershell
npm ci
npm run dev
```

Die Next.js-Entwicklungsvorschau läuft unter http://127.0.0.1:3000 und aktualisiert Änderungen automatisch.

## Produktionsbuild prüfen

```powershell
npm run build
npm run check
npm start
```

`next build` erstellt den statischen Export in `out/`. `npm start` zeigt diesen fertigen Export unter http://127.0.0.1:4173, einschließlich Video-Range-Requests und eigener 404-Seite. Der kleine Vorschau-Server ist nur für die lokale Kontrolle gedacht.

## Aufbau

- `app/(default)/layout.tsx`, `app/[locale]/layout.tsx`: vorgerenderte Sprachlayouts mit korrektem `html lang`; `components/site-layout.tsx` enthält das gemeinsame Layout.
- `components/pages.tsx`: gemeinsame Start-, Template-, Kategorie- und Ratgeberseiten, gespeist aus den Übersetzungen.
- `app/(default)/overlays/[slug]/page.tsx` und `app/[locale]/overlays/[slug]/page.tsx`: 40 vorab gerenderte Template-Seiten über `generateStaticParams`, mit individuellen Metadaten und passenden weiteren Templates.
- `app/(default)/styles/[slug]/page.tsx` und `app/[locale]/styles/[slug]/page.tsx`: fünf vorab gerenderte Kategorien.
- `app/(default)/ratgeber/chat-overlay-auswaehlen/page.tsx` und die entsprechende Sprachroute: Overlay-Ratgeber.
- `app/sitemap.ts`, `app/robots.ts`: automatisch erzeugte SEO-Dateien.
- `app/assets/catalog.json/route.ts`: beim Build exportierter Katalog unter der bisherigen URL `/assets/catalog.json`.
- `components/`: React-Komponenten für Galerie, Suche, Filter, Nachladen, Videovorschauen und Animationen. Interne Links nutzen Next.js-Navigation.
- `app/globals.css`: Retro-Design mit Lavendel-Hero, cremefarbener Galerie, dunkelgrüner Einrichtungshilfe und pfirsichfarbenem Creator-Bereich; kräftige Schrift ab 16 px.
- `components/navigation.tsx`: schwebende Navigation mit aktivem Abschnitt, kompakter Ansicht beim Scrollen und mobilem Menü. „Über die Designs“ führt zum Creator-Bereich.
- `components/skin-gallery.tsx`, `lib/skins.ts`: Skin-Auswahl mit isolierter Originalgestaltung und umschaltbarem Vorschau-Hintergrund.
- `lib/catalog.ts`, `lib/metadata.ts`: gemeinsames Datenmodell, Hero-Auswahl, Shop-URLs und SEO-Metadaten.
- `source/catalog.json`, `source/editorial.mjs`: verifizierte Template-Daten, deutsche Beschreibungen, Gestaltungstipps und Kategorien.
- `public/assets/templates/`: 40 originale WebP-Bilder und 40 WebM-Videos, lokal gespeichert.
- `public/assets/fonts/`: lokale Fraunces-Schrift mit SIL Open Font License.
- `public/assets/chatstyle-logo.svg`: unverändertes [Original-SVG von ChatStyle](https://chatstyle.gg/images/logos/logo-chatstyle.svg), an allen externen Shop-Links.
- `public/assets/logo.svg`, `public/assets/favicon.svg`: eigenes Logo aus zwei überlagerten Chatblasen.
- `site.config.json`: Name, Creator-Link, veröffentlichter Ursprung und Indexierungsstatus.

Im Hero laufen **Sleeping Cats, Neo Tokyo und Lofi Windows 93** stumm in Schleife. Die gedrehten Karten treten bei Hover oder Tastaturfokus hervor. Galerie-Videos starten bei Hover oder Fokus. Nicht sichtbare oder ausgefilterte Vorschauen sowie Videos in inaktiven Tabs pausieren. Reduzierte Bewegung wird berücksichtigt; die Hero-Videos lassen sich zusätzlich gemeinsam steuern.

Auf allen Template-Seiten startet das Video automatisch, sobald es sichtbar ist. Es lässt sich direkt auf der Seite pausieren. Video-Karten in Hero, Galerie und verwandten Templates verlinken auf die jeweilige Detailseite; Vorschau-Modals gibt es nicht mehr. Bei aktivierter reduzierter Bewegung startet es erst nach einem Klick. Die ChatStyle-Links verwenden neutrale Texte und das originale Logo. Der Hero-Link führt zur ChatStyle-Startseite, die Template-Links führen weiterhin zum jeweiligen Original.

## Hosting

Das Projekt verwendet echtes Next.js mit `output: 'export'` und `trailingSlash: true`. Es erzeugt 141 Inhaltsseiten (47 je Sprache) plus globale 404. Es braucht im Betrieb keinen Node.js-Server und läuft deshalb weiterhin auf der vorhandenen Sites-Adresse. `.openai/hosting.json` verweist auf `out/`; generierte Build-Verzeichnisse werden nicht eingecheckt.

`scripts/fix-static-export.mjs` korrigiert nach dem Build einen [bekannten Windows-Pfadfehler in Next.js](https://github.com/vercel/next.js/issues/85374) bei RSC-Dateien zum Vorladen. Auf bereits korrekt exportierten Pfaden ist der Schritt wirkungslos. Der Regressionstest prüft dynamische Routen, unveränderte Dateien, wiederholte Ausführung und Konflikte.

Der statische Export unterstützt die vorhandenen Funktionen vollständig. Funktionen, die einen Server benötigen, etwa Server Actions oder benutzerspezifische Daten aus Cookies, erfordern später einen Wechsel zu einer passenden Next.js-Laufzeit und Hosting-Konfiguration. Sie sind in dieser Galerie nicht erforderlich.

Die Site bleibt **privat** und mit **noindex,follow** versehen. Für den öffentlichen Start müssen Domain/Ursprung, Betreiberangaben und Indexierung passend festgelegt und die Freigabe separat geändert werden. Die Framework-Umstellung ändert diese Einstellungen nicht.

Kein eigenes Tracking, keine externen Schriftarten und keine Anwendungscookies. Der private Sites-Zugang kann unabhängig davon Anmelde- und Sitzungsdaten verwenden. UTM-Parameter kennzeichnen Galerie-Besuche auf ChatStyle. Preise werden dort angezeigt und hier nicht dupliziert.

## Medien aktualisieren

Die Originalmedien stammen von den öffentlich verlinkten CDN-URLs der Creator-Seite und wurden am 3. November 2026 lokal übernommen.

Die Originalbilder bleiben erhalten. Eingecheckte Varianten mit 360 und 720 Pixeln werden über `srcset` passend zur Anzeigegröße geladen. Nach einem Medienimport erstellt `node scripts/resize-template-posters.mjs` diese Varianten neu.

```powershell
Invoke-WebRequest -Uri 'https://chatstyle.gg/templates/creator/jesusteng' -OutFile 'source/creator.html'
npm run import:catalog
npm run build
npm run check
```

Der Import erwartet 40 eindeutige Templates. Bei Änderungen den Import und die Prüfungen anpassen sowie neue redaktionelle Einträge ergänzen. Vorhandene Medien werden nicht automatisch überschrieben. Das rohe HTML bleibt lokal; ein normaler Checkout und Build benötigen es nicht.

```powershell
npm run import:skins
```

Der Skin-Import liest die öffentlich gelisteten Varianten auf jeder Template-Seite. Aktuell sind es **344 Skins bei 27 Templates**; 13 Templates haben keine gelisteten Skins. Namen, Einstellungen, Original-HTML und CSS werden übernommen, benötigte Bilder und Schriften lokal gespeichert. Die Vorschauen zeigen neutrale Beispielnachrichten mit der jeweiligen Originalgestaltung, keinen Live-Chat. `source/skins.json` enthält Herkunft und Importzeit; die eigenständigen Vorschauen liegen unter `public/assets/skins/` und führen keine Scripts aus. Ein normaler Build benötigt keinen Zugriff auf ChatStyle.

Die Skinauswahl verwendet kleine, eingecheckte WebP-Vorschaubilder aus diesen Originalgestaltungen. Zunächst erscheinen sechs Varianten; weitere lassen sich aufklappen. Nur die ausgewählte große Vorschau lädt ein isoliertes HTML-Dokument. Auf dem Handy führt eine Auswahl unterhalb der Vorschau wieder zu ihr zurück.

Nach einem erneuten Skin-Import lassen sich die Bilder mit `scripts/render-skin-thumbnails.mjs` aktualisieren: Bei laufendem Entwicklungsserver erzeugt `node scripts/render-skin-thumbnails.mjs --browser-code 0 344` eine Funktion für Playwrights `browser_run_code_unsafe` (oder einen eigenen Playwright-Aufruf). Die Funktion speichert PNGs in `qa/`; `node scripts/render-skin-thumbnails.mjs --compress` erzeugt daraus die WebPs neben den Skin-HTML-Dateien. Normale Builds benötigen diese Browser-Schritte nicht.

## Validierung

`npm run check` führt TypeScript und die Exportprüfung aus: alle 159 Inhaltsrouten plus 404, lokale Links und Medien, unveränderte Shop-Ziele, ChatStyle-Logos, H1-Struktur, eindeutige Metadaten, Canonicals, Indexierungsstatus, JSON-LD und Sitemap. Alle 40 Templates müssen bereits im erzeugten HTML stehen. Browserprüfungen ergänzen dies um React-Hydration, Seitennavigation, Suche, Filter, Nachladen, Video-Steuerung, Tastaturbedienung und mobile Layouts.


## Ratgeber und Suchthemen

`/guides/` bündelt fünf Themen mit Beispielen, Schrittfolgen und direkten ChatStyle-Links: OBS-Einrichtung, Chat-Skins, Cozy-Designs, Retro-/Pixel-Designs und lesbare Layouts. Der bisherige Auswahl-Ratgeber bleibt unter seiner bestehenden URL erreichbar und enthält nun ebenfalls visuelle Beispiele. Alle Ratgeber liegen vollständig auf Englisch, Deutsch und Spanisch vor; die Site exportiert damit 159 Inhaltsrouten plus 404.

Inhalte: `source/guides/{en,de,es}.json`; gemeinsame Darstellung: `components/guide-pages.tsx`; Routenliste: `source/guides/routes.mjs`. Die Ratgeber sind über Navigation, Startseite, Footer und passende Template-Seiten erreichbar. Sitemap, Canonicals, Sprachalternativen und Artikel-/Breadcrumb-Daten werden mit exportiert.

Links wie `/overlays/sleeping-cats/?skin=725#skins` öffnen eine konkrete Variante. Die Auswahl aktualisiert die URL; Sprachwechsel behalten sie bei. Diese Varianten-URLs haben weiterhin die Template-Seite als Canonical. Die Artikel beschreiben konkrete Suchthemen, ohne Suchvolumen oder Rankings zu behaupten. Die private Freigabe und `noindex` bleiben bis zum öffentlichen Start unverändert.

## Übersetzungen

Englisch ist die Standardsprache unter `/`, Deutsch liegt unter `/de/`, Spanisch unter `/es/`. Die bestehenden Pfade bleiben erhalten; die Sprachversionen ergänzen lediglich ihren Präfix. Es gibt keine automatische Browser-Sprachumleitung: Ein direkter Aufruf von `/` bleibt Englisch. Die gewählte Sprache steckt in der URL und bleibt bei internen Seitenwechseln sowie beim Neuladen erhalten. Der Sprachwechsel bewahrt Seite, Suchfilter und Abschnitt.

`source/locales/{en,de,es}.json` enthält Oberfläche, Startseite, Kategorien, Ratgeber und Metadaten. `source/editorial.en.json` und `source/editorial.es.json` ergänzen die deutschen Beschreibungen und Gestaltungstipps aus `source/editorial.mjs`. Template- und Skin-Namen sowie Originalvideos bleiben unverändert. Auch englische und spanische Skin-Beispielnachrichten werden lokal generiert (`predev` und `build`); diese abgeleiteten HTML-Dateien werden nicht eingecheckt.

Jede Sprachseite hat einen eigenen Canonical, gegenseitige `hreflang`-Verweise einschließlich englischem `x-default`, übersetzte Metadaten und passende strukturierte Daten. Die Sitemap enthält alle 159 Sprachseiten. Die vorhandenen privaten Freigaben und `noindex` bleiben bestehen. Die global verwendete 404 ist auf Englisch; unbekannte Sprachpfade führen über die Sprachauswahl zur jeweiligen Startseite.

Die Übersetzungs- und Routingtests prüfen vollständige Schlüssel, Platzhalter, alle 40 Template-Texte, Sprachwechsel mit Suchparametern sowie HTML-Sprachen und Alternativ-URLs im fertigen Export.
