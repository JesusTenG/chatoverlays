import { GuidesPage, guidesMetadata } from '@/components/guide-pages';
export function generateMetadata() { return guidesMetadata('en'); }
export default function Page() { return <GuidesPage locale="en"/>; }
