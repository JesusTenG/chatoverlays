import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { categories } from '@/lib/catalog';
import { CategoryPage, categoryMetadata } from '@/components/pages';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; const locale = 'en'; return categoryMetadata(slug, locale); }
export default async function Page({ params }: Props) { const { slug } = await params; const locale = 'en'; return <CategoryPage slug={slug} locale={locale}/>; }
