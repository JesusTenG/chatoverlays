# ChatOverlays Styleguide

Die farbigen Karten der Guide-Übersicht sind die gestalterische Referenz für die gesamte Website: warmes Papier, kräftige Schrift, ruhige Pastellflächen und dezente physische Kanten. Neue Seiten und Komponenten führen diesen Stil fort.

## Zentrale CSS-Dateien

Die globale Import-Reihenfolge steht in `components/site-layout.tsx` und gilt für alle Sprachen und Routen.

| Datei | Verantwortung |
| --- | --- |
| `app/tokens.css` | Einzige Quelle der gemeinsamen Farben, Kartenrahmen, Schatten, Radien, Schriften und Bewegungswerte. |
| `app/globals.css` | Basislayout, Navigation, Buttons, Medien, Formulare und Interaktionszustände. |
| `app/guides.css` | Guide-spezifische Anordnung und redaktionelle Inhalte; verwendet dieselben Tokens. |
| `app/surfaces.css` | Gemeinsame Kartenoberflächen und deren responsive Anwendung auf Startseite, Galerie, Details und Kategorien. |

Bestehende Regeln an ihrer zuständigen Stelle ändern. Keine weiteren Override-Dateien und keine eigene Palette pro Seite ergänzen. Neue gemeinsame Werte in `tokens.css` definieren.

## Farben

| Token | Farbe | Verwendung |
| --- | --- | --- |
| `--paper` | `#fff8e9` | Seitenhintergrund und helle Bedienelemente |
| `--ink` | `#302637` | Überschriften, Text und Konturen |
| `--hero-background` | `var(--paper)` | Heller Hintergrund hinter der pastellfarbenen Hero-Karte |
| `--muted` | `#6b5e71` | Beschreibungstexte, weiterhin kräftig und lesbar |
| `--lilac` | `#d9cfeb` | Hero, Neon-/Cyber- und dunkle Designkarten |
| `--butter` | `#f5e6b9` | Retro-/Pixel-Karten und Guide-Verweise |
| `--sage` | `#e0e8db` | Clean-/Minimal-Karten, Skins und praktische Hinweise |
| `--apricot` | `#f4d9c2` | Cozy-/Cute-Karten und Design-Informationen |
| `--green` | `#264f46` | Primäre Aktion und ausgewählter Skin |
| `--accent` | `#77518c` | Akzenttext und Fokuszustände |

Template-Karten und Detailseiten erhalten ihre Farbe über `data-category`. Diese Zuordnung bleibt auch nach Suche oder Filterung stabil. Medien und das originale ChatStyle-Logo behalten ihre eigenen Farben.

## Karten und Abstände

- Gemeinsame Karten: `--card-radius` (20 px), `--card-border` (1 px), `--card-shadow` (5 px nach unten).
- Medien: `--media-radius` (12 px). Galerie-Bilder stehen mit 12–14 px Innenabstand in der Karte.
- Textkarten: normalerweise `--card-padding` (24 px), große Panels 28–44 px. Keine Textflächen direkt an den Rand setzen.
- Raster: `--grid-gap` (24 px). Bereiche mindestens 32 px, normalerweise `--section-gap` (48 px) voneinander trennen.
- Desktop-Inhalte bleiben im gemeinsamen `.wrap` (maximal 1440 px mit seitlichem Innenabstand). Mobile Standardabstände: 22 px, auf sehr schmalen Geräten 18 px.
- Farbe gehört auf die Karte; die umgebende Seite bleibt überwiegend cremefarben. Eine klare Überschrift pro Bereich, kurze Beschreibung nur wenn nötig.

## Typografie

- Fraunces 800 (`--display`) für Überschriften und Kartentitel; Arial 700 (`--font-body`) für Fließtext und Bedienelemente.
- Keine leichten Schriftgewichte. Fließtext 18–20 px, Navigation und Metadaten mindestens 16 px, Kartenaktionen 17 px.
- Kartentitel ungefähr 26–31 px, Bereichsüberschriften 38–62 px. Hero- und Seitentitel reagieren auf die verfügbare Breite.
- Lange deutsche und spanische Texte müssen ohne Abschneiden passen. Keine zusätzlichen Eyebrows, Statistiken oder Subtitles als Dekoration.

## Buttons und Links

