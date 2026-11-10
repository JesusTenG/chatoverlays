import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { guideSlugs } from '@/lib/guides';
import { GuideArticlePage, articleMetadata } from '@/components/guide-pages';
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return guideSlugs.map(slug => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return articleMetadata(slug, locale); }
export default async function Page({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return <GuideArticlePage slug={slug} locale={locale}/>; }
