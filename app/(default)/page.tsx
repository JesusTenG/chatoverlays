import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { HomePage, homeMetadata } from '@/components/pages';
type Props = { params?: Promise<Record<string, never>> };
export async function generateMetadata({ params }: Props) { const locale = 'en'; return homeMetadata(locale); }
export default async function Page({ params }: Props) { const locale = 'en'; return <HomePage locale={locale}/>; }
