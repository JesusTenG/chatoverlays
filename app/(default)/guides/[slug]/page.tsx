import { guideSlugs } from '@/lib/guides';
import { GuideArticlePage, articleMetadata } from '@/components/guide-pages';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return guideSlugs.map(slug => ({ slug })); }
export async function generateMetadata({ params }: Props) { return articleMetadata((await params).slug, 'en'); }
export default async function Page({ params }: Props) { return <GuideArticlePage slug={(await params).slug} locale="en"/>; }
