'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark, ChatStyleButton } from './site-chrome';
import { useLocale } from './locale-provider';
import { LanguageSwitcher } from './language-switcher';
import { localizePath, stripLocale } from '@/lib/routing.mjs';



export function Header() {
  const { locale, t } = useLocale();
  const links = [{ id: 'templates', label: t.ui.templates }, { id: 'so-gehts', label: t.ui.how }, { id: 'creator', label: t.ui.about }];
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0; setScrolled(window.scrollY > 32);
      const base = stripLocale(pathname);
      if (base !== '/') { setActive(base.startsWith('/overlays/') || base.startsWith('/styles/') ? 'templates' : ''); return; }
      let current = '';
      for (const { id } of links) { const element = document.getElementById(id); if (element && element.getBoundingClientRect().top < 180) current = id; }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', key); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside); };
  }, [open]);

  return <header ref={rootRef} className={`nav-shell${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}>
    <div className="nav-bar">
      <Link className="brand" href={localizePath('/', locale)} aria-label={t.ui.homeLabel} onClick={() => setOpen(false)}><BrandMark/><span>chatoverlays</span></Link>
      <nav className="desktop-nav" aria-label={t.ui.mainNav}>{links.map(link => <Link key={link.id} href={localizePath(`/#${link.id}`, locale)} className={active === link.id ? 'active' : ''} aria-current={active === link.id ? 'location' : undefined}>{link.label}</Link>)}</nav>
      <ChatStyleButton className="nav-shop" label={t.ui.templatesOn}/>
      <LanguageSwitcher/>
      <button ref={toggleRef} className="menu-toggle" aria-label={open ? t.ui.closeMenu : t.ui.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}><span>{t.ui.menu}</span><span className="menu-lines" aria-hidden="true"><i/><i/></span></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label={t.ui.mobileNav} hidden={!open}>{links.map(link => <Link key={link.id} href={localizePath(`/#${link.id}`, locale)} onClick={() => setOpen(false)}>{link.label}</Link>)}<ChatStyleButton label={t.ui.templatesOn}/></nav>
  </header>;
}
