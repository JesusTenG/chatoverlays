'use client';

import { useState } from 'react';
import { useLocale } from './locale-provider';

type Look = { name: string; skin: string; preview: string };

export function ChatMakeover({ looks }: { looks: Look[] }) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState(0);
  const look = looks[selected];
  const copy = t.makeover;
  return <section id="comparison" className="chat-makeover" aria-labelledby="comparison-title">
    <div className="makeover-heading"><h2 id="comparison-title">{copy.heading}</h2>
      <div className="makeover-options" role="group" aria-label={copy.choose}>{looks.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
    </div>
    <div className="makeover-pair">
      <figure className="makeover-panel"><figcaption><span>{copy.before}</span><strong>{copy.plain}</strong></figcaption>
        <div className="makeover-stage"><div className="plain-chat"><span className="plain-username">JesusTenG:</span>{' '}{t.ui.sampleText}</div></div>
      </figure>
      <figure className="makeover-panel makeover-result"><figcaption><span>{copy.after}</span><strong aria-live="polite">{look.name} · {look.skin}</strong></figcaption>
        <div className="makeover-stage"><iframe key={look.preview} src={locale === 'de' ? look.preview : look.preview.replace('.html', `.${locale}.html`)} title={`${look.name} · ${look.skin}`} sandbox="allow-same-origin" referrerPolicy="no-referrer"/></div>
      </figure>
    </div>
    <p className="makeover-caption">{copy.caption}</p>
  </section>;
}
