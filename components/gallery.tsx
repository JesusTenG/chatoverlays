'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Template } from '@/lib/catalog';
import { useLocale } from './locale-provider';
import { TemplateCard } from './template-card';

const normalize = (value: string) => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('ß', 'ss');

export function Gallery({ items }: { items: Template[] }) {
  const { locale, t } = useLocale();
  const [query, setQuery] = useState('');
  const [style, setStyle] = useState('all');
  const [limit, setLimit] = useState(9);
  const searchRef = useRef<HTMLInputElement>(null);
  const nextFocusRef = useRef<string | null>(null);
  const availableCategories = useMemo(() => Object.entries(t.categories).map(([slug, category]) => ({ slug, ...category })).filter(category => items.some(item => item.categorySlug === category.slug)), [items, t]);
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
    document.querySelector<HTMLAnchorElement>(`#template-grid [data-preview="${nextFocusRef.current}"]`)?.focus({ preventScroll: true });
    nextFocusRef.current = null;
  }, [limit]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName ?? '') && !active?.isContentEditable) {
        event.preventDefault(); searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);

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
      <label className="search-field"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input ref={searchRef} type="search" id="template-search" placeholder={t.ui.search} aria-label={t.ui.searchLabel} autoComplete="off" value={query} onChange={event => updateFilters(event.target.value, style)}/></label>
      <label className="filter-field"><span className="sr-only">{t.ui.filter}</span><select id="template-filter" value={style} onChange={event => updateFilters(query, event.target.value)}><option value="all">{t.ui.allStyles}</option>{availableCategories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
      <p id="result-count" role="status" aria-live="polite">{matches.length ? (new Intl.PluralRules(locale).select(matches.length) === 'one' ? t.ui.countOne : t.ui.count).replace('{shown}', String(visible.size)).replace('{total}', String(matches.length)) : t.ui.noResults}</p>
    </div>
    <div className="template-grid" id="template-grid">{items.map(template => <TemplateCard key={template.slug} template={template} hidden={!visible.has(template.slug)}/>)}</div>
    <div className="empty-state" id="empty-state" hidden={matches.length > 0}><h3>{t.ui.empty}</h3><button className="text-button" id="reset-filters" onClick={() => { updateFilters('', 'all'); searchRef.current?.focus(); }}>{t.ui.reset}</button></div>
    <div className="load-more"><button className="button button-outline" id="load-more" hidden={visible.size >= matches.length} onClick={() => { nextFocusRef.current = matches[limit]?.slug ?? null; setLimit(value => value + 9); }}>{t.ui.more}</button></div>
  </>;
}
