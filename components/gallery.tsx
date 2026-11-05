'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { categories, type Template } from '@/lib/catalog';
import { TemplateCard } from './template-card';
import { useVideoState } from './video-provider';

const normalize = (value: string) => value.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('ß', 'ss');

export function Gallery({ items }: { items: Template[] }) {
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState('all');
  const [limit, setLimit] = useState(9);
  const searchRef = useRef<HTMLInputElement>(null);
  const nextFocusRef = useRef<string | null>(null);
  const { modalOpen } = useVideoState();
  const availableCategories = useMemo(() => categories.filter(category => items.some(item => item.categorySlug === category.slug)), [items]);
  const matches = useMemo(() => {
    const words = normalize(query.trim()).split(/\s+/).filter(Boolean);
    return items.filter(item => (style === 'all' || item.categorySlug === style) && words.every(word => normalize(`${item.name} ${item.category} ${item.tags.join(' ')} ${item.description}`).includes(word)));
  }, [items, query, style]);
  const visible = new Set(matches.slice(0, limit).map(item => item.slug));

  useEffect(() => {
    const readUrl = () => {
      const params = new URLSearchParams(location.search);
      setQuery(params.get('q') ?? '');
      setStyle(availableCategories.some(category => category.slug === params.get('style')) ? params.get('style')! : 'all');
      setLimit(9);
    };
    readUrl();
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  }, [availableCategories]);

  useEffect(() => {
    if (!nextFocusRef.current) return;
    document.querySelector<HTMLButtonElement>(`#template-grid [data-preview="${nextFocusRef.current}"]`)?.focus({ preventScroll: true });
    nextFocusRef.current = null;
  }, [limit]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (event.key === '/' && !modalOpen && !event.ctrlKey && !event.metaKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName ?? '') && !active?.isContentEditable) {
        event.preventDefault(); searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, [modalOpen]);

  function updateFilters(nextQuery: string, nextStyle: string) {
    setQuery(nextQuery); setStyle(nextStyle); setLimit(9);
    const url = new URL(location.href);
    url.searchParams.delete('style'); url.searchParams.delete('q');
    if (nextStyle !== 'all') url.searchParams.set('style', nextStyle);
    if (nextQuery.trim()) url.searchParams.set('q', nextQuery.trim());
    history.replaceState(history.state, '', url);
  }

  return <>
    <div className="gallery-tools">
      <label className="search-field"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input ref={searchRef} type="search" id="template-search" placeholder="Template suchen" aria-label="Templates durchsuchen" autoComplete="off" value={query} onChange={event => updateFilters(event.target.value, style)}/></label>
      <label className="filter-field"><span className="sr-only">Nach Stil filtern</span><select id="template-filter" value={style} onChange={event => updateFilters(query, event.target.value)}><option value="all">Alle Styles</option>{availableCategories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      <p id="result-count" role="status" aria-live="polite">{matches.length ? `${visible.size} von ${matches.length} Templates` : 'Keine Templates gefunden'}</p>
    </div>
    <div className="template-grid" id="template-grid">{items.map(template => <TemplateCard key={template.slug} template={template} hidden={!visible.has(template.slug)}/>)}</div>
    <div className="empty-state" id="empty-state" hidden={matches.length > 0}><h3>Kein Template gefunden.</h3><button className="text-button" id="reset-filters" onClick={() => { updateFilters('', 'all'); searchRef.current?.focus(); }}>Suche zurücksetzen</button></div>
    <div className="load-more"><button className="button button-outline" id="load-more" hidden={visible.size >= matches.length} onClick={() => { nextFocusRef.current = matches[limit]?.slug ?? null; setLimit(value => value + 9); }}>Mehr Templates</button></div>
  </>;
}
