import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { LocaleProvider } from './locale-provider';
import { Footer } from './site-chrome';
import { Header } from './navigation';
import { VideoProvider } from './video-provider';
import { RevealEffects } from './reveal-effects';
import { getMessages, type Locale } from '@/lib/i18n';
import config from '@/site.config.json';
import '@/app/globals.css';

export const siteMetadata: Metadata = { metadataBase: new URL(config.origin), icons: { icon: '/assets/favicon.svg' }, robots: { index: config.indexable, follow: true } };
export const siteViewport: Viewport = { themeColor: '#f6f0e6' };

export function SiteLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
  const messages = getMessages(locale);
  return <html lang={locale}><head><link rel="preload" href="/assets/fonts/fraunces-800.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></head><body>
    <LocaleProvider locale={locale} messages={messages}><VideoProvider><a className="skip-link" href="#main">{messages.ui.skip}</a><Header/><main id="main">{children}</main><Footer/><RevealEffects/></VideoProvider></LocaleProvider>
  </body></html>;
}
