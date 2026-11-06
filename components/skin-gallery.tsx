'use client';

import { useState } from 'react';
import type { Skin } from '@/lib/skins';

export function SkinGallery({ skins, templateName }: { skins: Skin[]; templateName: string }) {
  const [selectedId, setSelectedId] = useState(skins[0]?.id);
  const [background, setBackground] = useState<'light' | 'dark'>('dark');
  const selected = skins.find(skin => skin.id === selectedId) ?? skins[0];
  if (!selected) return null;
  return <section className="skins-section" aria-labelledby="skins-title">
    <div className="skins-heading"><h2 id="skins-title" data-reveal>Ein Look. Deine Variante.</h2><span className="skins-count">{skins.length} Skins</span></div>
    <div className="skins-layout">
      <figure className={`skin-preview-frame skin-background-${background}`}>
        <iframe key={selected.id} src={selected.preview} title={`${templateName} – Skin ${selected.name}`} sandbox="allow-same-origin" loading="lazy" referrerPolicy="no-referrer"/>
        <figcaption className="skin-preview-caption"><span aria-live="polite">{selected.name}</span><div className="skin-backgrounds" role="group" aria-label="Vorschau-Hintergrund"><button className="background-light" aria-label="Heller Hintergrund" aria-pressed={background === 'light'} onClick={() => setBackground('light')}/><button className="background-dark" aria-label="Dunkler Hintergrund" aria-pressed={background === 'dark'} onClick={() => setBackground('dark')}/></div></figcaption>
      </figure>
      <div className="skin-picker" role="group" aria-label="Skin auswählen">{skins.map(skin => <button key={skin.id} className="skin-option" aria-pressed={selected.id === skin.id} onClick={() => setSelectedId(skin.id)}><span className="skin-dot" aria-hidden="true"/>{skin.name}</button>)}</div>
    </div>
  </section>;
}
