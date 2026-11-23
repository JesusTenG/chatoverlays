import en from '@/source/guides/en.json';
import de from '@/source/guides/de.json';
import es from '@/source/guides/es.json';
import enSetup from '@/source/guides/setup.en.json';
import deSetup from '@/source/guides/setup.de.json';
import esSetup from '@/source/guides/setup.es.json';
import enMakeover from '@/source/guides/makeover.en.json';
import deMakeover from '@/source/guides/makeover.de.json';
import esMakeover from '@/source/guides/makeover.es.json';
import enPlatform from '@/source/guides/platform.en.json';
import dePlatform from '@/source/guides/platform.de.json';
import esPlatform from '@/source/guides/platform.es.json';
import type { Locale } from './i18n';
import { guideSlugs } from '@/source/guides/routes.mjs';
import { getTemplate } from './catalog';
import freeCatalog from '@/source/free-templates.json';

export type GuideExample = { slug: string; skinId?: number; why: string };
export type GuideArticle = {
  title: string; description: string; heading: string; intro: string; answer: string;
  steps: string[][]; examples: GuideExample[]; notes: string[][]; faq: string[][];
  related: string[]; sources: { label: string; url: string }[];
  stepsFirst?: boolean;
  comparison?: boolean;
  communityExamples?: boolean;
  reference?: { title: string; columns: string[]; rows: string[][] };
};
type GuideBundle = { ui: typeof en.ui; articles: Record<string, GuideArticle> };
const bundles: Record<Locale, GuideBundle> = {
  en: { ...en, articles: { ...en.articles, ...enSetup, 'chat-overlay-before-after': enMakeover, ...enPlatform } },
  de: { ...de, articles: { ...de.articles, ...deSetup, 'chat-overlay-before-after': deMakeover, ...dePlatform } },
  es: { ...es, articles: { ...es.articles, ...esSetup, 'chat-overlay-before-after': esMakeover, ...esPlatform } },
};
export const getGuideBundle = (locale: Locale) => bundles[locale];
export const getGuides = (locale: Locale) => guideSlugs.map(slug => ({ slug, ...bundles[locale].articles[slug] }));
export const getGuide = (slug: string, locale: Locale) => guideSlugs.includes(slug) ? bundles[locale].articles[slug] : undefined;
export function getGuideTemplate(slug: string, locale: Locale) {
  const local = getTemplate(slug, locale);
  if (local) return { ...local, localDetail: true };
  const community = freeCatalog.templates.find(template => template.slug === slug);
  return community ? { ...community, localDetail: false, shopUrl: community.url } : undefined;
}
export { guidesPath, guideSlugs, guideGroups, articlePath } from '@/source/guides/routes.mjs';
