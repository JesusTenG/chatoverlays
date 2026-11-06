'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import config from '@/site.config.json';
import type { Category } from '@/lib/catalog';
import { localizePath, guidePath } from '@/lib/routing.mjs';
import { useLocale } from './locale-provider';

export function BrandMark() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M25 6H9a4 4 0 0 0-4 4v14l6-5h14a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M16 24v3a4 4 0 0 0 4 4h9l6 5V19a4 4 0 0 0-4-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function ChatStyleLogo() {
  return <img className="chatstyle-logo" src="/assets/chatstyle-logo.svg" alt="ChatStyle" width="166" height="50"/>;
}

export function ChatStyleLink({ href = config.creatorUrl, children, className = '', id }: { href?: string; children?: ReactNode; className?: string; id?: string }) {
  const { t } = useLocale();
  return <a id={id} className={`chatstyle-link ${className}`} href={href} target="_blank" rel="noopener">
    {children ?? <ChatStyleLogo/>}<span className="sr-only"> ({t.ui.newTab})</span>
  </a>;
}

export function ChatStyleButton({ href = config.creatorUrl, label, className = '', id }: { href?: string; label?: string; className?: string; id?: string }) {
  const { t } = useLocale();
  return <ChatStyleLink href={href} className={`button shop-button ${className}`} id={id}><span>{label ?? t.ui.viewOn}</span><span className="shop-brand"><ChatStyleLogo/></span></ChatStyleLink>;
}

export function Footer() {
  const { locale, t } = useLocale();
  return <footer className="footer wrap"><span>© JesusTenG</span><nav aria-label={t.ui.morePages}><Link href={localizePath(guidePath, locale)}>{t.ui.guide}</Link><ChatStyleLink/></nav></footer>;
}

export function Breadcrumbs({ name, category }: { name: string; category?: Category }) {
  const { locale, t } = useLocale();
  return <nav className="breadcrumbs" aria-label={t.ui.breadcrumbs}><Link href={localizePath('/', locale)}>{t.ui.home}</Link><span aria-hidden="true">/</span>{category && <><Link href={localizePath(`/styles/${category.slug}/`, locale)}>{category.name}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{name}</span></nav>;
}

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replaceAll('<', '\\u003c') }}/>;
}
