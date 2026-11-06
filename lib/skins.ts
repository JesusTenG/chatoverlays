import imported from '@/source/skins.json';

export type Skin = { id: number; name: string; slug: string; url: string; preview: string; image: string | null; sourceImage: string | null };
type SkinRecord = { sourceUrl: string; importedAt: string; sampleText: string; skins: Skin[] };
const records: Record<string, SkinRecord> = imported;
export function getSkins(templateSlug: string): Skin[] { return records[templateSlug]?.skins ?? []; }
