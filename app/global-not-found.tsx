import { SiteLayout } from '@/components/site-layout';
import { NotFoundContent } from '@/components/not-found-content';
import { getMessages } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/catalog';
const { error } = getMessages('en');
export const metadata = { title: error.title, description: error.description, robots: { index: false, follow: true }, alternates: { canonical: absoluteUrl('/404.html') } };
export default function GlobalNotFound() { return <SiteLayout locale="en"><NotFoundContent/></SiteLayout>; }
