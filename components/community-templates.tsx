'use client';

import { useState } from 'react';
import freeCatalog from '@/source/free-templates.json';
import { useLocale } from './locale-provider';
import { ChatStyleButton } from './site-chrome';
import { PreviewMedia } from './preview-media';

export function CommunityTemplates() {
  const { t, locale } = useLocale();
  const [shown, setShown] = useState(6);
  const [search, setSearch] = useState('');
  const items = freeCatalog.templates.filter(item => item.name.toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale)));
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${freeCatalog.checkedAt}T12:00:00Z`));
  return <div className="community-gallery">
    <p className="community-checked">{t.community.checked.replace('{count}', String(freeCatalog.templates.length)).replace('{date}', date)}</p>
    <label className="community-search">{t.ui.searchLabel}<input type="search" value={search} placeholder={t.ui.search} onChange={event => { setSearch(event.target.value); setShown(6); }}/></label>
    <div className="guide-examples" id="community-results">{items.map((template, index) => <article key={template.slug} className="guide-example" hidden={index >= shown}>
      <PreviewMedia template={template} mode="hover" active={index < shown} externalUrl={template.url}/>
      <div className="guide-example-copy"><h3>{template.name}</h3><p className="community-meta">{t.community.free}</p><div className="guide-example-links"><ChatStyleButton href={template.url}/></div></div>
    </article>)}</div>
    {items.length === 0 && <p className="community-empty">{t.ui.empty}</p>}
    <p className="community-count" aria-live="polite">{t.ui.count.replace('{shown}', String(Math.min(items.length, shown))).replace('{total}', String(items.length))}</p>
    {shown < items.length && <button type="button" className="button button-preview load-more" aria-controls="community-results" onClick={() => setShown(items.length)}>{t.community.all.replace('{count}', String(items.length))}</button>}
  </div>;
}
