import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { catalog } from '@/lib/catalog';
import { TemplatePage, templateMetadata } from '@/components/pages';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const { slug } = await params; const locale = 'en'; return templateMetadata(slug, locale); }
export default async function Page({ params }: Props) { const { slug } = await params; const locale = 'en'; return <TemplatePage slug={slug} locale={locale}/>; }
