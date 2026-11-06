import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { HomePage, homeMetadata } from '@/components/pages';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return homeMetadata(locale); }
export default async function Page({ params }: Props) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <HomePage locale={locale}/>; }
