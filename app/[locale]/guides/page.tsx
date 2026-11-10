import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { GuidesPage, guidesMetadata } from '@/components/guide-pages';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return guidesMetadata(locale); }
export default async function Page({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <GuidesPage locale={locale}/>; }
