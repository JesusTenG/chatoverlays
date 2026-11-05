import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Header, Footer } from '@/components/site-chrome';
import { VideoProvider } from '@/components/video-provider';
import { RevealEffects } from '@/components/reveal-effects';
import { config } from '@/lib/catalog';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(config.origin),
  icons: { icon: '/assets/favicon.svg' },
  robots: { index: config.indexable, follow: true },
};
export const viewport: Viewport = { themeColor: '#f6f0e6' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="de"><head><link rel="preload" href="/assets/fonts/fraunces-800.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></head><body>
    <VideoProvider><a className="skip-link" href="#main">Zum Inhalt</a><Header/><main id="main">{children}</main><Footer/><RevealEffects/></VideoProvider>
  </body></html>;
}
