'use client';

import Link from 'next/link';
import { useLocale } from './locale-provider';
import { localizePath } from '@/lib/routing.mjs';
import type { Template } from '@/lib/catalog';
import { ChatStyleLink } from './site-chrome';
import { PreviewMedia } from './preview-media';

export function TemplateCard({ template, hidden = false }: { template: Template; hidden?: boolean }) {
  const { locale } = useLocale();
  return <article className="template-card" data-hover-preview data-template data-slug={template.slug} data-category={template.categorySlug} hidden={hidden}>
    <PreviewMedia template={template} mode="hover" active={!hidden}/>
    <div className="card-info"><h3><Link prefetch={false} href={localizePath(`/overlays/${template.slug}/`, locale)}>{template.name}</Link></h3><ChatStyleLink href={template.shopUrl} className="shop-link"/></div>
  </article>;
}
