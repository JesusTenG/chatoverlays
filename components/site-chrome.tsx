import Link from 'next/link';
import type { ReactNode } from 'react';
import { config, type Category } from '@/lib/catalog';

export function BrandMark() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M25 6H9a4 4 0 0 0-4 4v14l6-5h14a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M16 24v3a4 4 0 0 0 4 4h9l6 5V19a4 4 0 0 0-4-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function ChatStyleLogo() {
  return <img className="chatstyle-logo" src="/assets/chatstyle-logo.svg" alt="ChatStyle" width="166" height="50"/>;
}

export function ChatStyleLink({ href = config.creatorUrl, children, className = '', id }: { href?: string; children?: ReactNode; className?: string; id?: string }) {
  return <a id={id} className={`chatstyle-link ${className}`} href={href} target="_blank" rel="noopener">
    {children ?? <ChatStyleLogo/>} <span aria-hidden="true">↗</span><span className="sr-only"> (öffnet einen neuen Tab)</span>
  </a>;
}

export function Header() {
  return <header className="site-header wrap">
    <Link className="brand" href="/" aria-label="Chat Overlays Startseite"><BrandMark/><span>chatoverlays</span></Link>
    <nav aria-label="Hauptnavigation"><Link href="/#templates">Templates</Link><Link href="/#so-gehts">So geht’s</Link><ChatStyleLink/></nav>
  </header>;
}

export function Footer() {
  return <footer className="footer wrap"><span>© JesusTenG</span><nav aria-label="Weitere Seiten"><Link href="/ratgeber/chat-overlay-auswaehlen/">Ratgeber</Link><ChatStyleLink/></nav></footer>;
}

export function Breadcrumbs({ name, category }: { name: string; category?: Category }) {
  return <nav className="breadcrumbs" aria-label="Brotkrümelnavigation"><Link href="/">Start</Link><span aria-hidden="true">/</span>{category && <><Link href={`/styles/${category.slug}/`}>{category.name}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{name}</span></nav>;
}

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replaceAll('<', '\\u003c') }}/>;
}
