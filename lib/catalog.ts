import rawCatalog from '@/source/catalog.json';
import { notes, categories as originalCategories } from '@/source/editorial.mjs';
import enNotes from '@/source/editorial.en.json';
import esNotes from '@/source/editorial.es.json';
import { getMessages, type Locale } from './i18n';
import config from '@/site.config.json';

export { config };
export type Category = (typeof originalCategories)[number];
export function getCategories(locale: Locale): Category[] {
  const translated = getMessages(locale).categories;
  return originalCategories.map(category => ({ ...category, ...translated[category.slug as keyof typeof translated] }));
}
export const categories = getCategories('en');
export type Template = Omit<(typeof rawCatalog)[number], 'sourceImage' | 'sourceVideo'> & {
  category: string;
  description: string;
  advice: string;
  categorySlug: string;
  shopUrl: string;
};

export const featuredSlugs = ['sleeping-cats', 'neo-tokyo', 'lofi-windows-93'];
export const shopUrl = (url: string) => `${url}?utm_source=chatoverlays&utm_medium=referral&utm_campaign=jesusteng-gallery`;
export function getCatalog(locale: Locale): Template[] { return rawCatalog.map(({ sourceImage, sourceVideo, ...template }) => {
  const editorial = (notes as Record<string, string[]>)[template.slug];
  if (!editorial) throw new Error(`Missing editorial: ${template.slug}`);
  const [originalCategory, ...germanText] = editorial;
  const categorySlug = originalCategories.find(item => item.name === originalCategory)?.slug;
  if (!categorySlug) throw new Error(`Missing category: ${template.slug}`);
  const category = getCategories(locale).find(item => item.slug === categorySlug)!.name;
  const translated = locale === 'en' ? enNotes : esNotes;
  const [description, advice] = locale === 'de' ? germanText : (translated as Record<string, string[]>)[template.slug];
  return { ...template, category, description, advice, categorySlug, shopUrl: shopUrl(template.url) };
}).sort((a, b) => {
  const rank = (slug: string) => featuredSlugs.includes(slug) ? featuredSlugs.indexOf(slug) : 99;
  return rank(a.slug) - rank(b.slug);
}); }

export const catalog = getCatalog('en');
export const getFeaturedTemplates = (locale: Locale) => featuredSlugs.map(slug => getCatalog(locale).find(item => item.slug === slug)!);
export const getTemplate = (slug: string, locale: Locale = 'en') => getCatalog(locale).find(item => item.slug === slug);
export const absoluteUrl = (path: string) => new URL(path, config.origin).href;
