# Zehn zusätzliche Suchintentionen für ChatOverlays

## Erweiterung vom 12. November 2026

Die Übersicht umfasst jetzt 18 Themen: zusätzlich einen interaktiven Vorher-nachher-Vergleich (`chat-overlay-before-after`), einen allgemeinen Einstieg (`chatstyle-setup`) und einen Guide zur Anpassung von Templates und Zuschauer-Skins (`customize-chatstyle`). Alle drei sind in Englisch, Deutsch und Spanisch vorhanden.

Der Gratis-Guide ist nicht mehr auf die zwei kostenlosen Designs der eigenen Sammlung beschränkt. `source/free-templates.json` dokumentiert die 28 am Prüfdatum im vollständigen öffentlichen ChatStyle-Katalog als **Free** markierten Templates. Die Auswahl folgt dem Verfügbarkeitslabel, nicht einer Preiszahl oder einem Wort im Beschreibungstext. Die Originalseiten bleiben maßgeblich. `scripts/import-free-templates.mjs` kann den öffentlichen Abgleich und die Medienimporte erneut ausführen; sein Prüfdatum muss bei einer neuen redaktionellen Prüfung aktualisiert werden.

Jeder Guide besitzt mindestens vier individuelle Fragen; die neuen Guides fünf und die Startseite sechs. Die Einstiege wurden gekürzt, ausführliche Hilfe bleibt in Schritten, Hinweisen und Q&A. Unter Beispielen führen gleich gewichtete Aktionen zur lokalen Galerie und zum vollständigen ChatStyle-Katalog. Alle 344 Skin-Beispiele besitzen ganze Beispielsätze und lokalisierte Vorschaubilder in drei Sprachen.

