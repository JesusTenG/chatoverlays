import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { GuidePage, guideMetadata } from '@/components/pages';
type Props = { params?: Promise<Record<string, never>> };
export async function generateMetadata({ params }: Props) { const locale = 'en'; return guideMetadata(locale); }
export default async function Page({ params }: Props) { const locale = 'en'; return <GuidePage locale={locale}/>; }
