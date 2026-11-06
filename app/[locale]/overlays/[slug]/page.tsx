import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { catalog } from '@/lib/catalog';
import { TemplatePage, templateMetadata } from '@/components/pages';
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return templateMetadata(slug, locale); }
export default async function Page({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return <TemplatePage slug={slug} locale={locale}/>; }
