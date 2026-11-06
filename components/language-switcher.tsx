'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from './locale-provider';
import { localizePath, stripLocale, switchLanguageUrl, locales } from '@/lib/routing.mjs';

const names = { en: 'English', de: 'Deutsch', es: 'Español' };
export function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const base = stripLocale(pathname);
  const route = /^\/(?:$|overlays\/|styles\/|ratgeber\/)/.test(base) ? pathname : '/';
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div ref={root} className="language-switcher"><button ref={toggle} className="language-toggle" aria-label={`${t.ui.language}: ${names[locale]}`} aria-expanded={open} aria-controls="language-options" onClick={() => setOpen(value => !value)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span>{locale.toUpperCase()}</span></button><nav className="language-options" id="language-options" aria-label={t.ui.language} hidden={!open}>{locales.map(lang => <a key={lang} href={localizePath(route, lang)} hrefLang={lang} lang={lang} aria-current={lang === locale ? 'true' : undefined} onClick={event => { event.currentTarget.href = switchLanguageUrl(route + location.search + location.hash, lang); }} onAuxClick={event => { event.currentTarget.href = switchLanguageUrl(route + location.search + location.hash, lang); }}>{names[lang]}</a>)}</nav></div>;
}
