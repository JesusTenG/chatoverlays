import Link from 'next/link';
import { Breadcrumbs, StructuredData } from '@/components/site-chrome';
import { config, absoluteUrl } from '@/lib/catalog';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/ratgeber/chat-overlay-auswaehlen/', 'Das passende Chat-Overlay auswählen | Stream-Design-Ratgeber', 'So findest du ein Chat-Overlay, das zu deinem Stream passt: Stil, Lesbarkeit, Chat-Breite und Bewegung an konkreten Designbeispielen prüfen.');

export default function GuidePage() {
  return <article className="wrap guide"><Breadcrumbs name="Overlay-Ratgeber"/>
    <h1>Ein guter Look<br/>liest sich gut.</h1><p className="lead">Dein Chat soll zu dir passen – und deine Community soll ihn lesen können. Mit diesen vier Checks findest du ein Design, das in deiner echten Stream-Szene funktioniert.</p>
    <h2>1. Fang mit deiner Szene an.</h2><p>Schau auf deine Kamera, Panels und das Spiel, das du häufig streamst. Such dir ein Element, das du im Chat wiederholen möchtest: eine Akzentfarbe, eine Form oder eine bestimmte Stimmung. Für einen nostalgischen Desktop-Look ist <Link href="/overlays/lofi-windows-93/">Lofi Windows 93</Link> ein Ausgangspunkt; für eine botanische Szene lohnt <Link href="/overlays/chat-garden/">Chat Garden</Link>.</p>
    <h2>2. Gib dem Chat den richtigen Platz.</h2><p>Ein Overlay muss mit kurzen und langen Nachrichten zurechtkommen. Überlege, ob du eine feste Chat-Spalte oder eine freie Ecke deiner Szene nutzt. Schmale Designs wie <Link href="/overlays/inline-flow/">Inline Flow</Link> und <Link href="/overlays/small-talk/">Small Talk</Link> sind eine Richtung für kompakte Layouts. Dekorative Designs brauchen mehr Platz um die Bubbles.</p>
    <h2>3. Prüfe Kontrast und kleine Ansichten.</h2><p>Beurteile das Overlay vor einem hellen und einem dunklen Spielmoment. Verkleinere anschließend die komplette Szene: Sind Namen und Nachrichten weiterhin lesbar? Bei Pixel-Looks wie <Link href="/overlays/retromon-silver/">Retromon Silver</Link> ist ausreichend Schriftgröße besonders hilfreich. Bei floralen Designs sollten Details den Text nicht überlagern.</p>
    <h2>4. Schau die Animation bewusst an.</h2><p>Ein Standbild zeigt den Stil, das Originalvideo zeigt das Tempo. Prüfe, wie der Chat neben deiner Kamera und deinen Alerts wirkt. Wenn bereits viele Elemente deiner Szene animiert sind, kann ein zurückhaltender Chat angenehmer sein. Vergleiche zum Beispiel <Link href="/overlays/violet-frame/">Violet Frame</Link> mit der kompakteren Variante <Link href="/overlays/violet-frame-slim/">Violet Frame Slim</Link>.</p>
    <div className="guide-callout"><h2>Dein Favorit steht fest?</h2><p>Öffne das Template auf Chatstyle. Dort kannst du den aktuellen Preis und die verfügbaren Einstellungen prüfen. Die Einrichtung des Overlays erfolgt anschließend über Chatstyle.</p><Link href="/#templates" className="button">Zu den 40 Templates ↗</Link></div>
    <StructuredData data={{ '@type': 'Article', headline: 'Das passende Chat-Overlay auswählen', author: { '@type': 'Person', name: config.creator, url: config.creatorUrl }, mainEntityOfPage: absoluteUrl('/ratgeber/chat-overlay-auswaehlen/') }}/>
  </article>;
}
