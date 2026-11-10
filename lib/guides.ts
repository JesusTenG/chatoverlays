import en from '@/source/guides/en.json';
import de from '@/source/guides/de.json';
import es from '@/source/guides/es.json';
import type { Locale } from './i18n';
import { guideSlugs } from '@/source/guides/routes.mjs';

export type GuideExample = { slug: string; skinId?: number; why: string };
export type GuideArticle = {
  title: string; description: string; heading: string; intro: string; answer: string;
  steps: string[][]; examples: GuideExample[]; notes: string[][]; faq: string[][];
  related: string[]; sources: { label: string; url: string }[];
};
type GuideBundle = { ui: typeof en.ui; articles: Record<string, GuideArticle> };
const bundles: Record<Locale, GuideBundle> = { en, de, es };
export const getGuideBundle = (locale: Locale) => bundles[locale];
export const getGuides = (locale: Locale) => guideSlugs.map(slug => ({ slug, ...bundles[locale].articles[slug] }));
export const getGuide = (slug: string, locale: Locale) => guideSlugs.includes(slug) ? bundles[locale].articles[slug] : undefined;
export { guidesPath, guideSlugs, articlePath } from '@/source/guides/routes.mjs';
