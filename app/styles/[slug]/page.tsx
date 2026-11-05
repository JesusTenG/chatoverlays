import { notFound } from 'next/navigation';
import { catalog, categories, absoluteUrl } from '@/lib/catalog';
import { pageMetadata } from '@/lib/metadata';
import { Gallery } from '@/components/gallery';
import { Breadcrumbs, StructuredData } from '@/components/site-chrome';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const current = categories.find(item => item.slug === slug);
  if (!current) notFound();
  return pageMetadata(`/styles/${current.slug}/`, `${current.name} Chat-Overlays für deinen Stream | JesusTenG`, current.intro);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find(item => item.slug === slug);
  if (!category) notFound();
  return <div className="wrap"><Breadcrumbs name={category.name}/><section className="category-hero"><h1 data-reveal>{category.name}</h1><p className="lead">{category.intro}</p></section><section className="section category-gallery"><Gallery items={catalog.filter(item => item.categorySlug === slug)}/></section><aside className="category-tip"><h2 data-reveal>Für deinen Stream</h2><p>{category.tip}</p></aside><StructuredData data={{ '@type': 'CollectionPage', name: `${category.name} Chat-Overlays`, url: absoluteUrl(`/styles/${slug}/`), description: category.intro }}/></div>;
}