- `.button` für eine Hauptaktion, `.button-outline` für eine sekundäre Aktion, klare Textlinks für weitere Navigation.
- Vorschau-/Detailaktionen neben einem ChatStyle-Button verwenden `.button.button-preview`: gleiche Fläche, Kontur, Schatten und Mindesthöhe wie die ChatStyle-Aktion. Beide Ziele sind gleich gewichtet.
- `DiscoverCard` bündelt unter Beispielen zwei gleich gewichtete Ziele: die lokale Galerie und den gesamten ChatStyle-Katalog. Ein ruhiges, mittig platziertes Panel statt zusätzlicher Banner.
- Aussagekräftige Beschriftungen; keine alleinstehenden Pfeile. Nur so viele Aktionen wie der Bereich braucht.
- ChatStyle-Verweise ausschließlich mit `ChatStyleButton` oder `ChatStyleLink` und dem offiziellen `ChatStyleLogo`. Hero-Link führt auf die ChatStyle-Hauptseite; Template-Verweise auf das jeweilige Template.
- Text und ChatStyle-Logo stehen ohne Trennstrich direkt nebeneinander. Der englische Hero-Link lautet „Check out ChatStyle“; andere Sprachen verwenden eine passende Übersetzung.
- Im Hero steht ChatStyle vor der Galerie-Aktion. Beide Buttons haben dieselbe Breite und Höhe.
- Kein Kauf-Wording. Vorschaubilder und Titel führen zur eigenen Detailseite, nicht in ein Modal.
- Community-Templates ohne lokale Detailseite führen ausdrücklich mit ChatStyle-Logo zur Originalseite. Ihre Verfügbarkeit wird mit Quelle und Prüfdatum dokumentiert.
- Tastaturfokus sichtbar halten; zentrale Bedienelemente mindestens 44 px hoch.

## Bewegung und Medien

- Karten schweben beim Hover um `--motion-lift` (−4 px) an; Schatten wechseln zu `--card-shadow-hover`. Dauer: `--motion-duration` (300 ms).
- Hero-Ausnahme: drei geneigte, überlappende Vorschaukarten für Sleeping Cats, Neo Tokyo und Lofi Windows 93. Hover/Fokus bringt eine Karte nach vorne.
- Hinter der Hero-Karte liegen echte, dekorative Skin-Bubbles aus verschiedenen Templates unregelmäßig auf einer hellen Fläche. Beim Laden fliegen sie gestaffelt vom oberen oder seitlichen Bildschirmrand an ihren Platz; beim Scrollen bewegen sie sich auf demselben Weg wieder nach außen. Die Bubbles verlinken die jeweilige Template-Detailseite, haben einen sichtbaren Tastaturfokus und stehen bei Reduced Motion still. Die Hero-Vorschauen nutzen die 1080-Pixel-Originale mit einem behutsam engeren Bildausschnitt.
- „Normal“ bezeichnet das Original-Basisdesign. Die verifizierten Basisvorschauen stehen in `source/base-previews.json`; keine Farbvariante als Basis ausgeben. `scripts/extract-base-previews.mjs` prüft die gespeicherten Original-Referenzen, bevor es die bereits lokalisierten Stile wiederverwendet.
- In Template-Details sind alle Skin-Kacheln sofort sichtbar. Kein Aufklapp-Button; Bilder unterhalb des sichtbaren Bereichs laden weiterhin verzögert.
- Hero-Videos und Detailvorschauen spielen stumm ab. Galerie-Videos starten bei Hover oder Fokus. `PreviewMedia` wiederverwenden: ohne sichtbare Play-/Pause-Steuerungen, mit automatischem Stopp außerhalb des Sichtbereichs und bei ausgeblendetem Tab sowie Reduced-Motion-Verhalten.
- Überschriften erscheinen dezent. Keine dauerhaften Hintergrundanimationen. `prefers-reduced-motion` respektieren.
- Keine großen Creator-Abzeichen, erfundenen Avatare oder dekorativen Embleme. Autorenschaft zurückhaltend im Design-Bereich bzw. Footer platzieren.

## Wiederverwendung und Prüfung

`TemplateCard`, `PreviewMedia`, `SkinGallery`, `GuideExamples`, `ChatStyleButton` und `ChatStyleLink` sind die Bausteine. Sie werden nicht pro Seite neu erfunden. Inhalte bleiben in den EN-/DE-/ES-Quelldateien; Englisch ist der Standard.

Vor Veröffentlichung repräsentative Start-, Detail-, Kategorie- und Guide-Seiten bei 390, 768 und 1440 px prüfen; zusätzlich lange Texte bei 320 px. Auf horizontales Scrollen, Textüberläufe, Video-/Button-Überlagerungen, sichtbaren Fokus und Sprachwechsel achten. Anschließend Build und vorhandene Projektchecks ausführen. Keine Tests nur zum Abgleichen einzelner CSS-Werte hinzufügen.
