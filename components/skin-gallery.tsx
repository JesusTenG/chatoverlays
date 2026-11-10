'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from './locale-provider';
import type { Skin } from '@/lib/skins';

export function SkinGallery({ skins, templateName }: { skins: Skin[]; templateName: string }) {
  const { locale, t } = useLocale();
  const [selectedId, setSelectedId] = useState(skins[0]?.id);
  const [background, setBackground] = useState<'light' | 'dark'>('dark');
  const [expanded, setExpanded] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const syncSelection = () => {
      const requested = Number(new URL(window.location.href).searchParams.get('skin'));
      setSelectedId(skins.find(skin => skin.id === requested)?.id ?? skins[0]?.id);
    };
    syncSelection();
    window.addEventListener('popstate', syncSelection);
    return () => window.removeEventListener('popstate', syncSelection);
  }, [skins]);
  const selected = skins.find(skin => skin.id === selectedId) ?? skins[0];
  if (!selected) return null;
  return <section id="skins" className="skins-section" aria-labelledby="skins-title">
    <div className="skins-heading"><h2 id="skins-title" data-reveal>{t.ui.skinsTitle}</h2><span className="skins-count">{skins.length} {new Intl.PluralRules(locale).select(skins.length) === 'one' ? t.ui.skinsOne : t.ui.skins}</span></div>
    <div className="skins-layout">
      <figure ref={previewRef} className={`skin-preview-frame skin-background-${background}`}>
        <iframe key={selected.id} src={locale === 'de' ? selected.preview : selected.preview.replace('.html', `.${locale}.html`)} title={`${templateName} – ${t.ui.skin} ${selected.name}`} sandbox="allow-same-origin" loading="lazy" referrerPolicy="no-referrer"/>
        <figcaption className="skin-preview-caption"><span aria-live="polite">{selected.name}</span><div className="skin-backgrounds" role="group" aria-label={t.ui.previewBackground}><button className="background-light" aria-label={t.ui.lightBackground} aria-pressed={background === 'light'} onClick={() => setBackground('light')}/><button className="background-dark" aria-label={t.ui.darkBackground} aria-pressed={background === 'dark'} onClick={() => setBackground('dark')}/></div></figcaption>
      </figure>
      <div className="skin-choices">
        <div className="skin-picker" id="skin-options" role="group" aria-label={t.ui.chooseSkin}>{skins.map((skin, index) => <button key={skin.id} className="skin-option" hidden={!expanded && index >= 6 && selected.id !== skin.id} aria-pressed={selected.id === skin.id} onClick={() => {
          setSelectedId(skin.id);
          const url = new URL(window.location.href);
          url.searchParams.set('skin', String(skin.id));
          url.hash = 'skins';
          window.history.replaceState(window.history.state, '', url);
          if (window.matchMedia('(max-width: 680px)').matches && previewRef.current && previewRef.current.getBoundingClientRect().top < 90) {
            previewRef.current.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          }
        }}>
          <span className="skin-thumbnail"><img src={skin.preview.replace('.html', '.webp')} alt="" width="360" height="220" loading="lazy" decoding="async"/><span className="skin-selected" aria-hidden="true">✓</span></span>
          <span className="skin-name">{skin.name}</span>
        </button>)}</div>
        {skins.length > 6 && <button className="skin-expand" aria-expanded={expanded} aria-controls="skin-options" onClick={() => setExpanded(!expanded)}>{expanded ? t.ui.fewerSkins : t.ui.allSkins.replace('{count}', String(skins.length))}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>}
      </div>
    </div>
  </section>;
}
