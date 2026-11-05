import Link from 'next/link';
import { catalog, featuredTemplates, absoluteUrl } from '@/lib/catalog';
import { pageMetadata } from '@/lib/metadata';
import { Gallery } from '@/components/gallery';
import { PreviewMedia } from '@/components/preview-media';
import { HeroMotionToggle } from '@/components/video-provider';
import { BrandMark, ChatStyleLink, ChatStyleLogo, StructuredData } from '@/components/site-chrome';

export const metadata = pageMetadata('/', 'Chat-Overlays für Twitch & OBS von JesusTenG | Chat Overlays', 'Entdecke 40 Chat-Overlays von JesusTenG mit Originalvideos. Finde deinen Style und dein Lieblings-Template auf Chatstyle.');

export default function HomePage() {
  return <>
    <section className="hero wrap">
      <div className="hero-heading"><h1><span className="headline-line">Dein Chat.</span><span className="headline-line accent">Dein Style.</span></h1><p>Chat-Overlays von JesusTenG.<br/>Hier entdecken, auf ChatStyle holen.</p><div className="hero-actions"><ChatStyleLink className="button">Zu <ChatStyleLogo/></ChatStyleLink><a className="browse-link" href="#templates">Templates entdecken <span aria-hidden="true">↓</span></a></div></div>
      <div className="hero-stage"><div className="hero-showcase">{featuredTemplates.map(template => <figure key={template.slug} className="hero-tile" data-autoplay-preview><PreviewMedia template={template} mode="hero"/><figcaption><Link prefetch={false} href={`/overlays/${template.slug}/`}>{template.name}</Link></figcaption></figure>)}</div><div className="hero-controls"><HeroMotionToggle/></div></div>
    </section>
    <div className="retro-rule" aria-hidden="true"><span/><span/><span/></div>
    <section className="section wrap" id="templates"><h2 data-reveal>Finde deinen Look.</h2><Gallery items={catalog}/></section>
    <section className="how-section" id="so-gehts"><div className="wrap"><h2 data-reveal>Dein Look. In deinem Stream.</h2><ol className="steps">
      <li data-reveal><span className="step-number" aria-hidden="true">01</span><h3>Style finden</h3><p>Vorschauen abspielen und dein Lieblings-Overlay entdecken.</p></li>
      <li data-reveal><span className="step-number" aria-hidden="true">02</span><h3>Auf ChatStyle holen</h3><p>Der Link führt direkt zum Template. Dort findest du Preis und Einstellungen.</p></li>
      <li data-reveal><span className="step-number" aria-hidden="true">03</span><h3>Im Stream zeigen</h3><p>Overlay in ChatStyle einrichten und als Browserquelle in OBS einbinden.</p></li>
    </ol></div></section>
    <section className="creator-section wrap"><div className="creator-art" aria-hidden="true"><div className="creator-emblem"><BrandMark/><span>JesusTenG</span></div></div><div className="creator-copy"><h2 data-reveal>Kleine Details.<br/>Viel Persönlichkeit.</h2><p>Von schlafenden Katzen bis zum Retro-Desktop: Entdecke die 40 Chat-Overlays von JesusTenG und finde den Look für deine Community.</p><ChatStyleLink className="creator-link">Alle Designs auf <ChatStyleLogo/></ChatStyleLink></div></section>
    <section className="faq-section wrap"><h2 data-reveal>Noch kurz gefragt.</h2><div className="faq-list">
      <details><summary>Wo bekomme ich die Templates?<span aria-hidden="true">+</span></summary><p>Direkt auf ChatStyle. Die Links an den Vorschauen führen zum jeweiligen Template. Dort findest du den aktuellen Preis und alle Details zum Angebot.</p></details>
      <details><summary>Wie kommt das Overlay in OBS?<span aria-hidden="true">+</span></summary><p>Nach der Einrichtung in ChatStyle bindest du die Overlay-URL als Browserquelle in deine OBS-Szene ein. Größe und Position legst du in deiner Szene fest.</p></details>
      <details><summary>Welcher Style passt zu meinem Stream?<span aria-hidden="true">+</span></summary><p>Achte auf Farben, Lesbarkeit und die Bewegung neben deinem Spiel oder Kamerabild. Unser <Link href="/ratgeber/chat-overlay-auswaehlen/">kurzer Overlay-Ratgeber</Link> hilft dir bei der Auswahl.</p></details>
    </div></section>
    <StructuredData data={{ '@type': 'CollectionPage', name: 'Chat-Overlays von JesusTenG', url: absoluteUrl('/'), description: 'Originalvorschauen und Design-Auswahl für den Livestream.', mainEntity: { '@type': 'ItemList', itemListElement: catalog.map((template, index) => ({ '@type': 'ListItem', position: index + 1, name: template.name, url: absoluteUrl(`/overlays/${template.slug}/`) })) } }}/>
  </>;
}
