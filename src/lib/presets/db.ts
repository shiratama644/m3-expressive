import Dexie, { type Table } from 'dexie';

/** User-saved themes, persisted in IndexedDB (never leaves the browser). */
export interface StoredTheme {
  id?: number;
  name: string;
  /** studio query string (stateToParams output) */
  search: string;
  seed: string;
  createdAt: number;
}

interface M3EDatabase {
  themes: Table<StoredTheme, number>;
}

let instance: (Dexie & M3EDatabase) | null = null;

/** Lazy so the module can be imported during SSR without touching indexedDB. */
export function getDb(): Dexie & M3EDatabase {
  if (typeof window === 'undefined') throw new Error('getDb() is browser-only');
  if (!instance) {
    const db = new Dexie('m3e-studio') as Dexie & M3EDatabase;
    db.version(1).stores({ themes: '++id, name, createdAt' });
    instance = db;
  }
  return instance;
}

export async function listThemes(): Promise<StoredTheme[]> {
  if (typeof window === 'undefined') return [];
  try {
    return await getDb().themes.orderBy('createdAt').reverse().toArray();
  } catch {
    return []; // private mode / storage blocked → behave like empty
  }
}

export async function saveTheme(name: string, search: string, seed: string): Promise<void> {
  await getDb().themes.add({ name, search, seed, createdAt: Date.now() });
}

export async function deleteTheme(id: number): Promise<void> {
  await getDb().themes.delete(id);
}
