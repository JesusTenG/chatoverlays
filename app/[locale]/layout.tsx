import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/site-layout';
import { isLocale } from '@/lib/i18n';
export const metadata = siteMetadata;
export const viewport = siteViewport;
export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: 'de' }, { locale: 'es' }]; }
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale) || locale === 'en') notFound(); return <SiteLayout locale={locale}>{children}</SiteLayout>; }
