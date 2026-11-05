import rawCatalog from '@/source/catalog.json';
import { notes, categories } from '@/source/editorial.mjs';
import config from '@/site.config.json';

export { categories, config };
export type Category = (typeof categories)[number];
export type Template = Omit<(typeof rawCatalog)[number], 'sourceImage' | 'sourceVideo'> & {
  category: string;
  description: string;
  advice: string;
  categorySlug: string;
  shopUrl: string;
};

export const featuredSlugs = ['sleeping-cats', 'neo-tokyo', 'lofi-windows-93'];
export const shopUrl = (url: string) => `${url}?utm_source=chatoverlays&utm_medium=referral&utm_campaign=jesusteng-gallery`;
export const catalog: Template[] = rawCatalog.map(({ sourceImage, sourceVideo, ...template }) => {
  const editorial = (notes as Record<string, string[]>)[template.slug];
  if (!editorial) throw new Error(`Missing editorial: ${template.slug}`);
  const [category, description, advice] = editorial;
  const categorySlug = categories.find(item => item.name === category)?.slug;
  if (!categorySlug) throw new Error(`Missing category: ${template.slug}`);
  return { ...template, category, description, advice, categorySlug, shopUrl: shopUrl(template.url) };
}).sort((a, b) => {
  const rank = (slug: string) => featuredSlugs.includes(slug) ? featuredSlugs.indexOf(slug) : 99;
  return rank(a.slug) - rank(b.slug);
});

export const featuredTemplates = featuredSlugs.map(slug => catalog.find(item => item.slug === slug)!);
export const getTemplate = (slug: string) => catalog.find(item => item.slug === slug);
export const absoluteUrl = (path: string) => new URL(path, config.origin).href;
