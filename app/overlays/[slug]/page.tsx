import { notFound } from 'next/navigation';
import { catalog, categories, getTemplate, absoluteUrl, config } from '@/lib/catalog';
import { pageMetadata } from '@/lib/metadata';
import { Breadcrumbs, ShopButton, StructuredData } from '@/components/site-chrome';
import { PreviewMedia } from '@/components/preview-media';
import { TemplateCard } from '@/components/template-card';
import { SkinGallery } from '@/components/skin-gallery';
import { getSkins } from '@/lib/skins';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const template = getTemplate((await params).slug);
  if (!template) notFound();
  return pageMetadata(`/overlays/${template.slug}/`, `${template.name} – ${template.category} Chat-Overlay | JesusTenG`, `${template.description} Originalvideo ansehen und das Template auf Chatstyle entdecken.`, template.image);
}

export default async function TemplatePage({ params }: Props) {
  const template = getTemplate((await params).slug);
  if (!template) notFound();
  const category = categories.find(item => item.slug === template.categorySlug)!;
  const related = catalog.filter(item => item.slug !== template.slug && item.categorySlug === template.categorySlug).slice(0, 3);
  const skins = getSkins(template.slug);
  return <div className="wrap detail-page">
    <Breadcrumbs name={template.name} category={category}/>
    <section className="detail-hero"><PreviewMedia key={template.slug} template={template} mode="detail"/><div className="detail-copy">
      <h1 data-reveal>{template.name}</h1><p className="lead">{template.description}</p>
      <ShopButton href={template.shopUrl} label={template.free ? 'Template holen' : 'Template kaufen'}/>
      <p className="shop-note">{template.free ? 'Kostenlos auf Chatstyle.' : 'Preis und Anpassungen findest du auf Chatstyle.'}</p>
      <div className="design-note"><h2>Für deinen Stream</h2><p>{template.advice}</p></div>
    </div></section>
    {skins.length > 0 && <SkinGallery key={template.slug} skins={skins} templateName={template.name}/>}
    <section className="section related-section"><h2 data-reveal>Mehr in diesem Stil.</h2><div className="template-grid">{related.map(item => <TemplateCard key={item.slug} template={item}/>)}</div></section>
    <StructuredData data={{ '@graph': [
      { '@type': 'CreativeWork', name: template.name, description: template.description, image: absoluteUrl(template.image), url: absoluteUrl(`/overlays/${template.slug}/`), creator: { '@type': 'Person', name: config.creator, url: config.creatorUrl }, sameAs: template.url },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Start', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/styles/${category.slug}/`) },
        { '@type': 'ListItem', position: 3, name: template.name, item: absoluteUrl(`/overlays/${template.slug}/`) },
      ] },
    ] }}/>
  </div>;
}
