'use client';
import Link from 'next/link';
import { useLocale } from './locale-provider';
import { localizePath } from '@/lib/routing.mjs';
import { StructuredData } from './site-chrome';
export function NotFoundContent() {
  const { locale, t } = useLocale();
  return <section className="wrap error-page"><h1>{t.error.heading[0]}<br/>{t.error.heading[1]}</h1><p>{t.error.text}</p><Link className="button" href={localizePath('/', locale)}>{t.error.back}</Link><StructuredData data={{ '@type': 'WebPage', inLanguage: locale, name: t.error.title }}/></section>;
}
