import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { GuidePage, guideMetadata } from '@/components/pages';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return guideMetadata(locale); }
export default async function Page({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <GuidePage locale={locale}/>; }
