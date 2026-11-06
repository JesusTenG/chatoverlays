import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { categories } from '@/lib/catalog';
import { CategoryPage, categoryMetadata } from '@/components/pages';
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return categoryMetadata(slug, locale); }
export default async function Page({ params }: Props) { const { slug, locale } = await params; if (!isLocale(locale)) notFound(); return <CategoryPage slug={slug} locale={locale}/>; }
