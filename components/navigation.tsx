'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BrandMark, ShopButton } from './site-chrome';

const links = [{ id: 'templates', label: 'Templates' }, { id: 'so-gehts', label: 'So geht’s' }, { id: 'creator', label: 'Creator' }];

export function Header() {
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
      if (pathname !== '/') { setActive(pathname.startsWith('/overlays/') || pathname.startsWith('/styles/') ? 'templates' : ''); return; }
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
      <Link className="brand" href="/" aria-label="Chat Overlays Startseite" onClick={() => setOpen(false)}><BrandMark/><span>chatoverlays</span></Link>
      <nav className="desktop-nav" aria-label="Hauptnavigation">{links.map(link => <Link key={link.id} href={`/#${link.id}`} className={active === link.id ? 'active' : ''} aria-current={active === link.id ? 'location' : undefined}>{link.label}</Link>)}</nav>
      <ShopButton className="nav-shop" label="Zum Shop"/>
      <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}><span>{open ? 'Schließen' : 'Menü'}</span><span className="menu-lines" aria-hidden="true"><i/><i/></span></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile Navigation" hidden={!open}>{links.map(link => <Link key={link.id} href={`/#${link.id}`} onClick={() => setOpen(false)}>{link.label}</Link>)}<ShopButton label="Zum Template-Shop"/></nav>
  </header>;
}
