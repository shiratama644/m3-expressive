import type { M3EConfig } from '@/lib/m3e/config';

/** Families the studio can pick from (subset of the type engine's TypeFamily). */
export const M3E_FAMILIES = ['roboto-flex', 'roboto', 'system'] as const;
export type StudioFamily = M3EConfig['typeFamily'];

export const FAMILY_LABELS: Record<StudioFamily, string> = {
  'roboto-flex': 'Roboto Flex (variable)',
  roboto: 'Roboto',
  system: 'System UI',
};
