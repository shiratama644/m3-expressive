/**
 * M3E color roles — names follow the Material 3 (2025 spec) color role list.
 * `getter` maps to the camelCase getter on `DynamicScheme`
 * (from @material/material-color-utilities).
 */
export type M3EColorRole =
  | 'primary'
  | 'on-primary'
  | 'primary-container'
  | 'on-primary-container'
  | 'primary-dim'
  | 'primary-fixed'
  | 'primary-fixed-dim'
  | 'on-primary-fixed'
  | 'on-primary-fixed-variant'
  | 'secondary'
  | 'on-secondary'
  | 'secondary-container'
  | 'on-secondary-container'
  | 'secondary-dim'
  | 'secondary-fixed'
  | 'secondary-fixed-dim'
  | 'on-secondary-fixed'
  | 'on-secondary-fixed-variant'
  | 'tertiary'
  | 'on-tertiary'
  | 'tertiary-container'
  | 'on-tertiary-container'
  | 'tertiary-dim'
  | 'tertiary-fixed'
  | 'tertiary-fixed-dim'
  | 'on-tertiary-fixed'
  | 'on-tertiary-fixed-variant'
  | 'error'
  | 'on-error'
  | 'error-container'
  | 'on-error-container'
  | 'error-dim'
  | 'background'
  | 'on-background'
  | 'surface'
  | 'on-surface'
  | 'surface-dim'
  | 'surface-bright'
  | 'surface-container-lowest'
  | 'surface-container-low'
  | 'surface-container'
  | 'surface-container-high'
  | 'surface-container-highest'
  | 'surface-variant'
  | 'on-surface-variant'
  | 'inverse-surface'
  | 'inverse-on-surface'
  | 'inverse-primary'
  | 'outline'
  | 'outline-variant'
  | 'shadow'
  | 'scrim'
  | 'surface-tint';

/** Roles that pair a container color with an "on" color (for swatch groups). */
export const COLOR_ROLE_GROUPS = [
  {
    name: 'Primary',
    roles: ['primary', 'on-primary', 'primary-container', 'on-primary-container'],
  },
  {
    name: 'Secondary',
    roles: ['secondary', 'on-secondary', 'secondary-container', 'on-secondary-container'],
  },
  {
    name: 'Tertiary',
    roles: ['tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container'],
  },
  { name: 'Error', roles: ['error', 'on-error', 'error-container', 'on-error-container'] },
  {
    name: 'Neutral',
    roles: [
      'background',
      'on-background',
      'surface',
      'on-surface',
      'surface-variant',
      'on-surface-variant',
    ],
  },
  {
    name: 'Surface containers',
    roles: [
      'surface-dim',
      'surface-container-lowest',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
      'surface-bright',
    ],
  },
  {
    name: 'Outline & misc',
    roles: [
      'outline',
      'outline-variant',
      'shadow',
      'scrim',
      'inverse-surface',
      'inverse-on-surface',
      'inverse-primary',
    ],
  },
  {
    name: 'Fixed (2025)',
    roles: [
      'primary-fixed',
      'primary-fixed-dim',
      'on-primary-fixed',
      'on-primary-fixed-variant',
      'secondary-fixed',
      'secondary-fixed-dim',
      'on-secondary-fixed',
      'on-secondary-fixed-variant',
      'tertiary-fixed',
      'tertiary-fixed-dim',
      'on-tertiary-fixed',
      'on-tertiary-fixed-variant',
    ],
  },
  { name: 'Dim (2025)', roles: ['primary-dim', 'secondary-dim', 'tertiary-dim', 'error-dim'] },
] as const satisfies { name: string; roles: readonly M3EColorRole[] }[];

export const M3E_COLOR_ROLES = COLOR_ROLE_GROUPS.flatMap((g) => g.roles) as M3EColorRole[];

/** kebab role -> DynamicScheme getter name */
export function roleToGetter(role: M3EColorRole): string {
  return role.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}
