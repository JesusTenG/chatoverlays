import type { ReactNode } from 'react';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/site-layout';
export const metadata = siteMetadata;
export const viewport = siteViewport;
export default function Layout({ children }: { children: ReactNode }) { return <SiteLayout locale="en">{children}</SiteLayout>; }
