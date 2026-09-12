/**
 * Package-manager command templates.
 * The site itself AND every generated artifact must provide commands for all
 * four supported package managers.
 */
export const PACKAGE_MANAGERS = ['bun', 'pnpm', 'npm', 'yarn'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const PM_LABELS: Record<PackageManager, string> = {
  bun: 'Bun',
  pnpm: 'pnpm',
  npm: 'npm',
  yarn: 'Yarn',
};

interface PmCommands {
  /** add runtime deps */
  add: (deps: string[]) => string;
  /** add dev deps */
  addDev: (deps: string[]) => string;
  /** run a package's bin (bunx / pnpm dlx / npx / yarn dlx) */
  exec: (pkg: string, args?: string) => string;
  /** scaffold a project */
  create: (template: string) => string;
  /** run package.json script */
  run: (script: string) => string;
  install: () => string;
  /** command that makes pnpm/yarn allow build scripts if required (no-op for bun/npm) */
  approveBuilds?: () => string;
}

const list = (deps: string[]) => deps.join(' ');

export const PM: Record<PackageManager, PmCommands> = {
  bun: {
    add: (deps) => `bun add ${list(deps)}`,
    addDev: (deps) => `bun add -d ${list(deps)}`,
    exec: (pkg, args) => `bunx ${pkg}${args ? ` ${args}` : ''}`,
    create: (template) => `bun create ${template}`,
    run: (script) => `bun run ${script}`,
    install: () => `bun install`,
  },
  pnpm: {
    add: (deps) => `pnpm add ${list(deps)}`,
    addDev: (deps) => `pnpm add -D ${list(deps)}`,
    exec: (pkg, args) => `pnpm dlx ${pkg}${args ? ` ${args}` : ''}`,
    create: (template) => `pnpm create ${template}`,
    run: (script) => `pnpm ${script}`,
    install: () => `pnpm install`,
    approveBuilds: () => `pnpm approve-builds`,
  },
  npm: {
    add: (deps) => `npm install ${list(deps)}`,
    addDev: (deps) => `npm install -D ${list(deps)}`,
    exec: (pkg, args) => `npx ${pkg}${args ? ` ${args}` : ''}`,
    create: (template) => `npm create ${template}`,
    run: (script) => `npm run ${script}`,
    install: () => `npm install`,
  },
  yarn: {
    add: (deps) => `yarn add ${list(deps)}`,
    addDev: (deps) => `yarn add -D ${list(deps)}`,
    exec: (pkg, args) => `yarn dlx ${pkg}${args ? ` ${args}` : ''}`,
    create: (template) => `yarn create ${template}`,
    run: (script) => `yarn ${script}`,
    install: () => `yarn install`,
  },
};