Die allgemeinen ChatStyle-Guides verweisen auf die [Einrichtung](https://chatstyle.gg/), [Kontoberechtigungen](https://chatstyle.gg/permissions), [Zuschauer-Skins](https://chatstyle.gg/blog/custom-twitch-chat-bubbles-viewer-skins) sowie die offiziellen OBS-/Streamlabs-Dokumentationen. Allgemeine Bild- und Layoutprüfungen sind als praktische Empfehlungen formuliert; Verfügbarkeit, Kosten und Funktionsumfang werden nicht aus einer Vorschau abgeleitet.

Recherche und Umsetzung: 11. November 2026.

## Bewertung

Priorität bedeutet hier: Nähe zum konkreten Overlay-Bedarf, hilfreiche Beantwortbarkeit mit dem vorhandenen Katalog und ein nachvollziehbarer nächster Schritt zu ChatStyle. Die Reihenfolge ist eine redaktionelle Einschätzung, keine Rangliste gemessener Suchvolumina. Es liegen keine Keyword-Planner-, Search-Console- oder bezahlten Keyword-Daten vor. Die Websuche bestätigt vorhandene Ergebnisarten und Fragestellungen, aber weder monatliche Nachfrage noch eine garantierte Ranking-Chance.

Der zentrale Einrichtungsbegriff „Twitch Chat in OBS einfügen / add Twitch chat to OBS“ ist bereits durch `add-chat-overlay-obs` abgedeckt. Auch Cozy-, Retro-, Skin- und Lesbarkeits-Guides existieren. Die neuen Seiten erweitern diese Themen um eigenständige Aufgaben. Varianten einer Frage werden auf derselben Seite beantwortet.

## Priorisierte Seiten

Alle Pfade liegen unter `/guides/`; Deutsch unter `/de/guides/`, Spanisch unter `/es/guides/`. Jede Zeile entspricht einem neuen Thema und drei vollständig lokalisierten URLs.

| Prio | Suchanfrage EN / DE / ES | Neue Unterseite | Eigenständiger Nutzen und Template-Bezug |
| --- | --- | --- | --- |
| 1 | custom chat overlay Streamlabs / Chat-Overlay in Streamlabs einrichten / chat personalizado Streamlabs | `streamlabs-chat-overlay/` | Bestehende Streamlabs-Szene behalten, Browser-Quelle ergänzen und doppelte Widgets vermeiden. Small Talk, Lofi Windows 93, Neo Tokyo. |
| 2 | chat overlay not showing OBS / Chat wird in OBS nicht angezeigt / chat no aparece en OBS | `obs-chat-not-showing/` | Symptomtabelle trennt Verbindungs-, Sichtbarkeits- und Zuschnittfehler. Erst Diagnose, dann Beispiele; kein unnötiger Template-Wechsel als angebliche Lösung. |
| 3 | free Twitch chat overlays / kostenlose Twitch-Chat-Overlays / overlays de chat gratis Twitch | `free-twitch-chat-overlays/` | Zwei am Recherchetag auf ihren Originalseiten als Free bestätigte JesusTenG-Templates: Zuluxxman und Manhunt 2026. Klare Abgrenzung von Template-Preis und möglichen Dienstkosten. |
| 4 | transparent Twitch chat OBS / Twitch-Chat transparent machen / chat transparente Twitch OBS | `transparent-chat-overlay/` | Unterscheidung von Seitenhintergrund und Bubble-Füllung, Farbquellen-Test, Grenzen pauschaler CSS-Tricks. Inline Flow, Small Talk, Violet Frame Slim. |
| 5 | YouTube chat overlay OBS / YouTube-Live-Chat in OBS / chat de YouTube en OBS | `youtube-chat-overlay-obs/` | Kanal und aktive Unterhaltung prüfen, ChatStyle-Verbindung und Live-URL erklären. Keine Gleichsetzung der Funktionen verschiedener Plattformen. |
| 6 | animated Twitch chat overlay / animiertes Chat-Overlay / chat animado Twitch | `animated-chat-overlays/` | Bewegung nach Einblendung, Lesephase und Nachrichtenserien beurteilen; Live-Test unter normaler Last. Neo Tokyo, Magical Love, Manhunt 2026. |
| 7 | Just Chatting overlay layout / Just-Chatting-Szene gestalten / diseño Just Chatting | `just-chatting-overlay/` | Kamera- und Chatspalte planen und geteilte Inhalte berücksichtigen. Sleeping Cats, WhatsChat LoFi, Chat Garden; kein irreführendes Komplettpaket-Angebot. |
| 8 | OBS scenes setup beginners / OBS-Szenen für Anfänger / escenas OBS principiantes | `obs-stream-scenes/` | Szenenplan für Gameplay, Gespräch, Pause und optionalen Start. Quellen und Ausgabeprofile unterscheiden, einen kompletten Wechsel proben. |
| 9 | custom Twitch chat bubbles viewers / eigene Chat-Bubbles für Zuschauer / burbujas Twitch espectadores | `viewer-chat-bubbles/` | Verfügbarkeit und Zuschauerablauf planen. Drei konkrete Skin-Deep-Links; Galerieauswahl und echte Aktivierung unterscheiden. Ergänzt den bestehenden Farbvergleich. |
| 10 | vertical chat overlay 9:16 / vertikales Chat-Overlay / overlay chat vertical | `vertical-chat-overlay/` | Eigene Hochformat-Komposition mit Layouttabelle und Smartphone-Prüfung. Keine unbestätigte TikTok-/Kick-Anbindung oder universelle Safe-Area-Versprechen. |

Die ersten fünf Themen haben besonders konkrete Handlungsabsichten. Die folgenden fünf helfen bei der Gestaltung und können passende Besucher vor der eigentlichen Template-Auswahl erreichen. Das ist eine Einschätzung der Passung, keine gemessene Traffic-Prognose.

## Recherchegrundlage

- Suchergebnisse zu Chat-Fehlern, transparenten Overlays, Gratis-Designs, YouTube-Chat, Just-Chatting-Layouts und vertikalem Chat wurden geprüft. Einrichtung, Fehlerbehebung und visuelle Auswahl sind dabei verschiedene Ergebnisarten.
- [Streamlabs: Browser Source](https://streamlabs.com/content-hub/post/introducing-browser-source-interaction-for-streamlabs-desktop) belegt den Einrichtungsweg über eine URL.
- [OBS: Browser Source](https://obsproject.com/kb/Browser-Source), [Quellen](https://obsproject.com/kb/sources-guide) und [Szenensammlungen](https://obsproject.com/kb/scene-collections) dienen als technische Referenzen.
- [ChatStyle-Berechtigungen](https://chatstyle.gg/permissions) bestätigen die YouTube-Anbindung und beschreiben deren Zugriff. [YouTube: Live-Chat](https://support.google.com/youtube/answer/15268877) erklärt die Verfügbarkeit.
- Die Originalseiten von [Zuluxxman](https://chatstyle.gg/template/zuluxxman) und [Manhunt 2026](https://chatstyle.gg/template/manhunt-2026) wurden im Browser auf Creator und Free-Kennzeichnung geprüft. Keine Aussage über unveränderliche Preise oder kostenlose Gesamtnutzung.
- [ChatStyle: Zuschauer-Skins](https://chatstyle.gg/blog/custom-twitch-chat-bubbles-viewer-skins) beschreibt Auswahl und Kanalzugang.

## Umsetzung und Qualitätsmaßstab

Die zehn neuen Themen sind in `source/guides/setup.en.json`, `setup.de.json` und `setup.es.json` gepflegt. Die fünf bestehenden Artikel bleiben erhalten. Die Guide-Übersicht ordnet alle 15 Themen in Einrichtung, Designs sowie Szenen & Community ein.

Jede neue Seite enthält eine direkte Antwort, vier konkrete Schritte, individuelle Hinweise, passende Fragen und zwei oder drei tatsächliche Template-Beispiele. Jedes Beispiel führt zur internen Detailvorschau und zum Originalangebot auf ChatStyle. Technische Artikel platzieren die Hilfe vor den Designbeispielen. Die drei Tabellen helfen bei Diagnose, Szenenplanung und Hochformatgestaltung. Knappe Texte, reale Vorschauen und die bestehenden farbigen Karten bleiben die visuelle Grundlage.

Eigene Titel und Beschreibungen, Canonicals, Sprachalternativen, Artikel- und Breadcrumb-Daten sowie Sitemap-Einträge werden für alle Sprachversionen erzeugt. Die Verlinkung zwischen den Guides folgt dem nächsten sinnvollen Arbeitsschritt.

[Googles Empfehlungen für hilfreiche Inhalte](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) und die [Spam-Richtlinien](https://developers.google.com/search/docs/essentials/spam-policies) sprechen für nützliche, eigenständige Antworten. Deshalb werden keine fast identischen Seiten für bloße Keyword-Varianten erstellt. Die Artikel müssen auch dann hilfreich sein, wenn ein Besucher anschließend kein Template auswählt.

## Voraussetzung für Google-Traffic

Die Site ist zurzeit nur für den Eigentümer freigegeben; `site.config.json` setzt `indexable` auf `false`. Die Inhalte sind für einen späteren öffentlichen Start vorbereitet, können in diesem Zustand aber keinen organischen Google-Traffic gewinnen. Diese Veröffentlichung ändert die bestehende Zielgruppe nicht.

Nach einer ausdrücklich gewünschten öffentlichen Freigabe: `indexable` aktivieren, Canonical-Domain bestätigen, Sitemap in Search Console einreichen und Indexierung prüfen. Danach zuerst echte Impressionen und Suchanfragen pro Guide und Sprache auswerten. Seiten mit Impressionen, aber schwachen Klicks gezielt überarbeiten; Inhalte nicht allein wegen fehlender früher Rankings vervielfachen.
