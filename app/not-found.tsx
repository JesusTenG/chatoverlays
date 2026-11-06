import Link from 'next/link';
import { StructuredData } from '@/components/site-chrome';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('/404.html', 'Seite nicht gefunden | Chat Overlays', 'Entdecke die Chat-Overlays von JesusTenG.');

export default function NotFoundPage() {
  return <section className="wrap error-page"><h1>Dieser Chat<br/>ist gerade leer.</h1><p>Die gesuchte Seite gibt es hier nicht. Dein nächster Style wartet in der Galerie.</p><Link className="button" href="/">Zur Galerie</Link><StructuredData data={{ '@type': 'WebPage', name: 'Seite nicht gefunden' }}/></section>;
}
