'use client';

import Link from 'next/link';
import { useLocale } from './locale-provider';
import { localizePath } from '@/lib/routing.mjs';
import type { Template } from '@/lib/catalog';
import { PreviewMedia } from './preview-media';

export function TemplateCard({ template, hidden = false }: { template: Template; hidden?: boolean }) {
  const { locale, t } = useLocale();
  return <article className="template-card" data-hover-preview data-template data-slug={template.slug} data-category={template.categorySlug} hidden={hidden}>
    <PreviewMedia template={template} mode="hover" active={!hidden}/>
    <Link prefetch={false} className="card-info" href={localizePath(`/overlays/${template.slug}/`, locale)}><h3>{template.name}</h3><span className="card-detail-label">{t.ui.details}</span></Link>
  </article>;
}
