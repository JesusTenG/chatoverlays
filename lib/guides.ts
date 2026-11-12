import en from '@/source/guides/en.json';
import de from '@/source/guides/de.json';
import es from '@/source/guides/es.json';
import enSetup from '@/source/guides/setup.en.json';
import deSetup from '@/source/guides/setup.de.json';
import esSetup from '@/source/guides/setup.es.json';
import type { Locale } from './i18n';
import { guideSlugs } from '@/source/guides/routes.mjs';

export type GuideExample = { slug: string; skinId?: number; why: string };
export type GuideArticle = {
  title: string; description: string; heading: string; intro: string; answer: string;
  steps: string[][]; examples: GuideExample[]; notes: string[][]; faq: string[][];
  related: string[]; sources: { label: string; url: string }[];
  stepsFirst?: boolean;
  reference?: { title: string; columns: string[]; rows: string[][] };
};
type GuideBundle = { ui: typeof en.ui; articles: Record<string, GuideArticle> };
const bundles: Record<Locale, GuideBundle> = {
  en: { ...en, articles: { ...en.articles, ...enSetup } },
  de: { ...de, articles: { ...de.articles, ...deSetup } },
  es: { ...es, articles: { ...es.articles, ...esSetup } },
};
export const getGuideBundle = (locale: Locale) => bundles[locale];
export const getGuides = (locale: Locale) => guideSlugs.map(slug => ({ slug, ...bundles[locale].articles[slug] }));
export const getGuide = (slug: string, locale: Locale) => guideSlugs.includes(slug) ? bundles[locale].articles[slug] : undefined;
export { guidesPath, guideSlugs, guideGroups, articlePath } from '@/source/guides/routes.mjs';
