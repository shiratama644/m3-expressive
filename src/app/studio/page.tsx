import type { Metadata } from 'next';
import { paramsToState, type StudioState } from '@/components/studio/state';
import { Studio } from './studio';

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Design a Material 3 Expressive theme visually — seed color, contrast, shapes, motion and typography — and export code for Next.js, React, Vue or Tailwind CSS.',
};

/**
 * Read the share-link query on the SERVER, so the initial theme is correct in
 * the first HTML (no hydration games, no setState-in-effect bootstrapping).
 */
export default async function StudioPage({ searchParams }: PageProps<'/studio'>) {
  const query = await searchParams;
  const search = new URLSearchParams(
    Object.fromEntries(Object.entries(query).filter(([, v]) => typeof v === 'string')) as Record<
      string,
      string
    >,
  ).toString();
  const initial: StudioState = paramsToState(search);
  return <Studio initialState={initial} />;
}
