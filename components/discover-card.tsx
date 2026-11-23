import Link from 'next/link';
import { getMessages, localizePath, type Locale } from '@/lib/i18n';
import { ChatStyleButton } from './site-chrome';

export function DiscoverCard({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).discovery;
  return <aside className="discover-card">
    <h2>{copy.title}</h2>
    <p>{copy.text}</p>
    <div className="discover-actions">
      <Link className="button button-preview" href={localizePath('/#templates', locale)}>{copy.gallery}</Link>
      <ChatStyleButton href="https://chatstyle.gg/templates" label={copy.chatstyle}/>
    </div>
  </aside>;
}
